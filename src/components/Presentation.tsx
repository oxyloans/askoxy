import React from "react";
import { motion } from "framer-motion";
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
    <section className="bg-white py-6 sm:py-8 lg:py-10 px-3 sm:px-4 lg:px-6 xl:px-8">
      <motion.div 
        className="text-center mb-6 sm:mb-8 lg:mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-indigo-800 leading-tight mb-2 sm:mb-3">
          Explore Our Presentations
        </h2>
        <div className="h-1 sm:h-1.5 w-20 sm:w-24 bg-indigo-600 mx-auto mb-3 sm:mb-4 rounded-full"></div>
        <p className="text-gray-700 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto leading-relaxed px-4">
          Get inspired by our vision, innovation journeys, and initiatives that
          drive positive change and growth across industries.
        </p>
      </motion.div>

      {/* Presentation Cards */}
      <motion.div 
        className="flex flex-col space-y-4 sm:space-y-6 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      >
        {presentations.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.3 + (index * 0.1), 
              ease: "easeOut" 
            }}
            whileHover={{ 
              y: -4, 
              transition: { duration: 0.2, ease: "easeOut" } 
            }}
            className={`group bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col lg:flex-row items-stretch ${
              index % 2 !== 0 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div className="w-full lg:w-1/2 h-48 sm:h-56 lg:h-64 xl:h-72 flex items-center justify-center p-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain rounded-sm group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 lg:p-8 w-full lg:w-1/2 flex flex-col justify-between min-h-[200px] sm:min-h-[240px] lg:min-h-[280px]">
              <div className="flex-grow">
                <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-indigo-700 transition-colors duration-300 leading-tight">
                  {item.title}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-4 lg:line-clamp-5">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 sm:mt-6 pt-2">
                <motion.button
                  onClick={() => openPdfWindow(item.link)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs sm:text-sm lg:text-base font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 group-hover:gap-3 shadow-md hover:shadow-lg"
                >
                  <span>View Presentation</span>
                  <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default PdfPages;
