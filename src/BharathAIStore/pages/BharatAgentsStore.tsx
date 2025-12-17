// /src/AgentStore/BharatAgentsStore.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Bot,
  Shield,
  Loader2,
  Star,
  X,
  Copy,
  Flame,
  Share2,
} from "lucide-react";
import BASE_URL from "../../Config";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import Highlighter from "../components/Highlighter";
import VendorCreationModal from "../components/VendorCreationModal";

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
  activeStatus?: boolean; // ✅ NEW: Add activeStatus field
  hideAgent?: boolean;
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

export const isHiddenAgent = (a: any): boolean => {
  return a?.hideAgent === true; // true → hide
};

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
      hideAgent: assistant.hideAgent, // ⭐ added
      imageUrl:
        assistant.profileImagePath?.trim() ||
        assistant.imageUrl?.trim() ||
        assistant.image?.trim() ||
        assistant.thumbUrl?.trim() ||
        "",
    })
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

  const mapped: Assistant[] = raw.map((a: any, idx: number): Assistant => {
    const finalImage =
      a?.profileImagePath?.trim() ||
      a?.imageUrl?.trim() ||
      a?.image?.trim() ||
      a?.thumbUrl?.trim() ||
      "";

    return {
      assistantId: a?.assistantId || a?.id || a?.agentId || "",
      agentId: a?.agentId || a?.assistantId || a?.id || "",
      hideAgent: a?.hideAgent, // ⭐ added
      name: a?.name ?? `Agent ${idx + 1}`,
      description: a?.description ?? a?.desc ?? "",
      imageUrl: finalImage,
    };
  });

  const visible: Assistant[] = mapped.filter((a) => a.hideAgent === false);

  // 🔁 Only exclude agents that are explicitly inactive; allow "undefined"
  const filtered: Assistant[] = visible.filter((a) => a.activeStatus !== false);

  // 🔁 Dedupe by assistant/agent id
  const seen = new Set<string>();
  const deduped: Assistant[] = filtered.filter((a) => {
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
// ---------- reusable assistant card ----------
const AssistantCard: React.FC<{
  assistant: Assistant;
  onOpen: () => void;
  onShare?: () => void;
  onCopy?: () => void;
  index: number;
  q: string;
}> = ({ assistant, onOpen, onShare, onCopy, index, q }) => {
 const badge = (() => {
   const name = (assistant.name || "").trim();
   if (!name) return "AI";

   const words = name.split(/\s+/);
   if (words.length === 1) return words[0][0]?.toUpperCase() || "AI";

   return (words[0][0] + words[1][0]).toUpperCase();
 })();

  const fallbackSVG = makeInitialsSVG(assistant.name || "AI");
  const chosenThumb = (assistant.imageUrl || "").trim() || fallbackSVG;
  const [imgSrc, setImgSrc] = useState<string>(chosenThumb);

  const onCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={onCardKeyDown}
      aria-label={`Open ${assistant.name}`}
      className={[
        "group relative h-full flex flex-col cursor-pointer",
        "rounded-3xl border border-gray-200 bg-white shadow-sm",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-purple-500/30",
      ].join(" ")}
    >
      {/* ✅ IMAGE BOX: rounded on ALL 4 sides */}
      <div className="p-3">
        <div className="relative overflow-hidden rounded-2xl bg-gray-100">
          <div className="relative h-0 w-full pb-[56%]" aria-hidden="true">
            <img
              src={imgSrc}
              alt={`${assistant.name} thumbnail`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
              onError={() => setImgSrc(fallbackSVG)}
            />
          </div>

          {/* ✅ badge inside image (doesn’t break rounding) */}
          <div className="absolute right-3 top-3 rounded-full bg-black/30 px-3 py-1 backdrop-blur-sm">
            <span className="text-[11px] font-bold text-white">{badge}</span>
          </div>

          {/* ✅ bot icon inside image (no overhang outside card) */}
          <div className="absolute left-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 shadow ring-1 ring-gray-200">
            <Bot className="h-5 w-5 text-purple-700" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-5 pb-5 flex flex-col flex-1">
        <h3 className="font-semibold text-[16px] text-gray-900 leading-snug line-clamp-2">
          <Highlighter text={assistant.name || ""} query={q} />
        </h3>

        <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
          <Highlighter text={assistant.description || ""} query={q} />
        </p>

        {/* CTA row pinned to bottom */}
        <div className="mt-auto pt-5 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-4 py-2 text-white text-[13px] font-semibold hover:bg-purple-700 transition"
          >
            Open
          </button>

          {onShare && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-3 py-2 text-gray-600 hover:bg-gray-50 transition"
              aria-label={`Share ${assistant.name}`}
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}

          {onCopy && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCopy();
              }}
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-3 py-2 text-gray-600 hover:bg-gray-50 transition"
              aria-label={`Copy URL for ${assistant.name}`}
              title="Copy URL"
            >
              <Copy className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </article>
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
  const listRef = useRef<HTMLDivElement | null>(null);
  const prevQueryRef = useRef<string>(""); // 🔥 NEW
  const location = useLocation();
  const [showHero, setShowHero] = useState(false); // 🔑 toggle state

  const [loadingMine, setLoadingMine] = useState(false);
  const [vendorModalOpen, setVendorModalOpen] = useState(false);

  // 🔽 put these near other React hooks in BharatAgentsStore component:
  const [tab, setTab] = useState<
    "EXPLORE" | "MINE" | "AISTORES" | "AGENTCREATE" | "AISTORECREATE"
  >("EXPLORE");

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
    pageSize: 50,
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
  // 🔽 Auto-scroll to results when user searches
  useEffect(() => {
    const term = (q || "").trim();
    if (!term) return; // no search → no scroll
    if (searchLoading) return; // wait until results done

    if (listRef.current) {
      listRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [q, searchLoading]);
  // 🔽 When user clears the search, scroll back to top
  useEffect(() => {
    const current = (q || "").trim();
    const prev = (prevQueryRef.current || "").trim();

    // User had some search text before, now it's empty → clear state
    if (!current && prev) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    // Update previous value
    prevQueryRef.current = q || "";
  }, [q]);

  const NEXT_PATH = "/main/agentcreate";

  useEffect(() => {
    sessionStorage.removeItem("primaryType");
    sessionStorage.removeItem("fromAISTore");
    sessionStorage.removeItem("redirectPath");
  }, []);
  // NEW: Add handleCopy function in BharatAgentsStore.tsx (similar to handleShare, but copies URL)
  // Place this near handleShare (around line 400)
  const handleCopy = (a: Assistant) => {
    const slugify = (s: string) =>
      (s || "agent")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    // Extract FULL IDs from API data
    const fullAssistantId = (a.assistantId || a.id || a.agentId || "")
      .toString()
      .trim();
    const fullAgentId = (a.agentId || a.assistantId || a.id || "")
      .toString()
      .trim();
    const nameSlug = slugify(a.name || "agent");

    if (!fullAssistantId || !fullAgentId) return;

    // Shorten IDs to last 4 chars ONLY for URL (as per previous requirement)
    const shortAssistantId = fullAssistantId;
    const shortAgentId = fullAgentId;

    // Generate root-level URL (as per latest route: /:id/:agentId/:agentname)
    const copyUrl = `${window.location.origin}/${encodeURIComponent(
      shortAssistantId
    )}/${encodeURIComponent(shortAgentId)}/${encodeURIComponent(nameSlug)}`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(copyUrl)
      .then(() => {
        // Success message (use your preferred toast/alert - here simple alert, replace with antd message if available)
        alert(`Copied URL: ${copyUrl}`); // Or: message.success("URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err);
        alert("Failed to copy URL - please try manually.");
      });
  };
  // Updated handleShare function (replace the entire function in BharatAgentsStore.tsx)
  // REMOVED: "/bharath-aistore/assistant" prefix - now root-level "/:id/:agentId/:agentname"
  const handleShare = (a: Assistant) => {
    // slugify defined here if not global (or import it)
    const slugify = (s: string) =>
      (s || "agent")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    // Extract FULL IDs from API data
    const fullAssistantId = (a.assistantId || a.id || a.agentId || "")
      .toString()
      .trim();
    const fullAgentId = (a.agentId || a.assistantId || a.id || "")
      .toString()
      .trim();
    const nameSlug = slugify(a.name || "agent");

    if (!fullAssistantId || !fullAgentId) return;

    // NEW: Shorten IDs to last 4 chars ONLY for URL (full IDs kept internally)
    const shortAssistantId = fullAssistantId;
    const shortAgentId = fullAgentId;

    // Debug log: Full vs short
    console.log("FULL IDs (for APIs/state):", { fullAssistantId, fullAgentId });
    console.log("SHORT IDs (for share URL only):", {
      shortAssistantId,
      shortAgentId,
    });

    // UPDATED: Root-level URL without "/bharath-aistore/assistant" prefix
    const shareUrl = `${window.location.origin}/${encodeURIComponent(
      shortAssistantId
    )}/${encodeURIComponent(shortAgentId)}/${encodeURIComponent(nameSlug)}`;

    // 🌟 Static share content (uses full name, short root-level URL)
    const staticMessage = `
🌟 Check out this amazing AI Agent on Bharat AI Store!

🤖 Agent Name: ${a.name || "AI Agent"}

This AI Agent is created on ASKOXY.AI — a platform where anyone can build AI Agents, learn skills, and earn money!

🔗 Access the AI Agent here:
${shareUrl}

Create your own AI Agent today on ASKOXY.AI! 🚀
  `.trim();

    // 📱 Native share sheet (mobile + supported browsers)
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      (navigator as any)
        .share({
          title: a.name || "AI Agent - Bharat AI Store",
          // IMPORTANT: put everything (including link) inside text
          text: staticMessage,
        })
        .catch(() => {});
      return;
    }

    // 💬 WhatsApp fallback (desktop & mobile)
    const whatsappUrl =
      "https://api.whatsapp.com/send?text=" + encodeURIComponent(staticMessage);

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };
  const handleLogin1 = () => {
    setTab("AISTORECREATE");
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/usercreateaistore";

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
  const handleLogin = () => {
    setTab("AGENTCREATE");
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/agentcreate";

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
        console.error("My AI Agents auto-load failed:", e);
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
      if (a.hideAgent === true) return false; // ❌ hide
      const s = (a.status || a.agentStatus || "").toString().toUpperCase();
      const name = (a.name || "").trim().toLowerCase();
      const isApproved = s === "APPROVED";
      const isWhitelisted = Array.from(ALWAYS_SHOW_NAMES).some(
        (n) => n.toLowerCase() === name
      );
      const isActive = a.activeStatus !== false;
      return (isApproved || isWhitelisted) && isActive;
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 items-stretch">
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

  // Updated handleOpen function (replace the entire function in BharatAgentsStore.tsx)
  // REMOVED: "/bharath-aistore/assistant" prefix - now root-level "/:id/:agentId/:agentname"
  const handleOpen = (a: Assistant) => {
    if (isHiddenAgent(a)) return;

    // Extract FULL IDs from API data (no truncation)
    const fullAssistantId = (a.assistantId || a.id || a.agentId || "")
      .toString()
      .trim();
    const fullAgentId = (a.agentId || a.assistantId || a.id || "")
      .toString()
      .trim();
    const nameSlug = slugify(a.name || "agent");

    // NEW: Shorten IDs to last 4 chars ONLY for URL (full IDs kept for APIs/state)
    const shortAssistantId = fullAssistantId;
    const shortAgentId = fullAgentId;

    // Debug log: Check full vs short values in console
    console.log("FULL IDs (for APIs/state):", {
      fullAssistantId,
      fullAgentId,
      nameSlug,
    });
    console.log("SHORT IDs (for URL only):", {
      shortAssistantId,
      shortAgentId,
    });

    // 1) Guest redirect: Save SHORT path for URL (root-level), but FULL IDs in session for post-login APIs
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) {
      let intended = "";
      if (fullAssistantId && fullAgentId && nameSlug) {
        intended = `/${encodeURIComponent(
          shortAssistantId
        )}/${encodeURIComponent(shortAgentId)}/${encodeURIComponent(nameSlug)}`;
        // Save FULL IDs in session for restore after login (used in AssistantDetails APIs)
        sessionStorage.setItem("fullAssistantId", fullAssistantId);
        sessionStorage.setItem("fullAgentId", fullAgentId);
      } else if (fullAssistantId && fullAgentId) {
        intended = `/${encodeURIComponent(
          shortAssistantId
        )}/${encodeURIComponent(shortAgentId)}`;
        sessionStorage.setItem("fullAssistantId", fullAssistantId);
        sessionStorage.setItem("fullAgentId", fullAgentId);
      } else if (fullAssistantId) {
        intended = `/${encodeURIComponent(shortAssistantId)}`;
        sessionStorage.setItem("fullAssistantId", fullAssistantId);
      } else {
        intended = `/by-name/${encodeURIComponent(nameSlug)}`;
      }
      sessionStorage.setItem("redirectPath", intended);
      sessionStorage.setItem("fromAISTore", "true");
      window.location.href = "/whatsappregister?primaryType=AGENT";
      return;
    }

    // 2) Logged-in: Navigate with SHORT ENCODED path (root-level, no base/assistant prefix)
    let targetPath = "";
    if (fullAssistantId && fullAgentId && nameSlug) {
      targetPath = `/${encodeURIComponent(
        shortAssistantId
      )}/${encodeURIComponent(shortAgentId)}/${encodeURIComponent(nameSlug)}`;
    } else if (fullAssistantId && fullAgentId) {
      targetPath = `/${encodeURIComponent(
        shortAssistantId
      )}/${encodeURIComponent(shortAgentId)}`;
    } else if (fullAssistantId) {
      targetPath = `/${encodeURIComponent(shortAssistantId)}`;
    } else {
      targetPath = `/by-name/${encodeURIComponent(nameSlug)}`;
    }

    // Final log: Generated URL (short IDs only, root-level)
    console.log("Short URL target (4 chars only, no prefix):", targetPath);
    navigate(targetPath);
  };
  const isSearching = !!(q || "").trim();
  const handleAistoresClick = () => {
    setTab("AISTORES");
    navigate("/all-ai-stores");
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
        <div ref={listRef}>
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
              {/* Tabs capsule - full-width container with horizontal scroll */}
              <div className="w-full">
                <div className="w-full overflow-x-auto">
                  <div className="inline-flex flex-nowrap items-center gap-1 sm:gap-2 rounded-lg bg-white p-1">
                    {/* Explore AI Agents */}
                    <button
                      onClick={() => setTab("EXPLORE")}
                      className={[
                        "shrink-0 whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition",
                        "focus:outline-none focus:ring-2 focus:ring-purple-400",
                        tab === "EXPLORE"
                          ? "bg-purple-600 text-white"
                          : "text-gray-700 hover:bg-gray-100",
                      ].join(" ")}
                      aria-pressed={tab === "EXPLORE"}
                    >
                      Explore AI Agents
                    </button>

                    {/* My AI Agents (only if logged in) */}
                    {loggedInUserId && (
                      <button
                        onClick={() => setTab("MINE")}
                        className={[
                          "shrink-0 whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition",
                          "focus:outline-none focus:ring-2 focus:ring-purple-400",
                          tab === "MINE"
                            ? "bg-purple-600 text-white"
                            : "text-gray-700 hover:bg-gray-100",
                        ].join(" ")}
                        aria-pressed={tab === "MINE"}
                      >
                        My AI Agents
                      </button>
                    )}

                    {/* Explore AI Stores */}
                    <button
                      onClick={handleAistoresClick}
                      className={[
                        "shrink-0 whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition",
                        "focus:outline-none focus:ring-2 focus:ring-purple-400",
                        tab === "AISTORES"
                          ? "bg-purple-600 text-white"
                          : "text-gray-700 hover:bg-gray-100",
                      ].join(" ")}
                      aria-pressed={tab === "AISTORES"}
                    >
                      Explore AI Stores
                    </button>

                    {/* Create AI Agent */}
                    <button
                      onClick={handleLogin}
                      className={[
                        "shrink-0 whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition",
                        "focus:outline-none focus:ring-2 focus:ring-purple-400",
                        tab === "AGENTCREATE"
                          ? "bg-purple-600 text-white"
                          : "text-gray-700 hover:bg-gray-100",
                      ].join(" ")}
                      aria-pressed={tab === "AGENTCREATE"}
                    >
                      Create AI Agent
                    </button>

                    {/* Create AI Store */}
                    <button
                      onClick={handleLogin1}
                      className={[
                        "shrink-0 whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition",
                        "focus:outline-none focus:ring-2 focus:ring-purple-400",
                        tab === "AISTORECREATE"
                          ? "bg-purple-600 text-white"
                          : "text-gray-700 hover:bg-gray-100",
                      ].join(" ")}
                      aria-pressed={tab === "AISTORECREATE"}
                    >
                      Create AI Store
                    </button>

                    {/* KYC Verification */}
                    <button
                      onClick={() => {
                        const userId = localStorage.getItem("userId");
                        if (userId) {
                          setVendorModalOpen(true);
                        } else {
                          sessionStorage.setItem(
                            "redirectPath",
                            "/main/bharath-aistore/agents"
                          );
                          sessionStorage.setItem("primaryType", "AGENT");
                          window.location.href =
                            "/whatsappregister?primaryType=AGENT";
                        }
                      }}
                      className={[
                        "shrink-0 whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition",
                        "focus:outline-none focus:ring-2 focus:ring-purple-400",
                        "text-gray-700 hover:bg-gray-100",
                      ].join(" ")}
                    >
                      KYC Verification
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Heading & subtext stay the same */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            {tab === "MINE" ? "My AI Agents" : "AI Agents"}
          </h2>
          <p className="text-sm sm:text-[15px] text-gray-600 mt-1">
            {tab === "MINE" ? "Approved agents" : "Discover expert AI Agents."}
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

        {tab === "MINE" && loadingMine && myApprovedAssistants.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3 gap-5 sm:gap-6 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`mine-skel-${i}`}
                className="animate-pulse bg-gray-200 dark:bg-gray-700 h-52 rounded-xl"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "1.2s",
                }}
              />
            ))}
          </div>
        ) : finalAssistants.length === 0 ? (
          // 🧾 Empty state (shown only after loading finishes)
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
            {/* ✅ Grid of real cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 items-stretch">
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
                    onShare={() => handleShare(assistant)}
                    onCopy={() => handleCopy(assistant)} // NEW: Pass onCopy
                  />
                </div>
              ))}
            </div>

            {/* Explore pagination (unchanged) */}
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
      <VendorCreationModal
        isOpen={vendorModalOpen}
        onClose={() => setVendorModalOpen(false)}
      />
    </div>
  );
};

export default BharatAgentsStore;
