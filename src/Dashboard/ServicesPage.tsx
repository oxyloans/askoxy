import React, { useState, useEffect, useMemo } from "react";
import {
  Coins,
  Bot,
  Gem,
  Cpu,
  Package,
  HandCoins,
  Globe,
  Scale,
  Factory,
  Briefcase,
  Users,
  ShoppingBag,
  Search,
  GraduationCap,
  Award,
  FileText,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Header1 from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { message } from "antd";
import VideoImage from "../assets/img/Videothumb.png";
import { fetchCampaigns, Campaign } from "../components/servicesapi";

interface DashboardItem {
  title: string;
  image: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  category?: string;
}

const ServicesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

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
    loadCampaigns();
  }, []);

  const services: DashboardItem[] = useMemo(
    () => [
      {
        title: "OxyLoans - RBI Approved P2P NBFC",
        image:
          "https://i.ibb.co/PzFdf43v/oxyloasntemp-1-2ec07c0cd7c7e055e4c3.png",
        description:
          "Earn up to 1.75% Monthly ROI and 24% P.A. on your investments.",
        path: `${accessToken ? "/main" : ""}/service/oxyloans-service`,
        icon: <HandCoins className="text-purple-600" size={24} />,
        category: "Finance",
      },
      {
        title: "Free Rudraksha",
        image:
          "https://i.ibb.co/twztBkMv/freerudraksha-eeaaca3e8a028697e182.png",
        description:
          "Receive a sacred Rudraksha bead, known for its spiritual and wellness benefits.",
        path: `${accessToken ? "/main" : ""}/services/freerudraksha`,
        icon: <Gem className="text-purple-600" size={24} />,
        category: "Spiritual",
      },
      {
        title: "Free AI & Gen AI Training",
        image:
          "https://i.ibb.co/99ymgm8d/Free-AI-and-Gen-ai-training-4090c6b7d5ff1eb374bd.png",
        description:
          "Enroll in free AI and Generative AI training sessions to enhance your technical skills.",
        path: `${accessToken ? "/main" : ""}/services/freeai-genai`,
        icon: <Cpu className="text-purple-600" size={24} />,
        category: "Jobs",
      },
      {
        title: "Free Rice Samples",
        image:
          "https://i.ibb.co/ksdzrwLT/FREE-RICE-SAMPLES-AND-FREE-RICE-CONTAINER-3b40f8ed166a3fd17253.png",
        description:
          "Request free rice samples along with a high-quality steel container for storage.",
        path: `${
          accessToken ? "/main" : ""
        }/services/freesample-steelcontainer`,
        icon: <Package className="text-purple-600" size={24} />,
        category: "Food",
      },
      {
        title: "Study Abroad",
        image:
          "https://i.ibb.co/7dFHq44H/study-abroad-b44df112b4ab2a4c2bc9.png",
        description:
          "Explore opportunities to study abroad with expert guidance and support.",
        path: "/studyabroad",
        icon: <Globe className="text-purple-600" size={24} />,
        category: "Education",
      },
      {
        title: "Legal Knowledge Hub",
        image:
          "https://i.ibb.co/1fNpVjbB/Legal-knowledge-hub-9db183177e6a1533ba16.png",
        description:
          "Access expert legal advice and educational resources to navigate legal matters.",
        path: `${accessToken ? "/main" : ""}/services/legalservice`,
        icon: <Scale className="text-purple-600" size={24} />,
        category: "Legal",
      },
      {
        title: "My Rotary",
        image: "https://i.ibb.co/SwfNXKhm/MY-ROTARY-2c24090250b109f80818.png",
        description:
          "Join a network of leaders making a difference through Rotary initiatives and programs.",
        path: `${accessToken ? "/main" : ""}/services/myrotary`,
        icon: <Users className="text-purple-600" size={24} />,
        category: "Community",
      },
      {
        title: "Manufacturing Services",
        image:
          "https://i.ibb.co/8LmmPySx/Machines-manufacturing-services-f5f7abd54ec2b3373b0c.png",
        description:
          "Explore advanced machinery and manufacturing services for industrial growth.",
        path: `${accessToken ? "/main" : ""}/services/machines-manufacturing`,
        icon: <Factory className="text-purple-600" size={24} />,
        category: "Industrial",
      },
      {
        title: "We Are Hiring",
        image:
          "https://i.ibb.co/cK4w00Rd/Career-guidance-fe6ea3668fa6a02f6294.png",
        description:
          "Explore exciting job opportunities and be a part of our growing team.",
        path: `${accessToken ? "/main" : ""}/services/we-are-hiring`,
        icon: <Briefcase className="text-purple-600" size={24} />,
        category: "Careers",
      },
    ],
    [accessToken]
  );

  const filteredItems = (items: DashboardItem[]) => {
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category &&
          item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
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
    if (
      campaign.campainInputType === "SERVICE" ||
      campaign.campainInputType === "PRODUCT"
    ) {
      navigate(
        `/main/services/${campaign.campaignId.slice(-4)}/${slugify(
          campaign.campaignType
        )}`
      );
    }
  };

  const handleStudyAbroadClick = () => {
    window.open(
      "https://chatgpt.com/g/g-67bb1a92a0488191b4c44678cc6cd958-study-abroad-10-min-sample-offer-5-fee-cashback"
    );
  };

  const handleOfferLetterClick = () => {
    if (!userId) {
      navigate("/whatsappregister");
      sessionStorage.setItem(
        "redirectPath",
        "/main/dashboard/offer-letter-samples"
      );
      message.warning("Please login to submit your interest.");
      return;
    }
    navigate("/main/dashboard/offer-letter-samples");
  };

  return (
    <div className="min-h-screen">
      <div className="mb-4 p-2">{!userId ? <Header1 /> : null}</div>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-2 lg:p-4">
          {/* Study Abroad Section */}
          <div className="bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-gray-50 rounded-3xl overflow-hidden shadow-lg border border-gray-200">
              <div className="bg-gray-100 py-5 px-6 border-b border-gray-200">
                <div className="flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 mb-2 text-purple-600 mr-3" />
                  <h1 className="text-2xl font-bold text-purple-600">
                    Study Abroad - Admissions
                  </h1>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
                <div className="space-y-6 flex flex-col justify-center">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-4">
                      <Award className="w-6 h-6 text-purple-600 mr-3" />
                      <h2 className="text-xl font-semibold text-purple-600">
                        Fullfill Your Dreams
                      </h2>
                    </div>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-center">
                        <Award className="w-4 h-4 mr-3 text-purple-600" />
                        Upto 5% Cashback on University Fees
                      </li>
                      <li className="flex items-center">
                        <Award className="w-4 h-4 mr-3 text-purple-600" />
                        100% Scholarship for Selected Students
                      </li>
                      <li className="flex items-center">
                        <Award className="w-4 h-4 mr-3 text-purple-600" />
                        Get Offer Letter in 10 Minutes - Share preferences on
                        ASKOXY.AI & get a sample offer letter.
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-4">
                    <p>
                      <strong>Study Abroad:</strong> Get a 10-minute sample
                      offer letter and enjoy up to 5% fee cashback!
                    </p>
                    <p>
                      Welcome! ASKOXY.AI fuels your study abroad journey with
                      data-driven insights. Answer questions on country,
                      university, course, budget, UG/PG & academics to get
                      personalized recommendations, a ROI scorecard, a 10-min
                      sample offer letter & up to 5% fee cashback.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleOfferLetterClick}
                      className="w-full bg-purple-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-purple-700 transition-colors font-medium shadow-lg"
                    >
                      <FileText className="w-5 h-5" />
                      <span>View Offer Samples</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleStudyAbroadClick}
                      className="w-full bg-purple-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-purple-700 transition-colors font-medium shadow-lg"
                    >
                      <Globe className="w-5 h-5" />
                      <span>Study Abroad GPT</span>
                    </motion.button>
                  </div>
                </div>
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative">
                  {!isVideoPlaying ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center cursor-pointer"
                      style={{ backgroundImage: `url(${VideoImage})` }}
                      onClick={() => setIsVideoPlaying(true)}
                    >
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="w-8 h-8"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      src="https://youtube.com/embed/LLRFyQ5y3HY?autoplay=1&mute=1"
                      title="Scholarship Opportunity Video"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-4">
            {filteredItems(services).map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  if (item.path.startsWith("https")) {
                    window.open(item.path, "_blank");
                  } else {
                    navigate(item.path);
                  }
                }}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col border border-gray-200"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain bg-gray-50"
                  />
                  {item.category && (
                    <div className="absolute top-0 left-0 w-full p-2 bg-gradient-to-b from-black/50 to-transparent">
                      <span className="px-3 py-1 text-xs font-medium bg-white text-gray-800 rounded-full shadow-sm">
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-gray-900 transition-colors">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
            {campaigns
              .filter(
                (campaign) =>
                  campaign.campaignStatus !== false &&
                  campaign.campainInputType !== "BLOG"
              )
              .map((campaign) => (
                <div
                  key={campaign.campaignId}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col border border-gray-200"
                  onClick={() => handleCampaignClick(campaign)}
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-50">
                    {campaign.imageUrls && campaign.imageUrls.length > 0 && (
                      <img
                        src={campaign.imageUrls[0].imageUrl}
                        alt={`${campaign.campaignType}`}
                        className="w-full h-full object-contain"
                      />
                    )}
                    {campaign.campaignType && (
                      <div className="absolute top-0 left-0 w-full p-2 bg-gradient-to-b from-black/50 to-transparent">
                        <span className="px-3 py-1 text-xs font-medium bg-white text-gray-800 rounded-full shadow-sm">
                          {campaign.campaignType.slice(0, 10)}
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
                </div>
              ))}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
