import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import {
  ArrowRight,
  TrendingUp,
  Wallet,
  Users,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Loader2,
  Award,
  Zap,
  Building2,
  ArrowUpRight,
  Lock,
} from "lucide-react";

const HERO_IMAGE =
  "https://i.ibb.co/V0jWW41N/Chat-GPT-Image-Sep-28-2026-01-24-55-PM.png";
const LOGIN_URL = "/whatsapplogin";

const OxyLoansOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (journey?: string) => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const redirectPath = journey
        ? `/main/oxyloans?journey=${journey}`
        : "/main/oxyloans";
      sessionStorage.setItem("redirectPath", redirectPath);
      if (userId) {
        navigate(redirectPath);
      } else {
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToJourneys = () => {
    document.getElementById("journeys")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <Header />

      {/* Full-screen Loading Backdrop */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white p-6 shadow-2xl">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="mt-3 text-sm font-bold text-slate-800">
              Connecting to OxyLoans...
            </p>
            <p className="text-xs text-slate-500">Please wait a moment</p>
          </div>
        </div>
      )}

      <main className="overflow-hidden bg-white text-slate-950 font-sans">
        {/* ================================================================ */}
        {/* HERO SECTION                                                     */}
        {/* ================================================================ */}
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f0f7ff_0%,#ffffff_48%,#f5f3ff_100%)]">
          {/* Ambient background glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 top-10 h-[380px] w-[380px] rounded-full bg-blue-400/15 blur-[120px]" />
            <div className="absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-purple-400/15 blur-[130px]" />
          </div>

          <div className="relative mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-10 sm:px-8 sm:py-14 lg:min-h-[600px] lg:grid-cols-[1fr_1.1fr] lg:gap-8 lg:px-12 lg:py-16 xl:px-16">
            {/* HERO LEFT */}
            <div className="relative z-10 mx-auto max-w-[640px] text-center lg:mx-0 lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700 shadow-sm backdrop-blur sm:text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
                </span>
                Lender · Borrower · Partner
              </span>

              <h1 className="mt-4 text-3xl font-black leading-[1.08] tracking-[-0.04em] text-slate-900 sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[60px]">
                Choose Your{" "}
                <span className="mt-1 block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Financial Journey.
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-[560px] text-sm leading-relaxed text-slate-600 sm:text-base lg:mx-0 sm:leading-7">
                Join as a lender to earn returns up to 24% p.a., apply as a
                borrower for flexible loan options, or join as a partner to
                create income opportunities through your network.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={scrollToJourneys}
                  className="group inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/35 active:translate-y-0"
                >
                  Explore Journeys
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSignIn("partner")}
                  className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-800 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 active:bg-blue-100/50"
                >
                  <Users className="h-4 w-4 text-blue-600" />
                  Join as Partner
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-slate-200/60 pt-6 text-xs font-semibold text-slate-500 lg:justify-start sm:gap-6">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>RBI Compliant P2P Platform</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span>100% Digital & Paperless</span>
                </div>
              </div>
            </div>

            {/* HERO RIGHT IMAGE */}
            <div className="relative mx-auto flex w-full max-w-[720px] items-center justify-center">
              <div className="absolute left-1/2 top-1/2 h-[70%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-400/20 via-indigo-400/15 to-purple-400/20 blur-[90px]" />
              <img
                src={HERO_IMAGE}
                alt="Lender borrower partner journey"
                className="relative z-10 w-full max-w-[660px] object-contain drop-shadow-[0_20px_35px_rgba(30,64,175,0.14)] transition-transform duration-500 hover:scale-[1.01]"
              />
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* STATS HIGHLIGHT BAR                                              */}
        {/* ================================================================ */}
        <section className="border-y border-slate-100 bg-slate-900 py-8 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              <div className="text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Total Disbursed
                </p>
                <p className="mt-1 text-2xl font-black sm:text-3xl text-white">
                  ₹500+ Cr
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Across India
                </p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Active Users
                </p>
                <p className="mt-1 text-2xl font-black sm:text-3xl text-white">
                  50,000+
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Lenders & Borrowers
                </p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Max Annual Yield
                </p>
                <p className="mt-1 text-2xl font-black sm:text-3xl text-white">
                  Up to 24%
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Monthly payouts
                </p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Process Time
                </p>
                <p className="mt-1 text-2xl font-black sm:text-3xl text-white">
                  100% Digital
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Quick verification
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* JOURNEY CARDS SECTION                                            */}
        {/* ================================================================ */}
        <section id="journeys" className="scroll-mt-16 bg-slate-50/60 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-700">
                <Sparkles className="h-3.5 w-3.5" />
                Select Your Path
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Join. Start. Grow.
              </h2>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                Click on any journey below to sign in or get started immediately.
              </p>
            </div>

            <div className="mt-10 grid items-stretch gap-6 md:grid-cols-3 lg:gap-8">
              {/* ========================================================== */}
              {/* LENDER CARD                                                */}
              {/* ========================================================== */}
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-blue-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10">
                <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
                      Lender Journey
                    </span>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-xl font-black leading-snug text-slate-900 sm:text-2xl">
                      JOIN AS LENDER
                      <span className="block text-blue-600">& EARN MONEY</span>
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Start lending from ₹5,000 and earn high-yield monthly or annual returns directly into your bank account.
                    </p>
                  </div>

                  {/* ROI Stats Box */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white p-3.5 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Monthly ROI
                      </p>
                      <p className="mt-1 text-2xl font-black text-blue-700">
                        Up to 1.75%
                      </p>
                      <p className="text-[10px] font-semibold text-slate-400">per month</p>
                    </div>
                    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-3.5 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Yearly ROI
                      </p>
                      <p className="mt-1 text-2xl font-black text-indigo-700">
                        Up to 24%
                      </p>
                      <p className="text-[10px] font-semibold text-slate-400">per annum</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">
                    <span className="text-xs font-semibold text-slate-600">
                      Minimum Investment
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      ₹500
                    </span>
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {[
                      "Simple digital lending dashboard",
                      "Track repayments & interest monthly",
                      "Diversified peer-to-peer opportunities",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6">
                    <button
                      type="button"
                      onClick={() => handleSignIn("lender")}
                      className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-black text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:translate-y-0.5"
                    >
                      <span>Start Lending & Earn</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>

              {/* ========================================================== */}
              {/* BORROWER CARD                                              */}
              {/* ========================================================== */}
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-purple-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/10">
                <div className="h-2 w-full bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-500" />
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-purple-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-purple-700">
                      Borrower Journey
                    </span>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-xl font-black leading-snug text-slate-900 sm:text-2xl">
                      JOIN AS BORROWER
                      <span className="block text-purple-600">& GET A LOAN</span>
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Access quick financial assistance with transparent interest rates and digital documentation.
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/80 to-white p-4 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                      Loan Limit
                    </p>
                    <p className="mt-1 text-3xl font-black text-slate-900">
                      Up to ₹10 Lakhs
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Flexible EMI options based on eligibility
                    </p>
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {[
                      "100% paperless digital loan application",
                      "Fast processing & direct bank transfer",
                      "Transparent terms with zero hidden fees",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6">
                    <button
                      type="button"
                      onClick={() => handleSignIn("borrower")}
                      className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3.5 text-sm font-black text-white shadow-md shadow-purple-600/20 transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-600/30 active:translate-y-0.5"
                    >
                      <span>Apply for a Loan</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>

              {/* ========================================================== */}
              {/* PARTNER CARD                                               */}
              {/* ========================================================== */}
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-emerald-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="h-2 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-500" />
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <Users className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                      Partner Journey
                    </span>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-xl font-black leading-snug text-slate-900 sm:text-2xl">
                      JOIN AS PARTNER
                      <span className="block text-emerald-600">& EARN MONEY</span>
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Refer lenders and borrowers from your professional network and earn lucrative referral rewards.
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Referral Framework
                    </p>
                    <p className="mt-1 text-base font-extrabold text-slate-900">
                      Turn Connections into Earnings
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                      <div className="rounded-lg bg-emerald-100/60 p-1.5 text-[11px] font-bold text-emerald-800">
                        1. Refer
                      </div>
                      <div className="rounded-lg bg-emerald-100/60 p-1.5 text-[11px] font-bold text-emerald-800">
                        2. Track
                      </div>
                      <div className="rounded-lg bg-emerald-100/60 p-1.5 text-[11px] font-bold text-emerald-800">
                        3. Earn
                      </div>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {[
                      "Dedicated partner dashboard",
                      "Real-time referral journey tracking",
                      "Attractive payouts on active referrals",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6">
                    <button
                      type="button"
                      onClick={() => handleSignIn("partner")}
                      className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-black text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/30 active:translate-y-0.5"
                    >
                      <span>Join as Partner</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* FOUR STEP PROCESS SECTION                                        */}
        {/* ================================================================ */}
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#0b1936_0%,#152e63_100%)] px-6 py-10 shadow-2xl sm:px-10 sm:py-12 lg:px-12 lg:py-14">
              <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-blue-400">
                    Simple Guided Experience
                  </span>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                    Start Your Journey in 4 Easy Steps.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    Sign in with your mobile number, select your goal, and manage everything effortlessly from a unified dashboard.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSignIn()}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-500"
                  >
                    <span>Get Started Now</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    ["01", "Select Journey", "Choose Lender, Borrower, or Partner"],
                    ["02", "Quick Sign In", "OTP mobile authentication"],
                    ["03", "Complete Setup", "Submit basic details & KYC"],
                    ["04", "Track & Grow", "Monitor returns & activity live"],
                  ].map(([num, title, desc]) => (
                    <div
                      key={num}
                      onClick={() => handleSignIn()}
                      className="group cursor-pointer rounded-2xl border border-white/10 bg-white/[0.07] p-4.5 backdrop-blur-md transition-all hover:border-blue-400/50 hover:bg-white/[0.12]"
                    >
                      <span className="text-xs font-black text-blue-400">
                        {num}
                      </span>
                      <p className="mt-2 text-sm font-black text-white sm:text-base">
                        {title}
                      </p>
                      <p className="mt-1 text-[11px] leading-snug text-slate-300">
                        {desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default OxyLoansOverviewPage;