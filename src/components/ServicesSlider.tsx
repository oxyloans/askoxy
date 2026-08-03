import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Modal } from "antd";

import { fetchCampaigns, fetchAllGames, Campaign } from "./servicesapi";
import BASE_URL, {
  uploadurlwithId,
  askoxyImgUrl,
  resolveAskoxyUrl,
} from "../Config";

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
  const [showAllLeagueJourneys, setShowAllLeagueJourneys] = useState(false);
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

  const getTimestamp = (value: number | string | undefined) => {
    if (value == null || value === "") return 0;
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric < 10_000_000_000 ? numeric * 1000 : numeric;
    }
    const parsed = typeof value === "number" ? value : Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const formatPublishedDate = (value: number | string | undefined) => {
    const timestamp = getTimestamp(value);
    return timestamp
      ? new Date(timestamp).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";
  };

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
    const clean = firstImage.trim();
    if (/^https?:\/\//i.test(clean)) {
      return clean;
    }
    return `${uploadurlwithId}/${clean.replace(/^\//, "")}`;
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

  const blogCampaigns = campaigns
    .filter(
      (campaign) =>
        campaign.campaignStatus !== false &&
        campaign.campainInputType === "BLOG",
    )
    .sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));

  const nonBlogCampaigns = campaigns
    .filter(
      (campaign) =>
        campaign.campaignStatus !== false &&
        campaign.campainInputType !== "BLOG",
    )
    .sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));

  const leagueJourneyCampaigns = campaigns
    .filter(
      (campaign) =>
        campaign.campaignStatus !== false &&
        campaign.addServiceType === "LEAGUEJOURNEYS",
    )
    .sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));

  const displayedLeagueJourneys = showAllLeagueJourneys
    ? leagueJourneyCampaigns
    : leagueJourneyCampaigns.slice(0, 4);

  const displayedBlogs = showAllBlogs
    ? blogCampaigns
    : blogCampaigns.slice(0, 4);
  const displayedJobs = Array.isArray(jobs)
    ? showAllJobs
      ? [...jobs].sort(
          (a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt),
        )
      : [...jobs]
          .sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt))
          .slice(0, 5)
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
      <div className="relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="text-center sm:text-left flex-1">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#A855F7] leading-tight">
                Our <span className="text-[#A855F7]">Journeys</span>
              </h2>

              <div className="w-24 h-1.5 bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#A855F7] mt-2 mx-auto sm:mx-0 rounded-full"></div>
            </motion.div>
          </div>

          {leagueJourneyCampaigns.length > 3 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#A855F7] text-white font-medium px-6 py-2.5 rounded-full shadow-md hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 text-sm sm:text-base"
              onClick={() => setShowAllLeagueJourneys(!showAllLeagueJourneys)}
            >
              {showAllLeagueJourneys ? "Show Less" : "View All"}
              <span className="ml-2 inline-block text-sm">
                {showAllLeagueJourneys ? "↑" : "↓"}
              </span>
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
        ) : leagueJourneyCampaigns.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {displayedLeagueJourneys.map((campaign, index) => {
                const mediaUrl = getCampaignFirstImage(campaign);
                const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
                const title = getCampaignTitle(campaign);
                const publishedDate = formatPublishedDate(campaign.createdAt);

                return (
                  <motion.div
                    key={getCampaignId(campaign)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-[0_10px_30px_rgba(185,28,28,0.14)]"
                    onClick={() => handleCampaignClick(campaign)}
                  >
                    <div className="relative h-[220px] overflow-hidden rounded-t-xl">
                      {mediaUrl ? (
                        isVideo ? (
                          <video
                            src={mediaUrl}
                            className="w-full h-full object-contain bg-gray-100 transition-transform duration-300 group-hover:scale-105"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img
                            src={mediaUrl}
                            alt={title}
                            className="w-full h-full object-contain bg-gray-100 transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />

                          // <img
                          //   src={mediaUrl}
                          //   alt={title}
                          //   className="w-full h-full object-fill transition-transform duration-300 group-hover:scale-105"
                          //   loading="lazy"
                          // />
                        )
                      ) : (
                        <div className="flex h-full w-full items-center justify-center p-5 text-center text-2xl font-extrabold uppercase tracking-wider text-white">
                          {title
                            .split(/\s+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((word) => word[0])
                            .join("") || "J"}
                        </div>
                      )}

                      <div className="absolute top-2 left-2">
                        <span className="rounded-full bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                          Journey
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-grow flex-col p-4">
                      {publishedDate && (
                        <span className="mb-1.5 text-[11px] font-medium text-slate-400">
                          {publishedDate}
                        </span>
                      )}
                      <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#c2410c]">
                        {title}
                      </h3>
                      <p className="mb-4 line-clamp-3 flex-grow text-xs leading-relaxed text-gray-500">
                        {campaign.campaignDescription}
                      </p>
                      <button
                        type="button"
                        className="h-10 w-full rounded-lg bg-gradient-to-br from-[#4C1D95] via-[#7C3AED] to-[#A855F7] px-4 text-sm font-semibold text-white transition hover:from-[#4C1D95] hover:to-[#A855F7]"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleCampaignClick(campaign);
                        }}
                      >
                        View Journey
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {!showAllLeagueJourneys &&
              displayedLeagueJourneys.length <
                leagueJourneyCampaigns.length && (
                <div className="mt-8 text-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#A855F7] text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-purple-500/30 hover:from-[#3B0764] hover:via-[#6D28D9] hover:to-[#9333EA] text-sm"
                    onClick={() => setShowAllLeagueJourneys(true)}
                  >
                    View more journeys
                    <span className="ml-2">→</span>
                  </motion.button>
                </div>
              )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No journeys available at the moment.
            </p>
          </div>
        )}
      </div>
      <hr className="p-2 mt-12" />

      <div className="relative">
        {/* <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full " />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full" /> */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="relative z-10 text-center sm:text-left flex-1">
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
                className="group flex cursor-pointer flex-col overflow-hidden   p-4  transition-all duration-300 hover:-translate-y-1"
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
                {/* {"campaign" in service && service.campaign?.createdAt && (
                  <span className="mt-2 text-[11px] font-medium text-slate-400">
                    {formatPublishedDate(service.campaign.createdAt)}
                  </span>
                )} */}
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
  className="px-5 py-2 rounded-full bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#A855F7] text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-purple-500/30 hover:from-[#3B0764] hover:via-[#6D28D9] hover:to-[#9333EA] text-sm"
  onClick={() => setShowAllServices(true)}
>
  View all services
  <span className="ml-2">→</span>
</motion.button>
            </div>
          )}
      </div>

      <hr className="p-2 mt-12" />

      <div className="relative ">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="text-center sm:text-left flex-1">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">
                Our <span className="text-violet-700">Blogs</span>
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-violet-600 to-indigo-500 mt-2 mx-auto sm:mx-0 rounded-full"></div>
            </motion.div>
          </div>

          {blogCampaigns.length > 3 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative z-10 bg-gradient-to-r from-violet-700 to-indigo-700 text-white font-semibold px-6 py-2.5 rounded-full shadow-md shadow-indigo-900/15 hover:from-violet-800 hover:to-indigo-800 hover:shadow-lg hover:shadow-indigo-900/20 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-300 text-sm sm:text-base"
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
              className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {displayedBlogs.map((campaign, index) => {
                const mediaUrl = getCampaignFirstImage(campaign);
                const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
                const title = getCampaignTitle(campaign);
                const publishedDate = formatPublishedDate(campaign.createdAt);

                return (
                  <motion.div
                    key={getCampaignId(campaign)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-violet-300 hover:shadow-[0_16px_36px_rgba(79,70,229,0.14)]"
                    onClick={() => handleCampaignClick(campaign)}
                  >
                    <div className="relative h-[220px] overflow-hidden rounded-t-xl">
                      {mediaUrl ? (
                        isVideo ? (
                          <video
                            src={mediaUrl}
                            className="w-full h-full object-contain bg-gray-100 transition-transform duration-300 group-hover:scale-105"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          // <img
                          //   src={mediaUrl}
                          //   alt={title}
                          //   className="w-full h-full object-contain bg-gray-100 transition-transform duration-300 group-hover:scale-105"
                          //   loading="lazy"
                          // />
                          <img
                            src={mediaUrl}
                            alt={title}
                            className="w-full h-full object-fill transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        )
                      ) : (
                        <div className="flex h-full w-full items-center justify-center p-5 text-center text-2xl font-extrabold uppercase tracking-wider text-white">
                          {title
                            .split(/\s+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((word) => word[0])
                            .join("") || "B"}
                        </div>
                      )}

                      <div className="absolute top-2 left-2">
                        <span className="rounded-full bg-gradient-to-r from-violet-700 to-indigo-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                          Blog
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-grow flex-col p-4">
                      {publishedDate && (
                        <span className="mb-1.5 text-[11px] font-medium text-slate-400">
                          {publishedDate}
                        </span>
                      )}
                      <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-violet-700">
                        {title}
                      </h3>
                      <p className="mb-4 line-clamp-3 flex-grow text-xs leading-relaxed text-gray-500">
                        {campaign.campaignDescription}
                      </p>
                      <button
                        type="button"
                        className="h-10 w-full rounded-xl bg-gradient-to-r from-[#4C1D95] via-[#7C3AED] to-[#A855F7] px-4 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:from-[#3B0764] hover:via-[#6D28D9] hover:to-[#9333EA] hover:shadow-lg hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleCampaignClick(campaign);
                        }}
                      >
                        Read More
                      </button>
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
                  className="relative z-10 px-5 py-2 rounded-full bg-white text-violet-700 font-semibold hover:bg-violet-700 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md border border-violet-200 hover:border-violet-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
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

      <div className="relative">
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

          <motion.button
            type="button"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-[#3c1973] to-[#1e3a8a] text-white font-medium px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
            onClick={() => handleJobNavigate(null)}
          >
            View All Jobs
            <span className="ml-2 inline-block text-sm">→</span>
          </motion.button>
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
              const postedDate = formatPublishedDate(job.createdAt);

              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group m-2 flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  onClick={() => handleJobNavigate(job.id)}
                >
                  <div className="flex justify-center pb-4 pt-6">
                    <div className="flex h-20 w-32 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-2">
                      <img
                        src={companyLogo}
                        className="h-20 w-40 object-contain transition-transform duration-300"
                        alt={job.companyName || "Company Logo"}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://tse2.mm.bing.net/th/id/OIP.e0ttGuRF9TT2BAsn2KmuwgAAAA?r=0&w=165&h=83&rs=1&pid=ImgDetMain&o=7&rm=3";
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center px-4 pb-3">
                    <div
                      className={`${bgColor} flex items-center justify-center rounded-xl px-4 py-2`}
                    >
                      <span className="line-clamp-2 text-center text-base font-semibold text-gray-700">
                        {job.companyName || "Company"}
                      </span>
                    </div>
                  </div>

                  <div className="px-4 pb-1">
                    <h3 className="line-clamp-2 text-center text-lg font-bold text-gray-800">
                      {job.jobTitle || "Job Title"}
                    </h3>
                  </div>

                  <div className="px-2 pb-2">
                    <div className="rounded-lg bg-gray-50 px-3 py-2 text-center">
                      <div className="line-clamp-2 text-sm font-bold text-gray-700">
                        💼 {job.jobDesignation || "Not specified"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 px-4 pb-3 text-center">
                    <div className="truncate whitespace-nowrap text-sm text-gray-600">
                      📍 {job.jobLocations || "Not specified"}
                    </div>
                    <div className="truncate whitespace-nowrap text-sm text-gray-600">
                      ⏰ {job.experience || "Not specified"}
                    </div>
                    {postedDate && (
                      <div className="text-xs font-medium text-slate-400">
                        Posted {postedDate}
                      </div>
                    )}
                  </div>

                  <div className="mt-auto flex justify-center px-4 pb-5">
                    <div className="rounded-full bg-indigo-100 px-8 py-2.5 text-sm font-bold text-indigo-600 shadow-md">
                      View Job Details
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

      <hr className="p-2 mt-12" />

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
