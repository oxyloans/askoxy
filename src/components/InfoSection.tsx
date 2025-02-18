// src/components/CombinedSections.tsx
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import axios from "axios";


const InfoSection: React.FC = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // const handleSearch = async () => {
  //   if (query.trim() === "") {
  //     alert("Please enter a valid question");
  //     return;
  //   }

  //   try {
  //     const result = await axios.post(
  //       `https://meta.oxyloans.com/api/student-service/user/globalChatGpt?InfoType=${query}`
  //     );
  //     setResponse(result.data); // Assuming the response data you want is directly in `data`
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     alert("Something went wrong. Please try again later.");
  //   }
  // };

    
  return (
    <div className="py-8">
      {/* Advice Section */}
      <div className="px-6 py-5 bg-white md:p-10">
        <div className="flex flex-col items-center justify-around gap-6 md:flex-row">
          {/* First Div: Simple Ask */}
          <div className="flex flex-col items-center justify-center w-full mb-6 md:w-1/4 md:mb-0">
            <div className="bg-white shadow-xl p-8 md:p-10 rounded-[20px] text-center border border-gray-300">
              <h3 className="mb-2 text-xl font-semibold text-purple-700 md:mb-5">
                Simple Ask
              </h3>
              <p className="text-gray-600">
                Get instant answers or connect with a mentor who can guide you
                further.
              </p>
            </div>
          </div>

          {/* Second Div: Heading, Problem & Solutions */}
          <div className="flex flex-col items-center justify-center w-full mb-6 md:w-1/3 md:mb-0">
            <h2 className="mb-2 text-2xl font-bold text-center text-yellow-600 md:text-3xl md:mb-6">
              We're not just about advice
            </h2>
            <p className="mb-8 text-sm text-center text-gray-600 md:text-lg">
              AskOxy.AI is more than just unlimited ChatGPT prompts. We're
              committed to helping you achieve your goals by enabling unlimited
              queries, assigning mentors, arranging funding, discussing tailored
              solutions, and providing end-to-end support.
            </p>
            <div className="bg-white shadow-xl p-8 md:p-10 rounded-[20px] text-center border border-gray-300">
              <h3 className="mb-2 text-xl font-semibold text-purple-700 md:mb-5">
                Effective Solve
              </h3>
              <p className="text-gray-600">
                We equip you with mentors, funding, and comprehensive platform
                solutions to overcome obstacles and progress seamlessly.
              </p>
            </div>
          </div>

          {/* Third Div: End-to-End Support */}
          <div className="flex flex-col items-center justify-center w-full mb-6 md:w-1/4 md:mb-0">
            <div className="bg-white shadow-xl p-8 md:p-10 rounded-[20px] text-center border border-gray-300">
              <h3 className="mb-2 text-xl font-semibold text-purple-700 md:mb-5">
                Guaranteed Success
              </h3>
              <p className="text-gray-600">
                Our end-to-end support ensures comprehensive backing for
                projects or companies with a clear vision and mission,
                complemented by Simple Ask and Effective Solve.
              </p>
            </div>
          </div>
        </div>
      </div>

     

      {/* Search Section */}
     

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

export default InfoSection;
