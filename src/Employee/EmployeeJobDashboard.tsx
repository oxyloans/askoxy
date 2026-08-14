import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  ChevronRight,
  CircleHelp,
  FileText,
  LogOut,
  Menu,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import { clearEmployeeAuth, getEmployeeAuth } from "./employeeAuthCookie";
import "./EmployeeJobDashboard.css";

interface SidebarItem {
  label: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

const DASHBOARD_ROUTE = "/employeedashboard";
const LOGIN_ROUTE = "/companyemployeelogin";
const ADD_JOB_ROUTE = `${DASHBOARD_ROUTE}/addjobbycompanyemployee`;
const ALL_JOBS_ROUTE = `${DASHBOARD_ROUTE}/alljobsbycompanyemployee`;
const APPLICATIONS_ROUTE = `${DASHBOARD_ROUTE}/applicationsbycompanyemployee`;

const sidebarItems: SidebarItem[] = [
  {
    label: "Post a job",
    description: "Create a new opening",
    path: ADD_JOB_ROUTE,
    icon: <PlusCircle />,
  },
  {
    label: "Jobs",
    description: "Manage posted roles",
    path: ALL_JOBS_ROUTE,
    icon: <BriefcaseBusiness />,
  },
  {
    label: "Applications",
    description: "Review job candidates",
    path: APPLICATIONS_ROUTE,
    icon: <FileText />,
  },
];

const EmployeeJobDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboardRoot =
    location.pathname === DASHBOARD_ROUTE || location.pathname === `${DASHBOARD_ROUTE}/`;

  const currentItem = useMemo(
    () =>
      [...sidebarItems]
        .sort((first, second) => second.path.length - first.path.length)
        .find((item) => location.pathname.startsWith(item.path)) ?? sidebarItems[1],
    [location.pathname]
  );

  // getEmployeeAuth() is the single source of truth for "is this a valid
  // employee session with primaryType === JOBS". It returns null for a
  // missing cookie, corrupted JSON, a legacy plain-id cookie, OR a cookie
  // whose primaryType isn't JOBS — every one of those sends the user back
  // to login rather than silently letting them into the wrong workspace.
  useEffect(() => {
    const auth = getEmployeeAuth();

    if (!auth) {
      clearEmployeeAuth();
      navigate(LOGIN_ROUTE, { replace: true });
      return;
    }

    setEmployeeId(auth.id);
    setCompanyName(auth.companyName || "");
    setSessionChecked(true);
  }, [navigate]);

  useEffect(() => {
    if (sessionChecked && isDashboardRoot) {
      navigate(ALL_JOBS_ROUTE, { replace: true });
    }
  }, [isDashboardRoot, navigate, sessionChecked]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [sidebarOpen]);

  const handleLogout = () => {
    clearEmployeeAuth();
    navigate(LOGIN_ROUTE, { replace: true });
  };

  if (!sessionChecked || isDashboardRoot) {
    return (
      <div className="ejd-session-check" role="status" aria-live="polite">
        <span />
        Opening jobs workspace…
      </div>
    );
  }

  return (
    <main className="ejd-page">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        draggable
        limit={3}
        theme="dark"
        aria-label="Employee notifications"
      />
      <div className="ejd-ambient ejd-ambient-one" aria-hidden="true" />
      <div className="ejd-ambient ejd-ambient-two" aria-hidden="true" />

      <div className="ejd-app-shell">
        <aside
          id="employee-navigation"
          className={`ejd-sidebar ${sidebarOpen ? "ejd-sidebar-open" : ""}`}
          aria-label="Employee workspace navigation"
        >
          <div className="ejd-sidebar-brand">
            <button
              type="button"
              className="ejd-logo"
              onClick={() => navigate(ALL_JOBS_ROUTE)}
              aria-label="Open posted jobs"
            >
              <span><Sparkles /></span>
              <span className="ejd-brand-copy">
                <strong>ASKOXY.AI</strong>
                <small>Recruitment workspace</small>
              </span>
            </button>

            <button
              type="button"
              className="ejd-drawer-close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
            >
              <X />
            </button>
          </div>

          <div className="ejd-profile-card">
            <span className="ejd-avatar" aria-hidden="true"><UserRound /></span>
            <span className="ejd-profile-copy">
              <small>Signed in as</small>
              <strong>{companyName || "Company employee"}</strong>
              <span>ID · {shortEmployeeId(employeeId)}</span>
            </span>
            <ShieldCheck className="ejd-profile-shield" aria-label="Verified session" />
          </div>

          <div className="ejd-nav-section">
            <p>Job management</p>
            <nav className="ejd-nav">
              {sidebarItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `ejd-nav-item ${isActive ? "ejd-nav-item-active" : ""}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="ejd-nav-icon" aria-hidden="true">{item.icon}</span>
                  <span className="ejd-nav-copy">
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>
                  <ChevronRight className="ejd-nav-chevron" aria-hidden="true" />
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="ejd-sidebar-spacer" />

          <div className="ejd-help-card">
            <span aria-hidden="true"><CircleHelp /></span>
            <div>
              <strong>Need assistance?</strong>
              <small>Contact your company administrator.</small>
            </div>
          </div>

          <button type="button" className="ejd-logout" onClick={handleLogout}>
            <LogOut />
            <span>Sign out</span>
          </button>
        </aside>

        {sidebarOpen && (
          <button
            type="button"
            className="ejd-sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          />
        )}

        <div className="ejd-main-panel">
          <header className="ejd-topbar">
            <div className="ejd-topbar-left">
              <button
                type="button"
                className="ejd-menu-button"
                onClick={() => setSidebarOpen(true)}
                aria-controls="employee-navigation"
                aria-expanded={sidebarOpen}
                aria-label="Open navigation"
              >
                <Menu />
              </button>

              <div className="ejd-page-title">
                <small>Employee workspace</small>
                <strong>{currentItem.label}</strong>
              </div>
            </div>

            <div className="ejd-topbar-actions">
              <span className="ejd-secure-pill"><ShieldCheck /> Secure session</span>
              <button type="button" className="ejd-quick-post" onClick={() => navigate(ADD_JOB_ROUTE)}>
                <PlusCircle />
                <span>Post a job</span>
              </button>
            </div>
          </header>

          <div className="ejd-content"><Outlet /></div>
        </div>

        <nav className="ejd-mobile-nav" aria-label="Mobile employee navigation">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? "ejd-mobile-nav-active" : "")}
            >
              <span aria-hidden="true">{item.icon}</span>
              <small>{mobileLabel(item.label)}</small>
            </NavLink>
          ))}
        </nav>
      </div>
    </main>
  );
};

function shortEmployeeId(value: string): string {
  if (!value) return "Verified";
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

function mobileLabel(value: string): string {
  if (value === "Post a job") return "Post";
  return value;
}

export default EmployeeJobDashboard;











