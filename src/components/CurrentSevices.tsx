import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HM1 from "../assets/img/BUY 1 GET 1.png";
import HM2 from "../assets/img/BUY 1 GET 1 2.png";
import HM3 from "../assets/img/IMAGE 3.png";
import HM4 from "../assets/img/image 4.png";
import HM5 from "../assets/img/IMAGE 5.png";
import HM6 from "../assets/img/IMAGE 6.png";
import HM7 from "../assets/img/IMAGE 7.png";
import HM8 from "../assets/img/IMAGE 8.png";
import HM9 from "../assets/img/image 9.png";
import HM10 from "../assets/img/IMAGE 10.png";
import HM11 from "../assets/img/IMAGE 11.png";
import HM12 from "../assets/img/IMAGE 12.png";
import HM13 from "../assets/img/image 13.png";
import HM14 from "../assets/img/IMAGE 14.png";
import HM15 from "../assets/img/IMAGE 15.png";
import HM16 from "../assets/img/IMAGE 16.png";
import HM17 from "../assets/img/IMAGE 17.png";
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
      id: 1,
      src: HM1,
      alt: "Buy 1 Kg Rice Get 1 Kg Free",
      category: "BUY 1 KG RICE GET 1 KG RICE FREE",

      link: "/main/dashboard/products",
    },
    {
      id: 2,
      src: HM2,
      alt: "Buy 1 Kg Rice Get 1 Kg Free",
      category: "BUY 1 KG RICE GET 1 KG RICE FREE",
      link: "/main/dashboard/products",
    },
    {
      id: 3,
      src: HM3,
      alt: "Middlesex University",
      category: "MIDDLESSEX UNIVERSITY",
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
      id: 4,
      src: HM4,
      alt: "The University of Law",
      category: "THE UNIVERSITY OF LAW",
      link: "/main/services/studyabroad",
    },
    {
      id: 5,
      src: HM5,
      alt: "Coventry University",
      category: "COVENTRY UNIVERSITY",

      link: "/main/services/studyabroad",
    },

    {
      id: 7,
      src: HM6,
      alt: "Edinburgh Napier University",
      category: "EDINBURGH NAPIER UNIVERSITY",
      link: "/main/services/studyabroad",
    },
    {
      id: 8,
      src: HM8,
      alt: "Study Abroad",
      link: "/main/services/studyabroad",
    },
    {
      id: 9,
      src: HM9,
      alt: "Study Abroad",
      link: "/main/services/studyabroad",
    },
    {
      id: 10,
      src: HM10,
      alt: "Study Abroad",
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
      id: 12,
      src: HM12,
      alt: "OxyLoans",
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
      id: 14,
      src: HM20,
      alt: "Free Rudraksha",
      category: "FREE RUDRAKSHA",
      link: "/main/services/freerudraksha",
    },
    {
      id: 15,
      src: HM15,
      alt: "Sri Lalitha",
      category: "SRI LALITHA",
      link: "/main/dashboard/products",
    },
    {
      id: 16,
      src: HM16,
      alt: "Bawarchi brown rice",
      category: "BAWARCHI BROWN RICE",
      link: "/main/dashboard/products",
    },
    {
      id: 17,
      src: HM17,
      alt: "Cow Brand",
      category: "COW BRAND",
      link: "/main/dashboard/products",
    },
    {
      id: 18,
      src: HM18,
      alt: "Surya Teja's Joker Brand",
      category: "SURYA TEJA'S JOKER BRAND",
      link: "/main/dashboard/products",
    },
    {
      id: 19,
      src: HM13,
      alt: "Kisan Rice",
      category: "KISAN RICE",
      link: "/main/dashboard/products",
    },
    {
      id: 20,
      src: HM14,
      alt: "Gajaraj Evergreen",
      category: " GAJARAJ EVERGREEN",
      link: "/main/dashboard/products",
    },
    {
      id: 21,
      src: HM19,
      alt: "Urban Springs",
      category: "URBAN SPRINGS",
      link: "/main/services/campaign/37b3",
    },
  ];

  // Divide images into 3 rows (7 images each)
  const row1 = images.slice(0, 7);
  const row2 = images.slice(7, 14);
  const row3 = images.slice(14, 21);

  // const handleImageClick = (image: any) => {

  // };

  // Handle image click and set dynamic modal content
  const handleImageClick = (image: any) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      // Set modal content based on the image link
      let dynamicMessage = "";
      switch (image.link) {
        case "/main/services/studyabroad":
          dynamicMessage = `Ready to explore study abroad opportunities? Sign in to get personalized assistance for your journey!`;
          break;
        case "/main/service/oxyloans-service":
          dynamicMessage = `Interested in peer-to-peer lending with OxyLoans? Sign in to start lending or borrowing today!`;
          break;
        case "/main/dashboard/products":
          dynamicMessage = `Order rice online with ease! Sign in to explore our range of products and place your order.`;
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

      setModalContent(dynamicMessage);
      setShowModal(true);
    } else {
      // Redirect directly if user is logged in
      window.location.href = image.link;
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
