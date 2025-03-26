import React from "react";

import Header from "./Header";
import ServicesSlider from "./ServicesSlider";
import HorizontalScrollGallery from "./ServicesUI";
import FreeGPTs from "./FreeGPTs";
import BMVCoinPromo from "./BMVCoinPromo";
import OXYGroupCompanies from "./OXYGroupCompanies";
import Footer from "./Footer";
import OurPeople from "./OurTeam";
import PdfPages from "./Presentation";

const Landingpage: React.FC = () => {
  return (
    <>
      <section>
        <Header />
      </section>

      <section>
        <HorizontalScrollGallery />
      </section>
      <section className="mt-0">
        <ServicesSlider />
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
        <BMVCoinPromo />
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

export default Landingpage;
