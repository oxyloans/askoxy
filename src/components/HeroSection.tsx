import React, { useState } from 'react';
import backgroundImage from '../assets/img/BG.jpg';
import { FaSearch } from 'react-icons/fa';
import Header from './Header';
import ReactMarkdown from 'react-markdown';


import { Link, useNavigate } from 'react-router-dom';
import HM1 from '../assets/img/1.png';
import HM2 from '../assets/img/2.png';
import HM3 from '../assets/img/3.png';
import HM4 from '../assets/img/4.png';
import HM5 from '../assets/img/5.png';
import HM6 from '../assets/img/6.png';
import HM7 from '../assets/img/7.png';
import HM8 from '../assets/img/8.png';
import HM9 from '../assets/img/9.png';
import HM10 from '../assets/img/10.png';
import HM11 from '../assets/img/11.png';
import axios from 'axios';

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
  { src: HM2, alt: 'Image 2', text: 'Groceries', link: '/Normal' },
  { src: HM3, alt: 'Image 3', text: 'Tickets', link: '/Normal' },
  { src: HM4, alt: 'Image 4', text: 'Transportation', link: '/Normal' },
  { src: HM5, alt: 'Image 5', text: 'Global Education', link: '/Normal' },
  { src: HM6, alt: 'Image 6', text: 'Food & Beverage', link: '/Normal' },
  { src: HM7, alt: 'Image 7', text: 'Games', link: '/Normal' },
  { src: HM8, alt: 'Image 8', text: 'Legal Services', link: '/Normal' },
  { src: HM9, alt: 'Image 9', text: 'Pets', link: '/Normal' },
  { src: HM10, alt: 'Image 10', text: 'Event Management Services', link: '/Normal' },
  { src: HM11, alt: 'Image 11', text: 'Influencer Marketing Services', link: '/Normal' },
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


    const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (query.trim() === '') {
      alert('Please enter a valid question');
      return;
    }

    try {
      const result = await axios.post(
        `https://meta.oxyloans.com/api/student-service/user/globalChatGpt?InfoType=${query}`
      );
      setResponse(result.data); // Assuming the response data you want is directly in `data`
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Something went wrong. Please try again later.');
    }
};
  
  const imageGroup1 = repeatAndShuffleImages(images, 20);
  const imageGroup2 = repeatAndShuffleImages(images, 20);
  const imageGroup3 = repeatAndShuffleImages(images, 20);

  return (
    <section className="section">
      {/* Header Section */}
      <header className="absolute top-0 left-0 right-0 z-20 w-full">
        <Header />
      </header>

      <div className="main">
  

      <div className="div1">
  <div className="inner-flex">
    <h1 className="heading">
      <span>Ask</span> <br />
      <span className="text-yellow">Solve</span><br />
      Succeed<span className="text-yellow">...</span>
    </h1>

    {/* Search Input */}
   <div className="search-placeholder">
      <div className="input-container">
        <input
          type="text"   
          placeholder="Ask question..."
          className="search-input"
          value={query}
          onChange={handleInputChange}
                />
                <Link to={`/normal?${query}`}>
        <button  className="search-button ">
          <span className="search-icon icons">&#128269;</span> {/* Placeholder for Search Icon */}
                  </button>
                  </Link>
      </div>

      {/* Display the API response */}
      {/* {response && (
        <div className="response-container">
          <h3></h3>
          <p><ReactMarkdown>{JSON.stringify(response, null, 2)}</ReactMarkdown> </p>
        </div>
      )} */}
    </div>
  </div>
</div>




        {/* Image Section - 40% of screen width */}
        <div className="div2 ">
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
      <style>{`/* Main container styling */
  .section {
    display: flex;
    align-items: center;
    color: white;
    background-position: center;
    background-size: cover;
    max-height: 0;
    overflow: hidden;
    min-height: 100vh;
    background-image: url(${backgroundImage}); /* Path to the image */
  }
    .icons{
    margin-top:-1.5rem}

  /* Mobile Devices - Background covers entire area */
  @media (max-width: 767px) {
    .section {
      background-size: cover; /* Ensures full coverage on mobile */
      background-position: center top; /* Positions the background at the top */
      align-items: normal;
    }
  }

  /* Tablets and small desktops */
  @media (min-width: 768px) and (max-width: 1023px) {
    .section {
      background-size: contain; /* Contains background without cutting off image */
      background-position: center; /* Centers the image */
    }
  }

  /* Larger screens */
  @media (min-width: 1024px) {
    .section {
      background-size: cover; /* Full background coverage on larger screens */
      background-position: center; /* Centers the image */
    }
  }


.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column; /* Stack div1 on top of div2 by default (for mobile) */
}

@media (min-width: 768px) {
  .main {
    flex-direction: row; /* For larger screens, div1 and div2 appear side by side */
  }
}
/* Base styling for large desktop screens (above 1440px) */
/* Base styling for large screens (desktop) */
.div1 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 3;
  flex-direction: column;
}

/* Media Queries */

/* For large desktops (1440px and above) */
@media (min-width: 1440px) {
  .div1 {
    /* Add any specific changes for large desktops if needed */
  }
}

/* For laptops and small desktops (between 1024px and 1440px) */
@media (max-width: 1440px) and (min-width: 1024px) {
  .div1 {
    /* Adjust layout for laptops */
    padding: 20px;
  }
}

/* For tablets (between 768px and 1024px) */
@media (max-width: 1024px) and (min-width: 768px) {
  .div1 {
    flex-direction: column;
    padding: 15px;
  }
}


// .response-container{
//     height: 8rem !important;
//     overflow-y: scroll;
//     background-color: gray !important;
//     overflow: scroll;
//     overflow-x: hidden;
// }
.response-container > p{
 height: 8rem !important;
    overflow: scroll;
    overflow-x: hidden;
}  
/* For mobile phones (between 600px and 768px) */
@media (max-width: 768px) and (min-width: 600px) {
  .div1 {
    flex-direction: column;
    padding-top: 150px;
    padding-bottom: 60px;
  }
}

/* For small mobile phones (480px to 600px) */
@media (max-width: 600px) and (min-width: 480px) {
  .div1 {
    flex-direction: column;
    padding-top: 150px;
    padding-bottom: 60px;
  }
}

/* For very small mobile devices (below 480px) */
@media (max-width: 480px) {
  .div1 {
    flex-direction: column;
    padding-top: 150px;
    padding-bottom: 60px;
  }
}

.inner-flex {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.heading {
  font-size: 130px; /* Large font size for desktops */
  font-weight: 800;
  line-height: 100%;

}

.text-yellow {
  color: #facc15; /* Yellow color for specific text */
}

/* Search Input Styling */
.search-placeholder {
  width: 100%;
  padding: 0.4rem;
  margin-top: 2.5rem;
  background-color: rgba(255, 255, 255, 0.5); /* White with 50% opacity */
  border-radius: 1.5rem;
  position: relative;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 1rem;
  padding-right: 3rem; /* Padding for the search icon */
  border: none;
  border-radius: 9999px; /* Fully rounded */
  height: 60px;
  font-size: 1rem;
  color: black;
}

.search-input::placeholder {
  color: black;
}

.search-icon {
  position: absolute;
  right: 1.25rem;
  font-size: 1.5rem;
  color: gray;
}

/* Media Queries */

/* For larger desktops (1440px and above) */
@media (min-width: 1440px) {
  .heading {
    font-size: 130px;
  }

  .search-input {
    height: 70px;
    font-size: 1.2rem;
  }

  .search-icon {
    font-size: 1.75rem;
  }
}

/* For laptops (between 1024px and 1440px) */
@media (max-width: 1440px) and (min-width: 1024px) {
  .heading {
    font-size: 100px; /* Reduce font size for laptops */
   margin-top: 4rem !important;
  }

  .search-input {
    height: 60px;
    font-size: 1rem;
  }

  .search-icon {
    font-size: 1.5rem;
  }
}

/* For tablets (between 768px and 1024px) */
@media (max-width: 1024px) and (min-width: 768px) {
  .heading {
    font-size: 80px; /* Smaller size for tablets */
  }

  .search-input {
    height: 50px;
    font-size: 0.9rem;
  }

  .search-icon {
    font-size: 1.3rem;
  }
}

/* For small tablets and large mobile phones (between 600px and 768px) */
@media (max-width: 768px) and (min-width: 600px) {
  .heading {
    font-size: 70px;
  }

  .search-input {
    height: 45px;
    font-size: 0.85rem;
  }

  .search-placeholder {
    padding: 0.75rem;
    margin-top: 1.5rem;
  }

  .search-icon {
    font-size: 1.2rem;
  }
}

/* For medium to small mobile phones (between 480px and 600px) */
@media (max-width: 600px) and (min-width: 480px) {
  .heading {
    font-size: 60px;
  }

  .search-input {
    height: 40px;
    font-size: 0.8rem;
  }

  .search-icon {
    font-size: 1.1rem;
  }
}

/* For very small mobile devices (below 480px) */
@media (max-width: 480px) {
  .heading {
    font-size: 50px; /* Further reduce for tiny screens */
  }

  .search-input {
    height: 40px;
    font-size: 0.7rem;
  }

  .search-icon {
    font-size: 1rem;
  }
}



/* Styling for div2 */
.div2 {
  display: flex;
  justify-content: space-between;
  height: 100%;
  overflow: hidden;
  position: relative;
  width: calc(100% - 20px);
  flex: 3;
}

/* Ensures div2 moves below div1 on mobile */
@media (max-width: 767px) {
  .div2 {
    margin-top: 20px; /* Add space between div1 and div2 */
  }
}

/* Scrollable image container */
.scroll-div {
  width: 30%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

/* Image group styling */
.image-group {
  display: flex;
  flex-direction: column;
  height: 200%;
  transform: translateY(100%);
}

/* Image item styling */
.image-item {
  position: relative;
  height: 40%;
  overflow: hidden;
}

/* Image styling with hover effects */
.scroll-div img {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.5s ease, box-shadow 0.5s ease; /* Smooth transition for hover effects */
}

/* Image text styling */
.image-text {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px;
  border-radius: 3px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.5s ease; /* Hide by default */
}

/* Hover effects for image items */
.image-item:hover img {
  transform: scale(1.1); /* Zoom effect */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.5); /* Shadow effect */
}

.image-item:hover .image-text {
  opacity: 1; /* Show text on hover */
}

/* Scroll animations for image groups */
.group1 .image-group,
.group3 .image-group {
  animation: scrollUpFromBottom 350s linear infinite;
}

.group2 .image-group {
  animation: scrollDown 800s linear infinite;
}

/* Keyframes for scrolling animations */
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
@keyframes placeholder-move {
  0%,
  100% {
    top: 0;
    opacity: 1;
  }
  33% {
    top: -2em;
    opacity: 0;
  }
  66% {
    top: 2em;
    opacity: 0;
  }
}

      `}</style>
    </section>
  );
};

export default HeroSection;
