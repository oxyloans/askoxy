import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Bot,
  LogOut,
  Menu,
  X,
  Zap,
  User,
  LayoutDashboard,
  ChevronRight,
  PinIcon,
  Video,
  FileText,
  MessageSquare,
  PenSquare,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";

type NavItem = {
  title: string;
  subtitle: string;
  path: string;
  icon: React.ElementType;
  accent: string;
  lightBg: string;
  activeBg: string;
  activeText: string;
  activeBorder: string;
};

const SIDEBAR_ITEMS: NavItem[] = [
  {
    title: "My Clone",
    subtitle: "CEO AI Clone",
    path: "/radhai-admin/radhAI",
    icon: Bot,
    accent: "#0891b2",
    lightBg: "#cffafe",
    activeBg: "#cffafe",
    activeText: "#0e7490",
    activeBorder: "#22d3ee",
  },
  {
    title: "Conversations",
    subtitle: "Chat & voice history",
    path: "/radhai-admin/history",
    icon: MessageSquare,
    accent: "#7c3aed",
    lightBg: "#ede9fe",
    activeBg: "#ede9fe",
    activeText: "#5b21b6",
    activeBorder: "#8b5cf6",
  },
  {
    title: "Radha's Input",
    subtitle: "CEO input workflow",
    path: "/radhai-admin/voice-clone",
    icon: PenSquare,
    accent: "#0369a1",
    lightBg: "#e0f2fe",
    activeBg: "#dbeafe",
    activeText: "#1d4ed8",
    activeBorder: "#3b82f6",
  },
  {
    title: "R&D Video Upload",
    subtitle: "Video reasoning flow",
    path: "/radhai-admin/research-development",
    icon: Video,
    accent: "#15803d",
    lightBg: "#dcfce7",
    activeBg: "#dcfce7",
    activeText: "#166534",
    activeBorder: "#22c55e",
  },
  {
    title: "Paper Clipping AI",
    subtitle: "Analyze paper clips",
    path: "/radhai-admin/paper-clipping",
    icon: FileText,
    accent: "#6d28d9",
    lightBg: "#ede9fe",
    activeBg: "#ede9fe",
    activeText: "#5b21b6",
    activeBorder: "#8b5cf6",
  },
  {
    title: "Google Workspace",
    subtitle: "Coming soon",
    path: "/radhai-admin/my-google",
    icon: FcGoogle,
    accent: "#c2410c",
    lightBg: "#ffedd5",
    activeBg: "#ffedd5",
    activeText: "#9a3412",
    activeBorder: "#f97316",
  },
];

export default function SidebarLayout({ onLogout }: { onLogout: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const sidebarExpanded = pinned || hovered;
  const location = useLocation();

  const logout = () => {
    sessionStorage.removeItem("radhAIAdminLogin");
    onLogout();
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      {/* Subtle background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_0%_0%,rgba(59,130,246,0.04),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(34,197,94,0.03),transparent_40%)]" />
      </div>

      {/* DESKTOP TOP HEADER */}
      <header className="fixed left-0 right-0 top-0 z-[40] hidden h-[52px] items-center justify-between border-b border-slate-700/60 bg-[#0f172a] px-5 lg:flex">
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 text-white shadow-lg shadow-blue-900/40">
            <Bot size={16} />
            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500">
              <Zap size={7} className="text-white" />
            </span>
          </div>
          <span className="text-[14px] font-black tracking-tight text-slate-200">
            radh<span className="text-indigo-400">AI</span> Admin
          </span>
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[9px] font-black text-emerald-400">
            LIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[12px] font-semibold text-slate-400">radhAI.clone</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-black text-white">
            RA
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-[11px] font-bold text-slate-400 transition hover:border-red-500/50 hover:text-red-400"
          >
            <LogOut size={12} />
            Sign out
          </button>
        </div>
      </header>

      {/* DESKTOP SIDEBAR */}
      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`fixed left-0 top-[52px] z-[39] hidden h-[calc(100vh-52px)] flex-col border-r border-slate-700/50 bg-[#0f172a] shadow-xl transition-all duration-300 lg:flex ${
          sidebarExpanded ? "w-[260px]" : "w-[68px]"
        }`}
      >
        {sidebarExpanded && (
          <div className="flex items-center justify-between border-b border-slate-700/50 bg-slate-800/40 px-4 py-2.5">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-500">
              Dashboard
            </p>
            <button
              onClick={() => setPinned((p) => !p)}
              title={pinned ? "Unpin sidebar" : "Pin sidebar open"}
              className={`flex h-8 w-8 items-center justify-center rounded-xl border-2 font-black transition-all ${
                pinned
                  ? "border-indigo-500 bg-indigo-600 text-white shadow-md"
                  : "border-slate-600 bg-slate-800 text-slate-400 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white"
              }`}
            >
              {pinned ? <PinIcon size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>
        )}

        {!sidebarExpanded && (
          <div className="flex h-[41px] items-center justify-center border-b border-slate-700/50">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">
              Menu
            </span>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-2 pb-3 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="space-y-0.5">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isGoogle = item.icon === FcGoogle;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative flex items-center rounded-xl border transition-all duration-200 ${
                      sidebarExpanded
                        ? "gap-3 px-2 py-2"
                        : "justify-center px-0 py-2"
                    } ${
                      isActive
                        ? "shadow-sm"
                        : "border-transparent hover:border-slate-700 hover:bg-slate-800/50"
                    }`
                  }
                  style={({ isActive }) =>
                    isActive
                      ? {
                          backgroundColor: item.activeBg + "22",
                          borderColor: item.activeBorder + "55",
                        }
                      : {}
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all"
                        style={{
                          background: isGoogle
                            ? isActive
                              ? "#fff"
                              : item.lightBg + "22"
                            : isActive
                            ? item.accent
                            : item.lightBg + "22",
                          color: isActive ? "#fff" : item.accent,
                          boxShadow: isActive
                            ? `0 3px 10px ${item.accent}50`
                            : "none",
                        }}
                      >
                        <Icon size={18} />
                      </span>

                      {sidebarExpanded && (
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <span
                            className="block truncate text-[13.5px] font-semibold leading-tight tracking-wide"
                            style={{
                              color: isActive ? item.activeBg : "#cbd5e1",
                            }}
                          >
                            {item.title}
                          </span>
                          <span
                            className="mt-0.5 block truncate text-[12px] font-normal leading-tight"
                            style={{
                              color: isActive ? item.accent : "#475569",
                            }}
                          >
                            {item.subtitle}
                          </span>
                        </div>
                      )}

                      {isActive && sidebarExpanded && (
                        <span
                          className="ml-auto h-2 w-2 shrink-0 rounded-full"
                          style={{ background: item.accent }}
                        />
                      )}

                      {isActive && !sidebarExpanded && (
                        <span
                          className="absolute right-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
                          style={{ background: item.accent }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom: user card + logout */}
        <div className="shrink-0 space-y-2 border-t border-slate-700/50 p-2">
          <div
            className={`flex items-center rounded-xl border border-slate-700/50 bg-slate-800/40 ${
              sidebarExpanded
                ? "gap-2.5 px-2.5 py-2"
                : "justify-center px-0 py-2"
            }`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-900/60">
              <User size={13} className="text-indigo-300" />
            </div>
            {sidebarExpanded && (
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="truncate text-[13px] font-black text-slate-200">
                  radhAI.clone
                </p>
                <p className="truncate text-[11px] font-semibold text-slate-500">
                  CEO · Super Admin
                </p>
              </div>
            )}
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-sm" />
          </div>

          <button
            onClick={logout}
            className={`flex w-full items-center justify-center rounded-xl border border-red-900/40 bg-red-900/20 py-2 text-xs font-black text-red-400 transition hover:border-red-500/50 hover:bg-red-900/30 ${
              sidebarExpanded ? "gap-2 px-3" : "gap-0 px-0"
            }`}
          >
            <LogOut size={14} />
            {sidebarExpanded && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE TOPBAR */}
      <header
        className="sticky top-0 z-[40] flex h-14 items-center justify-between border-b-2 border-slate-200 bg-white px-3 shadow-sm lg:hidden"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle Menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-slate-300 bg-slate-100 text-gray-700 active:scale-95"
          >
            {mobileOpen ? <X size={17} /> : <Menu size={17} />}
          </button>

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-200">
            <LayoutDashboard size={15} />
          </div>

          <div>
            <h1 className="text-[15px] font-black leading-tight text-gray-900">radhAI Admin</h1>
            <p className="text-[11px] font-bold leading-tight text-slate-500">CEO Control</p>
          </div>
        </div>

        <button
          onClick={logout}
          aria-label="Sign Out"
          className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-red-200 bg-red-50 text-red-600 active:scale-95"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <LogOut size={16} />
        </button>
      </header>

      {/* MOBILE DRAWER — full-width on xs, capped on sm */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[41] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <nav
            className="absolute bottom-0 left-0 top-14 flex w-[min(280px,85vw)] flex-col border-r border-slate-700/50 bg-[#0f172a] shadow-2xl"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="border-b border-slate-700/50 bg-slate-800/40 px-4 py-3">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Navigation</p>
            </div>

            <div
              className="flex-1 space-y-1 overflow-y-auto px-2 py-2"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                const isGoogle = item.icon === FcGoogle;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl border px-3 py-3 transition-all active:scale-[0.98] ${
                        isActive ? "shadow-sm" : "border-transparent"
                      }`
                    }
                    style={({ isActive }) =>
                      isActive
                        ? { backgroundColor: item.activeBg + "22", borderColor: item.activeBorder + "55" }
                        : {}
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            background: isGoogle ? (isActive ? "#fff" : item.lightBg + "22") : isActive ? item.accent : item.lightBg + "22",
                            color: isActive ? "#fff" : item.accent,
                            boxShadow: isActive ? `0 3px 10px ${item.accent}50` : "none",
                          }}
                        >
                          <Icon size={17} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] font-semibold leading-tight" style={{ color: isActive ? item.activeBg : "#cbd5e1" }}>
                            {item.title}
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] font-normal leading-tight" style={{ color: isActive ? item.accent : "#475569" }}>
                            {item.subtitle}
                          </span>
                        </div>
                        {isActive && (
                          <span className="ml-auto h-2 w-2 shrink-0 rounded-full" style={{ background: item.accent }} />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            <div className="shrink-0 space-y-2 border-t border-slate-700/50 p-3">
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-700/50 bg-slate-800/40 px-3 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-900/60">
                  <User size={13} className="text-indigo-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-black text-slate-200">radhAI.clone</p>
                  <p className="truncate text-[11px] font-semibold text-slate-500">CEO · Super Admin</p>
                </div>
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              </div>
              <button
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-900/40 bg-red-900/20 px-3 py-2.5 text-[13px] font-black text-red-400 active:scale-95"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main
        className={`relative z-10 min-h-screen transition-all duration-300 lg:pt-[52px] ${
          sidebarExpanded ? "lg:pl-[260px]" : "lg:pl-[68px]"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}