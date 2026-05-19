import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Languages,
  Mic,
  ArrowRight,
  Briefcase,
  Cpu,
  Coins,
  Landmark,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

import TALKTOCEOLOGO from "../../assets/img/talktoceo.png";

const TalkToCEO: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const languages = [
    {
      code: "te",
      title: "Telugu",
      native: "తెలుగు",
      buttonText: "Telugu",
      image: "https://i.ibb.co/JWY1SS2S/t1.png",
    },
    {
      code: "en",
      title: "English",
      native: "English",
      buttonText: "English",
      image: "https://i.ibb.co/cSb2r71r/e1.png",
    },
    {
      code: "hi",
      title: "Hindi",
      native: "हिंदी",
      buttonText: "Hindi",
      image: "https://i.ibb.co/VckNWCXp/h1.png",
    },
  ];

  const services = [
    { name: "Jobs", icon: Briefcase },
    { name: "AI", icon: Cpu },
    { name: "Gold", icon: Coins },
    { name: "Loans", icon: Landmark },
    { name: "Investments", icon: TrendingUp },
  ];

  const handleStart = (languageCode: string) => {
    navigate("/radhAI-talk", { state: { languageCode } });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#050816]/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-6 lg:px-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/15 sm:text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <motion.img
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            src={TALKTOCEOLOGO}
            alt="Talk To CEO"
            className="h-9 w-auto object-contain sm:h-12"
          />

          <button
            onClick={() => navigate("/radhAI-talk")}
            className="rounded-full bg-gradient-to-r from-lime-300 to-cyan-300 px-3 py-2 text-xs font-black text-black shadow-[0_10px_25px_rgba(0,245,255,0.2)] sm:px-4 sm:text-sm"
          >
            Talk
          </button>
        </div>
      </header>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,245,255,0.18),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(168,85,247,0.18),transparent_32%),radial-gradient(circle_at_50%_90%,rgba(132,255,0,0.12),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f5ff_1px,transparent_1px),linear-gradient(to_bottom,#00f5ff_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.05]" />

      <main className="relative z-10 mx-auto max-w-7xl px-3 pb-10 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-10">
        <motion.section
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-300 backdrop-blur-xl sm:px-4 sm:text-xs">
            <Languages size={15} />
            Multi Language CEO AI Clone
          </div>

          <h1 className="text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Talk to{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-lime-300 bg-clip-text text-transparent">
              radhAI
            </span>
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-slate-300 sm:mt-4 sm:text-base sm:leading-7">
            Choose Telugu, English or Hindi and speak with radhAI for quick
            guidance on Jobs, AI, Gold, Loans and Investments.
          </p>
        </motion.section>

        <section className="mx-auto mt-8 grid max-w-6xl grid-cols-3 gap-2 sm:mt-12 sm:gap-5 lg:gap-8">
          {languages.map((item) => (
            <motion.div
              key={item.code}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 130, damping: 16 }}
              className="group rounded-2xl border border-white/10 bg-white/[0.075] p-2 text-center shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:rounded-[26px] sm:p-5 lg:p-6"
            >
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] sm:rounded-[22px]">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-transparent to-lime-300/10" />

                <motion.img
                  src={item.image}
                  alt={`${item.title} radhAI`}
                  className="relative z-10 h-24 w-full object-contain p-1 sm:h-44 sm:p-3 lg:h-52"
                  whileHover={{ scale: 1.03 }}
                />
              </div>

              <h2 className="mt-3 text-sm font-black sm:mt-5 sm:text-2xl">
                {item.native}
              </h2>

              <p className="mt-1 hidden text-xs font-bold uppercase tracking-[0.18em] text-cyan-300 sm:block">
                {item.title}
              </p>

              <motion.button
                onClick={() => handleStart(item.code)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-lime-300 to-cyan-300 px-2 py-2 text-[10px] font-black text-black shadow-[0_14px_35px_rgba(0,245,255,0.24)] sm:mt-6 sm:gap-2 sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm"
              >
                <Mic size={14} />
                {item.buttonText}
                <ArrowRight size={14} className="hidden sm:block" />
              </motion.button>
            </motion.div>
          ))}
        </section>

        <div className="mt-8 grid grid-cols-3 gap-2 sm:mt-10 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                whileHover={{ y: -4, scale: 1.04 }}
                className="flex items-center justify-center gap-1 rounded-full border border-white/10 bg-white/[0.07] px-2 py-2 text-[10px] font-bold text-slate-200 sm:gap-2 sm:px-4 sm:text-sm"
              >
                <Icon size={14} className="text-cyan-300 sm:size-4" />
                {item.name}
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default TalkToCEO;