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
  "https://i.ibb.co/Tqxw33Mg/9-Day-BFSI-Job-Ready-Journey.png";
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
    title: "Frontend & Mobile Environment Setup",
    category: "Frontend & Mobile",
    summary:
      "Install and configure Node.js, npm, VS Code, React.js and React Native. Prepare the development environment to build and run responsive web applications and Android and iOS mobile apps.",
    topics: [
      "Node.js",
      "npm",
      "VS Code",
      "React.js",
      "React Native",
      "Android Studio",
      "Xcode / Cloud Build",
    ],
    deliverable:
      "A fully configured frontend and mobile development environment capable of running web and mobile applications.",
  },
  {
    day: 2,
    title: "Backend & API Environment Setup",
    category: "Backend & API",
    summary:
      "Install and configure Java JDK, Spring Boot, Maven and an IDE. Set up REST API development tools, run a sample backend service and verify API requests using Postman.",
    topics: [
      "Java JDK",
      "Spring Boot",
      "Maven",
      "IntelliJ / VS Code",
      "Postman",
    ],
    deliverable:
      "A working Spring Boot backend service with verified REST API endpoints and testing tools.",
  },
  {
    day: 3,
    title: "Database & Project Environment Setup",
    category: "Database & Project",
    summary:
      "Install PostgreSQL and configure Git and GitHub. Create a starter project with React, Spring Boot and PostgreSQL, connect the frontend to a working API, test database operations and push the project to GitHub.",
    topics: [
      "PostgreSQL",
      "pgAdmin",
      "Git",
      "GitHub",
      "Database Connection",
    ],
    deliverable:
      "An integrated starter project with React frontend connected to Spring Boot API and PostgreSQL database on GitHub.",
  },
  {
    day: 4,
    title: "Read & Understand 51 BFSI Use Cases",
    category: "51 BFSI Use Cases",
    count: 51,
    summary:
      "Study all 51 real-world banking and lending use cases across Loan Origination (LOS), Finance Management (FMS) and Collections (CMS). Understand each business problem, user role, workflow, required inputs, outputs and expected results.",
    topics: [
      "Loan Origination (LOS)",
      "Finance Management (FMS)",
      "Collections & Recovery (CMS)",
      "Business Rules & Validations",
      "Banking Architecture",
    ],
    deliverable:
      "Comprehensive understanding of all 51 core banking workflows, business rules, inputs, outputs and system roles.",
  },
  {
    day: 5,
    title: "Implement the BFSI Application",
    category: "Full-Stack Development",
    summary:
      "Build selected Loan Origination System workflows in one integrated full-stack application. Develop React screens, Spring Boot REST APIs and PostgreSQL tables. Implement customer onboarding, loan applications, appraisal, risk assessment, recommendations and sanction workflows, and test each module.",
    topics: [
      "Customer Onboarding",
      "Loan Application & Linking",
      "Appraisal & Risk Assessment",
      "Sanction Letter Generation",
      "End-to-End Testing",
    ],
    deliverable:
      "An integrated full-stack Loan Origination System application with React UI, Spring Boot APIs and PostgreSQL database.",
  },
  {
    day: 6,
    title: "Deploy Web & Mobile Applications",
    category: "Web & Mobile Deployment",
    summary:
      "Deploy the React web application, Spring Boot backend and PostgreSQL database. Build and test Android and iOS versions using React Native, verify API connectivity and test the complete loan application workflow.",
    topics: [
      "Web Cloud Deployment",
      "Spring Boot & PostgreSQL Hosting",
      "Android APK Build",
      "iOS App Build",
      "Full-Stack API Connectivity",
    ],
    deliverable:
      "Live deployed web application with operational Android and iOS mobile builds connected to live backend APIs.",
  },
  {
    day: 7,
    title: "Publish Daily Progress on LinkedIn",
    category: "LinkedIn & #83GLAI",
    summary:
      "Share daily development updates, completed BFSI modules, screenshots, technical learnings, GitHub repositories and live application links. Connect with and tag relevant #83GLAI lending software companies and professionals.",
    topics: [
      "Daily Build Posts",
      "#83GLAI Network",
      "GitHub & Live Demo Links",
      "BFSI Professional Networking",
      "Company Tagging Strategy",
    ],
    deliverable:
      "A documented LinkedIn public development trail showcasing completed BFSI milestones and live deployment links.",
  },
  {
    day: 8,
    title: "Document Technical Challenges & Solutions",
    category: "Problem Solving & RCA",
    summary:
      "Record issues encountered during frontend, backend, database, API integration, testing and deployment. Identify each problem's root cause, explain how you resolved it and document the lessons learned.",
    topics: [
      "Error Logging & Tracking",
      "Root Cause Analysis (RCA)",
      "Backend & DB Debugging",
      "CORS & API Resolution",
      "Technical Post-Mortem Docs",
    ],
    deliverable:
      "A comprehensive technical troubleshooting log documenting issues faced, root causes, fixes and architectural insights.",
  },
  {
    day: 9,
    title: "Build Your Portfolio & Apply for Jobs",
    category: "Portfolio & Job Readiness",
    summary:
      "Prepare an ATS-friendly, project-based resume. Showcase your GitHub repository, deployed application and LinkedIn updates. Research 83 lending software companies within the #83GLAI initiative, apply for relevant jobs and prepare to demonstrate your project in technical interviews.",
    topics: [
      "ATS-Optimized BFSI Resume",
      "#83GLAI Company Research",
      "GitHub Repository Showcase",
      "Live Demo Project Presentation",
      "Technical Interview Practice",
    ],
    deliverable:
      "A job-ready technical portfolio, ATS-optimized resume, targeted BFSI company list, and interview-ready project presentation.",
  },
];


const advantages = [
  {
    icon: "01",
    title: "51 Real-World BFSI Use Cases",
    desc: "Understand banking and lending workflows across Loan Origination (LOS), Finance Management (FMS) and Collections (CMS).",
  },
  {
    icon: "02",
    title: "Build a Real BFSI Application",
    desc: "Implement selected loan origination use cases in one integrated project using React, Spring Boot APIs and PostgreSQL.",
  },
  {
    icon: "03",
    title: "Web & Mobile Deployment",
    desc: "Deploy your application on the web, build Android and iOS versions, and test full-stack connectivity.",
  },
  {
    icon: "04",
    title: "Learn by Solving Real Problems",
    desc: "Document technical challenges, identify root causes, fix issues and explain your solutions across frontend, backend, database and deployment.",
  },
  {
    icon: "05",
    title: "GitHub & LinkedIn Portfolio",
    desc: "Publish daily progress, showcase your GitHub repository and live project, and connect with 83 lending software companies and professionals across the #83GLAI network.",
  },
  {
    icon: "06",
    title: "Job Applications & Career Readiness",
    desc: "Prepare a project-based resume, research #83GLAI lending technology companies, apply for relevant jobs and demonstrate your skills in the final practical examination.",
  },
];

const faqs = [
  {
    q: "What is #83GLAI and why does it matter to me?",
    a: "#83GLAI is a global initiative founded by Radhakrishna Thatavarti, Founder of OXYLOANS (an RBI-approved P2P NBFC), with a vision to bring 83 lending software companies onto one trusted platform. Through this 9-Day Job Program, you get exposure to real-world business challenges, AI applications and practical use cases inspired by the evolving BFSI ecosystem, helping you connect and apply directly to top lending tech organizations.",
  },
  {
    q: "What will I learn in the 9-Days BFSI Job Program?",
    a: "You will study 51 real-world banking and lending use cases covering Loan Origination (LOS), Finance Management (FMS), and Collections (CMS). You will also gain practical experience in full-stack development, deployment, troubleshooting, and career preparation.",
  },
  {
    q: "Will I build all 51 BFSI use cases?",
    a: "You will understand all 51 use cases, but implement selected Loan Origination System (LOS) use cases in one integrated application. The goal is to build a working product rather than 51 separate applications.",
  },
  {
    q: "Which technologies will I use?",
    a: "You will use React to build screens and forms, Spring Boot for backend APIs and business logic, and PostgreSQL to store customer and loan data. You will also work with GitHub, deployment tools, and a mobile development approach such as React Native or Capacitor.",
  },
  {
    q: "What will I build during Days 1–8?",
    a: "You will progressively build one integrated Loan Origination System, including customer creation, loan product linking, co-applicants and guarantors, loan appraisal, risk analysis, loan assessment, recommendations, sanction letters, and customer responses.",
  },
  {
    q: "Will I deploy my application on web and mobile?",
    a: "The program includes deploying the web application and building and testing Android and iOS versions. You will work on connectivity between the frontend, Spring Boot APIs, and PostgreSQL database. Mobile development requires a suitable framework and build environment.",
  },
  {
    q: "What should I complete before Day 1?",
    a: "Prepare your Java, Node.js, React, Spring Boot, PostgreSQL, IDE, GitHub, and API testing environments. Set up deployment accounts, choose a mobile development approach, and create a starter project with a working API connected to your frontend and database.",
  },
  {
    q: "How will this program help me prepare for BFSI technology jobs?",
    a: "You will build a project-based portfolio, publish your GitHub and live application links, share development progress on LinkedIn, document problems and solutions, research #83GLAI BFSI product companies, and prepare for relevant job applications.",
  },
  {
    q: "Is this program free, and does it guarantee a job?",
    a: "The program landing page describes no-cost mentoring. The supplied materials do not establish a job-placement guarantee. The program focuses on practical skills, a demonstrable project, technical assessment, and career readiness.",
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
export default function NineDaysJobProgramPlan({
  brandName = "9-Days Job Program",
  headline = "Build Real BFSI Products. Deploy Them. Get Job-Ready.",
  subheadline = "In 9 focused days, understand 51 BFSI use cases, build one integrated full-stack Loan Origination System using selected workflows, deploy it for web and mobile, and create a portfolio for BFSI technology roles.",
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
        .nine-program .nine-hero-visual{isolation:isolate;min-width:0;width:100%}
        .nine-program .nine-hero-picture{border:2px solid #b9e5d0;padding:6px;background:#ffffff;box-shadow:0 20px 48px -30px rgba(0,75,57,.26);transition:transform .35s ease,box-shadow .35s ease}
        @media(hover:hover){.nine-program .nine-hero-picture:hover{transform:translateY(-3px);box-shadow:0 26px 58px -32px rgba(0,75,57,.36)}}
        @media(max-width:1023px){.nine-program .nine-hero-visual{max-width:700px;margin-inline:auto}}
        @media(max-width:640px){.nine-program .nine-hero-picture{border-radius:18px;padding:4px;box-shadow:0 10px 28px -24px rgba(0,75,57,.22)}}
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
      .nine-program .oxy-logo-link{min-width:160px}
      @media(min-width:640px){.nine-program .oxy-logo-link{min-width:210px}}
      @media(min-width:1024px){.nine-program .oxy-logo-link{min-width:240px}}
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
            className="hidden items-center gap-5 text-sm font-semibold text-slate-600 md:flex lg:gap-6"
          >
            <button
              type="button"
              onClick={() => scrollTo("roadmap")}
              className="whitespace-nowrap hover:text-[#068855]"
            >
              Curriculum
            </button>
            {/* <button
              onClick={() => scrollTo("83glai")}
              className="hover:text-[#068855]"
            >
              #83GLAI
            </button> */}
            <button
              type="button"
              onClick={() => scrollTo("benefits")}
              className="whitespace-nowrap hover:text-[#068855]"
            >
              Why join
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                scrollTo("ecosystem");
              }}
              className="whitespace-nowrap border-0 bg-transparent focus:outline-none hover:text-[#068855]"
            >
              Our Platforms
            </button>
            <button
              type="button"
              onClick={() => scrollTo("faq")}
              className="whitespace-nowrap hover:text-[#068855]"
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
        <section className="relative overflow-hidden bg-gradient-to-br from-[#e8f5eb] via-[#f8fffa] to-[#e1f3e8] py-8 sm:py-10 lg:py-12">
          <div className="pointer-events-none absolute -right-36 -top-40 h-96 w-96 rounded-full bg-sky-100/70 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.02fr_1fr] lg:gap-10 lg:px-8">
            <div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <span className="rounded-full border border-emerald-300 bg-emerald-100/90 px-3 py-1 text-xs font-bold text-[#068855]">
                  #83GLAI Initiative
                </span>
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
              <h1 className="mt-4 max-w-3xl text-[clamp(1.95rem,4.5vw,3.4rem)] font-extrabold leading-[1.15] tracking-tight text-[#153c2c] sm:mt-5">
                {headline.includes("Deploy Them.") ? (
                  <>
                    Build Real BFSI Products.{" "}
                    <span className="bg-gradient-to-r from-[#00a65d] to-[#008d74] bg-clip-text text-transparent">
                      Deploy Them.
                    </span>{" "}
                    Get Job-Ready.
                  </>
                ) : headline.includes("banking-tech") ? (
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
              <p className="mt-3.5 max-w-xl text-[15px] leading-7 text-slate-600 sm:mt-4 sm:text-base lg:text-[17px]">
                {subheadline}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row">
                <button
                  onClick={handleJoinProgram}
                  disabled={joining}
                  className="gloss-btn inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold text-white disabled:opacity-60 sm:min-h-12 sm:px-6"
                >
                  {joining
                    ? "Submitting…"
                    : cta.primaryLabel || "Join the Program"}
                  <Arrow />
                </button>
                <button
                  onClick={() => scrollTo("roadmap")}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[#bfe9d1] bg-white px-5 text-sm font-bold text-[#087b4c] shadow-sm transition hover:border-[#37c987] hover:bg-[#e8f8ee] sm:min-h-12 sm:px-6"
                >
                  {cta.secondaryLabel || "Explore Curriculum"}
                  <Arrow />
                </button>
              </div>
            </div>
            <div className="nine-hero-visual relative mx-auto w-full max-w-[680px] lg:max-w-none lg:ml-auto">
              <img
                src={headerImageUrl || hero}
                alt="9-Days Job Program: BFSI use cases, full-stack product development, deployment and interview preparation"
                loading="eager"
                decoding="async"
                className="nine-hero-picture block h-auto w-full rounded-[22px] object-contain sm:rounded-[28px]"
              />
            </div>
          </div>
          <div className="mx-auto mt-7 grid max-w-7xl grid-cols-2 gap-2.5 px-4 sm:mt-9 sm:gap-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              {
                number: "01",
                name: "BFSI Learning",
                detail: "Understand all 51 BFSI use cases.",
              },
              {
                number: "02",
                name: "Practical Development",
                detail:
                  "Implement selected use cases in one integrated application.",
              },
              {
                number: "03",
                name: "Full-Stack Deployment",
                detail:
                  "Deploy the web app and build Android and iOS versions.",
              },
              {
                number: "04",
                name: "Career Readiness",
                detail:
                  "GitHub, LinkedIn, #83GLAI network & job applications.",
              },
            ].map((x) => (
              <div
                key={x.name}
                className="glass glass-hover flex flex-col justify-between rounded-2xl p-3.5 sm:p-4.5"
              >
                <div>
                  <div className="text-2xl font-extrabold tracking-tight text-[#068855] sm:text-3xl">
                    {x.number}
                  </div>
                  <div className="mt-1.5 text-sm font-bold text-slate-900 sm:text-base">
                    {x.name}
                  </div>
                </div>
                <div className="mt-1 text-xs text-slate-500 sm:text-[13px]">
                  {x.detail}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section
          id="roadmap"
          className="relative overflow-hidden bg-[#e5f3e9] py-10 sm:py-14 lg:py-16"
        >
          <div className="pointer-events-none absolute -top-20 right-[-120px] h-[290px] w-[290px] rounded-full border-[36px] border-[#d0eddc] opacity-70" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex rounded-full border border-[#b5e7c9] bg-white/80 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[.14em] text-[#087f4a] sm:px-4 sm:py-1.5">
                YOUR 9-STEP JOURNEY
              </span>

              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#153c2c] sm:mt-4 sm:text-3xl lg:text-4xl">
                Set Up. Understand. Build. Deploy. Get Job-Ready.
              </h2>

              <p className="mx-auto mt-2.5 max-w-2xl text-xs leading-6 text-[#4b695b] sm:mt-3 sm:text-sm sm:leading-7">
                Start by setting up your frontend, backend, mobile and database environments. Explore 51 real-world BFSI use cases, build and deploy an integrated Loan Origination System, showcase your project, and prepare for BFSI technology careers.
              </p>
            </div>

            <div className="relative mx-auto mt-7 max-w-7xl sm:mt-9">
              {/* Desktop: connected path flowing 1->2->3, then down to 4->5->6, then down to 7->8->9; mobile uses vertical line */}

              <svg
                className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
                viewBox="0 0 1080 740"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M 175 98 L 905 98 Q 1060 98 1060 165 Q 1060 233 995 233 L 85 233 Q 20 233 20 300 Q 20 370 175 370 L 905 370 Q 1060 370 1060 437 Q 1060 504 995 504 L 85 504 Q 20 504 20 572 Q 20 640 175 640 L 905 640"
                  stroke="#00bd70"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M 175 98 L 905 98 Q 1060 98 1060 165 Q 1060 233 995 233 L 85 233 Q 20 233 20 300 Q 20 370 175 370 L 905 370 Q 1060 370 1060 437 Q 1060 504 995 504 L 85 504 Q 20 504 20 572 Q 20 640 175 640 L 905 640"
                  stroke="#83eeb7"
                  strokeWidth="1.5"
                  strokeDasharray="7 13"
                />

                {/* Directional arrow indicators */}
                {/* Row 1: Day 1 -> Day 2 -> Day 3 */}
                <polygon points="353,92 363,98 353,104" fill="#00bd70" />
                <polygon points="718,92 728,98 718,104" fill="#00bd70" />

                {/* Transition Row 1 to Row 2: sweep left across gap, then enter Day 4 */}
                <polygon points="545,227 535,233 545,239" fill="#00bd70" />
                <polygon points="72,364 82,370 72,376" fill="#00bd70" />

                {/* Row 2: Day 4 -> Day 5 -> Day 6 */}
                <polygon points="353,364 363,370 353,376" fill="#00bd70" />
                <polygon points="718,364 728,370 718,376" fill="#00bd70" />

                {/* Transition Row 2 to Row 3: sweep left across gap, then enter Day 7 */}
                <polygon points="545,498 535,504 545,510" fill="#00bd70" />
                <polygon points="72,634 82,640 72,646" fill="#00bd70" />

                {/* Row 3: Day 7 -> Day 8 -> Day 9 */}
                <polygon points="353,634 363,640 353,646" fill="#00bd70" />
                <polygon points="718,634 728,640 718,646" fill="#00bd70" />
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
                      className={`journey-tile group relative min-h-[155px] rounded-[20px] border p-4 text-left transition-all duration-300 sm:min-h-[165px] sm:rounded-[22px] sm:p-5 ${selected ? "border-[#00b969] bg-white shadow-[0_18px_48px_-24px_rgba(0,144,79,.46)] ring-[3px] ring-[#00c678]/15" : "border-[#c8e8d6] bg-white/95 shadow-[0_12px_34px_-23px_rgba(9,99,64,.26)] hover:-translate-y-1 hover:border-[#00ba70] hover:shadow-[0_22px_43px_-24px_rgba(0,132,78,.36)]"}`}
                    >
                      {/* <span
                        className={`absolute -left-[46px] top-6 flex h-[32px] w-[32px] items-center justify-center rounded-full border-[3px] border-white text-[11px] font-extrabold shadow-md lg:-left-3 lg:-top-4 ${selected ? "bg-[#00bd71] text-white" : "bg-[#d4f8e5] text-[#057848]"}`}
                      >
                        {d.day}
                      </span> */}

                      <div className="flex items-start justify-between gap-3">
                        <span className="text-[11px] font-extrabold uppercase tracking-[.13em] text-[#079451]">
                          Step {String(d.day).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="mt-3 text-[16px] font-extrabold leading-snug text-[#153e2b] sm:text-lg">
                        {d.title}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#527264] sm:text-sm">
                        {d.summary}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#e1f2e9] pt-3">
                        <span className="text-xs font-bold text-[#087a4c]">
                          {d.count ? `${d.count} use cases` : d.category}
                        </span>
                        {d.topics && d.topics.length > 0 && (
                          <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                            {d.topics.slice(0, 2).join(", ")}
                          </span>
                        )}
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
          className="border-y border-slate-200/60 bg-white/80 py-9 sm:py-12 lg:py-14"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-extrabold uppercase tracking-[.18em] text-[#068855]">
              Why join the program
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#153c2c] sm:mt-2.5 sm:text-3xl lg:text-4xl">
              Practical skills you can demonstrate.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-2.5 sm:text-base sm:leading-7">
              Build skills through practical BFSI workflows, web &amp; mobile
              deployment, real-world problem solving, and career preparation.
            </p>
            <div className="mt-6 grid gap-3.5 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {advantages.map((x) => (
                <div
                  key={x.title}
                  className="glass glass-hover rounded-[20px] p-4.5 sm:p-5"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#d3efdf] bg-[#e8f8ee] text-xs font-extrabold text-[#068855] sm:h-11 sm:w-11 sm:text-sm">
                    {x.icon}
                  </span>
                  <h3 className="mt-3.5 text-base font-bold text-slate-900 sm:text-lg">
                    {x.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                    {x.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="ecosystem"
          className="overflow-hidden bg-white py-8 sm:py-10 lg:py-12"
        >
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <span className="text-xs font-extrabold uppercase tracking-[.16em] text-[#068855]">
              One connected network
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#153c2c] sm:mt-2.5 sm:text-3xl lg:text-4xl">
              Explore the OXY Ecosystem
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs leading-6 text-slate-600 sm:mt-2.5 sm:text-sm sm:leading-7">
              Discover the companies and technology platforms across our growing
              ecosystem.
            </p>
          </div>
          <div
            className="oxy-marquee-outer relative mx-auto mt-6 w-full max-w-[1600px] overflow-hidden sm:mt-8"
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
                  className="oxy-logo-link mx-3 flex shrink-0 items-center justify-center rounded-2xl px-3 py-2.5 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:mx-5 sm:px-4 md:mx-7 md:px-5"
                >
                  <img
                    src={company.src}
                    alt={index < companies.length ? `${company.name} logo` : ""}
                    loading="lazy"
                    draggable={false}
                    className="h-14 w-auto max-w-[155px] object-contain sm:h-20 sm:max-w-[210px] lg:h-24 lg:max-w-[250px]"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
        <section id="faq" className="bg-[#f5fbf7] py-9 sm:py-12 lg:py-14">
          <div className="mx-auto grid w-full max-w-7xl min-w-0 items-start gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-10 lg:px-8">
            <div className="min-w-0 lg:sticky lg:top-28">
              <span className="inline-flex rounded-full border border-[#c5ead4] bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-[.12em] text-[#087b4c] sm:px-4 sm:py-1.5">
                Need clarity?
              </span>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-[#153c2c] sm:mt-4 sm:text-3xl lg:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-2.5 max-w-sm text-xs leading-6 text-slate-600 sm:mt-3 sm:text-sm sm:leading-7">
                Everything you need to know about the 9-days job program, from
                the company curriculum, training and career preparation.
              </p>
              <div className="mx-auto mt-4 w-full max-w-[220px] sm:max-w-[280px] lg:mx-0 lg:max-w-[360px]">
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
            <div className="min-w-0 space-y-2.5 sm:space-y-3">
              {faqs.map((f, i) => (
                <div
                  key={f.q}
                  className={`faq-item overflow-hidden rounded-xl border bg-white transition-all duration-200 sm:rounded-2xl ${faqOpen === i ? "border-[#80d7a6] shadow-[0_13px_34px_-22px_rgba(0,128,76,.28)]" : "border-[#dfebe4] hover:border-[#b8ddc7]"}`}
                >
                  <h3>
                    <button
                      type="button"
                      id={`faq-question-${i}`}
                      aria-controls={`faq-answer-${i}`}
                      aria-expanded={faqOpen === i}
                      onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                      className="flex min-h-[54px] w-full items-center justify-between gap-3 px-3.5 py-3 text-left text-[13px] font-bold leading-5 text-[#183d2b] sm:min-h-[62px] sm:gap-4 sm:px-5 sm:py-3.5 sm:text-base sm:leading-6"
                    >
                      <span className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                        <span className="mt-[1px] text-xs font-extrabold text-[#0a965c]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {f.q}
                      </span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg transition-all duration-200 sm:h-9 sm:w-9 sm:rounded-xl sm:text-xl ${faqOpen === i ? "rotate-45 bg-[#04995d] text-white" : "bg-[#ebf8f0] text-[#087b4c]"}`}
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
                    <p className="border-t border-[#e9f2eb] px-4 pb-4 pt-3 text-xs leading-6 text-slate-600 sm:px-5 sm:pb-5 sm:pt-3.5 sm:text-sm sm:leading-7">
                      {f.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-[#f0f9f3] py-6 sm:py-7">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <img
              src={logo}
              alt={brandName}
              className="h-10 w-auto max-w-[180px] object-contain sm:h-11 sm:max-w-[200px]"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Focused BFSI learning, engineering practice and career
              preparation.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600 sm:text-sm">
            <button
              onClick={() => scrollTo("roadmap")}
              className="hover:text-[#068855]"
            >
              Curriculum
            </button>
            
            <button
              type="button"
              onClick={() => scrollTo("benefits")}
              className="hover:text-[#068855]"
            >
              Why join
            </button>
            <button
              type="button"
              onClick={() => scrollTo("ecosystem")}
              className="hover:text-[#068855]"
            >
              Our Platforms
            </button>
            <button
              type="button"
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
