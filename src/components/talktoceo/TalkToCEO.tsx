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
      buttonText: "Start in Telugu",
      image: "https://i.ibb.co/JWY1SS2S/t1.png",
    },
    {
      code: "en",
      title: "English",
      native: "English",
      buttonText: "Start in English",
      image: "https://i.ibb.co/cSb2r71r/e1.png",
    },
    {
      code: "hi",
      title: "Hindi",
      native: "हिंदी",
      buttonText: "Start in Hindi",
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
        <div className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:px-6 lg:px-10">
          <motion.img
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            src={TALKTOCEOLOGO}
            alt="Talk To CEO"
            className="h-10 w-auto object-contain sm:h-12"
          />
        </div>
      </header>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,245,255,0.18),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(168,85,247,0.18),transparent_32%),radial-gradient(circle_at_50%_90%,rgba(132,255,0,0.12),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f5ff_1px,transparent_1px),linear-gradient(to_bottom,#00f5ff_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.05]" />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-10">
        <motion.section
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300 backdrop-blur-xl">
            <Languages size={16} />
            Multi Language CEO AI Clone
          </div>

          <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Talk to{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-lime-300 bg-clip-text text-transparent">
              radhAI
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Choose Telugu, English or Hindi and speak with radhAI for quick
            guidance on Jobs, AI, Gold, Loans and Investments.
          </p>
        </motion.section>

        <section className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {languages.map((item) => (
            <motion.div
              key={item.code}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 130, damping: 16 }}
              className="group rounded-[26px] border border-white/10 bg-white/[0.075] p-5 text-center shadow-[0_22px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-6"
            >
              <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.04]">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-transparent to-lime-300/10" />

                <motion.img
                  src={item.image}
                  alt={`${item.title} radhAI`}
                  className="relative z-10 h-44 w-full object-contain p-3 sm:h-48 lg:h-52"
                  whileHover={{ scale: 1.03 }}
                />
              </div>

              <h2 className="mt-5 text-2xl font-black">{item.native}</h2>

              <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                {item.title}
              </p>

              <motion.button
                onClick={() => handleStart(item.code)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-lime-300 to-cyan-300 px-5 py-3 text-sm font-black text-black shadow-[0_14px_35px_rgba(0,245,255,0.24)]"
              >
                <Mic size={17} />
                {item.buttonText}
                <ArrowRight size={17} />
              </motion.button>
            </motion.div>
          ))}
        </section>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                whileHover={{ y: -4, scale: 1.04 }}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-bold text-slate-200"
              >
                <Icon size={16} className="text-cyan-300" />
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