// src/components/PdfViewer.tsx
import React from 'react';

const PdfViewer: React.FC = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h4>PDF Viewer Testing</h4>
      <iframe 
        src={`https://docs.google.com/viewer?url=https://drive.google.com/uc?id=16KK2fyQDjbrgEW8ipUB6TBUB08p5oNee&embedded=true`} 
        frameBorder="0" 
        height="1000px" 
        width="100%"
        title="PDF Viewer"
      />
    </div>
  );
};

export default PdfViewer;
