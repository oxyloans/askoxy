import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot,
  Users,
  BrainCircuit,
  Mic,
  ArrowRight,
  Briefcase,
  Cpu,
  Landmark,
  TrendingUp,
  Coins,
  Sparkles,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
  Mail,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { SiX } from "react-icons/si";

import RADHAI from "../../assets/img/radhai.png";
import TALKTOCEOLOGO from "../../assets/img/talktoceo.png";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSd7BMOmvNIfXgpnefXGoGeqJuLp1hege82srbNmQ9E3e-Lkjg/viewform";

const RadhAIPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const handleTalkToCEO = () => {
    navigate("/talktoceo");
  };

  const handleWriteToUs = () => {
    window.open(GOOGLE_FORM_URL, "_blank", "noopener,noreferrer");
  };

  const solutions = [
    { title: "Jobs", icon: Briefcase },
    { title: "AI", icon: Cpu },
    { title: "Loans", icon: Landmark },
    { title: "Investments", icon: TrendingUp },
    { title: "Gold", icon: Coins },
  ];

  const stats = [
    { icon: Users, count: "100+", label: "Employees" },
    { icon: BrainCircuit, count: "100+", label: "LLMs" },
    { icon: Bot, count: "1000+", label: "AI Agents" },
  ];

  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/oxyradhakrishna/",
      icon: Linkedin,
      color: "from-sky-400 to-blue-600",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/tvradhakrishna/",
      icon: Instagram,
      color: "from-pink-500 via-fuchsia-500 to-orange-400",
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/thatavarti.venkataradhakrishna/",
      icon: Facebook,
      color: "from-blue-400 to-blue-700",
    },
    {
      name: "Twitter / X",
      url: "https://x.com/RadhakrishnaIND",
      icon: SiX,
      color: "from-slate-200 to-slate-500",
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@askoxyDOTai",
      icon: Youtube,
      color: "from-red-500 to-red-700",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <style>
        {`
          @keyframes floatSlow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-18px); }
          }

          @keyframes scanMove {
            0% { transform: translateY(-120%); opacity: 0; }
            30% { opacity: 1; }
            100% { transform: translateY(650%); opacity: 0; }
          }

          @keyframes glowPulse {
            0%, 100% { opacity: 0.35; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.06); }
          }

          @keyframes rotateRing {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes writePulse {
            0%, 100% { box-shadow: 0 0 24px rgba(34, 211, 238, 0.25); }
            50% { box-shadow: 0 0 44px rgba(132, 255, 0, 0.35); }
          }

          .float-slow {
            animation: floatSlow 5s ease-in-out infinite;
          }

          .scan-line {
            animation: scanMove 4.5s linear infinite;
          }

          .glow-pulse {
            animation: glowPulse 3.2s ease-in-out infinite;
          }

          .rotate-ring {
            animation: rotateRing 14s linear infinite;
          }

          .write-pulse {
            animation: writePulse 2.4s ease-in-out infinite;
          }
        `}
      </style>

      <header className="fixed left-0 top-0 z-50 w-full border-b border-cyan-400/10 bg-[#050816]/85 backdrop-blur-2xl">
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <motion.img
            onClick={() => navigate("/radhAI")}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            src={TALKTOCEOLOGO}
            alt="Talk To CEO"
            className="h-9 w-auto cursor-pointer object-contain sm:h-12"
          />

          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              onClick={handleWriteToUs}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group hidden items-center gap-2 rounded-full border border-lime-300/30 bg-lime-300/10 px-4 py-2 text-xs font-black text-lime-300 transition hover:bg-lime-300 hover:text-black sm:inline-flex"
            >
              <Mail size={16} />
              Write to CEO
              <ExternalLink size={14} />
            </motion.button>

            <motion.button
              onClick={handleTalkToCEO}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden rounded-full border border-cyan-300/20 bg-gradient-to-r from-cyan-300 via-violet-300 to-lime-300 p-[1px] shadow-[0_0_30px_rgba(0,245,255,0.25)]"
            >
              <div className="flex items-center gap-2 rounded-full bg-[#050816] px-4 py-2 text-xs font-black text-white sm:px-6 sm:py-3 sm:text-sm">
                <Mic size={18} className="text-cyan-300 group-hover:text-lime-300" />
                Talk to CEO
              </div>
            </motion.button>
          </div>
        </div>
      </header>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(0,245,255,0.22),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(168,85,247,0.22),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(132,255,0,0.13),transparent_38%)]" />
      <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#00f5ff_1px,transparent_1px),linear-gradient(to_bottom,#00f5ff_1px,transparent_1px)] bg-[size:44px_44px]" />

      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-4 pb-14 pt-28 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, x: -45 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative order-1"
        >
          <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-r from-cyan-400/30 via-violet-500/30 to-lime-300/30 blur-2xl glow-pulse" />

          <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[30px] border border-cyan-300/25 bg-white/[0.045] p-4 shadow-[0_0_80px_rgba(0,245,255,0.15)] backdrop-blur-xl sm:min-h-[470px] lg:min-h-[570px]">
            <div className="scan-line pointer-events-none absolute left-0 top-0 h-24 w-full bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent" />
            <div className="rotate-ring absolute h-[230px] w-[230px] rounded-full border border-dashed border-cyan-300/25 sm:h-[380px] sm:w-[380px]" />
            <div className="absolute h-[190px] w-[190px] rounded-full bg-cyan-300/10 blur-3xl sm:h-[310px] sm:w-[310px]" />

            <motion.img
              src={RADHAI}
              alt="radhAI AI Clone"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="float-slow relative z-10 max-h-[305px] w-full object-contain drop-shadow-[0_0_45px_rgba(0,245,255,0.35)] sm:max-h-[450px] lg:max-h-[525px]"
            />

            <div className="absolute left-4 top-4 z-20 rounded-full border border-lime-300/30 bg-black/50 px-3 py-2 text-[10px] font-bold text-lime-300 backdrop-blur-xl sm:px-4 sm:text-xs">
              ● Voice with CEO Clone
            </div>
          </div>

          <div className="relative z-20 mt-5 flex flex-row items-center justify-center gap-3 lg:hidden">
            <motion.button
              onClick={handleTalkToCEO}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex min-h-[52px] flex-1 items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-lime-300 to-cyan-300 px-3 py-3 text-[11px] font-black text-black shadow-[0_0_35px_rgba(132,255,0,0.3)] xs:text-xs sm:text-sm"
            >
              <Mic size={17} />
              Talk to radhAI
            </motion.button>

            <motion.button
              onClick={handleWriteToUs}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="write-pulse group relative inline-flex min-h-[52px] flex-1 items-center justify-center gap-1.5 overflow-hidden rounded-2xl border border-cyan-300/40 bg-white/[0.07] px-3 py-3 text-[11px] font-black text-cyan-200 backdrop-blur-xl transition hover:border-lime-300/70 hover:text-lime-300 xs:text-xs sm:text-sm"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-700 group-hover:translate-x-full" />
              <MessageCircle size={17} className="relative z-10" />
              <span className="relative z-10">Write to CEO</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 45 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="order-2 text-center lg:text-left"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
            <Sparkles size={16} />
            Talk to CEO
          </div>

          <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
            Meet{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-lime-300 bg-clip-text text-transparent">
              radhAI
            </span>
          </h1>

          <h2 className="mt-4 text-2xl font-bold leading-snug text-slate-200 sm:text-3xl lg:text-4xl">
            CEO AI Clone Built to Solve Problems 24/7
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg lg:mx-0">
            <span className="font-semibold text-cyan-300">radhAI</span> is a
            personal AI clone built to guide users across{" "}
            <span className="font-semibold text-white">Jobs</span>,{" "}
            <span className="font-semibold text-lime-300">AI</span>,{" "}
            <span className="font-semibold text-violet-300">Loans</span>,{" "}
            <span className="font-semibold text-cyan-300">Investments</span>,
            and <span className="font-semibold text-yellow-300">Gold</span>.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
            {solutions.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.08 }}
                  whileHover={{ y: -5, scale: 1.04 }}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-slate-200 backdrop-blur-xl hover:border-cyan-300/40"
                >
                  <Icon size={16} className="text-cyan-300" />
                  {item.title}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 hidden flex-row gap-4 lg:flex">
            <motion.button
              onClick={handleTalkToCEO}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-lime-300 to-cyan-300 px-8 py-4 font-black text-black shadow-[0_0_40px_rgba(132,255,0,0.35)]"
            >
              <Mic size={20} />
              Talk to radhAI
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </motion.button>

            <motion.button
              onClick={handleWriteToUs}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="write-pulse group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-cyan-300/40 bg-white/[0.07] px-8 py-4 font-black text-cyan-200 backdrop-blur-xl transition hover:border-lime-300/70 hover:text-lime-300"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-700 group-hover:translate-x-full" />
              <MessageCircle size={20} className="relative z-10" />
              <span className="relative z-10">Write to CEO</span>
              <ExternalLink size={18} className="relative z-10" />
            </motion.button>
          </div>

          <p className="mt-4 text-sm text-slate-400">
            Submit your query through Google Form. Your response will be saved
            in Google Sheet for follow-up.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            {socialLinks.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + index * 0.08 }}
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.94 }}
                  className={`group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${item.color} shadow-[inset_0_2px_10px_rgba(255,255,255,0.35),0_10px_25px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:h-12 sm:w-12`}
                >
                  <span className="absolute inset-0 bg-white/20 opacity-0 transition duration-300 group-hover:opacity-100" />
                  <Icon size={20} className="relative z-10 text-white" />
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 px-4 pb-20 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-7xl rounded-[34px] border border-cyan-300/20 bg-white/[0.045] p-7 text-center shadow-[0_0_70px_rgba(0,245,255,0.12)] backdrop-blur-xl sm:p-10 lg:p-14"
        >
          <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            One AI Clone for Your{" "}
            <span className="text-lime-300">
              Daily Decisions & Opportunities
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg">
            radhAI connects users with the right guidance, opportunities, and
            actions across jobs, AI, loans, investments, and gold.
          </p>

          <div className="mt-9 grid gap-5 sm:grid-cols-3">
            {stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="rounded-3xl border border-white/10 bg-black/20 p-6 transition hover:border-lime-300/50 hover:shadow-[0_0_35px_rgba(132,255,0,0.18)]"
                >
                  <Icon className="mx-auto mb-3 text-cyan-300" size={34} />
                  <h3 className="text-4xl font-black">{item.count}</h3>
                  <p className="mt-1 text-slate-400">{item.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default RadhAIPage;