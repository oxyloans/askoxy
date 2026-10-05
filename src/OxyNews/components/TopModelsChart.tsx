import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import BASE_URL from "../../Config";

interface WeekPoint { x: string; ys: Record<string, number> }

const UNIT = 1e12;
const UNIT_LABEL = "T";
const Y_TICKS = [45, 90, 135, 180];
const LOG_TICKS = [0.001, 0.01, 0.1, 1, 10, 100];
const OTHERS_COLOR = "#ff66b3";
const MIN_LUMINANCE = 0.42; // floor so blues/violets stay visible on the dark background
const API_URL = `${BASE_URL}/marketing-service/campgin/weekly-stats`;

const BRAND: Record<string, string> = {
  Deepseek: "DeepSeek", Mimo: "MiMo", Glm: "GLM", Minimax: "MiniMax",
  Xai: "xAI", Nvidia: "NVIDIA", Moonshotai: "MoonshotAI", Gpt: "GPT",
};

// Golden-ratio HSV (s 0.75–0.95, v 0.92–1.0) + luminance floor so no color sinks into the background
function makeColor(i: number): string {
  const h = (i * 0.618033988749895) % 1;
  const s = 0.75 + 0.2 * (i % 2);
  const v = 0.92 + 0.08 * ((i % 3) / 2);
  const hi = Math.floor(h * 6);
  const f = h * 6 - hi;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0, g = 0, b = 0;
  if (hi === 0) { r = v; g = t; b = p; }
  else if (hi === 1) { r = q; g = v; b = p; }
  else if (hi === 2) { r = p; g = v; b = t; }
  else if (hi === 3) { r = p; g = q; b = v; }
  else if (hi === 4) { r = t; g = p; b = v; }
  else { r = v; g = p; b = q; }

  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (lum < MIN_LUMINANCE) {
    const k = (MIN_LUMINANCE - lum) / (1 - lum); // blend toward white just enough
    r += (1 - r) * k;
    g += (1 - g) * k;
    b += (1 - b) * k;
  }
  return "#" + [r, g, b].map(c => Math.round(c * 255).toString(16).padStart(2, "0")).join("");
}

function prettify(permaslug: string): string {
  const free = permaslug.endsWith(":free");
  const perm = permaslug.replace(/:free$/, "");
  const tail = perm.split("/").pop()!.replace(/-\d{8}$/, "");
  const name = tail
    .split("-")
    .map(w => BRAND[w.charAt(0).toUpperCase() + w.slice(1)] ?? (w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ")
    .replace(/\bGPT (\d)/g, "GPT-$1");
  return name + (free ? " (free)" : "");
}

// Tooltip values: 1.23T / 456.7B / 789M
function fmtT(val: number): string {
  if (val >= 1) return val.toFixed(2) + UNIT_LABEL;
  if (val >= 0.001) return (val * 1000).toFixed(1) + "B";
  return (val * 1e6).toFixed(0) + "M";
}

// Axis labels: 45T / 135T, and 1B / 10B / 100B on log scale
function fmtAxis(val: number): string {
  if (val >= 1) return `${Math.round(val)}${UNIT_LABEL}`;
  if (val >= 0.001) return `${Math.round(val * 1000)}B`;
  return `${Math.round(val * 1e6)}M`;
}

function CustomTooltip({ active, payload, label, colorMap, labelMap }: any) {
  if (!active || !payload?.length) return null;
  const sorted = [...payload]
    .filter((p: any) => p.value > 0)
    .sort((a: any, b: any) => b.value - a.value);
  const total = sorted.reduce((s: number, p: any) => s + (p.value || 0), 0);
  return (
    <div style={{ background: "#0b0f14", border: "1px solid #334155", borderRadius: 12, padding: "10px 14px", fontSize: 11, minWidth: 200, maxWidth: 280, boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
      <p style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: 8 }}>{label}</p>
      <div style={{ maxHeight: 240, overflowY: "auto" }}>
        {sorted.map((p: any) => (
          <div key={p.dataKey} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: colorMap[p.dataKey], flexShrink: 0 }} />
              <span style={{ color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {labelMap[p.dataKey] || p.dataKey}
              </span>
            </span>
            <span style={{ color: "#fff", fontWeight: 700, flexShrink: 0 }}>{fmtT(p.value)}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #334155", display: "flex", justifyContent: "space-between", color: "#f1f5f9", fontWeight: 700 }}>
        <span>Total</span><span>{fmtT(total)}</span>
      </div>
    </div>
  );
}

export default function TopModelsChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [stackModels, setStackModels] = useState<string[]>([]);
  const [colorMap, setColorMap] = useState<Record<string, string>>({});
  const [labelMap, setLabelMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logScale, setLogScale] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(API_URL, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json: any) => {
        const raw: WeekPoint[] = json?.data?.data ?? json?.data ?? [];
        if (!raw.length) { setError("No data returned"); return; }

        const modelSet = new Set<string>();
        raw.forEach(w => Object.keys(w.ys).forEach(k => { if (k !== "Others") modelSet.add(k); }));
        const allModels = Array.from(modelSet);
        const hasOthers = raw.some(w => "Others" in w.ys);

        const totals: Record<string, number> = {};
        allModels.forEach(m => { totals[m] = raw.reduce((s, w) => s + (w.ys[m] ?? 0), 0); });
        const sortedModels = [...allModels].sort((a, b) => totals[b] - totals[a]);

        const cm: Record<string, string> = { Others: OTHERS_COLOR };
        const lm: Record<string, string> = { Others: "Others" };
        const counts: Record<string, number> = {};
        sortedModels.forEach(k => {
          lm[k] = prettify(k);
          counts[lm[k]] = (counts[lm[k]] ?? 0) + 1;
        });
        sortedModels.forEach(k => {
          if (counts[lm[k]] > 1) {
            const m = k.match(/-(20\d{6})(:free)?$/);
            if (m) {
              const base = lm[k].replace(" (free)", "");
              lm[k] = base + ` ${m[1].slice(4)}` + (m[2] ? " (free)" : "");
            }
          }
        });
        sortedModels.forEach((m, i) => { cm[m] = makeColor(i); });

        // stack order (bottom → top): Others, then lowest-total → highest-total
        const stack = [
          ...(hasOthers ? ["Others"] : []),
          ...sortedModels.slice().reverse(),
        ];

        const rows = raw.map(w => {
          const row: Record<string, any> = {
            date: new Date(w.x).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
          };
          stack.forEach(k => { row[k] = (w.ys[k] ?? 0) / UNIT; });
          return row;
        });

        setChartData(rows);
        setStackModels(stack);
        setColorMap(cm);
        setLabelMap(lm);
      })
      .catch(e => { if (e.name !== "AbortError") setError(e.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div style={{ marginTop: 32, borderRadius: 16, border: "1px solid #334155", background: "#05080b", padding: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid #7c3aed", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
        <span style={{ color: "#94a3b8", fontSize: 13 }}>Loading LLM usage data…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !chartData.length) {
    return (
      <div style={{ marginTop: 32, borderRadius: 16, border: "1px solid #334155", background: "#05080b", padding: 24, textAlign: "center", color: "#64748b", fontSize: 12 }}>
        LLM usage chart unavailable{error ? `: ${error}` : ""}
      </div>
    );
  }

  const yMax = Math.max(...Y_TICKS) * 1.05;

  return (
    <div style={{ borderRadius: 16, border: "1px solid #1e293b", background: "#05080b", overflow: "hidden" }}>
      <div style={{ padding: "12px 16px 8px", display: "flex", justifyContent: "flex-end" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {(["Linear", "Log"] as const).map(mode => {
            const active = logScale === (mode === "Log");
            return (
              <button
                key={mode}
                onClick={() => setLogScale(mode === "Log")}
                style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: active ? "#fff" : "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "6px 10px", background: active ? "#7c3aed" : "transparent", cursor: "pointer" }}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ height: 380, padding: "0 8px 8px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }} barCategoryGap="20%">
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              scale={logScale ? "log" : "linear"}
              domain={logScale ? [0.0001, "auto"] : [0, yMax]}
              ticks={logScale ? LOG_TICKS : Y_TICKS}
              tickFormatter={fmtAxis}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={{ stroke: "#334155" }}
              width={52}
              allowDataOverflow
            />
            <Tooltip
              content={<CustomTooltip colorMap={colorMap} labelMap={labelMap} />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            {stackModels.map((m, idx) => (
              <Bar
                key={m}
                dataKey={m}
                stackId="a"
                fill={colorMap[m]}
                stroke="rgba(5,8,11,0.55)"
                strokeWidth={0.6}
                isAnimationActive={false}
                radius={idx === stackModels.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}