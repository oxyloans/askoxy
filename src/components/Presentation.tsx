import React from "react";
import { FaArrowRight } from "react-icons/fa";
import OxyGroup from "../assets/img/oxy group.png";
import PinkFound from "../assets/img/womenempower.png";

interface Presentation {
  title: string;
  description: string;
  image: string;
  link: string;
  target?: string;
}

const PdfPages: React.FC = () => {
  const presentations: Presentation[] = [
    {
      title: "Unstoppable Pink Funding",
      description:
        "Empowering women entrepreneurs through innovative funding solutions",
      image: PinkFound,
      link: "https://drive.google.com/file/d/10hTZ7kTcbe8vhBG4eFKhuq2OE4eitW4J/view",
      target: "_blank",
    },
    {
      title: "OXY GROUP Presentation",
      description:
        "Our corporate vision, mission, and strategic roadmap for innovation",
      image: OxyGroup,
      link: "https://drive.google.com/file/d/1mUSySGlKGdASB2EaXsr_4gUClluG4LTo/view",
      target: "_blank",
    },
  ];

  const openPdfWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-800 mb-4 animate-fade-in-down">
            Our Presentations
          </h1>
          <div className="h-1 w-24 bg-indigo-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover our vision, initiatives, and strategic roadmaps through
            these beautifully crafted presentations.
          </p>
        </div>

        {/* Presentation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
          {presentations.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative w-full max-h-96 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-base mb-5 line-clamp-2">
                  {item.description}
                </p>
                <button
                  onClick={() => openPdfWindow(item.link)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-5 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all duration-300 group-hover:gap-3"
                >
                  <span>View Presentation</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PdfPages;
