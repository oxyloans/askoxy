import React, { useEffect, useRef, useState, useCallback } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import VideoSection from "./VideoSection";
import DomainSection from "./DomainSection ";
import Footer from "./Footer";
import useScrollAnimation from "./useScrollAnimation";
import "./Animation.css";
import {
  XMarkIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";
import { Send } from "lucide-react";
import BASE_URL from "../Config";


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

// Define Message interface
interface Message {
  role: "user" | "assistant";
  content: string;
  isImage?: boolean;
}

export default function LandingPage() {
  useScrollAnimation();

  // State to track active section
  const [activeLink, setActiveLink] = useState("home");

  // State for tracking page events
  const [pageEvents, setPageEvents] = useState({
    pageLoaded: false,
    scrollCount: 0,
    lastInteraction: "",
    visitDuration: 0,
  });

  // State for chat
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Welcome to GLMS Support, your assistant for Global Lending Management Systems queries. Ask me about loan processing, system features, or troubleshooting. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = useCallback(
    async (messageContent?: string) => {
      const textToSend = messageContent || input.trim();
      if (!textToSend) return;

      const userMessage: Message = { role: "user", content: textToSend };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setLoading(true);

      try {
        const response = await fetch(`${BASE_URL}/student-service/user/chat1`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedMessages),
        });
        const data = await response.text();

        const isImageUrl = data.startsWith("http");
        const assistantReply: Message = {
          role: "assistant",
          content: data,
          isImage: isImageUrl,
        };

        setMessages([...updatedMessages, assistantReply]);
      } catch (error) {
        console.error("Chat error:", error);
        setMessages([
          ...updatedMessages,
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

  // Handle chat icon click
  const handleChatIconClick = () => {
    setShowChat((prev) => {
      const newShowChat = !prev;

      // Track chat open/close event with GA4
      if (typeof window.gtag === "function") {
        window.gtag(
          "event",
          newShowChat ? "glms_chat_open" : "glms_chat_close",
          {
            content_type: "chat",
            item_id: "ukaira_chat",
            section_id: activeLink,
          }
        );
      }

      // Update page events
      setPageEvents((prev) => ({
        ...prev,
        lastInteraction: `Chat ${
          newShowChat ? "opened" : "closed"
        } at ${new Date().toLocaleTimeString()}`,
      }));

      // Log to console
      console.log("Chat interaction", {
        action: newShowChat ? "opened" : "closed",
        section: activeLink,
        timestamp: new Date().toISOString(),
      });

      return newShowChat;
    });
  };

  // Create refs for each section
  const homeRef = useRef<HTMLDivElement | null>(null);
  const videosRef = useRef<HTMLDivElement | null>(null);
  const usecasesRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  // Scroll to section function
  const scrollToSection = (
    sectionId: "home" | "videos" | "usecases" | "contact"
  ) => {
    setActiveLink(sectionId);
    setPageEvents((prev) => ({
      ...prev,
      lastInteraction: `Navigation to ${sectionId} section`,
      scrollCount: prev.scrollCount + 1,
    }));

    if (typeof window.gtag === "function") {
      window.gtag("event", "select_contenttype", {
        content_type: "section",
        content_id: sectionId,
        item_id: sectionId,
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
      const headerHeight = 64;
      const yOffset = -headerHeight;
      const y =
        targetRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

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
        window.gtag("event", "select_contenttype", {
          content_type: "button",
          item_id: targetId || targetClass,
          section_id: activeLink,
        });
      } else if (targetType === "a") {
        const href = (target as HTMLAnchorElement).href;
        const isExternal =
          href && href.indexOf(window.location.hostname) === -1;

        window.gtag(
          "event",
          isExternal ? "glms_clickforvideo" : "select_contenttype",
          {
            content_type: isExternal ? "outbound_link" : "internal_link",
            item_id: href || targetId,
            outbound: isExternal,
            section_id: activeLink,
          }
        );
      } else if (targetType === "video" || target.closest("video")) {
        const video = target.closest("video") || target;
        window.gtag("event", "glms_video_start", {
          video_title: video.id || "unnamed_video",
          video_current_time: (video as HTMLVideoElement).currentTime,
          video_duration: (video as HTMLVideoElement).duration,
          video_percent: Math.round(
            ((video as HTMLVideoElement).currentTime /
              (video as HTMLVideoElement).duration) *
              100
          ),
        });
      } else if (targetType === "form" || target.closest("form")) {
        const form = target.closest("form") || target;
        window.gtag("event", "glms_begin_form", {
          form_id: form.id || "unknown",
          form_name: (form as HTMLFormElement).name || "unnamed",
          form_destination: (form as HTMLFormElement).action || "unknown",
        });
      } else {
        window.gtag("event", "select_contenttype", {
          content_type: targetType,
          item_id: targetId || targetClass,
          section_id: activeLink,
        });
      }
    }

    console.log("Element clicked", {
      element: targetType,
      id: targetId,
      class: targetClass,
      section: activeLink,
      timestamp: new Date().toISOString(),
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

      {/* Chat Icon Button */}
      <button
        onClick={handleChatIconClick}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 p-3 sm:p-4 bg-purple-600 text-white rounded-full shadow-2xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
        aria-label="Toggle GLMS Support Chat"
        title="Chat with GLMS Support"
      >
        <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      {/* Chat Window */}
      {showChat && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[90vw] max-w-[400px] h-[70vh] sm:h-[600px] md:h-[650px] bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col animate-slide-up transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b dark:border-gray-600 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-purple-800 dark:text-white">
                🧑‍💼 GLMS Support
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-300">
                Powered by UKAIRA
              </span>
            </div>
            <button
              onClick={() => setShowChat(false)}
              aria-label="Close chat"
              className="text-gray-500 hover:text-red-500 transition-colors duration-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 dark:bg-gray-800 scrollbar-thin scrollbar-thumb-purple-400 dark:scrollbar-thumb-gray-500 scrollbar-track-gray-100 dark:scrollbar-track-gray-900">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 text-sm rounded-2xl whitespace-pre-wrap shadow-lg transition-all duration-200 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none"
                      : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                  }`}
                >
                  {msg.isImage ? (
                    <img
                      src={msg.content}
                      alt="Response"
                      className="rounded-md max-w-full h-auto"
                    />
                  ) : msg.role === "assistant" ? (
                    <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none text-gray-900 dark:text-gray-100">
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <span className="text-white">{msg.content}</span>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm px-4 py-3 rounded-2xl shadow rounded-bl-none">
                  GLMS Support is processing...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-2xl">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about GLMS features or issues..."
                className="w-full py-3 pl-5 pr-12 text-sm border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white placeholder-gray-400 transition-all duration-200"
                disabled={loading}
                aria-label="Type your GLMS-related question"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-800 dark:text-purple-300 dark:hover:text-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                title="Send GLMS question"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
