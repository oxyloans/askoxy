import React from "react";
import { Link } from "react-router-dom";
import {
  RiDashboardLine,
  RiPhoneLine,
  RiPhoneFindLine,
  RiHistoryLine,
  RiSettings4Line,
  RiRobot2Line,
  RiAddCircleLine,
} from "react-icons/ri";

export const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: RiDashboardLine },
  { key: "inbound", label: "Inbound Calls", icon: RiPhoneLine },
  { key: "outbound", label: "Outbound Calls", icon: RiPhoneFindLine },
  { key: "history", label: "Call History", icon: RiHistoryLine },
  { key: "instructions", label: "Agent Instructions", icon: RiSettings4Line },
  { key: "makeacall", label: "Make a Call", icon: RiAddCircleLine },
] as const;

export type VoiceAdminNavKey = (typeof NAV_ITEMS)[number]["key"];

interface VoiceAdminSidebarProps {
  activeKey: VoiceAdminNavKey;
}

/** Desktop-width fixed sidebar nav for every /voiceadmin/* page. */
export const VoiceAdminSidebar: React.FC<VoiceAdminSidebarProps> = ({
  activeKey,
}) => {
  return (
    <div className="w-60 shrink-0 bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#0b1220] hidden md:flex md:flex-col border-r border-black/20 shadow-[2px_0_12px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-3 px-5 pt-6 pb-5 border-b border-white/10">
        <div className="p-2.5 bg-gradient-to-br from-amber-400/20 to-amber-500/20 border border-[#c9a24b]/50 rounded-lg shadow-sm">
          <RiRobot2Line className="text-[#e8c675] text-xl" />
        </div>
        <div>
          <h1 className="text-white text-sm font-semibold leading-tight tracking-tight">
            AI Voice Agent
          </h1>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Control center — <span className="text-[#e8c675] text-md font-bold">Priya</span>
          </p>
        </div>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeKey === item.key;
          return (
            <Link
              key={item.key}
              to={`/voiceadmin/${item.key}`}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 border-l-2 ${
                active
                  ? "bg-white/[0.08] text-white border-[#e8c675] shadow-sm"
                  : "text-slate-300 border-transparent hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <span
                className={`p-1.5 rounded-md ${
                  active
                    ? "bg-amber-400/20 text-[#e8c675]"
                    : "bg-white/5 text-slate-300"
                }`}
              >
                <Icon className="text-base" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

/** Collapsed top bar shown in place of the sidebar below the md breakpoint. */
export const VoiceAdminMobileNav: React.FC<VoiceAdminSidebarProps> = ({
  activeKey,
}) => {
  return (
    <div className="md:hidden bg-gradient-to-r from-[#0f172a] to-[#111827] px-4 py-4 border-b border-black/20">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-gradient-to-br from-amber-400/20 to-amber-500/20 border border-[#c9a24b]/50 rounded-lg">
          <RiRobot2Line className="text-[#e8c675] text-lg" />
        </div>
        <h1 className="text-white text-base font-semibold">AI Voice Agent</h1>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {NAV_ITEMS.map((item) => {
          const active = activeKey === item.key;
          return (
            <Link
              key={item.key}
              to={`/voiceadmin/${item.key}`}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                active
                  ? "bg-white/10 text-white border-[#e8c675]/60 shadow-sm"
                  : "text-slate-300 border-white/10 bg-white/[0.03]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default VoiceAdminSidebar;