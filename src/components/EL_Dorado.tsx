// src/components/PdfViewer.tsx
import React, { useState } from 'react';
import Footer from "./Footer";

const EL_Dorado: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Function to handle the load event of the iframe
  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
   
      <div style={{ textAlign: 'center', marginTop: "80px" }}>
        <div style={{padding:'30px'}}>
        <h1 style={{fontSize:"50px" }}>EL_Dorado</h1>
        <h1 style={{ fontSize:"30px",color:'orange' }}>DTDC Approved Villa Plots Venture</h1>
        </div>

        {isLoading && <p>Loading...</p>}
        <iframe 
          src={`https://drive.google.com/file/d/1-F8CBXmwOxabVKhRKkJ0hU7BlaZBSybA/preview`} 
          frameBorder="0" 
          height="1000px" 
          width="100%"
          title="PDF Viewer"
          onLoad={handleLoad} // Set loading state to false when the iframe loads
        />
      </div>
      <Footer />
    </>
  );
};

export default EL_Dorado;
