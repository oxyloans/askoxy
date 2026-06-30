import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { message } from "antd";
import { removeFreelanceAccessToken, removeFreelanceRefreshToken } from "../utils/cookieUtils";
import { setEmployeePreviousPath, clearEmployeeSession } from "../utils/employeeTokenManager";

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

const NAV = [
  {
    key: "/employee-dashboard",
    label: "My Dashboard",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    key: "/employee-requirement-list",
    label: "Job Requirements",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
];

const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const companyName = sessionStorage.getItem("Name") || "Company";

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/employee-")) {
      setEmployeePreviousPath(location.pathname + location.search);
    }
  }, [location]);

  const isRestricted =
    location.pathname === "/employee-login" ||
    location.pathname === "/employee-register";

  const handleLogout = () => {
    Swal.fire({
      title: "Sign Out",
      text: "Are you sure you want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, Sign Out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setEmployeePreviousPath(location.pathname + location.search);
        removeFreelanceAccessToken();
        removeFreelanceRefreshToken();
        clearEmployeeSession();
        message.success("Signed out successfully!");
        setTimeout(() => navigate("/employee-login", { replace: true }), 300);
      }
    });
  };

  if (isRestricted) return <>{children}</>;

  const sideW = collapsed ? 64 : 224;

  /* ── White sidebar ── */
  const SidebarBody = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex h-full flex-col border-r border-gray-100 bg-white">

      {/* Brand row */}
      <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4">
        {(!collapsed || mobile) ? (
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-[11px] font-bold text-white">
              FH
            </div>
            <span className="text-sm font-bold text-gray-800">AskOxy Hire</span>
          </div>
        ) : (
          <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-[11px] font-bold text-white">
            FH
          </div>
        )}
        {mobile && (
          <button
            onClick={() => setDrawerOpen(false)}
            className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV.map((item) => {
          const active = location.pathname === item.key;
          return (
            <Link
              key={item.key}
              to={item.key}
              onClick={() => mobile && setDrawerOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <span className={`shrink-0 ${active ? "text-indigo-600" : "text-gray-400"}`}>
                {item.icon}
              </span>
              {(!collapsed || mobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — Sign Out only */}
      <div className="border-t border-gray-100 px-3 py-3">
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-red-600 ${
            collapsed && !mobile ? "justify-center" : ""
          }`}
        >
          <svg className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {(!collapsed || mobile) && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Desktop sidebar */}
      {!isMobile && (
        <aside
          className="fixed inset-y-0 left-0 z-40 overflow-hidden transition-all duration-200"
          style={{ width: sideW }}
        >
          <SidebarBody />
        </aside>
      )}

      {/* Mobile overlay drawer */}
      {isMobile && drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-56 shadow-xl">
            <SidebarBody mobile />
          </aside>
        </>
      )}

      {/* Main shell */}
      <div
        className="flex min-h-screen flex-1 flex-col transition-all duration-200"
        style={{ marginLeft: isMobile ? 0 : sideW }}
      >
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-6">

          {/* Left: hamburger + page title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => isMobile ? setDrawerOpen(true) : setCollapsed(!collapsed)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-gray-700">
              {NAV.find((n) => n.key === location.pathname)?.label ?? "Employer Portal"}
            </span>
          </div>

          {/* Right: user icon + name */}
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">{companyName}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 sm:px-6 md:px-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white px-6 py-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} AskOxy Hire · Powered by OxyLoans
        </footer>
      </div>
    </div>
  );
};

export default EmployeeLayout;
