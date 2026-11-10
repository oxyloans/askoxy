import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  NINE_DAYS_USE_CASES,
  NineDaysUseCaseItem,
  getUseCaseCode,
} from "./nineDaysUseCasesData";
import { stopTokenRefresh } from "../utils/tokenRefresh";

const NINE_DAYS_LOGO = "https://i.ibb.co/39rQT8TW/9-Days-Job-Program-Logo-1.png";
const STORAGE_UNLOCKED_DAY = "nine_days_workflow_unlocked_day";
const STORAGE_COMPLETED_UCS_PREFIX = "nine_days_workflow_completed_day_";

export interface DayMetaInfo {
  day: number;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  useCaseCount: number;
}

// Exactly matching user's requested 1-51 use cases structure across Days 1 to 8 + Day 9 Capstone
export const DAY_METADATA: DayMetaInfo[] = [
  {
    day: 1,
    title: "Customer Onboarding & Loan Origination",
    subtitle: "7 Core Banking Workflows: Customer ID Creation, KYC Linking, Credit Scoring & Sanctioning (UC #1–7)",
    category: "LOS Origination",
    badge: "LOS",
    useCaseCount: 7,
  },
  {
    day: 2,
    title: "Sanctions, Repayment Schedules & Collateral",
    subtitle: "7 Core Banking Workflows: Sanction Disbursement, EMI Schedules, Collateral Assets & Net Worth (UC #8–14)",
    category: "LOS Servicing",
    badge: "LOS",
    useCaseCount: 7,
  },
  {
    day: 3,
    title: "PDC Processing, NPA Grading & Settlements",
    subtitle: "7 Core Banking Workflows: PDC Printing, Prepayments, NPA Classification & Cheque Processing (UC #15–21)",
    category: "FMS Operations",
    badge: "FMS",
    useCaseCount: 7,
  },
  {
    day: 4,
    title: "Foreclosure, Finance Viewer & Settlement Advisory",
    subtitle: "6 Core Banking Workflows: Loan Termination, Finance Metrics, Floating Review & Waive-Offs (UC #22–27)",
    category: "FMS Settlements",
    badge: "FMS",
    useCaseCount: 6,
  },
  {
    day: 5,
    title: "EOD/BOD, Account Closure & Rescheduling",
    subtitle: "6 Core Banking Workflows: EOD/BOD Operations, Account Closures, Document Master & Due Date Changes (UC #28–33)",
    category: "FMS Rescheduling",
    badge: "FMS",
    useCaseCount: 6,
  },
  {
    day: 6,
    title: "Profit Rate, Tenure & Repayment Deferrals",
    subtitle: "6 Core Banking Workflows: Profit Rate Adjustments, Tenure Modifications & Repayment Deferrals (UC #34–39)",
    category: "FMS Deferrals",
    badge: "FMS",
    useCaseCount: 6,
  },
  {
    day: 7,
    title: "Delinquent Case Allocation & Queue Definition",
    subtitle: "6 Core Banking Workflows: Allocation Contracts, Delinquent Hold, Reallocation & Queue Setup (UC #40–45)",
    category: "CMS Collections",
    badge: "CMS",
    useCaseCount: 6,
  },
  {
    day: 8,
    title: "Contact Recording, Legal Collections & Recovery",
    subtitle: "6 Core Banking Workflows: Contact Records, Legal Proceedings, Queue Curing & Collector Plans (UC #46–51)",
    category: "CMS Recovery",
    badge: "CMS",
    useCaseCount: 6,
  },
  {
    day: 9,
    title: "Full Banking AI Integration, Assessment & Certification",
    subtitle: "Complete 51 Use-Case Banking Project Build with AI Tools, Cloud Deployment & Final Assessment",
    category: "Final Capstone",
    badge: "Capstone",
    useCaseCount: 0,
  },
];

export default function NineDaysDayWorkflow() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active day from URL (?day=X) or default 1 (supports 1 to 9)
  const initialDayFromUrl = parseInt(searchParams.get("day") || "1", 10);
  const [activeDay, setActiveDay] = useState<number>(
    initialDayFromUrl >= 1 && initialDayFromUrl <= 9 ? initialDayFromUrl : 1
  );

  // Highest unlocked day (persisted in localStorage, defaults to 1)
  const [unlockedDay, setUnlockedDay] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_UNLOCKED_DAY);
    const parsed = saved ? parseInt(saved, 10) : 1;
    return parsed >= 1 && parsed <= 9 ? parsed : 1;
  });

  // Track completed use cases for each day (stored as array of strings like "UC-01", "UC-02", etc.)
  const [completedMap, setCompletedMap] = useState<Record<number, string[]>>(() => {
    const map: Record<number, string[]> = {};
    for (let d = 1; d <= 9; d++) {
      try {
        const raw = localStorage.getItem(`${STORAGE_COMPLETED_UCS_PREFIX}${d}`);
        map[d] = raw ? JSON.parse(raw) : [];
      } catch {
        map[d] = [];
      }
    }
    return map;
  });

  // Currently expanded/opened use case
  const [expandedUseCaseId, setExpandedUseCaseId] = useState<number | null>(null);

  // Active sub-tab inside the opened use case ("understand" | "generate" | "run" | "deploy" | "publish")
  const [activeStageTab, setActiveStageTab] = useState<
    "understand" | "generate" | "run" | "deploy" | "publish"
  >("understand");

  // Copy notification state
  const [copiedPromptId, setCopiedPromptId] = useState<number | null>(null);

  // Filter use cases for active day
  const dayUseCases = useMemo(() => {
    return NINE_DAYS_USE_CASES.filter((uc) => uc.day === activeDay);
  }, [activeDay]);

  const activeDayCompleted = completedMap[activeDay] || [];
  const isAllDayUseCasesCompleted =
    dayUseCases.length > 0 &&
    dayUseCases.every((uc) => activeDayCompleted.includes(getUseCaseCode(uc.id - 1)));

  // Auto-expand first use case when switching days
  useEffect(() => {
    if (dayUseCases.length > 0) {
      setExpandedUseCaseId(dayUseCases[0].id);
      setActiveStageTab("understand");
    } else {
      setExpandedUseCaseId(null);
    }
  }, [activeDay, dayUseCases]);

  // Sync activeDay with URL
  useEffect(() => {
    setSearchParams({ day: String(activeDay) }, { replace: true });
  }, [activeDay, setSearchParams]);

  const handleSelectDay = (day: number) => {
    if (day <= unlockedDay) {
      setActiveDay(day);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleToggleCompleteUseCase = (uc: NineDaysUseCaseItem, code: string) => {
    setCompletedMap((prev) => {
      const currentList = prev[activeDay] || [];
      const updatedList = currentList.includes(code)
        ? currentList.filter((c) => c !== code)
        : [...currentList, code];

      const newMap = { ...prev, [activeDay]: updatedList };
      localStorage.setItem(
        `${STORAGE_COMPLETED_UCS_PREFIX}${activeDay}`,
        JSON.stringify(updatedList)
      );

      // If all use cases of activeDay are completed, automatically unlock next day
      if (
        dayUseCases.length > 0 &&
        dayUseCases.every((u) => updatedList.includes(getUseCaseCode(u.id - 1)))
      ) {
        const nextDay = Math.min(activeDay + 1, 9);
        if (nextDay > unlockedDay) {
          setUnlockedDay(nextDay);
          localStorage.setItem(STORAGE_UNLOCKED_DAY, String(nextDay));
        }
      }

      return newMap;
    });
  };

  const handleStartNextDay = () => {
    const nextDay = activeDay + 1;
    if (nextDay <= 9) {
      if (nextDay > unlockedDay) {
        setUnlockedDay(nextDay);
        localStorage.setItem(STORAGE_UNLOCKED_DAY, String(nextDay));
      }
      setActiveDay(nextDay);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCopyPrompt = (uc: NineDaysUseCaseItem) => {
    const promptText = `Generate production-ready full-stack code for BFSI Banking Use Case: "${uc.title}" (${uc.description}).
Requirements:
1. React 18 frontend component with responsive form, Tailwind CSS, validation, and loading states.
2. Spring Boot 3 REST API Controller, Service, and Repository with transaction management and audit logs.
3. PostgreSQL DDL schema with primary key, timestamps, foreign keys, and status constraints.
4. Clean folder architecture and Postman API test requests.`;

    navigator.clipboard.writeText(promptText);
    setCopiedPromptId(uc.id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const handleShareLinkedIn = (uc: NineDaysUseCaseItem) => {
    const text = encodeURIComponent(
      `Excited to share my progress in the 9-Days Job Program! Just built and verified Use Case ${getUseCaseCode(
        uc.id - 1
      )}: "${uc.title}" (${uc.description}).\n\nFull-Stack implementation with React, Spring Boot, and PostgreSQL.\n\n#83GLAI #FullStack #Fintech #BFSI #ASKOXY_AI`
    );
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleLogout = () => {
    try {
      stopTokenRefresh();
    } catch {
      // ignore
    }
    localStorage.clear();
    sessionStorage.clear();
    navigate("/ninedaysjobprogramplan");
  };

  const currentMeta = DAY_METADATA[activeDay - 1] || DAY_METADATA[0];

  // Total completed across all 8 days
  const totalCompletedCount = useMemo(() => {
    let count = 0;
    for (let d = 1; d <= 8; d++) {
      count += (completedMap[d] || []).length;
    }
    return count;
  }, [completedMap]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & BRANDING                                                 */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-xs backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/ninedaysjobprogramplan")}
              className="flex items-center gap-2 focus:outline-none transition opacity-95 hover:opacity-100"
              title="Return to 9-Days Job Program overview"
            >
              <img
                src={NINE_DAYS_LOGO}
                alt="9-Days Job Program Logo"
                className="h-9 w-auto max-w-[160px] object-contain sm:h-10"
              />
            </button>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-black text-[#068855]">
              Day {activeDay} of 9: {currentMeta.category}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden md:inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600">
              Total Progress: <strong className="text-emerald-700 font-extrabold">{totalCompletedCount} / 51 Use Cases</strong>
            </span>
            <button
              type="button"
              onClick={() => navigate("/ninedaysinside")}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 transition"
            >
              ← Prerequisites
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-600 shadow-xs transition hover:border-red-300 hover:bg-red-100 hover:text-red-700"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. DAY SELECTOR TABS (Days 1 to 8 + Day 9 Capstone)                       */}
      {/* ========================================================================= */}
      <section className="border-b border-slate-200 bg-white py-3 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {DAY_METADATA.map((dm) => {
              const isSelected = activeDay === dm.day;
              const isLocked = dm.day > unlockedDay;
              const completedCount = (completedMap[dm.day] || []).length;
              const totalInDay = dm.useCaseCount;
              const isDayFinished = totalInDay > 0 && completedCount >= totalInDay;

              return (
                <button
                  key={dm.day}
                  type="button"
                  disabled={isLocked}
                  onClick={() => handleSelectDay(dm.day)}
                  className={`flex shrink-0 items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-black transition-all ${
                    isSelected
                      ? "bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/20"
                      : isLocked
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                      : isDayFinished
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                      isSelected
                        ? "bg-white text-emerald-800"
                        : isDayFinished
                        ? "bg-emerald-600 text-white"
                        : isLocked
                        ? "bg-slate-300 text-slate-600"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {isDayFinished ? "✓" : dm.day}
                  </span>
                  <span>Day {dm.day}</span>
                  {isLocked && <span className="text-[10px]">🔒</span>}
                  {totalInDay > 0 && !isLocked && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        isSelected ? "bg-emerald-800 text-emerald-100" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {completedCount}/{totalInDay}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. HERO FOR ACTIVE DAY                                                   */}
      {/* ========================================================================= */}
      <section className="border-b border-emerald-100/80 bg-gradient-to-b from-[#eaf6ef] via-[#f7fbf8] to-[#f8fafc] py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-700 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white">
                  Day {activeDay} Curriculum
                </span>
                <span className="rounded-full border border-emerald-300 bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#068855]">
                  {currentMeta.badge} Module
                </span>
                <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-[11px] font-extrabold text-emerald-800">
                  {currentMeta.useCaseCount > 0 ? `${currentMeta.useCaseCount} Use Cases` : "Final Capstone"}
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-black text-[#143d2c] sm:text-3xl">
                Day {activeDay}: {currentMeta.title}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium max-w-3xl">
                {currentMeta.subtitle}
              </p>
            </div>

            {/* Day Progress Meter (Days 1 - 8) */}
            {activeDay <= 8 && (
              <div className="w-full sm:w-72 rounded-2xl border border-emerald-200 bg-white p-4 shadow-xs shrink-0">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Day {activeDay}: {activeDayCompleted.length} of {dayUseCases.length} Done</span>
                  <span className="text-emerald-700 font-black">
                    {dayUseCases.length > 0
                      ? Math.round((activeDayCompleted.length / dayUseCases.length) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#00b96e] transition-all duration-300"
                    style={{
                      width: `${
                        dayUseCases.length > 0
                          ? (activeDayCompleted.length / dayUseCases.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>

                {isAllDayUseCasesCompleted && (
                  <button
                    type="button"
                    onClick={handleStartNextDay}
                    className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#00a65d] px-3.5 py-2 text-xs font-black text-white shadow-sm hover:from-emerald-700 hover:to-emerald-600 transition"
                  >
                    <span>
                      {activeDay < 8 ? `Start Day ${activeDay + 1} →` : "Proceed to Day 9 Capstone →"}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DAYS 1 TO 8: USE CASE WORKFLOW ACCORDION                              */}
      {/* ========================================================================= */}
      {activeDay <= 8 ? (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#068855]">
                Scheduled Banking Workflows
              </span>
              <h2 className="text-lg font-black text-[#143d2c] sm:text-xl">
                Select a Use Case to Open and Execute the 5 Action Stages
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {dayUseCases.length} Use Cases Today
            </span>
          </div>

          {/* Use Case Accordion List */}
          <div className="space-y-4">
            {dayUseCases.map((uc, index) => {
              const ucCode = getUseCaseCode(uc.id - 1);
              const isCompleted = activeDayCompleted.includes(ucCode);
              const isExpanded = expandedUseCaseId === uc.id;

              return (
                <div
                  key={uc.path}
                  className={`rounded-3xl border-2 transition-all ${
                    isExpanded
                      ? "border-emerald-400 bg-white shadow-md ring-2 ring-emerald-500/10"
                      : isCompleted
                      ? "border-emerald-200 bg-white hover:border-emerald-300"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {/* Header Row */}
                  <div
                    onClick={() => setExpandedUseCaseId(isExpanded ? null : uc.id)}
                    className="flex cursor-pointer items-center justify-between gap-4 p-5 sm:p-6"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                          isCompleted
                            ? "bg-emerald-600 text-white"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isCompleted ? "✓" : index + 1}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-emerald-700">
                            {ucCode}
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            (#{uc.id} of 51)
                          </span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.2 text-[10px] font-black uppercase text-slate-600">
                            {uc.moduleLabel}
                          </span>
                          {isCompleted && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-black uppercase text-emerald-800 border border-emerald-200">
                              Completed
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 truncate sm:text-lg mt-0.5">
                          {uc.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1 font-medium mt-0.5">
                          {uc.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCompleteUseCase(uc, ucCode);
                        }}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {isCompleted ? "✓ Done" : "Mark Done"}
                      </button>
                      <span className="text-slate-400 text-base font-bold">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>

                  {/* Expanded View with 5 Action Stages */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 p-5 sm:p-7 bg-[#fbfdfc] rounded-b-3xl space-y-6">
                      {/* Stage Selector Tabs */}
                      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                        {[
                          { key: "understand", label: "1. Understand Use Case", icon: "📖" },
                          { key: "generate", label: "2. Generate Code", icon: "🤖" },
                          { key: "run", label: "3. Run Code", icon: "▶️" },
                          { key: "deploy", label: "4. Deployment", icon: "🚀" },
                          { key: "publish", label: "5. Publish Linked #83GLAI", icon: "📢" },
                        ].map((stage) => {
                          const isTabActive = activeStageTab === stage.key;
                          return (
                            <button
                              key={stage.key}
                              type="button"
                              onClick={() => setActiveStageTab(stage.key as any)}
                              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition ${
                                isTabActive
                                  ? "bg-emerald-700 text-white shadow-xs"
                                  : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-800"
                              }`}
                            >
                              <span>{stage.icon}</span>
                              <span>{stage.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* STAGE 1: UNDERSTAND USE CASE */}
                      {activeStageTab === "understand" && (
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                            <h4 className="text-sm font-black text-slate-900 sm:text-base">
                              Business Overview &amp; Requirements
                            </h4>
                            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                              {uc.description}. In a banking environment, this workflow handles critical KYC, audit controls, validation against core banking systems (CBS), and status transition checks.
                            </p>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
                              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                                <span className="font-bold text-slate-800 block">Banking Rules:</span>
                                <span className="text-slate-600 mt-1 block">
                                  Strict field validation, PAN/Aadhaar deduplication checks, and maker-checker approval audit logs.
                                </span>
                              </div>
                              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                                <span className="font-bold text-slate-800 block">Core CBS Integration:</span>
                                <span className="text-slate-600 mt-1 block">
                                  Emits transactional events, updates customer loan master tables, and generates audit sequence ID.
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => navigate(`/${uc.module}/${uc.path}/business`)}
                              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                            >
                              <span>💼 Launch Business View ↗</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/${uc.module}/${uc.path}/system`)}
                              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
                            >
                              <span>⚙️ Launch System View ↗</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STAGE 2: GENERATE CODE */}
                      {activeStageTab === "generate" && (
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black text-slate-900 sm:text-base">
                                AI Prompt for Full-Stack Implementation
                              </h4>
                              <button
                                type="button"
                                onClick={() => handleCopyPrompt(uc)}
                                className="rounded-lg bg-emerald-50 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
                              >
                                {copiedPromptId === uc.id ? "✓ Copied!" : "Copy Prompt"}
                              </button>
                            </div>

                            <p className="mt-1 text-xs text-slate-500 font-medium">
                              Copy this prompt directly into Gemini, ChatGPT, or Claude to generate production-ready code.
                            </p>

                            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-emerald-300 leading-relaxed select-all">
                              Generate production-ready full-stack code for BFSI Use Case: &quot;{uc.title}&quot; ({uc.description}).<br />
                              Requirements:<br />
                              1. React 18 frontend component with responsive form, Tailwind CSS, validation, and loading states.<br />
                              2. Spring Boot 3 REST API Controller, Service, and Repository with transaction management and error handling.<br />
                              3. PostgreSQL DDL schema with primary key, timestamps, constraints, and audit columns.<br />
                              4. Clean folder structure and Postman test curl requests.
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STAGE 3: RUN CODE */}
                      {activeStageTab === "run" && (
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                            <h4 className="text-sm font-black text-slate-900 sm:text-base">
                              Run &amp; Test Locally
                            </h4>

                            <div className="space-y-2 text-xs">
                              <span className="font-bold text-slate-700 block">1. Start Spring Boot Backend:</span>
                              <code className="block rounded-lg bg-slate-100 border border-slate-200 p-2 font-mono text-slate-800">
                                ./mvnw spring-boot:run
                              </code>

                              <span className="font-bold text-slate-700 block mt-2">2. Start React Frontend:</span>
                              <code className="block rounded-lg bg-slate-100 border border-slate-200 p-2 font-mono text-slate-800">
                                npm run dev
                              </code>

                              <span className="font-bold text-slate-700 block mt-2">3. Test in Postman:</span>
                              <p className="text-slate-600 font-medium">
                                Send a POST request to <code className="bg-slate-100 px-1 py-0.5 rounded">http://localhost:8080/api/v1/{uc.path}</code> with sample JSON payload and verify HTTP 200 OK response.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => navigate(`/${uc.module}/${uc.path}/system`)}
                              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                            >
                              <span>Open System Test Interface ↗</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STAGE 4: DEPLOYMENT */}
                      {activeStageTab === "deploy" && (
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 text-xs sm:text-sm">
                            <h4 className="text-sm font-black text-slate-900 sm:text-base">
                              Production Deployment Steps
                            </h4>

                            <div className="space-y-2.5 text-slate-600 font-medium">
                              <div className="flex items-start gap-2">
                                <span className="font-bold text-emerald-700">1.</span>
                                <span><strong>Frontend:</strong> Commit to GitHub repository and trigger continuous deployment via Vercel.</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="font-bold text-emerald-700">2.</span>
                                <span><strong>Backend:</strong> Deploy Docker container or JAR to Render, Railway, or AWS EC2 with environment secrets.</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="font-bold text-emerald-700">3.</span>
                                <span><strong>Mobile App:</strong> Run Expo EAS build <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">eas build -p android</code> or Capacitor build for native APK.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STAGE 5: PUBLISH LINKED #83GLAI COMPANIES */}
                      {activeStageTab === "publish" && (
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-xs space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black text-slate-900 sm:text-base">
                                Publish &amp; Link #83GLAI Hiring Partner Companies
                              </h4>
                              <span className="rounded-full bg-blue-100 border border-blue-200 px-2.5 py-0.5 text-[11px] font-black text-blue-800">
                                #83GLAI Official
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                              Share your verified use case implementation, architecture diagram, and GitHub commit on LinkedIn with the official hashtag <strong className="text-blue-800">#83GLAI</strong>. Recruiters and engineering leaders from 83+ partner companies actively monitor this hashtag to hire top performers.
                            </p>

                            <div className="rounded-xl border border-blue-200 bg-white p-4 font-mono text-xs text-slate-800 leading-relaxed select-all">
                              🚀 Just completed BFSI Use Case {ucCode}: &quot;{uc.title}&quot; in the #83GLAI 9-Days Job Program!<br /><br />
                              💡 Tech Stack: React 18, Spring Boot 3, PostgreSQL, Tailwind CSS.<br />
                              🔗 Built full maker-checker approval workflows, REST APIs, and database migrations.<br /><br />
                              #83GLAI #FullStack #Fintech #SoftwareEngineering #ASKOXY_AI
                            </div>

                            <button
                              type="button"
                              onClick={() => handleShareLinkedIn(uc)}
                              className="inline-flex items-center gap-2 rounded-xl bg-[#0a66c2] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#084e96] transition"
                            >
                              <span>Share on LinkedIn with #83GLAI ↗</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Bottom Done Checkbox */}
                      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => handleToggleCompleteUseCase(uc, ucCode)}
                            className="h-5 w-5 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-slate-800">
                            {isCompleted
                              ? "Completed (All 5 stages verified)"
                              : "Mark this use case completed"}
                          </span>
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            if (!isCompleted) handleToggleCompleteUseCase(uc, ucCode);
                            // Open next use case in active day if available
                            if (index + 1 < dayUseCases.length) {
                              setExpandedUseCaseId(dayUseCases[index + 1].id);
                              setActiveStageTab("understand");
                            }
                          }}
                          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
                        >
                          {index + 1 < dayUseCases.length ? "Save & Next Use Case →" : "Save Use Case"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Day Completed Next Action Card */}
          {isAllDayUseCasesCompleted && (
            <div className="rounded-3xl border-2 border-emerald-400 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 p-6 sm:p-8 shadow-md">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white">
                    ✓ Day {activeDay} Finished ({dayUseCases.length}/{dayUseCases.length} Use Cases)
                  </span>
                  <h3 className="mt-2 text-xl font-black text-[#143d2c] sm:text-2xl">
                    {activeDay < 8
                      ? `Great job! You completed all use cases for Day ${activeDay}.`
                      : "Congratulations! You completed all 51 BFSI Banking Use Cases!"}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">
                    {activeDay < 8
                      ? `Click Start Day ${activeDay + 1} to unlock the next set of banking workflows.`
                      : "You are now ready to assemble the full capstone AI banking project on Day 9!"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleStartNextDay}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-[#00a65d] px-7 py-3 text-sm font-black text-white shadow-md hover:from-emerald-700 hover:to-emerald-600 transition"
                >
                  <span>
                    {activeDay < 8 ? `Start Day ${activeDay + 1} →` : "Proceed to Day 9 Capstone →"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </main>
      ) : (
        /* ========================================================================= */
        /* DAY 9: FINAL CAPSTONE, AI BANKING PROJECT BUILD & CERTIFICATION           */
        /* ========================================================================= */
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          <div className="rounded-3xl border-2 border-emerald-400 bg-white p-6 sm:p-8 shadow-md space-y-6">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                Day 9 Final Capstone
              </span>
              <h2 className="mt-2 text-2xl font-black text-[#143d2c] sm:text-3xl">
                Build Complete 51 Use-Case Banking Application &amp; Certification
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium max-w-3xl">
                You have systematically understood, generated code for, tested, and published all 51 core banking workflows across LOS, FMS, and CMS. Assemble your unified production repository and submit for certification.
              </p>
            </div>

            {/* Architecture Overview */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <span className="text-xs font-bold text-emerald-700 block uppercase tracking-wider">
                  LOS (Days 1 &amp; 2)
                </span>
                <h4 className="text-base font-black text-slate-900 mt-1">14 Origination Use Cases</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Customer ID, KYC, appraisal, sanctions, repayment schedules, and credit check.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <span className="text-xs font-bold text-amber-700 block uppercase tracking-wider">
                  FMS (Days 3, 4, 5, 6)
                </span>
                <h4 className="text-base font-black text-slate-900 mt-1">25 Servicing &amp; Ops Use Cases</h4>
                <p className="text-xs text-slate-600 mt-1">
                  PDC printing, NPA grading/provisioning, knock-offs, settlements, EOD/BOD, and deferrals.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <span className="text-xs font-bold text-purple-700 block uppercase tracking-wider">
                  CMS (Days 7 &amp; 8)
                </span>
                <h4 className="text-base font-black text-slate-900 mt-1">12 Delinquency Use Cases</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Delinquent case allocation, queue management, contact records, and legal recovery.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition"
              >
                <span>Push Full Project to GitHub ↗</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  const text = encodeURIComponent(
                    "🎓 Proud to complete all 51 BFSI Banking Use Cases in the 9-Days Job Program! Built full-stack architecture across LOS, FMS, and CMS using React, Spring Boot, and PostgreSQL.\n\n#83GLAI #FullStackEngineer #Fintech #ASKOXY_AI"
                  );
                  window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}`, "_blank");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0a66c2] px-5 py-3 text-xs font-bold text-white hover:bg-[#084e96] transition"
              >
                <span>Share Capstone Completion on LinkedIn #83GLAI ↗</span>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
          <p className="text-xs text-slate-500 font-medium">
            © 2026 ASKOXY.AI · #83GLAI 9-Days Job Program. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs font-bold text-[#068855]">
            <button
              onClick={() => navigate("/ninedaysjobprogramplan")}
              className="hover:underline"
            >
              Curriculum Overview
            </button>
            <a
              href="https://www.askoxy.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              ASKOXY.AI
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
