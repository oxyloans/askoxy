import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Buy26 from "../assets/img/RICEU9.png"
import BUY10 from "../assets/img/RICEU10.jpg";
const ResponsiveGallery = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(
    "You are being transferred to the powerful ChatGPT. Please login to continue your experience."
  );

  
 const navigate = useNavigate();
  const images = [
    {
      id: 19,
      src: "https://i.ibb.co/rGLqbFk2/22f.png",
      alt: "Buy 2 Kg Rice & Get 1 Kg Free",
      category: "BUY 2 KG RICE & GET 1 KG RICE FREE",
      link: "/main/dashboard/products",
      weight: 1.0, // Adding weight parameter
    },
    {
      id: 4,
      src: "https://i.ibb.co/4gPVZ3Wv/both.png",
      alt: "cashew",
      category: "CASHWE 1 KG & 500 GRAMS",
      link: "/main/dashboard/products",
      weight: 1.0, // Adding weight parameter
    },
    {
      id: 5,
      src: "https://i.ibb.co/N6gbrWzc/11f.png",
      alt: "Buy 5 Kg Rice & Get 2 Kg Free",
      category: "BUY 5 KG RICE & GET 2 KG RICE FREE",
      link: "/main/dashboard/products",
      weight: 5.0, // Adding weight parameter
    },
    {
      id: 2,
      src: BUY10,
      alt: "Buy 10 Kgs Rice Bag & Get 18 Kgs Steel Container",
      category: "Buy 10 Kgs Rice Bag & Get 18 Kgs Steel Container",
      link: "/main/dashboard/products",
      weight: 10.0, // Adding weight parameter
    },

    {
      id: 1,
      src: Buy26,
      alt: "Buy 26 Kgs Rice Bag & Get 35 Kgs Steel Container",
      category: "Buy 26 Kgs Rice Bag & Get 35 Kgs Steel Container",
      link: "/main/dashboard/products",
      weight: 26.0, // Adding weight parameter
    },

    {
      id: 16,
      src: "https://i.ibb.co/F4bH1sq8/bawarchi-Home.png",
      alt: "Bawarchi brown rice",
      category: "BAWARCHI BROWN RICE",
      link: "/main/dashboard/products",
      weight: 26.0, // Adding weight parameter
    },
    {
      id: 18,
      src: "https://i.ibb.co/jv5gD5Jf/surya-teja-Home.png",
      alt: "Surya Teja's Joker Brand",
      category: "SURYA TEJA'S JOKER BRAND",
      link: "/main/dashboard/products",
      weight: 26.0, // Adding weight parameter
    },

    {
      id: 20,
      src: "https://i.ibb.co/BVSXSWGV/gajraj-sona-Home.png",
      alt: "Gajaraj Evergreen",
      category: " GAJARAJ EVERGREEN",
      link: "/main/dashboard/products",
      weight: 26.0, // Adding weight parameter
    },
    {
      id: 15,
      src: "https://i.ibb.co/VY01VqC3/Srilalitha-Home.png",
      alt: "Sri Lalitha",
      category: "SRI LALITHA",
      link: "/main/dashboard/products",
      weight: 26.0, // Adding weight parameter
    },
    {
      id: 17,
      src: "https://i.ibb.co/WvfnPzsK/cowHome.png",
      alt: "Cow Brand",
      category: "COW BRAND",
      link: "/main/dashboard/products",
      weight: 26.0, // Adding weight parameter
    },
    {
      id: 7,
      src: "https://i.ibb.co/C3vsVYpr/JSRHome.png",
      alt: "Jai Sri Ram",
      category: "JAI SRI RAM",
      link: "/main/dashboard/products",
      weigtht: 26.0, // Adding weight parameter
    },

    {
      id: 8,
      src: "https://i.ibb.co/8n0fNmRN/IMAGE-8.png",
      alt: "Study Abroad",
      category: "STUDY ABROAD",
      link: "/main/services/studyabroad",
    },
    {
      id: 3,
      src: "https://i.ibb.co/mQDXBGY/IMAGE-3.png",
      alt: "Middlesex University",
      category: "MIDDLESSEX UNIVERSITY",
      link: "/main/services/studyabroad",
    },
    {
      id: 9,
      src: "https://i.ibb.co/FLP3m5HQ/image-9.png",
      alt: "Study Abroad",
      category: "STUDY ABROAD",
      link: "/main/services/studyabroad",
    },

    {
      id: 6,
      src: "https://i.ibb.co/ZRt4nRW4/IMAGE-7.png",
      alt: "BPP University",
      category: "BPP UNIVERSITY",
      link: "/main/services/studyabroad",
    },

    {
      id: 10,
      src: "https://i.ibb.co/MY9t1Yx/IMAGE-10.png",
      alt: "Study Abroad",
      category: "STUDY ABROAD",
      link: "/main/services/studyabroad",
    },
    {
      id: 11,
      src: "https://i.ibb.co/8nLhVGsz/IMAGE-11.png",
      alt: "Oxyloans",
      category: "OXYLOANS",
      link: "/main/service/oxyloans-service",
    },
    {
      id: 13,
      src: "https://i.ibb.co/99ymgm8d/Free-AI-and-Gen-ai-training-4090c6b7d5ff1eb374bd.png",
      alt: "Free ai and Gen ai",
      category: " FREE AI AND GEN AI",
      link: "/main/services/freeai-genai",
    },
    {
      id: 12,
      src: "https://i.ibb.co/DDdMwQJ3/IMAGE-12.png",
      alt: "OxyLoans",
      category: "OXYLOANS",
      link: "/main/service/oxyloans-service",
    },

    {
      id: 14,
      src: "https://i.ibb.co/mrNd7Wkk/image-20.png",
      alt: "Free Rudraksha",
      category: "FREE RUDRAKSHA",
      link: "/main/services/freerudraksha",
    },

    {
      id: 21,
      src: "https://i.ibb.co/jP01W0Z3/image-19.png",
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
    <div className="w-full bg-gradient-to-br from-white via-white to-white p-4">
      <div className="w-full max-w-full px-2 sm:px-3 py-3">
        {/* Fixed 7 Images Per Row Grid - Compact Layout */}
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

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Sign In Required
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {modalContent}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={handleLoginClick}
                >
                  Sign In
                </button>
                <button
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveGallery;