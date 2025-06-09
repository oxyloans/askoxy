import React, { useEffect, useRef, useState } from "react";

import AIBlockchainHeader from "./AIBlockchainHeader";
import AIBlockchainHeroSection from "./AIBlockchainHeroSection";
import OurServices from "./AiBlockchainOurServices";
import AIBlockchainFooter from "./AIBlockchainFooter";

// Add type definition for window.gtag if using analytics
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: {
        [key: string]: any;
      }
    ) => void;
  }
}

export default function AIBlockchainAndItServices() {
  const [activeLink, setActiveLink] = useState<"home" | "services" | "contact">(
    "home"
  );

  const [pageEvents, setPageEvents] = useState({
    pageLoaded: false,
    scrollCount: 0,
    lastInteraction: "",
    visitDuration: 0,
  });

  const homeRef = useRef<HTMLDivElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null); // 🆕 Header ref for dynamic height

  // Track session ID
  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "ai_blockchain_session_start", {
        engagement_time_msec: 0,
      });
    }
  }, []);

  const scrollToSection = (sectionId: "home" | "services" | "contact") => {
    setActiveLink(sectionId);

    setPageEvents((prev) => ({
      ...prev,
      lastInteraction: `Navigation to ${sectionId} section`,
      scrollCount: prev.scrollCount + 1,
    }));

    if (typeof window.gtag === "function") {
      window.gtag("event", "select_content", {
        content_type: "section",
        content_id: sectionId,
        item_id: sectionId,
      });
    }

    const sectionRefs = {
      home: homeRef,
      services: servicesRef,
      contact: contactRef,
    };

    const targetRef = sectionRefs[sectionId];
    const headerHeight = headerRef.current?.offsetHeight || 80; // 🧠 Get header height dynamically
    const yOffset = -headerHeight;
    const y = targetRef.current
      ? targetRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset
      : 0;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    const observeScroll = () => {
      const sections = [
        { id: "home", ref: homeRef },
        { id: "services", ref: servicesRef },
        { id: "contact", ref: contactRef },
      ];

      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            if (activeLink !== section.id) {
              setActiveLink(section.id as typeof activeLink);
              setPageEvents((prev) => ({
                ...prev,
                lastInteraction: `Viewed ${
                  section.id
                } section at ${new Date().toLocaleTimeString()}`,
              }));
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", observeScroll);
    return () => window.removeEventListener("scroll", observeScroll);
  }, [activeLink]);

  useEffect(() => {
    let lastScrollDepthTracked = 0;
    const scrollDepthThresholds = [25, 50, 75, 100];

    const trackScrollDepth = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercentage = Math.floor(
        (scrollTop / (documentHeight - windowHeight)) * 100
      );

      const thresholdToTrack = scrollDepthThresholds.find(
        (threshold) =>
          threshold > lastScrollDepthTracked && scrollPercentage >= threshold
      );

      if (thresholdToTrack) {
        lastScrollDepthTracked = thresholdToTrack;
        if (typeof window.gtag === "function") {
          window.gtag("event", "ai_blockchain_scroll", {
            percent_scrolled: thresholdToTrack,
            content_type: "page",
            content_id: activeLink,
          });
        }
      }
    };

    window.addEventListener("scroll", trackScrollDepth);
    return () => window.removeEventListener("scroll", trackScrollDepth);
  }, [activeLink]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (["home", "services", "contact"].includes(hash)) {
      setTimeout(() => {
        scrollToSection(hash as "home" | "services" | "contact");
      }, 100);
    }

    setPageEvents((prev) => ({
      ...prev,
      pageLoaded: true,
      lastInteraction: `Page loaded at ${new Date().toLocaleTimeString()}`,
    }));

    if (typeof window.gtag === "function") {
      window.gtag("event", "ai_blockchain_page_view");
    }

    console.log("AI Blockchain & IT Services page visit started", {
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    });
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      setPageEvents((prev) => ({
        ...prev,
        visitDuration: duration,
      }));
    }, 1000);

    const handleBeforeUnload = () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      if (typeof window.gtag === "function") {
        window.gtag("event", "user_engagement", {
          engagement_time_msec: duration * 1000,
        });
      }

      console.log("AI Blockchain & IT Services page exit", {
        duration,
        lastSection: activeLink,
        interactionCount: pageEvents.scrollCount,
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [activeLink, pageEvents.scrollCount]);

  const handleContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const targetType = target.tagName.toLowerCase();
    const targetId = target.id || "unknown";
    const targetClass = target.className || "unknown";

    setPageEvents((prev) => ({
      ...prev,
      lastInteraction: `Clicked ${targetType}#${targetId} element`,
    }));

    if (typeof window.gtag === "function") {
      if (targetType === "button") {
        window.gtag("event", "select_content", {
          content_type: "button",
          item_id: targetId || targetClass,
          section_id: activeLink,
        });
      } else if (targetType === "a") {
        const href = (target as HTMLAnchorElement).href;
        const isExternal =
          href && href.indexOf(window.location.hostname) === -1;

        window.gtag("event", isExternal ? "click" : "select_content", {
          content_type: isExternal ? "outbound_link" : "internal_link",
          item_id: href || targetId,
          outbound: isExternal,
          section_id: activeLink,
        });
      } else {
        window.gtag("event", "select_content", {
          content_type: targetType,
          item_id: targetId || targetClass,
          section_id: activeLink,
        });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen" onClick={handleContentClick}>
      <AIBlockchainHeader 
        onNavClick={scrollToSection}
        activeLink={activeLink}
      />
      <main className="flex-grow">
        <div ref={homeRef} id="home">
          <AIBlockchainHeroSection />
        </div>
        <div ref={servicesRef} id="services">
          <OurServices />
        </div>
        <div ref={contactRef} id="contact">
          <AIBlockchainFooter />
        </div>
      </main>
    </div>
  );
}
