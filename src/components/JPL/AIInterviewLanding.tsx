import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const AIInterviewLanding: React.FC = () => {
  const navigate = useNavigate();

  const isLoggedIn =
    !!localStorage.getItem("userId") ||
    !!localStorage.getItem("accessToken") ||
    !!sessionStorage.getItem("userId") ||
    !!sessionStorage.getItem("accessToken");

  const goResume = () => navigate("/interview");

  const goJobFit = () => {
    navigate(
      isLoggedIn
        ? "/main/viewjobdetails/default/ALL"
        : "/viewjobdetails/default/ALL"
    );
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
      title: "Resume AI Interview",
      desc: "Upload your resume, let AI analyze your skills, answer resume-based MCQs, and get your Resume AI score.",
      cta: "Get Resume Score",
      icon: FileText,
      onClick: goResume,
      color: "lightBlue" as const,
    },
    {
      title: "JobFit AI Interview",
      desc: "Select a job role, attend a JD-based AI interview, and get your JobFit score before applying.",
      cta: "Get JobFit Score",
      icon: BriefcaseBusiness,
      onClick: goJobFit,
      color: "purple" as const,
    },
  ];

  return (
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
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#2563eb] backdrop-blur-xl sm:text-xs">
            <Sparkles className="h-4 w-4" />
            AI Interview Score
          </div>

          <h2 className="mt-5 text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.035em] text-[#0f172a] sm:text-[2.3rem] md:text-[2.75rem] lg:text-[3.1rem]">
            Get Your Score for{" "}
            <span className="text-[#1d4ed8]">Resume AI Interview</span> or{" "}
            <span className="text-[#7c3aed]">JobFit AI Interview</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#64748b] sm:text-base">
            Choose your interview type, answer AI-powered questions, and get a
            smart score that helps you understand your job readiness.
          </p>
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
              onClick={goResume}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
  );
};

export default AIInterviewLanding;