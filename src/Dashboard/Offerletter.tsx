import React, { useState } from 'react';

const DublinBusinessSchool: React.FC = () => {
  const [showOfferLetter, setShowOfferLetter] = useState(false);

  const toggleOfferLetter = () => {
    setShowOfferLetter(!showOfferLetter);
  };

  return (
    <div className="min-h-screen bg-white-100 shadow-lg p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* University Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Dublin Business School
          </h1>
        </div>

        {/* Offer Letter Button */}
        <div className="text-center mb-6">
          <button
            onClick={toggleOfferLetter}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300"
          >
            Sample Offer Letter
          </button>
        </div>

        {/* PDF Container */}
        {showOfferLetter && (
          <div className="mx-auto max-w-2xl bg-white shadow-md rounded-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Dublin Business School (DBS).pdf
            </h3>
            <iframe
              src="https://drive.google.com/file/d/1Wj2A5-AdgObLRq7Y_ftlUgylaGvWBaOa/preview"
              width="100%"
              height="600px"
              className="mt-4"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default DublinBusinessSchool;