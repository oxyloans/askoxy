import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Genoxy: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [fade, setFade] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/genoxy?query=${encodeURIComponent(searchQuery)}`);
    } else {
      searchInputRef.current?.classList.add("shake-animation");
      setTimeout(() => {
        searchInputRef.current?.classList.remove("shake-animation");
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentPlaceholderIndex(
          (prev) => (prev + 1) % placeholderTexts.length
        );
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholderTexts]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className="relative py-12 px-4 sm:px-6 md:px-8 lg:px-12 min-h-[85vh] flex items-center justify-center overflow-hidden
        bg-gradient-to-tr from-[#f2f5fc] via-[#e0f0ff] to-[#fdf6fb]"
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute rounded-full bg-purple-200/30 blur-3xl animate-[pulse_6s_ease-in-out_infinite] -top-20 -left-20 ${
            isMobile ? "w-60 h-60" : "w-80 h-80 md:w-96 md:h-96"
          }`}
        ></div>
        <div
          className={`absolute rounded-full bg-cyan-200/30 blur-3xl animate-[bounce_5s_ease-in-out_infinite] bottom-0 right-0 ${
            isMobile ? "w-60 h-60" : "w-80 h-80 md:w-96 md:h-96"
          }`}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          <span className="bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            GENOXY
          </span>
        </h1>

        <div className="mx-auto mb-10 w-32 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500"></div>

        <p className="max-w-3xl mx-auto mb-10 text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
          Your AI-powered partner for mentorship, funding guidance, and business
          growth — accessible anytime, anywhere. Genoxy helps you unlock new
          opportunities, connect with industry experts, and accelerate your
          projects with intelligent insights. Refine your ideas, secure funding,
          and scale your business effortlessly with personalized guidance.
        </p>

        {/* Search box */}
        <div
          className={`relative max-w-xl mx-auto transition-transform duration-300 transform-gpu ${
            isInputFocused ? "scale-105" : ""
          }`}
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
            aria-label="Search input"
            className={`w-full pl-5 pr-14 py-4 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-md transition-shadow duration-300 transition-opacity ${
                fade ? "opacity-100" : "opacity-0"
              }`}
          />
          <button
            onClick={handleSearch}
            aria-label="Search"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-purple-600
              hover:from-cyan-400 hover:to-purple-500 text-white p-3 rounded-full shadow-lg transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7-7 7M21 12H3"
              />
            </svg>
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-600 select-none">
          Press Enter or click the arrow to get started
        </div>
      </div>

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
        .shake-animation {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default Genoxy;
