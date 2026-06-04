import React, { useState } from "react";
import { Routes, Route,Navigate, useNavigate } from "react-router-dom";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Bot,
  ShieldCheck,
  Zap,
  Globe,
  Brain,
  Newspaper,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Swal from "sweetalert2";

import SidebarLayout from "./SidebarLayout";
import RadhAICloneAdminPage from "./RadhAICloneAdminPage";
import RadhAIRAndDPage from "./RadhAIRAndDPage";
import PaperClippingPage from "./PaperClippingPage";
import MyGooglePage from "./MyGooglePage";
import { message,Modal } from "antd";



export default function RadhAIAdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("radhAIAdminLogin") === "true"
  );

  const navigate = useNavigate();

  if (!isLoggedIn) {
    return <AdminLoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const logout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    navigate("/radhai-admin", { replace: true });
  }

  return (
    <Routes>
      <Route element={<SidebarLayout onLogout={logout} />}>
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
    accent: "#1d4ed8",
    bg: "#dbeafe",
    border: "#93c5fd",
    text: "#1e40af",
  },
  {
    icon: Brain,
    label: "R&D Video Upload",
    desc: "Upload video, analyze reasoning & publish blog",
    accent: "#15803d",
    bg: "#dcfce7",
    border: "#86efac",
    text: "#166534",
  },
  {
    icon: Globe,
    label: "Google Workspace",
    desc: "Coming soon · Disabled",
    accent: "#c2410c",
    bg: "#ffedd5",
    border: "#fdba74",
    text: "#9a3412",
  },
  {
    icon: Newspaper,
    label: "Paper Clipping AI",
    desc: "Paper clipping analysis & blog workflow",
    accent: "#6d28d9",
    bg: "#ede9fe",
    border: "#c4b5fd",
    text: "#5b21b6",
  },
];

function AdminLoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://meta.oxyloans.com/api/user-service/userEmailPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username.trim(), password }),
      });
      const data = await res.json();
      if (data.status === "Login Successful" && data.accessToken) {
        sessionStorage.setItem("radhAIAdminLogin", "true");
        sessionStorage.setItem("accessToken", data.accessToken);
        if(data.primaryType === "SALESSUPPERADMIN") {
        Swal.fire({
          toast: true, position: "top-end", icon: "success",
          title: "Access granted — welcome back",
          timer: 1800, showConfirmButton: false,
          background: "#f0fdf4", color: "#166534",
          customClass: { container: "!top-[60px]" },
        })
        setTimeout(() => onLogin(), 400)
      }else{
        sessionStorage.clear();
         setLoading(false);
         setShaking(true);
          loginerror();
      }
      } else {
        throw new Error("Invalid credentials");
      }
    } catch {
      setLoading(false);
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      Swal.fire({
        toast: true, position: "top-end", icon: "error",
        title: "Invalid credentials",
        timer: 2200, showConfirmButton: false,
        background: "#fef2f2", color: "#991b1b",
        customClass: { container: "!top-[60px]" },
      });
    }
  };

  const loginerror = () => {
    Modal.error({
      title: "Access Denied",
      content: "Your account does not have admin privileges. Please use valid credentials to access the dashboard.",
      okText: "I understand",
      okButtonProps: { danger: true },
      maskClosable: true,
    });
  };

  return (
<div className="relative h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">      {/* Ambient background patterns */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.10),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_80%,rgba(34,197,94,0.08),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_90%,rgba(139,92,246,0.07),transparent_35%)]" />
      </div>

      {/* Fine grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Floating orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-blue-300/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-emerald-300/10 blur-[80px]" />

<main className="relative z-10 flex min-h-screen lg:h-screen w-full items-center justify-center px-3 py-2 overflow-y-auto lg:overflow-hidden"><div className="w-full max-w-[1180px]">
          {/* Badge */}
<div className="mb-4 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-blue-200 bg-white px-4 py-1.5 text-[11px] font-black tracking-widest text-blue-700 uppercase shadow-sm">
              <ShieldCheck size={12} className="text-blue-600" /> Restricted Admin Portal
            </span>
          </div>

          {/* Main card — equal height both columns via grid */}
<section className="overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-[0_30px_80px_rgba(59,130,246,0.10)] lg:grid lg:grid-cols-2 lg:min-h-[620px]">
            {/* ─── LEFT PANEL (module list) ─── */}
<div className="relative hidden flex-col border-r-2 border-slate-100 p-7 lg:flex">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/60 via-transparent to-cyan-50/40 rounded-l-3xl" />

              {/* Brand */}
<div className="relative mb-7 flex items-center gap-3">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 text-white shadow-lg shadow-blue-200">
                  <Bot size={26} />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 shadow-md">
                    <Zap size={10} className="text-white" />
                  </span>
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-gray-900">radhAI Admin</h1>
                  <p className="text-[11px] font-bold text-slate-500 tracking-wide">
                    CEO Input Control Center
                  </p>
                </div>
              </div>

<h2 className="relative mb-2 text-[2.15rem] font-black leading-tight tracking-tight text-gray-900">
                  One dashboard.<br />
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Total control.
                </span>
              </h2>
<p className="relative mb-6 text-sm leading-6 text-slate-500">
                  Voice clone, R&D publishing, paper analysis and Google workspace — all managed from a single secure interface.
              </p>

              {/* Module cards */}
<div className="relative mt-auto grid gap-2">
                  {MODULES.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.label}
className="group flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 transition-all hover:shadow-md"                      style={{ borderColor: m.border, backgroundColor: m.bg + "60" }}
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: m.bg, color: m.accent, border: `2px solid ${m.border}` }}
                      >
                        <Icon size={16} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-gray-900">{m.label}</p>
                        <p className="truncate text-[11px] font-semibold text-slate-500">{m.desc}</p>
                      </div>
                      <ArrowRight size={13} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── RIGHT PANEL (login form) ─── */}
<div className="flex flex-col justify-center p-6 sm:p-7">

              {/* Mobile brand */}
              <div className="mb-8 text-center lg:hidden">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 text-white shadow-lg shadow-blue-200">
                  <Bot size={26} />
                </div>
                <h1 className="text-xl font-black text-gray-900">radhAI Admin</h1>
                <p className="mt-1 text-xs font-semibold text-slate-500">CEO Input Control Center</p>
              </div>

              {/* Login card — same height ensured by flex-col justify-center parent */}
<div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 sm:p-5 shadow-inner">
    {/* Mobile Hero */}
<div className="mb-3 text-center lg:hidden">
  <h2 className="text-[1.4rem] font-black leading-tight text-gray-900">
    One dashboard.
    <br />
    <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
      Total control.
    </span>
  </h2>
</div>
              <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 border-2 border-blue-200">
                    <Lock size={14} className="text-blue-700" />
                  </span>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-700">
                    Secure Access
                  </p>
                </div>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-gray-900">Sign in</h2>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Admin credentials required to continue.
                </p>

                <div
                  className="mt-7 space-y-3"
                  style={shaking ? { animation: "shake 0.5s ease-in-out" } : {}}
                >
                  {/* Username */}
                  <div className="group relative">
                    <User
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600"
                      size={15}
                    />
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      autoComplete="username"
                      className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white pl-10 pr-4 text-base font-semibold text-gray-900 outline-none placeholder:text-slate-400 transition focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.10)]"
                    />
                  </div>

                  {/* Password */}
                  <div className="group relative">
                    <Lock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600"
                      size={15}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && login()}
                      placeholder="Password"
                      autoComplete="current-password"
                      className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white pl-10 pr-11 text-base font-semibold text-gray-900 outline-none placeholder:text-slate-400 transition focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.10)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={login}
                    disabled={loading}
                    className="group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-black text-white shadow-lg shadow-blue-300 transition hover:brightness-105 hover:shadow-xl hover:shadow-blue-300 active:scale-[0.98] disabled:opacity-70"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <ShieldCheck size={15} />
                      {loading ? "Authenticating..." : "Enter Admin Dashboard"}
                    </span>
                  </button>
                </div>

<p className="mt-3 text-center text-[10px] font-semibold text-slate-400">
                    Protected by radhAI · CEO-only access
                </p>
              </div>

              {/* Mobile module list */}
<div className="mt-3 grid grid-cols-2 gap-2 lg:hidden">
                    {MODULES.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.label}
className="flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-2 text-center min-h-[70px]"
                      style={{ borderColor: m.border, backgroundColor: m.bg + "80" }}
                    >
                      <span
className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: m.bg, color: m.accent }}
                      >
<Icon size={13} />
                      </span>
<p
  className="text-[10px] font-black leading-tight"
  style={{ color: m.text }}
>
  {m.label}
</p>                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <p className="mt-6 text-center text-[11px] font-semibold text-slate-400">
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
