import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot,
  Briefcase,
  Coins,
  Cpu,
  Landmark,
  Languages,
  Mic,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import RADHAI from "../../assets/img/radhai.png";
type LanguageCode = "te" | "en" | "hi";


const LANGUAGES = [
  {
    code: "te" as LanguageCode,
    name: "Telugu",
    nativeName: "తెలుగు",
    description: "తెలుగులో మాట్లాడండి",
    gradient: "from-[#FF9933] via-[#FFCC00] to-[#FF6B35]",
    glow: "rgba(255,153,51,0.35)",
  },
  {
    code: "en" as LanguageCode,
    name: "English",
    nativeName: "English",
    description: "Speak in English",
    gradient: "from-[#B8FF5E] via-[#78F0D8] to-[#5CE1E6]",
    glow: "rgba(92,225,230,0.35)",
  },
  {
    code: "hi" as LanguageCode,
    name: "Hindi",
    nativeName: "हिन्दी",
    description: "हिन्दी में बात करें",
    gradient: "from-[#FF6B9D] via-[#C850C0] to-[#4158D0]",
    glow: "rgba(200,80,192,0.35)",
  },
];

const SERVICES = [
  { title: "Jobs", icon: Briefcase },
  { title: "AI Tools", icon: Cpu },
  { title: "Loans", icon: Landmark },
  { title: "Investments", icon: TrendingUp },
  { title: "Gold", icon: Coins },
];

const ECOSYSTEMS = [
  { name: "ASKOXY.AI", color: "#FFD700", bg: "rgba(255,215,0,0.1)" },
  { name: "OXYLOANS", color: "#5CE1E6", bg: "rgba(92,225,230,0.1)" },
  { name: "OXYBRICKS.WORLD", color: "#B8FF5E", bg: "rgba(184,255,94,0.1)" },
  { name: "OXYGOLD.AI", color: "#FF9933", bg: "rgba(255,153,51,0.1)" },
  { name: "OXYGLOBAL.TECH", color: "#C850C0", bg: "rgba(200,80,192,0.1)" },
  { name: "OXYCHAIN", color: "#4158D0", bg: "rgba(65,88,208,0.1)" },
];
export default function MyClonePage() {
  const navigate = useNavigate();
  const [hoveredLang, setHoveredLang] = useState<LanguageCode | null>(null);
  const languageSectionRef = useRef<HTMLDivElement>(null);

  const handleTalkToClone = () => {
    languageSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSelectLanguage = (languageCode: LanguageCode) => {
    const primaryType =
      sessionStorage.getItem("primaryType") ||
      localStorage.getItem("primaryType") ||
      (sessionStorage.getItem("radhAIAdminLogin") === "true" ? "SALESSUPPERADMIN" : "");

    const userId =
      sessionStorage.getItem("userId") || localStorage.getItem("userId") || "";
    const name =
      sessionStorage.getItem("radhName") ||
      sessionStorage.getItem("userName") ||
      localStorage.getItem("userName") || "";
    const mobileNumber =
      sessionStorage.getItem("mobileNumber") ||
      localStorage.getItem("mobileNumber") || "";
    const email =
      sessionStorage.getItem("radhEmail") ||
      localStorage.getItem("email") || "";

    navigate("/radhai-assistant", {
      state: { languageCode, from: "admin", primaryType, userId, name, mobileNumber, email },
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Background grid + radial glows */}
      <div className="pointer-events-none fixed inset-0 bg-[length:52px_52px,52px_52px,auto,auto,auto] bg-[linear-gradient(rgba(92,225,230,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(92,225,230,0.06)_1px,transparent_1px),radial-gradient(circle_at_20%_20%,rgba(44,224,231,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(176,104,255,0.2),transparent_38%),radial-gradient(circle_at_50%_90%,rgba(184,255,94,0.1),transparent_40%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
  <div className="flex flex-wrap items-center gap-4">
  <div className="inline-flex items-center gap-2 rounded-full border border-[#5CE1E6]/30 bg-[#5CE1E6]/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#5CE1E6]">
    <Sparkles size={13} />
    CEO AI Clone
  </div>
  <div>
    <div className="flex items-center gap-3">
      <h1 className="text-3xl font-black sm:text-4xl">
        Meet{" "}
        <span className="bg-gradient-to-r from-[#B8FF5E] via-[#78F0D8] to-[#5CE1E6] bg-clip-text text-transparent">
          radhAI
        </span>
      </h1>
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTalkToClone}
        className="lg:hidden flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#B8FF5E] via-[#78F0D8] to-[#5CE1E6] px-4 py-2 text-xs font-black text-[#051018] shadow-[0_4px_20px_rgba(92,225,230,0.4)]"
      >
        <Mic size={13} />
        Talk to My Clone
      </motion.button>
    </div>
    <p className="mt-1 text-sm text-[#B8C2D8]">
      AI Voice Clone of Radhakrishna Thatavarti · Choose your language to begin
    </p>
  </div>
</div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">

          {/* Left — Avatar panel */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-4"
          >
         {/* Avatar card */}
            <div className="overflow-hidden rounded-[28px] border border-[#5CE1E6]/15 bg-white/[0.06] p-4 backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0D1A2E] to-[#050816]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#5CE1E6]/5 to-transparent" />
              <img
  src={RADHAI}
  alt="radhAI"
  className="w-full object-contain"
/>
              
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#B8FF5E] to-[#5CE1E6] text-[#051018]">
                    <Bot size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">radhAI</p>
                    <p className="text-[10px] text-[#B8C2D8]">CEO AI Voice Clone</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-[#B8C2D8]">
                  CEO AI Clone built to solve problems 24/7 — guides users across
                  Jobs, AI, Loans, Investments, and Gold with AI-powered support.
                </p>

                {/* Service pills */}
                <div className="mt-4 border-t border-[#5CE1E6]/10 pt-4">
                  <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-[#5CE1E6]">
                    Expertise
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SERVICES.map(({ title, icon: Icon }) => (
                      <div
                        key={title}
                        className="flex items-center gap-1.5 rounded-full border border-[#5CE1E6]/15 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-[#F0F4FF]"
                      >
                        <Icon size={12} className="text-[#5CE1E6]" />
                        {title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Ecosystem grid */}
            {/* <div className="rounded-[22px] border border-[#5CE1E6]/15 bg-white/[0.05] p-4 backdrop-blur-xl">
              <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-[#5CE1E6]">
                OXY Ecosystem
              </p>
              <div className="grid grid-cols-2 gap-2">
                {ECOSYSTEMS.map(({ name, color, bg }) => (
                  <div
                    key={name}
                    className="rounded-xl border px-2 py-2 text-center text-[9px] font-black"
                    style={{
                      borderColor: `${color}30`,
                      background: bg,
                      color,
                    }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div> */}
          </motion.div>

          {/* Right — Language selector */}
          <motion.div
            ref={languageSectionRef}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            {/* Select language heading */}
            <div className="rounded-[28px] border border-[#5CE1E6]/15 bg-white/[0.06] p-6 backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5CE1E6]/10 text-[#5CE1E6]">
                  <Languages size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black">Choose Your Language</h2>
                  <p className="text-xs text-[#B8C2D8]">
                    Select a language to start your voice session with radhAI
                  </p>
                </div>
              </div>

              {/* Language cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                {LANGUAGES.map((lang, i) => (
                  <motion.button
                    key={lang.code}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onHoverStart={() => setHoveredLang(lang.code)}
                    onHoverEnd={() => setHoveredLang(null)}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className="group relative overflow-hidden rounded-[22px] border bg-white/[0.06] p-6 text-left transition-all duration-300"
                    style={{
                      borderColor:
                        hoveredLang === lang.code
                          ? `${lang.glow}`
                          : "rgba(92,225,230,0.15)",
                      boxShadow:
                        hoveredLang === lang.code
                          ? `0 20px 60px ${lang.glow}`
                          : "none",
                    }}
                  >
                    {/* Gradient shimmer bg */}
                    <div
                      className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br ${lang.gradient}`}
                      style={{ opacity: hoveredLang === lang.code ? 0.07 : 0 }}
                    />

                    {/* Mic icon with gradient */}
                    <div
                      className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${lang.gradient} text-[#051018] shadow-lg`}
                    >
                      <Mic size={22} />
                    </div>

                    <div className="mb-2">
                      <p className="text-xl font-black">{lang.nativeName}</p>
                      <p className="text-xs font-bold text-[#B8C2D8]">{lang.name}</p>
                    </div>

                    <p className="text-[11px] text-[#8A94AA]">{lang.description}</p>

                    {/* Arrow */}
                    <div
                      className={`mt-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${lang.gradient} px-3 py-1.5 text-[10px] font-black text-[#051018]`}
                    >
                      Start →
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="rounded-[28px] border border-[#5CE1E6]/15 bg-white/[0.05] p-6 backdrop-blur-xl">
              <p className="mb-4 text-sm font-black text-[#F7FAFF]">How it works</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { step: "01", title: "Choose Language", desc: "Pick Telugu, English, or Hindi" },
                  { step: "02", title: "Start Voice", desc: "Tap Start Voice to connect radhAI" },
                  { step: "03", title: "Ask Anything", desc: "Speak or type your question" },
                ].map(({ step, title, desc }) => (
                  <div
                    key={step}
                    className="flex gap-3 rounded-xl border border-white/[0.07] bg-white/[0.04] p-3"
                  >
                    <span className="shrink-0 text-xl font-black text-[#5CE1E6]/30">
                      {step}
                    </span>
                    <div>
                      <p className="text-xs font-black text-[#F7FAFF]">{title}</p>
                      <p className="mt-0.5 text-[10px] text-[#8A94AA]">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}