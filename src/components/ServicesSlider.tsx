// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { ExternalLink } from "lucide-react";

// // Import logos
// import logo1 from "../assets/img/freerudraksha.png";
// import logo2 from "../assets/img/FREE RICE SAMPLES AND FREE RICE CONTAINER.png";
// import logo3 from "../assets/img/Free AI and Gen ai training.png";
// import logo4 from "../assets/img/Legal knowledge hub.png";
// import logo5 from '../assets/img/study abroad.png';
// import logo6 from '../assets/img/MY ROTARY.png';
// import logo7 from '../assets/img/Machines manufacturing services.png';
// import logo8 from '../assets/img/Career guidance.png';
// import logo9 from '../assets/img/Business growth.png';

// const ServicesSlider: React.FC = () => {
//   const [showAll, setShowAll] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedService, setSelectedService] = useState<{ image: string; title: string } | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const services = [
//     { image: logo1, title: "Free Rudraksha" },
//     { image: logo3, title: "Free AI & GEN AI Training" },
//     { image: logo4, title: "Legal Knowledge Hub" },
//     { image: logo2, title: "Free Rice Samples & Steel Container" },
//     { image: logo5, title: "Study Abroad" },
//     { image: logo6, title: "My Rotary" },
//     { image: logo7, title: "Machines Manufacturing Services" },
//     { image: logo8, title: "Career Guidance" },
//     { image: logo9, title: "Business Growth" },
//   ];

//   const navigate = useNavigate();
//   const displayedServices = showAll ? services : services.slice(0, 3);

//   useEffect(() => {
//     // Simulate loading of images
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 800);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleImageClick = (service: { image: string; title: string }) => {
//     setSelectedService(service);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setTimeout(() => setSelectedService(null), 300);
//   };

//   const handleLoginClick = () => {
//     closeModal();
//     navigate("/whatsapplogin");
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.5 }
//     }
//   };

//   return (
//     <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-purple-50 to-purple-100 min-h-[70vh] overflow-hidden relative">
//       {/* Decorative Elements */}
//       <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full opacity-20 transform translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
//       <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-200 rounded-full opacity-20 transform -translate-x-1/3 translate-y-1/3 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
//       {/* Decorative patterns */}
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzMjJiNDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0xMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
      
//       <div className="relative z-10">
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-16">
//           <div className="mb-8 sm:mb-0 text-center sm:text-left">
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.7 }}
//             >
//               <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] leading-tight">
//                 Our <span className="text-yellow-500">Services</span>
//               </h2>
//               <div className="w-32 h-2 bg-gradient-to-r from-yellow-500 via-purple-600 to-blue-500 mt-3 mx-auto sm:mx-0 rounded-full"></div>
//             </motion.div>
//           </div>
          
//           <motion.button
//             whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.4)" }}
//             whileTap={{ scale: 0.95 }}
//             className="bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] text-white font-semibold px-8 py-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl transition-all duration-300"
//             onClick={() => setShowAll(!showAll)}
//           >
//             {showAll ? "Show Less" : "View All Services"}
//             <span className="ml-2 inline-block">{showAll ? "↑" : "↓"}</span>
//           </motion.button>
//         </div>

//         {isLoading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="animate-pulse bg-white rounded-2xl shadow-md h-80 p-6">
//                 <div className="w-full h-56 bg-gray-200 rounded-xl mb-4"></div>
//                 <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <motion.div 
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//           >
//             {displayedServices.map((service, index) => (
//               <motion.div
//                 key={index}
//                 variants={itemVariants}
//                 className="group flex flex-col items-center p-6 rounded-2xl bg-white cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2"
//                 onClick={() => handleImageClick(service)}
//                 role="button"
//                 tabIndex={0}
//                 onKeyPress={(e) => e.key === "Enter" && handleImageClick(service)}
//               >
//                 {/* Clean image container with proper alignment */}
//                 <div className="w-full h-52 flex items-center justify-center mb-4">
//                   <div className="relative w-full h-full flex items-center justify-center">
//                     <img
//                       src={service.image}
//                       alt={service.title}
//                       className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
//                       loading="lazy"
//                     />
//                   </div>
//                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md">
//                       <ExternalLink size={14} className="text-gray-600" />
//                     </div>
//                   </div>
//                 </div>
                
//                 <h3 className="text-center text-lg font-semibold text-gray-800 group-hover:text-[#3c1973] transition-colors duration-300">
//                   {service.title}
//                 </h3>
//                 <div className="w-0 group-hover:w-3/4 h-0.5 bg-gradient-to-r from-yellow-400 to-blue-500 mt-2 transition-all duration-300 rounded-full"></div>
//               </motion.div>
//             ))}
//           </motion.div>
//         )}        
//         {/* Show More Button for Both Mobile & Desktop */}
//         {!showAll && displayedServices.length < services.length && (
//           <div className="mt-12 text-center">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="px-6 py-2 rounded-full bg-white text-[#3c1973] font-medium hover:bg-gray-50 transition-colors duration-300 shadow-md hover:shadow-lg border border-gray-100"
//               onClick={() => setShowAll(true)}
//             >
//               View all {services.length} services
//               <span className="ml-2">→</span>
//             </motion.button>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       <AnimatePresence>
//         {showModal && (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4 backdrop-blur-sm"
//             onClick={closeModal}
//           >
//             <motion.div 
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {selectedService && (
//                 <div className="flex flex-col items-center">
//                   {/* Clean image container for modal */}
//                   <div className="w-32 h-32 mb-6 flex items-center justify-center">
//                     <img 
//                       src={selectedService.image} 
//                       alt={selectedService.title} 
//                       className="max-w-full max-h-full object-contain"
//                     />
//                   </div>
//                   <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
//                     {selectedService.title}
//                   </h3>
//                   <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-blue-500 mb-4 rounded-full"></div>
//                 </div>
//               )}
//               <p className="text-center text-lg text-gray-600 mb-8">
//                 We are simply showcasing these services for you. Please refrain from registering or accessing them at this moment.
//               </p>
//               <div className="flex flex-col sm:flex-row justify-center gap-4">
//                 <motion.button
//                   whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.4)" }}
//                   whileTap={{ scale: 0.95 }}
//                   className="bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] text-white px-8 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 hover:shadow-lg transition-all duration-300"
//                   onClick={handleLoginClick}
//                 >
//                   Sign In
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="bg-gray-100 text-gray-700 px-8 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 hover:bg-gray-200 transition-colors duration-300 border border-gray-200"
//                   onClick={closeModal}
//                 >
//                   Close
//                 </motion.button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

      
//     </section>
//   );
// };

// export default ServicesSlider;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import axios from "axios";

// Import logos
import logo1 from "../assets/img/freerudraksha.png";
import logo3 from "../assets/img/Free AI and Gen ai training.png";
import logo4 from "../assets/img/Legal knowledge hub.png";
import logo2 from "../assets/img/FREE RICE SAMPLES AND FREE RICE CONTAINER.png";
import logo5 from "../assets/img/study abroad.png";
import logo6 from "../assets/img/MY ROTARY.png";
import logo7 from "../assets/img/Machines manufacturing services.png";
import logo8 from "../assets/img/Career guidance.png";
import logo9 from  "../assets/img/oxyloasntemp (1).png";
import BASE_URL from "../Config";

// Define Campaign interface
interface Campaign {
  campaignId: string;
  campaignType: string;
  campaignDescription: string;
  campaignStatus: boolean;
  imageUrls: { imageUrl: string }[];
  id?: string;
}

// Base URL for API

const ServicesSlider: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const navigate = useNavigate();

  // Check for access token
  const accessToken = localStorage.getItem("accessToken");

  // Updated services with their respective paths
  const services = [
    {
      image: logo9,
      title: "Invest & Earn",
      path: "/service/oxyloans-service",
    },
    {
      image: logo5,
      title: "Study Abroad",
      path: "/services/studyabroad",
    },
    {
      image: logo2,
      title: "Free Rice Samples & Steel Container",
      path: "/services/freesample-steelcontainer",
    },
    {
      image: logo1,
      title: "Free Rudraksha",
      path: "/services/freerudraksha",
    },
    {
      image: logo3,
      title: "Free AI & GEN AI Training",
      path: "/services/freeai-genai",
    },
    {
      image: logo4,
      title: "Legal Knowledge Hub",
      path: "/services/legalservice",
    },
    {
      image: logo6,
      title: "My Rotary",
      path: "/services/myrotary",
    },
    {
      image: logo7,
      title: "Machines Manufacturing Services",
      path: "/services/machines-manufacturing",
    },
    {
      image: logo8,
      title: "Career Guidance",
      path: "/services/we-are-hiring",
    }
  ];

  const displayedServices = showAll ? services : services.slice(0, 3);

  useEffect(() => {
    // Simulate loading of images
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Fetch campaigns data
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get<Campaign[]>(
          BASE_URL + "/marketing-service/campgin/getAllCampaignDetails"
        );

        const campaignsWithIds = response.data.map((campaign) => {
          const id = campaign.campaignId;
          return { ...campaign, id };
        });

        setCampaigns(campaignsWithIds);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCampaigns();
  }, []);

  const handleServiceClick = (path: string) => {
    navigate(path);
  };

  const handleCampaignClick = (campaignId: string) => {
    if (accessToken) {
      navigate(`/main/services/campaign/${campaignId.slice(-4)}`);
    } else {
      navigate(`/services/campaign/${campaignId.slice(-4)}`);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-purple-50 to-purple-100 min-h-[70vh] overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full opacity-20 transform translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
      <div
        className="absolute bottom-0 left-0 w-56 h-56 bg-purple-200 rounded-full opacity-20 transform -translate-x-1/3 translate-y-1/3 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Decorative patterns */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzMjJiNDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0xMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>

      <div className="relative z-10">
        {/* Static Services Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-16">
          <div className="mb-8 sm:mb-0 text-center sm:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] leading-tight">
                Our <span className="text-yellow-500">Services</span>
              </h2>
              <div className="w-32 h-2 bg-gradient-to-r from-yellow-500 via-purple-600 to-blue-500 mt-3 mx-auto sm:mx-0 rounded-full"></div>
            </motion.div>
          </div>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] text-white font-semibold px-8 py-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "View All Services"}
            <span className="ml-2 inline-block">{showAll ? "↑" : "↓"}</span>
          </motion.button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl shadow-md h-80 p-6"
              >
                <div className="w-full h-56 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {displayedServices.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group flex flex-col items-center p-6 rounded-2xl bg-white cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2"
                onClick={() => handleServiceClick(service.path)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleServiceClick(service.path)
                }
              >
                {/* Clean image container with proper alignment */}
                <div className="w-full h-52 flex items-center justify-center mb-4">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md">
                      <ExternalLink size={14} className="text-gray-600" />
                    </div>
                  </div>
                </div>

                <h3 className="text-center text-lg font-semibold text-gray-800 group-hover:text-[#3c1973] transition-colors duration-300">
                  {service.title}
                </h3>
                <div className="w-0 group-hover:w-3/4 h-0.5 bg-gradient-to-r from-yellow-400 to-blue-500 mt-2 transition-all duration-300 rounded-full"></div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Show More Button for Services (Only when not showing all) */}
        {!showAll && displayedServices.length < services.length && (
          <div className="mt-12 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-full bg-white text-[#3c1973] font-medium hover:bg-gray-50 transition-colors duration-300 shadow-md hover:shadow-lg border border-gray-100"
              onClick={() => setShowAll(true)}
            >
              View all services
              <span className="ml-2">→</span>
            </motion.button>
          </div>
        )}

        {/* Dynamic Campaigns Section - Only show when showAll is true */}
        {showAll && campaigns.length > 0 && (
          <div className="mt-24">
            {/* <div className="mb-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] leading-tight">
                  Special <span className="text-yellow-500">Campaigns</span>
                </h2>
                <div className="w-32 h-2 bg-gradient-to-r from-yellow-500 via-purple-600 to-blue-500 mt-3 mx-auto rounded-full"></div>
              </motion.div>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Explore our latest campaigns and special offerings designed just
                for you
              </p>
            </div> */}

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {campaigns
                .filter((campaign) => campaign.campaignStatus !== false)
                .map((campaign) => (
                  <motion.div
                    key={campaign.campaignId}
                    variants={itemVariants}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg
                      transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col"
                    onClick={() =>
                      handleCampaignClick(campaign.campaignId as string)
                    }
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      handleCampaignClick(campaign.campaignId as string)
                    }
                  >
                    <div className="relative aspect-video overflow-hidden bg-gray-50">
                      {campaign.imageUrls && campaign.imageUrls.length > 0 && (
                        <img
                          src={campaign.imageUrls[0].imageUrl}
                          alt={`${campaign.campaignType}`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      )}
                      {campaign.campaignType && (
                        <div className="absolute top-0 left-0 w-full p-2 bg-gradient-to-b from-black/50 to-transparent">
                          <span className="px-3 py-1 text-xs font-medium bg-white text-gray-800 rounded-full shadow-sm">
                            {campaign.campaignType.slice(0, 12)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                        {campaign.campaignType}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-gray-900 transition-colors">
                        {campaign.campaignDescription}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSlider;
