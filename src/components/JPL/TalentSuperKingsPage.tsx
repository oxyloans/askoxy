import React, { useEffect } from "react";
import {
  GraduationCap,
  Users,
  Upload,
  IndianRupee,
  Sparkles,
  BookOpen,
  TrendingUp,
  School,
  BrainCircuit,
  MonitorPlay,
  BadgeCheck,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import JPLHeader from "../JPL/JPLHeader";

const pageImage =
  "https://i.ibb.co/N6N53YF6/talent.png";

const TrainingInstituteGiantsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, []);

  const roadmap = [
    {
      icon: School,
      title: "Institute Registration",
      desc: "Training institutes, coaching centers, and academies join the platform ecosystem.",
    },
    {
      icon: Upload,
      title: "Upload Training Programs",
      desc: "Institutes publish online, offline, classroom, and hybrid training offerings.",
    },
    {
      icon: IndianRupee,
      title: "Add Course Pricing",
      desc: "Institutes create transparent course rate cards and training packages.",
    },
    {
      icon: MonitorPlay,
      title: "Reach Job Aspirants",
      desc: "The platform connects relevant learners and job aspirants to training programs.",
    },
    {
      icon: GraduationCap,
      title: "Train & Upskill Students",
      desc: "Institutes help students improve technical, domain, and employability skills.",
    },
    {
      icon: UserCheck,
      title: "Move Students to Royal Job Seekers",
      desc: "Trained candidates upload resumes into Royal Job Seekers for AI qualification and hiring opportunities.",
    },
  ];

  const benefits = [
    {
      icon: BookOpen,
      title: "Sell Training Programs",
      desc: "Institutes can promote and sell classroom, online, and hybrid training programs directly.",
    },
    {
      icon: Users,
      title: "Reach More Job Aspirants",
      desc: "The platform helps institutes attract students actively searching for career growth.",
    },
    {
      icon: TrendingUp,
      title: "Improve Placement Outcomes",
      desc: "Institutes can guide trained candidates into Royal Job Seekers for hiring and career opportunities.",
    },
  ];

  const glossyCard =
    "group relative overflow-hidden rounded-[26px] border border-white/80 bg-gradient-to-b from-white via-[#fffdf0] to-[#fef9c3] p-6 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_0_rgba(234,179,8,0.30),0_8px_0_rgba(234,179,8,0.35)] backdrop-blur-xl transition-all duration-300 [transform:perspective(900px)_rotateX(5deg)_rotateY(-4deg)] hover:-translate-y-1 hover:[transform:perspective(900px)_rotateX(2deg)_rotateY(0deg)]";

  const glossyIcon =
    "relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[#ca8a04] bg-gradient-to-b from-[#fde68a] via-[#eab308] to-[#a16207] text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.45),inset_0_-3px_0_rgba(113,63,18,0.65),0_5px_0_rgba(161,98,7,0.55)]";

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

        <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#ca8a04] backdrop-blur-xl sm:text-xs">
                <BrainCircuit className="h-4 w-4" />
                Training Institute Giants
              </div>

              <h1 className="mt-5 text-[2rem] font-extrabold leading-tight text-[#0f172a] sm:text-[2.5rem] lg:text-[3rem]">
                Build, sell, and scale{" "}
                <span className="text-[#ca8a04]">
                  training programs online
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#64748b] sm:text-base lg:mx-0">
                Training Institute Giants enables institutes, academies, and
                coaching centers to publish training programs, add rate cards,
                attract job aspirants, and guide trained students into Royal
                Job Seekers for AI-powered hiring opportunities.
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
                alt="Training Institute Giants"
                className="w-full max-w-[330px] object-contain drop-shadow-[0_24px_50px_rgba(15,23,42,0.16)] sm:max-w-[430px] lg:max-w-[560px]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-16 lg:pb-20">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#ca8a04]">
            <Sparkles className="h-4 w-4" />
            Training & Placement Ecosystem
          </div>

          <h2 className="mt-4 text-[2rem] font-extrabold leading-tight text-[#0f172a] sm:text-[2.5rem] lg:text-[3rem]">
            From training programs to career opportunities
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

                <p className="relative mb-2 mt-5 text-xs font-extrabold text-[#ca8a04]">
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
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#ca8a04]">
            <BadgeCheck className="h-4 w-4" />
            Institute Growth Benefits
          </div>

          <h2 className="mt-4 text-[2rem] font-extrabold leading-tight text-[#0f172a] sm:text-[2.5rem] lg:text-[3rem]">
            Why Training Institute Giants helps institutes grow faster
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
                className="group relative overflow-hidden rounded-[28px] border border-[#fde68a] bg-white p-6 shadow-[0_18px_45px_rgba(202,138,4,0.10)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-yellow-100/80 blur-2xl" />

                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#fde68a] via-[#eab308] to-[#a16207]" />

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#fde68a] bg-gradient-to-b from-[#fffdf0] to-[#fef9c3] text-[#ca8a04]">
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

export default TrainingInstituteGiantsPage;