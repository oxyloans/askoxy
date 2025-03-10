import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiZap,
  FiCode,
  FiTrendingUp,
  FiArrowRight,
} from "react-icons/fi";

const FreeGPTs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const placeholderTexts = [
    "Ask me anything...",
    "Need mentorship? Ask here...",
    "Looking for funding? Describe your project...",
    "Tell me what solution you need...",
  ];

  const userId = localStorage.getItem("userId");

  // Handle search input
  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      // Using a more subtle notification instead of alert
      if (searchInputRef.current) {
        searchInputRef.current.classList.add("shake-animation");
        setTimeout(() => {
          searchInputRef.current?.classList.remove("shake-animation");
        }, 500);
      }
      return;
    }

    window.location.href = userId
      ? `/main/dashboard/freegpts?query=${encodeURIComponent(trimmedQuery)}`
      : `/freechatgptnormal?query=${encodeURIComponent(trimmedQuery)}`;
  };

  // Handle "Enter" key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex(
        (prev) => (prev + 1) % placeholderTexts.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-b from-white to-purple-50 min-h-[70vh] w-full flex items-center justify-center overflow-hidden">
      {/* AI Technology-based Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full bg-purple-300 blur-3xl -top-16 -left-16 md:-top-32 md:-left-32"></div>
        <div className="absolute w-80 h-80 md:w-128 md:h-128 rounded-full bg-blue-300 blur-3xl bottom-0 right-0"></div>
        <div className="absolute w-40 h-40 md:w-64 md:h-64 rounded-full bg-indigo-300 blur-3xl top-1/2 left-1/3 hidden md:block"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
        <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-purple-800 leading-tight">
          <span className="inline-block">Free GPTs</span>
          <span className="inline-block ml-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            AI Companion
          </span>
          <div className="w-32 h-1.5 bg-gradient-to-r from-purple-800 to-indigo-500 mt-4 mx-auto rounded-full"></div>
        </h3>

        <div className="p-6 sm:p-8 bg-white rounded-2xl shadow-xl max-w-3xl mx-auto border border-purple-100 transition-all duration-300 hover:shadow-2xl mb-6 md:mb-8">
          <p className="mb-6 text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
            ASKOXY.AI offers unlimited ChatGPT prompts, mentorship, funding, and
            end-to-end support to fuel your success journey.
          </p>

          {/* Feature Icons - Responsive grid for small screens */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-12 mb-6 sm:mb-8 text-purple-700">
            <div className="flex flex-col items-center group">
              <div className="p-3 sm:p-4 md:p-5 rounded-full bg-purple-50 mb-2 sm:mb-3 shadow-md group-hover:bg-purple-100 group-hover:shadow-lg transition-all duration-300">
                <FiZap size={20} className="sm:hidden" />
                <FiZap size={24} className="hidden sm:block md:hidden" />
                <FiZap size={28} className="hidden md:block" />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-medium">
                Quick Answers
              </span>
            </div>
            <div className="flex flex-col items-center group">
              <div className="p-3 sm:p-4 md:p-5 rounded-full bg-purple-50 mb-2 sm:mb-3 shadow-md group-hover:bg-purple-100 group-hover:shadow-lg transition-all duration-300">
                <FiCode size={20} className="sm:hidden" />
                <FiCode size={24} className="hidden sm:block md:hidden" />
                <FiCode size={28} className="hidden md:block" />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-medium">
                Code Solutions
              </span>
            </div>
            <div className="flex flex-col items-center group">
              <div className="p-3 sm:p-4 md:p-5 rounded-full bg-purple-50 mb-2 sm:mb-3 shadow-md group-hover:bg-purple-100 group-hover:shadow-lg transition-all duration-300">
                <FiTrendingUp size={20} className="sm:hidden" />
                <FiTrendingUp size={24} className="hidden sm:block md:hidden" />
                <FiTrendingUp size={28} className="hidden md:block" />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-medium">
                Growth Support
              </span>
            </div>
          </div>

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
              className="w-full p-4 sm:p-5 md:p-6 rounded-xl border-2 border-purple-200 bg-purple-50 text-sm sm:text-base md:text-lg text-gray-800 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-md transition-all duration-300"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 sm:p-3 md:p-4 rounded-full hover:bg-purple-700 transition-all duration-300 shadow-md"
              aria-label="Search"
            >
              <FiArrowRight size={20} className="sm:hidden" />
              <FiArrowRight size={22} className="hidden sm:block md:hidden" />
              <FiArrowRight size={24} className="hidden md:block" />
            </button>
          </div>

          <div className="mt-4 text-xs sm:text-sm text-gray-500">
            Type your question and press Enter or click the arrow to get started
          </div>
        </div>

        {/* Added Trust Indicators - horizontal on mobile, pills on larger screens */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-base text-gray-600 mb-6 md:mb-8">
          <div className="flex items-center py-1.5 px-3 sm:p-2 md:p-3 bg-white bg-opacity-70 rounded-full shadow-sm">
            <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500 mr-2 md:mr-3"></span>
            Instant Responses
          </div>
          <div className="flex items-center py-1.5 px-3 sm:p-2 md:p-3 bg-white bg-opacity-70 rounded-full shadow-sm">
            <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-500 mr-2 md:mr-3"></span>
            100% Free Access
          </div>
          <div className="flex items-center py-1.5 px-3 sm:p-2 md:p-3 bg-white bg-opacity-70 rounded-full shadow-sm">
            <span className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full bg-purple-500 mr-2 md:mr-3"></span>
            No Sign-up Required
          </div>
        </div>

       
      </div>

      {/* Add this style for the shake animation */}
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

export default FreeGPTs;
