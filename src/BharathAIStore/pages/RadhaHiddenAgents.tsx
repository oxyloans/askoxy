// src/BharathAIStore/pages/RadhaHiddenAgents.tsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../Config"; // same pattern as BharatAgentsStore
import { Bot } from "lucide-react";

// ------------------ Types ------------------
export interface Assistant {
  id?: string;
  assistantId?: string;
  agentId?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
}

export interface AssistantsResponse {
  object: string;
  data: Assistant[];
  hasMore: boolean;
  firstId?: string;
  lastId?: string;
}

// ------------------ Hidden list ------------------
const HIDE_AGENT_IDS = new Set<string>([
  "d1bc5d31-6c7b-4412-9aae-fa8070ad9ff0", // blocklisted agent
]);

const isHiddenAgent = (a: Assistant): boolean => {
  const id = (a.agentId || a.assistantId || a.id || "").toString().trim();
  return !!id && HIDE_AGENT_IDS.has(id);
};

// ------------------ Initials fallback (same logic as Store) ------------------
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

// ------------------ API client ------------------
const apiClient = axios.create({ baseURL: BASE_URL });

// ------------------ API ------------------
async function getAssistants(
  limit: number,
  after?: string
): Promise<AssistantsResponse> {
  const params: any = { limit };
  if (after) params.after = after;

  const res = await apiClient.get("/ai-service/agent/getAllAssistants", {
    params,
    headers: {
      "Content-Type": "application/json",
      ...(`${process.env.AUTH_TOKEN}`
        ? { Authorization: `Bearer ${process.env.AUTH_TOKEN}` }
        : {}),
    },
    // withCredentials: true, // enable if you use cookie auth
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

  return {
    object: res.data?.object ?? "list",
    data: normalized,
    hasMore: !!res.data?.hasMore,
    firstId: res.data?.firstId,
    lastId: res.data?.lastId,
  };
}

const HiddenAssistantCard: React.FC<{
  assistant: Assistant;
  onOpen: () => void;
}> = ({ assistant, onOpen }) => {
  const fallback = makeInitialsSVG(assistant.name || "AI");
  const chosenThumb = (assistant.imageUrl || "").trim() || fallback;
  const [imgSrc, setImgSrc] = useState<string>(chosenThumb);

  return (
    <div
      className={[
        "relative group rounded-2xl",
        "shadow-purple-400/60",
        "after:absolute after:-inset-[2px] after:rounded-2xl after:content-[''] after:-z-10",
        "after:shadow-[0_0_0_6px_rgba(147,51,234,0.12)] after:pointer-events-none",
        "transition-transform hover:-translate-y-0.5",
        "h-full flex flex-col",
      ].join(" ")}
    >
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-lg hover:ring-gray-300 transition overflow-hidden flex flex-col h-full">
        {/* Header image area — 16:9 like the store */}
        <div className="relative w-full">
          <div
            className="h-0 w-full pb-[56%] overflow-hidden"
            aria-hidden="true"
          >
            <img
              src={imgSrc}
              alt={`${assistant.name || "Agent"} thumbnail`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={() => setImgSrc(fallback)}
            />
          </div>
          {/* Bot badge (same position as in store) */}
          <div className="absolute -bottom-6 left-4 h-12 w-12 rounded-xl bg-white shadow ring-1 ring-gray-200 flex items-center justify-center">
            <Bot className="h-6 w-6 text-purple-700" />
          </div>
        </div>

        {/* Content */}
        <div className="pt-8 px-5 pb-5 flex flex-col h-full">
          <div className="min-w-0">
            <h3 className="font-semibold text-[16px] text-gray-900 leading-snug line-clamp-2">
              {assistant.name || "Untitled Agent"}
            </h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
              {assistant.description || "No description provided."}
            </p>
          </div>

          {/* No Open for hidden; keep alignment */}
          <div className="mt-auto pt-5 flex items-center gap-2">
            <button
              onClick={onOpen}
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-[13px] font-semibold transition"
              title="Open agent"
            >
              Open
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------ Page ------------------
const RadhaHiddenAgents: React.FC = () => {
  const [hiddenAgents, setHiddenAgents] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setErr(null);

        const pageSize = 50;
        let after: string | undefined = undefined;
        const all: Assistant[] = [];

        // keep fetching until API says no more pages
        for (let safeg = 0; safeg < 20; safeg++) {
          const resp: AssistantsResponse = await getAssistants(pageSize, after);
          all.push(...resp.data);
          if (!resp.hasMore) break;
          after = resp.lastId || undefined;
        }

        const onlyHidden = all.filter(isHiddenAgent);
        if (!cancelled) setHiddenAgents(onlyHidden);
      } catch (e: any) {
        if (!cancelled) {
          const msg =
            e?.response?.data?.message ||
            e?.message ||
            "Failed to load hidden agents";
          setErr(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpen = (a: Assistant) => {
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Hidden Agents</h1>
        </div>
        <Link
          to="/bharath-aistore/RadhaAgents"
          className="text-sm font-semibold text-purple-700 hover:text-purple-800"
        >
          ← Back to Radha’s AI Lab
        </Link>
      </div>
      {loading && <div className="text-gray-600">Loading hidden agents…</div>}
      {err && (
        <div className="text-red-600 font-medium whitespace-pre-wrap break-words">
          Error: {err}
        </div>
      )}
      {!loading && !err && hiddenAgents.length === 0 && (
        <div className="text-gray-600">No hidden agents found.</div>
      )}

      {!loading && !err && hiddenAgents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {hiddenAgents.map((a) => (
            <div
              key={a.assistantId || a.id || a.agentId || ""}
              className="h-full flex flex-col"
            >
              <HiddenAssistantCard assistant={a} onOpen={() => handleOpen(a)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RadhaHiddenAgents;
