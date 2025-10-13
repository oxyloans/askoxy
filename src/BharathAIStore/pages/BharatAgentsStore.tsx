// /src/AgentStore/BharatAgentsStore.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Bot, Shield, Loader2, Star, X, Flame } from "lucide-react";
import BASE_URL from "../../Config";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import Highlighter from "../components/Highlighter";

import CA3image from "../../assets/img/ca3.png";

// ---------- constants ----------
const OG_IMAGE = "https://i.ibb.co/h1fpCXzw/fanofog.png";
const ELEPHANT = "https://i.ibb.co/cSPD6dCH/elephantbg.png";

// ---------- types ----------
interface Assistant {
  id?: string;
  assistantId?: string;
  agentId?: string;
  approvedAt?: string | number; // ✅ new field for sorting
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
  hasMore: boolean; // ✅ FIXED: Changed from 'has_more' to 'hasMore' to match API response format
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

// ==== Hidden Agent Filter (add once, near top) ===============================
type AssistantBase = {
  agentId?: string | number;
  assistantId?: string | number;
  id?: string | number;
} & Record<string, any>;

const HIDE_AGENT_IDS = new Set<string>([
  "d1bc5d31-6c7b-4412-9aae-fa8070ad9ff0", // blocklisted agent
]);

export const isHiddenAgent = (a: AssistantBase): boolean => {
  const ids = [a?.agentId, a?.assistantId, a?.id]
    .filter((v): v is string | number => v != null)
    .map((v) => String(v).toLowerCase());
  return ids.some((id) => HIDE_AGENT_IDS.has(id));
};
// =============================================================================

async function getAssistants(
  limit: number,
  after?: string
): Promise<AssistantsResponse> {
  const params: any = { limit };
  if (after) {
    params.after = after;
  }

  const res = await apiClient.get("/ai-service/agent/getAllAssistants", {
    params,
    headers: {
      "Content-Type": "application/json",
      ...(`${process.env.AUTH_TOKEN}`
        ? { Authorization: `Bearer ${process.env.AUTH_TOKEN}` }
        : {}),
    },
  });

  const normalized: Assistant[] = (res.data?.data ?? []).map(
    (assistant: any) => ({
      ...assistant,
      assistantId: assistant.assistantId || assistant.id,
      agentId: assistant.agentId || assistant.id,
      imageUrl:
        assistant.imageUrl || assistant.image || assistant.thumbUrl || "",
    })
  );

  const visible: Assistant[] = normalized.filter(
    (a: Assistant) => !isHiddenAgent(a)
  );

  return {
    object: res.data?.object ?? "list",
    data: normalized,
    hasMore: !!res.data?.hasMore, // ✅ FIXED: Use 'hasMore' to match API response
    firstId: res.data?.firstId,
    lastId: res.data?.lastId,
  };
}
// /ai-service/agent/webSearchForAgent?message=...
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

  const raw: any[] = Array.isArray(res.data)
    ? res.data
    : Array.isArray(res.data?.data)
    ? res.data.data
    : res.data
    ? [res.data]
    : [];

  const mapped: Assistant[] = raw.map(
    (a: any, idx: number): Assistant => ({
      assistantId: a?.assistantId || a?.id || a?.agentId || "",
      agentId: a?.agentId || a?.assistantId || a?.id || "",
      name: a?.name ?? `Agent ${idx + 1}`,
      description: a?.description ?? a?.desc ?? "",
      imageUrl: a?.imageUrl || a?.image || a?.thumbUrl || "",
      ...a,
    })
  );

  const visible: Assistant[] = mapped.filter(
    (a: Assistant) => !isHiddenAgent(a)
  );
  const seen = new Set<string>();
  const deduped: Assistant[] = visible.filter((a: Assistant) => {
    const key = (a.assistantId || a.agentId || "").toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return deduped;
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

const PLAY_COLORS = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"] as const;

const hashSeed = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const gradientFor = (seed: string) => {
  const h = hashSeed(seed || "AI");
  const i1 = h % PLAY_COLORS.length;
  const i2 =
    (i1 + 1 + ((h >> 3) % (PLAY_COLORS.length - 1))) % PLAY_COLORS.length;
  const c1 = PLAY_COLORS[i1];
  const c2 = PLAY_COLORS[i2];
  const angle = [
    [0, 1],
    [1, 0],
    [0, 0],
    [1, 1],
  ][(h >> 7) & 3];
  return { c1, c2, x2: angle[0], y2: angle[1] };
};

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
        "after:shadow-[0_0_0_6px_rgba(147,51,234,0.12)] after:pointer-events-none",
        "transition-transform hover:-translate-y-0.5",
        "h-full flex flex-col", // ✅ equal-height cell
      ].join(" ")}
      aria-label={`Open ${assistant.name}`}
    >
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-lg hover:ring-gray-300 transition overflow-hidden flex flex-col h-full">
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
        <div className="pt-8 px-5 pb-5 flex flex-col h-full">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-[16px] text-gray-900 leading-snug line-clamp-2">
                <Highlighter text={assistant.name || ""} query={q} />
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
                <Highlighter text={assistant.description || ""} query={q} />
              </p>
            </div>

            <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0.5 text-[11px]">
              <Shield className="h-3.5 w-3.5" />
              {badge}
            </span>
          </div>

          {/* Push the CTA to the bottom for alignment */}
          <div className="mt-auto pt-5 flex items-center gap-2">
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
            <h3 className="font-semibold text-[16px] text-gray-900 leading-snug line-clamp-2">
              {title}
            </h3>
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

// const FeaturedOGCard: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
//   const [readMoreOpen, setReadMoreOpen] = useState(false);

//   const shortDesc =
//     "Become a true fan of OG! 🔥 Upload your photo and instantly transform it into a powerful OG-style cinematic poster.";
//   const fullDesc =
//     "Become a true fan of OG! 🔥 Upload your photo and instantly transform it into a powerful OG-style cinematic poster. Share it with friends, show your fandom, and join the #OGFever community. Stand out with personalized OG visuals that capture the spirit of the movie and spread the fever everywhere!";

//   return (
//     <>
//       <div
//         role="button"
//         tabIndex={0}
//         onClick={onOpen}
//         onKeyDown={(e) =>
//           e.key === "Enter" || e.key === " " ? onOpen() : null
//         }
//         className="relative group rounded-2xl shadow-purple-400/60 transition-transform hover:-translate-y-0.5 h-full"
//         aria-label="Open THE FAN OF OG"
//       >
//         <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-lg hover:ring-gray-300 transition overflow-hidden h-full flex flex-col">
//           {/* Thumbnail */}
//           <div className="relative w-full h-52 bg-black">
//             <img
//               src={OG_IMAGE}
//               alt="THE FAN OF OG"
//               className="absolute inset-0 w-full h-full object-cover"
//               loading="eager"
//               decoding="async"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
//             <div className="absolute -bottom-6 left-4 h-12 w-12 rounded-xl bg-white shadow ring-1 ring-gray-200 flex items-center justify-center">
//               <Bot className="h-6 w-6 text-purple-700" />
//             </div>
//           </div>

//           {/* Content */}
//           <div className="pt-8 px-5 pb-5 flex flex-col flex-1">
//             <div className="flex items-start justify-between gap-3">
//               <div className="min-w-0">
//                 <h3 className="font-semibold text-[16px] text-gray-900 leading-snug line-clamp-2">
//                   THE FAN OF OG
//                 </h3>
//                 <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
//                   {shortDesc}
//                 </p>
//                 <button
//                   className="mt-1 text-xs font-medium text-purple-700 hover:underline"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setReadMoreOpen(true);
//                   }}
//                 >
//                   Read more
//                 </button>
//               </div>

//               <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 text-[11px] font-semibold">
//                 <Flame className="h-3.5 w-3.5 text-red-600" />
//                 #OGFever
//               </span>
//             </div>

//             <div className="mt-auto pt-4 flex items-center gap-2">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onOpen();
//                 }}
//                 className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-white text-[13px] font-semibold hover:bg-purple-700 transition"
//               >
//                 Open
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <ReadMoreModal
//         open={readMoreOpen}
//         onClose={() => setReadMoreOpen(false)}
//         title="THE FAN OF OG"
//         body={fullDesc}
//       />
//     </>
//   );
// };

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

  const location = useLocation();
  const [showHero, setShowHero] = useState(false); // 🔑 toggle state

  const [loadingMine, setLoadingMine] = useState(false);

  // 🔽 put these near other React hooks in BharatAgentsStore component:
  const [tab, setTab] = useState<"EXPLORE" | "MINE">("EXPLORE");

  // read once; if not logged in, this will be null and we'll hide the "My Agents" tab
  const loggedInUserId =
    (typeof window !== "undefined" ? localStorage.getItem("userId") : null)
      ?.toString()
      .toLowerCase() || null;

  // who owns an agent? matches any of ownerId / userId / createdBy fields
  const isOwnedBy = (a: any, uid: string | null) => {
    if (!uid) return false;
    const target = uid.toLowerCase();
    const o1 = (a.ownerId || "").toString().toLowerCase();
    const o2 = (a.userId || "").toString().toLowerCase();
    const o3 = (a.createdBy || "").toString().toLowerCase();
    return [o1, o2, o3].some((v) => v && v === target);
  };

  // strictly APPROVED?
  const isApproved = (a: any) =>
    ((a.status || a.agentStatus || "") + "").toUpperCase() === "APPROVED";

  const toggleHero = () => {
    setShowHero((prev) => !prev);
  };

  // ✅ Updated initial pagination state for dynamic loading with pageSize 100
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 30,
    hasMore: true,
    total: 0,
  });

  const PRIORITY_ORDER = [
    "Bharath AI Mission",
    "Nyaya Gpt",
    "IRDAI Enforcement Actions",
    "AI-Based IRDAI GI Reg Audit",
    "GST Reforms 2025",
    "General Insurance Discovery",
    "Criminal Law Expert",
    "AI-Based IRDAI LI Reg Audit by ASKOXY.AI",
    "Life Insurance Citizen Discovery",
  ];

  const priorityIndex = (name?: string) => {
    const n = (name || "").trim().toLowerCase();
    const i = PRIORITY_ORDER.findIndex((x) => x.trim().toLowerCase() === n);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };

  const ALWAYS_SHOW_NAMES = new Set([
    "Bharath AI Mission",
    "Nyaya Gpt",
    "IndiaAI Discovery",
    "Life Insurance Citizen Discovery",
    "IRDAI Enforcement Actions",
    "AI-Based IRDAI GI Reg Audit",
    "GST Reforms 2025",
    "General Insurance Discovery",
    "Criminal Law Expert",
    "AI-Based IRDAI LI Reg Audit by ASKOXY.AI",
  ]);

  const NEXT_PATH = "/main/bharat-expert";
  // const handleCreateAgentClick = () => {
  //   try {
  //     setLoading(true);
  //     const userId = localStorage.getItem("userId");
  //     if (userId) {
  //       navigate(NEXT_PATH);
  //     } else {
  //       sessionStorage.setItem("redirectPath", NEXT_PATH);
  //       navigate(`/whatsapplogin?next=${encodeURIComponent(NEXT_PATH)}`);
  //     }
  //   } catch (e) {
  //     console.error("Create Agent CTA error:", e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/bharat-expert";

      if (userId) {
        navigate(redirectPath);
      } else {
        sessionStorage.setItem("redirectPath", redirectPath);
        sessionStorage.setItem("primaryType", "AGENT"); // Set primary type for agents
        // Pass primaryType as query parameter
        window.location.href = "/whatsappregister?primaryType=AGENT";
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchAssistants = useCallback(
    async (after?: string, isLoadMore = false) => {
      setLoading(true);
      try {
        const response = await getAssistants(pagination.pageSize, after);

        setAssistants((prev) => {
          const merged = isLoadMore
            ? [...prev, ...response.data]
            : response.data;
          // ✅ Deduplicate by ID to avoid duplicates on load more
          const byId = new Map<string, Assistant>();
          for (const a of merged) {
            const key = a.assistantId || a.id || a.agentId || "";
            if (key) byId.set(key, a);
          }
          return Array.from(byId.values());
        });

        // ✅ FIXED: Set nextCursor strictly to response.lastId only if hasMore is true (API uses opaque cursor-based pagination where lastId is the next 'after' token, not necessarily the last item's ID). This prevents incorrect fallback to item ID which could cause overlapping or failed fetches in load more scenarios after initial 100 items.
        const nextCursor = response.hasMore ? response.lastId : undefined;

        // ✅ FIXED: Update firstId only on initial load to preserve overall first cursor; for load more, retain previous firstId.
        setPagination((prev) => ({
          ...prev,
          hasMore: response.hasMore, // ✅ Fixed: Rely on API's hasMore flag
          firstId: isLoadMore ? prev.firstId : response.firstId ?? undefined,
          lastId: nextCursor ?? (isLoadMore ? prev.lastId : undefined),
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

  // 🚀 Auto-fetch all remaining pages when user switches to "My Agents"
  useEffect(() => {
    if (tab !== "MINE") return; // only when My Agents is active
    if (!loggedInUserId) return; // must be logged in
    if (!pagination.hasMore) return; // nothing else to load

    let cancelled = false;

    const loadAllRemaining = async () => {
      setLoadingMine(true);
      try {
        let after = pagination.lastId;
        let hasMore = pagination.hasMore;

        // Keep fetching until API says no more pages (cursor-based)
        while (hasMore && !cancelled) {
          const res = await getAssistants(pagination.pageSize, after);

          // Merge + dedupe by ID
          setAssistants((prev) => {
            const merged = [...prev, ...res.data];
            const byId = new Map<string, Assistant>();
            for (const a of merged) {
              const key = a.assistantId || a.id || a.agentId || "";
              if (key) byId.set(key, a);
            }
            return Array.from(byId.values());
          });

          // Advance the cursor strictly using API's lastId when hasMore = true
          after = res.hasMore ? res.lastId : undefined;
          hasMore = res.hasMore;

          // keep pagination state in sync
          setPagination((prev) => ({
            ...prev,
            hasMore,
            lastId: after,
            firstId: prev.firstId ?? res.firstId,
            total: prev.total + res.data.length,
          }));
        }
      } catch (e) {
        console.error("My Agents auto-load failed:", e);
      } finally {
        if (!cancelled) setLoadingMine(false);
      }
    };

    loadAllRemaining();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tab,
    loggedInUserId,
    pagination.hasMore,
    pagination.lastId,
    pagination.pageSize,
  ]);

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
    const list = (q || "").trim() ? searchResults ?? [] : approvedAssistants;
    return [...list].sort((a, b) => {
      // ✅ New: Sort by approvedAt descending (most recent first)
      const approvedA = a.approvedAt ? new Date(a.approvedAt).getTime() : 0;
      const approvedB = b.approvedAt ? new Date(b.approvedAt).getTime() : 0;
      if (approvedA !== approvedB) {
        return approvedB - approvedA; // Descending order
      }
      const pa = priorityIndex(a.name);
      const pb = priorityIndex(b.name);
      if (pa !== pb) return pa - pb;
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [q, searchResults, approvedAssistants]);

  // your existing `shownAssistants` remains unchanged...

  // mine (approved + owned by me); no search override here per requirement
  const myApprovedAssistants = useMemo(() => {
    if (!loggedInUserId) return [];
    return approvedAssistants.filter(
      (a) => isApproved(a) && isOwnedBy(a, loggedInUserId)
    );
  }, [approvedAssistants, loggedInUserId]);

  // final list shown on screen (tab-aware)
  const finalAssistants =
    tab === "MINE" ? myApprovedAssistants : shownAssistants;

  const SkeletonCard = () => (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden animate-pulse h-full flex flex-col">
      <div className="h-0 pb-[56%] w-full bg-gray-100" />
      <div className="p-4 flex flex-col h-full">
        <div className="h-4 bg-gray-100 rounded w-3/5" />
        <div className="h-3 bg-gray-100 rounded w-4/5 mt-2" />
        <div className="mt-auto pt-4">
          <div className="h-8 w-24 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );

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
                  onClick={handleLogin}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </section>

          {/* SKELETON GRID */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 items-stretch">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h2 className="text-xl font-semibold text-purple-700 mb-2">
            Unable to Load Assistants
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

  const slugify = (s: string) =>
    (s || "agent")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleOpen = (a: Assistant) => {
    if (isHiddenAgent(a)) return;
    // 1) Block guests → hard redirect to WhatsApp login
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) {
      // optional: remember where they were trying to go
      try {
        const nameSlug = ((a?.name as string) || "agent")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        const assistantIdTmp = (a?.assistantId || a?.id || a?.agentId || "")
          .toString()
          .trim();
        const agentIdTmp = (a?.agentId || a?.assistantId || a?.id || "")
          .toString()
          .trim();
        const baseTmp = location.pathname.includes("bharath-aistore")
          ? "bharath-aistore"
          : "bharat-aistore";

        // Build the intended target so you can optionally restore after login
        const intended =
          assistantIdTmp && agentIdTmp
            ? `/${baseTmp}/assistant/${encodeURIComponent(
                assistantIdTmp
              )}/${encodeURIComponent(agentIdTmp)}`
            : assistantIdTmp
            ? `/${baseTmp}/assistant/${encodeURIComponent(assistantIdTmp)}`
            : `/${baseTmp}/assistant/by-name/${encodeURIComponent(nameSlug)}`;

        // ✅ FIXED: Ensure redirectPath is set to the FULL intended path (including any query params if needed)
        // This preserves the exact assistant URL for return after auth success in both register/login
        sessionStorage.setItem("redirectPath", intended);
        // ✅ FIXED: Also set a flag to indicate coming from AI Store for better primaryType detection
        sessionStorage.setItem("fromAISTore", "true");
      } catch {}
      // ✅ FIXED: Use window.location.href to force full page reload, ensuring sessionStorage persists across redirects
      window.location.href = "/whatsappregister?primaryType=AGENT";
      return;
    }

    // 2) Logged-in users → follow existing routing
    const assistantId = (a.assistantId || a.id || a.agentId || "")
      .toString()
      .trim();
    const agentId = (a.agentId || a.assistantId || a.id || "")
      .toString()
      .trim();
    const nameSlug = (a.name || "agent")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const base = location.pathname.includes("bharath-aistore")
      ? "bharath-aistore"
      : "bharat-aistore";

    if (assistantId && agentId) {
      navigate(
        `/${base}/assistant/${encodeURIComponent(
          assistantId
        )}/${encodeURIComponent(agentId)}`
      );
      return;
    }
    if (assistantId) {
      navigate(`/${base}/assistant/${encodeURIComponent(assistantId)}`);
      return;
    }
    navigate(`/${base}/assistant/by-name/${encodeURIComponent(nameSlug)}`);
  };

  const isSearching = !!(q || "").trim();
  const openOG = () => navigate("/ThefanofOG");

  return (
    <div className="min-h-screen bg-white">
      {/* <button
        onClick={toggleHero}
        className="fixed top-50 right-8 z-50 w-2 h-2 rounded-full bg-purple-600 shadow-lg hover:bg-purple-700 transition"
        aria-label="Toggle Hero Section"
      /> */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ==== HERO ==== */}

        {/* ==== HERO ==== */}
        {showHero && (
          <section className="w-full mb-6 sm:mb-8">
            <div className="mx-auto max-w-7xl px-0 py-6 md:py-8 lg:py-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              {/* left text */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-purple-700 leading-tight">
                  Bharat AI Store
                </h1>
                <p className="mt-5 text-lg sm:text-xl text-gray-700 max-w-2xl">
                  Build AI Twin, Executor, Discovery, Validator, and Enabler
                  agents to transform ideas, validate results, execute
                  seamlessly, enable innovation, and discover insights.
                </p>

                <div className="mt-8 hidden sm:flex items-center gap-4">
                  <button
                    onClick={handleLogin}
                    className="inline-flex items-center justify-center rounded-full bg-purple-600 px-6 py-3 text-white font-semibold hover:bg-purple-700"
                  >
                    Create AI Agent →
                  </button>
                </div>
              </div>

              {/* right image */}
              <div className="flex justify-center md:justify-end">
                <div className="relative">
                  <img
                    src={ELEPHANT}
                    alt="Elephant illustration"
                    className="relative z-10 w-72 sm:w-80 md:w-[28rem] h-auto object-contain drop-shadow-xl"
                    loading="eager"
                  />
                </div>
              </div>

              {/* mobile CTA */}
              <div className="sm:hidden">
                <button
                  onClick={handleLogin}
                  className="inline-flex items-center justify-center rounded-full bg-purple-600 px-5 py-3 text-white font-semibold w-full"
                >
                  Create AI Agent →
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="mb-6 sm:mb-8">
          <div className="relative w-full rounded-2xl overflow-hidden">
            <div className="w-full">
              <img
                src={CA3image}
                alt="Header"
                className="w-full h-full object-cover cursor-pointer"
                onClick={handleLogin}
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="mb-4 sm:mb-6">
          <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1">
            <button
              onClick={() => setTab("EXPLORE")}
              className={[
                "px-4 py-2 text-sm font-medium rounded-lg transition",
                tab === "EXPLORE"
                  ? "bg-purple-600 text-white"
                  : "text-gray-700 hover:bg-gray-100",
              ].join(" ")}
              aria-pressed={tab === "EXPLORE"}
            >
              Explore AI Agents
            </button>

            {/* "My Agents" appears only when logged in */}
            {loggedInUserId && (
              <button
                onClick={() => setTab("MINE")}
                className={[
                  "ml-1 px-4 py-2 text-sm font-medium rounded-lg transition",
                  tab === "MINE"
                    ? "bg-purple-600 text-white"
                    : "text-gray-700 hover:bg-gray-100",
                ].join(" ")}
                aria-pressed={tab === "MINE"}
              >
                My Agents
              </button>
            )}
          </div>
        </div>

        {/* Heading & subtext stay the same */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            {tab === "MINE" ? "My Agents" : "AI Agents"}
          </h2>
          <p className="text-sm sm:text-[15px] text-gray-600 mt-1">
            {tab === "MINE"
              ? "Your approved agents"
              : "Discover expert AI Agents."}
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

        {finalAssistants.length === 0 ? (
          <div className="text-center py-16">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              {tab === "MINE"
                ? loggedInUserId
                  ? "No approved agents found for your account."
                  : "Please log in to view your agents."
                : isSearching
                ? "No results found"
                : "No Assistants Found"}
            </h3>
            <p className="text-gray-600">
              {tab === "MINE"
                ? loggedInUserId
                  ? "Create an agent or wait for approval to see it here."
                  : "Sign in to access your personal agents."
                : isSearching
                ? "Try a different search term."
                : "Try a different search term."}
            </p>
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3 gap-5 sm:gap-6 items-stretch">
              {/* Featured OG card first when NOT searching */}
              {/* {!isSearching && <FeaturedOGCard onOpen={openOG} />} */}

              {finalAssistants.map((assistant, index) => (
                <div
                  key={
                    assistant.assistantId ||
                    assistant.id ||
                    assistant.agentId ||
                    `${index}`
                  }
                  className="h-full flex flex-col"
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

            {!isSearching && tab === "EXPLORE" && (
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
                      "View More"
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
