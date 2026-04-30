import React, { useState } from "react";
import {
  ArrowRight,
  HandCoins,
  Landmark,
  Users,
  Menu,
  X,
  BadgeCheck,
  Handshake,
  IndianRupee,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/image1.png";
import Logo1 from "../assets/img/askoxylogonew.png";

type Lang = "en" | "te";

const platformUrl = "https://oxyloans.com/";
const platformRedirectPath = "/platform-redirect?target=oxyloans";
const headerImage = "https://i.ibb.co/gFJpk82T/ipl-header.png";

const content = {
  en: {
    badge: "RBI Approved P2P NBFC Platform",
    heroTitle1: "One Platform for",
    heroTitle2: "Lending, Borrowing & Partners",
    heroDesc:
      "Choose the path that matches your need. Whether you want to lend money, borrow money, or join as a partner, OxyLoans helps you move forward with clarity.",
    continueText: "Continue",
    cards: [
      {
        title: "I Want to Lend Money",
        label: "Lender",
        desc: "Start lending through a transparent digital process and explore verified borrower opportunities with confidence.",
        icon: HandCoins,
      },
      {
        title: "I Want to Borrow Money",
        label: "Borrower",
        desc: "Apply online with a simple process and move ahead with clear steps designed for faster borrowing support.",
        icon: Landmark,
      },
      {
        title: "I Want to Source Lenders & Borrowers",
        label: "Partner / DSA",
        desc: "Join as a partner and grow with OxyLoans by connecting lenders and borrowers efficiently.",
        icon: Users,
      },
    ],
    stats: [
      {
        number: "30,000+",
        title: "Lenders",
        desc: "Trusted Investors",
        icon: Handshake,
      },
      {
        number: "270,000+",
        title: "Borrowers",
        desc: "Growing Community",
        icon: Users,
      },
      {
        number: "₹2,500,000,000+",
        title: "Total Disbursal",
        desc: "In the Indian Financial Market",
        icon: IndianRupee,
      },
    ],
    lendEarnTitle: "Lend and Earn",
    lendEarnDesc:
      "Simple, rewarding, and accessible opportunities for users who want to start lending digitally.",
    benefits: [
      {
        title: "Attractive Returns",
        desc: "Lend and Earn Upto 1.75% Monthly ROI and 24% P.A.",
        icon: TrendingUp,
      },
      {
        title: "Easy Investment",
        desc: "Start your investment journey with just ₹500",
        icon: Wallet,
      },
    ],
    centerBadge: "High Returns Opportunity",
    roiTop: "Earn Upto",
    roiMain: "1.75% Monthly ROI",
    roiBottom: "(Up to 24% Per Annum)",
    startNow: "Start Earning Now",
  },

  te: {
    badge: "RBI ఆమోదం పొందిన P2P NBFC ప్లాట్‌ఫారం",
    heroTitle1: "ఒకే ప్లాట్‌ఫామ్‌లో",
    heroTitle2: "రుణం, అప్పు & భాగస్వామ్యం",
    heroDesc:
      "మీ అవసరానికి సరిపోయే మార్గాన్ని ఎంచుకోండి. మీరు డబ్బు ఇవ్వాలనుకుంటున్నా, అప్పు తీసుకోవాలనుకుంటున్నా, లేదా భాగస్వామిగా చేరాలనుకున్నా — OxyLoans మీకు స్పష్టమైన మార్గాన్ని అందిస్తుంది.",
    continueText: "కొనసాగించండి",
    cards: [
      {
        title: "నేను డబ్బు అప్పుగా ఇవ్వాలనుకుంటున్నాను",
        label: "రుణదాత",
        desc: "పారదర్శకమైన డిజిటల్ ప్రక్రియ ద్వారా పెట్టుబడి పెట్టి నమ్మకమైన అవకాశాలను పరిశీలించండి.",
        icon: HandCoins,
      },
      {
        title: "నేను డబ్బు అప్పుగా తీసుకోవాలనుకుంటున్నాను",
        label: "రుణగ్రహీత",
        desc: "సులభమైన ఆన్‌లైన్ ప్రక్రియతో దరఖాస్తు చేసి వేగంగా ముందుకు సాగండి.",
        icon: Landmark,
      },
      {
        title: "నేను రుణదాతలు మరియు రుణగ్రహీతలను పరిచయం చేయాలనుకుంటున్నాను",
        label: "భాగస్వామి / DSA",
        desc: "భాగస్వామిగా చేరి రుణదాతలు మరియు రుణగ్రహీతలను కలుపుతూ OxyLoans తో ఎదగండి.",
        icon: Users,
      },
    ],
    stats: [
      {
        number: "30,000+",
        title: "రుణదాతలు",
        desc: "నమ్మకమైన పెట్టుబడిదారులు",
        icon: Handshake,
      },
      {
        number: "270,000+",
        title: "రుణగ్రహీతలు",
        desc: "విస్తరిస్తున్న కమ్యూనిటీ",
        icon: Users,
      },
      {
        number: "₹2,500,000,000+",
        title: "మొత్తం డిస్బర్సల్",
        desc: "భారత ఆర్థిక మార్కెట్లో",
        icon: IndianRupee,
      },
    ],
    lendEarnTitle: "డబ్బు ఇచ్చి సంపాదించండి",
    lendEarnDesc:
      "డిజిటల్ లెండింగ్ ప్రారంభించాలనుకునే వినియోగదారుల కోసం సులభమైన మరియు లాభదాయక అవకాశాలు.",
    benefits: [
      {
        title: "ఆకర్షణీయమైన రాబడులు",
        desc: "నెలకు 1.75% ROI మరియు సంవత్సరానికి 24% వరకు సంపాదించండి.",
        icon: TrendingUp,
      },
      {
        title: "సులభమైన పెట్టుబడి",
        desc: "కేవలం ₹500 తోనే మీ పెట్టుబడి ప్రయాణాన్ని ప్రారంభించండి",
        icon: Wallet,
      },
    ],
    centerBadge: "అధిక రాబడి అవకాశం",
    roiTop: "సంపాదించండి",
    roiMain: "నెలకు 1.75% ROI",
    roiBottom: "(సంవత్సరానికి 24% వరకు)",
    startNow: "ఇప్పుడే ప్రారంభించండి",
  },
};

function LanguageToggle({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: React.Dispatch<React.SetStateAction<Lang>>;
}) {
  return (
    <div className="inline-flex rounded-2xl border border-sky-200/70 bg-white/80 p-1 backdrop-blur-md shadow-[0_10px_30px_rgba(59,130,246,0.10)]">
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
          lang === "en"
            ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-sm"
            : "text-slate-700 hover:bg-sky-50"
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLang("te")}
        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
          lang === "te"
            ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-sm"
            : "text-slate-700 hover:bg-sky-50"
        }`}
      >
        తెలుగు
      </button>
    </div>
  );
}

export default function OxyLoansLandingPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const t = content[lang];

const goToLoginFirst = () => {
  const currentPage = window.location.pathname + window.location.search;

  const accessToken =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token");

  const cookieToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="));

  const isLoggedIn = Boolean(accessToken || cookieToken);

  // ✅ If already logged in, go directly to platform
  if (isLoggedIn) {
    window.location.href = platformUrl;
    return;
  }

  // ✅ After login success, go to platform redirect
  sessionStorage.setItem("redirectPath", platformRedirectPath);
  sessionStorage.setItem("platformRedirectUrl", platformUrl);
  localStorage.setItem("platformRedirectUrl", platformUrl);

  // ✅ If login closed, return to current page
  sessionStorage.setItem("loginCloseReturnPath", currentPage);

  navigate("/whatsapplogin", {
    state: {
      from: platformRedirectPath,
      closeReturnPath: currentPage,
    },
  });
};

  return (
    <div className="min-h-screen overflow-hidden bg-[#f0f7ff] text-slate-900">
      {/* ─── Fixed ambient background ─── */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(125,211,252,0.35),transparent),linear-gradient(180deg,#eef8ff_0%,#f7fbff_60%,#eff6ff_100%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(59,130,246,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.07)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* ─── Header ─── */}
      <header className="fixed left-0 top-0 z-[999] w-full border-b border-sky-100/80 bg-white/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(14,165,233,0.08)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <img
              src={Logo1}
              alt="AskOxy Logo"
              className="h-10 w-auto cursor-pointer object-contain sm:h-8 md:h-10"
              onClick={() => navigate("/")}
            />
            <button
              type="button"
              onClick={goToLoginFirst}
              className="flex items-center"
            >
              <img
                src={logo}
                alt="OxyLoans Logo"
                className="h-20 w-auto object-contain sm:h-16"
              />
            </button>
          </div>
          <div className="hidden md:block">
            <LanguageToggle lang={lang} setLang={setLang} />
          </div>
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-200 bg-white/80 text-slate-700 shadow-sm md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-sky-100 bg-white/95 px-4 py-4 md:hidden">
            <LanguageToggle lang={lang} setLang={setLang} />
          </div>
        )}
      </header>

      <main className="pt-[72px] sm:pt-[80px]">
        {/* HERO SECTION — BIG RIGHT IMAGE */}
        <section className="px-4 py-10 bg-gradient-to-br from-[#eaf7ff] via-white to-[#dff4ff] overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 items-center">
            {/* LEFT CONTENT */}
            <div className="text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 bg-sky-100 px-4 py-2 rounded-full">
                <BadgeCheck className="h-4 w-4 text-green-500" />
                {t.badge}
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                <span>{t.heroTitle1}</span>
                <span className="block mt-2 text-sky-600">{t.heroTitle2}</span>
              </h1>

              <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                {t.heroDesc}
              </p>

              <button
                onClick={goToLoginFirst}
                className="mt-6 px-8 py-3 bg-sky-600 text-white rounded-full font-bold hover:bg-sky-700 transition"
              >
                Get Started →
              </button>
            </div>

            {/* RIGHT BIG IMAGE */}
            <div className="relative flex justify-center lg:justify-end">
              {/* background glow */}
              <div className="absolute right-[-120px] top-[-60px] w-[500px] h-[500px] bg-cyan-300/30 blur-[120px] rounded-full"></div>
              <div className="absolute left-[20%] bottom-[-80px] w-[400px] h-[400px] bg-sky-400/20 blur-[120px] rounded-full"></div>

              {/* BIG IMAGE */}
              <img
                src={headerImage}
                alt="OxyLoans"
                className="
          relative z-10
          w-[140%]              /* makes image bigger than container */
          max-w-none            /* remove size restriction */
          lg:w-[160%]           /* even bigger on desktop */
          xl:w-[170%]
          object-contain
        "
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            CARDS SECTION
        ══════════════════════════════════════════════ */}
        <section className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 md:pb-16 md:pt-14 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {t.cards.map((card, index) => {
              const Icon = card.icon;

              const gradients = [
                "from-sky-50 via-white to-cyan-50",
                "from-emerald-50 via-white to-lime-50",
                "from-violet-50 via-white to-fuchsia-50",
              ];
              const borderColors = [
                "border-sky-200/60",
                "border-emerald-200/60",
                "border-violet-200/60",
              ];
              const iconGradients = [
                "from-sky-500 to-cyan-400",
                "from-emerald-500 to-green-400",
                "from-violet-500 to-fuchsia-400",
              ];
              const labelStyles = [
                "bg-sky-100 text-sky-700 border-sky-200",
                "bg-emerald-100 text-emerald-700 border-emerald-200",
                "bg-violet-100 text-violet-700 border-violet-200",
              ];
              const arrowColors = [
                "text-sky-600",
                "text-emerald-600",
                "text-violet-600",
              ];
              const glowColors = [
                "hover:shadow-[0_24px_60px_rgba(14,165,233,0.18)]",
                "hover:shadow-[0_24px_60px_rgba(16,185,129,0.18)]",
                "hover:shadow-[0_24px_60px_rgba(139,92,246,0.18)]",
              ];

              return (
                <button
                  type="button"
                  onClick={goToLoginFirst}
                  key={card.title}
                  className={`group relative overflow-hidden rounded-3xl border ${borderColors[index]} bg-gradient-to-br ${gradients[index]} p-6 text-left shadow-[0_8px_32px_rgba(59,130,246,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 ${glowColors[index]} sm:p-7`}
                >
                  {/* inner gloss */}
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(135deg,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0.10)_100%)]" />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${labelStyles[index]}`}
                      >
                        {card.label}
                      </span>
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${iconGradients[index]} text-white shadow-lg`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <h3 className="mt-5 text-xl font-bold leading-[1.35] text-slate-900 sm:text-2xl">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                      {card.desc}
                    </p>

                    <div
                      className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${arrowColors[index]}`}
                    >
                      {t.continueText}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            STATS + LEND & EARN SECTION
        ══════════════════════════════════════════════ */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-24 lg:px-8">
          <div className="relative overflow-hidden rounded-[44px] border border-white/80 bg-gradient-to-br from-[#dff4ff] via-[#eefcff] to-[#fff8e1] shadow-[0_32px_90px_rgba(14,165,233,0.13)]">
            {/* decorative blobs */}
            <div className="pointer-events-none absolute -top-24 left-0 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-cyan-200/25 blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-200/20 blur-3xl" />
            {/* inner gloss */}
            <div className="pointer-events-none absolute inset-0 rounded-[44px] bg-[linear-gradient(135deg,rgba(255,255,255,0.60),rgba(255,255,255,0.15))]" />

            <div className="relative p-6 sm:p-8 md:p-12">
              {/* ── Stats row ── */}
              <div className="grid gap-5 md:grid-cols-3">
                {t.stats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      onClick={goToLoginFirst}
                      key={item.title}
                      className="group rounded-3xl border border-white/80 bg-white/75 p-6 text-center shadow-[0_10px_32px_rgba(14,165,233,0.08)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(14,165,233,0.16)]"
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                        {item.number}
                      </h3>
                      <p className="mt-1 text-base font-semibold text-slate-800">
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* ── Divider ── */}
              <div className="my-10 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-300/50 to-transparent" />
                <span className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 shadow">
                  {t.centerBadge}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-300/50 to-transparent" />
              </div>

              {/* ── Lend & Earn centre block ── */}
              <div className="text-center">
                <h2 className="text-3xl font-bold leading-[1.2] text-slate-900 sm:text-4xl md:text-5xl">
                  {t.lendEarnTitle}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
                  {t.lendEarnDesc}
                </p>

                {/* ROI badge */}
                <div className="mt-8 inline-block">
                  <div className="relative overflow-hidden rounded-[28px] border border-orange-200/60 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 px-8 py-6 shadow-[0_16px_48px_rgba(245,158,11,0.14)]">
                    <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[linear-gradient(135deg,rgba(255,255,255,0.70),rgba(255,255,255,0.10))]" />
                    <div className="relative">
                      <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
                        {t.roiTop}
                      </p>
                      <h3 className="mt-1 text-4xl font-extrabold text-orange-500 sm:text-5xl">
                        {t.roiMain}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {t.roiBottom}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7">
                  <button
                    type="button"
                    onClick={goToLoginFirst}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-7 py-3.5 text-sm font-bold text-slate-900 shadow-[0_8px_30px_rgba(245,158,11,0.35)] transition hover:scale-[1.04] hover:shadow-[0_12px_40px_rgba(245,158,11,0.50)] sm:text-base"
                  >
                    {t.startNow}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* ── Benefits cards ── */}
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {t.benefits.map((item, index) => {
                  const Icon = item.icon;
                  const iconGrads = [
                    "from-emerald-400 to-green-500",
                    "from-fuchsia-500 to-violet-500",
                  ];
                  const textColors = ["text-orange-500", "text-sky-700"];
                  const glows = [
                    "hover:shadow-[0_18px_50px_rgba(16,185,129,0.18)]",
                    "hover:shadow-[0_18px_50px_rgba(139,92,246,0.18)]",
                  ];

                  return (
                    <button
                      type="button"
                      onClick={goToLoginFirst}
                      key={item.title}
                      className={`group rounded-3xl border border-white/80 bg-white/72 p-6 text-center shadow-[0_10px_32px_rgba(14,165,233,0.08)] backdrop-blur-xl transition hover:-translate-y-1 ${glows[index]}`}
                    >
                      <div
                        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${iconGrads[index]} text-white shadow-lg`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">
                        {item.title}
                      </h3>
                      <p
                        className={`mt-3 text-base font-semibold ${textColors[index]}`}
                      >
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
