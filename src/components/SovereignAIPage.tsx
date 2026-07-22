import React, { useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  Check,
  Code2,
  Database,
  FileCheck2,
  Globe2,
  Landmark,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Network,
  Phone,
  Scale,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AIhands from "../assets/img/ai0.png";
import AIdata from "../assets/img/ai2.png";
import Radha from "../assets/img/radha sir.png";
import Rama from "../assets/img/rama mam.png";
import Logo from "../assets/img/askoxylogoblack.png";

/* -------------------------------------------------------------------------- */
/*                              Verified URLs                                  */
/* -------------------------------------------------------------------------- */

const LINKS = {
  oxyBfsi: "https://www.askoxy.ai/oxybfsai",
  useCaseEngine: "https://www.askoxy.ai/use-case-engine",
  finVibeCodeBuilder: "https://www.askoxy.ai/finvibe-code-builder",
  askOxy: "https://www.askoxy.ai",
  rbiAIStore: "https://www.askoxy.ai/ai-store/rbi-master-directions-ai-store",
  insuranceLLM: "https://www.askoxy.ai/genoxy/chat?a=insurance-llm",
  uaeCentralBankAIStore:
    "https://www.askoxy.ai/ai-store/uae-central-bank-ai-store",
  ramaLinkedIn: "https://www.linkedin.com/in/ramadevi-thatavarti/",
  radhaLinkedIn: "https://www.linkedin.com/in/oxyradhakrishna/",
};

/* -------------------------------------------------------------------------- */
/*                                  Content                                    */
/* -------------------------------------------------------------------------- */

const navigation = [
  {
    label: "Why It Matters",
    href: "#why-sovereign-ai",
  },
  {
    label: "AI Solutions",
    href: "#live-products",
  },
  {
    label: "Leadership",
    href: "#leadership",
  },
  {
    label: "Capabilities",
    href: "#use-cases",
  },
  {
    label: "Why OXY",
    href: "#our-advantage",
  },
  {
    label: "Future Vision",
    href: "#roadmap",
  },
];

const challenges = [
  {
    icon: FileCheck2,
    title: "Manual Regulatory Research",
    description:
      "Compliance teams spend significant time searching, reading and interpreting complex regulatory documents.",
  },
  {
    icon: Network,
    title: "Fragmented Information",
    description:
      "Master Directions, Circulars, Notifications, Guidelines and Regulations are distributed across different sources.",
  },
  {
    icon: Code2,
    title: "Late Compliance Integration",
    description:
      "Regulatory requirements are often reviewed only after a technology system has already been designed or developed.",
  },
  {
    icon: Scale,
    title: "Generic AI Limitations",
    description:
      "General-purpose AI tools may provide outdated, incomplete or unsupported regulatory information.",
  },
  {
    icon: Globe2,
    title: "Data Sovereignty",
    description:
      "Sensitive institutional and regulatory queries may be processed using infrastructure located outside India.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Risk",
    description:
      "Incorrect regulatory interpretation can create operational, financial and reputational risk.",
  },
];

const products = [
  {
    icon: BookOpenCheck,
    title: "RBI AI Store",
    status: "Live",
    description:
      "Instant, source-cited regulatory intelligence drawn from 255+ RBI Master Directions, Circulars and Notifications.",
    href: LINKS.rbiAIStore,
  },
  {
    icon: ShieldCheck,
    title: "Insurance LLM",
    status: "Live",
    description:
      "Regulatory question-answering drawn from 8,877+ IRDAI Master Circulars, Guidelines and Regulations.",
    href: LINKS.insuranceLLM,
  },
  {
    icon: Code2,
    title: "Compliance-Embedded Code Generation",
    status: "Live",
    description:
      "Functional application development for customer onboarding, loan origination, credit decisioning and recovery workflows.",
    href: LINKS.finVibeCodeBuilder,
  },
  {
    icon: BrainCircuit,
    title: "BFSI AI Use-Case Engine",
    status: "Live",
    description:
      "Explore more than 30 AI use cases across banking, financial services, insurance, compliance, risk and technology.",
    href: LINKS.useCaseEngine,
  },
];

const useCases = [
  {
    icon: BookOpenCheck,
    title: "Regulatory Question Answering",
    description:
      "Search regulatory information and receive responses supported by source references.",
  },
  {
    icon: Network,
    title: "Circular Tracking",
    description:
      "Review regulatory updates and understand the teams, policies and systems that may be affected.",
  },
  {
    icon: FileCheck2,
    title: "Audit Readiness",
    description:
      "Organize regulatory references, obligations and control information for audit preparation.",
  },
  {
    icon: Scale,
    title: "Compliance Review",
    description:
      "Support compliance teams while reviewing policies, processes and regulatory requirements.",
  },
  {
    icon: Code2,
    title: "Application Development",
    description:
      "Bring regulatory considerations into application workflows during the development process.",
  },
  {
    icon: ShieldCheck,
    title: "Risk and Governance",
    description:
      "Support regulatory risk identification, governance reviews and internal control workflows.",
  },
];

const advantages = [
  {
    number: "01",
    icon: ShieldCheck,
    title: "Regulated-Entity Experience",
    description:
      "Through OXYLOANS, the team has direct experience operating within an RBI-regulated NBFC-P2P environment.",
  },
  {
    number: "02",
    icon: Database,
    title: "Regulatory Data Foundation",
    description:
      "More than 9,000 RBI and IRDAI regulatory documents have already been collected, processed and structured.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Working Products",
    description:
      "The platform includes live regulatory intelligence products and functional technology demonstrations.",
  },
  {
    number: "04",
    icon: Globe2,
    title: "Multi-Country Roadmap",
    description:
      "The roadmap begins with India and includes future regulatory intelligence coverage for the UAE and Saudi Arabia.",
  },
  {
    number: "05",
    icon: Users,
    title: "AI-Native Community",
    description:
      "The platform is being strengthened through contributions from technology teams, BFSI professionals and institutional users.",
  },
];

const sovereigntyPrinciples = [
  "Regulatory data should remain within Indian-controlled infrastructure throughout processing.",
  "Institution-specific information should remain confidential.",
  "Confidential data should not be used to train shared models without explicit consent.",
  "Regulatory responses should be supported by primary-source references.",
  "AI-assisted decisions should remain traceable and auditable.",
];

const roadmap = [
  {
    stage: "01",
    title: "Regulatory Data Foundation",
    status: "Completed and Expanding",
    description:
      "Collecting, processing, structuring and indexing RBI and IRDAI regulatory documents.",
  },
  {
    stage: "02",
    title: "Regulatory AI Products",
    status: "Live",
    description:
      "Providing regulatory search, question-answering and BFSI AI use-case exploration.",
  },
  {
    stage: "03",
    title: "Institution-Specific Workflows",
    status: "In Development",
    description:
      "Developing private regulatory workflows for compliance, risk, audit and technology teams.",
  },
  {
    stage: "04",
    title: "Indian GPU Infrastructure",
    status: "Roadmap",
    description:
      "Progressing toward regulatory AI deployment using Indian-controlled computing infrastructure.",
  },
  {
    stage: "05",
    title: "Sovereign BFSI Model",
    status: "Long-Term Direction",
    description:
      "Building proprietary model, tokenization and training capabilities using Indian regulatory knowledge.",
  },
];

const leadership = [
  {
    name: "Radhakrishna Thatavarti",
    role: "Chief Executive Officer & Co-Founder",
    photo: Radha,
    bio: 'Radhakrishna ("Radha") brings over 25 years of experience across banking, financial services and large-scale technology delivery, including leadership roles at Citibank and Emirates NBD. A Columbia Business School alumnus, he has built a compliance-first, regulator-aligned approach to AI. His work across AI, blockchain, lending systems and citizen-scale platforms led to OxyLoans, ASKOXY.AI, the R2C framework and the Insurance AI LLM.',
    linkedin: LINKS.radhaLinkedIn,
  },
  {
    name: "Ramadevi Thatavarti",
    role: "Chief Technology Officer & Co-Founder",
    photo: Rama,
    bio: "Ramadevi brings more than 20 years of experience in banking and financial technology, leading platform development, integrations, compliance and governance for Indian and global institutions. For the last eight years, she has led OxyLoans with a strong focus on RBI adherence, audits and operational controls. She champions responsible, regulator-first AI systems that support SHG women, citizens and the wider digital economy.",
    linkedin: LINKS.ramaLinkedIn,
  },
];

const fiveLayerFramework = [
  {
    number: "05",
    icon: Users,
    title: "AI-Native Community",
    description: "Continuous improvement through collaboration",
  },
  {
    number: "04",
    icon: Globe2,
    title: "Multi-Country Vision",
    description: "India, UAE and Saudi Arabia roadmap",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Live Products",
    description: "Working platforms and demonstrations",
  },
  {
    number: "02",
    icon: Database,
    title: "Regulatory Data",
    description: "9,000+ processed regulatory documents",
  },
  {
    number: "01",
    icon: ShieldCheck,
    title: "Regulated Experience",
    description: "Direct experience through OXYLOANS",
  },
];

/* -------------------------------------------------------------------------- */
/*                              Motion helpers                                */
/* -------------------------------------------------------------------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const glowCard =
  "rounded-[24px] border border-white/10 bg-white/[0.045] shadow-[0_18px_70px_rgba(7,7,24,0.34)] backdrop-blur-xl";
interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
}
const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = "center",
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={fadeUp}
    className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl`}
  >
    <div
      className={`mb-5 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-fuchsia-200 ${
        align === "center" ? "mx-auto" : ""
      }`}
    >
      <Sparkles className="h-3.5 w-3.5" />
      {eyebrow}
    </div>
    <h2 className="text-3xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
      {title}
    </h2>
    {description && (
      <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
        {description}
      </p>
    )}
  </motion.div>
);

interface LeadershipPerson {
  name: string;
  role: string;
  photo: string;
  bio: string;
  linkedin: string;
}

const LeadershipCard: React.FC<{ person: LeadershipPerson; index: number }> = ({
  person,
  index,
}) => (
  <motion.article
    initial={{ opacity: 0, y: 24, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.45, delay: index * 0.08 }}
    whileHover={{ y: -6 }}
    className="group relative h-full overflow-hidden rounded-[26px] border border-white/15 bg-white/[0.065] p-4 shadow-[0_22px_70px_rgba(8,8,28,0.42)] backdrop-blur-2xl transition duration-300 hover:border-fuchsia-300/30 hover:bg-white/[0.085] sm:p-5"
  >
    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.10] to-transparent" />
    <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-fuchsia-500/15 blur-3xl transition duration-500 group-hover:bg-fuchsia-500/20" />
    <div className="pointer-events-none absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

    <div className="relative flex h-full flex-col">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative shrink-0">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-fuchsia-400/55 via-violet-400/30 to-cyan-300/35 blur-sm" />
          <img
            src={person.photo}
            alt={person.name}
            className="relative h-16 w-16 rounded-2xl border border-white/20 object-cover shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:h-20 sm:w-20"
            loading="lazy"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-black tracking-tight text-white sm:text-xl">
              {person.name}
            </h3>
            <a
              href={person.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label={`${person.name} on LinkedIn`}
              title={`View ${person.name} on LinkedIn`}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0A66C2]/35 bg-[#0A66C2]/15 text-[#79bdff] shadow-[0_8px_20px_rgba(10,102,194,0.18)] transition hover:-translate-y-0.5 hover:border-[#0A66C2]/70 hover:bg-[#0A66C2]/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#79bdff]"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>

          <p className="mt-1 text-[10px] font-extrabold uppercase leading-5 tracking-[0.1em] text-fuchsia-300 sm:text-xs">
            {person.role}
          </p>
        </div>
      </div>

      <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <p className="text-left text-sm leading-6 text-slate-300 sm:leading-7">
        {person.bio}
      </p>
    </div>
  </motion.article>
);

const SovereignAIPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#070817] text-white selection:bg-fuchsia-500/30">
      <style>{`
        html { scroll-behavior: smooth; overflow-x: hidden; }
        body { overflow-x: hidden; }
        * { min-width: 0; }
        .purple-grid {
          background-image:
            linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px);
          background-size: 42px 42px;
        }
        .noise-mask {
          background-image: radial-gradient(circle at center, rgba(255,255,255,.1) 0.7px, transparent 0.8px);
          background-size: 19px 19px;
          mask-image: linear-gradient(to bottom, black, transparent 86%);
        }

        @keyframes gradientFlow {
          0% { transform: translate3d(-6%, -4%, 0) scale(1); }
          50% { transform: translate3d(5%, 4%, 0) scale(1.08); }
          100% { transform: translate3d(-6%, -4%, 0) scale(1); }
        }
        @keyframes gradientFlowReverse {
          0% { transform: translate3d(5%, 2%, 0) scale(1.05); }
          50% { transform: translate3d(-5%, -3%, 0) scale(0.96); }
          100% { transform: translate3d(5%, 2%, 0) scale(1.05); }
        }
        .motion-gradient { animation: gradientFlow 18s ease-in-out infinite; }
        .motion-gradient-reverse { animation: gradientFlowReverse 22s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .motion-gradient, .motion-gradient-reverse { animation: none; }
        }
        .screen-art {
          mix-blend-mode: screen;
          filter: contrast(1.16) brightness(1.08) saturate(1.08);
          transform: translateZ(0);
        }
        .screen-art-soft {
          mix-blend-mode: screen;
          filter: contrast(1.1) brightness(1.04) saturate(1.05);
          transform: translateZ(0);
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="motion-gradient absolute -left-[18%] -top-[18%] h-[70vw] w-[70vw] rounded-full bg-violet-700/20 blur-[140px]" />
        <div className="motion-gradient-reverse absolute -right-[20%] top-[18%] h-[66vw] w-[66vw] rounded-full bg-fuchsia-700/16 blur-[150px]" />
        <div className="motion-gradient absolute bottom-[-26%] left-[22%] h-[58vw] w-[58vw] rounded-full bg-indigo-600/16 blur-[150px]" />
      </div>

      <div className="pointer-events-none fixed inset-y-0 left-0 z-0 hidden w-[7vw] bg-gradient-to-r from-violet-700/50 to-transparent blur-3xl lg:block" />
      <div className="pointer-events-none fixed inset-y-0 right-0 z-0 hidden w-[7vw] bg-gradient-to-l from-fuchsia-700/45 to-transparent blur-3xl lg:block" />

      <div className="relative z-10">
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#070817]/80 backdrop-blur-2xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="group flex h-12 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 sm:h-16 sm:w-24"
                aria-label="Go to ASKOXY.AI home"
              >
                <img
                  src={Logo}
                  alt="ASKOXY.AI"
                  className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                />
              </button>

              <div className="min-w-0">
                <span className="block truncate text-sm font-black tracking-tight text-white sm:text-base">
                  OXY BFSI Sovereign AI
                </span>
                <span className="block truncate text-[9px] font-bold uppercase tracking-[0.16em] text-fuchsia-300 sm:text-[10px] sm:tracking-[0.2em]">
                  Powered by ASKOXY.AI
                </span>
              </div>
            </div>

            {/* Fixed: nav now appears from lg: instead of xl:, closing the
                1024-1280px gap where neither the nav nor the hamburger showed. */}
            <nav className="hidden items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.035] p-1 lg:flex">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-bold text-slate-300 transition hover:bg-white/10 hover:text-white xl:px-4 xl:text-xs"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <a
              href={LINKS.oxyBfsi}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-3 text-sm font-black shadow-[0_12px_30px_rgba(168,85,247,.25)] transition hover:-translate-y-0.5 lg:inline-flex"
            >
              Explore OXY BFSI AI <ArrowRight className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((value) => !value)}
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white transition hover:bg-white/10 lg:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-white/10 bg-[#0a0b1f]/95 lg:hidden"
              >
                <nav className="max-h-[calc(100vh-4rem)] space-y-1 overflow-y-auto px-4 py-4 sm:px-6">
                  {navigation.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-200 hover:bg-white/5"
                    >
                      {item.label}
                    </a>
                  ))}
                  <a
                    href={LINKS.oxyBfsi}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-3 text-sm font-black"
                  >
                    Explore OXY BFSI AI <ArrowRight className="h-4 w-4" />
                  </a>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <section
          id="home"
          className="relative overflow-hidden pb-16 pt-24 sm:pb-24 sm:pt-32 lg:pb-28 lg:pt-40"
        >
          <div className="purple-grid absolute inset-0 opacity-70" />
          <div className="noise-mask absolute inset-0 opacity-30" />
          <div className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-violet-700/25 blur-[150px]" />
          <div className="absolute -left-40 top-48 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-[130px]" />
          <div className="absolute -right-48 top-60 h-[460px] w-[460px] rounded-full bg-indigo-600/20 blur-[150px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="mx-auto max-w-5xl text-center"
            >
              <motion.div
                variants={fadeUp}
                className="mx-auto inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-4 py-2 text-xs font-black text-fuchsia-200"
              >
                <Landmark className="h-4 w-4" />
                Prepared for RBI- and IRDAI-Regulated Entities across India
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mt-6 text-[2rem] font-black leading-[1.15] tracking-[-0.04em] sm:text-5xl sm:leading-[1.1] lg:text-6xl xl:text-[72px] pb-1"
              >
                India&apos;s First Sovereign AI
                <span className="block bg-gradient-to-r from-white via-fuchsia-200 to-violet-400 bg-clip-text text-transparent pb-2 leading-[1.15]">
                  for Regulated Entities
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mx-auto mt-6 max-w-3xl text-[15px] leading-7 text-slate-300 sm:text-lg"
              >
                A purpose-built sovereign AI platform for banking, financial
                services and insurance—designed for source-backed regulatory
                intelligence, compliance, auditability and secure data control.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"
              >
                <a
                  href={LINKS.oxyBfsi}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-7 py-4 text-sm font-black shadow-[0_15px_45px_rgba(168,85,247,.34)] transition hover:-translate-y-1 sm:w-auto sm:text-base"
                >
                  Explore OXY BFSI AI <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href={LINKS.useCaseEngine}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.045] px-7 py-4 text-sm font-black text-white transition hover:border-fuchsia-300/40 hover:bg-white/[0.08] sm:w-auto sm:text-base"
                >
                  View BFSI Use Cases
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.28 }}
              className="relative mx-auto mt-14 max-w-6xl"
            >
              <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-r from-violet-500/15 via-fuchsia-500/20 to-indigo-500/15 blur-3xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-3 shadow-[0_24px_90px_rgba(7,7,24,0.4)] backdrop-blur-xl sm:p-5">
                <div className="relative min-h-[280px] overflow-hidden rounded-[22px] bg-[radial-gradient(circle_at_50%_42%,rgba(99,102,241,.18),transparent_34%),linear-gradient(135deg,#08091c_0%,#050611_46%,#0b0d24_100%)] sm:min-h-[460px] lg:min-h-[600px]">
                  <div className="absolute inset-0 purple-grid opacity-35" />
                  <div className="absolute left-[8%] top-[12%] h-44 w-44 rounded-full bg-fuchsia-500/20 blur-[90px] sm:h-72 sm:w-72" />
                  <div className="absolute bottom-[6%] right-[5%] h-48 w-48 rounded-full bg-cyan-400/15 blur-[100px] sm:h-80 sm:w-80" />
                  <motion.img
                    src={AIhands}
                    alt="Human and AI hands connecting"
                    className="screen-art absolute inset-0 h-full w-full object-contain object-center p-3 sm:p-7 lg:p-10"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 0.96, scale: 1 }}
                    transition={{ duration: 1, delay: 0.45 }}
                    loading="eager"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070817] via-[#070817]/30 to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section
          id="why-sovereign-ai"
          className="relative scroll-mt-24 py-20 sm:py-28"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="The Case for Collaboration"
              title={
                <>
                  Solve the challenges every{" "}
                  <span className="text-fuchsia-400">
                    regulated entity faces.
                  </span>
                </>
              }
              description="Compliance is often manual, fragmented and expensive. Regulated institutions need current, source-backed intelligence and a secure operating model—not generic answers disconnected from primary regulation."
            />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              variants={stagger}
              className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {challenges.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.title}
                    variants={fadeUp}
                    className={`${glowCard} group p-6 transition duration-300 hover:-translate-y-1 hover:border-fuchsia-400/30 hover:bg-white/[0.07]`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/25 to-fuchsia-500/15 text-fuchsia-300 ring-1 ring-white/10 transition group-hover:scale-105">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-xl font-black">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {item.description}
                    </p>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </section>

        <section
          id="live-products"
          className="relative scroll-mt-24 py-20 sm:py-28"
        >
          <div className="absolute inset-x-0 top-1/2 h-[480px] -translate-y-1/2 bg-violet-700/10 blur-[150px]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="AI Solutions"
              title={
                <>
                  Explore what we have{" "}
                  <span className="text-violet-400">already built.</span>
                </>
              }
              description="These are working systems available today—not mockups—including regulatory intelligence, compliant code generation and practical BFSI AI use cases."
            />
            <div className="mt-10 grid gap-4 sm:mt-12 lg:grid-cols-2">
              {products.map((product, index) => {
                const Icon = product.icon;
                return (
                  <motion.article
                    key={product.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className={`${glowCard} relative h-full overflow-hidden p-5 sm:p-8`}
                  >
                    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-fuchsia-500/10 blur-3xl" />
                    <div className="relative flex h-full flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06] p-3 text-fuchsia-300 ring-1 ring-white/10">
                          <Icon className="h-7 w-7" />
                        </div>
                        <span
                          className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-300"
                          aria-label={`${product.title} is live`}
                        >
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                          </span>
                          {product.status}
                        </span>
                      </div>
                      <h3 className="mt-6 text-2xl font-black">
                        {product.title}
                      </h3>
                      <p className="mt-4 flex-1 text-sm leading-7 text-slate-400 sm:text-base">
                        {product.description}
                      </p>
                      <a
                        href={product.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Explore ${product.title}`}
                        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-fuchsia-300/20 bg-gradient-to-r from-violet-600/90 to-fuchsia-500/90 px-5 py-3 text-sm font-black text-white shadow-[0_12px_30px_rgba(168,85,247,.2)] transition duration-300 hover:-translate-y-0.5 hover:border-fuchsia-200/40 hover:shadow-[0_16px_38px_rgba(168,85,247,.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 sm:w-fit"
                      >
                        Explore {product.title}
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </a>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="leadership" className="scroll-mt-24 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Leadership"
              title={
                <>
                  Leadership grounded in{" "}
                  <span className="text-fuchsia-400">
                    regulated finance and technology.
                  </span>
                </>
              }
              description="Decades of experience across banking, compliance and citizen-scale technology guide how Sovereign AI is built."
            />
            <div className="mt-8 grid gap-4 sm:mt-10 lg:grid-cols-2">
              {leadership.map((person, index) => (
                <LeadershipCard
                  key={person.name}
                  person={person}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="use-cases" className="scroll-mt-24 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Core Capabilities"
              title={
                <>
                  Built for practical{" "}
                  <span className="text-fuchsia-400">regulated workflows.</span>
                </>
              }
              description="Apply AI across compliance, risk, audit and technology while keeping governance built into every workflow."
            />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              variants={stagger}
              className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {useCases.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.title}
                    variants={fadeUp}
                    className="group border-t border-white/10 px-2 py-7 transition hover:border-fuchsia-400/50 sm:px-4"
                  >
                    <Icon className="h-7 w-7 text-violet-300 transition group-hover:text-fuchsia-300" />
                    <h3 className="mt-5 text-lg font-black">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {item.description}
                    </p>
                  </motion.article>
                );
              })}
            </motion.div>
            <div className="mt-10 text-center">
              <a
                href={LINKS.useCaseEngine}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-7 py-4 text-sm font-black sm:w-auto"
              >
                Explore All Use Cases <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </section>

        <section
          id="our-advantage"
          className="relative scroll-mt-24 py-20 sm:py-28"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-950/10 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="The OXY Advantage"
              title={
                <>
                  Our five-layer advantage for{" "}
                  <span className="text-violet-400">
                    sovereign regulated AI.
                  </span>
                </>
              }
              description="Five connected layers take us from primary regulatory knowledge to working products and long-term sovereign capability."
            />
            <div className="mx-auto mt-14 max-w-5xl space-y-3">
              {advantages.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.title}
                    initial={{ opacity: 0, x: index % 2 ? 24 : -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={`${glowCard} grid grid-cols-[44px_1fr] gap-4 p-5 sm:grid-cols-[72px_56px_1fr] sm:items-center sm:p-6`}
                  >
                    <span className="hidden text-3xl font-black text-white/15 sm:block">
                      {item.number}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/25 to-fuchsia-500/15 text-fuchsia-300 ring-1 ring-white/10">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black sm:text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:px-8">
            <div>
              <SectionHeading
                eyebrow="Data Sovereignty"
                align="left"
                title={
                  <>
                    Indian regulatory intelligence under{" "}
                    <span className="text-fuchsia-400">Indian control.</span>
                  </>
                }
                description="Sovereignty covers where information is processed, how institutional data is protected and how AI outputs remain reviewable."
              />
              <div className="mt-8 space-y-3">
                {sovereigntyPrinciples.map((principle) => (
                  <div
                    key={principle}
                    className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.025] p-4"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fuchsia-500/15 text-fuchsia-300">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-7 text-slate-300">
                      {principle}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_90px_rgba(7,7,24,0.38)] backdrop-blur-xl sm:p-6"
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 sm:pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-fuchsia-300">
                    Sovereign architecture
                  </p>
                  <h3 className="mt-2 text-xl font-black sm:text-2xl">
                    India-Controlled AI Stack
                  </h3>
                </div>
                <Server className="h-8 w-8 shrink-0 text-violet-300 sm:h-9 sm:w-9" />
              </div>

              <div className="relative mt-4 min-h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_55%_42%,rgba(37,99,235,.22),transparent_34%),linear-gradient(145deg,#08091d,#050611_60%,#090b22)] sm:mt-5 sm:min-h-[460px]">
                <div className="absolute inset-0 purple-grid opacity-25" />
                <div className="absolute -left-16 bottom-8 h-52 w-52 rounded-full bg-violet-500/15 blur-[90px]" />
                <div className="absolute -right-12 top-10 h-48 w-48 rounded-full bg-cyan-400/15 blur-[90px]" />
                <motion.img
                  src={AIdata}
                  alt="Data sovereignty and India-controlled AI stack"
                  className="screen-art-soft absolute inset-0 h-full w-full object-contain object-center p-3 sm:p-6"
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  whileInView={{ opacity: 0.98, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.75 }}
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#08091d] to-transparent" />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="roadmap" className="scroll-mt-24 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Future Vision"
              title={
                <>
                  Building sovereign intelligence,{" "}
                  <span className="text-violet-400">step by step.</span>
                </>
              }
              description="The roadmap clearly separates what is live today from future infrastructure and proprietary model development."
            />
            <div className="relative mx-auto mt-14 max-w-5xl">
              <div className="absolute bottom-0 left-5 top-0 hidden w-px bg-gradient-to-b from-fuchsia-400/60 via-violet-400/30 to-transparent sm:block" />
              <div className="space-y-4 sm:space-y-5">
                {roadmap.map((item, index) => (
                  <motion.article
                    key={item.title}
                    initial={{ opacity: 0, x: 22 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04 }}
                    className="relative sm:pl-14"
                  >
                    <div className="absolute left-0 top-6 hidden h-10 w-10 items-center justify-center rounded-full border border-fuchsia-300/30 bg-[#0b0c21] text-xs font-black text-fuchsia-300 shadow-[0_0_25px_rgba(217,70,239,.2)] sm:flex">
                      {index + 1}
                    </div>
                    <div className={`${glowCard} p-5 sm:p-7`}>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-fuchsia-300">
                            Stage {item.stage}
                          </p>
                          <h3 className="mt-2 text-xl font-black sm:text-2xl">
                            {item.title}
                          </h3>
                        </div>
                        <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-300">
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 pt-8 sm:px-6 sm:pb-20 lg:px-8">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-r from-violet-700/80 via-fuchsia-700/70 to-indigo-800/80 px-5 py-10 text-center shadow-[0_24px_80px_rgba(124,58,237,.22)] sm:px-10 sm:py-14">
            <div className="purple-grid absolute inset-0 opacity-20" />
            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-100">
                Sovereign AI
              </p>
              <h2 className="mx-auto mt-3 max-w-3xl text-2xl font-black leading-tight tracking-[-0.035em] sm:text-4xl">
                Explore trusted AI solutions for regulated BFSI teams.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-violet-100/85 sm:text-base">
                Discover practical regulatory intelligence, compliance and AI
                use cases on ASKOXY.AI.
              </p>
              <a
                href={LINKS.oxyBfsi}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-black text-violet-800 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
              >
                Explore OXY BFSI AI <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-4 py-5 text-xs leading-6 text-slate-500 sm:px-6 sm:text-sm lg:px-8">
            <strong className="text-slate-300">Important:</strong> AI-generated
            regulatory information is for research and internal support.
            Validate important decisions against the latest primary regulatory
            documents and authorised professionals.
          </div>
        </section>

        <footer className="relative overflow-hidden border-t border-white/10 bg-[#050611]">
          <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-violet-700/10 blur-[120px]" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-fuchsia-700/10 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
              <div>
                <div className="inline-flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="group flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
                    aria-label="Go to ASKOXY.AI home"
                  >
                    <img
                      src={Logo}
                      alt="ASKOXY.AI"
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                  </button>

                  <div className="min-w-0">
                    <p className="truncate text-base font-black tracking-tight text-white sm:text-lg">
                      Sovereign AI
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      Powered by ASKOXY.AI
                    </p>
                  </div>
                </div>

                <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                  Sovereign regulatory intelligence and AI solutions for
                  India&apos;s regulated BFSI ecosystem.
                </p>

                <nav
                  className="mt-6 flex flex-wrap gap-x-6 gap-y-3"
                  aria-label="Footer product links"
                >
                  <a
                    href={LINKS.oxyBfsi}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-slate-300 transition hover:text-fuchsia-300"
                  >
                    OXY BFSI AI
                  </a>
                  <a
                    href={LINKS.useCaseEngine}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-slate-300 transition hover:text-fuchsia-300"
                  >
                    Use-Case Engine
                  </a>
                  <a
                    href={LINKS.finVibeCodeBuilder}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-slate-300 transition hover:text-fuchsia-300"
                  >
                    Code Builder
                  </a>
                  <a
                    href={LINKS.askOxy}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-slate-300 transition hover:text-fuchsia-300"
                  >
                    ASKOXY.AI
                  </a>
                </nav>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">Contact Us</h3>

                <div className="mt-6 grid gap-8 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-fuchsia-300" />
                    <address className="not-italic text-sm leading-7 text-slate-300 sm:text-[15px]">
                      OXYKART TECHNOLOGIES PVT LTD,
                      <br />
                      CC-02, Indu Fortune Fields, KPHB,
                      <br />
                      Hyderabad, Telangana – 500085
                    </address>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-fuchsia-300" />
                    <address className="not-italic text-sm leading-7 text-slate-300 sm:text-[15px]">
                      AI Research Center, Entrance D, SE02 Concourse,
                      <br />
                      Miyapur Metro Station,
                      <br />
                      Hyderabad, Telangana – 500049
                    </address>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-4 text-sm sm:flex-row sm:flex-wrap sm:gap-x-7 sm:gap-y-4">
                  <a
                    href="mailto:support@askoxy.ai"
                    className="inline-flex items-center gap-2 font-semibold text-slate-300 transition hover:text-fuchsia-300"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-fuchsia-300" />
                    support@askoxy.ai
                  </a>
                  <a
                    href="tel:+918143271103"
                    className="inline-flex items-center gap-2 font-semibold text-slate-300 transition hover:text-fuchsia-300"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-fuchsia-300" />
                    +91 81432 71103
                  </a>
                  <a
                    href="tel:+918919636330"
                    className="inline-flex items-center gap-2 font-semibold text-slate-300 transition hover:text-fuchsia-300"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-fuchsia-300" />
                    +91 89196 36330
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-center text-xs leading-6 text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <p>
                © {new Date().getFullYear()} OXY GLOBAL TECH. All rights
                reserved.
              </p>
              <p className="font-semibold sm:text-right">
                Powered by ASKOXY.AI
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default SovereignAIPage;
