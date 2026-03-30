


import { Button } from "antd";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface ExamDto {
  question: string;
  questionType: string;
  options: string[];
  openAiAnswer: string[];
  userAnswer: string;
}

const QUESTION_TIME = 60;

const ExamQuestionPage: React.FC = () => {
  const { questionNumber } = useParams<{ questionNumber: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 Get from state OR sessionStorage
  const state = location.state as any;

  const examData =
    state?.examData ||
    JSON.parse(sessionStorage.getItem("examData") || "null");

  const answers =
    state?.answers ||
    JSON.parse(sessionStorage.getItem("answers") || "{}");

  const jobDesignation = state?.jobDesignation;
  const companyName = state?.companyName;
  const matchScore = state?.matchScore;
  const jobId = state?.jobId;
  const fileUrl=state?.fileUrl;

  const qIndex = parseInt(questionNumber ?? "1", 10) - 1;
  const question = examData?.questions?.[qIndex];
  const totalQ: number = examData?.questions?.length ?? 0;

  const [selected, setSelected] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAdvanced = useRef(false);

  // refs to avoid stale issues
  const questionRef = useRef(question);
  const answersRef = useRef(answers);
  const qIndexRef = useRef(qIndex);
  const totalQRef = useRef(totalQ);

  useEffect(() => { questionRef.current = question; }, [question]);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { qIndexRef.current = qIndex; }, [qIndex]);
  useEffect(() => { totalQRef.current = totalQ; }, [totalQ]);

  // 🚀 ADVANCE FUNCTION
  const advance = useCallback((chosenKeys: string[]) => {
    if (hasAdvanced.current) return;
    hasAdvanced.current = true;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const q = questionRef.current;
    if (!q) return;

    const optionsList = Object.entries(q.options).map(
      ([k, v]) => `${k}. ${v}`
    );

    const dto: ExamDto = {
      question: q.question,
      questionType: q.type,
      options: optionsList,
      openAiAnswer: q.correctAnswers,
      userAnswer: [...chosenKeys].sort().join(","),
    };

    const newAnswers = { ...answersRef.current, [q.questionId]: dto };

    // ✅ SAVE answers
    sessionStorage.setItem("answers", JSON.stringify(newAnswers));

    const nextQ = qIndexRef.current + 2;

    setTimeout(() => {
      if (nextQ > totalQRef.current) {
        navigate("/main/exam/results", {
          state: { examData, jobDesignation, companyName, matchScore, answers: newAnswers, jobId,fileUrl},
        });
      } else {
        navigate(`/main/exam/question/${nextQ}`, {
          state: { examData, jobDesignation, companyName, matchScore, answers: newAnswers, jobId ,fileUrl},
        });
      }
    }, 200);

  }, [navigate, examData, jobDesignation, companyName, matchScore]);

  // ⏱️ TIMER
  useEffect(() => {
    hasAdvanced.current = false;
    setSelected([]);
    setTimeLeft(QUESTION_TIME);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;

          setTimeout(() => advance([]), 0); // auto move
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [questionNumber]);

  // 🧠 OPTION SELECT
  const handleOptionClick = (key: string) => {
    if (!question) return;

    if (question.type === "single") {
      setSelected([key]);
    } else {
      setSelected((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
    }
  };

  const handleSubmit = () => advance(selected);

  // ❌ SAFETY
  if (!examData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading exam...
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Invalid question
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">

      {/* HEADER */}
      <div className="mb-6 w-full max-w-xl">
        <p className="text-sm text-gray-400">
          Question {qIndex + 1} / {totalQ}
        </p>

        {/* ✅ ONLY Single / Multiple */}
        <p className="text-sm font-semibold mt-1">
          {question.type === "single" ? "Single" : "Multiple"}
        </p>

        <h2 className="text-xl font-bold mt-2">
          {question.question}
        </h2>
      </div>

      {/* OPTIONS */}
      <div className="w-full max-w-xl space-y-3">
        {Object.entries(question.options).map(([key, val]) => (
          <Button
            key={key}
            onClick={() => handleOptionClick(key)}
            className={`w-full p-3 rounded border text-left ${
              selected.includes(key)
                ? "bg-blue-600 border-blue-400"
                : "bg-white-800 border-gray-700"
            }`}
          >
              {`${key}. ${val}`}


          </Button>
        ))}
      </div>

      {/* TIMER */}
      <div className="mt-5 text-lg">
        Time Left: {timeLeft}s
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          className="px-6 py-2 bg-green-600 rounded disabled:opacity-50"
        >
          Next
        </button>

        <button
          onClick={() => advance([])}
          className="px-6 py-2 bg-gray-600 rounded"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default ExamQuestionPage;









