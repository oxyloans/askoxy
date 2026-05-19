import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Lock, User, Eye, EyeOff, Bot, ShieldCheck, Sparkles } from "lucide-react";
import Swal from "sweetalert2";

import SidebarLayout from "./SidebarLayout";
import RadhAICloneAdminPage from "./RadhAICloneAdminPage";
import RadhAIRAndDPage from "./RadhAIRAndDPage";

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
        <Route path="*" element={<Navigate to="voice-clone" replace />} />
      </Route>
    </Routes>
  );
}

function AdminLoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login = () => {
    if (username.trim() === STATIC_USERNAME && password === STATIC_PASSWORD) {
      sessionStorage.setItem("radhAIAdminLogin", "true");
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Login successful",
        timer: 1800,
        showConfirmButton: false,
        background: "#07111f",
        color: "#ffffff",
      });
      onLogin();
      return;
    }

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: "Invalid username or password",
      timer: 2200,
      showConfirmButton: false,
      background: "#07111f",
      color: "#ffffff",
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070A16] px-4 py-6 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(94,221,242,0.16),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(182,242,105,0.12),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#5EDDF2_1px,transparent_1px),linear-gradient(to_bottom,#5EDDF2_1px,transparent_1px)] bg-[size:42px_42px]" />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden border-r border-white/10 p-8 lg:block">
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] text-black shadow-[0_18px_45px_rgba(94,221,242,0.22)]">
                <Bot size={24} />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight">radhAI Admin</h1>
                <p className="text-xs text-slate-400">Reliable CEO clone control center</p>
              </div>
            </div>

            <div className="max-w-xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                <ShieldCheck size={14} /> Admin Level Access
              </p>
              <h2 className="text-4xl font-black leading-tight tracking-tight">
                Manage voice clone content, knowledge files and R&D publishing from one clean dashboard.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Built for daily admin usage with clear navigation, compact forms, responsive layouts and approval-focused workflow.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Voice Clone", "R&D Studio", "Approval Flow"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-[#0B1020]/70 p-4">
                  <Sparkles size={18} className="mb-3 text-[#B6F269]" />
                  <p className="text-sm font-black">{item}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Admin-ready module</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <div className="mx-auto w-full max-w-[390px]">
              <div className="mb-6 text-center lg:hidden">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] text-black">
                  <Bot size={24} />
                </div>
                <h1 className="text-xl font-black">radhAI Admin</h1>
                <p className="mt-1 text-xs text-slate-400">Voice Clone & R&D Dashboard</p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#111827]/80 p-4 sm:p-5">
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Secure Login</p>
                  <h2 className="mt-1 text-xl font-black">Welcome back</h2>
                  <p className="mt-1 text-xs text-slate-400">Enter admin credentials to continue.</p>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-cyan-300" size={16} />
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="h-11 w-full rounded-xl border border-white/10 bg-[#1F2937] pl-10 pr-3 text-sm outline-none transition focus:border-cyan-300/50"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-cyan-300" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && login()}
                      placeholder="Password"
                      className="h-11 w-full rounded-xl border border-white/10 bg-[#1F2937] pl-10 pr-10 text-sm outline-none transition focus:border-cyan-300/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-3 text-slate-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <button
                    onClick={login}
                    className="h-11 w-full rounded-xl bg-gradient-to-r from-[#5EDDF2] to-[#B6F269] text-sm font-black text-black shadow-[0_18px_40px_rgba(94,221,242,0.18)] transition hover:brightness-110"
                  >
                    Login to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}