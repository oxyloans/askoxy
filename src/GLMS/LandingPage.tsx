import React, { useEffect, useRef ,useState} from "react";
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
  
  // State to track active section
  const [activeLink, setActiveLink] = useState("home");

  // Create refs for each section to enable smooth scrolling
  const homeRef = useRef<HTMLDivElement | null>(null);
  const videosRef = useRef<HTMLDivElement | null>(null);
  const usecasesRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  // Handle navigation scroll
  const scrollToSection = (
    sectionId: "home" | "videos" | "usecases" | "contact"
  ) => {
    setActiveLink(sectionId);
    
    const sectionRefs = {
      home: homeRef,
      videos: videosRef,
      usecases: usecasesRef,
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

  // Set up scroll observation to update active link based on scroll position
  useEffect(() => {
    const observeScroll = () => {
      const sections = [
        { id: "home", ref: homeRef },
        { id: "videos", ref: videosRef },
        { id: "usecases", ref: usecasesRef },
        { id: "contact", ref: contactRef },
      ];

      // Find which section is currently in view
      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          // If the section is in the viewport (with some offset for the header)
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveLink(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", observeScroll);
    return () => window.removeEventListener("scroll", observeScroll);
  }, []);

  // Set initial active link based on URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && ["home", "videos", "usecases", "contact"].includes(hash)) {
      setTimeout(() => {
        scrollToSection(hash as "home" | "videos" | "usecases" | "contact");
      }, 100);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNavClick={scrollToSection} activeLink={activeLink} />
      <main className="flex-grow">
        <div ref={homeRef} id="home">
          <HeroSection />
        </div>
        <div ref={videosRef} id="videos">
          <VideoSection />
        </div>
        <div ref={usecasesRef} id="usecases">
          <DomainSection />
        </div>
        <div ref={contactRef} id="contact">
          <Footer />
        </div>
      </main>
    </div>
  );
}