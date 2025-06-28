import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import VideoSection from "./VideoSection";
import DomainSection from "./DomainSection ";
import Footer from "./Footer";
import useScrollAnimation from "./useScrollAnimation";
import "./Animation.css";

// Add type definition for window.gtag
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

// Main App Component
export default function LandingPage() {
  useScrollAnimation();
  
  // State to track active section
  const [activeLink, setActiveLink] = useState("home");
  
  // State for tracking page events
  const [pageEvents, setPageEvents] = useState({
    pageLoaded: false,
    scrollCount: 0,
    lastInteraction: "",
    visitDuration: 0
  });

  // Create refs for each section to enable smooth scrolling
  const homeRef = useRef<HTMLDivElement | null>(null);
  const videosRef = useRef<HTMLDivElement | null>(null);
  const usecasesRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  // Set up session ID for tracking
  useEffect(() => {
    // Generate or retrieve session ID for GA4 tracking
    if (!window.sessionStorage.getItem('session_id')) {
      const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 12)}`;
      window.sessionStorage.setItem('session_id', sessionId);
      
      // Send session_start event to GA4
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'glms_session_start', {
          engagement_time_msec: 0
        });
      }
    }
  }, []);

  // Handle navigation scroll
  const scrollToSection = (
    sectionId: "home" | "videos" | "usecases" | "contact"
  ) => {
    setActiveLink(sectionId);
    
    // Track the navigation event with GA4 naming convention
    setPageEvents(prev => ({
      ...prev,
      lastInteraction: `Navigation to ${sectionId} section`,
      scrollCount: prev.scrollCount + 1
    }));
    
    // Send to GA4 - select_content event
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'select_contenttype', {
        content_type: 'section',
        content_id: sectionId,
        item_id: sectionId
      });
    }
    
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
            if (activeLink !== section.id) {
              setActiveLink(section.id);
              // Track section view event with GA4 naming convention
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

  // Track scroll depth for GA4
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
      
      // Send scroll event to GA4
      if (thresholdToTrack) {
        lastScrollDepthTracked = thresholdToTrack;
        
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'glms_scroll', {
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
    if (hash && ["home", "videos", "usecases", "contact"].includes(hash)) {
      setTimeout(() => {
        scrollToSection(hash as "home" | "videos" | "usecases" | "contact");
      }, 100);
    }
    
    // Mark page as loaded and send to GA4
    setPageEvents(prev => ({
      ...prev,
      pageLoaded: true,
      lastInteraction: `Page loaded at ${new Date().toLocaleTimeString()}`
    }));
    
    // Send to GA4 - page_view event with initial load data
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'glms_page_view');
      
      // Send first_visit event if this is potentially a new user
      if (!localStorage.getItem('returning_visitor')) {
        localStorage.setItem('returning_visitor', 'true');
        window.gtag('event', 'glms_first_open', {
          engagement_time_msec: 0
        });
      }
    }
    
    // Log the page visit to console
    console.log("Page visit started", {
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
    
    // Capture page exit event and send to GA4
    const handleBeforeUnload = () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      
      // Send user_engagement event to GA4
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'user_engagement_glms', {
          engagement_time_msec: duration * 1000
        });
      }
      
      console.log("Page exit", {
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
  
  // Add video progress tracking
  const trackVideoProgress = (video: HTMLVideoElement) => {
    const progressMarkers = [25, 50, 75, 100];
    let lastProgressMarker = 0;
    
    const checkProgress = () => {
      if (!video) return;
      
      const percentWatched = Math.floor((video.currentTime / video.duration) * 100);
      const nextMarker = progressMarkers.find(marker => 
        marker > lastProgressMarker && percentWatched >= marker
      );
      
      if (nextMarker) {
        lastProgressMarker = nextMarker;
        if (typeof window.gtag === 'function') {
          window.gtag('event', nextMarker === 100 ? 'glms_video_complete' : 'glms_video_progress', {
            video_title: video.id || 'unnamed_video',
            video_provider: 'html5',
            video_percent: nextMarker,
            video_current_time: video.currentTime,
            video_duration: video.duration
          });
        }
      }
    };
    
    video.addEventListener('timeupdate', checkProgress);
  };
  
  // Set up video tracking when videos are in the DOM
  useEffect(() => {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      trackVideoProgress(video);
      
      // Track video start
      video.addEventListener('play', () => {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'glms_video_start', {
            video_title: video.id || 'unnamed_video',
            video_provider: 'html5',
            video_current_time: video.currentTime,
            video_duration: video.duration
          });
        }
      });
      
      // Track video pause
      video.addEventListener('pause', () => {
        if (video.currentTime < video.duration) { // Only if not ended
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'glms_video_pause', {
              video_title: video.id || 'unnamed_video',
              video_provider: 'html5',
              video_current_time: video.currentTime,
              video_duration: video.duration,
              video_percent: Math.floor((video.currentTime / video.duration) * 100)
            });
          }
        }
      });
    });
  }, []);
  
  // Track click events
  const handleContentClick = (e: React.MouseEvent) => {
    // Get information about what was clicked
    const target = e.target as HTMLElement;
    const targetType = target.tagName.toLowerCase();
    const targetId = target.id || 'unknown';
    const targetClass = target.className || 'unknown';
    
    setPageEvents(prev => ({
      ...prev,
      lastInteraction: `Clicked ${targetType}#${targetId} element`
    }));
    
    // Send click event to GA4 with appropriate naming
    if (typeof window.gtag === 'function') {
      // Determine the event type based on the element
      if (targetType === 'button') {
        window.gtag('event', 'select_contenttype', {
          content_type: 'button',
          item_id: targetId || targetClass,
          section_id: activeLink
        });
      } else if (targetType === 'a') {
        const href = (target as HTMLAnchorElement).href;
        // Check if this is an outbound link
        const isExternal = href && href.indexOf(window.location.hostname) === -1;
        
        window.gtag('event', isExternal ? 'glms_clickforvideo' : 'select_contenttype', {
          content_type: isExternal ? 'outbound_link' : 'internal_link',
          item_id: href || targetId,
          outbound: isExternal,
          section_id: activeLink
        });
      } else if (targetType === 'video' || target.closest('video')) {
        const video = target.closest('video') || target;
        window.gtag('event', 'glms_video_start', {
          video_title: video.id || 'unnamed_video',
          video_current_time: (video as HTMLVideoElement).currentTime,
          video_duration: (video as HTMLVideoElement).duration,
          video_percent: Math.round(((video as HTMLVideoElement).currentTime / (video as HTMLVideoElement).duration) * 100)
        });
      } else if (targetType === 'form' || target.closest('form')) {
        const form = target.closest('form') || target;
        window.gtag('event', 'glms_begin_form', {
          form_id: form.id || 'unknown',
          form_name: (form as HTMLFormElement).name || 'unnamed',
          form_destination: (form as HTMLFormElement).action || 'unknown'
        });
      } else {
        // Generic element click
        window.gtag('event', 'select_contenttype', {
          content_type: targetType,
          item_id: targetId || targetClass,
          section_id: activeLink
        });
      }
    }
    
    // Log click event to console
    console.log("Element clicked", {
      element: targetType,
      id: targetId,
      class: targetClass,
      section: activeLink,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="flex flex-col min-h-screen" onClick={handleContentClick}>
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
      
      {/* Optional: Debug panel for events - remove in production */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-0 right-0 bg-black bg-opacity-75 text-white p-2 text-xs z-50">
          <div>Active Section: {activeLink}</div>
          <div>Visit Duration: {pageEvents.visitDuration}s</div>
          <div>Scroll Count: {pageEvents.scrollCount}</div>
          <div>Last Action: {pageEvents.lastInteraction}</div>
          <div>Analytics: {typeof window.gtag === 'function' ? 'Enabled' : 'Disabled'}</div>
        </div>
      )} */}
    </div>
  );
}