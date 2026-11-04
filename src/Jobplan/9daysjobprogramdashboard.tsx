import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import BASE_URL from "../Config";
import {
  DAY_META,
  DayMetaItem,
  parseUseCaseNumbers,
} from "./nineDaysUseCasesData";

export interface DayDetail {
  id?: string;
  enrollmentId?: string;
  userId?: string;
  dayNumber: number;
  useCaseNumbers?: string | null;
  progress: number;
  visited: boolean;
  completed: boolean;
  visitedAt?: number | null;
  createdAt?: number | null;
  updatedAt?: number | null;
}

export interface JobProgramDashboardApiResponse {
  enrollmentId?: string;
  status?: string;
  currentDay?: number;
  totalDays?: number;
  daysCompleted?: number;
  programCompleted?: boolean;
  examEligible?: boolean;
  days?: DayDetail[];
}

const nineDaysLogo = "https://i.ibb.co/39rQT8TW/9-Days-Job-Program-Logo-1.png";

// SweetAlert2 Toast Mixin
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export default function NineDaysJobProgramDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Resolve user ID from query param, localStorage, or sessionStorage
  const resolvedUserId = useMemo(() => {
    return (
      searchParams.get("userId") ||
      searchParams.get("userid") ||
      localStorage.getItem("userId") ||
      localStorage.getItem("userid") ||
      localStorage.getItem("customerId") ||
      sessionStorage.getItem("userId") ||
      sessionStorage.getItem("userid") ||
      "d03d4aae-32da-49ab-b4e6-83946ae162f6"
    );
  }, [searchParams]);

  const [dashboardData, setDashboardData] =
    useState<JobProgramDashboardApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Fetch Dashboard API
  const fetchDashboard = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setErrorMsg("");

      const directUrl = `http://65.0.147.157:9229/api/marketing-service/campgin/job-program/dashboard?userId=${encodeURIComponent(
        resolvedUserId,
      )}`;
      const fallbackUrl = `${BASE_URL}/marketing-service/campgin/job-program/dashboard?userId=${encodeURIComponent(
        resolvedUserId,
      )}`;

      const isHttps =
        typeof window !== "undefined" && window.location.protocol === "https:";
      const urlsToTry = isHttps
        ? [fallbackUrl, directUrl]
        : [directUrl, fallbackUrl];

      let fetchedData: JobProgramDashboardApiResponse | null = null;
      let lastErr = "";

      for (const targetUrl of urlsToTry) {
        try {
          const res = await axios.get<JobProgramDashboardApiResponse>(
            targetUrl,
            {
              headers: { Accept: "application/json" },
              timeout: 10000,
            },
          );
          if (res?.data) {
            fetchedData = res.data;
            break;
          }
        } catch (err: any) {
          lastErr =
            err?.response?.data?.message ||
            err?.message ||
            "Unable to connect to dashboard service.";
        }
      }

      setLoading(false);
      setRefreshing(false);

      if (fetchedData) {
        setDashboardData(fetchedData);
        if (fetchedData.enrollmentId) {
          localStorage.setItem(
            "job_program_enrollment_id",
            fetchedData.enrollmentId,
          );
        }
        if (typeof fetchedData.currentDay === "number") {
          localStorage.setItem(
            "job_program_current_day",
            String(fetchedData.currentDay),
          );
        }

        // Parse useCaseNumbers string from GET call (e.g. "UC-01,UC-02,UC-03")
        // and sync completed use cases for each day into localStorage
        if (Array.isArray(fetchedData.days)) {
          fetchedData.days.forEach((dayItem: any) => {
            if (dayItem?.dayNumber && dayItem?.useCaseNumbers) {
              const parsed = parseUseCaseNumbers(dayItem.useCaseNumbers);
              if (parsed.length > 0) {
                const existingStr = localStorage.getItem(
                  `job_program_completed_ucs_day_${dayItem.dayNumber}`,
                );
                const existing: string[] = existingStr
                  ? JSON.parse(existingStr)
                  : [];
                const merged = Array.from(new Set([...existing, ...parsed]));
                localStorage.setItem(
                  `job_program_completed_ucs_day_${dayItem.dayNumber}`,
                  JSON.stringify(merged),
                );
              }
            }
          });
        }
        if (isManualRefresh) {
          Toast.fire({
            icon: "success",
            title: "Dashboard refreshed with latest progress!",
          });
        }
      } else {
        setErrorMsg(lastErr || "Failed to load dashboard data.");
      }
    },
    [resolvedUserId],
  );

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Copy enrollment ID helper
  const handleCopyEnrollmentId = (id?: string) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
    Toast.fire({
      icon: "success",
      title: "Enrollment ID copied to clipboard!",
    });
  };

  // Format date helper
  const formatDate = (timestamp?: number | null) => {
    if (!timestamp) return null;
    try {
      const d = new Date(timestamp);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return null;
    }
  };

  // Metrics computation
  const totalDays = dashboardData?.totalDays ?? 9;
  const daysCompleted = dashboardData?.daysCompleted ?? 0;
  const currentDay = dashboardData?.currentDay ?? 1;
  const programCompleted = Boolean(dashboardData?.programCompleted);
  const examEligible = Boolean(dashboardData?.examEligible);
  const overallPercent = Math.min(
    100,
    Math.round((daysCompleted / totalDays) * 100),
  );

  // Merge API days with DAY_META so all 9 days are represented consistently
  const daysList = useMemo(() => {
    const apiDaysMap = new Map<number, DayDetail>();
    if (dashboardData?.days && Array.isArray(dashboardData.days)) {
      dashboardData.days.forEach((d) => {
        if (d && typeof d.dayNumber === "number") {
          apiDaysMap.set(d.dayNumber, d);
        }
      });
    }

    return DAY_META.map((meta) => {
      const apiDay = apiDaysMap.get(meta.day);
      const isCompleted = Boolean(apiDay?.completed);
      const progress = apiDay?.progress ?? (isCompleted ? 100 : 0);
      const isVisited = Boolean(apiDay?.visited);
      const isAvailable = meta.day <= currentDay;
      const isLocked = !isCompleted && !isAvailable;

      return {
        ...meta,
        apiId: apiDay?.id,
        progress,
        completed: isCompleted,
        visited: isVisited,
        isLocked,
        useCaseNumbers: apiDay?.useCaseNumbers,
        visitedAt: apiDay?.visitedAt,
        updatedAt: apiDay?.updatedAt,
      };
    });
  }, [dashboardData, currentDay]);

  return (
    <div className="min-h-screen bg-[#f4faf6] text-slate-900 antialiased font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/ninedaysinside?day=${currentDay}`)}
              className="flex items-center gap-3"
              aria-label="Back to 9-Days Job Program"
            >
              <img
                src={nineDaysLogo}
                alt="9-Days Job Program"
                className="h-10 w-auto max-w-[170px] object-contain sm:h-12"
              />
            </button>
            <span className="hidden sm:inline-block rounded-lg bg-emerald-100/70 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-800">
              Program Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Back to Portal Button */}
            <button
              type="button"
              onClick={() => navigate(`/ninedaysinside?day=${currentDay}`)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-600 hover:text-white sm:text-sm"
              title="Return to the 9-Days Portal workspace"
            >
              <span>←</span>
              <span>Back to Portal</span>
            </button>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => fetchDashboard(true)}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 sm:text-sm"
              title="Refresh live dashboard data"
            >
              <svg
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-emerald-600" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <svg
              className="h-10 w-10 animate-spin text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <p className="mt-4 text-sm font-bold text-slate-600">
              Loading your 9-Days Job Program progress...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && errorMsg && !dashboardData && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              ⚠️
            </div>
            <h3 className="mt-3 text-lg font-bold text-red-900">
              Unable to load Dashboard
            </h3>
            <p className="mt-1 text-sm text-red-700">{errorMsg}</p>
            <button
              type="button"
              onClick={() => fetchDashboard(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Dashboard Loaded Content */}
        {!loading && dashboardData && (
          <div className="space-y-8">
            {/* Hero / Summary Overview Card */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-[#123929] via-[#164331] to-[#0c271b] p-6 text-white shadow-xl sm:p-8">
              {/* Background Glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />

              <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-200">
                      9-Days Sprint Candidate
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${
                        dashboardData.status === "COMPLETED"
                          ? "bg-emerald-400 text-emerald-950 font-black"
                          : "bg-teal-400/20 border border-teal-300/40 text-teal-200"
                      }`}
                    >
                      Status: {dashboardData.status || "ACTIVE"}
                    </span>
                    {programCompleted && (
                      <span className="rounded-full bg-amber-400 text-amber-950 px-3 py-1 text-xs font-extrabold uppercase tracking-wide">
                        🏆 Program Completed
                      </span>
                    )}
                    {/* {examEligible && (
                      <span className="rounded-full bg-indigo-400 text-indigo-950 px-3 py-1 text-xs font-extrabold uppercase tracking-wide">
                        🎓 Exam Eligible
                      </span>
                    )} */}
                  </div>

                  <h1 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl text-white">
                    Candidate Progress &amp; Program Status
                  </h1>

                 
                </div>

                {/* Overall Completion Ring / Progress Card */}
                <div className="shrink-0 rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/15 lg:min-w-[280px]">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-200">
                    <span>Overall Completion</span>
                    <span className="text-base font-extrabold text-white">
                      {overallPercent}%
                    </span>
                  </div>

                  <div className="mt-2 h-3.5 w-full overflow-hidden rounded-full bg-black/40 p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 transition-all duration-500"
                      style={{ width: `${overallPercent}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-100/80">
                    <span>
                      {daysCompleted} of {totalDays} Days Completed
                    </span>
                    <span>
                      Current: <strong>Day {currentDay}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stat Tiles */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Tile 1: Days Completed */}
              <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Days Completed
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold">
                    📅
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#143d2c]">
                    {daysCompleted}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    / {totalDays} Days
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  {daysCompleted >= 9
                    ? "All 9 Days completed!"
                    : `${totalDays - daysCompleted} days remaining in program`}
                </p>
              </div>

              {/* Tile 2: Current Sprint Day */}
              <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Active Sprint
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-700 font-bold">
                    ⚡
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#143d2c]">
                    Day {currentDay}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    of {totalDays}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 truncate">
                  {DAY_META[Math.min(currentDay - 1, 8)]?.badge || "Active Day"}
                </p>
              </div>

              {/* Tile 3: Core BFSI Workflows */}
              <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Curriculum Scope
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-700 font-bold">
                    🏛️
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#143d2c]">
                    51 Workflows
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  LOS Origination + FMS + CMS Recovery
                </p>
              </div>

              {/* Tile 4: Exam & Certificate Eligibility */}
              <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Final Exam
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-700 font-bold">
                    🎓
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span
                    className={`text-2xl font-black ${
                      examEligible ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {examEligible ? "Eligible" : "In Progress"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  {examEligible
                    ? "Ready for Day 9 Final Exam"
                    : "Unlocks after Day 1-8 completion"}
                </p>
              </div>
            </div>

            {/* Section Header: Day-by-Day Progression Breakdown */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-[#143d2c] sm:text-xl">
                    Day-by-Day Sprint Progress (Days 1 to 9)
                  </h2>
                  <p className="text-xs text-slate-600 sm:text-sm">
                    Detailed progression, visit timestamps, and completion
                    status reported by the job-program service.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/ninedaysinside?day=${currentDay}`)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
                  >
                    <span>Go to Current Day {currentDay} →</span>
                  </button>
                </div>
              </div>

              {/* Day Cards Grid */}
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {daysList.map((day) => {
                  const isCurrent = day.day === currentDay && !day.completed;

                  return (
                    <div
                      key={day.day}
                      className={`flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition-all duration-200 ${
                        day.completed
                          ? "border-emerald-200 bg-white hover:border-emerald-300 hover:shadow-md"
                          : isCurrent
                            ? "border-emerald-400 bg-white ring-2 ring-emerald-500/25 hover:shadow-lg"
                            : day.isLocked
                              ? "border-slate-200 bg-slate-50/70 opacity-65"
                              : "border-slate-200 bg-white hover:border-emerald-200 hover:shadow-sm"
                      }`}
                    >
                      <div>
                        {/* Card Header: Day Pill & Status Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-black tracking-wide ${
                              day.completed
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : isCurrent
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            Day {day.day}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {day.completed ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-700">
                                ✓ Completed
                              </span>
                            ) : day.progress > 0 || day.visited ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-extrabold uppercase text-amber-700">
                                ⚡ In Progress
                              </span>
                            ) : day.isLocked ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                                🔒 Locked
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 border border-sky-200 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                                🔓 Available
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Category & Badge */}
                        <div className="mt-3 flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                            {day.category}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                            {day.shortBadge}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="mt-2 text-base font-extrabold leading-snug text-slate-900">
                          {day.title}
                        </h3>

                        {/* Scope description */}
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                          {day.count}
                        </p>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                            <span>Progress</span>
                            <span
                              className={
                                day.completed
                                  ? "text-emerald-700 font-extrabold"
                                  : "text-slate-800"
                              }
                            >
                              {day.progress}%
                            </span>
                          </div>
                          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                day.completed
                                  ? "bg-emerald-600"
                                  : day.progress > 0
                                    ? "bg-amber-500"
                                    : "bg-slate-300"
                              }`}
                              style={{ width: `${day.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Additional Meta / Use cases completed */}
                        <div className="mt-3 space-y-1 text-[11px] text-slate-500">
                          {day.useCaseNumbers && (
                            <div className="flex flex-wrap items-center gap-1.5 text-emerald-800 font-semibold">
                              <span>✓ Completed:</span>
                              {parseUseCaseNumbers(day.useCaseNumbers).map(
                                (uc) => (
                                  <span
                                    key={uc}
                                    className="font-mono bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-extrabold border border-emerald-200"
                                  >
                                    {uc}
                                  </span>
                                ),
                              )}
                            </div>
                          )}

                          {day.visitedAt && (
                            <div className="flex items-center gap-1 text-slate-500">
                              <span>Visited:</span>
                              <span>{formatDate(day.visitedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Action Button */}
                      <div className="mt-5 border-t border-slate-100 pt-3">
                        <button
                          type="button"
                          onClick={() => navigate(`/ninedaysinside?day=${day.day}`)}
                          className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition shadow-sm ${
                            day.completed
                              ? "bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-600 hover:text-white"
                              : isCurrent
                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
                                : day.isLocked
                                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                  : "bg-white border border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                          }`}
                        >
                          <span>
                            {day.completed
                              ? "Review Day " + day.day
                              : isCurrent
                                ? "Continue Day " + day.day + " →"
                                : day.isLocked
                                  ? "Locked"
                                  : "Open Day " + day.day + " →"}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 w-full border-t border-emerald-100 bg-[#edf7f1] py-8 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <img
              src={nineDaysLogo}
              alt="9-Days Job Program"
              className="h-8 w-auto object-contain"
            />
            <span>• 9-Days Job Program Dashboard</span>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4 font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => navigate("/ninedaysinside?day=1")}
              className="hover:text-emerald-700"
            >
              Curriculum
            </button>
            <button
              type="button"
              onClick={() => navigate("/ninedaysinside?day=7")}
              className="hover:text-emerald-700"
            >
              AI Project Build
            </button>
            <button
              type="button"
              onClick={() => navigate("/ninedaysinside?day=8")}
              className="hover:text-emerald-700"
            >
              Cloud Deployment
            </button>
            <button
              type="button"
              onClick={() => navigate("/ninedaysinside?day=9")}
              className="hover:text-emerald-700"
            >
              Final Exam
            </button>
            <a
              href="https://www.askoxy.ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-700"
            >
              ASKOXY.AI
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

