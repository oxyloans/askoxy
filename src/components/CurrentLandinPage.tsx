import React from "react";

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

const CurrentLandingPage: React.FC = () => {
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
    </div>
  );
};

export default CurrentLandingPage;
