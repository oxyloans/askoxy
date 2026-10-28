// src/pages/ResourcePage.tsx
import { Link, useParams } from "react-router-dom";
import { findResource } from "../data/resourceLinks";
import ExternalNewsList from "../components/ExternalNewsList";
import TopModelsChart from "../components/TopModelsChart";
import TopModelsByTask from "../components/TopModelsByTask";
import ModelRankings from "../components/ModelRankings";
import CodingAgentsLeaderboard from "../components/CodingAgentsLeaderboard";
import TvrkBanner from "../components/TvrkBanner";

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
  const isLeaderboard = resourceId === "llm-leaderboard";
  const isGoogleAI = resourceId === "google-ai" || resourceId === "coding-agents";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-12">

      {/* ── breadcrumb ── */}
      <nav className="flex items-center gap-1 text-sm text-slate-500 mb-4 flex-wrap">
        <Link to="/oxynews" className="hover:text-royal">← Home</Link>
        <span>/</span>
        <span>{category.label}</span>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{link.name}</span>
      </nav>

      {/* ── title ── */}
      <div className="mb-6 flex items-center gap-4 flex-wrap">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
          {isLLM && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          )}
          {isLeaderboard && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-2.34" />
              <path d="M18 14.66V17c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-2.34" />
              <path d="M14 12V6a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v6" />
            </svg>
          )}
          {isTask && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          )}
          {isGoogleAI && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          )}
          {link.name}
        </h1>
        {isLLM && <span className="text-sm text-slate-500 font-medium">by Weekly LLM Usage</span>}
        {(isLLM || isTask || isLeaderboard || isGoogleAI) && <TvrkBanner className="shrink-0" />}
      </div>

      {/* ── LLM chart ── */}
      {isLLM && <TopModelsChart />}

      {/* ── Model Leaderboard ── */}
      {isLeaderboard && <ModelRankings showHeader={false} />}

      {/* ── Task treemap + breakdown ── */}
      {isTask && <TopModelsByTask />}

      {/* ── Google AI Coding Agents Leaderboard ── */}
      {isGoogleAI && <CodingAgentsLeaderboard />}

      {/* ── news feed (other resources) ── */}
      {link.newsSource && <ExternalNewsList sourceName={link.newsSource} />}
    </div>
  );
}