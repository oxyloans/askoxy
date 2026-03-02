import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  CheckCircle,
  MessageCircle,
  X,
  Copy,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const rotatingWords = [
  "District 3150",
  "Community Service",
  "Global Impact",
  "AI Assistance",
  "Fellowship",
];

export default function RotaryLandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let idx = 0;
    const word = rotatingWords[currentWordIndex];
    setIsTypingComplete(false);
    setTypedText("");

    const interval = setInterval(() => {
      if (idx < word.length) {
        setTypedText(word.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
        setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        }, 2500);
      }
    }, 85);

    return () => clearInterval(interval);
  }, [currentWordIndex]);

  const handleStartChat = () => {
    sessionStorage.setItem("backoption", "/rotarydistrict3150AiAgent");
    navigate(
      "/asst_Sfq4w0aKDtLKXMVFfZxhb6mJ/1b9efd8e-b77a-4d2c-976e-c29697ca3b0c/Rotary%20District5203150",
    );
  };

  const handleFAQClick = () => {
    setShowFAQModal(true);
  };

  const faqQuestions = [
    "Who is the current District Governor of Rotary District 3150?",
    "Who is the District Governor Elect for the next Rotary year?",
    "Who is the District Secretary of Rotary District 3150?",
    "What are the main regions included in Rotary District 3150?",
    "Can you list some Rotary Clubs under District 3150?",
    "Which cities and towns have Rotary Clubs under District 3150?",
    "What leadership roles are listed in the District 3150 committee?",
    "What types of community service activities does District 3150 focus on?",
    "Where can I find the contact details of District 3150 officers?",
    "What major district events are mentioned in the district calendar?",
  ];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const serviceCards = [
    {
      title: "Club Resources",
      color: "text-amber-400",
      border: "border-amber-400/30",
      hover: "hover:border-amber-400/60 hover:shadow-amber-400/10",
      description:
        "District information, club activities, and event resources at your fingertips.",
    },
    {
      title: "AI Assistance",
      color: "text-sky-400",
      border: "border-sky-400/30",
      hover: "hover:border-sky-400/60 hover:shadow-sky-400/10",
      description:
        "Intelligent answers for community service planning and Rotary programs.",
    },
    {
      title: "Global Impact",
      color: "text-amber-400",
      border: "border-amber-400/30",
      hover: "hover:border-amber-400/60 hover:shadow-amber-400/10",
      description:
        "Drive meaningful change with fellowship tools and strategic guidance.",
    },
  ];

  return (
    <div className="w-full h-screen bg-[#0c1a35] flex flex-col overflow-hidden">
      {/* Top gold accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 shrink-0" />

      {/* Main content */}
      <div className="relative flex-1 flex items-stretch overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-900/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-950/60 blur-3xl" />
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-amber-500/5 blur-2xl" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(#d4a017 1px, transparent 1px), linear-gradient(90deg, #d4a017 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute top-[15%] left-[5%] w-2 h-2 rounded-full bg-amber-400/70 animate-ping" />
          <div className="absolute top-[65%] right-[7%] w-1.5 h-1.5 rounded-full bg-sky-400/70 animate-ping [animation-delay:800ms]" />
          <div className="absolute bottom-[18%] left-[20%] w-1.5 h-1.5 rounded-full bg-emerald-400/70 animate-ping [animation-delay:1300ms]" />
        </div>

        {/* ── MOBILE layout (< lg) ── */}
        <div className="lg:hidden flex flex-col w-full h-full">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center gap-5 px-5 pt-8 pb-4">
            {/* Image */}
            <div
              className={`flex justify-center transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="relative flex justify-center items-center">
                <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-2xl" />
                <img
                  src="/rotary_book.png"
                  alt="Rotary AI Hub"
                  className="relative z-10 w-36 sm:w-44 object-contain drop-shadow-2xl"
                />
                <div className="absolute -top-2 -right-2 z-20 bg-amber-500 text-[#0c1a35] text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-bounce whitespace-nowrap">
                  🤝 Trusted AI Agent
                </div>
              </div>
            </div>

            {/* Text content */}
            <div
              className={`flex flex-col gap-4 text-center w-full transition-all duration-700 ease-out delay-150 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {/* Headline */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  Rotary <span className="text-amber-400">AI Hub</span>
                </h1>
                <h2 className="text-sm sm:text-base font-semibold mt-1 text-slate-200">
                  Excellence in{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-emerald-300">
                    {typedText}
                  </span>
                  <span
                    className={`inline-block w-0.5 h-4 bg-sky-300 ml-0.5 align-middle ${
                      isTypingComplete ? "animate-pulse" : ""
                    }`}
                  />
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
                Supporting{" "}
                <span className="text-amber-400 font-semibold">
                  Rotary District 3150 members
                </span>{" "}
                with intelligent assistance for{" "}
                <span className="text-white">
                  <span className="text-sky-300 font-semibold">
                    service initiatives
                  </span>
                  ,{" "}
                  <span className="text-sky-300 font-semibold">
                    leadership growth
                  </span>
                  , and{" "}
                  <span className="text-sky-300 font-semibold">fellowship</span>
                </span>
                .
              </p>

              {/* Mobile CTA Buttons */}
              <div className="space-y-3 w-full max-w-sm mx-auto">
                <div>
                  <p className="text-xs text-slate-200 mb-2 tracking-wide text-center">
                    ✦ Typical Questions to Review the AI Agent
                  </p>
                  <button
                    onClick={handleFAQClick}
                    className="group w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold py-2.5 px-6 rounded-full transition-all duration-300 active:scale-95 text-sm shadow-lg shadow-sky-500/30"
                  >
                    <MessageCircle className="w-4 h-4" />
                    FAQ
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <hr className="border-white/10" />
                <div>
                  <p className="text-xs text-slate-200 mb-2 tracking-wide text-center">
                    ✦ Very Happy to share{" "}
                    <strong className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                      OUR
                    </strong>{" "}
                    <span className="text-amber-400 font-semibold">
                      District 3150 AI Agent
                    </span>
                  </p>
                  <button
                    onClick={handleStartChat}
                    className="group w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0c1a35] font-bold py-2.5 px-6 rounded-full transition-all duration-300 active:scale-95 text-sm shadow-lg shadow-amber-500/30"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Start Conversation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Service cards */}
              <div className="grid grid-cols-1 gap-2.5 w-full max-w-sm mx-auto mt-1">
                {serviceCards.map(
                  ({ title, color, border, hover, description }, i) => (
                    <div
                      key={i}
                      className={`group bg-white/5 backdrop-blur-sm rounded-xl py-3.5 px-4 border ${border} ${hover} hover:bg-white/10 transition-all duration-300 cursor-pointer flex items-start gap-3 text-left`}
                    >
                      <h3
                        className={`${color} text-sm font-bold shrink-0 w-28`}
                      >
                        {title}
                      </h3>
                      <p className="text-white/80 text-xs leading-snug">
                        {description}
                      </p>
                    </div>
                  ),
                )}
              </div>

              {/* Status pill */}
              <div className="flex items-center justify-center gap-2 mt-1 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-300">
                  District 3150 · Live AI
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── DESKTOP layout (≥ lg) — COMPLETELY UNCHANGED ── */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-0 w-full max-w-[90rem] mx-auto px-12 xl:px-16 items-center self-center">
          {/* LEFT — Content (8 cols) */}
          <div
            className={`lg:col-span-8 flex flex-col justify-center text-left transition-all duration-700 ease-out gap-y-6 xl:gap-y-8 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            {/* Headline */}
            <div>
              <h1 className="text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-tight">
                Rotary <span className="text-amber-400">AI Hub</span>
              </h1>
              <h2 className="text-2xl xl:text-3xl 2xl:text-4xl font-semibold mt-2 text-slate-200">
                Excellence in{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-emerald-300">
                  {typedText}
                </span>
                <span
                  className={`inline-block w-0.5 h-7 xl:h-8 bg-sky-300 ml-1 align-middle ${
                    isTypingComplete ? "animate-pulse" : ""
                  }`}
                />
              </h2>
            </div>
            <p className="text-lg xl:text-xl text-white leading-relaxed max-w-2xl">
              Empowering{" "}
              <span className="text-amber-400 font-semibold">
                Rotary District 3150 members
              </span>{" "}
              with intelligent AI support for{" "}
              <span className="text-white">
                impactful{" "}
                <span className="text-sky-300 font-semibold">
                  service projects
                </span>
                , <span className="text-sky-300 font-semibold">leadership</span>
                ,{" "}
                <span className="text-sky-300 font-semibold">
                  club engagement
                </span>
                , and{" "}
                <span className="text-sky-300 font-semibold">fellowship</span>
              </span>
              .
            </p>
            {/* CTA Buttons Section */}
            <div className="space-y-3">
              <div>
                <p className="text-sm xl:text-base text-slate-200 mb-2 tracking-wide">
                  ✦ Typical Questions to Review the AI Agent
                </p>
                <button
                  onClick={handleFAQClick}
                  className="group inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold py-2.5 px-6 rounded-full transition-all duration-300 hover:scale-105 text-sm xl:text-base shadow-lg shadow-sky-500/30"
                >
                  <MessageCircle className="w-4 h-4" />
                  FAQ
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <hr className="border-white/10" />
              <div>
                <p className="text-sm xl:text-base text-slate-200 mb-2 tracking-wide">
                  ✦ Very Happy to share{" "}
                  <strong className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                    OUR
                  </strong>{" "}
                  <span className="text-amber-400 font-semibold">
                    District 3150 AI Agent
                  </span>
                </p>
                <button
                  onClick={handleStartChat}
                  className="group inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0c1a35] font-bold py-2.5 px-6 rounded-full transition-all duration-300 hover:scale-105 text-sm xl:text-base shadow-lg shadow-amber-500/30"
                >
                  <MessageCircle className="w-4 h-4" />
                  Start Conversation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Service cards */}
            <div className="grid grid-cols-3 gap-3 max-w-xl">
              {serviceCards.map(
                ({ title, color, border, hover, description }, i) => (
                  <div
                    key={i}
                    className={`group bg-white/5 backdrop-blur-sm rounded-xl py-5 px-3 border ${border} ${hover} hover:bg-white/10 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer`}
                  >
                    <h3
                      className={`${color} text-sm xl:text-base font-bold text-center mb-2`}
                    >
                      {title}
                    </h3>
                    <p className="text-white text-center text-xs xl:text-sm leading-snug group-hover:text-white transition-colors duration-300">
                      {description}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* RIGHT — Image (4 cols) */}
          <div
            className={`lg:col-span-4 flex justify-center items-center transition-all duration-700 ease-out delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="relative group w-full flex justify-center">
              {/* Gold glow */}
              <div className="absolute inset-0 m-auto w-3/4 h-3/4 rounded-full bg-amber-400/8 blur-3xl group-hover:bg-amber-400/15 transition-all duration-500" />

              {/* Floating accent circles */}
              <div className="absolute top-[6%] left-[2%] w-12 h-12 rounded-full bg-white/5 border border-amber-400/15 backdrop-blur-md" />
              <div className="absolute bottom-[12%] right-[1%] w-9 h-9 rounded-full bg-white/5 border border-sky-400/15 backdrop-blur-md" />

              {/* Book image */}
              <img
                src="/rotary_book.png"
                alt="Rotary AI Hub"
                className="relative z-10 w-full max-w-sm xl:max-w-md 2xl:max-w-lg object-contain drop-shadow-2xl group-hover:scale-[1.03] transition-transform duration-500"
              />

              {/* Badge */}
              <div className="absolute top-2 right-[8%] z-20 bg-amber-500 text-[#0c1a35] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-amber-500/40 animate-bounce whitespace-nowrap">
                🤝 Trusted AI Agent
              </div>

              {/* Status pill */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#0c1a35]/90 border border-amber-400/30 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-xl whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs xl:text-sm font-semibold text-slate-200">
                  District 3150 · Live AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar — Powered by */}
      <div className="h-8 shrink-0 bg-[#080f1e] border-t border-white/5 flex items-center justify-center">
        <p className="text-white text-xs tracking-wide">
          Powered by{" "}
          <span className="text-amber-400 font-semibold">ASKOXY.AI</span>
          <span className="mx-2 text-white">·</span>
          Rotary District 3150
        </p>
      </div>

      {/* FAQ Modal */}
      {showFAQModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0c1a35] border border-amber-400/20 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-2xl font-bold text-white">
                Frequently Asked{" "}
                <span className="text-amber-400">Questions</span>
              </h3>
              <button
                onClick={() => setShowFAQModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-300" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              <div className="space-y-4">
                {faqQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-sky-400/20 hover:border-sky-400/40 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <span className="text-amber-400 font-bold text-sm">
                          Q{index + 1}.
                        </span>
                        <p className="text-white text-sm xl:text-base mt-1">
                          {question}
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(question, index)}
                        className="shrink-0 p-2 hover:bg-white/10 rounded-lg transition-all"
                        title="Copy question"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4 text-sky-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-400 group-hover:text-sky-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
