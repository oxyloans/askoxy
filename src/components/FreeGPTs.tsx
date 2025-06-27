import React, { useState, useEffect, useRef } from "react";

const FreeGPTs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640); // Mobile breakpoint <640px
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

  const userId = localStorage.getItem("userId");

  // Handle search input submit
  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      if (searchInputRef.current) {
        searchInputRef.current.classList.add("shake-animation");
        setTimeout(() => {
          searchInputRef.current?.classList.remove("shake-animation");
        }, 500);
      }
      return;
    }
    const encodedQuery = encodeURIComponent(trimmedQuery);
    const targetUrl = userId
      ? `/main/dashboard/freegpts?query=${encodedQuery}`
      : `/freechatgptnormal?query=${encodedQuery}`;
    window.location.href = targetUrl;
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
    <section className="relative py-8 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-b from-white to-purple-50 min-h-[60vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background Blur Circles */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full bg-purple-300 blur-3xl -top-16 -left-16 md:-top-32 md:-left-32"></div>
        <div className="absolute w-80 h-80 md:w-128 md:h-128 rounded-full bg-blue-300 blur-3xl bottom-0 right-0"></div>
        <div className="absolute w-40 h-40 md:w-64 md:h-64 rounded-full bg-indigo-300 blur-3xl top-1/2 left-1/3 hidden md:block"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
        <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-purple-800 leading-tight">
          <span>Free GPTs</span>
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

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-12 mb-6 sm:mb-8 text-purple-700">
            {[
              {
                label: "Quick Answers",
                iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
              },
              {
                label: "Code Solutions",
                iconPath: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
              },
              {
                label: "Growth Support",
                iconPath: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
              },
            ].map(({ label, iconPath }, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div className="p-3 sm:p-4 md:p-5 rounded-full bg-purple-50 mb-2 sm:mb-3 shadow-md group-hover:bg-purple-100 group-hover:shadow-lg transition-all duration-300">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={iconPath}
                    />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm md:text-base font-medium">
                  {label}
                </span>
              </div>
            ))}
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
              className="
                w-full
                pl-4 pr-12 sm:pr-14 md:pr-16
                py-4 sm:py-5 md:py-6
                rounded-xl
                border-2 border-purple-200
                bg-purple-50
                text-sm sm:text-base md:text-lg
                text-gray-800
                placeholder-purple-400
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                shadow-md
                transition-all duration-300
              "
              style={{ paddingRight: "3rem" }}
            />
            <button
              onClick={handleSearch}
              className="
                absolute
                right-2 sm:right-3 md:right-4
                top-1/2
                transform -translate-y-1/2
                bg-purple-600
                text-white
                w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
                rounded-full
                hover:bg-purple-700
                transition-all duration-300
                shadow-md
                flex items-center justify-center
              "
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

          <div className="mt-4 text-xs sm:text-sm text-gray-500">
            Type your question and press Enter or click the arrow to get started
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

export default FreeGPTs;
