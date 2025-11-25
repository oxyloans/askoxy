import React, { useEffect, useMemo, useState } from "react";
import { Bot, Shield, X, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../Config";

/* ============================================================
   Shared helpers (fallback image & auth)
   ============================================================ */
const PLAY_COLORS = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"] as const;

const hashSeed = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const isApprovedStatus = (s?: string) =>
  /approved/i.test(String(s || "").trim());

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

const apiClient = axios.create({
  baseURL: (BASE_URL || "").replace(/\/+$/, ""),
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

const PRELOGIN_TOKEN =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzOGY3MWRhMy01ZjFkLTRiODItYTgzZi0wZmM0MDU4ZTI1NTQiLCJpYXQiOjE3NTkyMzExMTEsImV4cCI6MTc2MDA5NTExMX0.WPotQxTI9_HuJJ_YXzKJPaWb6GU9F9nf8BUI5HjmZZB3N8Vw0Mad7K0rpRcXViqFqSF5u23IoyKMqkszkKpxmQ";

function getOptionalAuthHeaders(): Record<string, string> {
  const token =
    localStorage.getItem("AUTH_TOKEN") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    PRELOGIN_TOKEN;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/* ============================================================
   Types
   ============================================================ */
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
  ownerId?: string;
  userId?: string;
  createdBy?: string;
  metadata?: Record<string, unknown> | null;
};

type OtherAgent = {
  id: string;
  agentName: string;
  description: string;
  url: string;
  categoryType?: string; // NEW
};

/* ============================================================
   MY AGENTS (Admin)
   ============================================================ */
function normalizeAssistantsPayload(resData: any): Assistant[] {
  const list = Array.isArray(resData?.data)
    ? resData.data
    : Array.isArray(resData)
    ? resData
    : [];
  return list.map((a: any) => ({
    ...a,
    assistantId: a?.assistantId || a?.id,
    agentId: a?.agentId || a?.id || a?.assistantId,
    imageUrl: a?.imageUrl || a?.image || a?.thumbUrl || "",
    description: a?.description ?? a?.desc ?? "",
    status: a?.status || a?.agentStatus,
  }));
}

const AdminCard: React.FC<{ a: Assistant; onOpen: () => void }> = ({
  a,
  onOpen,
}) => {
  const title = a.name || "Untitled Agent";
  const fallbackSrc = makeInitialsSVG(title);
  const [imgSrc, setImgSrc] = useState(
    (a.imageUrl || "").trim() || fallbackSrc
  );
  const approved = isApprovedStatus(a.status);
  return (
    <div
      onClick={onOpen}
      className="group cursor-pointer rounded-xl bg-white ring-1 ring-gray-200 hover:ring-gray-300 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
    >
      {/* Stable 16:9 media header */}
      <div className="relative w-full h-0 pb-[56%] bg-gray-50">
        <img
          src={imgSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImgSrc(fallbackSrc)}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-semibold text-[15px] text-gray-900 line-clamp-2">
          {title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-3">
          {a.description || ""}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span
            className={`text-[11px] font-medium rounded-full px-2 py-0.5 ${
              approved
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {a.status || "Unknown"}
          </span>
          <span className="text-sm font-medium text-purple-600 group-hover:text-purple-700">
            Open →
          </span>
        </div>
      </div>
    </div>
  );
};

const MyAgentsTab: React.FC = () => {
  const navigate = useNavigate();

  const USER_ID = "9f2cf68b-6f03-417d-a903-be7d80d2d927";

  const isOwnedBy = (a: Assistant, uid: string) => {
    const target = uid.toLowerCase();
    const o1 = (a.ownerId || "").toString().toLowerCase();
    const o2 = (a.userId || "").toString().toLowerCase();
    const o3 = (a.createdBy || "").toString().toLowerCase();
    return [o1, o2, o3].some((v) => v && v === target);
  };

  const [agents, setAgents] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  const approvedAgents = useMemo(() => agents, [agents]);

  const handleOpen = (a: Assistant) => {
    const loggedIn = !!localStorage.getItem("userId");
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
  

    const intended =
      fullAssistantId && fullAgentId
        ? `/${fullAssistantId}/${fullAgentId}/${nameSlug}`
        : fullAssistantId
        ? `/${fullAssistantId}`
        : `/${nameSlug}`;

    if (!loggedIn) {
      try {
        sessionStorage.setItem("redirectPath", intended);
      } catch {}
      window.location.href = "/whatsapplogin";
      return;
    }
    navigate(intended);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const resp = await apiClient.get("/ai-service/agent/allAgentDataList", {
          headers: getOptionalAuthHeaders(),
          params: { userId: USER_ID },
        });

        const raw = Array.isArray(resp?.data)
          ? resp.data
          : Array.isArray(resp?.data?.assistants)
          ? resp.data.assistants
          : [];

        // Keep only approved agents and normalize for card rendering
        const approvedNormalized = raw
          .filter(
            (a: any) =>
              a?.status?.toLowerCase() === "approved" ||
              a?.agentStatus?.toLowerCase() === "approved"
          )
          .map((a: any) => ({
            ...a,
            assistantId: a?.assistantId || a?.id,
            agentId: a?.agentId || a?.id || a?.assistantId,
            name: a?.agentName || a?.AgentName || a?.Name || "Untitled Agent",
            description: a?.description ?? a?.desc ?? "",
            status: a?.status || a?.agentStatus || "Approved",
            imageUrl: a?.imageUrl || a?.image || a?.thumbUrl || "",
            userId: a?.userId || a?.ownerId || a?.createdBy,
          }));

        setAgents(approvedNormalized);
      } catch (e: any) {
        const status = e?.response?.status;
        const body = e?.response?.data;
        setErr(body?.message || `Failed to load (HTTP ${status || "?"})`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  if (err) {
    return (
      <div className="mb-6 rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
        {err}
      </div>
    );
  }

  return loading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 items-stretch auto-rows-fr">
      {Array.from({ length: 6 }).map((_, i) => (
        <div className="animate-pulse bg-white rounded-xl ring-1 ring-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-200 h-0 pb-[56%] w-full" />
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-3 bg-gray-200 rounded w-full mb-2" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  ) : approvedAgents.length === 0 ? (
    <div className="text-center py-16">
      <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900">
        No Approved Agents Found
      </h3>
      <p className="text-gray-600">
        We didn’t find approved agents for{" "}
        <code className="font-mono">9f2cf68b-6f03-417d-a903-be7d80d2d927</code>.
        Make sure you’re logged in as the right user, or check the agent status
        in the backend.
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 items-stretch auto-rows-fr">
      {approvedAgents.map((a, i) => (
        <div key={`${a.assistantId || a.id || i}`} className="h-full">
          <AdminCard a={a} onOpen={() => handleOpen(a)} />
        </div>
      ))}
    </div>
  );
};

/* ============================================================
   INSURANCE (embedded)
   ============================================================ */
const INS_CANONICAL = [
  "AI-Based IRDAI GI Reg Audit",
  "AI-Based IRDAI LI Reg Audit by ASKOXY.AI",
  "IRDAI Enforcement Actions",
  "General Insurance Discovery",
  "Life Insurance Citizen Discovery",
] as const;
type InsCanonical = (typeof INS_CANONICAL)[number];

const INS_ID_TO_CANONICAL: Record<string, InsCanonical> = {
  asst_fGP7NQpP6kbr5iHGtaFhrhow: "AI-Based IRDAI GI Reg Audit",
  asst_hKOb17A6fLeBFKq05sDLVbSL: "AI-Based IRDAI LI Reg Audit by ASKOXY.AI",
  asst_v65QvaurFXMf7VJ8oFJ6F6Zn: "IRDAI Enforcement Actions",
  asst_bRxg1cfAfcQ05O3UGUjcAwwC: "General Insurance Discovery",
  asst_G2jtvsfDcWulax5QDcyWhFX1: "Life Insurance Citizen Discovery",
};

const INS_NAME_TO_IMAGE: Record<InsCanonical, string> = {
  "AI-Based IRDAI GI Reg Audit":
    "https://i.ibb.co/PGtHTnf9/Chat-GPT-Image-Sep-21-2025-09-13-25-AM.png",
  "IRDAI Enforcement Actions":
    "https://i.ibb.co/GZ41fZ1/Chat-GPT-Image-Sep-21-2025-09-13-22-AM.png",
  "AI-Based IRDAI LI Reg Audit by ASKOXY.AI":
    "https://i.ibb.co/6JmrvSXc/Chat-GPT-Image-Sep-21-2025-09-11-37-AM.png",
  "General Insurance Discovery":
    "https://i.ibb.co/BHLgWkHx/Chat-GPT-Image-Sep-21-2025-09-09-37-AM.png",
  "Life Insurance Citizen Discovery":
    "https://i.ibb.co/3ybg3TMD/Chat-GPT-Image-Sep-22-2025-12-33-31-PM.png",
};

type InsView = Assistant & { displayName: InsCanonical; imageUrl: string };

async function getAllAssistants(after?: string) {
  const config: any = { headers: getOptionalAuthHeaders() };
  if (after) config.params = { after };
  const res = await apiClient.get("/ai-service/agent/getAllAssistants", config);

  // NEW: accept data | assistants | root-array
  const raw = Array.isArray(res.data?.data)
    ? res.data.data
    : Array.isArray(res.data?.assistants)
    ? res.data.assistants
    : Array.isArray(res.data)
    ? res.data
    : [];

  const normalized = raw.map((a: any) => ({
    ...a,
    assistantId: a?.assistantId || a?.id,
    agentId: a?.agentId || a?.id || a?.assistantId,
    imageUrl: a?.imageUrl || a?.image || a?.thumbUrl || "",
    description: a?.description ?? a?.desc ?? "",
    status: a?.status || a?.agentStatus,
    name:
      a?.agentName || a?.AgentName || a?.name || a?.Name || "Untitled Agent",
  }));

  return {
    data: normalized as Assistant[],
    has_more: !!(res.data?.has_more ?? res.data?.hasMore),
    lastId: res.data?.lastId as string | undefined,
  };
}

const normalizeTitle = (s: string) =>
  (s || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const INS_ALIASES: Record<InsCanonical, string[]> = {
  "AI-Based IRDAI GI Reg Audit": [
    "irdai gi reg audit",
    "irdai general insurance audit",
    "gi audit"
  ],
  "AI-Based IRDAI LI Reg Audit by ASKOXY.AI": [
    "irdai li reg audit",
    "irdai life insurance audit",
    "li audit",
    "life insurance audit"
  ],
  "IRDAI Enforcement Actions": [
    "irdai enforcement",
    "irdai actions",
    "enforcement action",
    "irdai penalties"
  ],
  "General Insurance Discovery": [
    "general insurance discovery",
    "gi discovery",
    "insurance discovery"
  ],
  "Life Insurance Citizen Discovery": [
    "life insurance discovery",
    "li discovery",
    "citizen discovery"
  ],
};

// Build fast lookup: exact normalized canonical + aliases
const INS_NAME_TO_CANONICAL_FALLBACK: Record<string, InsCanonical> = (() => {
  const map: Record<string, InsCanonical> = {};
  for (const c of INS_CANONICAL) {
    map[normalizeTitle(c)] = c;
    for (const alias of (INS_ALIASES[c] || [])) {
      map[normalizeTitle(alias)] = c;
    }
  }
  return map;
})();


function insMapImage(displayName: InsCanonical, apiImage?: string) {
  const cleaned = (apiImage || "").trim();
  return cleaned || INS_NAME_TO_IMAGE[displayName];
}
function buildInsuranceListById(all: Assistant[]): InsView[] {
  const seen = new Set<string>();
  const picked: InsView[] = [];

  for (const a of all) {
    const id = (a.assistantId || a.id || "").trim();
    let displayName: InsCanonical | undefined;

    // 1) Strict ID allowlist
    if (id && INS_ID_TO_CANONICAL[id]) {
      displayName = INS_ID_TO_CANONICAL[id] as InsCanonical;
    } else {
      // 2) Name-based fallbacks: exact, alias, and partial
      const raw =
        (a.name ||
          (a as any).agentName ||
          (a as any).Name ||
          (a as any).AgentName ||
          "") + "";
      const nm = normalizeTitle(raw);

      // 2a) Exact/alias map
      if (INS_NAME_TO_CANONICAL_FALLBACK[nm]) {
        displayName = INS_NAME_TO_CANONICAL_FALLBACK[nm];
      } else {
        // 2b) Partial contains: canonical in api-name OR api-name in canonical
        for (const canonical of INS_CANONICAL) {
          const cn = normalizeTitle(canonical);
          if (nm.includes(cn) || cn.includes(nm)) {
            displayName = canonical;
            break;
          }
          // 2c) Alias partials
          const aliases = INS_ALIASES[canonical] || [];
          for (const al of aliases) {
            const an = normalizeTitle(al);
            if (nm.includes(an) || an.includes(nm)) {
              displayName = canonical;
              break;
            }
          }
          if (displayName) break;
        }
      }
    }

    if (!displayName) continue;
    if (seen.has(displayName)) continue;
    seen.add(displayName);

    picked.push({
      ...a,
      displayName,
      imageUrl: insMapImage(displayName, a.imageUrl),
    } as InsView);
  }

  return picked.sort(
    (a, b) =>
      INS_CANONICAL.indexOf(a.displayName) -
      INS_CANONICAL.indexOf(b.displayName)
  );
}

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

const TileCard: React.FC<{ a: any; onOpen: () => void; badge: string }> = ({
  a,
  onOpen,
  badge,
}) => {
  const [showMore, setShowMore] = useState(false);
  const title = a.displayName || a.name || "Untitled Agent";
  const [imgSrc, setImgSrc] = useState(a.imageUrl || "");

  return (
    <div className="relative">
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
        className="relative group cursor-pointer rounded-2xl transition-transform hover:-translate-y-0.5 h-full"
        aria-label={`Open ${title}`}
      >
        <div className="rounded-xl bg-white ring-1 ring-gray-200 hover:ring-gray-300 shadow-sm hover:shadow-md transition overflow-hidden h-full flex flex-col">
          <div className="relative w-full h-0 pb-[56%] bg-gray-50">
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
            <div className="absolute -bottom-6 left-4 h-12 w-12 rounded-xl bg-white shadow ring-1 ring-gray-200 flex items-center justify-center">
              <Bot className="h-6 w-6 text-purple-700" />
            </div>
          </div>

          <div className="pt-8 px-4 pb-4 flex-1 flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-[15px] text-gray-900 line-clamp-2">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  {a.description || ""}
                </p>
              </div>
              <span className="shrink-0 text-[11px] font-medium rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0.5">
                {badge}
              </span>
            </div>

            <div className="mt-auto pt-2 flex items-center gap-2">
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
                Read
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReadMoreModal
        open={showMore}
        onClose={() => setShowMore(false)}
        title={title}
        body={a.description || ""}
      />
    </div>
  );
};

const InsuranceTab: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<InsView[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function loadWhitelisted(initialAfter?: string) {
    let after = initialAfter;
    let collected: Assistant[] = [];
    const target = Object.keys(INS_ID_TO_CANONICAL).length;
    for (let i = 0; i < 5; i++) {
      const res = await getAllAssistants(after);
      collected = collected.concat(res.data);
      const filtered = buildInsuranceListById(collected);
      setItems(filtered);
      if (filtered.length >= target || !res.has_more) return;
      after = res.lastId;
    }
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        await loadWhitelisted();
      } catch (e: any) {
        const status = e?.response?.status;
        const body = e?.response?.data;
        setErr(
          body?.message ||
            `Failed to load agents${status ? ` (HTTP ${status})` : ""}`
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleOpen = (a: any) => {
    const userId = localStorage.getItem("userId");
    const assistantId = (a.assistantId || a.id || a.agentId || "")
      .toString()
      .trim();
    const agentId = (a.agentId || a.assistantId || a.id || "")
      .toString()
      .trim();
    const base = window.location.pathname.includes("bharath-aistore")
      ? "bharath-aistore"
      : "bharat-aistore";
    const nameSlug = (a.name || "agent")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const intended =
      assistantId && agentId
        ? `/${base}/assistant/${assistantId}/${agentId}`
        : assistantId
        ? `/${base}/assistant/${assistantId}`
        : `/${base}/assistant/by-name/${nameSlug}`;

    if (!userId) {
      sessionStorage.setItem("redirectPath", intended);
      window.location.href = "/whatsapplogin";
      return;
    }
    navigate(intended);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-5 sm:gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`ins-skeleton-${i}`}
            className="animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden"
          >
            <div className="relative w-full">
              <div className="h-0 w-full pb-[56%] bg-gray-200" />
              <div className="absolute -bottom-6 left-4 h-12 w-12 rounded-xl bg-gray-200" />
            </div>
            <div className="pt-8 px-5 pb-5">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
              <div className="mt-5 flex items-center gap-2">
                <div className="h-8 w-20 bg-gray-200 rounded" />
                <div className="h-8 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (err) return <div className="text-sm text-red-600">{err}</div>;
  if (items.length === 0)
    return (
      <div className="text-center py-16">
        <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">
          No Insurance Agents Found
        </h3>
        <p className="text-gray-600">Check later or contact the admin.</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-5 sm:gap-6 items-stretch auto-rows-fr">
      {items.map((a, i) => (
        <TileCard
          key={`${a.displayName}-${a.assistantId || a.id || i}`}
          a={a}
          onOpen={() => handleOpen(a)}
          badge="Insurance"
        />
      ))}
    </div>
  );
};

/* ============================================================
   HEALTHCARE (embedded)
   ============================================================ */
const HC_CANONICAL = ["Dr. KneeWell", "Dr. PainCare"] as const;
type HcCanonical = (typeof HC_CANONICAL)[number];

const HC_ID_TO_CANONICAL: Record<string, HcCanonical> = {
  asst_Os6dN1Jpn8EywCUDQSvSb8xk: "Dr. KneeWell",
  asst_dPKfeLYbA0B0otqx9hsLEUyu: "Dr. PainCare",
};

type HcView = Assistant & { displayName: HcCanonical };

function buildHealthcareListById(all: Assistant[]): HcView[] {
  return all
    .filter((a) => {
      const id = (a.assistantId || a.id || "").trim();
      return id && HC_ID_TO_CANONICAL[id];
    })
    .map((a) => {
      const id = (a.assistantId || a.id || "").trim();
      const displayName = HC_ID_TO_CANONICAL[id] as HcCanonical;
      return { ...a, displayName } as HcView;
    })
    .sort(
      (a, b) =>
        HC_CANONICAL.indexOf(a.displayName) -
        HC_CANONICAL.indexOf(b.displayName)
    );
}

const HealthcareTab: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<HcView[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function loadWhitelisted(initialAfter?: string) {
    let after = initialAfter;
    let collected: Assistant[] = [];
    const target = Object.keys(HC_ID_TO_CANONICAL).length;
    for (let i = 0; i < 5; i++) {
      const res = await getAllAssistants(after);
      collected = collected.concat(res.data);
      const filtered = buildHealthcareListById(collected);
      setItems(filtered);
      if (filtered.length >= target || !res.has_more) return;
      after = res.lastId;
    }
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        await loadWhitelisted();
      } catch (e: any) {
        const status = e?.response?.status;
        const body = e?.response?.data;
        setErr(
          body?.message ||
            `Failed to load agents${status ? ` (HTTP ${status})` : ""}`
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleOpen = (a: any) => {
    const assistantId = (a.assistantId || a.id || a.agentId || "")
      .toString()
      .trim();
    const agentId = (a.agentId || a.assistantId || a.id || "")
      .toString()
      .trim();
    const base = window.location.pathname.includes("bharath-aistore")
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-5 sm:gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={`hc-skel-${i}`}
            className="animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden"
          >
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
        ))}
      </div>
    );
  }
  if (err) return <div className="text-sm text-red-600">{err}</div>;
  if (items.length === 0)
    return (
      <div className="text-center py-16">
        <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">No Agents Found</h3>
        <p className="text-gray-600">
          We couldn’t find the requested healthcare agents. Try again later.
        </p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-5 sm:gap-6 items-stretch auto-rows-fr">
      {items.map((a, i) => (
        <TileCard
          key={`${a.displayName}-${a.assistantId || a.id || i}`}
          a={a}
          onOpen={() => handleOpen(a)}
          badge="Healthcare"
        />
      ))}
    </div>
  );
};

const OtherAgentsTab: React.FC = () => {
  const [items, setItems] = useState<OtherAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null); // disclaimer
  const [category, setCategory] = useState<string>("ALL"); // NEW

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await apiClient.get("/ai-service/agent/getAllUrls", {
          headers: getOptionalAuthHeaders(),
        });
        // Accept array with or without categoryType
        const list: OtherAgent[] = Array.isArray(res?.data) ? res.data : [];
        setItems(list);
      } catch (e: any) {
        const status = e?.response?.status;
        const body = e?.response?.data;
        setErr(body?.message || `Failed to load (HTTP ${status ?? "?"})`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Build category list (ALL + unique)
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const it of items) {
      const c = (it.categoryType || "").trim();
      if (c) set.add(c);
    }
    return ["ALL", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  // Apply filter
  const filtered = useMemo(
    () =>
      category === "ALL"
        ? items
        : items.filter(
            (it) =>
              (it.categoryType || "").toLowerCase() === category.toLowerCase()
          ),
    [items, category]
  );

  const openWithDisclaimer = (url: string) => setSelectedUrl(url);
  const confirmNavigation = () => {
    if (selectedUrl) {
      window.open(selectedUrl, "_blank", "noopener,noreferrer");
      setSelectedUrl(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-5 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`other-skeleton-${i}`}
            className="animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden flex flex-col"
          >
            <div className="relative w-full">
              <div className="h-0 w-full pb-[56%] bg-gray-200" />
            </div>
            <div className="pt-6 px-5 pb-5">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
              <div className="mt-5 h-8 w-24 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (err) {
    return (
      <div className="mb-6 rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
        {err}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">
          No GPT Store Agents Found
        </h3>
      </div>
    );
  }

  return (
    <>
      {/* Filter bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="text-sm text-gray-700">Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-5 sm:gap-6 items-stretch auto-rows-fr">
        {filtered.map((a) => {
          const title = a.agentName || "AI Agent";
          const fallback = makeInitialsSVG(title);
          return (
            <div
              key={a.id}
              onClick={() => openWithDisclaimer(a.url)}
              className="group cursor-pointer rounded-xl bg-white ring-1 ring-gray-200 hover:ring-gray-300 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              {/* Generated fallback banner */}
              <div className="relative w-full h-0 pb-[40%] bg-gray-50">
                <img
                  src={makeInitialsSVG(title)}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-[15px] text-gray-900 line-clamp-2">
                    {title}
                  </h3>
                  {a.categoryType && (
                    <span className="shrink-0 text-[11px] font-medium rounded-full bg-gray-50 text-gray-700 border border-gray-200 px-2 py-0.5">
                      {a.categoryType}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {a.description || ""}
                </p>

                <div className="mt-auto pt-2 flex items-center justify-end text-sm font-medium text-purple-600 group-hover:text-purple-700">
                  Open →
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer Modal */}
      {selectedUrl && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 max-w-md w-full p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Disclaimer
            </h3>
            <p className="text-sm text-gray-800 mb-6">
              You are leaving ASKOXY.AI and moving to a GPT Store–related
              platform.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setSelectedUrl(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmNavigation}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ============================================================
   AdminMyAgentsPage with Tabs (+ “Other AI Agents”)
   ============================================================ */
const AdminMyAgentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "my" | "insurance" | "healthcare" | "other"
  >("my");
  const [showTabsInfo, setShowTabsInfo] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto">
        <section className="soft-animated-bg p-[2px] rounded-2xl mb-8">
          <div className="bg-white/90 backdrop-blur rounded-2xl px-5 sm:px-8 py-6 sm:py-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 items-center">
              {/* Text: first on mobile, left on desktop */}
              <div className="order-1 md:order-1 md:col-span-3 text-gray-800 leading-relaxed">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-purple-600 mb-3">
                  Greetings from Radhakrishna!
                </h2>
                <p className="text-[15px] sm:text-base mb-3">
                  I’m genuinely excited about the AI Agents roadmap we’re
                  building at Bharat AI Store. My personal mission is simple —
                  to make every task in our company executable by an AI Agent.
                </p>
                <p className="text-[15px] sm:text-base mb-3">
                  As part of this journey, I’m experimenting daily with dozens
                  of AI Agents — some smart, some still learning, all evolving.
                  Each one represents a step toward a more autonomous, scalable
                  future.
                </p>
                <p className="text-[15px] sm:text-base mb-5">
                  Below, you’ll find a growing collection of my live
                  experiments. These agents may be basic today, but together,
                  they represent the foundation of the AI-driven enterprise of
                  tomorrow.
                </p>
                <div className="mt-2 font-semibold text-brown-900">
                  CEO &amp; Founder <br />
                  ASKOXY.AI AI-Z Marketplace <br />
                  OxyLoans — RBI Approved P2P NBFC
                </div>
              </div>

              {/* Image: second on mobile, right on desktop; rounded, no shadow */}
              <div className="order-2 md:order-2 md:col-span-2 flex justify-center items-center">
                <div className="w-[90%] aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden flex items-center justify-center bg-white">
                  <img
                    src="https://i.ibb.co/TBMnfC2K/radha-Prompt.png"
                    alt="Radhakrishna. Thatavarti"
                    className="object-contain rounded-2xl w-full h-full md:h-[360px] lg:h-[410px]"
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("my")}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              activeTab === "my"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
            type="button"
          >
            Radha Agents
          </button>
          <button
            onClick={() => setActiveTab("insurance")}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              activeTab === "insurance"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
            type="button"
          >
            Insurance Agents
          </button>
          <button
            onClick={() => setActiveTab("healthcare")}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              activeTab === "healthcare"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
            type="button"
          >
            Healthcare Agents
          </button>

          {/* NEW tab */}
          <button
            onClick={() => setActiveTab("other")}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              activeTab === "other"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
            type="button"
          >
            GPT Store Agents
          </button>
        </div>

        {activeTab === "my" && <MyAgentsTab />}
        {activeTab === "insurance" && <InsuranceTab />}
        {activeTab === "healthcare" && <HealthcareTab />}
        {activeTab === "other" && <OtherAgentsTab />}

        {/* Tiny Modal explaining tabs */}
        {showTabsInfo && (
          <div className="fixed inset-0 z-[110]">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowTabsInfo(false)}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Tabs</h3>
                  <button
                    className="p-1 rounded-md hover:bg-gray-100"
                    aria-label="Close"
                    onClick={() => setShowTabsInfo(false)}
                    type="button"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="px-5 py-4 text-sm text-gray-700">
                  <p>
                    <strong>My Agents</strong> shows your own approved agents
                    (by userId). <strong>Insurance</strong> and{" "}
                    <strong>Healthcare</strong> list curated assistants.{" "}
                    <strong>Other AI Agents</strong> shows external agents from{" "}
                    <code>/api/ai-service/agent/getAllUrls</code>.
                  </p>
                </div>
                <div className="px-5 pb-5">
                  <button
                    className="ml-auto block px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowTabsInfo(false)}
                    type="button"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminMyAgentsPage;
