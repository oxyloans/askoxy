import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Workflow,
  Lightbulb,
  Link2,
  Database,
  Laptop,
  Scale,
  Brain,
  Users,
  GitMerge,
  Plug,
  Map,
  FileBarChart,
  ShieldCheck,
  Code,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Cpu,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- Data ---
const marqueeImages = [
  "https://i.ibb.co/jZv52ZCN/ai1-jpg.jpg",
  "https://i.ibb.co/fVSfvfvZ/AI2-jpg-1.jpg",
  "https://i.ibb.co/dwBpNtXw/AI3-jpg-1.jpg",
  "https://i.ibb.co/VcGFCCfF/AI4-jpg-1.jpg",
  "https://i.ibb.co/cKBT2ctj/AI5-jpg-1.jpg",
  "https://i.ibb.co/v4yZxG7t/ai6-jpg.jpg",
  "https://i.ibb.co/LXzRkJQK/AI7-jpg.jpg",
  "https://i.ibb.co/vxK9ZzYg/IMG-20260602-WA0042-jpg.jpg",
  "https://i.ibb.co/8gBBcYR7/IMG-20260602-WA0044-jpg.jpg",
  "https://i.ibb.co/CshbWWm9/IMG-20260602-WA0045-jpg.jpg",
  "https://i.ibb.co/8DmXggxB/ai11-jpg.jpg",
  "https://i.ibb.co/NdTNpQQ0/IMG-20260603-WA0015-jpg.jpg",
  "https://i.ibb.co/wZt41zfJ/ai13-jpg.jpg",
  "https://i.ibb.co/7x7sDdCn/ai14-jpg.jpg",
  "https://i.ibb.co/1tC9H3mt/ai15-jpg.jpg",
  "https://i.ibb.co/mFR7LmR8/ai16-jpg.jpg",
  "https://i.ibb.co/fgLJDj5/ai17-jpg.jpg",
  "https://i.ibb.co/3YFxcRWZ/ai18-jpg.jpg",
  "https://i.ibb.co/KxqnD23k/ai19-jpg.jpg",
  "https://i.ibb.co/7JN6jHLd/ai20-jpg.jpg",
  "https://i.ibb.co/xtQ7DQtK/ai21-jpg.jpg",
  "https://i.ibb.co/272SqS9w/ai22-jpg.jpg",
  "https://i.ibb.co/yBxZT4mS/ai23-jpg.jpg",
  "https://i.ibb.co/rRd0BgNp/ai24-jpg.jpg",
  "https://i.ibb.co/7t7dv9z2/ai25-jpg.jpg",
  "https://i.ibb.co/6JymByHb/ai26-jpg.jpg",
  "https://i.ibb.co/KzDNNw2c/ai27-jpg.jpg",
  "https://i.ibb.co/6Jv60J6n/ai28-jpg.jpg",
  "https://i.ibb.co/PGzDvhbP/ai29-jpg.jpg",
  "https://i.ibb.co/Z6KYmm2f/ai30-jpg-1.jpg",
];

const stepsData = [
  {
    phase: "Phase 1: Business Discovery",
    color: "from-blue-600 to-cyan-500",
    items: [
      {
        id: 1,
        title: "DOMAIN DISCOVERY",
        icon: Building2,
        desc: "Define business domain & geography.",
      },
      {
        id: 2,
        title: "PROCESS DISCOVERY",
        icon: Workflow,
        desc: "Understand current workflows & systems.",
      },
      {
        id: 3,
        title: "USE CASE DISCOVERY",
        icon: Lightbulb,
        desc: "Identify AI automation opportunities.",
      },
    ],
  },
  {
    phase: "Phase 2: Intelligence Discovery",
    color: "from-purple-600 to-pink-500",
    items: [
      {
        id: 4,
        title: "DEPENDENCY DISCOVERY",
        icon: Link2,
        desc: "Trace upstream data dependencies.",
      },
      {
        id: 5,
        title: "INPUT DISCOVERY",
        icon: Database,
        desc: "Identify required data dictionaries.",
      },
      {
        id: 6,
        title: "SYSTEM DISCOVERY",
        icon: Laptop,
        desc: "Map LOS, LMS, CBS, and Data Warehouses.",
      },
      {
        id: 7,
        title: "REGULATORY DISCOVERY",
        icon: Scale,
        desc: "Ensure RBI, CBUAE, SAMA compliance.",
      },
    ],
  },
  {
    phase: "Phase 3: AI Design",
    color: "from-orange-500 to-amber-500",
    items: [
      {
        id: 8,
        title: "AI PATTERN DISCOVERY",
        icon: Brain,
        desc: "Select Prediction, Scoring, or NLP models.",
      },
      {
        id: 9,
        title: "AGENT DISCOVERY",
        icon: Users,
        desc: "Map tasks to internal AI Agents.",
      },
      {
        id: 10,
        title: "DECISION FLOW",
        icon: GitMerge,
        desc: "Build the AI business rule engine.",
      },
    ],
  },
  {
    phase: "Phase 4: Integration & Delivery",
    color: "from-emerald-500 to-teal-400",
    items: [
      {
        id: 11,
        title: "API DISCOVERY",
        icon: Plug,
        desc: "Map internal & external APIs.",
      },
      {
        id: 12,
        title: "INTEGRATION MAPPING",
        icon: Map,
        desc: "Design workflow integration points.",
      },
      {
        id: 13,
        title: "REPORT GENERATION",
        icon: FileBarChart,
        desc: "Build management dashboards.",
      },
      {
        id: 14,
        title: "GRC GENERATION",
        icon: ShieldCheck,
        desc: "Create audit and risk frameworks.",
      },
      {
        id: 15,
        title: "CODE GENERATION",
        icon: Code,
        desc: "Deploy full orchestration code.",
      },
    ],
  },
];

const agents = [
  { id: 1,  name: "KYC VERIFY",        icon: ShieldCheck },
  { id: 2,  name: "AML SCREEN",         icon: Shield },
  { id: 3,  name: "CREDIT SCORE",       icon: Zap },
  { id: 4,  name: "FRAUD DETECT",       icon: Shield },
  { id: 5,  name: "LOAN ORIGINATE",     icon: FileBarChart },
  { id: 6,  name: "UNDERWRITING",       icon: Brain },
  { id: 7,  name: "RISK ENGINE",        icon: Scale },
  { id: 8,  name: "COMPLIANCE",         icon: ShieldCheck },
  { id: 9,  name: "ONBOARDING",         icon: Users },
  { id: 10, name: "SANCTIONS",          icon: Scale },
  { id: 11, name: "AUDIT TRAIL",        icon: FileBarChart },
  { id: 12, name: "ALERT ENGINE",       icon: Zap },
  { id: 13, name: "DOCUMENT AI",        icon: Code },
  { id: 14, name: "OCR ENGINE",         icon: Laptop },
  { id: 15, name: "TRADE FINANCE",      icon: Globe },
  { id: 16, name: "TREASURY",           icon: Building2 },
  { id: 17, name: "FOREX AGENT",        icon: Zap },
  { id: 18, name: "LIQUIDITY",          icon: Database },
  { id: 19, name: "ASSET QUALITY",      icon: ShieldCheck },
  { id: 20, name: "COLLECTION AI",      icon: GitMerge },
  { id: 21, name: "PAYMENT RISK",       icon: Shield },
  { id: 22, name: "NPA PREDICT",        icon: Brain },
  { id: 23, name: "LOAN MATCH",         icon: Lightbulb },
  { id: 24, name: "EMI CALC",           icon: FileBarChart },
  { id: 25, name: "DTI ENGINE",         icon: Scale },
  { id: 26, name: "BUREAU FETCH",       icon: Database },
  { id: 27, name: "INCOME VERIFY",      icon: ShieldCheck },
  { id: 28, name: "COLLATERAL VAL",     icon: Building2 },
  { id: 29, name: "REINSURANCE",        icon: Shield },
  { id: 30, name: "ACTUARIAL",          icon: Brain },
  { id: 31, name: "PORTFOLIO MON",      icon: FileBarChart },
  { id: 32, name: "STRESS TEST",        icon: Scale },
  { id: 33, name: "EARLY WARNING",      icon: Zap },
  { id: 34, name: "TRANSACTION MON",    icon: GitMerge },
  { id: 35, name: "BEHAVIOURAL AI",     icon: Brain },
  { id: 36, name: "CHURN PREDICT",      icon: Users },
  { id: 37, name: "CROSS SELL AI",      icon: Zap },
  { id: 38, name: "CUSTOMER SEGMENT",   icon: Workflow },
  { id: 39, name: "PRICING AI",         icon: FileBarChart },
  { id: 40, name: "DEPOSIT PRED",       icon: Database },
  { id: 41, name: "SWIFT MONITOR",      icon: Globe },
  { id: 42, name: "NOSTRO RECON",       icon: GitMerge },
  { id: 43, name: "LIMIT ENGINE",       icon: Scale },
  { id: 44, name: "IFRS9 MODEL",        icon: FileBarChart },
  { id: 45, name: "BASEL CALC",         icon: ShieldCheck },
  { id: 46, name: "FATCA REPORT",       icon: Code },
  { id: 47, name: "CRS AGENT",          icon: Globe },
  { id: 48, name: "REGTECH AI",         icon: ShieldCheck },
  { id: 49, name: "MODEL GOVERN",       icon: Cpu },
  { id: 50, name: "EXPLAINABILITY",     icon: Brain },
];

export default function UseCaseEngineDemo() {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const scrollToPipeline = () => {
    const el = document.getElementById("pipeline-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth / 2;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative py-16 flex flex-col items-center justify-center px-2 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-[1.5px] shadow-[0_0_25px_rgba(59,130,246,0.35)]"
          >
            <div className="w-full h-full bg-slate-950 rounded-[13px] flex items-center justify-center">
              <Cpu className="w-6 h-6" stroke="url(#blue-purple)" />
              <svg width="0" height="0">
                <linearGradient
                  id="blue-purple"
                  x1="100%"
                  y1="100%"
                  x2="0%"
                  y2="0%"
                >
                  <stop stopColor="#3b82f6" offset="0%" />
                  <stop stopColor="#a855f7" offset="100%" />
                </linearGradient>
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center mb-5 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-md gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0"></span>
              <span className="text-blue-300 text-[10px] sm:text-[11px] font-medium tracking-[0.18em] uppercase">
                OXY BFSAI · AI Discovery & Decision Platform
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-[1.6rem] sm:text-4xl md:text-[2.75rem] lg:text-5xl font-extrabold tracking-[-0.01em] mb-4 text-white"
              style={{
                fontFamily: "'Playfair Display', serif",
                lineHeight: 1.15,
              }}
            >
              <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap"
                rel="stylesheet"
              />
              From Manual Process to <br className="hidden sm:block" />
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 whitespace-nowrap"
                style={{ display: "inline-block", marginTop: "0.35em" }}
              >
                Intelligent AI Decision Engine
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-sm sm:text-base text-slate-400 mb-8 max-w-xs sm:max-w-sm md:max-w-md mx-auto leading-[1.8] font-light"
            >
              Discovers AI opportunities across India, UAE & SAMA —{" "}
              <span className="text-slate-300 font-normal">
                executes intelligent decisions
              </span>{" "}
              and integrates seamlessly into your banking infrastructure.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <button
                onClick={() => navigate("/live-ai-demo")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-slate-950 text-sm font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                Live AI Demo <Play className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={scrollToPipeline}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-white/20 hover:bg-white/5 transition-colors text-sm font-semibold"
              >
                View the 15-Step Pipeline
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* LIVE EXECUTION BANNER + FLOW STRIP */}
        <section className="px-6 pt-2 pb-8 max-w-[1200px] mx-auto">
          {/* Flow strip */}
          <div className="flex items-center justify-center flex-wrap gap-1 mb-8">
            {[
              { label: "Manual Process", color: 0 },
              { label: "AI Discovery",   color: 1 },
              { label: "AI Decision",    color: 1 },
              { label: "Generated Code", color: 2 },
              { label: "Execute Code",   color: 3 },
              { label: "Live Output",    color: 3 },
              { label: "Business Outcome", color: 3 },
            ].map((s, i, arr) => (
              <React.Fragment key={s.label}>
                <span style={{
                  padding: "7px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                  background:   s.color === 0 ? "rgba(255,255,255,0.07)" : s.color === 3 ? "rgba(0,184,148,0.16)" : s.color === 2 ? "rgba(225,112,85,0.14)" : "rgba(108,92,231,0.16)",
                  border: `1px solid ${s.color === 0 ? "rgba(255,255,255,0.14)" : s.color === 3 ? "rgba(0,184,148,0.35)" : s.color === 2 ? "rgba(225,112,85,0.3)" : "rgba(108,92,231,0.3)"}`,
                  color:        s.color === 0 ? "rgba(255,255,255,0.65)" : s.color === 3 ? "#00cec9" : s.color === 2 ? "#E17055" : "#c4b5fd",
                }}>{s.label}</span>
                {i < arr.length - 1 && <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, margin: "0 2px" }}>→</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Banner */}
          <div style={{ padding: "20px 28px", borderRadius: 16, background: "linear-gradient(135deg, rgba(108,92,231,0.18), rgba(0,184,148,0.12))", border: "1px solid rgba(108,92,231,0.35)", boxShadow: "0 0 40px rgba(108,92,231,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#00cec9", boxShadow: "0 0 6px #00cec9" }} />
                  <span style={{ color: "#c4b5fd", fontSize: 13, fontWeight: 800, letterSpacing: "2px" }}>LIVE EXECUTION</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {["👤 Customer Onboarding", "🏦 Loan Eligibility", "🎯 Smart Loan Matching"].map((uc, i) => (
                    <React.Fragment key={uc}>
                      <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: 600 }}>{uc}</span>
                      {i < 2 && <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { icon: "⚙️", label: "15 Step Engine", sub: "Discovery Pipeline" },
                  { icon: "🤖", label: "50 AI Agents",    sub: "Autonomous Execution" },
                  { icon: "▶",  label: "Live Execution",  sub: "Code + Output" },
                ].map(b => (
                  <div key={b.label} style={{ padding: "10px 18px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 16 }}>{b.icon}</span>
                      <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{b.label}</span>
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>{b.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CAROUSEL SECTION */}
        <section className="py-12 border-y border-white/5 bg-slate-950/50">
          <div className="text-center mb-8 px-6 flex items-center justify-between max-w-[1400px] mx-auto">
            <div className="text-left">
              <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-blue-400/80 mb-1">
                Library
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                30+ Core Banking Use Cases
              </h2>
              <p className="text-slate-500 text-sm mt-1 font-light">
                Automated workflows across lending, compliance & operations.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel("left")}
                className="p-3 rounded-full border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-colors bg-slate-900 shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="p-3 rounded-full border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-colors bg-slate-900 shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="w-full overflow-hidden">
            <div
              ref={carouselRef}
              className="flex gap-6 px-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {marqueeImages.map((src, i) => (
                <div
                  key={i}
                  className="snap-center shrink-0 w-[25vw] md:w-[200px] lg:w-[300px] rounded-2xl overflow-hidden border border-white/10 bg-slate-900 group cursor-pointer shadow-2xl"
                >
                  <img
                    src={src}
                    alt={`Use Case ${i + 1}`}
                    className="w-80 h-85 object-contain opacity-90 group-hover:opacity-100 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 15-STEP ENGINE TIMELINE */}
        <section
          id="pipeline-section"
          className="py-24 px-6 bg-slate-950/80 border-b border-white/5 relative"
        >
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-black tracking-[-0.02em] mb-4">
                The{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">
                  15-Step
                </span>{" "}
                Engine
              </h2>
              <p className="text-slate-500 text-base font-light max-w-md mx-auto leading-relaxed">
                A systematic pipeline that transforms business workflows into
                fully deployed AI code.
              </p>
            </motion.div>

            <div className="space-y-24">
              {stepsData.map((phase, pIdx) => (
                <motion.div
                  key={pIdx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="relative"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div
                      className={`h-px flex-1 bg-gradient-to-r ${phase.color} opacity-20`}
                    ></div>
                    <h3
                      className={`text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${phase.color}`}
                    >
                      {phase.phase}
                    </h3>
                    <div
                      className={`h-px flex-1 bg-gradient-to-l ${phase.color} opacity-20`}
                    ></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-auto-fit min-[1000px]:flex min-[1000px]:justify-center gap-4 flex-wrap">
                    {phase.items.map((step, sIdx) => {
                      const Icon = step.icon;
                      return (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          whileInView={{ opacity: 1, scale: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: sIdx * 0.1, type: "spring" }}
                          className="w-full min-[1000px]:w-[280px] bg-slate-900/40 backdrop-blur-sm border border-white/5 hover:border-white/20 rounded-2xl p-6 group transition-colors"
                        >
                          <div
                            className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${phase.color} shadow-lg shadow-black/50 group-hover:scale-110 transition-transform`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-xs font-bold text-slate-500 mb-1">
                            STEP {step.id}
                          </div>
                          <h4 className="text-lg font-bold text-slate-200 mb-2">
                            {step.title}
                          </h4>
                          <p className="text-sm text-slate-400">{step.desc}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 50 AI AGENTS ROSTER */}
        <section className="py-12 px-6 max-w-[1400px] mx-auto text-center border-t border-white/5 bg-slate-950/30">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.02em] mb-4">
              50 Core{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                AI Agents
              </span>
            </h2>
            <p className="text-slate-500 text-base font-light max-w-md mx-auto leading-relaxed">
              Specialized autonomous agents collaborating to design, validate,
              and deploy your systems.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {agents.map((agent, idx) => {
              const Icon = agent.icon;
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: idx * 0.05,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="flex flex-col items-center gap-3 p-4 w-28 md:w-32 bg-slate-900/50 rounded-2xl border border-white/5 hover:bg-slate-800 transition-colors cursor-default"
                >
                  <div className="w-14 h-14 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold tracking-widest text-slate-300 text-center uppercase">
                    {agent.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* AI ARCHITECTURE SECTION */}
        <section className="py-24 px-6 bg-slate-950/60 border-t border-white/5">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-16"
            >
              <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-purple-400/80 mb-3">
                OXYBFSAI · AI ARCHITECTURE
              </p>
              <h2 className="text-3xl md:text-5xl font-black tracking-[-0.02em] mb-4">
                From{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  Existing Systems
                </span>{" "}
                to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  Business Outcomes
                </span>
              </h2>
              <p className="text-slate-500 text-base font-light max-w-lg mx-auto leading-relaxed">
                Not a recommendation engine — a complete execution engine that
                generates and runs production code.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex items-center justify-center flex-wrap gap-0 mb-16"
            >
              {[
                {
                  label: "Existing Systems",
                  icon: "🏦",
                  ringColor: "border-slate-600/60",
                  bg: "bg-slate-700",
                },
                {
                  label: "Discovery Engine",
                  icon: "🔍",
                  ringColor: "border-blue-500/60",
                  bg: "bg-blue-600",
                },
                {
                  label: "50 AI Agents",
                  icon: "🤖",
                  ringColor: "border-violet-500/60",
                  bg: "bg-violet-600",
                },
                {
                  label: "Decision Engine",
                  icon: "⚡",
                  ringColor: "border-orange-500/60",
                  bg: "bg-orange-500",
                },
                {
                  label: "Code Generator",
                  icon: "✦",
                  ringColor: "border-yellow-500/60",
                  bg: "bg-yellow-500",
                },
                {
                  label: "Execution Engine",
                  icon: "▶",
                  ringColor: "border-emerald-500/60",
                  bg: "bg-emerald-500",
                },
                {
                  label: "Business Outcome",
                  icon: "📈",
                  ringColor: "border-green-400/80",
                  bg: "bg-green-500",
                },
              ].map((node, i, arr) => (
                <div key={node.label} className="flex items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                    className={`flex flex-col items-center gap-3 w-[106px] py-5 px-3 rounded-2xl bg-slate-900/60 border-2 ${node.ringColor} backdrop-blur-sm text-center`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${node.bg} text-white text-xl shadow-lg`}
                    >
                      {node.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-200 leading-tight">
                      {node.label}
                    </span>
                  </motion.div>
                  {i < arr.length - 1 && (
                    <div className="flex flex-col items-center mx-1">
                      <div className="w-6 h-0.5 bg-slate-700" />
                      <span className="text-slate-600 text-lg leading-none">
                        ›
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🚀",
                  title: "Not Just Recommendations",
                  desc: "Generates and executes production-ready code for every AI decision, end-to-end.",
                },
                {
                  icon: "⚙️",
                  title: "End-to-End Automation",
                  desc: "From manual input to live business output in under 2 seconds — no human in the loop.",
                },
                {
                  icon: "🛡️",
                  title: "Built for BFSI Enterprise",
                  desc: "CBUAE · RBI · SAMA · MAS compliance frameworks built into every workflow.",
                },
              ].map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, type: "spring" }}
                  className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-400/40 transition-colors"
                >
                  <div className="text-2xl mb-3">{c.icon}</div>
                  <h4 className="text-white font-bold text-base mb-2">
                    {c.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {c.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ECOSYSTEM / FOOTER */}
        <section className="border-t border-white/10 bg-slate-950 py-16 px-6 relative z-10">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <Globe className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold tracking-tight text-white">
                  Supported Regulations
                </h3>
              </div>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>{" "}
                  INDIA: RBI, CIBIL, CKYC
                </li>
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>{" "}
                  UAE: CBUAE, AECB
                </li>
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>{" "}
                  SAMA: SIMAH, KYC/AML
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <Plug className="w-6 h-6 text-purple-500" />
                <h3 className="text-lg font-semibold tracking-tight text-white">
                  Seamless Integrations
                </h3>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {[
                  "Core Banking",
                  "LOS",
                  "LMS",
                  "CRM",
                  "Data Warehouse",
                  "KYC",
                  "Payment Gateways",
                ].map((sys) => (
                  <span
                    key={sys}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300"
                  >
                    {sys}
                  </span>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <Shield className="w-6 h-6 text-emerald-500" />
                <h3 className="text-lg font-semibold tracking-tight text-white">
                  Key Benefits
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <Zap className="w-4 h-4 text-emerald-500" /> Faster AI
                  Implementation
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <Zap className="w-4 h-4 text-emerald-500" /> Generates
                  Complete Code
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <Zap className="w-4 h-4 text-emerald-500" /> Built for
                  Enterprise Scale
                </li>
              </ul>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
