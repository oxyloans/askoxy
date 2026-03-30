
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, message, Spin } from "antd";
import {
  CheckCircleOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  BulbOutlined,
  RocketOutlined,
  ArrowLeftOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";




type ExamStatus = "polling" | "ready" | "failed";

const ExamPage: React.FC = () => {

  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as any;
  const { runId, threadId, jobDesignation, companyName, matchScore, jobId ,fileUrl} = state || {};

  const [examData, setExamData] = useState<any>(null);
  const [examStatus, setExamStatus] = useState<ExamStatus>("polling");
  const [pollProgress, setPollProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCount = useRef(0);
  const maxPolls = 60;

  useEffect(() => {

    if (!userId) {
      message.warning("Please login to submit your interest.");
      navigate("/whatsapplogin");
      sessionStorage.setItem(
        "redirectPath",
        `/main/viewjobdetails/${jobId}/${companyName}`,
      );
      return;
    }


    if (!runId || !threadId) { setExamStatus("failed"); return; }
    startPolling();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const startPolling = () => {
    checkExamStatus();
    intervalRef.current = setInterval(async () => {
      pollCount.current += 1;
      setPollProgress(Math.min((pollCount.current / maxPolls) * 100, 95));
      if (pollCount.current >= maxPolls) {
        clearInterval(intervalRef.current!);
        setExamStatus("failed");
        return;
      }
      const done = await checkExamStatus();
      if (done) clearInterval(intervalRef.current!);
    }, 5000);
  };

  const checkExamStatus = async (): Promise<boolean> => {
    try {
      const res = await axios.get(
        `${BASE_URL}/marketing-service/campgin/exam-status?runId=${runId}&threadId=${threadId}`
      );
      if (res.data?.status === "completed" && res.data?.exam) {
        setExamData(res.data.exam);
        setExamStatus("ready");
        setPollProgress(100);
        return true;
      }
      return false;
    } catch {
      setExamStatus("failed");
      return true;
    }
  };

  const handleStart = () => {
    if (!examData) return;
    navigate(`/main/exam/question/1`, {
      state: {
        examData,
        jobDesignation,
        companyName,
        matchScore,
        answers: {},
        jobId,
        fileUrl,
      },
    });
  };

  if (examStatus === "polling") {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/8 rounded-full blur-[120px]" />
        <div className="relative z-10 text-center max-w-lg w-full">
          <div className="relative w-44 h-44 mx-auto mb-10">
            <svg className="w-44 h-44 -rotate-90" viewBox="0 0 176 176">
              <circle cx="88" cy="88" r="76" fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth="6" />
              <circle cx="88" cy="88" r="76" fill="none" stroke="url(#pg)" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 76}`}
                strokeDashoffset={`${2 * Math.PI * 76 * (1 - pollProgress / 100)}`}
                strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
              <defs>
                <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-black text-white" style={{ fontFamily: "Syne, sans-serif" }}>{Math.round(pollProgress)}%</div>
                <div className="text-indigo-400 text-[10px] uppercase tracking-[3px] mt-1">Ready</div>
              </div>
            </div>
          </div>
          <div className="mb-4 flex items-center justify-center gap-2">
            {[0, 150, 300].map((d) => (
              <div key={d} className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
            ))}
          </div>
          <h1 className="text-3xl font-black text-white mb-3" style={{ fontFamily: "Syne, sans-serif" }}>Crafting Your Exam</h1>
          <p className="text-slate-400 text-base mb-8">AI is generating your custom assessment. This takes 30–60 seconds.</p>
          <div className="bg-white/4 border border-white/8 rounded-2xl p-5 text-left space-y-3">
            {["Analyzing job requirements", "Matching your skill profile", "Generating custom questions", "Finalizing difficulty levels"].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${pollProgress > (i + 1) * 22 ? "bg-indigo-500" : "bg-white/8"}`}>
                  {pollProgress > (i + 1) * 22 ? <CheckCircleOutlined className="text-white text-[10px]" /> : <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />}
                </div>
                <span className={`text-sm font-medium transition-colors ${pollProgress > (i + 1) * 22 ? "text-white" : "text-slate-500"}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (examStatus === "failed") {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-black text-white mb-3">Exam Generation Failed</h2>
          <p className="text-slate-400 mb-8">We couldn't generate your exam. Please try again.</p>
          <Button size="large" onClick={() => navigate(-1)} className="!bg-indigo-600 !border-0 !text-white !rounded-2xl !font-bold !h-12 !px-8">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] pb-20">
      {/* <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        .s { font-family: 'Syne', sans-serif; }
        .d { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="sticky top-0 z-50 bg-[#070b14]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between d">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeftOutlined /> Back
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Exam Ready</span>
          </div>
        </div>
      </div> */}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 space-y-8 d">
        {/* Hero */}
        <div className="relative rounded-[32px] overflow-hidden p-8 sm:p-12" style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81 60%,#1e1b4b)" }}>
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-3xl flex-shrink-0 flex items-center justify-center shadow-[0_12px_40px_rgba(251,191,36,0.35)]"
                style={{ background: "linear-gradient(135deg,#fbbf24,#f59e0b)" }}>
                <TrophyOutlined className="text-white text-4xl" />
              </div>
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 rounded-lg text-xs font-black" style={{ background: "rgba(251,191,36,0.2)", color: "#fbbf24" }}>🎉 CONGRATULATIONS</span>
                  <span className="px-3 py-1 rounded-lg text-xs font-black" style={{ background: "rgba(16,185,129,0.2)", color: "#34d399" }}>ATS {matchScore}% MATCH</span>
                </div>
                <h1 className="s text-2xl sm:text-3xl font-black text-white mb-1">You're Selected for the Exam!</h1>
                <p className="text-indigo-200 text-base">{jobDesignation} · {companyName}</p>
              </div>
            </div>
            <p className="text-indigo-200 text-base leading-relaxed max-w-2xl mb-8">
              Your profile cleared the 80% threshold. Complete this AI-generated skills assessment — one question at a time, 60 seconds each — to advance your application.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <FileTextOutlined />, label: "Questions", value: examData?.totalQuestions ?? "—" },
                { icon: <ClockCircleOutlined />, label: "Per Question", value: "1 min" },
                { icon: <ThunderboltOutlined />, label: "Difficulty", value: examData?.difficultyLevel ?? "—" },
                { icon: <BulbOutlined />, label: "Skills", value: examData?.summary?.skillsCovered?.length ?? "—" },
              ].map((s2) => (
                <div key={s2.label} className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-indigo-300 text-lg mb-1">{s2.icon}</div>
                  <div className="s text-white font-black text-xl">{s2.value}</div>
                  <div className="text-indigo-300 text-xs uppercase tracking-wider mt-0.5">{s2.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        {examData && (
          <div className="bg-white/4 border border-white/8 rounded-[24px] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)" }}>
                <BulbOutlined className="text-amber-400 text-lg" />
              </div>
              <div>
                <h3 className="s text-white font-black text-lg leading-none">Instructions</h3>
                <p className="text-slate-400 text-sm mt-0.5">Read carefully before starting</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm italic leading-relaxed mb-5 pl-4 border-l-2 border-indigo-500">
              "{examData.instructions?.description}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {examData.instructions?.rules?.map((rule: string, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-white/4 border border-white/5 rounded-xl p-3">
                  <CheckCircleOutlined className="text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{rule}</span>
                </div>
              ))}
              <div className="flex items-start gap-3 rounded-xl p-3 border" style={{ background: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.2)" }}>
                <ClockCircleOutlined className="text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-amber-300 text-sm font-medium">60 seconds per question — auto-advances when time runs out.</span>
              </div>
            </div>
            <div className="pt-5 border-t border-white/5">
              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-3">Skills Assessed</p>
              <div className="flex flex-wrap gap-2">
                {examData.summary?.skillsCovered?.map((sk: string, i: number) => (
                  <span key={i} className="px-3 py-1 rounded-lg text-xs font-bold" style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.25)" }}>{sk}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Start Button */}
        <div className="text-center py-8">
          <button
            onClick={handleStart}
            disabled={examStatus !== "ready"}
            style={{
              height: 64, padding: "0 72px", borderRadius: 20, border: "none",
              fontFamily: "Syne, sans-serif", fontWeight: 900, fontSize: 18,
              cursor: examStatus === "ready" ? "pointer" : "not-allowed",
              background: examStatus === "ready" ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "rgba(255,255,255,0.06)",
              color: examStatus === "ready" ? "#fff" : "#475569",
              boxShadow: examStatus === "ready" ? "0 20px 60px rgba(99,102,241,0.35)" : "none",
              transition: "all 0.2s",
            }}
          >
            {examStatus === "ready"
              ? <span style={{ display: "flex", alignItems: "center", gap: 12 }}><RocketOutlined />Start Exam</span>
              : <span style={{ display: "flex", alignItems: "center", gap: 12 }}><Spin size="small" />Preparing...</span>
            }
          </button>
          <p className="text-slate-500 text-sm mt-4">
            {examStatus === "ready" ? "1 question at a time · 60 sec each · No going back" : "Waiting for exam to finish generating..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;





