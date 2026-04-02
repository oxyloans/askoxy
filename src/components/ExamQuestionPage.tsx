



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
      <div className="mb-4 w-full max-w-xl bg-gray-900/80 border border-gray-700 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        {/* Top gradient highlight bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div className="flex flex-wrap gap-2 justify-between items-center mb-3">
          <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            Question {qIndex + 1} / {totalQ}
          </span>
          
          <span className="bg-gray-800 border border-gray-600 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full shadow-sm">
            {question.type === "single" ? "Single Choice" : "Multiple Choice"}
          </span>
        </div>

        <h2 className="text-lg font-semibold leading-snug text-gray-100 tracking-wide">
          {question.question}
        </h2>
      </div>

      {/* OPTIONS */}
      <div className="w-full max-w-xl space-y-3 mt-2">
        {Object.entries(question.options).map(([key, val]) => {
          const isSelected = selected.includes(key);
          return (
            <div
              key={key}
              onClick={() => handleOptionClick(key)}
              className={`w-full p-3 rounded-xl border transition-all duration-300 cursor-pointer flex items-center gap-3 group ${
                isSelected
                  ? "border-blue-500 bg-blue-900/20 shadow-[0_0_10px_rgba(59,130,246,0.15)]"
                  : "border-gray-700 bg-gray-800/40 hover:border-gray-500 hover:bg-gray-800/80"
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-colors ${
                  isSelected ? "border-blue-500" : "border-gray-500 group-hover:border-gray-400"
                }`}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
                )}
              </div>
              <span className={`text-base transition-colors leading-snug ${
                isSelected ? "text-blue-300 font-medium" : "text-gray-300 group-hover:text-white"
              }`}>
                <span className="font-bold mr-3 text-gray-500">{key.toUpperCase()}.</span>
                {String(val)}
              </span>
            </div>
          );
        })}
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









