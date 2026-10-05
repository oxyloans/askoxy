import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import BASE_URL from "../../Config";
import TvrkBanner from "./TvrkBanner";

// ── API ──────────────────────────────────────────────────────────────────────
const API_URL = `${BASE_URL}/marketing-service/campgin/rankings/task-spend`;

// ── Constants ────────────────────────────────────────────────────────────────
const COLORS: Record<string, string> = {
  general: "#ff8244", agent: "#7c6bef", code: "#3cb371", data: "#0088ff",
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

// Exact known mappings where provider slug ≠ icon filename
const LOGO_OVERRIDES: Record<string, string> = {
  openai: "OpenAI",
  google: "GoogleGemini",
  anthropic: "Anthropic",
  deepseek: "DeepSeek",
  "x-ai": "xAI",
  moonshotai: "Moonshot",
  "z-ai": "ZhipuAI",
  mistralai: "Mistral",
  "01-ai": "01AI",
  nousresearch: "NousResearch",
  together: "Together",
  meta: "Meta",
  cohere: "Cohere",
  nvidia: "Nvidia",
  qwen: "Qwen",
  amazon: "Amazon",
  microsoft: "Microsoft",
  perplexity: "Perplexity",
  groq: "Groq",
  "google-deepmind": "GoogleGemini",
  "huggingfaceh4": "HuggingFace",
  "sao10k": "Sao10K",
  "cognitivecomputations": "CognitiveComputations",
  "liquid": "Liquid",
  "inflection": "Inflection",
  "ai21": "AI21",
  "allenai": "AllenAI",
  "databricks": "Databricks",
  "writer": "Writer",
};

function getLogoUrl(provider: string): string {
  const name = LOGO_OVERRIDES[provider] ??
    provider.replace(/-/g, "").replace(/\b\w/g, c => c.toUpperCase());
  return `https://openrouter.ai/images/icons/${name}.svg`;
}

// ── Types ────────────────────────────────────────────────────────────────────
interface ApiModel { model: string; share: number; deltaPp: number }
interface ApiTask { tag: string; macroCategory: string; spendShareOfTotal: number; models: ApiModel[] }
interface ApiCategory { key: string; label: string; spendShare: number }
interface ApiSection { windowDays: number; macroCategories: ApiCategory[]; tasks: ApiTask[] }
interface ApiResponse { data: { spend: ApiSection; tokens: ApiSection } }

interface TaskModel { id: string; name: string; rawModel: string; share: number; provider: string }
interface Task { tag: string; name: string; value: number; models: TaskModel[] }
interface Category { key: string; label: string; share: number; color: string; tasks: Task[] }

interface Tile {
  task: Task; cat: Category; i: number;
  x: number; y: number; w: number; h: number;
}

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

function shade(hex: string, i: number): string {
  const h = hex.replace("#", "");
  let r = parseInt(h.slice(0, 2), 16) / 255;
  let g = parseInt(h.slice(2, 4), 16) / 255;
  let b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hh = 0, l = (max + min) / 2, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hh = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) hh = ((b - r) / d + 2) / 6;
    else hh = ((r - g) / d + 4) / 6;
  }
  const factor = i === 0 ? 1 : i % 3 === 1 ? 0.9 : 0.95;
  l = Math.min(1, l * factor);
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p2 = 2 * l - q;
  function hue2rgb(t: number) {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p2 + (q - p2) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p2 + (q - p2) * (2 / 3 - t) * 6;
    return p2;
  }
  r = hue2rgb(hh + 1 / 3); g = hue2rgb(hh); b = hue2rgb(hh - 1 / 3);
  return "#" + [r, g, b].map(c => Math.round(c * 255).toString(16).padStart(2, "0")).join("");
}

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
    const vertical = cw >= ch; // FIX: was `cw <= ch` (inverted)
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
function transform(resp: ApiResponse, metric: "spend" | "tokens"): Category[] {
  if (!resp || !resp.data || !resp.data[metric]) return [];
  const sec = resp.data[metric];
  const cats = [...(sec.macroCategories || [])].sort((a, b) => b.spendShare - a.spendShare);
  return cats.map(cat => ({
    key: cat.key,
    label: cat.label || pretty(cat.key),
    share: cat.spendShare > 1 ? cat.spendShare : cat.spendShare * 100,
    color: COLORS[cat.key] ?? "#888",
    tasks: [...(sec.tasks || []).filter(t => t.macroCategory === cat.key)]
      .sort((a, b) => b.spendShareOfTotal - a.spendShareOfTotal)
      .map(t => ({
        tag: t.tag,
        name: taskName(t.tag),
        value: t.spendShareOfTotal > 1 ? t.spendShareOfTotal : t.spendShareOfTotal * 100,
        models: [...(t.models || [])]
          .sort((a, b) => b.share - a.share)
          .map(m => {
            const rawModel = m.model || (m as any).name || (m as any).id || "Unknown";
            const provider = rawModel.includes("/")
              ? rawModel.split("/")[0]
              : (m as any).provider || (m as any).providerSlug || rawModel.split("-")[0] || rawModel;
            return {
              id: rawModel,
              rawModel: rawModel,
              name: rawModel,
              share: m.share > 1 ? m.share : m.share * 100,
              provider: provider,
            };
          }),
      })),
  }));
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


// ProviderLogo is only used in Tooltip (SVG context)
function ProviderLogo({ provider, size, offsetX = 0, offsetY = 0 }: { provider: string; size: number; offsetX?: number; offsetY?: number }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <text x={offsetX + size / 2} y={offsetY + size / 2 + size * 0.2} textAnchor="middle" fontSize={size * 0.52} fontWeight="bold" fill="#64748b">
        {provider[0]?.toUpperCase()}
      </text>
    );
  }
  return (
    <image
      href={getLogoUrl(provider)}
      x={offsetX + size * 0.1} y={offsetY + size * 0.1}
      width={size * 0.8} height={size * 0.8}
      preserveAspectRatio="xMidYMid meet"
      onError={() => setFailed(true)}
    />
  );
}

// ── ProviderIcon (HTML img with fallback) ────────────────────────────────────
function ProviderIcon({ provider, size }: { provider: string; size: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span style={{ fontSize: size * 0.6, fontWeight: 700, color: "#64748b", lineHeight: 1 }}>
        {provider[0]?.toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={getLogoUrl(provider)}
      alt={provider}
      width={size}
      height={size}
      style={{ objectFit: "contain", display: "block" }}
      onError={() => setFailed(true)}
    />
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
interface TooltipData { task: Task; cat: Category; mx: number; my: number }

function Tooltip({ data, containerRef }: { data: TooltipData; containerRef: React.RefObject<HTMLDivElement> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (!ref.current || !containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const tRect = ref.current.getBoundingClientRect();
    let left = data.mx - cRect.left + 12;
    let top = data.my - cRect.top + 12;
    if (left + tRect.width > cRect.width - 8) left = data.mx - cRect.left - tRect.width - 12;
    if (top + tRect.height > cRect.height - 8) top = data.my - cRect.top - tRect.height - 12;
    setPos({ left: Math.round(Math.max(4, left)), top: Math.round(Math.max(4, top)) });
  }, [data, containerRef]);

  const models = data.task.models;

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: pos.left,
        top: pos.top,
        zIndex: 60,
        background: "#ffffff",
        borderRadius: 14,
        padding: "14px 16px",
        border: "1px solid #cbd5e1",
        boxShadow: "0 12px 36px -4px rgba(15, 23, 42, 0.22), 0 4px 12px -2px rgba(15, 23, 42, 0.1)",
        minWidth: 260,
        maxWidth: 350,
        pointerEvents: "none",
        fontSize: 12,
        color: "#0f172a",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "optimizeLegibility",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4, paddingBottom: 6, borderBottom: "1px solid #f1f5f9" }}>
        <p style={{ fontWeight: 800, color: "#0f172a", fontSize: 14, margin: 0, lineHeight: 1.2 }}>{data.task.name}</p>
        <span style={{ fontSize: 10, fontWeight: 800, background: data.cat.color + "18", color: data.cat.color, padding: "2px 8px", borderRadius: 12, border: `1px solid ${data.cat.color}33`, whiteSpace: "nowrap" }}>
          {data.task.value.toFixed(1)}%
        </span>
      </div>
      <p style={{ color: "#475569", marginBottom: 8, fontSize: 11, fontWeight: 600 }}>
        Category: <span style={{ color: data.cat.color, fontWeight: 800 }}>{data.cat.label}</span>
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 210, overflowY: "auto", paddingRight: 2 }}>
        {models.map((m, i) => (
          <div key={m.id || i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <span style={{ color: "#64748b", fontSize: 11, fontWeight: 800, width: 14, textAlign: "right", flexShrink: 0 }}>{i + 1}.</span>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", border: "1px solid #cbd5e1" }}>
              <ProviderIcon provider={m.provider} size={15} />
            </span>
            <span style={{ flex: 1, color: "#0f172a", fontWeight: 700, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {m.rawModel || m.name || m.id || "Model"}
            </span>
            <span style={{ fontWeight: 800, color: "#7c3aed", flexShrink: 0, fontSize: 12 }}>{m.share.toFixed(1)}%</span>
          </div>
        ))}
      </div>
      <p style={{ margin: "8px 0 0", color: "#7c3aed", fontSize: 10, fontWeight: 700, textAlign: "center", background: "#f5f3ff", padding: "4px 8px", borderRadius: 6, border: "1px stroke #ddd6fe" }}>
        💡 Click tile to open & scroll full list
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TopModelsByTask() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metric, setMetric] = useState<"spend" | "tokens">("spend");
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<{ task: Task; cat: Category } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [rawData, setRawData] = useState<ApiResponse | null>(null);

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

  // ResizeObserver on outerRef — always mounted
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
  }, []);

  // Fetch
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(API_URL, { signal: ctrl.signal })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((json: any) => {
        setRawData(json);
        const cats = transform(json, metric);
        setCategories(cats);
    setActiveKeys(new Set(cats.map((c: Category) => c.key)));
      })
      .catch(e => { if (e.name !== "AbortError") setError(e.message); })
      .finally(() => { if (!ctrl.signal.aborted) setLoading(false); });
    return () => ctrl.abort();
  }, []); // eslint-disable-line

  // Re-transform when metric changes
  useEffect(() => {
    if (!rawData) return;
    const cats = transform(rawData, metric);
    setCategories(cats);
    setActiveKeys(prev => {
      const keys = new Set(cats.map(c => c.key));
      const kept = Array.from(prev).filter(k => keys.has(k));
      return new Set(kept.length ? kept : Array.from(keys));
    });
  }, [metric, rawData]);

  const filteredCats = useMemo(
    () => categories.filter(c => activeKeys.has(c.key)),
    [categories, activeKeys]
  );

  const tiles = useMemo(
    () => buildTiles(filteredCats, size.w, size.h),
    [filteredCats, size]
  );

  const toggleCat = useCallback((key: string) => {
    setActiveKeys(prev => {
      const next = new Set(Array.from(prev));
      if (next.has(key)) { if (next.size > 1) next.delete(key); }
      else next.add(key);
      return next;
    });
  }, []);

  const GAP = 1.5;

  if (loading) return (
    <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "#fff", padding: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 32, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid #7c3aed", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
      <span style={{ color: "#64748b", fontSize: 13 }}>Loading task data…</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error || !categories.length) return (
    <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "#fff", padding: 24, textAlign: "center", color: "#94a3b8", fontSize: 12, marginTop: 32 }}>
      Task chart unavailable{error ? `: ${error}` : ""}
    </div>
  );

  return (
    <div ref={outerRef} style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 32, width: "100%" }}>

      {/* ── CARD 1: Treemap ── */}
      <div style={{ borderRadius: 16, border: "1px solid #e2e8f0", background: "#fff", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
        {/* Header */}
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

            {/* TVRK Brochure Banner */}
            <TvrkBanner className="my-1 shrink-0" />
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

        {/* Legend chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "12px 20px" }}>
          {categories.map(cat => {
            const on = activeKeys.has(cat.key);
            return (
              <button key={cat.key} onClick={() => toggleCat(cat.key)}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${on ? cat.color : "#e2e8f0"}`, background: on ? cat.color + "18" : "#f8fafc", cursor: "pointer", fontSize: 11, fontWeight: 600, color: on ? cat.color : "#94a3b8", transition: "all 0.15s" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: on ? cat.color : "#cbd5e1", flexShrink: 0 }} />
                {cat.label} <span style={{ opacity: 0.65 }}>{cat.share.toFixed(1)}%</span>
              </button>
            );
          })}
        </div>

        {/* Treemap SVG */}
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
              const color = shade(cat.color, i);
              const big = tw >= 70 && th >= 44;
              const sz = big ? 24 : (tw >= 34 && th >= 30 ? 18 : 12);
              const showBadge = tw >= 14 && th >= 14;
              const showLabel = big && th >= 62 && task.models.length > 0;
              const bx = big ? x0 + 8 : x0 + (tw - sz) / 2;
              const by = big ? y0 + 8 : y0 + (th - sz) / 2;
              const provider = task.models[0]?.provider ?? "";

              return (
                <g key={idx}
                  onClick={() => setSelectedTask({ task, cat })}
                  style={{ cursor: "pointer" }}
                  aria-label={`${task.name}: ${task.value.toFixed(1)}% of total`}
                >
                  <rect x={x0} y={y0} width={tw} height={th} fill={color} rx={3} />
                  {showBadge && (
                    <>
                      <clipPath id={`clip-${idx}`}>
                        <rect x={bx} y={by} width={sz} height={sz} rx={sz * 0.2} />
                      </clipPath>
                      <rect x={bx} y={by} width={sz} height={sz} fill="rgba(255,255,255,0.95)" rx={sz * 0.2} />
                      <g clipPath={`url(#clip-${idx})`}>
                        <ProviderLogo provider={provider} size={sz} offsetX={bx} offsetY={by} />
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
                    return shown.map((line, li) => (
                      <text key={li} x={x0 + 8} y={y0 + 40 + li * 17}
                        fill="#ffffff" fontSize={13} fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif"
                        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)", letterSpacing: "0.01em" }}>
                        {line}
                      </text>
                    ));
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
              {/* Category header */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${cat.color}33` }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                <span style={{ color: cat.color, fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em" }}>{cat.label}</span>
                <span style={{ color: "#94a3b8", fontSize: 11 }}>{cat.share.toFixed(1)}% of total</span>
              </div>

              {/* Table */}
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
                    {cat.tasks.map((task, ti) => (
                      <tr key={task.tag} style={{ background: ti % 2 === 0 ? "#fff" : "#fafbfc", transition: "background 0.1s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = cat.color + "0d")}
                        onMouseLeave={e => (e.currentTarget.style.background = ti % 2 === 0 ? "#fff" : "#fafbfc")}
                      >
                        <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0f172a", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>{task.name}</td>
                        <td style={{ padding: "9px 12px", textAlign: "center", borderBottom: "1px solid #f1f5f9" }}>
                          <span style={{ background: cat.color + "18", color: cat.color, fontWeight: 700, fontSize: 10, borderRadius: 20, padding: "2px 8px", border: `1px solid ${cat.color}33` }}>{task.value.toFixed(1)}%</span>
                        </td>
                        {[0, 1, 2].map(mi => {
                          const m = task.models[mi];
                          return (
                            <td key={mi} style={{ padding: "9px 12px", borderBottom: "1px solid #f1f5f9" }}>
                              {m ? (
                                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                  <span style={{ width: 22, height: 22, borderRadius: 6, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", border: "1px solid #cbd5e1" }}>
                                      <ProviderIcon provider={m.provider} size={15} />
                                    </span>
                                  <span style={{ color: "#0f172a", fontWeight: 700, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{m.name}</span>
                                  <span style={{ color: cat.color, fontWeight: 800, flexShrink: 0, fontSize: 12 }}>{m.share.toFixed(1)}%</span>
                                </div>
                              ) : <span style={{ color: "#cbd5e1" }}>—</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Modal for Selected Task Models ── */}
      {selectedTask && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setSelectedTask(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 16,
              padding: "22px 24px",
              width: "100%",
              maxWidth: 440,
              boxShadow: "0 24px 60px -12px rgba(15, 23, 42, 0.35)",
              border: "1px solid #cbd5e1",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #f1f5f9" }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, background: selectedTask.cat.color + "18", color: selectedTask.cat.color, padding: "3px 10px", borderRadius: 12, border: `1px solid ${selectedTask.cat.color}33` }}>
                  {selectedTask.cat.label} • {selectedTask.task.value.toFixed(1)}% Share
                </span>
                <h3 style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
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
              All Models ({selectedTask.task.models.length}) — Scroll to inspect:
            </p>

            <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 }}>
              {selectedTask.task.models.map((m, i) => (
                <div key={m.id || i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <span style={{ color: "#64748b", fontSize: 12, fontWeight: 800, width: 18, textAlign: "right", flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ width: 26, height: 26, borderRadius: 8, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", border: "1px solid #cbd5e1" }}>
                    <ProviderIcon provider={m.provider} size={18} />
                  </span>
                  <span style={{ flex: 1, color: "#0f172a", fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {m.rawModel || m.name || m.id}
                  </span>
                  <span style={{ fontWeight: 800, color: "#7c3aed", flexShrink: 0, fontSize: 13 }}>{m.share.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}