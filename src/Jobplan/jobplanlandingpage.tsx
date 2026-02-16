import React, { useMemo, useState } from "react";
import DayPlan from "../assets/img/90dayplanflow.png";
import { useNavigate } from "react-router-dom";
import Logo1 from "../assets/img/oxy1.png";
import Logo2 from "../assets/img/oxybrick.png";
import Logo from "../assets/img/askoxylogonew.png"
type CTAConfig = {
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

type Props = {
  brandName?: string;
  headline?: string;
  subheadline?: string;
  cta?: CTAConfig;
  headerImageUrl?: string;
};

/* ---------------- Brand Colors ---------------- */
const C1 = "#364d69";
const C2 = "#90b7d7";
const C3 = "#173b63";

const grad = `linear-gradient(135deg, ${C1}, ${C2}, ${C3})`;
const gradSoft = `linear-gradient(135deg, ${C2}2B, ${C1}12, ${C3}10)`;

/* ---------------- Icons ---------------- */
const ArrowRight = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M5 12h12m0 0l-5-5m5 5l-5 5"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconSpark = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M12 2l1.2 4.2L17.5 8l-4.3 1.7L12 14l-1.2-4.3L6.5 8l4.3-1.8L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M5 13l.8 2.7L9 17l-3.2 1.3L5 21l-.8-2.7L1 17l3.2-1.3L5 13Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      opacity="0.9"
    />
  </svg>
);

const IconCalendar = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M7 3v3M17 3v3M4 9h16M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 13h2M12 13h2M8 17h2M12 17h2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconLinkedIn = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M4 9.5V20M4 6.5v-.2M8.5 9.5V20M8.5 13c0-2 1.2-3.5 3.2-3.5 2.3 0 3.3 1.6 3.3 3.8V20M20 20V13.6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 6.5a1.5 1.5 0 1 0 0-.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconPuzzle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M8 4h3a2 2 0 1 1 4 0h3v6h-2a2 2 0 1 0 0 4h2v6h-6v-2a2 2 0 1 0-4 0v2H4v-6h2a2 2 0 1 0 0-4H4V4h4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconCloud = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 9.4 3.5 3.5 0 0 0 7 18Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M12 11v6m0 0l-2-2m2 2l2-2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.95"
    />
  </svg>
);

const IconBriefcase = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4 10h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M4 10V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

/* What-you-get icons */
const IconClipboard = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M9 4h6m-6 0a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m-6 0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M9 10h6M9 14h6M9 18h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconUsers = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M16 11a4 4 0 1 0-8 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4 20a6 6 0 0 1 16 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M20 11.5a3 3 0 1 0-3-3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.9"
    />
  </svg>
);

const IconCase = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4 10h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M4 10V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M9 13h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.95"
    />
  </svg>
);

type IconProps = { className?: string; style?: React.CSSProperties };

const IconChat = ({ className = "", style }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={style}
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M20 14a4 4 0 0 1-4 4H9l-5 3V6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M8 8h8M8 12h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconMenu = ({ className = "", style }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={style}
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M5 7h14M5 12h14M5 17h14"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

const IconX = ({ className = "", style }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={style}
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6 6l12 12M18 6 6 18"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

const IconChevron = ({ className = "", style }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    style={style}
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M8 10l4 4 4-4"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconMic = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M19 11a7 7 0 0 1-14 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 18v3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconRocket = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M14 4c3.5 0 6 2.5 6 6-1.2 4-5.5 8.3-9.5 9.5-3.5 1-5.5-1-4.5-4.5C7.2 9.5 10 6 14 4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M9 15l-2 2m7-7 2-2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M13.5 9.5h.01"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

/* ---------- UI Helpers ---------- */
const GradientIconBadge = ({
  children,
  size = 48,
}: {
  children: React.ReactNode;
  size?: number;
}) => (
  <div
    className="grid place-items-center rounded-2xl text-white shadow-lg ring-1 ring-white/20"
    style={{
      width: size,
      height: size,
      background: grad,
      boxShadow: "0 12px 26px rgba(23,59,99,0.18)",
    }}
  >
    {children}
  </div>
);

const GradientPill = ({ text }: { text: string }) => (
  <span
    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border"
    style={{
      background: gradSoft,
      borderColor: `${C2}66`,
      color: C3,
    }}
  >
    {text}
  </span>
);

const SoftCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-3xl backdrop-blur-sm drop-shadow-lg ${className}`}
    style={{
      borderColor: "rgba(148, 163, 184, 0.45)",
    }}
  >
    {children}
  </div>
);

const SectionShell = ({
  id,
  title,
  subtitle,
  children,
  rightSlot,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
}) => (
  <section id={id} className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl">
            {subtitle}
          </p>
        ) : null}
      </div>
      {rightSlot ? <div className="sm:pb-1">{rightSlot}</div> : null}
    </div>
    <div className="mt-10">{children}</div>
  </section>
);

const DividerGlow = () => (
  <div className="mx-auto max-w-7xl px-4 sm:px-6">
    <div
      className="h-px w-full"
      style={{
        background: `linear-gradient(90deg, transparent, ${C2}55, transparent)`,
      }}
    />
  </div>
);

const FAQItem = ({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) => (
  <button type="button" onClick={onToggle} className="w-full text-left">
    <div className="flex items-start justify-between gap-4 rounded-2xl border bg-white p-5 transition hover:shadow-md">
      <div>
        <p className="text-sm sm:text-base font-semibold text-slate-900">{q}</p>
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{a}</p>
          </div>
        </div>
      </div>
      <span
        className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl border"
        style={{ borderColor: `${C2}55`, background: gradSoft }}
      >
        <IconChevron
          className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`}
          style={{ color: C3 }}
        />
      </span>
    </div>
  </button>
);

/* ---------------- Page ---------------- */
const steps = [
  {
    phase: "Phase 1",
    title: "Daily Discipline (Day 1–90)",
    icon: IconCalendar,
    desc: "Daily tasks that build consistency.",
  },
  {
    phase: "Phase 2",
    title: "LinkedIn + Company Engagement",
    icon: IconLinkedIn,
    desc: "Profile + connections + company touchpoints daily.",
  },
  {
    phase: "Phase 3",
    title: "51 Real-World Use Cases",
    icon: IconPuzzle,
    desc: "One practical use case per day (51 days).",
  },
  {
    phase: "Phase 4",
    title: "Mini Interview Checks",
    icon: IconChat,
    desc: "Short checks after each use case to build confidence.",
  },
  {
    phase: "Phase 5",
    title: "Deployment + Integration",
    icon: IconCloud,
    desc: "Deploy and learn integration like real projects.",
  },
  {
    phase: "Phase 6",
    title: "Jobs + Resume Updates",
    icon: IconBriefcase,
    desc: "Apply daily and update resume from real work.",
  },
];

export default function JobTraining90DaysPage({
  brandName = "90-Day Job Plan",
  headline = "Become job-ready in 90 days — one use case per day, one step at a time.",
  subheadline = "Daily discipline • 51 real-world use cases • mini interviews • deployment + integration • job applications • job-ready resume.",
  cta = {
    primaryLabel: "Join the Program",
    secondaryLabel: "Talk to Our Team",
  },
  headerImageUrl = "https://i.ibb.co/rKDmJkGr/90-dayl.png",
}: Props) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  // ✅ NEW: Join Program URL routing (logged-in vs not logged-in)
  const JOIN_PUBLIC_URL = "/services/4326/90-day-job-plan";
  const JOIN_LOGGEDIN_URL = "/main/services/4326/90-day-job-plan";

  const isLoggedIn = useMemo(() => {
    try {
      const ls = window.localStorage;
      const keysToCheck = [
        "token",
        "accessToken",
        "jwt",
        "authToken",
        "user",
        "userId",
        "userid",
        "customerId",
      ];
      return keysToCheck.some((k) => {
        const v = ls.getItem(k);
        return v !== null && String(v).trim() !== "" && String(v) !== "null";
      });
    } catch {
      return false;
    }
  }, []);

  const joinProgramHref = "/ninetydayplan";

  const whatYouGet = useMemo(
    () => [
      {
        title: "Daily Task Plan (Day 1–90)",
        desc: "A clear daily plan that builds consistency and progress.",
        icon: IconClipboard,
      },
      {
        title: "Daily LinkedIn & Company Engagement",
        desc: "Connections, company discovery, HR engagement, visibility.",
        icon: IconUsers,
      },
      {
        title: "51 Real-World Use Cases",
        desc: "Practical, job-focused tasks that build real confidence.",
        icon: IconCase,
      },
      {
        title: "Mini Interview After Every Use Case",
        desc: "Explain what you built — the most important interview skill.",
        icon: IconMic,
      },
      {
        title: "Deployment & Integration Training",
        desc: "Deploy basics + integration concepts + real workflow mindset.",
        icon: IconRocket,
      },
      {
        title: "Job Application Support",
        desc: "A daily job applying system with tracking and guidance.",
        icon: IconBriefcase,
      },
    ],
    []
  );

  const whoItsFor = useMemo(
    () => [
      "Students and freshers",
      "Job seekers restarting careers",
      "Learners who need a day-by-day plan",
      "Anyone who wants proof of skill (not certificates only)",
    ],
    []
  );

  const outcomes = useMemo(
    () => [
      "51 use cases completed with proof",
      "Interview-ready explanations practiced repeatedly",
      "Deployment + integration basics learned",
      "Strong LinkedIn + company engagement habits",
      "Resume built from real work (not fake projects)",
    ],
    []
  );

  const stats = useMemo(
    () => [
      { k: "90", v: "Days of discipline" },
      { k: "51", v: "Real-world use cases" },
      { k: "1", v: "Mini interview per use case" },
      { k: "Daily", v: "LinkedIn + company engagement" },
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        name: "Learner",
        role: "Job Seeker",
        quote:
          "The daily structure kept me consistent. The mini interviews helped me explain my work clearly.",
      },
      {
        name: "Learner",
        role: "Fresher",
        quote:
          "The use cases made my resume real. I finally had projects I could confidently talk about.",
      },
      {
        name: "Learner",
        role: "Career Restart",
        quote:
          "The deployment + integration phase gave me practical confidence beyond just coding tutorials.",
      },
    ],
    []
  );

  const faqs = useMemo(
    () => [
      {
        q: "How does the day-by-day plan work?",
        a: "You follow a daily task plan from Day 1–90. The goal is consistency: small daily actions that compound into real job-ready skill.",
      },
      {
        q: "What happens after each use case?",
        a: "After every use case, there is a minimal interview check to confirm understanding and improve your ability to explain what you built.",
      },
      {
        q: "What happens after the 51 use cases?",
        a: "After the use case phase, you move into deployment + integration training and then job applications + resume updates aligned to your real work.",
      },
      {
        q: "Is this only for freshers?",
        a: "No. It works for freshers, job seekers, and career restarters—anyone who needs a clear daily system and real proof of skill.",
      },
    ],
    []
  );

  const PrimaryBtn = ({
    href,
    label,
    big = false,
  }: {
    href?: string;
    label?: string;
    big?: boolean;
  }) => (
    <a
      href={href || joinProgramHref}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold text-white shadow-lg transition hover:opacity-95",
        big ? "px-7 py-4 text-base" : "px-5 py-2.5 text-sm",
      ].join(" ")}
      style={{
        background: grad,
        boxShadow: "0 14px 30px rgba(23,59,99,0.24)",
      }}
    >
      {label || "Join"}
      <ArrowRight className={big ? "h-5 w-5" : "h-4 w-4"} />
    </a>
  );

  const SecondaryBtn = ({
    href,
    label,
    big = false,
  }: {
    href?: string;
    label?: string;
    big?: boolean;
  }) => (
    <a
      href={href}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition hover:shadow-md",
        big ? "px-7 py-4 text-base" : "px-5 py-2.5 text-sm",
      ].join(" ")}
      style={{
        background: "white",
        color: C3,
        border: `1px solid ${C2}66`,
      }}
    >
      {label || "Talk"}
      <ArrowRight className={big ? "h-5 w-5" : "h-4 w-4"} />
    </a>
  );
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-70 blur-3xl"
        style={{ background: gradSoft }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-md">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
    <button onClick={() => navigate("/")} className="flex items-center gap-3">
      {/* ✅ ASKOXY Logo (responsive) */}
      <img
        src={Logo} // import Logo from "../assets/img/askoxylogonew.png";
        alt="ASKOXY.AI"
        className="
          h-10 w-auto
          sm:h-11
          md:h-12
          object-contain
          rounded-md
        "
      />

      {/* ✅ Keep your gradient icon next to logo (optional) */}
      <GradientIconBadge size={40} >
        <IconSpark className="h-5 w-5" />
      </GradientIconBadge>

      <div className="leading-tight">
        <p className="text-sm font-bold text-slate-900">{brandName}</p>
        <p className="text-xs text-slate-600">90 days to job-ready</p>
      </div>
    </button>

    {/* Desktop nav */}
    <nav className="hidden items-center gap-8 text-sm text-slate-700 md:flex">
      <a href="#what-you-get" className="transition hover:text-slate-900">
        Benefits
      </a>
      <a href="#outcomes" className="transition hover:text-slate-900">
        Results
      </a>
      <a href="#faq" className="transition hover:text-slate-900">
        FAQ
      </a>
    </nav>

    <div className="flex items-center gap-2">
      {/* Desktop CTA */}
      <div className="hidden md:flex items-center gap-2">
        <PrimaryBtn href={joinProgramHref} label={cta.primaryLabel} />
      </div>

      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileNavOpen((v) => !v)}
        className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl border bg-white"
        style={{ borderColor: `${C2}66` }}
        aria-label="Open menu"
      >
        {mobileNavOpen ? (
          <IconX className="h-5 w-5" style={{ color: C3 }} />
        ) : (
          <IconMenu className="h-5 w-5" style={{ color: C3 }} />
        )}
      </button>
    </div>
  </div>

  {/* Mobile nav panel */}
  {mobileNavOpen ? (
    <div className="md:hidden border-t border-slate-200 bg-white/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 grid gap-2 text-sm">
        <a
          onClick={() => setMobileNavOpen(false)}
          href="#what-you-get"
          className="rounded-xl px-3 py-2 hover:bg-slate-50"
        >
          Benefits
        </a>
        <a
          onClick={() => setMobileNavOpen(false)}
          href="#how-it-works"
          className="rounded-xl px-3 py-2 hover:bg-slate-50"
        >
          Process
        </a>
        <a
          onClick={() => setMobileNavOpen(false)}
          href="#outcomes"
          className="rounded-xl px-3 py-2 hover:bg-slate-50"
        >
          Results
        </a>
        <a
          onClick={() => setMobileNavOpen(false)}
          href="#faq"
          className="rounded-xl px-3 py-2 hover:bg-slate-50"
        >
          FAQ
        </a>
        <a
          onClick={() => setMobileNavOpen(false)}
          href="#partners"
          className="rounded-xl px-3 py-2 hover:bg-slate-50"
        >
          Partners
        </a>

        <div className="pt-2 flex gap-2">
          <PrimaryBtn href={joinProgramHref} label={cta.primaryLabel} />
        </div>
      </div>
    </div>
  ) : null}
</header>


      {/* Hero */}
      <section
        id="top"
        className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-10 sm:pt-14 sm:pb-14"
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Hashtag Pills */}
              <GradientPill text="#NoCost" />
              <GradientPill text="#FreeMentoring" />
              <GradientPill text="#CommunityDevelopment" />
            </div>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {headline.includes("job-ready") ? (
                <>
                  {headline.split("job-ready")[0]}
                  <span style={{ color: C3 }}>job-ready</span>
                  {headline.split("job-ready")[1]}
                </>
              ) : (
                headline
              )}
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed">
              {subheadline}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* ✅ Join button now routes based on login */}
              <PrimaryBtn href={joinProgramHref} label={cta.primaryLabel} big />
            </div>
          </div>

          {/* Right hero image (no crop) */}
          <div className="relative">
            <div
              className="absolute -inset-3 rounded-[32px] blur-3xl opacity-40"
              style={{ background: gradSoft }}
            />
            <div
              className="relative rounded-[32px] p-[3px] shadow-2xl"
              style={{
                background: grad,
                boxShadow: "0 18px 50px rgba(23,59,99,0.22)",
              }}
            >
              <img
                src={headerImageUrl}
                alt="90 Days Program"
                loading="lazy"
                className="w-full h-auto rounded-[30px] bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      <DividerGlow />

      {/* Visual Flow */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Background layer */}
        <div className="relative rounded-[36px] overflow-hidden">
          {/* soft gradient background */}
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background: `
          radial-gradient(circle at 20% 20%, ${C2}22, transparent 60%),
          radial-gradient(circle at 80% 60%, ${C3}18, transparent 60%),
          linear-gradient(180deg, rgba(255,255,255,0.90), rgba(255,255,255,0.72))
        `,
            }}
          />
          {/* subtle blur glow */}
          <div
            className="pointer-events-none absolute -inset-10 blur-3xl opacity-30"
            style={{ background: gradSoft }}
          />

          {/* Content */}
          <div className="relative px-4 sm:px-4 py-6 sm:py-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Your 90-Day Journey
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                A clear path from daily discipline to job-ready professional
              </p>
            </div>

            <div className="mt-4 sm:mt-4">
              <SoftCard className="p-4 sm:p-5">
                <div className="relative">
                  {/* glow behind image */}
                  <div
                    className="pointer-events-none absolute -inset-4 rounded-[30px] blur-3xl opacity-35"
                    style={{ background: gradSoft }}
                  />

                  {/* gradient border frame */}
                  <div
                    className="relative rounded-3xl p-[3px]"
                    style={{
                      background: grad,
                      boxShadow: "0 18px 50px rgba(23,59,99,0.18)",
                    }}
                  >
                    <img
                      src={DayPlan}
                      alt="90 Days Training Flow"
                      loading="lazy"
                      className="w-full h-auto rounded-[22px] bg-white block"
                    />
                  </div>

                  {/* optional helper text */}
                  <p className="mt-4 text-xs sm:text-sm text-slate-500 text-center">
                    Tip: Follow the flow step-by-step — one use case per day.
                  </p>
                </div>
              </SoftCard>
            </div>
          </div>
        </div>
      </section>

      <DividerGlow />
      <SectionShell
        id="what-you-get"
        title="What You Get"
        subtitle="Everything you need to become job-ready in 90 days"
        rightSlot={<GradientPill text="Clear • Practical • Daily" />}
      >
        {/* ✅ Section background wrapper */}
        <div className="relative rounded-[36px] overflow-hidden">
          {/* soft gradient base */}
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background: `
          radial-gradient(circle at 18% 22%, ${C2}20, transparent 62%),
          radial-gradient(circle at 82% 68%, ${C3}18, transparent 62%),
          linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.74))
        `,
            }}
          />

          {/* subtle glow */}
          <div
            className="pointer-events-none absolute -inset-12 blur-3xl opacity-25"
            style={{ background: gradSoft }}
          />

          {/* ✅ content stays above background */}
          <div className="relative p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {whatYouGet.map((item) => {
                const WIcon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group relative h-full rounded-3xl border bg-white/85 backdrop-blur-sm overflow-hidden transition
                         focus-within:ring-2 focus-within:ring-offset-2"
                    style={{
                      borderColor: `${C2}66`,
                      boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
                    }}
                    tabIndex={0}
                  >
                    {/* soft gradient glow (hover only) */}
                    <div
                      className="pointer-events-none absolute -inset-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `
                    radial-gradient(circle at 30% 20%, ${C2}26, transparent 60%),
                    radial-gradient(circle at 70% 70%, ${C3}1f, transparent 60%)
                  `,
                      }}
                    />

                    {/* card content */}
                    <div className="relative flex h-full flex-col p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0">
                          <GradientIconBadge>
                            <WIcon className="h-6 w-6" />
                          </GradientIconBadge>
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      {/* footer pinned */}
                      <div className="mt-auto pt-5 sm:pt-6">
                        <div
                          className="h-px w-full"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${C2}55, transparent)`,
                          }}
                        />
                        <div className="mt-4 flex items-center justify-between">
                          <span
                            className="text-xs font-semibold tracking-wide"
                            style={{ color: C3 }}
                          >
                            Included
                          </span>
                          <span className="text-xs text-slate-500">
                            90-day plan
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* lift shadow on hover */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        boxShadow: "0 22px 60px rgba(15, 23, 42, 0.10)",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SectionShell>

      <DividerGlow />

      {/* Testimonials */}
      <SectionShell
        title="Learner Feedback"
        subtitle="Built around daily discipline, real use cases, and clarity in explanations."
        rightSlot={<GradientPill text="Proof of skill" />}
      >
        {/* ✅ Section background wrapper */}
        <div className="relative rounded-[36px] overflow-hidden">
          {/* soft gradient base */}
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background: `
          radial-gradient(circle at 18% 22%, ${C2}20, transparent 62%),
          radial-gradient(circle at 82% 68%, ${C3}18, transparent 62%),
          linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.74))
        `,
            }}
          />

          {/* subtle glow */}
          <div
            className="pointer-events-none absolute -inset-12 blur-3xl opacity-25"
            style={{ background: gradSoft }}
          />

          {/* content */}
          <div className="relative p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="group relative h-full rounded-3xl border bg-white/90 backdrop-blur-sm overflow-hidden transition"
                  style={{
                    borderColor: `${C2}66`,
                    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
                  }}
                >
                  {/* soft hover glow */}
                  <div
                    className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at 30% 20%, ${C2}26, transparent 60%),
                             radial-gradient(circle at 80% 70%, ${C3}1f, transparent 60%)`,
                    }}
                  />

                  <div className="relative h-full flex flex-col p-5 sm:p-6">
                    {/* header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-tight truncate">
                          {t.name}
                        </p>
                        <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-snug">
                          {t.role}
                        </p>
                      </div>

                      <span
                        className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-2xl"
                        style={{ background: gradSoft, color: C3 }}
                        aria-hidden="true"
                      >
                        <IconChat className="h-5 w-5" />
                      </span>
                    </div>

                    {/* quote */}
                    <div className="mt-4 flex-1">
                      <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                        <span className="text-slate-400">“</span>
                        {t.quote}
                        <span className="text-slate-400">”</span>
                      </p>
                    </div>

                    {/* footer */}
                    <div className="mt-5 pt-4">
                      <div
                        className="h-px w-full"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${C2}55, transparent)`,
                        }}
                      />
                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: C3 }}
                        >
                          Verified learner
                        </span>
                        <span className="text-xs text-slate-500">
                          90-day plan
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* lift shadow */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      boxShadow: "0 22px 60px rgba(15, 23, 42, 0.10)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      <DividerGlow />

      {/* Who + Outcomes */}
      <section
        id="outcomes"
        className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16"
      >
        {/* Section background */}
        <div className="relative rounded-[36px] overflow-hidden">
          {/* soft gradient base */}
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background: `
          radial-gradient(circle at 18% 22%, ${C2}20, transparent 62%),
          radial-gradient(circle at 82% 68%, ${C3}18, transparent 62%),
          linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.74))
        `,
            }}
          />

          {/* subtle glow */}
          <div
            className="pointer-events-none absolute -inset-12 blur-3xl opacity-25"
            style={{ background: gradSoft }}
          />

          {/* Content */}
          <div className="relative p-4 sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* LEFT CARD */}
              <div
                className="group relative h-full rounded-3xl border bg-white/90 backdrop-blur-sm transition"
                style={{
                  borderColor: `${C2}66`,
                  boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
                }}
              >
                <SoftCard className="p-6 sm:p-8 bg-transparent shadow-none h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                        Who This Is For
                      </h3>
                      <p className="mt-2 text-sm sm:text-base text-slate-600">
                        A structured plan for consistent progress.
                      </p>
                    </div>

                    <GradientIconBadge size={46}>
                      <IconUsers className="h-6 w-6" />
                    </GradientIconBadge>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {whoItsFor.map((t) => (
                      <li key={t} className="flex gap-3 items-start">
                        <span
                          className="mt-1.5 inline-block h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ background: grad }}
                        />
                        <span className="text-sm sm:text-base text-slate-700 leading-relaxed">
                          {t}
                        </span>
                      </li>
                    ))}
                  </ul>
                </SoftCard>
              </div>

              {/* RIGHT CARD */}
              <div
                className="group relative h-full rounded-3xl border bg-white/90 backdrop-blur-sm transition"
                style={{
                  borderColor: `${C2}66`,
                  boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
                }}
              >
                <SoftCard className="p-6 sm:p-8 bg-transparent shadow-none h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                        Results by Day 90
                      </h3>
                      <p className="mt-2 text-sm sm:text-base text-slate-600">
                        Outcome-focused, based on real work.
                      </p>
                    </div>

                    <GradientIconBadge size={46}>
                      <IconBriefcase className="h-6 w-6" />
                    </GradientIconBadge>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {outcomes.map((t) => (
                      <li key={t} className="flex gap-3 items-start">
                        <span
                          className="mt-1.5 inline-block h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ background: grad }}
                        />
                        <span className="text-sm sm:text-base text-slate-700 leading-relaxed">
                          {t}
                        </span>
                      </li>
                    ))}
                  </ul>
                </SoftCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DividerGlow />

      {/* FAQ */}
      <SectionShell
        id="faq"
        title="FAQ"
        subtitle="Quick answers about the 90-day program structure."
        rightSlot={<GradientPill text="Simple" />}
      >
        {/* Section background */}
        <div className="relative rounded-[36px] overflow-hidden">
          {/* soft gradient base */}
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background: `
          radial-gradient(circle at 18% 22%, ${C2}20, transparent 62%),
          radial-gradient(circle at 82% 68%, ${C3}18, transparent 62%),
          linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.74))
        `,
            }}
          />

          {/* subtle glow */}
          <div
            className="pointer-events-none absolute -inset-12 blur-3xl opacity-25"
            style={{ background: gradSoft }}
          />

          {/* content */}
          <div className="relative p-4 sm:p-6 lg:p-8">
            <div className="grid gap-3 sm:gap-4">
              {faqs.map((f, i) => (
                <FAQItem
                  key={f.q}
                  q={f.q}
                  a={f.a}
                  open={faqOpenIndex === i}
                  onToggle={() =>
                    setFaqOpenIndex((prev) => (prev === i ? null : i))
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </SectionShell>
      <DividerGlow />

      {/* ✅ Official Partners (after FAQ) */}
      <SectionShell
        id="official-partners"
        title="Our Popular Platforms"
        subtitle="Trusted brands from public"
        rightSlot={<GradientPill text="Trusted" />}
      >
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
          {/* Partner 1 */}
          <a
            href="https://oxyloans.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit OxyLoans"
            className="group block"
            style={{ textDecoration: "none" }}
          >
            <div
              className="relative rounded-[24px] bg-white overflow-hidden transition-transform"
              style={{
                border: "1px solid rgba(15,23,42,0.10)",
                boxShadow:
                  "0 14px 36px rgba(15,23,42,0.10), 0 2px 0 rgba(255,255,255,0.8) inset",
              }}
            >
              {/* simple 3D hover */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "radial-gradient(circle at 20% 15%, rgba(99,102,241,0.12), transparent 55%), radial-gradient(circle at 80% 75%, rgba(168,85,247,0.10), transparent 55%)",
                }}
              />

              <div className="relative p-4 sm:p-5">
                <img
                  src="https://i.ibb.co/d0Ldd0tT/oxy1.png"
                  alt="OxyLoans"
                  loading="lazy"
                  className="w-full h-auto block"
                  style={{
                    objectFit: "contain", // ✅ no crop
                    borderRadius: 18,
                    background: "transparent",
                  }}
                />

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-slate-900">
                      OxyLoans - RBI Approved P2P NBFC
                    </p>
                  </div>

                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border"
                    style={{
                      borderColor: "rgba(99,102,241,0.35)",
                      background: "rgba(99,102,241,0.10)",
                    }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </div>

            {/* hover lift */}
            <style>{`
          a.group:hover > div {
            transform: translateY(-4px);
          }
        `}</style>
          </a>

          {/* Partner 2 */}
          <a
            href="https://oxybricks.world/"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit OxyBricks"
            className="group block"
            style={{ textDecoration: "none" }}
          >
            <div
              className="relative rounded-[24px] bg-white overflow-hidden transition-transform"
              style={{
                border: "1px solid rgba(15,23,42,0.10)",
                boxShadow:
                  "0 14px 36px rgba(15,23,42,0.10), 0 2px 0 rgba(255,255,255,0.8) inset",
              }}
            >
              {/* simple 3D hover */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "radial-gradient(circle at 20% 15%, rgba(99,102,241,0.12), transparent 55%), radial-gradient(circle at 80% 75%, rgba(168,85,247,0.10), transparent 55%)",
                }}
              />

              <div className="relative p-4 sm:p-5">
                <img
                  src="https://i.ibb.co/mVHrYfW4/oxybrick.png"
                  alt="OxyBricks"
                  loading="lazy"
                  className="w-full h-auto block"
                  style={{
                    objectFit: "contain", // ✅ no crop
                    borderRadius: 18,
                    background: "transparent",
                  }}
                />

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-slate-900">
                      OxyBricks - Fractional Ownership in Real Estate & GOLD
                    </p>
                  </div>

                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border"
                    style={{
                      borderColor: "rgba(168,85,247,0.35)",
                      background: "rgba(168,85,247,0.10)",
                    }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </div>

            {/* hover lift */}
            <style>{`
          a.group:hover > div {
            transform: translateY(-4px);
          }
        `}</style>
          </a>
        </div>
      </SectionShell>

      {/* Final CTA – Compact Gradient Card */}
      <section
        id="join"
        className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12"
      >
        <div
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
          style={{
            background: grad,
            boxShadow: "0 18px 50px rgba(23,59,99,0.22)",
          }}
        >
          {/* soft glow overlay */}
          <div
            className="pointer-events-none absolute -inset-10 opacity-30 blur-3xl"
            style={{ background: "rgba(255,255,255,0.20)" }}
          />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                Ready to start your 90-day job plan?
              </h2>
              <p className="mt-2 text-sm sm:text-base text-white/85 leading-relaxed">
                Daily discipline • Real use cases • Interview readiness
              </p>
            </div>

            {/* ✅ Join button */}
            <a
              href={joinProgramHref}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5
                   text-sm sm:text-base font-semibold transition
                   hover:shadow-xl active:scale-[0.99]
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ color: C3 }}
            >
              {cta.primaryLabel}
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ✅ Mobile sticky CTA bar */}
      <div className="md:hidden fixed bottom-3 left-0 right-0 z-50 px-4">
        <div
          className="relative overflow-hidden rounded-2xl border bg-white/95 backdrop-blur-md"
          style={{
            borderColor: `${C2}66`,
            boxShadow: "0 18px 50px rgba(15, 23, 42, 0.18)",
          }}
        >
          {/* subtle gradient line */}
          <div
            className="absolute left-0 right-0 top-0 h-[3px]"
            style={{ background: grad }}
          />

          <div className="flex items-center justify-between gap-3 p-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {brandName}
              </p>
              <p className="text-[11px] text-slate-600 truncate">
                Become job-ready in 90 days
              </p>
            </div>

            <a
              href={joinProgramHref}
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5
                   text-sm font-semibold text-white transition
                   active:scale-[0.99]
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ background: grad }}
            >
              {cta.primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <footer className="mx-auto max-w-7xl px-4 sm:px-6 pb-10 pt-10 sm:pt-14">
        {/* Footer background card */}
        <div className="relative rounded-[36px] overflow-hidden">
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background: `
          radial-gradient(circle at 18% 22%, ${C2}20, transparent 62%),
          radial-gradient(circle at 82% 68%, ${C3}18, transparent 62%),
          linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.74))
        `,
            }}
          />
          <div
            className="pointer-events-none absolute -inset-12 blur-3xl opacity-25"
            style={{ background: gradSoft }}
          />

          <div className="relative p-5 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Brand */}
              <div className="lg:col-span-5 min-w-0">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border bg-white/80"
                    style={{ borderColor: `${C2}66` }}
                  >
                    <span
                      className="text-lg font-extrabold"
                      style={{ color: C3 }}
                    >
                      <GradientIconBadge size={40}>
                        <IconSpark className="h-5 w-5" />
                      </GradientIconBadge>
                    </span>
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {brandName}
                    </p>
                    <p className="text-xs text-slate-600 truncate">
                      90 days to job-ready
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm sm:text-[15px] text-slate-600 leading-relaxed max-w-prose">
                  A discipline-first program built on daily execution, real use
                  cases, mini interviews, and deployment-ready skills.
                </p>

                {/* Optional social icons */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    href="#top"
                    className="inline-flex items-center rounded-2xl border bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:shadow"
                    style={{ borderColor: `${C2}66` }}
                  >
                    Back to top
                  </a>
                  <a
                    href="#faq"
                    className="inline-flex items-center rounded-2xl border bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:shadow"
                    style={{ borderColor: `${C2}66` }}
                  >
                    FAQ
                  </a>
                  <a
                    href="#join"
                    className="inline-flex items-center rounded-2xl px-4 py-2 text-xs font-semibold text-white transition hover:shadow"
                    style={{ background: grad }}
                  >
                    Join now
                  </a>
                </div>
              </div>

              {/* Links */}
              <div className="lg:col-span-7 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Program
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li>
                      <a className="hover:text-slate-900" href="#what-you-get">
                        What you get
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-slate-900" href="#outcomes">
                        Outcomes
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-slate-900" href="#join">
                        Join the plan
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Support
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li>
                      <a className="hover:text-slate-900" href="#faq">
                        FAQs
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-slate-900" href="/privacy">
                        Privacy policy
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-slate-900" href="/terms">
                        Terms
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-slate-900" href="/contact">
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* divider */}
            <div
              className="mt-8 h-px w-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${C2}55, transparent)`,
              }}
            />

            {/* bottom row */}
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                © {new Date().getFullYear()} {brandName}. All rights reserved.
              </p>

              <p className="text-xs text-slate-500">
                Built for clarity • Practice • Proof of skill
              </p>
            </div>
          </div>
        </div>

        {/* ✅ IMPORTANT: reserve space so mobile sticky CTA doesn’t cover footer */}
        <div className="h-24 md:hidden" />
      </footer>
    </div>
  );
}
