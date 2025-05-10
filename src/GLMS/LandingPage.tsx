import React, { useEffect, useRef } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import VideoSection from "./VideoSection";
import DomainSection from "./DomainSection ";
import Footer from "./Footer";
import useScrollAnimation from "./useScrollAnimation";
import "./Animation.css";
// Main App Component
export default function LandingPage() {
   useScrollAnimation();
  // Create refs for each section to enable smooth scrolling
  const homeRef = useRef<HTMLDivElement | null>(null);
  const videosRef = useRef<HTMLDivElement | null>(null);
  const domainsRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  // Handle navigation scroll
  const scrollToSection = (sectionId: 'home' | 'videos' | 'domains' | 'contact') => {
    const sectionRefs = {
      home: homeRef,
      videos: videosRef,
      domains: domainsRef,
      contact: contactRef,
    };

    const targetRef = sectionRefs[sectionId];
    if (targetRef && targetRef.current) {
      // Add offset for header height
      const headerHeight = 64; // 16rem (h-16) in pixels
      const yOffset = -headerHeight;
      const y =
        targetRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Set initial active link based on URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && ['home', 'videos', 'domains', 'contact'].includes(hash)) {
      setTimeout(() => {
        scrollToSection(hash as 'home' | 'videos' | 'domains' | 'contact');
      }, 100);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div ref={homeRef} id="home">
          <HeroSection />
        </div>
        <div ref={videosRef} id="videos">
          <VideoSection />
        </div>
        <div ref={domainsRef} id="domains">
          <DomainSection />
        </div>
        <div ref={contactRef} id="contact">
          {/* Contact section would go here */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
