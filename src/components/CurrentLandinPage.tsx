// CurrentLandingPage.tsx
import React from "react";
import { createPortal } from "react-dom";
import Header from "./Header";
import ServicesSlider from "./ServicesSlider";
import FreeGPTs from "./FreeGPTs";
import BMVCoinPromo from "./BMVCoinPromo";
import OXYGroupCompanies from "./OXYGroupCompanies";
import Footer from "./Footer";
import OurPeople from "./OurTeam";
import PdfPages from "./Presentation";
import UnicornGrid from "./SuperOurApp";
import AwardPage from "./Award";
import FreeAiBook from "./FreeAiBook";

// Import the background (still exported from SuperOurApp.tsx)
// import { AnimatedDiwaliBackground } from "./SuperOurApp";

const CurrentLandingPage: React.FC = () => {
  const heroRef = React.useRef<HTMLDivElement | null>(null);
  const [showFireworks, setShowFireworks] = React.useState(false);

  React.useEffect(() => {
    if (!heroRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setShowFireworks(entry.isIntersecting),
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(heroRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <>

      {/* Everything else sits above the fixed background */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <section><Header /></section>

        {/* SuperOurApp hero (the observed section) */}
        <section ref={heroRef}><UnicornGrid /></section>

        <section><FreeAiBook /></section>
        <section><ServicesSlider /></section>
        <section><BMVCoinPromo /></section>
        <section><FreeGPTs /></section>
        <section><AwardPage /></section>
        <section><OurPeople /></section>
        <section><PdfPages /></section>
        <section><OXYGroupCompanies /></section>
        <section><Footer /></section>
      </div>
    </>
  );
};

export default CurrentLandingPage;
