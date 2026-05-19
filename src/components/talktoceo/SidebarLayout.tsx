import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Bot, Brain, LogOut, Menu, X, LayoutDashboard } from "lucide-react";

const SIDEBAR_ITEMS = [
  { title: "Voice Clone", subtitle: "CEO voice input", path: "/radhai-admin/voice-clone", icon: Bot },
  { title: "R&D", subtitle: "AI publishing lab", path: "/radhai-admin/research-development", icon: Brain },
];

export default function SidebarLayout({ onLogout }: { onLogout: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    sessionStorage.removeItem("radhAIAdminLogin");
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#070A16] text-white">
      <aside className="fixed left-0 top-0 z-[100] hidden h-screen w-[260px] border-r border-white/10 bg-[#0B1020]/95 backdrop-blur-xl lg:block">
        <BrandHeader />
        <nav className="space-y-2 p-3">
          {SIDEBAR_ITEMS.map((item) => <SidebarLink key={item.path} item={item} />)}
        </nav>
        <button
          onClick={logout}
          className="absolute bottom-4 left-3 right-3 flex items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-3 text-sm font-bold text-red-200 transition hover:bg-red-500/15"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      <header className="sticky top-0 z-[90] flex h-16 items-center justify-between border-b border-white/10 bg-[#0B1020]/95 px-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#B6F269] to-[#5EDDF2] text-black">
            <LayoutDashboard size={19} />
          </div>
          <div>
            <h1 className="text-sm font-black">radhAI Admin</h1>
            <p className="text-[11px] text-slate-400">Dashboard</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-xl border border-white/10 bg-white/[0.05] p-2 text-slate-200"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-x-3 top-[76px] z-[95] rounded-3xl border border-white/10 bg-[#111827]/95 p-3 shadow-2xl backdrop-blur-xl lg:hidden">
          <nav className="grid gap-2">
            {SIDEBAR_ITEMS.map((item) => (
              <div key={item.path} onClick={() => setMobileOpen(false)}>
                <SidebarLink item={item} />
              </div>
            ))}
            <button
              onClick={logout}
              className="mt-1 flex items-center gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-3 text-sm font-bold text-red-200"
            >
              <LogOut size={16} /> Logout
            </button>
          </nav>
        </div>
      )}

      <main className="lg:pl-[260px]">
        <div className="min-h-screen pb-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function BrandHeader() {
  return (
    <div className="border-b border-white/10 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B6F269] via-[#75E6C9] to-[#5EDDF2] text-black shadow-[0_12px_28px_rgba(94,221,242,0.18)]">
          <Bot size={21} />
        </div>
        <div>
          <h1 className="text-sm font-black tracking-tight">radhAI Admin</h1>
          <p className="text-[11px] text-slate-400">Voice Clone Control</p>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ item }: { item: any }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition ${
          isActive
            ? "bg-gradient-to-r from-[#5EDDF2] to-[#B6F269] text-black shadow-[0_16px_34px_rgba(94,221,242,0.16)]"
            : "border border-white/5 bg-white/[0.04] text-slate-300 hover:border-cyan-300/20 hover:bg-white/[0.07] hover:text-white"
        }`
      }
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/10">
        <Icon size={17} />
      </span>
      <span className="min-w-0">
        <span className="block truncate">{item.title}</span>
        <span className="block truncate text-[10px] font-semibold opacity-70">{item.subtitle}</span>
      </span>
    </NavLink>
  );
}