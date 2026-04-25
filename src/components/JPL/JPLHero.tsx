import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  FileText,
  Users,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  Search,
  Upload,
  ScanSearch,
  ClipboardCheck,
  RefreshCcw,
  Send,
} from "lucide-react";

const floatingItems = [
  {
    icon: <FileText className="h-4 w-4" />,
    position: "left-[2%] top-[14%] 2xl:left-[5%] 2xl:top-[18%]",
    rotate: "-rotate-12",
    visibility: "hidden lg:block",
  },
  {
    icon: <BriefcaseBusiness className="h-4 w-4" />,
    position: "right-[2%] top-[14%] 2xl:right-[5%] 2xl:top-[18%]",
    rotate: "rotate-12",
    visibility: "hidden lg:block",
  },
  {
    icon: <Users className="h-4 w-4" />,
    position: "left-[4%] bottom-[10%] 2xl:left-[8%] 2xl:bottom-[14%]",
    rotate: "rotate-12",
    visibility: "hidden xl:block",
  },
  {
    icon: <GraduationCap className="h-4 w-4" />,
    position: "right-[4%] bottom-[10%] 2xl:right-[8%] 2xl:bottom-[14%]",
    rotate: "-rotate-12",
    visibility: "hidden xl:block",
  },
];

const roadmapSteps = [
  {
    icon: <Search className="h-4 w-4" />,
    title: "Search Job Role",
    desc: "Choose the role that matches your career goal.",
  },
  {
    icon: <Upload className="h-4 w-4" />,
    title: "Upload Resume",
    desc: "Upload your resume for AI-based profile review.",
  },
  {
    icon: <ScanSearch className="h-4 w-4" />,
    title: "JD Match Check",
    desc: "Check whether your resume matches the job description.",
  },
  {
    icon: <ClipboardCheck className="h-4 w-4" />,
    title: "AI-Based Exam",
    desc: "Take an AI-based exam built around the JD and role.",
  },
  {
    icon: <RefreshCcw className="h-4 w-4" />,
    title: "Score or Improve",
    desc: "Score well to qualify or improve weak areas and retry.",
  },
  {
    icon: <Send className="h-4 w-4" />,
    title: "Qualified Referral",
    desc: "Qualified candidates move into the referral and hiring system.",
  },
];

const JPLHeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleJobNavigate = (id: string | null) => {
    const userId = localStorage.getItem("userId");
    const pathPrefix = userId ? "/main/viewjobdetails" : "/viewjobdetails";
    navigate(id ? `${pathPrefix}/${id}/ALL` : `${pathPrefix}/default/ALL`);
  };

  return (
    <section className="relative overflow-hidden bg-[#f5f7f4] pt-[42px] sm:pt-[54px]">
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

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_30%)]" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {floatingItems.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.position} ${item.visibility} opacity-50`}
          >
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/30 text-[#0f3d91] shadow-[0_6px_18px_rgba(15,23,42,0.05)] backdrop-blur-md xl:h-11 xl:w-11">
                {item.icon}
              </div>

              <div
                className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-[#3b82f6] to-[#0b5bd3] text-white shadow-sm ${item.rotate}`}
              >
                <ArrowUpRight className="h-2.5 w-2.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center justify-center px-4 py-14 sm:px-6 md:px-10 lg:px-16">
        <div className="w-full max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/45 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8] shadow-sm backdrop-blur-xl sm:text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Jobs Premier League
          </div>

          <h1 className="mx-auto mt-5 max-w-5xl text-[2rem] font-extrabold leading-tight text-[#0f172a] sm:text-[2.6rem] md:text-[3.2rem] lg:text-[3.8rem]">
            <span className="text-[#2563eb]"> AI-Powered Qualification.</span>
            <br className="hidden sm:block" />
            Real Career Outcomes.
          </h1>

          <p className="mx-auto mt-4 max-w-4xl text-base font-semibold text-[#2563eb] sm:text-lg md:text-xl">
            A smart ecosystem where job seekers get qualified, mentors guide
            growth, employees refer talent, and companies hire the right people
            faster.
          </p>

          <p className="mx-auto mt-3 max-w-3xl text-sm text-[#64748b] sm:text-[15px] md:text-lg">
            From AI-based exams to qualified referrals, JPL transforms hiring
            into a powerful league system.
          </p>

          <div className="mx-auto mt-12 max-w-6xl">
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute left-[6%] right-[6%] top-[28px] h-[2px] bg-[#cbd5f5]" />

                <div className="relative grid grid-cols-6 gap-4">
                  {roadmapSteps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-[#60a5fa]/30 blur-md" />

                        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#60a5fa] to-[#2563eb] text-white shadow-md">
                          {step.icon}
                        </div>

                        <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#2563eb] shadow">
                          {index + 1}
                        </div>
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-[#1e293b]">
                        {step.title}
                      </h3>

                      <p className="mt-1 text-xs text-[#64748b]">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:hidden">
              {roadmapSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#60a5fa] to-[#2563eb] text-white">
                    {step.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-semibold text-[#1e293b]">
                        {step.title}
                      </h3>
                      <span className="text-xs font-bold text-[#2563eb]">
                        {index + 1}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-[#64748b]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={() => handleJobNavigate(null)}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
            >
              View Jobs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JPLHeroSection;