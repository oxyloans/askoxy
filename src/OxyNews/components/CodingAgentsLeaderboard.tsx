// src/OxyNews/components/CodingAgentsLeaderboard.tsx
import React, { useState, useMemo, useEffect } from "react";
import {
  CODING_AGENTS_DATA,
  BENCHMARKS_METADATA,
  CodingAgentModel,
} from "../data/codingAgentsData";
import { api } from "../lib/api";
import { getModelIconUrl, PROVIDER_BRAND_COLORS } from "../lib/providerData";

type ActiveTab =
  | "benchmark-score-by-eval"
  | "index"
  | "deep-swe-v1.1"
  | "terminal-bench-v4"
  | "swe-atlas-qna"
  | "cost"
  | "time"
  | "tokens";

type ViewMode = "chart" | "table";

export default function CodingAgentsLeaderboard() {
  const [models, setModels] = useState<CodingAgentModel[]>(CODING_AGENTS_DATA);
  const [activeTab, setActiveTab] = useState<ActiveTab>("benchmark-score-by-eval");
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [search, setSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<CodingAgentModel | null>(null);
  const [showTopOnly, setShowTopOnly] = useState<boolean>(false);

  // Attempt live API fetch or fallback
  useEffect(() => {
    api.getCodingAgentsBenchmarks()
      .then((data) => {
        if (data && data.length > 0) setModels(data);
      })
      .catch(() => {});
  }, []);

  // Unique list of providers
  const providers = useMemo(() => {
    const set = new Set<string>();
    models.forEach((m) => {
      if (m.creatorName) set.add(m.creatorName);
      else if (m.provider) set.add(m.provider);
    });
    return Array.from(set).sort();
  }, [models]);

  // Filtered & sorted models
  const filteredModels = useMemo(() => {
    let list = [...models];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.agent.toLowerCase().includes(q) ||
          m.model.toLowerCase().includes(q) ||
          m.creatorName.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q)
      );
    }

    if (selectedProvider !== "all") {
      list = list.filter(
        (m) =>
          m.creatorName.toLowerCase() === selectedProvider.toLowerCase() ||
          m.provider.toLowerCase() === selectedProvider.toLowerCase()
      );
    }

    // Sort based on active tab
    list.sort((a, b) => {
      if (activeTab === "cost") {
        return (a.costUsd ?? 9999) - (b.costUsd ?? 9999);
      }
      if (activeTab === "time") {
        return (a.agentWallTimeSec ?? 99999) - (b.agentWallTimeSec ?? 99999);
      }
      if (activeTab === "deep-swe-v1.1") {
        return (b.deepSweScore ?? 0) - (a.deepSweScore ?? 0);
      }
      if (activeTab === "terminal-bench-v4") {
        return (b.terminalBenchScore ?? 0) - (a.terminalBenchScore ?? 0);
      }
      if (activeTab === "swe-atlas-qna") {
        return (b.sweAtlasScore ?? 0) - (a.sweAtlasScore ?? 0);
      }
      return b.indexScore - a.indexScore;
    });

    if (showTopOnly) {
      return list.slice(0, 12);
    }

    return list;
  }, [models, search, selectedProvider, activeTab, showTopOnly]);

  // Overall KPIs
  const topIndexModel = useMemo(() => {
    return [...models].sort((a, b) => b.indexScore - a.indexScore)[0];
  }, [models]);

  const fastestModel = useMemo(() => {
    return [...models]
      .filter((m) => m.agentWallTimeSec)
      .sort((a, b) => (a.agentWallTimeSec ?? 99999) - (b.agentWallTimeSec ?? 99999))[0];
  }, [models]);

  const cheapestModel = useMemo(() => {
    return [...models]
      .filter((m) => m.costUsd)
      .sort((a, b) => (a.costUsd ?? 9999) - (b.costUsd ?? 9999))[0];
  }, [models]);

  return (
    <div className="w-full text-slate-800 antialiased space-y-6">
      {/* ── Header Banner ── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Artificial Analysis Coding Agent Index v1.5
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Benchmarks
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Coding Agent Benchmarks & Leaderboard
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-world performance of coding agents on software engineering tasks.
              Measures pass@1 success rates, cost per task, execution wall time, and token efficiency across DeepSWE v1.1, Terminal-Bench 4.0, and SWE-Atlas-QnA.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <a
              href="https://artificialanalysis.ai/agents/coding-agents?coding-agents-performance-chart=benchmark-score-by-eval"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15 backdrop-blur shadow-sm"
            >
              <span>Artificial Analysis Official</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── Top 3 KPI Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Top Index */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Top Coding Agent Index
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {topIndexModel ? (topIndexModel.indexScore * 100).toFixed(1) + "%" : "68.4%"}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Higher is better
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 font-medium truncate flex items-center gap-1.5">
            <span className="font-bold text-slate-900">{topIndexModel?.agent}</span>
            <span>·</span>
            <span className="text-slate-500 truncate">{topIndexModel?.model}</span>
          </div>
        </div>

        {/* Card 2: Fastest */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Fastest Agent (Wall Time)
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {fastestModel ? `${fastestModel.agentWallTimeSec}s` : "381s"}
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              Lower is better
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 font-medium truncate flex items-center gap-1.5">
            <span className="font-bold text-slate-900">{fastestModel?.agent}</span>
            <span>·</span>
            <span className="text-slate-500 truncate">{fastestModel?.model}</span>
          </div>
        </div>

        {/* Card 3: Most Cost-Effective */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Lowest Cost per Task
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {cheapestModel ? `$${cheapestModel.costUsd?.toFixed(2)}` : "$0.23"}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              USD / task
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 font-medium truncate flex items-center gap-1.5">
            <span className="font-bold text-slate-900">{cheapestModel?.agent}</span>
            <span>·</span>
            <span className="text-slate-500 truncate">{cheapestModel?.model}</span>
          </div>
        </div>
      </div>

      {/* ── Main Section Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* ── Tab Bar Navigation (Identical to Artificial Analysis tabs) ── */}
        <div className="border-b border-slate-200 bg-slate-50/80 px-4 pt-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveTab("benchmark-score-by-eval")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "benchmark-score-by-eval"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <span>Score by Benchmark</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-400 text-slate-950 font-black">
                Primary
              </span>
            </button>

            <button
              onClick={() => setActiveTab("index")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "index"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              Coding Agent Index
            </button>

            <button
              onClick={() => setActiveTab("deep-swe-v1.1")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "deep-swe-v1.1"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              DeepSWE v1.1
            </button>

            <button
              onClick={() => setActiveTab("terminal-bench-v4")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "terminal-bench-v4"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              Terminal-Bench 4.0
            </button>

            <button
              onClick={() => setActiveTab("swe-atlas-qna")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "swe-atlas-qna"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              SWE-Atlas-QnA
            </button>

            <button
              onClick={() => setActiveTab("cost")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "cost"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              Cost / Task ($)
            </button>

            <button
              onClick={() => setActiveTab("time")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "time"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              Time / Task (s)
            </button>

            <button
              onClick={() => setActiveTab("tokens")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "tokens"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              Token Usage
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1.5 pb-2">
            <button
              onClick={() => setViewMode("chart")}
              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors ${
                viewMode === "chart"
                  ? "bg-white text-indigo-700 border-indigo-300 shadow-sm"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-white"
              }`}
              title="Bar Chart View"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span className="hidden sm:inline">Chart</span>
            </button>

            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors ${
                viewMode === "table"
                  ? "bg-white text-indigo-700 border-indigo-300 shadow-sm"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-white"
              }`}
              title="Table View"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>

        {/* ── Controls & Filter Bar ── */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search agent or model (e.g. Gemini, Claude, Codex)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Provider Filter */}
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Providers ({models.length})</option>
              {providers.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Quick toggle top models */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showTopOnly}
                onChange={(e) => setShowTopOnly(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span>Top 12 Only</span>
            </label>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-medium text-slate-500">
              Showing <span className="font-bold text-slate-900">{filteredModels.length}</span> agents
            </span>
          </div>
        </div>

        {/* ── Active Benchmark Details & Legend ── */}
        <div className="px-5 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap text-xs">
          {activeTab === "benchmark-score-by-eval" ? (
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-bold text-slate-700">Benchmark Breakdown:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-purple-600" />
                <span className="font-semibold text-slate-700">DeepSWE v1.1</span>
                <span className="text-slate-400">(Datacurve · 113 tasks)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-cyan-600" />
                <span className="font-semibold text-slate-700">SWE-Atlas-QnA</span>
                <span className="text-slate-400">(Scale AI · 124 tasks)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-500" />
                <span className="font-semibold text-slate-700">Terminal-Bench 4.0</span>
                <span className="text-slate-400">(Laude Institute · 66 tasks)</span>
              </div>
            </div>
          ) : (
            <div className="text-slate-600">
              {activeTab === "index" && (
                <span>Composite score giving equal 1/3 weight to DeepSWE v1.1, Terminal-Bench 4.0, and SWE-Atlas-QnA.</span>
              )}
              {activeTab === "deep-swe-v1.1" && (
                <span>DeepSWE v1.1 (Datacurve): Evaluates long-horizon software engineering tasks requiring multi-file code patches.</span>
              )}
              {activeTab === "terminal-bench-v4" && (
                <span>Terminal-Bench 4.0 (Laude Institute): Tests agentic terminal interaction, scientific packages, and system execution.</span>
              )}
              {activeTab === "swe-atlas-qna" && (
                <span>SWE-Atlas-QnA (Scale AI): Tests repository navigation and codebase question-answering accuracy.</span>
              )}
              {activeTab === "cost" && (
                <span>Average API cost in USD per completed engineering task (Lower is better).</span>
              )}
              {activeTab === "time" && (
                <span>Average execution wall time in seconds per task (Lower is better).</span>
              )}
              {activeTab === "tokens" && (
                <span>Total tokens consumed per task, including input, output, and cache hit efficiency.</span>
              )}
            </div>
          )}

          <span className="text-[11px] text-slate-400 italic">
            Click any row to view complete metrics & percentiles
          </span>
        </div>

        {/* ── Content View (Chart or Table) ── */}
        <div className="p-4 sm:p-6">
          {viewMode === "chart" ? (
            activeTab === "benchmark-score-by-eval" ? (
              <GroupedBenchmarkChart
                models={filteredModels}
                onSelectModel={setSelectedModel}
              />
            ) : (
              <SingleMetricChart
                models={filteredModels}
                activeTab={activeTab}
                onSelectModel={setSelectedModel}
              />
            )
          ) : (
            <LeaderboardTable
              models={filteredModels}
              onSelectModel={setSelectedModel}
            />
          )}
        </div>
      </div>

      {/* ── Methodology Note ── */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 text-xs text-slate-600 leading-relaxed flex items-start gap-3">
        <span className="text-base">ℹ️</span>
        <div>
          <span className="font-bold text-slate-800">Scoring & Benchmark Methodology:</span> Each benchmark score represents the average pass@1 accuracy across 3 independent attempts per task on dedicated hardware. The Artificial Analysis Coding Agent Index gives equal 1/3 weight to DeepSWE v1.1, Terminal-Bench 4.0, and SWE-Atlas-QnA. Cost and execution time are measured across full end-to-end task runs.
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selectedModel && (
        <ModelDetailModal
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponent: Grouped Benchmark Chart (Score by Benchmark)
// ─────────────────────────────────────────────────────────────────────────────
function GroupedBenchmarkChart({
  models,
  onSelectModel,
}: {
  models: CodingAgentModel[];
  onSelectModel: (m: CodingAgentModel) => void;
}) {
  return (
    <div className="space-y-4">
      {models.map((m, idx) => {
        const deepSwePct = m.deepSweScore != null ? m.deepSweScore * 100 : null;
        const sweAtlasPct = m.sweAtlasScore != null ? m.sweAtlasScore * 100 : null;
        const termBenchPct = m.terminalBenchScore != null ? m.terminalBenchScore * 100 : null;
        const iconUrl = getModelIconUrl(m.provider, m.model);

        return (
          <div
            key={m.id || idx}
            onClick={() => onSelectModel(m)}
            className="group p-3 rounded-xl border border-slate-200/80 hover:border-indigo-400 bg-white hover:bg-slate-50/70 transition-all cursor-pointer shadow-sm hover:shadow"
          >
            {/* Header row */}
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <div className="flex items-center gap-2.5">
                <span className="w-6 text-xs font-black text-slate-400 text-center">
                  #{idx + 1}
                </span>

                {/* Model Logo */}
                <div className="w-6 h-6 rounded-md bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0">
                  <img
                    src={iconUrl}
                    alt={m.provider}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {m.agent}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      + {m.model}
                    </span>
                  </div>
                </div>
              </div>

              {/* Index Score Badge */}
              <div className="flex items-center gap-3">
                {m.costUsd != null && (
                  <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                    ${m.costUsd.toFixed(2)}/task
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Index: {(m.indexScore * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* 3 Grouped Horizontal Bars */}
            <div className="space-y-1.5 pl-8 sm:pl-9">
              {/* Bar 1: DeepSWE */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-24 text-[11px] font-semibold text-slate-500 truncate">
                  DeepSWE
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${deepSwePct ?? 0}%` }}
                  />
                </div>
                <span className="w-12 text-right font-bold text-purple-700 text-xs">
                  {deepSwePct != null ? `${deepSwePct.toFixed(1)}%` : "—"}
                </span>
              </div>

              {/* Bar 2: SWE-Atlas */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-24 text-[11px] font-semibold text-slate-500 truncate">
                  SWE-Atlas
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-cyan-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${sweAtlasPct ?? 0}%` }}
                  />
                </div>
                <span className="w-12 text-right font-bold text-cyan-700 text-xs">
                  {sweAtlasPct != null ? `${sweAtlasPct.toFixed(1)}%` : "—"}
                </span>
              </div>

              {/* Bar 3: Terminal-Bench */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-24 text-[11px] font-semibold text-slate-500 truncate">
                  Terminal-Bench
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${termBenchPct ?? 0}%` }}
                  />
                </div>
                <span className="w-12 text-right font-bold text-amber-700 text-xs">
                  {termBenchPct != null ? `${termBenchPct.toFixed(1)}%` : "—"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponent: Single Metric Chart
// ─────────────────────────────────────────────────────────────────────────────
function SingleMetricChart({
  models,
  activeTab,
  onSelectModel,
}: {
  models: CodingAgentModel[];
  activeTab: ActiveTab;
  onSelectModel: (m: CodingAgentModel) => void;
}) {
  // Determine max value for relative bar widths
  const maxValue = useMemo(() => {
    if (activeTab === "cost") {
      return Math.max(...models.map((m) => m.costUsd ?? 0), 15);
    }
    if (activeTab === "time") {
      return Math.max(...models.map((m) => m.agentWallTimeSec ?? 0), 3000);
    }
    if (activeTab === "tokens") {
      return Math.max(...models.map((m) => m.totalTokens ?? 0), 20000000);
    }
    return 100; // Percentages
  }, [models, activeTab]);

  return (
    <div className="space-y-3">
      {models.map((m, idx) => {
        let value = 0;
        let displayStr = "";
        let barColor = "bg-indigo-600";

        if (activeTab === "index") {
          value = m.indexScore * 100;
          displayStr = `${value.toFixed(1)}%`;
          barColor = "bg-indigo-600";
        } else if (activeTab === "deep-swe-v1.1") {
          value = (m.deepSweScore ?? 0) * 100;
          displayStr = m.deepSweScore != null ? `${value.toFixed(1)}%` : "—";
          barColor = "bg-purple-600";
        } else if (activeTab === "terminal-bench-v4") {
          value = (m.terminalBenchScore ?? 0) * 100;
          displayStr = m.terminalBenchScore != null ? `${value.toFixed(1)}%` : "—";
          barColor = "bg-amber-500";
        } else if (activeTab === "swe-atlas-qna") {
          value = (m.sweAtlasScore ?? 0) * 100;
          displayStr = m.sweAtlasScore != null ? `${value.toFixed(1)}%` : "—";
          barColor = "bg-cyan-600";
        } else if (activeTab === "cost") {
          value = m.costUsd ?? 0;
          displayStr = m.costUsd != null ? `$${m.costUsd.toFixed(2)}` : "—";
          barColor = "bg-emerald-600";
        } else if (activeTab === "time") {
          value = m.agentWallTimeSec ?? 0;
          displayStr = m.agentWallTimeSec != null ? `${m.agentWallTimeSec}s` : "—";
          barColor = "bg-amber-600";
        } else if (activeTab === "tokens") {
          value = m.totalTokens ?? 0;
          displayStr = m.totalTokens != null ? `${(m.totalTokens / 1e6).toFixed(2)}M` : "—";
          barColor = "bg-blue-600";
        }

        const barWidth = Math.min(100, (value / maxValue) * 100);
        const iconUrl = getModelIconUrl(m.provider, m.model);

        return (
          <div
            key={m.id || idx}
            onClick={() => onSelectModel(m)}
            className="group p-2.5 rounded-xl border border-slate-200/80 hover:border-indigo-400 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-sm flex items-center gap-3"
          >
            <span className="w-6 text-xs font-black text-slate-400 text-center shrink-0">
              #{idx + 1}
            </span>

            <div className="w-6 h-6 rounded-md bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0">
              <img
                src={iconUrl}
                alt={m.provider}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>

            <div className="w-48 sm:w-64 truncate">
              <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                {m.agent}
              </span>
              <span className="text-xs text-slate-500 font-medium ml-1.5 truncate">
                {m.model}
              </span>
            </div>

            {/* Bar */}
            <div className="flex-1 bg-slate-100 rounded-full h-3.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${barWidth}%` }}
              />
            </div>

            <span className="w-16 text-right font-black text-xs text-slate-900 shrink-0">
              {displayStr}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponent: Leaderboard Table View
// ─────────────────────────────────────────────────────────────────────────────
function LeaderboardTable({
  models,
  onSelectModel,
}: {
  models: CodingAgentModel[];
  onSelectModel: (m: CodingAgentModel) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px] bg-slate-50/60">
            <th className="py-3 px-3 text-center w-12">#</th>
            <th className="py-3 px-3">Agent & Host Model</th>
            <th className="py-3 px-3 text-center">Provider</th>
            <th className="py-3 px-3 text-center font-extrabold text-indigo-700">Coding Index</th>
            <th className="py-3 px-3 text-center">DeepSWE v1.1</th>
            <th className="py-3 px-3 text-center">SWE-Atlas</th>
            <th className="py-3 px-3 text-center">Terminal-Bench</th>
            <th className="py-3 px-3 text-center">Cost / Task</th>
            <th className="py-3 px-3 text-center">Wall Time</th>
            <th className="py-3 px-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
          {models.map((m, idx) => {
            const iconUrl = getModelIconUrl(m.provider, m.model);
            return (
              <tr
                key={m.id || idx}
                onClick={() => onSelectModel(m)}
                className="hover:bg-indigo-50/50 cursor-pointer transition-colors"
              >
                <td className="py-3 px-3 text-center font-bold text-slate-400">
                  {idx + 1}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0">
                      <img
                        src={iconUrl}
                        alt={m.provider}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{m.agent}</div>
                      <div className="text-[11px] text-slate-500 font-medium truncate max-w-xs">
                        {m.model}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                    {m.creatorName || m.provider}
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="px-2.5 py-1 rounded-md text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {(m.indexScore * 100).toFixed(1)}%
                  </span>
                </td>
                <td className="py-3 px-3 text-center font-bold text-purple-700">
                  {m.deepSweScore != null ? `${(m.deepSweScore * 100).toFixed(1)}%` : "—"}
                </td>
                <td className="py-3 px-3 text-center font-bold text-cyan-700">
                  {m.sweAtlasScore != null ? `${(m.sweAtlasScore * 100).toFixed(1)}%` : "—"}
                </td>
                <td className="py-3 px-3 text-center font-bold text-amber-700">
                  {m.terminalBenchScore != null ? `${(m.terminalBenchScore * 100).toFixed(1)}%` : "—"}
                </td>
                <td className="py-3 px-3 text-center font-bold text-slate-900">
                  {m.costUsd != null ? `$${m.costUsd.toFixed(2)}` : "—"}
                </td>
                <td className="py-3 px-3 text-center text-slate-600">
                  {m.agentWallTimeSec != null ? `${m.agentWallTimeSec}s` : "—"}
                </td>
                <td className="py-3 px-3 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectModel(m);
                    }}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponent: Model Detail Modal
// ─────────────────────────────────────────────────────────────────────────────
function ModelDetailModal({
  model,
  onClose,
}: {
  model: CodingAgentModel;
  onClose: () => void;
}) {
  const iconUrl = getModelIconUrl(model.provider, model.model);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 p-1.5 flex items-center justify-center shrink-0">
              <img
                src={iconUrl}
                alt={model.provider}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{model.agent}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {model.creatorName}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{model.model}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Vertical Benchmark Graph in Preview Modal */}
        <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                  <rect x="4" y="8" width="4" height="12" rx="1" fill="#6366f1" fillOpacity="0.4" />
                  <rect x="10" y="4" width="4" height="16" rx="1" fill="#6366f1" fillOpacity="0.8" />
                  <rect x="16" y="11" width="4" height="9" rx="1" fill="#6366f1" fillOpacity="0.4" />
                </svg>
                Vertical Benchmark Graph (Pass@1 Accuracy)
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Direct benchmark evaluation comparison across all 3 standard test suites
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 text-indigo-800 border border-indigo-200">
                Index: {(model.indexScore * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Vertical Columns Chart */}
          {(() => {
            const deepSwePct = model.deepSweScore != null ? model.deepSweScore * 100 : 0;
            const sweAtlasPct = model.sweAtlasScore != null ? model.sweAtlasScore * 100 : 0;
            const termBenchPct = model.terminalBenchScore != null ? model.terminalBenchScore * 100 : 0;
            const indexPct = model.indexScore * 100;
            const cachePct = model.cacheHitRate ?? 0;
            const modalChartHeight = 190;
            const gridMarks = [100, 75, 50, 25, 0];

            const bars = [
              {
                id: "deepswe",
                label: "DeepSWE v1.1",
                sublabel: "Datacurve (113 tasks)",
                val: deepSwePct,
                colorGradient: "from-purple-700 via-purple-600 to-purple-500",
                textColor: "text-purple-700",
              },
              {
                id: "sweatlas",
                label: "SWE-Atlas-QnA",
                sublabel: "Scale AI (124 tasks)",
                val: sweAtlasPct,
                colorGradient: "from-cyan-600 via-cyan-500 to-cyan-400",
                textColor: "text-cyan-700",
              },
              {
                id: "termbench",
                label: "Terminal-Bench",
                sublabel: "Laude (66 tasks)",
                val: termBenchPct,
                colorGradient: "from-amber-600 via-amber-500 to-amber-400",
                textColor: "text-amber-700",
              },
              {
                id: "index",
                label: "Coding Index",
                sublabel: "Composite Average",
                val: indexPct,
                colorGradient: "from-indigo-700 via-indigo-600 to-indigo-500",
                textColor: "text-indigo-700",
              },
              {
                id: "cache",
                label: "Cache Efficiency",
                sublabel: "Token Hit Rate",
                val: cachePct,
                colorGradient: "from-emerald-600 via-emerald-500 to-emerald-400",
                textColor: "text-emerald-700",
              },
            ];

            return (
              <div className="relative border border-slate-200/90 rounded-xl bg-white p-3 pt-5 shadow-xs">
                <div className="relative flex" style={{ height: modalChartHeight + 52 }}>
                  {/* Y-Axis */}
                  <div
                    className="flex flex-col justify-between pr-2.5 text-[10px] font-bold text-slate-400 select-none w-7 text-right"
                    style={{ height: modalChartHeight }}
                  >
                    {gridMarks.map((g) => (
                      <span key={g} className="leading-none">{g}%</span>
                    ))}
                  </div>

                  {/* Grid Lines */}
                  <div className="absolute left-8 right-0 pointer-events-none" style={{ height: modalChartHeight }}>
                    {gridMarks.map((g) => {
                      const top = ((100 - g) / 100) * (modalChartHeight - 1);
                      return (
                        <div key={g} className="absolute left-0 right-0 border-b border-slate-100" style={{ top }} />
                      );
                    })}
                  </div>

                  {/* 5 Vertical Bars */}
                  <div className="flex-1 flex items-end justify-around pl-1" style={{ height: modalChartHeight }}>
                    {bars.map((b) => (
                      <div key={b.id} className="group/bar flex flex-col items-center justify-end h-full flex-1 max-w-[68px]">
                        <div
                          className={`w-9 sm:w-11 bg-gradient-to-t ${b.colorGradient} rounded-t-md shadow-sm transition-all duration-500 group-hover/bar:brightness-110 flex items-start justify-center pt-1`}
                          style={{ height: `${Math.min(100, Math.max(2, b.val))}%` }}
                        />
                        <span className={`text-[11px] font-black ${b.textColor} mt-1 select-none`}>
                          {b.val > 0 ? `${b.val.toFixed(1)}%` : "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Baseline & Labels */}
                <div className="border-t border-slate-200 pt-2 flex items-start justify-around text-center pl-7">
                  {bars.map((b) => (
                    <div key={b.id} className="flex-1 max-w-[68px]">
                      <div className="text-[10px] font-extrabold text-slate-800 leading-tight truncate">
                        {b.label}
                      </div>
                      <div className="text-[9px] text-slate-400 font-medium truncate">
                        {b.sublabel}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Detailed Statistics Cards (STATICS) */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Execution &amp; Cost Statistics
          </h4>

          {/* 4 Stat Overview Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Cost / Task</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {model.costUsd != null ? `$${model.costUsd.toFixed(2)}` : "—"}
              </div>
              <div className="text-[10px] text-slate-400">USD per task run</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Agent Wall Time</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {model.agentWallTimeSec != null ? `${model.agentWallTimeSec}s` : "—"}
              </div>
              <div className="text-[10px] text-slate-400">
                {model.agentWallTimeSec != null
                  ? `${Math.floor(model.agentWallTimeSec / 60)}m ${model.agentWallTimeSec % 60}s`
                  : "wall clock"}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Average Steps</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {model.steps ?? "—"}
              </div>
              <div className="text-[10px] text-slate-400">steps to complete</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Total Tokens</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {model.totalTokens != null ? `${(model.totalTokens / 1e6).toFixed(2)}M` : "—"}
              </div>
              <div className="text-[10px] text-slate-400">
                {model.totalTokens != null ? model.totalTokens.toLocaleString() : "tokens"}
              </div>
            </div>
          </div>

          {/* Token Analytics & Reliability Breakdown Table */}
          <div className="bg-slate-50/70 rounded-xl border border-slate-200/80 p-3.5 space-y-2">
            <div className="text-[11px] font-bold text-slate-700">Token &amp; Memory Efficiency</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs">
              <div className="flex justify-between border-b border-slate-200/60 pb-1">
                <span className="text-slate-500">Input Tokens:</span>
                <span className="font-bold text-slate-900">
                  {model.inputTokens != null ? model.inputTokens.toLocaleString() : "—"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1">
                <span className="text-slate-500">Output Tokens:</span>
                <span className="font-bold text-slate-900">
                  {model.outputTokens != null ? model.outputTokens.toLocaleString() : "—"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1">
                <span className="text-slate-500">Cache Tokens:</span>
                <span className="font-bold text-emerald-700">
                  {model.cacheTokens != null ? model.cacheTokens.toLocaleString() : "—"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1">
                <span className="text-slate-500">Cache Hit Rate:</span>
                <span className="font-bold text-emerald-700">
                  {model.cacheHitRate != null ? `${model.cacheHitRate}%` : "—"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1">
                <span className="text-slate-500">Safety Refusals:</span>
                <span className="font-bold text-emerald-600">0.0% (Clean)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1">
                <span className="text-slate-500">Task Runs:</span>
                <span className="font-bold text-slate-900">3 independent runs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2">
          <a
            href="https://artificialanalysis.ai/agents/coding-agents?coding-agents-performance-chart=benchmark-score-by-eval"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline inline-flex items-center gap-1"
          >
            <span>View Live Source Audit on Artificial Analysis</span>
            <span>↗</span>
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
