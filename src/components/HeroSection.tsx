import React, { useState } from "react";
import backgroundImage from "../assets/img/BG.jpg";
import { FaSearch } from "react-icons/fa";
import "./herosection.css";
import Header from "./Header";
import ReactMarkdown from "react-markdown";

import { Link, useNavigate } from "react-router-dom";
import HM1 from "../assets/img/1.png";
import HM2 from "../assets/img/2.png";
import HM3 from "../assets/img/3.png";
import HM4 from "../assets/img/4.png";
import HM5 from "../assets/img/5.png";
import HM6 from "../assets/img/6.png";
import HM7 from "../assets/img/7.png";
import HM8 from "../assets/img/8.png";
import HM9 from "../assets/img/9.png";
import HM10 from "../assets/img/10.png";
import HM11 from "../assets/img/11.png";
import HM12 from "../assets/img/X1.png";
import HM13 from "../assets/img/X2.png";
import HM14 from "../assets/img/X3.png";
import HM15 from "../assets/img/X4.png";
import HM16 from "../assets/img/X5.png";
import HM17 from "../assets/img/X6.png";
import HM18 from "../assets/img/X7.png";
import HM19 from "../assets/img/X8.png";
import HM20 from "../assets/img/X9.png";
import HM21 from "../assets/img/X10.png";
import HM22 from "../assets/img/X11.png";
import HM23 from "../assets/img/X12.png";
import HM24 from "../assets/img/X13.png";
import HM25 from "../assets/img/X14.png";
import HM26 from "../assets/img/X15.png";
import HM27 from "../assets/img/X27.png";
import HM28 from "../assets/img/X28.png";
import HM29 from "../assets/img/X29.png";
import HM30 from "../assets/img/X30.png";
import HM31 from "../assets/img/X31.png";
import HM32 from "../assets/img/X32.png";
import HM33 from "../assets/img/X33.png";
import HM34 from "../assets/img/X34.png";
import HM35 from "../assets/img/X35.png";
import HM36 from "../assets/img/X36.png";
import HM37 from "../assets/img/X37.png";
import HM38 from "../assets/img/X38.png";
import HM39 from "../assets/img/X39.png";
import HM40 from "../assets/img/X40.png";
import axios from "axios";

// Type definition for image data
interface ImageData {
  src: string;
  alt: string;
  text: string;
  link: string;
  
}

// Images and their metadata with page links
const images: ImageData[] = [
  {
    src: HM1,
    alt: "Order Rice Online",
    text: "Order Rice Online",
    link: "/erice",
  },
  {
    src: HM2,
    alt: "Groceries",
    text: "Groceries",
    link: "https://chatgpt.com/g/g-oca8vFV4R-grocery-gpt",
  },
  {
    src: HM3,
    alt: "Tickets",
    text: "Tickets",
    link: "https://chatgpt.com/g/g-zWr0ULYQ3-legaladviseai-gpt",
  },
  {
    src: HM4,
    alt: "Transportation",
    text: "Transportation",
    link: "https://chatgpt.com/g/g-0HtZUgSav-transportai-gpt",
  },
  {
    src: HM5,
    alt: "Global Education",
    text: "Global Education",
    link: "https://chatgpt.com/g/g-HfWFTK9qV-study-abroad-buddy",
  },
  {
    src: HM6,
    alt: "Image 6",
    text: "Food & Beverage",
    link: "/dashboard",
  },
  {
    src: HM7,
    alt: "Games",
    text: "Games",
    link: "https://chatgpt.com/g/g-WhoEAgQHk-gamemasterai-gpt",
  },
  {
    src: HM8,
    alt: "Legal Services",
    text: "Legal Services",
    link: "https://chatgpt.com/g/g-zWr0ULYQ3-legaladviseai-gpt",
  },
  {
    src: HM9,
    alt: "Pets",
    text: "Pets",
    link: "https://chatgpt.com/g/g-SkIhRjqxp-petcareai-gp",
  },
  {
    src: HM10,
    alt: "Event Management Services",
    text: "Event Management Services",
    link: "/dashboard",
  },
  {
    src: HM11,
    alt: "Image 11",
    text: "Influencer Marketing Services",
    link: "/dashboard",
  },
  {
    src: HM12,
    alt: "Image 12",
    text: "Travel and Tour Services",
    link: "https://chatgpt.com/g/g-puZOdL9qn-travelaingpt",
  },
  {
    src: HM13,
    alt: "Financial Advisory",
    text: "Financial Advisory",
    link: "https://chatgpt.com/g/g-1tjwJY59f-finadviseai-gpt",
  },
  {
    src: HM14,
    alt: "Loan Servies",
    text: "Loan Servies",
    link: "https://chatgpt.com/g/g-8FZ5veZAp-loainsgpt",
  },
  {
    src: HM15,
    alt: "Health and Wellness Services",
    text: "Health and Wellness Services",
    link: "/dashboard",
  },

  {
    src: HM17,
    alt: "Advertising Services",
    text: "Advertising Services",
    link: "https://chatgpt.com/g/g-1NeeKkOv7-advertising-services-gpt",
  },
  {
    src: HM18,
    alt: "Marketing Services",
    text: "Marketing Services",
    link: "https://chatgpt.com/g/g-3HZ8yLPdZ-campaignai-gpt",
  },

  {
    src: HM21,
    alt: "Consulting Services",
    text: "Consulting Services",
    link: "https://chatgpt.com/g/g-dKS0DGZaO-businessadviseai-gpt",
  },

  {
    src: HM23,
    alt: "Freelance Services",
    text: "Freelance Services",
    link: "https://chatgpt.com/g/g-UqWRcL56H-freelancerai-gpt",
  },
  {
    src: HM24,
    alt: "CA Services",
    text: "CA Services",
    link: "https://chatgpt.com/g/g-hmAPGBqYY-caassistai-gpt",
  },
  {
    src: HM25,
    alt: "Whole Sale Services",
    text: "Whole Sale Services",
    link: "https://chatgpt.com/g/g-Il6kqNW6F-wholesaleaingpt",
  },
  {
    src: HM26,
    alt: "Education (Domestic and Global)",
    text: "Education (Domestic and Global)",
    link: "https://chatgpt.com/g/g-YowIvLCKJ-eduai-gpt",
  },

  {
    src: HM27,
    alt: "Beauty GPT",
    text: "Beauty GPT",
    link: "https://chatgpt.com/g/g-atKXBmoVR-glamai-gpt",
  },
  {
    src: HM28,
    alt: "Professional Services GPT",
    text: "Professional Services GPT",
    link: "https://chatgpt.com/g/g-zcSFmhyDq-proserveai-gpt",
  },
  {
    src: HM20,
    alt: "Creative Services GPT",
    text: "Creative Services GPT",
    link: "https://chatgpt.com/g/g-ycPInHA9E-artassistai-gpt",
  },
  {
    src: HM29,
    alt: "Advertising services GPT",
    text: "Advertising services GPT",
    link: "https://chatgpt.com/g/g-1NeeKkOv7-advertising-services-gpt",
  },
  {
    src: HM30,
    alt: "Marketing Services GPT",
    text: "Marketing Services GPT",
    link: "https://chatgpt.com/g/g-3HZ8yLPdZ-campaignai-gpt",
  },
  {
    src: HM31,
    alt: "Management Services GPT",
    text: "Management Services GPT",
    link: "https://chatgpt.com/g/g-gkFpZWjhf-eventmanageai-gpt",
  },

  {
    src: HM32,
    alt: "Home Service GPT",
    text: "Home Service GPT",
    link: "https://chatgpt.com/g/g-gYP7A9DGj-servaihome-gpt",
  },
  {
    src: HM33,
    alt: "Automotive Services GPT",
    text: "Automotive Services GPT",
    link: "https://chatgpt.com/g/g-PczKU2om8-realestateai-gpt",
  },
  {
    src: HM34,
    alt: "Real Estate Services GPT",
    text: "Real Estate Services GPT",
    link: "https://chatgpt.com/g/g-PczKU2om8-realestateai-gpt",
  },
  {
    src: HM35,
    alt: "Technical Services GPT",
    text: "Technical Services GPT",
    link: "https://chatgpt.com/g/g-Buk4VV0Ng-techservai-gpt",
  },

  {
    src: HM36,
    alt: "Streetwear GPT",
    text: "Streetwear GPT",
    link: "https://chatgpt.com/g/g-rdKd46utz-streetweartrendai-gpt",
  },

  {
    src: HM37,
    alt: "Travel Planner AI",
    text: "Travel Planner AI",
    link: "https://chatgpt.com/g/g-96zscm6Ar-globetrottergpt",
  },
  {
    src: HM38,
    alt: "InsurAI GPT",
    text: "InsurAI GPT",
    link: "https://chatgpt.com/g/g-JlPzVtjFK-insurai-gpt",
  },
  {
    src: HM39,
    alt: "Influencers GPT",
    text: "Influencers GPT",
    link: "https://chatgpt.com/g/g-ttxew4llb-influencehub-gpt",
  },
  {
    src: HM40,
    alt: "Shopping GPT",
    text: "Shopping GPT",
    link: "https://chatgpt.com/g/g-kCDP2g5yE-shopsmartai-gpt",
  },
];

// Helper function to shuffle images
const shuffleImages = (images: ImageData[]): ImageData[] => {
  let shuffledImages = [...images];
  for (let i = shuffledImages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledImages[i], shuffledImages[j]] = [
      shuffledImages[j],
      shuffledImages[i],
    ];
  }
  return shuffledImages;
};

// Helper function to repeat and shuffle images
const repeatAndShuffleImages = (
  images: ImageData[],
  count: number
): ImageData[] => {
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

  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(
    "You are being transferred to the powerful ChatGPT. Please login to continue your experience."
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (query.trim() === "") {
      alert("Please enter a valid question");
      return;
    }

    try {
      const result = await axios.post(
        `https://meta.oxyloans.com/api/student-service/user/globalChatGpt?InfoType=${query}`
      );
      setResponse(result.data); // Assuming the response data you want is directly in `data`
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const handleImageClick = (image: any) => {
    // Check if the image link starts with "https"
    if (image.link.startsWith("https")) {
      const userId = localStorage.getItem("userId");

      // Check if userId exists in localStorage
      if (!userId) {
        // Show modal if userId is not found
        setModalContent(
          `You are being transferred to the powerful ChatGPT. Please log in to continue your experience.`
        );
        setShowModal(true);
      } else {
        // Navigate or show another action for logged-in users if needed
        // alert(`User ID is: ${userId}`);
        window.open(image.link, "_blank");
      }
    } else {
      // Navigate to the link if it's not an "https" link
      navigate(image.link);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleLoginClick = () => {
    closeModal();
    navigate("/whatapplogin"); // Navigate to the login page
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
          <div
            className="inner-flex UnlimitedChatGPT"
            style={{ marginTop: "5rem" }}
          >
            <h2 className="Unlmt">Unlimited ChatGPT Prompts</h2>
            <h1 className="heading">
              <span>Ask</span> <br />
              <span className="text-yellow">Solve</span>
              <br />
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      // Trigger redirection when Enter is pressed
                      window.location.href = `/normal?${query}`;
                    }
                  }}
                />
                <button
                  className="search-button"
                  onClick={() => {
                    window.location.href = `/normal?${query}`;
                  }}
                >
                  <span className="search-icon icons">&#128269;</span>{" "}
                  {/* Placeholder for Search Icon */}
                </button>
              </div>

              {/* Optional: Display the API response */}
              {/* {response && (
    <div className="response-container">
      <h3></h3>
      <p><ReactMarkdown>{JSON.stringify(response, null, 2)}</ReactMarkdown></p>
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
                  <div onClick={() => handleImageClick(image)}>
                    
                      <img src={image.src} alt={image.alt} />
                 
                    <div className="image-text">{image.text}</div>
                  </div>
                </div>
              ))}
            </div>
            {showModal && (
              <div
                className="modal-overlay"
                style={{
                  zIndex: 1000,
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="modal-content"
                  style={{
                    backgroundColor: "white",
                    padding: "10px 15px", // Smaller padding
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    zIndex: 1001,
                    width: "300px", // Smaller width
                    textAlign: "center",
                  }}
                >
                  <p style={{ color: "black" }}>{modalContent}</p>
                  <br></br>
                  <button
                    onClick={handleLoginClick}
                    style={{
                      backgroundColor: "#007BFF",
                      color: "white",
                      border: "none",
                      padding: "8px 16px", // Smaller padding for buttons
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    Log In
                  </button>
                  <button
                    onClick={closeModal}
                    style={{
                      backgroundColor: "#DC3545",
                      color: "white",
                      border: "none",
                      padding: "8px 16px", // Smaller padding for buttons
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="scroll-div group2">
            <div className="image-group">
              {imageGroup2.map((image, index) => (
                <div className="image-item" key={index}>
                  <div onClick={() => handleImageClick(image)}>
                  
                      <img src={image.src} alt={image.alt} />
                    
                    <div className="image-text">{image.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="scroll-div group3">
            <div className="image-group">
              {imageGroup3.map((image, index) => (
                <div className="image-item" key={index}>
                  <div onClick={() => handleImageClick(image)}>
                    
                      <img src={image.src} alt={image.alt} />
                   
                    <div className="image-text">{image.text}</div>
                  </div>
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
        min-height: 100vh;
    }
  }

  /* Larger screens */
  @media (min-width: 1024px) {
    .section {
      background-size: cover; /* Full background coverage on larger screens */
      background-position: center; /* Centers the image */
        min-height: 100vh;
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
    font-size: 125px;
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
    font-size: 80px; /* Reduce font size for laptops */

  }

  .search-input {
    height: 40px;
    font-size: 1rem;
  }

  .search-icon {
    font-size: 1.3rem;
    top:25px;
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
  padding-inline: 60px;
}

/* Ensures div2 moves below div1 on mobile */
@media (max-width: 767px) {
  .div2 {
    margin-top: 20px; /* Add space between div1 and div2 */
    padding-inline: 10px;
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
  font-size:15px;
}

@media (max-width: 1440px) and (min-width: 1024px) {
  font-size:10px;
}
@media (max-width: 768px) {
  .image-item:hover .image-text {
    font-size: 10px; /* Decrease font size on smaller screens */
  }
}

/* Scroll animations for image groups */
.group1 .image-group,
.group3 .image-group {
  animation: scrollUpFromBottom 1900s linear infinite;
}

.group2 .image-group {
  animation: scrollDown 4000s linear infinite;
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
.Unlmt{
align-self: flex-start;
    border-width: 2px;
    // background-color: #f9cc15;
    padding: 10px;
    border-radius: 10px;
 
    color:#f9cc15;
    font-weight: bold;
    border-color:#f9cc15

    }
      `}</style>
    </section>
  );
};

export default HeroSection;
