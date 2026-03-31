import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../Config";


import axios from "axios";

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

  const { examData, answers, jobId ,fileUrl} = state || {};
    const [result, setResult] = useState<any>(null);

    const navigate = useNavigate();

  // ✅ Build DTO
  const dtos: ExamDto[] = React.useMemo(() => {
    if (!examData?.questions || !answers) return [];

    return examData.questions.map((q: any) => {
      return answers[q.questionId] ?? {
        question: q.question,
        questionType: q.type,
        options: Object.entries(q.options).map(([k, v]) => `${k}. ${v}`),
        openAiAnswer: q.correctAnswers,
        userAnswer: "",
      };
    });
  }, [examData, answers]);


  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current){
return;
    }
    if (!jobId || !userId || dtos.length === 0) return;

    calledRef.current = true;

    const submitScore = async () => {
      try {
        const res = await axios.post(
          `${BASE_URL}/marketing-service/campgin/exam-score?jobId=${jobId}&userId=${userId}`,
          dtos
        );

        setResult(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    submitScore();
  }, [dtos, jobId, userId]);
const percentage = result?.percentage ?? 0;
  const isPassed = percentage >= 80;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-start pt-8 sm:pt-16 p-4">
      {/* 🎉 HEADER */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-5 tracking-wide">
        {result
          ? isPassed
            ? "🎉 Congratulations!"
            : "💡 Keep Learning!"
          : "Processing Results..."}
      </h1>

      {/* 🎯 RESULT CARD */}
      {result && (
        <div className="w-full max-w-sm bg-gray-900/90 rounded-2xl shadow-xl p-6 text-center border border-gray-700/60 backdrop-blur-sm">

          {/* SCORE CIRCLE */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-5 shadow-lg rounded-full">
            <div
              className={`w-full h-full rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold border-4 shadow-inner ${
                isPassed
                  ? "bg-green-900/20 text-green-400 border-green-500/80"
                  : "bg-red-900/20 text-red-500 border-red-500/80"
              }`}
            >
              {Math.round(percentage)}%
            </div>
          </div>

          {/* SCORE DETAILS */}
          <h2 className="text-[13px] sm:text-sm text-gray-400 mb-1 font-semibold tracking-widest uppercase">
            Final Score
          </h2>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-100 flex items-baseline justify-center gap-1">
            {result.score}{" "}
            <span className="text-lg sm:text-xl text-gray-500 font-medium">
              / {result.totalQuestions}
            </span>
          </h2>

          <div
            className={`inline-block px-4 py-1.5 rounded-lg border font-bold tracking-wider text-xs uppercase shadow-sm ${
              isPassed
                ? "bg-green-500/10 border-green-500/40 text-green-400"
                : "bg-red-500/10 border-red-500/40 text-red-400"
            }`}
          >
            {isPassed ? "Status: Passed" : "Requirement Not Met"}
          </div>

          {/* MESSAGE */}
          <p className="mt-5 text-gray-400 text-xs sm:text-sm leading-relaxed px-1">
            {isPassed
              ? "Excellent performance. You have successfully met the assessment requirements for this position."
              : "A minimum score of 80% is required. Your current score does not meet the eligibility criteria for this application. We encourage you to keep practicing."}
          </p>
        </div>
      )}

      <div className="flex justify-center mt-10">
        {result && isPassed ? (
          <button
            onClick={() => {
              sessionStorage.setItem("examPassed", "true");

              if (fileUrl) {
                sessionStorage.setItem("resumeUrl", fileUrl);
              }

              navigate(`/main/viewjobdetails/${jobId}/ALL`, {
                state: {
                  openApplyModal: true,
                  id: jobId,
                },
              });
            }}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 rounded-xl font-semibold transition shadow-lg"
          >
            ✅ Complete Final Step
          </button>
        ) : (
          <button
            onClick={() => navigate("/main/viewjobdetails/default/ALL")}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 rounded-xl font-semibold transition shadow-lg"
          >
            🔍 Go to Job Details
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamResultsPage;



