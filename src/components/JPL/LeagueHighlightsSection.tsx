import React from "react";
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
  TrendingUp,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";

const rjsPoints = [
  { icon: Search, text: "Search the right job role" },
  { icon: Upload, text: "Upload resume for AI review" },
  { icon: ClipboardCheck, text: "Take AI-based JD exam" },
  { icon: BadgeCheck, text: "Qualify for referral opportunities" },
];

const ccPoints = [
  { icon: Building2, text: "Hire qualified candidates faster" },
  { icon: Briefcase, text: "Get role-based matched profiles" },
  { icon: CheckCircle, text: "Receive AI-evaluated candidates" },
  { icon: TrendingUp, text: "Improve hiring quality and speed" },
];

const mkPoints = [
  { icon: Brain, text: "Human mentoring from 15+ years experts" },
  { icon: Users, text: "Guidance in BFSI and technologies" },
  { icon: Lightbulb, text: "Improve candidate readiness and confidence" },
];

const ckrPoints = [
  { icon: Swords, text: "Employee referrals for qualified candidates" },
  { icon: UserCheck, text: "Connect the right talent to the right company" },
  { icon: ShieldCheck, text: "Refer with more trust and confidence" },
];

const askPoints = [
  { icon: Bot, text: "AI-powered JD and resume matching" },
  { icon: FileText, text: "AI-based exam evaluation system" },
  { icon: BadgeCheck, text: "Skill validation before referral" },
];

const mrPoints = [
  { icon: Rocket, text: "One hiring and referral marketplace" },
  { icon: Users, text: "Job seekers, companies, mentors, referrers together" },
  { icon: TrendingUp, text: "Build a stronger career ecosystem" },
];

type PointItem = {
  icon: React.ElementType;
  text: string;
};

type LeagueCardProps = {
  icon: React.ElementType;
  shortCode: string;
  title: string;
  subtitle: string;
  titleColor: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  points: PointItem[];
};

const LeagueCard: React.FC<LeagueCardProps> = ({
  icon: Icon,
  shortCode,
  title,
  subtitle,
  titleColor,
  iconBg,
  iconColor,
  borderColor,
  points,
}) => {
  return (
    <div
      className={`relative rounded-[24px] border bg-white/70 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl ${borderColor}`}
    >
      <div className="mb-5 flex items-center gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#64748b]">
            {shortCode}
          </p>
          <h3 className={`mt-1 text-xl font-extrabold ${titleColor}`}>
            {title}
          </h3>
          <p className="mt-1 text-sm text-[#64748b]">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-4">
        {points.map((item, index) => {
          const PointIcon = item.icon;
          return (
            <div key={index} className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg} ${iconColor}`}
              >
                <PointIcon className="h-4 w-4" />
              </div>
              <p className="text-sm leading-6 text-[#475569]">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LeagueHighlightsSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#f5f7f4] py-16 sm:py-20 lg:py-24">
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

      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#60a5fa]/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-64 w-64 rounded-full bg-[#fb923c]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[#facc15]/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#2563eb]">
            JPL League System
          </p>
          <h2 className="mt-4 text-[2rem] font-extrabold leading-tight text-[#0f172a] sm:text-[2.5rem] lg:text-[3rem]">
            Six powerful leagues. One smart hiring ecosystem.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#64748b] sm:text-base">
            Jobs Premier League connects job seekers, companies, mentors,
            employee referrals, AI qualification, and marketplace growth in one
            structured system.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <LeagueCard
            icon={Crown}
            shortCode="RJS"
            title="Royal Job Seekers"
            subtitle="For candidates preparing to qualify and get referred"
            titleColor="text-[#2563eb]"
            iconBg="bg-[#dbeafe]"
            iconColor="text-[#2563eb]"
            borderColor="border-[#bfdbfe]"
            points={rjsPoints}
          />

          <LeagueCard
            icon={Building2}
            shortCode="CC"
            title="Company Capitals"
            subtitle="For companies hiring qualified candidates"
            titleColor="text-[#f97316]"
            iconBg="bg-[#ffedd5]"
            iconColor="text-[#f97316]"
            borderColor="border-[#fed7aa]"
            points={ccPoints}
          />

          <LeagueCard
            icon={Brain}
            shortCode="MK"
            title="Mentor Kings"
            subtitle="For expert human mentoring and career guidance"
            titleColor="text-[#8b5cf6]"
            iconBg="bg-[#ede9fe]"
            iconColor="text-[#8b5cf6]"
            borderColor="border-[#ddd6fe]"
            points={mkPoints}
          />

          <LeagueCard
            icon={Swords}
            shortCode="CKR"
            title="Champion Knight Riders"
            subtitle="For referrals and talent champions"
            titleColor="text-[#0f766e]"
            iconBg="bg-[#ccfbf1]"
            iconColor="text-[#0f766e]"
            borderColor="border-[#99f6e4]"
            points={ckrPoints}
          />

          <LeagueCard
            icon={Bot}
            shortCode="ASK"
            title="AI Super Kings"
            subtitle="For AI-powered qualification and skill validation"
            titleColor="text-[#eab308]"
            iconBg="bg-[#fef9c3]"
            iconColor="text-[#ca8a04]"
            borderColor="border-[#fde68a]"
            points={askPoints}
          />

          <LeagueCard
            icon={Rocket}
            shortCode="MR"
            title="Marketplace Raisers"
            subtitle="For ecosystem growth and marketplace expansion"
            titleColor="text-[#ec4899]"
            iconBg="bg-[#fce7f3]"
            iconColor="text-[#db2777]"
            borderColor="border-[#fbcfe8]"
            points={mrPoints}
          />
        </div>
      </div>
    </section>
  );
};

export default LeagueHighlightsSection;