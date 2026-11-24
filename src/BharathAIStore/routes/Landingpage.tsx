import React, { useRef } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SearchProvider } from "../context/SearchContext";
import { PhoneCall } from "lucide-react";
const Layout: React.FC = () => {
  // Section refs
  const bharatAgentsStoreRef = useRef<HTMLDivElement>(null);
  const aiResourcesRef = useRef<HTMLDivElement>(null);
  const freeAIBookRef = useRef<HTMLDivElement>(null);
  const allAIStoresRef = useRef<HTMLDivElement>(null);

  return (
    <SearchProvider>
      <div className="flex min-h-screen flex-col bg-white">
        <Header
          bharatAgentsStoreRef={bharatAgentsStoreRef}
          aiResourcesRef={aiResourcesRef}
          freeAIBookRef={freeAIBookRef}
          allAIStoresRef={allAIStoresRef}
        />
        <main className="flex-1">
          <Outlet />
        </main>
        <div className="pt-2">
          <Footer />
        </div>

        {/* Floating Toll Free Helpline Button */}
        <div
          className="fixed bottom-4 left-3 z-[9999] pointer-events-auto translate-y-0 opacity-100 transition-transform duration-300 sm:bottom-5 sm:left-4 md:left-5"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <a
            href="tel:04041897778"
            className="relative group flex items-center rounded-full bg-[#120f28]/95 backdrop-blur-md p-1.5 sm:pl-2 sm:pr-4 sm:py-2 text-white shadow-xl shadow-purple-950/60 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Call Toll Free Helpline 040 4189 7778 (24/7 · 365 Days Available)"
            title="Toll Free Helpline: 040 4189 7778 (24/7 · 365 Days Available)"
          >
            {/* Peach/Orange circular phone icon */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fde3cf] text-[#9a3412] shadow-sm shrink-0 group-hover:rotate-12 transition-transform">
              <PhoneCall className="h-4.5 w-4.5" />
            </div>

            {/* Text block: hidden on mobile (< sm), visible on sm and up */}
            <div className="hidden sm:flex flex-col text-left leading-tight sm:ml-2.5">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-100">
                  TOLL FREE HELPLINE
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-cyan-400">
                  • 24/7
                </span>
              </div>

              <span className="text-xs sm:text-[14px] font-extrabold text-white tracking-wide">
                040 4189 7778
              </span>
            </div>

            {/* Floating Tooltip on hover for mobile view */}
            <div className="sm:hidden absolute bottom-full left-0 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-50">
              <div className="flex flex-col whitespace-nowrap rounded-xl bg-[#120f28]/95 px-3 py-1.5 text-white shadow-xl border border-purple-400/40 backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-100 uppercase tracking-wider">
                    TOLL FREE • 24/7
                  </span>
                </div>
                <span className="text-xs font-black text-white">040 4189 7778</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </SearchProvider>
  );
};

export default Layout;
