import React, { useState, useEffect } from "react";
import {
  Coins,
  Bot,
  Settings,
  Menu,
  X,
  ChevronRight,
  Gem,
  Cpu,
  Package,
  Globe,
  Scale,
  Factory,
  Briefcase,
  Users,
  BarChart2,
  ShoppingBag,
  Search,
  Copy,
  Check,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../kart/Header3";
import Ricebags from "../kart/Mainrice";
// import FreeChatGPTmain from './FreechatGPTmain';
import axios from "axios";
import Content1 from "./Content";

// Import your images here
import RudrakshaImage from "../assets/img/freerudraksha.png";
import FG from "../assets/img/Free AI and Gen ai training.png";
import FR from "../assets/img/FREE RICE SAMPLES AND FREE RICE CONTAINER.png";
import StudyImage from "../assets/img/study abroad.png";
import Legalimage from "../assets/img/Legal knowledge hub.png";
import Rotary from "../assets/img/MY ROTARY.png";
import MMServices from "../assets/img/Machines manufacturing services.png";
import hiring from "../assets/img/Career guidance.png";
import FreeChatGPTmain from "./FreechatGPTmain";
import BMVCOINmain from "./BMVcoinmain";
import BASE_URL from "../Config";
// Import Holi welcome image
import HoliWelcomeImage from "../assets/img/holi.png";

interface DashboardItem {
  title: string;
  image: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  category?: string;
}

interface Campaign {
  imageUrls: Image[];
  campaignType: string;
  message: string | null;
  campaignTypeAddBy: string;
  campaignDescription: string;
  campaignStatus: boolean;
}

interface Image {
  imageId: string;
  imageUrl: string;
  status: boolean;
}

const DashboardMain: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("products");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [multichainId, setMultichainId] = useState<string>("");
  const [bmvCoin, setBmvCoin] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get<Campaign[]>(
          BASE_URL+"/marketing-service/campgin/getAllCampaignDetails"
        );
        setCampaigns(response.data);
      } catch (err) {
        console.error(err);
      } finally {
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    // Check if the user is on a mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check and event listener
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const pathTab = location.pathname.split("/").pop();

    if (pathTab) {
      setActiveTab(pathTab);
    }
  }, [location.pathname]);

  // Close welcome modal after 5 seconds
  useEffect(() => {
    if (showWelcomeModal) {
      const timer = setTimeout(() => {
        setShowWelcomeModal(false);
      }, 7000);
      
      return () => clearTimeout(timer);
    }
  }, [showWelcomeModal]);

  const services: DashboardItem[] = [
    {
      title: "Free Rudraksha",
      image: RudrakshaImage,
      description:
        "Receive a sacred Rudraksha bead, known for its spiritual and wellness benefits.",
      path: "/main/services/freerudraksha",
      icon: <Gem className="text-purple-600" size={24} />,
      category: "Spiritual",
    },
    {
      title: "Free AI & Gen AI Training",
      image: FG,
      description:
        "Enroll in free AI and Generative AI training sessions to enhance your technical skills.",
      path: "/main/services/freeai-genai",
      icon: <Cpu className="text-purple-600" size={24} />,
      category: "Education",
    },
    {
      title: "Free Rice Samples",
      image: FR,
      description:
        "Request free rice samples along with a high-quality steel container for storage.",
      path: "/main/services/freesample-steelcontainer",
      icon: <Package className="text-purple-600" size={24} />,
      category: "Food",
    },
    {
      title: "Study Abroad",
      image: StudyImage,
      description:
        "Explore opportunities to study abroad with expert guidance and support.",
      path: "/main/services/studyabroad",
      icon: <Globe className="text-purple-600" size={24} />,
      category: "Education",
    },
    {
      title: "Legal Knowledge Hub",
      image: Legalimage,
      description:
        "Access expert legal advice and educational resources to navigate legal matters.",
      path: "/main/services/legalservice",
      icon: <Scale className="text-purple-600" size={24} />,
      category: "Legal",
    },
    {
      title: "My Rotary",
      image: Rotary,
      description:
        "Join a network of leaders making a difference through Rotary initiatives and programs.",
      path: "/main/services/myrotary",
      icon: <Users className="text-purple-600" size={24} />,
      category: "Community",
    },
    {
      title: "Manufacturing Services",
      image: MMServices,
      description:
        "Explore advanced machinery and manufacturing services for industrial growth.",
      path: "/main/services/machines-manufacturing",
      icon: <Factory className="text-purple-600" size={24} />,
      category: "Industrial",
    },
    {
      title: "We Are Hiring",
      image: hiring,
      description:
        "Explore exciting job opportunities and be a part of our growing team.",
      path: "/main/services/we-are-hiring",
      icon: <Briefcase className="text-purple-600" size={24} />,
      category: "Careers",
    },
  ];

  const products: DashboardItem[] = [
    {
      title: "Digital Products",
      image: RudrakshaImage,
      description: "Browse our collection of digital products and resources.",
      path: "/buyRice",
      icon: <ShoppingBag className="text-purple-600" size={24} />,
      category: "Digital",
    },
  ];

  const freeGPTs: DashboardItem[] = [
    {
      title: "AI Assistant",
      image: RudrakshaImage,
      description: "Try our free AI-powered assistant for various tasks.",
      path: "/services/Freechatgpt",
      icon: <Bot className="text-purple-600" size={24} />,
      category: "AI",
    },
  ];

  const bmvCoinItems: DashboardItem[] = [
    {
      title: "BMV Coins",
      image: RudrakshaImage,
      description: "Manage and track your BMV coin balance and transactions.",
      path: "/coins/dashboard",
      icon: <Coins className="text-purple-600" size={24} />,
      category: "Finance",
    },
  ];

  const filteredItems = (items: DashboardItem[]) => {
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category &&
          item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const handleCampaignClick = (campaignType: string) => {
    console.log(`/services/campaign/${campaignType}`);
    navigate(`/main/services/campaign/${campaignType}`);
  };

  const renderDashboardContent = () => {
    if (activeTab === "products") {
      return <Ricebags />;
    } else if (activeTab === "freegpts") {
      return <FreeChatGPTmain />;
    } else if (activeTab === "bmvcoin") {
      return <BMVCOINmain />;
    } else if (activeTab === "services") {
      return (
        <>
          <div className="relative">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems(services).map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg 
                  transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.category && (
                    <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-white/90 rounded-full">
                      {item.category}
                    </span>
                  )}
                </div>
                <div className="p-4">
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
              .filter((campaign) => campaign.campaignStatus !== false)
              .map((campaign, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg
                  transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleCampaignClick(campaign.campaignType)}
                >
                  <div className="relative h-48 overflow-hidden">
                    {campaign.imageUrls.map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={image.imageUrl}
                        alt={`Campaign Image ${imgIndex + 1}`}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    ))}
                    {campaign.campaignType && (
                      <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-white/90 rounded-full">
                        {campaign.campaignType}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {campaign.campaignType}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-gray-900 transition-colors">
                      {campaign.campaignDescription}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className={`relative bg-white rounded-2xl overflow-hidden shadow-xl transform transition-all 
            ${isMobile ? 'w-full max-w-sm' : 'w-full max-w-2xl'}`}>
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="absolute top-3 right-3 z-10 p-1 rounded-full bg-white/80 hover:bg-white"
            >
              <X size={24} className="text-gray-800" />
            </button>
            
            <div className="relative">
              <img 
                src={HoliWelcomeImage} 
                alt="Holi Welcome" 
                className="w-full object-cover"
                style={{ maxHeight: isMobile ? '50vh' : '70vh' }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-2 lg:p-4">
          <div className="space-y-6">
            {renderDashboardContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;