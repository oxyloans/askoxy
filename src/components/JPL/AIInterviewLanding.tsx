import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WalkInInterviewStepsModal from "../WalkInInterviewStepsModal";
import arrow0 from "../../assets/img/arrow0.png";
import arrow1 from "../../assets/img/arrow1.png";
import speak1 from "../../assets/img/speak1.png";
import speak2 from "../../assets/img/walkin.png";
import {
  ArrowRight,
  FileText,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import BASE_URL from "../../Config";

type JobsCount = {
  activeJobs: number;
  totalCompanies: number;
};

const JOBS_COUNT_API = `${BASE_URL}/marketing-service/campgin/companies-jobs-count`;

const AIInterviewLanding: React.FC = () => {
  const navigate = useNavigate();
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [jobsCount, setJobsCount] = useState<JobsCount>({
    activeJobs: 0,
    totalCompanies: 0,
  });
  const [isJobsCountLoading, setIsJobsCountLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const getJobsCount = async () => {
      try {
        const response = await fetch(JOBS_COUNT_API, {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Unable to load jobs count (${response.status})`);
        }

        const data: JobsCount = await response.json();
        setJobsCount({
          activeJobs: Number(data?.activeJobs) || 0,
          totalCompanies: Number(data?.totalCompanies) || 0,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Jobs count error:", error);
        }
      } finally {
        if (!controller.signal.aborted) setIsJobsCountLoading(false);
      }
    };

    getJobsCount();
    return () => controller.abort();
  }, []);

  const isLoggedIn =
    !!localStorage.getItem("userId") ||
    !!localStorage.getItem("accessToken") ||
    !!sessionStorage.getItem("userId") ||
    !!sessionStorage.getItem("accessToken");

  const goResume = () => {
    const userId =
      localStorage.getItem("userId")?.trim() ||
      sessionStorage.getItem("userId")?.trim() ||
      "";

    if (userId) {
      navigate("/resume-ai-interview");
      return;
    }

    sessionStorage.setItem("redirectPath", "/resume-ai-interview");
    navigate("/whatsapplogin");
  };

  const goJobFit = () => {
    navigate(
      isLoggedIn
        ? "/main/viewjobdetails/default/ALL"
        : "/viewjobdetails/default/ALL",
    );
  };

  const handleWalkInAction = () => {
    const redirectPath = "/main/viewjobdetails/default/ASKOXY_AI";

    if (isLoggedIn) {
      navigate(redirectPath);
      return;
    }

    sessionStorage.setItem("redirectPath", redirectPath);
    window.location.href = "/whatsapplogin";
  };

  const cardStyles = {
    purple:
      "from-white via-[#fbfaff] to-[#f0eaff] shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_0_rgba(196,181,253,0.35),0_8px_0_rgba(196,181,253,0.45)]",
    lightBlue:
      "from-white via-[#f8fbff] to-[#eaf3ff] shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_0_rgba(147,197,253,0.35),0_8px_0_rgba(147,197,253,0.45)]",
  };

  const iconStyles = {
    purple:
      "border-[#8b5cf6] bg-gradient-to-b from-[#ddd6fe] via-[#8b5cf6] to-[#6d28d9] text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.45),inset_0_-3px_0_rgba(76,29,149,0.45),0_5px_0_rgba(124,58,237,0.45)]",
    lightBlue:
      "border-[#93c5fd] bg-gradient-to-b from-[#eff6ff] via-[#93c5fd] to-[#60a5fa] text-[#0f3d91] shadow-[inset_0_2px_0_rgba(255,255,255,0.85),inset_0_-3px_0_rgba(96,165,250,0.55),0_5px_0_rgba(147,197,253,0.75)]",
  };

  const buttonStyles = {
    purple:
      "border-[#8b5cf6] bg-gradient-to-b from-[#ddd6fe] via-[#8b5cf6] to-[#6d28d9] text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.45),inset_0_-3px_0_rgba(76,29,149,0.55),0_5px_0_rgba(124,58,237,0.55)]",
    lightBlue:
      "border-[#93c5fd] bg-gradient-to-b from-[#f8fbff] via-[#dbeafe] to-[#bfdbfe] text-[#1d4ed8] shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-3px_0_rgba(147,197,253,0.55),0_5px_0_rgba(191,219,254,0.9)]",
  };

  const cards = [
    {
      title: "JobFit AI Interview",
      desc: "Select a job role, attend a JD-based AI interview, and get your JobFit score before applying.",
      cta: "Get JobFit Score",
      icon: BriefcaseBusiness,
      onClick: goJobFit,
      color: "purple" as const,
      showJobsCount: true,
    },
    {
      title: "Resume AI Interview",
      desc: "Upload your resume, let AI analyze your skills, answer resume-based MCQs, and get your Resume AI score.",
      cta: "Get Resume Score",
      icon: FileText,
      onClick: goResume,
      color: "lightBlue" as const,
      showJobsCount: false,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-[#f5f7f4] pb-14 pt-24 sm:pb-16 sm:pt-28 lg:pb-24 lg:pt-32">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.05) 1px, transparent 1px)
          `,
            backgroundSize: "76px 76px",
          }}
        />

        <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mx-auto mb-10 grid w-full max-w-6xl grid-cols-2 items-center gap-x-6 gap-y-5 sm:mb-12 sm:grid-cols-[112px_minmax(0,1fr)_112px] sm:gap-5 lg:mb-14 lg:grid-cols-[150px_minmax(0,1fr)_150px] lg:gap-8"
          >
            <div className="order-2 flex min-w-0 flex-col items-center justify-start sm:order-1">
              <button
                type="button"
                onClick={() => navigate("/sovereign-ai")}
                className="flex h-[82px] w-[82px] -translate-x-5 cursor-pointer items-center justify-center border-0 bg-transparent p-0 transition-transform duration-300 hover:scale-105 active:scale-95 sm:h-[112px] sm:w-[112px] sm:-translate-x-7 lg:h-[140px] lg:w-[140px] lg:-translate-x-10"
                aria-label="Speak with radhAI"
              >
                <img
                  src={speak1}
                  alt="Speak with radhAI"
                  className="h-full w-full object-contain"
                />
              </button>
              <img
                src={arrow0}
                alt=""
                aria-hidden="true"
                className=" h-[48px] w-[48px] object-contain sm:h-[62px] sm:w-[62px] lg:h-[76px] lg:w-[76px]"
              />
            </div>

            <div className="order-1 col-span-2 min-w-0 text-center sm:order-2 sm:col-span-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/85 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.1em] text-[#2563eb] backdrop-blur-xl sm:gap-2 sm:px-4 sm:py-2 sm:text-[10px] lg:text-xs">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                AI Interview Score
              </div>

              <h2 className="mx-auto mt-3 max-w-3xl text-[1.65rem] font-extrabold leading-[1.15] tracking-[-0.035em] text-[#0f172a] sm:mt-4 sm:text-[2rem] md:text-[2.45rem] lg:text-[3rem]">
                Get Your Score for{" "}
                <span className="text-[#1d4ed8]">Resume AI Interview</span> or{" "}
                <span className="text-[#7c3aed]">JobFit AI Interview</span>
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#64748b] sm:mt-4 sm:leading-7 lg:text-base">
                Choose your interview type, answer AI-powered questions, and get
                a smart score that helps you understand your job readiness.
              </p>
            </div>

            <div className="order-3 flex min-w-0 flex-col items-center justify-start">
              <button
                type="button"
                onClick={() => setIsWalkInModalOpen(true)}
                className="flex h-[82px] w-[82px] translate-x-5 cursor-pointer items-center justify-center border-0 bg-transparent p-0 transition-transform duration-300 hover:scale-105 active:scale-95 sm:h-[112px] sm:w-[112px] sm:translate-x-7 lg:h-[140px] lg:w-[140px] lg:translate-x-10"
                aria-label="View walk-in interview steps"
              >
                <img
                  src={speak2}
                  alt="Walk-in interviews"
                  className="h-full w-full object-contain"
                />
              </button>
              <img
                src={arrow1}
                alt=""
                aria-hidden="true"
                className="h-[48px] w-[48px] object-contain sm:h-[62px] sm:w-[62px] lg:h-[76px] lg:w-[76px]"
              />
            </div>
          </motion.div>

          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="order-1 flex justify-center"
            >
              <motion.img
                src="https://i.ibb.co/hFfbhQSJ/2resume0.png"
                alt="Resume AI Interview and JobFit AI Interview"
                // onClick={goResume}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full max-w-[300px] cursor-pointer object-contain drop-shadow-[0_22px_45px_rgba(15,23,42,0.12)] sm:max-w-[430px] lg:max-w-[560px]"
              />
            </motion.div>

            <div className="order-2 grid gap-6">
              {cards.map((card, index) => {
                const Icon = card.icon;
                const color = card.color;

                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.12 }}
                    className={`group relative overflow-hidden rounded-[26px] border border-white/80 bg-gradient-to-b ${cardStyles[color]} p-5 backdrop-blur-xl transition-all duration-300 [transform:perspective(900px)_rotateX(5deg)_rotateY(-4deg)] hover:-translate-y-1 hover:[transform:perspective(900px)_rotateX(2deg)_rotateY(0deg)] sm:p-6`}
                  >
                    <span className="pointer-events-none absolute -left-12 top-0 h-full w-10 rotate-12 bg-white/45 transition-all duration-700 group-hover:left-[120%]" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex gap-4">
                        <div
                          className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border ${iconStyles[color]}`}
                        >
                          <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/50 to-transparent" />
                          <Icon className="relative h-5 w-5" />
                        </div>

                        <div>
                          <h3
                            className={`text-base font-extrabold sm:text-lg ${
                              color === "purple"
                                ? "text-[#7c3aed]"
                                : "text-[#1d4ed8]"
                            }`}
                          >
                            {card.title}
                          </h3>

                          <p className="mt-1.5 max-w-md text-sm leading-6 text-[#64748b]">
                            {card.desc}
                          </p>

                          {card.showJobsCount && (
                            <div className="mt-3 grid max-w-[280px] grid-cols-2 divide-x divide-purple-200 overflow-hidden rounded-xl border border-purple-100 bg-white/70">
                              <div className="px-3 py-2 text-center">
                                <strong className="block text-lg font-extrabold leading-none text-[#5543C8]">
                                  {isJobsCountLoading
                                    ? "—"
                                    : jobsCount.activeJobs}
                                </strong>
                                <span className="mt-1 block text-[10px] font-bold text-slate-500">
                                  Active Jobs
                                </span>
                              </div>
                              <div className="px-3 py-2 text-center">
                                <strong className="block text-lg font-extrabold leading-none text-[#D71D8E]">
                                  {isJobsCountLoading
                                    ? "—"
                                    : jobsCount.totalCompanies}
                                </strong>
                                <span className="mt-1 block text-[10px] font-bold text-slate-500">
                                  Total Companies
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <motion.button
                        onClick={card.onClick}
                        whileTap={{ scale: 0.96 }}
                        className={`group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border px-5 py-3 text-xs font-extrabold transition-all duration-200 [transform:perspective(700px)_rotateX(8deg)_rotateY(-6deg)] hover:-translate-y-0.5 hover:[transform:perspective(700px)_rotateX(4deg)_rotateY(0deg)] active:translate-y-[3px] sm:w-auto sm:text-sm ${buttonStyles[color]}`}
                      >
                        <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/45 to-transparent" />
                        <span className="pointer-events-none absolute -left-10 top-0 h-full w-8 rotate-12 bg-white/35 transition-all duration-700 group-hover:left-[120%]" />
                        <span className="relative flex items-center gap-2">
                          {card.cta}
                          <ArrowRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-1" />
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <WalkInInterviewStepsModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        onActionClick={handleWalkInAction}
      />
    </>
  );
};

export default AIInterviewLanding;
