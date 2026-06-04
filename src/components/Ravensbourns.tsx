import React from "react";

interface OxyGroupProps {
  pdfUrl?: string;
  title?: string;
}

const Ravensbourns: React.FC<OxyGroupProps> = ({
  pdfUrl = "https://drive.google.com/file/d/15vr2pEg1MCWTad4mxdojHdfXps8X3keD/preview",
  title = "Oxy Group",
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-3 py-6 bg-gray-100 min-h-screen">
      {/* Heading Section */}
      <div className="w-full text-center mb-4 animate-fadeIn">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3 tracking-tight">
          <span className="text-[#04AA6D]">RAVENSBOURNE UNIVERSITY</span>
        </h1>
        <div className="h-1 w-28 bg-gradient-to-r from-[#04AA6D] to-[#008CBA] mx-auto rounded-full mb-4"></div>
        {/* <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          View our complete documentation with a seamless experience.
        </p> */}
      </div>

      {/* PDF Preview Section */}
      <div className="relative w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-white shadow-xl rounded-lg overflow-hidden transition-transform">
        <iframe
          src={pdfUrl}
          frameBorder="0"
          className="w-full h-[400px] sm:h-[500px] md:h-[700px] lg:h-[900px] rounded-lg"
          title="PDF Viewer"
        />
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} OXY GROUP. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Ravensbourns;
