import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "./Header";

import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  CircleCheckBig,
  GraduationCap,
  HandCoins,
  IndianRupee,
  Loader2,
  RefreshCcw,
  Share2,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

/* ==========================================================================
   CONSTANTS
   ========================================================================== */

const HERO_IMAGE =
  "https://i.ibb.co/V0jWW41N/Chat-GPT-Image-Sep-28-2026-01-24-55-PM.png";

const LOGIN_URL = "/whatsapplogin";

/* ==========================================================================
   DATA
   ========================================================================== */

const partnerBenefits = [
  "Choose Your Partner Journey",
  "Earn from Eligible Transactions",
  "Build & Grow Your Network",
];

const partnerJourneys = [
  {
    title: "Lender",
    icon: HandCoins,
  },
  {
    title: "Borrower",
    icon: IndianRupee,
  },
  {
    title: "Real Estate Partner",
    icon: Building2,
  },
  {
    title: "Jobs Company Partner",
    icon: BriefcaseBusiness,
  },
  {
    title: "Job Seeker",
    icon: Users,
  },
  {
    title: "Study Abroad Partner",
    icon: GraduationCap,
  },
  {
    title: "Gold Partner",
    icon: Sparkles,
  },
];

const borrowerExamples = [
  {
    fee: "4%",
    totalFee: "₹4,000",
    partnerShare: "25%",
    earning: "₹1,000",
  },
  {
    fee: "3%",
    totalFee: "₹3,000",
    partnerShare: "25%",
    earning: "₹750",
  },
  {
    fee: "2%",
    totalFee: "₹2,000",
    partnerShare: "25%",
    earning: "₹500",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose Your Journey",
    description:
      "Select the partner journey that matches your network, profession or business opportunities.",
    icon: Users,
  },
  {
    number: "02",
    title: "Build Your Network",
    description:
      "Connect relevant customers, professionals and businesses with the right OXY platform.",
    icon: Share2,
  },
  {
    number: "03",
    title: "Successful Transaction",
    description:
      "Your referral completes an eligible transaction or qualifying activity on the platform.",
    icon: TrendingUp,
  },
  {
    number: "04",
    title: "Earn & Keep Growing",
    description:
      "Receive applicable partner earnings and continue expanding your network with OXY.",
    icon: IndianRupee,
  },
];

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

const OxyLoansOverviewPage: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [selectedJourney, setSelectedJourney] = useState<string | null>(null);

  const earningSectionRef = useRef<HTMLElement | null>(null);

  /* ==========================================================================
     ALWAYS OPEN PAGE FROM TOP
     ========================================================================== */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  /* ==========================================================================
     PAGE / SCROLL ANIMATION
     ========================================================================== */

  useEffect(() => {
    const elements =
      document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (!elements.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      elements.forEach((element) => {
        element.classList.remove("opacity-0", "translate-y-6");
        element.classList.add("opacity-100", "translate-y-0");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;

          element.classList.remove("opacity-0", "translate-y-6");
          element.classList.add("opacity-100", "translate-y-0");

          observer.unobserve(element);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  /* ==========================================================================
     PARTNER BUTTON CLICK
     ========================================================================== */

  useEffect(() => {
    if (!selectedJourney) return;

    const openPartnerJourney = () => {
      try {
        setIsLoading(true);

        const userId = localStorage.getItem("userId");

        const redirectPath = `/main/oxyloans?journey=${encodeURIComponent(
          selectedJourney,
        )}`;

        sessionStorage.setItem("redirectPath", redirectPath);

        if (userId) {
          navigate(redirectPath);
          return;
        }

        window.location.href = LOGIN_URL;
      } catch (error) {
        console.error("Partner navigation error:", error);

        setIsLoading(false);
        setSelectedJourney(null);
      }
    };

    openPartnerJourney();
  }, [selectedJourney, navigate]);

  /* ==========================================================================
     PARTNER BUTTON HANDLER
     ========================================================================== */

  const handlePartnerClick = () => {
    if (isLoading) return;

    setSelectedJourney("partner");
  };

  /* ==========================================================================
     EARNING SECTION SCROLL
     ========================================================================== */

  const scrollToEarningSection = () => {
    earningSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <Header />

      {/* ====================================================================
          FULL SCREEN LOADER
          ==================================================================== */}

      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[320px] rounded-2xl border border-white/10 bg-white px-6 py-7 text-center shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-900">
              Opening Partner Journey
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Connecting you to the OXY Partner Network...
            </p>
          </div>
        </div>
      )}

      <main className="overflow-hidden bg-white font-sans text-slate-900">
        {/* ==================================================================
            HERO SECTION
            ================================================================== */}

        <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/70">
          {/* Background Decorations */}

          <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl" />

          <div className="pointer-events-none absolute left-1/2 top-[45%] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-teal-200/10 blur-[100px]" />

          <div
            className="
              relative
              mx-auto
              grid
              max-w-[1440px]
              grid-cols-1
              items-center
              gap-8
              px-4
              pb-10
              pt-24

              sm:px-6
              sm:pb-14
              sm:pt-28

              md:px-8

              lg:min-h-[640px]
              lg:grid-cols-[0.98fr_1.02fr]
              lg:gap-12
              lg:px-10
              lg:pb-16
              lg:pt-32

              xl:px-12
            "
          >
            {/* ==============================================================
                HERO CONTENT
                ============================================================== */}

            <div
              data-reveal
              className="
                order-2
                mx-auto
                max-w-[690px]
                translate-y-6
                text-center
                opacity-0
                transition-all
                duration-700

                lg:order-1
                lg:mx-0
                lg:text-left
              "
            >
              {/* Badge */}

              <div className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3.5 py-1.5 shadow-sm backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700 sm:text-[11px]">
                    OXY Partner Network
                  </span>
                </div>
              </div>

              {/* Main Heading */}

              <h1
                className="
                  mt-5
                  text-[30px]
                  font-bold
                  leading-[1.1]
                  tracking-[-0.04em]
                  text-slate-950

                  sm:text-[38px]
                  md:text-[44px]
                  lg:text-[48px]
                  xl:text-[54px]
                "
              >
                Start Your
                <span className="block">Partner Journey &</span>

                <span className="mt-1.5 block bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                  Earn Money
                </span>
              </h1>

              {/* Description */}

              <p
                className="
                  mx-auto
                  mt-5
                  max-w-[620px]
                  text-[13px]
                  leading-6
                  text-slate-600

                  sm:text-sm
                  sm:leading-7

                  lg:mx-0
                  lg:text-[15px]
                "
              >
                Choose a partner journey based on your network and
                opportunities. Connect eligible customers, professionals or
                businesses with the right OXY platform and earn an applicable
                share from the platform fee when a qualifying transaction is
                successfully completed.
              </p>

              {/* Partner Journey Pills */}

              <div
                className="
                  mx-auto
                  mt-5
                  flex
                  max-w-[660px]
                  flex-wrap
                  justify-center
                  gap-2

                  lg:mx-0
                  lg:justify-start
                "
              >
                {partnerJourneys.map((journey) => {
                  const Icon = journey.icon;

                  return (
                    <div
                      key={journey.title}
                      className="
                        group
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-slate-200
                        bg-white
                        px-3
                        py-1.5
                        text-[10px]
                        font-semibold
                        text-slate-700
                        shadow-sm
                        transition-all
                        duration-300

                        hover:-translate-y-0.5
                        hover:border-emerald-300
                        hover:bg-emerald-50
                        hover:text-emerald-700
                        hover:shadow-md

                        sm:text-[11px]
                      "
                    >
                      <Icon className="h-3.5 w-3.5 text-emerald-600" />

                      <span>{journey.title}</span>
                    </div>
                  );
                })}
              </div>

              {/* CTA Buttons */}

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={handlePartnerClick}
                  disabled={isLoading}
                  className="
                    group
                    inline-flex
                    min-h-[48px]
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-emerald-600
                    to-teal-600
                    px-5
                    text-[13px]
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-emerald-600/20
                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:shadow-xl
                    hover:shadow-emerald-600/25

                    active:translate-y-0

                    disabled:pointer-events-none
                    disabled:opacity-70

                    sm:px-6
                    sm:text-sm
                  "
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Opening...</span>
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4" />

                      <span>Start Partner Journey</span>

                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={scrollToEarningSection}
                  className="
                    group
                    inline-flex
                    min-h-[48px]
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-5
                    text-[13px]
                    font-semibold
                    text-slate-700
                    shadow-sm
                    transition-all
                    duration-300

                    hover:border-emerald-300
                    hover:bg-emerald-50
                    hover:text-emerald-700
                    hover:shadow-md

                    sm:px-6
                    sm:text-sm
                  "
                >
                  <Sparkles className="h-4 w-4 text-emerald-600" />

                  <span>Explore Earnings</span>
                </button>
              </div>
            
            </div>

            {/* ==============================================================
                HERO IMAGE
                ============================================================== */}

            <div
              data-reveal
              className="
                order-1
                relative
                mx-auto
                flex
                w-full
                max-w-[680px]
                translate-y-6
                items-center
                justify-center
                opacity-0
                transition-all
                delay-100
                duration-700

                lg:order-2
              "
            >
              <div className="absolute h-[60%] w-[70%] rounded-full bg-emerald-400/10 blur-[70px]" />

              <div className="absolute right-[12%] top-[15%] h-20 w-20 rounded-full bg-blue-400/10 blur-2xl" />

              <img
                src={HERO_IMAGE}
                alt="OXY Partner Network"
                loading="eager"
                className="
                  relative
                  z-10
                  max-h-[280px]
                  w-full
                  object-contain

                  sm:max-h-[370px]
                  md:max-h-[420px]
                  lg:max-h-[500px]
                "
              />
            </div>
          </div>
        </section>

        {/* ==================================================================
            PARTNER JOURNEYS STRIP
            ================================================================== */}

        <section className="border-b border-slate-100 bg-white py-7 sm:py-9">
          <div className="mx-auto max-w-[1350px] px-4 sm:px-6 lg:px-8">
            <div
              data-reveal
              className="translate-y-6 opacity-0 transition-all duration-700"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-600 sm:text-[11px]">
                    Multiple Partner Opportunities
                  </p>

                  <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
                    One Network. Multiple Ways to Grow.
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {partnerJourneys.map((journey) => {
                    const Icon = journey.icon;

                    return (
                      <div
                        key={`strip-${journey.title}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[10px] font-semibold text-slate-700 sm:text-[11px]"
                      >
                        <Icon className="h-3.5 w-3.5 text-emerald-600" />

                        {journey.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            EARNINGS SECTION
            ================================================================== */}

        <section
          ref={earningSectionRef}
          id="earning-opportunities"
          className="scroll-mt-24 bg-white py-12 sm:py-16 lg:py-20"
        >
          <div className="mx-auto max-w-[1350px] px-4 sm:px-6 lg:px-8">
            {/* Section Heading */}

            <div
              data-reveal
              className="mx-auto max-w-2xl translate-y-6 text-center opacity-0 transition-all duration-700"
            >
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-100 sm:text-[11px]">
                <TrendingUp className="h-3.5 w-3.5" />

                Partner Earnings
              </div>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-[36px]">
                Understand How Partner Earnings Work
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-slate-600 sm:text-sm">
                Partner earnings depend on the selected journey, eligible
                transactions and the applicable platform fee structure.
                Examples below show the current lender and borrower models.
              </p>
            </div>

            {/* ============================================================== 
                EARNING CARDS
                ============================================================== */}

            <div className="mt-9 grid gap-5 lg:grid-cols-2 lg:gap-6">
              {/* ============================================================
                  LENDER CARD
                  ============================================================ */}

              <article
                data-reveal
                className="translate-y-6 overflow-hidden rounded-2xl border border-emerald-100 bg-white opacity-0 shadow-[0_15px_45px_rgba(15,23,42,0.06)] transition-all duration-700"
              >
                {/* Header */}

                <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                      <UserPlus className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700 sm:text-[11px]">
                        Partner → Lender
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                        Lender Referral Earnings
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-slate-600 sm:text-[13px]">
                        Refer lenders and earn through eligible lending
                        activity.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  {/* First Cycle */}

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Example First Cycle
                    </p>

                    <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                      <ValueCard
                        label="First ₹1 Lakh"
                        value="₹1,000"
                        description="Partner earning"
                      />

                      <ValueCard
                        label="Next 49 Units"
                        value="₹4,900"
                        description="49 × ₹100"
                      />

                      <ValueCard
                        label="Total"
                        value="₹5,900"
                        description="First cycle"
                        highlight
                      />
                    </div>
                  </div>

                  {/* Yearly Earnings */}

                  <div className="mt-5">
                    <div className="flex items-center gap-2">
                      <RefreshCcw className="h-4 w-4 text-emerald-600" />

                      <h4 className="text-sm font-semibold text-slate-900">
                        Yearly Illustration
                      </h4>
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-500">
                          6-Month Rotation
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                          ₹10,800
                        </p>

                        <p className="text-[11px] text-slate-500">
                          Illustrated annual earning
                        </p>
                      </div>

                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        <p className="text-xs text-emerald-700">
                          3-Month Rotation
                        </p>

                        <p className="mt-1 text-lg font-bold text-emerald-900">
                          ₹20,600
                        </p>

                        <p className="text-[11px] text-emerald-700">
                          Illustrated annual earning
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 5 Years */}

                  <div className="mt-5 rounded-xl bg-slate-950 p-4 text-white sm:p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
                      5-Year Illustration
                    </p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] text-slate-400">One lender</p>

                        <p className="mt-1 text-base font-bold sm:text-lg">
                          ₹54,000 – ₹1.03 Lakh
                        </p>
                      </div>

                      <div className="border-t border-white/10 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                        <p className="text-[11px] text-emerald-300">
                          100 lenders
                        </p>

                        <p className="mt-1 text-base font-bold sm:text-lg">
                          ₹54 Lakh – ₹1.03 Cr
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* ============================================================
                  BORROWER CARD
                  ============================================================ */}

              <article
                data-reveal
                className="translate-y-6 overflow-hidden rounded-2xl border border-blue-100 bg-white opacity-0 shadow-[0_15px_45px_rgba(15,23,42,0.06)] transition-all delay-100 duration-700"
              >
                {/* Header */}

                <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <IndianRupee className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700 sm:text-[11px]">
                        Partner → Borrower
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                        Borrower Referral Earnings
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-slate-600 sm:text-[13px]">
                        Earn 25% of the applicable eligible borrower fee.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  {/* Main Values */}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Example Loan
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-900">
                        ₹1,00,000
                      </p>
                    </div>

                    <div className="rounded-xl bg-blue-50 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                        Partner Share
                      </p>

                      <p className="mt-1 text-xl font-bold text-blue-800">
                        25% of Platform Fee
                      </p>
                    </div>
                  </div>

                  {/* Responsive Table */}

                  <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                    <div className="hidden grid-cols-4 bg-slate-900 px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-300 sm:grid">
                      <span>Fee</span>

                      <span>Total Fee</span>

                      <span>Share</span>

                      <span>Earning</span>
                    </div>

                    {borrowerExamples.map((item) => (
                      <div
                        key={item.fee}
                        className="grid grid-cols-2 gap-3 border-t border-slate-100 p-3.5 first:border-t-0 sm:grid-cols-4 sm:items-center sm:px-4"
                      >
                        <MobileValue
                          label="Borrower Fee"
                          value={item.fee}
                        />

                        <MobileValue
                          label="Total Fee"
                          value={item.totalFee}
                        />

                        <MobileValue
                          label="Partner Share"
                          value={item.partnerShare}
                        />

                        <MobileValue
                          label="Partner Earns"
                          value={item.earning}
                          highlight
                        />
                      </div>
                    ))}
                  </div>

                  {/* 1000 Borrowers */}

                  <div className="mt-5 rounded-xl bg-slate-950 p-4 text-white sm:p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400">
                      1,000 Borrower Illustration
                    </p>

                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      1,000 borrowers × ₹1,00,000 = ₹10 Cr total loan volume.
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <DarkValue label="Gross Fee" value="₹20 Lakh" />

                      <DarkValue
                        label="Partner Payout"
                        value="₹5 Lakh"
                        accent
                      />

                      <DarkValue label="Platform Net" value="₹15 Lakh" />
                    </div>
                  </div>

                  {/* Note */}

                  <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                    <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

                    <p className="text-[11px] leading-5 text-slate-600 sm:text-xs">
                      Actual partner earnings depend on eligible successful
                      referrals and the applicable fee structure.
                    </p>
                  </div>
                </div>
              </article>
            </div>

            {/* General Earnings Note */}

            <div
              data-reveal
              className="mx-auto mt-7 max-w-4xl translate-y-6 opacity-0 transition-all duration-700"
            >
              <div className="rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-4 sm:px-5">
                <div className="flex items-start gap-3">
                  <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                  <p className="text-[11px] leading-5 text-slate-600 sm:text-xs">
                    Different partner journeys may have different fee and
                    payout structures. Lender and borrower calculations above
                    are illustrations for those journeys and should not be
                    treated as the payout structure for Real Estate, Jobs,
                    Study Abroad or Gold Partner journeys.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            NETWORK GROWTH SECTION
            ================================================================== */}

        <section className="relative overflow-hidden bg-slate-50 py-12 sm:py-16 lg:py-20">
          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-blue-300/10 blur-3xl" />

          <div className="relative mx-auto max-w-[1350px] px-4 sm:px-6 lg:px-8">
            <div
              data-reveal
              className="mx-auto max-w-3xl translate-y-6 text-center opacity-0 transition-all duration-700"
            >
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 shadow-sm ring-1 ring-slate-200 sm:text-[11px]">
                <Users className="h-3.5 w-3.5" />

                Network Growth
              </div>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-[36px]">
                Your Partner Journey Can Grow with Your Network
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-slate-600 sm:text-sm">
                Start with the opportunities already around you. As your
                network grows, you can continue connecting relevant customers,
                professionals and businesses with suitable OXY platforms and
                create more eligible earning opportunities.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <NetworkCard
                number="01"
                title="Start with Your Network"
                description="Use your existing professional, business and personal network to identify relevant opportunities."
              />

              <NetworkCard
                number="02"
                title="Connect the Right Journey"
                description="Guide each opportunity toward the OXY platform and partner journey that matches their requirement."
              />

              <NetworkCard
                number="03"
                title="Grow Together"
                description="Continue building relationships, expanding your network and creating more qualifying opportunities."
              />
            </div>
          </div>
        </section>

        {/* ==================================================================
            4 STEP JOURNEY
            ================================================================== */}

        <section className="relative overflow-hidden bg-slate-950 py-12 text-white sm:py-16 lg:py-20">
          {/* Background */}

          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-[1350px] px-4 sm:px-6 lg:px-8">
            {/* Heading */}

            <div
              data-reveal
              className="mx-auto max-w-2xl translate-y-6 text-center opacity-0 transition-all duration-700"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400 sm:text-[11px]">
                Simple Partner Journey
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-[36px]">
                Start. Connect. Earn. Grow.
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
                Choose your journey, build your network and create eligible
                opportunities across OXY platforms.
              </p>
            </div>

            {/* Steps */}

            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {steps.map((item, index) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.number}
                    type="button"
                    data-reveal
                    onClick={handlePartnerClick}
                    disabled={isLoading}
                    style={{
                      transitionDelay: `${index * 80}ms`,
                    }}
                    className="
                      group
                      translate-y-6
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      p-4
                      text-left
                      opacity-0
                      backdrop-blur
                      transition-all
                      duration-700

                      hover:-translate-y-1
                      hover:border-emerald-400/40
                      hover:bg-white/[0.07]

                      disabled:pointer-events-none
                      disabled:opacity-60

                      sm:p-5
                    "
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">
                        {item.number}
                      </span>

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.07]">
                        <Icon className="h-4 w-4 text-slate-300 transition-colors duration-300 group-hover:text-emerald-400" />
                      </div>
                    </div>

                    <h3 className="mt-5 text-[15px] font-semibold text-white sm:text-base">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-[11px] leading-5 text-slate-400 sm:text-xs">
                      {item.description}
                    </p>

                    <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <span>Get Started</span>

                      <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Final CTA */}

            <div
              data-reveal
              className="mt-9 translate-y-6 text-center opacity-0 transition-all duration-700"
            >
              <p className="mx-auto mb-5 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
                Choose the journey that matches your opportunities and start
                building your partner network today.
              </p>

              <button
                type="button"
                onClick={handlePartnerClick}
                disabled={isLoading}
                className="
                  group
                  inline-flex
                  min-h-[48px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-emerald-500
                  to-teal-500
                  px-6
                  text-[13px]
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-emerald-500/20
                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:shadow-xl

                  disabled:pointer-events-none
                  disabled:opacity-70

                  sm:px-8
                  sm:text-sm
                "
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    <span>Opening...</span>
                  </>
                ) : (
                  <>
                    <span>Start Your Partner Journey</span>

                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

/* ==========================================================================
   VALUE CARD
   ========================================================================== */

interface ValueCardProps {
  label: string;
  value: string;
  description: string;
  highlight?: boolean;
}

const ValueCard: React.FC<ValueCardProps> = ({
  label,
  value,
  description,
  highlight = false,
}) => {
  return (
    <div
      className={
        highlight
          ? "rounded-xl border border-emerald-200 bg-emerald-50 p-3"
          : "rounded-xl border border-slate-200 bg-white p-3"
      }
    >
      <p
        className={
          highlight
            ? "text-[10px] font-medium text-emerald-700"
            : "text-[10px] font-medium text-slate-500"
        }
      >
        {label}
      </p>

      <p
        className={
          highlight
            ? "mt-1 text-base font-bold text-emerald-800"
            : "mt-1 text-base font-bold text-slate-900"
        }
      >
        {value}
      </p>

      <p className="mt-0.5 text-[10px] text-slate-500">{description}</p>
    </div>
  );
};

/* ==========================================================================
   MOBILE TABLE VALUE
   ========================================================================== */

interface MobileValueProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const MobileValue: React.FC<MobileValueProps> = ({
  label,
  value,
  highlight = false,
}) => {
  return (
    <div>
      <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400 sm:hidden">
        {label}
      </p>

      <p
        className={
          highlight
            ? "mt-0.5 text-xs font-bold text-blue-700 sm:mt-0 sm:text-[13px]"
            : "mt-0.5 text-xs font-medium text-slate-700 sm:mt-0 sm:text-[13px]"
        }
      >
        {value}
      </p>
    </div>
  );
};

/* ==========================================================================
   DARK VALUE
   ========================================================================== */

interface DarkValueProps {
  label: string;
  value: string;
  accent?: boolean;
}

const DarkValue: React.FC<DarkValueProps> = ({
  label,
  value,
  accent = false,
}) => {
  return (
    <div
      className={
        accent
          ? "rounded-lg border border-blue-400/20 bg-blue-500/10 p-3"
          : "rounded-lg border border-white/10 bg-white/[0.05] p-3"
      }
    >
      <p
        className={
          accent
            ? "text-[10px] text-blue-300"
            : "text-[10px] text-slate-400"
        }
      >
        {label}
      </p>

      <p className="mt-1 text-base font-bold text-white">{value}</p>
    </div>
  );
};

/* ==========================================================================
   NETWORK CARD
   ========================================================================== */

interface NetworkCardProps {
  number: string;
  title: string;
  description: string;
}

const NetworkCard: React.FC<NetworkCardProps> = ({
  number,
  title,
  description,
}) => {
  return (
    <div
      data-reveal
      className="
        group
        translate-y-6
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        opacity-0
        shadow-[0_12px_35px_rgba(15,23,42,0.04)]
        transition-all
        duration-700

        hover:-translate-y-1
        hover:border-emerald-200
        hover:shadow-[0_18px_45px_rgba(15,23,42,0.07)]

        sm:p-6
      "
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-emerald-600">{number}</span>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </div>
      </div>

      <h3 className="mt-5 text-base font-bold text-slate-900 sm:text-lg">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-[13px]">
        {description}
      </p>
    </div>
  );
};

export default OxyLoansOverviewPage;