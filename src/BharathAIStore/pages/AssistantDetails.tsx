import type React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import axios, { AxiosHeaders } from "axios";
import {
  useParams,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { GiElephantHead } from "react-icons/gi";
import { LuPanelLeftClose, LuPanelRightClose } from "react-icons/lu";
import {
  Loader2,
  Send,
  User,
  Mic,
  MessageSquare,
  Copy,
  Share2,
  Volume2,
  Square,
  Pencil,
  Share,
  RefreshCcw,
  LogOut,
  Star as StarIcon,
} from "lucide-react";
import MarkdownRenderer from "../../GenOxy/components/MarkdownRenderer";
import { message, Modal } from "antd";
import BASE_URL from "../../Config";

/** ---------------- Types ---------------- */
interface Assistant {
  id: string;
  name: string;
  description?: string | null;
  profileUrl?: string;
}
type APIRole = "user" | "assistant";
type APIMessage = { role: APIRole; content: string };

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

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
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}

/** ---------------- Auth helpers ---------------- */
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

/** ---------------- constants ---------------- */
/** ---------- constants ---------- */
const SIDEBAR_WIDTH = 240; // px (open)
const SIDEBAR_WIDTH_COLLAPSED = 80; // px (collapsed)
const HEADER_HEIGHT = 56; // px (h-14)
const HISTORY_KEY = (aid: string) => `assistant_history_${aid}`;
const MESSAGES_KEY = (aid: string) => `assistant_messages_${aid}`;
const SIDEBAR_STATE_KEY = "chat_sidebar_open";

/** ========================================================================
 *  Component
 *  ===================================================================== */
const AssistantDetails: React.FC = () => {
  const { id, agentId } = useParams<{ id: string; agentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // user id (from storage)
  const [userId] = useState<string | null>(() =>
    localStorage.getItem("userId")
  );
  const currentPath = `${location.pathname}${location.search || ""}`;
  // ✅ FIXED: Add auth check at the top of the component to redirect unauthenticated users to register/login
  // This ensures that if someone directly accesses the assistant URL without auth, they are redirected properly
  // with redirectPath preserved for return after auth
  useEffect(() => {
    if (!userId) {
      // Set the current full path as redirectPath for return after auth
      sessionStorage.setItem("redirectPath", currentPath);
      sessionStorage.setItem("fromAISTore", "true"); // Flag for primaryType detection
      window.location.href = "/whatsappregister?primaryType=AGENT"; // Hard redirect to preserve session
      return;
    }
  }, [userId, currentPath]);
  // assistant + chat state
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetchingAssistant, setIsFetchingAssistant] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const isStopped = useRef(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const CHAT_KEY = (aid: string, hid: string) => `assistant_chat_${aid}_${hid}`;
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);

  // prompts (starters)
  const [prompts, setPrompts] = useState<string[]>([]);
  const [isXs, setIsXs] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 640px)").matches
      : false
  );

  const visiblePrompts = useMemo(
    () =>
      (prompts || [])
        .filter(Boolean)
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    [prompts]
  );
  const shownPrompts = useMemo(
    () => (isXs ? visiblePrompts.slice(0, 2) : visiblePrompts.slice(0, 4)),
    [isXs, visiblePrompts]
  );

  // sidebar + history
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem(SIDEBAR_STATE_KEY);
    return saved ? JSON.parse(saved) : true;
  });

  const [history, setHistory] = useState<
    { id: string; title: string; createdAt: number }[]
  >([]);
  const [historySearch, setHistorySearch] = useState("");

  // Ratings state
  const [overallAvg, setOverallAvg] = useState<number>(0);
  const [overallCount, setOverallCount] = useState<number>(0);
  const [myRating, setMyRating] = useState<number | null>(null);
  const [myComment, setMyComment] = useState<string>("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [loadingRatings, setLoadingRatings] = useState(false);

  // once true, we never allow re-rating
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);

  useEffect(() => {
    const loadHistoryFromApi = async () => {
      if (!id || !agentId || !userId) return;
      try {
        const historyData = await fetchUserHistory(userId, agentId);
        if (Array.isArray(historyData)) {
          const formatted = historyData.map((h: any, idx: number) => ({
            id: `${Date.now()}_${idx}`,
            title: extractTitleFromPrompt(h?.prompt), // ✅ should parse
            createdAt: Date.now() - idx,
          }));

          setHistory(formatted); // uses existing state wiring
        } else {
          setHistory([]);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setHistory([]);
      }
    };

    loadHistoryFromApi();
  }, [id, agentId, userId]);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const saveMessages = useCallback(
    (msgs: ChatMessage[]) => {
      if (!id || !currentChatId) return;
      localStorage.setItem(CHAT_KEY(id, currentChatId), JSON.stringify(msgs));
    },
    [id, currentChatId]
  );

  const saveHistory = useCallback(
    (list: { id: string; title: string; createdAt: number }[]) => {
      if (!id) return;
      localStorage.setItem(HISTORY_KEY(id), JSON.stringify(list));
    },
    [id]
  );

  // responsive: detect xs screens & auto-close sidebar on xs
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const isXsScreen =
        "matches" in e ? e.matches : (e as MediaQueryList).matches;
      setIsXs(isXsScreen);
      if (isXsScreen) setSidebarOpen(false);
    };
    onChange(mql);
    const handler = (e: MediaQueryListEvent) => onChange(e);
    mql.addEventListener
      ? mql.addEventListener("change", handler)
      : mql.addListener(handler);
    return () => {
      mql.removeEventListener
        ? mql.removeEventListener("change", handler)
        : mql.removeListener(handler);
    };
  }, []);

  /** ---------------- global axios auth ---------------- */
  useEffect(() => {
    const id = axios.interceptors.request.use((config) => {
      const auth = getAuthHeaders();
      const h = (config.headers ??= new AxiosHeaders());
      h.set("Accept", "application/json");
      h.set("Content-Type", "application/json");
      if (auth.Authorization) {
        h.set("Authorization", auth.Authorization);
      } else {
        console.warn("[agentChat] No Authorization header on:", config.url);
      }
      return config;
    });
    return () => axios.interceptors.request.eject(id);
  }, []);

  /** ---------------- sidebar persistence ---------------- */
  const saveSidebarState = (open: boolean) => {
    localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(open));
  };
  /** ---------------- APIs ---------------- */
  const getConversationStarters = async (agentIdParam: string) => {
    const response = await axios.get(
      `${BASE_URL}/ai-service/agent/getConversation/${agentIdParam}`,
      {
        headers: { ...getAuthHeaders() },
      }
    );
    return response.data;
  };

  // Detect if numbers look like 0–4 or 1–5, then return a converter to UI 1–5
  const makeToUiConverter = (nums: number[]) => {
    const valid = nums.filter((n) => Number.isFinite(n));
    // Heuristic: if any value >= 5, we assume the backend is already 1..5
    const looksLikeOneToFive = valid.some((n) => n >= 5);
    if (looksLikeOneToFive) {
      return (n: number) => Math.max(1, Math.min(5, n)); // already 1..5
    }
    return (n: number) => Math.max(1, Math.min(5, n + 1)); // convert 0..4 → 1..5
  };

  // Try to match a rating record to the current agent.
  // Prefer agentId; if missing/null, fall back to agentName.
  const matchesCurrentAgent = (
    rec: any,
    currentAgentId: string,
    currentAgentName: string
  ) => {
    const recAgentId = (rec?.agentId ?? "").toString().trim();
    const recName = (rec?.agentName ?? "").toString().trim();
    if (currentAgentId && recAgentId) {
      return recAgentId === currentAgentId;
    }
    if (currentAgentName && recName) {
      // Case-insensitive, trimmed match
      return recName.toLowerCase() === currentAgentName.toLowerCase();
    }
    return false;
  };

  // Overall: API may return array of records for the agent.
  // We compute average and detect scale automatically.
  const normalizeOverall = (data: any): { avgUI: number; count: number } => {
    if (data == null) return { avgUI: 0, count: 0 };

    // Array of ratings
    if (Array.isArray(data)) {
      const raw = data
        .map((r: any) => Number(r?.feedbackRating ?? r?.rating))
        .filter((n) => Number.isFinite(n));
      if (!raw.length) return { avgUI: 0, count: 0 };
      const toUi = makeToUiConverter(raw);
      const uiVals = raw.map(toUi);
      const avgUI = uiVals.reduce((a, b) => a + b, 0) / uiVals.length;
      return { avgUI, count: uiVals.length };
    }

    // Object with aggregated fields
    const rawCount = Number(data.count ?? data.total ?? data.numRatings ?? 0);
    if (!Number.isFinite(rawCount) || rawCount <= 0)
      return { avgUI: 0, count: 0 };

    const rawAvg = Number(
      data.average ?? data.avg ?? data.feedbackRating ?? data.rating ?? NaN
    );
    if (!Number.isFinite(rawAvg)) return { avgUI: 0, count: rawCount };

    const toUi = makeToUiConverter([rawAvg]);
    return { avgUI: toUi(rawAvg), count: rawCount };
  };

  const normalizeMine = (
    data: any,
    currentAgentId: string,
    currentAgentName: string
  ): { present: boolean; ui?: number; comment?: string } => {
    const matches = (rec: any) => {
      const recAgentId = (rec?.agentId ?? "").toString().trim();
      const recName = (rec?.agentName ?? "").toString().trim();
      // Prefer id match when both exist
      if (currentAgentId && recAgentId) return recAgentId === currentAgentId;
      if (currentAgentName && recName)
        return recName.toLowerCase() === currentAgentName.toLowerCase();
      return false;
    };

    // helper: convert backend 0..4 -> 1..5, but if already 1..5 keep as is
    const toUiStars = (n: number) => {
      if (!Number.isFinite(n)) return 0;
      return n >= 5 ? Math.min(5, n) : Math.min(5, Math.max(1, n + 1));
    };

    if (data == null) return { present: false };

    if (Array.isArray(data)) {
      if (!data.length) return { present: false };
      const rec = data.find(matches);
      if (!rec) return { present: false };
      const raw = Number(rec.feedbackRating ?? rec.rating);
      if (!Number.isFinite(raw)) return { present: false };
      return {
        present: true,
        ui: toUiStars(raw),
        comment: rec.feedbackComments ?? rec.comment ?? "",
      };
    }

    // Single object (already filtered server-side)
    const raw = Number(data.feedbackRating ?? data.myRating ?? data.rating);
    if (!Number.isFinite(raw)) return { present: false };
    return {
      present: true,
      ui: toUiStars(raw),
      comment: data.feedbackComments ?? data.comment ?? "",
    };
  };

  // Overall for an agent (array of all ratings for this agent)
  const fetchOverallRating = async (agentIdParam: string) => {
    const url = `${BASE_URL}/ai-service/agent/feedbackByAgentId`;
    const { data } = await axios.get(url, {
      headers: { ...getAuthHeaders() },
      params: { agentId: agentIdParam },
    });
    const { avgUI, count } = normalizeOverall(data);
    setOverallAvg(Number.isFinite(avgUI) ? avgUI : 0);
    setOverallCount(Number.isFinite(count) ? count : 0);
  };

  // My rating for that agent (array of ALL my ratings across agents → must filter)
  const fetchMyRating = async (
    userIdParam: string,
    agentIdParam: string,
    agentNameParam: string
  ) => {
    const url = `${BASE_URL}/ai-service/agent/feedbackByUserId`;
    const { data } = await axios.get(url, {
      headers: { ...getAuthHeaders() },
      params: { userId: userIdParam, agentId: agentIdParam }, // keep sending agentId
    });

    const mine = normalizeMine(data, agentIdParam, agentNameParam);
    if (!mine.present) {
      setMyRating(null);
      setMyComment("");
      setHasRated(false);
      return;
    }
    setMyRating(mine.ui!); // 1..5 UI value
    setMyComment(mine.comment || "");
    setHasRated(true);
  };

  const submitMyRating = async () => {
    if (!agentId || !assistant?.name) {
      message.error("Missing agent information.");
      return;
    }
    if (!userId) {
      message.error("Please login to submit rating.");
      return;
    }

    const chosen = Number(myRating);
    const uiStars = Number.isFinite(chosen)
      ? Math.max(1, Math.min(5, Math.floor(chosen)))
      : 0;
    if (uiStars < 1) {
      message.warning("Please select a rating.");
      return;
    }

    setSubmittingRating(true);
    try {
      // UI 1..5 → API 0..4
      const apiRating = uiStars - 1;

      const payload = {
        agentId,
        agentName: assistant.name,
        feedbackComments: myComment || "",
        feedbackRating: apiRating,
        userId,
      };

      // ✅ ACTUAL POST (create/update the single rating for this user+agent)
      await axios.post(`${BASE_URL}/ai-service/agent/feedback`, payload, {
        headers: { ...getAuthHeaders() },
      });

      await Promise.all([
        fetchMyRating(userId, agentId, assistant?.name || ""),
        fetchOverallRating(agentId),
      ]);

      setHasRated(true); // don’t allow re-rating in UI
      setShowRatingModal(false);
      message.success("Thanks! Your rating was submitted.");
    } catch (e: any) {
      // If backend enforces one-per-user-per-agent and returns conflict:
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Failed to submit feedback.";
      message.error(msg);
    } finally {
      setSubmittingRating(false);
    }
  };

  /** ---------------- TTS ---------------- */
  const handleReadAloud = (content: string, idx: number) => {
    const synth = window.speechSynthesis;
    if (speakingIdx === idx) {
      synth.cancel();
      setSpeakingIdx(null);
      return;
    }
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = "en-US";
    utterance.onend = () => setSpeakingIdx(null);
    synth.speak(utterance);
    setSpeakingIdx(idx);
  };

  // Put this near your other helpers
  const extractTitleFromPrompt = (raw: any): string => {
    if (!raw) return "Untitled";

    if (typeof raw === "string") {
      const s = raw.trim();

      // Case: "[{additionalPrompt=...}]"
      if (/^\[\{.*additionalPrompt=/.test(s)) {
        const match = s.match(/additionalPrompt=([^}]+)}/);
        if (match && match[1]) {
          return match[1].trim();
        }
      }

      // Case: valid JSON with additionalPrompt
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed) && parsed[0]?.additionalPrompt) {
          return String(parsed[0].additionalPrompt).trim();
        }
        if (parsed?.additionalPrompt) {
          return String(parsed.additionalPrompt).trim();
        }
      } catch {
        /* ignore */
      }

      return s || "Untitled";
    }

    // If object/array given directly
    if (Array.isArray(raw) && raw[0]?.additionalPrompt) {
      return String(raw[0].additionalPrompt).trim();
    }
    if (typeof raw === "object" && raw.additionalPrompt) {
      return String(raw.additionalPrompt).trim();
    }

    return "Untitled";
  };

  const fetchUserHistory = async (
    userIdParam: string,
    agentIdParam: string
  ) => {
    const { data } = await axios.get(
      `${BASE_URL}/ai-service/agent/getUserHistory/${userIdParam}/${agentIdParam}`,
      { headers: { ...getAuthHeaders() } }
    );
    return data;
  };

  /** ---------------- Load assistant + starters + ratings ---------------- */
  useEffect(() => {
    const run = async () => {
      if (!id || !agentId) {
        message.error("Invalid assistant or agent ID.");
        navigate(-1);
        return;
      }

      setIsFetchingAssistant(true);

      // reset rating UI to avoid stale '5/5' flash
      setHasRated(false);
      setMyRating(null);
      setMyComment("");
      setOverallAvg(0);
      setOverallCount(0);

      try {
        // 1) Fetch conversation starters + assistant info
        let conv: any = null;
        try {
          conv = await getConversationStarters(agentId);
          if (Array.isArray(conv) && conv.length > 0) {
            const data = conv[0];
            setAssistant({
              id: data.agentId,
              name: data.agentName || "AI Agent",
              description: data.description || "",
              profileUrl: data.profileUrl || data.imageUrl || "",
            });
            const starters = [
              data.conStarter1,
              data.conStarter2,
              data.conStarter3,
              data.conStarter4,
            ]
              .filter((s: string) => s && s.trim())
              .slice(0, 4) as string[];
            setPrompts(starters);
          } else {
            setPrompts([]);
          }
        } catch (err) {
          console.error("Error fetching conversation starters:", err);
          // message.warning("Could not load suggested prompts.");
          setPrompts([]);
        }

        // 2) Fetch ratings
        setLoadingRatings(true);
        try {
          // use freshly fetched name; don’t rely on async state yet
          const agentNameLocal =
            (Array.isArray(conv) && conv[0]?.agentName) || "";

          const tasks: Promise<any>[] = [fetchOverallRating(agentId)];
          if (userId)
            tasks.push(fetchMyRating(userId, agentId, agentNameLocal));
          await Promise.all(tasks);
        } catch (err) {
          console.warn("Ratings fetch issue:", err);
        } finally {
          setLoadingRatings(false);
        }
      } catch {
        message.error("Failed to load assistant details.");
        navigate(-1);
      } finally {
        setIsFetchingAssistant(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId, id, navigate]);

  /** ---------------- scroll & persist ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    saveMessages(messages);
  }, [messages, saveMessages]);

  useEffect(() => {
    saveHistory(history);
  }, [history, saveHistory]);

  useEffect(() => {
    saveSidebarState(sidebarOpen);
  }, [sidebarOpen]);

  /** ---------------- history open ---------------- */
  const openHistoryChat = (hid: string) => {
    if (!id) return;
    setCurrentChatId(hid);
    const raw = localStorage.getItem(CHAT_KEY(id, hid));
    setMessages(raw ? JSON.parse(raw) : []);
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      0
    );
  };

  // Keep optional override if you want to support edit-resend
  const buildMessageHistory = (
    msgs: APIMessage[],
    overrideContent?: string
  ) => {
    const safe = Array.isArray(msgs) ? msgs : [];

    // For edit, override the last user content
    if (overrideContent) {
      const lastUserIdx = [...safe]
        .reverse()
        .findIndex((m) => m.role === "user");
      if (lastUserIdx >= 0) {
        const realIdx = safe.length - 1 - lastUserIdx;
        safe[realIdx] = { ...safe[realIdx], content: overrideContent };
      } else {
        safe.push({ role: "user", content: overrideContent });
      }
    }

    // ✅ Now return array of { role, content }
    return safe.map((m) => ({
      role: m.role,
      content: m.content,
    }));
  };

  const postAgentChat = async (
    agentIdParam: string,
    userIdParam: string | null,
    messageHistory: any[],
    threadIdParam?: string | null
  ) => {
    // ✅ define headers in this scope
    const headers = new AxiosHeaders();
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");
    const auth = getAuthHeaders();
    if (auth.Authorization) headers.set("Authorization", auth.Authorization);

    const payload: any = {
      agentId: agentIdParam,
      userId: userIdParam,
      messageHistory,
    };
    if (threadIdParam) payload.threadId = threadIdParam;

    // ✅ pass explicitly as { headers: headers } to avoid any shadowing issues
    const { data } = await axios.post(
      `${BASE_URL}/ai-service/agent/agentChat`,
      payload,
      { headers: headers }
    );
    return data;
  };

  const sendMessage = useCallback(
    async (
      prompt?: string,
      skipAddUser = false,
      baseMessages?: ChatMessage[]
    ) => {
      const messageContent = prompt || input;
      if (!messageContent.trim() && !skipAddUser) return;
      if (loading || !id) return;

      let userMsg: ChatMessage | undefined;
      const working = baseMessages ?? messages;

      if (!skipAddUser) {
        userMsg = { role: "user", content: messageContent };
        setMessages((prev) => [...prev, userMsg!]);
        if (!prompt) setInput("");
      }

      if (currentChatId) {
        setHistory((prev) =>
          prev.map((h) =>
            h.id === currentChatId
              ? { ...h, title: generateChatTitle(messageContent) }
              : h
          )
        );
      }

      isStopped.current = false;
      setLoading(true);

      try {
        const historyMsgs = skipAddUser ? working : [...working, userMsg!];
        const apiHistory = buildMessageHistory(historyMsgs);

        const resp = await postAgentChat(
          agentId!,
          userId,
          apiHistory,
          threadId
        );
        let answer = "";
        let newThreadId: string | undefined;

        if (typeof resp === "string") {
          answer = resp;
        } else if (resp && typeof resp === "object") {
          answer = resp.answer ?? resp.content ?? resp.text ?? "";
          newThreadId = resp.threadId ?? resp.data?.threadId;
        }
        if (newThreadId) setThreadId(newThreadId);

        if (!isStopped.current) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: answer },
          ]);
        }
      } catch (e: any) {
        message.error(e?.message || "Failed to contact assistant.");
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages, id, agentId, userId, threadId]
  );

  const handleStop = () => {
    isStopped.current = true;
    setLoading(false);
  };

  const handleEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditingContent(messages[idx].content);
  };

  const handleEditSave = async (idx: number, newContent: string) => {
    if (!newContent.trim()) return;

    const newMsgs = messages
      .map((m, i) => (i === idx ? { ...m, content: newContent } : m))
      .slice(0, idx + 1);

    setMessages(newMsgs);
    setEditingIndex(null);

    isStopped.current = false;
    setLoading(true);

    try {
      const apiHistory = buildMessageHistory(newMsgs, newContent);
      const resp = await postAgentChat(agentId!, userId, apiHistory, threadId);

      let answer = "";
      let newThreadId: string | undefined;

      if (typeof resp === "string") {
        answer = resp;
      } else if (resp && typeof resp === "object") {
        answer = resp.answer ?? resp.content ?? resp.text ?? "";
        newThreadId = resp.threadId ?? resp.data?.threadId;
      }
      if (newThreadId) setThreadId(newThreadId);

      if (!isStopped.current) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: answer },
        ]);
      }
    } catch (e: any) {
      message.error(e?.message || "Failed to contact assistant.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (idx: number) => {
    const truncated = messages.slice(0, idx);
    setMessages(truncated);
    sendMessage(undefined, true, truncated);
  };

  /** ---------------- Rating Star UI ---------------- */
  const StarRow = ({
    value,
    onChange,
    readOnly = false,
    size = 18,
  }: {
    value: number;
    onChange?: (v: number) => void;
    readOnly?: boolean;
    size?: number;
  }) => {
    const stars = [1, 2, 3, 4, 5];
    return (
      <div className="flex items-center gap-1">
        {stars.map((s) => {
          const filled = value >= s - 0.5;
          return (
            <button
              key={s}
              type="button"
              disabled={readOnly}
              onClick={() => onChange && onChange(s)}
              className={`p-1 rounded ${
                readOnly
                  ? "cursor-default"
                  : "hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
              title={`${s} star${s > 1 ? "s" : ""}`}
            >
              <StarIcon
                width={size}
                height={size}
                className={
                  filled ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                }
              />
            </button>
          );
        })}
      </div>
    );
  };

  /** ---------------- Voice ---------------- */

  const keepListeningRef = useRef(false);

  const handleVoiceToggle = () => {
    try {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        message.error("Speech Recognition is not supported in this browser.");
        return;
      }

      // If currently recording, stop and prevent auto-restart
      if (recognitionRef.current && isRecording) {
        keepListeningRef.current = false;
        recognitionRef.current.stop();
        return;
      }

      // Start (or re-start) continuous listening
      const recognition = new SR();
      recognition.lang = "en-IN"; // better for India; use "en-US" if you prefer
      recognition.interimResults = true;
      recognition.continuous = true; // <-- stay alive across short silences

      recognitionRef.current = recognition;
      keepListeningRef.current = true;

      recognition.onstart = () => {
        setIsRecording(true);
        message.info("🎤 Listening… speak anytime");
      };

      recognition.onresult = (event: any) => {
        let finalChunk = "";
        let interimChunk = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalChunk += res[0].transcript + " ";
          } else {
            interimChunk += res[0].transcript + " ";
          }
        }

        // Append finals permanently
        if (finalChunk.trim()) {
          setInput((prev) =>
            (prev + " " + finalChunk).replace(/\s+/g, " ").trim()
          );
        }
        // Optionally show interim text live (comment out if you don’t want it)
        if (interimChunk && !finalChunk) {
          setInput((prev) =>
            (prev + " " + interimChunk).replace(/\s+/g, " ").trim()
          );
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === "not-allowed") {
          message.error("Microphone permission denied. Enable it in settings.");
          keepListeningRef.current = false; // don't loop if blocked
          setIsRecording(false);
          return;
        }
        // Auto-recover on transient errors
        if (
          keepListeningRef.current &&
          ["no-speech", "audio-capture", "network"].includes(event.error)
        ) {
          try {
            recognition.stop();
          } catch {}
          // brief restart
          setTimeout(() => {
            if (keepListeningRef.current) {
              try {
                recognition.start();
              } catch {}
            }
          }, 300);
        } else {
          message.error("Speech recognition error. Try again.");
          setIsRecording(false);
        }
      };

      recognition.onend = () => {
        // Chrome fires onend after brief silence; auto-restart if we’re supposed to keep listening
        setIsRecording(false);
        if (keepListeningRef.current) {
          try {
            recognition.start();
          } catch {}
        }
      };

      recognition.start();
    } catch (error) {
      console.error("Voice init error:", error);
      message.error("Failed to start voice input.");
      setIsRecording(false);
      keepListeningRef.current = false;
    }
  };

  useEffect(() => {
    return () => {
      keepListeningRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch {}
    };
  }, []);

  /** ---------------- History utils ---------------- */ const handleNewChat =
    () => {
      const newId = `${Date.now()}`;
      setMessages([]);
      setInput("");

      const newEntry = {
        id: newId,
        title: "New chat",
        createdAt: Date.now(),
      };

      setHistory((prev) => [newEntry, ...prev]);
      setCurrentChatId(newId);
    };

  const generateChatTitle = (text: string) => {
    if (!text) return `New Chat`;
    return text.length > 40 ? text.slice(0, 40) + "…" : text;
  };

  const handlePromptClick = (prompt: string) => {
    if (prompt.trim() && !loading && id) sendMessage(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const shareContent = async (text: string) => {
    if (!navigator.share) {
      alert("Sharing is not supported on this browser.");
      return;
    }
    try {
      await navigator.share({ title: "Shared from MyApp", text });
    } catch (error: any) {
      if (error.name !== "AbortError") {
        alert("Sharing failed: " + error.message);
      }
    }
  };

  const filteredHistory = history.filter((h) =>
    h.title.toLowerCase().includes(historySearch.toLowerCase())
  );

  const handleLogout = () => {
    try {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.clear();
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      navigate("/bharath-aistore", { replace: true });
    }
  };

  const isCollapsed = !isXs && !sidebarOpen;

  const sidebarWidth = isXs
    ? "100%"
    : sidebarOpen
    ? SIDEBAR_WIDTH
    : SIDEBAR_WIDTH_COLLAPSED;
  const leftOffset = isXs
    ? 0
    : sidebarOpen
    ? SIDEBAR_WIDTH
    : SIDEBAR_WIDTH_COLLAPSED;
  const contentWidth = isXs ? "100%" : `calc(100% - ${sidebarWidth}px)`;
  const overlayVisible = isXs && sidebarOpen;
  const effectiveLeftOffset = userId ? leftOffset : 0;
  const effectiveContentWidth = userId ? contentWidth : "100%";

  return (
    <>
      {!userId &&
        (() => {
          try {
            sessionStorage.setItem(
              "returnTo",
              `${location.pathname}${location.search || ""}`
            );
          } catch (e) {
            console.warn("Could not save returnTo:", e);
          }
          return (
            <Navigate
              to={`/whatsappregister?primaryType=AGENT&returnTo=${encodeURIComponent(
                currentPath
              )}`}
            />
          );
        })()}

      <div className="w-full bg-white dark:bg-gray-800 text-purple-700 dark:text-white">
        {/* Header */}
        <header
          className="sticky top-0 z-30 flex items-center border-b border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur h-14 px-2 sm:px-4"
          style={{
            marginLeft: effectiveLeftOffset,
            width: effectiveContentWidth,
          }}
        >
          {/* Left controls */}
          <div className="flex items-center gap-2 min-w-0">
            {/* Mobile: open/close drawer */}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 sm:hidden"
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              <svg
                className="w-6 h-6 text-black dark:text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Assistant name on desktop (kept short, full name inside HeaderInfo) */}
            <div className="hidden sm:block truncate font-medium text-black dark:text-white">
              {assistant?.name || "Assistant"}
            </div>
          </div>

          {/* Mobile: centered assistant name */}
          <div className="flex-1 text-center sm:hidden">
            <div className="truncate font-medium text-black dark:text-white">
              {assistant?.name || "Assistant"}
            </div>
          </div>

          {/* Right: Share */}
          <div className="ml-auto">
            <button
              onClick={() => {
                if (messages.length > 0) {
                  shareContent(messages[messages.length - 1].content);
                } else {
                  message.info("No message to share.");
                }
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title="Share"
            >
              <Share className="w-5 h-5 text-purple-700 dark:text-white" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </header>

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-700 transform transition-transform duration-200 ease-out
  ${isXs && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}`}
          style={{ width: sidebarWidth }}
          aria-label="Chat sidebar"
        >
          <div className="flex items-center px-3 py-2 border-b border-gray-100 dark:border-gray-700">
            <GiElephantHead
              onClick={() => navigate("/bharath-aistore")}
              className={`h-5 w-5 text-purple-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0 ${
                !isXs && isCollapsed ? "hidden" : ""
              }`}
            />
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => setSidebarOpen(false)}
                className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                aria-label="Close sidebar"
                title="Close sidebar"
              >
                <LuPanelRightClose className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="hidden sm:inline-flex p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <LuPanelRightClose className="w-5 h-5 text-black dark:text-white" />
                ) : (
                  <LuPanelLeftClose className="w-5 h-5 text-black dark:text-white" />
                )}
              </button>
            </div>
          </div>

          {/* New Chat + Search */}
          <div className="p-3 space-y-3">
            <button
              onClick={handleNewChat}
              className={`w-full inline-flex items-center rounded-lg gap-2 px-3 py-2 text-gray-800 hover:bg-gray-100 dark:bg-indigo-600 hover:opacity-90 ${
                isCollapsed && !isXs ? "justify-center" : ""
              }`}
              title="New Chat"
              aria-label="New Chat"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                aria-hidden="true"
              >
                <path d="M2.6687 11.333V8.66699C2.6687 7.74455 2.66841 7.01205 2.71655 6.42285C2.76533 5.82612 2.86699 5.31731 3.10425 4.85156L3.25854 4.57617C3.64272 3.94975 4.19392 3.43995 4.85229 3.10449L5.02905 3.02149C5.44666 2.84233 5.90133 2.75849 6.42358 2.71582C7.01272 2.66769 7.74445 2.66797 8.66675 2.66797H9.16675C9.53393 2.66797 9.83165 2.96586 9.83179 3.33301C9.83179 3.70028 9.53402 3.99805 9.16675 3.99805H8.66675C7.7226 3.99805 7.05438 3.99834 6.53198 4.04102C6.14611 4.07254 5.87277 4.12568 5.65601 4.20313L5.45581 4.28906C5.01645 4.51293 4.64872 4.85345 4.39233 5.27149L4.28979 5.45508C4.16388 5.7022 4.08381 6.01663 4.04175 6.53125C3.99906 7.05373 3.99878 7.7226 3.99878 8.66699V11.333C3.99878 12.2774 3.99906 12.9463 4.04175 13.4688C4.08381 13.9833 4.16389 14.2978 4.28979 14.5449L4.39233 14.7285C4.64871 15.1465 5.01648 15.4871 5.45581 15.7109L5.65601 15.7969C5.87276 15.8743 6.14614 15.9265 6.53198 15.958C7.05439 16.0007 7.72256 16.002 8.66675 16.002H11.3337C12.2779 16.002 12.9461 16.0007 13.4685 15.958C13.9829 15.916 14.2976 15.8367 14.5447 15.7109L14.7292 15.6074C15.147 15.3511 15.4879 14.9841 15.7117 14.5449L15.7976 14.3447C15.8751 14.128 15.9272 13.8546 15.9587 13.4688C16.0014 12.9463 16.0017 12.2774 16.0017 11.333V10.833C16.0018 10.466 16.2997 10.1681 16.6667 10.168C17.0339 10.168 17.3316 10.4659 17.3318 10.833V11.333C17.3318 12.2555 17.3331 12.9879 17.2849 13.5771C17.2422 14.0993 17.1584 14.5541 16.9792 14.9717L16.8962 15.1484C16.5609 15.8066 16.0507 16.3571 15.4246 16.7412L15.1492 16.8955C14.6833 17.1329 14.1739 17.2354 13.5769 17.2842C12.9878 17.3323 12.256 17.332 11.3337 17.332H8.66675C7.74446 17.332 7.01271 17.3323 6.42358 17.2842C5.90135 17.2415 5.44665 17.1577 5.02905 16.9785L4.85229 16.8955C4.19396 16.5601 3.64271 16.0502 3.25854 15.4238L3.10425 15.1484C2.86697 14.6827 2.76534 14.1739 2.71655 13.5771C2.66841 12.9879 2.6687 12.2555 2.6687 11.333ZM13.4646 3.11328C14.4201 2.334 15.8288 2.38969 16.7195 3.28027L16.8865 3.46485C17.6141 4.35685 17.6143 5.64423 16.8865 6.53613L16.7195 6.7207L11.6726 11.7686C11.1373 12.3039 10.4624 12.6746 9.72827 12.8408L9.41089 12.8994L7.59351 13.1582C7.38637 13.1877 7.17701 13.1187 7.02905 12.9707C6.88112 12.8227 6.81199 12.6134 6.84155 12.4063L7.10132 10.5898L7.15991 10.2715C7.3262 9.53749 7.69692 8.86241 8.23218 8.32715L13.2791 3.28027L13.4646 3.11328Z"></path>
              </svg>
              {(!isCollapsed || isXs) && <span>New Chat</span>}
            </button>

            {/* Search */}
            {isCollapsed && !isXs ? (
              <button
                className="w-10 h-10 mx-auto flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Search chats"
                aria-label="Search chats"
                onClick={() => setSidebarOpen(true)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="opacity-80"
                >
                  <path
                    d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ) : (
              <div className="relative">
                <input
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search chats"
                  className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* History List */}
          <div className="px-2 pb-24 overflow-y-auto h-[calc(100vh-56px-48px-64px-56px)]">
            {!isCollapsed || isXs ? (
              <>
                <div className="p-3 space-y-3 text-xs text-gray-500">Chats</div>
                {filteredHistory.length === 0 ? (
                  <div className="text-xs text-gray-500 px-2 py-8">
                    No chats yet.
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {filteredHistory.map((h) => (
                      <li key={h.id} className="group">
                        <button
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                          onClick={() => openHistoryChat(h.id)}
                          title={h.title}
                        >
                          <span className="truncate text-sm">{h.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <ul className="space-y-2 mt-3">
                {filteredHistory.map((h) => (
                  <li key={h.id} className="flex justify-center">
                    <button
                      className="w-9 h-9 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-200"
                      title={h.title}
                      onClick={() => openHistoryChat(h.id)}
                    >
                      {(h.title || "?").trim().charAt(0).toUpperCase()}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
            <div
              className={`p-2 flex items-center ${
                isCollapsed && !isXs ? "justify-center" : "justify-center"
              }`}
            >
              <button
                className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition"
                onClick={handleLogout}
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
                {(!isCollapsed || isXs) && (
                  <span className="text-sm font-semibold">Log out</span>
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        <div
          className={`fixed inset-0 z-30 bg-black/40 lg:hidden transition-opacity ${
            overlayVisible
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />

        {/* Main */}
        <main
          className={`flex flex-col bg-white dark:bg-gray-800 transition-all duration-200 min-h-[calc(100vh-var(--header))]`}
          style={{
            marginLeft: effectiveLeftOffset,
            width: effectiveContentWidth,
            ["--header" as any]: `${HEADER_HEIGHT}px`,
          }}
        >
          {assistant && messages.length === 0 && (
            <section
              className="w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 mt-6"
              aria-label="Assistant info"
            >
              <div className="rounded-lg bg-white dark:bg-gray-900 p-4 sm:p-5 flex flex-col items-center text-center">
                {/* 1) Image */}
                <div className="flex items-center justify-center">
                  {assistant?.profileUrl ? (
                    <img
                      src={assistant.profileUrl}
                      alt={assistant.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow">
                      <GiElephantHead className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>

                {/* 2) Name */}
                <h1 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {assistant.name}
                </h1>

                {/* 3) Description */}
                {assistant.description ? (
                  <p className="mt-1 text-sm sm:text-[15px] text-gray-700 dark:text-gray-300">
                    {assistant.description}
                  </p>
                ) : null}

                {/* 4) Ratings */}
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm pb-8">
                  <span className="text-gray-700 dark:text-gray-200">
                    <strong>My rating:</strong>{" "}
                    {hasRated && myRating != null && myRating > 0
                      ? `${myRating.toFixed(1)}/5`
                      : "—"}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">|</span>
                  <span className="text-gray-700 dark:text-gray-200">
                    <strong>Overall:</strong>{" "}
                    {overallCount > 0 && overallAvg > 0
                      ? `${overallAvg.toFixed(1)}/5 (${overallCount})`
                      : "Not rated yet"}
                  </span>

                  {!hasRated && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => setShowRatingModal(true)}
                        disabled={loadingRatings}
                        title="Rate & Comments"
                        aria-label="Rate and add comments"
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-indigo-600 text-white font-medium text-sm shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 transition-colors"
                      >
                        <StarIcon className="w-4 h-4 shrink-0" />
                        <span>Rate</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 5) Conversation starters — moved here to sit just under ratings */}
                {visiblePrompts.length > 0 && (
                  <div className="w-full mt-3">
                    {(() => {
                      const countToShow = isXs
                        ? Math.min(2, visiblePrompts.length)
                        : Math.min(4, visiblePrompts.length);
                      const promptsToShow = visiblePrompts.slice(
                        0,
                        countToShow
                      );
                      const colClass =
                        countToShow === 1
                          ? "grid-cols-1 max-w-xs"
                          : countToShow === 2
                          ? "grid-cols-2 max-w-lg"
                          : countToShow === 3
                          ? "grid-cols-3 max-w-3xl"
                          : "grid-cols-4 max-w-5xl";
                      return (
                        <div className={`grid gap-3 ${colClass} mx-auto`}>
                          {promptsToShow.map((prompt, idx) => (
                            <button
                              key={`${prompt}-${idx}`}
                              onClick={() => handlePromptClick(prompt)}
                              className="p-4 rounded-lg shadow bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-indigo-800 transition text-gray-700 dark:text-white text-left text-sm touch-manipulation"
                              style={{ WebkitTapHighlightColor: "transparent" }}
                              title={prompt}
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </section>
          )}
          {/* Rating Modal */}
          <Modal
            title="Rate & Comments"
            open={showRatingModal}
            onCancel={() => setShowRatingModal(false)}
            footer={
              hasRated
                ? []
                : [
                    <button
                      key="submit"
                      className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                      disabled={
                        submittingRating || !(myRating && myRating >= 1)
                      }
                      onClick={submitMyRating}
                    >
                      {submittingRating ? "Submitting..." : "Submit"}
                    </button>,
                  ]
            }
          >
            <div className="space-y-3">
              {/* Mine (interactive) */}
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Rate this Agent
                </div>
                <div className="mt-1 flex items-center gap-3">
                  <StarRow
                    value={myRating ?? 0} // stays 0 (NOT 5) until user picks
                    onChange={hasRated ? undefined : (v) => setMyRating(v)}
                    readOnly={hasRated || submittingRating}
                    size={22}
                  />
                  {!hasRated && (
                    <span className="text-xs text-gray-500">
                      Select 1–5 stars
                    </span>
                  )}
                </div>
              </div>

              {/* Comment */}
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {hasRated ? "Comment" : "Comments (optional)"}
                </div>
                <textarea
                  className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm"
                  placeholder="Write something…"
                  value={myComment}
                  onChange={(e) => setMyComment(e.target.value)}
                  rows={3}
                  readOnly={hasRated}
                />
              </div>
            </div>
          </Modal>

          {/* Content area */}
          {isFetchingAssistant ? (
            <div className="flex-1 grid place-items-center min-h-[calc(100vh-56px)]">
              <Loader2 className="animate-spin w-8 h-8 text-purple-700 dark:text-white" />
            </div>
          ) : (
            <>
              {/* ======= Conversation ======= */}
              <div className="flex-1 w-full">
                <div className="mx-auto w-full max-w-4xl px-3 sm:px-2 lg:px-2 pt-2 sm:pt-4 pb-[7.5rem]">
                  {messages.length === 0 ? (
                    <div className="pt-1" />
                  ) : (
                    <>
                      {messages.map((msg, idx) =>
                        msg.role === "user" ? (
                          <div
                            key={idx}
                            className={`flex mb-3 sm:mb-4 justify-end group relative ${
                              editingIndex === idx ? "w-full" : ""
                            }`}
                          >
                            {editingIndex === idx ? (
                              <div className="text-base my-auto mx-auto pt-12 [--thread-content-margin:--spacing(4)] thread-sm:[--thread-content-margin:--spacing(6)] thread-lg:[--thread-content-margin:--spacing(16)] px-(--thread-content-margin) w-full max-w-3xl">
                                <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-2xl p-4 shadow-md">
                                  <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-purple-700 dark:text-white shrink-0 mt-1 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <textarea
                                        className="w-full text-[13px] sm:text-sm resize-none bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 overflow-auto p-1 max-h-[32dvh]"
                                        style={{ minHeight: "20px" }}
                                        value={editingContent}
                                        onChange={(e) =>
                                          setEditingContent(e.target.value)
                                        }
                                        onInput={(e) => {
                                          const target =
                                            e.target as HTMLTextAreaElement;
                                          target.style.height = "auto"; // reset height
                                          target.style.height =
                                            target.scrollHeight + "px"; // expand to fit content
                                        }}
                                        placeholder="Edit your message..."
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                      onClick={() => {
                                        setEditingIndex(null);
                                        setEditingContent("");
                                      }}
                                      className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleEditSave(idx, editingContent)
                                      }
                                      disabled={!editingContent.trim()}
                                      className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 shadow-md bg-white text-purple-700 dark:bg-gray-900 dark:text-white relative">
                                  <div className="flex gap-2">
                                    <User className="w-5 h-5 text-purple-700 dark:text-white shrink-0 mt-1" />
                                    <MarkdownRenderer content={msg.content} />
                                  </div>
                                  <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          msg.content
                                        );
                                        message.success("Copied to clipboard");
                                      }}
                                      className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-purple-700 dark:text-white"
                                      title="Copy"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleEdit(idx)}
                                      className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-purple-700 dark:text-white"
                                      title="Edit"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <div
                            key={idx}
                            className="flex mb-3 sm:mb-4 justify-start"
                          >
                            <div className="max-w-[85%] w-full group rounded-2xl p-3 shadow-md bg-white text-purple-700 dark:bg-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">
                              <div className="items-start gap-2 flex-1">
                                <GiElephantHead className="w-5 h-5 text-purple-700 dark:text-white shrink-0 mt-1" />
                                <MarkdownRenderer content={msg.content} />
                              </div>

                              <div className="flex justify-end gap-2 mt-2">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(msg.content);
                                    message.success("Copied to clipboard");
                                  }}
                                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-purple-700 dark:text-white"
                                  title="Copy"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={async () => {
                                    if (navigator.share) {
                                      try {
                                        await navigator.share({
                                          title: assistant?.name || "Assistant",
                                          text: msg.content,
                                        });
                                      } catch (err) {
                                        console.error(
                                          "Share cancelled or failed:",
                                          err
                                        );
                                      }
                                    } else {
                                      navigator.clipboard.writeText(
                                        msg.content
                                      );
                                      message.info(
                                        "Copied text to share manually"
                                      );
                                    }
                                  }}
                                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-purple-700 dark:text-white"
                                  title="Share"
                                >
                                  <Share2 className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() =>
                                    handleReadAloud(msg.content, idx)
                                  }
                                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-purple-700 dark:text-white"
                                  title={
                                    speakingIdx === idx
                                      ? "Stop Reading"
                                      : "Read Aloud"
                                  }
                                >
                                  {speakingIdx === idx ? (
                                    <Square className="w-4 h-4" />
                                  ) : (
                                    <Volume2 className="w-4 h-4" />
                                  )}
                                </button>

                                {idx === messages.length - 1 && (
                                  <button
                                    onClick={() => handleRegenerate(idx)}
                                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-purple-700 dark:text-white"
                                    title="Regenerate"
                                  >
                                    <RefreshCcw className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                      {loading && (
                        <div className="flex justify-start mb-3 sm:mb-4">
                          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 shadow flex items-center gap-2 text-gray-700 dark:text-white">
                            <Loader2 className="w-5 h-5 animate-spin text-gray-700 dark:text-white" />
                            <span>Assistant is thinking...</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Composer */}
              <div
                className="fixed bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-gray-800 dark:via-gray-800/95 dark:to-transparent px-3 sm:px-4 pb-4 pt-2"
                style={{
                  left: effectiveLeftOffset,
                  width: effectiveContentWidth,
                  zIndex: 29,
                }}
              >
                <div className="w-full max-w-4xl mx-auto flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-md px-3 sm:px-5 py-2 sm:py-3 focus-within:ring-2 focus-within:ring-indigo-500 transition">
                  <button
                    onClick={handleVoiceToggle}
                    className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full transition ${
                      isRecording
                        ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 animate-pulse"
                        : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                    aria-label="Voice input"
                  >
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <textarea
                    rows={1}
                    className="flex-1 min-w-0 bg-transparent outline-none px-2 py-1 text-sm sm:text-base placeholder-gray-400 dark:placeholder-white text-gray-700 dark:text-white max-h-32 overflow-y-auto resize-y"
                    placeholder={"Ask anything..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                  />

                  {loading ? (
                    <button
                      onClick={handleStop}
                      className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-red-700 dark:text-white hover:bg-gray-800 hover:text-white transition"
                      title="Stop"
                    >
                      <Square className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => sendMessage()}
                      disabled={!input.trim()}
                      className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-gray-700 dark:text-white hover:bg-gray-800 hover:text-white disabled:opacity-50 transition"
                      title="Send"
                    >
                      <Send className="w-4 h-4 sm:w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default AssistantDetails;
