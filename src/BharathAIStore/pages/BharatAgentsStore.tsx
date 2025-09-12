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
  id: string;
  assistantId: string;
  agentId?: string;
  object: string;
  created_at: number;
  name: string;
  description: string;
  model: string;
  instructions: string;
  tools: any[];
  top_p: number;
  temperature: number;
  reasoning_effort: null;
  tool_resources: any;
  metadata: any;
  response_format: string;
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

async function getAssistants(
  limit = 50,
  after?: string
): Promise<AssistantsResponse> {
  const res = await apiClient.get("/ai-service/agent/getAllAssistants", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
    },
    params: { limit, after },
  });
  return {
    ...res.data,
    data: res.data.data.map((assistant: any) => ({
      ...assistant,
      agentId: assistant.agentId || assistant.id,
    })),
  };
}

// ---------- image mapping ----------
const IMAGE_MAP: { [key: string]: string } = {
  ai: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1200&auto=format&fit=crop",
  code: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
  finance:
    "https://media.licdn.com/dms/image/v2/D4D12AQH9ZTLfemnJgA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1730530043865?e=2147483647&v=beta&t=3GgdQbowwhu3jbuft6-XG2_jPZUSLa0XiCRgSz6AqBg",
  business:
    "https://media.istockphoto.com/id/1480239160/photo/an-analyst-uses-a-computer-and-dashboard-for-data-business-analysis-and-data-management.jpg?s=612x612&w=0&k=20&c=Zng3q0-BD8rEl0r6ZYZY0fbt2AWO9q_gC8lSrwCIgdk=",
  technology:
    "data:image/jpeg;base64,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",
  globaleducation:
    "https://www.linkysoft.com/images/kb/430_Artificial-Intelligence-and-Educational-Robots.jpg",
  gst: "https://zetran.com/wp-content/uploads/2025/02/GST-Compliance-and-Fraud-Detection-using-AI.jpg",
  law: "https://royalsociety.org/-/media/events/2025/9/ai-and-the-law/ai-and-the-law-image.jpg",
};

const DEFAULT_IMAGE = [
  "https://plus.unsplash.com/premium_photo-1683121710572-7723bd2e235d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://www.bluefin.com/wp-content/uploads/2020/08/ai-future.jpg",
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
    // OUTER WRAPPER → holds the glow (not clipped)
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? onOpen() : null)}
      className={[
        "relative group cursor-pointer rounded-2xl", // shape + focus target
        // subtle animated glow (yours)
        "shadow-purple-400/60", // (ok if plugin present; harmless otherwise)
        "after:absolute after:-inset-[2px] after:rounded-2xl after:content-[''] after:-z-10",
        "after:shadow-[0_0_0_6px_rgba(147,51,234,0.12)]",
        "after:pointer-events-none after:animate-pulse",
        // hover: a tiny lift on the whole wrapper
        "transition-transform hover:-translate-y-0.5",
      ].join(" ")}
      aria-label={`Open ${assistant.name}`}
    >
      {/* INNER CARD → visual content (can clip) */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-lg hover:ring-gray-300 transition overflow-hidden">
        {/* thumbnail */}
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
          {/* floating icon */}
          <div className="absolute -bottom-6 left-4 h-12 w-12 rounded-xl bg-white shadow ring-1 ring-gray-200 flex items-center justify-center">
            <Bot className="h-6 w-6 text-purple-700" />
          </div>
        </div>

        {/* text */}
        <div className="pt-8 px-4 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-[15px] text-gray-900">
                <Highlighter text={assistant.name || ""} query={q} />
              </h3>
              <p className="text-[13px] text-gray-600 line-clamp-3 mt-0.5">
                <Highlighter text={assistant.description || ""} query={q} />
              </p>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0.5 text-[11px]">
              <Shield className="h-3.5 w-3.5" />
              {badge}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={onOpen}
              className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-3.5 py-2 text-white text-[13px] font-semibold hover:bg-purple-700 transition"
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 40,
    hasMore: true,
    total: 0,
  });

  const ALWAYS_SHOW_NAMES = new Set([
    "IRDAI",
    "Tie - Hyderabad",
    "GST Reform GPT",
    "General Insurance Discovery",
    "Life Insurance Citizen Discovery",
  ]);

  const NEXT_PATH = "/bharat-expert";
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

  // keep APPROVED + whitelist
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

  // search within APPROVED list
  const filteredAssistants = useMemo(() => {
    const term = (q || "").trim().toLowerCase();
    const base = approvedAssistants;
    if (!term) return base;
    return base.filter((a) => {
      const name = a.name?.toLowerCase() || "";
      const desc = a.description?.toLowerCase() || "";
      return name.includes(term) || desc.includes(term);
    });
  }, [approvedAssistants, q]);

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

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 sm:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
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

        {filteredAssistants.length === 0 ? (
          <div className="text-center py-16">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              No Assistants Found
            </h3>
            <p className="text-gray-600">Try a different search term.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 sm:gap-6">
              {filteredAssistants.map((assistant, index) => (
                <AssistantCard
                  key={assistant.assistantId}
                  assistant={assistant}
                  index={index}
                  q={q}
                  onOpen={() =>
                    navigate(
                      `/bharath-aistore/assistant/${assistant.assistantId}/${assistant.agentId}`
                    )
                  }
                />
              ))}
            </div>

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
          </>
        )}
      </main>
    </div>
  );
};

export default BharatAgentsStore;
