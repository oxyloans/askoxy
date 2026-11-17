import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "./Header";
import ServicesSlider from "./ServicesSlider";
import FreeGPTs from "./FreeGPTs";
import OXYGroupCompanies from "./OXYGroupCompanies";
import Footer from "./Footer";
import OurPeople from "./OurTeam";
import PdfPages from "./Presentation";
import UnicornGrid from "./SuperOurApp";
import AwardPage from "./Award";
import FreeAiBook from "./FreeAiBook";
import BMVCoinPromo from "./BMVCoinPromo";
import Whiteboardtheme from "./whiteboardtheme";
import RadhAISection from "./radhAIsection";
import PartnerSection from "./PartnerSection";
import WalkInInterviewStepsModal from "./WalkInInterviewStepsModal";
import { PhoneCall } from "lucide-react";

const ASK_OXY_ICON_URL = "https://i.ibb.co/d0Hs3TVv/hireicon.png";

const CurrentLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);

  return (
    <div className="relative z-[1] overflow-x-hidden bg-white">
      <Header />

      <main className="overflow-visible pt-[60px]">
        <section className="relative z-[1]">
          <Whiteboardtheme />
        </section>

        <section className="relative z-[1]">
          <OXYGroupCompanies />
        </section>

        <section className="relative z-[1]">
          <UnicornGrid />
        </section>

        <section className="relative z-[1]">
          <FreeAiBook />
        </section>

        <section className="relative z-[1]">
          <ServicesSlider />
        </section>

        <section className="relative z-[1]">
          <RadhAISection />
        </section>

        <section className="relative z-[1]">
          <BMVCoinPromo />
        </section>

        <section className="relative z-[1]">
          <FreeGPTs />
        </section>

        <section className="relative z-[1]">
          <AwardPage />
        </section>
        <section className="relative z-[1]">
          <PartnerSection />
        </section>

        <section className="relative z-[1]">
          <OurPeople />
        </section>

        <section className="relative z-[1]">
          <PdfPages />
        </section>

        <Footer />
      </main>

      {/* Floating Toll Free Helpline Button (Direct Phone Call) */}
      <div
        className="fixed bottom-4 left-3 z-[9999] pointer-events-auto translate-y-0 opacity-100 transition-transform duration-300 sm:bottom-5 sm:left-4 md:left-5"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <a
          href="tel:04041897778"
          className="group flex items-center gap-2 sm:gap-2.5 rounded-full bg-white/95 backdrop-blur-md pl-1.5 pr-3.5 py-1.5 sm:pl-2 sm:pr-4 sm:py-2 text-slate-800 shadow-xl shadow-emerald-950/15 border border-emerald-400 hover:border-emerald-500 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Call Toll Free Helpline 040 4189 7778 (24/7 · 365 Days Available)"
          title="Toll Free Helpline: 040 4189 7778 (24/7 · 365 Days Available)"
        >
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-green-500 text-white shadow-md shadow-emerald-600/30 shrink-0 group-hover:rotate-12 transition-transform">
            <PhoneCall className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Toll Free
              </span>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
              040 4189 7778
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 whitespace-nowrap">
              24/7 · 365 Days Available
            </span>
          </div>
        </a>
      </div>

      {/* Floating "We Are Hiring" button visible throughout the entire landing page on scroll */}
      <div
        className="fixed bottom-4 right-1 z-[9999] pointer-events-auto translate-y-0 opacity-100 transition-transform duration-300 sm:bottom-5 sm:right-2 md:right-4"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <button
          onClick={() => setIsWalkInModalOpen(true)}
          className="transition-transform duration-300 hover:scale-105 active:scale-95"
          aria-label="We are hiring"
          title="We are hiring"
          type="button"
        >
          <img
            src={ASK_OXY_ICON_URL}
            alt="We are hiring"
            className="h-12 w-auto select-none sm:h-14 md:h-16 lg:h-20"
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        </button>
      </div>

      <WalkInInterviewStepsModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        onActionClick={() => navigate("/wearehiring")}
      />
    </div>
  );
};

export default CurrentLandingPage;
