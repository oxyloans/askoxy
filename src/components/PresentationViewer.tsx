import React from "react";

const PresentationViewer: React.FC = () => {
  const pdfFilePath = "../assets/step by step process of vanabhojnam.pdf"; // Correct path to the PDF file in public folder

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Vanabhojanam Flow Steps</h1>
      <div className="w-full h-3/4 border">
        <iframe
          src={pdfFilePath}
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title="PowerPoint PDF"
        />
      </div>
    </div>
  );
};

export default PresentationViewer;
