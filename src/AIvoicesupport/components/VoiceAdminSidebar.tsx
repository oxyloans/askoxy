import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip, Drawer } from "antd";
import {
  RiDashboardLine,
  RiPhoneLine,
  RiPhoneFindLine,
  RiHistoryLine,
  RiSettings4Line,
  RiRobot2Line,
  RiAddCircleLine,
  RiLogoutBoxRLine,
  RiCalendarScheduleLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiMenuLine,
  RiCloseLine,
} from "react-icons/ri";

export const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: RiDashboardLine },
  { key: "inbound", label: "Inbound Calls", icon: RiPhoneLine },
  { key: "outbound", label: "Outbound Calls", icon: RiPhoneFindLine },
  { key: "scheduled", label: "Scheduled Calls", icon: RiCalendarScheduleLine },
  { key: "history", label: "Call History", icon: RiHistoryLine },
  { key: "instructions", label: "Agent Instructions", icon: RiSettings4Line },
  { key: "makeacall", label: "Make a Call", icon: RiAddCircleLine },
] as const;

export type VoiceAdminNavKey = (typeof NAV_ITEMS)[number]["key"];

interface VoiceAdminSidebarProps {
  activeKey: VoiceAdminNavKey;
  /** Whether the desktop sidebar is shown in its icon-only, collapsed state. */
  collapsed?: boolean;
  /** Toggles the collapsed state; only relevant to the desktop sidebar. */
  onToggleCollapse?: () => void;
}

/** Clears only the localStorage keys set during voice admin login. */
export const voiceAdminLogout = () => {
  localStorage.removeItem("voice_admin_uniquId");
  localStorage.removeItem("voice_admin_primaryType");
  localStorage.removeItem("voice_admin_userName");
};

/** Full-label nav list + logout, shared by the expanded desktop sidebar and the mobile drawer. */
const SidebarNavList: React.FC<{
  activeKey: VoiceAdminNavKey;
  onNavigate?: () => void;
  onLogout: () => void;
}> = ({ activeKey, onNavigate, onLogout }) => (
  <>
    <nav className="flex flex-col gap-1 p-3 flex-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = activeKey === item.key;
        return (
          <Link
            key={item.key}
            to={`/voiceadmin/${item.key}`}
            onClick={onNavigate}
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
    <div className="p-3 border-t border-white/10">
      <button
        type="button"
        onClick={onLogout}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 border-l-2 border-transparent hover:text-white hover:bg-white/[0.05] transition-colors duration-150"
      >
        <span className="p-1.5 rounded-md bg-white/5 text-slate-300">
          <RiLogoutBoxRLine className="text-base" />
        </span>
        Logout
      </button>
    </div>
  </>
);

/** Desktop-width fixed sidebar nav for every /voiceadmin/* page. */
export const VoiceAdminSidebar: React.FC<VoiceAdminSidebarProps> = ({
  activeKey,
  collapsed = false,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    voiceAdminLogout();
    navigate("/voiceadmin");
  };

  return (
    <div
      className={`relative ${
        collapsed ? "w-[76px]" : "w-60"
      } shrink-0 bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#0b1220] hidden md:flex md:flex-col border-r border-black/20 shadow-[2px_0_12px_rgba(0,0,0,0.25)] transition-[width] duration-200 ease-in-out`}
    >
      {/* Collapse / expand toggle — floats on the sidebar's right edge */}
      <Tooltip
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        placement="right"
      >
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3.5 top-8 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-[#1a2234] border border-[#c9a24b]/50 text-[#e8c675] shadow-md hover:bg-[#232d42] hover:border-[#c9a24b] hover:scale-105 transition-all duration-150"
        >
          {collapsed ? (
            <RiArrowRightSLine className="text-base" />
          ) : (
            <RiArrowLeftSLine className="text-base" />
          )}
        </button>
      </Tooltip>

      <div
        className={`flex items-center gap-3 pt-6 pb-5 border-b border-white/10 ${
          collapsed ? "justify-center px-3" : "px-5"
        }`}
      >
        <div className="p-2.5 bg-gradient-to-br from-amber-400/20 to-amber-500/20 border border-[#c9a24b]/50 rounded-lg shadow-sm shrink-0">
          <RiRobot2Line className="text-[#e8c675] text-xl" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-white text-sm font-semibold leading-tight tracking-tight truncate">
              AI Voice Agent
            </h1>
            <p className="text-slate-400 text-[11px] mt-0.5 truncate">
              Control center —{" "}
              <span className="text-[#e8c675] text-md font-bold">Priya</span>
            </p>
          </div>
        )}
      </div>

      {collapsed ? (
        <>
          <nav className="flex flex-col gap-1 p-3 flex-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeKey === item.key;
              return (
                <Tooltip key={item.key} title={item.label} placement="right">
                  <Link
                    to={`/voiceadmin/${item.key}`}
                    className={`flex items-center justify-center px-0 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 border-l-2 ${
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
                  </Link>
                </Tooltip>
              );
            })}
          </nav>
          <div className="p-3 border-t border-white/10">
            <Tooltip title="Logout" placement="right">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center py-2.5 rounded-md text-sm font-medium text-slate-300 border-l-2 border-transparent hover:text-white hover:bg-white/[0.05] transition-colors duration-150"
              >
                <span className="p-1.5 rounded-md bg-white/5 text-slate-300">
                  <RiLogoutBoxRLine className="text-base" />
                </span>
              </button>
            </Tooltip>
          </div>
        </>
      ) : (
        <SidebarNavList activeKey={activeKey} onLogout={handleLogout} />
      )}
    </div>
  );
};

/** Slim top bar shown below the md breakpoint, with a hamburger toggle that opens the full nav in a drawer. */
export const VoiceAdminMobileNav: React.FC<VoiceAdminSidebarProps> = ({
  activeKey,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    voiceAdminLogout();
    setOpen(false);
    navigate("/voiceadmin");
  };

  return (
    <div className="md:hidden bg-gradient-to-r from-[#0f172a] to-[#111827] px-4 py-3.5 border-b border-black/20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-amber-400/20 to-amber-500/20 border border-[#c9a24b]/50 rounded-lg">
          <RiRobot2Line className="text-[#e8c675] text-lg" />
        </div>
        <h1 className="text-white text-base font-semibold">AI Voice Agent</h1>
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors duration-150"
      >
        <RiMenuLine className="text-xl" />
      </button>

      <Drawer
        placement="left"
        open={open}
        onClose={() => setOpen(false)}
        closable={false}
        width={260}
        styles={{
          body: {
            padding: 0,
            background:
              "linear-gradient(to bottom, #0f172a, #111827, #0b1220)",
          },
          content: {
            background: "transparent",
          },
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between gap-3 px-5 pt-6 pb-5 border-b border-white/10">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-gradient-to-br from-amber-400/20 to-amber-500/20 border border-[#c9a24b]/50 rounded-lg shadow-sm shrink-0">
                <RiRobot2Line className="text-[#e8c675] text-xl" />
              </div>
              <div className="min-w-0">
                <h1 className="text-white text-sm font-semibold leading-tight tracking-tight truncate">
                  AI Voice Agent
                </h1>
                <p className="text-slate-400 text-[11px] mt-0.5 truncate">
                  Control center —{" "}
                  <span className="text-[#e8c675] text-md font-bold">
                    Priya
                  </span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors duration-150 shrink-0"
            >
              <RiCloseLine className="text-lg" />
            </button>
          </div>
          <div className="flex flex-col flex-1 min-h-0">
            <SidebarNavList
              activeKey={activeKey}
              onNavigate={() => setOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default VoiceAdminSidebar;
