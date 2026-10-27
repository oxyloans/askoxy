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
