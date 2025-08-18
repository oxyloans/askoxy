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
        "Empowering women entrepreneurs through innovative funding solutions. Our programs provide mentorship, financial support, and networking opportunities to help women-led startups thrive. Discover how we’re enabling change by bridging gaps in funding and fostering a community of ambitious, visionary women driving economic growth and social impact.",
      image: PinkFound,
      link: "https://drive.google.com/file/d/10hTZ7kTcbe8vhBG4eFKhuq2OE4eitW4J/view",
    },
    {
      title: "OXY GROUP Presentation",
      description:
        "Explore our corporate vision, mission, and strategic roadmap for driving innovation and sustainable growth across diverse industries. This presentation covers our achievements, key initiatives, and future plans to enhance operational efficiency, technological advancement, and global market expansion. Learn how OXY GROUP is shaping the future through strategic partnerships and forward-thinking solutions.",
      image: OxyGroup,
      link: "https://drive.google.com/file/d/1mUSySGlKGdASB2EaXsr_4gUClluG4LTo/view",
    },
  ];

  const openPdfWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="bg-gradient-to-br from-purple-50 via-gray-50 to-indigo-50 py-10 sm:py-20 px-4 sm:px-8 lg:px-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 leading-tight mb-3">
          Explore Our Presentations
        </h1>
        <div className="h-1 w-24 bg-indigo-600 mx-auto mb-4 rounded-full"></div>
        <p className="text-gray-700 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Get inspired by our vision, innovation journeys, and initiatives that
          drive positive change and growth across industries.
        </p>
      </div>

      {/* Presentation Cards */}
      <div className="flex flex-col space-y-8 max-w-7xl bg-purple-50 mx-auto">
        {presentations.map((item, index) => (
          <div
            key={index}
            className={`group bg-white border border-gray-300  transition-all duration-500 overflow-hidden flex flex-col sm:flex-row items-center sm:items-start ${
              index % 2 !== 0 ? "sm:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div className="w-full sm:w-1/2 h-56 sm:h-auto overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover "
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 sm:w-1/2 flex flex-col justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors duration-300">
                  {item.title}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-4">
                  {item.description}
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => openPdfWindow(item.link)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm sm:text-base font-medium px-5 py-2.5 rounded-full transition-all duration-300 group-hover:gap-3 shadow-md"
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
