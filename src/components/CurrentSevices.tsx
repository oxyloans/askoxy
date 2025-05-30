import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HM1 from "../assets/img/0.png";
import HM2 from "../assets/img/white green minimalist body lotion Product Promotion Instagram post.png";
import HM3 from "../assets/img/IMAGE 3.png";
import HM4 from "../assets/img/Manchester.png";
import HM5 from "../assets/img/11f.png";
import HM6 from "../assets/img/jsr.png";
import HM7 from "../assets/img/IMAGE 7.png";
import HM8 from "../assets/img/IMAGE 8.png";
import HM9 from "../assets/img/image 9.png";
import HM10 from "../assets/img/IMAGE 10.png";
import HM11 from "../assets/img/IMAGE 11.png";
import HM12 from "../assets/img/IMAGE 12.png";
import HM13 from "../assets/img/22f.png";
import HM14 from "../assets/img/IMAGE 17.png";
import HM15 from "../assets/img/IMAGE 14.png";
import HM16 from "../assets/img/IMAGE 16.png";
import HM17 from "../assets/img/IMAGE 15.png";
import HM18 from "../assets/img/IMAGE 18.png";
import HM19 from "../assets/img/image 19.png";
import HM20 from "../assets/img/image 20.png";
import HM21 from "../assets/img/Free AI and Gen ai training.png";

const ResponsiveGallery = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(
    "You are being transferred to the powerful ChatGPT. Please login to continue your experience."
  );
  const navigate = useNavigate();

  const images = [
    {
      id: 19,
      src: HM13,
      alt: "Buy 2 Kg Rice & Get 1 Kg Free",
      category: "BUY 2 KG RICE & GET 1 KG RICE FREE",
      link: "/main/dashboard/products",
      weight: 1.0, // Adding weight parameter
    },
    {
      id: 5,
      src: HM5,
      alt: "Buy 5 Kg Rice & Get 2 Kg Free",
      category: "BUY 5 KG RICE & GET 2 KG RICE FREE",
      link: "/main/dashboard/products",
      weight: 5.0, // Adding weight parameter
    },
    {
      id: 2,
      src: HM1,
      alt: "Buy 10 Kgs Rice Bag & Get 18 Kgs Steel Container",
      category: "Buy 10 Kgs Rice Bag & Get 18 Kgs Steel Container",
      link: "/main/dashboard/products",
      weight: 10.0, // Adding weight parameter
    },

    {
      id: 1,
      src: HM2,
      alt: "Buy 26 Kgs Rice Bag & Get 35 Kgs Steel Container",
      category: "Buy 26 Kgs Rice Bag & Get 35 Kgs Steel Container",
      link: "/main/dashboard/products",
      weight: 26.0, // Adding weight parameter
    },

    {
      id: 16,
      src: HM16,
      alt: "Bawarchi brown rice",
      category: "BAWARCHI BROWN RICE",
      link: "/main/dashboard/products",
      weight: 26.0, // Adding weight parameter
    },
    {
      id: 18,
      src: HM18,
      alt: "Surya Teja's Joker Brand",
      category: "SURYA TEJA'S JOKER BRAND",
      link: "/main/dashboard/products",
      weight: 26.0, // Adding weight parameter
    },

    {
      id: 20,
      src: HM15,
      alt: "Gajaraj Evergreen",
      category: " GAJARAJ EVERGREEN",
      link: "/main/dashboard/products",
      weight: 26.0, // Adding weight parameter
    },
    {
      id: 15,
      src: HM17,
      alt: "Sri Lalitha",
      category: "SRI LALITHA",
      link: "/main/dashboard/products",
      weight: 26.0, // Adding weight parameter
    },
    {
      id: 17,
      src: HM14,
      alt: "Cow Brand",
      category: "COW BRAND",
      link: "/main/dashboard/products",
      weight: 26.0, // Adding weight parameter
    },
    {
      id: 7,
      src: HM6,
      alt: "Jai Sri Ram",
      category: "JAI SRI RAM",
      link: "/main/dashboard/products",
      weigtht: 26.0, // Adding weight parameter
    },
    {
      id: 4,
      src: HM4,
      alt: "University of Chester",
      category: "UNIVERSITY OF CHESTER",
      link: "/main/services/studyabroad",
    },
    {
      id: 8,
      src: HM8,
      alt: "Study Abroad",
      category: "STUDY ABROAD",
      link: "/main/services/studyabroad",
    },
    {
      id: 3,
      src: HM3,
      alt: "Middlesex University",
      category: "MIDDLESSEX UNIVERSITY",
      link: "/main/services/studyabroad",
    },
    {
      id: 9,
      src: HM9,
      alt: "Study Abroad",
      category: "STUDY ABROAD",
      link: "/main/services/studyabroad",
    },

    {
      id: 6,
      src: HM7,
      alt: "BPP University",
      category: "BPP UNIVERSITY",
      link: "/main/services/studyabroad",
    },

    {
      id: 10,
      src: HM10,
      alt: "Study Abroad",
      category: "STUDY ABROAD",
      link: "/main/services/studyabroad",
    },
    {
      id: 11,
      src: HM11,
      alt: "Oxyloans",
      category: "OXYLOANS",
      link: "/main/service/oxyloans-service",
    },
    {
      id: 13,
      src: HM21,
      alt: "Free ai and Gen ai",
      category: " FREE AI AND GEN AI",
      link: "/main/services/freeai-genai",
    },
    {
      id: 12,
      src: HM12,
      alt: "OxyLoans",
      category: "OXYLOANS",
      link: "/main/service/oxyloans-service",
    },

    {
      id: 14,
      src: HM20,
      alt: "Free Rudraksha",
      category: "FREE RUDRAKSHA",
      link: "/main/services/freerudraksha",
    },

    {
      id: 21,
      src: HM19,
      alt: "Urban Springs",
      category: "URBAN SPRINGS",
      link: "/main/services/campaign/37b3",
    },
  ];

  // Handle image click and set dynamic modal content
  const handleImageClick = (image: any) => {
    const userId = localStorage.getItem("userId");

    // Construct the target URL with weight parameter if applicable
    let targetUrl = image.link;
     if (image.weight && image.link.includes("products")) {
       // Force the weight to be formatted with decimal point even for whole numbers
       const formattedWeight = image.weight.toFixed(1); // This ensures 1.0 stays as "1.0" not "1"
       targetUrl = `${image.link}?weight=${formattedWeight}`;
     } else if (image.link.includes("/main/services/studyabroad")) {
       // Keep the original link without modifications
       targetUrl = image.link;
     } else if (image.link.includes("/main/service/oxyloans-service")) {
       // Keep the original link without modifications
       targetUrl = image.link;
     } else if (image.link.includes("/main/services/freeai-genai")) {
       // Keep the original link without modifications
       targetUrl = image.link;
     } else if (image.link.includes("/main/services/freerudraksha")) {
       // Keep the original link without modifications
       targetUrl = image.link;
     }
    
    // Store the target URL in sessionStorage to use after login/registration
    sessionStorage.setItem("redirectPath", targetUrl);

    if (!userId) {
      // Set modal content based on the image link
      let dynamicMessage = "";

      if (image.link.includes("/main/dashboard/products")) {
        dynamicMessage = `Order ${image.weight}kg rice online with ease! Sign in to explore our range of products and place your order.`;
      } else {
        switch (image.link) {
          case "/main/services/studyabroad":
            dynamicMessage = `Ready to explore study abroad opportunities? Sign in to get personalized assistance for your journey!`;
            break;
          case "/main/service/oxyloans-service":
            dynamicMessage = `Interested in peer-to-peer lending with OxyLoans? Sign in to start lending or borrowing today!`;
            break;
          case "/main/services/campaign/37b3":
            dynamicMessage = `Discover real estate opportunities with OXY GROUP! Urban Springs is one of our premium projects. Sign in to learn more and get involved!`;
            break;
          case "/main/services/freerudraksha":
            dynamicMessage = `Get your free Rudraksha today! Sign in to claim this spiritual gift and explore more offerings.`;
            break;
          case "/main/services/freeai-genai":
            dynamicMessage = `Unlock the power of AI with FreeAI & GenAI! Sign in to explore cutting-edge tools and services.`;
            break;
          default:
            dynamicMessage = `Welcome! Sign in to access our amazing services tailored just for you!`;
        }
      }

      setModalContent(dynamicMessage);
      setShowModal(true);
    } else {
      // Redirect directly if user is logged in
      window.location.href = targetUrl;
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleLoginClick = () => {
    closeModal();
    navigate("/whatsapplogin");
  };

  return (
    <div className="relative bg-gradient-to-br from-white via-white to-white min-h-screen p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-10xl mx-auto">
        {/* Unified Responsive Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {images.map((image) => (
            <motion.div
              key={image.id}
              className="relative cursor-pointer transition-transform rounded-lg overflow-hidden shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.05 }}
              onClick={() => handleImageClick(image)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="aspect-square relative">
                <img
                  src={image.src}
                  alt={`Category: ${image.category}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/50">
                  <span className="text-white px-1 py-1 text-xs md:text-sm font-medium text-center w-full">
                    {image.category}
                    {image.weight ? ` (${image.weight}kg)` : ""}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/70 z-50 px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-4 sm:p-6 rounded-xl max-w-sm w-full shadow-2xl border border-gray-100/30 backdrop-blur-sm"
          >
            <p className="text-center text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
              {modalContent}
            </p>
            <div className="flex justify-center gap-3 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium hover:shadow-lg transition-all duration-300"
                onClick={handleLoginClick}
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-200 text-gray-700 px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium hover:bg-gray-300 transition-all duration-300"
                onClick={closeModal}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveGallery;
