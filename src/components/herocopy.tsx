import React, { useEffect, useMemo, useState } from 'react';
import { imageUrls } from '../assets/images';
import backgroundImage from '../assets/img/BG.jpg';
import { FaSearch } from "react-icons/fa";
import './content.css'
import './herosection.css'
import Askoxy from "../assets/img/logo3.png";
import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';

const shuffleArray = (array: string[]): string[] => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};


const HeroSection: React.FC = () => {
  // Shuffle images on render
  const shuffledImageUrls = useMemo(() => shuffleArray(imageUrls), []);

  // Function to handle click events on items
  const handleClick = (url: string) => {
    alert(`Clicked on: ${url}`);
  };


  const navigate = useNavigate();
    const getBaseName = (url: string): string => {
    const fullFileName = url.split('/').pop() || '';
    const baseName = fullFileName.split('.')[0];
    return baseName;
  };



    const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!inputValue) {
      setIsFocused(false);
    }
  };
  const placeholders = [
    "Ask question about global education...", 
    "Explore new topics in education...", 
    "Explore in education...", 
    "New topics in education...", 
    "Explore new trends in education..."
  ];
  
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
    const [isSpanVisible, setIsSpanVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true); // Start the animation
      setTimeout(() => {
        // After animation ends, switch the placeholder
        setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
        setIsAnimating(false); // Reset animation state
      }, 3000); // Duration of the animation
    }, 2000); // Change placeholder every 3 seconds

    // return () => clearInterval(interval); // Clean up interval
  }, []);
        


  // Handle key down event for input field (detect Enter key)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setIsSpanVisible(false); // Hide the scroller on Enter
    }
  };

  const handleLinkClick = (url: string, event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
  event.preventDefault(); // Prevent default link navigation
  const baseName = getBaseName(url);
  console.log('Base name:', baseName);
  
  // Navigate to a new route based on the base name
  navigate(`/${baseName}`);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };


    const handleSpanClick = (text: string) => {
    setInputValue(text);
    setIsFocused(true);  // Focus the input field after clicking on span
    setIsSpanVisible(false); // Hide the scroller
  };
  return (
    <section
      className="relative flex flex-col items-center text-white bg-purple-700 bg-center bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})`, minHeight: '100vh' }}
    >
      <div className="relative w-full h-full">

        {/* Main Content */}
        <div className="relative flex flex-col w-full h-full md:flex-row">
          {/* Text Section */}
          <div className="z-10 flex flex-col items-start justify-center flex-1 px-6 mt-16 md:px-16 md:mt-0">
            {/* Header */}
            <div className="hidden lg:block">
              <Header />
              
              </div>
            <h1 className="mb-4 text-3xl font-bold text-left md:text-6xl animate__animated animate__fadeIn animate__delay-1s">
              <span>ASK</span> <br />
              <span className="text-yellow-400">Solve</span><br />
              Succeed<span className="text-yellow-400">...</span>
            </h1>

            {/* Search Input */}
 <div className="relative w-full max-w-lg p-2 mt-6">
      <div className="relative flex items-center w-full p-1 pr-12 text-black border border-gray-300 rounded-full input-field">
            {isFocused || !isSpanVisible ? (
          <div className="w-full input-container">
            <input
              type="text"
              value={inputValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              onKeyDown={handleKeyDown} // Capture Enter key event
              className="w-full px-4"
              style={{
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                border: 'none',
                height: '45px',
                overflow: 'hidden',
              }}
            />
          </div>
        ) : (
          /* Show scroller (span elements) when the input is not focused and spans are visible */
          isSpanVisible && (
          <div className="scroller">
            <span onClick={() => handleSpanClick("Explore new trends in education...")}>
              Ask question about global education..<br />
              Explore new topics in education...<br />
              Explore in education... <br />
              Explore new trends in education...
            </span>
          </div>
        )
        )}


        {/* Search icon */}
        <FaSearch className="absolute text-gray-500 right-5" style={{ fontSize: '1.25rem' }} />
      </div>
    </div>

          </div>

          {/* Image Section */}
          <div className="flex items-start justify-center flex-1 px-6 mt-6 md:px-16 md:mt-0">
            <div className="relative w-full h-64 overflow-hidden md:h-screen mediamscreen">
              <div className="absolute inset-0 flex gap-x-4">
                {/* Column 1 */}
                <div className="w-1/3 h-full overflow-hidden">
                  <div className="flex flex-col animate-scroll-tb">
                    {shuffledImageUrls.map((url, index) => (
                      <div
                        key={index}
                        className="mb-4 transition-transform transform cursor-pointer hover:scale-105"
                      >       <Link to={url} onClick={(event) => handleLinkClick(url, event)}>
                          <img src={url} alt={`Example ${index + 1}`} className="object-cover w-full h-32 md:h-48" />
                          
                          </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2 */}
                <div className="w-1/3 h-full overflow-hidden">
                  <div className="flex flex-col animate-scroll-bt">
                    {shuffledImageUrls.map((url, index) => (
                      <div
                        key={index}
                        className="mb-4 transition-transform transform cursor-pointer hover:scale-105"
                      >
                            <Link to={url} onClick={(event) => handleLinkClick(url, event)}>
                          <img src={url} alt={`Example ${index + 1}`} className="object-cover w-full h-32 md:h-48" />
                          </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 3 */}
                <div className="w-1/3 h-full overflow-hidden">
                  <div className="flex flex-col animate-scroll-tb">
                    {shuffledImageUrls.map((url, index) => (
                      <div
                        key={index}
                        className="mb-4 transition-transform transform cursor-pointer hover:scale-105"
        
                      >
                          <Link to={url} onClick={(event) => handleLinkClick(url, event)}>
                          <img src={url} alt={`Example ${index + 1}`} className="object-cover w-full h-32 md:h-48" />
                          </Link>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes scroll-tb {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        @keyframes scroll-bt {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(0); }
        }

        .animate-scroll-tb {
          height: 100%;
          animation: scroll-tb 45s linear infinite;
        }

        .animate-scroll-bt {
          height: 100%;
          animation: scroll-bt 75s linear infinite;
        }
      `}</style>

      <style>{`
  /* Define scrolling animation for the placeholder */
  @keyframes scrollPlaceholder {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  /* Apply the animation to the input field's placeholder */
  input::placeholder {
    display: inline-block;
    white-space: nowrap;
    animation: scrollPlaceholder 8s linear infinite;
  }
`}</style>
    </section>
  );
}

export default HeroSection;
