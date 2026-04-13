import {notification } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Finvibe3DLanding from "../Finvibe3DLanding";
import { CheckCircleOutlined, WarningOutlined } from "@ant-design/icons";

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



export default function OxybfsiPricing() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
   const [showLanding, setShowLanding] = useState(false);


  if (showLanding) {
  return <Finvibe3DLanding />;
}

const handlepayment = () => {
  notification.info({
    message: "Subscription Support",
    description:
      "Please contact the AskOxy.AI support team for subscription assistance at support@askoxy.ai",
    placement: "topRight",
    duration: 5,
  });
};

const handleSubscribe = () => {
  if (!email.trim()) {
   
notification.warning({
  message: "Invalid Email",
  description: "Please enter a valid email address.",
  placement: "topRight",
  duration: 4,
  icon: <WarningOutlined style={{ color: "#faad14" }} />,
});
    return;
  }

  if (email.trim() === "oxybfsai@askoxy.ai") {
    setSubscribed(true);
    setSubmitted(true);

    setTimeout(() => {
      setShowLanding(true); // ✅ SWITCH UI
    }, 500);
  } else {
  notification.success({
  message: "Subscription Successful",
  description: "Subscription completed! Proceed to billing.",
  placement: "topRight",
  duration: 4,
  icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
});
    setSubscribed(true);
    setSubmitted(true);
  }
};
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        {/* ─── Header ─── */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">
              Responsible AI Platform
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4">
            <span className="text-white">OXY</span>
            <span className="text-cyan-400">BFSI</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            AI-powered compliance-grade application generation for India's
            regulated financial sector.
          </p>
        </div>

        {/* ─── Subscribe Gate ─── */}
        <div className="mb-20">
          {!subscribed ? (
            <div className="max-w-lg mx-auto bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center backdrop-blur-sm">
              <p className="text-slate-300 text-sm mb-1 uppercase tracking-widest font-semibold">
                Step 1
              </p>
              <h2 className="text-2xl font-bold mb-2 text-white">
                Subscribe to Proceed
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Enter your email to unlock pricing and build access.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-xl transition-all text-sm whitespace-nowrap"
                >
                  Subscribe →
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-lg mx-auto bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">✓</div>
              <p className="text-cyan-400 font-bold">
                Subscribed successfully!
              </p>
              <p className="text-slate-400 text-sm mt-1">
                You now have access to all pricing tiers below.
              </p>
            </div>
          )}
        </div>

        {/* ─── Products Section ─── */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-3 font-semibold">
              Powered By
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Two Vertical Engines
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              One prompt. Complete compliance-grade application. Download and
              deploy.
            </p>
          </div>

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
                    <span className="text-cyan-400 mt-0.5 flex-shrink-0">
                      ◆
                    </span>
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
                    <span className="text-indigo-400 mt-0.5 flex-shrink-0">
                      ◆
                    </span>
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
                  {/* <p
                    className={`text-xs font-semibold mt-1 ${plan.highlight ? "text-cyan-400" : "text-slate-500"}`}
                  >
                    {plan.inr}
                  </p> */}
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
                  ROI Calculator
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                  ₹3 Crore+ in
                  <br />
                  <span className="text-emerald-400">6 Months of Work.</span>
                  <br />
                  One Prompt.
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  What traditionally requires a team of 60 engineers working for
                  6 months — OxybFSI delivers in a single generation.
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
                    <span className="text-2xl ">{item.icon}</span>
                    <div>
                      <p className="text-slate-300 text-xs">{item.label}</p>
                      <p className="text-green-600 font-bold text-sm">
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
