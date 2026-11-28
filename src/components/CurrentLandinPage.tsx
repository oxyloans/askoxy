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
  () => import("./WalkInInterviewStepsModal"),
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
      { rootMargin: "400px 0px" },
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
    <div
      ref={containerRef}
      style={{ minHeight: isVisible ? undefined : minHeight }}
    >
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

      {/* Floating Toll Free Helpline Button (Left side) - Matching Whiteboard Theme */}
      <div
        className="fixed bottom-3.5 left-3 z-[9999] pointer-events-auto flex items-center translate-y-0 opacity-100 transition-transform duration-300 sm:bottom-4 sm:left-4 md:bottom-5 md:left-5"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <a
          href="tel:04041897778"
          className="relative group flex items-center h-10 sm:h-11 md:h-12 rounded-full bg-[#f0f6ff]/95 hover:bg-white backdrop-blur-md p-1 sm:pl-1.5 sm:pr-3.5 sm:py-1.5 md:pl-2 md:pr-4 border-2 border-[#5b7fa8]/70 hover:border-[#3b82f6] shadow-lg shadow-blue-900/10 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer select-none"
          aria-label="Call Toll Free Helpline 040 4189 7778 (24/7 · 365 Days Available)"
          title="Toll Free Helpline: 040 4189 7778 (24/7 · 365 Days Available)"
        >
          {/* Phone icon circle with green live blinking dot */}
          <div className="relative flex h-8 w-8 sm:h-8.5 sm:w-8.5 md:h-9 md:w-9 items-center justify-center rounded-full bg-[#dce8fa] text-[#1e40af] shadow-xs shrink-0 group-hover:rotate-12 transition-transform">
            <PhoneCall className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-[#1e40af]" />

            {/* Animated pulsing green dot at top-right of icon */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
            </span>
          </div>

          {/* Text block: hidden on small mobile (< sm), visible on sm (tablet/desktop) */}
          <div className="hidden sm:flex items-center gap-2 md:gap-2.5 ml-2 mr-1 whitespace-nowrap">
            <span className="text-xs sm:text-[13px] md:text-sm font-bold text-[#0d2e63] tracking-tight">
              Toll Free: 040 4189 7778
            </span>
            <span className="rounded-full bg-[#eaf8ee] px-2.5 py-0.5 text-[11px] font-bold text-[#16a34a] border border-[#bbf7d0]/60">
              24/7
            </span>
          </div>
        </a>
      </div>

      {/* Floating "We Are Hiring" button (Right side) - Exactly aligned on the same bottom level */}
      <div
        className="fixed bottom-3.5 right-3 z-[9999] pointer-events-auto flex items-center translate-y-0 opacity-100 transition-transform duration-300 sm:bottom-4 sm:right-4 md:bottom-5 md:right-5"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <button
          onClick={() => setIsWalkInModalOpen(true)}
          className="flex items-center transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer border-0 bg-transparent p-0"
          aria-label="We are hiring"
          title="We are hiring"
          type="button"
        >
          <img
            src={ASK_OXY_ICON_URL}
            alt="We are hiring"
            className="h-10 sm:h-11 md:h-12 w-auto select-none drop-shadow-md block"
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
