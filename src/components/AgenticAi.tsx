// AgenticAi.tsx
import React, { useState } from "react";

const DRIVE_FILE_ID = "1zGSL0ycJJKtkckBuhqeq1G4QSv8jLUvx";
const PREVIEW_URL = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/preview`;

const AgenticAi = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    // The outer div ensures the component spans full width and centers the content block
    <div className="w-full flex justify-center items-center my-10 px-4">
      {/* This container sets the max width and makes positioning relative for the loader */}
      <div className="w-full max-w-4xl relative">
        {/* Optional Loader */}
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-black/5 rounded-lg z-10">
            <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
          </div>
        )}

        <iframe
          src={PREVIEW_URL}
          onLoad={handleLoad}
          title="Agentic AI Drive Preview"
          // --- FIX APPLIED HERE ---
          // Added 'mx-auto' to center the iframe horizontally within the max-width div.
          className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-[500px] sm:h-[600px] md:h-[800px] lg:h-[1000px] max-w-full rounded-lg shadow-lg mx-auto"
          frameBorder="0"
          allow="autoplay"
        />
      </div>
    </div>
  );
};

export default AgenticAi;
