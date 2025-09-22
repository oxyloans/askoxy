// /src/AgentStore/BharatAgentsStore.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Bot, Shield, Loader2, Star, X, Flame } from "lucide-react";
import BASE_URL from "../../Config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import Highlighter from "../components/Highlighter";

import CA3image from "../../assets/img/ca3.png";

// ---------- constants ----------
const OG_IMAGE = "https://i.ibb.co/h1fpCXzw/fanofog.png";

// ---------- types ----------
interface Assistant {
  id?: string;
  assistantId?: string;
  agentId?: string;
  object?: string;
  created_at?: number;
  createdAt?: number | string;
  name: string;
  description?: string;
  model?: string;
  instructions?: string;
  tools?: any[];
  top_p?: number;
  temperature?: number;
  reasoning_effort?: null | string;
  tool_used?: string;
  toolUsed?: string;
  tool_resources?: any;
  metadata?: any;
  response_format?: string;
  status?: string;
  agentStatus?: string;
  imageUrl?: string; // ✅ new
}

interface AssistantsResponse {
  object: string;
  data: Assistant[];
  has_more: boolean;
  firstId?: string;
  lastId?: string;
}

interface PaginationState {
  pageSize: number;
  hasMore: boolean;
  firstId?: string;
  lastId?: string;
  total: number;
}

// ---------- api ----------
const apiClient = axios.create({ baseURL: BASE_URL });

async function getAssistants(
  limit = 50,
  after?: string
): Promise<AssistantsResponse> {
  const res = await apiClient.get("/ai-service/agent/getAllAssistants", {
    headers: {
      "Content-Type": "application/json",
      ...(`${process.env.AUTH_TOKEN}`
        ? { Authorization: `Bearer ${process.env.AUTH_TOKEN}` }
        : {}),
    },
    params: { limit, after },
  });

  const normalized = (res.data?.data ?? []).map((assistant: any) => ({
    ...assistant,
    assistantId: assistant.assistantId || assistant.id,
    agentId: assistant.agentId || assistant.id,
    imageUrl: assistant.imageUrl || assistant.image || assistant.thumbUrl || "",
  }));

  return {
    object: res.data?.object ?? "list",
    data: normalized,
    // 🔑 normalize names here
    has_more: !!res.data?.has_more,
    firstId: res.data?.firstId,
    lastId: res.data?.lastId,
  };
}

// Search API → /ai-service/agent/webSearchForAgent?message=...
async function searchAssistants(query: string): Promise<Assistant[]> {
  const res = await apiClient.get("/ai-service/agent/webSearchForAgent", {
    params: { message: query },
    headers: {
      "Content-Type": "application/json",
      ...(`${process.env.AUTH_TOKEN}`
        ? { Authorization: `Bearer ${process.env.AUTH_TOKEN}` }
        : {}),
    },
  });

  const raw = Array.isArray(res.data)
    ? res.data
    : Array.isArray(res.data?.data)
    ? res.data.data
    : res.data
    ? [res.data]
    : [];

  return raw.map((a: any, idx: number) => ({
    ...a,
    name: a.name ?? `Agent ${idx + 1}`,
    description: a.description ?? a.desc ?? "",
    assistantId: a.assistantId || a.id || a.agentId,
    agentId: a.agentId || a.assistantId || a.id,
    status: a.status || a.agentStatus,
    imageUrl: a.imageUrl || a.image || a.thumbUrl || "", // ✅ carry through image
  }));
}

// ---------- helpers ----------

const normalizeList = (data: any) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return data ? [data] : [];
};

// Feedback API → /ai-service/agent/feedbackByAgentId?agentId=...
export interface Feedback {
  id: string;
  userId?: string;
  agentId?: string;
  agentName?: string;
  feedbackRating?: number;
  feedbackComments?: string;
  createdAt?: string;
}

async function getFeedbackByAgent(agentId: string): Promise<Feedback[] | null> {
  try {
    const res = await apiClient.get("/ai-service/agent/feedbackByAgentId", {
      params: { agentId },
      headers: { "Content-Type": "application/json" },
    });
    return normalizeList(res.data) as Feedback[];
  } catch {
    return null;
  }
}
// Google Play palette (brand-adjacent)
const PLAY_COLORS = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"] as const;

const hashSeed = (s: string) => {
  // simple deterministic 32-bit hash
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const gradientFor = (seed: string) => {
  const h = hashSeed(seed || "AI");
  // pick two distinct palette colors
  const i1 = h % PLAY_COLORS.length;
  const i2 =
    (i1 + 1 + ((h >> 3) % (PLAY_COLORS.length - 1))) % PLAY_COLORS.length;
  const c1 = PLAY_COLORS[i1];
  const c2 = PLAY_COLORS[i2];
  // vary angle a bit so not all look identical
  const angle = [
    [0, 1],
    [1, 0],
    [0, 0],
    [1, 1],
  ][(h >> 7) & 3]; // [x2,y2]
  return { c1, c2, x2: angle[0], y2: angle[1] };
};

// Build a data-URL SVG avatar with initials (Play Store style gradient)
function makeInitialsSVG(name: string) {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "AI";

  const { c1, c2, x2, y2 } = gradientFor(name || "AI");

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" role="img" aria-label="${initials}">
  <defs>
    <!-- diagonal gradient using Google Play-like colors -->
    <linearGradient id="g" x1="0" y1="0" x2="${x2}" y2="${y2}">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" rx="28" ry="28" fill="url(#g)"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
        font-size="180" fill="rgba(255,255,255,0.96)" letter-spacing="6">${initials}</text>
</svg>`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// ---------- reusable assistant card ----------
const AssistantCard: React.FC<{
  assistant: Assistant;
  onOpen: () => void;
  index: number;
  q: string;
}> = ({ assistant, onOpen, index, q }) => {
  const seed = assistant.name || `A${index}`;
  const badge =
    (assistant.metadata && (assistant.metadata.category as string)) || "Tools";

  const fallbackSVG = makeInitialsSVG(assistant.name || "AI");
  const chosenThumb = (assistant.imageUrl || "").trim() || fallbackSVG;
  // Keep a stateful src that swaps to fallback on error
  const [imgSrc, setImgSrc] = useState<string>(chosenThumb);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? onOpen() : null)}
      className={[
        "relative group cursor-pointer rounded-2xl",
        "shadow-purple-400/60",
        "after:absolute after:-inset-[2px] after:rounded-2xl after:content-[''] after:-z-10",
        "after:shadow-[0_0_0_6px_rgba(147,51,234,0.12)]",
        "after:pointer-events-none after:animate-pulse",
        "transition-transform hover:-translate-y-0.5",
      ].join(" ")}
      aria-label={`Open ${assistant.name}`}
    >
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-lg hover:ring-gray-300 transition overflow-hidden">
        {/* Thumbnail / Header */}
        <div className="relative w-full">
          <div
            className="h-0 w-full pb-[56%] overflow-hidden"
            aria-hidden="true"
          >
            <img
              src={imgSrc}
              alt={`${assistant.name} thumbnail`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={() => setImgSrc(fallbackSVG)}
            />
          </div>
          <div className="absolute -bottom-6 left-4 h-12 w-12 rounded-xl bg-white shadow ring-1 ring-gray-200 flex items-center justify-center">
            <Bot className="h-6 w-6 text-purple-700" />
          </div>
        </div>

        {/* Content */}
        <div className="pt-8 px-5 pb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-[16px] text-gray-900 line-clamp-1 leading-snug">
                <Highlighter text={assistant.name || ""} query={q} />
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-5 ">
                <Highlighter text={assistant.description || ""} query={q} />
              </p>
            </div>

            <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0.5 text-[11px]">
              <Shield className="h-3.5 w-3.5" />
              {badge}
            </span>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={onOpen}
              className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-white text-[13px] font-semibold hover:bg-purple-700 transition"
            >
              Open
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReadMoreModal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  body: string;
}> = ({ open, onClose, title, body }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{body}</p>
          </div>
          <div className="px-5 pb-5">
            <button
              className="ml-auto block px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedOGCard: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const [readMoreOpen, setReadMoreOpen] = useState(false);

  const shortDesc =
    "Become a true fan of OG! 🔥 Upload your photo and instantly transform it into a powerful OG-style cinematic poster.";
  const fullDesc =
    "Become a true fan of OG! 🔥 Upload your photo and instantly transform it into a powerful OG-style cinematic poster. Share it with friends, show your fandom, and join the #OGFever community. Stand out with personalized OG visuals that capture the spirit of the movie and spread the fever everywhere!";

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) =>
          e.key === "Enter" || e.key === " " ? onOpen() : null
        }
        className="relative group rounded-2xl shadow-purple-400/60 transition-transform hover:-translate-y-0.5 h-full"
        aria-label="Open THE FAN OF OG"
      >
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-lg hover:ring-gray-300 transition overflow-hidden h-full flex flex-col">
          {/* Thumbnail */}
          <div className="relative w-full h-52 bg-black">
            <img
              src={OG_IMAGE}
              alt="THE FAN OF OG"
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute -bottom-6 left-4 h-12 w-12 rounded-xl bg-white shadow ring-1 ring-gray-200 flex items-center justify-center">
              <Bot className="h-6 w-6 text-purple-700" />
            </div>
          </div>

          {/* Content */}
          <div className="pt-8 px-5 pb-5 flex flex-col flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-[16px] text-gray-900 leading-snug">
                  THE FAN OF OG
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {shortDesc}
                </p>
                <button
                  className="mt-1 text-xs font-medium text-purple-700 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReadMoreOpen(true);
                  }}
                >
                  Read more
                </button>
              </div>

              {/* 🔥 #OGFever Badge */}
              <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 text-[11px] font-semibold">
                <Flame className="h-3.5 w-3.5 text-red-600" />
                #OGFever
              </span>
            </div>

            <div className="flex-1" />

            {/* Action buttons */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
                className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-white text-[13px] font-semibold hover:bg-purple-700 transition"
              >
                Open
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Read More Modal */}
      <ReadMoreModal
        open={readMoreOpen}
        onClose={() => setReadMoreOpen(false)}
        title="THE FAN OF OG"
        body={fullDesc}
      />
    </>
  );
};

// ---------- page ----------
const BharatAgentsStore: React.FC = () => {
  const navigate = useNavigate();
  const { debouncedQuery: q } = useSearch();

  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [searchResults, setSearchResults] = useState<Assistant[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

const [pagination, setPagination] = useState<PaginationState>({
  pageSize: 100,  // ⬅️ bump to 100
  hasMore: true,
  total: 0,
});

const PRIORITY_ORDER = [
  "Bharath AI Mission",
  "Nyaya Gpt",
  "IndiaAI Discovery",
  "IRDAI Enforcement Actions",
  "AI-Based IRDAI GI Reg Audit",
  "GST Reforms 2025",
  "General Insurance Discovery",
  "Criminal Law Expert",
  "Advocate Law",
  "AI-Based IRDAI LI Reg Audit by ASKOXY.AI",
];

const priorityIndex = (name?: string) => {
  const n = (name || "").trim().toLowerCase();
  const i = PRIORITY_ORDER.findIndex(
    (x) => x.trim().toLowerCase() === n
  );
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
};
  const ALWAYS_SHOW_NAMES = new Set([
    "Bharath AI Mission",
    "Nyaya Gpt",
    "IndiaAI Discovery",
    "IRDAI Enforcement Actions",
    "AI-Based IRDAI GI Reg Audit",
    "GST Reforms 2025",
    "General Insurance Discovery",
    "Criminal Law Expert",
    "Advocate Law",
    "AI-Based IRDAI LI Reg Audit by ASKOXY.AI",
  ]);

  const NEXT_PATH = "/main/bharat-expert";
  const handleCreateAgentClick = () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      if (userId) {
        navigate(NEXT_PATH);
      } else {
        sessionStorage.setItem("redirectPath", NEXT_PATH);
        navigate(`/whatsapplogin?next=${encodeURIComponent(NEXT_PATH)}`);
      }
    } catch (e) {
      console.error("Create Agent CTA error:", e);
    } finally {
      setLoading(false);
    }
  };
// 2) inside fetchAssistants
const fetchAssistants = useCallback(
  async (after?: string, isLoadMore = false) => {
    setLoading(true);
    try {
      const response = await getAssistants(pagination.pageSize, after);

      // ⬇️ de-dupe by id/assistantId/agentId
      setAssistants((prev) => {
        const merged = isLoadMore ? [...prev, ...response.data] : response.data;
        const byId = new Map<string, Assistant>();
        for (const a of merged) {
          const key = a.assistantId || a.id || a.agentId || "";
          if (key) byId.set(key, a);
        }
        return Array.from(byId.values());
      });

      // ⬇️ robust next cursor
      const nextCursor =
        response.lastId ||
        response.data[response.data.length - 1]?.assistantId ||
        response.data[response.data.length - 1]?.id ||
        response.data[response.data.length - 1]?.agentId ||
        undefined;

      // ⬇️ compute hasMore even if API doesn't set has_more
      const pageFull = response.data.length >= pagination.pageSize;

      setPagination((prev) => ({
        ...prev,
        hasMore: Boolean(response.has_more ?? pageFull),
        firstId: response.firstId ?? prev.firstId,
        lastId: nextCursor ?? prev.lastId,
        total: isLoadMore
          ? prev.total + response.data.length
          : response.data.length,
      }));
    } catch (err) {
      console.error("Error fetching assistants:", err);
      setError("Failed to load assistants");
    } finally {
      setLoading(false);
    }
  },
  [pagination.pageSize]
);


  useEffect(() => {
    fetchAssistants();
  }, [fetchAssistants]);

  // Keep APPROVED + whitelist for default (no search)
  const approvedAssistants = useMemo(() => {
    return assistants.filter((a) => {
      const s = (a.status || a.agentStatus || "").toString().toUpperCase();
      const name = (a.name || "").trim().toLowerCase();
      const isApproved = s === "APPROVED";
      const isWhitelisted = Array.from(ALWAYS_SHOW_NAMES).some(
        (n) => n.toLowerCase() === name
      );
      return isApproved || isWhitelisted;
    });
  }, [assistants]);

  // SEARCH: call API when q changes (non-empty)
  useEffect(() => {
    let active = true;
    const doSearch = async () => {
      const term = (q || "").trim();
      if (!term) {
        setSearchResults(null);
        setSearchError(null);
        return;
      }
      try {
        setSearchLoading(true);
        setSearchError(null);
        const results = await searchAssistants(term);
        if (!active) return;
        setSearchResults(results);
      } catch (e: any) {
        console.error("Search API failed:", e);
        if (!active) return;
        setSearchResults([]);
        setSearchError(
          e?.response?.data?.message || e?.message || "Search failed"
        );
      } finally {
        if (active) setSearchLoading(false);
      }
    };
    doSearch();
    return () => {
      active = false;
    };
  }, [q]);

const shownAssistants = useMemo<Assistant[]>(() => {
  const list = (q || "").trim() ? (searchResults ?? []) : approvedAssistants;
  return [...list].sort((a, b) => {
    const pa = priorityIndex(a.name);
    const pb = priorityIndex(b.name);
    if (pa !== pb) return pa - pb;                 // priority first
    return (a.name || "").localeCompare(b.name || ""); // stable order next
  });
}, [q, searchResults, approvedAssistants]);


  const SkeletonCard = () => (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden animate-pulse">
      <div className="h-0 pb-[56%] w-full bg-gray-100" />
      <div className="p-4">
        <div className="h-4 bg-gray-100 rounded w-3/5" />
        <div className="h-3 bg-gray-100 rounded w-4/5 mt-2" />
        <div className="flex items-center gap-2 mt-4">
          <div className="h-8 w-20 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );

  // Initial load skeleton (default list)
  if (loading && assistants.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <section className="mb-6 sm:mb-8">
            <div className="relative w-full rounded-2xl overflow-hidden">
              <div className="w-full">
                <img
                  src={CA3image}
                  alt="Header"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={handleCreateAgentClick}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </section>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              Bharat AI Store
            </h2>
            <p className="text-sm sm:text-[15px] text-gray-600 mt-1">
              Discover expert AI assistants.
            </p>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Error loading default list
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h2 className="text-xl font-semibold text-purple-700 mb-2">
            Error Loading Assistants
          </h2>
          <p className="text-gray-500 mb-5">{error}</p>
          <button
            onClick={() => fetchAssistants()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleOpen = (a: Assistant) => {
    const assistantId = a.assistantId || a.id || a.agentId;
    const agentId = a.agentId || a.assistantId || a.id;
    if (!assistantId) return;
    navigate(`/bharath-aistore/assistant/${assistantId}/${agentId}`);
  };

  const isSearching = !!(q || "").trim();

  // Route handler for the featured OG card
  const openOG = () => navigate("/ThefanofOG");

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <section className="mb-6 sm:mb-8">
          <div className="relative w-full rounded-2xl overflow-hidden">
            <div className="w-full">
              <img
                src={CA3image}
                alt="Header"
                className="w-full h-full object-cover cursor-pointer"
                onClick={handleCreateAgentClick}
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </section>

        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            Bharat AI Store
          </h2>
          <p className="text-sm sm:text-[15px] text-gray-600 mt-1">
            Discover expert AI assistants.
          </p>
        </div>

        {/* Search state: loading & errors */}
        {isSearching && searchLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching “{q}”…
          </div>
        )}
        {isSearching && searchError && (
          <div className="text-sm text-red-600 mb-4">{searchError}</div>
        )}

        {shownAssistants.length === 0 ? (
          <div className="text-center py-16">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              {isSearching ? "No results found" : "No Assistants Found"}
            </h3>
            <p className="text-gray-600">
              {isSearching
                ? "Try a different search term."
                : "Try a different search term."}
            </p>
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3 gap-5 sm:gap-6">
              {/* 👉 Featured OG card appears first only when NOT searching */}
              {!isSearching && <FeaturedOGCard onOpen={openOG} />}

              {shownAssistants.map((assistant, index) => (
                <div
                  key={
                    assistant.assistantId ||
                    assistant.id ||
                    assistant.agentId ||
                    `${index}`
                  }
                  className="flex flex-col h-full"
                >
                  <AssistantCard
                    assistant={assistant}
                    index={index}
                    q={q || ""}
                    onOpen={() => handleOpen(assistant)}
                  />
                </div>
              ))}
            </div>

            {/* Only show "Load More" in the default (non-search) list */}
            {!isSearching && (
              <div className="text-center mt-10 sm:mt-12">
                <button
                  onClick={() => fetchAssistants(pagination.lastId, true)}
                  disabled={!pagination.hasMore || loading}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {pagination.hasMore ? (
                    loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading…
                      </>
                    ) : (
                      "Load More"
                    )
                  ) : (
                    "All results loaded"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default BharatAgentsStore;
