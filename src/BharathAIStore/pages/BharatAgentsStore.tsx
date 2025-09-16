// /src/AgentStore/BharatAgentsStore.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Bot, Shield, Loader2 } from "lucide-react";
import BASE_URL from "../../Config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import Highlighter from "../components/Highlighter";

import CA3image from "../../assets/img/ca3.png";

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
}

interface AssistantsResponse {
  object: string;
  data: Assistant[];
  has_more: boolean;
  first_id?: string;
  last_id?: string;
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

async function getAssistants(limit = 50, after?: string): Promise<AssistantsResponse> {

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
  }));

  return {
    object: res.data?.object ?? "list",
    data: normalized,
    has_more: !!res.data?.has_more,
    first_id: res.data?.first_id,
    last_id: res.data?.last_id,
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

  // Defensive parsing for multiple shapes
  const raw = Array.isArray(res.data)
    ? res.data
    : Array.isArray(res.data?.data)
    ? res.data.data
    : res.data
    ? [res.data]
    : [];

  // Normalize fields we rely on
  return raw.map((a: any, idx: number) => ({
    ...a,
    name: a.name ?? `Agent ${idx + 1}`,
    description: a.description ?? a.desc ?? "",
    assistantId: a.assistantId || a.id || a.agentId,
    agentId: a.agentId || a.assistantId || a.id,
    status: a.status || a.agentStatus, // if present, fine; search results may not filter by status
  }));
}

// ---------- image mapping ----------
const IMAGE_MAP: { [key: string]: string } = {
 
  code: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
  finance:
    "https://media.licdn.com/dms/image/v2/D4D12AQH9ZTLfemnJgA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1730530043865?e=2147483647&v=beta&t=3GgdQbowwhu3jbuft6-XG2_jPZUSLa0XiCRgSz6AqBg",
  business:
    "https://media.istockphoto.com/id/1480239160/photo/an-analyst-uses-a-computer-and-dashboard-for-data-business-analysis-and-data-management.jpg?s=612x612&w=0&k=20&c=Zng3q0-BD8rEl0r6ZYZY0fbt2AWO9q_gC8lSrwCIgdk=",
  technology:
    "https://www.bluefin.com/wp-content/uploads/2020/08/ai-future.jpg",
  irdai:
    "https://www.livemint.com/lm-img/img/2024/05/30/600x338/Irdai_health_insurance_1717036677791_1717036677946.png",
  gst: "https://zetran.com/wp-content/uploads/2025/02/GST-Compliance-and-Fraud-Detection-using-AI.jpg",
  law: "https://royalsociety.org/-/media/events/2025/9/ai-and-the-law/ai-and-the-law-image.jpg",
};

const DEFAULT_IMAGE = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFQjSgjdQbvnhDH7go4ETwAOEu05VpFIAOVg&s",
  "https://www.bluefin.com/wp-content/uploads/2020/08/ai-future.jpg",
 
  // "https://www.drugtargetreview.com/wp-content/uploads/artificial-intelligence-3.jpg",
];

// ---------- helpers ----------
const gradientFor = (seed: string) => {
  const hues = [265, 210, 155, 120, 35];
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i);
  const h = hues[sum % hues.length];
  return `from-[hsl(${h}deg_90%_60%)] to-[hsl(${(h + 30) % 360}deg_90%_50%)]`;
};

const selectImage = (name: string, seed: string) => {
  const nameLower = name.toLowerCase();
  for (const [keyword, imageUrl] of Object.entries(IMAGE_MAP)) {
    if (nameLower.includes(keyword)) {
      return imageUrl;
    }
  }
  const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGE.length);
  return DEFAULT_IMAGE[randomIndex];
};

// ---------- card ----------
const AssistantCard: React.FC<{
  assistant: Assistant;
  onOpen: () => void;
  index: number;
  q: string;
}> = ({ assistant, onOpen, index, q }) => {
  const seed = assistant.name || `A${index}`;
  const badge =
    (assistant.metadata && (assistant.metadata.category as string)) || "Tools";
  const chosenThumb = selectImage(assistant.name || "AI", seed);

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
            className={`h-0 w-full pb-[56%] bg-gradient-to-br ${gradientFor(
              seed
            )} overflow-hidden`}
            aria-hidden="true"
          >
            <img
              src={chosenThumb}
              alt={`${assistant.name} thumbnail`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
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
              {/* Title */}
              <h3 className="font-semibold text-[16px] text-gray-900 line-clamp-1 leading-snug">
                <Highlighter text={assistant.name || ""} query={q} />
              </h3>

              {/* ✅ Better description styling */}
              <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-5 ">
                <Highlighter text={assistant.description || ""} query={q} />
              </p>
            </div>

            {/* Badge */}
            <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0.5 text-[11px]">
              <Shield className="h-3.5 w-3.5" />
              {badge}
            </span>
          </div>

          {/* Buttons */}
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
    pageSize: 40,
    hasMore: true,
    total: 0,
  });

  const ALWAYS_SHOW_NAMES = new Set([
    
   
    "General Insurance Discovery",
    "Life Insurance Citizen Discovery",
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

  const fetchAssistants = useCallback(
    async (after?: string, isLoadMore = false) => {
      setLoading(true);
      try {
        const response = await getAssistants(pagination.pageSize, after);
        setAssistants((prev) =>
          isLoadMore ? [...prev, ...response.data] : response.data
        );
        setPagination((prev) => ({
          ...prev,
          hasMore: response.has_more,
          firstId: response.first_id,
          lastId: response.last_id,
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

  // What we actually show:
  const shownAssistants = useMemo<Assistant[]>(() => {
    if ((q || "").trim()) {
      return (searchResults ?? []) as Assistant[];
    }
    return approvedAssistants;
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
    // keep your route pattern
    navigate(`/bharath-aistore/assistant/${assistantId}/${agentId}`);
  };

  const isSearching = !!(q || "").trim();

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3 gap-5 sm:gap-6">
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
