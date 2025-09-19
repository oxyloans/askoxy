// src/BharathAIStore/pages/BharatAgentsStore.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { Bot, Shield, Loader2, Star, X ,Flame} from "lucide-react";

import BASE_URL from "../../Config";
import { useSearch } from "../context/SearchContext";
import Highlighter from "../components/Highlighter";
import CA3image from "../../assets/img/ca3.png";

/* ----------------------------- Types ----------------------------- */
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

interface Feedback {
  id?: string;
  agentCreatorUserId?: string;
  agentId: string;
  agentName: string;
  feedbackComments: string;
  feedbackRating: number;
  userId: string;
  createdAt?: string;
}

interface AgentRatingsSummary {
  avg: number;
  count: number;
  my?: { rating: number; comment: string };
}

/* --------------------------- Constants --------------------------- */
const OG_IMAGE = "https://i.ibb.co/h1fpCXzw/fanofog.png";

const IMAGE_MAP: { [key: string]: string } = {
  code: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
  finance:
    "https://media.licdn.com/dms/image/v2/D4D12AQH9ZTLfemnJgA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1730530043865?e=2147483647&v=beta&t=3GgdQbowwhu3jbuft6-XG2_jPZUSLa0XiCRgSz6AqBg",
  business:
    "https://media.istockphoto.com/id/1480239160/photo/an-analyst-uses-a-computer-and-dashboard-for-data-business-analysis-and-data-management.jpg?s=612x612&w=0&k=20&c=Zng3q0-BD8rEl0r6ZYZY0fbt2AWO9q_gC8lSrwCIgdk=",
  technology: "https://www.bluefin.com/wp-content/uploads/2020/08/ai-future.jpg",
  og: "https://i.ibb.co/gZjkJyQ8/1a.png",
  irdai:
    "https://www.livemint.com/lm-img/img/2024/05/30/600x338/Irdai_health_insurance_1717036677791_1717036677946.png",
  gst: "https://zetran.com/wp-content/uploads/2025/02/GST-Compliance-and-Fraud-Detection-using-AI.jpg",
  law: "https://royalsociety.org/-/media/events/2025/9/ai-and-the-law/ai-and-the-law-image.jpg",
};
const DEFAULT_IMAGE = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFQjSgjdQbvnhDH7go4ETwAOEu05VpFIAOVg&s",
  "https://www.bluefin.com/wp-content/uploads/2020/08/ai-future.jpg",
];

/* ---------------------------- Helpers ---------------------------- */
const gradientFor = (seed: string) => {
  const hues = [265, 210, 155, 120, 35];
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i);
  const h = hues[sum % hues.length];
  return `from-[hsl(${h}deg_90%_60%)] to-[hsl(${(h + 30) % 360}deg_90%_50%)]`;
};

const selectImage = (name: string, seed: string) => {
  const nameLower = (name || "").toLowerCase();
  for (const [keyword, imageUrl] of Object.entries(IMAGE_MAP)) {
    if (nameLower.includes(keyword)) return imageUrl;
  }
  return DEFAULT_IMAGE[Math.floor(Math.random() * DEFAULT_IMAGE.length)];
};

function normalizeList(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [data].filter(Boolean);
}

function computeSummary(allForAgent: any[], myUserId: string): AgentRatingsSummary {
  const mine = allForAgent.find((f) => f.userId === myUserId);
  const nums = allForAgent
    .map((f) => Number(f?.feedbackRating))
    .filter((n) => Number.isFinite(n) && n >= 0);

  const count = nums.length;
  const avg = count ? nums.reduce((a, b) => a + b, 0) / count : 0;

  const summary: AgentRatingsSummary = { avg, count };
  if (mine && Number.isFinite(mine.feedbackRating)) {
    summary.my = {
      rating: Number(mine.feedbackRating),
      comment: String(mine.feedbackComments || ""),
    };
  }
  return summary;
}

/* ---------------------------- API setup ---------------------------- */
const apiClient = axios.create({ baseURL: BASE_URL });

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) {
    // Ensure Axios v1-safe mutation
    config.headers = AxiosHeaders.from(config.headers);
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
  }
  return config;
});

const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* --------------------------- API calls --------------------------- */
async function getAssistants(limit = 50, after?: string): Promise<AssistantsResponse> {
  const res = await apiClient.get("/ai-service/agent/getAllAssistants", {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
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

async function searchAssistants(query: string): Promise<Assistant[]> {
  const res = await apiClient.get("/ai-service/agent/webSearchForAgent", {
    params: { message: query },
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
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
  }));
}

/* --------- Feedback: new endpoints (with query params) --------- */
// GET: /api/ai-service/agent/feedbackByUserId?userId=...
async function getFeedbackByUser(userId: string): Promise<Feedback[] | null> {
  try {
    const res = await apiClient.get("/ai-service/agent/feedbackByUserId", {
      params: { userId },
      headers: { "Content-Type": "application/json" },
    });
    return normalizeList(res.data) as Feedback[];
  } catch {
    return null;
  }
}

// GET: /api/ai-service/agent/feedbackByAgentId?agentId=...
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


// POST: /api/ai-service/agent/feedback
async function postFeedback(payload: Feedback) {
  const res = await apiClient.post("/ai-service/agent/feedback", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

/* --------------------------- UI bits --------------------------- */
const StarRating: React.FC<{
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
  label?: string;
}> = ({ value, onChange, size = 20, readOnly = false, label }) => (
  <div className="flex items-center gap-1" aria-label={label || "Rating"}>
    {[0, 1, 2, 3, 4].map((i) => {
      const filled = value >= i + 1;
      return (
        <button
          key={i}
          type="button"
          onClick={() => !readOnly && onChange && onChange(i + 1)}
          className={["p-0.5", readOnly ? "cursor-default" : "cursor-pointer"].join(" ")}
          aria-label={`Rate ${i + 1} star${i ? "s" : ""}`}
        >
          <Star
            className={filled ? "fill-yellow-400 stroke-yellow-500" : "stroke-gray-400"}
            style={{ width: size, height: size }}
          />
        </button>
      );
    })}
  </div>
);

/* Read More modal to keep cards same height */
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
            <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100" aria-label="Close">
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

/* Feedback modal (read-only if already rated; rating required when new) */
const FeedbackModal: React.FC<{
  open: boolean;
  onClose: () => void;
  agent: Pick<Assistant, "name"> & { agentId: string };
  onSaved: (agentId: string, summary: AgentRatingsSummary) => void;
}> = ({ open, onClose, agent, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(false);

  // form state
  const [rating, setRating] = useState<number>(0);
  const [comments, setComments] = useState<string>("");

  // true only if server says I already rated this agent before
  const [hasExisting, setHasExisting] = useState(false);

  // show peer stats
  const [othersAvg, setOthersAvg] = useState<{ avg: number; count: number } | null>(null);

  // ui feedback
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Prefill: detect existing rating (locks the form) + compute others' avg
  useEffect(() => {
    if (!open) return;
    let active = true;
    (async () => {
      try {
        setPrefillLoading(true);
        setError(null);
        setOkMsg(null);
        setHasExisting(false);
        setRating(0);
        setComments("");

        const uid = localStorage.getItem("userId") || "";
        const [byUser, byAgent] = await Promise.all([
          uid ? getFeedbackByUser(uid) : Promise.resolve(null),
          getFeedbackByAgent(agent.agentId),
        ]);

        // did I rate already?
        const mine =
          (normalizeList(byUser || []).find((f) => f.agentId === agent.agentId) as Feedback | undefined) ||
          (normalizeList(byAgent || []).find((f) => f.userId === uid) as Feedback | undefined);

        if (active && mine && Number.isFinite(mine.feedbackRating) && mine.feedbackRating > 0) {
          setHasExisting(true);                // lock only if truly exists on server
          setRating(Number(mine.feedbackRating));
          setComments(mine.feedbackComments || "");
        }

        // compute peers' average (excluding me)
        const othersNums = normalizeList(byAgent || [])
          .filter((f) => f.userId !== uid)
          .map((f) => Number(f.feedbackRating))
          .filter((n) => Number.isFinite(n) && n > 0);
        const count = othersNums.length;
        const avg = count ? othersNums.reduce((a, b) => a + b, 0) / count : 0;
        if (active) setOthersAvg({ avg, count });
      } catch (e: any) {
        if (active) setError(e?.message || "Failed to load feedback");
      } finally {
        if (active) setPrefillLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [open, agent.agentId]);


  const submit = async () => {
  setError(null);
  setOkMsg(null);

  // rating REQUIRED when creating new feedback
  if (!hasExisting && (!Number.isFinite(rating) || rating <= 0)) {
    setError("Please select a rating (required).");
    return;
  }

  try {
    setLoading(true);

    const userId = localStorage.getItem("userId") || "";
    const agentCreatorUserId = localStorage.getItem("agentCreatorUserId") || undefined;

    const payload: Feedback = {
      agentCreatorUserId,                  // optional
      agentId: agent.agentId,
      agentName: agent.name || "",
      feedbackComments: comments || "",    // optional
      feedbackRating: Number(rating || 0), // required > 0 for new rating
      userId,
    };

    await postFeedback(payload);

    // Immediately re-fetch to reflect fresh data (no reload)
    const [byUser, byAgent] = await Promise.all([
      userId ? getFeedbackByUser(userId) : Promise.resolve(null),
      getFeedbackByAgent(agent.agentId),
    ]);

    // Merge + recompute summary
    const userList = normalizeList(byUser || []);
    const agentList = normalizeList(byAgent || []);
    const all = [...agentList];

    const mineFromUser = userList.find((f) => f.agentId === agent.agentId && f.userId === userId);
    if (mineFromUser && !all.find((f) => f.userId === userId)) {
      all.push(mineFromUser);
    }

    const summary = computeSummary(all, userId);

    // Notify parent to update the card
    onSaved(agent.agentId, summary);

    // Close immediately
    onClose();
  } catch (e: any) {
    setError(
      e?.response?.data?.message ||
        e?.message ||
        "Failed to submit feedback. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  if (!open) return null;

  const locked = hasExisting; // lock ONLY when server says I already rated

  return (
    <div className="fixed inset-0 z-[110]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">
              Rate &amp; Review: <span className="text-purple-700">{agent.name}</span>
            </h3>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100" aria-label="Close">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="px-5 py-4">
            <label className="text-sm font-medium text-gray-700">Your Rating <span className="text-red-500">*</span></label>
            <div className="mt-2">
              <StarRating value={rating} onChange={locked ? undefined : setRating} />
            </div>

            <label className="block mt-4 text-sm font-medium text-gray-700">Comments (optional)</label>
            <textarea
              className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
              rows={4}
              placeholder="Tell us what you liked or what could be better…"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              disabled={locked}
            />

            {prefillLoading && (
              <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading existing feedback…
              </div>
            )}
            {othersAvg && (
              <div className="mt-3 text-xs text-gray-600">
                Others: ★{othersAvg.avg.toFixed(1)} ({othersAvg.count})
              </div>
            )}

            {locked && comments && comments.trim().length > 0 && (
              <div className="mt-3 text-sm text-gray-700">
                <strong>Your comment:</strong> {comments}
              </div>
            )}

            {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
            {okMsg && <div className="mt-3 text-sm text-green-600">{okMsg}</div>}
          </div>

          <div className="px-5 pb-5 pt-2 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Close
            </button>
            {/* Only allow submit when creating a new rating */}
            {!locked && (
              <button
                onClick={submit}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60"
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


/* Assistant Card — uniform height + “Read more” modal */
const AssistantCard: React.FC<{
  assistant: Assistant;
  onOpen: () => void;
  onRate: () => void;
  index: number;
  q: string;
  summary?: AgentRatingsSummary;
}> = ({ assistant, onOpen, onRate, index, q, summary }) => {
  const seed = assistant.name || `A${index}`;
  const badge =
    (assistant.metadata && (assistant.metadata.category as string)) || "Tools";
  const chosenThumb = selectImage(assistant.name || "AI", seed);

  const description = assistant.description || "";
  const showReadMore = description.trim().length > 160;

  const [readMoreOpen, setReadMoreOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? onOpen() : null)}
        className="relative group rounded-2xl shadow-purple-400/60 transition-transform hover:-translate-y-0.5 h-full"
        aria-label={`Open ${assistant.name}`}
      >
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-lg hover:ring-gray-300 transition overflow-hidden h-full flex flex-col">
          {/* Fixed thumbnail height for uniformity */}
          <div className="relative w-full">
            <div className={`h-52 w-full bg-gradient-to-br ${gradientFor(seed)} overflow-hidden`}>
              <img
                src={chosenThumb}
                alt={`${assistant.name} thumbnail`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -bottom-6 left-4 h-12 w-12 rounded-xl bg-white shadow ring-1 ring-gray-200 flex items-center justify-center">
              <Bot className="h-6 w-6 text-purple-700" />
            </div>
          </div>

          {/* Content area with fixed min-height to keep cards aligned */}
          <div className="pt-8 px-5 pb-5 flex flex-col flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-[16px] text-gray-900 leading-snug line-clamp-1">
                  <Highlighter text={assistant.name || ""} query={q} />
                </h3>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0.5 text-[11px]">
                <Shield className="h-3.5 w-3.5" />
                {badge}
              </span>
            </div>

            {/* Description (clamped to keep uniform height) */}
            <div className="mt-2 text-sm text-gray-600 leading-relaxed">
              {description ? (
                <>
                  <p className="line-clamp-3">
                    <Highlighter text={description} query={q} />
                  </p>
                  {showReadMore && (
                    <button
                      className="mt-1 text-xs font-medium text-purple-700 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReadMoreOpen(true);
                      }}
                    >
                      Read more
                    </button>
                  )}
                </>
              ) : (
                <p className="italic text-gray-400">No description provided.</p>
              )}
            </div>

            {/* Spacer to push actions to bottom so every card uses same layout */}
            <div className="flex-1" />

            {/* Rating & Actions (kept on a single row for uniformity) */}
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              {summary?.my ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-1 text-[12px]">
                  <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-500" />
                  Your rating: {summary.my.rating}
                </div>
              ) : summary && summary.count > 0 ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2.5 py-1 text-[12px]">
                  <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-500" />
                  {summary.avg.toFixed(1)} ({summary.count})
                </div>
              ) : null}

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen();
                  }}
                  className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-white text-[13px] font-semibold hover:bg-purple-700 transition"
                >
                  Open
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRate();
                  }}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition"
                  title={summary?.my ? "View your rating" : "Rate this agent"}
                >
                  <Star className="w-4 h-4 mr-1 stroke-yellow-500" />
                  {summary?.my ? "View" : "Rate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Read more modal */}
      <ReadMoreModal
        open={readMoreOpen}
        onClose={() => setReadMoreOpen(false)}
        title={assistant.name || "Details"}
        body={description || "No description provided."}
      />
    </>
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
        onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? onOpen() : null)}
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

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState<{ agentId: string; name: string } | null>(
    null
  );

  const [ratingsByAgent, setRatingsByAgent] = useState<Record<string, AgentRatingsSummary>>({});

  const ALWAYS_SHOW_NAMES = new Set(["General Insurance Discovery", "Life Insurance Citizen Discovery"]);

  const fetchAssistants = useCallback(
    async (after?: string, isLoadMore = false) => {
      setLoading(true);
      try {
        const response = await getAssistants(pagination.pageSize, after);
        setAssistants((prev) => (isLoadMore ? [...prev, ...response.data] : response.data));
        setPagination((prev) => ({
          ...prev,
          hasMore: response.has_more,
          firstId: response.first_id,
          lastId: response.last_id,
          total: isLoadMore ? prev.total + response.data.length : response.data.length,
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

  // ✅ RIGHT place — inside BharatAgentsStore (parent)
const handleFeedbackSaved = (agentId: string, summary: AgentRatingsSummary) => {
  setRatingsByAgent((prev: Record<string, AgentRatingsSummary>) => ({
    ...prev,
    [agentId]: summary,
  }));
};


  useEffect(() => {
    fetchAssistants();
  }, [fetchAssistants]);

  // Only approved + whitelist when not searching
  const approvedAssistants = useMemo(() => {
    return assistants.filter((a) => {
      const s = (a.status || a.agentStatus || "").toString().toUpperCase();
      const name = (a.name || "").trim().toLowerCase();
      const isApproved = s === "APPROVED";
      const isWhitelisted = Array.from(ALWAYS_SHOW_NAMES).some((n) => n.toLowerCase() === name);
      return isApproved || isWhitelisted;
    });
  }, [assistants]);

  // Search behavior
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
        setSearchError(e?.response?.data?.message || e?.message || "Search failed");
      } finally {
        if (active) setSearchLoading(false);
      }
    };
    doSearch();
    return () => {
      active = false;
    };
  }, [q]);

  // Which list to show
  const shownAssistants = useMemo<Assistant[]>(() => {
    if ((q || "").trim()) return (searchResults ?? []) as Assistant[];
    return approvedAssistants;
  }, [q, searchResults, approvedAssistants]);

useEffect(() => {
  let cancelled = false;
  (async () => {
    const uid = localStorage.getItem("userId") || "";

    // Gather and NARROW to string
    const agentIds: string[] = (shownAssistants || [])
      .map((a) => a.agentId || a.assistantId || a.id)
      .filter((id): id is string => typeof id === "string" && id.length > 0);

    if (agentIds.length === 0) return;

    const [userListRaw, perAgentRaw] = await Promise.all([
      uid ? getFeedbackByUser(uid) : Promise.resolve(null),
      Promise.all(agentIds.map((id) => getFeedbackByAgent(id))), // id is string now
    ]);

    const userList = normalizeList(userListRaw);
    const next: Record<string, AgentRatingsSummary> = {};

    agentIds.forEach((agentId, i) => {
      const agentList = normalizeList(perAgentRaw[i]);
      const all = agentList.length ? [...agentList] : [];
      if (uid && !all.find((f) => f.agentId === agentId && f.userId === uid)) {
        const mineFromUser = userList.find((f) => f.agentId === agentId && f.userId === uid);
        if (mineFromUser) all.push(mineFromUser);
      }
      next[agentId] = computeSummary(all, uid); // agentId is a string key now
    });

    if (!cancelled) setRatingsByAgent((prev) => ({ ...prev, ...next }));
  })();
  return () => {
    cancelled = true;
  };
}, [shownAssistants]);


  const handleOpen = (a: Assistant) => {
    const assistantId = a.assistantId || a.id || a.agentId;
    const agentId = a.agentId || a.assistantId || a.id;
    if (!assistantId) return;
    navigate(`/bharath-aistore/assistant/${assistantId}/${agentId}`);
  };

  const openRateModal = (agentId: string, name: string) => {
    setFeedbackTarget({ agentId, name });
    setFeedbackOpen(true);
  };

  const openOG = () => {
    const userId = localStorage.getItem("userId");
    const next = "/ThefanofOG";
    if (userId) {
      navigate(next);
    } else {
      sessionStorage.setItem("redirectPath", next);
      navigate(`/whatsapplogin?next=${encodeURIComponent(next)}`);
    }
  };

  const handleCreateAgentClick = () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const NEXT_PATH = "/main/bharat-expert";
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

  const isSearching = !!(q || "").trim();

  /* ------------------------ Render ------------------------ */
  const SkeletonCard = () => (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden animate-pulse h-full flex flex-col">
      <div className="h-52 w-full bg-gray-100" />
      <div className="p-4 flex-1 flex flex-col">
        <div className="h-4 bg-gray-100 rounded w-3/5" />
        <div className="h-3 bg-gray-100 rounded w-4/5 mt-2" />
        <div className="mt-auto">
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
            <p className="text-sm sm:text-[15px] text-gray-600 mt-1">Discover expert AI assistants.</p>
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h2 className="text-xl font-semibold text-purple-700 mb-2">Error Loading Assistants</h2>
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
          <p className="text-sm sm:text-[15px] text-gray-600 mt-1">Discover expert AI assistants.</p>
        </div>

        {/* Search state */}
        {isSearching && searchLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching “{q}”…
          </div>
        )}
        {isSearching && searchError && <div className="text-sm text-red-600 mb-4">{searchError}</div>}

        {shownAssistants.length === 0 ? (
          <div className="text-center py-16">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              {isSearching ? "No results found" : "No Assistants Found"}
            </h3>
            <p className="text-gray-600">
              {isSearching ? "Try a different search term." : "Try a different search term."}
            </p>
          </div>
        ) : (
          <>
            {/* Uniform-height card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 auto-rows-fr">
              {/* Featured OG card (only when not searching) */}
              {!isSearching && (
                <FeaturedOGCard
                  onOpen={openOG}
                />
              )}

              {shownAssistants.map((assistant, index) => {
                const assistantId = assistant.assistantId || assistant.id || assistant.agentId || `${index}`;
                const agentId = assistant.agentId || assistant.assistantId || assistant.id || `${index}`;
                return (
                  <AssistantCard
                    key={assistantId}
                    assistant={assistant}
                    index={index}
                    q={q || ""}
                    onOpen={() => handleOpen(assistant)}
                    onRate={() => openRateModal(agentId, assistant.name)}
                    summary={ratingsByAgent[agentId]}
                  />
                );
              })}
            </div>

            {/* Load More (default list only) */}
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

    {feedbackOpen && feedbackTarget && (
  <FeedbackModal
    open={feedbackOpen}
    onClose={() => setFeedbackOpen(false)}
    agent={{ agentId: feedbackTarget.agentId, name: feedbackTarget.name }}
    onSaved={handleFeedbackSaved} // NEW
  />
)}
    </div>
  );
};

export default BharatAgentsStore;
