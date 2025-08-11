import React, { useCallback, useRef, useState } from "react";
import Header from "./Header";
import FreeAIBookHome from "./HeroSection";
import Footer from "./Footer";

// Define interfaces
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

  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
  };

  return (
   
    
      <main>
       
          <FreeAIBookHome />
        
      </main>
    
   
  );
};

export default FreeAiBookLandingPage;
