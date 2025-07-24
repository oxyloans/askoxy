import React, { useState, useEffect, useRef } from "react";

const Genoxy: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const desktopPlaceholders = [
    "Ask me anything...",
    "Need mentorship? Ask here...",
    "Looking for funding? Describe your project...",
    "Tell me what solution you need...",
  ];

  const mobilePlaceholders = [
    "Ask me...",
    "Need help?",
    "Funding idea?",
    "Your query...",
  ];

  const placeholderTexts = isMobile ? mobilePlaceholders : desktopPlaceholders;

  // Handle search input submit
  const handleSearch = () => {
    window.location.href = `/genoxy`;
  };

  // Enter key triggers search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // Placeholder text auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex(
        (prev) => (prev + 1) % placeholderTexts.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholderTexts]);

  // Window resize listener for mobile/desktop placeholder toggle
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 min-h-[60vh] w-full flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs with different animations */}
        <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-r from-purple-400/30 to-pink-400/30 blur-3xl -top-20 -left-20 md:-top-32 md:-left-32 animate-pulse"></div>
        <div className="absolute w-80 h-80 md:w-128 md:h-128 rounded-full bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-3xl bottom-0 right-0 animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-r from-indigo-400/25 to-purple-400/25 blur-3xl top-1/4 right-1/4 hidden md:block animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute w-56 h-56 md:w-80 md:h-80 rounded-full bg-gradient-to-r from-violet-400/20 to-fuchsia-400/20 blur-3xl bottom-1/4 left-1/4 animate-bounce" style={{animationDuration: '4s', animationDelay: '2s'}}></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-white/10 rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/5 rounded-full animate-ping" style={{animationDuration: '8s'}}></div>
        
        {/* Floating dots */}
        <div className="absolute top-20 right-1/3 w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-purple-300/40 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/3 right-20 w-1.5 h-1.5 bg-pink-300/50 rounded-full animate-bounce" style={{animationDelay: '2.5s'}}></div>
      </div>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white leading-tight drop-shadow-lg">
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            GENOXY
          </span>
          <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mt-4 mx-auto rounded-full shadow-lg"></div>
        </h1>

        <div className="p-6 sm:p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl max-w-3xl mx-auto border border-white/20 transition-all duration-300 hover:shadow-2xl hover:bg-white/15 mb-6 md:mb-8">
          <p className="mb-6 text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed">
            GENOXY offers unlimited AI assistance, mentorship, funding guidance, and
            end-to-end support to fuel your success journey.
          </p>



          {/* Search Input */}
          <div
            className="relative flex w-full max-w-2xl mx-auto transition-all duration-300"
            style={{ transform: isInputFocused ? "scale(1.02)" : "scale(1)" }}
          >
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder={placeholderTexts[currentPlaceholderIndex]}
              className="w-full pl-4 pr-16 py-4 sm:py-5 md:py-6 rounded-xl border-2 border-white/30 bg-white/20 backdrop-blur-sm text-sm sm:text-base md:text-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent shadow-lg transition-all duration-300"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-lg flex items-center justify-center"
              aria-label="Search"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>

          <div className="mt-4 text-xs sm:text-sm text-gray-300">
            Press Enter or click the arrow to start using GENOXY
          </div>
        </div>
      </div>

      {/* Shake Animation CSS */}
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default Genoxy;