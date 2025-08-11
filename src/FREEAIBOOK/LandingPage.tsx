import React, { useEffect, useRef, useState, useCallback } from "react";


import Header from "./Header";
import HeroSection from "./HeroSection";


import BASE_URL from "../Config";





// Define interfaces
interface Message {
  role: "user" | "assistant";
  content: string;
  isImage?: boolean;
}

interface PageEvents {
  pageLoaded: boolean;
  scrollCount: number;
  lastInteraction: string;
  visitDuration: number;
}

const FreeAiBookLandingPage: React.FC = () => {
 

  const [activeLink, setActiveLink] = useState<
    "home" | "videos" | "usecases" | "contact"
  >("home");

  const [pageEvents, setPageEvents] = useState<PageEvents>({
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
        "👋 Welcome to GLMS Support! Ask about loan processing, system features, or troubleshooting. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (showChat) {
      setTimeout(() => {
        document.querySelector<HTMLInputElement>(".ant-input")?.focus();
      }, 300);
    }
  }, [showChat]);

  const handleSend = useCallback(
    async (messageContent?: string) => {
      const textToSend = messageContent ?? input.trim();
      if (!textToSend) return;

      // Add user message optimistically
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: textToSend },
      ]);
      setInput("");
      setLoading(true);

      try {
        const updatedMessages = [
          ...messages,
          { role: "user", content: textToSend },
        ];

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

        setMessages((prevMessages) => [...prevMessages, assistantReply]);
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content: "❌ Sorry, I encountered an error. Please try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, messages]
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) handleSend();
  };

  const handleChatIconClick = useCallback(() => {
    setShowChat((prev) => {
      const newShowChat = !prev;
      setPageEvents((prevEvents) => ({
        ...prevEvents,
        lastInteraction: `Chat ${
          newShowChat ? "opened" : "closed"
        } at ${new Date().toLocaleTimeString()}`,
      }));
      return newShowChat;
    });
  }, []);

  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    videos: useRef<HTMLDivElement>(null),
    usecases: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  const scrollToSection = useCallback((sectionId: keyof typeof sectionRefs) => {
    setActiveLink(sectionId);
    setPageEvents((prev) => ({
      ...prev,
      lastInteraction: `Navigation to ${sectionId} section`,
      scrollCount: prev.scrollCount + 1,
    }));

    const headerHeight = 64;
    const targetRef = sectionRefs[sectionId];

    if (targetRef?.current) {
      const y =
        targetRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  const handleContentClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const targetType = target.tagName.toLowerCase();
      const targetId = target.id || "unknown";
      const targetClass = target.className || "unknown";

      setPageEvents((prev) => ({
        ...prev,
        lastInteraction: `Clicked ${targetType}#${targetId}`,
      }));
    },
    []
  );

  // Calculate drawer width once on render, fallback to 400
  const drawerWidth = window.innerWidth < 640 ? "100%" : 400;

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-50"
      onClick={handleContentClick}
    >
      <Header/>
      <main className="flex-grow">
        <section ref={sectionRefs.home} id="home">
          <HeroSection />
        </section>
       
        
      </main>

     
    </div>
  );
};

export default FreeAiBookLandingPage;
