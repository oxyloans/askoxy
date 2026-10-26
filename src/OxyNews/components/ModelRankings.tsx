import React, { useEffect, useState, useMemo } from "react";
import { api, RawRankingsItem } from "../lib/api";
import { getProviderInfo, getModelIconUrl, PROVIDER_BRAND_COLORS } from "../lib/providerData";
import TvrkBanner from "./TvrkBanner";

interface AggregatedModel {
  key: string;
  model_permaslug: string;
  variant_permaslug: string;
  variant: string;
  prettyName: string;
  author: string;
  provider: string;
  tokens: number;
  promptTokens: number;
  completionTokens: number;
  requests: number;
  change: number | null;
  rawItems: RawRankingsItem[];
}

const PROVIDER_DOMAINS: Record<string, string> = {
  openai: "https://openai.com",
  anthropic: "https://anthropic.com",
  deepseek: "https://deepseek.com",
  google: "https://google.com",
  "google-deepmind": "https://deepmind.google",
  "meta-llama": "https://meta.com",
  meta: "https://meta.com",
  "x-ai": "https://x.ai",
  xai: "https://x.ai",
  mistralai: "https://mistral.ai",
  mistral: "https://mistral.ai",
  qwen: "https://qwenlm.ai",
  cohere: "https://cohere.com",
  nvidia: "https://nvidia.com",
  moonshotai: "https://moonshot.cn",
  moonshot: "https://moonshot.cn",
  "z-ai": "https://zhipuai.cn",
  zhipuai: "https://zhipuai.cn",
  glm: "https://zhipuai.cn",
  minimax: "https://minimaxi.com",
  tencent: "https://www.tencent.com",
  xiaomi: "https://mi.com",
  poolside: "https://poolside.ai",
  upstage: "https://upstage.ai",
  typesafe: "https://typesafe.com",
  microsoft: "https://microsoft.com",
  amazon: "https://aws.amazon.com",
  perplexity: "https://perplexity.ai",
  groq: "https://groq.com",
  together: "https://together.ai",
  "01-ai": "https://01.ai",
  nousresearch: "https://nousresearch.com",
  huggingface: "https://huggingface.co",
  huggingfaceh4: "https://huggingface.co",
  databricks: "https://databricks.com",
  inclusionai: "https://inclusionai.com",
  liquid: "https://liquid.ai",
  inflection: "https://inflection.ai",
  ai21: "https://ai21.com",
  allenai: "https://allenai.org",
  writer: "https://writer.com",
};

function getProviderLogoUrl(author: string, modelSlug?: string): string {
  return getModelIconUrl(author, modelSlug);
}

function ModelIcon({ author, modelSlug, size = 26 }: { author: string; modelSlug?: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const logoUrl = getProviderLogoUrl(author, modelSlug);
  const p = (author || "").toLowerCase().trim();
  const brandColor = PROVIDER_BRAND_COLORS[p] || "#6366f1";

  if (failed || !logoUrl) {
    const letter = (author?.[0] || "?").toUpperCase();
    return (
      <span
        style={{
          width: size,
          height: size,
          borderRadius: 6,
          background: brandColor,
          color: "#ffffff",
          fontWeight: 700,
          fontSize: Math.max(10, Math.round(size * 0.48)),
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {letter}
      </span>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={author}
      width={size}
      height={size}
      loading="lazy"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
        borderRadius: 6,
        flexShrink: 0,
      }}
      onError={() => setFailed(true)}
    />
  );
}

function formatTokens(val: number): string {
  if (val >= 1e12) return (val / 1e12).toFixed(2) + "T";
  if (val >= 1e9) return (val / 1e9).toFixed(1) + "B";
  if (val >= 1e6) return (val / 1e6).toFixed(1) + "M";
  if (val >= 1e3) return (val / 1e3).toFixed(1) + "K";
  return val.toLocaleString();
}

function formatRequests(val: number): string {
  if (val >= 1e9) return (val / 1e9).toFixed(1) + "B";
  if (val >= 1e6) return (val / 1e6).toFixed(1) + "M";
  if (val >= 1e3) return (val / 1e3).toFixed(1) + "K";
  return val.toLocaleString();
}

function prettifyName(slug: string): string {
  const afterSlash = slug.includes("/") ? slug.split("/")[1] : slug;
  const withoutDate = afterSlash.replace(/-\d{8}$/, "");
  return withoutDate
    .split("-")
    .map((w) => {
      if (/^gpt/i.test(w)) return w.toUpperCase();
      if (/^glm/i.test(w)) return w.toUpperCase();
      if (/^ai$/i.test(w)) return "AI";
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

function getAuthor(slug: string): string {
  return slug.includes("/") ? slug.split("/")[0] : "ai";
}

const OPEN_WEIGHTS_AUTHORS = new Set([
  // Meta
  "meta-llama", "meta",
  // Mistral
  "mistralai", "mistral",
  // Alibaba / Qwen
  "qwen", "alibaba",
  // DeepSeek
  "deepseek",
  // Chinese labs
  "z-ai", "zhipuai", "glm", "xiaomi", "tencent", "bytedance", "bytedance-seed",
  "minimax", "moonshotai", "moonshot", "baidu", "stepfun", "meituan",
  // NVIDIA
  "nvidia",
  // Open research
  "01-ai", "nousresearch", "inclusionai", "allenai", "huggingface", "huggingfaceh4",
  "ibm-granite", "togethercomputer",
  // Embedding / sentence models (always open)
  "baai", "sentence-transformers", "thenlper", "intfloat",
  // Other open-weight labs
  "apodex", "inception", "liquid", "arcee-ai", "aion-labs",
  "gryphe", "thedrummer", "sao10k", "undi95", "mancer",
  "anthracite-org", "nex-agi", "prism-ml", "canopylabs",
  "thinkingmachines", "sourceful", "morph", "respan", "sakana",
  "kwaivgi", "black-forest-labs", "recraft", "runway",
]);

function isOpenModel(modelPermaslug: string, author: string): boolean {
  const a = author.toLowerCase().trim();
  const s = modelPermaslug.toLowerCase().trim();
  if (s.includes("gpt-oss")) return true;
  return OPEN_WEIGHTS_AUTHORS.has(a) || OPEN_WEIGHTS_AUTHORS.has(author.trim());
}

/* ── Inference Architecture & Token Pipeline Flow Diagram (SVG) ── */
function TokenFlowDiagram({
  model,
  promptPct,
  complPct,
  providerInfo,
}: {
  model: AggregatedModel;
  promptPct: number;
  complPct: number;
  providerInfo: ReturnType<typeof getProviderInfo>;
}) {
  return (
    <div className="mr-diagram-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
            <line x1="6" y1="6" x2="6.01" y2="6"/>
            <line x1="6" y1="18" x2="6.01" y2="18"/>
          </svg>
          Inference Architecture &amp; Token Pipeline Flow
        </span>
        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
          Live Pipeline • {model.requests.toLocaleString()} total calls
        </span>
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg
          viewBox="0 0 740 120"
          style={{ width: "100%", minWidth: 620, height: "auto", display: "block" }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker id="flow-arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#7c3aed" />
            </marker>
            <marker id="flow-arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#2563eb" />
            </marker>
            <marker id="flow-arrow-teal" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#0d9488" />
            </marker>
          </defs>

          {/* Node 1: Input Prompts */}
          <g transform="translate(10, 10)">
            <rect width="145" height="95" rx="10" fill="#f5f3ff" stroke="#ddd6fe" strokeWidth="1.5" />
            <circle cx="20" cy="22" r="8" fill="#7c3aed" />
            <text x="20" y="25" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="800">1</text>
            <text x="34" y="25" fill="#6d28d9" fontSize="11" fontWeight="800">User Prompt</text>
            <text x="14" y="52" fill="#7c3aed" fontSize="15" fontWeight="800">{formatTokens(model.promptTokens)}</text>
            <text x="14" y="70" fill="#64748b" fontSize="10" fontWeight="600">{promptPct.toFixed(1)}% of total</text>
            <text x="14" y="88" fill="#94a3b8" fontSize="9">Context &amp; instructions</text>
          </g>

          {/* Flow Line 1 */}
          <line x1="158" y1="57" x2="194" y2="57" stroke="#7c3aed" strokeWidth="2" strokeDasharray="3 3" markerEnd="url(#flow-arrow-purple)" />

          {/* Node 2: Provider Edge Router */}
          <g transform="translate(198, 10)">
            <rect width="155" height="95" rx="10" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
            <circle cx="20" cy="22" r="8" fill="#2563eb" />
            <text x="20" y="25" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="800">2</text>
            <text x="34" y="25" fill="#1d4ed8" fontSize="11" fontWeight="800">Provider Gateway</text>
            <text x="14" y="50" fill="#1e293b" fontSize="13" fontWeight="800">
              {(providerInfo?.displayName || model.author).length > 17
                ? (providerInfo?.displayName || model.author).slice(0, 16) + "…"
                : (providerInfo?.displayName || model.author)}
            </text>
            <text x="14" y="68" fill="#64748b" fontSize="10" fontWeight="600">
              {providerInfo?.countryFlag || "🌐"} {providerInfo?.headquarters || "Edge Global"}
            </text>
            <text x="14" y="88" fill="#059669" fontSize="9" fontWeight="700">
              {providerInfo?.dataPolicy?.training ? "Standard Policy" : "Zero Data Training"}
            </text>
          </g>

          {/* Flow Line 2 */}
          <line x1="356" y1="57" x2="392" y2="57" stroke="#2563eb" strokeWidth="2" strokeDasharray="3 3" markerEnd="url(#flow-arrow-blue)" />

          {/* Node 3: Neural Model Core */}
          <g transform="translate(396, 10)">
            <rect width="160" height="95" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="20" cy="22" r="8" fill="#475569" />
            <text x="20" y="25" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="800">3</text>
            <text x="34" y="25" fill="#334155" fontSize="11" fontWeight="800">Transformer Core</text>
            <text x="14" y="50" fill="#0f172a" fontSize="13" fontWeight="800">
              {model.prettyName.length > 17 ? model.prettyName.slice(0, 16) + "…" : model.prettyName}
            </text>
            <text x="14" y="68" fill="#64748b" fontSize="10" fontWeight="600">
              Variant: {model.variant || "Standard"}
            </text>
            <text x="14" y="88" fill="#16a34a" fontSize="9" fontWeight="700">
              🟢 Active Inference
            </text>
          </g>

          {/* Flow Line 3 */}
          <line x1="559" y1="57" x2="595" y2="57" stroke="#0d9488" strokeWidth="2" strokeDasharray="3 3" markerEnd="url(#flow-arrow-teal)" />

          {/* Node 4: Completions */}
          <g transform="translate(598, 10)">
            <rect width="132" height="95" rx="10" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5" />
            <circle cx="18" cy="22" r="8" fill="#0d9488" />
            <text x="18" y="25" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="800">4</text>
            <text x="32" y="25" fill="#0f766e" fontSize="11" fontWeight="800">Completions</text>
            <text x="12" y="52" fill="#0d9488" fontSize="15" fontWeight="800">{formatTokens(model.completionTokens)}</text>
            <text x="12" y="70" fill="#64748b" fontSize="10" fontWeight="600">{complPct.toFixed(1)}% of total</text>
            <text x="12" y="88" fill="#94a3b8" fontSize="9">Output stream</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

/* ── Daily / Periodic Token Trend & Requests Graph (SVG) ── */
function TokenTrendChart({
  records,
  model,
  promptPct,
  complPct,
}: {
  records: RawRankingsItem[];
  model: AggregatedModel;
  promptPct: number;
  complPct: number;
}) {
  const sorted = useMemo(() => {
    const list = [...(records || [])];
    list.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    return list;
  }, [records]);

  const isMultiDate = sorted.length > 1;

  const maxTokens = useMemo(() => {
    return Math.max(
      ...sorted.map((r) =>
        Math.max(
          Number(r.rankingMetricValue || 0),
          Number(r.total_prompt_tokens || 0) + Number(r.total_completion_tokens || 0)
        )
      ),
      1
    );
  }, [sorted]);

  const maxRequests = useMemo(() => {
    return Math.max(...sorted.map((r) => Number(r.count || 0)), 1);
  }, [sorted]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Chart 1: Token Usage History Graph */}
      <div className="mr-diagram-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <div>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              Daily Token Volume &amp; Input/Output Distribution
            </h4>
            <span style={{ fontSize: 11, color: "#64748b" }}>
              {isMultiDate ? `${sorted.length} recorded dates in active window` : "Periodic aggregated volume metrics"}
            </span>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, fontWeight: 600 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: "#7c3aed" }} />
              Prompt (Input)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: "#0d9488" }} />
              Completion (Output)
            </span>
            {isMultiDate && (
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
                Trend Line
              </span>
            )}
          </div>
        </div>

        {isMultiDate ? (
          <div style={{ width: "100%", overflowX: "auto" }}>
            <svg
              viewBox="0 0 680 190"
              style={{ width: "100%", minWidth: 560, height: "auto", display: "block" }}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid Lines */}
              <line x1="50" y1="20" x2="660" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x="44" y="24" textAnchor="end" fontSize="9" fill="#94a3b8" fontWeight="600">{formatTokens(maxTokens)}</text>

              <line x1="50" y1="85" x2="660" y2="85" stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x="44" y="89" textAnchor="end" fontSize="9" fill="#94a3b8" fontWeight="600">{formatTokens(maxTokens / 2)}</text>

              <line x1="50" y1="145" x2="660" y2="145" stroke="#cbd5e1" strokeWidth="1" />
              <text x="44" y="149" textAnchor="end" fontSize="9" fill="#94a3b8" fontWeight="600">0</text>

              {/* Stacked Bars */}
              {sorted.map((r, i) => {
                const totalW = 610;
                const slotW = totalW / sorted.length;
                const barW = Math.min(32, Math.max(12, slotW * 0.5));
                const cx = 50 + i * slotW + slotW / 2;
                const barX = cx - barW / 2;

                const pTok = Number(r.total_prompt_tokens || 0);
                const cTok = Number(r.total_completion_tokens || 0);
                const totTok = Math.max(pTok + cTok, Number(r.rankingMetricValue || 0));

                const pH = (pTok / maxTokens) * 125;
                const cH = (cTok / maxTokens) * 125;
                const totH = (totTok / maxTokens) * 125;

                const pY = 145 - pH;
                const cY = pY - cH;
                const totY = 145 - totH;

                const dateLabel = r.date ? r.date.replace(/^\d{4}-/, "") : `#${i + 1}`;

                return (
                  <g key={i}>
                    {/* Prompt bar (bottom) */}
                    <rect
                      x={barX}
                      y={pY}
                      width={barW}
                      height={Math.max(2, pH)}
                      rx="3"
                      fill="#7c3aed"
                      opacity="0.9"
                    >
                      <title>{`Date: ${r.date}\nPrompt Tokens: ${pTok.toLocaleString()}`}</title>
                    </rect>

                    {/* Completion bar (stacked) */}
                    <rect
                      x={barX}
                      y={cY}
                      width={barW}
                      height={Math.max(2, cH)}
                      rx="3"
                      fill="#0d9488"
                      opacity="0.9"
                    >
                      <title>{`Date: ${r.date}\nCompletion Tokens: ${cTok.toLocaleString()}`}</title>
                    </rect>

                    {/* Trend dot */}
                    <circle cx={cx} cy={totY} r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5">
                      <title>{`Total: ${totTok.toLocaleString()} tokens`}</title>
                    </circle>

                    {/* Value above bar */}
                    <text x={cx} y={totY - 5} textAnchor="middle" fontSize="9" fontWeight="700" fill="#475569">
                      {formatTokens(totTok)}
                    </text>

                    {/* Date label */}
                    <text x={cx} y="162" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">
                      {dateLabel}
                    </text>
                  </g>
                );
              })}

              {/* Trend Polyline */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
                points={sorted
                  .map((r, i) => {
                    const totalW = 610;
                    const slotW = totalW / sorted.length;
                    const cx = 50 + i * slotW + slotW / 2;
                    const pTok = Number(r.total_prompt_tokens || 0);
                    const cTok = Number(r.total_completion_tokens || 0);
                    const totTok = Math.max(pTok + cTok, Number(r.rankingMetricValue || 0));
                    const totH = (totTok / maxTokens) * 125;
                    return `${cx},${145 - totH}`;
                  })
                  .join(" ")}
              />
            </svg>
          </div>
        ) : (
          /* Single Window Donut & Comparative Breakdown */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginTop: 10 }}>
            {/* SVG Donut */}
            <div style={{ display: "flex", alignItems: "center", gap: 18, padding: 14, borderRadius: 10, background: "#ffffff", border: "1px solid #e2e8f0" }}>
              <div style={{ width: 100, height: 100, flexShrink: 0, position: "relative" }}>
                <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="12"
                    strokeDasharray={`${(promptPct / 100) * 238.76} 238.76`}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="12"
                    strokeDasharray={`${(complPct / 100) * 238.76} 238.76`}
                    strokeDashoffset={`-${(promptPct / 100) * 238.76}`}
                  />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{promptPct.toFixed(0)}/{complPct.toFixed(0)}</span>
                  <span style={{ fontSize: 9, color: "#64748b", fontWeight: 700 }}>In/Out %</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700 }}>
                    <span style={{ color: "#7c3aed" }}>Prompt Tokens</span>
                    <span>{formatTokens(model.promptTokens)}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "#f1f5f9", overflow: "hidden", marginTop: 3 }}>
                    <div style={{ width: `${promptPct}%`, height: "100%", background: "#7c3aed" }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700 }}>
                    <span style={{ color: "#0d9488" }}>Completion Tokens</span>
                    <span>{formatTokens(model.completionTokens)}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "#f1f5f9", overflow: "hidden", marginTop: 3 }}>
                    <div style={{ width: `${complPct}%`, height: "100%", background: "#0d9488" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Token Velocity Card */}
            <div style={{ padding: 14, borderRadius: 10, background: "#ffffff", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Request Density &amp; Context Velocity</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "6px 0" }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: "#0f172a" }}>
                  {model.requests > 0 ? Math.round(model.tokens / model.requests).toLocaleString() : 0}
                </span>
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>tokens / request avg</span>
              </div>
              <div style={{ fontSize: 11, color: "#64748b" }}>
                Consolidated across <strong>{model.requests.toLocaleString()}</strong> calls with an input-to-output multiplier of{" "}
                <strong>{model.completionTokens > 0 ? (model.promptTokens / model.completionTokens).toFixed(2) : "1.00"}:1</strong>.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart 2: Daily Requests Traffic Volume */}
      <div className="mr-diagram-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Request Calls Volume &amp; Velocity
          </h4>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb" }}>
            Total Calls: {model.requests.toLocaleString()}
          </span>
        </div>

        {isMultiDate ? (
          <div style={{ width: "100%", overflowX: "auto" }}>
            <svg
              viewBox="0 0 680 120"
              style={{ width: "100%", minWidth: 560, height: "auto", display: "block" }}
              preserveAspectRatio="xMidYMid meet"
            >
              <line x1="50" y1="15" x2="660" y2="15" stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x="44" y="19" textAnchor="end" fontSize="9" fill="#94a3b8" fontWeight="600">{formatRequests(maxRequests)}</text>
              <line x1="50" y1="85" x2="660" y2="85" stroke="#cbd5e1" strokeWidth="1" />
              <text x="44" y="89" textAnchor="end" fontSize="9" fill="#94a3b8" fontWeight="600">0</text>

              {sorted.map((r, i) => {
                const totalW = 610;
                const slotW = totalW / sorted.length;
                const cx = 50 + i * slotW + slotW / 2;
                const barW = Math.min(26, Math.max(10, slotW * 0.4));
                const barX = cx - barW / 2;
                const reqs = Number(r.count || 0);
                const reqH = (reqs / maxRequests) * 70;
                const reqY = 85 - reqH;
                const dateLabel = r.date ? r.date.replace(/^\d{4}-/, "") : `#${i + 1}`;

                return (
                  <g key={i}>
                    <rect
                      x={barX}
                      y={reqY}
                      width={barW}
                      height={Math.max(2, reqH)}
                      rx="3"
                      fill="#3b82f6"
                      opacity="0.85"
                    >
                      <title>{`Date: ${r.date}\nRequests: ${reqs.toLocaleString()}`}</title>
                    </rect>
                    <text x={cx} y={reqY - 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#2563eb">
                      {formatRequests(reqs)}
                    </text>
                    <text x={cx} y="102" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">
                      {dateLabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            <div style={{ padding: 12, borderRadius: 8, background: "#ffffff", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Total Requests</span>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#2563eb", marginTop: 4 }}>
                {model.requests.toLocaleString()}
              </div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: "#ffffff", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Periodic Growth Rate</span>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>
                {model.change === null ? (
                  <span style={{ color: "#2563eb" }}>New Entry</span>
                ) : model.change > 0 ? (
                  <span style={{ color: "#16a34a" }}>+{model.change.toFixed(1)}%</span>
                ) : model.change < 0 ? (
                  <span style={{ color: "#dc2626" }}>{model.change.toFixed(1)}%</span>
                ) : (
                  <span style={{ color: "#64748b" }}>0.0%</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ModelSourceModal({
  model,
  rank,
  onClose,
}: {
  model: AggregatedModel;
  rank: number | null;
  onClose: () => void;
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "charts" | "status" | "records">("overview");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const copyToClipboard = (text: string, key: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const totalTokens = model.tokens || 1;
  const promptPct = Math.min(100, Math.max(0, (model.promptTokens / totalTokens) * 100));
  const complPct = Math.min(100, Math.max(0, (model.completionTokens / totalTokens) * 100));

  const providerInfo = getProviderInfo(model.author);
  const authorDomain =
    PROVIDER_DOMAINS[model.author.toLowerCase()] ||
    (model.author.includes(".") ? `https://${model.author}` : `https://${model.author}.com`);

  const isOpen = isOpenModel(model.model_permaslug, model.author);

  return (
    <div className="mr-modal-backdrop" onClick={onClose}>
      <div
        className="mr-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-model-title"
      >
        {/* Header */}
        <div className="mr-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ position: "relative" }}>
              <ModelIcon author={model.author} modelSlug={model.model_permaslug} size={42} />
              {providerInfo?.countryFlag && (
                <span
                  style={{
                    position: "absolute",
                    bottom: -3,
                    right: -4,
                    fontSize: 12,
                    lineHeight: 1,
                    background: "#ffffff",
                    borderRadius: "50%",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                    padding: "1px",
                  }}
                  title={`Headquarters: ${providerInfo.countryName || providerInfo.headquarters}`}
                >
                  {providerInfo.countryFlag}
                </span>
              )}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {rank && <span className="mr-modal-rank-badge">#{rank}</span>}
                <h2 id="modal-model-title" className="mr-modal-title">
                  {model.prettyName}
                </h2>
                {model.variant && model.variant !== "standard" && (
                  <span className="mr-modal-variant-badge">{model.variant}</span>
                )}
                <span className={`mr-modal-tag ${isOpen ? "open" : "closed"}`}>
                  {isOpen ? "Open Weights" : "Closed Weights"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                  {providerInfo?.displayName || model.author}
                </span>

                {providerInfo?.countryFlag && (
                  <span className="mr-country-tag" title={`Headquarters: ${providerInfo.countryName || providerInfo.headquarters}`}>
                    {providerInfo.countryFlag} {providerInfo.headquarters}
                  </span>
                )}

                {authorDomain && (
                  <a
                    href={authorDomain}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mr-modal-link"
                    title={`Visit ${model.author} website`}
                  >
                    <span>Website</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                )}

                <button
                  type="button"
                  className="mr-status-link"
                  onClick={() => setActiveTab("status")}
                  title="View live provider operational status & capabilities"
                >
                  <span className="mr-status-dot" />
                  <span>Status: Operational</span>
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mr-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Permaslug bar with copy */}
        <div className="mr-modal-permaslug-bar">
          <div style={{ display: "flex", alignItems: "center", gap: 6, overflow: "hidden" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Slug:</span>
            <code className="mr-modal-slug-text">{model.variant_permaslug}</code>
          </div>
          <button
            type="button"
            className="mr-modal-copy-btn"
            onClick={() => copyToClipboard(model.variant_permaslug, "slug")}
          >
            {copiedKey === "slug" ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span style={{ color: "#16a34a" }}>Copied!</span>
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                <span>Copy Slug</span>
              </>
            )}
          </button>
        </div>

        {/* Modal Sub-Tabs */}
        <div className="mr-modal-tabs">
          <button
            type="button"
            className={`mr-modal-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview &amp; Architecture
          </button>
          <button
            type="button"
            className={`mr-modal-tab-btn ${activeTab === "charts" ? "active" : ""}`}
            onClick={() => setActiveTab("charts")}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              Trend &amp; Graphs
            </span>
          </button>
          <button
            type="button"
            className={`mr-modal-tab-btn ${activeTab === "status" ? "active" : ""}`}
            onClick={() => setActiveTab("status")}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span className="mr-status-dot" style={{ width: 6, height: 6 }} />
              Provider Status
            </span>
          </button>
          <button
            type="button"
            className={`mr-modal-tab-btn ${activeTab === "records" ? "active" : ""}`}
            onClick={() => setActiveTab("records")}
          >
            Source Records ({model.rawItems?.length || 0})
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="mr-modal-body">
          {activeTab === "overview" && (
            <>
              {/* Quick Status Bar on Preview Card */}
              <div className="mr-overview-status-banner">
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span className="mr-status-dot" />
                  <span style={{ fontSize: 12, fontWeight: 700 }}>
                    Live Status:
                  </span>
                  <span className="mr-status-pill-green">🟢 Operational</span>
                  {providerInfo?.countryFlag && (
                    <span className="mr-country-tag">
                      {providerInfo.countryFlag} {providerInfo.headquarters}
                    </span>
                  )}
                  {providerInfo?.serviceStatus?.isAbortable && (
                    <span className="mr-country-tag">⚡ Abortable</span>
                  )}
                  {providerInfo?.serviceStatus?.byokEnabled && (
                    <span className="mr-country-tag">🔑 BYOK</span>
                  )}
                </div>
                <button
                  type="button"
                  className="mr-status-tab-btn"
                  onClick={() => setActiveTab("status")}
                >
                  <span>View Status &amp; Capabilities &rarr;</span>
                </button>
              </div>

              {/* Primary Metrics Grid */}
              <div className="mr-modal-grid">
                <div className="mr-modal-metric-card primary">
                  <div className="mr-metric-label">Total Tokens (Usage)</div>
                  <div className="mr-metric-val">{formatTokens(model.tokens)}</div>
                  <div className="mr-metric-sub">{model.tokens.toLocaleString()} tokens</div>
                </div>

                <div className="mr-modal-metric-card">
                  <div className="mr-metric-label">Total Requests</div>
                  <div className="mr-metric-val">{formatRequests(model.requests)}</div>
                  <div className="mr-metric-sub">{model.requests.toLocaleString()} calls</div>
                </div>

                <div className="mr-modal-metric-card">
                  <div className="mr-metric-label" style={{ color: "#7c3aed" }}>Prompt Tokens (Input)</div>
                  <div className="mr-metric-val" style={{ color: "#7c3aed" }}>{formatTokens(model.promptTokens)}</div>
                  <div className="mr-metric-sub">{promptPct.toFixed(1)}% ({model.promptTokens.toLocaleString()})</div>
                </div>

                <div className="mr-modal-metric-card">
                  <div className="mr-metric-label" style={{ color: "#0d9488" }}>Completion Tokens (Output)</div>
                  <div className="mr-metric-val" style={{ color: "#0d9488" }}>{formatTokens(model.completionTokens)}</div>
                  <div className="mr-metric-sub">{complPct.toFixed(1)}% ({model.completionTokens.toLocaleString()})</div>
                </div>
              </div>

              {/* Vertical Token Volume & Distribution Graph with Statistics */}
              <div className="mr-modal-section">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h4 className="mr-section-title" style={{ margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                      <rect x="4" y="8" width="4" height="12" rx="1" fill="#6366f1" fillOpacity="0.4" />
                      <rect x="10" y="4" width="4" height="16" rx="1" fill="#6366f1" fillOpacity="0.8" />
                      <rect x="16" y="11" width="4" height="9" rx="1" fill="#6366f1" fillOpacity="0.4" />
                    </svg>
                    Vertical Token Utilization Graph &amp; Statistics
                  </h4>
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    Total: {formatTokens(model.tokens)} ({model.tokens.toLocaleString()} tokens)
                  </span>
                </div>

                <div style={{ background: "#f8fafc", borderRadius: 12, padding: "16px 20px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", height: 180, position: "relative", borderBottom: "2px solid #cbd5e1", paddingBottom: 6 }}>
                    {/* Prompt Tokens Bar */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", width: 70 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#7c3aed", marginBottom: 4 }}>
                        {promptPct.toFixed(1)}%
                      </span>
                      <div
                        style={{
                          width: 44,
                          height: `${Math.max(6, promptPct)}%`,
                          background: "linear-gradient(to top, #6d28d9, #8b5cf6, #a78bfa)",
                          borderRadius: "6px 6px 0 0",
                          boxShadow: "0 2px 4px rgba(109,40,217,0.2)",
                          transition: "height 0.5s ease",
                        }}
                      />
                    </div>

                    {/* Completion Tokens Bar */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", width: 70 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#0d9488", marginBottom: 4 }}>
                        {complPct.toFixed(1)}%
                      </span>
                      <div
                        style={{
                          width: 44,
                          height: `${Math.max(6, complPct)}%`,
                          background: "linear-gradient(to top, #0f766e, #14b8a6, #2dd4bf)",
                          borderRadius: "6px 6px 0 0",
                          boxShadow: "0 2px 4px rgba(15,118,110,0.2)",
                          transition: "height 0.5s ease",
                        }}
                      />
                    </div>

                    {/* Total Capacity Bar */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", width: 70 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#1e293b", marginBottom: 4 }}>
                        100%
                      </span>
                      <div
                        style={{
                          width: 44,
                          height: "100%",
                          background: "linear-gradient(to top, #1e293b, #334155, #64748b)",
                          borderRadius: "6px 6px 0 0",
                          boxShadow: "0 2px 4px rgba(30,41,59,0.2)",
                          transition: "height 0.5s ease",
                        }}
                      />
                    </div>
                  </div>

                  {/* Baseline Column Labels */}
                  <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center", paddingTop: 8 }}>
                    <div style={{ width: 100 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed" }}>Prompt Tokens</div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>{formatTokens(model.promptTokens)}</div>
                    </div>
                    <div style={{ width: 100 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#0d9488" }}>Completion Tokens</div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>{formatTokens(model.completionTokens)}</div>
                    </div>
                    <div style={{ width: 100 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>Total Volume</div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>{formatTokens(model.tokens)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Token Architecture & Data Flow Diagram */}
              <TokenFlowDiagram
                model={model}
                promptPct={promptPct}
                complPct={complPct}
                providerInfo={providerInfo}
              />

              {/* Visual Token Distribution & Donut Ratio Diagram */}
              <div className="mr-modal-section">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Token Input vs. Output Ratio &amp; Distribution Diagram
                  </span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    Prompt {promptPct.toFixed(1)}% / Completion {complPct.toFixed(1)}%
                  </span>
                </div>

                <div className="mr-donut-wrapper">
                  {/* SVG Donut Chart */}
                  <div style={{ width: 90, height: 90, flexShrink: 0, position: "relative" }}>
                    <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="11" />
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="none"
                        stroke="#7c3aed"
                        strokeWidth="11"
                        strokeDasharray={`${(promptPct / 100) * 238.76} 238.76`}
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="11"
                        strokeDasharray={`${(complPct / 100) * 238.76} 238.76`}
                        strokeDashoffset={`-${(promptPct / 100) * 238.76}`}
                      />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: "inherit" }}>
                        {promptPct.toFixed(0)}/{complPct.toFixed(0)}
                      </span>
                      <span style={{ fontSize: 8, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Ratio</span>
                    </div>
                  </div>

                  {/* Horizontal Bar & Legend */}
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div className="mr-dist-bar-track">
                      <div
                        className="mr-dist-bar-fill prompt"
                        style={{ width: `${promptPct}%` }}
                        title={`Prompt Tokens: ${model.promptTokens.toLocaleString()} (${promptPct.toFixed(1)}%)`}
                      />
                      <div
                        className="mr-dist-bar-fill compl"
                        style={{ width: `${complPct}%` }}
                        title={`Completion Tokens: ${model.completionTokens.toLocaleString()} (${complPct.toFixed(1)}%)`}
                      />
                    </div>
                    <div className="mr-dist-bar-legend" style={{ marginTop: 8 }}>
                      <div className="mr-legend-item">
                        <span className="mr-legend-dot prompt" />
                        <span>Prompt (Input): <strong>{formatTokens(model.promptTokens)}</strong> ({promptPct.toFixed(1)}%)</span>
                      </div>
                      <div className="mr-legend-item">
                        <span className="mr-legend-dot compl" />
                        <span>Completion (Output): <strong>{formatTokens(model.completionTokens)}</strong> ({complPct.toFixed(1)}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Derived Statistics */}
              <div className="mr-modal-section">
                <h3 className="mr-section-title">Telemetry &amp; Operational Insights</h3>
                <div className="mr-insights-grid">
                  <div className="mr-insight-row">
                    <span className="mr-insight-key">Avg Tokens / Request</span>
                    <span className="mr-insight-val">
                      {model.requests > 0 ? Math.round(model.tokens / model.requests).toLocaleString() : "N/A"}
                    </span>
                  </div>
                  <div className="mr-insight-row">
                    <span className="mr-insight-key">Avg Prompt Tokens / Request</span>
                    <span className="mr-insight-val">
                      {model.requests > 0 ? Math.round(model.promptTokens / model.requests).toLocaleString() : "N/A"}
                    </span>
                  </div>
                  <div className="mr-insight-row">
                    <span className="mr-insight-key">Avg Output Tokens / Request</span>
                    <span className="mr-insight-val">
                      {model.requests > 0 ? Math.round(model.completionTokens / model.requests).toLocaleString() : "N/A"}
                    </span>
                  </div>
                  <div className="mr-insight-row">
                    <span className="mr-insight-key">Input-to-Output Ratio</span>
                    <span className="mr-insight-val">
                      {model.completionTokens > 0
                        ? `${(model.promptTokens / model.completionTokens).toFixed(2)} : 1`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="mr-insight-row">
                    <span className="mr-insight-key">Periodic Growth / Change</span>
                    <span className="mr-insight-val">
                      {model.change === null ? (
                        <span className="mr-badge mr-badge-new">new</span>
                      ) : model.change > 0 ? (
                        <span className="mr-badge mr-badge-up">+{model.change.toFixed(1)}%</span>
                      ) : model.change < 0 ? (
                        <span className="mr-badge mr-badge-down">{model.change.toFixed(1)}%</span>
                      ) : (
                        <span className="mr-badge mr-badge-neutral">0.0%</span>
                      )}
                    </span>
                  </div>
                  <div className="mr-insight-row">
                    <span className="mr-insight-key">Aggregated Records Count</span>
                    <span className="mr-insight-val">{model.rawItems?.length || 0} records</span>
                  </div>
                </div>
              </div>

              {/* Provider Data Policy & Compliance */}
              {providerInfo?.dataPolicy && (
                <div className="mr-modal-section">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                    <h3 className="mr-section-title" style={{ margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      Provider Data Policy &amp; Compliance
                    </h3>
                    {providerInfo.headquarters && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>
                        Jurisdiction: {providerInfo.countryFlag} {providerInfo.countryName || providerInfo.headquarters}
                      </span>
                    )}
                  </div>

                  <div className="mr-policy-grid">
                    {/* Training Policy */}
                    <div className="mr-policy-card">
                      <div className="mr-policy-header">
                        <span className={`mr-policy-badge ${providerInfo.dataPolicy.training ? "warning" : "success"}`}>
                          {providerInfo.dataPolicy.training ? "Training Permitted" : "Zero Data Training"}
                        </span>
                      </div>
                      <div className="mr-policy-desc">
                        {providerInfo.dataPolicy.training
                          ? "Provider may retain user prompts and completions to fine-tune or train future models."
                          : "User prompts and completions are NOT used to train or improve the provider's AI models."}
                      </div>
                    </div>

                    {/* Retention Policy */}
                    <div className="mr-policy-card">
                      <div className="mr-policy-header">
                        <span className={`mr-policy-badge ${providerInfo.dataPolicy.retainsPrompts ? "neutral" : "success"}`}>
                          {providerInfo.dataPolicy.retainsPrompts
                            ? `${providerInfo.dataPolicy.retentionDays ? `${providerInfo.dataPolicy.retentionDays}-Day` : "Temporary"} Retention`
                            : "Zero Prompt Retention"}
                        </span>
                      </div>
                      <div className="mr-policy-desc">
                        {providerInfo.dataPolicy.retainsPrompts
                          ? `Prompts are retained ${providerInfo.dataPolicy.retentionDays ? `for up to ${providerInfo.dataPolicy.retentionDays} days` : "temporarily"} for security and compliance logs.`
                          : "Prompts are processed in-memory and not stored on the provider's disk servers."}
                      </div>
                    </div>
                  </div>

                  {/* Legal Links */}
                  {(providerInfo.dataPolicy.termsOfServiceURL || providerInfo.dataPolicy.privacyPolicyURL) && (
                    <div className="mr-legal-links">
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Legal:</span>
                      {providerInfo.dataPolicy.termsOfServiceURL && (
                        <a
                          href={providerInfo.dataPolicy.termsOfServiceURL}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mr-legal-btn"
                        >
                          <span>Terms of Service</span>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </a>
                      )}
                      {providerInfo.dataPolicy.privacyPolicyURL && (
                        <a
                          href={providerInfo.dataPolicy.privacyPolicyURL}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mr-legal-btn"
                        >
                          <span>Privacy Policy</span>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === "status" && (
            <div className="mr-modal-status-tab">
              {/* Status Header Banner */}
              <div className="mr-status-banner-card">
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div className="mr-status-icon-ring">
                    <span className="mr-status-dot large" />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "inherit" }}>
                        All Systems Operational
                      </h3>
                      <span className="mr-status-pill-green">🟢 Active</span>
                      {providerInfo?.countryFlag && (
                        <span className="mr-country-tag">
                          {providerInfo.countryFlag} {providerInfo.countryName || providerInfo.headquarters}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>
                      {providerInfo?.displayName || model.author} inference engine, API routing, and models are online.
                    </p>
                  </div>
                </div>

                {providerInfo?.statusPageUrl && (
                  <a
                    href={providerInfo.statusPageUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mr-external-status-btn"
                  >
                    <span>External Status Page</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                )}
              </div>

              {/* Service Capabilities Grid */}
              <div className="mr-modal-section">
                <h4 className="mr-section-title" style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 12px 0" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                  Endpoint Health &amp; Capabilities Matrix
                </h4>

                <div className="mr-capabilities-grid">
                  {/* Chat Completions */}
                  <div className="mr-cap-card">
                    <div className="mr-cap-header">
                      <span className="mr-cap-title">Chat Completions API</span>
                      <span className="mr-cap-badge green">🟢 Online</span>
                    </div>
                    <div className="mr-cap-desc">
                      OpenAI-compatible <code>/chat/completions</code> endpoint active.
                    </div>
                  </div>

                  {/* Standard Text Completions */}
                  <div className="mr-cap-card">
                    <div className="mr-cap-header">
                      <span className="mr-cap-title">Legacy /completions</span>
                      <span className={`mr-cap-badge ${providerInfo?.serviceStatus?.hasCompletions ? "green" : "neutral"}`}>
                        {providerInfo?.serviceStatus?.hasCompletions ? "🟢 Supported" : "⚪ Deprecated"}
                      </span>
                    </div>
                    <div className="mr-cap-desc">
                      {providerInfo?.serviceStatus?.hasCompletions
                        ? "Raw prompt text completions endpoint is supported."
                        : "Endpoint optimized exclusively for chat and instruct formats."}
                    </div>
                  </div>

                  {/* Request Aborting */}
                  <div className="mr-cap-card">
                    <div className="mr-cap-header">
                      <span className="mr-cap-title">Abortable Streaming</span>
                      <span className={`mr-cap-badge ${providerInfo?.serviceStatus?.isAbortable ? "green" : "warning"}`}>
                        {providerInfo?.serviceStatus?.isAbortable ? "🟢 Abortable" : "⚠️ Non-Abortable"}
                      </span>
                    </div>
                    <div className="mr-cap-desc">
                      {providerInfo?.serviceStatus?.isAbortable
                        ? "Supports immediate request cancellation via AbortController."
                        : "Streams until full generation finish."}
                    </div>
                  </div>

                  {/* Moderation */}
                  <div className="mr-cap-card">
                    <div className="mr-cap-header">
                      <span className="mr-cap-title">Content Moderation</span>
                      <span className={`mr-cap-badge ${providerInfo?.serviceStatus?.moderationRequired ? "warning" : "blue"}`}>
                        {providerInfo?.serviceStatus?.moderationRequired ? "🛡️ Moderated" : "⚡ Direct Pass"}
                      </span>
                    </div>
                    <div className="mr-cap-desc">
                      {providerInfo?.serviceStatus?.moderationRequired
                        ? "Automated safety screening on prompt inputs & responses."
                        : "Direct low-latency model inference without forced safety filters."}
                    </div>
                  </div>

                  {/* BYOK */}
                  <div className="mr-cap-card">
                    <div className="mr-cap-header">
                      <span className="mr-cap-title">Bring Your Own Key</span>
                      <span className={`mr-cap-badge ${providerInfo?.serviceStatus?.byokEnabled ? "green" : "neutral"}`}>
                        {providerInfo?.serviceStatus?.byokEnabled ? "🔑 Supported" : "🔒 Managed"}
                      </span>
                    </div>
                    <div className="mr-cap-desc">
                      {providerInfo?.serviceStatus?.byokEnabled
                        ? "Supports connecting direct lab API keys."
                        : "Unified routing managed by OxyNews/OpenRouter."}
                    </div>
                  </div>

                  {/* Datacenters */}
                  <div className="mr-cap-card">
                    <div className="mr-cap-header">
                      <span className="mr-cap-title">Serving Regions</span>
                      <span className="mr-cap-badge blue">
                        {providerInfo?.serviceStatus?.datacenters?.length
                          ? `🌐 ${providerInfo.serviceStatus.datacenters.join(", ")}`
                          : `🌐 ${providerInfo?.countryFlag || "🇺🇸"} ${providerInfo?.headquarters || "US"}`}
                      </span>
                    </div>
                    <div className="mr-cap-desc">
                      Active edge inference clusters serving prompt traffic.
                    </div>
                  </div>
                </div>
              </div>

              {/* Data & Compliance summary in Status tab */}
              {providerInfo?.dataPolicy && (
                <div className="mr-modal-section">
                  <h4 className="mr-section-title" style={{ margin: "0 0 10px 0" }}>Compliance &amp; Data Privacy Status</h4>
                  <div className="mr-policy-grid">
                    <div className="mr-policy-card">
                      <div className="mr-policy-header">
                        <span className={`mr-policy-badge ${providerInfo.dataPolicy.training ? "warning" : "success"}`}>
                          {providerInfo.dataPolicy.training ? "Training Permitted" : "Zero Training"}
                        </span>
                      </div>
                      <div className="mr-policy-desc">
                        {providerInfo.dataPolicy.training
                          ? "Prompts may be retained for future model training."
                          : "Prompts are never used to train provider AI models."}
                      </div>
                    </div>
                    <div className="mr-policy-card">
                      <div className="mr-policy-header">
                        <span className={`mr-policy-badge ${providerInfo.dataPolicy.retainsPrompts ? "neutral" : "success"}`}>
                          {providerInfo.dataPolicy.retainsPrompts
                            ? `${providerInfo.dataPolicy.retentionDays ? `${providerInfo.dataPolicy.retentionDays}-Day` : "Temporary"} Retention`
                            : "Zero Retention"}
                        </span>
                      </div>
                      <div className="mr-policy-desc">
                        {providerInfo.dataPolicy.retainsPrompts
                          ? "Prompts temporarily logged for security audit logs."
                          : "Processed in-memory with zero persistent disk storage."}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "records" && (
            <div className="mr-modal-section">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 className="mr-section-title" style={{ margin: 0 }}>
                  Aggregated Source Records ({model.rawItems?.length || 0})
                </h3>
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  Direct API response records for this model
                </span>
              </div>
              <div className="mr-subtable-wrapper">
                <table className="mr-subtable">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Variant</th>
                      <th style={{ textAlign: "right" }}>Prompt Tokens</th>
                      <th style={{ textAlign: "right" }}>Completion Tokens</th>
                      <th style={{ textAlign: "right" }}>Ranking Metric</th>
                      <th style={{ textAlign: "right" }}>Requests</th>
                      <th style={{ textAlign: "right" }}>Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(model.rawItems || []).map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600, color: "#64748b" }}>{item.date || "N/A"}</td>
                        <td>
                          <span className="mr-variant-chip">{item.variant || "standard"}</span>
                        </td>
                        <td style={{ textAlign: "right", fontFamily: "monospace" }}>
                          {Number(item.total_prompt_tokens || 0).toLocaleString()}
                        </td>
                        <td style={{ textAlign: "right", fontFamily: "monospace" }}>
                          {Number(item.total_completion_tokens || 0).toLocaleString()}
                        </td>
                        <td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: 700 }}>
                          {Number(item.rankingMetricValue || 0).toLocaleString()}
                        </td>
                        <td style={{ textAlign: "right", fontFamily: "monospace" }}>
                          {Number(item.count || 0).toLocaleString()}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {item.change === null ? (
                            <span className="mr-badge mr-badge-new">new</span>
                          ) : (
                            `${item.change > 0 ? "+" : ""}${Number(item.change).toFixed(1)}%`
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "charts" && (
            <TokenTrendChart
              records={model.rawItems}
              model={model}
              promptPct={promptPct}
              complPct={complPct}
            />
          )}
        </div>
      </div>
    </div>
  );
}

type TabType = "today" | "week" | "month" | "trending";
type FilterType = "" | "closed" | "open";

export default function ModelRankings({ showHeader = true }: { showHeader?: boolean }) {
  const [activeTab, setActiveTab] = useState<TabType>("today");
  const [modelsFilter, setModelsFilter] = useState<FilterType>("");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState<number>(20);
  const [data, setData] = useState<RawRankingsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<AggregatedModel | null>(null);
  const [selectedRank, setSelectedRank] = useState<number | null>(null);

  // Reset pagination when tab, filter, or search changes
  useEffect(() => {
    setVisibleCount(20);
  }, [activeTab, modelsFilter, search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const viewParam = activeTab === "month" ? "month" : activeTab === "today" ? "day" : "week";

    api
      .getRankings(viewParam)
      .then((d) => { if (!cancelled) setData(d); })
      .catch((err: any) => { if (!cancelled) setError(err?.message || "Failed to load leaderboard"); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [activeTab]);

  // Aggregate by variant_permaslug
  const aggregatedModels = useMemo(() => {
    const map = new Map<string, AggregatedModel>();

    for (const item of data) {
      const key = item.variant_permaslug || item.model_permaslug;
      const author = getAuthor(item.model_permaslug);
      const existing = map.get(key);
      const metricVal = Number(item.rankingMetricValue || 0);
      const reqCount = Number(item.count || 0);
      const promptTok = Number(item.total_prompt_tokens || 0);
      const complTok = Number(item.total_completion_tokens || 0);

      if (!existing) {
        map.set(key, {
          key,
          model_permaslug: item.model_permaslug,
          variant_permaslug: key,
          variant: item.variant || "standard",
          prettyName: prettifyName(item.model_permaslug),
          author,
          provider: author.toLowerCase(),
          tokens: metricVal,
          promptTokens: promptTok,
          completionTokens: complTok,
          requests: reqCount,
          change: item.change ?? null,
          rawItems: [item],
        });
      } else {
        existing.tokens += metricVal;
        existing.promptTokens += promptTok;
        existing.completionTokens += complTok;
        existing.requests += reqCount;
        existing.rawItems.push(item);
        if (existing.change === null && item.change !== null) {
          existing.change = item.change;
        }
      }
    }

    let list = Array.from(map.values());

    // Sort by tab criteria
    if (activeTab === "trending") {
      list = list.filter((m) => m.tokens >= 1_000_000);
      list.sort((a, b) => {
        if (a.change === null && b.change !== null) return -1;
        if (a.change !== null && b.change === null) return 1;
        if (a.change === null && b.change === null) return b.tokens - a.tokens;
        return (b.change || 0) - (a.change || 0);
      });
    } else {
      list.sort((a, b) => b.tokens - a.tokens);
    }

    return list;
  }, [data, activeTab]);

  // Filter by category (Closed vs Open) and search query
  const filteredModels = useMemo(() => {
    let result = aggregatedModels;

    if (modelsFilter === "closed") {
      result = result.filter((m) => !isOpenModel(m.model_permaslug, m.author));
    } else if (modelsFilter === "open") {
      result = result.filter((m) => isOpenModel(m.model_permaslug, m.author));
    }

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (m) =>
          m.prettyName.toLowerCase().includes(q) ||
          m.author.toLowerCase().includes(q) ||
          m.model_permaslug.toLowerCase().includes(q)
      );
    }
    return result;
  }, [aggregatedModels, modelsFilter, search]);

  const displayedModels = useMemo(() => {
    return filteredModels.slice(0, visibleCount);
  }, [filteredModels, visibleCount]);

  const maxTokens = useMemo(() => {
    return Math.max(...filteredModels.map((m) => m.tokens), 1);
  }, [filteredModels]);

  return (
    <div className="model-rankings-root">
      <style>{`
        .model-rankings-root {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #0f172a;
          width: 100%;
        }
        @media (prefers-color-scheme: dark) {
          .model-rankings-root {
            color: #f1f5f9;
          }
        }
        .mr-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px -2px rgba(0,0,0,0.06);
        }
        @media (prefers-color-scheme: dark) {
          .mr-card {
            background: #0b0f17;
            border-color: #1e293b;
            box-shadow: 0 4px 20px -2px rgba(0,0,0,0.5);
          }
        }
        .mr-tabs {
          display: flex;
          gap: 6px;
          border-bottom: 1px solid #f1f5f9;
          padding: 12px 18px 0;
          overflow-x: auto;
          scrollbar-width: none;
        }
        @media (prefers-color-scheme: dark) {
          .mr-tabs {
            border-bottom-color: #1e293b;
          }
        }
        .mr-tab-btn {
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
          transition: all 0.15s ease;
        }
        .mr-tab-btn:hover {
          color: #7c3aed;
        }
        .mr-tab-btn:focus-visible {
          outline: 2px solid #7c3aed;
          outline-offset: 2px;
          border-radius: 4px;
        }
        .mr-tab-btn.active {
          color: #7c3aed;
          border-bottom-color: #7c3aed;
        }
        .mr-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          gap: 12px;
          flex-wrap: wrap;
          border-bottom: 1px solid #f8fafc;
        }
        @media (prefers-color-scheme: dark) {
          .mr-filter-bar {
            border-bottom-color: #1e293b;
          }
        }
        .mr-segmented {
          display: inline-flex;
          background: #f1f5f9;
          padding: 3px;
          border-radius: 10px;
          gap: 2px;
        }
        @media (prefers-color-scheme: dark) {
          .mr-segmented {
            background: #1e293b;
          }
        }
        .mr-seg-btn {
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s;
        }
        .mr-seg-btn:focus-visible {
          outline: 2px solid #7c3aed;
        }
        .mr-seg-btn.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        @media (prefers-color-scheme: dark) {
          .mr-seg-btn.active {
            background: #334155;
            color: #ffffff;
          }
        }
        .mr-search-input {
          padding: 6px 12px 6px 32px;
          font-size: 12px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #0f172a;
          outline: none;
          width: 220px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        @media (prefers-color-scheme: dark) {
          .mr-search-input {
            background: #0f172a;
            border-color: #334155;
            color: #f1f5f9;
          }
        }
        .mr-search-input:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
        }
        .mr-count-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          background: #f1f5f9;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          white-space: nowrap;
        }
        @media (prefers-color-scheme: dark) {
          .mr-count-badge {
            background: #1e293b;
            color: #94a3b8;
            border-color: #334155;
          }
        }
        .mr-table-wrapper {
          overflow-x: auto;
          width: 100%;
        }
        .mr-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .mr-table th {
          padding: 10px 14px;
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e2e8f0;
          background: #fafbfc;
          white-space: nowrap;
        }
        @media (prefers-color-scheme: dark) {
          .mr-table th {
            background: #0d131f;
            border-bottom-color: #1e293b;
            color: #94a3b8;
          }
        }
        .mr-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        @media (prefers-color-scheme: dark) {
          .mr-table td {
            border-bottom-color: #1a2234;
          }
        }
        .mr-row:hover {
          background: #f8fafc;
        }
        @media (prefers-color-scheme: dark) {
          .mr-row:hover {
            background: #111827;
          }
        }
        .mr-token-bar-bg {
          height: 5px;
          border-radius: 999px;
          background: #f1f5f9;
          overflow: hidden;
          width: 100%;
          margin-top: 4px;
        }
        @media (prefers-color-scheme: dark) {
          .mr-token-bar-bg {
            background: #1e293b;
          }
        }
        .mr-token-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #7c3aed, #a855f7);
          transition: width 0.3s ease;
        }
        .mr-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 7px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }
        .mr-badge-new {
          background: rgba(20, 184, 166, 0.12);
          color: #0d9488;
          border: 1px solid rgba(20, 184, 166, 0.25);
        }
        .mr-badge-up {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
        }
        .mr-badge-down {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }
        .mr-badge-neutral {
          background: #f1f5f9;
          color: #64748b;
        }
        @media (prefers-color-scheme: dark) {
          .mr-badge-neutral {
            background: #1e293b;
            color: #94a3b8;
          }
        }
        .mr-view-more-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px 16px;
          border-top: 1px solid #f1f5f9;
        }
        @media (prefers-color-scheme: dark) {
          .mr-view-more-container {
            border-top-color: #1e293b;
          }
        }
        .mr-view-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 22px;
          font-size: 13px;
          font-weight: 600;
          color: #7c3aed;
          background: #f5f3ff;
          border: 1px solid #ddd6fe;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .mr-view-more-btn:hover {
          background: #ede9fe;
          border-color: #c4b5fd;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
        }
        .mr-view-more-count {
          font-size: 11px;
          color: #8b5cf6;
          font-weight: 500;
        }
        .mr-all-loaded-text {
          text-align: center;
          padding: 16px;
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
          border-top: 1px solid #f1f5f9;
        }
        @media (prefers-color-scheme: dark) {
          .mr-all-loaded-text {
            border-top-color: #1e293b;
            color: #64748b;
          }
        }
        .mr-row-clickable {
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .mr-row-clickable:hover {
          background: #f8fafc;
        }
        @media (prefers-color-scheme: dark) {
          .mr-row-clickable:hover {
            background: #1e293b;
          }
        }
        .mr-source-pill {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          color: #7c3aed;
          background: #f5f3ff;
          border: 1px solid #ddd6fe;
          transition: all 0.15s ease;
          cursor: pointer;
        }
        .mr-row-clickable:hover .mr-source-pill {
          background: #7c3aed;
          color: #ffffff;
          border-color: #7c3aed;
        }
        @media (prefers-color-scheme: dark) {
          .mr-source-pill {
            background: rgba(124, 58, 237, 0.15);
            border-color: rgba(124, 58, 237, 0.35);
            color: #c4b5fd;
          }
        }
        /* Modal Styles */
        .mr-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          padding: 16px;
          animation: mrFadeIn 0.15s ease-out;
        }
        @keyframes mrFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .mr-modal-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          width: 100%;
          max-width: 820px;
          max-height: 88vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: mrScaleUp 0.18s ease-out;
        }
        @keyframes mrScaleUp {
          from { transform: scale(0.97); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @media (prefers-color-scheme: dark) {
          .mr-modal-card {
            background: #0b0f17;
            border-color: #1e293b;
            color: #f1f5f9;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.75);
          }
        }
        .mr-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px;
          border-bottom: 1px solid #f1f5f9;
          background: #fafbfc;
        }
        @media (prefers-color-scheme: dark) {
          .mr-modal-header {
            background: #0d131f;
            border-bottom-color: #1e293b;
          }
        }
        .mr-modal-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
        @media (prefers-color-scheme: dark) {
          .mr-modal-title {
            color: #ffffff;
          }
        }
        .mr-modal-rank-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          background: #7c3aed;
          color: #ffffff;
          border-radius: 6px;
          padding: 2px 7px;
          letter-spacing: 0.02em;
        }
        .mr-modal-variant-badge {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: 6px;
          background: #e0e7ff;
          color: #4338ca;
        }
        @media (prefers-color-scheme: dark) {
          .mr-modal-variant-badge {
            background: #312e81;
            color: #c7d2fe;
          }
        }
        .mr-modal-tag {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 6px;
        }
        .mr-modal-tag.open {
          background: rgba(34, 197, 94, 0.12);
          color: #16a34a;
          border: 1px solid rgba(34, 197, 94, 0.25);
        }
        .mr-modal-tag.closed {
          background: rgba(148, 163, 184, 0.15);
          color: #475569;
          border: 1px solid rgba(148, 163, 184, 0.3);
        }
        @media (prefers-color-scheme: dark) {
          .mr-modal-tag.closed {
            background: rgba(51, 65, 85, 0.4);
            color: #cbd5e1;
            border-color: rgba(71, 85, 105, 0.5);
          }
        }
        .mr-modal-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          color: #7c3aed;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .mr-modal-link:hover {
          text-decoration: underline;
        }
        .mr-modal-close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          border-radius: 8px;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .mr-modal-close-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        @media (prefers-color-scheme: dark) {
          .mr-modal-close-btn:hover {
            background: #1e293b;
            color: #ffffff;
          }
        }
        .mr-modal-permaslug-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 22px;
          background: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
          gap: 12px;
        }
        @media (prefers-color-scheme: dark) {
          .mr-modal-permaslug-bar {
            background: #0f172a;
            border-bottom-color: #1e293b;
          }
        }
        .mr-modal-slug-text {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 12px;
          font-weight: 600;
          color: #334155;
          word-break: break-all;
        }
        @media (prefers-color-scheme: dark) {
          .mr-modal-slug-text {
            color: #94a3b8;
          }
        }
        .mr-modal-copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #475569;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s;
        }
        .mr-modal-copy-btn:hover {
          border-color: #94a3b8;
          color: #0f172a;
        }
        @media (prefers-color-scheme: dark) {
          .mr-modal-copy-btn {
            background: #1e293b;
            border-color: #334155;
            color: #cbd5e1;
          }
          .mr-modal-copy-btn:hover {
            border-color: #64748b;
            color: #ffffff;
          }
        }
        .mr-modal-tabs {
          display: flex;
          border-bottom: 1px solid #f1f5f9;
          padding: 0 22px;
          gap: 8px;
          background: #ffffff;
        }
        @media (prefers-color-scheme: dark) {
          .mr-modal-tabs {
            border-bottom-color: #1e293b;
            background: #0b0f17;
          }
        }
        .mr-modal-tab-btn {
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.15s;
        }
        .mr-modal-tab-btn:hover {
          color: #7c3aed;
        }
        .mr-modal-tab-btn.active {
          color: #7c3aed;
          border-bottom-color: #7c3aed;
        }
        .mr-modal-body {
          padding: 20px 22px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .mr-modal-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 12px;
        }
        .mr-modal-metric-card {
          padding: 14px 16px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
        }
        .mr-modal-metric-card.primary {
          background: linear-gradient(135deg, #f5f3ff 0%, #faf5ff 100%);
          border-color: #ddd6fe;
        }
        @media (prefers-color-scheme: dark) {
          .mr-modal-metric-card {
            background: #111827;
            border-color: #1e293b;
          }
          .mr-modal-metric-card.primary {
            background: rgba(124, 58, 237, 0.12);
            border-color: rgba(124, 58, 237, 0.3);
          }
        }
        .mr-metric-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .mr-metric-val {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin-top: 4px;
        }
        @media (prefers-color-scheme: dark) {
          .mr-metric-val {
            color: #ffffff;
          }
        }
        .mr-metric-sub {
          font-size: 11px;
          color: #64748b;
          margin-top: 3px;
        }
        .mr-modal-section {
          padding: 16px;
          border-radius: 12px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }
        @media (prefers-color-scheme: dark) {
          .mr-modal-section {
            background: #111827;
            border-color: #1e293b;
          }
        }
        .mr-section-title {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 10px 0;
        }
        @media (prefers-color-scheme: dark) {
          .mr-section-title {
            color: #ffffff;
          }
        }
        .mr-dist-bar-track {
          display: flex;
          height: 14px;
          border-radius: 999px;
          overflow: hidden;
          background: #e2e8f0;
          margin-bottom: 10px;
        }
        @media (prefers-color-scheme: dark) {
          .mr-dist-bar-track {
            background: #1e293b;
          }
        }
        .mr-dist-bar-fill.prompt {
          background: linear-gradient(90deg, #7c3aed, #a855f7);
          transition: width 0.3s;
        }
        .mr-dist-bar-fill.compl {
          background: linear-gradient(90deg, #0d9488, #14b8a6);
          transition: width 0.3s;
        }
        .mr-dist-bar-legend {
          display: flex;
          align-items: center;
          gap: 18px;
          font-size: 12px;
          color: #475569;
          flex-wrap: wrap;
        }
        @media (prefers-color-scheme: dark) {
          .mr-dist-bar-legend {
            color: #94a3b8;
          }
        }
        .mr-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .mr-legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .mr-legend-dot.prompt {
          background: #7c3aed;
        }
        .mr-legend-dot.compl {
          background: #0d9488;
        }
        .mr-insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 10px;
        }
        .mr-insight-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
        }
        @media (prefers-color-scheme: dark) {
          .mr-insight-row {
            background: #0f172a;
            border-color: #1e293b;
          }
        }
        .mr-insight-key {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }
        .mr-insight-val {
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
        }
        @media (prefers-color-scheme: dark) {
          .mr-insight-val {
            color: #ffffff;
          }
        }
        .mr-subtable-wrapper {
          overflow-x: auto;
          width: 100%;
        }
        .mr-subtable {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        .mr-subtable th {
          padding: 8px 10px;
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
          white-space: nowrap;
        }
        @media (prefers-color-scheme: dark) {
          .mr-subtable th {
            background: #0f172a;
            border-bottom-color: #1e293b;
            color: #94a3b8;
          }
        }
        .mr-subtable td {
          padding: 10px;
          border-bottom: 1px solid #f1f5f9;
          white-space: nowrap;
        }
        @media (prefers-color-scheme: dark) {
          .mr-subtable td {
            border-bottom-color: #1e293b;
          }
        }
        .mr-variant-chip {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          background: #f1f5f9;
          color: #475569;
        }
        @media (prefers-color-scheme: dark) {
          .mr-variant-chip {
            background: #1e293b;
            color: #94a3b8;
          }
        }
        .mr-country-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 7px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        }
        @media (prefers-color-scheme: dark) {
          .mr-country-tag {
            background: #1e293b;
            color: #cbd5e1;
            border-color: #334155;
          }
        }
        .mr-status-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #059669;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .mr-status-link:hover {
          background: rgba(16, 185, 129, 0.18);
        }
        .mr-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
          animation: mrPulse 2s infinite;
        }
        @keyframes mrPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
        .mr-policy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
          margin-bottom: 12px;
        }
        .mr-policy-card {
          padding: 12px 14px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        @media (prefers-color-scheme: dark) {
          .mr-policy-card {
            background: #0f172a;
            border-color: #1e293b;
          }
        }
        .mr-policy-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mr-policy-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 7px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
        }
        .mr-policy-badge.success {
          background: rgba(34, 197, 94, 0.12);
          color: #16a34a;
          border: 1px solid rgba(34, 197, 94, 0.25);
        }
        .mr-policy-badge.warning {
          background: rgba(245, 158, 11, 0.12);
          color: #d97706;
          border: 1px solid rgba(245, 158, 11, 0.25);
        }
        .mr-policy-badge.neutral {
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }
        @media (prefers-color-scheme: dark) {
          .mr-policy-badge.neutral {
            background: #1e293b;
            color: #94a3b8;
            border-color: #334155;
          }
        }
        .mr-policy-desc {
          font-size: 11px;
          color: #64748b;
          line-height: 1.45;
        }
        @media (prefers-color-scheme: dark) {
          .mr-policy-desc {
            color: #94a3b8;
          }
        }
        .mr-legal-links {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 10px;
          border-top: 1px solid #f1f5f9;
          flex-wrap: wrap;
        }
        @media (prefers-color-scheme: dark) {
          .mr-legal-links {
            border-top-color: #1e293b;
          }
        }
        .mr-legal-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #7c3aed;
          background: #f5f3ff;
          border: 1px solid #ddd6fe;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .mr-legal-btn:hover {
          background: #ede9fe;
          border-color: #c4b5fd;
        }
        @media (prefers-color-scheme: dark) {
          .mr-legal-btn {
            background: rgba(124, 58, 237, 0.15);
            border-color: rgba(124, 58, 237, 0.35);
            color: #c4b5fd;
          }
        }
        /* Overview Status Banner */
        .mr-overview-status-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 10px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
        }
        @media (prefers-color-scheme: dark) {
          .mr-overview-status-banner {
            background: rgba(22, 101, 52, 0.15);
            border-color: rgba(34, 197, 94, 0.3);
          }
        }
        .mr-status-pill-green {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #15803d;
          background: #dcfce7;
          border: 1px solid #86efac;
        }
        @media (prefers-color-scheme: dark) {
          .mr-status-pill-green {
            background: rgba(34, 197, 94, 0.18);
            color: #4ade80;
            border-color: rgba(34, 197, 94, 0.35);
          }
        }
        .mr-status-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #7c3aed;
          background: #ffffff;
          border: 1px solid #ddd6fe;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .mr-status-tab-btn:hover {
          background: #7c3aed;
          color: #ffffff;
          border-color: #7c3aed;
        }
        @media (prefers-color-scheme: dark) {
          .mr-status-tab-btn {
            background: #1e293b;
            color: #c4b5fd;
            border-color: #334155;
          }
          .mr-status-tab-btn:hover {
            background: #7c3aed;
            color: #ffffff;
          }
        }
        /* Status Tab Banner & Capabilities */
        .mr-status-banner-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          border-radius: 12px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 14px;
        }
        @media (prefers-color-scheme: dark) {
          .mr-status-banner-card {
            background: rgba(22, 101, 52, 0.15);
            border-color: rgba(34, 197, 94, 0.3);
          }
        }
        .mr-status-icon-ring {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #dcfce7;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        @media (prefers-color-scheme: dark) {
          .mr-status-icon-ring {
            background: rgba(34, 197, 94, 0.25);
          }
        }
        .mr-status-dot.large {
          width: 10px;
          height: 10px;
        }
        .mr-external-status-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          color: #166534;
          background: #ffffff;
          border: 1px solid #86efac;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .mr-external-status-btn:hover {
          background: #16a34a;
          color: #ffffff;
          border-color: #16a34a;
        }
        @media (prefers-color-scheme: dark) {
          .mr-external-status-btn {
            background: #0f172a;
            color: #4ade80;
            border-color: #166534;
          }
          .mr-external-status-btn:hover {
            background: #16a34a;
            color: #ffffff;
          }
        }
        .mr-capabilities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
          margin-top: 10px;
        }
        .mr-cap-card {
          padding: 12px 14px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        @media (prefers-color-scheme: dark) {
          .mr-cap-card {
            background: #0f172a;
            border-color: #1e293b;
          }
        }
        .mr-cap-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .mr-cap-title {
          font-size: 12px;
          font-weight: 700;
          color: #1e293b;
        }
        @media (prefers-color-scheme: dark) {
          .mr-cap-title {
            color: #f1f5f9;
          }
        }
        .mr-cap-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 6px;
          white-space: nowrap;
        }
        .mr-cap-badge.green {
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #86efac;
        }
        @media (prefers-color-scheme: dark) {
          .mr-cap-badge.green {
            background: rgba(34, 197, 94, 0.18);
            color: #4ade80;
            border-color: rgba(34, 197, 94, 0.3);
          }
        }
        .mr-cap-badge.warning {
          background: #fef3c7;
          color: #b45309;
          border: 1px solid #fde68a;
        }
        @media (prefers-color-scheme: dark) {
          .mr-cap-badge.warning {
            background: rgba(245, 158, 11, 0.18);
            color: #fbbf24;
            border-color: rgba(245, 158, 11, 0.3);
          }
        }
        .mr-cap-badge.blue {
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
        }
        @media (prefers-color-scheme: dark) {
          .mr-cap-badge.blue {
            background: rgba(59, 130, 246, 0.18);
            color: #60a5fa;
            border-color: rgba(59, 130, 246, 0.3);
          }
        }
        .mr-cap-badge.neutral {
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }
        @media (prefers-color-scheme: dark) {
          .mr-cap-badge.neutral {
            background: #1e293b;
            color: #94a3b8;
            border-color: #334155;
          }
        }
        .mr-cap-desc {
          font-size: 11px;
          color: #64748b;
          line-height: 1.45;
        }
        @media (prefers-color-scheme: dark) {
          .mr-cap-desc {
            color: #94a3b8;
          }
        }
        /* Diagram & Donut Container Styles */
        .mr-diagram-container {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
          margin-top: 10px;
        }
        @media (prefers-color-scheme: dark) {
          .mr-diagram-container {
            background: #0f172a;
            border-color: #1e293b;
          }
          .mr-diagram-container text[fill="#0f172a"],
          .mr-diagram-container text[fill="#1e293b"],
          .mr-diagram-container text[fill="#334155"] {
            fill: #f1f5f9;
          }
          .mr-diagram-container text[fill="#475569"] {
            fill: #cbd5e1;
          }
          .mr-diagram-container rect[fill="#f8fafc"] {
            fill: rgba(30, 41, 59, 0.4);
            stroke: rgba(71, 85, 105, 0.4);
          }
          .mr-diagram-container rect[fill="#f5f3ff"] {
            fill: rgba(124, 58, 237, 0.12);
            stroke: rgba(124, 58, 237, 0.3);
          }
          .mr-diagram-container rect[fill="#eff6ff"] {
            fill: rgba(37, 99, 235, 0.12);
            stroke: rgba(37, 99, 235, 0.3);
          }
          .mr-diagram-container rect[fill="#f0fdf4"] {
            fill: rgba(13, 148, 136, 0.12);
            stroke: rgba(13, 148, 136, 0.3);
          }
          .mr-diagram-container line[stroke="#e2e8f0"],
          .mr-diagram-container line[stroke="#cbd5e1"] {
            stroke: #334155;
          }
          .mr-diagram-container circle[stroke="#e2e8f0"] {
            stroke: #1e293b;
          }
          .mr-diagram-container div[style*="background: #ffffff"] {
            background: #0b0f17 !important;
            border-color: #1e293b !important;
          }
        }
        .mr-donut-wrapper {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }
      `}</style>

      {showHeader && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-2.34" />
                <path d="M18 14.66V17c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-2.34" />
                <path d="M14 12V6a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v6" />
              </svg>
              Leaderboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Ranked by tokens processed across top AI models
            </p>
          </div>
          <TvrkBanner className="shrink-0" />
        </div>
      )}

      <div className="mr-card">
        {/* Tabs */}
        <div className="mr-tabs">
          <button
            type="button"
            className={`mr-tab-btn ${activeTab === "today" ? "active" : ""}`}
            onClick={() => setActiveTab("today")}
          >
            Today
          </button>
          <button
            type="button"
            className={`mr-tab-btn ${activeTab === "week" ? "active" : ""}`}
            onClick={() => setActiveTab("week")}
          >
            This week
          </button>
          <button
            type="button"
            className={`mr-tab-btn ${activeTab === "month" ? "active" : ""}`}
            onClick={() => setActiveTab("month")}
          >
            This month
          </button>
          <button
            type="button"
            className={`mr-tab-btn ${activeTab === "trending" ? "active" : ""}`}
            onClick={() => setActiveTab("trending")}
          >
            New &amp; trending
          </button>
        </div>

        {/* Filter bar & Search */}
        <div className="mr-filter-bar">
          <div className="mr-segmented">
            <button
              type="button"
              className={`mr-seg-btn ${modelsFilter === "" ? "active" : ""}`}
              onClick={() => setModelsFilter("")}
            >
              All models
            </button>
            <button
              type="button"
              className={`mr-seg-btn ${modelsFilter === "closed" ? "active" : ""}`}
              onClick={() => setModelsFilter("closed")}
            >
              Closed
            </button>
            <button
              type="button"
              className={`mr-seg-btn ${modelsFilter === "open" ? "active" : ""}`}
              onClick={() => setModelsFilter("open")}
            >
              Open
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {!loading && !error && filteredModels.length > 0 && (
              <span className="mr-count-badge">
                Showing {Math.min(displayedModels.length, filteredModels.length)} of {filteredModels.length} models
              </span>
            )}
            <div style={{ position: "relative" }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: "absolute", left: 10, top: 9, pointerEvents: "none" }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search model or author…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mr-search-input"
              />
            </div>
          </div>
        </div>

        {/* Table Content / States */}
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "#64748b" }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                border: "2px solid #7c3aed",
                borderTopColor: "transparent",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            <p style={{ fontSize: 13, fontWeight: 500 }}>Loading rankings…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={{ padding: 40, textAlign: "center", color: "#dc2626" }}>
            <p style={{ fontSize: 13, fontWeight: 600 }}>Failed to load rankings: {error}</p>
            <button
              type="button"
              onClick={() => setActiveTab((t) => t)}
              style={{
                marginTop: 12,
                padding: "6px 14px",
                borderRadius: 8,
                background: "#7c3aed",
                color: "#fff",
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        ) : filteredModels.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
            <p style={{ fontSize: 13 }}>No models match these filters.</p>
          </div>
        ) : (
          <>
            <div className="mr-table-wrapper">
            <table className="mr-table">
              <thead>
                <tr>
                  <th style={{ width: 44, textAlign: "center" }}>#</th>
                  <th>Model</th>
                  <th style={{ minWidth: 200 }}>Tokens</th>
                  <th style={{ textAlign: "right" }}>Requests</th>
                  <th style={{ textAlign: "right" }}>Change</th>
                </tr>
              </thead>
              <tbody>
                {displayedModels.map((m, idx) => {
                  const pct = Math.max(2, Math.min(100, (m.tokens / maxTokens) * 100));
                  const providerMeta = getProviderInfo(m.author);
                  return (
                    <tr
                      key={m.key}
                      className="mr-row mr-row-clickable"
                      onClick={() => {
                        setSelectedModel(m);
                        setSelectedRank(idx + 1);
                      }}
                      title="Click to view model source data"
                    >
                      {/* Rank */}
                      <td style={{ textAlign: "center", fontWeight: 700, color: "#94a3b8", fontSize: 12 }}>
                        {idx + 1}
                      </td>

                      {/* Model Info with Icon */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <ModelIcon author={m.author} modelSlug={m.model_permaslug} size={28} />
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                              <span style={{ fontWeight: 700, color: "inherit", fontSize: 13 }}>
                                {m.prettyName}
                              </span>
                              {m.variant && m.variant !== "standard" && (
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    padding: "1px 5px",
                                    borderRadius: 4,
                                    background: "#e0e7ff",
                                    color: "#4338ca",
                                  }}
                                >
                                  {m.variant}
                                </span>
                              )}
                              <span className="mr-source-pill" title="View Source Data">
                                <span>Source</span>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                  <polyline points="15 3 21 3 21 9"/>
                                  <line x1="10" y1="14" x2="21" y2="3"/>
                                </svg>
                              </span>
                            </div>
                            <div style={{ fontSize: 11, color: "#64748b", marginTop: 1, display: "flex", alignItems: "center", gap: 5 }}>
                              <span>{providerMeta?.displayName || m.author}</span>
                              {providerMeta?.countryFlag && (
                                <span title={`Headquarters: ${providerMeta.countryName || providerMeta.headquarters}`}>
                                  {providerMeta.countryFlag}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tokens */}
                      <td>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: 13 }}>{formatTokens(m.tokens)}</span>
                          <div className="mr-token-bar-bg">
                            <div className="mr-token-bar-fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </td>

                      {/* Requests */}
                      <td style={{ textAlign: "right", fontWeight: 600, color: "#64748b" }}>
                        {formatRequests(m.requests)}
                      </td>

                      {/* Change */}
                      <td style={{ textAlign: "right" }}>
                        {m.change === null ? (
                          <span className="mr-badge mr-badge-new">new</span>
                        ) : m.change > 0 ? (
                          <span className="mr-badge mr-badge-up">+{m.change.toFixed(1)}%</span>
                        ) : m.change < 0 ? (
                          <span className="mr-badge mr-badge-down">{m.change.toFixed(1)}%</span>
                        ) : (
                          <span className="mr-badge mr-badge-neutral">0.0%</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* View More button: shows up to 20 models initially, expands by +20 on click */}
          {!loading && !error && filteredModels.length > visibleCount && (
            <div className="mr-view-more-container">
              <button
                type="button"
                className="mr-view-more-btn"
                onClick={() => setVisibleCount((prev) => prev + 20)}
              >
                <span>View More</span>
                <span className="mr-view-more-count">
                   &bull;  {displayedModels.length} of {filteredModels.length} models
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          )}

          {!loading && !error && filteredModels.length > 20 && displayedModels.length >= filteredModels.length && (
            <div className="mr-all-loaded-text">
              All {filteredModels.length} models loaded
            </div>
          )}
        </>
      )}
      </div>

      {selectedModel && (
        <ModelSourceModal
          model={selectedModel}
          rank={selectedRank}
          onClose={() => {
            setSelectedModel(null);
            setSelectedRank(null);
          }}
        />
      )}
    </div>
  );
}

