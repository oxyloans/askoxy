import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Search,
  Upload,
  ScanSearch,
  ClipboardCheck,
  RefreshCcw,
  Send,
  ArrowRight,
  Brain,
  FileCheck,
  HelpCircle,
  Trophy,
} from "lucide-react";

const heroImage = "https://i.ibb.co/twGPgfmh/jpl-headeru.png";

type RoadmapType = "jobfit" | "resume";

const roadmapData = {
  jobfit: [
    { icon: <Search className="h-5 w-5" />, title: "Search Job Role", desc: "Choose the role that matches your career goal." },
    { icon: <Upload className="h-5 w-5" />, title: "Upload Resume", desc: "Upload your resume for AI-based profile review." },
    { icon: <ScanSearch className="h-5 w-5" />, title: "JD Match Check", desc: "Check whether your resume matches the job description." },
    { icon: <ClipboardCheck className="h-5 w-5" />, title: "AI-Based Exam", desc: "Take an AI-based exam built around the JD and role." },
    { icon: <RefreshCcw className="h-5 w-5" />, title: "Score or Improve", desc: "Score well to qualify or improve weak areas and retry." },
    { icon: <Send className="h-5 w-5" />, title: "Qualified Referral", desc: "Qualified candidates move into referral and hiring system." },
  ],
  resume: [
    { icon: <Upload className="h-5 w-5" />, title: "Upload Resume", desc: "Upload your resume to start the AI interview process." },
    { icon: <Brain className="h-5 w-5" />, title: "AI Analyzes Resume", desc: "AI reviews your skills, experience, projects, and profile strength." },
    { icon: <FileCheck className="h-5 w-5" />, title: "MCQs Prepared", desc: "MCQs are prepared from your resume skills and experience." },
    { icon: <HelpCircle className="h-5 w-5" />, title: "Answer Questions", desc: "Answer skill-based questions generated from your resume." },
    { icon: <Trophy className="h-5 w-5" />, title: "Get Resume AI Score", desc: "Receive your Resume AI Interview score with improvement insights." },
  ],
};

const JPLHeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapType>("jobfit");

  const roadmapSteps = roadmapData[activeRoadmap];
  const isJobFit = activeRoadmap === "jobfit";

  const handleJobNavigate = () => {
    const userId = localStorage.getItem("userId");
    const pathPrefix = userId ? "/main/viewjobdetails" : "/viewjobdetails";
    navigate(`${pathPrefix}/default/ALL`);
  };

  const purpleBtn =
    "group relative overflow-hidden rounded-2xl border border-[#7c3aed] bg-gradient-to-b from-[#c4b5fd] via-[#7c3aed] to-[#4c1d95] px-6 py-3 text-sm font-extrabold text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.42),inset_0_-3px_0_rgba(76,29,149,0.75),0_5px_0_rgba(124,58,237,0.85)] transition-all duration-200 [transform:perspective(700px)_rotateX(8deg)_rotateY(-6deg)] hover:-translate-y-0.5 hover:[transform:perspective(700px)_rotateX(4deg)_rotateY(0deg)] active:translate-y-[3px]";

  const blueBtn =
    "group relative overflow-hidden rounded-2xl border border-[#1d4ed8] bg-gradient-to-b from-[#7dd3fc] via-[#2563eb] to-[#0b4fb3] px-6 py-3 text-sm font-extrabold text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.42),inset_0_-3px_0_rgba(30,64,175,0.75),0_5px_0_rgba(30,64,175,0.85)] transition-all duration-200 [transform:perspective(700px)_rotateX(8deg)_rotateY(-6deg)] hover:-translate-y-0.5 hover:[transform:perspective(700px)_rotateX(4deg)_rotateY(0deg)] active:translate-y-[3px]";

  const inactiveBtn =
    "group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-gradient-to-b from-white via-[#f8fafc] to-[#e2e8f0] px-6 py-3 text-sm font-extrabold text-[#475569] shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-3px_0_rgba(148,163,184,0.25),0_5px_0_rgba(148,163,184,0.35)] transition-all duration-200 [transform:perspective(700px)_rotateX(8deg)_rotateY(-6deg)] hover:-translate-y-0.5 hover:[transform:perspective(700px)_rotateX(4deg)_rotateY(0deg)] active:translate-y-[3px]";

  const activeColor = isJobFit ? "purple" : "blue";

  const roadmapIconClass =
    activeColor === "purple"
      ? "bg-gradient-to-b from-[#c4b5fd] via-[#7c3aed] to-[#4c1d95] shadow-[inset_0_2px_0_rgba(255,255,255,0.42),inset_0_-3px_0_rgba(76,29,149,0.75),0_5px_0_rgba(124,58,237,0.9)]"
      : "bg-gradient-to-b from-[#7dd3fc] via-[#2563eb] to-[#0b4fb3] shadow-[inset_0_2px_0_rgba(255,255,255,0.42),inset_0_-3px_0_rgba(30,64,175,0.75),0_5px_0_rgba(30,64,175,0.9)]";

  const roadmapLineClass = activeColor === "purple" ? "bg-[#ddd6fe]" : "bg-[#bfdbfe]";
  const badgeTextClass = activeColor === "purple" ? "text-[#7c3aed]" : "text-[#2563eb]";

  return (
    <section className="relative overflow-hidden bg-[#f5f7f4] pt-0">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes imageFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes flowPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        .jpl-fade-up { animation: fadeUp 0.7s ease both; }
        .jpl-image-float { animation: imageFloat 4.5s ease-in-out infinite; }
        .jpl-flow-icon { animation: flowPulse 2.6s ease-in-out infinite; }
      `}</style>

      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "78px 78px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 sm:pt-5 md:px-10 lg:px-16 lg:pb-14 lg:pt-6">
        <div className="jpl-fade-up">
          <div className="mb-5 flex flex-col items-center justify-center gap-4 sm:mb-6 sm:flex-row">
            <button
              onClick={() => setActiveRoadmap("jobfit")}
              className={`w-full sm:w-auto ${activeRoadmap === "jobfit" ? purpleBtn : inactiveBtn}`}
            >
              <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/45 to-transparent" />
              <span className="pointer-events-none absolute -left-10 top-0 h-full w-8 rotate-12 bg-white/35 transition-all duration-700 group-hover:left-[120%]" />
              <span className="relative">JobFit AI Interview</span>
            </button>

            <button
              onClick={() => setActiveRoadmap("resume")}
              className={`w-full sm:w-auto ${activeRoadmap === "resume" ? blueBtn : inactiveBtn}`}
            >
              <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/45 to-transparent" />
              <span className="pointer-events-none absolute -left-10 top-0 h-full w-8 rotate-12 bg-white/35 transition-all duration-700 group-hover:left-[120%]" />
              <span className="relative">Resume AI Interview</span>
            </button>
          </div>

          <div className="hidden md:block">
            <div className="relative rounded-[24px] bg-white/50 px-5 py-6 backdrop-blur-sm lg:px-6 lg:py-7">
              <div
                className={`absolute top-[50px] h-[2px] ${roadmapLineClass}`}
                style={{
                  left: roadmapSteps.length === 5 ? "12%" : "9%",
                  right: roadmapSteps.length === 5 ? "12%" : "9%",
                }}
              />

              <div className={`relative grid gap-4 ${roadmapSteps.length === 5 ? "grid-cols-5" : "grid-cols-6"}`}>
                {roadmapSteps.map((step, index) => (
                  <div key={`${activeRoadmap}-${index}`} className="relative flex flex-col items-center text-center">
                    <div className="relative z-10 flex h-[62px] w-[62px] items-center justify-center">
                      <div className={`jpl-flow-icon flex h-13 w-13 items-center justify-center rounded-full p-4 text-white ${roadmapIconClass}`}>
                        {step.icon}
                      </div>

                      <span className={`absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-white text-xs font-extrabold ${badgeTextClass}`}>
                        {index + 1}
                      </span>
                    </div>

                    <h3 className="mt-2 min-h-[40px] text-[14px] font-bold leading-tight text-[#1e293b] lg:text-[15px]">
                      {step.title}
                    </h3>
                    <p className="max-w-[170px] text-[12px] leading-[1.45] text-[#64748b] lg:text-[13px]">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-0 rounded-2xl bg-white/50 p-4 md:hidden">
            {roadmapSteps.map((step, index) => (
              <div key={`${activeRoadmap}-${index}`} className="relative flex gap-4 pb-5 last:pb-0">
                {index !== roadmapSteps.length - 1 && (
                  <div className={`absolute left-[27px] top-[56px] h-[calc(100%-48px)] w-[2px] ${roadmapLineClass}`} />
                )}

                <div className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white ${roadmapIconClass}`}>
                  {step.icon}
                  <span className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-white text-[10px] font-extrabold ${badgeTextClass}`}>
                    {index + 1}
                  </span>
                </div>

                <div className="pt-1">
                  <h3 className="text-[15px] font-bold text-[#1e293b]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#64748b]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid items-center gap-8 lg:mt-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <div className="jpl-fade-up inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8] backdrop-blur-xl sm:text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Jobs Premier League
            </div>

            <h1 className="jpl-fade-up mt-4 text-[2rem] font-extrabold leading-[1.1] text-[#0f172a] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.35rem]">
              <span className="text-[#2563eb]">AI-Powered</span>
              <br />
              Qualification for
              <br />
              Career Outcomes
            </h1>

            <p className="jpl-fade-up mx-auto mt-4 max-w-2xl text-base font-semibold leading-relaxed text-[#2563eb] sm:text-lg lg:mx-0">
              A smart ecosystem where job seekers get qualified, mentors guide
              growth, employees refer talent, and companies hire faster.
            </p>

            <p className="jpl-fade-up mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#64748b] sm:text-[15px] md:text-base lg:mx-0">
              From AI-based exams to qualified referrals, JPL turns hiring into
              a clear step-by-step flow.
            </p>

            <div className="jpl-fade-up mt-6">
              <button onClick={handleJobNavigate} className={blueBtn}>
                <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/45 to-transparent" />
                <span className="pointer-events-none absolute -left-10 top-0 h-full w-8 rotate-12 bg-white/35 transition-all duration-700 group-hover:left-[120%]" />
                <span className="relative flex items-center gap-2">
                  Explore Jobs
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            </div>
          </div>

          <div className="jpl-fade-up w-full">
            <img
              src={heroImage}
              alt="Jobs Premier League"
              className="jpl-image-float mx-auto h-auto w-full max-w-[420px] object-contain sm:max-w-[500px] lg:max-w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JPLHeroSection;