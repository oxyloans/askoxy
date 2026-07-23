import React, { useEffect, useState, ReactNode } from "react";
import {
  CalendarDays,
  CreditCard,
  FileText,
  Images,
  ListChecks,
  LogOut,
  Menu as MenuIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Upload,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { setIntendedRoute } from "../utils/taskTokenManager";
import {
  getBusinessCardAccessToken,
  removeBusinessCardAccessToken,
  removeBusinessCardRefreshToken,
} from "../utils/cookieUtils";
import BusinessCardThemeProvider from "./BusinessCardThemeProvider";
import { COLOR_PRIMARY } from "./businessCardTheme";

interface BusinessCardLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  {
    path: "/business-card/my-profile",
    label: "Personal Details",
    shortLabel: "Details",
    icon: FileText,
    key: "my-profile",
  },
  {
    path: "/business-card/event-images",
    label: "Event Details Upload",
    shortLabel: "Upload",
    icon: Images,
    key: "event-images",
  },
  {
    path: "/business-card/event-list",
    label: "Event List",
    shortLabel: "Events",
    icon: CalendarDays,
    key: "event-list",
  },
  {
    path: "/business-card/process",
    label: "Process Card",
    shortLabel: "Upload",
    icon: Upload,
    key: "process",
  },
  {
    path: "/business-card/upload-details",
    label: "Upload Details",
    shortLabel: "Cards",
    icon: ListChecks,
    key: "upload-details",
  },

  
];

const BusinessCardLayout: React.FC<BusinessCardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const location = useLocation();

  useEffect(() => {
    setUserName(sessionStorage.getItem("Name") || "");
    setUserEmail(sessionStorage.getItem("Email") || "");
  }, []);

  useEffect(() => {
    const token = getBusinessCardAccessToken();
    const primaryType = sessionStorage.getItem("primaryType");
    if (!token || primaryType !== "BUSINESSCARD") {
      window.location.replace("/business-card/login");
    }
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const selectedKey = location.pathname === "/business-card/personal-details-document"
    ? "my-profile"
    : NAV_ITEMS.find((item) => item.path === location.pathname)?.key || "ceo-details";

  const handleSignOut = () => {
    Swal.fire({
      title: "Sign out?",
      text: "You will need to sign in again to access Business Card.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: COLOR_PRIMARY,
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sign out",
    }).then((result) => {
      if (!result.isConfirmed) return;

      if (
        location.pathname !== "/business-card/login" &&
        location.pathname !== "/business-card/register"
      ) {
        setIntendedRoute(location.pathname);
      }

      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("Name");
      sessionStorage.removeItem("Email");
      sessionStorage.removeItem("primaryType");
      removeBusinessCardAccessToken();
      removeBusinessCardRefreshToken();
      window.location.replace("/business-card/login");
    });
  };

  const initials = userName
    ? userName
        .trim()
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const brandBlock = (compact?: boolean) => (
    <div className={`flex w-full items-center gap-2.5 ${compact ? "justify-center" : "justify-start text-left"}`}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50">
        <CreditCard className="h-4 w-4 text-cyan-600" />
      </div>
      {!compact && (
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em]">
            <span className="text-cyan-600">ASKOXY</span>
            <span className="text-slate-500">.AI</span>
          </p>
          <p className="truncate text-[13px] font-semibold text-slate-800">Business Card</p>
        </div>
      )}
    </div>
  );

  const sidebarUserBlock = () => (
    <div className="flex min-w-0 items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-xs font-semibold text-white">
        {initials}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-slate-800">{userName || "Employee"}</p>
        <p className="truncate text-[11px] text-slate-400">{userEmail || "Email not available"}</p>
      </div>
    </div>
  );

  const sideMenu = (compact = false) => (
    <div className="flex h-full flex-col">
      <div className="flex min-h-16 items-center border-b border-slate-100 px-3 py-3">{brandBlock(compact)}</div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3" aria-label="Business Card navigation">
        {NAV_ITEMS.map((item) => {
          const active = selectedKey === item.key;
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              to={item.path}
              title={compact ? item.label : undefined}
              className={[
                "flex h-10 items-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/30",
                compact ? "justify-center px-2" : "gap-3 px-3",
                active
                  ? "bg-cyan-50 text-cyan-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!compact && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-100 px-3 py-3">
        {!compact && sidebarUserBlock()}
        <button
          type="button"
          onClick={handleSignOut}
          title={compact ? "Logout" : undefined}
          className={[
            "mt-3 flex h-9 w-full items-center rounded-lg border border-red-100 bg-red-50/70 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20",
            compact ? "justify-center px-2" : "gap-2.5 px-3",
          ].join(" ")}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!compact && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <BusinessCardThemeProvider>
      <div className="flex min-h-screen bg-slate-100">
        <aside
          className={[
            "sticky top-0 hidden h-screen shrink-0 border-r border-slate-200 bg-white transition-[width] duration-200 lg:block",
            collapsed ? "w-16" : "w-60",
          ].join(" ")}
        >
          {sideMenu(collapsed)}
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white/95 px-3 backdrop-blur-sm sm:px-5 lg:px-6">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              className="mr-2 flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 lg:hidden"
            >
              {collapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
              aria-expanded={!collapsed}
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 lg:flex"
            >
              <MenuIcon className="h-5 w-5" />
            </button>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 text-[11px] font-semibold text-white">
                  {initials}
                </div>
                <span className="max-w-[88px] truncate text-xs font-medium text-slate-700 sm:max-w-[140px] sm:text-sm md:max-w-[180px]">
                  {userName || "Employee"}
                </span>
              </div>
            </div>
          </header>

          <main className="px-3 py-3 pb-24 sm:px-5 sm:py-4 sm:pb-24 lg:px-6 lg:pb-6">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>

        <div
          className={[
            "fixed inset-0 z-50 lg:hidden",
            drawerOpen ? "pointer-events-auto" : "pointer-events-none",
          ].join(" ")}
          aria-hidden={!drawerOpen}
        >
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
            className={[
              "absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] transition-opacity duration-200",
              drawerOpen ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Business Card navigation"
            className={[
              "absolute inset-y-0 left-0 w-[min(82vw,280px)] bg-white shadow-2xl transition-transform duration-200 ease-out",
              drawerOpen ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <X className="h-5 w-5" />
            </button>
            {sideMenu(false)}
          </aside>
        </div>

        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(15,23,42,0.08)] backdrop-blur-sm lg:hidden" aria-label="Quick navigation">
          <div className="grid grid-cols-6">
            {NAV_ITEMS.map((item) => {
              const active = selectedKey === item.key;
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "flex min-w-0 flex-col items-center gap-1 px-0.5 py-2 text-center transition-colors",
                    active ? "bg-cyan-50 text-cyan-700" : "text-slate-400 hover:text-slate-600",
                  ].join(" ")}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  <span className="w-full truncate text-[9px] font-medium leading-none sm:text-[10px]">{item.shortLabel}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </BusinessCardThemeProvider>
  );
};

export default BusinessCardLayout;
