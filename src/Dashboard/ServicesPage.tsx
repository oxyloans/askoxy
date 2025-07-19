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
          "https://iili.io/FENcMAb.md.png",
        description:
          "Earn up to 1.75% Monthly ROI and 24% P.A. on your investments.",
        path: `${accessToken ? "/main" : ""}/service/oxyloans-service`,
        icon: <HandCoins className="text-purple-600" size={24} />,
        category: "Finance",
      },
      // {
      //   title: "Free Rudraksha",
      //   image:
      //     "https://iili.io/FEwOOdv.md.png",
      //   description:
      //     "Receive a sacred Rudraksha bead, known for its spiritual and wellness benefits.",
      //   path: `${accessToken ? "/main" : ""}/services/freerudraksha`,
      //   icon: <Gem className="text-purple-600" size={24} />,
      //   category: "Spiritual",
      // },
      {
        title: "Free AI & Gen AI Training",
        image:
          "https://iili.io/FGCrmbV.md.png",
        description:
          "Enroll in free AI and Generative AI training sessions to enhance your technical skills.",
        path: `${accessToken ? "/main" : ""}/services/freeai-genai`,
        icon: <Cpu className="text-purple-600" size={24} />,
        category: "Jobs",
      },
      {
        title: "Study Abroad",
        image:
          "https://iili.io/FGn6wdu.md.png",
        description:
          "Explore opportunities to study abroad with expert guidance and support.",
        path: "/studyabroad",
        icon: <Globe className="text-purple-600" size={24} />,
        category: "Education",
      },
      {
        title: "Legal Knowledge Hub",
        image:
          "https://iili.io/FGomRzF.md.png",
        description:
          "Access expert legal advice and educational resources to navigate legal matters.",
        path: `${accessToken ? "/main" : ""}/services/legalservice`,
        icon: <Scale className="text-purple-600" size={24} />,
        category: "Legal",
      },
      {
        title: "My Rotary",
        image: "https://iili.io/FGxS97j.md.png",
        description:
          "Join a network of leaders making a difference through Rotary initiatives and programs.",
        path: `${accessToken ? "/main" : ""}/services/myrotary`,
        icon: <Users className="text-purple-600" size={24} />,
        category: "Community",
      },
      {
        title: "Manufacturing Services",
        image:
          "https://iili.io/FGxUkKX.md.png",
        description:
          "Explore advanced machinery and manufacturing services for industrial growth.",
        path: `${accessToken ? "/main" : ""}/services/machines-manufacturing`,
        icon: <Factory className="text-purple-600" size={24} />,
        category: "Industrial",
      },
      {
        title: "We Are Hiring",
        image:
          "https://iili.io/FGxPrnR.md.png",
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
        <div className="p-2 lg:p-2">

          {/* Search Bar */}
          <div className="relative mb-2">
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
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
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
      className="group cursor-pointer flex flex-col items-center text-center"
    >
      <div className="mb-2">
        <img
          src={item.image}
          alt={item.title}
          className="w-80 h-auto object-contain transition-all duration-300 border-2 border-gray-200 group-hover:border-purple-300 rounded-lg"
        />
      </div>
      <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
        {item.title}
      </h3>
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
        className="group cursor-pointer flex flex-col items-center text-center"
        onClick={() => handleCampaignClick(campaign)}
      >
        <div className="mb-2">
          {campaign.imageUrls && campaign.imageUrls.length > 0 && (
            <img
              src={campaign.imageUrls[0].imageUrl}
              alt={`${campaign.campaignType}`}
              className="w-80 h-auto object-contain transition-all duration-300 border-2 border-gray-200 group-hover:border-purple-300 rounded-lg"
            />
          )}
        </div>
                 <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
          {campaign.campaignType}
        </h3>
      </div>
    ))}
</div>

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
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
