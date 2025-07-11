import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { fetchCampaigns, Campaign } from "./servicesapi";
import BASE_URL from "../Config";

interface Job {
  companyLogo: string;
  jobDesignation: string;
  id: string;
  jobTitle: string;
  companyName: string;
  industry: string;
  userId: string;
  jobLocations: string;
  jobType: string;
  description: string;
  benefits: string;
  jobStatus: boolean;
  skills: string;
  salaryMin: number;
  salaryMax: number;
  qualification: number;
  applicationDeadLine: number;
  experience: string;
  createdAt: number;
  updatedAt: number;
}

const ServicesSlider: React.FC = () => {
  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const navigate = useNavigate();

  const [showAllJobs, setShowAllJobs] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  const accessToken = localStorage.getItem("accessToken");

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/marketing-service/campgin/getalljobsbyuserid`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );
      const jobsData = await response.json();
      const filteredJobs = jobsData.filter(
        (job: Job) => job.jobStatus === true
      );
      setJobs(filteredJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Updated services with their respective paths
  const services = [
    {
      image:
        "https://i.ibb.co/PzFdf43v/oxyloasntemp-1-2ec07c0cd7c7e055e4c3.png",
      title: "Invest & Earn",
      path: "/service/oxyloans-service",
    },
    {
      image: "https://i.ibb.co/7dFHq44H/study-abroad-b44df112b4ab2a4c2bc9.png",
      title: "Study Abroad",
      path: "/studyabroad",
    },
    {
      image:
        "https://i.ibb.co/ksdzrwLT/FREE-RICE-SAMPLES-AND-FREE-RICE-CONTAINER-3b40f8ed166a3fd17253.png",
      title: "Free Rice Samples & Steel Container",
      path: "/services/freesample-steelcontainer",
    },
    {
      image: "https://i.ibb.co/twztBkMv/freerudraksha-eeaaca3e8a028697e182.png",
      title: "Free Rudraksha",
      path: "/services/freerudraksha",
    },
    {
      image:
        "https://i.ibb.co/99ymgm8d/Free-AI-and-Gen-ai-training-4090c6b7d5ff1eb374bd.png",
      title: "Free AI & GEN AI Training",
      path: "/services/freeai-genai",
    },
    {
      image:
        "https://i.ibb.co/1fNpVjbB/Legal-knowledge-hub-9db183177e6a1533ba16.png",
      title: "Legal Knowledge Hub",
      path: "/services/legalservice",
    },
    {
      image: "https://i.ibb.co/SwfNXKhm/MY-ROTARY-2c24090250b109f80818.png",
      title: "My Rotary",
      path: "/services/myrotary",
    },
    {
      image:
        "https://i.ibb.co/8LmmPySx/Machines-manufacturing-services-f5f7abd54ec2b3373b0c.png",
      title: "Machines Manufacturing Services",
      path: "/services/machines-manufacturing",
    },
    {
      image:
        "https://i.ibb.co/cK4w00Rd/Career-guidance-fe6ea3668fa6a02f6294.png",
      title: "Career Guidance",
      path: "/services/we-are-hiring",
    },
  ];

  const displayedServices = showAllServices ? services : services.slice(0, 3);

  const blogCampaigns = campaigns.filter(
    (campaign) =>
      campaign.campaignStatus !== false && campaign.campainInputType === "BLOG"
  );

  const nonBlogCampaigns = campaigns.filter(
    (campaign) =>
      campaign.campaignStatus !== false && campaign.campainInputType !== "BLOG"
  );

  const displayedBlogs = showAllBlogs
    ? blogCampaigns
    : blogCampaigns.slice(0, 3);

  const displayedJobs = showAllJobs ? jobs : jobs.slice(0, 5);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const campaigns = await fetchCampaigns();
        const campaignsWithIds = campaigns.map((campaign) => ({
          ...campaign,
          id: campaign.campaignId,
        }));
        setCampaigns(campaignsWithIds);
      } catch (err) {
        console.error("Error loading campaigns:", err);
      }
    };

    const loadJobs = async () => {
      await fetchJobs();
    };

    loadCampaigns();
    loadJobs(); // Add this line
  }, []);

  const handleServiceClick = (path: string) => {
    navigate(path);
  };
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50);

  const handleCampaignClick = (campaign: Campaign) => {
    console.log(campaign);

    if (accessToken) {
      if (
        campaign.campainInputType === "SERVICE" ||
        campaign.campainInputType === "PRODUCT"
      ) {
        navigate(
          `/main/services/${campaign.campaignId.slice(-4)}/${slugify(
            campaign.campaignType
          )}`
        );
      } else {
        navigate(
          `/main/blog/${campaign.campaignId.slice(-4)}/${slugify(
            campaign.campaignType
          )}`
        );
      }
    } else {
      if (
        campaign.campainInputType === "SERVICE" ||
        campaign.campainInputType === "PRODUCT"
      ) {
        navigate(
          `/services/${campaign.campaignId.slice(-4)}/${slugify(
            campaign.campaignType
          )}`
        );
      } else {
        navigate(
          `/blog/${campaign.campaignId.slice(-4)}/${slugify(
            campaign.campaignType
          )}`
        );
      }
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

  const handleBlogNavigation = () => {
    if (!accessToken) {
      navigate("/myblogs");
    } else {
      navigate("/main/dashboard/myblogs");
    }
  };
  const handleJobNavigate = (id: string | null) => {
    if (!accessToken) {
      navigate("/jobdetails", { state: { id } });
    } else {
      navigate("/main/jobdetails", { state: { id } });
    }
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
        {/* SERVICES SECTION */}
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
            onClick={() => setShowAllServices(!showAllServices)}
          >
            {showAllServices ? "Show Less" : "View All Services"}
            <span className="ml-2 inline-block">
              {showAllServices ? "↑" : "↓"}
            </span>
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

        {/* Show More Button for Services */}
        {!showAllServices && displayedServices.length < services.length && (
          <div className="mt-12 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-full bg-white text-[#3c1973] font-medium hover:bg-gray-50 transition-colors duration-300 shadow-md hover:shadow-lg border border-gray-100"
              onClick={() => setShowAllServices(true)}
            >
              View all services
              <span className="ml-2">→</span>
            </motion.button>
          </div>
        )}

        {showAllServices && nonBlogCampaigns.length > 0 && (
          <div className="mt-24">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {nonBlogCampaigns.map((campaign) => (
                <motion.div
                  key={campaign.campaignId}
                  variants={itemVariants}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg
                    transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col"
                  onClick={() => handleCampaignClick(campaign)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleCampaignClick(campaign)
                  }
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-50">
                    {campaign.imageUrls &&
                      campaign.imageUrls.length > 0 &&
                      campaign.imageUrls
                        .filter((media) =>
                          /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(media.imageUrl)
                        )
                        .map((image, index) => (
                          <img
                            key={index}
                            src={image.imageUrl}
                            alt={`${campaign.campaignType}-${index}`}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        ))}

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

      <hr className="p-2 mt-16"></hr>
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-16">
          <div className="mb-8 sm:mb-0 text-center sm:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] leading-tight">
                Our <span className="text-yellow-500">Blogs</span>
              </h2>
              <div className="w-32 h-2 bg-gradient-to-r from-yellow-500 via-purple-600 to-blue-500 mt-3 mx-auto sm:mx-0 rounded-full"></div>
            </motion.div>
          </div>

          {blogCampaigns.length > 3 && (
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] text-white font-semibold px-8 py-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => handleBlogNavigation()}
            >
              {showAllBlogs ? "Show Less" : "View All Blogs"}
              <span className="ml-2 inline-block">
                {showAllBlogs ? "→" : "→"}
              </span>
            </motion.button>
          )}
        </div>

        {blogCampaigns.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {displayedBlogs.map((campaign) => {
                const mediaUrl = campaign.imageUrls?.[0]?.imageUrl || "";
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(mediaUrl);
                const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);

                return (
                  <motion.div
                    key={campaign.campaignId}
                    variants={itemVariants}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg
              transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col"
                    onClick={() => handleCampaignClick(campaign)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleCampaignClick(campaign)
                    }
                  >
                    <div className="relative aspect-video overflow-hidden bg-gray-50">
                      {isImage ? (
                        <img
                          src={mediaUrl}
                          alt={campaign.campaignType}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      ) : isVideo ? (
                        <video
                          src={mediaUrl}
                          className="w-full h-full object-contain"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                          No media available
                        </div>
                      )}

                      {campaign.campaignType && (
                        <div className="absolute top-0 left-0 w-full p-2 bg-gradient-to-b from-black/50 to-transparent">
                          <span className="px-3 py-1 text-xs font-medium bg-white text-gray-800 rounded-full shadow-sm">
                            Blog
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
                );
              })}
            </motion.div>

            {!showAllBlogs && displayedBlogs.length < blogCampaigns.length && (
              <div className="mt-12 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-full bg-white text-[#3c1973] font-medium hover:bg-gray-50 transition-colors duration-300 shadow-md hover:shadow-lg border border-gray-100"
                  onClick={() => handleBlogNavigation()}
                >
                  View all blogs
                  <span className="ml-2">→</span>
                </motion.button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No blogs available at the moment.
            </p>
          </div>
        )}
      </div>

      <hr className="p-2 mt-16"></hr>
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-16">
          <div className="mb-8 sm:mb-0 text-center sm:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] leading-tight">
                Our <span className="text-yellow-500">Jobs</span>
              </h2>
              <div className="w-32 h-2 bg-gradient-to-r from-yellow-500 via-purple-600 to-blue-500 mt-3 mx-auto sm:mx-0 rounded-full"></div>
            </motion.div>
          </div>

          {jobs.length > 3 && (
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] text-white font-semibold px-8 py-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                handleJobNavigate(null);
              }} // Navigate to jobs page instead of showing all
            >
              View All Jobs
              <span className="ml-2 inline-block">→</span>
            </motion.button>
          )}
        </div>

        {jobs.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {displayedJobs.map((job, index) => {
              const lightBackgroundColors = [
                "bg-slate-50",
                "bg-emerald-50",
                "bg-violet-50",
                "bg-rose-50",
                "bg-amber-50",
                "bg-cyan-50",
                "bg-orange-50",
                "bg-stone-50",
              ];

              const bgColor =
                lightBackgroundColors[index % lightBackgroundColors.length];

              return (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl 
transition-all duration-300 transform hover:-translate-y-1 cursor-pointer 
flex flex-col border border-gray-100 m-2"
                  onClick={() => handleJobNavigate(job.id)}
                >
                  <div className="pt-6 pb-4 flex justify-center">
                    <div className="w-32 h-20 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200 bg-white p-2">
                      <img
                        src={
                          job.companyLogo ||
                          "https://tse2.mm.bing.net/th/id/OIP.e0ttGuRF9TT2BAsn2KmuwgAAAA?r=0&w=165&h=83&rs=1&pid=ImgDetMain&o=7&rm=3"
                        }
                        className="w-40 h-20 object-contain transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src =
                            "https://tse2.mm.bing.net/th/id/OIP.e0ttGuRF9TT2BAsn2KmuwgAAAA?r=0&w=165&h=83&rs=1&pid=ImgDetMain&o=7&rm=3";
                        }}
                      />
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="flex justify-center px-4 pb-3">
                    <div
                      className={`${bgColor} py-2 px-4 rounded-xl flex justify-center items-center`}
                    >
                      <span className="text-base font-semibold text-gray-700 text-center">
                        {job.companyName}
                      </span>
                    </div>
                  </div>

                  <div className="px-4 pb-1">
                    <h3 className="text-lg font-bold text-gray-800 text-center line-clamp-2">
                      {job.jobTitle}
                    </h3>
                  </div>

                  <div className="px-2 pb-2">
                    <div className="text-sm font-bold text-gray-700 text-center bg-gray-50 py-2 px-3 rounded-lg">
                      💼 {job.jobDesignation}
                    </div>
                  </div>

                  <div className="px-4 pb-3 space-y-1 text-center">
                    <div className="text-sm text-gray-600 truncate whitespace-nowrap overflow-hidden">
                      📍 Loc: {job.jobLocations}
                    </div>
                    <div className="text-sm text-gray-600 truncate whitespace-nowrap overflow-hidden">
                      ⏰ Exp: {job.experience}
                    </div>
                  </div>

                  <div className="px-4 pb-5 mt-auto flex justify-center">
                    <div
                      className="bg-blue-100 text-blue-500 py-3 px-8 
    rounded-full font-semibold text-base transition-all duration-200"
                    >
                      View Job
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-5">
            <p className="text-gray-500 text-lg">
              No jobs available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSlider;
