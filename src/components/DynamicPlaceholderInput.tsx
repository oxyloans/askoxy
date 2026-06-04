import React, { useState, useEffect } from 'react';

const DynamicPlaceholderInput: React.FC = () => {
  const sentences = [
    "simple asx",
    "end to end support",
    "problem &^ solution",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sentences.length);
    }, 4000); 

    return () => clearInterval(intervalId);
  }, [sentences.length]);

  return (
    <div className="rotating-text-container">
      <div className="rotating-text-wrapper">
        {sentences.map((sentence, index) => (
          <div
            key={index}
            className={`rotating-text-item ${index === currentIndex ? 'active' : ''}`}
          >
            {sentence}
          </div>
        ))}
      </div>
      <style>

        {

          `
          .rotating-text-container {
  position: relative;
  width: 100%;
  height: 50px; /* Adjust height as needed */
  overflow: hidden;
}

.rotating-text-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
}

.rotating-text-item {
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 2rem; /* Adjust font size */
  transform: translateY(100%);
  opacity: 0;
  transition: transform 1s ease, opacity 1s ease;
}

.rotating-text-item.active {
  transform: translateY(0);
  opacity: 1;
}

.rotating-text-item:not(.active) {
  transform: translateY(-100%);
  opacity: 0;
}

          
          `
        }
      </style>
    </div>
  );
};

export default DynamicPlaceholderInput;
