import React from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Building2 } from "lucide-react";
import Logo from "../../assets/img/askoxylogonew.png";

const GCCMateHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-16">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <img
            src={Logo}
            alt="ASKOXY.AI"
            onClick={() => navigate("/")}
            className="h-8 cursor-pointer object-contain sm:h-10"
          />

          <div className="h-8 w-px bg-gray-200 sm:h-10" />

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4c1d95] via-[#2D1070] to-[#1E0A4C] text-white shadow-lg sm:h-12 sm:w-12">
              <div className="absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/40 to-transparent" />
              <Globe className="h-5 w-5 opacity-90" />
              <Building2 className="absolute bottom-1 right-1 h-3.5 w-3.5 text-[#f5c842]" />
            </div>

            <div className="min-w-0 leading-none">
              <div className="truncate text-[14px] font-extrabold tracking-[0.14em] text-[#1E0A4C] sm:text-[17px] sm:tracking-[0.18em]">
                GCC MATE
              </div>
              <div className="mt-1 truncate text-[8px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-[9px] sm:tracking-[0.25em]">
                Global Capability Centers
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GCCMateHeader;