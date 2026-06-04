import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchSection: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

 const userId = localStorage.getItem("userId");
 const handleSearch = () => {
   if (userId) {
     // If user is signed in, redirect to dashboard
     window.location.href = `/dashboard?query=${encodeURIComponent(query)}`;
   } else {
     // Otherwise, redirect to normal page
     window.location.href = `/normal?query=${encodeURIComponent(query)}`;
   }
 };

  return (
    <div className="py-8 text-center bg-purple-700 bg-gradient-to-b from-purple-500 to-purple-900">
     <h2 className="mb-4 text-2xl font-bold text-yellow-500 md:text-3xl">
              Search anything you want
            </h2>
            <p className="mb-6 text-sm text-gray-300 md:text-lg">
              We're here to help you achieve your goals with tailored solutions and
              end-to-end support.
            </p>
    
            <div className="flex items-center justify-center">
              <div className="search-placeholder1">
                <div className="relative w-100 ">
                  <input
                    type="text"
                    placeholder="Ask question..."
                    className="search-input"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch(); // Trigger the search action on Enter
                      }
                    }}
                  />
                  <button
                    className="absolute top-1/2 right-2 transform -translate-y-1/2  text-black p-2 rounded-full "
                    onClick={handleSearch}  
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>
            </div>
            {response && <div className="response-section">{response}</div>}

      <style>
        {`
        .search-placeholder1 {
            width: 50%;
            padding: 0.4rem;
            margin-top: 2.5rem;
            background-color: rgba(255, 255, 255, 0.5);
            border-radius: 1.5rem;
            position: relative;
        }

        @media (max-width: 768px) {
            .search-placeholder1 {
                width: 80%;
                padding: 0.5rem;
                margin-top: 1.5rem;
                border-radius: 1rem;
            }
        }

        @media (max-width: 480px) {
            .search-placeholder1 {
                width: 90%;
                padding: 0.6rem;
                margin-top: 1rem;
                border-radius: 0.75rem;
            }

            .search-icon {
                font-size: 1rem;
                top: 30px;
            }
        }/* General Container */

// /* Carousel Container */
// .carousel-container {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   position: relative;
//   overflow: hidden;
//   width: 100%;
//   max-width: 600px; /* Or any width you want for the carousel */
//   padding: 0 20px; /* Adds space on the sides */
// }

// /* Carousel Wrapper */
// .carousel-wrapper {
//   width: 100%;
//   overflow: hidden;
// }

// /* Images Wrapper */
// .carousel-images-wrapper {
//   display: flex;
//   transition: transform 0.5s ease; /* Smooth transition */
// }

// /* Individual Carousel Item */
// .carousel-image-item {
//   min-width: calc(100% - 20px); /* Adjust for spacing between images */
//   display: flex;
//   justify-content: center;
//   margin-right: 20px; /* Add space between images */
// }

// /* Image Styling */
// .carousel {
//   width: 100%;
//   height: auto;
//   object-fit: cover;
// }

// /* Carousel Buttons */
// .carousel-button {
//   background-color: rgba(0, 0, 0, 0.5);
//   color: white;
//   font-size: 2rem;
//   padding: 0.5rem;
//   position: absolute;
//   top: 50%;
//   transform: translateY(-50%);
//   border: none;
//   cursor: pointer;
//   z-index: 10;
//   border-radius: 50%;
// }

// .prev-button {
//   left: 10px;
// }

// .next-button {
//   right: 10px;
// }

// /* Disable buttons when at the ends */
// .carousel-button:disabled {
//   background-color: rgba(0, 0, 0, 0.2);
//   cursor: not-allowed;
// }

// /* Optional: Add responsiveness for smaller screens */
// @media (max-width: 768px) {
//   .carousel-container {
//     max-width: 100%;
//   }

//   .carousel-button {
//     font-size: 1.5rem;
//   }
// }





.carousel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
}

/* Wrapper for Carousel */
.carousel-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}

/* Carousel Buttons */
.carousel-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 50px;
            position: relative;
          }

          .carousel-wrapper {
            display: flex;
            align-items: center;
            position: relative;
            width: 100%;
            overflow: hidden;
          }

          .carousel-images-wrapper {
            display: flex;
            transition: transform 0.3s ease;
            width: 100%;
          }

          .carousel-image-item {
            margin: 0 10px;
            text-align: center;
            flex: 0 0 100%;
          }

          .carousel-image {
            width: 100%;
            height: auto;
            max-width: 200px;
          }

          .carousel-button {
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            font-size: 24px;
            padding: 10px;
            border: none;
            cursor: pointer;
            border-radius: 50%;
            z-index: 10;
            transition: background-color 0.3s;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .carousel-button:hover {
            background-color: rgba(0, 0, 0, 0.8);
          }

          .prev-button {
            margin-right: 10px; /* Space between button and image */
          }

          .next-button {
            margin-left: 10px; /* Space between button and image */
          }

          @media (max-width: 768px) {
            .carousel-container {
              padding: 20px;
            }

            .carousel-images-wrapper {
              width: 100%;
            }

            .carousel-image-item {
              flex: 0 0 100%;
            }

            .carousel-button {
              font-size: 18px;
              padding: 8px;
            }
          }

          @media (min-width: 769px) {
            .carousel-images-wrapper {
              width: 80%;
            }

            .carousel-image-item {
              flex: 0 0 22%;
            }

            .carousel-button {
              font-size: 24px;
              padding: 12px;
            }
          }

      `}
      </style>
    </div>
  );
};

export default SearchSection;
