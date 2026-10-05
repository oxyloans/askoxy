// src/pages/ResourcePage.tsx
import { Link, useParams } from "react-router-dom";
import { findResource } from "../data/resourceLinks";
import ExternalNewsList from "../components/ExternalNewsList";
import TopModelsChart from "../components/TopModelsChart";
import TopModelsByTask from "../components/TopModelsByTask";

function hostnameOf(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return url; }
}

export default function ResourcePage() {
  const { categoryId, resourceId } = useParams<{ categoryId: string; resourceId: string }>();
  const { category, link } = findResource(categoryId ?? "", resourceId ?? "");

  if (!category || !link) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24">
        <p className="font-display text-xl text-plum mb-2">Resource not found</p>
        <Link to="/oxynews" className="text-royal underline text-sm">← Back to home</Link>
      </div>
    );
  }

  const isLLM = resourceId === "llm-rankings";
  const isTask = resourceId === "task-rankings";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-12">

      {/* ── back + breadcrumb ── */}
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink-faint mb-6">
        <Link to="/oxynews" className="text-royal hover:underline">← Home</Link>
        <span>/</span>
        <span>{category.label}</span>
        <span>/</span>
        <span className="text-ink">{link.name}</span>
      </div>

      {/* ── title ── */}
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
          {isLLM && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          )}
          {isTask && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          )}
          {link.name}
        </h1>
        {isLLM && <p className="text-sm text-slate-500 mt-1 font-medium">by Weekly LLM Usage</p>}
      </div>

      {/* ── LLM chart + TVRK banner ── */}
      {isLLM && (
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1 min-w-0">
            <TopModelsChart />
          </div>
          <a
            href="https://tvradhakrishna.com/"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex flex-col items-center rounded-xl overflow-hidden transition-all hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ede9fe 100%)", border: "1px solid #bae6fd", boxShadow: "0 2px 12px rgba(14,165,233,0.1)" }}
          >
            <div className="w-full flex items-center justify-center py-0.5 px-4" style={{ background: "linear-gradient(90deg, #0ea5e9, #6366f1, #a855f7)" }}>
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white">Sponsored by</span>
            </div>
            <div className="flex flex-col items-center px-4 py-2 gap-1">
              <div className="rounded-lg overflow-hidden bg-white" style={{ border: "1px solid #e0f2fe", padding: "3px 8px" }}>
                <img src="https://i.ibb.co/Rw9zb11/tvrklogo.png" alt="TVRADHAKRISHNA.COM" className="h-6 w-auto object-contain" />
              </div>
              <p className="text-xs font-black tracking-tight leading-snug text-center whitespace-nowrap" style={{ color: "#0f172a" }}>
                Every Journey.{" "}
                <span style={{ background: "linear-gradient(90deg, #0ea5e9, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>One Partner.</span>
              </p>
            </div>
          </a>
        </div>
      )}

      {/* ── Task treemap + breakdown ── */}
      {isTask && <TopModelsByTask />}

      {/* ── news feed (other resources) ── */}
      {link.newsSource && <ExternalNewsList sourceName={link.newsSource} />}
    </div>
  );
}
