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
    {
      icon: <Search className="h-5 w-5" />,
      title: "Search Job Role",
      desc: "Choose the role that matches your career goal.",
    },
    {
      icon: <Upload className="h-5 w-5" />,
      title: "Upload Resume",
      desc: "Upload your resume for AI-based profile review.",
    },
    {
      icon: <ScanSearch className="h-5 w-5" />,
      title: "JD Match Check",
      desc: "Check whether your resume matches the job description.",
    },
    {
      icon: <ClipboardCheck className="h-5 w-5" />,
      title: "AI-Based Exam",
      desc: "Take an AI-based exam built around the JD and role.",
    },
    {
      icon: <RefreshCcw className="h-5 w-5" />,
      title: "Score or Improve",
      desc: "Score well to qualify or improve weak areas and retry.",
    },
    {
      icon: <Send className="h-5 w-5" />,
      title: "Qualified Referral",
      desc: "Qualified candidates move into referral and hiring system.",
    },
  ],
  resume: [
    {
      icon: <Upload className="h-5 w-5" />,
      title: "Upload Resume",
      desc: "Upload your resume to start the AI interview process.",
    },
    {
      icon: <Brain className="h-5 w-5" />,
      title: "AI Analyzes Resume",
      desc: "AI reviews your skills, experience, projects, and profile strength.",
    },
    {
      icon: <FileCheck className="h-5 w-5" />,
      title: "MCQs Prepared",
      desc: "MCQs are prepared from your resume skills and experience.",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      title: "Answer Questions",
      desc: "Answer skill-based questions generated from your resume.",
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      title: "Get Resume AI Score",
      desc: "Receive your Resume AI Interview score with improvement insights.",
    },
  ],
};

const JPLHeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapType>("jobfit");

  const roadmapSteps = roadmapData[activeRoadmap];

  const handleJobNavigate = () => {
    const userId = localStorage.getItem("userId");
    const pathPrefix = userId ? "/main/viewjobdetails" : "/viewjobdetails";
    navigate(`${pathPrefix}/default/ALL`);
  };

  return (
    <section className="relative overflow-hidden bg-[#f5f7f4] pt-0">
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes imageFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }

          @keyframes flowPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.06); }
          }

          .jpl-fade-up {
            animation: fadeUp 0.7s ease both;
          }

          .jpl-image-float {
            animation: imageFloat 4.5s ease-in-out infinite;
          }

          .jpl-flow-icon {
            animation: flowPulse 2.6s ease-in-out infinite;
          }
        `}
      </style>

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
          <div className="mb-5 flex flex-col items-center justify-center gap-3 sm:mb-6 sm:flex-row">
            <button
              onClick={() => setActiveRoadmap("jobfit")}
              className={`w-full rounded-full px-5 py-2.5 text-sm font-bold transition sm:w-auto ${
                activeRoadmap === "jobfit"
                  ? "bg-blue-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.28)]"
                  : "bg-white/75 text-[#1e293b] hover:bg-white"
              }`}
            >
              JobFit AI Interview
            </button>

            <button
              onClick={() => setActiveRoadmap("resume")}
              className={`w-full rounded-full px-5 py-2.5 text-sm font-bold transition sm:w-auto ${
                activeRoadmap === "resume"
                  ? "bg-blue-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.28)]"
                  : "bg-white/75 text-[#1e293b] hover:bg-white"
              }`}
            >
              Resume AI Interview
            </button>
          </div>

          <div className="hidden md:block">
            <div className="relative rounded-[24px] bg-white/50 px-5 py-6 backdrop-blur-sm lg:px-6 lg:py-7">
              <div
                className="absolute top-[50px] h-[2px] bg-[#bfdbfe]"
                style={{
                  left: roadmapSteps.length === 5 ? "12%" : "9%",
                  right: roadmapSteps.length === 5 ? "12%" : "9%",
                }}
              />

              <div
                className={`relative grid gap-4 ${
                  roadmapSteps.length === 5 ? "grid-cols-5" : "grid-cols-6"
                }`}
              >
                {roadmapSteps.map((step, index) => (
                  <div
                    key={`${activeRoadmap}-${index}`}
                    className="relative flex flex-col items-center text-center"
                  >
                    <div className="relative z-10 flex h-[62px] w-[62px] items-center justify-center">
                      <div className="jpl-flow-icon flex h-13 w-13 items-center justify-center rounded-full bg-blue-600 p-4 text-white shadow-[0_10px_24px_rgba(37,99,235,0.25)]">
                        {step.icon}
                      </div>

                      <span className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border border-blue-100 bg-white text-xs font-extrabold text-blue-600 shadow-sm">
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
              <div
                key={`${activeRoadmap}-${index}`}
                className="relative flex gap-4 pb-5 last:pb-0"
              >
                {index !== roadmapSteps.length - 1 && (
                  <div className="absolute left-[27px] top-[56px] h-[calc(100%-48px)] w-[2px] bg-[#bfdbfe]" />
                )}

                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_8px_18px_rgba(37,99,235,0.22)]">
                  {step.icon}

                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-blue-100 bg-white text-[10px] font-extrabold text-blue-600 shadow-sm">
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
              <button
                onClick={handleJobNavigate}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0"
              >
                Explore Jobs
                <ArrowRight className="h-4 w-4" />
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