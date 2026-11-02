import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";
import customerApi from "../utils/axiosInstances";
type ToastType = "success" | "error" | "info";
type Props = {
  brandName?: string;
  headline?: string;
  subheadline?: string;
  cta?: {
    primaryLabel?: string;
    primaryHref?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
  headerImageUrl?: string;
  interestApiPath?: string;
  joinProgramPath?: string;
};
type Day = {
  day: number;
  title: string;
  category: string;
  count?: number;
  summary: string;
  topics: string[];
  deliverable: string;
};
const logo = "https://i.ibb.co/39rQT8TW/9-Days-Job-Program-Logo-1.png";
const hero =
  "https://i.ibb.co/yc2F0HNd/Gemini-Generated-Image-6olzfg6olzfg6olz.png";
const companies = [
  {
    name: "OXYGLOBAL.TECH",
    src: "https://i.ibb.co/s4CW2mg/l1.png",
    url: "https://www.oxyglobal.tech/",
  },
  {
    name: "OXYLOANS",
    src: "https://i.ibb.co/B5xsVChY/l2.png",
    url: "https://oxyloans.com/",
  },
  {
    name: "OXYBRICKS.WORLD",
    src: "https://i.ibb.co/k2snG0YW/l3.png",
    url: "https://oxybricks.world/",
  },
  {
    name: "OXYGOLD.AI",
    src: "https://i.ibb.co/gb9bNnTZ/oxygoldlogo-bk.png",
    url: "https://www.oxygold.ai/",
  },
  {
    name: "OXYCHAIN",
    src: "https://i.ibb.co/B2NcQ7Nj/l5.png",
    url: "http://bmv.money:2750/",
  },
  {
    name: "OXYFINSERV",
    src: "https://i.ibb.co/Swx6RWXM/oxyfinservlogo-Cpr9-A3-NT.png",
    url: "https://www.oxyfinserv.com/",
  },
  {
    name: "TVRK",
    src: "https://i.ibb.co/5JzN8yL/logo-tvrk.png",
    url: "https://tvradhakrishna.com/",
  },
];

const days: Day[] = [
  {
    day: 1,
    title: "Customer Onboarding & Loan Origination",
    category: "Banking Workflows",
    count: 8,
    summary:
      "Learn how banking systems manage customer registration, KYC, credit appraisal, loan applications and sanction approvals.",
    topics: [
      "Customer ID Creation",
      "Co-applicant & Guarantor Linking",
      "Customer ID to Loan Linking",
      "Loan Appraisal System",
      "Loan Assessment Workflow",
      "Recommendation & Sanction Letter",
      "Risk Analysis Documentation",
      "Sanction & Customer Response Tracking",
    ],
    deliverable:
      "Demonstrate a complete customer onboarding and loan origination workflow, from customer creation to sanction approval.",
  },
  {
    day: 2,
    title: "Loan Servicing, Collateral & Risk Management",
    category: "Banking Workflows",
    count: 9,
    summary:
      "Explore repayment schedules, collateral management, credit limits, loan servicing, prepayments and NPA classification.",
    topics: [
      "Repayment Schedule Generation",
      "Terms & Conditions Approval",
      "Asset Details Capture",
      "Profile Update & Limit Check",
      "Account Closure & Net Worth Analysis",
      "Asset Details",
      "PDC Printing",
      "Installment Prepayment",
      "NPA Grading",
    ],
    deliverable:
      "Demonstrate loan repayment calculations, collateral capture, prepayment processing and risk classification workflows.",
  },
  {
    day: 3,
    title: "NPA, Settlements & Financial Management",
    category: "Banking Workflows",
    count: 8,
    summary:
      "Understand non-performing asset provisioning, settlement processing, cheque transactions, foreclosure and financial management operations.",
    topics: [
      "NPA Provisioning",
      "Settlements - Knock Off",
      "Settlements - Cheque Processing",
      "Settlements - Manual Advice",
      "Termination, Foreclosure & Closure",
      "Finance Viewer",
      "Floating Rate Review Process",
      "Settlements - Receipts",
    ],
    deliverable:
      "Demonstrate NPA provisioning, settlement processing, foreclosure and financial transaction reconciliation.",
  },
  {
    day: 4,
    title: "Finance Operations, Closure & Rescheduling",
    category: "Banking Workflows",
    count: 9,
    summary:
      "Learn how banking systems process settlements, waivers, daily batch operations, account closures and loan rescheduling.",
    topics: [
      "Settlements - Payments",
      "Settlements - Waive Off",
      "End-of-Day & Beginning-of-Day Operations",
      "Account Closure Workflow",
      "View Account Status",
      "Document Master",
      "Finance Rescheduling - Bulk Prepayment",
      "Finance Rescheduling - Due Date Change",
      "Finance Rescheduling - Profit Rate Change",
    ],
    deliverable:
      "Demonstrate daily banking operations, settlement adjustments, account closure and repayment rescheduling workflows.",
  },
  {
    day: 5,
    title: "Loan Restructuring, Deferrals & Case Allocation",
    category: "Banking Workflows",
    count: 8,
    summary:
      "Understand post-disbursal modifications, repayment deferrals, loan restructuring and delinquent case allocation controls.",
    topics: [
      "Finance Rescheduling - Tenure Change",
      "Post-Disbursal Edit",
      "Repayment Deferral - Constitution Wise",
      "Repayment Deferral - Finance Wise",
      "Repayment Deferral - Portfolio Wise",
      "Delinquent Case Allocation - Hold",
      "Define Allocation Contract",
      "Manual Case Allocation",
    ],
    deliverable:
      "Demonstrate loan restructuring, repayment deferral approvals and delinquent case allocation workflows.",
  },
  {
    day: 6,
    title: "Collections, Delinquency & Legal Recovery",
    category: "Banking Workflows",
    count: 9,
    summary:
      "Explore delinquent account classification, collection queues, customer communication, recovery operations and legal escalation.",
    topics: [
      "Manual Case Reallocation",
      "Collections - Beginning of Day",
      "Delinquent Case Classification - Define Queue",
      "Contact Recording",
      "Legal Collections Workflow",
      "Queue Prioritization",
      "Queue Communication Mapping",
      "Queue Curing",
      "Collector Work Plan",
    ],
    deliverable:
      "Demonstrate an end-to-end collections workflow, from delinquency classification and agent assignment to recovery and legal escalation.",
  },
  {
    day: 7,
    title: "Docker, CI/CD & Cloud Deployment",
    category: "Deployment",
    summary:
      "Learn how to containerize banking applications, automate deployments and configure secure cloud hosting environments.",
    topics: [
      "Docker Containerization",
      "GitHub Actions CI/CD Pipelines",
      "AWS Cloud Deployment",
      "Nginx Reverse Proxy Configuration",
      "SSL & HTTPS Security Configuration",
    ],
    deliverable:
      "Containerize a banking application and demonstrate a CI/CD pipeline for secure cloud deployment.",
  },
  {
    day: 8,
    title: "Production Monitoring, Reliability & Recovery",
    category: "Deployment",
    summary:
      "Understand how production banking applications maintain availability, monitor performance, detect failures and recover critical data.",
    topics: [
      "Zero-Downtime Deployment Strategies",
      "Application Monitoring with Sentry APM",
      "Infrastructure Monitoring with Prometheus",
      "Disaster Recovery & Backup Strategies",
      "Database Point-in-Time Recovery (PITR)",
    ],
    deliverable:
      "Demonstrate a production monitoring strategy, incident response process and disaster recovery plan for a banking application.",
  },
  {
    day: 9,
    title: "Technical Interviews & Career Launch",
    category: "Career Readiness",
    summary:
      "Transform your banking software knowledge and practical project experience into interview-ready technical skills and a professional portfolio.",
    topics: [
      "51 Banking Use Cases - Architecture Viva",
      "One-on-One Technical Mock Interview",
      "ATS-Optimized Resume Preparation",
      "LinkedIn Profile & Recruiter Outreach",
      "Technical Interview Scorecard & Feedback",
    ],
    deliverable:
      "Present your banking software project, explain its architecture, complete a technical mock interview and prepare for job opportunities.",
  },
];


const advantages = [
  {
    icon: "01",
    title: "51 Real-World Banking Use Cases",
    desc: "Gain practical experience across loan origination, finance management, repayments, collections and recovery workflows.",
  },
  {
    icon: "02",
    title: "Hands-On Project Experience",
    desc: "Build, test and demonstrate banking software workflows while understanding real-world business logic and system architecture.",
  },
  {
    icon: "03",
    title: "Cloud & DevOps Skills",
    desc: "Learn Docker, GitHub Actions CI/CD, AWS deployment, Nginx and SSL configuration for production-ready applications.",
  },
  {
    icon: "04",
    title: "Production Monitoring & Recovery",
    desc: "Understand zero-downtime deployment, Sentry APM, Prometheus monitoring, disaster recovery and database backup strategies.",
  },
  {
    icon: "05",
    title: "Resume & Portfolio Building",
    desc: "Strengthen your GitHub portfolio, create an ATS-friendly resume and optimize your LinkedIn profile with demonstrable project experience.",
  },
  {
    icon: "06",
    title: "Mock Interviews & Career Readiness",
    desc: "Practice technical interviews, architecture explanations, recruiter outreach and job application strategies with structured feedback.",
  },
];

const faqs = [
  {
    q: "How is this different from the 90-Day Job Plan?",
    a: "The 9-days program is an intensive banking-tech sprint. The 90-day plan spreads daily discipline, 51 use cases, interviewing, deployments and applications over a longer period. This page presents only the 9-day schedule.",
  },
  {
    q: "What will I learn in Days 1–6?",
    a: "The plan covers 51 banking and lending use cases across Loan Origination (LOS), Financial Management (FMS) and Collections (CMS), with 8–9 use cases scheduled per day.",
  },
  {
    q: "What happens on Days 7 and 8?",
    a: "You focus on Docker, GitHub Actions, AWS hosting, Nginx and SSL, followed by monitoring, application performance and recovery basics.",
  },
  {
    q: "What happens on Day 9?",
    a: "You review your use-case architecture, participate in a technical mock interview, and improve your ATS-focused resume and LinkedIn job outreach.",
  },
  {
    q: "Is participation free?",
    a: "The supplied program page describes the training as #NoCost and #FreeMentoring. Any enrollment conditions should be confirmed with the program team.",
  },
  {
    q: "Does completion guarantee a job?",
    a: "No placement guarantee is stated in the supplied materials. This is practical preparation, mentoring and job application support—not a guaranteed job offer.",
  },
];
const Arrow = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 12h15m-6-6 6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const Check = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="m5 12 4 4L19 6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default function NineDaysJobProgramPlan({
  brandName = "9-Days Job Program",
  headline = "9-Days Job Program",
  subheadline = "Build and explain 51 banking workflows, learn cloud deployment essentials, and prepare your project portfolio for technical interviews.",
  cta = {
    primaryLabel: "Join the 9-Days Program",
    secondaryLabel: "Explore Curriculum",
  },
  headerImageUrl,
  interestApiPath,
  joinProgramPath = "/ninedaysinside",
}: Props) {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(1);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [joining, setJoining] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() =>
    typeof window !== "undefined" ? window.scrollY > 20 : false,
  );
  const [toast, setToast] = useState<{
    type: ToastType;
    title: string;
    message: string;
  } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTo = (id: string) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  const showToast = useCallback(
    (type: ToastType, title: string, message: string) => {
      setToast({ type, title, message });
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 4600);
    },
    [],
  );
  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleJoinProgram = useCallback(async () => {
    if (joining) return;

    const targetPath = joinProgramPath || "/ninedaysinside";
    const userId =
      localStorage.getItem("userId") ||
      localStorage.getItem("userid") ||
      localStorage.getItem("customerId");

    if (!userId || userId === "null" || !userId.trim()) {
      sessionStorage.setItem("redirectPath", targetPath);
      sessionStorage.setItem("autoJoin9DayJobProgram", "true");
      navigate("/whatsapplogin");
      return;
    }

    if (!interestApiPath) {
      if (cta.primaryHref) {
        if (/^https?:\/\//i.test(cta.primaryHref))
          window.location.assign(cta.primaryHref);
        else navigate(cta.primaryHref);
        return;
      }
      navigate(targetPath);
      return;
    }

    setJoining(true);
    try {
      const endpoint = `${String(BASE_URL).replace(/\/$/, "")}/${interestApiPath.replace(/^\/+/, "")}`;
      const response = await customerApi.post(
        `${endpoint}?userId=${encodeURIComponent(userId)}`,
      );
      const data = response.data;
      if (data?.interested === true || data?.success === true) {
        showToast(
          "success",
          "Interest recorded",
          data.message || "Your interest in the 9-days program was recorded.",
        );
        navigate(targetPath);
      } else
        showToast(
          "info",
          "Enrollment update",
          data?.message ||
            "We could not confirm your enrollment. Please contact the program team.",
        );
    } catch (err: any) {
      showToast(
        "error",
        "Could not register",
        err?.response?.data?.message || "Please try again later.",
      );
    } finally {
      setJoining(false);
    }
  }, [
    joining,
    interestApiPath,
    joinProgramPath,
    cta.primaryHref,
    navigate,
    showToast,
  ]);
  useEffect(() => {
    const shouldJoin =
      sessionStorage.getItem("autoJoin9DayJobProgram") === "true";
    const uid =
      localStorage.getItem("userId") ||
      localStorage.getItem("userid") ||
      localStorage.getItem("customerId");
    if (
      shouldJoin &&
      uid &&
      uid !== "null" &&
      interestApiPath &&
      joinProgramPath
    ) {
      sessionStorage.removeItem("autoJoin9DayJobProgram");
      void handleJoinProgram();
    }
  }, [handleJoinProgram, interestApiPath, joinProgramPath]);
  const active = days[selectedDay - 1];
  return (
    <div className="nine-program min-h-screen w-full overflow-x-clip bg-[#f6fbf7] text-slate-900 antialiased">
      <style>{`
      .nine-program{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .nine-program .nine-hero-visual{isolation:isolate;min-width:0}
        .nine-program .nine-hero-picture{border:2px solid #b9e5d0;padding:5px;background:#ffffff;box-shadow:0 18px 46px -35px rgba(0,75,57,.24);transition:transform .35s ease,box-shadow .35s ease}
        @media(hover:hover){.nine-program .nine-hero-picture:hover{transform:translateY(-3px);box-shadow:0 24px 55px -36px rgba(0,75,57,.34)}}
        @media(max-width:1023px){.nine-program .nine-hero-visual{max-width:650px;margin-inline:auto}}
        @media(max-width:640px){.nine-program .nine-hero-picture{border-radius:16px;box-shadow:0 10px 28px -24px rgba(0,75,57,.22)}}
      .nine-program .glass{position:relative;background:linear-gradient(145deg,rgba(255,255,255,.99),rgba(245,250,255,.92));border:1px solid #e0eaf8;box-shadow:0 12px 35px -23px rgba(30,69,140,.28),inset 0 1px rgba(255,255,255,1)}
      .nine-program .glass:before{content:"";position:absolute;pointer-events:none;inset:0 0 auto;height:40%;border-radius:inherit;background:linear-gradient(180deg,rgba(255,255,255,.65),transparent);opacity:.65}
      .nine-program .glass>*{position:relative}
      .nine-program .glass-hover{transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}
      .nine-program .glass-hover:hover{transform:translateY(-3px);border-color:#bfd5fa;box-shadow:0 20px 45px -25px rgba(26,69,145,.33)}
      .nine-program .gloss-btn,.nine-program .mint-btn{position:relative;overflow:hidden;background:linear-gradient(115deg,#008c55 0%,#00b96e 52%,#00ce80 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.42),0 10px 26px -12px rgba(0,128,78,.5);transition:transform .2s ease,box-shadow .2s ease}
      .nine-program .gloss-btn:before,.nine-program .mint-btn:before{content:"";position:absolute;inset:0 0 48%;background:linear-gradient(180deg,rgba(255,255,255,.22),transparent);pointer-events:none}
      .nine-program .gloss-btn:hover,.nine-program .mint-btn:hover{transform:translateY(-2px);box-shadow:0 15px 32px -12px rgba(31,83,184,.65)}
      .nine-program .gloss-btn:active{transform:translateY(0)}
      .nine-program button:focus-visible,.nine-program a:focus-visible{outline:3px solid #60a5fa;outline-offset:3px}
      .nine-program section{scroll-margin-top:84px}
      /* Stable connector: fixed gutter on small screens, centered on desktop. */
      .nine-program .nine-timeline-spine{top:18px;bottom:18px;left:16px;width:4px;background:linear-gradient(180deg,#00c879,#04935a);box-shadow:0 0 0 3px rgba(0,194,113,.09)}
      .nine-program .nine-timeline-node{left:0;top:18px}
      @media(min-width:640px){.nine-program .nine-timeline-spine{left:18px}.nine-program .nine-timeline-node{left:0}}
      @media(min-width:1024px){.nine-program .nine-timeline-spine{left:calc(50% - 2px)}.nine-program .nine-timeline-node{left:50%;transform:translateX(-50%);top:25px}}
      .nine-program .journey-tile{isolation:isolate}
      .nine-program .journey-tile:before{content:"";position:absolute;pointer-events:none;inset:0 0 55%;border-radius:inherit;background:linear-gradient(180deg,rgba(255,255,255,.84),transparent)}
      .nine-program .journey-tile>*{position:relative}
      @media(max-width:640px){.nine-program .journey-tile{min-height:154px}.nine-program .journey-details{border-radius:20px}}
      @keyframes oxy-marquee{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}
      .nine-program .oxy-marquee-track{display:flex;width:max-content;animation:oxy-marquee 100s linear infinite;will-change:transform}
      .nine-program .oxy-marquee-outer:hover .oxy-marquee-track,.nine-program .oxy-marquee-outer:focus-within .oxy-marquee-track{animation-play-state:paused}
      .nine-program .oxy-logo-link{min-width:145px}
      @media(min-width:640px){.nine-program .oxy-logo-link{min-width:190px}}
      @media(prefers-reduced-motion:reduce){.nine-program *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
    `}</style>
      {toast && (
        <div
          role="alert"
          aria-live="polite"
          className={`fixed right-3 top-20 z-[100] w-[min(370px,calc(100vw-24px))] rounded-2xl border bg-white p-4 shadow-2xl ${toast.type === "error" ? "border-rose-200" : toast.type === "success" ? "border-emerald-200" : "border-sky-200"}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <strong className="text-sm">{toast.title}</strong>
              <p className="mt-1 text-sm text-slate-600">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              aria-label="Dismiss message"
              className="rounded-md px-2 text-xl text-slate-500"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "border-b border-slate-200/80 bg-white/95 shadow-md backdrop-blur-xl"
            : "border-b border-[#cde8d8]/80 bg-gradient-to-r from-[#e8f5eb]/95 via-[#f8fffa]/95 to-[#e1f3e8]/95 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() => scrollTo("top")}
            aria-label="Back to top"
            className="shrink-0"
          >
            <img
              src={logo}
              alt={brandName}
              className="h-10 w-auto max-w-[145px] object-contain sm:h-12 sm:max-w-[200px]"
            />
          </button>
          <nav
            aria-label="Page navigation"
            className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex"
          >
            <button
              onClick={() => scrollTo("roadmap")}
              className="hover:text-[#068855]"
            >
              Curriculum
            </button>
            <button
              onClick={() => scrollTo("benefits")}
              className="hover:text-[#068855]"
            >
              Why join
            </button>
            <button
              onClick={() => scrollTo("faq")}
              className="hover:text-[#068855]"
            >
              FAQs
            </button>
          </nav>
          <button
            onClick={handleJoinProgram}
            disabled={joining}
            className="gloss-btn inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold text-white disabled:opacity-60 sm:px-5 sm:text-sm"
          >
            {joining ? "Submitting…" : "Join Program"}
            <Arrow />
          </button>
        </div>
      </header>
      <main id="top">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#e8f5eb] via-[#f8fffa] to-[#e1f3e8] pb-12 pt-12 sm:pb-16 sm:pt-16">
          <div className="pointer-events-none absolute -right-36 -top-40 h-96 w-96 rounded-full bg-sky-100/70 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.12fr_.88fr] lg:px-8">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  No-cost mentoring
                </span>
                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-[#068855]">
                  Practical BFSI learning
                </span>
                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                  Career focused
                </span>
              </div>
              <h1 className="mt-6 max-w-3xl text-[clamp(2.15rem,5vw,4rem)] font-extrabold leading-[1.13] tracking-tight text-[#153c2c]">
                {headline.includes("banking-tech") ? (
                  <>
                    {headline.split("banking-tech")[0]}
                    <span className="bg-gradient-to-r from-[#00a65d] to-[#008d74] bg-clip-text text-transparent">
                      banking-tech
                    </span>
                    {headline.split("banking-tech")[1]}
                  </>
                ) : (
                  headline
                )}
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-lg">
                {subheadline}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleJoinProgram}
                  disabled={joining}
                  className="gloss-btn inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-bold text-white disabled:opacity-60"
                >
                  {joining
                    ? "Submitting…"
                    : cta.primaryLabel || "Join the Program"}
                  <Arrow />
                </button>
                <button
                  onClick={() => scrollTo("roadmap")}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#bfe9d1] bg-white px-6 text-sm font-bold text-[#087b4c] shadow-sm transition hover:border-[#37c987] hover:bg-[#e8f8ee]"
                >
                  {cta.secondaryLabel || "Explore Curriculum"}
                  <Arrow />
                </button>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-600">
                    <Check />
                  </span>
                  Hands-on use cases
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-600">
                    <Check />
                  </span>
                  Mock interview practice
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-600">
                    <Check />
                  </span>
                  Portfolio-focused
                </span>
              </div>
            </div>
            <div className="nine-hero-visual relative mx-auto w-full max-w-[620px] lg:ml-auto">
              <img
                src={headerImageUrl || hero}
                alt="9-Days Job Program: banking use cases, cloud deployment and interview preparation"
                loading="eager"
                decoding="async"
                className="nine-hero-picture block h-auto w-full rounded-[20px] object-contain sm:rounded-[26px]"
              />
            </div>
          </div>
          <div className="mx-auto mt-10 grid max-w-7xl grid-cols-2 gap-3 px-4 sm:gap-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              {
                number: "9",
                name: "Focused days",
                detail: "Structured daily plan",
              },
              {
                number: "51",
                name: "BFSI use cases",
                detail: "LOS • FMS • Collections",
              },
              {
                number: "2",
                name: "Cloud & DevOps days",
                detail: "Docker • CI/CD • AWS",
              },
              {
                number: "1:1",
                name: "Mock interview",
                detail: "Career-readiness review",
              },
            ].map((x) => (
              <div
                key={x.name}
                className="glass glass-hover rounded-2xl p-4 sm:p-5"
              >
                <div className="text-3xl font-extrabold tracking-tight text-[#068855]">
                  {x.number}
                </div>
                <div className="mt-2 text-sm font-bold text-slate-900 sm:text-base">
                  {x.name}
                </div>
                <div className="mt-1 text-xs text-slate-500 sm:text-sm">
                  {x.detail}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section
          id="roadmap"
          className="relative overflow-hidden bg-[#e5f3e9] py-16 sm:py-24"
        >
          <div className="pointer-events-none absolute -top-20 right-[-120px] h-[290px] w-[290px] rounded-full border-[36px] border-[#d0eddc] opacity-70" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex rounded-full border border-[#b5e7c9] bg-white/80 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[.14em] text-[#087f4a]">
                Your 9-day journey
              </span>

              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#153c2c] sm:text-4xl lg:text-5xl">
                One connected path. Nine days of progress.
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#4b695b] sm:text-base">
                Start with lending workflows, connect your skills to real
                deployment practices, and finish with an interview-ready story.
                Select any day to explore the plan.
              </p>
            </div>

            <div className="relative mx-auto mt-11 max-w-7xl">
              {/* Desktop: serpentine green connections; mobile uses vertical line */}

              <svg
                className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
                viewBox="0 0 1080 740"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M 150 110 C 300 110 290 110 540 110 S 850 110 915 110 Q 1030 110 1030 205 Q 1030 340 915 340 H 150 Q 45 340 45 445 Q 45 580 150 580 H 915"
                  stroke="#00bd70"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M 150 110 C 300 110 290 110 540 110 S 850 110 915 110 Q 1030 110 1030 205 Q 1030 340 915 340 H 150 Q 45 340 45 445 Q 45 580 150 580 H 915"
                  stroke="#83eeb7"
                  strokeWidth="1.5"
                  strokeDasharray="7 13"
                />
              </svg>

              <div className="pointer-events-none absolute bottom-5 left-[21px] top-5 w-[3px] rounded-full bg-[#0cc87a] lg:hidden" />

              <div className="relative grid gap-4 pl-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-24 lg:pl-0">
                {days.map((d) => {
                  const selected = selectedDay === d.day;

                  return (
                    <button
                      type="button"
                      key={d.day}
                      onClick={() => setSelectedDay(d.day)}
                      aria-pressed={selected}
                      className={`journey-tile group relative min-h-[165px] rounded-[22px] border p-5 text-left transition-all duration-300 sm:p-6 ${selected ? "border-[#00b969] bg-white shadow-[0_18px_48px_-24px_rgba(0,144,79,.46)] ring-[3px] ring-[#00c678]/15" : "border-[#c8e8d6] bg-white/95 shadow-[0_12px_34px_-23px_rgba(9,99,64,.26)] hover:-translate-y-1 hover:border-[#00ba70] hover:shadow-[0_22px_43px_-24px_rgba(0,132,78,.36)]"}`}
                    >
                      {/* <span
                        className={`absolute -left-[46px] top-6 flex h-[32px] w-[32px] items-center justify-center rounded-full border-[3px] border-white text-[11px] font-extrabold shadow-md lg:-left-3 lg:-top-4 ${selected ? "bg-[#00bd71] text-white" : "bg-[#d4f8e5] text-[#057848]"}`}
                      >
                        {d.day}
                      </span> */}

                      <div className="flex items-start justify-between gap-3">
                        <span className="text-[11px] font-extrabold uppercase tracking-[.13em] text-[#079451]">
                          Day {String(d.day).padStart(2, "0")}
                        </span>

                        {/* <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${d.day <= 6 ? "bg-[#00c378]" : d.day <= 8 ? "bg-[#ff88d6]" : "bg-[#fbbd4b]"}`}
                        /> */}
                      </div>

                      <h3 className="mt-3 text-[16px] font-extrabold leading-snug text-[#153e2b] sm:text-lg">
                        {d.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#527264] sm:text-sm">
                        {d.summary}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#e1f2e9] pt-3">
                        <span className="text-xs font-bold text-[#087a4c]">
                          {d.count ? `${d.count} use cases` : d.category}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        <section
          id="benefits"
          className="border-y border-slate-200/60 bg-white/80 py-14 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-extrabold uppercase tracking-[.18em] text-[#068855]">
              Practical learning
            </span>
            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-[#153c2c] sm:text-4xl">
              Practical skills you can demonstrate.
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Build skills through practical banking workflows, deployment
              fundamentals, interview preparation and clear project
              documentation.
            </p>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {advantages.map((x) => (
                <div
                  key={x.title}
                  className="glass glass-hover rounded-[22px] p-6"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d3efdf] bg-[#e8f8ee] text-sm font-extrabold text-[#068855]">
                    {x.icon}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {x.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {x.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="ecosystem"
          className="overflow-hidden border-y border-[#deebe2] bg-white py-12 sm:py-16"
        >
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <span className="text-xs font-extrabold uppercase tracking-[.16em] text-[#068855]">
              One connected network
            </span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#153c2c] sm:text-4xl">
              Explore the OXY Ecosystem
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Discover the companies and technology platforms across our growing
              ecosystem.
            </p>
          </div>
          <div
            className="oxy-marquee-outer relative mx-auto mt-8 w-full max-w-[1600px] overflow-hidden sm:mt-10"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
            }}
          >
            <div className="oxy-marquee-track">
              {[...companies, ...companies].map((company, index) => (
                <a
                  key={`${company.name}-${index}`}
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${company.name}`}
                  title={company.name}
                  tabIndex={index < companies.length ? 0 : -1}
                  aria-hidden={index >= companies.length ? true : undefined}
                  className="oxy-logo-link mx-4 flex shrink-0 items-center justify-center rounded-2xl px-3 py-3 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:mx-6 md:mx-8 md:px-5"
                >
                  <img
                    src={company.src}
                    alt={index < companies.length ? `${company.name} logo` : ""}
                    loading="lazy"
                    draggable={false}
                    className="h-12 w-auto max-w-[130px] object-contain sm:h-16 sm:max-w-[170px] lg:h-20 lg:max-w-[210px]"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
        <section id="faq" className="bg-[#f5fbf7] py-12 sm:py-20">
          <div className="mx-auto grid w-full max-w-7xl min-w-0 items-start gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-12 lg:px-8">
            <div className="min-w-0 lg:sticky lg:top-28">
              <span className="inline-flex rounded-full border border-[#c5ead4] bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[.12em] text-[#087b4c]">
                Need clarity?
              </span>
              <h2 className="mt-5 max-w-md text-3xl font-extrabold leading-tight tracking-tight text-[#153c2c] sm:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600 sm:text-base">
                Everything you need to know about the 9-days job program, from
                the company curriculum, training and career preparation.
              </p>
              <div className="mx-auto mt-5 w-full max-w-[260px] sm:max-w-[330px] lg:mx-0 lg:max-w-[430px]">
                <img
                  src="https://i.ibb.co/Z6zGxWDZ/Thoughtful-Woman-and-Giant-Question-Mark.png"
                  alt="Woman thinking about questions on the 9-Day Job Program"
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full object-contain"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
            <div className="min-w-0 space-y-3">
              {faqs.map((f, i) => (
                <div
                  key={f.q}
                  className={`faq-item overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${faqOpen === i ? "border-[#80d7a6] shadow-[0_13px_34px_-22px_rgba(0,128,76,.28)]" : "border-[#dfebe4] hover:border-[#b8ddc7]"}`}
                >
                  <h3>
                    <button
                      type="button"
                      id={`faq-question-${i}`}
                      aria-controls={`faq-answer-${i}`}
                      aria-expanded={faqOpen === i}
                      onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                      className="flex min-h-[64px] w-full items-center justify-between gap-3 px-4 py-4 text-left text-[13px] font-bold leading-6 text-[#183d2b] sm:min-h-[72px] sm:gap-4 sm:px-6 sm:text-base"
                    >
                      <span className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                        <span className="mt-[1px] text-xs font-extrabold text-[#0a965c]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {f.q}
                      </span>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xl transition-all duration-200 ${faqOpen === i ? "rotate-45 bg-[#04995d] text-white" : "bg-[#ebf8f0] text-[#087b4c]"}`}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                    hidden={faqOpen !== i}
                  >
                    <p className="border-t border-[#e9f2eb] px-5 pb-6 pt-4 text-sm leading-7 text-slate-600 sm:px-6 sm:text-[15px]">
                      {f.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-[#f0f9f3] py-9">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <img
              src={logo}
              alt={brandName}
              className="h-11 w-auto max-w-[200px] object-contain"
            />
            <p className="mt-2 text-xs text-slate-500">
              Focused BFSI learning, engineering practice and career
              preparation.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
            <button
              onClick={() => scrollTo("roadmap")}
              className="hover:text-[#068855]"
            >
              Curriculum
            </button>
            <button
              onClick={() => scrollTo("benefits")}
              className="hover:text-[#068855]"
            >
              Benefits
            </button>
            <button
              onClick={() => scrollTo("faq")}
              className="hover:text-[#068855]"
            >
              FAQs
            </button>
            <a
              href="https://www.askoxy.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#068855]"
            >
              ASKOXY.AI
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
