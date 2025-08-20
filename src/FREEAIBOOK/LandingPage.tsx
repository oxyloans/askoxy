import React, { useCallback, useRef, useState, useEffect } from "react";
import FreeAIBookHome from "./HeroSection";

interface PageEvents {
  pageLoaded: boolean;
  scrollCount: number;
  lastInteraction: string;
  visitDuration: number;
}

const FreeAiBookLandingPage: React.FC = () => {
  const [pageEvents, setPageEvents] = useState<PageEvents>({
    pageLoaded: false,
    scrollCount: 0,
    lastInteraction: "",
    visitDuration: 0,
  });

  useEffect(() => {
    setPageEvents((prev) => ({ ...prev, pageLoaded: true }));
    const startTime = Date.now();
    return () => {
      setPageEvents((prev) => ({
        ...prev,
        visitDuration: Date.now() - startTime,
      }));
    };
  }, []);

  const handleContentClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const targetType = target.tagName.toLowerCase();
      const targetId = target.id || "unknown";
      setPageEvents((prev) => ({
        ...prev,
        lastInteraction: `Clicked ${targetType}#${targetId}`,
      }));
    },
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      setPageEvents((prev) => ({ ...prev, scrollCount: prev.scrollCount + 1 }));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="flex flex-col min-h-screen" onClick={handleContentClick}>
      <FreeAIBookHome />
    </main>
  );
};

export default FreeAiBookLandingPage;
