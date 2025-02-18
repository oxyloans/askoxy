import React, { useState } from "react";
import OxyGroup from "../assets/img/oxy group.png";
import PinkFound from "../assets/img/womenempower.png";

const PdfPages = () => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openPdfModal = (pdfUrl: string) => {
    setSelectedPdf(pdfUrl);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedPdf(null);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 py-12 px-6 text-center">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Explore Our Presentations
      </h1>

      {/* Images as buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Unstoppable Pink Funding Image */}
        <div
          onClick={() =>
            openPdfModal(
              "https://drive.google.com/file/d/10hTZ7kTcbe8vhBG4eFKhuq2OE4eitW4J/preview"
            )
          }
          className="relative cursor-pointer"
        >
          <img
            src={PinkFound}
            alt="Unstoppable Pink Funding"
            className="w-full h-auto rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center text-white font-semibold text-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
            Unstoppable Pink Funding
          </div>
        </div>

        {/* Oxy Group Image */}
        <div
          onClick={() =>
            openPdfModal(
              "https://drive.google.com/file/d/1mUSySGlKGdASB2EaXsr_4gUClluG4LTo/preview"
            )
          }
          className="relative cursor-pointer"
        >
          <img
            src={OxyGroup}
            alt="Oxy Group"
            className="w-full h-auto rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center text-white font-semibold text-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
            OXY GROUP Corporate Presentation
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              PDF Viewer
            </h3>
            <div className="w-full h-[500px] border rounded-lg shadow-md overflow-hidden">
              <iframe
                src={selectedPdf ?? ""}
                title="PDF Viewer"
                width="100%"
                height="100%"
                className="rounded-lg"
                allow="autoplay"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfPages;
