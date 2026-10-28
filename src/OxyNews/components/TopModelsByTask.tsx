import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Link, Navigate, Route, Routes, useParams, useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../../Config";
import { getModelIconUrl } from "../lib/providerData";
import { useModelCatalog, resolveModel, perMillion, fmtContext, fmtDate } from "../lib/openrouterCatalog";

/* ────────────────────────────────────────────────────────────────────────────
   ROUTES  (mount once in your router)

     <Route path="/rankings/*" element={<RankingsRoutes />} />

     /rankings                          -> treemap + tables  (TopModelsByTask)
     /rankings/anthropic                -> provider page: all its models
     /rankings/anthropic/claude-opus-5.5 -> model page: where it ranks

   TopModelsByTask can still be embedded in any other page; its links point to
   basePath (default "/rankings").
──────────────────────────────────────────────────────────────────────────── */

// ── API ──────────────────────────────────────────────────────────────────────
const API_URL = `${BASE_URL}/marketing-service/campgin/rankings/task-spend`;

const COLORS: Record<string, string> = {
  general: "#6366f1",
  agent: "#ec4899",
  code: "#0d9488",
  data: "#f59e0b",
};

const NAMES: Record<string, string> = {
  classification_tagging: "Classification", content_writing: "Content Writing",
  roleplay_fiction: "Roleplay & Fiction", qa_knowledge: "Q&A & Knowledge",
  conversational_reply: "Conversation", research_report: "Research & Reports",
  customer_support: "Customer Support", summarization: "Summarization",
  security_audit: "Security Audit", math: "Math", finance_trading: "Finance & Trading",
  translation: "Translation", devops: "DevOps",
  "agent:workflow_execution": "Workflow Execution", "agent:multi_step_planning": "Multi-step Planning",
  "agent:tool_dispatch": "Tool Dispatch", "agent:web_search": "Web Search",
  "agent:memory_extraction": "Memory Extraction", "code:general_impl": "Code Generation",
  "code:debugging": "Debugging", "code:file_read_write": "File I/O",
  "code:review_security": "Code Review", "code:shell_execution": "Shell Execution",
  "code:frontend_ui": "Frontend & UI", "code:repo_scan": "Repo Scanning",
  "code:devops_config": "DevOps Config", "code:sql_database": "SQL & Databases",
  "data:extraction": "Data Extraction", "data:transformation": "Data Transformation",
};

const TASK_COLORS: Record<string, string> = {
  classification_tagging: "#f43f5e",
  content_writing: "#ea580c",
  roleplay_fiction: "#8b5cf6",
  qa_knowledge: "#2563eb",
  conversational_reply: "#10b981",
  research_report: "#06b6d4",
  customer_support: "#14b8a6",
  summarization: "#eab308",
  security_audit: "#dc2626",
  math: "#4f46e5",
  finance_trading: "#059669",
  translation: "#a855f7",
  devops: "#64748b",
  "agent:workflow_execution": "#7c3aed",
  "agent:multi_step_planning": "#3b82f6",
  "agent:tool_dispatch": "#0d9488",
  "agent:web_search": "#0284c7",
  "agent:memory_extraction": "#d946ef",
  "code:general_impl": "#10b981",
  "code:debugging": "#e11d48",
  "code:file_read_write": "#f59e0b",
  "code:review_security": "#ef4444",
  "code:shell_execution": "#6366f1",
  "code:frontend_ui": "#8b5cf6",
  "code:repo_scan": "#06b6d4",
  "code:devops_config": "#475569",
  "code:sql_database": "#1d4ed8",
  "data:extraction": "#ec4899",
  "data:transformation": "#9333ea",
};

const DIVERSE_PALETTE = [
  "#6366f1", "#ec4899", "#10b981", "#f59e0b",
  "#3b82f6", "#8b5cf6", "#14b8a6", "#ea580c",
  "#06b6d4", "#d946ef", "#84cc16", "#ef4444",
  "#0284c7", "#a855f7", "#059669", "#f43f5e",
];

function getTileColor(tag: string, catKey: string, index: number): string {
  if (TASK_COLORS[tag]) return TASK_COLORS[tag];
  return DIVERSE_PALETTE[index % DIVERSE_PALETTE.length] || COLORS[catKey] || "#6366f1";
}

const PROVIDER_BRAND_COLORS: Record<string, string> = {
  openai: "#10a37f", anthropic: "#d97757", google: "#4285f4", "google-deepmind": "#4285f4",
  deepseek: "#1e88e5", meta: "#0668e1", "meta-llama": "#0668e1", mistral: "#f97316",
  mistralai: "#f97316", "x-ai": "#111827", xai: "#111827", qwen: "#6366f1", cohere: "#39594d",
  groq: "#f55036", moonshot: "#0284c7", moonshotai: "#0284c7", "z-ai": "#2563eb",
  zhipuai: "#2563eb", glm: "#2563eb", minimax: "#e11d48", together: "#7c3aed",
  nvidia: "#76b900", amazon: "#ff9900", microsoft: "#00a4ef", perplexity: "#22b8cf",
};

function getLogoUrl(provider: string, model?: string): string {
  return getModelIconUrl(provider, model);
}

// ── Types ────────────────────────────────────────────────────────────────────
interface ApiModel { model: string; share: number; deltaPp: number }
interface ApiTask { tag: string; macroCategory: string; spendShareOfTotal: number; models: ApiModel[] }
interface ApiCategory { key: string; label: string; spendShare: number }
interface ApiSection { windowDays: number; macroCategories: ApiCategory[]; tasks: ApiTask[] }
interface ApiResponse { data: { spend: ApiSection; tokens: ApiSection } }

interface TaskModel { id: string; name: string; rawModel: string; share: number; provider: string; deltaPp?: number }
interface Task { tag: string; name: string; value: number; models: TaskModel[] }
interface Category { key: string; label: string; share: number; color: string; tasks: Task[] }

interface Tile {
  task: Task; cat: Category; i: number;
  x: number; y: number; w: number; h: number;
}

type Metric = "spend" | "tokens";

// ── Helpers ──────────────────────────────────────────────────────────────────
function pretty(s: string) {
  return s.replace(/_/g, " ").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function taskName(tag: string) {
  return NAMES[tag] ?? pretty(tag.split(":").pop()!);
}

function modelName(mid: string) {
  if (!mid) return "Unknown Model";
  const parts = mid.split("/");
  const rawName = parts.length > 1 ? parts.slice(1).join("/") : parts[0];
  const cleaned = rawName.replace(/-\d{8}$/, "").split(":")[0];
  const formatted = pretty(cleaned)
    .replace(/\bGpt\b/gi, "GPT")
    .replace(/\bGlm\b/gi, "GLM")
    .replace(/\bDeepseek\b/gi, "DeepSeek")
    .replace(/\bQwen\b/gi, "Qwen")
    .replace(/\bLlama\b/gi, "Llama")
    .replace(/\bClaude\b/gi, "Claude")
    .replace(/\bGemini\b/gi, "Gemini")
    .replace(/\bMistral\b/gi, "Mistral");
  return formatted || pretty(mid);
}

function normSlug(s: string): string {
  if (!s) return "";
  const rest = s.includes("/") ? s.split("/").slice(1).join("/") : s;
  return rest
    .toLowerCase()
    .trim()
    .replace(/-\d{8}$/, "")
    .replace(/:free$/, "")
    .replace(/[._]/g, "-");
}

// URL pieces: "anthropic/claude-opus-5.5-20260921" -> provider "anthropic", slug "claude-opus-5.5"
function slugOf(raw: string): string {
  const rest = raw.includes("/") ? raw.split("/").slice(1).join("/") : raw;
  return rest.replace(/-\d{8}$/, "").replace(/:free$/, "");
}
const providerHref = (base: string, p: string) => `${base}/${encodeURIComponent(p)}`;
const modelHref = (base: string, m: { provider: string; rawModel: string }) =>
  `${base}/${encodeURIComponent(m.provider)}/${slugOf(m.rawModel)}`;

const linkStyle: React.CSSProperties = {
  color: "inherit",
  textDecoration: "underline",
  textDecorationColor: "#cbd5e1",
  textUnderlineOffset: 2,
};

// ── Squarify ─────────────────────────────────────────────────────────────────
interface Rect { x: number; y: number; dx: number; dy: number }

function normalize(sizes: number[], W: number, H: number): number[] {
  const total = sizes.reduce((a, b) => a + b, 0);
  return sizes.map(s => (s / total) * W * H);
}

function worst(row: number[], w: number): number {
  const s = row.reduce((a, b) => a + b, 0);
  const rMax = Math.max(...row), rMin = Math.min(...row);
  return Math.max((w * w * rMax) / (s * s), (s * s) / (w * w * rMin));
}

function squarify(sizes: number[], x: number, y: number, W: number, H: number): Rect[] {
  if (!sizes.length) return [];
  const rects: Rect[] = [];
  let remaining = [...sizes];
  let cx = x, cy = y, cw = W, ch = H;

  while (remaining.length) {
    const w = Math.min(cw, ch);
    let row: number[] = [];
    let i = 0;
    while (i < remaining.length) {
      const next = [...row, remaining[i]];
      if (row.length && worst(next, w) > worst(row, w)) break;
      row = next; i++;
    }
    const rowSum = row.reduce((a, b) => a + b, 0);
    const rowH = rowSum / w;
    const vertical = cw >= ch;
    let pos = vertical ? cy : cx;
    for (const r of row) {
      const len = (r / rowSum) * w;
      if (vertical) {
        rects.push({ x: cx, y: pos, dx: rowH, dy: len });
        pos += len;
      } else {
        rects.push({ x: pos, y: cy, dx: len, dy: rowH });
        pos += len;
      }
    }
    if (vertical) { cx += rowH; cw -= rowH; }
    else { cy += rowH; ch -= rowH; }
    remaining = remaining.slice(i);
  }
  return rects;
}

// ── Transform ────────────────────────────────────────────────────────────────
function transform(resp: ApiResponse | null, metric: Metric): Category[] {
  const sec = (resp?.data?.[metric] || (resp as any)?.[metric]) as ApiSection | undefined;
  if (!sec) return [];
  const cats = [...(sec.macroCategories || [])].sort((a, b) => b.spendShare - a.spendShare);
  return cats.map(cat => ({
    key: cat.key,
    label: cat.label || pretty(cat.key),
    share: cat.spendShare > 1 ? cat.spendShare : cat.spendShare * 100,
    color: COLORS[cat.key] ?? "#888",
    tasks: [...(sec.tasks || [])].filter((t: ApiTask) => t.macroCategory === cat.key)
      .sort((a, b) => b.spendShareOfTotal - a.spendShareOfTotal)
      .map((t: ApiTask) => ({
        tag: t.tag,
        name: taskName(t.tag),
        value: t.spendShareOfTotal > 1 ? t.spendShareOfTotal : t.spendShareOfTotal * 100,
        models: [...(t.models || [])]
          .sort((a, b) => b.share - a.share)
          .map((m: ApiModel) => {
            const rawModel = m.model || (m as any).name || (m as any).id || "Unknown";
            const provider = rawModel.includes("/")
              ? rawModel.split("/")[0]
              : (m as any).provider || (m as any).providerSlug || rawModel.split("-")[0] || rawModel;
            return {
              id: rawModel,
              rawModel: rawModel,
              name: modelName(rawModel),
              share: m.share > 1 ? m.share : m.share * 100,
              provider: provider,
              deltaPp: typeof m.deltaPp === "number" ? m.deltaPp : undefined,
            };
          }),
      })),
  }));
}

// ── Shared data hook (one fetch, cached across pages) ────────────────────────
let rankingsCache: Promise<ApiResponse> | null = null;
function loadRankings(): Promise<ApiResponse> {
  if (!rankingsCache) {
    rankingsCache = fetch(API_URL)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .catch(e => { rankingsCache = null; throw e; });
  }
  return rankingsCache;
}

function useRankings() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    loadRankings()
      .then(j => { if (live) setData(j); })
      .catch(e => { if (live) setError(e.message || "Failed to load"); });
    return () => { live = false; };
  }, []);
  return { data, error, loading: !data && !error };
}

// ── Layout ───────────────────────────────────────────────────────────────────
function buildTiles(cats: Category[], W: number, H: number): Tile[] {
  const catSizes = normalize(cats.map(c => c.tasks.reduce((s, t) => s + t.value, 0)), W, H);
  const catRects = squarify(catSizes, 0, 0, W, H);
  const tiles: Tile[] = [];
  cats.forEach((cat, ci) => {
    const cr = catRects[ci];
    if (!cr || !cat.tasks.length) return;
    const taskSizes = normalize(cat.tasks.map(t => t.value), cr.dx, cr.dy);
    const taskRects = squarify(taskSizes, cr.x, cr.y, cr.dx, cr.dy);
    cat.tasks.forEach((task, ti) => {
      const tr = taskRects[ti];
      if (!tr) return;
      tiles.push({ task, cat, i: ti, x: tr.x, y: tr.y, w: tr.dx, h: tr.dy });
    });
  });
  return tiles;
}

// ── Logos ────────────────────────────────────────────────────────────────────
function ProviderLogo({ provider, model, size, offsetX = 0, offsetY = 0 }: { provider: string; model?: string; size: number; offsetX?: number; offsetY?: number }) {
  const [failed, setFailed] = useState(false);
  const p = (provider || "").toLowerCase().trim();
  const brandColor = PROVIDER_BRAND_COLORS[p] || "#6366f1";

  if (failed) {
    return (
      <g>
        <rect x={offsetX} y={offsetY} width={size} height={size} rx={size * 0.22} fill={brandColor} />
        <text
          x={offsetX + size / 2}
          y={offsetY + size / 2 + size * 0.18}
          textAnchor="middle"
          fontSize={size * 0.52}
          fontWeight="800"
          fill="#ffffff"
        >
          {provider[0]?.toUpperCase()}
        </text>
      </g>
    );
  }
  return (
    <image
      href={getLogoUrl(provider, model)}
      x={offsetX + size * 0.08}
      y={offsetY + size * 0.08}
      width={size * 0.84}
      height={size * 0.84}
      preserveAspectRatio="xMidYMid meet"
      onError={() => setFailed(true)}
    />
  );
}

function ProviderIcon({ provider, model, size }: { provider: string; model?: string; size: number }) {
  const [failed, setFailed] = useState(false);
  const p = (provider || "").toLowerCase().trim();
  const brandColor = PROVIDER_BRAND_COLORS[p] || "#6366f1";

  if (failed) {
    return (
      <span
        style={{
          width: size, height: size, borderRadius: 4, background: brandColor, color: "#ffffff",
          fontSize: size * 0.55, fontWeight: 800, display: "inline-flex",
          alignItems: "center", justifyContent: "center", lineHeight: 1,
        }}
      >
        {provider[0]?.toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={getLogoUrl(provider, model)}
      alt={provider}
      width={size}
      height={size}
      style={{ objectFit: "contain", display: "block" }}
      onError={() => setFailed(true)}
    />
  );
}

function IconBox({ provider, model, box, icon }: { provider: string; model?: string; box: number; icon: number }) {
  return (
    <span style={{ width: box, height: box, borderRadius: box * 0.27, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", border: "1px solid #cbd5e1" }}>
      <ProviderIcon provider={provider} model={model} size={icon} />
    </span>
  );
}

function Delta({ v }: { v?: number }) {
  if (v === undefined || v === null) return null;
  const up = v >= 0;
  return (
    <span style={{ color: up ? "#059669" : "#dc2626", fontWeight: 700, fontSize: 11, whiteSpace: "nowrap" }}>
      {up ? "↗ +" : "↘ "}{v.toFixed(1)}
    </span>
  );
}

function matchModelItem(
  item: { rawModel: string; provider?: string },
  pLower: string,
  mSlug: string,
  isStrictProvider: boolean,
  exactOnly: boolean = false
): boolean {
  const itemProvider = (item.provider || "").toLowerCase().trim().replace(/[._]/g, "-");
  const p = (pLower || "").toLowerCase().trim().replace(/[._]/g, "-");
  const itemRaw = (item.rawModel || "").toLowerCase().trim();
  const rawTarget = (mSlug || "").toLowerCase().trim();
  const targetSlug = normSlug(mSlug);
  const itemSlug = normSlug(item.rawModel);

  if (isStrictProvider && p && p !== "rankings" && p !== "task-rankings") {
    const providerMatch = itemProvider === p || itemProvider.includes(p) || p.includes(itemProvider);
    if (!providerMatch) return false;
  }

  // 1. Exact matches:
  // e.g. claude-opus-5.5 matches claude-opus-5.5-20260921 (both normalize to claude-opus-5-5)
  if (itemSlug && targetSlug && itemSlug === targetSlug) return true;
  if (rawTarget && itemRaw === rawTarget) return true;
  if (rawTarget && itemRaw.endsWith("/" + rawTarget)) return true;

  if (exactOnly) return false;

  // 2. Loose prefix fallback only when exactOnly is false (min 4 chars to avoid false collisions)
  if (targetSlug.length >= 4 && itemSlug.length >= 4) {
    if (itemSlug.startsWith(targetSlug + "-") || targetSlug.startsWith(itemSlug + "-")) {
      return true;
    }
  }

  return false;
}

// ── Routes entry ─────────────────────────────────────────────────────────────
export function RankingsRoutes({ basePath = "/rankings" }: { basePath?: string }) {
  return (
    <Routes>
      <Route index element={<div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 40px" }}><TopModelsByTask basePath={basePath} /></div>} />
      <Route path=":provider/:model" element={<ModelRankPage basePath={basePath} />} />
      <Route path=":provider/*" element={<ModelRankPage basePath={basePath} />} />
      <Route path=":provider" element={<ProviderRankPage basePath={basePath} />} />
      <Route path="*" element={<ModelRankPage basePath={basePath} />} />
    </Routes>
  );
}

// ── Page chrome ──────────────────────────────────────────────────────────────
const pageWrap: React.CSSProperties = { maxWidth: 960, margin: "0 auto", padding: "24px 20px 48px", color: "#0f172a", fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" };
const cardStyle: React.CSSProperties = { borderRadius: 16, border: "1px solid #e2e8f0", background: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", overflow: "hidden" };
const thStyle: React.CSSProperties = { padding: "8px 12px", textAlign: "left", color: "#64748b", fontWeight: 700, fontSize: 11, borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap", background: "#f8fafc" };
const tdStyle: React.CSSProperties = { padding: "10px 12px", borderBottom: "1px solid #f1f5f9", fontSize: 13 };

function PageState({ loading, error, base, children }: { loading: boolean; error: string | null; base: string; children: React.ReactNode }) {
  if (loading) return <div style={pageWrap}><p style={{ color: "#64748b" }}>Loading…</p></div>;
  if (error) return <div style={pageWrap}><p style={{ color: "#64748b" }}>Could not load rankings: {error}</p><Link to={base} style={linkStyle}>← Back to rankings</Link></div>;
  return <>{children}</>;
}

// ── Model page ───────────────────────────────────────────────────────────────
export function ModelRankPage({ basePath = "/rankings" }: { basePath?: string }) {
  const params = useParams<{ provider?: string; model?: string; "*"?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract from path segments and params
  const pathParts = (location.pathname || "").split("/").filter(Boolean);
  const rIdx = pathParts.findIndex(p => p.toLowerCase() === "rankings" || p.toLowerCase() === "task-rankings");

  let urlProvider = "";
  let urlModel = "";

  if (rIdx !== -1 && pathParts.length > rIdx + 1) {
    urlProvider = pathParts[rIdx + 1];
    if (pathParts.length > rIdx + 2) {
      urlModel = pathParts.slice(rIdx + 2).join("/");
    }
  } else if (pathParts.length >= 2) {
    urlProvider = pathParts[pathParts.length - 2];
    urlModel = pathParts[pathParts.length - 1];
  }

  if (urlProvider && (urlProvider.toLowerCase() === "rankings" || urlProvider.toLowerCase() === "task-rankings")) {
    urlProvider = "";
  }

  let pParam = params.provider;
  if (pParam && (pParam.toLowerCase() === "rankings" || pParam.toLowerCase() === "task-rankings")) {
    pParam = undefined;
  }

  let mParam = params.model;
  if (!mParam && params["*"]) {
    const starParts = params["*"].split("/").filter(Boolean);
    if (starParts.length >= 2 && !pParam && !urlProvider) {
      pParam = starParts[0];
      mParam = starParts.slice(1).join("/");
    } else {
      mParam = starParts.pop() || "";
    }
  }

  const rawProvider = (pParam || urlProvider || "").trim();
  const rawModel = (mParam || urlModel || "").trim();

  const provider = decodeURIComponent(rawProvider);
  const cleanModel = decodeURIComponent(rawModel);
  const slug = slugOf(cleanModel).trim();
  const providerLower = provider.toLowerCase();
  const matchSlug = slug.toLowerCase();

  const { data, error, loading } = useRankings();
  const [metric, setMetric] = useState<Metric>("spend");
  const { catalog } = useModelCatalog();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const catsSpend = useMemo(() => transform(data, "spend"), [data]);
  const catsTokens = useMemo(() => transform(data, "tokens"), [data]);

  // If spend doesn't have matches but tokens does, auto-switch to tokens
  const activeMetric = useMemo<Metric>(() => {
    const hasSpendStrict = catsSpend.some(c => c.tasks.some(t => t.models.some(m => matchModelItem(m, providerLower, matchSlug, true, true))));
    if (hasSpendStrict) return "spend";

    const hasTokensStrict = catsTokens.some(c => c.tasks.some(t => t.models.some(m => matchModelItem(m, providerLower, matchSlug, true, true))));
    if (hasTokensStrict) return "tokens";

    // Relaxed (without provider constraint)
    const hasSpendRelaxed = catsSpend.some(c => c.tasks.some(t => t.models.some(m => matchModelItem(m, providerLower, matchSlug, false, true))));
    if (hasSpendRelaxed) return "spend";

    const hasTokensRelaxed = catsTokens.some(c => c.tasks.some(t => t.models.some(m => matchModelItem(m, providerLower, matchSlug, false, true))));
    if (hasTokensRelaxed) return "tokens";

    return metric;
  }, [catsSpend, catsTokens, metric, providerLower, matchSlug]);

  const cats = activeMetric === "spend" ? catsSpend : catsTokens;

  const rows = useMemo(() => {
    const out: { cat: Category; task: Task; model: TaskModel; rank: number }[] = [];

    // Stage 1: Strict provider + EXACT slug match
    cats.forEach(cat => cat.tasks.forEach(task => task.models.forEach((model, i) => {
      if (matchModelItem(model, providerLower, matchSlug, true, true)) {
        out.push({ cat, task, model, rank: i + 1 });
      }
    })));

    // Stage 2: Relaxed provider + EXACT slug match (only if stage 1 was empty)
    if (out.length === 0) {
      cats.forEach(cat => cat.tasks.forEach(task => task.models.forEach((model, i) => {
        if (matchModelItem(model, providerLower, matchSlug, false, true)) {
          out.push({ cat, task, model, rank: i + 1 });
        }
      })));
    }

    // Stage 3: Strict provider + loose prefix match (only if still empty)
    if (out.length === 0) {
      cats.forEach(cat => cat.tasks.forEach(task => task.models.forEach((model, i) => {
        if (matchModelItem(model, providerLower, matchSlug, true, false)) {
          out.push({ cat, task, model, rank: i + 1 });
        }
      })));
    }

    // Stage 4: Relaxed provider + loose prefix match (last resort)
    if (out.length === 0) {
      cats.forEach(cat => cat.tasks.forEach(task => task.models.forEach((model, i) => {
        if (matchModelItem(model, providerLower, matchSlug, false, false)) {
          out.push({ cat, task, model, rank: i + 1 });
        }
      })));
    }

    return out.sort((a, b) => a.rank - b.rank || b.task.value - a.task.value);
  }, [cats, providerLower, matchSlug]);

  const realProvider = rows[0]?.model.provider || provider;
  const displaySlug = rows[0] ? slugOf(rows[0].model.rawModel) : slug;

  // Related model in OpenRouter's catalog
  const info = catalog && (rows[0] ? resolveModel(catalog, rows[0].model.rawModel) : resolveModel(catalog, `${realProvider}/${matchSlug}`));

  return (
    <PageState loading={loading} error={error} base={basePath}>
      <div style={pageWrap}>
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate(basePath);
            }
          }}
          style={{ ...linkStyle, background: "none", border: "none", padding: "6px 0", cursor: "pointer", textDecoration: "none", color: "#64748b", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600 }}
        >
          ← Top models by task
        </button>

        {rows.length === 0 ? (
          <div style={{ marginTop: 24, padding: "24px 20px", borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff" }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>This model is not in the current rankings.</p>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>Model requested: {realProvider ? `${realProvider}/` : ""}{slug}</p>
            <div style={{ marginTop: 16 }}>
              <Link to={realProvider ? providerHref(basePath, realProvider) : basePath} style={{ ...linkStyle, fontSize: 13, color: "#7c3aed", fontWeight: 700 }}>
                {realProvider ? `View all ${pretty(realProvider)} models →` : "← Back to rankings"}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16 }}>
              <IconBox provider={realProvider} model={rows[0].model.rawModel} box={48} icon={32} />
              <div>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{info?.name ?? modelName(rows[0].model.rawModel)}</h1>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748b" }}>
                  <Link to={providerHref(basePath, realProvider)} style={linkStyle}>{realProvider}</Link>/{displaySlug}
                </p>
              </div>
            </div>

            {info?.description && (
              <p style={{ margin: "16px 0 0", maxWidth: 720, fontSize: 14, lineHeight: 1.55, color: "#334155" }}>{info.description}</p>
            )}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0" }}>
              {[
                [`#1 in ${rows.filter(r => r.rank === 1).length}`, "tasks"],
                [`${rows.length}`, "tasks ranked"],
                ...(info ? [
                  [`${perMillion(info.pricing?.prompt)} / ${perMillion(info.pricing?.completion)}`, "in / out per 1M tokens"],
                  [fmtContext(info.context_length), "context"],
                  [fmtDate(info.created), "released"],
                ] : []),
              ].map(([a, b]) => (
                <div key={b} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 14px", background: "#fff" }}>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{a}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{b}</div>
                </div>
              ))}
            </div>

            <div style={cardStyle}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 15 }}>Why it is ranked where it is</p>
                  <p style={{ margin: "3px 0 0", fontSize: 11, color: "#94a3b8" }}>Share of {activeMetric} within each task. This shows adoption, not accuracy.</p>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {(["spend", "tokens"] as const).map(m => {
                    const active = activeMetric === m;
                    return (
                      <button key={m} onClick={() => setMetric(m)}
                        style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: active ? "#fff" : "#64748b", border: `1px solid ${active ? "#7c3aed" : "#e2e8f0"}`, borderRadius: 8, padding: "4px 10px", background: active ? "#7c3aed" : "#f8fafc", cursor: "pointer", transition: "all 0.15s" }}>
                        {m === "spend" ? "Spend" : "Tokens"}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Task</th>
                      <th style={thStyle}>Category</th>
                      <th style={{ ...thStyle, textAlign: "center" }}>Rank</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>Share</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ cat, task, model, rank }, i) => {
                      const c = getTileColor(task.tag, cat.key, i);
                      return (
                        <tr key={task.tag}>
                          <td style={{ ...tdStyle, fontWeight: 700 }}>
                            <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", background: c, marginRight: 8 }} />
                            {task.name}
                          </td>
                          <td style={{ ...tdStyle, color: cat.color, fontWeight: 700 }}>{cat.label}</td>
                          <td style={{ ...tdStyle, textAlign: "center", fontWeight: 800 }}>#{rank}</td>
                          <td style={{ ...tdStyle, textAlign: "right", fontWeight: 800 }}>{model.share.toFixed(1)}%</td>
                          <td style={{ ...tdStyle, textAlign: "right" }}><Delta v={model.deltaPp} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </PageState>
  );
}

// ── Provider page ────────────────────────────────────────────────────────────
export function ProviderRankPage({ basePath = "/rankings" }: { basePath?: string }) {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = (location.pathname || "").split("/").filter(Boolean);
  const rIdx = pathParts.findIndex(p => p.toLowerCase() === "rankings" || p.toLowerCase() === "task-rankings");
  let urlProvider = "";
  if (rIdx !== -1 && pathParts.length > rIdx + 1) {
    urlProvider = pathParts[rIdx + 1];
  } else if (pathParts.length >= 1) {
    urlProvider = pathParts[pathParts.length - 1];
  }

  if (urlProvider && (urlProvider.toLowerCase() === "rankings" || urlProvider.toLowerCase() === "task-rankings")) {
    urlProvider = "";
  }

  let pParam = params.provider;
  if (pParam && (pParam.toLowerCase() === "rankings" || pParam.toLowerCase() === "task-rankings")) {
    pParam = undefined;
  }

  const provider = decodeURIComponent(pParam || urlProvider || "").trim();
  const providerLower = provider.toLowerCase();
  const { data, error, loading } = useRankings();
  const catsSpend = useMemo(() => transform(data, "spend"), [data]);
  const catsTokens = useMemo(() => transform(data, "tokens"), [data]);
  const allCats = useMemo(() => [...catsSpend, ...catsTokens], [catsSpend, catsTokens]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const models = useMemo(() => {
    const map = new Map<string, { slug: string; raw: string; name: string; provider: string; tasks: number; firsts: number }>();
    allCats.forEach(cat => cat.tasks.forEach(task => task.models.forEach((m, i) => {
      const mP = (m.provider || "").toLowerCase().trim().replace(/[._]/g, "-");
      const p = (providerLower || "").trim().replace(/[._]/g, "-");
      if (!p || mP === p || mP.includes(p) || p.includes(mP)) {
        const slug = slugOf(m.rawModel);
        const cur = map.get(slug) ?? { slug, raw: m.rawModel, name: m.name, provider: m.provider, tasks: 0, firsts: 0 };
        cur.tasks += 1;
        if (i === 0) cur.firsts += 1;
        map.set(slug, cur);
      }
    })));
    return Array.from(map.values()).sort((a, b) => b.firsts - a.firsts || b.tasks - a.tasks);
  }, [allCats, providerLower]);

  const realProvider = models[0]?.provider || provider;

  return (
    <PageState loading={loading} error={error} base={basePath}>
      <div style={pageWrap}>
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate(basePath);
            }
          }}
          style={{ ...linkStyle, background: "none", border: "none", padding: "6px 0", cursor: "pointer", textDecoration: "none", color: "#64748b", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600 }}
        >
          ← Top models by task
        </button>
        {models.length === 0 ? (
          <div style={{ marginTop: 24, padding: "24px 20px", borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff" }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>No models from provider "{provider}" found.</p>
            <div style={{ marginTop: 16 }}>
              <Link to={basePath} style={{ ...linkStyle, fontSize: 13, color: "#7c3aed", fontWeight: 700 }}>
                ← View all rankings
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16 }}>
              <IconBox provider={realProvider} model={models[0].raw} box={48} icon={32} />
              <div>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>{pretty(realProvider)}</h1>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748b" }}>{models.length} {models.length === 1 ? "model" : "models"} in the rankings</p>
              </div>
            </div>

            <div style={{ ...cardStyle, marginTop: 20 }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 15 }}>All models</p>
              </div>
              {models.map(m => (
                <Link
                  key={m.slug}
                  to={modelHref(basePath, { provider: m.provider || realProvider, rawModel: m.raw })}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid #f1f5f9", color: "#0f172a", textDecoration: "none" }}
                >
                  <IconBox provider={m.provider || realProvider} model={m.raw} box={30} icon={20} />
                  <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{modelName(m.raw)}</span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>#1 in {m.firsts} {m.firsts === 1 ? "task" : "tasks"} · ranked in {m.tasks} {m.tasks === 1 ? "task" : "tasks"}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </PageState>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TopModelsByTask({ basePath = "/rankings" }: { basePath?: string }) {
  const { data: rawData, error: loadError, loading } = useRankings();
  const [metric, setMetric] = useState<Metric>("spend");
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<{ task: Task; cat: Category } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  function calcSize(width: number) {
    const h = width < 700 ? width * 1.2 : Math.min(800, Math.max(360, width * 0.38));
    return { w: width, h };
  }

  const [size, setSize] = useState(() => {
    if (typeof window !== "undefined") {
      const w = window.innerWidth - 64;
      return calcSize(Math.max(300, w));
    }
    return { w: 800, h: 400 };
  });

  // outerRef only exists after loading finishes, so re-attach when `loading` changes
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const { width } = el.getBoundingClientRect();
    if (width > 0) setSize(calcSize(width));
    const ro = new ResizeObserver(entries => {
      const { width: w } = entries[0].contentRect;
      if (w > 0) setSize(calcSize(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [loading]);

  const categories = useMemo(() => transform(rawData, metric), [rawData, metric]);

  const filteredCats = useMemo(
    () => categories.filter(c => !hidden.has(c.key)),
    [categories, hidden]
  );

  const tiles = useMemo(
    () => buildTiles(filteredCats, size.w, size.h),
    [filteredCats, size]
  );

  const toggleCat = useCallback((key: string) => {
    setHidden(prev => {
      const next = new Set(Array.from(prev));
      if (next.has(key)) next.delete(key);
      else if (categories.length - next.size > 1) next.add(key);
      return next;
    });
  }, [categories]);

  const GAP = 1.5;

  if (loading) return (
    <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "#fff", padding: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 32, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid #7c3aed", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
      <span style={{ color: "#64748b", fontSize: 13 }}>Loading task data…</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (loadError || !categories.length) return (
    <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "#fff", padding: 24, textAlign: "center", color: "#94a3b8", fontSize: 12, marginTop: 32 }}>
      Task chart unavailable{loadError ? `: ${loadError}` : ""}
    </div>
  );

  return (
    <div ref={outerRef} style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 32, width: "100%" }}>

      {/* ── CARD 1: Treemap ── */}
      <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "#fff", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
        <div style={{ padding: "18px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", flex: 1 }}>
            <div>
              <p style={{ color: "#0f172a", fontWeight: 800, fontSize: 15, margin: 0, display: "flex", alignItems: "center", gap: 7 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
                Top Models by Task
              </p>
              <p style={{ color: "#94a3b8", fontSize: 11, margin: "3px 0 0" }}>
                Each task's leading models, ranked by share of {metric === "spend" ? "spend" : "tokens"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            {(["spend", "tokens"] as const).map(m => {
              const active = metric === m;
              return (
                <button key={m} onClick={() => setMetric(m)}
                  style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: active ? "#fff" : "#64748b", border: `1px solid ${active ? "#7c3aed" : "#e2e8f0"}`, borderRadius: 8, padding: "6px 12px", background: active ? "#7c3aed" : "#f8fafc", cursor: "pointer", transition: "all 0.15s" }}>
                  {m === "spend" ? "Spend" : "Tokens"}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "12px 20px" }}>
          {categories.map(cat => {
            const on = !hidden.has(cat.key);
            return (
              <button key={cat.key} onClick={() => toggleCat(cat.key)}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${on ? cat.color : "#e2e8f0"}`, background: on ? cat.color + "18" : "#f8fafc", cursor: "pointer", fontSize: 11, fontWeight: 600, color: on ? cat.color : "#94a3b8", transition: "all 0.15s" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: on ? cat.color : "#cbd5e1", flexShrink: 0 }} />
                {cat.label} <span style={{ opacity: 0.65 }}>{cat.share.toFixed(1)}%</span>
              </button>
            );
          })}
        </div>

        <div ref={containerRef} style={{ position: "relative", width: "100%", boxSizing: "border-box", lineHeight: 0 }}>
          <svg
            ref={svgRef}
            width="100%"
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
            style={{ display: "block", overflow: "hidden" }}
          >
            <rect width={size.w} height={size.h} fill="#f8fafc" />
            {tiles.map((tile, idx) => {
              const { x, y, w, h, task, cat, i } = tile;
              const x0 = x + GAP, y0 = y + GAP, x1 = x + w - GAP, y1 = y + h - GAP;
              const tw = x1 - x0, th = y1 - y0;
              if (tw < 2 || th < 2) return null;
              const color = getTileColor(task.tag, cat.key, i);
              const big = tw >= 70 && th >= 44;
              const sz = big ? 24 : (tw >= 34 && th >= 30 ? 18 : 12);
              const showBadge = tw >= 14 && th >= 14;
              const showLabel = big && th >= 62 && task.models.length > 0;
              const bx = big ? x0 + 8 : x0 + (tw - sz) / 2;
              const by = big ? y0 + 8 : y0 + (th - sz) / 2;
              const provider = task.models[0]?.provider ?? "";
              const topModel = task.models[0]?.rawModel ?? "";

              return (
                <g key={idx}
                  onClick={() => setSelectedTask({ task, cat })}
                  style={{ cursor: "pointer" }}
                  aria-label={`${task.name}: ${task.value.toFixed(1)}% of total`}
                >
                  <title>{`${task.name}: ${task.value.toFixed(1)}% share (${cat.label})`}</title>
                  <rect x={x0} y={y0} width={tw} height={th} fill={color} rx={4} />
                  {showBadge && (
                    <>
                      <clipPath id={`clip-${idx}`}>
                        <rect x={bx} y={by} width={sz} height={sz} rx={sz * 0.22} />
                      </clipPath>
                      <rect x={bx} y={by} width={sz} height={sz} fill="#ffffff" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" rx={sz * 0.22} />
                      <g clipPath={`url(#clip-${idx})`}>
                        <ProviderLogo provider={provider} model={topModel} size={sz} offsetX={bx} offsetY={by} />
                      </g>
                    </>
                  )}
                  {showLabel && (() => {
                    const maxChars = Math.max(4, Math.floor((tw - 12) / 7));
                    const words = task.name.split(" ");
                    const lines: string[] = [];
                    let cur = "";
                    for (const w2 of words) {
                      if ((cur + " " + w2).trim().length <= maxChars) cur = (cur + " " + w2).trim();
                      else { if (cur) lines.push(cur); cur = w2; }
                    }
                    if (cur) lines.push(cur);
                    const maxLines = Math.max(1, Math.floor((th - 48) / 17));
                    const shown = lines.slice(0, maxLines);
                    if (maxLines < lines.length) shown[shown.length - 1] = shown[shown.length - 1].slice(0, maxChars - 1) + "…";
                    return (
                      <>
                        {shown.map((line, li) => (
                          <text key={li} x={x0 + 8} y={y0 + 40 + li * 17}
                            fill="#ffffff" fontSize={13} fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif"
                            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.75)", letterSpacing: "0.01em" }}>
                            {line}
                          </text>
                        ))}
                        {th >= 76 && tw >= 90 && (
                          <text x={x0 + 8} y={y0 + 40 + shown.length * 17}
                            fill="rgba(255,255,255,0.92)" fontSize={11} fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif"
                            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}>
                            {task.value.toFixed(1)}% share
                          </text>
                        )}
                      </>
                    );
                  })()}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ── CARD 2: Model Breakdown Table ── */}
      <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "#fff", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
        <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f1f5f9" }}>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#0f172a", display: "flex", alignItems: "center", gap: 7 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
            </svg>
            Model Breakdown by Task
          </p>
          <p style={{ margin: "3px 0 0", color: "#94a3b8", fontSize: 11 }}>Top models per task across all categories</p>
        </div>

        <div style={{ padding: "16px 20px 20px" }}>
          {filteredCats.map(cat => (
            <div key={cat.key} style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${cat.color}33` }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                <span style={{ color: cat.color, fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em" }}>{cat.label}</span>
                <span style={{ color: "#94a3b8", fontSize: 11 }}>{cat.share.toFixed(1)}% of total</span>
              </div>

              <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      <th style={{ padding: "8px 12px", textAlign: "left", color: "#64748b", fontWeight: 700, fontSize: 11, borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>Task</th>
                      <th style={{ padding: "8px 12px", textAlign: "center", color: "#64748b", fontWeight: 700, fontSize: 11, borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>Share</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", color: "#64748b", fontWeight: 700, fontSize: 11, borderBottom: "1px solid #e2e8f0" }}>#1 Model</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", color: "#64748b", fontWeight: 700, fontSize: 11, borderBottom: "1px solid #e2e8f0" }}>#2 Model</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", color: "#64748b", fontWeight: 700, fontSize: 11, borderBottom: "1px solid #e2e8f0" }}>#3 Model</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.tasks.map((task, ti) => {
                      const tColor = getTileColor(task.tag, cat.key, ti);
                      return (
                        <tr key={task.tag} style={{ background: ti % 2 === 0 ? "#fff" : "#fafbfc", transition: "background 0.1s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = tColor + "12")}
                          onMouseLeave={e => (e.currentTarget.style.background = ti % 2 === 0 ? "#fff" : "#fafbfc")}
                        >
                          <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0f172a", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ width: 9, height: 9, borderRadius: "50%", background: tColor, flexShrink: 0, boxShadow: `0 0 0 2px ${tColor}26` }} />
                              <span>{task.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: "9px 12px", textAlign: "center", borderBottom: "1px solid #f1f5f9" }}>
                            <span style={{ background: tColor + "18", color: tColor, fontWeight: 700, fontSize: 10, borderRadius: 20, padding: "2px 8px", border: `1px solid ${tColor}33` }}>{task.value.toFixed(1)}%</span>
                          </td>
                          {[0, 1, 2].map(mi => {
                            const m = task.models[mi];
                            return (
                              <td key={mi} style={{ padding: "9px 12px", borderBottom: "1px solid #f1f5f9" }}>
                                {m ? (
                                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                    <Link to={providerHref(basePath, m.provider)} title={`All ${m.provider} models`} style={{ display: "flex" }}>
                                      <IconBox provider={m.provider} model={m.rawModel} box={22} icon={15} />
                                    </Link>
                                    <Link to={modelHref(basePath, m)} style={{ ...linkStyle, fontWeight: 700, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
                                      {m.name}
                                    </Link>
                                    <span style={{ color: tColor, fontWeight: 800, flexShrink: 0, fontSize: 12 }}>{m.share.toFixed(1)}%</span>
                                  </div>
                                ) : <span style={{ color: "#cbd5e1" }}>—</span>}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Modal for Selected Task Models ── */}
      {selectedTask && (() => {
        const tColor = getTileColor(selectedTask.task.tag, selectedTask.cat.key, 0);
        return (
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(4px)",
              display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
            }}
            onClick={() => setSelectedTask(null)}
          >
            <div
              style={{
                background: "#ffffff", borderRadius: 16, padding: "22px 24px", width: "100%", maxWidth: 440,
                boxShadow: "0 24px 60px -12px rgba(15, 23, 42, 0.35)", border: `1.5px solid ${tColor}40`,
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, background: tColor + "18", color: tColor, padding: "3px 10px", borderRadius: 12, border: `1px solid ${tColor}33` }}>
                    {selectedTask.cat.label} • {selectedTask.task.value.toFixed(1)}% Share
                  </span>
                  <h3 style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: tColor, flexShrink: 0 }} />
                    {selectedTask.task.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  style={{ border: "none", background: "#f1f5f9", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontWeight: 700, fontSize: 14 }}
                >
                  ✕
                </button>
              </div>

              <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: "#64748b" }}>
                All Models ({selectedTask.task.models.length}) — click a model or provider for details:
              </p>

              <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 }}>
                {selectedTask.task.models.map((m, i) => (
                  <div key={m.id || i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <span style={{ color: "#64748b", fontSize: 12, fontWeight: 800, width: 18, textAlign: "right", flexShrink: 0 }}>{i + 1}.</span>
                    <IconBox provider={m.provider} model={m.rawModel} box={26} icon={18} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link to={modelHref(basePath, m)} onClick={() => setSelectedTask(null)} style={{ ...linkStyle, display: "block", fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {m.name || m.rawModel || m.id}
                      </Link>
                      <Link to={providerHref(basePath, m.provider)} onClick={() => setSelectedTask(null)} style={{ ...linkStyle, color: "#64748b", fontSize: 11 }}>
                        by {m.provider}
                      </Link>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontWeight: 800, color: tColor, fontSize: 13 }}>{m.share.toFixed(1)}%</div>
                      <Delta v={m.deltaPp} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}