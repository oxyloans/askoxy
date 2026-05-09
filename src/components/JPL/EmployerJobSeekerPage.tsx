import React, { useEffect } from "react";
import {
  FileText,
  Bot,
  BarChart3,
  Building2,
  Sparkles,
  ClipboardCheck,
  Send,
  SearchCheck,
  UserCheck,
  BriefcaseBusiness,
  BadgeCheck,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import JPLHeader from "../JPL/JPLHeader";

const employerImage = "https://i.ibb.co/p6NZt2S4/Employer.png";

const EmployerJobSeekerPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, []);
  const roadmap = [
    {
      icon: FileText,
      title: "Upload Job Position",
      desc: "Employer submits job title, job description, skills, and experience requirements.",
    },
    {
      icon: Bot,
      title: "AI Conducts Interview",
      desc: "AI prepares and conducts an interview based on the job description.",
    },
    {
      icon: ClipboardCheck,
      title: "Assessment Completed",
      desc: "Job seeker completes the AI assessment for the selected role.",
    },
    {
      icon: BarChart3,
      title: "Score Generated",
      desc: "AI evaluates skills, job fit, and readiness based on the interview.",
    },
    {
      icon: SearchCheck,
      title: "Qualified Profile Selected",
      desc: "Only candidates with strong scores are shortlisted.",
    },
    {
      icon: Send,
      title: "Profile Sent to Employer",
      desc: "Qualified job seeker profiles are shared with the employer for the next interview.",
    },
  ];

  const uses = [
    {
      icon: Clock,
      title: "Saves Employer Time",
      desc: "Employers review only qualified profiles instead of screening every resume manually.",
    },
    {
      icon: UserCheck,
      title: "Right People Connect",
      desc: "Only job seekers who match the role and score well move to employer interaction.",
    },
    {
      icon: BadgeCheck,
      title: "Improves Job Seekers",
      desc: "Assessment results help job seekers understand gaps and improve their skills.",
    },
  ];

  const glossyCard =
    "group relative overflow-hidden rounded-[26px] border border-white/80 bg-gradient-to-b from-white via-[#f8fbff] to-[#eaf3ff] p-6 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_0_rgba(147,197,253,0.35),0_8px_0_rgba(147,197,253,0.45)] backdrop-blur-xl transition-all duration-300 [transform:perspective(900px)_rotateX(5deg)_rotateY(-4deg)] hover:-translate-y-1 hover:[transform:perspective(900px)_rotateX(2deg)_rotateY(0deg)]";

  const glossyIcon =
    "relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[#93c5fd] bg-gradient-to-b from-[#eff6ff] via-[#93c5fd] to-[#60a5fa] text-[#0f3d91] shadow-[inset_0_2px_0_rgba(255,255,255,0.85),inset_0_-3px_0_rgba(96,165,250,0.55),0_5px_0_rgba(147,197,253,0.75)]";

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

        <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1d4ed8] backdrop-blur-xl sm:text-xs">
                <Building2 className="h-4 w-4" />
                For Employers
              </div>

              <h1 className="mt-5 text-[2rem] font-extrabold leading-tight text-[#0f172a] sm:text-[2.5rem] lg:text-[3rem]">
                Hire qualified job seekers faster with{" "}
                <span className="text-[#1d4ed8]">AI assessment</span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#64748b] sm:text-base lg:mx-0">
                Employers upload job positions and job descriptions. AI conducts
                interviews based on the JD, evaluates candidates, and sends only
                qualified job seeker profiles to the employer.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-end"
            >
              <img
                src={employerImage}
                alt="Employer AI hiring"
                className="w-full max-w-[330px] object-contain drop-shadow-[0_24px_50px_rgba(15,23,42,0.16)] sm:max-w-[430px] lg:max-w-[560px]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-16 lg:pb-20">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1d4ed8]">
            <Sparkles className="h-4 w-4" />
            Employer Roadmap
          </div>

          <h2 className="mt-4 text-[2rem] font-extrabold leading-tight text-[#0f172a] sm:text-[2.5rem] lg:text-[3rem]">
            From job post to qualified profile
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

                <p className="relative mb-2 mt-5 text-xs font-extrabold text-[#1d4ed8]">
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
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1d4ed8]">
            <BriefcaseBusiness className="h-4 w-4" />
            Employer Benefits
          </div>

          <h2 className="mt-4 text-[2rem] font-extrabold leading-tight text-[#0f172a] sm:text-[2.5rem] lg:text-[3rem]">
            Why this helps employers and job seekers
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {uses.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-[28px] border border-[#dbeafe] bg-white p-6 shadow-[0_18px_45px_rgba(30,64,175,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(30,64,175,0.16)]"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-100/70 blur-2xl" />
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#60a5fa] via-[#2563eb] to-[#1d4ed8]" />

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#bfdbfe] bg-gradient-to-b from-[#eff6ff] to-[#dbeafe] text-[#1d4ed8] shadow-[inset_0_2px_0_rgba(255,255,255,0.95),0_10px_24px_rgba(37,99,235,0.16)]">
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

export default EmployerJobSeekerPage;