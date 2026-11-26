import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "../assets/img/askoxylogonew.webp";
import {
  ArrowRight,
  ArrowDown,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Linkedin,
  Copy,
  Check,
  ChevronDown,
  Award,
  Info,
  Share2,
  Sparkles,
} from "lucide-react";

// Verified specification links & assets
const APPLICATION_URL = "/main/askoxyjobs/21c55606-ba1a-4700-84a8-d57d1a68fe4e";
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/K8l3PAW4HUr4URyVlARq3C";
const WHATSAPP_CHANNEL_URL =
  "https://whatsapp.com/channel/0029VbESL1o6GcGBBoLba438";
const LINKEDIN_GROUP_URL = "https://www.linkedin.com/groups/40612403/";
const POSTER_IMAGE_URL =
  "https://i.ibb.co/VsxH2t1/Whats-App-Image-2026-11-26-at-1-09-18-PM.jpg";
const POSTER_FALLBACK_URL = "/task-askoxy-banner.jpg";
const FAQ_IMAGE_URL =
  "https://i.ibb.co/9kQSbf7F/FAQ-Characters-with-Colorful-Foliage-1.png";
const FAQ_FALLBACK_URL = "/faq-characters.png";

// Executive Framer Motion Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardHover = {
  rest: { y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  hover: { y: -5, transition: { duration: 0.25, ease: "easeOut" } },
};

interface StepItem {
  number: number;
  stageLabel: string;
  title: string;
  description: string;
  link?: string;
}

const applySteps: StepItem[] = [
  {
    number: 1,
    stageLabel: "Step 01",
    title: "Open the Application Link",
    description: "Visit the official ASKOXY.AI application page:",
    link: APPLICATION_URL,
  },
  {
    number: 2,
    stageLabel: "Step 02",
    title: "Login",
    description:
      "Login using your TASK-registered mobile number. Your registration details are already available in our database.",
  },
  {
    number: 3,
    stageLabel: "Step 03",
    title: "Select the Job Role",
    description:
      "Find AI Tech & Business Engineer and click Apply Now.",
  },
  {
    number: 4,
    stageLabel: "Step 04",
    title: "Upload Your Resume",
    description:
      "Upload your latest resume and check your ATS (Applicant Tracking System) score.",
  },
  {
    number: 5,
    stageLabel: "Step 05",
    title: "Complete the Assessment",
    description:
      "Click Start Your Exam and answer the 10–15 questions. Each question takes approximately one minute.",
  },
  {
    number: 6,
    stageLabel: "Step 06",
    title: "Submit Your Application",
    description:
      "Enter your Name, Mobile Number and Cover Letter, then submit your application.",
  },
];

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    id: "q1",
    question: "Which mobile number should I use to log in?",
    answer: "Use your TASK-registered mobile number.",
  },
  {
    id: "q2",
    question:
      "I have already completed the assessment. Should I take it again?",
    answer: "No. You do not need to apply again or retake it.",
  },
  {
    id: "q3",
    question:
      "Can I join the student communities without completing the assessment?",
    answer:
      "Yes. All students can directly join the official communities.",
  },
  {
    id: "q4",
    question: "Will my assessment score affect the final selection?",
    answer: "No. Your assessment score will not affect the final selection.",
  },
  {
    id: "q5",
    question: "Is the program free?",
    answer: "Yes. The 90-Day Job Program is offered at No Cost – 100% Free.",
  },
];

const TaskProgramPage: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<string | null>("q1");
  const [posterError, setPosterError] = useState(false);
  const [faqImageError, setFaqImageError] = useState(false);

  useEffect(() => {
    document.title =
      "TASK | ASKOXY.AI – 90-Day Job Program | #Free #NoCost #AITraining #JobReadiness";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCopy = (text: string, label: string) => {
    const copySuccess = () => {
      setCopiedLink(label);
      setTimeout(() => setCopiedLink(null), 2500);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(copySuccess).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }

    function fallbackCopy(str: string) {
      const textarea = document.createElement("textarea");
      textarea.value = str;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        copySuccess();
      } catch (err) {
        console.error("Copy failed", err);
      }
      document.body.removeChild(textarea);
    }
  };

  const toggleFaq = (id: string) => {
    setActiveFaq((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 font-body antialiased selection:bg-indigo-600 selection:text-white flex flex-col justify-between">
      {/* =========================================================================
          PROFESSIONAL STICKY HEADER (max-w-8xl, Logo on Left, Apply Now on Right)
      ========================================================================= */}
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
      >
        <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo on the extreme left */}
          <Link
            to="/"
            className="flex items-center shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg py-1 transition-transform hover:opacity-95"
            aria-label="ASKOXY.AI Home"
          >
            <img
              src={Logo}
              alt="ASKOXY.AI Logo"
              width="150"
              height="44"
              className="h-9 sm:h-11 w-auto object-contain"
              loading="eager"
            />
          </Link>

          {/* Apply Now button on the extreme right */}
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href={APPLICATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shrink-0 min-h-[44px]"
          >
            <span>Apply Now</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.a>
        </div>
      </motion.header>

      {/* =========================================================================
          MAIN CONTENT AREA (All Sections: w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8)
      ========================================================================= */}
      <main className="flex-1 space-y-12 sm:space-y-16 lg:space-y-20 pb-16 sm:pb-24">
        {/* =======================================================================
            HERO SECTION: Left Content (Reduced Font Size) & Right Full Image (12px Radius)
        ======================================================================= */}
        <section className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 lg:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Side: Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="lg:col-span-6 space-y-5 sm:space-y-6"
            >
              {/* Program Headline (Reduced Font Size) */}
              <motion.div variants={fadeInUp} className="space-y-2.5">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  TASK | ASKOXY.AI – 90-Day Job Program
                </h1>

                {/* Hashtags with subtle hover micro-interaction */}
                <div className="flex flex-wrap gap-2 pt-1 text-xs sm:text-sm font-bold">
                  <motion.span
                    whileHover={{ scale: 1.05, y: -1 }}
                    className="rounded-lg bg-indigo-50 px-2.5 py-1 border border-indigo-200 text-indigo-700 shadow-2xs cursor-default transition-colors"
                  >
                    #Free
                  </motion.span>
                  <motion.span
                    whileHover={{ scale: 1.05, y: -1 }}
                    className="rounded-lg bg-emerald-50 px-2.5 py-1 border border-emerald-200 text-emerald-700 shadow-2xs cursor-default transition-colors"
                  >
                    #NoCost
                  </motion.span>
                  <motion.span
                    whileHover={{ scale: 1.05, y: -1 }}
                    className="rounded-lg bg-purple-50 px-2.5 py-1 border border-purple-200 text-purple-700 shadow-2xs cursor-default transition-colors"
                  >
                    #AITraining
                  </motion.span>
                  <motion.span
                    whileHover={{ scale: 1.05, y: -1 }}
                    className="rounded-lg bg-blue-50 px-2.5 py-1 border border-blue-200 text-blue-700 shadow-2xs cursor-default transition-colors"
                  >
                    #JobReadiness
                  </motion.span>
                </div>
              </motion.div>

              {/* Exclusivity Highlight (Occupies only the text width) */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50/95 px-3 py-1.5 shadow-2xs transition-shadow hover:shadow-xs w-fit"
              >
                <Award className="h-4 w-4 text-amber-700 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-amber-950">
                  Exclusively for TASK-Registered Students
                </span>
              </motion.div>

              {/* Welcome & Overview Text */}
              <motion.div
                variants={fadeInUp}
                className="space-y-3.5 text-sm sm:text-base text-slate-700 leading-relaxed"
              >
                <p className="font-semibold text-slate-900">
                  Welcome to the TASK | ASKOXY.AI 90-Day Job Program!
                </p>
                <p>
                  The{" "}
                  <span className="font-bold text-indigo-700">
                    TASK | ASKOXY.AI 90-Day Job Program
                  </span>{" "}
                  is a joint initiative of{" "}
                  <span className="font-bold text-purple-700">
                    TASK (Telangana Academy for Skill and Knowledge)
                  </span>{" "}
                  and{" "}
                  <span className="font-bold text-blue-700">ASKOXY.AI</span>,
                  exclusively designed for{" "}
                  <span className="font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    TASK-registered students
                  </span>
                  .
                </p>
                <p>
                  This{" "}
                  <span className="font-bold text-slate-900">
                    90-day classroom training program
                  </span>{" "}
                  is offered at{" "}
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    #Free | #NoCost
                  </span>
                  , focusing on{" "}
                  <span className="font-bold text-sky-700">technical skills</span>
                  ,{" "}
                  <span className="font-bold text-purple-700">
                    business skills
                  </span>
                  ,{" "}
                  <span className="font-bold text-indigo-700">
                    hands-on AI exposure
                  </span>{" "}
                  and{" "}
                  <span className="font-bold text-emerald-700">
                    job readiness
                  </span>
                  .
                </p>
                <div className="rounded-xl bg-slate-100/90 border border-slate-200 p-3.5 sm:p-4 text-xs sm:text-sm font-medium text-slate-800 shadow-2xs">
                  <strong className="text-slate-950">Eligibility:</strong> Only students registered with TASK
                  are eligible to participate in this program.
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  This guide explains how to apply, complete the online
                  assessment and join our official student communities.
                </p>
              </motion.div>
            </motion.div>

            {/* Right Side: Full Poster Image (Radius is 12px on all four sides) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="lg:col-span-6 flex flex-col items-center justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.25 }}
                className="relative w-full rounded-[12px] overflow-hidden border border-slate-200/90 shadow-md hover:shadow-lg transition-shadow bg-white"
              >
                <img
                  src={posterError ? POSTER_FALLBACK_URL : POSTER_IMAGE_URL}
                  onError={() => setPosterError(true)}
                  alt="TASK | ASKOXY.AI 90-Day Job Program Poster"
                  width="600"
                  height="400"
                  className="w-full h-auto object-contain block rounded-[12px]"
                  loading="eager"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* =====================================================================
              CENTER-ALIGNED MAIN APPLY NOW BUTTON (With Pulsing Micro-Interaction)
          ===================================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-full max-w-8xl mx-auto mt-10 sm:mt-12 text-center"
          >
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              animate={{
                boxShadow: [
                  "0px 4px 14px 0px rgba(79, 70, 229, 0.25)",
                  "0px 6px 20px 0px rgba(79, 70, 229, 0.4)",
                  "0px 4px 14px 0px rgba(79, 70, 229, 0.25)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              href={APPLICATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-8 sm:px-12 py-3.5 sm:py-4 text-base sm:text-lg font-bold text-white shadow-md hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 min-h-[48px]"
            >
              <span>Apply Now</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
            </motion.a>
          </motion.div>
        </section>

        {/* =======================================================================
            HOW TO APPLY – ROADMAP UI (Interactive Animated Workflow)
        ======================================================================= */}
        <section
          id="how-to-apply"
          className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
            className="border-t border-slate-200 pt-10 sm:pt-14 space-y-8 sm:space-y-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  How to Apply – 6 Simple Steps
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  Step-by-step roadmap from application to final submission.
                </p>
              </div>
              <motion.span
                whileHover={{ scale: 1.04 }}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 text-xs font-bold text-indigo-700 shadow-2xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>Roadmap Workflow</span>
              </motion.span>
            </div>

            {/* ROADMAP TIMELINE: ROW 1 (Steps 1, 2, 3) -> CONNECTOR -> ROW 2 (Steps 4, 5, 6) */}
            <div className="space-y-6 sm:space-y-8">
              {/* DESKTOP ROADMAP (lg:block): Row 1 (1, 2, 3) -> Bridge -> Row 2 (4, 5, 6) */}
              <div className="hidden lg:block space-y-6">
                {/* Row 1: Steps 1, 2, 3 */}
                <div className="grid grid-cols-3 gap-8 relative items-stretch">
                  {/* Step 1 */}
                  <div className="relative flex flex-col">
                    <motion.div
                      variants={fadeInUp}
                      whileHover="hover"
                      initial="rest"
                      animate="rest"
                      className="relative flex-1 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <motion.span
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-sm ring-4 ring-indigo-50"
                          >
                            01
                          </motion.span>
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                            Step 01
                          </span>
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                          Step 1: {applySteps[0].title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {applySteps[0].description}
                        </p>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
                        <motion.a
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          href={applySteps[0].link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 text-xs font-semibold transition"
                        >
                          <span>Open Application Link</span>
                          <ExternalLink className="h-3 w-3" />
                        </motion.a>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCopy(applySteps[0].link!, "Step 1 URL")}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 px-2.5 py-1.5 text-xs font-medium transition"
                          title="Copy Application Link"
                        >
                          <AnimatePresence mode="wait">
                            {copiedLink === "Step 1 URL" ? (
                              <motion.span
                                key="copied"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="inline-flex items-center gap-1 text-emerald-700 font-semibold"
                              >
                                <Check className="h-3 w-3 text-emerald-600" />
                                <span>Copied!</span>
                              </motion.span>
                            ) : (
                              <motion.span
                                key="copy"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="inline-flex items-center gap-1"
                              >
                                <Copy className="h-3 w-3" />
                                <span>Copy Link</span>
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Animated Mainline Arrow: Step 1 -> Step 2 */}
                    <div className="absolute top-1/2 -right-5 -translate-y-1/2 z-20 pointer-events-none">
                      <motion.div
                        animate={{ x: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white shadow-md ring-4 ring-white"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex flex-col">
                    <motion.div
                      variants={fadeInUp}
                      whileHover="hover"
                      initial="rest"
                      animate="rest"
                      className="relative flex-1 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <motion.span
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-sm ring-4 ring-indigo-50"
                          >
                            02
                          </motion.span>
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                            Step 02
                          </span>
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                          Step 2: {applySteps[1].title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {applySteps[1].description}
                        </p>
                      </div>
                    </motion.div>

                    {/* Animated Mainline Arrow: Step 2 -> Step 3 */}
                    <div className="absolute top-1/2 -right-5 -translate-y-1/2 z-20 pointer-events-none">
                      <motion.div
                        animate={{ x: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white shadow-md ring-4 ring-white"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex flex-col">
                    <motion.div
                      variants={fadeInUp}
                      whileHover="hover"
                      initial="rest"
                      animate="rest"
                      className="relative flex-1 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <motion.span
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-sm ring-4 ring-indigo-50"
                          >
                            03
                          </motion.span>
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                            Step 03
                          </span>
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                          Step 3: {applySteps[2].title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {applySteps[2].description}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Mainline Turn Connector: Row 1 down to Row 2 */}
                <div className="flex items-center justify-end pr-14 py-2">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 shadow-xs"
                  >
                    <span>Proceed to Steps 4, 5 &amp; 6</span>
                    <motion.div
                      animate={{ y: [0, 5, 0], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowDown className="h-4 w-4 text-indigo-600" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Row 2: Steps 4, 5, 6 */}
                <div className="grid grid-cols-3 gap-8 relative items-stretch">
                  {/* Step 4 */}
                  <div className="relative flex flex-col">
                    <motion.div
                      variants={fadeInUp}
                      whileHover="hover"
                      initial="rest"
                      animate="rest"
                      className="relative flex-1 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <motion.span
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-sm ring-4 ring-indigo-50"
                          >
                            04
                          </motion.span>
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                            Step 04
                          </span>
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                          Step 4: {applySteps[3].title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {applySteps[3].description}
                        </p>
                      </div>
                    </motion.div>

                    {/* Animated Mainline Arrow: Step 4 -> Step 5 */}
                    <div className="absolute top-1/2 -right-5 -translate-y-1/2 z-20 pointer-events-none">
                      <motion.div
                        animate={{ x: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white shadow-md ring-4 ring-white"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="relative flex flex-col">
                    <motion.div
                      variants={fadeInUp}
                      whileHover="hover"
                      initial="rest"
                      animate="rest"
                      className="relative flex-1 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <motion.span
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-sm ring-4 ring-indigo-50"
                          >
                            05
                          </motion.span>
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                            Step 05
                          </span>
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                          Step 5: {applySteps[4].title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {applySteps[4].description}
                        </p>
                      </div>
                    </motion.div>

                    {/* Animated Mainline Arrow: Step 5 -> Step 6 */}
                    <div className="absolute top-1/2 -right-5 -translate-y-1/2 z-20 pointer-events-none">
                      <motion.div
                        animate={{ x: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white shadow-md ring-4 ring-white"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Step 6 (Final Milestone) */}
                  <div className="relative flex flex-col">
                    <motion.div
                      variants={fadeInUp}
                      whileHover="hover"
                      initial="rest"
                      animate="rest"
                      className="relative flex-1 flex flex-col justify-between rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all group"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <motion.span
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-sm ring-4 ring-emerald-50"
                          >
                            06
                          </motion.span>
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                            Final Step
                          </span>
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                          Step 6: {applySteps[5].title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {applySteps[5].description}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* MOBILE & TABLET ROADMAP (lg:hidden): Connected Vertical Timeline */}
              <div className="block lg:hidden relative pl-6 sm:pl-8 space-y-6">
                {/* Vertical Spine Progress Track */}
                <div
                  className="absolute left-2.5 sm:left-3.5 top-3 bottom-3 w-0.5 bg-gradient-to-b from-indigo-500 via-indigo-300 to-emerald-500 rounded-full"
                  aria-hidden="true"
                />

                {applySteps.map((step) => {
                  const isFinal = step.number === 6;
                  return (
                    <motion.div
                      key={step.number}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-30px" }}
                      variants={fadeInUp}
                      className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs"
                    >
                      {/* Timeline Dot Indicator on the track */}
                      <div
                        className={`absolute -left-[27px] sm:-left-[35px] top-5 flex h-6 w-6 items-center justify-center rounded-full text-white text-[11px] font-bold ring-4 ring-slate-50 shadow-xs ${
                          isFinal ? "bg-emerald-600" : "bg-indigo-600"
                        }`}
                      >
                        {step.number}
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${
                              isFinal ? "text-emerald-700" : "text-indigo-600"
                            }`}
                          >
                            {step.stageLabel}
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-slate-900">
                          Step {step.number}: {step.title}
                        </h3>

                        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      {step.link && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                          <a
                            href={step.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 text-xs font-semibold transition"
                          >
                            <span>Open Application Link</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          <button
                            onClick={() => handleCopy(step.link!, "Step 1 Mobile URL")}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 px-2.5 py-1.5 text-xs font-medium transition"
                            title="Copy Application Link"
                          >
                            {copiedLink === "Step 1 Mobile URL" ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-600" />
                                <span className="text-emerald-700 font-semibold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </section>

        {/* =======================================================================
            IMPORTANT INSTRUCTIONS
        ======================================================================= */}
        <section className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
            className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs"
          >
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-4 flex items-center gap-2.5">
              <AlertCircle className="h-6 w-6 text-indigo-600 shrink-0" />
              <span>Important Instructions</span>
            </h2>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed list-disc list-inside sm:list-none sm:space-y-3">
              <li className="flex items-start gap-2.5 group">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 hidden sm:inline transition-transform group-hover:scale-110" />
                <span>The assessment can be attempted only once.</span>
              </li>
              <li className="flex items-start gap-2.5 group">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 hidden sm:inline transition-transform group-hover:scale-110" />
                <span>Your assessment score will not affect the final selection.</span>
              </li>
              <li className="flex items-start gap-2.5 group">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 hidden sm:inline transition-transform group-hover:scale-110" />
                <span>
                  Students who have already completed the assessment do not need to
                  apply again or retake it.
                </span>
              </li>
              <li className="flex items-start gap-2.5 group">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 hidden sm:inline transition-transform group-hover:scale-110" />
                <span>
                  Always use your TASK-registered mobile number to log in.
                </span>
              </li>
            </ul>
          </motion.div>
        </section>

        {/* =======================================================================
            ALREADY COMPLETED YOUR ASSESSMENT?
        ======================================================================= */}
        <section className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Already Completed Your Assessment?
              </h2>
              <p className="text-xs sm:text-sm text-slate-700">
                You do not need to apply again or retake the assessment.
              </p>
              <p className="text-xs sm:text-sm text-slate-700">
                Simply join our official student communities to receive further
                program updates and instructions.
              </p>
            </div>

            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              href="#communities"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-xs transition shrink-0 min-h-[44px]"
            >
              <span>Join Communities</span>
              <ArrowDown className="h-4 w-4" />
            </motion.a>
          </motion.div>
        </section>

        {/* =======================================================================
            JOIN OUR OFFICIAL STUDENT COMMUNITIES
        ======================================================================= */}
        <section
          id="communities"
          className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Join Our Official Student Communities
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
                Stay connected to receive important announcements, instructions
                and program updates.
              </p>
            </div>

            {/* Communities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {/* WhatsApp Group */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <MessageCircle className="h-6 w-6" />
                    <h3 className="font-bold text-base text-slate-900">
                      WhatsApp Group
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 break-all font-mono">
                    {WHATSAPP_GROUP_URL}
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={WHATSAPP_GROUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 text-xs font-bold transition min-h-[44px]"
                  >
                    <span>Join WhatsApp Group</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </motion.a>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() =>
                      handleCopy(WHATSAPP_GROUP_URL, "WhatsApp Group")
                    }
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 text-xs font-medium transition min-h-[38px]"
                  >
                    {copiedLink === "WhatsApp Group" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* WhatsApp Channel */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-teal-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-teal-300 hover:shadow-md transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-teal-600">
                    <Share2 className="h-6 w-6" />
                    <h3 className="font-bold text-base text-slate-900">
                      WhatsApp Channel
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 break-all font-mono">
                    {WHATSAPP_CHANNEL_URL}
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={WHATSAPP_CHANNEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white py-2.5 text-xs font-bold transition min-h-[44px]"
                  >
                    <span>Join WhatsApp Channel</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </motion.a>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() =>
                      handleCopy(WHATSAPP_CHANNEL_URL, "WhatsApp Channel")
                    }
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 text-xs font-medium transition min-h-[38px]"
                  >
                    {copiedLink === "WhatsApp Channel" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-teal-600" />
                        <span className="text-teal-700 font-semibold">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* LinkedIn Group */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-blue-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#0A66C2]">
                    <Linkedin className="h-6 w-6" />
                    <h3 className="font-bold text-base text-slate-900">
                      LinkedIn Group
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 break-all font-mono">
                    {LINKEDIN_GROUP_URL}
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={LINKEDIN_GROUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white py-2.5 text-xs font-bold transition min-h-[44px]"
                  >
                    <span>Join LinkedIn Group</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </motion.a>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() =>
                      handleCopy(LINKEDIN_GROUP_URL, "LinkedIn Group")
                    }
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 text-xs font-medium transition min-h-[38px]"
                  >
                    {copiedLink === "LinkedIn Group" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-blue-600" />
                        <span className="text-blue-700 font-semibold">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Community Note */}
            <div className="rounded-xl bg-slate-100 border border-slate-200 p-4 text-xs sm:text-sm text-slate-700 flex items-start gap-2.5 shadow-2xs">
              <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <p>
                <strong>Note:</strong> Students can join these communities
                directly, even without completing the application or assessment.
              </p>
            </div>
          </motion.div>
        </section>

        {/* =======================================================================
            FREQUENTLY ASKED QUESTIONS: Left Image (Transparent, Floating) & Right Accordion
        ======================================================================= */}
        <section className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
            className="space-y-6"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight text-center sm:text-left">
              Frequently Asked Questions
            </h2>

            {/* 2-Column Layout: Left Image (Transparent, Floating) & Right Accordion */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Left Side: Transparent FAQ Image without card background or borders, with subtle floating animation */}
              <div className="lg:col-span-5 flex items-center justify-center bg-transparent rounded-none p-0">
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full flex items-center justify-center bg-transparent"
                >
                  <img
                    src={faqImageError ? FAQ_FALLBACK_URL : FAQ_IMAGE_URL}
                    onError={() => setFaqImageError(true)}
                    alt="Frequently Asked Questions Illustration"
                    width="560"
                    height="440"
                    className="w-full h-auto max-h-[340px] sm:max-h-[420px] lg:max-h-[460px] object-contain mx-auto rounded-none bg-transparent"
                    loading="lazy"
                  />
                </motion.div>
              </div>

              {/* Right Side: Questions Accordion with smooth Framer Motion expand */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-3 sm:gap-3.5">
                {faqs.map((faq) => {
                  const isOpen = activeFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-colors hover:border-slate-300"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 text-left font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-50 transition"
                        aria-expanded={isOpen}
                      >
                        <span className="pr-3 leading-snug">{faq.question}</span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-slate-500 shrink-0"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: "easeInOut" }}
                            className="overflow-hidden border-t border-slate-100 bg-slate-50/60"
                          >
                            <div className="px-4 py-3.5 sm:px-5 sm:py-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </section>

        {/* =======================================================================
            CLOSING SIGN-OFF (Existing Content Only)
        ======================================================================= */}
        <section className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeInUp}
            className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-center space-y-4 shadow-xs"
          >
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              For further instructions and updates, please stay connected with
              our official student communities.
            </p>

            <div className="pt-2 text-sm sm:text-base font-bold text-slate-900">
              <p>Team ASKOXY.AI</p>
              <p className="text-indigo-600 font-semibold">
                In Association with TASK
              </p>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default TaskProgramPage;
