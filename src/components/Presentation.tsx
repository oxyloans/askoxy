import React, { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

  // This can be expanded with more presentations or loaded from an API
  const presentations: Presentation[] = [
    {
      title: "Unstoppable Pink Funding",
      description:
        "Empowering women entrepreneurs through innovative funding solutions",
      image: PinkFound,
      link: "https://drive.google.com/file/d/10hTZ7kTcbe8vhBG4eFKhuq2OE4eitW4J/preview",
    },
    {
      title: "OXY GROUP Presentation",
      description:
        "Our corporate vision, mission, and strategic roadmap for innovation",
      image: OxyGroup,
      link: "https://drive.google.com/file/d/1mUSySGlKGdASB2EaXsr_4gUClluG4LTo/preview",
    },
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
    <div className="bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Simple Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-3">
            Our Presentations
          </h1>
          <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our vision, initiatives and strategic roadmaps through these
            comprehensive presentations.
          </p>
        </div>

        {/* Presentation Cards - Simplified */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {presentations.map((item, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-white"
            >
              {/* Image container */}
              <div
                className="h-60 overflow-hidden cursor-pointer relative"
                onClick={() => openPdfModal(item.link, item.title)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <FaEye className="text-white text-xl" />
                  </div>
                </div>
              </div>

              {/* Title and description */}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                <button
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded text-sm font-medium transition-all duration-300"
                  onClick={() => openPdfModal(item.link, item.title)}
                >
                  <span>View Presentation</span> <FaArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simplified Modal for PDF Viewer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-5xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedTitle}
              </h3>
              <button
                className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100"
                onClick={closeModal}
                title="Close"
              >
                <FaTimes />
              </button>
            </div>
            <div className="w-full h-[70vh] bg-gray-100 relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfPages;
