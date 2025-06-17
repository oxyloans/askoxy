import React from "react";

import Header from "./Header";
import ServicesSlider from "./ServicesSlider";
import HorizontalScrollGallery from "./CurrentSevices";
import FreeGPTs from "./FreeGPTs";
import BMVCoinPromo from "./BMVCoinPromo";
import OXYGroupCompanies from "./OXYGroupCompanies";
import Footer from "./Footer";
import OurPeople from "./OurTeam";
import PdfPages from "./Presentation";
import UnicornGrid from "./SuperOurApp";

const CurrentLandingPage: React.FC = () => {
  return (
    <>
      <section>
        <Header />
      </section>
      {/* <section>
        <UnicornGrid />
      </section> */}
      <section className="mt-4">
        <HorizontalScrollGallery />
      </section>
      <section>
        <ServicesSlider />
      </section>
      <section>
        {" "}
        <BMVCoinPromo />
      </section>
      <section>
        <FreeGPTs />
      </section>
      <section>
        {" "}
        <OurPeople />
      </section>

      <section>
        {" "}
        <PdfPages />
      </section>

      <section>
        {" "}
        <OXYGroupCompanies />
      </section>

      <section>
        <Footer />
      </section>
    </>
  );
};

export default CurrentLandingPage;
