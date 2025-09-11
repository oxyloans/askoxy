import React, { useRef } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SearchProvider } from "../context/SearchContext";
const Layout: React.FC = () => {
  // Section refs
  const bharatAgentsStoreRef = useRef<HTMLDivElement>(null);
  const aiResourcesRef = useRef<HTMLDivElement>(null);
  const freeAIBookRef = useRef<HTMLDivElement>(null);

  return (
    <SearchProvider>
      <div className="flex min-h-screen flex-col bg-white">
        <Header
          bharatAgentsStoreRef={bharatAgentsStoreRef}
          aiResourcesRef={aiResourcesRef}
          freeAIBookRef={freeAIBookRef}
        />
        <main className="flex-1">
          <Outlet />
        </main>
        <div className="pt-2">
          <Footer />
        </div>
      </div>
    </SearchProvider>
  );
};

export default Layout;
