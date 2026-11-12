import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import BASE_URL from "../Config";
import {
  NINE_DAYS_USE_CASES,
  getUseCaseCode,
  parseUseCaseNumbers,
} from "../Jobplan/nineDaysUseCasesData";

export type NineDaysUseCaseLink = {
  day: number;
  useCaseId: string;
  title: string;
  module: "lo-system-9days" | "fm-system-9days" | "cm-system-9days";
};

export const NINE_DAYS_CONTEXT_KEY = "nineDaysPlanUseCases";
export const NINE_DAYS_DAY_KEY = "nineDaysSelectedDay";
export const NINE_DAYS_VIEW_KEY = "nineDaysPlanViewType";

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

export default function NineDaysUseCaseNavigation({
  useCaseId,
  viewType,
}: {
  useCaseId?: string;
  viewType: string;
}) {
  const navigate = useNavigate();

  // All 51 use case links (read from sessionStorage or fallback to NINE_DAYS_USE_CASES)
  const links = useMemo<NineDaysUseCaseLink[]>(() => {
    try {
      const parsed = JSON.parse(
        sessionStorage.getItem(NINE_DAYS_CONTEXT_KEY) || "[]",
      );
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // ignore
    }
    return NINE_DAYS_USE_CASES.map((uc) => ({
      day: uc.day,
      useCaseId: uc.path,
      title: uc.title,
      module: uc.module,
    }));
  }, []);

  const index = links.findIndex((item) => item.useCaseId === useCaseId);
  const currentItem = index >= 0 ? links[index] : null;

  // Determine current day from current item or sessionStorage
  const currentDay = useMemo(() => {
    if (currentItem?.day) return currentItem.day;
    const stored = sessionStorage.getItem(NINE_DAYS_DAY_KEY);
    return stored ? Number(stored) : 1;
  }, [currentItem]);

  // Links for this day specifically
  const dayLinks = useMemo(() => {
    return links.filter((item) => item.day === currentDay);
  }, [links, currentDay]);

  // Index of this use case within the day
  const indexInDay = useMemo(() => {
    const idx = dayLinks.findIndex((item) => item.useCaseId === useCaseId);
    return idx >= 0 ? idx : 0;
  }, [dayLinks, useCaseId]);

  // Use Case code: UC-01, UC-02, etc.
  const ucCode = useMemo(() => {
    return getUseCaseCode(indexInDay);
  }, [indexInDay]);

  const mode = viewType === "system" ? "system" : "business";

  // Track completed use cases for current day
  const [completedUseCases, setCompletedUseCases] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(
        `job_program_completed_ucs_day_${currentDay}`,
      );
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCompleting, setIsCompleting] = useState<boolean>(false);

  // Sync completed use cases whenever currentDay or useCaseId changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        `job_program_completed_ucs_day_${currentDay}`,
      );
      setCompletedUseCases(saved ? JSON.parse(saved) : []);
    } catch {
      setCompletedUseCases([]);
    }
  }, [currentDay, useCaseId]);

  // Fetch and parse useCaseNumbers from API GET call on mount & currentDay change
  // Separates "UC-01,UC-02,UC-03", marks them as completed, and unlocks next use case
  const fetchDayUseCaseStatus = useCallback(async () => {
    const resolvedUserId =
      new URLSearchParams(window.location.search).get("userId") ||
      new URLSearchParams(window.location.search).get("userid") ||
      localStorage.getItem("userId") ||
      localStorage.getItem("userid") ||
      localStorage.getItem("customerId") ||
      sessionStorage.getItem("userId") ||
      sessionStorage.getItem("userid") ||
      "292b5593-d938-42c2-8daa-6494c4096cf1";

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

    for (const targetUrl of urlsToTry) {
      try {
        const res = await axios.get(targetUrl, {
          headers: { Accept: "application/json" },
          timeout: 8000,
        });
        const d = res?.data;
        if (d && Array.isArray(d.days)) {
          const thisDayData = d.days.find(
            (item: any) => item?.dayNumber === currentDay,
          );
          if (thisDayData?.useCaseNumbers) {
            const parsed = parseUseCaseNumbers(thisDayData.useCaseNumbers);
            if (parsed.length > 0) {
              const existingStr = localStorage.getItem(
                `job_program_completed_ucs_day_${currentDay}`,
              );
              const existing: string[] = existingStr
                ? JSON.parse(existingStr)
                : [];
              const merged = Array.from(new Set([...existing, ...parsed]));
              localStorage.setItem(
                `job_program_completed_ucs_day_${currentDay}`,
                JSON.stringify(merged),
              );
              setCompletedUseCases(merged);
            }
          }
          break;
        }
      } catch {
        // continue
      }
    }
  }, [currentDay]);

  useEffect(() => {
    fetchDayUseCaseStatus();
  }, [fetchDayUseCaseStatus]);

  // Check if current use case is already completed
  const isCurrentCompleted = useMemo(() => {
    return completedUseCases.includes(ucCode);
  }, [completedUseCases, ucCode]);

  // Check if current use case is unlocked (requires interest registration first)
  const isUnlocked = useMemo(() => {
    const uid =
      new URLSearchParams(window.location.search).get("userId") ||
      new URLSearchParams(window.location.search).get("userid") ||
      localStorage.getItem("userId") ||
      localStorage.getItem("userid") ||
      localStorage.getItem("customerId") ||
      sessionStorage.getItem("userId") ||
      sessionStorage.getItem("userid") ||
      "";
    const isRegistered =
      localStorage.getItem("job_program_registered") === "true" ||
      (uid && localStorage.getItem(`job_program_registered_${uid}`) === "true") ||
      Boolean(localStorage.getItem("job_program_enrollment_id"));

    if (!isRegistered) return false;

    if (indexInDay <= 0) return true;
    const prevCode = getUseCaseCode(indexInDay - 1);
    return completedUseCases.includes(prevCode);
  }, [indexInDay, completedUseCases]);

  const open = (item: NineDaysUseCaseLink) => {
    sessionStorage.setItem(NINE_DAYS_DAY_KEY, String(item.day));
    sessionStorage.setItem(NINE_DAYS_VIEW_KEY, mode);
    sessionStorage.setItem(NINE_DAYS_CONTEXT_KEY, JSON.stringify(links));
    navigate(`/${item.module}/${item.useCaseId}/${mode}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const switchMode = (nextMode: "business" | "system") => {
    if (index < 0) return;
    sessionStorage.setItem(NINE_DAYS_VIEW_KEY, nextMode);
    navigate(`/${links[index].module}/${links[index].useCaseId}/${nextMode}`);
  };

  const backToPlan = () => {
    const day = currentDay || sessionStorage.getItem(NINE_DAYS_DAY_KEY) || "1";
    navigate(`/ninedaysdayworkflow?day=${day}`);
  };

  // Helper to trigger start of next day when a day's use cases are all finished
  const triggerNextDayStart = async (nextDayNum: number) => {
    if (nextDayNum > 6) return;
    const eId =
      localStorage.getItem("job_program_enrollment_id") ||
      "304553fb-14cc-4656-a67d-de4a13ee1288";

    const directUrl = `http://65.0.147.157:9229/api/marketing-service/campgin/job-program/start?dayNumber=${nextDayNum}&enrollmentId=${encodeURIComponent(
      eId,
    )}`;
    const fallbackUrl = `${BASE_URL}/marketing-service/campgin/job-program/start?dayNumber=${nextDayNum}&enrollmentId=${encodeURIComponent(
      eId,
    )}`;

    const isHttps =
      typeof window !== "undefined" && window.location.protocol === "https:";
    const urlsToTry = isHttps
      ? [fallbackUrl, directUrl]
      : [directUrl, fallbackUrl];

    for (const targetUrl of urlsToTry) {
      try {
        let resData: any = null;
        try {
          const res = await axios.post(targetUrl, null, {
            headers: { Accept: "application/json" },
            timeout: 10000,
          });
          resData = res?.data;
        } catch (err: any) {
          if (err?.response?.status === 405) {
            const resGet = await axios.get(targetUrl, {
              headers: { Accept: "application/json" },
              timeout: 10000,
            });
            resData = resGet?.data;
          }
        }

        if (resData) {
          const newDayId = resData.data?.id || resData.id;
          if (newDayId) {
            localStorage.setItem("job_program_day_progress_id", newDayId);
          }
          localStorage.setItem("job_program_current_day", String(nextDayNum));
          break;
        }
      } catch {
        // continue
      }
    }
  };

  // Complete and Unlock Next Use Case handler
  const handleCompleteAndUnlockNext = async () => {
    if (isCompleting) return;

    if (!isUnlocked) {
      Toast.fire({
        icon: "warning",
        title: `Please complete ${getUseCaseCode(indexInDay - 1)} first.`,
      });
      return;
    }

    setIsCompleting(true);

    const activeDayProgressId =
      localStorage.getItem("job_program_day_progress_id") ||
      "006e4f60-ea5d-4777-b6f7-9d3bf1007900";

    const directUrl = `http://65.0.147.157:9229/api/marketing-service/campgin/job-program/update/${encodeURIComponent(
      activeDayProgressId,
    )}/${encodeURIComponent(ucCode)}`;
    const fallbackUrl = `${BASE_URL}/marketing-service/campgin/job-program/update/${encodeURIComponent(
      activeDayProgressId,
    )}/${encodeURIComponent(ucCode)}`;

    const isHttps =
      typeof window !== "undefined" && window.location.protocol === "https:";
    const urlsToTry = isHttps
      ? [fallbackUrl, directUrl]
      : [directUrl, fallbackUrl];

    let updateSuccess = false;
    let respMsg = "";

    for (const targetUrl of urlsToTry) {
      try {
        let resData: any = null;
        try {
          const res = await axios.post(targetUrl, null, {
            headers: { Accept: "application/json" },
            timeout: 10000,
          });
          resData = res?.data;
        } catch (postErr: any) {
          if (postErr?.response?.status === 405) {
            try {
              const resPut = await axios.put(targetUrl, null, {
                headers: { Accept: "application/json" },
                timeout: 10000,
              });
              resData = resPut?.data;
            } catch (putErr: any) {
              if (putErr?.response?.status === 405) {
                const resGet = await axios.get(targetUrl, {
                  headers: { Accept: "application/json" },
                  timeout: 10000,
                });
                resData = resGet?.data;
              } else {
                throw putErr;
              }
            }
          } else if (postErr?.response?.data) {
            resData = postErr.response.data;
          } else {
            throw postErr;
          }
        }

        if (resData) {
          updateSuccess =
            resData.status === "SUCCESS" ||
            resData.data?.completed ||
            Boolean(resData.data);
          respMsg = resData.message || `${ucCode} completed successfully.`;

          // Parse useCaseNumbers from update API response (e.g. "UC-01,UC-02,UC-03")
          const rawUcs = resData.data?.useCaseNumbers || resData.useCaseNumbers;
          if (rawUcs) {
            const parsed = parseUseCaseNumbers(rawUcs);
            if (parsed.length > 0) {
              const existingStr = localStorage.getItem(
                `job_program_completed_ucs_day_${currentDay}`,
              );
              const existing: string[] = existingStr ? JSON.parse(existingStr) : [];
              const merged = Array.from(new Set([...existing, ...parsed, ucCode]));
              localStorage.setItem(
                `job_program_completed_ucs_day_${currentDay}`,
                JSON.stringify(merged),
              );
              setCompletedUseCases(merged);
            }
          }
          break;
        }
      } catch (err: any) {
        console.warn(`[NineDays] Error updating ${ucCode}:`, err);
        respMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Could not update use case.";
      }
    }

    setIsCompleting(false);

    // If API responded with SUCCESS or status is verified
    if (
      updateSuccess ||
      respMsg.toLowerCase().includes("completed") ||
      respMsg.toLowerCase().includes("success")
    ) {
      const updatedList = Array.from(new Set([...completedUseCases, ucCode]));
      setCompletedUseCases(updatedList);
      localStorage.setItem(
        `job_program_completed_ucs_day_${currentDay}`,
        JSON.stringify(updatedList),
      );

      // Check if all use cases for this day are completed
      const isDayFullyCompleted = updatedList.length >= dayLinks.length;

      if (isDayFullyCompleted && currentDay < 6) {
        await triggerNextDayStart(currentDay + 1);
        Toast.fire({
          icon: "success",
          title: `🎉 All Day ${currentDay} use cases completed! Day ${currentDay + 1} is now unlocked!`,
        });
      } else {
        Toast.fire({
          icon: "success",
          title: respMsg || `${ucCode} completed successfully!`,
        });
      }

      // Automatically open and unlock next use case
      if (index >= 0 && index < links.length - 1) {
        const nextItem = links[index + 1];
        open(nextItem);
      } else if (index >= links.length - 1) {
        Toast.fire({
          icon: "success",
          title:
            "🎉 Congratulations! You have completed all 51 Banking Use Cases!",
        });
        navigate("/ninedaysdayworkflow?day=9");
      }
    } else {
      Toast.fire({
        icon: "error",
        title: respMsg || "Failed to update use case. Please try again.",
      });
    }
  };

  return (
    <nav
      className="sticky top-16 z-30 border-b border-emerald-100 bg-white/95 py-3 shadow-sm backdrop-blur-md md:top-20"
      aria-label="9-day job program use-case navigation"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
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
            <span className="text-emerald-600">Day {links[index].day}</span> •{" "}
            <span className="text-slate-900 font-extrabold">{ucCode}</span>:{" "}
            {links[index].title} (Use Case {indexInDay + 1} of {dayLinks.length || 8})
          </span>
        )}

        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            disabled={index <= 0}
            onClick={() => open(links[index - 1])}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:py-2 sm:text-sm"
          >
            Previous
          </button>

          {/* Locked State Warning if user jumped to locked use case */}
          {!isUnlocked && !isCurrentCompleted && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-800">
              🔒 Locked ({indexInDay === 0 ? "Interest required" : `${getUseCaseCode(indexInDay - 1)} required`})
            </span>
          )}

          {/* If already completed: show Completed badge and Next Use Case button */}
          {isCurrentCompleted ? (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 text-xs font-black text-emerald-800 shadow-sm">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                  ✓
                </span>
                Completed
              </span>

              <button
                disabled={index < 0 || index >= links.length - 1}
                onClick={() => open(links[index + 1])}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:py-2 sm:text-sm"
              >
                Next Use Case →
              </button>
            </>
          ) : (
            /* Not completed yet: show Complete & Unlock Next button */
            <button
              type="button"
              onClick={handleCompleteAndUnlockNext}
              disabled={isCompleting || !isUnlocked}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-sm transition hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:py-2 sm:text-sm"
              title={`Complete ${ucCode} and unlock next use case`}
            >
              {isCompleting ? (
                <>
                  <svg
                    className="h-3.5 w-3.5 animate-spin text-white"
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
                  <span>Completing {ucCode}...</span>
                </>
              ) : (
                <>
                  <span>✓ Complete & Unlock Next</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
