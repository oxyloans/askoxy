import React from "react";
import { FaArrowRight } from "react-icons/fa";
import OxyGroup from "../assets/img/oxy group.png";
import PinkFound from "../assets/img/womenempower.png";

interface Presentation {
  title: string;
  description: string;
  image: string;
  link: string;
}

const PdfPages: React.FC = () => {
  const presentations: Presentation[] = [
    {
      title: "Unstoppable Pink Funding",
      description:
        "Empowering women entrepreneurs through innovative funding solutions. Discover how we’re enabling change for women-led startups and ventures.",
      image: PinkFound,
      link: "https://drive.google.com/file/d/10hTZ7kTcbe8vhBG4eFKhuq2OE4eitW4J/view",
    },
    {
      title: "OXY GROUP Presentation",
      description:
        "Explore our corporate vision, mission, and strategic roadmap for driving innovation and growth across diverse industries and sectors.",
      image: OxyGroup,
      link: "https://drive.google.com/file/d/1mUSySGlKGdASB2EaXsr_4gUClluG4LTo/view",
    },
  ];

  const openPdfWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 px-4 sm:px-8 lg:px-16">
      {/* Header Section */}
      <div className="text-center mb-14">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 leading-tight mb-4">
          Explore Our Presentations
        </h1>
        <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Get inspired by our vision, innovation journeys, and initiatives that
          drive positive change and growth across industries.
        </p>
        <div className="mt-4 flex justify-center">
          <div className="h-1 w-24 bg-indigo-600 rounded-full"></div>
        </div>
      </div>

      {/* Presentations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {presentations.map((item, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative w-full h-64 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col justify-between h-[240px]">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors duration-300">
                  {item.title}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => openPdfWindow(item.link)}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 group-hover:gap-3"
                >
                  <span>View Presentation</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PdfPages;
