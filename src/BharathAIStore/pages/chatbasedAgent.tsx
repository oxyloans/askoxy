// src/pages/chatbasedAgent.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import axios, { AxiosHeaders } from "axios";
import { message, Modal } from "antd";
import { Send, Square, Mic, ArrowLeft } from "lucide-react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import BASE_URL from "../../Config";
import MarkdownRenderer from "../../GenOxy/components/MarkdownRenderer";

/** ---------- Types ---------- */
type APIRole = "user" | "assistant";
type APIMessage = { role: APIRole; content: string };
type ChatMessage = { role: "user" | "assistant"; content: string };

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
  resultIndex: number;
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
  message?: string;
};

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: any) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}
interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

type RemoteCard = { title?: string; description?: string };
type ConversationPayload = {
  agentId?: string;
  agentName?: string;
  headerTitle?: string;
  subtitle?: string;
  composerHint?: string;
  imageUrl?: string;
  profileUrl?: string;
  overallRating?: number | string;
  rating?: number | string;
  description?: string;
  ratingCount?: number | string;
  reviews?: number | string;
  categories?: RemoteCard[];
  agentTypes?: RemoteCard[];
  cards?: RemoteCard[];
  conStarter1?: string;
  conStarter2?: string;
  conStarter3?: string;
  conStarter4?: string;
  mainProblemSolved?: string;
  acheivements?: string;
  targetUser?: string;
  instructions?: string;
};

type AssistantInfo = {
  agentId: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  rating?: number | null;
  ratingCount?: number | null;
  cards: RemoteCard[];
  starters: string[];
  composerHint?: string;
  description?: string;
};

// ✅ Chat ALWAYS hits this main agent (as per your current flow)
const MAIN_AGENT_ID = "e2e73b71-623d-497a-ac9f-4efe398c90d2";
const MAIN_ASSISTANT_ID = "asst_WRGXjvzFTMUumTJVb9m4hH0T";

/** ---------- Auth & helpers ---------- */
const getAuthHeaders = () => {
  const raw =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    "";
  const t = raw.trim();
  if (!t) return {};
  const value = t.toLowerCase().startsWith("bearer ") ? t : `Bearer ${t}`;
  return { Authorization: value };
};

const safeNumber = (v: any): number | null => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const safeAgentIdFromResponse = (data: any): string | null =>
  data?.agentId ||
  data?.id ||
  data?.data?.agentId ||
  data?.data?.id ||
  data?.result?.agentId ||
  data?.payload?.agentId ||
  null;

/** fetch conversation / UI data (dynamic) */
const getConversationStarters = async (agentIdParam: string) => {
  const response = await axios.get(
    `${BASE_URL}/ai-service/agent/getConversation/${agentIdParam}`,
    { headers: { ...getAuthHeaders() } }
  );
  return response.data;
};

/** user history (same API used by Assistant Details) */
const fetchUserHistory = async (userIdParam: string, agentIdParam: string) => {
  const { data } = await axios.get(
    `${BASE_URL}/ai-service/agent/getUserHistory/${userIdParam}/${agentIdParam}`,
    { headers: { ...getAuthHeaders() } }
  );
  return data;
};

const normalizeMessages = (raw: any): ChatMessage[] => {
  if (!raw) return [];
  let arr = raw;
  if (typeof arr === "string") {
    try {
      arr = JSON.parse(arr);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(arr)) return [];
  const prelim: ChatMessage[] = (arr as any[])
    .map((m: any) => {
      const role: ChatMessage["role"] =
        m?.role === "assistant" ? "assistant" : "user";
      const content = String(m?.content ?? m?.text ?? "").trim();
      return { role, content };
    })
    .filter((m) => m.content.length > 0);
  const out: ChatMessage[] = [];
  for (const m of prelim) {
    const last = out[out.length - 1];
    if (last && last.role === m.role && last.content === m.content) continue;
    out.push(m);
  }
  return out;
};

const ChatBasedAgent: React.FC = () => {
  const { agentId: agentIdParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isStopped = useRef(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const initialRouteAgentId = (agentIdParam && String(agentIdParam)) || "";
  const [currentAgentId, setCurrentAgentId] =
    useState<string>(initialRouteAgentId);
  const [userId] = useState<string | null>(() =>
    localStorage.getItem("userId")
  );

  const heroInputRef = useRef<HTMLTextAreaElement | null>(null);
  const chatInputRef = useRef<HTMLTextAreaElement | null>(null);

  const ONE_LINE_PX = 24;
  const [autoGrow, setAutoGrow] = useState(true);

  const resetComposerHeight = () => {
    if (heroInputRef.current) {
      heroInputRef.current.style.height = `${ONE_LINE_PX}px`;
      heroInputRef.current.style.overflowY = "hidden";
    }
    if (chatInputRef.current) {
      chatInputRef.current.style.height = `${ONE_LINE_PX}px`;
      chatInputRef.current.style.overflowY = "hidden";
    }
  };

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el || !autoGrow) return; // ⬅️ only when autoGrow is true
    el.style.height = "auto";
    const max = 160;
    const next = Math.min(el.scrollHeight, max);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
  };

  const [isRecording, setIsRecording] = useState(false);

  const [isXs, setIsXs] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 640px)").matches
      : false
  );

  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognitionRef.current = recognition;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) transcript += result[0].transcript + " ";
      }
      if (transcript.trim()) {
        setInput((prev) => (prev.trim() + " " + transcript.trim()).trim());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      alert("Voice input failed: " + event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      // ✅ Like ChatGPT: After voice ends, focus input and ensure transcript is in input
      const inputEl = document.querySelector(
        'textarea[placeholder*="Ask anything"]'
      ) as HTMLTextAreaElement;
      if (inputEl) {
        inputEl.focus();
      }
    };

    recognition.start();
  };

  const handleStop = () => {
    isStopped.current = true;
    setLoading(false);
  };

  const [assistant, setAssistant] = useState<AssistantInfo | null>(null);

  /** step-by-step slots (unchanged) */
  const [slots, setSlots] = useState({
    agentName: "",
    description: "",
    acheivements: "",
    targetUser: "",
    instructions: "",
    conStarter1: "",
    conStarter2: "",
    conStarter3: "",
    conStarter4: "",
  });

  const stepToField: (keyof typeof slots)[] = [
    "agentName",
    "description",
    "acheivements",
    "targetUser",
    "instructions",
    "conStarter1",
    "conStarter2",
  ];
  const [stepIndex, setStepIndex] = useState<number>(0);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // unified loader flag
  const [creating, setCreating] = useState(false); // parent creation flag
  const [savingStep, setSavingStep] = useState(false); // draft save flag
  const [initializing, setInitializing] = useState(false); // first UI load
  const endRef = useRef<HTMLDivElement | null>(null);

  // Conversations (one-row modal like requested)
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyRows, setHistoryRows] = useState<
    { id: string; title: string; createdAt: number }[]
  >([]);
  const [historyById, setHistoryById] = useState<Record<string, ChatMessage[]>>(
    {}
  );

  const currentPath = `${location.pathname}${location.search || ""}`;
  const needsRedirect = !userId;
  const isComplete = stepIndex >= stepToField.length;

  const [topOffset, setTopOffset] = useState<string>(
    "env(safe-area-inset-top, 0px)"
  );
  const [topBarZ, setTopBarZ] = useState<number>(9999);

  useLayoutEffect(() => {
    const hostHeader =
      (document.querySelector("[data-app-header]") as HTMLElement) ||
      (document.querySelector(".app-header") as HTMLElement) ||
      (document.querySelector("header[role='banner']") as HTMLElement);

    const update = () => {
      const h = hostHeader?.getBoundingClientRect().height || 0;
      setTopOffset(`calc(env(safe-area-inset-top, 0px) + ${h}px)`);

      // Put our bar *below* the host header in stacking order (prevents overlap),
      // else use a safe default.
      const z = hostHeader
        ? parseInt(getComputedStyle(hostHeader).zIndex || "0", 10)
        : 0;
      setTopBarZ(Number.isFinite(z) && z > 1 ? z - 1 : 9_999);
    };

    update();

    // React to header size changes (collapsing/expanding headers)
    const ro = hostHeader ? new ResizeObserver(update) : null;
    if (hostHeader && ro) ro.observe(hostHeader);

    // Also recalc on window resize (and orientation changes on mobile)
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!autoGrow) return;
    // Resize both composers defensively; only the mounted one will take effect.
    autoResize(heroInputRef.current);
    autoResize(chatInputRef.current);
  }, [input, autoGrow]);

  // Loader messages
  const loadingMessages: string[] = [
    "Thinking longer for a better answer",
    "Analyzing details to improve accuracy",
    "Cross-checking facts for you",
    "Almost there — refining the reply",
  ];
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  useEffect(() => {
    const busy = loading || creating || savingStep || initializing;
    if (!busy) return;
    const t = setInterval(() => {
      setLoadingMsgIdx((p) => (p + 1) % loadingMessages.length);
    }, 3200);
    return () => clearInterval(t);
  }, [loading, creating, savingStep, initializing]);

  useEffect(() => {
    if (needsRedirect) {
      try {
        sessionStorage.setItem("redirectPath", currentPath);
        sessionStorage.setItem("fromAISTore", "true");
      } catch {}
    }
  }, [needsRedirect, currentPath]);

  /** Load all dynamic UI from API (no static content) */
  useEffect(() => {
    if (needsRedirect) return;
    (async () => {
      setInitializing(true);
      try {
        const refId = currentAgentId || MAIN_AGENT_ID;
        const data = await getConversationStarters(refId);
        const row: ConversationPayload =
          (Array.isArray(data) && data.length ? data[0] : data) || {};

        const cardsArr: RemoteCard[] =
          row.categories || row.agentTypes || row.cards || [];

        const starters = [
          row.conStarter1,
          row.conStarter2,
          row.conStarter3,
          row.conStarter4,
        ].filter((v): v is string => !!(v && String(v).trim()));

        setAssistant({
          agentId: String(row.agentId || refId),
          title:
            (row.headerTitle && String(row.headerTitle)) ||
            (row.agentName && String(row.agentName)) ||
            undefined,
          subtitle: row.subtitle ? String(row.subtitle) : undefined,
          imageUrl:
            (row.profileUrl as any) || (row.imageUrl as any) || undefined,
          rating:
            safeNumber(row.overallRating) ?? safeNumber(row.rating) ?? null,
          ratingCount:
            safeNumber(row.ratingCount) ?? safeNumber(row.reviews) ?? null,
          cards: cardsArr,
          starters,
          composerHint: row.composerHint ? String(row.composerHint) : undefined,
          description: row.description ? String(row.description) : undefined, // <-- add this
        });

        setSlots((prev) => ({
          ...prev,
          conStarter1: "", // user will newly provide
          conStarter2: "", // user will newly provide
          conStarter3: "",
          conStarter4: "",
        }));
      } catch (e: any) {
        console.warn("Failed to fetch conversation data:", e?.message || e);
      } finally {
        setInitializing(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsRedirect, currentAgentId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const buildMessageHistory = (msgs: ChatMessage[]): APIMessage[] =>
    (msgs || []).map<APIMessage>((m) => ({
      role: m.role === "assistant" ? "assistant" : ("user" as APIRole),
      content: m.content,
    }));

  /** AGENT CHAT — uses MAIN agent id always */
  const postAgentChat = async (agentId: string, history: APIMessage[]) => {
    if (!agentId) throw new Error("agentId missing for chat call");
    const headers = new AxiosHeaders();
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");
    const auth = getAuthHeaders();
    if (auth.Authorization) headers.set("Authorization", auth.Authorization);

    const { data } = await axios.post(
      `${BASE_URL}/ai-service/agent/agentChat`,
      { agentId, userId, messageHistory: history },
      { headers }
    );
    return data;
  };

  /** Create parent agent once (first user msg becomes headerTitle) */
  const createParentAgent = useCallback(
    async (headerTitle: string): Promise<string> => {
      setCreating(true);
      try {
        const payload = {
          agentId: "",
          headerTitle,
          userId,
          mainAgentId: MAIN_AGENT_ID,
          mainAssistantId: MAIN_ASSISTANT_ID,
        };

        const { data } = await axios.patch(
          `${BASE_URL}/ai-service/agent/createAgentPublish`,
          payload,
          {
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
          }
        );

        const newId = safeAgentIdFromResponse(data);
        if (!newId)
          throw new Error("AgentId not found in createAgentPublish response");

        setCurrentAgentId(newId);
        return newId;
      } catch (e: any) {
        message.error(
          e?.response?.data?.message || e?.message || "Failed to create agent."
        );
        throw e;
      } finally {
        setCreating(false);
      }
    },
    [userId]
  );

  const persistDraft = useCallback(
    async (agentId: string) => {
      setSavingStep(true);
      try {
        const {
          agentName,
          description,
          acheivements,
          targetUser,
          instructions,
          conStarter1,
          conStarter2,
        } = slots;

        await axios.patch(
          `${BASE_URL}/ai-service/agent/createAgentPublish`,
          {
            agentId,
            userId,
            mainAgentId: MAIN_AGENT_ID,
            mainAssistantId: MAIN_ASSISTANT_ID,
            agentName: agentName || null,
            description: description || null,
            acheivements: acheivements || null,
            targetUser: targetUser || null,
            instructions: instructions?.trim() ? instructions : null, // ✅ Force null when empty
            conStarter1: conStarter1 || null,
            conStarter2: conStarter2 || null,
          },
          {
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
          }
        );
      } catch (e: any) {
        message.error(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to save agent step."
        );
      } finally {
        setSavingStep(false);
      }
    },
    [slots, userId]
  );

  /** Consume user message as step value, then save */
  const captureUserStepAndSave = useCallback(
    async (userText: string) => {
      let ensureAgentId = currentAgentId;

      if (!ensureAgentId) {
        try {
          ensureAgentId = await createParentAgent(userText || "Agent");
          setCurrentAgentId(ensureAgentId);
        } catch {
          return;
        }
        return; // first message only creates parent; next msg starts fields
      }

      if (stepIndex >= stepToField.length) return;

      const field = stepToField[stepIndex];
      setSlots((prev) => ({ ...prev, [field]: userText }));

      setTimeout(() => {
        persistDraft(ensureAgentId!);
      }, 0);

      setStepIndex((i) => i + 1);
    },
    [currentAgentId, stepIndex, stepToField, createParentAgent, persistDraft]
  );

  /** Send chat (UI parity + loader overlay) */
  const sendMessage = useCallback(
    async (prompt?: string) => {
      if (needsRedirect) return;

      const content = (prompt ?? input).trim();
      if (!content || loading) return;

      await captureUserStepAndSave(content);

      const userMsg: ChatMessage = { role: "user", content };
      setMessages((prev) => [...prev, userMsg]);
      if (!prompt) setInput("");
      setAutoGrow(true); // default back to normal typing behavior
      setTimeout(() => {
        autoResize(heroInputRef.current);
        autoResize(chatInputRef.current);
      }, 0);

      // 🔔 Set loading BEFORE calling API so typing/loader shows immediately
      setLoading(true);

      try {
        const apiHistory = buildMessageHistory([...messages, userMsg]);
        const resp = await postAgentChat(MAIN_AGENT_ID, apiHistory);

        let answer = "";
        if (typeof resp === "string") answer = resp;
        else if (resp && typeof resp === "object")
          answer = resp.answer ?? resp.content ?? resp.text ?? "";

        const assistantMsg: ChatMessage = {
          role: "assistant",
          content: String(answer || "").trim(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (e: any) {
        message.error(
          e?.response?.data?.message || e?.message || "Failed to contact agent."
        );
      } finally {
        setLoading(false);
      }
    },
    [needsRedirect, input, loading, messages, captureUserStepAndSave]
  );

  /** ----- Conversations (one-row modal) ----- */
  const openConversations = async () => {
    if (!userId) return;
    const targetAgentId = currentAgentId || MAIN_AGENT_ID;

    try {
      setInitializing(true);
      const historyData = await fetchUserHistory(userId, targetAgentId);
      const rows: { id: string; title: string; createdAt: number }[] = [];
      const map: Record<string, ChatMessage[]> = {};
      for (let i = 0; i < (historyData?.length || 0); i++) {
        const h = historyData[i];
        const hid = String(h?.id ?? h?.historyId ?? `${Date.now()}_${i}`);
        const msgs = normalizeMessages(
          h?.messages ?? h?.messageHistory ?? h?.history
        );
        map[hid] = msgs;

        const lastUser = [...msgs].reverse().find((m) => m.role === "user");
        const title = (lastUser?.content || "Untitled")
          .replace(/\s+/g, " ")
          .slice(0, 60);
        const createdAt = new Date(h?.createdAt ?? Date.now()).getTime() - i;
        rows.push({ id: hid, title, createdAt });
      }
      rows.sort((a, b) => b.createdAt - a.createdAt);
      setHistoryById(map);
      setHistoryRows(rows);
      setShowHistoryModal(true);
    } catch (e) {
      message.error("Failed to load conversations");
    } finally {
      setInitializing(false);
    }
  };

  const loadConversation = (hid: string) => {
    const msgs = historyById[hid] || [];
    setMessages(msgs);
    setShowHistoryModal(false);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
  };

  /** ---------- NEW: Back action (clear payload + navigate) ---------- */
  const clearPayloadAndNavigateBack = useCallback(async () => {
    try {
      if (currentAgentId) {
        await axios.patch(
          `${BASE_URL}/ai-service/agent/createAgentPublish`,
          {
            agentId: currentAgentId,
            userId,
            mainAgentId: MAIN_AGENT_ID,
            mainAssistantId: MAIN_ASSISTANT_ID,
            // ⬇️ Clear all editable fields
            headerTitle: "",
            agentName: "",
            description: "",
            acheivements: "",
            targetUser: "",
            instructions: "",
            conStarter1: "",
            conStarter2: "",
            conStarter3: "",
            conStarter4: "",
          },
          {
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (e) {
      // non-blocking: still navigate back
      console.warn("Failed to clear draft payload, continuing navigation.");
    } finally {
      // reset local state too
      setSlots({
        agentName: "",
        description: "",
        acheivements: "",
        targetUser: "",
        instructions: "",
        conStarter1: "",
        conStarter2: "",
        conStarter3: "",
        conStarter4: "",
      });
      setStepIndex(0);
      setCurrentAgentId("");
      setMessages([]);
      setInput("");
      navigate("/main/chatbasedagent");
    }
  }, [currentAgentId, navigate, userId]);

  /** ---------- UI ---------- */
  if (needsRedirect) {
    return (
      <Navigate
        to={`/whatsappregister?primaryType=AGENT&returnTo=${encodeURIComponent(
          currentPath
        )}`}
        replace
      />
    );
  }

  const showHero = messages.length === 0;
  const starters = assistant?.starters ?? [];
  const cards = assistant?.cards ?? [];

  const busy = loading || creating || savingStep || initializing;

  /** ----- Assistant typing bubble (shows inside stream while loading) ----- */
  const TypingBubble = () => (
    <div className="text-left">
      <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-900 rounded-2xl px-4 py-3">
        <span className="w-2 h-2 rounded-full bg-gray-600 animate-typing"></span>
        <span className="w-2 h-2 rounded-full bg-gray-600 animate-typing animation-delay-200"></span>
        <span className="w-2 h-2 rounded-full bg-gray-600 animate-typing animation-delay-400"></span>
        <span className="ml-2 text-xs text-gray-600">Updating....</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 flex flex-col">
      {/* ===== Global animation styles (as provided) ===== */}
      <style>
        {`
    /* Typing dots animation */
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
      30% { transform: translateY(-10px); opacity: 1; }
    }
    .animate-typing {
      animation: typing 1.4s infinite ease-in-out;
    }

    /* Pulse wave animation */
    @keyframes pulse-wave {
      0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
      50% { transform: scaleY(1); opacity: 1; }
    }
    .animate-pulse-wave {
      animation: pulse-wave 1.2s infinite ease-in-out;
    }

    /* Morphing animation */
    @keyframes morph {
      0%, 100% { transform: scale(1); border-radius: 50%; }
      50% { transform: scale(1.5); border-radius: 30%; }
    }
    .animate-morph {
      animation: morph 1s infinite ease-in-out;
    }

    /* Spinner dots */
    @keyframes spin-dots {
      0% { opacity: 1; transform: scale(1); }
      50%, 100% { opacity: 0.3; transform: scale(0.5); }
    }
    .animate-spin-dots {
      animation: spin-dots 1.2s infinite ease-in-out;
    }

    /* Glowing pulse */
    @keyframes glow-pulse {
      0%, 100% { 
        transform: scale(1); 
        opacity: 1;
        box-shadow: 0 0 0 0 currentColor;
      }
      50% { 
        transform: scale(1.2); 
        opacity: 0.8;
        box-shadow: 0 0 10px 3px currentColor;
      }
    }
    .animate-glow-pulse {
      animation: glow-pulse 1.5s infinite ease-in-out;
    }

    /* Delay classes */
    .animation-delay-150 { animation-delay: 0.15s; }
    .animation-delay-200 { animation-delay: 0.2s; }
    .animation-delay-300 { animation-delay: 0.3s; }
    .animation-delay-400 { animation-delay: 0.4s; }
    .animation-delay-450 { animation-delay: 0.45s; }
    .animation-delay-600 { animation-delay: 0.6s; }
        `}
      </style>

      {/* ---------- FIXED BACK BUTTON (only after first message) ---------- */}
      {!showHero && (
        <>
          <div
            className="fixed border-b border-gray-200 bg-white/95 backdrop-blur z-[9999]"
            style={{
              top: "80px", // keep your layout offset
              height: "56px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              className="w-full max-w-7xl h-full px-4 sm:px-6 flex items-center"
              role="toolbar"
              aria-label="Chat header"
            >
              <button
                type="button"
                onClick={clearPayloadAndNavigateBack}
                className="flex items-center gap-2 text-base sm:text-lg text-black hover:text-purple-600 transition"
              >
                <ArrowLeft className="h-5 w-5 shrink-0" />
                <span className="truncate hidden md:inline">
                  {assistant?.title || "Assistant"}
                </span>
              </button>
            </div>
          </div>

          {/* Spacer to keep content below fixed header */}
          <div style={{ height: "56px" }} />
        </>
      )}

      {/* spacer to prevent content from hiding behind fixed bar */}
      {showHero && (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-56px)] w-full relative bg-white overflow-hidden">
          {/* ---------- HERO CONTENT ---------- */}
          <div className="max-w-5xl w-full px-4 text-center pb-32 sm:pb-40">
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              {assistant?.imageUrl ? (
                <img
                  src={assistant.imageUrl}
                  alt="Agent"
                  className="w-28 h-28 rounded-full object-cover shadow"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-200" />
              )}
            </div>

            {/* Title */}
            {assistant?.title && (
              <h1 className="text-2xl md:text-3xl font-bold text-purple-900">
                {assistant.title}
              </h1>
            )}

            {/* Subtitle */}
            {assistant?.subtitle && (
              <p className="text-sm md:text-base font-semibold text-gray-900 mt-2 mb-6">
                {assistant.subtitle}
              </p>
            )}

            {assistant?.description && (
              <p className="text-sm md:text-base font-semibold text-gray-900 mt-1 mb-6 px-2 sm:px-10 leading-relaxed">
                {assistant.description}
              </p>
            )}

            {/* Cards grid */}
            {assistant?.cards?.length ? (
              <div className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
                  {assistant.cards.slice(0, 4).map((c, idx) => (
                    <div
                      key={idx}
                      className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white text-left w-full"
                    >
                      {c.title && (
                        <div className="font-semibold text-gray-900 mb-2">
                          {c.title}
                        </div>
                      )}
                      {c.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {c.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* ---------- Starters grid ---------- */}
            {assistant?.starters?.length ? (
              <div className="w-full mt-6 flex justify-center">
                {(() => {
                  // Collect and sanitize starters
                  const visiblePrompts: string[] = (assistant.starters || [])
                    .map((s) => String(s || "").trim())
                    .filter((s) => s.length > 0);

                  // ✅ Show up to 4 total always
                  const countToShow = Math.min(4, visiblePrompts.length);
                  const promptsToShow: string[] = visiblePrompts.slice(
                    0,
                    countToShow
                  );

                  // ✅ Responsive columns
                  // → Web: show in one row (max 4 columns)
                  // → Mobile: force 2×2 grid
                  const colClass =
                    "grid gap-3 w-full max-w-5xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

                  return (
                    <div
                      className={`grid gap-3 ${colClass}`}
                      style={{
                        gridTemplateColumns: isXs
                          ? "repeat(2, minmax(0, 1fr))"
                          : undefined,
                      }}
                    >
                      {promptsToShow.map((prompt: string, idx: number) => (
                        <button
                          key={`${prompt}-${idx}`}
                          onClick={() => {
                            // Put the prompt in the textarea
                            setInput(prompt);

                            // ✅ Re-enable auto-grow for programmatic fills
                            setAutoGrow(true);

                            // ✅ Resize whichever composer is on screen
                            setTimeout(() => {
                              if (showHero) {
                                autoResize(heroInputRef.current);
                                heroInputRef.current?.focus();
                              } else {
                                autoResize(chatInputRef.current);
                                chatInputRef.current?.focus();
                              }
                            }, 0);
                          }}
                          className="w-full p-4 rounded-lg shadow bg-white hover:bg-gray-50 transition text-gray-700 text-left text-sm"
                          style={{ WebkitTapHighlightColor: "transparent" }}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>
            ) : null}
          </div>
          {/* ---------- Composer (fixed bottom + centered alignment) ---------- */}
          <div className="fixed left-1/2 -translate-x-1/2 bottom-6 w-full max-w-4xl px-4">
            <div className="border rounded-2xl bg-white shadow-lg flex items-center p-2">
              <textarea
                ref={heroInputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  autoResize(heroInputRef.current); // will no-op if autoGrow=false
                }}
                onInput={(e) => autoResize(e.currentTarget)} // same gate
                onKeyDown={async (e) => {
                  // Turn on auto-grow only when user starts typing (not arrows/ctrl etc.)
                  if (
                    !autoGrow &&
                    (e.key.length === 1 ||
                      e.key === "Backspace" ||
                      e.key === "Delete" ||
                      e.key === "Paste")
                  ) {
                    setAutoGrow(true);
                    // after enabling, resize once to fit current content
                    setTimeout(() => autoResize(heroInputRef.current), 0);
                  }
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    await sendMessage();
                  }
                }}
                placeholder={
                  assistant?.composerHint ||
                  "Choose one AI role to create agent…"
                }
                className="flex-1 outline-none px-4 py-3 text-sm md:text-base rounded-xl resize-none overflow-hidden"
                rows={1}
                style={{ minHeight: ONE_LINE_PX, maxHeight: 160 }}
              />

              {/* Send Button */}
              <button
                onClick={() => sendMessage()}
                disabled={busy || !input.trim()}
                className="ml-2 flex items-center justify-center rounded-full w-11 h-11 bg-white text-gray-900 shadow-sm border border-gray-200 disabled:opacity-50 transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ---------- CHAT PANEL ---------- */}
      {!showHero && (
        <div className="max-w-4xl mx-auto w-full px-4 pb-28 pt-4 relative">
          {/* messages list */}
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <div
                  className={`inline-block rounded-2xl px-4 py-3 ${
                    m.role === "user"
                      ? "bg-white text-purple-600 shadow-sm border border-gray-200"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <MarkdownRenderer content={m.content} />
                </div>
              </div>
            ))}

            {/* ✅ Assistant typing bubble shows INSIDE the stream while waiting */}
            {loading && <TypingBubble />}

            <div ref={endRef} />
          </div>

          {/* ===== Composer (updated clean style) ===== */}
          <div className="fixed bottom-0 left-0 right-0 flex justify-center px-3 sm:px-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] z-40">
            <div className="w-full max-w-4xl flex items-center border border-gray-200 bg-white rounded-2xl shadow-sm px-3 py-2 sm:py-3">
              {/* Middle: Textarea */}
              <textarea
                ref={chatInputRef}
                value={input}
                onChange={(e) => {
                  if (!loading) {
                    setInput(e.target.value);
                    autoResize(chatInputRef.current); // gated by autoGrow
                  }
                }}
                onInput={(e) => !loading && autoResize(e.currentTarget)}
                onKeyDown={async (e) => {
                  if (
                    !autoGrow &&
                    (e.key.length === 1 ||
                      e.key === "Backspace" ||
                      e.key === "Delete" ||
                      e.key === "Paste")
                  ) {
                    setAutoGrow(true);
                    setTimeout(() => autoResize(chatInputRef.current), 0);
                  }
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!loading && input.trim()) await sendMessage();
                  }
                }}
                placeholder={assistant?.composerHint || "Ask anything…"}
                rows={1}
                className="flex-1 mx-3 bg-transparent outline-none resize-none text-sm sm:text-base text-gray-800 placeholder-gray-400 overflow-hidden"
                style={{ minHeight: ONE_LINE_PX, maxHeight: 160 }}
                disabled={loading}
              />

              {/* Right: Mic + Send icons */}
              <div className="flex items-center gap-2">
                {/* Mic */}
                {isRecording ? (
                  <button
                    onClick={handleToggleVoice}
                    className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full animate-pulse"
                    title="Stop"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleToggleVoice}
                    className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-purple-600 transition"
                    title="Voice"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                )}

                {/* Send */}
                <button
                  onClick={async () => {
                    if (!input.trim()) return;
                    await sendMessage();
                  }}
                  disabled={loading || input.trim().length === 0}
                  className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-purple-600 disabled:opacity-40 transition"
                  title="Send"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBasedAgent;
