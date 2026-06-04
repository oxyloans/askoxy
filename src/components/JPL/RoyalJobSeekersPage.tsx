import React, { useEffect } from "react";
import {
  Upload,
  Bot,
  BarChart3,
  Search,
  BadgeCheck,
  Sparkles,
  Crown,
  FileText,
  Target,
  Brain,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";
import JPLHeader from "../JPL/JPLHeader";

const pageImage = "https://i.ibb.co/21dTjf9S/jobseeker.png";

const RoyalJobSeekersPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const roadmap = [
    {
      icon: Upload,
      title: "Upload Resume",
      desc: "Start the AI-powered career qualification journey by uploading a resume.",
    },
    {
      icon: Bot,
      title: "Resume Intelligence Review",
      desc: "AI analyzes skills, experience, career fit, and profile strength.",
    },
    {
      icon: BarChart3,
      title: "Receive AI Career Score",
      desc: "Get a clear score with skill-gap intelligence and improvement areas.",
    },
    {
      icon: Search,
      title: "Discover Matching Roles",
      desc: "Explore job opportunities aligned with skills, experience, and readiness.",
    },
    {
      icon: Brain,
      title: "Attend JobFit AI Interview",
      desc: "Complete role-based AI assessments designed around job requirements.",
    },
    {
      icon: BadgeCheck,
      title: "Build Verified Career Profile",
      desc: "Qualified profiles are shared with employers, recruiters, and mentors.",
    },
  ];

  const benefits = [
    {
      icon: FileText,
      title: "AI Career Score",
      desc: "Understand resume strength and career readiness before applying.",
    },
    {
      icon: Target,
      title: "Skill-Gap Intelligence",
      desc: "Identify missing skills and improve with focused preparation.",
    },
    {
      icon: Briefcase,
      title: "Better Job Matching",
      desc: "Apply for roles where your profile has stronger qualification chances.",
    },
  ];

  const glossyCard =
    "group relative overflow-hidden rounded-[26px] border border-white/80 bg-gradient-to-b from-white via-[#fbfaff] to-[#f0eaff] p-6 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_0_rgba(139,92,246,0.25),0_8px_0_rgba(139,92,246,0.35)] backdrop-blur-xl transition-all duration-300 [transform:perspective(900px)_rotateX(5deg)_rotateY(-4deg)] hover:-translate-y-1 hover:[transform:perspective(900px)_rotateX(2deg)_rotateY(0deg)]";

  const glossyIcon =
    "relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[#8b5cf6] bg-gradient-to-b from-[#ddd6fe] via-[#8b5cf6] to-[#6d28d9] text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.45),inset_0_-3px_0_rgba(76,29,149,0.55),0_5px_0_rgba(109,40,217,0.55)]";

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f7f4] text-[#0f172a]">
      <JPLHeader />

      <section className="relative overflow-hidden pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-24 lg:pt-36">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(15,23,42,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(15,23,42,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "78px 78px",
          }}
        />

        <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7c3aed] backdrop-blur-xl sm:text-xs">
                <Crown className="h-4 w-4" />
                AI-Powered Career Qualification
              </div>

              <h1 className="mt-5 text-[2rem] font-extrabold leading-tight text-[#0f172a] sm:text-[2.5rem] lg:text-[3rem]">
                Build a verified AI career profile and become{" "}
                <span className="text-[#7c3aed]">industry-ready</span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#64748b] sm:text-base lg:mx-0">
                Royal Job Seekers helps candidates transform resumes into
                AI-qualified career profiles through Resume Intelligence,
                JobFit AI Interviews, skill-gap analysis, and role-based career
                readiness assessments.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-end"
            >
              <img
                src={pageImage}
                alt="Royal Job Seekers"
                className="w-full max-w-[330px] object-contain drop-shadow-[0_24px_50px_rgba(15,23,42,0.16)] sm:max-w-[430px] lg:max-w-[560px]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-16 lg:pb-20">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#7c3aed]">
            <Sparkles className="h-4 w-4" />
            AI Career Qualification Journey
          </div>

          <h2 className="mt-4 text-[2rem] font-extrabold leading-tight text-[#0f172a] sm:text-[2.5rem] lg:text-[3rem]">
            From resume upload to verified career readiness
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roadmap.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className={glossyCard}
              >
                <span className="pointer-events-none absolute -left-12 top-0 h-full w-10 rotate-12 bg-white/45 transition-all duration-700 group-hover:left-[120%]" />
                <div className={glossyIcon}>
                  <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/50 to-transparent" />
                  <Icon className="relative h-5 w-5" />
                </div>
                <p className="relative mb-2 mt-5 text-xs font-extrabold text-[#7c3aed]">
                  STEP {index + 1}
                </p>
                <h3 className="relative text-lg font-extrabold text-[#0f172a]">
                  {item.title}
                </h3>
                <p className="relative mt-2 text-sm leading-6 text-[#64748b]">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-16 lg:pb-24">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#7c3aed]">
            <GraduationCap className="h-4 w-4" />
            Career Growth Advantages
          </div>

          <h2 className="mt-4 text-[2rem] font-extrabold leading-tight text-[#0f172a] sm:text-[2.5rem] lg:text-[3rem]">
            Why Royal Job Seekers creates better career outcomes
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-[28px] border border-[#ddd6fe] bg-white p-6 shadow-[0_18px_45px_rgba(124,58,237,0.10)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-purple-100/80 blur-2xl" />
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#c4b5fd] via-[#8b5cf6] to-[#6d28d9]" />
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#ddd6fe] bg-gradient-to-b from-[#faf5ff] to-[#ede9fe] text-[#7c3aed]">
                    <Icon className="h-7 w-7" strokeWidth={2.3} />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold leading-tight text-[#0f172a]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#64748b]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default RoyalJobSeekersPage;