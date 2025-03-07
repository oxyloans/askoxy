import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HM1 from "../assets/img/ORDER RICE ONLINE.png";
import HM2 from "../assets/img/Groceries.png";
import HM3 from "../assets/img/Tickets.png";
import HM4 from "../assets/img/Transportation.png";
import HM5 from "../assets/img/Education.png";
import HM6 from "../assets/img/Food & Beverage.png";
import HM7 from "../assets/img/games.png";
import HM8 from "../assets/img/legal services.png";
import HM9 from "../assets/img/Pets.png";
import HM10 from "../assets/img/event-management-strategy (1).png";
import HM11 from "../assets/img/Influencers gpt (1).png";
import HM12 from "../assets/img/Transportation.png";
import HM13 from "../assets/img/financial advisory (1).png";
import HM14 from "../assets/img/loan services.png";
import HM15 from "../assets/img/Health & Wellness.png";
import HM16 from "../assets/img/X5.png";
import HM17 from "../assets/img/Advertising service (2).png";
import HM18 from "../assets/img/Marketing services (1).png";
import HM19 from "../assets/img/X8.png";
import HM20 from "../assets/img/creative services.png";
import HM21 from "../assets/img/freelancer and consulting service.png";
import HM22 from "../assets/img/X11.png";
import HM23 from "../assets/img/freelancer and consulting service.png";
import HM24 from "../assets/img/ca services.png";
import HM25 from "../assets/img/whole sale service (1).png";
import HM26 from "../assets/img/Education.png";
import HM27 from "../assets/img/Beauty (1).png";
import HM28 from "../assets/img/Professional Gpt service (1).png";
import HM29 from "../assets/img/Advertising service (2).png";
import HM30 from "../assets/img/Marketing services (1).png";
import HM31 from "../assets/img/Management service gpt (1).png";
import HM32 from "../assets/img/Home Services.png";
import HM33 from "../assets/img/Automotive.png";
import HM34 from "../assets/img/realestate gpt (1).png";
import HM35 from "../assets/img/Technical service (1).png";
import HM36 from "../assets/img/Street wear gpt.png";
import HM37 from "../assets/img/travell planner ai insurai.png";
// import HM38 from "../assets/img/Influencers gpt (1).png";
import HM39 from "../assets/img/Influencers gpt (1).png";
import HM40 from "../assets/img/Shopping.png";
import "./ServicesUi.css";

const HorizontalScrollGallery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [lastSubmittedQuery, setLastSubmittedQuery] = useState<string>("");

  const [modalContent, setModalContent] = useState(
    "You are being transferred to the powerful ChatGPT. Please login to continue your experience."
  );
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0); // Track the current placeholder

  const placeholderTexts = [
    'Search "Ask Questions"',
    'Search "Ask Mentorship"',
    'Search "Ask for Funds"',
    'Search "Ask End to End Solution"',
  ];

  const navigate = useNavigate();
const images = [
  {
    id: 1,
    src: HM1,
    alt: "Order Rice Online",
    category: "Order Rice Online",
    link: "/erice",
  },
  {
    id: 2,
    src: HM2,
    alt: "Groceries",
    category: "Groceries",
    link: "https://chatgpt.com/g/g-oca8vFV4R-grocery-gpt",
  },
  {
    id: 3,
    src: HM3,
    alt: "Tickets",
    category: "Tickets",
    link: "https://chatgpt.com/g/g-zWr0ULYQ3-legaladviseai-gpt",
  },
  {
    id: 4,
    src: HM4,
    alt: "Transportation",
    category: "Transportation",
    link: "https://chatgpt.com/g/g-0HtZUgSav-transportai-gpt",
  },
  {
    id: 5,
    src: HM5,
    alt: "Global Education",
    category: "Global Education",
    link: "https://chatgpt.com/g/g-HfWFTK9qV-study-abroad-buddy",
  },
  {
    id: 6,
    src: HM6,
    alt: "Image 6",
    category: "Food & Beverage",
    link: "https://www.askoxy.ai//dashboard",
  },
  {
    id: 7,
    src: HM7,
    alt: "Games",
    category: "Games",
    link: "https://chatgpt.com/g/g-WhoEAgQHk-gamemasterai-gpt",
  },
  {
    id: 8,
    src: HM8,
    alt: "Legal Services",
    category: "Legal Services",
    link: "https://chatgpt.com/g/g-zWr0ULYQ3-legaladviseai-gpt",
  },
  {
    id: 9,
    src: HM9,
    alt: "Pets",
    category: "Pets",
    link: "https://chatgpt.com/g/g-SkIhRjqxp-petcareai-gp",
  },
  {
    id: 10,
    src: HM23,
    alt: "Freelance Services",
    category: "Freelance Services",
    link: "https://chatgpt.com/g/g-UqWRcL56H-freelancerai-gpt",
  },
  {
    id: 11,
    src: HM11,
    alt: "Image 11",
    category: "Influencer Marketing Services",
    link: "https://www.askoxy.ai/dashboard",
  },
  {
    id: 12,
    src: HM12,
    alt: "Image 12",
    category: "Travel and Tour Services",
    link: "https://chatgpt.com/g/g-puZOdL9qn-travelaingpt",
  },
  {
    id: 13,
    src: HM13,
    alt: "Financial Advisory",
    category: "Financial Advisory",
    link: "https://chatgpt.com/g/g-1tjwJY59f-finadviseai-gpt",
  },
  {
    id: 14,
    src: HM14,
    alt: "Loan Servies",
    category: "Loan Servies",
    link: "https://chatgpt.com/g/g-8FZ5veZAp-loainsgpt",
  },
  {
    id: 15,
    src: HM15,
    alt: "Health and Wellness Services",
    category: "Health and Wellness Services",
    link: "https://www.askoxy.ai/dashboard",
  },

  {
    id: 16,
    src: HM17,
    alt: "Advertising Services",
    category: "Advertising Services",
    link: "https://chatgpt.com/g/g-1NeeKkOv7-advertising-services-gpt",
  },
  {
    id: 17,
    src: HM18,
    alt: "Marketing Services",
    category: "Marketing Services",
    link: "https://chatgpt.com/g/g-3HZ8yLPdZ-campaignai-gpt",
  },

  {
    id: 18,
    src: HM21,
    alt: "Consulting Services",
    category: "Consulting Services",
    link: "https://chatgpt.com/g/g-dKS0DGZaO-businessadviseai-gpt",
  },

  {
    id: 19,
    src: HM10,
    alt: "Event Management Services",
    category: "Event Management Services",
    link: "/dashboard",
  },
  {
    id: 20,
    src: HM24,
    alt: "CA Services",
    category: "CA Services",
    link: "https://chatgpt.com/g/g-hmAPGBqYY-caassistai-gpt",
  },
  {
    id: 21,
    src: HM25,
    alt: "Whole Sale Services",
    category: "Whole Sale Services",
    link: "https://chatgpt.com/g/g-Il6kqNW6F-wholesaleaingpt",
  },
  {
    id: 22,
    src: HM26,
    alt: "Education (Domestic and Global)",
    category: "Education (Domestic and Global)",
    link: "https://chatgpt.com/g/g-YowIvLCKJ-eduai-gpt",
  },

  {
    id: 23,
    src: HM27,
    alt: "Beauty GPT",
    category: "Beauty GPT",
    link: "https://chatgpt.com/g/g-atKXBmoVR-glamai-gpt",
  },
  {
    id: 24,
    src: HM28,
    alt: "Professional Services GPT",
    category: "Professional Services GPT",
    link: "https://chatgpt.com/g/g-zcSFmhyDq-proserveai-gpt",
  },
  {
    id: 25,
    src: HM20,
    alt: "Creative Services GPT",
    category: "Creative Services GPT",
    link: "https://chatgpt.com/g/g-ycPInHA9E-artassistai-gpt",
  },
  {
    id: 26,
    src: HM29,
    alt: "Advertising services GPT",
    category: "Advertising services GPT",
    link: "https://chatgpt.com/g/g-1NeeKkOv7-advertising-services-gpt",
  },
  {
    id: 27,
    src: HM30,
    alt: "Marketing Services GPT",
    category: "Marketing Services GPT",
    link: "https://chatgpt.com/g/g-3HZ8yLPdZ-campaignai-gpt",
  },
  {
    id: 28,
    src: HM31,
    alt: "Management Services GPT",
    category: "Management Services GPT",
    link: "https://chatgpt.com/g/g-gkFpZWjhf-eventmanageai-gpt",
  },

  {
    id: 29,
    src: HM32,
    alt: "Home Service GPT",
    category: "Home Service GPT",
    link: "https://chatgpt.com/g/g-gYP7A9DGj-servaihome-gpt",
  },
  {
    id: 30,
    src: HM33,
    alt: "Automotive Services GPT",
    category: "Automotive Services GPT",
    link: "https://chatgpt.com/g/g-PczKU2om8-realestateai-gpt",
  },
  {
    id: 31,
    src: HM34,
    alt: "Real Estate Services GPT",
    category: "Real Estate Services GPT",
    link: "https://chatgpt.com/g/g-PczKU2om8-realestateai-gpt",
  },
  {
    id: 31,
    src: HM35,
    alt: "Technical Services GPT",
    category: "Technical Services GPT",
    link: "https://chatgpt.com/g/g-Buk4VV0Ng-techservai-gpt",
  },

  {
    id: 32,
    src: HM36,
    alt: "Streetwear GPT",
    category: "Streetwear GPT",
    link: "https://chatgpt.com/g/g-rdKd46utz-streetweartrendai-gpt",
  },

  {
    id: 33,
    src: HM37,
    alt: "Travel Planner AI",
    category: "Travel Planner AI",
    link: "https://chatgpt.com/g/g-96zscm6Ar-globetrottergpt",
  },
  // {
  //   id: 34,
  //   src: HM38,
  //   alt: "InsurAI GPT",
  //   category: "InsurAI GPT",
  //   link: "https://chatgpt.com/g/g-JlPzVtjFK-insurai-gpt",
  // },
  {
    id: 35,
    src: HM39,
    alt: "Influencers GPT",
    category: "Influencers GPT",
    link: "https://chatgpt.com/g/g-ttxew4llb-influencehub-gpt",
  },
  {
    id: 36,
    src: HM40,
    alt: "Shopping GPT",
    category: "Shopping GPT",
    link: "https://chatgpt.com/g/g-kCDP2g5yE-shopsmartai-gpt",
  },
];

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
  // Change placeholder text every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex(
        (prevIndex) => (prevIndex + 1) % placeholderTexts.length
      );
    }, 4000); // Change every 4 seconds

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);
  const handleLoginClick = () => {
    closeModal();
    navigate("/whatsapplogin");
  };
  const userId = localStorage.getItem("userId");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const handleSearch = () => {
    const trimmedQuery = query.trim();

    // Validation: Check if search query is empty
    if (!trimmedQuery) {
        alert("Please enter a search query.");  // You can replace this with a toast or some other UI message
        return;
    }


  

    // Proceed with navigation if validations pass
    window.location.href = userId
        ? `/main/dashboard/freegpts?query=${encodeURIComponent(trimmedQuery)}`
        : `/freechatgptnormal?query=${encodeURIComponent(trimmedQuery)}`;
};


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex(
        (prev) => (prev + 1) % placeholderTexts.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Debounced search function
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2) {
        fetchSuggestions(query);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchSuggestions = (searchTerm: string) => {
    // Replace with API call if needed
    const sampleData = ["Product A", "Service B", "Category C"];
    setSuggestions(
      sampleData.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };
  const imageRows = [
    images.slice(0, 12), // First row (ID 1-12)
    images.slice(12, 24), // Second row (ID 13-24)
    images.slice(24, 36), // Third row (ID 25-36)
  ];

 return (
   <div className="relative bg-gradient-to-br from-white via-white to-white min-h-screen overflow-hidden">
     {/* Search Bar */}
     <motion.div
       className="search-container flex flex-col items-center justify-center py-16 px-4"
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       transition={{ duration: 1 }}
     >
       <motion.h1 className="logo-heading font-extrabold text-4xl md:text-5xl mb-8 text-center">
         <span className="text-blue-900">ASK</span>
         <span className="text-blue-900">OXY</span>
         <span className="text-yellow-600">.AI</span>
         <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mt-2 mx-auto rounded-full" />
       </motion.h1>

       <motion.div className="relative w-full max-w-lg mx-auto">
         <div className="group flex flex-row justify-center bg-white/90 backdrop-blur-2xl rounded-3xl border-2 border-gray-200 shadow-lg focus-within:z-10 focus-within:shadow-md p-2">
           <input
             type="text"
             className="w-full bg-transparent outline-none px-4 py-2 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 rounded-3xl text-sm sm:text-base"
             placeholder={placeholderTexts[currentPlaceholderIndex]}
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
           />
           <motion.button
             whileHover={{ scale: 1.1 }}
             whileTap={{ scale: 0.95 }}
             className="text-blue-600 p-2"
             onClick={handleSearch}
           >
             <FaSearch className="h-4 w-4 sm:h-5 sm:w-5" />
           </motion.button>
         </div>

         {/* Dropdown Suggestions */}
         <AnimatePresence>
           {suggestions.length > 0 && (
             <motion.ul
               className="absolute w-full bg-white shadow-lg rounded-md mt-2 max-h-48 overflow-y-auto z-50"
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
             >
               {suggestions.map((item, index) => (
                 <motion.li
                   key={index}
                   className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700"
                   onClick={() => {
                     setQuery(item);
                     setSuggestions([]);
                   }}
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: index * 0.05 }}
                 >
                   {item}
                 </motion.li>
               ))}
             </motion.ul>
           )}
         </AnimatePresence>
       </motion.div>
     </motion.div>

     {/* Scrolling Images Section */}
     <motion.div className="relative py-12" initial="hidden" animate="visible">
       <div className="flex flex-col gap-8">
         {imageRows.map((rowImages, rowIndex) => (
           <motion.div
             key={rowIndex}
             className="relative overflow-hidden"
             onMouseEnter={(e) =>
               e.currentTarget
                 .querySelector(".scroll-animation")
                 ?.classList.add("paused")
             }
             onMouseLeave={(e) =>
               e.currentTarget
                 .querySelector(".scroll-animation")
                 ?.classList.remove("paused")
             }
           >
             <div
               className={`flex space-x-4 w-max animate-infinite-scroll scroll-animation`}
               style={{
                 animationDuration: `${rowIndex % 2 === 0 ? "250s" : "280s"}`,
                 animationDirection: `${
                   rowIndex % 2 === 0 ? "normal" : "reverse"
                 }`,
               }}
             >
               {rowImages.concat(rowImages).map((image, idx) => (
                 <motion.div
                   key={`${image.id}-${idx}`}
                   className="relative cursor-pointer transition-transform"
                   whileHover={{ scale: 1.05 }}
                   onClick={() => handleImageClick(image)}
                 >
                   <img
                     src={image.src}
                     alt={image.alt}
                     className="w-44 h-44 rounded-lg"
                   />
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 rounded-xl">
                     <span className="text-white px-3 py-1 rounded-lg text-sm font-semibold text-center break-words max-w-full">
                       {image.category}
                     </span>
                   </div>
                 </motion.div>
               ))}
             </div>
           </motion.div>
         ))}
       </div>
     </motion.div>

     {/* Modal */}
     <AnimatePresence>
       {showModal && (
         <motion.div
           className="fixed inset-0 flex justify-center items-center bg-black/60 z-50"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
         >
           <motion.div
             className="bg-white p-6 rounded-xl max-w-sm w-full shadow-2xl border border-gray-100/30 backdrop-blur-sm"
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.9, opacity: 0 }}
             transition={{ type: "spring", stiffness: 200, damping: 20 }}
           >
             <motion.p
               className="text-center text-lg text-gray-700 mb-6"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
             >
               {modalContent}
             </motion.p>
             <div className="flex justify-center gap-4">
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
                 onClick={handleLoginClick}
               >
                 Sign In
               </motion.button>
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-all duration-300"
                 onClick={closeModal}
               >
                 Cancel
               </motion.button>
             </div>
           </motion.div>
         </motion.div>
       )}
     </AnimatePresence>
   </div>
 );
};

export default HorizontalScrollGallery;
