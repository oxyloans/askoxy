
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

      const  atsScoreHistoryId  = state?.atsScoreHistoryId;



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


  useEffect(() => {

    console.log("atsScoreHistoryId in state:", state);
    console.log("atsScoreHistoryId in state:", atsScoreHistoryId);
  }, []);

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
          state: { examData, jobDesignation, companyName, matchScore, answers: newAnswers, jobId,fileUrl,atsScoreHistoryId},
        });
      } else {
        navigate(`/main/exam/question/${nextQ}`, {
          state: { examData, jobDesignation, companyName, matchScore, answers: newAnswers, jobId ,fileUrl,atsScoreHistoryId},
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
      <div className="min-h-screen flex items-center justify-center text-slate-800 bg-white">
        Loading exam...
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-800 bg-white">
        Invalid question
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-4">

      {/* HEADER */}
      <div className="mb-4 w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        {/* Top gradient highlight bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <div className="flex flex-wrap gap-2 justify-between items-center mb-3">
          <span className="bg-blue-50/80 border border-blue-200 text-blue-600 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            Question {qIndex + 1} / {totalQ}
          </span>

          <span className="bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium px-2.5 py-0.5 rounded-full shadow-sm">
            {question.type === "single" ? "Single Choice" : "Multiple Choice"}
          </span>
        </div>

        <h2 className="text-lg font-semibold leading-snug text-slate-800 tracking-wide">
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
                  ? "border-blue-500 bg-blue-50/50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-colors ${
                  isSelected ? "border-blue-500" : "border-slate-300 group-hover:border-slate-400"
                }`}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
                )}
              </div>
              <span className={`text-base transition-colors leading-snug ${
                isSelected ? "text-blue-700 font-medium" : "text-slate-700 group-hover:text-slate-900"
              }`}>
                <span className="font-bold mr-3 text-slate-400">{key.toUpperCase()}.</span>
                {String(val)}
              </span>
            </div>
          );
        })}
      </div>

      {/* TIMER */}
      <div className="mt-5 text-lg font-medium text-slate-700">
        Time Left: <span className="font-bold text-slate-900">{timeLeft}s</span>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>

        <button
          onClick={() => advance([])}
          className="px-8 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default ExamQuestionPage;









