// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { Send, X } from "lucide-react";
// import StudyAbroadHeader from "./StudyAbroadHeader";
// import StudyAbroadHeroSection from "./StudyAbroadHeroSection";
// import CountriesSection from "./CountriesSection";
// import UniversitiesSection from "./UniversitiesSection";
// import TestimonialsSection from "./TestimonialsSection";
// import StudyAbroadFooter from "./StudyAbroadFooter";
// import CallToActionSection from "./CallToActionSection";
// import BASE_URL from "../Config";
// import ReactMarkdown from "react-markdown";
// import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/solid";
// // Add type definition for window.gtag if using analytics
// declare global {
//   interface Window {
//     gtag?: (
//       command: string,
//       action: string,
//       params?: {
//         [key: string]: any;
//       }
//     ) => void;
//   }
// }
// interface Message {
//   role: "user" | "assistant";
//   content: string;
//   isImage?: boolean;
// }

// // Main Study Abroad Landing Page Component
// export default function StudyAbroadLandingPage() {
//   // State to track active section
//   const [activeLink, setActiveLink] = useState("home");

//   // State for tracking page events (optional - for analytics)
//   const [pageEvents, setPageEvents] = useState({
//     pageLoaded: false,
//     scrollCount: 0,
//     lastInteraction: "",
//     visitDuration: 0,
//   });
//   const [showChat, setShowChat] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       role: "assistant",
//       content:
//         "👋 Hello! I’m UKAIRA, your study abroad assistant. How can I help you?",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const chatEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(scrollToBottom, [messages]);

//   const handleSend = useCallback(
//     async (messageContent?: string) => {
//       const textToSend = messageContent || input.trim();
//       if (!textToSend) return;

//       const userMessage: Message = { role: "user", content: textToSend };
//       const updatedMessages = [...messages, userMessage];
//       setMessages(updatedMessages);
//       setInput("");
//       setLoading(true);

//       try {
//         const response = await fetch(`${BASE_URL}/student-service/user/chat1`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updatedMessages),
//         });
//         const data = await response.text();

//         const isImageUrl = data.startsWith("http");
//         const assistantReply: Message = {
//           role: "assistant",
//           content: data,
//           isImage: isImageUrl,
//         };

//         setMessages([...updatedMessages, assistantReply]);
//       } catch (error) {
//         console.error("Chat error:", error);
//         setMessages([
//           ...updatedMessages,
//           {
//             role: "assistant",
//             content: "❌ Sorry, I encountered an error. Please try again.",
//           },
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [messages, input]
//   );

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !loading) {
//       handleSend();
//     }
//   };

//   // Create refs for each section to enable smooth scrolling
//   const homeRef = useRef<HTMLDivElement | null>(null);
//   const countriesRef = useRef<HTMLDivElement | null>(null);
//   const universitiesRef = useRef<HTMLDivElement | null>(null);
//   const testimonialsRef = useRef<HTMLDivElement | null>(null);
//   const contactRef = useRef<HTMLDivElement | null>(null);

//   // Set up session ID for tracking (optional)
//   useEffect(() => {
//     // Generate or retrieve session ID for analytics tracking
//     if (!window.sessionStorage.getItem("study_abroad_session_id")) {
//       const sessionId = `${Date.now()}-${Math.random()
//         .toString(36)
//         .substring(2, 12)}`;
//       window.sessionStorage.setItem("study_abroad_session_id", sessionId);

//       // Send session_start event if analytics is set up
//       if (typeof window.gtag === "function") {
//         window.gtag("event", "study_abroad_session_start", {
//           engagement_time_msec: 0,
//         });
//       }
//     }
//   }, []);

//   // Handle navigation scroll
//   const scrollToSection = (
//     sectionId:
//       | "home"
//       | "countries"
//       | "universities"
//       | "testimonials"
//       | "contact"
//   ) => {
//     setActiveLink(sectionId);

//     // Track the navigation event
//     setPageEvents((prev) => ({
//       ...prev,
//       lastInteraction: `Navigation to ${sectionId} section`,
//       scrollCount: prev.scrollCount + 1,
//     }));

//     // Send to analytics if configured
//     if (typeof window.gtag === "function") {
//       window.gtag("event", "select_content", {
//         content_type: "section",
//         content_id: sectionId,
//         item_id: sectionId,
//       });
//     }

//     const sectionRefs = {
//       home: homeRef,
//       countries: countriesRef,
//       universities: universitiesRef,
//       testimonials: testimonialsRef,
//       contact: contactRef,
//     };

//     const targetRef = sectionRefs[sectionId];
//     if (targetRef && targetRef.current) {
//       // Add offset for header height
//       const headerHeight = 80; // Adjust based on your header height
//       const yOffset = -headerHeight;
//       const y =
//         targetRef.current.getBoundingClientRect().top +
//         window.pageYOffset +
//         yOffset;

//       window.scrollTo({ top: y, behavior: "smooth" });
//     }
//   };

//   // Set up scroll observation to update active link based on scroll position
//   useEffect(() => {
//     const observeScroll = () => {
//       const sections = [
//         { id: "home", ref: homeRef },
//         { id: "countries", ref: countriesRef },
//         { id: "universities", ref: universitiesRef },
//         { id: "testimonials", ref: testimonialsRef },
//         { id: "contact", ref: contactRef },
//       ];

//       // Find which section is currently in view
//       for (const section of sections) {
//         if (section.ref.current) {
//           const rect = section.ref.current.getBoundingClientRect();
//           // If the section is in the viewport (with some offset for the header)
//           if (rect.top <= 100 && rect.bottom >= 100) {
//             if (activeLink !== section.id) {
//               setActiveLink(section.id);
//               // Track section view event
//               const now = new Date();
//               setPageEvents((prev) => ({
//                 ...prev,
//                 lastInteraction: `Viewed ${
//                   section.id
//                 } section at ${now.toLocaleTimeString()}`,
//               }));
//             }
//             break;
//           }
//         }
//       }
//     };

//     window.addEventListener("scroll", observeScroll);
//     return () => window.removeEventListener("scroll", observeScroll);
//   }, [activeLink]);

//   // Track scroll depth for analytics (optional)
//   useEffect(() => {
//     let lastScrollDepthTracked = 0;
//     const scrollDepthThresholds = [25, 50, 75, 100];

//     const trackScrollDepth = () => {
//       // Calculate scroll depth as percentage
//       const windowHeight = window.innerHeight;
//       const documentHeight = Math.max(
//         document.body.scrollHeight,
//         document.body.offsetHeight,
//         document.documentElement.clientHeight,
//         document.documentElement.scrollHeight,
//         document.documentElement.offsetHeight
//       );
//       const scrollTop =
//         window.pageYOffset || document.documentElement.scrollTop;

//       const scrollPercentage = Math.floor(
//         (scrollTop / (documentHeight - windowHeight)) * 100
//       );

//       // Find the next threshold to track
//       const thresholdToTrack = scrollDepthThresholds.find(
//         (threshold) =>
//           threshold > lastScrollDepthTracked && scrollPercentage >= threshold
//       );

//       // Send scroll event to analytics
//       if (thresholdToTrack) {
//         lastScrollDepthTracked = thresholdToTrack;

//         if (typeof window.gtag === "function") {
//           window.gtag("event", "study_abroad_scroll", {
//             percent_scrolled: thresholdToTrack,
//             content_type: "page",
//             content_id: activeLink,
//           });
//         }
//       }
//     };

//     window.addEventListener("scroll", trackScrollDepth);
//     return () => window.removeEventListener("scroll", trackScrollDepth);
//   }, [activeLink]);

//   // Set initial active link based on URL hash
//   useEffect(() => {
//     const hash = window.location.hash.replace("#", "");
//     if (
//       hash &&
//       ["home", "countries", "universities", "testimonials", "contact"].includes(
//         hash
//       )
//     ) {
//       setTimeout(() => {
//         scrollToSection(
//           hash as
//             | "home"
//             | "countries"
//             | "universities"
//             | "testimonials"
//             | "contact"
//         );
//       }, 100);
//     }

//     // Mark page as loaded
//     setPageEvents((prev) => ({
//       ...prev,
//       pageLoaded: true,
//       lastInteraction: `Page loaded at ${new Date().toLocaleTimeString()}`,
//     }));

//     // Send to analytics if configured
//     if (typeof window.gtag === "function") {
//       window.gtag("event", "study_abroad_page_view");

//       // Send first_visit event if this is potentially a new user
//       if (!localStorage.getItem("study_abroad_returning_visitor")) {
//         localStorage.setItem("study_abroad_returning_visitor", "true");
//         window.gtag("event", "study_abroad_first_visit", {
//           engagement_time_msec: 0,
//         });
//       }
//     }

//     // Log the page visit to console
//     console.log("Study Abroad page visit started", {
//       timestamp: new Date().toISOString(),
//       referrer: document.referrer,
//       userAgent: navigator.userAgent,
//     });
//   }, []);

//   // Track visit duration
//   useEffect(() => {
//     const startTime = Date.now();
//     const interval = setInterval(() => {
//       const duration = Math.floor((Date.now() - startTime) / 1000);
//       setPageEvents((prev) => ({
//         ...prev,
//         visitDuration: duration,
//       }));
//     }, 1000);

//     // Capture page exit event and send to analytics
//     const handleBeforeUnload = () => {
//       const duration = Math.floor((Date.now() - startTime) / 1000);

//       // Send user_engagement event to analytics
//       if (typeof window.gtag === "function") {
//         window.gtag("event", "user_engagement", {
//           engagement_time_msec: duration * 1000,
//         });
//       }

//       console.log("Study Abroad page exit", {
//         duration: duration,
//         lastSection: activeLink,
//         interactionCount: pageEvents.scrollCount,
//       });
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       clearInterval(interval);
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [activeLink, pageEvents.scrollCount]);

//   // Handle click events for analytics (optional)
//   const handleContentClick = (e: React.MouseEvent) => {
//     const target = e.target as HTMLElement;
//     const targetType = target.tagName.toLowerCase();
//     const targetId = target.id || "unknown";
//     const targetClass = target.className || "unknown";

//     setPageEvents((prev) => ({
//       ...prev,
//       lastInteraction: `Clicked ${targetType}#${targetId} element`,
//     }));

//     // Send click event to analytics
//     if (typeof window.gtag === "function") {
//       // Determine the event type based on the element
//       if (targetType === "button") {
//         window.gtag("event", "select_content", {
//           content_type: "button",
//           item_id: targetId || targetClass,
//           section_id: activeLink,
//         });
//       } else if (targetType === "a") {
//         const href = (target as HTMLAnchorElement).href;
//         // Check if this is an outbound link
//         const isExternal =
//           href && href.indexOf(window.location.hostname) === -1;

//         window.gtag("event", isExternal ? "click" : "select_content", {
//           content_type: isExternal ? "outbound_link" : "internal_link",
//           item_id: href || targetId,
//           outbound: isExternal,
//           section_id: activeLink,
//         });
//       } else {
//         // Generic element click
//         window.gtag("event", "select_content", {
//           content_type: targetType,
//           item_id: targetId || targetClass,
//           section_id: activeLink,
//         });
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen" onClick={handleContentClick}>
//       <StudyAbroadHeader
//         onNavClick={scrollToSection}
//         activeLink={activeLink}
//         onOpenChat={() => setShowChat(true)}
//       />
//       <main className="flex-grow">
//         <div ref={homeRef} id="home">
//           <StudyAbroadHeroSection />
//         </div>
//         <div ref={universitiesRef} id="universities">
//           <UniversitiesSection />
//         </div>
//         <div ref={countriesRef} id="countries">
//           <CountriesSection />
//         </div>
//         <div ref={testimonialsRef} id="testimonials">
//           <TestimonialsSection />
//         </div>
//         <div ref={contactRef} id="contact">
//           <CallToActionSection />
//         </div>
//         <div ref={contactRef} id="contact">
//           <StudyAbroadFooter />
//         </div>
//       </main>
//       {showChat && (
//         <div className="fixed bottom-20 right-3 sm:right-5 z-50 w-full max-w-[360px] h-[80vh] sm:h-[510px] bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col animate-fade-in">
//           {/* Header */}
//           <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-600 bg-purple-100 dark:bg-gray-800 rounded-t-xl">
//             <h2 className="text-sm font-semibold text-purple-800 dark:text-white">🧑‍🎓 UKAIRA Chat</h2>
//             <button
//               onClick={() => setShowChat(false)}
//               aria-label="Close chat"
//               className="text-gray-500 hover:text-red-500 transition-colors"
//             >
//               <XMarkIcon className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Chat Body */}
//           <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-gray-50 dark:bg-gray-800 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
//             {messages.map((msg, idx) => (
//               <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
//                 <div
//                   className={`max-w-[75%] px-4 py-2 text-sm rounded-2xl whitespace-pre-wrap shadow-md transition-all ${
//                     msg.role === "user"
//                       ? "bg-purple-600 text-white rounded-br-none"
//                       : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
//                   }`}
//                 >
//                   {msg.isImage ? (
//                     <img src={msg.content} alt="Response" className="rounded-md max-w-full" />
//                   ) : msg.role === "assistant" ? (
//                     <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
//                       {msg.content}
//                     </ReactMarkdown>
//                   ) : (
//                     msg.content
//                   )}
//                 </div>
//               </div>
//             ))}

//             {loading && (
//               <div className="flex justify-start">
//                 <div className="bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm px-4 py-2 rounded-2xl shadow rounded-bl-none">
//                   UKAIRA is thinking...
//                 </div>
//               </div>
//             )}
//             <div ref={chatEndRef} />
//           </div>

//           {/* Input */}
//           <div className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-900">
//             <div className="relative">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleKeyPress}
//                 placeholder="Type your message..."
//                 className="w-full py-2 pl-4 pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white placeholder-gray-400"
//                 disabled={loading}
//                 aria-label="Type your message"
//               />
//               <button
//                 onClick={() => handleSend()}
//                 disabled={!input.trim() || loading}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-800 dark:text-purple-300 dark:hover:text-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                 title="Send"
//                 aria-label="Send message"
//               >
//                 <Send className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import StudyAbroadHeader from "./StudyAbroadHeader";
import StudyAbroadHeroSection from "./StudyAbroadHeroSection";
import CountriesSection from "./CountriesSection";
import UniversitiesSection from "./UniversitiesSection";
import TestimonialsSection from "./TestimonialsSection";
import StudyAbroadFooter from "./StudyAbroadFooter";
import GlobalProgramsPage from "./GlobalProgramsPage";
import CallToActionSection from "./CallToActionSection";
import BASE_URL from "../Config";
import ReactMarkdown from "react-markdown";
import {
  PaperAirplaneIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";

// Add type definition for window.gtag if using analytics
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: { [key: string]: any }
    ) => void;
  }
}

interface Message {
  role: "user" | "assistant";
  content: string;
  isImage?: boolean;
}

export default function StudyAbroadLandingPage() {
  const [activeLink, setActiveLink] = useState("home");
  const [pageEvents, setPageEvents] = useState({
    pageLoaded: false,
    scrollCount: 0,
    lastInteraction: "",
    visitDuration: 0,
  });
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hello! I’m UKAIRA, your study abroad assistant. How can I help you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // hide welcome questions after first user message
  useEffect(() => {
    if (messages.length > 1) {
      setShowQuestions(false);
    }
  }, [messages]);

  const handleSend = useCallback(
    async (messageContent?: string) => {
      const textToSend = messageContent ?? input.trim();
      if (!textToSend) return;

      const userMessage: Message = { role: "user", content: textToSend };
      const updated = [...messages, userMessage];
      setMessages(updated);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch(`${BASE_URL}/student-service/user/chat1`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        const data = await res.text();
        const isImageUrl = data.startsWith("http");
        const reply: Message = {
          role: "assistant",
          content: data,
          isImage: isImageUrl,
        };
        setMessages([...updated, reply]);
      } catch (err) {
        console.error(err);
        setMessages([
          ...updated,
          {
            role: "assistant",
            content: "❌ Sorry, I encountered an error. Please try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, input]
  );

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSend();
    }
  };

  const handleQuestionClick = (q: string) => {
    setInput(q);
    handleSend(q);
    setShowQuestions(false); // Hide questions after selection
  };

  const homeRef = useRef<HTMLDivElement>(null);
  const workAbroadRef = useRef<HTMLDivElement>(null); // 👈 NEW
  const countriesRef = useRef<HTMLDivElement>(null);
  const universitiesRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    setActiveLink(sectionId);
    setPageEvents((p) => ({
      ...p,
      lastInteraction: `Navigation to ${sectionId}`,
      scrollCount: p.scrollCount + 1,
    }));
    if (typeof window.gtag === "function") {
      window.gtag("event", "select_content", {
        content_type: "section",
        content_id: sectionId,
        item_id: sectionId,
      });
    }
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      home: homeRef,
      workabroad: workAbroadRef, // 👈 NEW
      countries: countriesRef,
      universities: universitiesRef,
      testimonials: testimonialsRef,
      contact: contactRef,
    };
    const target = refs[sectionId];
    if (target?.current) {
      const yOffset = -80;
      const y =
        target.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Scroll observation
  useEffect(() => {
    const observeScroll = () => {
      const sections = [
        { id: "home", ref: homeRef },
        { id: "workabroad", ref: workAbroadRef }, // 👈 NEW
        { id: "countries", ref: countriesRef },
        { id: "universities", ref: universitiesRef },
        { id: "testimonials", ref: testimonialsRef },
        { id: "contact", ref: contactRef },
      ];
      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            if (activeLink !== section.id) {
              setActiveLink(section.id);
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

  // Scroll depth tracking
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
          window.gtag("event", "study_abroad_scroll", {
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

  // Initial active link and analytics
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (
      hash &&
      ["home", "countries", "universities", "testimonials", "contact"].includes(
        hash
      )
    ) {
      setTimeout(() => {
        scrollToSection(
          hash as
            | "home"
            | "countries"
            | "universities"
            | "testimonials"
            | "contact"
        );
      }, 100);
    }
    setPageEvents((prev) => ({
      ...prev,
      pageLoaded: true,
      lastInteraction: `Page loaded at ${new Date().toLocaleTimeString()}`,
    }));
    if (typeof window.gtag === "function") {
      window.gtag("event", "study_abroad_page_view");
      if (!localStorage.getItem("study_abroad_returning_visitor")) {
        localStorage.setItem("study_abroad_returning_visitor", "true");
        window.gtag("event", "study_abroad_first_visit", {
          engagement_time_msec: 0,
        });
      }
    }
    console.log("Study Abroad page visit started", {
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    });
  }, []);

  // Visit duration tracking
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
      console.log("Study Abroad page exit", {
        duration: duration,
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
      <StudyAbroadHeader
        onNavClick={scrollToSection}
        activeLink={activeLink}
        onOpenChat={() => setShowChat(true)}
      />
      <main className="flex-grow">
        <div ref={homeRef} id="home">
          <StudyAbroadHeroSection />
        </div>
        <div ref={workAbroadRef} id="workabroad">
          <GlobalProgramsPage />
        </div>
        <div ref={universitiesRef} id="universities">
          <UniversitiesSection />
        </div>
        <div ref={countriesRef} id="countries">
          <CountriesSection />
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

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-700 to-purple-600 text-white rounded-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        aria-label="Toggle UKAIRA Chat"
        title="Chat with UKAIRA"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6 sm:w-5 sm:h-5" />
        <span className="sr-only">Chat with UKAIRA</span>
      </button>

      {/* Chat Window */}
      {showChat && (
        <div
          className={`fixed z-50 w-full max-w-[320px] sm:max-w-[360px] min-h-[70vh] sm:h-[480px] bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-700 flex flex-col animate-slide-up overflow-hidden sm:bottom-20 sm:right-4 md:bottom-20 md:right-4 ${
            window.innerWidth < 640
              ? "top-0 left-0 h-full w-full"
              : "bottom-20 right-4"
          }`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 dark:border-gray-600 bg-gradient-to-r from-purple-700 to-purple-600 text-white">
            <div className="flex items-center space-x-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              <h2 className="text-sm font-semibold pt-2">Chat with UKAIRA</h2>
            </div>
            <button
              onClick={() => setShowChat(false)}
              aria-label="Close chat"
              className="p-1 hover:bg-purple-800 transition-colors rounded-md"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-gray-50 dark:bg-gray-800 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-500 to-purple-300 text-white rounded-md"
                      : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                  }`}
                >
                  {msg.isImage ? (
                    <img
                      src={msg.content}
                      alt="Response"
                      className="max-w-full h-auto"
                      loading="lazy"
                    />
                  ) : msg.role === "assistant" ? (
                    <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none leading-relaxed">
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <span className="leading-relaxed">{msg.content}</span>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm px-3 py-2 animate-pulse rounded-md">
                  UKAIRA is thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input and Questions */}
          <div className="p-3 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
            {showQuestions && (
              <div className="space-y-1 mb-2">
                {[
                  "What are the top UK universities?",
                  "What are the admission requirements?",
                  "How much does it cost to study in the UK?",
                  "What scholarships are available?",
                ].map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuestionClick(question)}
                    className="w-full text-left px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
            <div className="relative flex items-center p-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about studying abroad..."
                className="w-full py-2 pl-3 pr-12 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white placeholder-gray-500 transition-all duration-200 rounded-md"
                disabled={loading}
                aria-label="Type your message"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 dark:text-purple-300 dark:hover:text-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send message"
                aria-label="Send message"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #9ca3af;
          border-radius: 4px;
        }

        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #4b5563;
        }
      `}</style>
    </div>
  );
}
