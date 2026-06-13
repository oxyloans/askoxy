import React, { useEffect } from "react";
import GCCMateHeader from "./GCCMateHeader";
import heroImage from "../../assets/img/gcc1.png";
import {
  Building2,
  Globe2,
  Landmark,
  Scale,
  Handshake,
  Crown,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const GCCMate: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const highlights = [
    { value: "360°", label: "GCC Setup Support" },
    { value: "AI+", label: "Smart Execution Layer" },
    { value: "India", label: "Premium Partner Network" },
  ];

  const ecosystem = [
    {
      icon: Globe2,
      title: "Foreign Companies",
      desc: "Launch and operate in India with structured setup, hiring, compliance and execution support.",
    },
    {
      icon: Handshake,
      title: "Consulting Companies",
      desc: "Connect with premium advisory, strategy, HR, technology and operating partners.",
    },
    {
      icon: Scale,
      title: "Law Firms",
      desc: "Manage legal setup, entity formation, contracts, regulatory and compliance documentation.",
    },
    {
      icon: Landmark,
      title: "Government Support",
      desc: "Navigate approvals, incentives, policies, state support and business facilitation.",
    },
    {
      icon: Building2,
      title: "Indian Business Networks",
      desc: "Access trusted business communities, leadership networks and local ecosystem partners.",
    },
    {
      icon: Crown,
      title: "Workforce Teams",
      desc: "Hire, onboard and manage skilled India-based teams for long-term GCC operations.",
    },
  ];

  const services = [
    "GCC strategy & roadmap",
    "Company registration support",
    "Legal and compliance setup",
    "Talent hiring support",
    "Payroll and HR operations",
    "Office and vendor coordination",
    "Government liaison support",
    "Ongoing managed operations",
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#080211] text-white">
      <GCCMateHeader />

      <style>{`
        @keyframes floatGlowOne {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(70px, 60px, 0) scale(1.15); }
        }

        @keyframes floatGlowTwo {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-70px, 70px, 0) scale(1.12); }
        }

        .gcc-glow-one { animation: floatGlowOne 12s ease-in-out infinite; }
        .gcc-glow-two { animation: floatGlowTwo 14s ease-in-out infinite; }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-10 lg:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#34106B_0%,#160629_42%,#080211_84%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:54px_54px]" />

        <div className="gcc-glow-one absolute left-[5%] top-[10%] h-[360px] w-[360px] rounded-full bg-[#5B2EFF]/25 blur-[120px]" />
        <div className="gcc-glow-two absolute right-[6%] top-[18%] h-[360px] w-[360px] rounded-full bg-[#D4AF37]/18 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-5 py-2 shadow-lg shadow-[#D4AF37]/10">
              <Sparkles size={15} className="text-[#F5C842]" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#F5C842]">
                GCC Mate
              </span>
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:mx-0 lg:text-6xl">
              Build Your Global Capability Center{" "}
              <span className="bg-gradient-to-r from-[#F5C842] via-[#D4AF37] to-[#FFE18A] bg-clip-text text-transparent">
                in India.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-8 text-[#EDE7FF] sm:text-lg lg:mx-0">
              GCC Mate helps foreign companies launch, hire, comply, operate and
              scale in India through one premium partner ecosystem.
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base lg:mx-0">
              We connect consulting companies, law firms, government support,
              Indian business networks and workforce teams into one powerful
              execution platform.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-center backdrop-blur-xl transition hover:border-[#D4AF37]/30 hover:bg-white/[0.09] lg:text-left"
                >
                  <p className="text-2xl font-black text-[#F5C842]">
                    {item.value}
                  </p>
                  <p className="mt-2 text-xs font-medium leading-5 text-white/65">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="absolute -top-10 right-4 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-[130px]" />
            <div className="absolute bottom-0 left-4 h-72 w-72 rounded-full bg-[#5B2EFF]/30 blur-[140px]" />

            <div className="relative z-10 w-full max-w-[760px] rounded-[36px] border border-[#D4AF37]/20 bg-gradient-to-br from-white/[0.12] via-white/[0.04] to-white/[0.02] p-3 shadow-[0_35px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-4">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#120628]/60">
                <img
                  src={heroImage}
                  alt="GCC Mate India global capability center ecosystem"
                  loading="eager"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section id="ecosystem" className="relative px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl text-center lg:text-left">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.25em] text-[#F5C842]">
              Partner Ecosystem
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              One powerful execution platform for India GCC growth.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/65">
              GCC Mate brings setup, advisory, legal, government, workforce and
              operations partners together for smooth GCC execution.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ecosystem.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group rounded-[2rem] border border-white/10 bg-[#120628]/90 p-6 backdrop-blur-xl transition hover:-translate-y-2 hover:border-[#D4AF37]/40 hover:bg-[#18083A]"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/12 text-[#F5C842] transition group-hover:bg-[#D4AF37] group-hover:text-[#120628]">
                    <Icon size={24} />
                  </div>
                  <h3 className="mb-3 text-lg font-extrabold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-7 text-white/60">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="relative overflow-hidden bg-[#120628] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="text-center lg:text-left">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.25em] text-[#F5C842]">
              GCC Services
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Launch, hire, comply, operate and scale in India.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/65">
              From first strategy call to daily operations, GCC Mate gives global
              companies a premium execution layer in India.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl transition hover:border-[#D4AF37]/35 hover:bg-white/[0.08]"
              >
                <CheckCircle2 size={20} className="shrink-0 text-[#F5C842]" />
                <p className="text-sm font-semibold leading-6 text-[#EDE7FF]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#D4AF37]/25 bg-gradient-to-br from-[#3D0B7A] via-[#18083A] to-[#090316] p-8 text-center shadow-2xl shadow-[#5B2EFF]/20 sm:p-12">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.25em] text-[#F5C842]">
            Premium GCC Execution
          </p>
          <h2 className="mx-auto max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl">
            Build your India GCC with clarity, speed and trusted execution.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            One premium partner ecosystem for setup, legal, compliance, hiring,
            payroll, operations and long-term growth.
          </p>
        </div>
      </section>
    </div>
  );
};

export default GCCMate;