import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export type PlanUseCaseLink = {
  day: number;
  useCaseId: string;
  title: string;
  module: "lo-system" | "fm-system" | "cm-system";
};

export const PLAN_CONTEXT_KEY = "ninetyDayPlanUseCases";
export const PLAN_DAY_KEY = "ninetyDayPlanSelectedDay";
export const PLAN_VIEW_KEY = "ninetyDayPlanViewType";

export default function NinetyDayUseCaseNavigation({
  useCaseId,
  viewType,
}: {
  useCaseId?: string;
  viewType: string;
}) {
  const navigate = useNavigate();
  const links = useMemo<PlanUseCaseLink[]>(() => {
    try {
      const parsed = JSON.parse(sessionStorage.getItem(PLAN_CONTEXT_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);
  const index = links.findIndex((item) => item.useCaseId === useCaseId);
  const mode = viewType === "system" ? "system" : "business";

  const open = (item: PlanUseCaseLink) => {
    sessionStorage.setItem(PLAN_DAY_KEY, String(item.day));
    sessionStorage.setItem(PLAN_VIEW_KEY, mode);
    navigate(`/${item.module}/${item.useCaseId}/${mode}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const switchMode = (nextMode: "business" | "system") => {
    if (index < 0) return;
    sessionStorage.setItem(PLAN_VIEW_KEY, nextMode);
    navigate(`/${links[index].module}/${links[index].useCaseId}/${nextMode}`);
  };

  return (
    <nav className="sticky top-16 z-30  bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md md:top-20" aria-label="90-day plan use-case navigation">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1" aria-label="Select view type">
          <button onClick={() => switchMode("business")} aria-pressed={mode === "business"} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${mode === "business" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>Business</button>
          <button onClick={() => switchMode("system")} aria-pressed={mode === "system"} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${mode === "system" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>System</button>
        </div>
        {index >= 0 && <span className="text-sm font-semibold text-slate-600">Day {links[index].day} of 51</span>}
        <div className="flex gap-2">
          <button disabled={index <= 0} onClick={() => open(links[index - 1])} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
          <button disabled={index < 0 || index >= links.length - 1} onClick={() => open(links[index + 1])} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Next use case →</button>
        </div>
      </div>
    </nav>
  );
}
