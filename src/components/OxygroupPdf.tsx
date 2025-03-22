import React, { useState } from "react";

interface OxyGroupProps {
  pdfUrl?: string;
  title?: string;
}

const OxyGroup: React.FC<OxyGroupProps> = ({
  pdfUrl = "https://drive.google.com/file/d/1xLkKBz7Qeq5lK8ulfiZmJo6f7lLHvz8m/preview",
  title = "Oxy Group"
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10">
      {/* Heading */}
      <div className="w-full text-center mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3">
          <span className="text-[#04AA6D] font-bold">Oxy</span>
          <span className="text-[#008CBA] font-bold"> Group</span>
        </h1>
        <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full mb-4"></div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          View our complete documentation
        </p>
      </div>
      {/* PDF Preview Card */}
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
        <iframe
          src={pdfUrl}
          frameBorder="0"
          className="w-full h-[400px] sm:h-[500px] md:h-[700px] lg:h-[900px] rounded-lg shadow-lg"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
};

export default OxyGroup;
