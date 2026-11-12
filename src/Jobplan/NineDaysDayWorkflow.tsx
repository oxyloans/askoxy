import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../Config";
import {
  NINE_DAYS_USE_CASES,
  NineDaysUseCaseItem,
  getUseCaseCode,
  parseUseCaseNumbers,
} from "./nineDaysUseCasesData";
import { stopTokenRefresh } from "../utils/tokenRefresh";

const NINE_DAYS_LOGO = "https://i.ibb.co/39rQT8TW/9-Days-Job-Program-Logo-1.png";
const STORAGE_UNLOCKED_DAY = "nine_days_workflow_unlocked_day";
const STORAGE_COMPLETED_UCS_PREFIX = "nine_days_workflow_completed_day_";
const STORAGE_ENROLLMENT_ID = "job_program_enrollment_id";
const STORAGE_DAY_PROGRESS_ID = "job_program_day_progress_id";

// Primary and fallback backend endpoints for Job Program APIs
const JOB_PROGRAM_DIRECT_BASE =
  "http://65.0.147.157:9229/api/marketing-service/campgin/job-program";
const JOB_PROGRAM_FALLBACK_BASE =
  `${BASE_URL}/marketing-service/campgin/job-program`;

const getResolvedUserId = (): string => {
  return (
    localStorage.getItem("userId") ||
    localStorage.getItem("customerId") ||
    localStorage.getItem("user_id") ||
    sessionStorage.getItem("userId") ||
    sessionStorage.getItem("userid") ||
    "292b5593-d938-42c2-8daa-6494c4096cf1"
  );
};

async function callJobProgramApi<T>(
  endpoint: string,
  method: "GET" | "POST" = "GET",
  body?: any
): Promise<T | null> {
  const isHttps =
    typeof window !== "undefined" && window.location.protocol === "https:";
  const urls = isHttps
    ? [`${JOB_PROGRAM_FALLBACK_BASE}${endpoint}`, `${JOB_PROGRAM_DIRECT_BASE}${endpoint}`]
    : [`${JOB_PROGRAM_DIRECT_BASE}${endpoint}`, `${JOB_PROGRAM_FALLBACK_BASE}${endpoint}`];

  for (const url of urls) {
    try {
      const res =
        method === "POST"
          ? await axios.post<T>(url, body, {
              headers: { Accept: "application/json" },
              timeout: 10000,
            })
          : await axios.get<T>(url, {
              headers: { Accept: "application/json" },
              timeout: 10000,
            });
      if (res?.data) return res.data;
    } catch (err: any) {
      console.warn(`[JobProgram API] ${method} ${url} failed:`, err?.response?.data || err.message);
    }
  }
  return null;
}

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
    title: "Full Banking AI Integration, Assessment ",
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

  // Highest unlocked day (persisted in localStorage, strictly controlled by API)
  const [unlockedDay, setUnlockedDay] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_UNLOCKED_DAY);
    const parsed = saved ? parseInt(saved, 10) : 1;
    return parsed >= 1 && parsed <= 9 ? parsed : 1;
  });

  // Enrollment ID
  const [enrollmentId, setEnrollmentId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_ENROLLMENT_ID) || "";
  });

  // Day record IDs returned by start API or dashboard API (dayNumber -> id)
  const [dayRecordIds, setDayRecordIds] = useState<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    for (let d = 1; d <= 9; d++) {
      const rec = localStorage.getItem(`job_program_day_record_${d}`);
      if (rec) map[d] = rec;
    }
    return map;
  });

  // Day progress percentages from API (dayNumber -> progress number 0..100)
  const [dayProgress, setDayProgress] = useState<Record<number, number>>({});

  // Track completed use cases for each day (stored as array of strings like ["UC-01", "UC-02"])
  const [completedMap, setCompletedMap] = useState<Record<number, string[]>>(() => {
    const map: Record<number, string[]> = {};
    for (let d = 1; d <= 9; d++) {
      try {
        const raw =
          localStorage.getItem(`job_program_completed_ucs_day_${d}`) ||
          localStorage.getItem(`${STORAGE_COMPLETED_UCS_PREFIX}${d}`);
        map[d] = raw ? JSON.parse(raw) : [];
      } catch {
        map[d] = [];
      }
    }
    return map;
  });

  // Loading & notification states
  const [isLoadingDashboard, setIsLoadingDashboard] = useState<boolean>(true);
  const [isStartingDay, setIsStartingDay] = useState<boolean>(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Currently expanded/opened use case
  const [expandedUseCaseId, setExpandedUseCaseId] = useState<number | null>(null);

  // Active sub-tab inside the opened use case ("understand" | "generate" | "run" | "deploy" | "publish")
  const [activeStageTab, setActiveStageTab] = useState<
    "understand" | "generate" | "run" | "deploy" | "publish"
  >("understand");

  // Copy notification states
  const [copiedPromptId, setCopiedPromptId] = useState<number | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<number | null>(null);

  const activeDayRef = useRef(activeDay);
  activeDayRef.current = activeDay;

  // Filter use cases for active day
  const dayUseCases = useMemo(() => {
    return NINE_DAYS_USE_CASES.filter((uc) => uc.day === activeDay);
  }, [activeDay]);

  const activeDayCompleted = useMemo(
    () => completedMap[activeDay] || [],
    [completedMap, activeDay]
  );

  // Helper to check if a specific use case in the active day is completed
  const isUseCaseCompleted = useCallback(
    (indexInDay: number, globalUcId: number): boolean => {
      const perDayCode = getUseCaseCode(indexInDay);
      const globalCode = getUseCaseCode(globalUcId - 1);
      return (
        activeDayCompleted.includes(perDayCode) ||
        activeDayCompleted.includes(globalCode)
      );
    },
    [activeDayCompleted]
  );

  const isAllDayUseCasesCompleted = useMemo(() => {
    return (
      dayUseCases.length > 0 &&
      dayUseCases.every((uc, idx) => isUseCaseCompleted(idx, uc.id))
    );
  }, [dayUseCases, isUseCaseCompleted]);

  // 1. On Mount: Call Dashboard API to strictly sync unlocked days, enrollment, and completed use cases
  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      const resolvedUserId = getResolvedUserId();
      if (!resolvedUserId) {
        setIsLoadingDashboard(false);
        return;
      }

      setIsLoadingDashboard(true);
      try {
        const d: any = await callJobProgramApi(
          `/dashboard?userId=${encodeURIComponent(resolvedUserId)}`,
          "GET"
        );

        if (!isMounted || !d) return;

        if (d.status === "USER_NOT_FOUND") {
          console.warn("[JobProgram] User enrollment not found on backend.");
          return;
        }

        // Save enrollmentId if returned
        if (d.enrollmentId) {
          setEnrollmentId(d.enrollmentId);
          localStorage.setItem(STORAGE_ENROLLMENT_ID, d.enrollmentId);
        }

        // Strictly enforce API unlocked day: max(currentDay, daysCompleted + 1)
        // User requested: "akkada day enata ave unlock chey remain g unlock cheyakku this api handled day ok"
        const apiUnlockedDay = Math.max(
          d.currentDay || 1,
          (d.daysCompleted || 0) + 1,
          1
        );
        const safeUnlocked = Math.min(Math.max(apiUnlockedDay, 1), 9);
        setUnlockedDay(safeUnlocked);
        localStorage.setItem(STORAGE_UNLOCKED_DAY, String(safeUnlocked));

        // If active day exceeds unlocked day, adjust to unlocked day
        setActiveDay((prev) => (prev > safeUnlocked ? safeUnlocked : prev));

        // Parse days array returned from dashboard API
        if (Array.isArray(d.days)) {
          const recMap: Record<number, string> = {};
          const progMap: Record<number, number> = {};
          const compMap: Record<number, string[]> = {};

          d.days.forEach((dayItem: any) => {
            const dayNum = dayItem?.dayNumber;
            if (!dayNum) return;

            if (dayItem.id) {
              recMap[dayNum] = dayItem.id;
              localStorage.setItem(`job_program_day_record_${dayNum}`, dayItem.id);
            }
            if (typeof dayItem.progress === "number") {
              progMap[dayNum] = dayItem.progress;
            }

            // Extract useCaseNumbers (e.g. "UC-01,UC-02,UC-03")
            if (dayItem.useCaseNumbers) {
              const parsed = parseUseCaseNumbers(dayItem.useCaseNumbers);
              if (parsed.length > 0) {
                compMap[dayNum] = parsed;
                localStorage.setItem(
                  `${STORAGE_COMPLETED_UCS_PREFIX}${dayNum}`,
                  JSON.stringify(parsed)
                );
                localStorage.setItem(
                  `job_program_completed_ucs_day_${dayNum}`,
                  JSON.stringify(parsed)
                );
              }
            }
          });

          setDayRecordIds((prev) => ({ ...prev, ...recMap }));
          setDayProgress((prev) => ({ ...prev, ...progMap }));
          setCompletedMap((prev) => ({ ...prev, ...compMap }));

          // Save active day progress id if available
          const currentActiveDay = Math.min(activeDayRef.current, safeUnlocked);
          if (recMap[currentActiveDay]) {
            localStorage.setItem(STORAGE_DAY_PROGRESS_ID, recMap[currentActiveDay]);
          }
        }
      } catch (err) {
        console.warn("[JobProgram] Dashboard sync error:", err);
      } finally {
        if (isMounted) setIsLoadingDashboard(false);
      }
    };

    fetchDashboard();

    const handleFocus = () => {
      fetchDashboard();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // 2. Ensure Day Started: Call start API if day record is not yet created
  const ensureDayStarted = useCallback(
    async (dayNum: number, enrollIdToUse?: string): Promise<string | null> => {
      if (dayNum > 8) return null; // Day 9 is Capstone
      if (dayRecordIds[dayNum]) {
        localStorage.setItem(STORAGE_DAY_PROGRESS_ID, dayRecordIds[dayNum]);
        return dayRecordIds[dayNum];
      }

      const eId =
        enrollIdToUse ||
        enrollmentId ||
        localStorage.getItem(STORAGE_ENROLLMENT_ID) ||
        "";
      if (!eId) return null;

      setIsStartingDay(true);
      try {
        const startRes: any = await callJobProgramApi(
          `/start?dayNumber=${dayNum}&enrollmentId=${encodeURIComponent(eId)}`,
          "POST"
        );

        if (startRes) {
          if (startRes.status === "DAY_LOCKED") {
            setStatusNotice(
              startRes.message || `Day ${dayNum} is locked. Current day is ${startRes.currentDay || 1}.`
            );
            return null;
          }

          const dayRecId = startRes.id || startRes.data?.id;
          if (dayRecId) {
            setDayRecordIds((prev) => ({ ...prev, [dayNum]: dayRecId }));
            localStorage.setItem(`job_program_day_record_${dayNum}`, dayRecId);
            localStorage.setItem(STORAGE_DAY_PROGRESS_ID, dayRecId);

            if (startRes.data?.useCaseNumbers) {
              const parsed = parseUseCaseNumbers(startRes.data.useCaseNumbers);
              if (parsed.length > 0) {
                setCompletedMap((prev) => ({ ...prev, [dayNum]: parsed }));
                localStorage.setItem(
                  `${STORAGE_COMPLETED_UCS_PREFIX}${dayNum}`,
                  JSON.stringify(parsed)
                );
              }
            }
            if (typeof startRes.data?.progress === "number") {
              setDayProgress((prev) => ({
                ...prev,
                [dayNum]: startRes.data.progress,
              }));
            }
            return dayRecId;
          }
        }
      } catch (err) {
        console.warn(`[JobProgram] Failed to start Day ${dayNum}:`, err);
      } finally {
        setIsStartingDay(false);
      }
      return null;
    },
    [dayRecordIds, enrollmentId]
  );

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

  // When active day changes, ensure it is started on backend
  useEffect(() => {
    if (activeDay <= 8 && activeDay <= unlockedDay) {
      ensureDayStarted(activeDay);
    }
  }, [activeDay, unlockedDay, ensureDayStarted]);

  // Handle Day Selection Tab Click
  const handleSelectDay = async (day: number) => {
    if (day > unlockedDay) {
      setStatusNotice(
        `🔒 Day ${day} is currently locked. Complete the earlier banking use cases to unlock it.`
      );
      setTimeout(() => setStatusNotice(null), 4000);
      return;
    }
    setActiveDay(day);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (day <= 8) {
      await ensureDayStarted(day);
    }
  };

  const handleStartNextDay = async () => {
    const nextDay = activeDay + 1;
    if (nextDay <= 9) {
      if (nextDay > unlockedDay) {
        setUnlockedDay(nextDay);
        localStorage.setItem(STORAGE_UNLOCKED_DAY, String(nextDay));
      }
      setActiveDay(nextDay);
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (nextDay <= 8) {
        await ensureDayStarted(nextDay);
      }
    }
  };

  const handleOpenBusinessView = (uc: NineDaysUseCaseItem) => {
    sessionStorage.setItem("nineDaysSelectedDay", String(activeDay));
    sessionStorage.setItem("nineDaysPlanViewType", "business");
    sessionStorage.setItem(
      "nineDaysPlanUseCases",
      JSON.stringify(
        NINE_DAYS_USE_CASES.map((u) => ({
          day: u.day,
          useCaseId: u.path,
          title: u.title,
          module: u.module,
        }))
      )
    );
    navigate(`/${uc.module}/${uc.path}/business`);
  };

  const handleCopyPrompt = (uc: NineDaysUseCaseItem, ucCode: string) => {
    const promptText = `Generate production-ready full-stack code for BFSI Banking Use Case [${ucCode}]: "${uc.title}" (${uc.description}).

Architecture & Tech Stack Requirements:
1. React 18 Frontend Component:
   - Modern responsive UI with Tailwind CSS and accessible form controls.
   - Comprehensive client-side validations (PAN / Aadhaar / account number format checks).
   - Async loading states, clean error handling, and toast alerts.
2. Spring Boot 3 REST API Backend:
   - Standard MVC architecture: Controller (@RestController), Service (@Service), Repository (@Repository).
   - Transaction management (@Transactional) and Maker-Checker role-based approval check.
   - Global exception handling (@ControllerAdvice) returning standard ProblemDetail JSON.
3. PostgreSQL Database Schema:
   - DDL SQL script with UUID primary keys, foreign key constraints, and created_at/updated_at audit columns.
   - Indexes on frequently queried lookup keys (customer_id, loan_account_no).
4. Testing & Verification:
   - Provide Postman cURL command with realistic JSON payload and expected HTTP 200 response body.`;

    navigator.clipboard.writeText(promptText);
    setCopiedPromptId(uc.id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const handleCopyPostText = (uc: NineDaysUseCaseItem, ucCode: string) => {
    const postText = `🚀 Day ${activeDay} Milestone: Just built and verified BFSI Banking Use Case ${ucCode} - "${uc.title}" in the #83GLAI 9-Days Job Program!

💡 Core Banking Context: ${uc.description}.
🛠️ Tech Stack: React 18, Spring Boot 3, PostgreSQL, Tailwind CSS, REST APIs.
🔒 Verification: Complete audit logs, KYC/deduplication checks, and maker-checker validation.

Looking forward to completing the remaining use cases and Capstone build!

#83GLAI #FullStack #Fintech #CoreBanking #SoftwareEngineering #ASKOXY_AI`;

    navigator.clipboard.writeText(postText);
    setCopiedPostId(uc.id);
    setTimeout(() => setCopiedPostId(null), 2500);
  };

  const handleShareLinkedIn = (uc: NineDaysUseCaseItem, ucCode: string) => {
    const text = encodeURIComponent(
      `🚀 Day ${activeDay} Milestone: Just built and verified BFSI Banking Use Case ${ucCode} - "${uc.title}" in the #83GLAI 9-Days Job Program!\n\n💡 Core Banking Context: ${uc.description}.\n🛠️ Tech Stack: React 18, Spring Boot 3, PostgreSQL, Tailwind CSS.\n🔒 Verification: Complete audit logs and maker-checker workflows.\n\n#83GLAI #FullStack #Fintech #CoreBanking #SoftwareEngineering #ASKOXY_AI`
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

  // Active day's progress: prefer backend progress percentage if recorded, else calculate
  const activeDayProgressPercent = useMemo(() => {
    if (typeof dayProgress[activeDay] === "number" && dayProgress[activeDay] > 0) {
      return Math.min(dayProgress[activeDay], 100);
    }
    if (dayUseCases.length === 0) return 0;
    return Math.min(
      Math.round((activeDayCompleted.length / dayUseCases.length) * 100),
      100
    );
  }, [dayProgress, activeDay, dayUseCases, activeDayCompleted]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & BRANDING (Exact match with business view page)            */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 md:h-20 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/ninedaysjobprogramplan")}
              className="flex items-center gap-2 focus:outline-none transition group"
              title="Return to 9-Days Job Program overview"
            >
              <img
                src={NINE_DAYS_LOGO}
                alt="9-Days Job Program Logo"
                className="h-10 md:h-12 transition-transform group-hover:scale-105"
              />
            </button>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-[#068855]">
              Day {activeDay} of 9: {currentMeta.category}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/ninedaysinside")}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 transition"
            >
              ← Setup &amp; Prereqs
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-600 shadow-xs transition hover:border-red-300 hover:bg-red-100 hover:text-red-700"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Floating Status Notification Toast */}
      {statusNotice && (
        <div className="sticky top-14 z-30 bg-emerald-700 text-white px-4 py-2 text-center text-xs font-black shadow-md transition-all animate-in fade-in duration-200">
          {statusNotice}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DAY SELECTOR TABS (Days 1 to 8 + Day 9 Capstone)                       */}
      {/* ========================================================================= */}
      <section className="border-b border-slate-200 bg-white py-3 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {DAY_METADATA.map((dm) => {
              const isSelected = activeDay === dm.day;
              // Strictly locked if day > unlockedDay
              const isLocked = dm.day > unlockedDay;
              const completedCount = (completedMap[dm.day] || []).length;
              const totalInDay = dm.useCaseCount;
              const isDayFinished =
                totalInDay > 0 && completedCount >= totalInDay;

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
                  title={
                    isLocked
                      ? `Day ${dm.day} is locked. Complete Day ${unlockedDay} to unlock.`
                      : `Open Day ${dm.day}`
                  }
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
                  {isLocked && <span className="text-[11px]">🔒</span>}
                  {totalInDay > 0 && !isLocked && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        isSelected
                          ? "bg-emerald-800 text-emerald-100"
                          : "bg-slate-100 text-slate-500"
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
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-700 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white">
                  Day {activeDay} Curriculum
                </span>
                <span className="rounded-full border border-emerald-300 bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#068855]">
                  {currentMeta.badge} Module
                </span>
                <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-[11px] font-extrabold text-emerald-800">
                  {currentMeta.useCaseCount > 0
                    ? `${currentMeta.useCaseCount} Use Cases`
                    : "Final Capstone"}
                </span>
                {isStartingDay && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 animate-pulse">
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Syncing Day {activeDay} with server...
                  </span>
                )}
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
              <div className="w-full sm:w-80 rounded-2xl border border-emerald-200 bg-white p-4 shadow-xs shrink-0">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="font-extrabold text-[#143d2c]">
                    Day {activeDay} Progress
                  </span>
                  <span className="text-emerald-700 font-black text-sm">
                    {activeDayProgressPercent}%
                  </span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#00b96e] transition-all duration-300"
                    style={{
                      width: `${activeDayProgressPercent}%`,
                    }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>{activeDayCompleted.length} of {dayUseCases.length} Use Cases Done</span>
                  <span className="text-emerald-700 font-bold">
                    {isLoadingDashboard ? "Syncing..." : "Dashboard API"}
                  </span>
                </div>

                {isAllDayUseCasesCompleted && (
                  <button
                    type="button"
                    onClick={handleStartNextDay}
                    className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#00a65d] px-3.5 py-2 text-xs font-black text-white shadow-sm hover:from-emerald-700 hover:to-emerald-600 transition"
                  >
                    <span>
                      {activeDay < 8
                        ? `Start Day ${activeDay + 1} →`
                        : "Proceed to Day 9 Capstone →"}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DAYS 1 TO 8: IN-PLACE USE CASE WORKFLOW ACCORDION                     */}
      {/* ========================================================================= */}
      {activeDay <= 8 ? (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#068855]">
                Core Banking Workflows ({dayUseCases.length} Total Today)
              </span>
              <h2 className="text-lg font-black text-[#143d2c] sm:text-xl">
                Open each Use Case and execute the 5 In-Place Stages
              </h2>
            </div>
            <span className="text-xs font-extrabold text-slate-500">
              Day {activeDay} · {activeDayCompleted.length}/{dayUseCases.length} Completed
            </span>
          </div>

          {/* Use Case Accordion List */}
          <div className="space-y-4">
            {dayUseCases.map((uc, index) => {
              const ucCode = getUseCaseCode(index);
              const isCompleted = isUseCaseCompleted(index, uc.id);
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
                    onClick={() =>
                      setExpandedUseCaseId(isExpanded ? null : uc.id)
                    }
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
                        <div className="flex flex-wrap items-center gap-2">
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
                              ✓ Completed
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

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBusinessView(uc);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#00a65d] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:from-emerald-700 hover:to-emerald-600 transition"
                        title="View Use Case"
                      >
                        <span>View Use Case ↗</span>
                      </button>
                      <span className="text-slate-400 text-sm font-bold ml-1">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>

                  {/* Expanded View with Clean 5 In-Place Action Stages */}
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

                      {/* ================================================================= */}
                      {/* STAGE 1: UNDERSTAND USE CASE (Clean, short summary & View Use Case) */}
                      {/* ================================================================= */}
                      {activeStageTab === "understand" && (
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1.5 max-w-2xl">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-black text-emerald-700">
                                  {ucCode}
                                </span>
                                <span className="text-xs font-bold text-slate-400">
                                  (#{uc.id} of 51)
                                </span>
                                <span className="rounded-full bg-slate-100 px-2 py-0.2 text-[10px] font-black uppercase text-slate-600">
                                  {uc.moduleLabel}
                                </span>
                              </div>
                              <h4 className="text-base font-black text-slate-900 sm:text-lg">
                                {uc.title}
                              </h4>
                              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                                {uc.description}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenBusinessView(uc)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-[#00a65d] px-5 py-3 text-xs sm:text-sm font-black text-white shadow-sm hover:from-emerald-700 hover:to-emerald-600 transition shrink-0"
                            >
                              <span>View Use Case ↗</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ================================================================= */}
                      {/* STAGE 2: GENERATE CODE (AI Prompt + Copy Button)                 */}
                      {/* ================================================================= */}
                      {activeStageTab === "generate" && (
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <h4 className="text-sm font-black text-slate-900 sm:text-base">
                                  Full-Stack AI Implementation Prompt
                                </h4>
                                <p className="text-xs text-slate-500 font-medium">
                                  Copy this prompt directly into Gemini, ChatGPT, Claude, or Cursor to generate production code.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopyPrompt(uc, ucCode)}
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition shrink-0"
                              >
                                <span>{copiedPromptId === uc.id ? "✓ Copied!" : "📋 Copy Prompt"}</span>
                              </button>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto select-all">
                              Generate production-ready full-stack code for BFSI Banking Use Case [{ucCode}]: &quot;{uc.title}&quot; ({uc.description}).<br /><br />
                              Architecture &amp; Tech Stack Requirements:<br />
                              1. React 18 Frontend Component:<br />
                              &nbsp;&nbsp;- Modern responsive UI with Tailwind CSS and form validations.<br />
                              &nbsp;&nbsp;- PAN / Aadhaar / mobile deduplication checks, error banners, and loading states.<br />
                              2. Spring Boot 3 REST API Backend:<br />
                              &nbsp;&nbsp;- Controller (@RestController), Service (@Service), Repository (@Repository).<br />
                              &nbsp;&nbsp;- @Transactional, Maker-Checker authorization, and audit log persistence.<br />
                              3. PostgreSQL Database Schema:<br />
                              &nbsp;&nbsp;- DDL SQL script with primary keys, foreign keys, and audit timestamps.<br />
                              4. Postman API Test Requests &amp; cURL Commands.
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ================================================================= */}
                      {/* STAGE 3: RUN CODE (Spring Boot, React, DB, Postman)              */}
                      {/* ================================================================= */}
                      {activeStageTab === "run" && (
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 text-xs">
                            <h4 className="text-sm font-black text-slate-900 sm:text-base">
                              Local Execution &amp; Testing Instructions
                            </h4>

                            {/* Step 1: DB */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1.5">
                              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] text-white font-black">1</span>
                                PostgreSQL Database Setup &amp; Migration
                              </span>
                              <p className="text-slate-600">
                                Run the DDL schema in pgAdmin or terminal to create the database table and indexes:
                              </p>
                              <pre className="rounded-lg bg-slate-900 p-2.5 font-mono text-[11px] text-emerald-300 overflow-x-auto">
{`psql -U postgres -d bfsi_core -c "CREATE TABLE IF NOT EXISTS ${uc.path.replace(/-/g, "_")} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);"`}
                              </pre>
                            </div>

                            {/* Step 2: Spring Boot */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1.5">
                              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] text-white font-black">2</span>
                                Start Spring Boot REST API Backend (Port 8080)
                              </span>
                              <pre className="rounded-lg bg-slate-900 p-2.5 font-mono text-[11px] text-emerald-300 overflow-x-auto">
{`# Linux / macOS
./mvnw spring-boot:run

# Windows PowerShell
.\\mvnw.cmd spring-boot:run`}
                              </pre>
                            </div>

                            {/* Step 3: React Frontend */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1.5">
                              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] text-white font-black">3</span>
                                Start React Frontend (Port 5173 / 3000)
                              </span>
                              <pre className="rounded-lg bg-slate-900 p-2.5 font-mono text-[11px] text-emerald-300 overflow-x-auto">
{`npm install
npm run dev`}
                              </pre>
                            </div>

                            {/* Step 4: Postman API Test */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1.5">
                              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] text-white font-black">4</span>
                                Postman / cURL API Test Request
                              </span>
                              <pre className="rounded-lg bg-slate-900 p-2.5 font-mono text-[11px] text-emerald-300 overflow-x-auto">
{`curl -X POST "http://localhost:8080/api/v1/${uc.path}" \\
  -H "Content-Type: application/json" \\
  -d '{"customerId": "CUST-98721", "status": "INITIATED"}'`}
                              </pre>
                              <span className="text-[11px] font-semibold text-emerald-700 block">
                                Expected Response: HTTP 200 OK with status: &quot;SUCCESS&quot; and reference ID.
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ================================================================= */}
                      {/* STAGE 4: DEPLOYMENT (Vercel, Docker, Mobile APK)                 */}
                      {/* ================================================================= */}
                      {activeStageTab === "deploy" && (
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 text-xs sm:text-sm">
                            <h4 className="text-sm font-black text-slate-900 sm:text-base">
                              Production Cloud &amp; Mobile Deployment Steps
                            </h4>

                            <div className="space-y-3 text-slate-600 font-medium">
                              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
                                  1
                                </span>
                                <div>
                                  <strong className="text-slate-900 block">Web Frontend to Vercel:</strong>
                                  <span className="text-xs">
                                    Commit your code to GitHub, connect the repository to Vercel, set your environment variable <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">VITE_API_URL</code>, and deploy live.
                                  </span>
                                </div>
                              </div>

                              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                                  2
                                </span>
                                <div>
                                  <strong className="text-slate-900 block">Spring Boot Backend Container:</strong>
                                  <span className="text-xs">
                                    Package backend JAR with <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">mvn clean package</code>, build Docker image, and deploy to AWS ECS, Render, or Railway with database connection strings.
                                  </span>
                                </div>
                              </div>

                              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-xs">
                                  3
                                </span>
                                <div>
                                  <strong className="text-slate-900 block">Mobile APK Build (Expo EAS / Capacitor):</strong>
                                  <span className="text-xs">
                                    Build your Android APK using <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-mono">eas build -p android --profile preview</code> or Capacitor native sync to test on real devices.
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ================================================================= */}
                      {/* STAGE 5: PUBLISH LINKED #83GLAI                                  */}
                      {/* ================================================================= */}
                      {activeStageTab === "publish" && (
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-xs space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <h4 className="text-sm font-black text-slate-900 sm:text-base">
                                  Publish &amp; Link #83GLAI Hiring Partner Companies
                                </h4>
                                <p className="text-xs text-slate-600 font-medium">
                                  Engineering managers and recruiters across 83+ partner companies monitor #83GLAI for hiring.
                                </p>
                              </div>
                              <span className="rounded-full bg-blue-100 border border-blue-200 px-2.5 py-0.5 text-[11px] font-black text-blue-800 self-start sm:self-auto">
                                #83GLAI Official
                              </span>
                            </div>

                            <div className="rounded-xl border border-blue-200 bg-white p-4 font-mono text-xs text-slate-800 leading-relaxed select-all">
                              🚀 Day {activeDay} Milestone: Just built and verified BFSI Banking Use Case {ucCode} - &quot;{uc.title}&quot; in the #83GLAI 9-Days Job Program!<br /><br />
                              💡 Core Banking Context: {uc.description}.<br />
                              🛠️ Tech Stack: React 18, Spring Boot 3, PostgreSQL, Tailwind CSS.<br />
                              🔒 Verification: Complete audit logs and maker-checker workflows.<br /><br />
                              #83GLAI #FullStack #Fintech #CoreBanking #SoftwareEngineering #ASKOXY_AI
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleShareLinkedIn(uc, ucCode)}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#0a66c2] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#084e96] transition"
                              >
                                <span>Share on LinkedIn with #83GLAI ↗</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopyPostText(uc, ucCode)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                              >
                                <span>{copiedPostId === uc.id ? "✓ Post Copied!" : "📋 Copy Post Text"}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bottom Action Area (Only Next Use Case navigation; View Use Case kept strictly at header row & Understand stage) */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 pt-4">
                        <div className="text-xs font-medium text-slate-600">
                          {isCompleted ? (
                            <span className="text-emerald-700 font-extrabold inline-flex items-center gap-1.5">
                              <span>✓</span> Use Case completed and verified on backend.
                            </span>
                          ) : (
                            <span>
                              Click &quot;View Use Case ↗&quot; above to verify the workflow and complete this use case.
                            </span>
                          )}
                        </div>

                        {index + 1 < dayUseCases.length && (
                          <button
                            type="button"
                            onClick={() => {
                              setExpandedUseCaseId(dayUseCases[index + 1].id);
                              setActiveStageTab("understand");
                            }}
                            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                          >
                            <span>Next Use Case →</span>
                          </button>
                        )}
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
                    {activeDay < 8
                      ? `Start Day ${activeDay + 1} →`
                      : "Proceed to Day 9 Capstone →"}
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
                Build Complete 51 Use-Case Banking Application 
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium max-w-3xl">
                You have systematically understood, generated code for, tested, and published all 51 core banking workflows across LOS, FMS, and CMS. 
              </p>
            </div>

            {/* Architecture Overview */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <span className="text-xs font-bold text-emerald-700 block uppercase tracking-wider">
                  LOS (Days 1 &amp; 2)
                </span>
                <h4 className="text-base font-black text-slate-900 mt-1">
                  14 Origination Use Cases
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Customer ID, KYC, appraisal, sanctions, repayment schedules, and credit check.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <span className="text-xs font-bold text-amber-700 block uppercase tracking-wider">
                  FMS (Days 3, 4, 5, 6)
                </span>
                <h4 className="text-base font-black text-slate-900 mt-1">
                  25 Servicing &amp; Ops Use Cases
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  PDC printing, NPA grading/provisioning, knock-offs, settlements, EOD/BOD, and deferrals.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <span className="text-xs font-bold text-purple-700 block uppercase tracking-wider">
                  CMS (Days 7 &amp; 8)
                </span>
                <h4 className="text-base font-black text-slate-900 mt-1">
                  12 Delinquency Use Cases
                </h4>
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
