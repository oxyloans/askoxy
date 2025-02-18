import React from "react";

import HeroSection from "./HeroSection";
import InfoSection from "./InfoSection";

import Footer from "./Footer";

import PdfPages from "./PdfPages";
import OxyGroupCarousel from "./OxyGroupCarousel";
import SearchSection from "./SearchSection";
import OurPeople from "./OurTeam";


const Landingpage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="mb-8">
        <HeroSection />
      </section>

      {/* Info Section */}
      <section className="">
        <InfoSection />
      </section>

      {/* Search Section */}
      <section className="">
        <SearchSection />
      </section>

      {/* Our People Section */}
      <section className="">
        <OurPeople />
      </section>
      <section>
        <PdfPages />
      </section>

      {/* Oxy Group Carousel */}
      <section className="mb-2">
        <OxyGroupCarousel />
      </section>

      {/* Footer Section */}
      <footer className="m-0">
        <Footer />
      </footer>
    </div>
  );
};

export default Landingpage;
