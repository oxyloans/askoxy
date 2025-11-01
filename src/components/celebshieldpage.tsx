import React, { useState, useEffect } from "react";
import CELEBSHIELD from "../assets/img/celeblogo.png";

// ===== Replace these with real URLs =====
const HEROVIDEO = "https://youtu.be/FR0y9kmy2eY";

// Use the Drive file ID and build safe embed/fallback URLs
const PDF_ID = "1oxCJD_KW2FqT7j1C5rVtljc-YNK1Unpd";
const PDF_IFRAME = `https://drive.google.com/file/d/${PDF_ID}/preview`; // embeddable
const PDF_DIRECT = `https://drive.google.com/uc?export=download&id=${PDF_ID}`; // direct file
const PDF_GVIEW = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(
  PDF_DIRECT
)}`; // fallback viewer

const protectionFeatures = [
  {
    label: "Fake Videos",
    subtitle: "Blocked Instantly",
    content:
      "AI-generated deepfake videos and images are detected instantly with our advanced detection systems.",
    icon: "🎬",
    misuseType: "Deepfake Content",
  },
  {
    label: "Voice Clones",
    subtitle: "Detected Early",
    content:
      "Unauthorized replication of celebrity voices stopped before they spread with legal action.",
    icon: "🎤",
    misuseType: "Voice Replication",
  },
  {
    label: "Image Misuse",
    subtitle: "Removed Quickly",
    content:
      "Unauthorized celebrity likeness in ads, products, and GIFs traced and removed swiftly.",
    icon: "📸",
    misuseType: "Image Exploitation",
  },
];

const allFeaturesDetail = [
  {
    title: "Legal Filing",
    desc: "High Court petition citing celebrity precedents",
  },
  {
    title: "Evidence",
    desc: "AI detects deepfakes, fake ads, clones, compiles proof",
  },
  { title: "Court Actions", desc: "Immediate injunctions, takedowns" },
  { title: "Monitoring", desc: "24x7 legal AI protection systems" },
  {
    title: "Verification",
    desc: "CelebShield Verified Personality protection",
  },
];

const misuseTypes = [
  {
    type: "Deepfakes",
    desc: "AI-generated fake videos or images",
    icon: "🎭",
    intent: "Commercial Gain & Clickbait",
  },
  {
    type: "Voice Cloning",
    desc: "Unauthorized voice replication",
    icon: "🔊",
    intent: "False Promotion",
  },
  {
    type: "False Endorsement",
    desc: "Selling products with unauthorized celebrity likeness",
    icon: "🛍️",
    intent: "Product Association",
  },
  {
    type: "Impersonation",
    desc: "Falsely representing oneself as a celebrity",
    icon: "👤",
    intent: "Ad Revenue & Engagement",
  },
  {
    type: "Deceptive Ads",
    desc: "Using celebrity image/voice in misleading advertisements",
    icon: "📢",
    intent: "Engagement & Sensationalism",
  },
  {
    type: "GIF Misuse",
    desc: "Unauthorized use of celebrity GIFs for commercial gain",
    icon: "🎞️",
    intent: "Commercial Exploitation",
  },
  {
    type: "Domain Squatting",
    desc: "Registering domains with celebrity names for profit",
    icon: "🌐",
    intent: "Technology Demonstration",
  },
  {
    type: "Food Branding",
    desc: "Using celebrity image/name on food products without consent",
    icon: "🍽️",
    intent: "Product Association",
  },
];

const benefits = [
  "Backed by India's top advocates with proven track record",
  "AI-based deepfake detection technology",
  "High-Court verified legal protection",
  "Continuous 24/7 digital monitoring",
  "Protection against all 8 misuse types",
  "Insights from 9+ celebrity cases",
];

const faq = [
  {
    question: "What is a Writ Civil Suit for Personality Rights?",
    answer:
      "A High Court legal filing to protect your face, name, voice, likeness, or digital presence from unauthorized misuse, impersonation, or AI-generated content. It requests court injunctions to block misuse.",
  },
  {
    question: "Who Can Apply?",
    answer:
      "Celebrities, influencers, public figures, brand ambassadors, YouTubers, and even ordinary citizens facing impersonation or fake accounts.",
  },
  {
    question: "Where Is It Filed?",
    answer:
      "Delhi, Bombay High Courts; alternates Madras, Telangana, Karnataka, Calcutta High Courts.",
  },
  {
    question: "How Long Does Protection Last?",
    answer:
      "Interim protection 36 months. Can be converted to lifetime with CelebShield assistance.",
  },
  {
    question: "Is Personal Attendance Needed?",
    answer:
      "No. Panel advocates manage the case, you only sign a Power of Attorney and Consent Form.",
  },
];

export default function CelebShieldPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [pdfSrc, setPdfSrc] = useState<string>(PDF_IFRAME);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Circuit Background */}
      <div className="fixed inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="circuit"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M25 25h50M25 25v50M75 25v25M25 75h25"
                stroke="#a855f7"
                strokeWidth="1"
                fill="none"
                opacity="0.3"
              />
              <circle cx="25" cy="25" r="2" fill="#a855f7" opacity="0.5">
                <animate
                  attributeName="opacity"
                  values="0.5;1;0.5"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="75" cy="25" r="2" fill="#a855f7" opacity="0.5">
                <animate
                  attributeName="opacity"
                  values="0.5;1;0.5"
                  dur="2s"
                  begin="0.5s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="25" cy="75" r="2" fill="#a855f7" opacity="0.5">
                <animate
                  attributeName="opacity"
                  values="0.5;1;0.5"
                  dur="2s"
                  begin="1s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="50" cy="75" r="2" fill="#a855f7" opacity="0.5">
                <animate
                  attributeName="opacity"
                  values="0.5;1;0.5"
                  dur="2s"
                  begin="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient Overlays */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-violet-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10">
        {/* ===== HERO SECTION ===== */}
        <header className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-6 pt-8 sm:pt-12 pb-6 sm:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Content */}
            <div style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
              <div className="inline-flex items-center gap-3 mb-6 bg-gradient-to-r from-purple-600/30 to-violet-600/30 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-500/50">
                <div className="w-full h-full rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={CELEBSHIELD}
                    alt="CelebShield Logo"
                    className="w-30 h-20 object-contain"
                  />
                </div>
              </div>

              <h2 className="text-2xl sm:text-2xl lg:text-3xl font-extrabold mb-8 leading-tight">
                <span className="text-white">
                  PROTECT YOUR FAME. SECURE YOUR IDENTITY
                </span>
                <br />
                <span className="mt-10 gap-8 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                  We file a Writ / Civil Suit seeking protection of Personality
                  Rights.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-purple-200 mb-8 leading-relaxed">
                Advanced AI-powered legal protection against deepfakes, voice
                clones, and image misuse. Backed by India's top advocates with
                24/7 monitoring and High Court verification.
              </p>
            </div>
            <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-[0_25px_40px_rgba(168,85,247,0.4)] ring-2 ring-purple-500/50 transform hover:scale-[1.02] transition-all duration-500">
              {/* Soft glow layer */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 via-fuchsia-500/10 to-transparent blur-xl"></div>

              <iframe
                src="https://www.youtube.com/embed/FR0y9kmy2eY?autoplay=1&mute=1&rel=0&modestbranding=1&loop=1&playlist=FR0y9kmy2eY"
                title="CelebShield Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="relative w-full h-full rounded-2xl z-10"
              ></iframe>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-12 max-w-6xl mx-auto">
            {protectionFeatures.map((feature, index) => (
              <div
                key={feature.label}
                className="group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Outer Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Card Container */}
                <div className="relative flex items-center bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-2xl p-4 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] shadow-xl overflow-hidden h-[100px]">
                  {/* Shine Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>

                  <div className="relative z-10 flex items-center gap-4 w-full">
                    {/* Icon */}
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 group-hover:border-amber-400/50 transition-all duration-300">
                      <div className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent group-hover:from-amber-200 group-hover:to-amber-400 transition-all duration-300 mb-1">
                        {feature.label}
                      </h3>
                      <p className="text-xs text-purple-400 italic truncate">
                        {feature.subtitle}
                      </p>
                    </div>

                    {/* Badge */}
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition-colors"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* ===== MISUSE TYPES SECTION ===== */}
        <section className="mx-auto mt-12 sm:mt-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                8 Clear Misuse Types We Protect Against
              </span>
            </h2>
            <p className="text-purple-300 text-lg">
              Based on insights from 9+ celebrity personality-rights cases
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {misuseTypes.map((misuse, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-amber-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                  {misuse.icon}
                </div>
                <h3 className="text-lg font-bold text-amber-400 mb-2">
                  {misuse.type}
                </h3>
                <p className="text-sm text-purple-200 mb-3 leading-relaxed">
                  {misuse.desc}
                </p>
                <div className="pt-3 border-t border-purple-500/20">
                  <p className="text-xs text-purple-400 italic">
                    Intent: {misuse.intent}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Banner */}
          <div className="mt-12 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/30">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-amber-400 mb-1">
                  9+
                </div>
                <div className="text-sm text-purple-200">
                  Celebrity Cases Analyzed
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-amber-400 mb-1">
                  8
                </div>
                <div className="text-sm text-purple-200">
                  Misuse Types Identified
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-amber-400 mb-1">
                  24/7
                </div>
                <div className="text-sm text-purple-200">Active Monitoring</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="mx-auto mt-20 sm:mt-32 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                How CelebShield Works
              </span>
            </h2>
            <p className="text-purple-300 text-lg">
              Your complete protection journey in 5 steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {allFeaturesDetail.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connection Line */}
                {index < allFeaturesDetail.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></div>
                )}

                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105">
                  {/* Step Number */}
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>

                  {/* Title */}
                  <h4 className="text-lg font-bold text-center mb-2 text-amber-400">
                    {step.title}
                  </h4>

                  {/* Description */}
                  <p className="text-sm text-purple-200 text-center leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== BENEFITS ===== */}
        <section className="mx-auto mt-20 sm:mt-32 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-purple-500/30 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Why Choose CelebShield
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-purple-500/20 hover:border-amber-500/50 hover:from-purple-900/30 hover:to-slate-900/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-500/50 group-hover:scale-110 transition-transform flex-shrink-0">
                    ✓
                  </div>
                  <span className="font-semibold text-white text-sm">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="mx-auto mt-20 sm:mt-32 w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faq.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 cursor-pointer group"
                onClick={() =>
                  setExpandedFaq(expandedFaq === index ? null : index)
                }
              >
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-bold text-lg text-amber-400 flex-1 group-hover:text-amber-300 transition-colors">
                    {item.question}
                  </h3>
                  <div
                    className={`w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      expandedFaq === index ? "rotate-180 bg-purple-600" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5 text-purple-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedFaq === index ? "max-h-96 mt-4" : "max-h-0"
                  }`}
                >
                  <p className="text-purple-200 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PDF VIEWER ===== */}
        <section className="mx-auto my-20 sm:my-28 w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  CelebShield Complete PDF
                </h2>
                <p className="text-sm sm:text-base text-purple-300 mt-1 max-w-2xl leading-snug">
                  Detailed insights from 9+ celebrity personality-rights cases —
                  covering all 8 misuse types and protection strategies.
                </p>
              </div>

              {/* Right-Aligned Compact Download Button */}
              <a
                href={PDF_DIRECT}
                download
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-sm shadow-md shadow-amber-600/30 hover:shadow-amber-400/60 hover:scale-105 transition-all duration-300 whitespace-nowrap"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                  />
                </svg>
                Download
              </a>
            </div>

            {/* PDF Viewer */}
            <div className="overflow-hidden rounded-2xl shadow-xl border border-purple-500/40">
              <iframe
                src={pdfSrc}
                title="CelebShield PDF"
                className="h-[500px] sm:h-[700px] w-full bg-slate-900"
                onError={() => setPdfSrc(PDF_GVIEW)} // auto-fallback if preview fails
              />
            </div>

            {/* Fallback link */}
            <p className="mt-4 text-center text-purple-300 text-sm">
              If the PDF doesn’t load,&nbsp;
              <a
                href={PDF_DIRECT}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 underline font-semibold hover:text-amber-300"
              >
                open it in a new tab
              </a>
            </p>
          </div>
        </section>

        {/* ===== FOOTER WITH CONTACT ===== */}
        <footer className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-amber-400 mb-2">
                Get in Touch
              </h3>
              <p className="text-purple-300">
                Powered by ASKOXY.AI - Your Digital Rights Protection Partner
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://www.askoxy.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-purple-300 hover:text-amber-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                    clipRule="evenodd"
                  />
                </svg>
                www.askoxy.ai
              </a>
              <span className="text-purple-500 hidden sm:inline">|</span>
              <a
                href="mailto:support@askoxy.ai"
                className="flex items-center gap-2 text-purple-300 hover:text-amber-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                support@askoxy.ai
              </a>
            </div>
            <div className="mt-6 pt-6 border-t border-purple-500/30">
              <p className="text-purple-400 text-sm">
                © 2025 CelebShield. All rights reserved. Protecting
                personalities, one case at a time.
              </p>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0.3;
          }
        }
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
