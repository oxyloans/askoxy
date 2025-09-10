// src/BharathAIStore/components/DashboardHeader.tsx
// UPDATED: mobile hamburger trigger via onOpenMenu prop

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/img/bharatAI.png";

interface DashboardHeaderProps {
  onOpenMenu?: () => void; // optional; shown on mobile
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onOpenMenu }) => {
  const navigate = useNavigate();
  const [compact, setCompact] = useState(false);

  const handleSignout = () => {
    const entryPoint = localStorage.getItem("entryPoint") || "/";
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("entryPoint", entryPoint);
    navigate(entryPoint);
  };

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={[
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        compact ? "bg-white/95 backdrop-blur shadow-sm border-slate-200" : "bg-white border-slate-100",
      ].join(" ")}
      aria-label="Dashboard header"
    >
      <header className="h-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex h-full items-center justify-between gap-3">
            {/* LEFT: Hamburger (mobile) + Logo */}
            <div className="flex items-center gap-2 min-w-0">
              {/* Mobile hamburger */}
              {onOpenMenu && (
                <button
                  onClick={onOpenMenu}
                  className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-slate-200 hover:bg-slate-100"
                  aria-label="Open menu"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}

              <button
                onClick={() => navigate("/bharath-aistore")}
                className="flex items-center gap-2"
                aria-label="Go to Home"
              >
                <img src={Logo} alt="Bharat AI Store" className="h-8 w-auto md:h-10" />
              </button>
            </div>

            {/* RIGHT: Sign out */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSignout}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm md:text-base font-semibold px-4 md:px-5 py-2.5 rounded-full shadow hover:shadow-md transition-all"
                aria-label="Sign out"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                  <path d="M10 17l5-5-5-5M15 12H3" />
                </svg>
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default DashboardHeader;
