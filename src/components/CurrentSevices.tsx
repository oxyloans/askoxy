import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HM1 from "../assets/img/1 image.png";
import HM2 from "../assets/img/IMAGE 2.png";
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
      alt: "RavensBourne univerity",
      category: "RAVENSBOURNE UNIVERSITY",
    
    },
    {
      id: 2,
      src: HM2,
      alt: "University of Roehampton",
      category: "UNIVERSITY OF ROEHAMPTON",
      
    },
    {
      id: 3,
      src: HM3,
      alt: "Middlesex University",
      category: "MIDDLESSEX UNIVERSITY",
     
    },
    {
      id: 4,
      src: HM4,
      alt: "The University of Law",
      category: "THE UNIVERSITY OF LAW",
   
    },
    {
      id: 5,
      src: HM5,
      alt: "Coventry University",
      category: "COVENTRY UNIVERSITY",
     
    },
    {
      id: 6,
      src: HM6,
      alt: "Edinburgh Napier University",
      category: "EDINBURGH NAPIER UNIVERSITY",
     
      
    },
    {
      id: 7,
      src: HM7,
      alt: "BPP University",
      category: "BPP UNIVERSITY",
    
    },
    {
      id: 8,
      src: HM8,
      alt: "Study Abroad",
      category: "STUDY ABROAD",
    
     
    },
    {
      id: 9,
      src: HM9,
      alt: "Study Abroad",
      category: "STUDY ABROAD",
     
    },
    {
      id: 10,
      src: HM10,
      alt: "Study Abroad",
      category: "STUDY ABROAD",
     
    },
    {
      id: 11,
      src: HM11,
      alt: "Oxyloans",
      category: "OXYLOANS",
      
    },
    {
      id: 12,
      src: HM12,
      alt: "OxyLoans",
      category: "OXYLOANS",
     },
    {
      id: 13,
      src: HM13,
      alt: "Kisan Rice",
      category: "KISAN RICE",
     
    },
    {
      id: 14,
      src: HM14,
      alt: "Gajaraj Evergreen",
      category: " GAJARAJ EVERGREEN",
    
    },
    {
      id: 15,
      src: HM15,
      alt: "Sri Lalitha",
      category: "SRI LALITHA",
    
    },
    {
      id: 16,
      src: HM16,
      alt: "Bawarchi brown rice",
      category: "BAWARCHI BROWN RICE",
      
    },
    {
      id: 17,
      src: HM17,
      alt: "Cow Brand",
      category: "COW BRAND",
      
    },
    {
      id: 18,
      src: HM18,
      alt: "Surya Teja's Joker Brand",
      category: "SURYA TEJA'S JOKER BRAND",
     
    },
    {
      id: 19,
      src: HM19,
      alt: "Urban Springs",
      category: "URBAN SPRINGS",
     
    },
    {
      id: 20,
      src: HM20,
      alt: "Free Rudraksha",
      category: "FREE RUDRAKSHA",
     
    },
    {
      id: 21,
      src: HM21,
      alt: "Free ai and Gen ai",
      category: " FREE AI AND GEN AI",
     
    },
  ];

  // Divide images into 3 rows (7 images each)
  const row1 = images.slice(0, 7);
  const row2 = images.slice(7, 14);
  const row3 = images.slice(14, 21);

  const handleImageClick = (image: any) => {
    setModalContent(
      `Welcome! I offer services including peer-to-peer lending with OxyLoans, study abroad assistance, and rice online ordering. Please log in to explore and access these services.`
    );
    setShowModal(true);
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
             We offer services like peer-to-peer lending with{" "}
             <strong>OxyLoans</strong>, <strong>Study Abroad</strong>{" "}
             consultation, and <strong>Rice Online Ordering</strong>. Please
             sign in to explore more!
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
