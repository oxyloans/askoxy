import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export type NineDaysUseCaseLink = {
  day: number;
  useCaseId: string;
  title: string;
  module: "lo-system-9days" | "fm-system-9days" | "cm-system-9days";
};

export const NINE_DAYS_CONTEXT_KEY = "nineDaysPlanUseCases";
export const NINE_DAYS_DAY_KEY = "nineDaysSelectedDay";
export const NINE_DAYS_VIEW_KEY = "nineDaysPlanViewType";

export default function NineDaysUseCaseNavigation({
  useCaseId,
  viewType,
}: {
  useCaseId?: string;
  viewType: string;
}) {
  const navigate = useNavigate();
  const links = useMemo<NineDaysUseCaseLink[]>(() => {
    try {
      const parsed = JSON.parse(
        sessionStorage.getItem(NINE_DAYS_CONTEXT_KEY) || "[]"
      );
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  const index = links.findIndex((item) => item.useCaseId === useCaseId);
  const mode = viewType === "system" ? "system" : "business";

  const open = (item: NineDaysUseCaseLink) => {
    sessionStorage.setItem(NINE_DAYS_DAY_KEY, String(item.day));
    sessionStorage.setItem(NINE_DAYS_VIEW_KEY, mode);
    navigate(`/${item.module}/${item.useCaseId}/${mode}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const switchMode = (nextMode: "business" | "system") => {
    if (index < 0) return;
    sessionStorage.setItem(NINE_DAYS_VIEW_KEY, nextMode);
    navigate(`/${links[index].module}/${links[index].useCaseId}/${nextMode}`);
  };

  const backToPlan = () => {
    const day = sessionStorage.getItem(NINE_DAYS_DAY_KEY) || "1";
    navigate(`/ninedaysinside?day=${day}&view=${mode}`);
  };

  return (
    <nav
      className="sticky top-16 z-30 border-b border-emerald-100 bg-white/95 py-3 shadow-sm backdrop-blur-md md:top-20"
      aria-label="9-day job program use-case navigation"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <button
            onClick={backToPlan}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 sm:text-sm"
          >
            ← 9-Days Portal
          </button>

          <div
            className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1"
            aria-label="Select view type"
          >
            <button
              onClick={() => switchMode("business")}
              aria-pressed={mode === "business"}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition sm:px-4 sm:py-2 sm:text-sm ${
                mode === "business"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Business View
            </button>
            <button
              onClick={() => switchMode("system")}
              aria-pressed={mode === "system"}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition sm:px-4 sm:py-2 sm:text-sm ${
                mode === "system"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              System View
            </button>
          </div>
        </div>

        {index >= 0 && (
          <span className="text-xs font-bold text-slate-700 sm:text-sm">
            <span className="text-emerald-600">Day {links[index].day}</span> • Use Case {index + 1} of {links.length || 51}
          </span>
        )}

        <div className="flex gap-2">
          <button
            disabled={index <= 0}
            onClick={() => open(links[index - 1])}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:py-2 sm:text-sm"
          >
            Previous
          </button>
          <button
            disabled={index < 0 || index >= links.length - 1}
            onClick={() => open(links[index + 1])}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:py-2 sm:text-sm"
          >
            Next Use Case →
          </button>
        </div>
      </div>
    </nav>
  );
}

