
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import Swal from "sweetalert2";

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
  if (jobId) sessionStorage.setItem("lastExamJobId", jobId);
  const fileUrl=state?.fileUrl;
  const from = state?.from || sessionStorage.getItem("examSourceUrl");

  useEffect(() => {
    if (from && !from.includes("/exam")) {
      sessionStorage.setItem("examSourceUrl", from);
    }
  }, [from]);

  useEffect(() => {
    if (examData && !sessionStorage.getItem("examData")) {
      sessionStorage.setItem("examData", JSON.stringify(examData));
    }
  }, [examData]);

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
  const fromRef = useRef(from);
  const jobIdRef = useRef(jobId);

  useEffect(() => { questionRef.current = question; }, [question]);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { qIndexRef.current = qIndex; }, [qIndex]);
  useEffect(() => { totalQRef.current = totalQ; }, [totalQ]);
  useEffect(() => { fromRef.current = from; }, [from]);
  useEffect(() => { jobIdRef.current = jobId; }, [jobId]);

  const confirmLeaveExam = useCallback(() => {
    Swal.fire({
      title: "Leave Exam?",
      text: "You are about to leave the exam. If you go back, your exam session will be terminated. Please stay on this page to complete your exam.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Leave Exam",
      cancelButtonText: "Stay",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("examData");
        sessionStorage.removeItem("answers");

        const returnUrl = fromRef.current || sessionStorage.getItem("examSourceUrl");
        sessionStorage.removeItem("examSourceUrl");

        if (returnUrl && !returnUrl.includes("/exam")) {
          navigate(returnUrl, { replace: true });
          return;
        }

        const fallbackJobId = jobIdRef.current || sessionStorage.getItem("lastExamJobId");
        const token = localStorage.getItem("accessToken");
        const uid = localStorage.getItem("userId");
        const isAskOxy =
          sessionStorage.getItem("lastExamSourceType") === "askoxy" ||
          window.location.pathname.includes("askoxy");

        if (isAskOxy) {
          const prefix = token && uid ? "/main/askoxyjobs" : "/askoxyjobs";
          if (fallbackJobId) {
            navigate(`${prefix}/${fallbackJobId}`, { replace: true });
          } else {
            navigate(prefix, { replace: true });
          }
          return;
        }

        const prefix = token && uid ? "/main/viewjobdetails" : "/viewjobdetails";
        if (fallbackJobId) {
          navigate(`${prefix}/${fallbackJobId}/ALL`, { replace: true });
        } else {
          navigate(
            token && uid
              ? "/main/viewjobdetails/default/ALL"
              : "/viewjobdetails/default/ALL",
            { replace: true }
          );
        }
      }
    });
  }, [navigate]);

  // 🔒 Block browser back AND forward navigation during exam
  useEffect(() => {
    window.history.pushState({ isExamTrap: true }, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState({ isExamTrap: true }, "", window.location.href);
      confirmLeaveExam();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [confirmLeaveExam]);

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
          replace: true,
          state: {
            examData,
            jobDesignation,
            companyName,
            matchScore,
            answers: newAnswers,
            jobId,
            fileUrl,
            atsScoreHistoryId,
            from: from || sessionStorage.getItem("examSourceUrl"),
          },
        });
      } else {
        navigate(`/main/exam/question/${nextQ}`, {
          replace: true,
          state: {
            examData,
            jobDesignation,
            companyName,
            matchScore,
            answers: newAnswers,
            jobId,
            fileUrl,
            atsScoreHistoryId,
            from: from || sessionStorage.getItem("examSourceUrl"),
          },
        });
      }
    }, 200);

  }, [
    navigate,
    examData,
    jobDesignation,
    companyName,
    matchScore,
    jobId,
    fileUrl,
    atsScoreHistoryId,
    from,
  ]);

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

  const isLastQuestion = qIndex + 1 === totalQ;
  const handleSubmit = () => advance(selected);

  // ❌ SAFETY — exam data lost (back/forward navigation)
  useEffect(() => {
    if (!examData) {
      const returnUrl = from || sessionStorage.getItem("examSourceUrl");
      if (returnUrl && !returnUrl.includes("/exam")) {
        sessionStorage.removeItem("examSourceUrl");
        navigate(returnUrl, { replace: true });
        return;
      }
      const fallbackJobId = jobId || sessionStorage.getItem("lastExamJobId");
      const token = localStorage.getItem("accessToken");
      const uid = localStorage.getItem("userId");
      const isAskOxy =
        sessionStorage.getItem("lastExamSourceType") === "askoxy" ||
        window.location.pathname.includes("askoxy");

      if (isAskOxy) {
        const prefix = token && uid ? "/main/askoxyjobs" : "/askoxyjobs";
        if (fallbackJobId) {
          navigate(`${prefix}/${fallbackJobId}`, { replace: true });
        } else {
          navigate(prefix, { replace: true });
        }
        return;
      }

      const prefix = token && uid ? "/main/viewjobdetails" : "/viewjobdetails";
      if (fallbackJobId) {
        navigate(`${prefix}/${fallbackJobId}/ALL`, { replace: true });
      } else {
        navigate(token && uid ? "/main/viewjobdetails/default/ALL" : "/viewjobdetails/default/ALL", { replace: true });
      }
    }
  }, [examData, from, jobId, navigate]);

  if (!examData) return null;

  if (!question) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-4">

      {/* HEADER */}
      <div className="mb-4 w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        {/* Top gradient highlight bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <div className="flex flex-wrap gap-2 justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50/80 border border-blue-200 text-blue-600 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Question {qIndex + 1} / {totalQ}
            </span>

            <span className="bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium px-2.5 py-0.5 rounded-full shadow-sm">
              {question.type === "single" ? "Single Choice" : "Multiple Choice"}
            </span>
          </div>

          {/* <button
            type="button"
            onClick={confirmLeaveExam}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-semibold px-2.5 py-1 rounded-lg border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            Leave Exam
          </button> */}
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
          onClick={() => advance([])}
          className="px-8 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition"
        >
          Skip
        </button>

        <button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLastQuestion ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default ExamQuestionPage;









