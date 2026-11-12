import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../Config";
import { stopTokenRefresh } from "../utils/tokenRefresh";

const NINE_DAYS_LOGO = "https://i.ibb.co/39rQT8TW/9-Days-Job-Program-Logo-1.png";
const STORAGE_MOBILE_ROUTE = "nine_days_prereq_mobile_route";
const STORAGE_MASTER_VERIFIED = "nine_days_master_prereq_verified";
const STORAGE_ENROLLMENT_ID = "job_program_enrollment_id";
const STORAGE_VIEWED_GUIDES = "nine_days_prereq_viewed_guides";

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

// Official Google Drive Setup Guides in recommended execution order
export interface SetupGuide {
  id: number;
  title: string;
  url: string;
  category: string;
  icon: string;
  description: string;
  badgeColor: string;
}

export const SETUP_GUIDES: SetupGuide[] = [
  {
    id: 1,
    title: "Mobile App Environment Setup",
    url: "https://drive.google.com/file/d/1zZ0gUpQdbyo1oTs3mYf9Mh3zHUjAgJbA/view",
    category: "Mobile Runtime",
    icon: "📱",
    description:
      "Configure Android Studio, Xcode command tools, device emulators, and mobile SDK dependencies.",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: 2,
    title: "Web UI & Frontend Setup",
    url: "https://drive.google.com/file/d/1ZMGEFh1TCfQ0L2Hs8hNbCq9jwq8b_XHU/view",
    category: "Frontend",
    icon: "💻",
    description:
      "Install Node.js, npm, VS Code extensions, React dependencies, and Tailwind CSS for UI development.",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: 3,
    title: "PostgreSQL Database Setup",
    url: "https://drive.google.com/file/d/1eYAkgOn1AzcZy8c_1tyaEy_4Wt38tJtY/view",
    category: "Database",
    icon: "🗄️",
    description:
      "Install PostgreSQL and pgAdmin, initialize your local BFSI database schema, credentials, and users.",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: 4,
    title: "Backend API Setup (Spring Boot)",
    url: "https://drive.google.com/file/d/1x8UYossgacXWn7gDvGknPlox-C6ccGk9/view",
    category: "Backend APIs",
    icon: "⚙️",
    description:
      "Install Java JDK (17/21), Maven, and Spring Boot, and verify REST APIs using Postman collections.",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: 5,
    title: "Full-Stack React Build & Integration",
    url: "https://drive.google.com/file/d/1Fc3u4K63ag_j8Z9Y3htDRLrlIrtHx1TO/view",
    category: "Full Stack",
    icon: "🔗",
    description:
      "Structure your project folders, connect React views to Spring Boot APIs, and run production builds.",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    id: 6,
    title: "Android & iOS Deployment via Expo",
    url: "https://drive.google.com/file/d/14181E8p4AelCZuG-CRbB3143fjBNlCZi/view",
    category: "Mobile Deploy",
    icon: "🚀",
    description:
      "Package your application, generate Android APK / iOS builds with Expo EAS, and test live endpoints.",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
];

const REQUIRED_TOOLS_SUMMARY = [
  "Java JDK 17 / 21",
  "Spring Boot 3 & Maven",
  "Node.js & npm",
  "React 18",
  "PostgreSQL & pgAdmin",
  "Git & GitHub",
  "Postman",
  "Cloud Hosting (Vercel / Railway)",
];

export default function NineDaysPrerequisites() {
  const navigate = useNavigate();

  // Mobile Route Selection
  const [mobileRoute, setMobileRoute] = useState<"react_native" | "capacitor">(() => {
    return (
      (localStorage.getItem(STORAGE_MOBILE_ROUTE) as "react_native" | "capacitor") ||
      "react_native"
    );
  });

  // Track which setup guides have been opened/reviewed for better engagement
  const [viewedGuides, setViewedGuides] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_VIEWED_GUIDES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Master Verification Checkbox for unlocking Day 1
  const [isEnvironmentVerified, setIsEnvironmentVerified] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_MASTER_VERIFIED) === "true";
  });

  const [enrollmentId, setEnrollmentId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_ENROLLMENT_ID) || "";
  });
  const [isStartingDay1, setIsStartingDay1] = useState(false);
  const [apiNotice, setApiNotice] = useState<string>("");

  // On mount: check if enrollment already exists for this user via dashboard API
  useEffect(() => {
    const checkUserEnrollment = async () => {
      const resolvedUserId = getResolvedUserId();
      if (!resolvedUserId) return;
      try {
        const d: any = await callJobProgramApi(
          `/dashboard?userId=${encodeURIComponent(resolvedUserId)}`,
          "GET"
        );
        if (d && d.enrollmentId) {
          setEnrollmentId(d.enrollmentId);
          localStorage.setItem(STORAGE_ENROLLMENT_ID, d.enrollmentId);
        }
      } catch {
        // graceful offline fallback
      }
    };
    checkUserEnrollment();
  }, []);

  const handleToggleVerification = (checked: boolean) => {
    setIsEnvironmentVerified(checked);
    localStorage.setItem(STORAGE_MASTER_VERIFIED, checked ? "true" : "false");
  };

  const handleSelectMobileRoute = (route: "react_native" | "capacitor") => {
    setMobileRoute(route);
    localStorage.setItem(STORAGE_MOBILE_ROUTE, route);
  };

  const markGuideViewed = (id: number, toggle = false) => {
    setViewedGuides((prev) => {
      const next = toggle
        ? prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id]
        : Array.from(new Set([...prev, id]));
      localStorage.setItem(STORAGE_VIEWED_GUIDES, JSON.stringify(next));
      return next;
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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

  const handleStartDay1 = async () => {
    if (!isEnvironmentVerified || isStartingDay1) return;
    setIsStartingDay1(true);
    setApiNotice("Preparing your Day 1 workspace...");

    const resolvedUserId = getResolvedUserId();

    try {
      let currentEnrollment =
        enrollmentId || localStorage.getItem(STORAGE_ENROLLMENT_ID) || "";

      // 1. Register or confirm program interest
      const interestRes: any = await callJobProgramApi(
        `/interest?userId=${encodeURIComponent(resolvedUserId)}`,
        "POST"
      );

      if (interestRes) {
        const eid = interestRes.enrollmentId || interestRes.data?.enrollmentId;
        if (eid) {
          currentEnrollment = eid;
          setEnrollmentId(eid);
          localStorage.setItem(STORAGE_ENROLLMENT_ID, eid);
        }
        if (interestRes.message) {
          setApiNotice(interestRes.message);
        }
      }

      // 2. Initialize Day 1 on backend
      if (currentEnrollment) {
        const startRes: any = await callJobProgramApi(
          `/start?dayNumber=1&enrollmentId=${encodeURIComponent(currentEnrollment)}`,
          "POST"
        );
        if (startRes) {
          const dayRecId = startRes.id || startRes.data?.id;
          if (dayRecId) {
            localStorage.setItem("job_program_day_record_1", dayRecId);
            localStorage.setItem("job_program_day_progress_id", dayRecId);
          }
        }
      }
    } catch (err) {
      console.warn("Start Day 1 API initialization warning:", err);
    } finally {
      setIsStartingDay1(false);
      navigate("/ninedaysdayworkflow?day=1");
    }
  };

  const mobileRouteLabel =
    mobileRoute === "react_native" ? "React Native (Expo)" : "Capacitor";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* ========================================================================= */}
      {/* 1. CONSISTENT TOP HEADER                                                  */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-20 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/ninedaysjobprogramplan")}
              className="group flex items-center gap-2 focus:outline-none"
              title="Return to 9-Days Job Program overview"
            >
              <img
                src={NINE_DAYS_LOGO}
                alt="9-Days Job Program Logo"
                className="h-10 transition-transform group-hover:scale-105 md:h-12"
              />
            </button>
            <span className="hidden sm:inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-[#068855]">
              Day 0 · Prerequisites
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/ninedaysjobprogramplan")}
              className="hidden sm:inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
            >
              Program Overview
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

      {/* ========================================================================= */}
      {/* 2. HERO & INTERACTIVE 3-STEP JOURNEY                                      */}
      {/* ========================================================================= */}
      <section className="border-b border-emerald-100 bg-gradient-to-b from-[#ecf8f1] via-[#f6fbf8] to-[#f8fafc] py-6 sm:py-9">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#143d2c] sm:text-3xl md:text-4xl">
                  Before Day 1: Development Setup
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base font-medium">
                  Set up your local development tools once before starting the curriculum so you can build, run, and deploy every real-world banking workflow smoothly from Day 1.
                </p>
              </div>

              {/* Interactive 3-Step Navigator Pills */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => scrollToSection("step-mobile")}
                  className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white p-3 text-left shadow-xs transition hover:border-emerald-400 hover:shadow-sm"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-black text-emerald-800">
                    1
                  </span>
                  <div className="min-w-0">
                    <span className="block text-xs font-extrabold text-slate-900">
                      Mobile Path
                    </span>
                    <span className="block truncate text-[11px] font-semibold text-emerald-700">
                      {mobileRouteLabel}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("step-guides")}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-xs transition hover:border-emerald-400 hover:shadow-sm"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-700">
                    2
                  </span>
                  <div className="min-w-0">
                    <span className="block text-xs font-extrabold text-slate-900">
                      Setup Guides
                    </span>
                    <span className="block truncate text-[11px] font-semibold text-slate-500">
                      {viewedGuides.length} of {SETUP_GUIDES.length} Reviewed
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("step-verify")}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-xs transition hover:border-emerald-400 hover:shadow-sm"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                      isEnvironmentVerified
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isEnvironmentVerified ? "✓" : "3"}
                  </span>
                  <div className="min-w-0">
                    <span className="block text-xs font-extrabold text-slate-900">
                      Verify &amp; Start
                    </span>
                    <span
                      className={`block truncate text-[11px] font-semibold ${
                        isEnvironmentVerified ? "text-emerald-700" : "text-amber-700"
                      }`}
                    >
                      {isEnvironmentVerified ? "Ready for Day 1" : "Confirmation Required"}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Readiness Launch Card */}
            <div className="w-full shrink-0 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm lg:w-[320px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Day 1 Access
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-black ${
                    isEnvironmentVerified
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border border-amber-200 bg-amber-50 text-amber-800"
                  }`}
                >
                  {isEnvironmentVerified ? "🔓 Unlocked" : "🔒 Locked"}
                </span>
              </div>

              <p className="mt-2.5 text-xs leading-relaxed text-slate-600 font-medium">
                {isEnvironmentVerified
                  ? "Your workstation setup is confirmed. Start Day 1 to explore the Customer Onboarding & Loan Origination modules."
                  : "Review the setup guides below and confirm the final checklist to enable Day 1."}
              </p>

              <button
                type="button"
                disabled={!isEnvironmentVerified || isStartingDay1}
                onClick={handleStartDay1}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-[#00a65d] px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isStartingDay1 ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span>Starting Day 1...</span>
                  </>
                ) : (
                  <span>Start Day 1 →</span>
                )}
              </button>

              {!isEnvironmentVerified && (
                <button
                  type="button"
                  onClick={() => scrollToSection("step-verify")}
                  className="mt-2.5 w-full text-center text-[11px] font-bold text-[#068855] hover:underline"
                >
                  Go to verification checklist ↓
                </button>
              )}

              {apiNotice && (
                <p className="mt-2 text-center text-[11px] font-bold text-emerald-700">
                  {apiNotice}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE                                                         */}
      {/* ========================================================================= */}
      <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        {/* ======================================================================= */}
        {/* STEP 1: CHOOSE YOUR MOBILE DEVELOPMENT PATH                             */}
        {/* ======================================================================= */}
        <section
          id="step-mobile"
          className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-7"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#068855]">
                Step 1 of 3 · Mobile Architecture
              </span>
              <h2 className="mt-0.5 text-lg font-black text-[#143d2c] sm:text-xl">
                Choose Your Mobile Development Path
              </h2>
            </div>
            <span className="self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-extrabold text-emerald-800 sm:self-auto">
              Selected: {mobileRouteLabel}
            </span>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm font-medium">
            In addition to your React web application, select how you plan to build and deploy native Android and iOS experiences.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {/* React Native Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleSelectMobileRoute("react_native")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelectMobileRoute("react_native");
                }
              }}
              className={`cursor-pointer rounded-2xl border-2 p-5 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                mobileRoute === "react_native"
                  ? "border-[#00b96e] bg-[#f0fbf5] shadow-xs ring-2 ring-emerald-500/15"
                  : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50/70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
                    Recommended
                  </span>
                  <h3 className="mt-2 text-base font-black text-slate-900 sm:text-lg">
                    React Native (Expo)
                  </h3>
                </div>
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    mobileRoute === "react_native"
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-300"
                  }`}
                >
                  {mobileRoute === "react_native" && (
                    <span className="text-xs font-bold">✓</span>
                  )}
                </div>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm font-medium">
                Compile natively to Android and iOS UI components with Expo Application Services (EAS) and cloud binary builds.
              </p>
              <div className="mt-3.5 flex flex-wrap gap-1.5 text-[11px] font-bold text-slate-600">
                <span className="rounded-md border border-slate-200 bg-white px-2.5 py-0.5">
                  Native UI
                </span>
                <span className="rounded-md border border-slate-200 bg-white px-2.5 py-0.5">
                  Expo EAS Build
                </span>
                <span className="rounded-md border border-slate-200 bg-white px-2.5 py-0.5">
                  Android &amp; iOS
                </span>
              </div>
            </div>

            {/* Capacitor Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleSelectMobileRoute("capacitor")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelectMobileRoute("capacitor");
                }
              }}
              className={`cursor-pointer rounded-2xl border-2 p-5 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                mobileRoute === "capacitor"
                  ? "border-[#00b96e] bg-[#f0fbf5] shadow-xs ring-2 ring-emerald-500/15"
                  : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50/70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                    Web-to-Mobile Wrapper
                  </span>
                  <h3 className="mt-2 text-base font-black text-slate-900 sm:text-lg">
                    Capacitor
                  </h3>
                </div>
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    mobileRoute === "capacitor"
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-300"
                  }`}
                >
                  {mobileRoute === "capacitor" && (
                    <span className="text-xs font-bold">✓</span>
                  )}
                </div>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm font-medium">
                Package your React web codebase directly inside a native container to distribute across Android and iOS stores.
              </p>
              <div className="mt-3.5 flex flex-wrap gap-1.5 text-[11px] font-bold text-slate-600">
                <span className="rounded-md border border-slate-200 bg-white px-2.5 py-0.5">
                  Shared Web Code
                </span>
                <span className="rounded-md border border-slate-200 bg-white px-2.5 py-0.5">
                  Capacitor CLI
                </span>
                <span className="rounded-md border border-slate-200 bg-white px-2.5 py-0.5">
                  Rapid Setup
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* STEP 2: OFFICIAL SETUP GUIDES (6 INTERACTIVE CARDS)                     */}
        {/* ======================================================================= */}
        <section id="step-guides" className="scroll-mt-24 space-y-5">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#068855]">
                Step 2 of 3 · Environment Installation
              </span>
              <h2 className="mt-0.5 text-xl font-black text-[#143d2c] sm:text-2xl">
                Complete the 6 Workstation Setup Guides
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">
                Open each official PDF manual below to install and configure your full-stack environment.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-xs">
              <span className="text-xs font-bold text-slate-700">
                Progress: <strong className="text-emerald-700">{viewedGuides.length} / {SETUP_GUIDES.length}</strong> Reviewed
              </span>
              <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${(viewedGuides.length / SETUP_GUIDES.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SETUP_GUIDES.map((guide) => {
              const isViewed = viewedGuides.includes(guide.id);
              return (
                <div
                  key={guide.id}
                  className={`flex flex-col justify-between rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md ${
                    isViewed
                      ? "border-emerald-300 bg-white ring-1 ring-emerald-500/10"
                      : "border-slate-200 bg-white hover:border-emerald-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-[11px] font-extrabold ${guide.badgeColor}`}
                      >
                        <span>{guide.icon}</span>
                        <span>Guide 0{guide.id} · {guide.category}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => markGuideViewed(guide.id, true)}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-black transition ${
                          isViewed
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                        title={isViewed ? "Mark as unread" : "Mark as reviewed"}
                      >
                        {isViewed ? "✓ Reviewed" : "Mark Done"}
                      </button>
                    </div>

                    <h3 className="mt-3.5 text-sm font-extrabold leading-snug text-slate-900 sm:text-base">
                      {guide.title}
                    </h3>

                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 font-medium">
                      {guide.description}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-3.5">
                    <a
                      href={guide.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => markGuideViewed(guide.id, false)}
                      className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold shadow-xs transition ${
                        isViewed
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
                          : "bg-slate-900 text-white hover:bg-emerald-700"
                      }`}
                    >
                      <span>{isViewed ? "Re-open Setup Guide ↗" : "Open Setup Guide ↗"}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* STEP 3: UNIFIED VERIFICATION & START DAY 1 CARD                         */}
        {/* ======================================================================= */}
        <section
          id="step-verify"
          className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 space-y-6"
        >
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#068855]">
              Step 3 of 3 · Final Confirmation
            </span>
            <h2 className="mt-0.5 text-xl font-black text-[#143d2c] sm:text-2xl">
              Confirm Environment Readiness to Start Day 1
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">
              Ensure the following core dependencies are installed and working properly on your workstation:
            </p>

            {/* Quick-scan dependency chips */}
            <div className="mt-3.5 flex flex-wrap gap-2">
              {REQUIRED_TOOLS_SUMMARY.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700"
                >
                  <span className="text-emerald-600">•</span>
                  <span>{tool}</span>
                </span>
              ))}
              <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-800">
                <span>•</span>
                <span>Mobile: {mobileRouteLabel}</span>
              </span>
            </div>
          </div>

          {/* Interactive Master Verification Checkbox */}
          <label
            className={`block cursor-pointer rounded-2xl border-2 p-4 sm:p-5 transition-all ${
              isEnvironmentVerified
                ? "border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/15"
                : "border-slate-300 bg-slate-50/50 hover:border-emerald-300 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <input
                type="checkbox"
                checked={isEnvironmentVerified}
                onChange={(e) => handleToggleVerification(e.target.checked)}
                className="mt-0.5 h-5 w-5 sm:h-6 sm:w-6 shrink-0 cursor-pointer rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-black text-slate-900 sm:text-base">
                    I confirm that my full-stack development environment is installed and ready
                  </span>
                  {isEnvironmentVerified && (
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-0.5 text-[11px] font-black text-emerald-800">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-slate-600 sm:text-sm font-medium">
                  I have completed the setup steps above and verified that Java, Spring Boot, React, PostgreSQL, Postman, GitHub, and {mobileRouteLabel} run cleanly on my computer.
                </p>
              </div>
            </div>
          </label>

          {/* Primary Launch Action Row */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row">
            <div className="text-center sm:text-left">
              <h3 className="text-base font-black text-[#143d2c]">
                {isEnvironmentVerified
                  ? "🎉 You're all set for Day 1!"
                  : "Day 1 stays locked until verified"}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
                {isEnvironmentVerified
                  ? "Click Start Day 1 to launch Customer Onboarding & Loan Origination workflows."
                  : "Check the confirmation box above to activate the Start Day 1 button."}
              </p>
            </div>

            <button
              type="button"
              disabled={!isEnvironmentVerified || isStartingDay1}
              onClick={handleStartDay1}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-[#00a65d] px-8 py-3.5 text-sm font-black text-white shadow-md transition hover:from-emerald-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
            >
              {isStartingDay1 ? (
                <>
                  <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>Starting Day 1...</span>
                </>
              ) : (
                <span>Start Day 1 →</span>
              )}
            </button>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="mt-10 border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p className="text-xs font-medium text-slate-500">
            © {new Date().getFullYear()} ASKOXY.AI · #83GLAI 9-Days Job Program. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs font-bold text-[#068855]">
            <button
              type="button"
              onClick={() => navigate("/ninedaysjobprogramplan")}
              className="hover:underline"
            >
              Program Overview
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
