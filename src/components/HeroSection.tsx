import React, { useMemo, useState } from 'react';
import { imageUrls } from '../assets/images';
import backgroundImage from '../assets/img/BG.jpg';
import { FaSearch } from "react-icons/fa";
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
   const [query, setQuery] = useState<string>('');
  const navigate = useNavigate();

   const handleSearch = () => {
    if (query.trim()) {
      navigate(`/erice?search=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const getBaseName = (url: string): string => {
    const fullFileName = url.split('/').pop() || '';
    const baseName = fullFileName.split('.')[0];
    return baseName;
  };


  

const handleLinkClick = (url: string, event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
  event.preventDefault(); // Prevent default link navigation
  const baseName = getBaseName(url);
  console.log('Base name:', baseName);
  
  // Navigate to a new route based on the base name
  navigate(`/${baseName}`);
};

  return (
    <section
      className="relative flex flex-col items-center text-white bg-purple-700 bg-center bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})`, minHeight: '100vh' }}
    >
      <div className="relative w-full h-full">
        {/* Header Section */}
     <Header />
        {/* Main Content */}
        <div className="relative flex flex-col w-full h-full md:flex-row">
          {/* Text Section */}
          <div className="z-10 flex flex-col items-start justify-center flex-1 px-6 mt-16 md:px-16 md:mt-0">
            {/* Header */}
            <h1 className="mb-4 text-3xl font-bold text-left md:text-6xl animate__animated animate__fadeIn animate__delay-1s">
              <span>ASK</span> <br />
              <span className="text-yellow-400">Solve</span><br />
              Succeed<span className="text-yellow-400">...</span>
            </h1>

            {/* Search Input */}
            <div className="relative w-full max-w-lg p-2 mt-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: '50px' }}>
              <div className="relative flex items-center w-full">
               <FaSearch
        onClick={handleSearch}
        className="absolute text-gray-500 cursor-pointer left-3"
        style={{ fontSize: '1.25rem' }}
      />
      <input
        type="text"
        placeholder="Ask question about global education..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full p-4 pl-12 text-black placeholder-black border border-gray-300 rounded-full"
        style={{
          borderRadius: '50px',
          backgroundColor: '#ffffff',
          border: 'none',
          height: '45px',
        }}
      />
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex items-start justify-center flex-1 px-6 mt-6 md:px-16 md:mt-0">
      <div className="relative w-full h-64 overflow-hidden md:h-screen">
        <div className="absolute inset-0 flex gap-x-4">
          {/* Column 1 */}
          <div className="w-1/3 h-full overflow-hidden">
            <div className="flex flex-col animate-scroll-tb">
              {imageUrls.map((url, index) => (
                <div key={index} className="mb-4 transition-transform transform cursor-pointer hover:scale-105">
              <Link to={url} onClick={(event) => handleLinkClick(url, event)}>
                    <img
                      src={url}
                      alt={`Example ${index + 1}`}
                      className="object-cover w-full h-32 md:h-48"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 */}
          <div className="w-1/3 h-full overflow-hidden">
            <div className="flex flex-col animate-scroll-bt">
              {imageUrls.map((url, index) => (
                <div key={index} className="mb-4 transition-transform transform cursor-pointer hover:scale-105">
                  <Link to={url} onClick={(event) => handleLinkClick(url, event)}>
                    <img
                      src={url}
                      alt={`Example ${index + 1}`}
                      className="object-cover w-full h-32 md:h-48"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3 */}
          <div className="w-1/3 h-full overflow-hidden">
            <div className="flex flex-col animate-scroll-tb">
              {imageUrls.map((url, index) => (
                <div key={index} className="mb-4 transition-transform transform cursor-pointer hover:scale-105">
                  <Link to={url} onClick={(event) => handleLinkClick(url, event)}>
                    <img
                      src={url}
                      alt={`Example ${index + 1}`}
                      className="object-cover w-full h-32 md:h-48"
                    />
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
          animation: scroll-tb 20s linear infinite;
        }

        .animate-scroll-bt {
          height: 100%;
          animation: scroll-bt 20s linear infinite;
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
