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
import { GiLion } from "react-icons/gi";
import { Loader2, Mic, Plus } from "lucide-react";

import {
  Send,
  Copy,
  Share2,
  Volume2,
  Square,
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

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
  resultIndex: number;
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
  message?: string;
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
const SIDEBAR_WIDTH_COLLAPSED = 60; // px (collapsed)
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
  // multiple file selection + viewing/removal
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showMobileFiles, setShowMobileFiles] = useState(false);

  const [threadSource, setThreadSource] = useState<"files" | "agent" | null>(
    null
  );
  // ⬇️ place with other useState hooks
  const [remainingPrompts, setRemainingPrompts] = useState<number | null>(null);

  // ⬇️ small helpers used by chat-with-file response parsing
  const extractImageUrl = (
    raw: any
  ): { isImage: boolean; url: string | null } => {
    const s = String(raw ?? "");
    const md = s.match(/!\[[^\]]*]\((https?:\/\/[^\s)]+)\)/i);
    const direct = s.match(/https?:\/\/\S+\.(png|jpe?g|gif|webp)/i);
    const url = md?.[1] || direct?.[0] || null;
    return { isImage: !!url, url };
  };

  const cleanContent = (s: string): string => {
    return String(s ?? "")
      .replace(/^```(?:\w+)?\n?/, "")
      .replace(/```$/, "")
      .trim();
  };
  // ⬇️ NEW: local lock so refresh won't allow re-rating again
  const RATING_LOCK_KEY = (u: string, a: string) => `agent_rating_${u}_${a}`;

  const [historyById, setHistoryById] = useState<Record<string, ChatMessage[]>>(
    {}
  );
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Whenever messages change, scroll down
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
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
  /** ---------------- History utils ---------------- */
  // Updated: Added formatDate for displaying relative dates in history sidebar (like ChatGPT)
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else if (diffInDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };
  /** ---------------- Helper: extract last user message ---------------- */
  function getLastUserMessage(prompt: string) {
    if (!prompt) return "Untitled";
    try {
      const parsed = JSON.parse(prompt);
      const userMessages = Array.isArray(parsed)
        ? parsed.filter((msg: any) => msg.role === "user")
        : [];
      if (userMessages.length > 0)
        return userMessages[userMessages.length - 1].content;
    } catch {
      const legacy = parseLegacyPrompt(prompt);
      const lastUser = legacy.reverse().find((m) => m.role === "user");
      if (lastUser?.content) return lastUser.content;
    }
    return "Untitled";
  }

  useEffect(() => {
    const loadHistoryFromApi = async () => {
      if (!id || !agentId || !userId) return;
      try {
        const historyData = await fetchUserHistory(userId, agentId);

        if (!Array.isArray(historyData) || historyData.length === 0) {
          setHistoryById({});
          setHistory([]);
          return;
        }

        const tmpMap: Record<string, ChatMessage[]> = {};
        const seen = new Set<string>();
        const rows: { id: string; title: string; createdAt: number }[] = [];

        for (let idx = 0; idx < historyData.length; idx++) {
          const h = historyData[idx];

          // Prefer stable id fields; fallback keeps list usable
          const hid = String(h?.id ?? h?.historyId ?? `${Date.now()}_${idx}`);

          // messages can be under messages/messageHistory/history or embedded in prompt (legacy)
          const msgsApi = normalizeMessages(
            h?.messages ?? h?.messageHistory ?? h?.history
          );
          const msgs =
            msgsApi && msgsApi.length > 0
              ? msgsApi
              : typeof h?.prompt === "string"
              ? parseLegacyPrompt(h.prompt)
              : [];

          tmpMap[hid] = msgs;

          // title strategy: last user content if possible; else derive from raw prompt
          let title =
            msgs.find((m) => m.role === "user")?.content ||
            (typeof h?.prompt === "string"
              ? getLastUserMessage(h.prompt)
              : "") ||
            "Untitled";

          title = normalizeTitle(title);

          const created = safeDateMs(h?.createdAt) - idx; // tiny offset keeps stability

          // build a composite key to drop dupes from API
          const key = makeHistoryKey(hid, title, created);
          if (seen.has(key)) continue;
          seen.add(key);

          rows.push({ id: hid, title, createdAt: created });
        }

        // sort newest → oldest
        rows.sort((a, b) => b.createdAt - a.createdAt);

        setHistoryById(tmpMap);
        setHistory(rows);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setHistoryById({});
        setHistory([]);
      }
    };

    loadHistoryFromApi();
  }, [id, agentId, userId]);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

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

  useEffect(() => {
    const id = axios.interceptors.request.use((config) => {
      const auth = getAuthHeaders();
      const h = (config.headers ??= new AxiosHeaders());

      // always fine:
      h.set("Accept", "application/json");

      // ✅ if this is FormData, DO NOT set Content-Type
      const isForm =
        typeof FormData !== "undefined" && config.data instanceof FormData;

      if (isForm) {
        // let the browser set "multipart/form-data; boundary=..."
        // (delete in case something already set)
        // AxiosHeaders has delete() in recent versions; fallback to set undefined if needed.
        try {
          (h as any).delete?.("Content-Type");
        } catch {}
      } else {
        h.set("Content-Type", "application/json");
      }

      if (auth.Authorization) h.set("Authorization", auth.Authorization);
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

  // ✅ derived guard: true if either local lock OR state says rated
  const alreadyRated = useMemo(() => {
    if (!userId || !agentId) return hasRated;
    return (
      hasRated || localStorage.getItem(RATING_LOCK_KEY(userId, agentId)) === "1"
    );
  }, [hasRated, userId, agentId]);

  // ✅ if rating is (or becomes) locked, ensure modal is closed
  useEffect(() => {
    if (alreadyRated && showRatingModal) setShowRatingModal(false);
  }, [alreadyRated, showRatingModal]);

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

  // ⬇️ NEW: on mount/agent change, honor local lock (blocks double-count after refresh)
  useEffect(() => {
    if (!userId || !agentId) return;
    const locked = localStorage.getItem(RATING_LOCK_KEY(userId, agentId));
    if (locked === "1") setHasRated(true);
  }, [userId, agentId]);

  // ⬇️ CHANGED: guard in submit + set local lock after success
  const submitMyRating = async () => {
    if (!agentId || !assistant?.name) {
      message.error("Missing agent information.");
      return;
    }
    if (!userId) {
      message.error("Please login to submit rating.");
      return;
    }

    // 🚫 block if already rated in UI or local lock says rated
    const locked = localStorage.getItem(RATING_LOCK_KEY(userId, agentId));
    if (hasRated || locked === "1") {
      message.info("You’ve already rated this agent.");
      setHasRated(true);
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
      const apiRating = uiStars - 1;
      const payload = {
        agentId,
        agentName: assistant.name,
        feedbackComments: myComment || "",
        feedbackRating: apiRating,
        userId,
      };

      // ⬇️ in submitMyRating just AFTER a successful POST:
      await axios.post(`${BASE_URL}/ai-service/agent/feedback`, payload, {
        headers: { ...getAuthHeaders() },
      });

      // ✅ OPTIMISTIC HIDE to avoid “shows until click” bug
      setHasRated(true);
      localStorage.setItem(RATING_LOCK_KEY(userId, agentId), "1");
      setShowRatingModal(false);

      // (then refresh numbers in background)
      await Promise.all([
        fetchMyRating(userId, agentId, assistant?.name || ""),
        fetchOverallRating(agentId),
      ]);

      message.success("Thanks! Your rating was submitted.");
    } catch (e: any) {
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

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Extracts a title from a prompt object or string.
   * Supports different shapes of prompt objects and strings.
   * Returns the first user's message content, or the additionalPrompt content, or the first content= string in the prompt.
   * If no title can be extracted, returns "Untitled".
   * @param {any} raw The prompt object or string to extract a title from.
   * @returns {string} The extracted title, or "Untitled" if no title can be found.
   */
  /*******  251ad98b-0f67-4512-a517-cf301344d82b  *******/ // Parse legacy string like: "[{role=user, content=Hello}, {role=assistant, content=...}]"
  const parseLegacyPrompt = (raw: any): ChatMessage[] => {
    if (typeof raw !== "string") return [];
    const s = raw.trim();
    if (!s.startsWith("[{") || !s.includes("role=")) return [];

    // strip [ and ] then split by "},"
    const inner = s.replace(/^\s*\[/, "").replace(/\]\s*$/, "");
    const parts = inner.split(/}\s*,\s*\{/g).map((p, idx, arr) => {
      let seg = p;
      if (idx === 0 && seg.startsWith("{")) seg = seg.slice(1);
      if (idx === arr.length - 1 && seg.endsWith("}")) seg = seg.slice(0, -1);
      return seg;
    });

    const out: ChatMessage[] = [];
    for (const part of parts) {
      const roleMatch = part.match(/\brole\s*=\s*(user|assistant|system)\b/i);
      const contentMatch = part.match(/\bcontent\s*=\s*([\s\S]*)$/i);
      const roleRaw = roleMatch?.[1]?.toLowerCase() || "user";
      let role: ChatMessage["role"] =
        roleRaw === "assistant"
          ? "assistant"
          : roleRaw === "system"
          ? "system"
          : "user";

      let content = (contentMatch?.[1] || "").trim();

      // remove trailing commas and stray braces
      content = content.replace(/\s*[},]\s*$/, "").trim();

      // unescape common newline patterns if present
      content = content.replace(/\\n/g, "\n");

      if (content) out.push({ role, content });
    }
    return out;
  };

  const extractTitleFromPrompt = (raw: any): string => {
    if (!raw) return "Untitled";

    // If already array/object
    if (Array.isArray(raw) && raw.length) {
      const firstUser = raw.find((m) => m?.role === "user" && m?.content);
      if (firstUser?.content)
        return String(firstUser.content).trim().slice(0, 60);
    }
    if (typeof raw === "object" && raw?.additionalPrompt) {
      return String(raw.additionalPrompt).trim().slice(0, 60);
    }

    if (typeof raw === "string") {
      const s = raw.trim();

      // 2.a) Legacy role= / content= array string → use the first user message
      if (/^\s*\[\{/.test(s) && /role\s*=/.test(s)) {
        const msgs = parseLegacyPrompt(s);
        const firstUser = msgs.find((m) => m.role === "user");
        if (firstUser?.content) return firstUser.content.trim().slice(0, 60);
      }

      // 2.b) "{additionalPrompt=...}" shape
      if (/\badditionalPrompt=/.test(s)) {
        const m = s.match(/additionalPrompt=([^}]+)}/);
        if (m?.[1]) return m[1].trim().slice(0, 60);
      }

      // 2.c) Try valid JSON string → [{role,content}] or {additionalPrompt}
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed) && parsed.length) {
          const firstUser = parsed.find(
            (m) => m?.role === "user" && m?.content
          );
          if (firstUser?.content)
            return String(firstUser.content).trim().slice(0, 60);
        }
        if (parsed?.additionalPrompt) {
          return String(parsed.additionalPrompt).trim().slice(0, 60);
        }
      } catch {
        // fall through
      }

      // 2.d) As a last resort, if legacy string includes "content=", take first content
      const contentFirst = s.match(/\bcontent\s*=\s*([^}\]]+)/);
      if (contentFirst?.[1]) return contentFirst[1].trim().slice(0, 60);

      return s.slice(0, 60) || "Untitled";
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

  // --- History helpers (dedupe + robust date parse) ---
  const safeDateMs = (v: any): number => {
    const d = new Date(v ?? Date.now());
    const t = d.getTime();
    return Number.isFinite(t) ? t : Date.now();
  };

  // stable key to remove dupes coming from API (same id OR same title within ~2 minutes)
  const makeHistoryKey = (hid: string, title: string, createdAt: number) => {
    // bucket createdAt to 120s to coalesce near-duplicates from rapid saves
    const bucket = Math.floor(createdAt / 120_000);
    return `${hid || "noid"}|${title.trim().toLowerCase()}|${bucket}`;
  };

  // normalize a title so list/search is consistent
  const normalizeTitle = (s: string) =>
    (s || "Untitled").replace(/\s+/g, " ").trim() || "Untitled";

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

    // map to ChatMessage and trim
    const prelim: ChatMessage[] = (arr as any[])
      .map((m: any) => {
        const role: ChatMessage["role"] =
          m?.role === "assistant"
            ? "assistant"
            : m?.role === "system"
            ? "system"
            : "user";
        const content = String(m?.content ?? m?.text ?? "").trim();
        return { role, content };
      })
      .filter((m) => m.content.length > 0);

    // remove consecutive duplicates (same role & content back-to-back)
    const out: ChatMessage[] = [];
    for (const m of prelim) {
      const last = out[out.length - 1];
      if (last && last.role === m.role && last.content === m.content) continue;
      out.push(m);
    }
    return out;
  };

const openHistoryChat = async (hid: string) => {
  if (!id) return;
  setCurrentChatId(hid);

  const cached = historyById[hid];
  if (cached?.length) {
    setMessages(cached);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    return;
  }

  try {
    if (!userId || !agentId) return;
    const historyData = await fetchUserHistory(userId, agentId);
    if (Array.isArray(historyData)) {
      const map: Record<string, ChatMessage[]> = {};
      for (let i = 0; i < historyData.length; i++) {
        const h = historyData[i];
        const _hid = String(h?.id ?? h?.historyId ?? `${Date.now()}_${i}`);
        map[_hid] = normalizeMessages(h?.messages ?? h?.messageHistory ?? h?.history);
      }
      setHistoryById(map);
      setMessages(map[hid] ?? []);
    } else {
      setMessages([]);
    }
  } catch {
    setMessages([]);
  }

  setTimeout(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 0);
};

  // Keep optional override if you want to support edit-resend
  const buildMessageHistory = (
    msgs: ChatMessage[],
    overrideContent?: string
  ): APIMessage[] => {
    // start from chat messages, ignore system
    const safe: APIMessage[] = (Array.isArray(msgs) ? msgs : [])
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : ("user" as APIRole),
        content: m.content,
      }));

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

    return safe;
  };

  // ✅ agentChat NEVER receives threadId
  const postAgentChat = async (
    agentIdParam: string,
    userIdParam: string | null,
    messageHistory: any[]
  ) => {
    const headers = new AxiosHeaders();
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");
    const auth = getAuthHeaders();
    if (auth.Authorization) headers.set("Authorization", auth.Authorization);

    const payload = {
      agentId: agentIdParam,
      userId: userIdParam,
      messageHistory,
    };

    const { data } = await axios.post(
      `${BASE_URL}/ai-service/agent/agentChat`,
      payload,
      { headers }
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

        const resp = await postAgentChat(agentId!, userId, apiHistory);

        let answer = "";
        if (typeof resp === "string") {
          answer = resp;
        } else if (resp && typeof resp === "object") {
          answer = resp.answer ?? resp.content ?? resp.text ?? "";
        }
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
      const resp = await postAgentChat(agentId!, userId, apiHistory);

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

    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  /**
   * Upload a file + optional user prompt to Student Service "chat-with-file".
   * Endpoint: /api/student-service/user/chat-with-file
   */
  const chatWithFile = async (file: File, userPrompt: string) => {
    const url = `${BASE_URL}/student-service/user/chat-with-files`; // BASE_URL already includes /api
    const form = new FormData();
    form.append("files", file);
    form.append("prompt", userPrompt || "");

    const headers = { ...getAuthHeaders() };
    const { data } = await axios.post(url, form, { headers });
    return data;
  };

  // Send a message over the SAME chat-with-files thread without re-uploading files
  const chatWithFilesFollowup = async (userPrompt: string) => {
    const url = `${BASE_URL}/student-service/user/chat-with-files`;

    const formData = new FormData();
    formData.append("prompt", userPrompt || "");
    selectedFiles.forEach((f) => formData.append("files[]", f));
    if (threadId) formData.append("threadId", threadId);

    const headers = { ...getAuthHeaders() };
    const { data } = await axios.post(url, formData, { headers });

    const {
      answer,
      threadId: newThreadId,
      remainingPrompts: updatedPrompts,
    } = data ?? {};

    if (newThreadId) setThreadId(newThreadId);
    if (typeof updatedPrompts !== "undefined") {
      setRemainingPrompts(updatedPrompts);
      if (Number(updatedPrompts) === 0) {
        // ⛔ stop continuity: surface an explicit error string to caller
        message.error("File search limit reached. Please try again later.");
        return "File search limit reached. Please try again later.";
      }
    }

    setThreadSource("files");
    return String(answer ?? "").trim();
  };

  // ⬇️ NEW: small utility to validate allowed types
  const isAllowedType = (type: string) =>
    [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "text/csv",
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(type);

  // accept multiple files and filter dupes by name+size
  const handleFilePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;
    setSelectedFiles((prev) => {
      const key = (f: File) => `${f.name}_${f.size}`;
      const map = new Map(prev.map((f) => [key(f), f]));
      picked.forEach((f) => map.set(key(f), f));
      return Array.from(map.values());
    });
    // optional: clear the input so picking same file again re-triggers change
    e.currentTarget.value = "";
  };

  const removeFileAt = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFileUpload = async (
    _file: File | null, // kept for signature compatibility; we now use `selectedFiles`
    userPrompt: string
  ): Promise<string | null> => {
    if (Number(remainingPrompts) === 0 && remainingPrompts != null) {
      return await Promise.resolve(null);
    }

    setLoading(true);

    // push user's message into chat immediately
    // push user's message into chat immediately
    const userMessage: ChatMessage = {
      role: "user",
      content: userPrompt,
    };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    try {
      // ✅ branch: if there are files selected → multipart; else → JSON search
      let answerData: any;

      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((f) => formData.append("files", f)); // keep "files"

        formData.append("prompt", userPrompt || "");
        if (threadId) formData.append("threadId", threadId);

        // ⛔ no explicit headers; interceptor must NOT force Content-Type for FormData
        answerData = (
          await axios.post(
            `${BASE_URL}/student-service/user/chat-with-files`,
            formData
          )
        ).data;
      } else {
        const jsonPayload: any = { prompt: userPrompt };
        if (threadId) jsonPayload.threadId = threadId;

        answerData = (
          await axios.post(
            `${BASE_URL}/student-service/user/chat-with-files`,
            jsonPayload
          )
        ).data;
      }

      const {
        answer,
        threadId: newThreadId,
        remainingPrompts: updatedPrompts,
      } = answerData ?? {};

      // ✅ keep thread + source
      if (newThreadId) {
        setThreadId(newThreadId);
        setThreadSource("files");
      }

      // ✅ persist remaining prompts
      if (typeof updatedPrompts !== "undefined") {
        setRemainingPrompts(updatedPrompts);
        if (Number(updatedPrompts) === 0) {
          // ⛔ hard stop: show user error and do NOT render normal assistant content
          message.error(
            "File search limit reached. Please try again tomorrow."
          );
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "File search limit reached. Please try again tomorrow.",
            },
          ]);

          // (optional) clear selected files to avoid accidental re-sends
          setSelectedFiles([]);
          return newThreadId || null;
        }
      }

      // normal success → render content
      const { isImage, url } = extractImageUrl(answer);
      const content = isImage
        ? url || String(answer).trim()
        : cleanContent(String(answer));
      setMessages((prev) => [...prev, { role: "assistant", content }]);

      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // clear after success
      setSelectedFiles([]);
      return newThreadId || null;

      return newThreadId || null;
    } catch (error) {
      console.error("File upload/search failed:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "⚠️ File upload failed. Please try again after a few seconds.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      return null;
    } finally {
      setLoading(false);
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

  const handleNewChat = () => {
    const newId = `${Date.now()}`;
    setMessages([]);
    setInput("");
    setCurrentChatId(newId);

    // 👇 reset files routing so next prompt goes to agentChat
    setThreadId(null);
    setThreadSource(null);
    setSelectedFiles([]);
  };

  const generateChatTitle = (text: string) => {
    if (!text) return `New Chat`;
    return text.length > 40 ? text.slice(0, 40) + "…" : text;
  };
  const handlePromptClick = async (prompt: string) => {
    if (!prompt.trim() || loading || !id) return;

    // 👇 Stick to files thread if that's how the thread started
    if (threadSource === "files") {
      const userMessage: ChatMessage = { role: "user", content: prompt };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      try {
        const answer = await chatWithFilesFollowup(prompt);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: cleanContent(answer) },
        ]);
      } catch {
        message.error("Failed to contact file chat.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Otherwise use your normal agent chat
    await sendMessage(prompt);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (selectedFiles.length > 0) {
        await handleFileUpload(
          null,
          input || "please describe the file content properly"
        );
        setInput("");
        setShowMobileFiles(false);
        return;
      }

      if (input.trim()) {
        // 👇 NEW: stick to chat-with-files if the thread was created there
        if (threadSource === "files") {
          const userMessage: ChatMessage = { role: "user", content: input };
          setMessages((prev) => [...prev, userMessage]);
          setInput("");
          setLoading(true);
          try {
            const answer = await chatWithFilesFollowup(userMessage.content);
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: cleanContent(answer) },
            ]);
          } catch (err) {
            message.error("Failed to contact file chat.");
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: "Sorry, something went wrong." },
            ]);
          } finally {
            setLoading(false);
          }
        } else {
          // fallback to your existing agentChat flow
          await sendMessage();
        }
      }
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
      sessionStorage.clear();
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
          className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-700 transform transition-transform duration-200 ease-out ${
            isXs && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
          }`}
          style={{ width: sidebarWidth }}
          aria-label="Chat sidebar"
        >
          {/* ---------- TOP (HEADER + ACTION BUTTONS) ---------- */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
              <GiElephantHead
                onClick={() => navigate("/bharath-aistore")}
                title="Bharat AI Store"
                className={`h-7 w-7 text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer ${
                  !isXs && isCollapsed ? "hidden" : ""
                }`}
              />
              <div className="flex items-center gap-1">
                {/* Mobile close */}
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="sm:hidden inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Close sidebar"
                >
                  <LuPanelRightClose className="h-7 w-7 text-gray-700 dark:text-gray-300" />
                </button>

                {/* Collapse toggle */}
                <button
                  onClick={() => setSidebarOpen((v) => !v)}
                  className="hidden sm:inline-flex p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label={
                    isCollapsed ? "Expand sidebar" : "Collapse sidebar"
                  }
                  title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {isCollapsed ? (
                    <LuPanelRightClose className="w-7 h-7 text-black dark:text-white" />
                  ) : (
                    <LuPanelLeftClose className="w-7 h-7 text-black dark:text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* ---------- BUTTONS + SEARCH (TOP FIXED) ---------- */}
            <div className="flex-shrink-0 p-2 space-y-1 border-b border-gray-100 dark:border-gray-700">
              {/* New Chat */}
              <button
                onClick={handleNewChat}
                className={`w-full inline-flex items-center gap-2 px-3 py-2 rounded-md text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isCollapsed && !isXs ? "justify-center" : "justify-start"
                }`}
                title="New Chat"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon flex-shrink-0"
                  aria-hidden="true"
                >
                  {" "}
                  <path
                    fill="currentColor"
                    d="M3.2024399999999997 13.5996V10.400388C3.2024399999999997 9.29346 3.202092 8.41446 3.2598599999999998 7.70742C3.318396 6.991344000000001 3.440388 6.3807719999999994 3.7251 5.821872L3.9102479999999997 5.491404C4.371264 4.7397 5.032704 4.12794 5.822748 3.725388L6.034859999999999 3.625788C6.535991999999999 3.410796 7.081595999999999 3.310188 7.708296 3.258984C8.415263999999999 3.201228 9.293339999999999 3.201564 10.4001 3.201564H11.0001C11.440716 3.201564 11.797979999999999 3.559032 11.798148 3.9996119999999995C11.798148 4.440335999999999 11.440824 4.79766 11.0001 4.79766H10.4001C9.26712 4.79766 8.465256 4.798007999999999 7.838375999999999 4.8492239999999995C7.375332 4.887048 7.047324 4.950816 6.787212 5.043755999999999L6.546971999999999 5.146872C6.01974 5.415515999999999 5.578463999999999 5.824139999999999 5.270796 6.325788L5.147748 6.5460959999999995C4.996656 6.84264 4.9005719999999995 7.219956 4.8501 7.8374999999999995C4.798872 8.464476 4.7985359999999995 9.26712 4.7985359999999995 10.400388V13.5996C4.7985359999999995 14.73288 4.798872 15.53556 4.8501 16.16256C4.9005719999999995 16.77996 4.9966680000000006 17.15736 5.147748 17.453879999999998L5.270796 17.6742C5.578452 18.1758 6.019775999999999 18.584519999999998 6.546971999999999 18.85308L6.787212 18.95628C7.047312000000001 19.04916 7.375368 19.1118 7.838375999999999 19.1496C8.465268 19.200839999999996 9.267071999999999 19.202399999999997 10.4001 19.202399999999997H13.60044C14.73348 19.202399999999997 15.535319999999999 19.200839999999996 16.1622 19.1496C16.77948 19.0992 17.15712 19.00404 17.45364 18.85308L17.67504 18.72888C18.1764 18.42132 18.58548 17.980919999999998 18.85404 17.453879999999998L18.95712 17.213639999999998C19.05012 16.953599999999998 19.11264 16.625519999999998 19.15044 16.16256C19.20168 15.53556 19.20204 14.73288 19.20204 13.5996V12.9996C19.20216 12.559199999999999 19.55964 12.20172 20.00004 12.2016C20.440679999999997 12.2016 20.79792 12.55908 20.79816 12.9996V13.5996C20.79816 14.706599999999998 20.79972 15.585479999999999 20.74188 16.29252C20.69064 16.919159999999998 20.59008 17.46492 20.37504 17.96604L20.27544 18.17808C19.873079999999998 18.96792 19.260839999999998 19.628519999999998 18.50952 20.08944L18.17904 20.274599999999996C17.61996 20.559479999999997 17.00868 20.682479999999998 16.292279999999998 20.741039999999998C15.58536 20.798759999999998 14.7072 20.7984 13.60044 20.7984H10.4001C9.293352 20.7984 8.415252 20.798759999999998 7.708296 20.741039999999998C7.08162 20.689799999999998 6.5359799999999995 20.589239999999997 6.034859999999999 20.3742L5.822748 20.274599999999996C5.0327519999999994 19.87212 4.371252 19.26024 3.9102479999999997 18.50856L3.7251 18.17808C3.4403639999999998 17.61924 3.3184080000000002 17.00868 3.2598599999999998 16.29252C3.202092 15.585479999999999 3.2024399999999997 14.706599999999998 3.2024399999999997 13.5996ZM16.15752 3.7359359999999997C17.304119999999998 2.8008 18.99456 2.867628 20.063399999999998 3.9363239999999995L20.2638 4.15782C21.13692 5.228219999999999 21.137159999999998 6.7730760000000005 20.2638 7.843356L20.063399999999998 8.06484L14.007119999999999 14.122319999999998C13.364759999999999 14.76468 12.55488 15.20952 11.673924 15.408959999999999L11.293068 15.47928L9.112212 15.78984C8.863644 15.825239999999999 8.612411999999999 15.74244 8.434859999999999 15.56484C8.257344 15.387239999999998 8.174387999999999 15.13608 8.209859999999999 14.887559999999999L8.521584 12.70776L8.591892 12.3258C8.79144 11.444988 9.236304 10.634892 9.878616 9.992579999999998L15.934919999999998 3.9363239999999995L16.15752 3.7359359999999997Z"
                  />{" "}
                </svg>
                {(!isCollapsed || isXs) && <span>New Chat</span>}
              </button>
              {/* Create Agent */}
              <button
                onClick={() => (window.location.href = "/main/bharat-expert")}
                className={`w-full inline-flex items-center gap-2 px-3 py-2 rounded-md text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isCollapsed && !isXs ? "justify-center" : "justify-start"
                }`}
                title="Create Agent"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="flex-shrink-0"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                {(!isCollapsed || isXs) && <span>Create Agent</span>}
              </button>
              {/* Explore Agents */}
              <button
                onClick={() => (window.location.href = "/bharath-aistore")}
                className={`w-full inline-flex items-center gap-2 px-3 py-2 rounded-md text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isCollapsed && !isXs ? "justify-center" : "justify-start"
                }`}
                title="Explore Agents"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon flex-shrink-0"
                  aria-hidden="true"
                >
                  {" "}
                  <path
                    fill="currentColor"
                    d="M7.94556 14.0277C7.9455 12.9376 7.06204 12.054 5.97192 12.054C4.88191 12.0542 3.99835 12.9376 3.99829 14.0277C3.99829 15.1177 4.88188 16.0012 5.97192 16.0013C7.06207 16.0013 7.94556 15.1178 7.94556 14.0277ZM16.0012 14.0277C16.0012 12.9376 15.1177 12.054 14.0276 12.054C12.9375 12.0541 12.054 12.9376 12.054 14.0277C12.054 15.1178 12.9375 16.0012 14.0276 16.0013C15.1177 16.0013 16.0012 15.1178 16.0012 14.0277ZM7.94556 5.97201C7.94544 4.88196 7.062 3.99837 5.97192 3.99837C4.88195 3.99849 3.99841 4.88203 3.99829 5.97201C3.99829 7.06208 4.88187 7.94552 5.97192 7.94564C7.06207 7.94564 7.94556 7.06216 7.94556 5.97201ZM16.0012 5.97201C16.0011 4.88196 15.1177 3.99837 14.0276 3.99837C12.9376 3.99843 12.0541 4.882 12.054 5.97201C12.054 7.06212 12.9375 7.94558 14.0276 7.94564C15.1177 7.94564 16.0012 7.06216 16.0012 5.97201ZM9.27563 14.0277C9.27563 15.8524 7.79661 17.3314 5.97192 17.3314C4.14734 17.3313 2.66821 15.8523 2.66821 14.0277C2.66827 12.2031 4.14737 10.7241 5.97192 10.724C7.79657 10.724 9.27558 12.203 9.27563 14.0277ZM17.3313 14.0277C17.3313 15.8524 15.8523 17.3314 14.0276 17.3314C12.203 17.3313 10.7239 15.8523 10.7239 14.0277C10.7239 12.2031 12.203 10.724 14.0276 10.724C15.8522 10.724 17.3312 12.203 17.3313 14.0277ZM9.27563 5.97201C9.27563 7.7967 7.79661 9.27572 5.97192 9.27572C4.14734 9.2756 2.66821 7.79662 2.66821 5.97201C2.66833 4.14749 4.14741 2.66841 5.97192 2.6683C7.79654 2.6683 9.27552 4.14742 9.27563 5.97201ZM17.3313 5.97201C17.3313 7.79669 15.8523 9.27572 14.0276 9.27572C12.203 9.27566 10.7239 7.79666 10.7239 5.97201C10.724 4.14746 12.203 2.66836 14.0276 2.6683C15.8522 2.6683 17.3312 4.14742 17.3313 5.97201Z"
                  />{" "}
                </svg>
                {(!isCollapsed || isXs) && <span>Explore Agents</span>}
              </button>
              <button
                onClick={() => (window.location.href = "/main/dashboard/home")}
                className={`w-full inline-flex items-center gap-2 px-3 py-2 rounded-md text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isCollapsed && !isXs ? "justify-center" : "justify-start"
                }`}
                title="ASKOXY.AI"
              >
                <GiLion className="h-5 w-5" />
                {(!isCollapsed || isXs) && <span>ASKOXY.AI</span>}
              </button>{" "}
              <button
                onClick={() => (window.location.href = "/bharath-aistore")}
                className={`w-full inline-flex items-center gap-2 px-3 py-2 rounded-md text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isCollapsed && !isXs ? "justify-center" : "justify-start"
                }`}
                title="Bharat AI Store"
              >
                <GiElephantHead className="h-5 w-5" />
                {(!isCollapsed || isXs) && <span>Bharat AI Store</span>}
                  
              </button>
              {/* Search */}
              {isCollapsed && !isXs ? (
                <button
                  className="w-10 h-10 mx-auto flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setSidebarOpen(true)}
                  title="Search"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              ) : (
                <div className="relative w-full">
                  <input
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search chats"
                    className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pr-10 pl-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none"
                    width="18"
                    height="18"
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
            {/* History List - Updated: Added highlighting for current chat, date display, and ChatGPT-like styling */}
            <div className="px-2 pb-24 overflow-y-auto h-[calc(100vh-56px-48px-64px-56px)]">
              {!isCollapsed || isXs ? (
                <>
                  <div className="p-3 space-y-3 text-xs text-gray-500">
                    Chat History
                  </div>
                  {filteredHistory.length === 0 ? (
                    <div className="text-xs text-gray-500 px-2 py-8">
                      No chats yet.
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {filteredHistory.map((h) => (
                        <li key={h.id} className="group">
                          <button
                            className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-start gap-3 transition-colors ${
                              h.id === currentChatId
                                ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500"
                                : ""
                            }`}
                            onClick={() => openHistoryChat(h.id)}
                            title={h.title}
                          >
                            <div className="flex flex-col flex-1 min-w-0 pt-1">
                              <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                                {h.title}
                              </span>
                              {/* <span className="truncate text-xs text-gray-500">
                                {formatDate(h.createdAt)}
                              </span> */}
                            </div>
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
                        className={`w-9 h-9 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-200 transition ${
                          h.id === currentChatId
                            ? "ring-2 ring-blue-500 ring-inset"
                            : ""
                        }`}
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

            {/* ---------- FOOTER (FIXED LOGOUT BUTTON) ---------- */}
            <div className="flex-shrink-0 border-t border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur p-2">
              <button
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition"
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

                  {!alreadyRated && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          if (alreadyRated) {
                            message.info("You’ve already rated this agent.");
                            return;
                          }
                          setShowRatingModal(true);
                        }}
                        disabled={loadingRatings}
                        title="Rate & Comments"
                        aria-label="Rate and add comments"
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-purple-600 text-white font-medium text-sm shadow-sm hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 transition-colors"
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
                            className={`flex mb-3 sm:mb-4 justify-end group relative gap-2 ${
                              editingIndex === idx ? "w-full" : ""
                            }`}
                          >
                            {editingIndex === idx ? (
                              <div className="text-base my-auto mx-auto pt-12 [--thread-content-margin:--spacing(4)] thread-sm:[--thread-content-margin:--spacing(6)] thread-lg:[--thread-content-margin:--spacing(16)] px-(--thread-content-margin) w-full max-w-3xl">
                                <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-2xl p-4 shadow-md">
                                  <div className="flex items-start gap-3">
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
                                          target.style.height = "auto";
                                          target.style.height =
                                            target.scrollHeight + "px";
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
                                <div className="max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 shadow-md bg-white text-purple-700 dark:bg-gray-900 dark:text-white relative group">
                                  <MarkdownRenderer content={msg.content} />
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
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                      >
                                        <rect
                                          x="9"
                                          y="9"
                                          width="13"
                                          height="13"
                                          rx="2"
                                          ry="2"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleEdit(idx)}
                                      className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-purple-700 dark:text-white"
                                      title="Edit"
                                    >
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                      >
                                        <path
                                          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white mt-2">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <circle
                                      cx="12"
                                      cy="7"
                                      r="4"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      fill="none"
                                    />
                                  </svg>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <div
                            key={idx}
                            className="flex mb-3 sm:mb-4 justify-start gap-2"
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-400 text-white mt-1">
                              <GiElephantHead className="w-5 h-5" />
                            </div>
                            <div className="max-w-[85%] w-full group rounded-2xl p-3 shadow-md bg-white text-purple-700 dark:bg-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">
                              <div className="items-start gap-2 flex-1">
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
                          <div className="flex items-center gap-3 px-4 py-3  dark:bg-gray-800 ">
                            {/* Option 2: Pulse wave */}
                            <div className="flex items-center gap-1">
                              <span className="w-1 h-4 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse-wave"></span>
                              <span className="w-1 h-6 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse-wave animation-delay-150"></span>
                              <span className="w-1 h-8 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse-wave animation-delay-300"></span>
                              <span className="w-1 h-6 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse-wave animation-delay-450"></span>
                              <span className="w-1 h-4 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse-wave animation-delay-600"></span>
                            </div>
                          </div>
                        </div>
                      )}

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
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Composer */}
              <div
                className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-gray-800 dark:via-gray-800/95 dark:to-transparent px-3 sm:px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
                style={{
                  left: effectiveLeftOffset,
                  width: effectiveContentWidth,
                  zIndex: 29,
                }}
              >
                {/* MOBILE: Always visible files panel (simple layout with close button) */}
                {selectedFiles.length > 0 && (
                  <div className="sm:hidden w-full max-w-4xl mx-auto mb-2">
                    <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl p-2 shadow-sm">
                      {selectedFiles.map((f, i) => (
                        <div
                          key={`file_${f.name}_${i}`}
                          className="flex items-center justify-between px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-600 mb-1 last:mb-0"
                        >
                          <span className="text-xs truncate flex-1 mr-2 text-gray-800 dark:text-gray-100">
                            {f.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFileAt(i)}
                            className="text-red-500 hover:text-red-700 text-lg leading-none"
                            title="Remove file"
                            aria-label={`Remove ${f.name}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ===== DESKTOP: Chips row above bar ===== */}
                {selectedFiles.length > 0 && (
                  <div className="hidden sm:block w-full max-w-4xl mx-auto mb-2">
                    <div className="flex flex-wrap gap-2 p-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow">
                      {selectedFiles.map((f, i) => (
                        <div
                          key={`${f.name}_${f.size}_${i}`}
                          className="flex items-center gap-2 px-2 py-1 rounded-full border text-sm bg-gray-50 dark:bg-gray-600"
                        >
                          <span
                            className="truncate max-w-[220px]"
                            title={f.name}
                          >
                            {f.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFileAt(i)}
                            className="rounded-full px-2 py-0.5 hover:bg-red-100 dark:hover:bg-red-800"
                            title="Remove file"
                            aria-label={`Remove ${f.name}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ===== CHAT BAR (mobile-first, responsive grid) ===== */}
                <div className="w-full max-w-4xl mx-auto rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-md focus-within:ring-2 focus-within:ring-indigo-500">
                  {/* Grid: [ + ] [ textarea ] [ mic/send ] on all sizes; spacing adapts */}
                  <div className="grid grid-cols-[auto,1fr,auto] items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3">
                    {/* LEFT: + file picker */}
                    <label className="inline-flex items-center justify-center cursor-pointer">
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFilePicker}
                        accept=".pdf,.doc,.docx,.txt,.csv,.png,.jpg,.jpeg,.webp"
                      />
                      <span
                        className="w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                        title="Add files"
                        aria-label="Add files"
                      >
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                      </span>
                    </label>

                    {/* CENTER: Textarea (grows, no overlap) */}
                    <div className="min-w-0">
                      <textarea
                        rows={1}
                        className="w-full bg-transparent outline-none px-2 py-1 text-sm sm:text-base placeholder-gray-400 dark:placeholder-white text-gray-800 dark:text-white max-h-40 overflow-y-auto resize-y"
                        placeholder={
                          loading
                            ? "Generating reply, please wait..."
                            : "Ask anything..."
                        }
                        value={input}
                        onChange={(e) => !loading && setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                        inputMode="text"
                      />
                    </div>

                    {/* RIGHT: Mic + Send / Stop */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleToggleVoice}
                        className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition ${
                          isRecording
                            ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 animate-pulse"
                            : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                        }`}
                        aria-label="Voice input"
                        title="Voice input"
                      >
                        <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>

                      {loading ? (
                        <button
                          onClick={handleStop}
                          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-red-700 dark:text-white hover:bg-gray-800 hover:text-white transition"
                          title="Stop"
                          aria-label="Stop"
                        >
                          <Square className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            if (selectedFiles.length) {
                              await handleFileUpload(
                                null,
                                input ||
                                  "please describe the file content properly"
                              );
                              setInput("");
                              setShowMobileFiles(false);
                            } else {
                              if (!input.trim()) return;
                              await sendMessage();
                            }
                          }}
                          disabled={
                            (input.trim().length === 0 &&
                              selectedFiles.length === 0) ||
                            loading
                          }
                          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-gray-700 dark:text-white hover:bg-gray-800 hover:text-white disabled:opacity-50 transition"
                          title="Send"
                          aria-label="Send"
                        >
                          <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      )}
                    </div>
                  </div>
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