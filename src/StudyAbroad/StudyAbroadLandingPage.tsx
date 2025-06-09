import React, { useEffect, useRef, useState } from "react";
import StudyAbroadHeader from "./StudyAbroadHeader";
import StudyAbroadHeroSection from "./StudyAbroadHeroSection";
import CountriesSection from "./CountriesSection";
import UniversitiesSection from "./UniversitiesSection";
import TestimonialsSection from "./TestimonialsSection";
import StudyAbroadFooter from "./StudyAbroadFooter";
import CallToActionSection from "./CallToActionSection";

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

// Main Study Abroad Landing Page Component
export default function StudyAbroadLandingPage() {
  // State to track active section
  const [activeLink, setActiveLink] = useState("home");
  
  // State for tracking page events (optional - for analytics)
  const [pageEvents, setPageEvents] = useState({
    pageLoaded: false,
    scrollCount: 0,
    lastInteraction: "",
    visitDuration: 0
  });

  // Create refs for each section to enable smooth scrolling
  const homeRef = useRef<HTMLDivElement | null>(null);
  const countriesRef = useRef<HTMLDivElement | null>(null);
  const universitiesRef = useRef<HTMLDivElement | null>(null);
  const testimonialsRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  // Set up session ID for tracking (optional)
  useEffect(() => {
    // Generate or retrieve session ID for analytics tracking
    if (!window.sessionStorage.getItem('study_abroad_session_id')) {
      const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 12)}`;
      window.sessionStorage.setItem('study_abroad_session_id', sessionId);
      
      // Send session_start event if analytics is set up
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'study_abroad_session_start', {
          engagement_time_msec: 0
        });
      }
    }
  }, []);

  // Handle navigation scroll
  const scrollToSection = (
    sectionId: "home" | "countries" | "universities" | "testimonials" | "contact"
  ) => {
    setActiveLink(sectionId);
    
    // Track the navigation event
    setPageEvents(prev => ({
      ...prev,
      lastInteraction: `Navigation to ${sectionId} section`,
      scrollCount: prev.scrollCount + 1
    }));
    
    // Send to analytics if configured
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'select_content', {
        content_type: 'section',
        content_id: sectionId,
        item_id: sectionId
      });
    }
    
    const sectionRefs = {
      home: homeRef,
      countries: countriesRef,
      universities: universitiesRef,
      testimonials: testimonialsRef,
      contact: contactRef,
    };

    const targetRef = sectionRefs[sectionId];
    if (targetRef && targetRef.current) {
      // Add offset for header height
      const headerHeight = 80; // Adjust based on your header height
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
        { id: "countries", ref: countriesRef },
        { id: "universities", ref: universitiesRef },
        { id: "testimonials", ref: testimonialsRef },
        { id: "contact", ref: contactRef },
      ];

      // Find which section is currently in view
      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          // If the section is in the viewport (with some offset for the header)
          if (rect.top <= 100 && rect.bottom >= 100) {
            if (activeLink !== section.id) {
              setActiveLink(section.id);
              // Track section view event
              const now = new Date();
              setPageEvents(prev => ({
                ...prev,
                lastInteraction: `Viewed ${section.id} section at ${now.toLocaleTimeString()}`
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

  // Track scroll depth for analytics (optional)
  useEffect(() => {
    let lastScrollDepthTracked = 0;
    const scrollDepthThresholds = [25, 50, 75, 100];
    
    const trackScrollDepth = () => {
      // Calculate scroll depth as percentage
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight, 
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight, 
        document.documentElement.offsetHeight
      );
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const scrollPercentage = Math.floor((scrollTop / (documentHeight - windowHeight)) * 100);
      
      // Find the next threshold to track
      const thresholdToTrack = scrollDepthThresholds.find(threshold => 
        threshold > lastScrollDepthTracked && scrollPercentage >= threshold
      );
      
      // Send scroll event to analytics
      if (thresholdToTrack) {
        lastScrollDepthTracked = thresholdToTrack;
        
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'study_abroad_scroll', {
            percent_scrolled: thresholdToTrack,
            content_type: 'page',
            content_id: activeLink
          });
        }
      }
    };
    
    window.addEventListener('scroll', trackScrollDepth);
    return () => window.removeEventListener('scroll', trackScrollDepth);
  }, [activeLink]);

  // Set initial active link based on URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && ["home", "countries", "universities", "testimonials", "contact"].includes(hash)) {
      setTimeout(() => {
        scrollToSection(hash as "home" | "countries" | "universities" | "testimonials" | "contact");
      }, 100);
    }
    
    // Mark page as loaded
    setPageEvents(prev => ({
      ...prev,
      pageLoaded: true,
      lastInteraction: `Page loaded at ${new Date().toLocaleTimeString()}`
    }));
    
    // Send to analytics if configured
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'study_abroad_page_view');
      
      // Send first_visit event if this is potentially a new user
      if (!localStorage.getItem('study_abroad_returning_visitor')) {
        localStorage.setItem('study_abroad_returning_visitor', 'true');
        window.gtag('event', 'study_abroad_first_visit', {
          engagement_time_msec: 0
        });
      }
    }
    
    // Log the page visit to console
    console.log("Study Abroad page visit started", {
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      userAgent: navigator.userAgent
    });
  }, []);
  
  // Track visit duration
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      setPageEvents(prev => ({
        ...prev,
        visitDuration: duration
      }));
    }, 1000);
    
    // Capture page exit event and send to analytics
    const handleBeforeUnload = () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      
      // Send user_engagement event to analytics
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'user_engagement', {
          engagement_time_msec: duration * 1000
        });
      }
      
      console.log("Study Abroad page exit", {
        duration: duration,
        lastSection: activeLink,
        interactionCount: pageEvents.scrollCount
      });
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [activeLink, pageEvents.scrollCount]);
  
  // Handle click events for analytics (optional)
  const handleContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const targetType = target.tagName.toLowerCase();
    const targetId = target.id || 'unknown';
    const targetClass = target.className || 'unknown';
    
    setPageEvents(prev => ({
      ...prev,
      lastInteraction: `Clicked ${targetType}#${targetId} element`
    }));
    
    // Send click event to analytics
    if (typeof window.gtag === 'function') {
      // Determine the event type based on the element
      if (targetType === 'button') {
        window.gtag('event', 'select_content', {
          content_type: 'button',
          item_id: targetId || targetClass,
          section_id: activeLink
        });
      } else if (targetType === 'a') {
        const href = (target as HTMLAnchorElement).href;
        // Check if this is an outbound link
        const isExternal = href && href.indexOf(window.location.hostname) === -1;
        
        window.gtag('event', isExternal ? 'click' : 'select_content', {
          content_type: isExternal ? 'outbound_link' : 'internal_link',
          item_id: href || targetId,
          outbound: isExternal,
          section_id: activeLink
        });
      } else {
        // Generic element click
        window.gtag('event', 'select_content', {
          content_type: targetType,
          item_id: targetId || targetClass,
          section_id: activeLink
        });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen" onClick={handleContentClick}>
      <StudyAbroadHeader onNavClick={scrollToSection} activeLink={activeLink} />
      <main className="flex-grow">
        <div ref={homeRef} id="home">
          <StudyAbroadHeroSection />
        </div>
        <div ref={countriesRef} id="countries">
          <CountriesSection />
        </div>
        <div ref={universitiesRef} id="universities">
          <UniversitiesSection />
        </div>
        <div ref={testimonialsRef} id="testimonials">
          <TestimonialsSection />
        </div>
        <div ref={contactRef} id="contact">
          <CallToActionSection />
        </div>
        <div ref={contactRef} id="contact">
          <StudyAbroadFooter />
        </div>
      </main>
      
    </div>
  );
}