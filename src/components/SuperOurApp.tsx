import React from "react";
import { useNavigate } from "react-router-dom";

// Import images for 9 grid items
import s1 from "../assets/img/s1.png";
import s2 from "../assets/img/s2.png";
import s3 from "../assets/img/s3.png";
import s4 from "../assets/img/s4.png";
import s5 from "../assets/img/s5.png";
import s6 from "../assets/img/s6.png";
import s7 from "../assets/img/s7.png";
import s8 from "../assets/img/s8.png";
import s9 from "../assets/img/s9.png";

// Left side big image
import leftImage from "../assets/img/megahero.png";

// Two background PNGs for decorative elements
import purpleLines from "../assets/img/purplelines.png";
import goldLines from "../assets/img/goldlines.png";

// Create mockImages object from the imported images
const mockImages = {
  s1,
  s2,
  s3,
  s4,
  s5,
  s6,
  s7,
  s8,
  s9,
  leftImage,
  purpleLines,
  goldLines,
};

const gridImages = [
  {
    id: "s1",
    src: mockImages.s1,
    route: "/aiblockchainanditservices",
    title: "AI | Blockchain\n& IT Services",
  },
  {
    id: "s8",
    src: mockImages.s8,
    route: "/glms",
    title: "AI - Blogs, Jobs\n and Training",
  },
  {
    id: "s2",
    src: mockImages.s2,
    route: "/caandcsservices",
    title: "CA | CS\nServices",
  },
  {
    id: "s3",
    src: mockImages.s3,
    route: "/goldandsilveranddiamonds",
    title: "Gold, Silver\n& Diamonds",
  },
  {
    id: "s4",
    src: mockImages.s4,
    route: "/loansinvestments",
    title: "Loans &\nInvestments",
  },
  { id: "s5", src: mockImages.s5, route: "/nyayagpt", title: "Nyaya GPT" },
  { id: "s6", src: mockImages.s6, route: "/realestate", title: "Real Estate" },
  {
    id: "s7",
    src: mockImages.s7,
    route: "/rice2roboecommers",
    title: "Rice 2 Robo\nECommerce",
  },

  {
    id: "s9",
    src: mockImages.s9,
    route: "/studyabroad",
    title: "Study Abroad",
  },
];

export default function UnicornGrid() {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const handleNavigation = (route: string) => {
    console.log(`Navigating to: ${route}`);
    navigate(route); // Perform actual navigation
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main Background with Gradient */}
      <div
        className="flex items-center justify-center relative pt-0"
        style={{
          background:
            "linear-gradient(180deg, #5c3391 0%, #5d4086 33%, #6f4386 66%, #312c74 100%)",
        }}
      >
        {/* Main Content Container */}
        <div className="relative w-full h-full flex flex-col lg:flex-row items-center justify-center px-1 sm:px-2 md:px-4 lg:px-6 py-1 sm:py-2 md:py-4 lg:py-6 gap-1 sm:gap-2 md:gap-4 lg:gap-6">
          {/* Left Side: Phone/App mockup */}
          <div className="flex-1 flex justify-center items-end lg:items-center order-2 lg:order-1 min-h-0 h-full">
            <div className="relative w-full h-full flex items-end lg:items-center justify-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <img
                src={mockImages.leftImage}
                alt="ASKOXY.AI Super App"
                className="w-full h-auto max-h-full object-contain object-bottom lg:object-bottom drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Right Side: Services Grid - Decreased by 10% */}
          <div className="flex-1 flex justify-center items-center order-1 lg:order-2 min-h-0 transform scale-90">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              {/* Grid container - 3x3 layout */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 md:gap-3 lg:gap-4">
                {gridImages.map(({ id, src, route, title }) => (
                  <div key={id} className="flex flex-col items-center">
                    <div
                      onClick={() => handleNavigation(route)}
                      className="aspect-square w-full cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center p-1"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleNavigation(route);
                        }
                      }}
                    >
                      <img
                        src={src}
                        alt={title}
                        className="w-full h-full object-contain"
                        draggable={false}
                      />
                    </div>
                    <div className="text-center mt-1.5">
                      <p className="text-[11px] sm:text-[13px] md:text-sm lg:text-base font-bold text-white leading-tight whitespace-pre-line">
                        {title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
