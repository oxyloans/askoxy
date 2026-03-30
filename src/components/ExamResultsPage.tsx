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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center p-6">

      {/* 🎉 HEADER */}
      <h1 className="text-4xl font-extrabold text-center mb-8 tracking-wide">
        🎉Congratulations Exam Completed
      </h1>

      {/* 🎯 RESULT CARD */}
      {result && (
        <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-8 text-center border border-gray-700">

          {/* SCORE CIRCLE */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div
              className={`w-full h-full rounded-full flex items-center justify-center text-2xl font-bold
              ${isPassed ? "bg-green-600" : "bg-red-600"}`}
            >
              {Math.round(percentage)}%
            </div>
          </div>

          {/* SCORE DETAILS */}
          <h2 className="text-lg text-gray-400 mb-2">
            Your Score
          </h2>

          <h2 className="text-2xl font-bold mb-2">
            {result.score} / {result.totalQuestions}
          </h2>

          <h2
            className={`text-xl font-bold mt-4 ${
              isPassed ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPassed ? "PASS ✅" : "FAIL ❌"}
          </h2>

          {/* MESSAGE */}
          <p className="mt-4 text-gray-400 text-sm">
            {isPassed
              ? "Great job! You have successfully passed the exam."
              : "You need at least 80% to pass. Keep practicing!"}
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
      onClick={() => navigate("/main/viewjobdetails")}
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



