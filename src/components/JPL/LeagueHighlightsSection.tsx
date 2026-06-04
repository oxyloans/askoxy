import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Building2,
  Brain,
  Swords,
  Bot,
  Rocket,
  Search,
  Upload,
  ClipboardCheck,
  UserCheck,
  Briefcase,
  Users,
  FileText,
  CheckCircle,
  BadgeCheck,
  Lightbulb,
  ShieldCheck,
  ArrowRight,
  Gift,
  MessageSquare,
  BarChart3,
} from "lucide-react";

const logoIcon = "https://i.ibb.co/bRNBRBp5/logo-ideas.png";

const rjsPoints = [
  { icon: Search, text: "Search the right job role" },
  { icon: Upload, text: "Upload resume for AI review" },
  { icon: ClipboardCheck, text: "Take AI-based JD exam" },
];

const ccPoints = [
  { icon: Building2, text: "Hire qualified candidates faster" },
  { icon: Briefcase, text: "Get role-based matched profiles" },
  { icon: CheckCircle, text: "Receive AI-evaluated candidates" },
];

const mkPoints = [
  { icon: Brain, text: "AI + Human mentoring support" },
  { icon: Users, text: "Industry expert career guidance" },
  { icon: Lightbulb, text: "Improve job readiness and skills" },
];

const ckrPoints = [
  { icon: Swords, text: "Recruiters source job seekers" },
  { icon: UserCheck, text: "Connect talent with employers" },
  { icon: ShieldCheck, text: "Fulfill recruitment process" },
];

const askPoints = [
  { icon: Bot, text: "Training institutes build skills" },
  { icon: FileText, text: "Coaching platforms train learners" },
  { icon: BadgeCheck, text: "Prepare candidates for placements" },
];

const mrPoints = [
  { icon: Rocket, text: "Freelancers upload resume" },
  { icon: Users, text: "Add job rate card openly" },
  { icon: Briefcase, text: "Employers recruit freelancers" },
];

const referBuddyPoints = [
  { icon: Briefcase, text: "Post company job openings" },
  { icon: BarChart3, text: "View scores and qualified resumes" },
  { icon: Gift, text: "Earn referral bonus" },
];

type PointItem = {
  icon: React.ElementType;
  text: string;
};

type AccentType =
  | "purple"
  | "lightBlue"
  | "orange"
  | "teal"
  | "yellow"
  | "pink";

type LeagueCardProps = {
  icon: React.ElementType;
  shortCode: string;
  title: string;
  subtitle: string;
  accent: AccentType;
  points: PointItem[];
  navigateTo?: string;
  flipText?: string;
};

const accentMap = {
  purple: {
    text: "text-[#7c3aed]",
    icon: "from-[#ddd6fe] via-[#8b5cf6] to-[#6d28d9] border-[#8b5cf6]",
    card: "from-white via-[#fbfaff] to-[#f0eaff]",
    button:
      "border-[#8b5cf6] bg-gradient-to-b from-[#ddd6fe] via-[#8b5cf6] to-[#6d28d9] text-white",
  },
  lightBlue: {
    text: "text-[#1d4ed8]",
    icon: "from-[#eff6ff] via-[#93c5fd] to-[#60a5fa] border-[#93c5fd]",
    card: "from-white via-[#f8fbff] to-[#eaf3ff]",
    button:
      "border-[#93c5fd] bg-gradient-to-b from-[#f8fbff] via-[#dbeafe] to-[#bfdbfe] text-[#1d4ed8]",
  },
  orange: {
    text: "text-[#f97316]",
    icon: "from-[#fed7aa] via-[#f97316] to-[#c2410c] border-[#ea580c]",
    card: "from-white via-[#fff8f1] to-[#ffedd5]",
    button:
      "border-[#ea580c] bg-gradient-to-b from-[#fed7aa] via-[#f97316] to-[#c2410c] text-white",
  },
  teal: {
    text: "text-[#0f766e]",
    icon: "from-[#99f6e4] via-[#14b8a6] to-[#0f766e] border-[#0f766e]",
    card: "from-white via-[#f0fdfa] to-[#ccfbf1]",
    button:
      "border-[#0f766e] bg-gradient-to-b from-[#99f6e4] via-[#14b8a6] to-[#0f766e] text-white",
  },
  yellow: {
    text: "text-[#ca8a04]",
    icon: "from-[#fde68a] via-[#eab308] to-[#a16207] border-[#ca8a04]",
    card: "from-white via-[#fffdf0] to-[#fef9c3]",
    button:
      "border-[#ca8a04] bg-gradient-to-b from-[#fde68a] via-[#eab308] to-[#a16207] text-white",
  },
  pink: {
    text: "text-[#db2777]",
    icon: "from-[#fbcfe8] via-[#ec4899] to-[#9d174d] border-[#db2777]",
    card: "from-white via-[#fff5fa] to-[#fce7f3]",
    button:
      "border-[#db2777] bg-gradient-to-b from-[#fbcfe8] via-[#ec4899] to-[#9d174d] text-white",
  },
};

const LeagueCard: React.FC<LeagueCardProps> = ({
  icon: Icon,
  shortCode,
  title,
  subtitle,
  accent,
  points,
  navigateTo,
  flipText,
}) => {
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);
  const theme = accentMap[accent];

  const handleCardClick = () => {
    if (navigateTo) setFlipped((prev) => !prev);
  };

  const goToPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (navigateTo) navigate(navigateTo);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative min-h-[315px] ${navigateTo ? "cursor-pointer" : ""}`}
      style={{ perspective: "1200px" }}
    >
      <div
        className={`relative h-full min-h-[315px] transition-transform duration-700 [transform-style:preserve-3d] ${
          navigateTo ? "jpl-opening-flip" : ""
        } ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
      >
        <div
          className={`absolute inset-0 group overflow-hidden rounded-[26px] border border-white/80 bg-gradient-to-b ${theme.card} p-6 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_0_rgba(147,197,253,0.25),0_8px_0_rgba(147,197,253,0.28)] backdrop-blur-xl transition-all duration-300 [backface-visibility:hidden] [transform:perspective(900px)_rotateX(5deg)_rotateY(-4deg)] hover:-translate-y-1 hover:[transform:perspective(900px)_rotateX(2deg)_rotateY(0deg)]`}
        >
          <span className="pointer-events-none absolute -left-12 top-0 h-full w-10 rotate-12 bg-white/45 transition-all duration-700 group-hover:left-[120%]" />

          <div className="relative mb-6 flex items-start gap-4">
            <div
              className={`relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-b ${theme.icon} text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.45),inset_0_-3px_0_rgba(15,23,42,0.25),0_5px_0_rgba(15,23,42,0.18)]`}
            >
              <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/50 to-transparent" />
              <Icon className="relative h-6 w-6 shrink-0" />
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#64748b]">
                {shortCode}
              </p>
              <h3
                className={`mt-1 text-xl font-extrabold leading-tight ${theme.text}`}
              >
                {title}
              </h3>
              <p className="mt-1 text-sm leading-5 text-[#64748b]">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="relative space-y-4">
            {points.slice(0, 3).map((item, index) => {
              const PointIcon = item.icon;
              return (
                <div
                  key={index}
                  className="grid grid-cols-[38px_1fr] items-start gap-3"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/75 ${theme.text} shadow-sm`}
                  >
                    <PointIcon className="h-4 w-4 shrink-0" />
                  </div>
                  <p className="pt-1 text-sm leading-6 text-[#475569]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {navigateTo && (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[26px] border border-white/80 bg-gradient-to-b ${theme.card} p-6 text-center shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_0_rgba(147,197,253,0.25),0_8px_0_rgba(147,197,253,0.28)] [backface-visibility:hidden] [transform:rotateY(180deg)]`}
          >
            <span className="pointer-events-none absolute -left-12 top-0 h-full w-10 rotate-12 bg-white/45" />

            <div
              className={`relative mb-5 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-b ${theme.icon} text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.45),inset_0_-3px_0_rgba(15,23,42,0.25),0_5px_0_rgba(15,23,42,0.18)]`}
            >
              <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/50 to-transparent" />
              <Icon className="relative h-7 w-7 shrink-0" />
            </div>

            <h3 className={`text-2xl font-extrabold ${theme.text}`}>{title}</h3>

            <p className="mt-3 max-w-xs text-sm leading-6 text-[#64748b]">
              {flipText || "Go to this page for more details."}
            </p>

            <button
              onClick={goToPage}
              className={`group relative mt-6 inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl border px-5 py-3 text-sm font-extrabold shadow-[inset_0_2px_0_rgba(255,255,255,0.45),inset_0_-3px_0_rgba(15,23,42,0.18),0_5px_0_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-0.5 ${theme.button}`}
            >
              <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/45 to-transparent" />
              <span className="pointer-events-none absolute -left-10 top-0 h-full w-8 rotate-12 bg-white/35 transition-all duration-700 group-hover:left-[120%]" />
              <span className="relative flex items-center gap-2">
                Go to Page
                <ArrowRight className="h-4 w-4 shrink-0" />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ReferBuddySpecialCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="xl:col-span-3">
      <div className="relative overflow-hidden rounded-[30px] border border-[#0b1f5e]/20 bg-gradient-to-br from-[#ffffff] via-[#f7faff] to-[#e7efff] p-6 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-5px_0_rgba(11,31,94,0.16),0_14px_0_rgba(11,31,94,0.18),0_26px_55px_rgba(11,31,94,0.18)] transition-all duration-300 hover:-translate-y-1 sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#0b1f5e]/10 blur-2xl" />
        <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-blue-200/30 blur-2xl" />

        <div className="relative grid items-center gap-7 lg:grid-cols-[1fr_1.25fr_auto]">
          <div>

            <h3 className="mt-5 text-3xl font-black leading-tight text-[#0b1f5e] sm:text-4xl">
              Refer Buddy
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#475569] sm:text-base">
              Post job openings, track qualified candidates, receive resumes,
              update feedback, and earn referral rewards.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {referBuddyPoints.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.text}
                  className="rounded-[22px] border border-white bg-gradient-to-b from-white to-[#eef4ff] p-5 text-center shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-3px_0_rgba(11,31,94,0.12),0_8px_0_rgba(11,31,94,0.12),0_18px_30px_rgba(11,31,94,0.10)]"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b from-[#1d3fa3] to-[#0b1f5e] text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.35),0_8px_16px_rgba(11,31,94,0.24)]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <p className="mt-4 text-sm font-extrabold leading-6 text-[#0b1f5e]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate("/refer-buddy")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#1d3fa3] to-[#0b1f5e] px-6 py-3 text-sm font-extrabold text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.3),inset_0_-3px_0_rgba(0,0,0,0.25),0_8px_0_rgba(11,31,94,0.35),0_18px_30px_rgba(11,31,94,0.20)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Go to Page
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const LeagueHighlightsSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#f5f7f4] py-10 sm:py-12 lg:py-14">
      <style>
        {`
          @keyframes jplOpeningFlip {
            0% { transform: rotateY(0deg); }
            28% { transform: rotateY(-18deg); }
            55% { transform: rotateY(14deg); }
            78% { transform: rotateY(-7deg); }
            100% { transform: rotateY(0deg); }
          }

          .jpl-opening-flip {
            animation: jplOpeningFlip 1.45s ease-in-out 0.35s 1;
          }
        `}
      </style>

      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "78px 78px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
        <div className="mx-auto mb-8 grid max-w-6xl items-center gap-4 lg:grid-cols-[100px_1fr] lg:text-left">
          <div className="mx-auto flex items-center justify-center lg:mx-0">
            <img
              src={logoIcon}
              alt="JPL Logo"
              className="h-16 w-16 object-contain sm:h-48 sm:w-48 lg:h-60 lg:w-60"
            />
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-[2.15rem] font-black leading-tight text-[#0f172a] sm:text-[2.8rem] lg:text-[3.4rem]">
              Our Super Sixer Teams.
              <span className="block bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#f97316] bg-clip-text text-transparent">
                One Smart Hiring Ecosystem.
              </span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
          <LeagueCard
            icon={Crown}
            shortCode="RJS"
            title="Royal Job Seekers"
            subtitle="For candidates preparing to qualify"
            accent="purple"
            points={rjsPoints}
            navigateTo="/job-seekers"
            flipText="Explore Resume AI Score, JobFit AI Interview, skill-gap analysis, and AI-qualified opportunities."
          />

          <LeagueCard
            icon={Building2}
            shortCode="CC"
            title="Corporate Capitals"
            subtitle="For companies hiring qualified talent"
            accent="lightBlue"
            points={ccPoints}
            navigateTo="/employers"
            flipText="See how companies upload job positions and receive qualified AI-assessed profiles."
          />

          <LeagueCard
            icon={Brain}
            shortCode="JMK"
            title="Job Mentor Kings"
            subtitle="For expert mentoring and guidance"
            accent="orange"
            points={mkPoints}
            navigateTo="/mentors"
            flipText="See how AI mentors and human mentors guide job seekers."
          />

          <LeagueCard
            icon={Swords}
            shortCode="RKR"
            title="Recruitment Knight Riders"
            subtitle="For recruiters and consulting companies"
            accent="teal"
            points={ckrPoints}
            navigateTo="/recruitment-knight-riders"
            flipText="Manage sourcing, qualified profiles, and recruitment pipelines."
          />

          <LeagueCard
            icon={Bot}
            shortCode="TIG"
            title="Training Institute Giants"
            subtitle="For institutions and training platforms"
            accent="yellow"
            points={askPoints}
            navigateTo="/talent-super-kings"
            flipText="Manage students, AI exams, certifications, training workflows, and placement readiness."
          />

          <LeagueCard
            icon={Rocket}
            shortCode="MR"
            title="Marketplace Raisers"
            subtitle="For freelancers and open work"
            accent="pink"
            points={mrPoints}
            navigateTo="/marketplace-raisers"
            flipText="Explore freelancer profiles, rate cards, freelance jobs, and employer hiring opportunities."
          />

          <ReferBuddySpecialCard />
        </div>
      </div>
    </section>
  );
};

export default LeagueHighlightsSection;