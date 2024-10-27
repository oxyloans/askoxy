// src/components/PdfViewer.tsx
import React, { useState } from 'react';
import Header1 from "./Header1";
import Footer from "./Footer";

const Greenproject: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Function to handle the load event of the iframe
  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      <Header1 />
      <div style={{ textAlign: 'center', marginTop: "80px" }}>
      <div style={{padding:'30px'}}>
        <h1 style={{fontSize:"50px" }}>Green-Planet</h1>
        <h1 style={{ fontSize:"30px",color:'Green' }}>HMDA Approved</h1>
        </div>
        {isLoading && <p>Loading...</p>}
        <iframe 
          src={`https://docs.google.com/viewer?url=https://drive.google.com/uc?id=16KK2fyQDjbrgEW8ipUB6TBUB08p5oNee&embedded=true`} 
          frameBorder="0" 
          height="1000px" 
          width="100%"
          title="PDF Viewer"
          onLoad={handleLoad}  // Set loading state to false when the iframe loads
        />
      </div>
      <Footer />
    </>
  );
};

export default Greenproject;
