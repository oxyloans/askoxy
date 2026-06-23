import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
  PenSquare,
  Video,
  FileText,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";

import SidebarLayout from "./SidebarLayout";
import RadhAICloneAdminPage from "./RadhAICloneAdminPage";
import RadhAIHistoryPage from "./RadhAIHistoryPage";
import RadhAIRAndDPage from "./RadhAIRAndDPage";
import PaperClippingPage from "./PaperClippingPage";
import PaperclipDashboard from "./dashboard";
import MyGooglePage from "./MyGooglePage";
import MyClonePage from "./MyCloneAdminpage";
import { Modal } from "antd";

export default function RadhAIAdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("radhAIAdminLogin") === "true"
  );
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <AdminLoginPage
        onLogin={() => {
          setIsLoggedIn(true);
          navigate("/radhai-admin/dashboard", { replace: true });
        }}
      />
    );
  }

  const logout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    navigate("/radhai-admin", { replace: true });
  };

  return (
    <Routes>
      <Route element={<SidebarLayout onLogout={logout} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="radhAI" element={<MyClonePage />} />
        <Route path="history" element={<RadhAIHistoryPage />} />
        <Route path="voice-clone" element={<RadhAICloneAdminPage />} />
        <Route path="research-development" element={<RadhAIRAndDPage />} />
        <Route path="paper-clipping" element={<PaperClippingPage />} />
        <Route path="dashboard" element={<PaperclipDashboard />} />
        <Route path="my-google" element={<MyGooglePage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}

const MODULES = [
  {
    icon: Bot,
    label: "My Clone",
    desc: "Personal AI clone setup & management",
    accent: "#9008b2",
    lightBg: "#c589d9",
    tint: "rgba(170, 61, 172, 0.22)",
    border: "rgba(115, 24, 130, 0.3)",
  },
  {
    icon: PenSquare,
    label: "Radha's Input",
    desc: "CEO input workflow",
    accent: "#0369a1",
    lightBg: "#e0f2fe",
    tint: "rgba(3,105,161,0.14)",
    border: "rgba(3,105,161,0.3)",
  },
  {
    icon: Video,
    label: "R&D Video Upload",
    desc: "Video reasoning flow",
    accent: "#15803d",
    lightBg: "#dcfce7",
    tint: "rgba(21,128,61,0.14)",
    border: "rgba(21,128,61,0.3)",
  },

  {
    icon: FileText,
    label: "Paper Clipping AI",
    desc: "Analyze paper clips",
    accent: "#6d28d9",
    lightBg: "#ede9fe",
    tint: "rgba(109,40,217,0.14)",
    border: "rgba(109,40,217,0.3)",
  },

    {
    icon: FcGoogle,
    label: "Google Workspace",
    desc: "CEO Workspace",
    accent: "#e1d5d5",
    lightBg: "#ffedd5",
    tint: "rgba(194,65,12,0.14)",
    border: "rgba(194,65,12,0.3)",
  },
];

const STATS = [
  { value: "5", label: "Modules" },
  { value: "24/7", label: "Automated" },
  { value: "100%", label: "Secure" },
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
        sessionStorage.setItem("userName", data.name || "");
        sessionStorage.setItem("userEmail", data.email || "");
        sessionStorage.setItem("userId", data.id || data.userId || "");
        if (data.primaryType === "SALESSUPPERADMIN") {
          Swal.fire({
            toast: true, position: "top-end", icon: "success",
            title: "Access granted — welcome back",
            timer: 1800, showConfirmButton: false,
            background: "#f0fdf4", color: "#166534",
            customClass: { container: "!top-[60px]" },
          });
          setTimeout(() => onLogin(), 400);
        } else {
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
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,rgba(139,92,246,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(20,184,166,0.07),transparent_45%)]" />
      </div>

      <main className="relative z-10 flex min-h-screen w-full items-center justify-center px-3 py-5 sm:py-8">
        <div className="w-full max-w-[680px]">
          <section className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] sm:rounded-[24px] md:grid md:grid-cols-2 md:min-h-[420px]">

            {/* LEFT PANEL — brand / pitch */}
            <div
              className="relative flex flex-col justify-between gap-5 overflow-hidden p-5 sm:p-6 md:p-6 lg:p-7"
              style={{
                background:
                  "linear-gradient(160deg, #0b1330 0%, #161b42 48%, #2b1f4d 100%)",
              }}
            >
              {/* texture: faint neural dot grid */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle,#a78bfa_1px,transparent_1px)] bg-[size:22px_22px]" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-400/10 blur-3xl" />

              <div className="relative">
                <div className="mb-6 flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-400/30 shadow-lg shadow-violet-500/20 backdrop-blur-sm">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-400/20 to-transparent"></div>
                    <Bot size={22} className="relative z-10 text-violet-300 drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black uppercase tracking-wider bg-gradient-to-r from-violet-300 via-purple-300 to-teal-300 bg-clip-text text-transparent drop-shadow-sm">
                      radhAI
                    </span>
                    <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-violet-200 backdrop-blur-sm">
                      Restricted Admin
                    </span>
                  </div>
                </div>

                <h2 className="text-[1.35rem] font-black leading-tight tracking-tight text-white sm:text-[1.55rem] lg:text-[1.7rem]">
                  One dashboard.
                  <br />
                  <span className="bg-gradient-to-r from-violet-300 to-teal-300 bg-clip-text text-transparent">
                    Total control.
                  </span>
                </h2>
                <p className="mt-2.5 max-w-sm text-[13px] leading-5 text-slate-400">
                  Voice clone, R&amp;D publishing, paper analysis and Google
                  workspace — all managed from a single secure command
                  center.
                </p>
              </div>

              {/* Stats row, like a credibility strip */}
              <div className="relative flex items-end gap-5">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-black text-violet-400">{s.value}</p>
                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Module list — full description cards, shown from tablet up (mobile gets a compact grid below the form instead) */}
              <div className="relative hidden gap-1.5 md:grid">
                {MODULES.map((m) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.label}
                      className="flex items-center gap-2.5 rounded-lg border px-2.5 py-2"
                      style={{ backgroundColor: m.tint, borderColor: m.border }}
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all"
                        style={{
                          background: m.accent,
                          color: "#fff",
                          boxShadow: `0 3px 10px ${m.accent}50`,
                        }}
                      >
                        <Icon size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-white">{m.label}</p>
                        <p className="truncate text-[9.5px] font-medium text-slate-400">{m.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT PANEL — login form */}
            <div className="flex flex-col justify-center p-5 sm:p-6 md:p-7 lg:p-8">
              <div className="mx-auto w-full max-w-sm">
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-50 border-2 border-violet-200">
                    <Lock size={11} className="text-violet-600" />
                  </span>
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-violet-600">
                    Secure Access
                  </p>
                </div>

                <h1 className="mt-2.5 text-xl font-black tracking-tight text-gray-900 sm:text-[1.4rem]">
                  Welcome back
                </h1>
                <p className="mt-1 text-[13px] font-medium text-slate-500">
                  Sign in with your admin credentials to continue.
                </p>

                <div className="mt-4 space-y-2.5" style={shaking ? { animation: "shake 0.5s ease-in-out" } : {}}>
                  <div>
                    <label className="mb-1 block text-[9px] font-black uppercase tracking-widest text-slate-500">
                      Admin Email
                    </label>
                    <div className="group relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-violet-500" size={13} />
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="you@radhai.com"
                        autoComplete="username"
                        className="h-10 w-full rounded-lg border-2 border-slate-200 bg-slate-50 pl-9 pr-4 text-[13px] font-semibold text-gray-900 outline-none placeholder:text-slate-400 placeholder:font-normal transition focus:border-violet-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[9px] font-black uppercase tracking-widest text-slate-500">
                      Password
                    </label>
                    <div className="group relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-violet-500" size={13} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && login()}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="h-10 w-full rounded-lg border-2 border-slate-200 bg-slate-50 pl-9 pr-10 text-[13px] font-semibold text-gray-900 outline-none placeholder:text-slate-400 placeholder:font-normal transition focus:border-violet-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                      />
                      <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition">
                        {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={login}
                    disabled={loading}
                    className="group relative h-10 w-full overflow-hidden rounded-lg bg-gradient-to-r from-violet-500 to-teal-400 text-[13px] font-black text-white shadow-lg shadow-violet-200 transition active:scale-[0.98] disabled:opacity-70"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? "Authenticating..." : "Sign in"}
                      {!loading && <ArrowRight size={14} />}
                    </span>
                  </button>
                </div>

                <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[9px] font-semibold text-slate-400">
                  <ShieldCheck size={10} className="text-slate-400" />
                  Protected by radhAI · CEO-only access
                </p>

                {/* All modules — compact boxes, side by side, mobile only (tablet/desktop see the full list up top) */}
                <div className="mt-4 md:hidden">
                  <p className="mb-1 text-center text-[7px] font-black uppercase tracking-widest text-slate-400">
                    All Modules
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {MODULES.filter((m) => m.label !== "My Clone").map((m) => {
                      const Icon = m.icon;
                      return (
                        <div
                          key={m.label}
                          className="flex flex-col items-center gap-0.5 rounded-md border px-1 py-1.5 text-center"
                          style={{ backgroundColor: m.tint, borderColor: m.border }}
                        >
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all"
                            style={{
                              background: m.accent,
                              color: "#fff",
                              boxShadow: `0 3px 10px ${m.accent}50`,
                            }}
                          >
                            <Icon size={18} />
                          </span>
                          <p className="text-[7.5px] font-bold leading-tight text-gray-800">{m.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <p className="mt-3 text-center text-[9px] font-semibold text-slate-500">
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