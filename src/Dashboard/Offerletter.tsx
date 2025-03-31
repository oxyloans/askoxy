import React, { useState } from 'react';

const OfferLetters = () => {
  // Sample data with dummy names and placeholder drive links
  const offerLetters = [
    { id: 1, name: "BINGHAMTON UNIVERSITY", driveLink: "https://drive.google.com/file/d/1kobjdS-QlbrSBA2wU56peVNyJ0PrmjZA/preview" },
    { id: 2, name: "EDINBURGH NAPIER UNIVERSITY", driveLink: "https://drive.google.com/file/d/1NRVO8M74UjQlcRH7BrDwktHmcqb8ZU_p/preview" },
    { id: 3, name: "Anglia Ruskin University", driveLink: "https://drive.google.com/file/d/1lzoNNmzsAXtz2ckt2-u02gYFqBGPOBE6/preview" },
    { id: 4, name: "Aston University", driveLink: "https://drive.google.com/file/d/1Cn8NjDic_0PTtv7epzMKALG9RrkH3sVn/preview" },
    { id: 5, name: "AUBURN UNIVERSITY AT MONTGOMERY", driveLink: "https://drive.google.com/file/d/1kQSXRtRWflcbrOw4S9sbONm3BQIX-3Bp/preview" },
    { id: 6, name: "BPP UNIVERSITY", driveLink: "https://drive.google.com/file/d/1ktgOyTcqht2Mx-H_G1uM5XdLLbaGGaQe/preview" },
    { id: 7, name: "Broad Horizons", driveLink: "https://drive.google.com/file/d/1_9kQTFvRIY8G_7SFktal67QjFBkUCnHo/preview" },
    { id: 8, name: "BUCKINGHAMSHIRE NEW UNIVERSITY", driveLink: "https://drive.google.com/file/d/1KsTA3oZUveFHF35O9cQwi2kC6E_Dhs3q/preview" },
    { id: 9, name: "CARDIFF METROPOLITAN UNIVERSITY", driveLink: "https://drive.google.com/file/d/1pnDPB2REHAaQo9J5_M31xlsZQSGJF2GV/preview" },
    { id: 10, name: "COVENTRY UNIVERSITY", driveLink: "https://drive.google.com/file/d/11Ssmnpsr091Ewcp_3yroIZOIMmA1YTQU/preview" },
    { id: 11, name: "Dublin Business School", driveLink: "https://drive.google.com/file/d/1hxZ7dW_k3bGTDirZSAYxO7RJDKX6GAFy/preview" },
    { id: 12, name: "University of Texas at San Antonio", driveLink: "https://drive.google.com/file/d/1OGoqvmOAKDmXVhrAQdn28MpdL_TygxBy/preview" },
    { id: 13, name: "Vistula University", driveLink: "https://drive.google.com/file/d/1RXXmHxCi-vqxr_PIhP-giTKsOZYDPFbM/preview" }
  ];

  const [selectedLetterId, setSelectedLetterId] = useState<number | null>(null);

  const handleLetterClick = (id: number): void => {
    if (selectedLetterId === id) {
      setSelectedLetterId(null); // Close if already open
    } else {
      setSelectedLetterId(id); // Open the selected letter
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8 bg-white rounded-lg shadow-md py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            University Offer Letters
          </h1>
        </div>

        {/* Letters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {offerLetters.map((letter) => (
            <div key={letter.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div 
                className="p-4 cursor-pointer"
                onClick={() => handleLetterClick(letter.id)}
              >
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {letter.name}
                </h3>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm text-green-600 font-medium">Offer Letter</span>
                  <button 
                    className="bg-purple-500 hover:bg-purple-600 text-white text-sm py-1 px-4 rounded-md transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLetterClick(letter.id);
                    }}
                  >
                    {selectedLetterId === letter.id ? 'Close' : 'View'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PDF Viewer */}
        {selectedLetterId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-5/6 flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  {offerLetters.find(l => l.id === selectedLetterId)?.name} - Offer Letter
                </h3>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedLetterId(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                <iframe
                  src={offerLetters.find(l => l.id === selectedLetterId)?.driveLink}
                  width="100%"
                  height="100%"
                  className="border-0"
                  allow="autoplay"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferLetters;