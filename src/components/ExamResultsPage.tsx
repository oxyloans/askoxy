import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../Config";
import axios from "axios";
import { message } from "antd";

interface ExamDto {
  question: string;
  questionType: string;
  options: string[];
  openAiAnswer: string[];
  userAnswer: string;
}

const ExamResultsPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as any;
  const userId = localStorage.getItem("userId");
  const { examData, answers, jobId, fileUrl, atsScoreHistoryId } = state || {};

  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();

  // 🔒 Block back AND forward navigation on results page
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      message.warning("You cannot navigate away from the results page.");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // ✅ Build DTO
  const dtos: ExamDto[] = React.useMemo(() => {
    if (!examData?.questions || !answers) return [];
    return examData.questions.map((q: any) => {
      return (
        answers[q.questionId] ?? {
          question: q.question,
          questionType: q.type,
          options: Object.entries(q.options).map(([k, v]) => `${k}. ${v}`),
          openAiAnswer: q.correctAnswers,
          userAnswer: "",
        }
      );
    });
  }, [examData, answers]);

  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    if (!jobId || !userId || dtos.length === 0) return;

    calledRef.current = true;

    const submitScore = async () => {
      try {
        const res = await axios.post(
          `${BASE_URL}/marketing-service/campgin/exam-score-new?jobId=${jobId}&userId=${userId}&atsScoreHistoryId=${atsScoreHistoryId}`,
          dtos,
        );

        //console.log("res.data", res.data);
        setResult(res.data);

        // 🔹 Use backend status (not client-side percentage logic)
        // Store atsScoreViewerId, examPassed, and resumeUrl in sessionStorage and localStorage
        if (res.data?.status === true) {
          sessionStorage.setItem("examPassed", "true");
          sessionStorage.setItem(`examPassed_${jobId}`, "true");
          localStorage.setItem(`examPassed_${jobId}`, "true");
          if (userId) {
            localStorage.setItem(`examPassed_${userId}_${jobId}`, "true");
          }

          if (res.data?.atsScoreViewerId) {
            const vId = String(res.data.atsScoreViewerId);
            sessionStorage.setItem("atsScoreViewerId", vId);
            sessionStorage.setItem(`atsScoreViewerId_${jobId}`, vId);
            localStorage.setItem(`atsScoreViewerId_${jobId}`, vId);
            if (userId) {
              localStorage.setItem(`atsScoreViewerId_${userId}_${jobId}`, vId);
            }
          }

          if (fileUrl) {
            sessionStorage.setItem("resumeUrl", fileUrl);
            sessionStorage.setItem(`resumeUrl_${jobId}`, fileUrl);
            localStorage.setItem(`resumeUrl_${jobId}`, fileUrl);
            if (userId) {
              localStorage.setItem(`resumeUrl_${userId}_${jobId}`, fileUrl);
            }
          }

          if (atsScoreHistoryId) {
            sessionStorage.setItem("atsScoreHistoryId", String(atsScoreHistoryId));
            sessionStorage.setItem(`atsScoreHistoryId_${jobId}`, String(atsScoreHistoryId));
            localStorage.setItem(`atsScoreHistoryId_${jobId}`, String(atsScoreHistoryId));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    submitScore();
  }, [dtos, jobId, userId]);

  // 🔹 Use backend status field — not client-side percentage threshold
  const isPassed = result?.status === true;
  const percentage = result?.percentage ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-start pt-8 sm:pt-16 p-4">
      {/* 🎉 HEADER */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-5 tracking-wide text-slate-800">
        {result
          ? isPassed
            ? "🎉 Congratulations!"
            : "💡 Keep Learning!"
          : "Processing Results..."}
      </h1>

      {/* 🎯 RESULT CARD */}
      {result && (
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center border border-slate-200">
          {/* SCORE CIRCLE */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-5 shadow-md rounded-full">
            <div
              className={`w-full h-full rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold border-4 shadow-inner ${
                isPassed
                  ? "bg-green-50 text-green-600 border-green-500"
                  : "bg-red-50 text-red-600 border-red-500"
              }`}
            >
              {Math.round(percentage)}%
            </div>
          </div>

          {/* SCORE DETAILS */}
          <h2 className="text-[13px] sm:text-sm text-slate-500 mb-1 font-semibold tracking-widest uppercase">
            Final Score
          </h2>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-800 flex items-baseline justify-center gap-1">
            {result.score}{" "}
            <span className="text-lg sm:text-xl text-slate-400 font-medium">
              / {result.totalQuestions}
            </span>
          </h2>

          <div
            className={`inline-block px-4 py-1.5 rounded-lg border font-bold tracking-wider text-xs uppercase shadow-sm ${
              isPassed
                ? "bg-green-50 border-green-200 text-green-600"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            {isPassed ? "Status: Passed" : "Requirement Not Met"}
          </div>

          {/* MESSAGE */}
          <p className="mt-5 text-slate-600 text-xs sm:text-sm leading-relaxed px-1">
            {isPassed
              ? "Excellent performance. You have successfully met the assessment requirements for this position."
              : "Your current score does not meet the eligibility criteria for this application. We encourage you to keep practicing."}
          </p>
        </div>
      )}

      <div className="flex justify-center mt-10">
        {result && isPassed ? (
          <button
            onClick={() => {
              sessionStorage.setItem("examPassed", "true");
              sessionStorage.setItem(`examPassed_${jobId}`, "true");
              localStorage.setItem(`examPassed_${jobId}`, "true");
              if (userId) {
                localStorage.setItem(`examPassed_${userId}_${jobId}`, "true");
              }
              if (fileUrl) {
                sessionStorage.setItem("resumeUrl", fileUrl);
                sessionStorage.setItem(`resumeUrl_${jobId}`, fileUrl);
                localStorage.setItem(`resumeUrl_${jobId}`, fileUrl);
                if (userId) {
                  localStorage.setItem(`resumeUrl_${userId}_${jobId}`, fileUrl);
                }
              }
              if (result?.atsScoreViewerId) {
                const vId = String(result.atsScoreViewerId);
                sessionStorage.setItem("atsScoreViewerId", vId);
                sessionStorage.setItem(`atsScoreViewerId_${jobId}`, vId);
                localStorage.setItem(`atsScoreViewerId_${jobId}`, vId);
                if (userId) {
                  localStorage.setItem(`atsScoreViewerId_${userId}_${jobId}`, vId);
                }
              }
              if (atsScoreHistoryId) {
                sessionStorage.setItem("atsScoreHistoryId", String(atsScoreHistoryId));
                sessionStorage.setItem(`atsScoreHistoryId_${jobId}`, String(atsScoreHistoryId));
                localStorage.setItem(`atsScoreHistoryId_${jobId}`, String(atsScoreHistoryId));
              }
              navigate(`/main/viewjobdetails/${jobId}/ALL`, {
                state: {
                  openApplyModal: true,
                  id: jobId,
                },
                replace: true,
              });
            }}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 rounded-xl font-semibold transition shadow-lg text-white"
          >
            ✅ Complete Final Step
          </button>
        ) : (
          <button
            onClick={() => navigate("/main/viewjobdetails/default/ALL", { replace: true })}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 rounded-xl font-semibold transition shadow-lg text-white"
          >
            🔍 Go to Job Details
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamResultsPage;
