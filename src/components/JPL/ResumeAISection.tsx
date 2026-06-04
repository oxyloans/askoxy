import React from "react";
import { FileText, Sparkles, ArrowRight, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const resumeAIImg = "https://i.ibb.co/WNFgJ1Xp/resumeai.png" ;

const ResumeAISection: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "JD Resume Optimization",
      desc: "Update your resume based on a specific job description.",
      color: "blue",
    },
    {
      icon: Wand2,
      title: "AI Resume Builder",
      desc: "Create a clean resume using your skills and experience.",
      color: "purple",
    },
  ];

  const cardClass =
    "group relative overflow-hidden rounded-[26px] border border-white/80 bg-gradient-to-b from-white via-[#f8fbff] to-[#eaf3ff] p-5 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_0_rgba(147,197,253,0.35),0_8px_0_rgba(147,197,253,0.45)] backdrop-blur-xl transition-all duration-300 [transform:perspective(900px)_rotateX(5deg)_rotateY(-4deg)] hover:-translate-y-1 hover:[transform:perspective(900px)_rotateX(2deg)_rotateY(0deg)]";

  const iconBlue =
    "relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#1d4ed8] bg-gradient-to-b from-[#7dd3fc] via-[#2563eb] to-[#0b4fb3] text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.42),inset_0_-3px_0_rgba(30,64,175,0.75),0_5px_0_rgba(30,64,175,0.9)]";

  const iconPurple =
    "relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#7c3aed] bg-gradient-to-b from-[#c4b5fd] via-[#7c3aed] to-[#4c1d95] text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.42),inset_0_-3px_0_rgba(76,29,149,0.75),0_5px_0_rgba(76,29,149,0.75)]";

  return (
    <section className="relative overflow-hidden bg-[#f5f7f4] py-14 sm:py-18 lg:py-24">
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

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_28%)]" />
      <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -45, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="order-1 flex justify-center lg:justify-start"
          >
            <motion.img
              src={resumeAIImg}
              alt="Resume AI Builder"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-full max-w-[340px] object-contain drop-shadow-[0_24px_45px_rgba(15,23,42,0.14)] sm:max-w-[480px] lg:max-w-[620px]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-2 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#2563eb] backdrop-blur-xl sm:text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Resume AI
            </div>

            <h2 className="mt-5 text-[2rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#0f172a] sm:text-[2.5rem] md:text-[2.9rem] lg:text-[3.2rem]">
              Create Job-Ready{" "}
              <span className="bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">
                Resumes with AI
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#64748b] sm:text-base lg:mx-0">
              Build, format, and optimize resumes faster using AI tools designed
              for better job applications.
            </p>

            <div className="mt-8 space-y-5">
              {features.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className={cardClass}
                  >
                    <span className="pointer-events-none absolute -left-12 top-0 h-full w-10 rotate-12 bg-white/45 transition-all duration-700 group-hover:left-[120%]" />

                    <div className="relative flex items-start gap-4 text-left">
                      <div
                        className={
                          item.color === "blue" ? iconBlue : iconPurple
                        }
                      >
                        <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/50 to-transparent" />
                        <Icon className="relative h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-[#0f172a] sm:text-lg">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-[#64748b]">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <button
              onClick={() => navigate("/resume-ai")}
              className="group mt-9 inline-flex items-center justify-center gap-2 rounded-[18px] border border-[#1d4ed8] bg-gradient-to-b from-[#7dd3fc] via-[#2563eb] to-[#0b4fb3] px-7 py-3.5 text-sm font-extrabold text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.42),inset_0_-4px_0_rgba(30,64,175,0.75),0_7px_0_rgba(30,64,175,0.9),0_18px_34px_rgba(37,99,235,0.24)] transition-all duration-300 hover:-translate-y-1 active:translate-y-1 active:shadow-[inset_0_2px_0_rgba(255,255,255,0.35),inset_0_-2px_0_rgba(30,64,175,0.75),0_3px_0_rgba(30,64,175,0.9)]"
            >
              Explore More
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default ResumeAISection;