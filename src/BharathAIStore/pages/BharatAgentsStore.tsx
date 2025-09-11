// /src/AgentStore/BharatAgentsStore.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Bot, Shield, Loader2 } from "lucide-react";
import BASE_URL from "../../Config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import Highlighter from "../components/Highlighter";
import CA1image from "../../assets/img/ca1.png";
import CA2image from "../../assets/img/ca2.png";
import CA3image from "../../assets/img/ca3.png";
import CA4image from "../../assets/img/ca4.png";
// ---------- types ----------
interface Assistant {
  id: string;
  assistantId:string;
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
  // NEW:
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
  return res.data;
}

// ---------- image mapping ----------
const IMAGE_MAP: { [key: string]: string } = {
  ai: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1200&auto=format&fit=crop",
  code: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
  finance:
    "https://img.etimg.com/thumb/width-1200,height-900,imgsize-42978,resizemode-75,msid-115767455/news/company/corporate-trends/most-cfos-in-india-believe-generative-ai-will-enhance-effectiveness-of-tax-functions-report.jpg",
  business:
    "https://media.istockphoto.com/id/1480239160/photo/an-analyst-uses-a-computer-and-dashboard-for-data-business-analysis-and-data-management.jpg?s=612x612&w=0&k=20&c=Zng3q0-BD8rEl0r6ZYZY0fbt2AWO9q_gC8lSrwCIgdk=",
  globaleducation:
    "https://www.linkysoft.com/images/kb/430_Artificial-Intelligence-and-Educational-Robots.jpg",
  gst: "https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_750,h_394/https://authbridge.com/wp-content/uploads/2025/08/RBI-free-ai-blog-image-1024x538.jpg",
  law: "https://static.vecteezy.com/system/resources/previews/035/637/000/large_2x/ai-generated-law-legal-system-justice-photo.jpg",
};

// Keep DEFAULT_IMAGE array
const DEFAULT_IMAGE = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-nZe2pShSDeDXC_jxD7_rKF5w-0TQPUmj1Q&s",
  "https://www.bluefin.com/wp-content/uploads/2020/08/ai-future.jpg",
];

// ---------- NEW: featured tiles (no-crop images) ----------
const FEATURE_TILES = [
  { src: CA1image, label: "Create AI Agent", to: "/create-aiagent" },
  { src: CA2image, label: "GLMS", to: "/glms" },
  { src: CA4image, label: "Free AI Book", to: "/freeaibook" },
  { src: CA3image, label: "OXYGPT", to: "/genoxy" },
];

// ---------- helpers ----------
const gradientFor = (seed: string) => {
  const hues = [265, 210, 155, 120, 35];
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i);
  const h = hues[sum % hues.length];
  return `from-[hsl(${h}deg_90%_60%)] to-[hsl(${(h + 30) % 360}deg_90%_50%)]`;
};

const initialsThumb = (title: string, seed: string) => {
  const initials = (title || "AI")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  let hash = 0;
  for (let i = 0; i < seed.length; i++)
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  const bg = `hsl(${hue} 70% 55%)`;
  const fg = "#ffffff";

  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='240' height='135' viewBox='0 0 240 135'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${bg}' stop-opacity='1'/>
        <stop offset='100%' stop-color='${bg}' stop-opacity='0.8'/>
      </linearGradient>
    </defs>
    <rect width='240' height='135' rx='16' fill='url(#g)'/>
    <circle cx='36' cy='99' r='6' fill='rgba(255,255,255,0.8)' />
    <circle cx='210' cy='24' r='5' fill='rgba(255,255,255,0.75)' />
    <text x='120' y='75' text-anchor='middle' font-family='Inter,system-ui,Segoe UI,Roboto' font-size='44' font-weight='700' fill='${fg}'>${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
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
      className="group rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-lg hover:-translate-y-0.5 hover:ring-gray-300 transition cursor-pointer overflow-hidden"
    >
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
            aria-label={`Open ${assistant.name}`}
          >
            Open
          </button>
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

// NEW: keep APPROVED + whitelist by name
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


  // Search within APPROVED list
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
        {/* Featured 4 tiles (no-crop) */}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <section className="mb-6 sm:mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {FEATURE_TILES.map((tile) => (
                <button
                  key={tile.to}
                  onClick={() => navigate(tile.to)}
                  className="group text-left"
                  aria-label={tile.label}
                >
                  <div className="relative w-full rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
                    <div className="w-full aspect-[288/161] flex items-center justify-center">
                      <img
                        src={tile.src}
                        alt={tile.label}
                        className="max-h-full max-w-full object-contain select-none"
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-center text-[13px] font-semibold text-gray-800">
                    {tile.label}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              Bharat AI Store
            </h2>
            <p className="text-sm sm:text-[15px] text-gray-600 mt-1">
              Discover expert AI assistants. Search by domain, name, or
              description.
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
        {/* Featured 4 tiles (no-crop) */}
         <section className="mb-6 sm:mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {FEATURE_TILES.map((tile) => (
                <button
                  key={tile.to}
                  onClick={() => navigate(tile.to)}
                  className="group text-left"
                  aria-label={tile.label}
                >
                  <div className="relative w-full rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
                    <div className="w-full aspect-[288/161] flex items-center justify-center">
                      <img
                        src={tile.src}
                        alt={tile.label}
                        className="max-h-full max-w-full object-contain select-none"
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-center text-[13px] font-semibold text-gray-800">
                    {tile.label}
                  </div>
                </button>
              ))}
            </div>
          </section>
        {/* title */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            Bharat AI Store
          </h2>
          <p className="text-sm sm:text-[15px] text-gray-600 mt-1">
            Discover expert AI assistants. Search by domain, name, or
            description.
          </p>
        </div>

        {/* results / empty */}
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
                    navigate(`/bharath-aistore/assistant/${assistant.assistantId}`)
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
