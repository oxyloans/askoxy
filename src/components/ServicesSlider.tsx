import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Modal } from "antd";

import { fetchCampaigns, fetchAllGames, Campaign } from "./servicesapi";
import BASE_URL, { uploadurlwithId } from "../Config";

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
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [campaignsError, setCampaignsError] = useState("");
  const [jobsError, setJobsError] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [showAllFreelancers, setShowAllFreelancers] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [currentResumeUrl, setCurrentResumeUrl] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);

  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const getCampaignId = (campaign: Campaign) =>
    campaign.campaignId || campaign.id || "";

  const getCampaignTitle = (campaign: Campaign) =>
    campaign.campaignTitle || campaign.campaignType || "blog";

  const slugify = (text: string) =>
    (text || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30);

  const getCampaignFirstImage = (campaign: Campaign) => {
    const firstImage =
      typeof campaign.imageUrls?.[0] === "string"
        ? campaign.imageUrls?.[0]
        : campaign.imageUrls?.[0]?.imageUrl ||
          campaign.imageUrl ||
          campaign.images?.[0]?.imageUrl ||
          "";

    if (!firstImage) return "";
    return firstImage.startsWith("http")
      ? firstImage
      : `${uploadurlwithId}${firstImage}`;
  };

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      setJobsError("");
      const response = await fetch(
        `${BASE_URL}/marketing-service/campgin/getalljobsbyuserid`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status}`);
      }
      
      const jobsData = await response.json();
      if (Array.isArray(jobsData)) {
        setJobs(jobsData);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobsError("Failed to load jobs. Please try again later.");
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  const isGoodFreelancerRow = (f: Freelancer) => {
    if ((f.openForFreeLancing || "").toUpperCase() !== "YES") return false;

    const hasRate =
      Number(f.perHour) > 0 ||
      Number(f.perDay) > 0 ||
      Number(f.perWeek) > 0 ||
      Number(f.perMonth) > 0 ||
      Number(f.perYear) > 0;

    return hasRate;
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
          .sort((a, b) => (b.perHour || 0) - (a.perHour || 0));

        setFreelancers(cleaned);
      } else {
        setFreelancers([]);
      }
    } catch (error) {
      console.error("Error fetching freelancers:", error);
      setFreelancers([]);
    }
  };

  const services = [
    {
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
    {
      image: "https://iili.io/FGxPrnR.md.png",
      title: "Career Guidance",
      path: "/services/we-are-hiring",
    },
  ];

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
          .filter(
            (campaign) =>
              getCampaignTitle(campaign).trim() !==
              "AI AGENTS 2 EARN MONEY | ZERO INVESTMENT | LIFETIME EARNINGS",
          )
          .map((campaign) => ({
            image: getCampaignFirstImage(campaign),
            title: getCampaignTitle(campaign),
            path: "",
            campaign,
          })),
      ]
    : services.slice(0, 4);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setCampaignsLoading(true);
        setCampaignsError("");
        const [normalCampaigns, gameCampaigns] = await Promise.all([
          fetchCampaigns(),
          fetchAllGames(),
        ]);
        const merged = [...normalCampaigns, ...gameCampaigns];
        const uniqueMap = new Map<string, Campaign>();

        merged.forEach((campaign) => {
          const id = getCampaignId(campaign);
          if (!id) return;

          uniqueMap.set(id, {
            ...campaign,
            id,
            campaignType:
              campaign.campaignType || campaign.campaignTitle || "Blog",
            campaignTitle:
              campaign.campaignTitle || campaign.campaignType || "Blog",
          });
        });

        setCampaigns(Array.from(uniqueMap.values()));
      } catch (err) {
        console.error("Error loading campaigns:", err);
        setCampaignsError("Failed to load blogs. Please try again later.");
        setCampaigns([]);
      } finally {
        setCampaignsLoading(false);
      }
    };

    loadCampaigns();
    fetchJobs();
    fetchFreelancers();
  }, []);

  const handleCampaignClick = (campaign: Campaign) => {
    const campaignId = getCampaignId(campaign);
    const titleSlug = slugify(getCampaignTitle(campaign));

    if (!campaignId) return;

    if (accessToken) {
      if (
        campaign.campainInputType === "SERVICE" ||
        campaign.campainInputType === "PRODUCT"
      ) {
        navigate(`/main/services/${campaignId.slice(-4)}/${titleSlug}`);
      } else {
        navigate(`/main/blog/${campaignId.slice(-4)}/${titleSlug}`);
      }
    } else if (
      campaign.campainInputType === "SERVICE" ||
      campaign.campainInputType === "PRODUCT"
    ) {
      navigate(`/services/${campaignId.slice(-4)}/${titleSlug}`);
    } else {
      navigate(`/blog/${campaignId.slice(-4)}/${titleSlug}`);
    }
  };

  const handleServiceClick = (service: any) => {
    if (service?.campaign) {
      handleCampaignClick(service.campaign);
      return;
    }
    if (service?.external && service?.url) {
      window.open(service.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (service?.path) {
      navigate(service.path);
    }
  };

  const handleBlogNavigate = () => {
    if (!accessToken) {
      navigate("/myblogs");
    } else {
      navigate("/main/dashboard/myblogs");
    }
  };

  const handleJobNavigate = (id: string | null) => {
    const userId = localStorage.getItem("userId");
    const pathPrefix = userId ? "/main/viewjobdetails" : "/viewjobdetails";

    if (id) {
      navigate(`${pathPrefix}/${id}/ALL`);
    } else {
      navigate(`${pathPrefix}/default/ALL`);
    }
  };

  const getNameFromEmail = (email?: string) => {
    if (!email) return "--";
    const cleanEmail = email.replace("mailto:", "").trim();
    const namePart = cleanEmail.split("@")[0] || "";
    const noNumbers = namePart.replace(/[0-9]/g, "");
    const onlyLettersSpace = noNumbers.replace(/[^a-zA-Z]/g, " ");

    const formatted = onlyLettersSpace
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

    return formatted || "Freelancer";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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

  const displayedFreelancers = showAllFreelancers
    ? freelancers
    : freelancers.slice(0, 5);

  const fmtMoney = (n: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
      Number(n || 0),
    );

  const rateLabel = (n: number) => {
    const val = Number(n || 0);
    return val > 0 ? `₹${fmtMoney(val)}` : "Not Selected";
  };

  return (
    <section className="py-10 min-h-screen px-4 sm:px-6 lg:px-8 bg-white">
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="text-center sm:text-left flex-1">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] leading-tight">
                Our <span className="text-yellow-500">Services</span>
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-yellow-500 via-purple-600 to-blue-500 mt-2 mx-auto sm:mx-0 rounded-full"></div>
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] text-white font-medium px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
            onClick={() => setShowAllServices(!showAllServices)}
          >
            {showAllServices ? "Show Less" : "View All"}
            <span className="ml-2 inline-block text-sm">
              {showAllServices ? "↑" : "↓"}
            </span>
          </motion.button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="h-56 p-4"
              >
                <div className="animate-pulse">
                  <div className="w-full h-36 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {allServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group flex flex-col items-center p-4 transition-all duration-300 cursor-pointer"
                onClick={() => handleServiceClick(service)}
              >
                <div className="w-full h-36 flex items-center justify-center mb-3 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-contain transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-center text-sm sm:text-base font-medium text-gray-800 transition-colors duration-300 line-clamp-2">
                  {service.title}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!showAllServices &&
          allServices.length < services.length + nonBlogCampaigns.length && (
            <div className="mt-6 text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2 rounded-full bg-white text-[#3c1973] font-medium hover:bg-gray-50 transition-colors duration-300 shadow-sm hover:shadow-md border border-gray-200 text-sm"
                onClick={() => setShowAllServices(true)}
              >
                View all services
                <span className="ml-2">→</span>
              </motion.button>
            </div>
          )}
      </div>

      <hr className="p-2 mt-12" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="text-center sm:text-left flex-1">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] leading-tight">
                Our <span className="text-yellow-500">Blogs</span>
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-yellow-500 via-purple-600 to-blue-500 mt-2 mx-auto sm:mx-0 rounded-full"></div>
            </motion.div>
          </div>

          {blogCampaigns.length > 3 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] text-white font-medium px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
              onClick={handleBlogNavigate}
            >
              View All
              <span className="ml-2 inline-block text-sm">→</span>
            </motion.button>
          )}
        </div>

        {campaignsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="h-64"
              >
                <div className="animate-pulse p-4">
                  <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : campaignsError ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">{campaignsError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : blogCampaigns.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {displayedBlogs.map((campaign, index) => {
                const mediaUrl = getCampaignFirstImage(campaign);
                const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);

                return (
                  <motion.div
                    key={getCampaignId(campaign)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col"
                    onClick={() => handleCampaignClick(campaign)}
                  >
                    <div className="relative aspect-video overflow-hidden bg-gray-50">
                      {mediaUrl ? (
                        isVideo ? (
                          <video
                            src={mediaUrl}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img
                            src={mediaUrl}
                            alt={getCampaignTitle(campaign)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                          No media
                        </div>
                      )}

                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 text-xs font-medium bg-white/90 text-gray-800 rounded-full">
                          Blog
                        </span>
                      </div>
                    </div>

                    <div className="p-3 flex-grow flex flex-col">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-purple-600 transition-colors mb-2 line-clamp-2">
                        {getCampaignTitle(campaign)}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 group-hover:text-gray-900 transition-colors">
                        {campaign.campaignDescription}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {!showAllBlogs && displayedBlogs.length < blogCampaigns.length && (
              <div className="mt-8 text-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2 rounded-full bg-white text-[#3c1973] font-medium hover:bg-gray-50 transition-colors duration-300 shadow-sm hover:shadow-md border border-gray-200 text-sm"
                  onClick={handleBlogNavigate}
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

      <hr className="p-2 mt-12" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="text-center sm:text-left flex-1">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] leading-tight">
                Our <span className="text-yellow-500">Jobs</span>
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-yellow-500 via-purple-600 to-blue-500 mt-2 mx-auto sm:mx-0 rounded-full"></div>
            </motion.div>
          </div>

          {jobs.length > 3 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] text-white font-medium px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
              onClick={() => handleJobNavigate(null)}
            >
              View All
              <span className="ml-2 inline-block text-sm">→</span>
            </motion.button>
          )}
        </div>

        {jobsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="h-80"
              >
                <div className="animate-pulse p-4">
                  <div className="w-20 h-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-16 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-12 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : jobsError ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">{jobsError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : jobs.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {displayedJobs.map((job, index) => {
              const lightBackgroundColors = [
                "bg-slate-50",
                "bg-emerald-50",
                "bg-violet-50",
                "bg-rose-50",
                "bg-amber-50",
              ];
              const bgColor =
                lightBackgroundColors[index % lightBackgroundColors.length];
              const companyLogo = job.companyLogo
                ? `${uploadurlwithId}${job.companyLogo}`
                : "https://tse2.mm.bing.net/th/id/OIP.e0ttGuRF9TT2BAsn2KmuwgAAAA?r=0&w=165&h=83&rs=1&pid=ImgDetMain&o=7&rm=3";

              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col"
                  onClick={() => handleJobNavigate(job.id)}
                >
                  <div className="pt-4 pb-3 px-3 flex justify-center">
                    <div className="w-20 h-16 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 p-2 bg-white">
                      <img
                        src={companyLogo}
                        className="max-w-full max-h-full object-contain"
                        alt={job.companyName || "Company Logo"}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://tse2.mm.bing.net/th/id/OIP.e0ttGuRF9TT2BAsn2KmuwgAAAA?r=0&w=165&h=83&rs=1&pid=ImgDetMain&o=7&rm=3";
                        }}
                      />
                    </div>
                  </div>

                  <div className="px-3 pb-2">
                    <div
                      className={`${bgColor} min-h-[44px] w-full rounded-lg flex items-center justify-center px-2 py-2`}
                    >
                      <span className="block w-full text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight break-words line-clamp-2">
                        {job.companyName || "Company"}
                      </span>
                    </div>
                  </div>

                  <div className="px-3 pb-2 min-h-[56px] flex items-start justify-center">
                    <h3 className="w-full text-sm sm:text-base font-semibold text-gray-800 text-center leading-tight break-words line-clamp-2">
                      {job.jobTitle || "Job Title"}
                    </h3>
                  </div>

                  <div className="px-3 pb-2">
                    <div className="min-h-[40px] bg-gray-50 py-2 px-2 rounded-lg flex items-center justify-center">
                      <div className="w-full text-xs font-medium text-gray-700 text-center leading-tight break-words line-clamp-2">
                        💼 {job.jobDesignation || "Not specified"}
                      </div>
                    </div>
                  </div>

                  <div className="px-3 pb-3 space-y-1 text-center">
                    <div className="text-xs text-gray-600 leading-tight break-words line-clamp-1">
                      📍 {job.jobLocations || "Not specified"}
                    </div>
                    <div className="text-xs text-gray-600 leading-tight break-words line-clamp-1">
                      ⏰ {job.experience || "Not specified"}
                    </div>
                  </div>

                  <div className="px-3 pb-4 mt-auto flex justify-center">
                    <div className="bg-blue-100 text-blue-600 py-2 px-4 rounded-full font-medium text-xs whitespace-nowrap">
                      View Job
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-base">
              No jobs available at the moment.
            </p>
          </div>
        )}
      </div>

      {/* <hr className="p-2 mt-12" />

      <div className="relative z-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center mb-10">
          <div className="text-center sm:text-left">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] leading-tight">
                Our <span className="text-yellow-500">Freelancers</span>
              </h2>
              <div className="w-28 sm:w-32 h-2 bg-gradient-to-r from-yellow-500 via-purple-600 to-blue-500 mt-3 mx-auto sm:mx-0 rounded-full"></div>
            </motion.div>
          </div>

          {freelancers.length > 3 && (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.35)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] text-white font-semibold px-6 sm:px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setShowAllFreelancers(!showAllFreelancers)}
            >
              {showAllFreelancers ? "Show Less" : "View All Freelancers"}
              <span className="ml-2 inline-block">→</span>
            </motion.button>
          )}
        </div>

        {freelancers.length > 0 ? (
          <motion.div className="w-full px-0 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-5" variants={containerVariants} initial="hidden" animate="visible">
            {displayedFreelancers.map((f) => {
              const isNegotiable = String(f.amountNegotiable).toUpperCase() === "YES";
              const isOpenForFreelancer = String(f.openForFreeLancing).toUpperCase() === "YES";

              return (
                <motion.div
                  key={f.id}
                  variants={itemVariants}
                  className="group w-full min-w-0 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                >
                  <div className="pt-6 pb-4 flex justify-center">
                    <div className="w-28 sm:w-32 h-20 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200 bg-white p-2">
                      <div className="text-3xl">🧑‍💻</div>
                    </div>
                  </div>

                  <div className="px-4 pb-2 text-center">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{getNameFromEmail(f.email)}</h3>
                  </div>

                  <div className="px-4 pb-3 text-center">
                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${isOpenForFreelancer ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {isOpenForFreelancer ? "Open for freelance work" : "Not available for freelance work"}
                    </span>
                  </div>

                  <div className="px-4 pb-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50 rounded-lg p-2 text-center"><div className="text-xs text-gray-600">Hourly</div><div className="text-sm font-bold text-gray-900">{rateLabel(f.perHour)}</div></div>
                      <div className="bg-slate-50 rounded-lg p-2 text-center"><div className="text-xs text-gray-600">Daily</div><div className="text-sm font-bold text-gray-900">{rateLabel(f.perDay)}</div></div>
                      <div className="bg-slate-50 rounded-lg p-2 text-center"><div className="text-xs text-gray-600">Weekly</div><div className="text-sm font-bold text-gray-900">{rateLabel(f.perWeek)}</div></div>
                      <div className="bg-slate-50 rounded-lg p-2 text-center"><div className="text-xs text-gray-600">Monthly</div><div className="text-sm font-bold text-gray-900">{rateLabel(f.perMonth)}</div></div>
                      <div className="bg-slate-50 rounded-lg p-2 text-center col-span-2"><div className="text-xs text-gray-600">Yearly</div><div className="text-sm font-bold text-gray-900">{rateLabel(f.perYear)}</div></div>
                    </div>

                    <div className="text-center text-xs text-gray-600 mt-2">
                      Negotiable: <span className={`font-semibold ${isNegotiable ? "text-green-600" : "text-red-600"}`}>{isNegotiable ? "YES" : "NO"}</span>
                    </div>
                  </div>

                  <div className="px-4 pb-5 mt-auto flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (!f.resumeUrl) {
                          alert("Resume file is invalid or not available.");
                          return;
                        }
                        setCurrentResumeUrl(`https://docs.google.com/gview?url=${encodeURIComponent(`${uploadurlwithId}${f.resumeUrl}`)}&embedded=true`);
                        setShowResumeModal(true);
                        setResumeLoading(true);
                      }}
                      className="w-full sm:w-auto justify-center bg-blue-100 text-blue-700 hover:bg-blue-200 py-3 px-6 rounded-full font-semibold text-sm transition-all duration-200 inline-flex items-center gap-2"
                    >
                      View Resume
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No freelancers available at the moment.</p>
          </div>
        )}
      </div> */}

      <Modal
        title="Resume Viewer"
        open={showResumeModal}
        onCancel={() => {
          setShowResumeModal(false);
          setCurrentResumeUrl("");
          setResumeLoading(false);
        }}
        footer={null}
        width="70%"
        style={{ top: 20 }}
        bodyStyle={{ height: "80vh", padding: 0 }}
        maskClosable
        keyboard
      >
        {resumeLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
        <iframe
          src={currentResumeUrl}
          className="w-full h-full"
          title="Resume Viewer"
          onLoad={() => setResumeLoading(false)}
        />
      </Modal>
    </section>
  );
};

export default ServicesSlider;
