import React from "react";

const BMVPDF = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Page Header */}
      <header className="text-center mb-8">
      </header>

      {/* PDF Viewer Section */}
      <div className="flex justify-center items-center my-14 w-full">
        <iframe
          src="https://drive.google.com/file/d/13ZS-T2UBg2X_ESASUsQ1xCVO6oZ4mX49/preview"
          frameBorder="0"
          className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-[500px] sm:h-[600px] md:h-[800px] lg:h-[1000px] max-w-full rounded-lg shadow-lg"
          title="BMVPDF Viewer"
        />
      </div>

    </div>
  );
};

export default BMVPDF;
