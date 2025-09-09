import React, { useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BharatAgentsStore from "../pages/BharatAgentsStore";
import AiResources from "../pages/AIResources";
import { SearchProvider } from "../context/SearchContext";
import FreeAiBook from "../pages/FreeAiBook";

const AppRoutes: React.FC = () => {
  // Section refs
  const bharatAgentsStoreRef = useRef<HTMLDivElement>(null);
  const aiResourcesRef = useRef<HTMLDivElement>(null);
  const freeAIBookRef = useRef<HTMLDivElement>(null);

  return (
    <SearchProvider>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Header */}
        <Header
          bharatAgentsStoreRef={bharatAgentsStoreRef}
          aiResourcesRef={aiResourcesRef}
          freeAIBookRef={freeAIBookRef}
        />

        {/* Main Content */}
        <main className="flex-1">
          <div ref={bharatAgentsStoreRef} className="scroll-mt-20">
            <BharatAgentsStore />
          </div>
          <div ref={aiResourcesRef} className="scroll-mt-20">
            <AiResources />
          </div>
          {/* <div ref={freeAIBookRef} className="scroll-mt-20">
            <FreeAiBook />
          </div> */}
        </main>

        {/* Footer */}
        <div className="pt-2">
          <Footer />
        </div>
      </div>
    </SearchProvider>
  );
};

export default AppRoutes;
