import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiZap, FiCode, FiTrendingUp } from "react-icons/fi";

const FreeGPTs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const placeholderTexts = [
    "Search Ask Questions",
    "Search Seek Mentorship",
    "Search Request Funds",
    "Search End-to-End Solutions",
  ];
  const userId = localStorage.getItem("userId");

  // Handle search input
  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      alert("Please enter a search query.");
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
    <section className="relative py-12 px-4 sm:px-6 md:px-10 lg:px-16 bg-white min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* AI Technology-based Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
      
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-purple-800 leading-tight">
          Free GPTs - Your AI Companion
          <div className="w-24 h-1 bg-gradient-to-r from-purple-800 to-purple-400 mt-4 mx-auto rounded-full"></div>
        </h3>

        <div className="p-6 sm:p-8 bg-white rounded-xl shadow-lg max-w-3xl mx-auto border border-purple-100">
          <p className="mb-6 sm:mb-8 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
            ASKOXY.AI offers unlimited ChatGPT prompts, mentorship, funding, and
            end-to-end support to fuel your success.
          </p>

          {/* Feature Icons */}
          <div className="flex justify-center gap-8 mb-6 text-purple-700">
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-full bg-purple-50 mb-2 shadow-sm">
                <FiZap size={20} />
              </div>
              <span className="text-xs">Quick Answers</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-full bg-purple-50 mb-2 shadow-sm">
                <FiCode size={20} />
              </div>
              <span className="text-xs">Code Solutions</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-full bg-purple-50 mb-2 shadow-sm">
                <FiTrendingUp size={20} />
              </div>
              <span className="text-xs">Growth Support</span>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex w-full max-w-xl mx-auto transition-all duration-300" style={{ transform: isInputFocused ? 'scale(1.02)' : 'scale(1)' }}>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder={placeholderTexts[currentPlaceholderIndex]}
              className="w-full p-4 sm:p-5 rounded-lg border border-purple-200 bg-purple-50 text-sm sm:text-base md:text-lg text-gray-800 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-md transition-all duration-300"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-purple-600 p-2 rounded-full hover:bg-purple-100 transition-all duration-300"
              aria-label="Search"
            >
              <FiSearch size={22} />
            </button>
          </div>

        
        </div>
      </div>
    </section>
  );
};

export default FreeGPTs;