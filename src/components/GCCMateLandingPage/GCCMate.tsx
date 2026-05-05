import React from "react";
import GCCMateHeader from "./GCCMateHeader";
import {
  Building2,
  Globe2,
  Landmark,
  Scale,
  Handshake,
  Crown,
  ShieldCheck,
  Users,
  BriefcaseBusiness,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const GCCMate: React.FC = () => {
  const ecosystem = [
    {
      icon: Globe2,
      title: "Foreign Companies",
      desc: "Enter India with structured setup, compliance, hiring and operational support.",
    },
    {
      icon: Handshake,
      title: "Indian Consulting Companies",
      desc: "Connect with trusted advisory, technology, HR and execution partners.",
    },
    {
      icon: Scale,
      title: "Law Firms",
      desc: "Manage entity formation, agreements, regulatory documentation and legal support.",
    },
    {
      icon: Landmark,
      title: "Government Support",
      desc: "Navigate approvals, incentives, state policies and business enablement channels.",
    },
    {
      icon: Building2,
      title: "GCC Platform",
      desc: "A single operating layer for setup, hiring, payroll, compliance and growth.",
    },
    {
      icon: Crown,
      title: "Premium Networks",
      desc: "Access high-value business relationships, leadership connects and regional networks.",
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

  const highlights = [
    { value: "360°", label: "GCC Setup Support" },
    { value: "AI+", label: "Smart Execution Layer" },
    { value: "India", label: "Premium Partner Network" },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#080211] text-white">
      <GCCMateHeader />

      <style>{`
        @keyframes floatGlowOne {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(90px, 70px, 0) scale(1.18); }
        }

        @keyframes floatGlowTwo {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-90px, 80px, 0) scale(1.15); }
        }

        @keyframes floatGlowThree {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(70px, -80px, 0) scale(1.2); }
        }

        @keyframes softPulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.85; }
        }

        .gcc-glow-one {
          animation: floatGlowOne 12s ease-in-out infinite;
        }

        .gcc-glow-two {
          animation: floatGlowTwo 14s ease-in-out infinite;
        }

        .gcc-glow-three {
          animation: floatGlowThree 16s ease-in-out infinite;
        }

        .gcc-pulse {
          animation: softPulse 6s ease-in-out infinite;
        }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-10 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#34106B_0%,#160629_42%,#080211_82%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:58px_58px]" />

        <div className="gcc-glow-one absolute left-[8%] top-[12%] h-[380px] w-[380px] rounded-full bg-[#5B2EFF]/25 blur-[120px]" />
        <div className="gcc-glow-two absolute right-[8%] top-[20%] h-[360px] w-[360px] rounded-full bg-[#D4AF37]/18 blur-[120px]" />
        <div className="gcc-glow-three absolute bottom-[-120px] left-[40%] h-[420px] w-[420px] rounded-full bg-[#8A5BFF]/22 blur-[130px]" />

        <div className="gcc-pulse absolute left-12 top-40 h-24 w-24 rounded-full border border-[#D4AF37]/20" />
        <div className="gcc-pulse absolute bottom-28 right-16 h-28 w-28 rounded-full border border-[#8A5BFF]/20" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-5 py-2">
              <Sparkles size={15} className="text-[#F5C842]" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#F5C842]">
                GCC Mate
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Build Your{" "}
              <span className="bg-gradient-to-r from-[#F5C842] via-[#D4AF37] to-[#FFE18A] bg-clip-text text-transparent">
                Global Capability Center
              </span>{" "}
              in India.
            </h1>

            <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-[#EDE7FF]">
              GCC Mate helps foreign companies launch, hire, comply, operate and
              scale in India through one premium partner ecosystem.
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              We connect consulting companies, law firms, government support,
              Indian business networks and workforce teams into one powerful
              execution platform.
            </p>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl"
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

          {/* RIGHT CARD */}
          <div className="relative rounded-[2rem] border border-[#D4AF37]/20 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#D4AF37]/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#5B2EFF]/20 blur-3xl" />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5C842]">
                    Platform Focus
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-white">
                    From Scratch to Scale
                  </h3>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/15 text-[#F5C842]">
                  <BriefcaseBusiness size={26} />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: Building2,
                    title: "Setup",
                    desc: "Entity, office, vendors and operational foundation.",
                  },
                  {
                    icon: Users,
                    title: "Hire",
                    desc: "Talent sourcing, onboarding and workforce management.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Comply",
                    desc: "Legal, statutory, payroll and governance support.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-[#120628]/80 p-5"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5B2EFF]/25 text-[#F5C842]">
                          <Icon size={21} />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-white">
                            {item.title}
                          </h4>
                          <p className="mt-1 text-sm leading-6 text-white/60">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section
        id="ecosystem"
        className="relative px-4 py-16 sm:px-6 lg:px-10 lg:py-24"
      >
        <div className="gcc-glow-two absolute right-[-160px] top-10 h-[320px] w-[320px] rounded-full bg-[#D4AF37]/10 blur-[120px]" />
        <div className="gcc-glow-one absolute left-[-160px] bottom-0 h-[320px] w-[320px] rounded-full bg-[#5B2EFF]/18 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.25em] text-[#F5C842]">
              Ecosystem
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              One platform for every GCC requirement.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/65">
              GCC Mate brings the right partners together so companies can enter
              India with clarity, speed and confidence.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ecosystem.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group rounded-[2rem] border border-white/10 bg-[#120628]/90 p-6 backdrop-blur-xl transition hover:-translate-y-2 hover:border-[#D4AF37]/40 hover:bg-[#18083A] hover:shadow-2xl hover:shadow-[#5B2EFF]/15"
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
      <section className="relative overflow-hidden bg-[#120628] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="gcc-glow-three absolute right-[15%] top-[-130px] h-[360px] w-[360px] rounded-full bg-[#8A5BFF]/18 blur-[120px]" />
        <div className="gcc-glow-two absolute bottom-[-140px] left-[8%] h-[340px] w-[340px] rounded-full bg-[#D4AF37]/10 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.25em] text-[#F5C842]">
              Services
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              GCC setup, payroll and operations under one roof.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/65">
              From planning to daily operations, GCC Mate gives companies a
              structured execution layer backed by trusted local expertise.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl"
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

      {/* FINAL INFO SECTION */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-10">
        <div className="gcc-glow-one absolute left-1/2 top-0 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#5B2EFF]/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#D4AF37]/25 bg-gradient-to-br from-[#3D0B7A] via-[#18083A] to-[#090316] p-8 text-center shadow-2xl shadow-[#5B2EFF]/20 sm:p-12">
          <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:42px_42px]" />
          <div className="gcc-glow-two absolute right-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-[#D4AF37]/12 blur-[100px]" />

          <div className="relative">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.25em] text-[#F5C842]">
              Premium GCC Execution
            </p>

            <h2 className="mx-auto max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl">
              A trusted ecosystem for setup, legal, compliance, hiring, payroll
              and operations in India.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              GCC Mate brings structure, speed and partner strength to global
              companies building long-term capability centers in India.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GCCMate;