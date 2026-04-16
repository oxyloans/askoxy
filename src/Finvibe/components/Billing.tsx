import { notification } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Finvibe3DLanding from "../Finvibe3DLanding";

const plans = [
  {
    id: "build",
    label: "Per Build",
    price: 10,
    currency: "USD",
    period: "one build",
    inr: "~₹930",
    highlight: false,
    tag: null,
    description:
      "Pay as you go. Generate one complete application per purchase.",
  },
  {
    id: "monthly",
    label: "Monthly",
    price: 299,
    currency: "USD",
    period: "per month",
    inr: "~₹27,876",
    highlight: true,
    tag: "Most Popular",
    description:
      "Unlimited builds every month. Best for active development teams.",
  },
  {
    id: "quarterly",
    label: "3 Months",
    price: 699,
    currency: "USD",
    period: "per quarter",
    inr: "~₹65,188",
    highlight: false,
    tag: "Save 5%",
    description:
      "Unlimited builds for 3 months. Ideal for product build sprints.",
  },
  {
    id: "biannual",
    label: "6 Months",
    price: 2199,
    currency: "USD",
    period: "6 months",
    inr: "~₹2,05,000",
    highlight: false,
    tag: "Best Value",
    description:
      "Unlimited builds for 6 months. Maximum savings for long-term projects.",
  },
];

const finvibeFeatures = [
  "Complete Banking Application from a Single Prompt",
  "Frontend + Backend + Database Code — Ready to Deploy",
  "Covers 1,500+ RBI Regulated Entity Requirements",
  "Follows RBI Master Directions & Guidelines",
  "Supports 11 Bank Types: Small Finance Banks, Urban Co-operative Banks, Payment Banks, Local Area Banks & more",
  "One-click Download of the Full Application Codebase",
];

const insurvibeFeatures = [
  "Complete Insurance Application from a Single Prompt",
  "Covers Life Insurance & General Insurance Domains",
  "Addresses 2,800+ IRDAI Products & Policy Types",
  "Supports 62 Insurance Companies",
  "Covers 638 Brokerage Firms Nationwide",
  "Full Compliance with IRDAI Regulatory Framework",
  "Frontend + Backend + Database Code — Ready to Deploy",
];

// 🔒 Team emails — only these get access
const TEAM_EMAILS = ["oxybfsai@askoxy.ai"];

export default function OxybfsiPricing() {
  const [showLanding, setShowLanding] = useState(false);

  // Team login state — hidden panel
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showTeamLogin, setShowTeamLogin] = useState(false);
  const [teamEmail, setTeamEmail] = useState("");
  const [teamError, setTeamError] = useState("");

  const handleLogoClick = () => {
    const next = logoClickCount + 1;
    setLogoClickCount(next);
    // 3 rapid clicks on the logo reveals the team login
    if (next >= 3) {
      setShowTeamLogin(true);
      setLogoClickCount(0);
    }
  };

  const handleTeamLogin = () => {
    if (!teamEmail.trim()) {
      setTeamError("Please enter your email.");
      return;
    }
    if (TEAM_EMAILS.includes(teamEmail.trim())) {
      setShowTeamLogin(false);
      setTeamEmail("");
      setTeamError("");
      setTimeout(() => setShowLanding(true), 300);
    } else {
      setTeamError("Access denied. This email is not authorised.");
    }
  };

  const handlepayment = () => {
    notification.info({
      message: "Subscription Support",
      description:
        "Please contact the AskOxy.AI support team for subscription assistance at support@askoxy.ai",
      placement: "topRight",
      duration: 5,
    });
  };

  if (showLanding) {
    return <Finvibe3DLanding />;
  }

  return (
    <div className="min-h-screen bg-[#050a14] text-white font-sans overflow-x-hidden">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow blobs */}
      <div className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-cyan-500 opacity-[0.06] blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-indigo-500 opacity-[0.06] blur-[120px] pointer-events-none" />

      {/* ─── Hidden Team Login Modal ─── */}
      {showTeamLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0d1a2a] border border-cyan-500/30 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Team Access</h2>
              <button
                onClick={() => {
                  setShowTeamLogin(false);
                  setTeamEmail("");
                  setTeamError("");
                }}
                className="text-slate-500 hover:text-white text-xl leading-none"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-400 text-sm mb-5">
              Enter your authorised team email to continue.
            </p>
            <input
              type="email"
              placeholder="team@askoxy.ai"
              value={teamEmail}
              onChange={(e) => {
                setTeamEmail(e.target.value);
                setTeamError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleTeamLogin()}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors mb-3"
            />
            {teamError && (
              <p className="text-red-400 text-xs mb-3">{teamError}</p>
            )}
            <button
              onClick={handleTeamLogin}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl text-sm transition-all"
            >
              Submit →
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        {/* ─── Header ─── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">
              Responsible AI Platform
            </span>
          </div>
          {/* 🔒 5-click secret trigger on the logo title */}
          <h1
            className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-3 cursor-default select-none"
            onClick={handleLogoClick}
          >
            <span className="text-white">OXY</span>
            <span className="text-cyan-400">BFSI</span>
          </h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto leading-relaxed mb-8">
            AI-powered compliance-grade application generation for India's
            regulated financial sector.
          </p>

          {/* Seamless divider into products */}
          <div className="flex items-center gap-4 justify-center mb-2">
            <div className="h-px w-16 bg-white/10" />
            <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold">
              Powered By
            </p>
            <div className="h-px w-16 bg-white/10" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-1">
            Two Vertical Engines
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm mb-10">
            One prompt. Complete compliance-grade application. Download and deploy.
          </p>
        </div>

        {/* ─── Products Section ─── */}
        <div className="mb-20">


          <div className="grid md:grid-cols-2 gap-6">
            {/* FinVibe */}
            <div className="relative bg-gradient-to-br from-cyan-500/10 to-blue-600/5 border border-cyan-500/20 rounded-3xl p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-400/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="mb-6">
                <span className="inline-block bg-cyan-500/20 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-widest uppercase">
                  Banking
                </span>
                <h3 className="text-4xl font-black tracking-tight">
                  <span className="text-cyan-400">Fin</span>
                  <span className="text-white">Vibe</span>
                </h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Build a complete, RBI-compliant banking application with a
                  single prompt.
                </p>
              </div>
              <ul className="space-y-3">
                {finvibeFeatures.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <span className="text-cyan-400 mt-0.5 flex-shrink-0">◆</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex flex-wrap gap-2">
                  {[
                    "RBI Master Directions",
                    "1,500+ Requirements",
                    "11 Bank Types",
                    "Full Code Output",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2.5 py-1 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* InsurVibe */}
            <div className="relative bg-gradient-to-br from-indigo-500/10 to-purple-600/5 border border-indigo-500/20 rounded-3xl p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-400/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="mb-6">
                <span className="inline-block bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-widest uppercase">
                  Insurance
                </span>
                <h3 className="text-4xl font-black tracking-tight">
                  <span className="text-indigo-400">Insur</span>
                  <span className="text-white">Vibe</span>
                </h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Build complete IRDAI-compliant insurance platforms — life &
                  general — from one prompt.
                </p>
              </div>
              <ul className="space-y-3">
                {insurvibeFeatures.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <span className="text-indigo-400 mt-0.5 flex-shrink-0">◆</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex flex-wrap gap-2">
                  {[
                    "IRDAI Compliant",
                    "2,800+ Products",
                    "62 Companies",
                    "638 Brokerages",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Pricing ─── */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-3 font-semibold">
              Transparent Pricing
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Choose Your Plan
            </h2>
            <p className="text-slate-400 mt-3 text-sm">
              All plans include full code — Frontend, Backend & Database.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 ${
                  plan.highlight
                    ? "bg-gradient-to-br from-cyan-500/20 to-cyan-600/5 border-2 border-cyan-500/50 scale-[1.02]"
                    : "bg-white/[0.03] border border-white/8 hover:border-white/20"
                }`}
              >
                {plan.tag && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      plan.highlight
                        ? "bg-cyan-500 text-black"
                        : "bg-white/10 text-white border border-white/20"
                    }`}
                  >
                    {plan.tag}
                  </div>
                )}
                <div className="mb-4">
                  <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-1">
                    {plan.label}
                  </p>
                  <div className="flex items-end gap-1 mb-0.5">
                    <span className="text-3xl font-black text-white">
                      ${plan.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs">{plan.period}</p>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mb-5 flex-1">
                  {plan.description}
                </p>
                <button
                  onClick={handlepayment}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                    plan.highlight
                      ? "bg-cyan-500 hover:bg-cyan-400 text-black"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ─── ROI Section ─── */}
        <div className="mb-20">
          <div className="relative bg-gradient-to-br from-emerald-500/10 to-teal-600/5 border border-emerald-500/20 rounded-3xl p-8 md:p-12 overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "radial-gradient(#22d3ee 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
                  The OxybFSI Advantage
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                  What <span className="text-emerald-400">60 Engineers</span> build
                  <br />
                  in <span className="text-emerald-400">6 Months</span> for
                  <br />
                  <span className="text-white">₹3 Crore+</span>
                  <br />
                  <span className="text-cyan-400 text-2xl md:text-3xl">— done with One Prompt.</span>
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mt-3">
                  Stop burning crores on large engineering teams and endless sprints.
                  OxybFSI collapses months of regulated financial software development
                  into a single AI generation — fully compliant, fully coded, ready to deploy.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  {
                    label: "Team Size (Traditional)",
                    value: "60 Engineers",
                    icon: "👥",
                  },
                  { label: "Time to Build", value: "6 Months", icon: "📅" },
                  {
                    label: "Estimated Cost (Traditional)",
                    value: "~₹3,00,00,000",
                    icon: "💸",
                  },
                  {
                    label: "With OxybFSI",
                    value: "1 Prompt · 6 Minutes",
                    icon: "⚡",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-slate-300 text-xs">{item.label}</p>
                      <p className="text-green-400 font-bold text-sm">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Deployment Note ─── */}
        <div className="mb-10">
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex gap-4 items-start">
            <span className="text-2xl flex-shrink-0">🚀</span>
            <div>
              <p className="text-amber-400 font-bold mb-1 text-sm">
                Deployment Requirement
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                To run and deploy the generated application in a live
                environment,{" "}
                <strong className="text-white">2 technical resources</strong>{" "}
                are required on your side — one for backend infrastructure and
                one for frontend deployment. OxybFSI generates the complete
                codebase; your team handles hosting and go-live.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Disclaimer ─── */}
        <div className="text-center border-t border-white/5 pt-10">
          <div className="inline-flex items-start gap-3 bg-white/[0.02] border border-white/8 rounded-2xl px-6 py-4 max-w-2xl text-left">
            <span className="text-slate-500 text-lg flex-shrink-0 mt-0.5">
              ⚠
            </span>
            <p className="text-slate-300 text-xs leading-relaxed">
              <strong className="text-slate-200">Note:</strong> OxybFSI
              Responsible AI may make mistakes. Generated code and compliance
              mappings should be reviewed by qualified legal, technical, and
              regulatory professionals before production deployment. This
              platform is an AI-assisted tool and does not substitute for expert
              compliance advisory.
            </p>
          </div>
          <p className="text-slate-100 text-xs mt-8">
            © 2026 OxybFSI Responsible AI · All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}