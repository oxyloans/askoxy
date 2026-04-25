import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, BriefcaseBusiness, Sparkles } from "lucide-react";
import Logo from "../../assets/img/askoxylogonew.png";

const JPLHeader: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleJobNavigate = (id: string | null) => {
    const userId = localStorage.getItem("userId");
    const pathPrefix = userId ? "/main/viewjobdetails" : "/viewjobdetails";
    navigate(id ? `${pathPrefix}/${id}/ALL` : `${pathPrefix}/default/ALL`);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/40 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:h-[76px] sm:px-6 lg:px-16">

        {/* LEFT */}
        <div className="flex items-center gap-6 sm:gap-4">
          
          {/* Main Logo */}
          <img
            src={Logo}
            alt="AskOxy Logo"
            className="h-8 w-auto cursor-pointer object-contain sm:h-9 md:h-10"
            onClick={() => navigate("/")}
          />

          {/* JPL Brand (NO BORDER, CLEAN) */}
          <div className="relative flex items-center gap-2 px-2 py-1.5">

            {/* ICON */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2f7df6] via-[#2563eb] to-[#0b5bd3] text-white shadow-[0_10px_20px_rgba(37,99,235,0.25)]">
              
              {/* Gloss effect */}
              <div className="pointer-events-none absolute inset-x-1 top-0 h-1/2 rounded-t-xl bg-gradient-to-b from-white/40 to-transparent" />

              <BriefcaseBusiness className="relative h-5 w-5" />

              {/* small sparkle */}
              <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-[#2563eb] bg-white rounded-full p-[2px]" />
            </div>

            {/* TEXT */}
            <div className="leading-none">
              <div className="text-[14px] font-extrabold tracking-[0.18em] text-[#0f3d91] sm:text-[15px]">
                JPL
              </div>
              <div className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-[#64748b] sm:block">
                Jobs Premier League
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP BUTTON */}
        <div className="hidden md:flex">
          <button
            onClick={() => handleJobNavigate(null)}
            className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#2f7df6] to-[#0b5bd3] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(11,91,211,0.24)] transition duration-300 hover:scale-[1.02] hover:from-[#3b86fb] hover:to-[#094cb3]"
          >
            <span className="pointer-events-none absolute inset-x-1 top-0 h-1/2 rounded-t-xl bg-gradient-to-b from-white/30 to-transparent" />
            <span className="relative">View Jobs</span>
          </button>
        </div>

        {/* MOBILE MENU */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-[#0f3d91] shadow-sm md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      <div
        className={`overflow-hidden bg-white/90 backdrop-blur-xl transition-all duration-300 md:hidden ${
          mobileMenuOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 sm:px-6">
          <button
            onClick={() => handleJobNavigate(null)}
            className="relative w-full rounded-xl bg-gradient-to-b from-[#2f7df6] to-[#0b5bd3] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(11,91,211,0.22)] transition duration-300 hover:from-[#3b86fb] hover:to-[#094cb3]"
          >
            <span className="pointer-events-none absolute inset-x-1 top-0 h-1/2 rounded-t-xl bg-gradient-to-b from-white/30 to-transparent" />
            <span className="relative">View Jobs</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default JPLHeader;