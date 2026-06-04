import React from "react";
import { BadgeCheck, ClipboardCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const jobMatchImg = "https://i.ibb.co/bjH7pjKf/aipage.png";

const PersonalizedJobMatchSection: React.FC = () => {
  const features = [
    {
      icon: BadgeCheck,
      title: "Skill-Based Job Matching",
      desc: "AI compares your resume with job requirements and highlights jobs that truly match your skills.",
      color: "blue",
    },
    {
      icon: ClipboardCheck,
      title: "1-Click Resume AI Exam",
      desc: "Attend AI-powered interviews instantly based on your uploaded resume and selected job role.",
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
              src={jobMatchImg}
              alt="AI Job Matches"
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
              AI Job Matching
            </div>

            <h2 className="mt-5 text-[2rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#0f172a] sm:text-[2.5rem] md:text-[2.9rem] lg:text-[3.2rem]">
              Personalized{" "}
              <span className="bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">
                AI Job Matches
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#64748b] sm:text-base lg:mx-0">
              Discover jobs you’re truly qualified for using AI-powered resume
              analysis, smart job matching, and personalized interview scoring.
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
                      <div className={item.color === "blue" ? iconBlue : iconPurple}>
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedJobMatchSection;