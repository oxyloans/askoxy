import React, { useState } from 'react';
import backgroundImage from '../assets/img/BG.jpg';
import { FaSearch } from 'react-icons/fa';
import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';
import HM1 from '../assets/img/1.png';
import HM2 from '../assets/img/2.png';
import HM3 from '../assets/img/3.png';
import HM4 from '../assets/img/4.png';
import HM5 from '../assets/img/5.png';
import HM6 from '../assets/img/6.png';
import HM7 from '../assets/img/7.png';
import HM8 from '../assets/img/8.png';

// Type definition for image data
interface ImageData {
  src: string;
  alt: string;
  text: string;
  link: string;
}

// Images and their metadata with page links
const images: ImageData[] = [
  { src: HM1, alt: 'Image 1', text: 'Order Rice Online', link: '/Erice' },
  { src: HM2, alt: 'Image 2', text: 'Groceries', link: '' },
  { src: HM3, alt: 'Image 3', text: 'Tickets', link: '' },
  { src: HM4, alt: 'Image 4', text: 'Transportation', link: '' },
  { src: HM5, alt: 'Image 5', text: 'Global Education', link: '' },
  { src: HM6, alt: 'Image 6', text: 'Food & Beverage', link: '' },
  { src: HM7, alt: 'Image 7', text: 'Games', link: '' },
  { src: HM8, alt: 'Image 8', text: 'Tickets', link: '' },
];

// Helper function to shuffle images
const shuffleImages = (images: ImageData[]): ImageData[] => {
  let shuffledImages = [...images];
  for (let i = shuffledImages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
  }
  return shuffledImages;
};

// Helper function to repeat and shuffle images
const repeatAndShuffleImages = (images: ImageData[], count: number): ImageData[] => {
  const repeatedImages: ImageData[] = [];
  for (let i = 0; i < count; i++) {
    repeatedImages.push(...shuffleImages(images));
  }
  return repeatedImages;
};

const HeroSection: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const imageGroup1 = repeatAndShuffleImages(images, 20);
  const imageGroup2 = repeatAndShuffleImages(images, 20);
  const imageGroup3 = repeatAndShuffleImages(images, 20);

  return (
    <section
      className="relative flex items-center text-white bg-purple-700 bg-center bg-cover max-h-0 overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage})`, minHeight: '100vh' }}
    >
      {/* Header Section */}
      <header className="absolute top-0 left-0 right-0 z-20 w-full">
        <Header />
      </header>

      <div className="relative w-full h-full flex flex-col md:flex-row">
        {/* Text Section - 60% of screen width */}
        <div className="flex flex-col items-center justify-center flex-[3] px-6 md:px-16 md:mt-0">
          <div className="flex flex-col justify-center flex-[3] items-center">
            <h1 style={{ fontSize: 130, fontWeight: 800, lineHeight: '100%' }}>
              <span>Ask</span> <br />
              <span className="text-yellow-400">Solve</span>
              <br />
              Succeed<span className="text-yellow-400">...</span>
            </h1>

            {/* Search Input */}
            <div className="relative w-full p-3 mt-10 bg-white/50 rounded-3xl search-placeholder">
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  placeholder="Ask question about global education..."
                  className="w-full p-4 pr-12 text-black placeholder-black border-none rounded-full"
                  style={{ height: '60px', fontSize: '1rem' }} // Increased height and adjusted font-size
                />
                <FaSearch className="absolute text-gray-500 right-5" style={{ fontSize: '1.5rem' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Image Section - 40% of screen width */}
        <div className="div2 flex-[3]">
          <div className="scroll-div group1">
            <div className="image-group">
              {imageGroup1.map((image, index) => (
                <div className="image-item" key={index}>
                  <Link to={image.link}>
                    <img src={image.src} alt={image.alt} />
                    <div className="image-text">{image.text}</div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="scroll-div group2">
            <div className="image-group">
              {imageGroup2.map((image, index) => (
                <div className="image-item" key={index}>
                  <Link to={image.link}>
                    <img src={image.src} alt={image.alt} />
                    <div className="image-text">{image.text}</div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="scroll-div group3">
            <div className="image-group">
              {imageGroup3.map((image, index) => (
                <div className="image-item" key={index}>
                  <Link to={image.link}>
                    <img src={image.src} alt={image.alt} />
                    <div className="image-text">{image.text}</div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        .div2 {
          display: flex;
          justify-content: space-between;
          height: 100%;
          overflow: hidden;
          position: relative;
          width: calc(100% - 20px);
        }

        .scroll-div {
          width: 30%;
          height: 100%;
          overflow: hidden;
          position: relative;
        }

        .image-group {
          display: flex;
          flex-direction: column;
          height: 200%;
          transform: translateY(100%);
        }

        .image-item {
          position: relative;
          height: 40%;
          overflow: hidden;
        }

        .scroll-div img {
          width: 100%;
          height: auto;
          object-fit: cover;
          transition: transform 0.5s ease, box-shadow 0.5s ease; /* Smooth transition for hover effects */
        }

        .image-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          background-color: rgba(0, 0, 0, 0.5);
          padding: 5px;
          border-radius: 3px;
          text-align: center;
        }

        /* Hover effect: Zoom and add shadow */
        .image-item:hover img {
          transform: scale(1.1); /* Zoom effect */
          box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.5); /* Shadow effect */
        }

        .group1 .image-group,
        .group3 .image-group {
          animation: scrollUpFromBottom 350s linear infinite;
        }

        .group2 .image-group {
          animation: scrollDown 800s linear infinite;
        }

        @keyframes scrollUpFromBottom {
          0% {
            transform: translateY(-40%);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes scrollDown {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-100%);
          }
        }

        /* Search Input Placeholder Animation */
        @keyframes moveUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-100%);
          }
        }

        .search-placeholder input::placeholder {
          animation: moveUp 6s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
