// src/pages/ResourcePage.tsx
import { Link, useParams } from "react-router-dom";
import { findResource } from "../data/resourceLinks";
import ExternalNewsList from "../components/ExternalNewsList";
import HuggingFaceNewsList from "../components/HuggingFaceNewsList";
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
  const isOpenAI = resourceId === "openai";
  const isHuggingFace = resourceId === "huggingface";

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
          {isOpenAI && (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[#10a37f]">
              <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.5045 4.5045 0 0 1-4.4945 4.4947zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7866A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829l2.0201-1.1683a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4021-.6815zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.009 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.5802 4.8257zM12 10.5197l2.848 1.6464v3.2928L12 17.1053l-2.848-1.6464v-3.2928L12 10.5197z" />
            </svg>
          )}
          {link.name}
        </h1>
        {isLLM && <span className="text-sm text-slate-500 font-medium">by Weekly LLM Usage</span>}
        {isOpenAI && <span className="text-sm text-slate-500 font-medium">Official Updates & Announcements</span>}
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

      {/* ── Hugging Face news ── */}
      {isHuggingFace && <HuggingFaceNewsList />}

      {/* ── news feed (other resources) ── */}
      {link.newsSource && <ExternalNewsList sourceName={link.newsSource} />}
    </div>
  );
}