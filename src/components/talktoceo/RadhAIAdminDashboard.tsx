import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Bot,
  ShieldCheck,
  Zap,
  Globe,
  Activity,
  Cpu,
  Brain,
  Newspaper,
  ArrowRight,
} from "lucide-react";
import Swal from "sweetalert2";

import SidebarLayout from "./SidebarLayout";
import RadhAICloneAdminPage from "./RadhAICloneAdminPage";
import RadhAIRAndDPage from "./RadhAIRAndDPage";
import PaperClippingPage from "./PaperClippingPage";
import MyGooglePage from "./MyGooglePage";

const STATIC_USERNAME = "radhAI.clone";
const STATIC_PASSWORD = "ceovoice";

export default function RadhAIAdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("radhAIAdminLogin") === "true"
  );

  if (!isLoggedIn) {
    return <AdminLoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Routes>
      <Route element={<SidebarLayout onLogout={() => setIsLoggedIn(false)} />}>
        <Route index element={<Navigate to="voice-clone" replace />} />
        <Route path="voice-clone" element={<RadhAICloneAdminPage />} />
        <Route path="research-development" element={<RadhAIRAndDPage />} />
        <Route path="paper-clipping" element={<PaperClippingPage />} />
        <Route path="my-google" element={<MyGooglePage />} />
        <Route path="*" element={<Navigate to="voice-clone" replace />} />
      </Route>
    </Routes>
  );
}

const MODULES = [
  {
    icon: Bot,
    label: "Radha's Input",
    desc: "CEO input, content creation & clone workflow",
    accent: "#5EDDF2",
  },
  {
    icon: Brain,
    label: "R&D Video Upload",
    desc: "Upload video, analyze reasoning & publish blog",
    accent: "#B6F269",
  },
  {
    icon: Globe,
    label: "Google Workspace",
    desc: "Coming soon · Disabled",
    accent: "#75E6C9",
  },
  {
    icon: Newspaper,
    label: "Paper Clipping AI",
    desc: "Paper clipping analysis & blog workflow",
    accent: "#A78BFA",
  },
];

function AdminLoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (username.trim() === STATIC_USERNAME && password === STATIC_PASSWORD) {
      setLoading(true);
      sessionStorage.setItem("radhAIAdminLogin", "true");
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Access granted — welcome back",
        timer: 1800,
        showConfirmButton: false,
        background: "#07111f",
        color: "#ffffff",
      });
      setTimeout(() => onLogin(), 400);
      return;
    }

    setShaking(true);
    setTimeout(() => setShaking(false), 600);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: "Invalid credentials",
      timer: 2200,
      showConfirmButton: false,
      background: "#07111f",
      color: "#ffffff",
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050810] text-white">
      {/* Layered ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(94,221,242,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_80%,rgba(182,242,105,0.08),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_90%,rgba(167,139,250,0.07),transparent_35%)]" />
      </div>

      {/* Fine grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#5EDDF2_1px,transparent_1px),linear-gradient(to_bottom,#5EDDF2_1px,transparent_1px)] bg-[size:36px_36px]" />

      {/* Floating orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-cyan-400/5 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-56 w-56 rounded-full bg-lime-300/5 blur-[70px]" />

      <main className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl">

          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-4 py-1.5 text-[11px] font-bold tracking-widest text-cyan-200 uppercase">
              <ShieldCheck size={12} /> Restricted Admin Portal
            </span>
          </div>

          <section className="overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.03] shadow-[0_40px_120px_rgba(0,0,0,0.6)] backdrop-blur-3xl lg:grid lg:grid-cols-[1.2fr_0.8fr]">

            {/* ─── LEFT PANEL ─── */}
            <div className="relative hidden overflow-hidden border-r border-white/[0.07] p-10 lg:flex lg:flex-col">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(94,221,242,0.07),transparent_55%)]" />

              {/* Brand */}
              <div className="relative mb-10 flex items-center gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] text-black shadow-[0_0_32px_rgba(94,221,242,0.30)]">
                  <Bot size={26} />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#B6F269] shadow-[0_0_8px_rgba(182,242,105,0.8)]">
                    <Zap size={9} className="text-black" />
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight">radhAI Admin</h1>
                  <p className="text-[11px] font-medium text-slate-400 tracking-wide">
                    CEO Input Control Center
                  </p>
                </div>
              </div>

              <h2 className="relative mb-3 text-[2.6rem] font-black leading-[1.12] tracking-tight text-white">
                One dashboard.<br />
                <span className="bg-gradient-to-r from-[#5EDDF2] to-[#B6F269] bg-clip-text text-transparent">
                  Total control.
                </span>
              </h2>
              <p className="relative mb-10 text-sm leading-7 text-slate-400">
                Voice clone, R&D publishing, paper analysis and Google workspace — all managed from a single secure interface.
              </p>

              {/* Module cards */}
              <div className="relative mt-auto grid gap-2.5">
                {MODULES.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.label}
                      className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 transition-all hover:border-white/10 hover:bg-white/[0.06]"
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: `${m.accent}18`, color: m.accent }}
                      >
                        <Icon size={16} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white">{m.label}</p>
                        <p className="truncate text-[11px] text-slate-500">{m.desc}</p>
                      </div>
                      <ArrowRight size={13} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── RIGHT PANEL ─── */}
            <div className="flex flex-col justify-center p-8 sm:p-10">

              {/* Mobile brand */}
              <div className="mb-8 text-center lg:hidden">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] text-black shadow-[0_0_28px_rgba(94,221,242,0.28)]">
                  <Bot size={26} />
                </div>
                <h1 className="text-xl font-black">radhAI Admin</h1>
                <p className="mt-1 text-xs text-slate-400">CEO Input Control Center</p>
              </div>

              {/* Login card */}
              <div className="rounded-[26px] border border-white/[0.09] bg-white/[0.04] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-300/10">
                    <Lock size={13} className="text-cyan-300" />
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                    Secure Access
                  </p>
                </div>
                <h2 className="mt-3 text-2xl font-black tracking-tight">Sign in</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Admin credentials required to continue.
                </p>

                <div
                  className="mt-7 space-y-3"
                  style={shaking ? { animation: "shake 0.5s ease-in-out" } : {}}
                >
                  {/* Username */}
                  <div className="group relative">
                    <User
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-cyan-300"
                      size={15}
                    />
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      autoComplete="username"
                      className="h-12 w-full rounded-2xl border border-white/[0.08] bg-white/[0.05] pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-300/40 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(94,221,242,0.08)]"
                    />
                  </div>

                  {/* Password */}
                  <div className="group relative">
                    <Lock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-cyan-300"
                      size={15}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && login()}
                      placeholder="Password"
                      autoComplete="current-password"
                      className="h-12 w-full rounded-2xl border border-white/[0.08] bg-white/[0.05] pl-10 pr-11 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-300/40 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(94,221,242,0.08)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={login}
                    disabled={loading}
                    className="group relative h-12 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#5EDDF2] to-[#B6F269] text-sm font-black text-black shadow-[0_8px_28px_rgba(94,221,242,0.28)] transition hover:brightness-110 hover:shadow-[0_12px_36px_rgba(94,221,242,0.40)] active:scale-[0.98] disabled:opacity-70"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <ShieldCheck size={15} />
                      {loading ? "Authenticating..." : "Enter Admin Dashboard"}
                    </span>
                  </button>
                </div>

                <p className="mt-6 text-center text-[10px] text-slate-600">
                  Protected by radhAI · CEO-only access
                </p>
              </div>

              {/* Mobile module list */}
              <div className="mt-5 grid gap-2 lg:hidden">
                {MODULES.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.label}
                      className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5"
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: `${m.accent}18`, color: m.accent }}
                      >
                        <Icon size={15} />
                      </span>
                      <p className="text-xs font-bold text-slate-300">{m.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <p className="mt-6 text-center text-[11px] text-slate-700">
            © {new Date().getFullYear()} radhAI · All rights reserved
          </p>
        </div>
      </main>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          15%{transform:translateX(-6px)}
          30%{transform:translateX(6px)}
          45%{transform:translateX(-5px)}
          60%{transform:translateX(5px)}
          75%{transform:translateX(-3px)}
          90%{transform:translateX(3px)}
        }
      `}</style>
    </div>
  );
}
