import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FileText, BriefcaseBusiness, Sparkles } from "lucide-react";
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

  const cards = [
    {
      title: "Resume AI Interview",
      desc: "Upload your resume, let AI analyze your skills, answer resume-based MCQs, and get your Resume AI score.",
      cta: "Get Resume Score",
      icon: FileText,
      onClick: goResume,
      gradient: "from-[#2563eb] via-[#4f46e5] to-[#7c3aed]",
    },
    {
      title: "JobFit AI Interview",
      desc: "Select a job role, attend a JD-based AI interview, and get your JobFit score before applying.",
      cta: "Get JobFit Score",
      icon: BriefcaseBusiness,
      onClick: goJobFit,
      gradient: "from-[#7c3aed] via-[#9333ea] to-[#db2777]",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f5f7f4] pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-24">
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
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#2563eb] shadow-sm backdrop-blur-xl sm:text-xs">
            <Sparkles className="h-4 w-4" />
            AI Interview Score
          </div>

          <h2 className="mt-5 text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.035em] text-[#0f172a] sm:text-[2.3rem] md:text-[2.75rem] lg:text-[3.1rem]">
            Get Your Score for{" "}
            <span className="text-[#2563eb]">Resume AI Interview</span> or{" "}
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
            className="flex justify-center order-1"
          >
            <motion.img
              src="https://i.ibb.co/hFfbhQSJ/2resume0.png"
              alt="Resume AI Interview and JobFit AI Interview"
              onClick={goResume}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full max-w-[300px] cursor-pointer object-contain drop-shadow-[0_22px_45px_rgba(15,23,42,0.12)] sm:max-w-[430px] lg:max-w-[560px]"
            />
          </motion.div>

          <div className="order-2 grid gap-5">
            {cards.map((card, index) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-6"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.gradient}`}
                  />

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-lg shadow-slate-300/60`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-[#0f172a] sm:text-lg">
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
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r ${card.gradient} px-5 py-2.5 text-xs font-bold text-white shadow-[0_10px_22px_rgba(79,70,229,0.24)] transition-all duration-300 hover:scale-[1.03] sm:w-auto sm:text-sm`}
                    >
                      {card.cta}
                      <ArrowRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-1" />
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