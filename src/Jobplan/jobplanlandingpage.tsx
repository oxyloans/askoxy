import React, { useMemo, useState } from "react";
import DayPlan from "../assets/img/90dayplanflow.png";

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
  <section id={id} className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
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
  <div className="mx-auto max-w-6xl px-4 sm:px-6">
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
  headerImageUrl = "https://i.ibb.co/Vc4SFD3g/90-day.jpg",
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

  const joinProgramHref = isLoggedIn ? JOIN_LOGGEDIN_URL : JOIN_PUBLIC_URL;

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-70 blur-3xl"
        style={{ background: gradSoft }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
          <a href="#top" className="flex items-center gap-3">
            <GradientIconBadge size={40}>
              <IconSpark className="h-5 w-5" />
            </GradientIconBadge>

            <div className="leading-tight">
              <p className="text-sm font-bold text-slate-900">{brandName}</p>
              <p className="text-xs text-slate-600">90 days to job-ready</p>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 text-sm text-slate-700 md:flex">
            <a href="#what-you-get" className="transition hover:text-slate-900">
              Benefits
            </a>
            <a href="#how-it-works" className="transition hover:text-slate-900">
              Process
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
              {/* ✅ Join button now routes based on login */}
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
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 grid gap-2 text-sm">
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

              <div className="pt-2 flex gap-2">
                {/* ✅ Join button now routes based on login */}
                <PrimaryBtn href={joinProgramHref} label={cta.primaryLabel} />
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {/* Hero */}
      <section
        id="top"
        className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-10 sm:pt-14 sm:pb-14"
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <GradientPill text="Daily Discipline" />
              <GradientPill text="51 Use Cases" />
              <GradientPill text="Mini Interviews" />
              <GradientPill text="Deployment + Integration" />
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
                alt="90 Day Program"
                loading="lazy"
                className="w-full h-auto rounded-[30px] bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      <DividerGlow />

      {/* Visual Flow */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-4xl">
            Your 90-Day Journey
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            A clear path from daily discipline to job-ready professional
          </p>
        </div>

        <div className="mt-10">
          <SoftCard className="p-4 sm:p-5">
            <div
              className="relative rounded-3xl p-[3px]"
              style={{ background: grad }}
            >
              <img
                src={DayPlan}
                alt="90 Day Training Flow"
                loading="lazy"
                className="w-full h-auto rounded-[22px]"
              />
            </div>
          </SoftCard>
        </div>
      </section>

      <DividerGlow />

      {/* What You Get */}
      <SectionShell
        id="what-you-get"
        title="What You Get"
        subtitle="Everything you need to become job-ready in 90 days"
        rightSlot={<GradientPill text="Clear • Practical • Daily" />}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whatYouGet.map((item) => {
            const WIcon = item.icon;
            return (
              <div
                key={item.title}
                className="h-full rounded-3xl border"
                style={{
                  borderColor: `${C2}66`,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.80))",
                  boxShadow: "0 18px 46px rgba(15, 23, 42, 0.06)",
                }}
              >
                <div className="h-full rounded-3xl bg-white/80 backdrop-blur-sm p-6 transition hover:-translate-y-0.5 hover:shadow-xl">
                  <div className="h-full flex flex-col">
                    <div className="flex items-start gap-4">
                      <GradientIconBadge>
                        <WIcon className="h-6 w-6" />
                      </GradientIconBadge>

                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div
                        className="mt-5 h-px w-full"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${C2}55, transparent)`,
                        }}
                      />
                      <div className="mt-4 flex items-center justify-between">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: C3 }}
                        >
                          Included
                        </span>
                        <span className="text-xs text-slate-500">90-day plan</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionShell>

      <DividerGlow />

      {/* How It Works */}
      <SectionShell
        id="how-it-works"
        title="How It Works"
        subtitle="Six phases that transform you into a job-ready professional"
        rightSlot={<GradientPill text="6 Phases" />}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => {
            const StepIcon = s.icon;

            return (
              <div
                key={s.title}
                className="h-full rounded-3xl bg-white p-6"
                style={{
                  boxShadow:
                    "inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -2px 6px rgba(15,23,42,0.08)",
                }}
              >
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-500">
                      {s.phase}
                    </span>

                    <div style={{ color: C3 }}>
                      <StepIcon className="h-6 w-6" />
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionShell>

      <DividerGlow />

      {/* Testimonials */}
      <SectionShell
        title="Learner Feedback"
        subtitle="Built around daily discipline, real use cases, and clarity in explanations."
        rightSlot={<GradientPill text="Proof of skill" />}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="h-full rounded-3xl bg-white border p-6"
              style={{ borderColor: `${C2}66` }}
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-600">{t.role}</p>
                  </div>

                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl"
                    style={{ background: gradSoft, color: C3 }}
                  >
                    <IconChat className="h-5 w-5" />
                  </span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  “{t.quote}”
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      <DividerGlow />

      {/* Who + Outcomes */}
      <section
        id="outcomes"
        className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div
            className="rounded-3xl bg-white"
            style={{
              boxShadow:
                "inset 0 2px 3px rgba(255,255,255,0.9), inset 0 -6px 12px rgba(15,23,42,0.10)",
            }}
          >
            <SoftCard className="p-8 bg-transparent shadow-none">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Who This Is For
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
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
                    <span className="text-slate-700">{t}</span>
                  </li>
                ))}
              </ul>
            </SoftCard>
          </div>

          <div
            className="rounded-3xl bg-white"
            style={{
              boxShadow:
                "inset 0 2px 3px rgba(255,255,255,0.9), inset 0 -6px 12px rgba(15,23,42,0.10)",
            }}
          >
            <SoftCard className="p-8 bg-transparent shadow-none">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Results by Day 90
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
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
                    <span className="text-slate-700">{t}</span>
                  </li>
                ))}
              </ul>
            </SoftCard>
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
        <div className="grid gap-4">
          {faqs.map((f, i) => (
            <FAQItem
              key={f.q}
              q={f.q}
              a={f.a}
              open={faqOpenIndex === i}
              onToggle={() => setFaqOpenIndex((prev) => (prev === i ? null : i))}
            />
          ))}
        </div>
      </SectionShell>

      {/* Final CTA – Compact Gradient Card */}
      <section id="join" className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div
          className="rounded-3xl p-6 sm:p-7 shadow-xl"
          style={{
            background: grad,
            boxShadow: "0 16px 36px rgba(23,59,99,0.22)",
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold text-white">
                Ready to start your 90-day job plan?
              </h2>
              <p className="mt-1 text-sm sm:text-base text-white/85">
                Daily discipline • Real use cases • Interview readiness
              </p>
            </div>

            {/* ✅ Join button now routes based on login */}
            <a
              href={joinProgramHref}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm sm:text-base font-semibold transition hover:shadow-lg"
              style={{ color: C3 }}
            >
              {cta.primaryLabel}
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA bar */}
      <div className="md:hidden fixed bottom-3 left-0 right-0 z-50 px-4">
        <div
          className="rounded-2xl border bg-white/95 backdrop-blur-md shadow-2xl"
          style={{ borderColor: `${C2}66` }}
        >
          <div className="flex items-center justify-between gap-3 p-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {brandName}
              </p>
              <p className="text-[11px] text-slate-600 truncate">
                Become job-ready in 90 days
              </p>
            </div>

            {/* ✅ Join button now routes based on login */}
            <a
              href={joinProgramHref}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
              style={{ background: grad }}
            >
              {cta.primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="h-24 md:hidden" />
    </div>
  );
}
