// /src/AgentStore/HealthcareAgentsPage.tsx
import React, { useEffect, useState } from "react";
import { Bot, Loader2, Shield, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../Config";

/* ================= Canonical names & order ================= */
const CANONICAL = ["Dr. KneeWell", "Dr. PainCare"] as const;
type CanonicalName = (typeof CANONICAL)[number];

/* ========= Use assistantId → name mapping (NO name matching) ========== */
const ID_TO_CANONICAL: Record<string, CanonicalName> = {
  asst_Os6dN1Jpn8EywCUDQSvSb8xk: "Dr. KneeWell",
  asst_dPKfeLYbA0B0otqx9hsLEUyu: "Dr. PainCare",
};

/* ================= Types ================= */
type Assistant = {
  id?: string;
  assistantId?: string;
  agentId?: string;
  name?: string;
  description?: string;
  status?: string;
  imageUrl?: string;
  image?: string;
  thumbUrl?: string;
  metadata?: Record<string, unknown> | null;
};

type AssistantView = Assistant & {
  displayName: CanonicalName;
  imageUrl: string; // keep API image only (no fallback)
};

type AssistantsResponse = {
  object: string;
  data: any[];
  has_more: boolean;
  firstId?: string;
  lastId?: string;
};

/* ============= axios client & auth (token optional) ============= */
const apiClient = axios.create({
  baseURL: (BASE_URL || "").replace(/\/+$/, ""),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Fallback token for pre-login calls
const PRELOGIN_TOKEN =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzOGY3MWRhMy01ZjFkLTRiODItYTgzZi0wZmM0MDU4ZTI1NTQiLCJpYXQiOjE3NTkyMzExMTEsImV4cCI6MTc2MDA5NTExMX0.WPotQxTI9_HuJJ_YXzKJPaWb6GU9F9nf8BUI5HjmZZB3N8Vw0Mad7K0rpRcXViqFqSF5u23IoyKMqkszkKpxmQ";

function getOptionalAuthHeaders(): Record<string, string> {
  const envToken =
    typeof process !== "undefined" &&
    (process as any).env &&
    String((process as any).env.AUTH_TOKEN || "").trim();

  const lsToken =
    typeof window !== "undefined"
      ? (localStorage.getItem("AUTH_TOKEN") ||
          localStorage.getItem("authToken") ||
          localStorage.getItem("accessToken") ||
          localStorage.getItem("token") ||
          "")
      : "";

  // ✅ Use your pre-login token if nothing else is available
  const token = envToken || lsToken || PRELOGIN_TOKEN;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/* ============= APIs ============= */
// Backend 500 avoidance: send ONLY 'after' when present (omit 'limit')
async function getAssistants(_limit = 50, after?: string): Promise<AssistantsResponse> {
  const config: any = { headers: getOptionalAuthHeaders() };
  if (after) config.params = { after };

  const response = await apiClient.get("/ai-service/agent/getAllAssistants", config);

  // Normalize fields so the rest of the page can rely on consistent keys
  const normalized = (response.data?.data ?? []).map((a: any) => ({
    ...a,
    assistantId: a?.assistantId || a?.id,
    agentId: a?.agentId || a?.id || a?.assistantId,
    imageUrl: a?.imageUrl || a?.image || a?.thumbUrl || "",
    description: a?.description ?? a?.desc ?? "",
    status: a?.status || a?.agentStatus,
  }));

  return {
    object: response.data?.object ?? "list",
    data: normalized,
    has_more: !!(response.data?.has_more ?? response.data?.hasMore),
    firstId: response.data?.firstId,
    lastId: response.data?.lastId,
  };
}

/* ============= helpers ============= */
function buildHealthcareListById(all: Assistant[]): AssistantView[] {
  // keep only whitelisted IDs
  const filtered = all
    .filter((a) => {
      const id = (a.assistantId || a.id || "").trim();
      return id && ID_TO_CANONICAL[id];
    })
    .map((a) => {
      const id = (a.assistantId || a.id || "").trim();
      const displayName = ID_TO_CANONICAL[id] as CanonicalName;

      // IMPORTANT: No fallback description/image; use API values only.
      return {
        ...a,
        displayName,
        imageUrl: (a.imageUrl || "").trim(),
      } as AssistantView;
    })
    .sort(
      (a, b) => CANONICAL.indexOf(a.displayName) - CANONICAL.indexOf(b.displayName)
    );

  return filtered;
}

/* ================ Skeleton Loader ================ */
const SkeletonCard: React.FC = () => (
  <div className="animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
    <div className="relative w-full">
      <div className="h-0 w-full pb-[56%] bg-gray-200" />
      <div className="absolute -bottom-6 left-4 h-12 w-12 rounded-xl bg-gray-200" />
    </div>
    <div className="pt-8 px-5 pb-5">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 rounded w-5/6" />
       <div className="mt-5 flex items-center gap-2 mt-auto">
        <div className="h-8 w-20 bg-gray-200 rounded" />
        <div className="h-8 w-16 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

/* ================ UI bits ================ */
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
              type="button"
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
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AssistantCard: React.FC<{
  a: Partial<AssistantView & Assistant>;
  onOpen: () => void;
}> = ({ a, onOpen }) => {
  const [showMore, setShowMore] = useState(false);
  const title = (a as any).displayName || a.name || "Untitled Agent";
  const [imgSrc, setImgSrc] = useState(a.imageUrl || "");
  const badge =
    (a.metadata && (a.metadata as any).category) || "Healthcare";

  return (
    <div className="relative">
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onOpen();
        }}
       className="relative group cursor-pointer rounded-2xl transition-transform hover:-translate-y-0.5 h-full"
        aria-label={`Open ${title}`}
      >
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-lg hover:ring-gray-300 transition overflow-hidden h-full flex flex-col">
          {/* Header image */}
          <div className="relative w-full">
            <div className="h-0 w-full pb-[56%] overflow-hidden" aria-hidden="true">
              <img
                src={imgSrc}
                alt={title + " thumbnail"}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={() =>
                  setImgSrc("data:image/gif;base64,R0lGODlhAQABAAAAACw=")
                }
              />
            </div>
            <div className="absolute -bottom-6 left-4 h-12 w-12 rounded-xl bg-white shadow ring-1 ring-gray-200 flex items-center justify-center">
              <Bot className="h-6 w-6 text-purple-700" />
            </div>
          </div>

          {/* Content */}
           <div className="pt-8 px-5 pb-5 flex-1 flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-[16px] text-gray-900 line-clamp-2 leading-snug">
                  {title}
                </h3>

                <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-5">
                  {a.description || ""}
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0.5 text-[11px]">
                <Shield className="h-3.5 w-3.5" />
                {String(badge)}
              </span>
            </div>

             <div className="mt-5 flex items-center gap-2 mt-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
                className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-white text-[13px] font-semibold hover:bg-purple-700 transition"
                type="button"
              >
                Open
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMore(true);
                }}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-[12px] text-gray-700 hover:bg-gray-50 transition"
                type="button"
              >
                Read more
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ReadMoreModal
        open={showMore}
        onClose={() => setShowMore(false)}
        title={title}
        body={a.description || ""}
      />
    </div>
  );
};

/* ================= Page ================= */
const HealthcareAgentsPage: React.FC = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<AssistantView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  // paging cursor
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(false);

  // fetch pages until we either collect both whitelisted agents or run out
  async function loadWhitelisted(initialAfter?: string) {
    let after = initialAfter;
    let collected: Assistant[] = [];
    const targetCount = Object.keys(ID_TO_CANONICAL).length;

    for (let i = 0; i < 5; i++) {
      // safety cap: up to 5 pages
      const res = await getAssistants(50, after);
      collected = collected.concat(res.data);

      const filtered = buildHealthcareListById(collected);
      setItems(filtered);

      if (filtered.length >= targetCount || !res.has_more) {
        setCursor(res.lastId);
        setHasMore(!!res.has_more);
        return;
      }
      after = res.lastId;
      setCursor(after);
      setHasMore(true);
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        await loadWhitelisted();
      } catch (e: any) {
        const status = e?.response?.status;
        const body = e?.response?.data;
        if (mounted) {
          setErr(
            body?.message ||
              `Failed to load agents${status ? ` (HTTP ${status})` : ""}`
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleOpen = (a: any) => {
    const assistantId = (a.assistantId || a.id || a.agentId || "")
      .toString()
      .trim();
    const agentId = (a.agentId || a.assistantId || a.id || "")
      .toString()
      .trim();
    const base =
      typeof window !== "undefined" &&
      window.location.pathname.includes("bharath-aistore")
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
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            Healthcare Agents
          </h2>
          <p className="text-sm sm:text-[15px] text-gray-600 mt-1">
            AI-based Healthcare Assistants
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-5 sm:gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <SkeletonCard key={`init-skel-${i}`} />
            ))}
          </div>
        ) : err ? (
          <div className="text-sm text-red-600">{err}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No Agents Found</h3>
            <p className="text-gray-600">
              We couldn’t find the requested healthcare agents. Try again later.
            </p>
          </div>
        ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-5 sm:gap-6 items-stretch auto-rows-fr">
            {items.map((a, i) => (
              <AssistantCard
                key={`${a.displayName}-${a.assistantId || a.id || i}`}
                a={a}
                onOpen={() => handleOpen(a)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HealthcareAgentsPage;
