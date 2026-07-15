import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  BriefcaseBusiness,
  Sparkles,
  Building2,
  Users,
} from "lucide-react";
import Logo from "../../assets/img/askoxylogonew.png";

const JPLHeader: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    closeMenu();
  };

  const handleJobNavigate = () => {
    const userId = localStorage.getItem("userId");
    const pathPrefix = userId ? "/main/viewjobdetails" : "/viewjobdetails";
    navigate(`${pathPrefix}/default/ALL`);
    closeMenu();
  };

  const navButtons = [
    {
      label: "Employers",
      icon: Building2,
      path: "/employers",
      type: "lightBlue",
    },
    {
      label: "Mentoring",
      icon: Users,
      path: "/mentors",
      type: "orange",
    },
  ];

  const glossyEmployerLightBtn =
    "group relative overflow-hidden rounded-2xl border border-[#93c5fd] bg-gradient-to-b from-[#f8fbff] via-[#dbeafe] to-[#bfdbfe] px-4 py-2.5 text-sm font-extrabold text-[#1d4ed8] shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-3px_0_rgba(147,197,253,0.55),0_5px_0_rgba(191,219,254,0.9)] transition-all duration-200 [transform:perspective(700px)_rotateX(8deg)_rotateY(-6deg)] hover:-translate-y-0.5 hover:[transform:perspective(700px)_rotateX(4deg)_rotateY(0deg)] active:translate-y-[3px]";

  const glossyOrangeBtn =
    "group relative overflow-hidden rounded-2xl border border-[#ea580c] bg-gradient-to-b from-[#fed7aa] via-[#f97316] to-[#c2410c] px-4 py-2.5 text-sm font-extrabold text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.42),inset_0_-3px_0_rgba(154,52,18,0.75),0_5px_0_rgba(154,52,18,0.85)] transition-all duration-200 [transform:perspective(700px)_rotateX(8deg)_rotateY(-6deg)] hover:-translate-y-0.5 hover:[transform:perspective(700px)_rotateX(4deg)_rotateY(0deg)] active:translate-y-[3px]";

  const glossyBlueBtn =
    "group relative overflow-hidden rounded-2xl border border-[#1d4ed8] bg-gradient-to-b from-[#7dd3fc] via-[#2563eb] to-[#0b4fb3] px-5 py-2.5 text-sm font-extrabold text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.42),inset_0_-3px_0_rgba(30,64,175,0.75),0_5px_0_rgba(30,64,175,0.95)] transition-all duration-200 [transform:perspective(700px)_rotateX(8deg)_rotateY(-6deg)] hover:-translate-y-0.5 hover:[transform:perspective(700px)_rotateX(4deg)_rotateY(0deg)] active:translate-y-[3px]";

  const glossyLightBtn =
    "group relative overflow-hidden rounded-2xl border border-[#dbeafe] bg-gradient-to-b from-white via-[#f8fbff] to-[#eef6ff] px-4 py-2.5 text-sm font-extrabold text-[#1d4ed8] shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-2px_0_rgba(191,219,254,0.65),0_4px_0_rgba(219,234,254,0.85)] transition-all duration-200";

  const shine =
    "pointer-events-none absolute -left-10 top-0 h-full w-8 rotate-12 bg-white/40 transition-all duration-700 group-hover:left-[120%]";

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/40 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-3 px-3 sm:h-[76px] sm:px-6 lg:px-16">
        <div className="flex min-w-0 items-center gap-4">
          <img
            src={Logo}
            alt="AskOxy Logo"
            className="hidden h-8 w-auto cursor-pointer object-contain transition hover:scale-[1.02] sm:h-9 md:block md:h-10"
            onClick={() => handleNavigate("/")}
          />

          <div
            onClick={() => handleNavigate("/jpl")}
            className="group relative flex min-w-0 cursor-pointer items-center gap-2 rounded-2xl px-1 py-1.5 transition-all duration-300 hover:bg-white/70 sm:gap-3 sm:px-2"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#1d4ed8] bg-gradient-to-b from-[#7dd3fc] via-[#2563eb] to-[#0b4fb3] text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.42),inset_0_-3px_0_rgba(30,64,175,0.75),0_4px_0_rgba(30,64,175,0.95)] [transform:perspective(700px)_rotateX(8deg)_rotateY(-8deg)] sm:h-10 sm:w-10 sm:rounded-2xl">
              <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/55 to-transparent" />
              <BriefcaseBusiness className="relative z-10 h-5 w-5" />
              <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-white p-[2px] text-[#2563eb]" />
            </div>

            <div className="min-w-0 leading-none">
              <div className="text-[13px] font-extrabold tracking-[0.14em] text-[#0f3d91] sm:text-[15px] sm:tracking-[0.18em]">
                JPL
              </div>

              <div className="mt-1 whitespace-nowrap text-[7px] font-semibold uppercase tracking-[0.08em] text-[#64748b] min-[380px]:text-[8px] min-[380px]:tracking-[0.1em] sm:text-[9px] sm:tracking-[0.16em]">
                Jobs Premier League
              </div>
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {navButtons.map((item) => {
            const Icon = item.icon;

            const btnClass =
              item.type === "orange" ? glossyOrangeBtn : glossyEmployerLightBtn;

            return (
              <button
                key={item.label}
                onClick={() => handleNavigate(item.path)}
                className={`${btnClass} flex items-center gap-2`}
              >
                <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/45 to-transparent" />
                <span className={shine} />

                <span className="relative flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
              </button>
            );
          })}

          <button onClick={handleJobNavigate} className={glossyBlueBtn}>
            <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/45 to-transparent" />
            <span className={shine} />
            <span className="relative">Apply Now</span>
          </button>
        </div>

        <button
          className={`${glossyLightBtn} flex h-11 w-11 shrink-0 items-center justify-center px-0 md:hidden`}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          aria-expanded={mobileMenuOpen}
        >
          <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/85 to-transparent" />

          <span className="relative">
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </span>
        </button>
      </div>

      <div
        className={`overflow-hidden bg-white/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-4 px-4 py-5 sm:px-6">
          <button
            onClick={() => handleNavigate("/jpl")}
            className={`${glossyLightBtn} flex w-full items-center justify-center gap-2 py-3`}
          >
            <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/85 to-transparent" />
            <span className={shine} />

            <span className="relative flex items-center gap-2">
              <BriefcaseBusiness className="h-4 w-4" />
              Jobs Premier League
            </span>
          </button>

          {navButtons.map((item) => {
            const Icon = item.icon;

            const btnClass =
              item.type === "orange" ? glossyOrangeBtn : glossyEmployerLightBtn;

            return (
              <button
                key={item.label}
                onClick={() => handleNavigate(item.path)}
                className={`${btnClass} flex w-full items-center justify-center gap-2 py-3`}
              >
                <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/45 to-transparent" />
                <span className={shine} />

                <span className="relative flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
              </button>
            );
          })}

          <button
            onClick={handleJobNavigate}
            className={`${glossyBlueBtn} w-full py-3`}
          >
            <span className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/45 to-transparent" />
            <span className={shine} />
            <span className="relative">Apply Now</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default JPLHeader;
