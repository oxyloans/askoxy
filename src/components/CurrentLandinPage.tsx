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
import ScrollToTop from "./ScrollToTop";
import BMVCoinPromo from "./BMVCoinPromo";
import Whiteboardtheme from "./whiteboardtheme";

const CurrentLandingPage: React.FC = () => {
  const heroRef = React.useRef<HTMLDivElement | null>(null);
  const [showFireworks, setShowFireworks] = React.useState(false);

  React.useEffect(() => {
    if (!heroRef.current) return;

    const io = new IntersectionObserver(
      ([entry]) => setShowFireworks(entry.isIntersecting),
      {
        threshold: 0.35,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    io.observe(heroRef.current);

    return () => io.disconnect();
  }, []);

  return (
    <>
      <ScrollToTop />

      <div className="relative z-[1] overflow-visible">
        <Header />

        <div className="pt-[60px] overflow-visible">
          <section className="relative z-[1] overflow-visible">
            <Whiteboardtheme />
          </section>

          <section className="relative z-[5] overflow-visible">
            <OXYGroupCompanies />
          </section>

          <section ref={heroRef} className="relative z-[1]">
            <UnicornGrid />
          </section>

          <section>
            <FreeAiBook />
          </section>

          <section>
            <ServicesSlider />
          </section>

          <section>
            <BMVCoinPromo />
          </section>

          <section>
            <FreeGPTs />
          </section>

          <section>
            <AwardPage />
          </section>

          <section>
            <OurPeople />
          </section>

          <section>
            <PdfPages />
          </section>

          <section>
            <Footer />
          </section>
        </div>
      </div>
    </>
  );
};

export default CurrentLandingPage;