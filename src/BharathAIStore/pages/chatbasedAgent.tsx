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
type SpeechRecognitionErrorEvent = Event & { error: string; message?: string };

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

// ✅ constants
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

/** APIs */
const getConversationStarters = async (agentIdParam: string) => {
  const response = await axios.get(
    `${BASE_URL}/ai-service/agent/getConversation/${agentIdParam}`,
    { headers: { ...getAuthHeaders() } }
  );
  return response.data;
};

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

// Force-light CSS so the UI looks identical even when OS is in dark mode
const FORCE_LIGHT_CSS = `
/* Base always-light */
:root, html, body, #root { background:#ffffff !important; color-scheme: light !important; }
html, body { color:#111827 !important; } /* gray-900 */
* { border-color:#e5e7eb !important; }   /* gray-200 */
input, textarea, select, button {
  color-scheme: light !important;
  background-color:#ffffff !important;
  color:#111827 !important;
}
::placeholder { color:#6b7280 !important; opacity:1; } /* gray-500 */

/* Hard override when the browser requests dark colors */
@media (prefers-color-scheme: dark) {
  :root, html, body, #root { background:#ffffff !important; color:#111827 !important; }
  .bg-white        { background-color:#ffffff !important; }
  .bg-gray-50      { background-color:#fafafa !important; }
  .bg-gray-100     { background-color:#f3f4f6 !important; }
  .text-gray-900   { color:#111827 !important; }
  .text-gray-800   { color:#1f2937 !important; }
  .text-gray-700   { color:#374151 !important; }
  .border-gray-200 { border-color:#e5e7eb !important; }
  input, textarea, select, button {
    background-color:#ffffff !important;
    color:#111827 !important;
  }
  ::placeholder { color:#6b7280 !important; }
}
`;


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

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el || !autoGrow) return;
    el.style.height = "auto";
    const max = 160;
    const next = Math.min(el.scrollHeight, max);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
  };

  const [isRecording, setIsRecording] = useState(false);

  const [isXs] = useState<boolean>(() =>
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
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };
  
useEffect(() => {
  document.documentElement.classList.remove("dark");
  (document.documentElement as HTMLElement).style.colorScheme = "light";

  // Inject meta hints to stop UA auto-darkening/inversion
  const meta1 = document.createElement("meta");
  meta1.name = "color-scheme";
  meta1.content = "light";
  const meta2 = document.createElement("meta");
  meta2.name = "supported-color-schemes";
  meta2.content = "light";
  document.head.appendChild(meta1);
  document.head.appendChild(meta2);

  return () => {
    document.head.removeChild(meta1);
    document.head.removeChild(meta2);
  };
}, []);


  const [assistant, setAssistant] = useState<AssistantInfo | null>(null);

  /** step-by-step slots */
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
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [savingStep, setSavingStep] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyRows, setHistoryRows] = useState<
    { id: string; title: string; createdAt: number }[]
  >([]);
  const [historyById, setHistoryById] = useState<Record<string, ChatMessage[]>>(
    {}
  );

  const currentPath = `${location.pathname}${location.search || ""}`;
  const needsRedirect = !userId;

  useLayoutEffect(() => {
    // reserve space under any external app header if present
    const hostHeader =
      (document.querySelector("[data-app-header]") as HTMLElement) ||
      (document.querySelector(".app-header") as HTMLElement) ||
      (document.querySelector("header[role='banner']") as HTMLElement);
    const update = () => {
      // no-op but keeps behavior consistent for your shell layout
    };
    update();
    const ro = hostHeader ? new ResizeObserver(update) : null;
    if (hostHeader && ro) ro.observe(hostHeader);
    return () => ro?.disconnect();
  }, []);

  useEffect(() => {
    if (!autoGrow) return;
    autoResize(heroInputRef.current);
    autoResize(chatInputRef.current);
  }, [input, autoGrow]);

  // rotating loading captions (unchanged)
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

  /** Load UI payload */
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
          description: row.description ? String(row.description) : undefined,
        });
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

  /** Chat call */
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

  /** Create parent agent once */
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

  /** Draft save (keeps nulls for empty) */
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
            instructions: instructions?.trim() ? instructions : null,
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
        return; // next message starts fields
      }

      if (stepIndex >= stepToField.length) return;

      const field = stepToField[stepIndex];
      setSlots((prev) => ({ ...prev, [field]: userText }));

      setTimeout(() => {
        persistDraft(ensureAgentId!);
      }, 0);

      // ✅ use the single setter
      setStepIndex((i) => i + 1);
    },
    [currentAgentId, stepIndex, stepToField, createParentAgent, persistDraft]
  );

  /** Send message */
  const sendMessage = useCallback(
    async (prompt?: string) => {
      if (needsRedirect) return;

      const content = (prompt ?? input).trim();
      if (!content || loading) return;

      await captureUserStepAndSave(content);

      const userMsg: ChatMessage = { role: "user", content };
      setMessages((prev) => [...prev, userMsg]);
      if (!prompt) setInput("");
      setAutoGrow(true);
      setTimeout(() => {
        autoResize(heroInputRef.current);
        autoResize(chatInputRef.current);
      }, 0);

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

  /** ----- Conversations modal (unchanged) ----- */
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
    } catch {
      message.error("Failed to load conversations");
    } finally {
      setInitializing(false);
    }
  };

  const navigateBackAndNullifyDraft = useCallback(async () => {
    try {
      if (currentAgentId) {
        await axios.patch(
          `${BASE_URL}/ai-service/agent/createAgentPublish`,
          {
            agentId: currentAgentId,
            userId,
            mainAgentId: MAIN_AGENT_ID,
            mainAssistantId: MAIN_ASSISTANT_ID,
            // IMPORTANT: send NULLs, not empty strings
            headerTitle: null,
            agentName: null,
            description: null,
            acheivements: null,
            targetUser: null,
            instructions: null,
            conStarter1: null,
            conStarter2: null,
            conStarter3: null,
            conStarter4: null,
          },
          {
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch {
      // even if the patch fails, still go back
    } finally {
      if (window.history.length > 1) navigate(-1);
      else navigate("/main/chatbasedagent", { replace: true });
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

  /** Typing bubble */
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
    <div className="min-h-screen w-full flex flex-col bg-white text-gray-900">
      {/* animations */}
      <style>
        {`
        @keyframes typing { 0%,60%,100%{transform:translateY(0);opacity:.7} 30%{transform:translateY(-10px);opacity:1} }
        .animate-typing{animation:typing 1.4s infinite ease-in-out}
        .animation-delay-200{animation-delay:.2s}
        .animation-delay-400{animation-delay:.4s}
      `}

        {`
  ${FORCE_LIGHT_CSS}

/* existing animations… */
@keyframes typing { 0%,60%,100%{transform:translateY(0);opacity:.7} 30%{transform:translateY(-10px);opacity:1} }
.animate-typing{animation:typing 1.4s infinite ease-in-out}
.animation-delay-200{animation-delay:.2s}
.animation-delay-400{animation-delay:.4s}
  `}
      </style>

      {/* ---------- HEADER (opaque now) ---------- */}
      {!showHero && (
        <>
          <div
            className="fixed border-b border-gray-200 bg-white backdrop-blur z-[9999]"
            style={{
              top: "80px",
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
                onClick={navigateBackAndNullifyDraft}
                className="flex items-center gap-2 text-base sm:text-lg text-gray-900 hover:text-purple-600 transition"
              >
                <ArrowLeft className="h-5 w-5 shrink-0" />
                <span className="truncate hidden md:inline">
                  {assistant?.title || "Assistant"}
                </span>
              </button>
            </div>
          </div>
          <div style={{ height: "56px" }} />
        </>
      )}

      {/* ---------- HERO ---------- */}
      {showHero && (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-56px)] w-full relative bg-white overflow-hidden">
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

            {/* Cards */}
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

            {/* Starters */}
            {assistant?.starters?.length ? (
              <div className="w-full mt-6 flex justify-center">
                {(() => {
                  const visiblePrompts: string[] = (assistant.starters || [])
                    .map((s) => String(s || "").trim())
                    .filter((s) => s.length > 0);
                  const countToShow = Math.min(4, visiblePrompts.length);
                  const promptsToShow: string[] = visiblePrompts.slice(
                    0,
                    countToShow
                  );
                  const colClass =
                    "grid gap-3 w-full max-w-5xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

                  return (
                    <div className={`grid gap-3 ${colClass}`}>
                      {promptsToShow.map((prompt: string, idx: number) => (
                        <button
                          key={`${prompt}-${idx}`}
                          onClick={() => {
                            setInput(prompt);
                            setAutoGrow(true);
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

          {/* Hero composer */}
          <div className="fixed left-1/2 -translate-x-1/2 bottom-6 w-full max-w-4xl px-4">
            <div className="border border-gray-200 rounded-2xl bg-white shadow-lg flex items-center p-2">
              <textarea
                ref={heroInputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  autoResize(heroInputRef.current);
                }}
                onInput={(e) => autoResize(e.currentTarget)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    await sendMessage();
                  }
                }}
                placeholder={
                  assistant?.composerHint ||
                  "Choose one AI role to create agent…"
                }
                className="flex-1 outline-none px-4 py-3 text-sm md:text-base rounded-xl resize-none overflow-hidden bg-transparent text-gray-900 placeholder-gray-500"
                rows={1}
                style={{ minHeight: ONE_LINE_PX, maxHeight: 160 }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
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

            {loading && <TypingBubble />}
            <div ref={endRef} />
          </div>

          {/* Bottom composer */}
          <div className="fixed bottom-0 left-0 right-0 flex justify-center px-3 sm:px-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] z-40">
            <div className="w-full max-w-4xl flex items-center border border-gray-200 bg-white rounded-2xl shadow-sm px-3 py-2 sm:py-3">
              <textarea
                ref={chatInputRef}
                value={input}
                onChange={(e) => {
                  if (!loading) {
                    setInput(e.target.value);
                    autoResize(chatInputRef.current);
                  }
                }}
                onInput={(e) => !loading && autoResize(e.currentTarget)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!loading && input.trim()) await sendMessage();
                  }
                }}
                placeholder={assistant?.composerHint || "Ask anything…"}
                rows={1}
                className="flex-1 mx-3 bg-transparent outline-none resize-none text-sm sm:text-base text-gray-800 placeholder-gray-500 overflow-hidden"
                disabled={loading}
              />

              <div className="flex items-center gap-2">
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

                <button
                  onClick={async () => {
                    if (!input.trim()) return;
                    await sendMessage();
                  }}
                  disabled={loading || input.trim().length === 0}
                  className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-purple-600 transition"
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
