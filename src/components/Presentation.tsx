import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaTimes, FaArrowRight } from "react-icons/fa";

import OxyGroup from "../assets/img/oxy group.png"; 
import PinkFound from "../assets/img/womenempower.png";

interface Presentation {
  title: string;
  description: string;
  image: string;
  link: string;
}

const PdfPages: React.FC = () => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // This can be expanded with more presentations or loaded from an API
  const presentations: Presentation[] = [
    {
      title: "Unstoppable Pink Funding",
      description: "Empowering women entrepreneurs through innovative funding solutions",
      image: PinkFound,
      link: "https://drive.google.com/file/d/10hTZ7kTcbe8vhBG4eFKhuq2OE4eitW4J/preview",
    },
    {
      title: "OXY GROUP Presentation",
      description: "Our corporate vision, mission, and strategic roadmap for innovation",
      image: OxyGroup,
      link: "https://drive.google.com/file/d/1mUSySGlKGdASB2EaXsr_4gUClluG4LTo/preview",
    }
  ];

  const openPdfModal = (pdfUrl: string, title: string) => {
    setIsLoading(true);
    setSelectedPdf(pdfUrl);
    setSelectedTitle(title);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedPdf(null);
    setIsOpen(false);
    document.body.style.overflow = "auto";
    setTimeout(() => setIsLoading(false), 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const iframeLoaded = () => {
    setIsLoading(false);
  };

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white py-12 px-10 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section with enhanced animations */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 mb-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Our Presentations
          </motion.h1>
          <motion.div 
            className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-4"
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          ></motion.div>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Explore our vision, initiatives and strategic roadmaps through these comprehensive presentations.
          </motion.p>
        </motion.div>

        {/* Presentation Cards - Fixed title display issues */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-10 w-full max-w-5xl mx-auto"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {presentations.map((item, index) => (
            <motion.div
              key={index}
              className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white flex flex-col"
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              whileHover={{ y: -5 }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Image container */}
              <div 
                className="h-64 sm:h-72 overflow-hidden cursor-pointer relative flex items-center justify-center"
                onClick={() => openPdfModal(item.link, item.title)}
              >
                <motion.img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center"
                  initial={{ scale: 1 }}
                  animate={{ scale: activeIndex === index ? 1.05 : 1 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center"
                  initial={{ opacity: 0.6 }}
                  whileHover={{ opacity: 0.7 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="bg-white/20 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaEye className="text-white text-xl" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Title and description - Fixed to always be visible */}
              <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                <motion.h3 
                  className="text-white text-xl sm:text-2xl font-bold mb-2"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                >
                  {item.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-200 text-sm mb-3 line-clamp-2"
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.description}
                </motion.p>
                <motion.button
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium text-sm opacity-80 hover:opacity-100 transition-all duration-300"
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openPdfModal(item.link, item.title)}
                >
                  <span>View Presentation</span> <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced Modal for PDF Viewer with loading state */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <motion.h3 
                  className="text-xl font-bold text-gray-800 dark:text-white"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {selectedTitle}
                </motion.h3>
                <motion.button 
                  className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  title="Close"
                >
                  <FaTimes />
                </motion.button>
              </div>
              <div className="w-full h-[75vh] bg-gray-100 dark:bg-gray-800 relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
                    <motion.div 
                      className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    ></motion.div>
                  </div>
                )}
                <iframe
                  src={selectedPdf ?? ""}
                  title="PDF Viewer"
                  width="100%"
                  height="100%"
                  className="border-none"
                  allow="autoplay"
                  onLoad={iframeLoaded}
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PdfPages;