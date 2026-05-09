import React, { useEffect } from "react";
import {
  Users,
  SearchCheck,
  ClipboardCheck,
  Send,
  Building2,
  ShieldCheck,
  Sparkles,
  Swords,
  FileSearch,
  UserCheck,
  Briefcase,
  BadgeCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import JPLHeader from "../JPL/JPLHeader";

const pageImage = "https://i.ibb.co/Y7FL37cR/recruiter.png";

const RecruitmentKnightRidersPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, []);

  const roadmap = [
    {
      icon: Building2,
      title: "Receive Employer Requirements",
      desc: "Employers share role details, hiring priorities, required skills, and candidate expectations.",
    },
    {
      icon: Users,
      title: "Assign Recruitment Partners",
      desc: "Recruiters and consulting companies receive relevant openings for sourcing.",
    },
    {
      icon: FileSearch,
      title: "Source Relevant Talent",
      desc: "Recruiters identify suitable candidates from job seekers, databases, and professional networks.",
    },
    {
      icon: SearchCheck,
      title: "AI Profile Screening",
      desc: "AI evaluates resume fit, skill alignment, experience match, and qualification strength.",
    },
    {
      icon: ClipboardCheck,
      title: "Submit Qualified Profiles",
      desc: "Only shortlisted and AI-qualified profiles are submitted to employers for review.",
    },
    {
      icon: Send,
      title: "Complete Hiring Process",
      desc: "Employers review, interview, and close positions with a faster recruitment workflow.",
    },
  ];

  const benefits = [
    {
      icon: ShieldCheck,
      title: "Trusted Talent Sourcing",
      desc: "Recruitment partners source stronger profiles with AI-assisted qualification support.",
    },
    {
      icon: UserCheck,
      title: "AI-Qualified Candidates",
      desc: "Employers receive candidates filtered for role fit, skill match, and readiness.",
    },
    {
      icon: Briefcase,
      title: "Accelerated Hiring Outcomes",
      desc: "Recruiters help employers reduce screening time and close open positions faster.",
    },
  ];

  const glossyCard =
    "group relative overflow-hidden rounded-[26px] border border-white/80 bg-gradient-to-b from-white via-[#f0fdfa] to-[#ccfbf1] p-6 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_0_rgba(20,184,166,0.30),0_8px_0_rgba(20,184,166,0.35)] backdrop-blur-xl transition-all duration-300 [transform:perspective(900px)_rotateX(5deg)_rotateY(-4deg)] hover:-translate-y-1 hover:[transform:perspective(900px)_rotateX(2deg)_rotateY(0deg)]";

  const glossyIcon =
    "relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[#0f766e] bg-gradient-to-b from-[#99f6e4] via-[#14b8a6] to-[#0f766e] text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.45),inset_0_-3px_0_rgba(15,118,110,0.65),0_5px_0_rgba(15,118,110,0.55)]";

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

        <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-green-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f766e] backdrop-blur-xl sm:text-xs">
                <Swords className="h-4 w-4" />
                AI-Assisted Talent Acquisition
              </div>

              <h1 className="mt-5 text-[2rem] font-extrabold leading-tight text-[#0f172a] sm:text-[2.5rem] lg:text-[3rem]">
                Accelerate hiring with{" "}
                <span className="text-[#0f766e]">
                  AI-qualified talent pipelines
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#64748b] sm:text-base lg:mx-0">
                Recruitment Knight Riders empowers recruiters and consulting
                partners to source, evaluate, and deliver AI-qualified
                candidates aligned with employer hiring requirements and
                business goals.
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
                alt="Recruitment Knight Riders"
                className="w-full max-w-[330px] object-contain drop-shadow-[0_24px_50px_rgba(15,23,42,0.16)] sm:max-w-[430px] lg:max-w-[560px]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-16 lg:pb-20">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#0f766e]">
            <Sparkles className="h-4 w-4" />
            Recruitment Execution Flow
          </div>

          <h2 className="mt-4 text-[2rem] font-extrabold leading-tight text-[#0f172a] sm:text-[2.5rem] lg:text-[3rem]">
            From employer requirements to successful hiring
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

                <p className="relative mb-2 mt-5 text-xs font-extrabold text-[#0f766e]">
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
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#0f766e]">
            <BadgeCheck className="h-4 w-4" />
            Recruitment Advantages
          </div>

          <h2 className="mt-4 text-[2rem] font-extrabold leading-tight text-[#0f172a] sm:text-[2.5rem] lg:text-[3rem]">
            Why recruitment partners achieve faster hiring success
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
                className="group relative overflow-hidden rounded-[28px] border border-[#99f6e4] bg-white p-6 shadow-[0_18px_45px_rgba(15,118,110,0.10)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-teal-100/80 blur-2xl" />
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#5eead4] via-[#14b8a6] to-[#0f766e]" />

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#99f6e4] bg-gradient-to-b from-[#f0fdfa] to-[#ccfbf1] text-[#0f766e]">
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

export default RecruitmentKnightRidersPage;