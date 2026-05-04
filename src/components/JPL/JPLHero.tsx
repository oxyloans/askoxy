import React from "react";
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
} from "lucide-react";

const heroImage = "https://i.ibb.co/WQpXN9j/jpl-header.png";

const roadmapSteps = [
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
    desc: "Qualified candidates move into the referral and hiring system.",
  },
];

const JPLHeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleJobNavigate = () => {
    const userId = localStorage.getItem("userId");
    const pathPrefix = userId ? "/main/viewjobdetails" : "/viewjobdetails";
    navigate(`${pathPrefix}/default/ALL`);
  };

  return (
    <section className="relative overflow-hidden bg-[#f5f7f4] pt-10 sm:pt-14">
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

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-10 lg:px-16 lg:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <div className="jpl-fade-up inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8] backdrop-blur-xl sm:text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Jobs Premier League
            </div>

            <h1 className="jpl-fade-up mt-5 text-[2.15rem] font-extrabold leading-[1.1] text-[#0f172a] sm:text-[2.6rem] md:text-[3.15rem] lg:text-[3.45rem]">
              <span className="text-[#2563eb]">AI-Powered</span>
              <br />
              Qualification for
              <br />
              Career Outcomes
            </h1>

            <p className="jpl-fade-up mt-5 max-w-2xl text-base font-semibold leading-relaxed text-[#2563eb] sm:text-lg lg:mx-0">
              A smart ecosystem where job seekers get qualified, mentors guide
              growth, employees refer talent, and companies hire faster.
            </p>

            <p className="jpl-fade-up mt-3 max-w-2xl text-sm leading-relaxed text-[#64748b] sm:text-[15px] md:text-base lg:mx-0">
              From AI-based exams to qualified referrals, JPL turns hiring into
              a clear step-by-step flow.
            </p>

            <div className="jpl-fade-up mt-7">
              <button
                onClick={handleJobNavigate}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0"
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
              className="jpl-image-float mx-auto h-auto w-full max-w-[540px] object-contain lg:max-w-full"
            />
          </div>
        </div>

        <div className="jpl-fade-up mt-14">
          <div className="hidden md:block">
            <div className="relative rounded-[28px] bg-white/45 px-6 py-8 backdrop-blur-sm">
              <div className="absolute left-[9%] right-[9%] top-[58px] h-[2px] bg-[#bfdbfe]" />

              <div className="relative grid grid-cols-6 gap-5">
                {roadmapSteps.map((step, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center text-center"
                  >
                    <div className="relative z-10 flex h-[70px] w-[70px] items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.25)]">
                        {step.icon}
                      </div>

                      <span className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border border-blue-100 bg-white text-xs font-extrabold text-blue-600 shadow-sm">
                        {index + 1}
                      </span>
                    </div>

                    <h3 className="mt-3 min-h-[44px] text-[15px] font-bold leading-tight text-[#1e293b]">
                      {step.title}
                    </h3>

                    <p className="max-w-[175px] text-[13px] leading-[1.45] text-[#64748b]">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-0 md:hidden">
            {roadmapSteps.map((step, index) => (
              <div key={index} className="relative flex gap-4 pb-6">
                {index !== roadmapSteps.length - 1 && (
                  <div className="absolute left-[27px] top-[58px] h-[calc(100%-52px)] w-[2px] bg-[#bfdbfe]" />
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
      </div>
    </section>
  );
};

export default JPLHeroSection;
