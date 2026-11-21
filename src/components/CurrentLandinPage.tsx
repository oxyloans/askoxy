import React, { useEffect, useState, useRef, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";

import Header from "./Header";
import Whiteboardtheme from "./whiteboardtheme";
import { PhoneCall } from "lucide-react";

// Below-the-fold components lazy-loaded for peak Lighthouse Speed Index & TBT
const OXYGroupCompanies = lazy(() => import("./OXYGroupCompanies"));
const UnicornGrid = lazy(() => import("./SuperOurApp"));
const FreeAiBook = lazy(() => import("./FreeAiBook"));
const ServicesSlider = lazy(() => import("./ServicesSlider"));
const RadhAISection = lazy(() => import("./radhAIsection"));
const BMVCoinPromo = lazy(() => import("./BMVCoinPromo"));
const FreeGPTs = lazy(() => import("./FreeGPTs"));
const AwardPage = lazy(() => import("./Award"));
const PartnerSection = lazy(() => import("./PartnerSection"));
const OurPeople = lazy(() => import("./OurTeam"));
const PdfPages = lazy(() => import("./Presentation"));
const Footer = lazy(() => import("./Footer"));
const WalkInInterviewStepsModal = lazy(
  () => import("./WalkInInterviewStepsModal")
);

const ASK_OXY_ICON_URL = "https://i.ibb.co/d0Hs3TVv/hireicon.png";

// Minimal placeholder during deferred loading to preserve layout stability (zero CLS)
const SectionPlaceholder: React.FC<{ minHeight?: string }> = ({
  minHeight = "260px",
}) => (
  <div
    style={{ minHeight }}
    className="w-full flex items-center justify-center opacity-0 pointer-events-none"
    aria-hidden="true"
  />
);

// Viewport-aware deferred loader: mounts sections ~400px before reaching viewport
const LazySection: React.FC<{
  children: React.ReactNode;
  minHeight?: string;
  fallbackDelay?: number;
}> = ({ children, minHeight = "240px", fallbackDelay = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Idle fallback ensures everything loads seamlessly even without scroll
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, fallbackDelay);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [fallbackDelay]);

  return (
    <div ref={containerRef} style={{ minHeight: isVisible ? undefined : minHeight }}>
      {isVisible ? (
        <Suspense fallback={<SectionPlaceholder minHeight={minHeight} />}>
          {children}
        </Suspense>
      ) : (
        <SectionPlaceholder minHeight={minHeight} />
      )}
    </div>
  );
};

const CurrentLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);

  return (
    <div className="relative z-[1] overflow-x-hidden bg-white">
      <Header />

      <main className="overflow-visible pt-[60px]">
        {/* Above-the-fold Hero Section: renders synchronously for instant FCP and LCP */}
        <section className="relative z-[1]">
          <Whiteboardtheme />
        </section>

        {/* Below-the-fold Sections: lazy-loaded with intersection observer */}
        <section className="relative z-[1]">
          <LazySection minHeight="140px" fallbackDelay={1200}>
            <OXYGroupCompanies />
          </LazySection>
        </section>

        <section className="relative z-[1]">
          <LazySection minHeight="450px" fallbackDelay={1800}>
            <UnicornGrid />
          </LazySection>
        </section>

        <section className="relative z-[1]">
          <LazySection minHeight="400px" fallbackDelay={2200}>
            <FreeAiBook />
          </LazySection>
        </section>

        <section className="relative z-[1]">
          <LazySection minHeight="500px" fallbackDelay={2600}>
            <ServicesSlider />
          </LazySection>
        </section>

        <section className="relative z-[1]">
          <LazySection minHeight="380px" fallbackDelay={3000}>
            <RadhAISection />
          </LazySection>
        </section>

        <section className="relative z-[1]">
          <LazySection minHeight="320px" fallbackDelay={3400}>
            <BMVCoinPromo />
          </LazySection>
        </section>

        <section className="relative z-[1]">
          <LazySection minHeight="260px" fallbackDelay={3800}>
            <FreeGPTs />
          </LazySection>
        </section>

        <section className="relative z-[1]">
          <LazySection minHeight="420px" fallbackDelay={4200}>
            <AwardPage />
          </LazySection>
        </section>

        <section className="relative z-[1]">
          <LazySection minHeight="360px" fallbackDelay={4600}>
            <PartnerSection />
          </LazySection>
        </section>

        <section className="relative z-[1]">
          <LazySection minHeight="400px" fallbackDelay={5000}>
            <OurPeople />
          </LazySection>
        </section>

        <section className="relative z-[1]">
          <LazySection minHeight="420px" fallbackDelay={5400}>
            <PdfPages />
          </LazySection>
        </section>

        <LazySection minHeight="360px" fallbackDelay={5800}>
          <Footer />
        </LazySection>
      </main>

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

      {/* Floating "We Are Hiring" button */}
      <div
        className="fixed bottom-4 right-3 z-[9999] pointer-events-auto translate-y-0 opacity-100 transition-transform duration-300 sm:bottom-5 sm:right-4 md:right-5"
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
            className="h-11 w-auto select-none sm:h-12 md:h-14 lg:h-16"
            draggable={false}
            loading="lazy"
            decoding="async"
            width="80"
            height="80"
          />
        </button>
      </div>

      {/* Modal loaded only when open */}
      {isWalkInModalOpen && (
        <Suspense fallback={null}>
          <WalkInInterviewStepsModal
            isOpen={isWalkInModalOpen}
            onClose={() => setIsWalkInModalOpen(false)}
            onActionClick={() => navigate("/wearehiring")}
          />
        </Suspense>
      )}
    </div>
  );
};

export default CurrentLandingPage;