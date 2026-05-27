import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Menu,
  X,
  Blocks,
  Building2,
  Coins,
  ShieldCheck,
  TrendingUp,
  Users,
  Search,
  Handshake,
  BarChart3,
  BadgeCheck,
  Landmark,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import askoxyLogo from "../assets/img/askoxylogonew.png";

const oxybricks = "https://i.ibb.co/mVxsVSmY/oxybricks.png";
const oxybricksLogo = "https://i.ibb.co/k2snG0YW/l3.png";

const platformUrl = "https://www.oxybricks.world/";
const platformRedirectPath = "/platform-redirect?target=oxybricks";

export default function OxyBricksFractionalPage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const goToLoginFirst = () => {
    const currentPage = window.location.pathname + window.location.search;

    const accessToken =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("accessToken");

    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="));

    const isLoggedIn = Boolean(accessToken || cookieToken);

    if (isLoggedIn) {
      window.location.href = platformUrl;
      return;
    }

    sessionStorage.setItem("redirectPath", platformRedirectPath);
    sessionStorage.setItem("platformRedirectUrl", platformUrl);
    localStorage.setItem("platformRedirectUrl", platformUrl);
    sessionStorage.setItem("loginCloseReturnPath", currentPage);

    navigate("/whatsapplogin", {
      state: {
        from: platformRedirectPath,
        closeReturnPath: currentPage,
      },
    });
  };

  const features = [
    {
      title: "Lands & Buildings",
      desc: "Invest in real estate assets through fractional ownership.",
      icon: Building2,
    },
    {
      title: "Gold & Silver",
      desc: "Access asset-backed opportunities in gold and silver.",
      icon: Coins,
    },
    {
      title: "Blockchain Transparency",
      desc: "Transactions are recorded with better transparency.",
      icon: Blocks,
    },
    {
      title: "LLP Partnership",
      desc: "Participants can become partners in structured ownership.",
      icon: Users,
    },
    {
      title: "Realization Options",
      desc: "Monthly or yearly realization options based on asset plans.",
      icon: TrendingUp,
    },
    {
      title: "Trusted Framework",
      desc: "Built for accountable and transparent asset participation.",
      icon: ShieldCheck,
    },
  ];

  const steps = [
    {
      no: "01",
      title: "Explore Assets",
      desc: "Browse available lands, buildings, gold and silver opportunities.",
      btn: "Explore Now",
      icon: Search,
    },
    {
      no: "02",
      title: "Choose & Partner",
      desc: "Review details, select your amount and confirm participation.",
      btn: "Get Started",
      icon: Handshake,
    },
    {
      no: "03",
      title: "Track Growth",
      desc: "Track your ownership and realization details from the dashboard.",
      btn: "View Dashboard",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(244,163,0,0.25),transparent),linear-gradient(180deg,#050505_0%,#07145F_50%,#050505_100%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(244,163,0,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(244,163,0,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <header className="fixed left-0 top-0 z-[999] w-full border-b border-slate-200 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <img
              src={askoxyLogo}
              alt="AskOxy Logo"
              className="h-9 w-auto cursor-pointer object-contain sm:h-10"
              onClick={() => navigate("/")}
            />

            <button type="button" onClick={goToLoginFirst}>
              <img
                src={oxybricksLogo}
                alt="OXYBRICKS Logo"
                className="h-11 w-auto object-contain sm:h-14 md:h-16"
              />
            </button>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <button
              onClick={goToLoginFirst}
              className="rounded-full bg-gradient-to-r from-[#F4A300] to-[#FFCC66] px-6 py-3 text-sm font-extrabold text-black shadow-[0_10px_30px_rgba(244,163,0,0.35)] transition hover:scale-[1.03]"
            >
              Get Started
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0B1E8A] shadow-sm md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <button
              onClick={goToLoginFirst}
              className="w-full rounded-2xl bg-gradient-to-r from-[#F4A300] to-[#FFCC66] px-6 py-3 text-sm font-extrabold text-black shadow-lg"
            >
              Get Started
            </button>
          </div>
        )}
      </header>

      <main className="pt-[78px]">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#050505] via-[#07145F] to-[#0B1E8A] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="absolute right-[-140px] top-[-120px] h-[420px] w-[420px] rounded-full bg-[#F4A300]/20 blur-[120px]" />
          <div className="absolute bottom-[-140px] left-[-120px] h-[420px] w-[420px] rounded-full bg-[#0B1E8A]/40 blur-[140px]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#F4A300]/30 bg-white/10 px-4 py-2 text-sm font-bold text-[#FFCC66] backdrop-blur-xl">
                <BadgeCheck className="h-4 w-4 text-[#F4A300]" />
                Blockchain Powered Fractional Ownership
              </div>

              <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Fractional Investment in{" "}
                <span className="block bg-gradient-to-r from-[#F4A300] to-[#FFCC66] bg-clip-text text-transparent">
                  Lands, Buildings, Gold & Silver
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg lg:mx-0">
                OXYBRICKS enables fractional participation in real estate,
                gold and silver assets through a transparent digital platform.
              </p>

              <div className="mt-7 rounded-[28px] border border-[#F4A300]/25 bg-white/10 p-5 shadow-[0_0_40px_rgba(11,30,138,0.35)] backdrop-blur-xl sm:max-w-xl lg:mx-0">
                <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                  You Partner
                </h2>
                <h2 className="mt-1 text-2xl font-extrabold text-[#FFCC66] sm:text-3xl">
                  OXYBRICKS Does the Rest
                </h2>
              </div>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <button
                  onClick={goToLoginFirst}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F4A300] to-[#FFCC66] px-7 py-3.5 text-sm font-extrabold text-black shadow-[0_10px_34px_rgba(244,163,0,0.38)] transition hover:scale-[1.03] sm:w-auto"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/10 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-5">
                <div className="relative overflow-hidden rounded-[28px] border border-[#F4A300]/15 bg-gradient-to-br from-[#050505] via-[#07145F] to-[#0B1E8A] p-4 sm:p-6">
                  <img
                    src={oxybricks}
                    alt="OXYBRICKS fractional investment"
                    className="mx-auto h-auto w-full max-w-[440px] object-contain drop-shadow-[0_24px_45px_rgba(244,163,0,0.20)] sm:max-w-[500px] lg:max-w-[560px]"
                    loading="eager"
                  />

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/70 p-4 text-white shadow-lg">
                      <Landmark className="h-8 w-8 text-[#F4A300]" />
                      <h3 className="mt-3 text-lg font-extrabold">
                        Real Estate
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-300">
                        Lands and buildings ownership opportunities.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-[#F4A300] to-[#FFCC66] p-4 text-black shadow-lg">
                      <Coins className="h-8 w-8" />
                      <h3 className="mt-3 text-lg font-extrabold">
                        Gold & Silver
                      </h3>
                      <p className="mt-1 text-xs font-semibold leading-5 text-black/75">
                        Asset-backed participation options.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-wider text-[#FFCC66]">
              Platform Benefits
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Smart Asset Ownership for Everyone
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              Participate in real-world assets with a clear, simple and
              transparent digital process.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(11,30,138,0.18)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#F4A300]/35 hover:shadow-[0_22px_55px_rgba(244,163,0,0.14)]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B1E8A] to-[#07145F] text-[#FFCC66] shadow-lg ring-1 ring-[#F4A300]/20">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-xl font-extrabold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-[#07145F]/40 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-extrabold uppercase tracking-wider text-[#FFCC66]">
                Simple Process
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                Easy to Get Started
              </h2>

              <p className="mt-4 text-base leading-8 text-slate-300">
                Explore assets, choose your participation and track everything
                from one platform.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.no}
                    className="rounded-[30px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-7 shadow-[0_16px_45px_rgba(0,0,0,0.22)] backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-gradient-to-r from-[#F4A300] to-[#FFCC66] px-4 py-2 text-sm font-extrabold text-black">
                        Step {step.no}
                      </span>

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B1E8A] to-[#07145F] text-[#FFCC66] ring-1 ring-[#F4A300]/20">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>

                    <h3 className="mt-6 text-2xl font-extrabold text-white">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {step.desc}
                    </p>

                    <button
                      onClick={goToLoginFirst}
                      className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#F4A300] to-[#FFCC66] px-5 py-3 text-sm font-extrabold text-black transition hover:scale-[1.03]"
                    >
                      {step.btn}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[40px] border border-[#F4A300]/20 bg-gradient-to-br from-[#050505] via-[#07145F] to-[#0B1E8A] p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:p-10 lg:p-14">
            <div className="absolute right-[-120px] top-[-120px] h-96 w-96 rounded-full bg-[#F4A300]/20 blur-[100px]" />

            <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-wider text-[#FFCC66]">
                  Why Blockchain?
                </p>

                <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                  Transparent Digital Asset Participation
                </h2>

                <p className="mt-5 text-base leading-8 text-slate-300">
                  Blockchain improves clarity across ownership records,
                  transactions and asset participation workflows.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  "Choose your asset category",
                  "Select your participation amount",
                  "Complete digital onboarding",
                  "Track records transparently",
                  "Manage growth from dashboard",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#F4A300] to-[#FFCC66] text-sm font-extrabold text-black">
                      {index + 1}
                    </span>
                    <p className="text-sm font-semibold text-white">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}