import React, { useState, useRef } from "react";

import BackgroundImg from "../assets/img/climatecrisis.png";

const Climatecrisis = () => {
  const [showPdf, setShowPdf] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pdfRef = useRef<HTMLDivElement | null>(null);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleViewPdf = () => {
    setShowPdf(true);
    // Scroll to PDF viewer after it's displayed
    setTimeout(() => {
      pdfRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleClosePdf = () => {
    setShowPdf(false);
    // Scroll back to top after closing
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDownloadPdf = () => {
    window.open(
      "https://drive.google.com/uc?export=download&id=1BV1KGBILTTqXeJdAmbJjydQ71BrABty3",
      "_blank"
    );
  
  };

  return (
    <div className="min-h-screen">
      {/* Fixed Background */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${BackgroundImg})`,
        }}
      />

      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-white bg-opacity-75" />

      {/* Content container */}
      <div className="relative z-10 text-center pt-16 px-4 pb-10">
        <div className="py-8 max-w-3xl mx-auto  bg-opacity-95  p-6 ">
          <h1 className="text-5xl text-gray-800 mb-3 font-bold tracking-wide">
            CLIMATE CRISIS
          </h1>
          <h2 className="text-3xl text-green-600 mb-5 font-semibold">
            BHARAT SOLUTIONS
          </h2>

          {/* Hashtags with improved styling */}
          <div className="flex justify-center items-center gap-3 mb-6">
            <span className="text-blue-600 font-bold text-lg hover:text-blue-800 transition-colors cursor-pointer">
              #QuitCoal
            </span>
            <div className="text-gray-400 font-bold">||</div>
            <span className="text-blue-600 font-bold text-lg hover:text-blue-800 transition-colors cursor-pointer">
              #GoSolar
            </span>
          </div>

          {/* Key initiatives with improved design */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
            <div className="bg-green-50 p-4 rounded-md border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow">
              <p className="font-semibold text-gray-800">
                ROOFTOP SOLAR FOR POLICE STATIONS & PARKING YARDS
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-md border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow">
              <p className="font-semibold text-gray-800">5 CRORE NEW JOBS</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow">
              <p className="font-semibold text-gray-800">
                $5 TRILLION INVESTMENTS
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-md border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow">
              <p className="font-semibold text-gray-800">GREEN REAL ESTATES</p>
            </div>
          </div>

          {/* AI callout with enhanced styling */}
          <div className="bg-blue-50 p-5 rounded-lg mb-8 mx-auto max-w-xl shadow-md">
            <p className="text-xl font-bold text-blue-800">
              100 WAYS <span className="text-green-600">AI</span> IS SAVING THE
              PLANET
            </p>
          </div>

          {/* Improved buttons */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <button
              onClick={handleViewPdf}
              className="bg-green-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-green-600 hover:shadow-lg transition-all font-medium text-lg"
            >
              Read Book
            </button>
            <button
              onClick={handleDownloadPdf}
              className="bg-blue-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all font-medium text-lg"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* PDF Viewer with improved UI */}
        {showPdf && (
          <div
            ref={pdfRef}
            className="max-w-5xl mx-auto my-12 p-6 bg-white rounded-lg shadow-xl border border-gray-200"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-2xl font-semibold text-gray-700">
                Climate Crisis - Bharat Solutions
              </h3>
              <button
                onClick={handleClosePdf}
                className="bg-red-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 hover:shadow-md transition-all"
                aria-label="Close PDF"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Loading indicator with improved UI */}
            {isLoading && (
              <div className="p-6 text-center">
                <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-green-500 h-full animate-pulse"
                    style={{ width: "70%" }}
                  ></div>
                </div>
                <p className="mt-2 text-gray-600 font-medium">
                  Loading PDF document...
                </p>
              </div>
            )}

            <div className="rounded-md overflow-hidden shadow-lg border border-gray-200">
              <iframe
                src="https://drive.google.com/file/d/1BV1KGBILTTqXeJdAmbJjydQ71BrABty3/preview"
                frameBorder="0"
                height="800"
                width="100%"
                title="PDF Viewer"
                onLoad={handleLoad}
                className="bg-gray-50"
              />
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleClosePdf}
                className="bg-gray-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-gray-700 hover:shadow-lg transition-all font-medium"
              >
                Close PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Climatecrisis;
