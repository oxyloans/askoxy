import { notification } from "antd";
import { useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

export type Country = "india" | "uae" | "saudi";

const FlagIndia = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 600"
    style={{
      width: 42,
      height: 28,
      borderRadius: 5,
      display: "block",
      flexShrink: 0,
    }}
  >
    <rect width="900" height="200" fill="#FF9933" />
    <rect y="200" width="900" height="200" fill="#fff" />
    <rect y="400" width="900" height="200" fill="#138808" />
    <circle
      cx="450"
      cy="300"
      r="70"
      fill="none"
      stroke="#000080"
      strokeWidth="7"
    />
    {Array.from({ length: 24 }, (_, i) => {
      const a = ((i * 15 - 90) * Math.PI) / 180;
      return (
        <line
          key={i}
          x1={450 + 55 * Math.cos(a)}
          y1={300 + 55 * Math.sin(a)}
          x2={450 + 70 * Math.cos(a)}
          y2={300 + 70 * Math.sin(a)}
          stroke="#000080"
          strokeWidth="3"
        />
      );
    })}
    <circle cx="450" cy="300" r="10" fill="#000080" />
  </svg>
);

const FlagUAE = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 600"
    style={{
      width: 42,
      height: 28,
      borderRadius: 5,
      display: "block",
      flexShrink: 0,
    }}
  >
    <rect width="900" height="600" fill="#fff" />
    <rect width="900" height="200" fill="#00732F" />
    <rect y="400" width="900" height="200" fill="#000" />
    <rect width="225" height="600" fill="#FF0000" />
  </svg>
);

const FlagSaudi = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 600"
    style={{
      width: 42,
      height: 28,
      borderRadius: 5,
      display: "block",
      flexShrink: 0,
    }}
  >
    <rect width="900" height="600" fill="#006C35" />
    <text
      x="450"
      y="280"
      textAnchor="middle"
      fill="#fff"
      fontSize="120"
      fontFamily="serif"
    >
      &#x644;&#x627; &#x625;&#x644;&#x647; &#x625;&#x644;&#x627;
      &#x627;&#x644;&#x644;&#x647;
    </text>
    <rect x="300" y="360" width="300" height="12" fill="#fff" />
    <text
      x="450"
      y="440"
      textAnchor="middle"
      fill="#fff"
      fontSize="80"
      fontFamily="serif"
    >
      &#x2694;
    </text>
  </svg>
);

const FLAG_COMPONENTS: Record<Country, FC> = {
  india: FlagIndia,
  uae: FlagUAE,
  saudi: FlagSaudi,
};

const COUNTRIES: { id: Country; label: string; sub: string }[] = [
  { id: "india", label: "India", sub: "RBI · IRDAI" },
  { id: "uae", label: "UAE", sub: "CBUAE · UAE IA" },
  { id: "saudi", label: "Saudi Arabia", sub: "SAMA · Vision 2030" },
];

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
    period: "3 months",
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

const FINVIBE_FEATURES: Record<Country, string[]> = {
  india: [
    "Covers 15,000+ RBI Regulated Entity Requirements",
    "Follows RBI Master Directions & Guidelines — 1,00,000+ Master Circulars",
    "Supports 11 Bank Types: Small Finance Banks, Urban Co-operative Banks, Payment Banks, Local Area Banks & more",
    "Complete Banking Application from a Single Prompt",
    "Frontend + Backend + Database Code — Ready to Deploy",
    "One-click Download of the Full Application Codebase",
  ],
  uae: [
    "Covers 10,000+ CBUAE Regulatory Requirements & Circulars",
    "Supports 49+ Licensed Banks: 23 National + 26 Foreign Bank Branches",
    "Covers 8 Bank Categories: Commercial, Islamic, Digital, Exchange Houses & more",
    "Compliant with UAE AML/CFT, Open Banking & DFSA Frameworks",
    "Frontend + Backend + Database Code — Ready to Deploy",
    "One-click Download of the Full Application Codebase",
  ],
  saudi: [
    "Covers 10,000+ SAMA Regulatory Requirements & Circulars",
    "Supports 26+ Licensed Banks: 12 Local Banks + 14 Foreign Bank Branches",
    "Covers 8 Bank Categories: Commercial, Islamic, Digital, Finance Companies & more",
    "Compliant with SAMA Open Banking & Vision 2030 Fintech Frameworks",
    "Frontend + Backend + Database Code — Ready to Deploy",
    "One-click Download of the Full Application Codebase",
  ],
};

const INSURVIBE_FEATURES: Record<Country, string[]> = {
  india: [
    "Addresses 2,800+ IRDAI Products & Policy Types",
    "Supports 62 Insurance Companies",
    "Covers 638 Brokerage Firms Nationwide",
    "Full Compliance with IRDAI Regulatory Framework",
    "Frontend + Backend + Database Code — Ready to Deploy",
    "Complete Insurance Application from a Single Prompt",
    "Covers Life, Health, Motor & General Insurance Domains",
  ],
  uae: [
    "Covers UAE Insurance Authority (IA) Regulatory Requirements",
    "Supports 60+ Licensed Insurance Companies in UAE",
    "Covers 900+ Insurance Products across all Lines of Business",
    "Compliant with UAE Takaful (Islamic Insurance) Frameworks",
    "Covers Life & Takaful, Health, Motor & General Insurance",
    "Frontend + Backend + Database Code — Ready to Deploy",
    "Complete Insurance Application from a Single Prompt",
  ],
  saudi: [
    "Covers SAMA Insurance Supervision Regulatory Requirements",
    "Supports 30+ Licensed Cooperative Insurance Companies in KSA",
    "Covers 900+ Insurance Products across all Lines of Business",
    "Compliant with Saudi Vision 2030 Insurance Sector Reforms",
    "Covers Cooperative Life, Health, Motor & General Takaful",
    "Frontend + Backend + Database Code — Ready to Deploy",
    "Complete Insurance Application from a Single Prompt",
  ],
};

const FINVIBE_DESC: Record<Country, string> = {
  india:
    "Build a complete, RBI-compliant banking application with a single prompt.",
  uae: "Build a complete, CBUAE-compliant banking application with a single prompt.",
  saudi:
    "Build a complete, SAMA-compliant banking application with a single prompt.",
};

const INSURVIBE_DESC: Record<Country, string> = {
  india:
    "Build complete IRDAI-compliant insurance platforms — life, health, motor & general — from one prompt.",
  uae: "Build complete UAE Insurance Authority-compliant platforms — takaful, health, motor & general — from one prompt.",
  saudi:
    "Build complete SAMA-compliant cooperative insurance platforms — takaful, health, motor & general — from one prompt.",
};

const ROI_STATS: Record<Country, { cost: string; currency: string }> = {
  india: { cost: "₹3 Crore+ Work", currency: "₹" },
  uae: { cost: "AED 1M+ Work", currency: "AED" },
  saudi: { cost: "SAR 1M+ Work", currency: "SAR" },
};

const FINVIBE_TAGS: Record<Country, string[]> = {
  india: [
    "RBI Master Directions",
    "15,000+ Requirements",
    "11 Bank Types",
    "1,00,000+ Circulars",
  ],
  uae: [
    "CBUAE Compliant",
    "10,000+ Requirements",
    "49+ Banks",
    "8 Bank Categories",
  ],
  saudi: [
    "SAMA Compliant",
    "10,000+ Requirements",
    "26+ Banks",
    "8 Bank Categories",
  ],
};

const INSURVIBE_TAGS: Record<Country, string[]> = {
  india: [
    "IRDAI Compliant",
    "2,800+ Products",
    "62 Companies",
    "638 Brokerages",
  ],
  uae: ["UAE IA Compliant", "60+ Companies", "900+ Products", "Takaful Ready"],
  saudi: ["SAMA Compliant", "30+ Companies", "900+ Products", "Vision 2030"],
};

const ANIM_STYLES = `
@keyframes oxyGridMove {
  0%   { background-position: 0 0; }
  100% { background-position: 48px 48px; }
}
@keyframes oxyPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
@keyframes oxyFloat {
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-22px) scale(1.04); }
}
@keyframes oxyFadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes typing {
  from { width: 0; }
  to   { width: 100%; }
}
@keyframes blink {
  0%, 100% { border-color: #00d4ff; }
  50%       { border-color: transparent; }
}
.oxy-anim-grid      { animation: oxyGridMove 6s linear infinite; }
.oxy-anim-blob1     { animation: oxyFloat 7s ease-in-out infinite; }
.oxy-anim-blob2     { animation: oxyFloat 9s ease-in-out infinite reverse; }
.oxy-anim-badge     { animation: oxyFadeUp 0.5s ease both; }
.oxy-anim-title     { animation: oxyFadeUp 0.55s ease 0.08s both; }
.oxy-anim-sub       { animation: oxyFadeUp 0.55s ease 0.16s both; }
.oxy-anim-countries { animation: oxyFadeUp 0.55s ease 0.24s both; }
.oxy-anim-engines   { animation: oxyFadeUp 0.55s ease 0.4s both; }
.oxy-dot-pulse      { animation: oxyPulse 2s ease-in-out infinite; }
.oxy-typing {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid #00d4ff;
  width: 0;
  animation: typing 2.5s steps(22, end) 0.5s forwards, blink 0.7s step-end infinite;
}

@media (max-width: 640px) {
  .oxy-pricing-header { padding: 12px 16px; }
  .oxy-country-btn { width: 100%; justify-content: flex-start; }
  .oxy-card-equal { min-height: auto !important; }
}
.oxy-glass-card {
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 60px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.06);
}
.oxy-hover-lift:hover { transform: translateY(-4px); }
`;
export default function OxybfsiPricing() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    () => (sessionStorage.getItem("finvibe_country") as Country) || "india",
  );

  const handleCountrySelect = (c: Country) => {
    setSelectedCountry(c);
    sessionStorage.setItem("finvibe_country", c);
  };

  const handlepayment = () => {
    notification.info({
      message: "Subscription Support",
      description:
        "Please contact the ASKOXY.AI support team for subscription assistance at support@askoxy.ai",
      placement: "topRight",
      duration: 5,
    });
  };

  const finvibeFeatures = FINVIBE_FEATURES[selectedCountry];
  const insurvibeFeatures = INSURVIBE_FEATURES[selectedCountry];
  const finvibeTags = FINVIBE_TAGS[selectedCountry];
  const insurvibeTags = INSURVIBE_TAGS[selectedCountry];

  return (
    <div
      className="min-h-screen text-white font-sans overflow-x-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0a0f1e 0%, #0d1a2e 40%, #0a1628 70%, #10082a 100%)",
      }}
    >
      <div className="oxy-pricing-header relative z-20 flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-white/[0.06] bg-[#050a14]/85 backdrop-blur-xl sticky top-0">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-white font-black text-lg sm:text-xl tracking-tight">
            OXY
          </span>
          <span className="text-cyan-400 font-black text-lg sm:text-xl tracking-tight">
            BFS
            <span className="text-purple-500 font-black text-lg sm:text-xl tracking-tight">
              AI
            </span>
          </span>
        </div>
        <button
          onClick={() => {
            sessionStorage.setItem("finvibe_country", selectedCountry);
            navigate("/oxybfsai-landing");
          }}
          className="px-3 sm:px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs sm:text-sm font-black transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          Let's Start →
        </button>
      </div>
      <style>{ANIM_STYLES}</style>

      {/* ── Animated background grid ── */}
      <div
        className="fixed inset-x-0 bottom-0 pointer-events-none oxy-anim-grid"
        style={{
          top: 57,
          backgroundImage:
            "linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          zIndex: 0,
        }}
      />

      {/* ── Animated glow blobs ── */}
      <div
        className="fixed pointer-events-none oxy-anim-blob1"
        style={{
          top: -160,
          left: -160,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,212,255,0.10) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none oxy-anim-blob2"
        style={{
          bottom: -160,
          right: -160,
          width: 440,
          height: 440,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            {/* Badge */}
            <div className="oxy-anim-badge inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 sm:px-4 py-1.5 mb-4 sm:mb-5">
              <span className="oxy-dot-pulse w-2 h-2 rounded-full bg-cyan-400" />
              <span className="oxy-typing font-medium text-cyan-300 text-xs sm:text-sm">
                Responsible AI Platform
              </span>
            </div>

            {/* Brand name */}
            <h1 className="oxy-anim-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight sm:leading-none mb-2 sm:mb-3 cursor-default select-none">
              <span style={{ color: "#ffffff" }}>OXY </span>
              <span
                style={{
                  background: "linear-gradient(90deg, #06b6d4, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                BFS
              </span>
              <span
                style={{
                  background: "linear-gradient(90deg, #a855f7, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AI
              </span>
            </h1>

            {/* ── Region intro text ── */}
            <div className="oxy-anim-sub flex flex-col items-center gap-2 mb-6 sm:mb-8 md:mb-10 mt-4 sm:mt-6">
              <p className="text-slate-300 text-sm sm:text-base font-medium px-2">
                Compliance-ready for your region
              </p>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed px-2">
                Now live for{" "}
                <span className="text-cyan-400 font-semibold">India</span>,{" "}
                <span className="text-cyan-400 font-semibold">UAE</span> &{" "}
                <span className="text-cyan-400 font-semibold">
                  Saudi Arabia
                </span>{" "}
                — select your country to explore region-specific regulatory
                coverage.
              </p>
            </div>
            {/* ── Country Selector ── */}
            <div className="oxy-anim-countries flex items-center justify-center gap-3 sm:gap-4 md:gap-6 flex-wrap mb-8 sm:mb-10 md:mb-12">
              {COUNTRIES.map((c) => {
                const FlagComp = FLAG_COMPONENTS[c.id];
                return (
                  <button
                    key={c.id}
                    onClick={() => handleCountrySelect(c.id)}
                    className={`oxy-country-btn flex items-center gap-3 px-3 sm:px-4 md:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ${
                      selectedCountry === c.id
                        ? "bg-cyan-500/15 border-cyan-400/70 scale-105 shadow-lg shadow-cyan-500/20"
                        : "bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/[0.06]"
                    }`}
                  >
                    <div
                      style={{
                        boxShadow:
                          selectedCountry === c.id
                            ? "0 0 0 2px rgba(0,245,255,0.5)"
                            : "0 0 0 1px rgba(255,255,255,0.15)",
                        borderRadius: 6,
                      }}
                    >
                      <FlagComp />
                    </div>
                    <div className="flex flex-col items-start gap-0.5 sm:gap-1">
                      <span
                        className={`text-sm sm:text-base font-bold tracking-wide leading-none ${
                          selectedCountry === c.id
                            ? "text-cyan-300"
                            : "text-slate-200"
                        }`}
                      >
                        {c.label}
                      </span>
                      <span
                        className={`text-[9px] sm:text-[11px] font-semibold tracking-wider uppercase leading-none ${
                          selectedCountry === c.id
                            ? "text-cyan-400"
                            : "text-slate-500"
                        }`}
                      >
                        {c.sub}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── Section bridge — "Two Vertical Engines" ── */}
            <div className="oxy-anim-engines flex flex-col items-center gap-2 mb-10 sm:mb-12 md:mb-16">
              <div className="w-8 sm:w-12 h-px bg-white/10 mb-2" />
              <p className="text-[9px] sm:text-[10px] text-slate-600 uppercase tracking-[0.15em] font-semibold">
                Scroll to explore
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
                Two Vertical Engines
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto text-xs sm:text-sm px-2">
                One prompt. Complete compliance-grade application. Download and
                deploy.
              </p>
            </div>
          </div>

          {/* ══════════════════════════════════
            PRODUCTS — FinVibe & InsurVibe
        ══════════════════════════════════ */}
          <div className="mb-12 sm:mb-16 md:mb-20">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {/* FinVibe */}
              <div className="oxy-glass-card oxy-card-equal oxy-hover-lift relative bg-gradient-to-br from-cyan-500/10 to-blue-600/5 border border-cyan-500/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 overflow-hidden flex flex-col transition-all duration-300 min-h-[520px]">
                <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-cyan-400/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="mb-4 sm:mb-6">
                  <span className="inline-block bg-cyan-500/20 text-cyan-300 text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full mb-2 sm:mb-3 tracking-widest uppercase">
                    Banking
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
                    <span className="text-cyan-400">Fin</span>
                    <span className="text-white">Vibe</span>
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1.5 sm:mt-2 leading-relaxed">
                    {FINVIBE_DESC[selectedCountry]}
                  </p>
                </div>
                <ul className="space-y-2 sm:space-y-3 flex-1">
                  {finvibeFeatures.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300"
                    >
                      <span className="text-cyan-400 mt-0.5 flex-shrink-0">
                        ◆
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/5">
                  <div className="flex flex-wrap gap-2">
                    {finvibeTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] sm:text-xs bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* InsurVibe */}
              <div className="oxy-glass-card oxy-card-equal oxy-hover-lift relative bg-gradient-to-br from-indigo-500/10 to-purple-600/5 border border-indigo-500/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 overflow-hidden flex flex-col transition-all duration-300 min-h-[520px]">
                <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-indigo-400/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="mb-4 sm:mb-6">
                  <span className="inline-block bg-indigo-500/20 text-indigo-300 text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full mb-2 sm:mb-3 tracking-widest uppercase">
                    Insurance
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
                    <span className="text-indigo-400">Insur</span>
                    <span className="text-white">Vibe</span>
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1.5 sm:mt-2 leading-relaxed">
                    {INSURVIBE_DESC[selectedCountry]}
                  </p>
                </div>
                <ul className="space-y-2 sm:space-y-3 flex-1">
                  {insurvibeFeatures.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300"
                    >
                      <span className="text-indigo-400 mt-0.5 flex-shrink-0">
                        ◆
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/5">
                  <div className="flex flex-wrap gap-2">
                    {insurvibeTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] sm:text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════
            PRICING PLANS
        ══════════════════════════════════ */}
          <div className="mb-12 sm:mb-16 md:mb-20">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <p className="text-slate-500 text-[9px] sm:text-xs uppercase tracking-widest mb-2 sm:mb-3 font-semibold">
                Transparent Pricing
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white px-2">
                Choose Your Plan
              </h2>
              <p className="text-slate-400 mt-2 sm:mt-3 text-xs sm:text-sm px-2">
                All plans include full code — Frontend, Backend & Database.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`oxy-glass-card oxy-hover-lift relative rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col transition-all duration-300 min-h-[265px] ${
                    plan.highlight
                      ? "bg-gradient-to-br from-cyan-500/20 to-cyan-600/5 border-2 border-cyan-500/50 sm:scale-[1.02]"
                      : "bg-white/[0.03] border border-white/[0.08] hover:border-white/20"
                  }`}
                >
                  {plan.tag && (
                    <div
                      className={`absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap ${
                        plan.highlight
                          ? "bg-cyan-500 text-black"
                          : "bg-white/10 text-white border border-white/20"
                      }`}
                    >
                      {plan.tag}
                    </div>
                  )}
                  <div className="mb-3 sm:mb-4">
                    <p className="text-slate-400 text-[9px] sm:text-xs uppercase tracking-widest font-semibold mb-1">
                      {plan.label}
                    </p>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-2xl sm:text-3xl font-black text-white">
                        ${plan.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[10px] sm:text-xs">
                      {plan.period}
                    </p>
                  </div>
                  <p className="text-slate-400 text-[10px] sm:text-xs leading-relaxed mb-4 sm:mb-5 flex-1">
                    {plan.description}
                  </p>
                  <button
                    onClick={handlepayment}
                    className={`w-full py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
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

          {/* ══════════════════════════════════
            ROI SECTION
        ══════════════════════════════════ */}
          <div className="mb-12 sm:mb-16 md:mb-20">
            <div className="relative bg-gradient-to-br from-emerald-500/10 to-teal-600/5 border border-emerald-500/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "radial-gradient(#22d3ee 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative z-10 grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center">
                <div>
                  <span className="inline-block bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full mb-3 sm:mb-4 tracking-widest uppercase">
                    The OXYBFS{`{AI}`} Advantage
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 sm:mb-4 leading-tight">
                    <span className="text-emerald-400">6 Engineers</span> build
                    <br />
                    in <span className="text-emerald-400">6 Months</span> for
                    <br />
                    <span className="text-white text-lg sm:text-2xl md:text-3xl">
                      {ROI_STATS[selectedCountry].cost}
                    </span>
                    <br />
                    <span className="text-cyan-400 text-xl sm:text-2xl md:text-3xl">
                      — done with One Prompt.
                    </span>
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-2 sm:mt-3">
                    Stop burning crores on large engineering teams and endless
                    sprints. OXYBFS{`{AI}`} collapses months of regulated
                    financial software development into a single AI generation —
                    fully compliant, fully coded, ready to deploy.
                  </p>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    {
                      label: "Team Size (Traditional)",
                      value: "6 Engineers",
                      icon: "👥",
                    },
                    { label: "Time to Build", value: "6 Months", icon: "📅" },
                    {
                      label: "Estimated Cost (Traditional)",
                      value: ROI_STATS[selectedCountry].cost,
                      icon: "💸",
                    },
                    {
                      label: "With OXYBFS{AI}",
                      value: "1 Prompt · 6 Minutes",
                      icon: "⚡",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 sm:gap-4 bg-white/[0.04] border border-white/[0.08] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3"
                    >
                      <span className="text-xl sm:text-2xl flex-shrink-0">
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="text-slate-300 text-[10px] sm:text-xs truncate">
                          {item.label}
                        </p>
                        <p className="text-green-400 font-bold text-xs sm:text-sm truncate">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════
            DEPLOYMENT NOTE
        ══════════════════════════════════ */}
          <div className="mb-10 sm:mb-12">
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex gap-3 sm:gap-4 items-start">
              <span className="text-xl sm:text-2xl flex-shrink-0">🚀</span>
              <div className="min-w-0">
                <p className="text-amber-400 font-bold mb-1 text-xs sm:text-sm">
                  Deployment Requirement
                </p>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed break-words">
                  To run and deploy the generated application in a live
                  environment,{" "}
                  <strong className="text-white">2 technical resources</strong>{" "}
                  are required on your side — one for backend infrastructure and
                  one for frontend deployment. OXYBFS{`{AI}`} generates the
                  complete codebase; your team handles hosting and go-live.
                </p>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════
            DISCLAIMER + FOOTER
        ══════════════════════════════════ */}
          <div className="text-center border-t border-white/5 pt-8 sm:pt-10">
            <div className="inline-flex items-start gap-2 sm:gap-3 bg-white/[0.02] border border-white/[0.08] rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 max-w-2xl text-left">
              <span className="text-slate-500 text-lg sm:text-xl flex-shrink-0 mt-0.5">
                ⚠
              </span>
              <p className="text-slate-300 text-[10px] sm:text-xs leading-relaxed">
                <strong className="text-slate-200">Note:</strong> OXYBFS{`{AI}`}{" "}
                Responsible AI may make mistakes. Generated code and compliance
                mappings should be reviewed by qualified legal, technical, and
                regulatory professionals before production deployment. This
                platform is an AI-assisted tool and does not substitute for
                expert compliance advisory.
              </p>
            </div>
            <p className="text-slate-600 text-[9px] sm:text-xs mt-6 sm:mt-8 px-2">
              © 2026 OXYBFS{`{AI}`} Responsible AI · All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
