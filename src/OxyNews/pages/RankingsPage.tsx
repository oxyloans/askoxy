import React from "react";
import { Link } from "react-router-dom";
import ModelRankings from "../components/ModelRankings";

export default function RankingsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-12 pt-4">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-ink-faint mb-6">
        <Link to="/oxynews" className="text-royal hover:underline">
          ← Home
        </Link>
        <span>/</span>
        <span>AI</span>
        <span>/</span>
        <span className="text-ink">Model Leaderboard</span>
      </div>

      <ModelRankings showHeader={true} />
    </div>
  );
}
