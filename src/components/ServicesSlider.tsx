import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { fetchCampaigns, Campaign } from "./servicesapi";
import BASE_URL from "../Config";
type Freelancer = {
  id: string;
  email: string;
  userId: string;
  perHour: number;
  perDay: number;
  perWeek: number;
  perMonth: number;
  perYear: number;
  openForFreeLancing: "YES" | "NO" | string;
  amountNegotiable: "YES" | "NO" | string;
  resumeUrl: string;
};
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
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [showAllFreelancers, setShowAllFreelancers] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/marketing-service/campgin/getalljobsbyuserid`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const jobsData = await response.json();
      if (Array.isArray(jobsData)) {
        setJobs(jobsData);
      } else {
        console.warn("Jobs API did not return an array:", jobsData);
        setJobs([]);
      }
    } catch (error) {
      setJobs([]);
      console.error("Error fetching jobs:", error);
    }
  };

  const isGoodFreelancerRow = (f: Freelancer) => {
    // ✅ must have userId
    if (!f?.userId) return false;

    // ✅ show only if they are open for freelancing
    if ((f.openForFreeLancing || "").toUpperCase() !== "YES") return false;

    // ✅ must have at least one valid rate
    const hasRate =
      Number(f.perHour) > 0 ||
      Number(f.perDay) > 0 ||
      Number(f.perWeek) > 0 ||
      Number(f.perMonth) > 0 ||
      Number(f.perYear) > 0;

    if (!hasRate) return false;

    return true;
  };
  const fetchFreelancers = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/ai-service/agent/getAllFreeLancers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
          },
        },
      );

      const freelancersData = await response.json();

      if (Array.isArray(freelancersData)) {
        // ✅ filter junk + keep only clean rows
        const cleaned: Freelancer[] = freelancersData
          .filter(Boolean)
          .filter((row: any) => typeof row === "object")
          .map((row: any) => ({
            id: String(row.id || ""),
            email: String(row.email || ""),
            userId: String(row.userId || ""),
            perHour: Number(row.perHour || 0),
            perDay: Number(row.perDay || 0),
            perWeek: Number(row.perWeek || 0),
            perMonth: Number(row.perMonth || 0),
            perYear: Number(row.perYear || 0),
            openForFreeLancing: String(row.openForFreeLancing || ""),
            amountNegotiable: String(row.amountNegotiable || ""),
            resumeUrl: String(row.resumeUrl || ""),
          }))
          .filter(isGoodFreelancerRow)
          // ✅ nice sorting: highest perHour first
          .sort((a, b) => (b.perHour || 0) - (a.perHour || 0));

        setFreelancers(cleaned);
      } else {
        console.warn(
          "Freelancers API did not return an array:",
          freelancersData,
        );
        setFreelancers([]);
      }
    } catch (error) {
      console.error("Error fetching freelancers:", error);
      setFreelancers([]);
    }
  };

  const services = [
    {
      // You can replace this image with your preferred AI Agents artwork later
      image: "https://i.ibb.co/fVM4VfTF/aiagent1.png",
      title: "AI AGENTS 2 EARN MONEY | ZERO INVESTMENT | LIFETIME EARNINGS",
      path: "/services/6e44/ai-agents-2-earn-money-zero-in",
    },
    {
      image: "https://iili.io/FENcMAb.md.png",
      title: "Invest & Earn up to 1.75% monthly — 24% p.a.",
      path: "/service/oxyloans-service",
    },
    {
      image: "https://i.ibb.co/ZzyBDnm9/oxybricks.png",
      title: "Fractional Ownership in Lands & Buildings",
      external: true,
      url: "https://oxybricks.world/",
    },
    {
      image: "https://i.ibb.co/8LhJDQTn/study-abroad1.png",
      title: "Study Abroad",
      path: "/studyabroad",
    },
    {
      image: "https://iili.io/FGCrmbV.md.png",
      title: "Free AI & GEN AI Training",
      path: "/services/freeai-genai",
    },

    {
      image: "https://iili.io/FGomRzF.md.png",
      title: "Legal Knowledge Hub",
      path: "/services/legalservice",
    },
    {
      image: "https://iili.io/FGxS97j.md.png",
      title: "My Rotary",
      path: "/services/myrotary",
    },
    // {
    //   image: "https://iili.io/FGxUkKX.md.png",
    //   title: "Machines Manufacturing Services",
    //   path: "/services/machines-manufacturing",
    // },
    {
      image: "https://iili.io/FGxPrnR.md.png",
      title: "Career Guidance",
      path: "/services/we-are-hiring",
    },
  ];

  const displayedServices = showAllServices ? services : services.slice(0, 4);

  const blogCampaigns = campaigns.filter(
    (campaign) =>
      campaign.campaignStatus !== false && campaign.campainInputType === "BLOG",
  );

  const nonBlogCampaigns = campaigns.filter(
    (campaign) =>
      campaign.campaignStatus !== false && campaign.campainInputType !== "BLOG",
  );

  const displayedBlogs = showAllBlogs
    ? blogCampaigns
    : blogCampaigns.slice(0, 4);

  const displayedJobs = Array.isArray(jobs)
    ? showAllJobs
      ? jobs
      : jobs.slice(0, 5)
    : [];

  const allServices = showAllServices
    ? [
        ...services,
        ...nonBlogCampaigns
          // ✅ Hide API version of AI Agents (because we already added it manually)
          .filter(
            (campaign) =>
              campaign.campaignType.trim() !==
              "AI AGENTS 2 EARN MONEY | ZERO INVESTMENT | LIFETIME EARNINGS",
          )
          .map((campaign) => ({
            image: campaign.imageUrls?.[0]?.imageUrl || "",
            title: campaign.campaignType,
            path: "", // Will be handled by click handler
            campaign: campaign,
          })),
      ]
    : services.slice(0, 4);

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

    const loadFreelancers = async () => {
      await fetchFreelancers();
    };

    loadCampaigns();
    loadJobs();
    loadFreelancers();
  }, []);

  const handleServiceClick = (service: any) => {
    // 1) Campaign click
    if (service?.campaign) {
      handleCampaignClick(service.campaign);
      return;
    }

    // 2) External link
    if (service?.external && service?.url) {
      window.open(service.url, "_blank", "noopener,noreferrer");
      return;
    }

    // 3) Internal route
    if (service?.path) {
      navigate(service.path);
      return;
    }

    console.warn("No valid navigation for service:", service);
  };

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30);

  const handleCampaignClick = (campaign: Campaign) => {
    console.log(campaign);

    if (accessToken) {
      if (
        campaign.campainInputType === "SERVICE" ||
        campaign.campainInputType === "PRODUCT"
      ) {
        navigate(
          `/main/services/${campaign.campaignId.slice(-4)}/${slugify(
            campaign.campaignType,
          )}`,
        );
      } else {
        navigate(
          `/main/blog/${campaign.campaignId.slice(-4)}/${slugify(
            campaign.campaignType,
          )}`,
        );
      }
    } else {
      if (
        campaign.campainInputType === "SERVICE" ||
        campaign.campainInputType === "PRODUCT"
      ) {
        navigate(
          `/services/${campaign.campaignId.slice(-4)}/${slugify(
            campaign.campaignType,
          )}`,
        );
      } else {
        navigate(
          `/blog/${campaign.campaignId.slice(-4)}/${slugify(
            campaign.campaignType,
          )}`,
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

  const handleBlogNavigate = () => {
    if (!accessToken) {
      navigate("/myblogs");
    } else {
      navigate("/main/dashboard/myblogs");
    }
  };

  const handleJobNavigate = (id: string | null) => {
    console.log("service slider" + id);

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
  const displayedFreelancers = showAllFreelancers
    ? freelancers
    : freelancers.slice(0, 5);

  return (
    <section className="py-10 bg-purple-50  min-h-screen  px-4 sm:px-6 lg:px-8 bg-white">
      <div className="relative z-10">
        {/* SERVICES SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <div className="mb-8 sm:mb-0 text-center sm:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] leading-tight">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl shadow-md h-64 p-4"
              >
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {allServices.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group flex flex-col items-center p-4 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                onClick={() => handleServiceClick(service)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleServiceClick(service);
                  }
                }}
              >
                <div className="w-full h-48 flex items-center justify-center mb-3">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-contain rounded-lg transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md">
                      <ExternalLink size={14} className="text-gray-600" />
                    </div> */}
                  </div>
                </div>
                <h3 className="text-center text-lg font-semibold text-gray-800 group-hover:text-[#3c1973] transition-colors duration-300">
                  {service.title}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!showAllServices &&
          allServices.length < services.length + nonBlogCampaigns.length && (
            <div className="mt-8 text-center">
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
      </div>

      <hr className="p-2 mt-12"></hr>
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <div className="mb-8 sm:mb-0 text-center sm:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] leading-tight">
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
              onClick={() => handleBlogNavigate()}
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
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
                    <div className="relative aspect-video overflow-hidden">
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
                  onClick={() => handleBlogNavigate()}
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

      <hr className="p-2 mt-12"></hr>
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <div className="mb-8 sm:mb-0 text-center sm:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] leading-tight">
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
              }}
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
                    <div className="w-32 h-20 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200 p-2">
                      <img
                        src={
                          job.companyLogo ||
                          "https://tse2.mm.bing.net/th/id/OIP.e0ttGuRF9TT2BAsn2KmuwgAAAA?r=0&w=165&h=83&rs=1&pid=ImgDetMain&o=7&rm=3"
                        }
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src =
                            "https://tse2.mm.bing.net/th/id/OIP.e0ttGuRF9TT2BAsn2KmuwgAAAA?r=0&w=165&h=83&rs=1&pid=ImgDetMain&o=7&rm=3";
                        }}
                      />
                    </div>
                  </div>

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
                    <div className="bg-blue-100 text-blue-500 py-3 px-8 rounded-full font-semibold text-base transition-all duration-200">
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

      <hr className="p-2 mt-12"></hr>

      <div className="relative z-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center mb-10">
          <div className="text-center sm:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] leading-tight">
                Our <span className="text-yellow-500">Freelancers</span>
              </h2>
              <div className="w-28 sm:w-32 h-2 bg-gradient-to-r from-yellow-500 via-purple-600 to-blue-500 mt-3 mx-auto sm:mx-0 rounded-full" />
            </motion.div>
          </div>

          {freelancers.length > 3 && (
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.35)",
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] text-white font-semibold px-6 sm:px-8 py-3.5 rounded-full
             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/freelancers")}
            >
              View All Freelancers
              <span className="ml-2 inline-block">→</span>
            </motion.button>
          )}
        </div>

        {freelancers.length > 0 ? (
          <motion.div
            className="
        w-full
        px-0
        grid grid-cols-1
        gap-4
        sm:grid-cols-2 sm:gap-5
        lg:grid-cols-3 lg:gap-6
        xl:grid-cols-5
      "
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {displayedFreelancers.map((f, index) => {
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
              const displayEmail = f.email?.trim()
                ? f.email
                : "Email not provided";

              const isNegotiable =
                String(f.amountNegotiable).toUpperCase() === "YES";

              return (
                <motion.div
                  key={f.id}
                  variants={itemVariants}
                  className="
              group
              w-full min-w-0
              bg-white rounded-2xl overflow-hidden
              border border-gray-100
              shadow-sm hover:shadow-2xl
              transition-all duration-300
              transform hover:-translate-y-1
              flex flex-col
            "
                >
                  {/* Top icon block */}
                  <div className="pt-6 pb-4 flex justify-center">
                    <div className="w-28 sm:w-32 h-20 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200 bg-white p-2">
                      <div className="text-3xl">🧑‍💻</div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex justify-center px-4 pb-3">
                    <div className={`${bgColor} py-2 px-4 rounded-xl w-full`}>
                      <span
                        className="
                    block text-sm font-semibold text-gray-700 text-center
                    break-words
                    line-clamp-2
                  "
                        title={displayEmail}
                      >
                        {displayEmail}
                      </span>
                    </div>
                  </div>

                  {/* Rates */}
                  <div className="px-4 pb-2 text-center space-y-1">
                    <div className="text-sm font-bold text-gray-700 bg-gray-50 py-2 px-3 rounded-lg">
                      ₹ {f.perHour}/Hr
                      {Number(f.perDay) > 0 ? ` • ₹ ${f.perDay}/Day` : ""}
                    </div>

                    <div className="text-xs text-gray-600">
                      {Number(f.perWeek) > 0
                        ? `Week: ₹${f.perWeek}${Number(f.perMonth) > 0 ? " • " : ""}`
                        : ""}
                      {Number(f.perMonth) > 0 ? `Month: ₹${f.perMonth}` : ""}
                    </div>

                    <div className="text-xs text-gray-600">
                      Negotiable:{" "}
                      <span
                        className={`font-semibold ${isNegotiable ? "text-green-600" : "text-red-600"}`}
                      >
                        {isNegotiable ? "YES" : "NO"}
                      </span>
                    </div>
                  </div>

                  {/* Resume Button */}
                  <div className="px-4 pb-5 mt-auto flex justify-center">
                    <a
                      href={f.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                  w-full
                  sm:w-auto
                  justify-center
                  bg-blue-100 text-blue-700 hover:bg-blue-200
                  py-3 px-6 rounded-full
                  font-semibold text-sm
                  transition-all duration-200
                  inline-flex items-center gap-2
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                "
                      onClick={(e) => {
                        if (!f.resumeUrl) {
                          e.preventDefault();
                          alert("Resume file is invalid or not available.");
                        }
                      }}
                    >
                      View Resume
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">
              No freelancers available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSlider;
