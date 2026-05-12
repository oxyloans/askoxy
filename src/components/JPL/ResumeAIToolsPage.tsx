import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  LayoutTemplate,
  Mic,
  Sparkles,
  Wand2,
  ShieldCheck,
} from "lucide-react";
import JPLHeader from "../JPL/JPLHeader";

const ResumeAIToolsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, []);

  const sections = [
    {
      icon: FileText,
      tag: "JD Intelligence",
      title: "Role-Aligned Resume Optimization",
      desc: "Refine every resume according to the selected job description with strong keywords, relevant skills, and ATS-ready profile positioning.",
      image: "https://i.ibb.co/9HxgrPq3/r11.png",
      points: [
        "ATS-ready profile enhancement",
        "Job-specific keyword mapping",
        "Improved recruiter visibility",
      ],
    },
    {
      icon: Mic,
      tag: "Interview Readiness",
      title: "Resume-Led Interview Preparation",
      desc: "Prepare candidates through structured MCQs, scenario-based assessments, and coding challenges generated from their uploaded resume.",
      image: "https://i.ibb.co/KpVd3BNM/r22.png",
      points: [
        "Resume-based MCQ practice",
        "Scenario-driven assessment rounds",
        "Coding challenge preparation",
      ],
    },
    {
      icon: LayoutTemplate,
      tag: "Resume Presentation",
      title: "Professional Resume Formatting",
      desc: "Convert ordinary resumes into clean, modern, recruiter-friendly formats with polished structure and strong visual readability.",
      image: "https://i.ibb.co/xtcZJ8Zd/r33.png",
      points: [
        "Premium resume templates",
        "Clean content hierarchy",
        "Recruiter-friendly layout",
      ],
    },
    {
      icon: Wand2,
      tag: "Profile Automation",
      title: "Skill-Driven Resume Generation",
      desc: "Generate complete resumes by selecting skills, technologies, experience level, and target roles with intelligent content automation.",
      image: "https://i.ibb.co/gZ9GNcFh/r44.png",
      points: [
        "Skill-based resume creation",
        "Technology-focused profiling",
        "Freshers and professionals ready",
      ],
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f9ff] text-[#0f172a]">
      <JPLHeader />

      <div
        className="fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0f172a 1px, transparent 1px),
            linear-gradient(to bottom, #0f172a 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      <section className="relative px-4 pb-12 pt-28 sm:px-6 lg:px-16 lg:pb-16 lg:pt-32">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700 shadow-sm backdrop-blur-xl">
            <Sparkles className="h-4 w-4" />
            AI Resume Intelligence
          </div>

          <h1 className="mx-auto mt-5 max-w-4xl text-[2rem] font-black leading-tight tracking-tight text-[#0f172a] sm:text-[2.7rem] lg:text-[3.2rem]">
            Build stronger resumes with{" "}
            <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              intelligent AI
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#64748b] sm:text-base">
            A refined AI platform for resume alignment, interview preparation,
            professional formatting, and skill-based resume generation.
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-16">
        <div className="space-y-16 lg:space-y-24">
          {sections.map((item, index) => {
            const Icon = item.icon;
            const reverse = index % 2 !== 0;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                  reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700 shadow-sm backdrop-blur-xl">
                    <Icon className="h-4 w-4" />
                    {item.tag}
                  </div>

                  <h2 className="mt-5 text-[1.65rem] font-black leading-tight text-[#0f172a] sm:text-[2.15rem] lg:text-[2.35rem]">
                    {item.title}
                  </h2>

                  <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#64748b] sm:text-base lg:mx-0">
                    {item.desc}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    {item.points.map((point) => (
                      <div key={point} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-semibold text-slate-700">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 rounded-[36px] bg-blue-200/20 blur-3xl" />

                  <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/70 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
                    <div className="flex items-center gap-2 border-b border-slate-100 bg-white/75 px-5 py-3">
                      <span className="h-3 w-3 rounded-full bg-green-400" />
                      <span className="h-3 w-3 rounded-full bg-yellow-400" />
                      <span className="h-3 w-3 rounded-full bg-red-500" />
                    </div>

                    <div className="p-2 sm:p-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full rounded-2xl object-cover"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

  {/* SIMPLE FINAL SECTION */}
<section className="relative px-4 pb-16 sm:px-6 lg:px-16 lg:pb-24">
  <div className="mx-auto max-w-7xl rounded-[32px] border border-white/80 bg-white/80 p-8 shadow-[0_24px_80px_rgba(37,99,235,0.08)] backdrop-blur-2xl sm:p-10 lg:p-14">
    
    <div className="text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700">
        <Sparkles className="h-4 w-4" />
        Career Intelligence Platform
      </div>

      <h2 className="mx-auto mt-5 max-w-4xl text-[1.9rem] font-black leading-tight text-[#0f172a] sm:text-[2.5rem]">
        One intelligent platform for resumes and interview readiness
      </h2>

      <p className="mx-auto mt-5 max-w-3xl text-sm leading-8 text-[#64748b] sm:text-base">
        Help candidates create stronger resumes, improve ATS compatibility,
        prepare for interview rounds, and present professional profiles with
        confidence.
      </p>
    </div>

    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        "ATS Resume Optimization",
        "Interview Preparation",
        "Professional Templates",
        "Skill-Based Resume Creation",
      ].map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-slate-100 bg-[#f8fbff] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
            <CheckCircle2 className="h-5 w-5" />
          </div>

          <p className="mt-4 text-sm font-bold leading-6 text-[#0f172a]">
            {item}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
    </div>
  );
};

export default ResumeAIToolsPage;