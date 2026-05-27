import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Bot,
  Brain,
  LogOut,
  Menu,
  X,
  Globe,
  Newspaper,
  Zap,
  User,
  LayoutDashboard,
} from "lucide-react";

type NavItem = {
  title: string;
  subtitle: string;
  path: string;
  icon: React.ElementType;
  accent: string;
};

const SIDEBAR_ITEMS: NavItem[] = [
  {
    title: "Radha's Input",
    subtitle: "CEO input workflow",
    path: "/radhai-admin/voice-clone",
    icon: Bot,
    accent: "#5EDDF2",
  },
  {
    title: "R&D Video Upload",
    subtitle: "Video reasoning flow",
    path: "/radhai-admin/research-development",
    icon: Brain,
    accent: "#B6F269",
  },
  {
    title: "Paper Clipping AI",
    subtitle: "Analyze paper clips",
    path: "/radhai-admin/paper-clipping",
    icon: Newspaper,
    accent: "#A78BFA",
  },
  {
    title: "Google Workspace",
    subtitle: "Coming soon",
    path: "/radhai-admin/my-google",
    icon: Globe,
    accent: "#FB923C",
  },
];

export default function SidebarLayout({ onLogout }: { onLogout: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const logout = () => {
    sessionStorage.removeItem("radhAIAdminLogin");
    onLogout();
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      {/* Background ambience */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_0%_0%,rgba(94,221,242,0.05),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(182,242,105,0.04),transparent_40%)]" />
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#5EDDF2_1px,transparent_1px),linear-gradient(to_bottom,#5EDDF2_1px,transparent_1px)] bg-[size:36px_36px]" />
      </div>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="fixed left-0 top-0 z-[100] hidden h-screen w-[256px] flex-col border-r border-white/[0.07] bg-[#080C18]/95 backdrop-blur-2xl lg:flex">
        {/* Brand */}
        <div className="border-b border-white/[0.06] px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] text-black shadow-[0_0_24px_rgba(94,221,242,0.25)]">
              <Bot size={21} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#B6F269] shadow-[0_0_6px_rgba(182,242,105,0.9)]">
                <Zap size={8} className="text-black" />
              </span>
            </div>
            <div>
              <h1 className="text-[15px] font-black tracking-tight">radhAI Admin</h1>
              <p className="text-[10px] text-slate-500">CEO Input Control</p>
            </div>
            <span className="ml-auto flex h-6 items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 text-[9px] font-bold text-emerald-300">
              LIVE
            </span>
          </div>
        </div>

        {/* Nav label */}
        <p className="px-5 pt-5 pb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-600">
          Modules
        </p>

        {/* Nav items — flat, no dropdowns */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-3 py-3 transition-all ${
                    isActive
                      ? "border border-white/[0.10] bg-white/[0.07] shadow-[0_4px_18px_rgba(0,0,0,0.2)]"
                      : "border border-transparent hover:border-white/[0.06] hover:bg-white/[0.04]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all"
                      style={{
                        background: isActive ? `${item.accent}22` : `${item.accent}12`,
                        color: item.accent,
                        boxShadow: isActive ? `0 0 16px ${item.accent}30` : "none",
                      }}
                    >
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span
                        className="block truncate text-[13px] font-bold transition-colors"
                        style={{ color: isActive ? "#ffffff" : "#94a3b8" }}
                      >
                        {item.title}
                      </span>
                      <span className="block truncate text-[10px] font-medium text-slate-600">
                        {item.subtitle}
                      </span>
                    </div>
                    {isActive && (
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{
                          background: item.accent,
                          boxShadow: `0 0 6px ${item.accent}`,
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className="border-t border-white/[0.06] p-3 space-y-2">
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#5EDDF2]/20 to-[#B6F269]/20">
              <User size={14} className="text-cyan-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-white truncate">radhAI.clone</p>
              <p className="text-[9px] text-slate-500">CEO · Super Admin</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(74,222,128,0.9)]" />
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/15 bg-red-500/8 px-3 py-2.5 text-xs font-bold text-red-300 transition hover:border-red-400/25 hover:bg-red-500/14"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOPBAR ── */}
      <header className="sticky top-0 z-[90] flex h-16 items-center justify-between border-b border-white/[0.07] bg-[#080C18]/95 px-4 backdrop-blur-2xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#B6F269] to-[#5EDDF2] text-black shadow-[0_0_16px_rgba(94,221,242,0.2)]">
            <LayoutDashboard size={16} />
          </div>
          <div>
            <h1 className="text-sm font-black">radhAI Admin</h1>
            <p className="text-[10px] text-slate-500">CEO Control</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/15 bg-red-500/8 text-red-300 transition hover:bg-red-500/14"
          >
            <LogOut size={15} />
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08]"
          >
            {mobileOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <nav className="absolute right-0 top-16 bottom-0 w-72 border-l border-white/[0.07] bg-[#080C18]/98 backdrop-blur-2xl flex flex-col">
            <p className="px-5 pt-5 pb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-600">
              Modules
            </p>
            <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-4">
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-3 py-3 transition-all ${
                        isActive
                          ? "border border-white/[0.10] bg-white/[0.07]"
                          : "border border-transparent hover:border-white/[0.06] hover:bg-white/[0.04]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            background: `${item.accent}18`,
                            color: item.accent,
                          }}
                        >
                          <Icon size={16} />
                        </span>
                        <div>
                          <span
                            className="block text-[13px] font-bold"
                            style={{ color: isActive ? "#ffffff" : "#94a3b8" }}
                          >
                            {item.title}
                          </span>
                          <span className="block text-[10px] text-slate-600">{item.subtitle}</span>
                        </div>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Mobile user info */}
            <div className="border-t border-white/[0.06] p-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#5EDDF2]/20 to-[#B6F269]/20">
                  <User size={14} className="text-cyan-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-white">radhAI.clone</p>
                  <p className="text-[9px] text-slate-500">CEO · Super Admin</p>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(74,222,128,0.9)]" />
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10 min-h-screen lg:pl-[256px]">
        <Outlet />
      </main>
    </div>
  );
}
