import React, { useState, useEffect, useMemo } from "react";
import {
  HandCoins,
  Globe,
  Scale,
  Users,
  Factory,
  Briefcase,
  Search,
  GraduationCap,
  Award,Building,
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

type CampaignWithId = Campaign & {
  id: string;
  addServiceType?: string | null; // may come as undefined/null
};

type TabKey = "SERVICES" | "WE_ARE_HIRING";

const ServicesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [campaigns, setCampaigns] = useState<CampaignWithId[]>([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("SERVICES");

  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const data = await fetchCampaigns();
        const campaignsWithIds: CampaignWithId[] = data.map((campaign: any) => ({
          ...campaign,
          id: campaign.campaignId,
          addServiceType: campaign?.addServiceType ?? null,
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
        image: "https://iili.io/FENcMAb.md.png",
        description:
          "Earn up to 1.75% Monthly ROI and 24% P.A. on your investments.",
        path: `${accessToken ? "/main" : ""}/service/oxyloans-service`,
        icon: <HandCoins className="text-purple-600" size={24} />,
        category: "Finance",
      },
      {
        title: "OXYBRICKS.WORLD - Fractional Ownership ", 
        image: "https://i.ibb.co/ZzyBDnm9/oxybricks.png", 
        description:
          "Fractional Ownership in Lands & Buildings", 
        path: `https://oxybricks.world/`,
        icon: <Building className="text-purple-600" size={24} />, 
        category: "RealEstate", 
      },
      {
        title: "Free AI & Gen AI Training",
        image: "https://iili.io/FGCrmbV.md.png",
        description:
          "Enroll in free AI and Generative AI training sessions to enhance your technical skills.",
        path: `${accessToken ? "/main" : ""}/services/freeai-genai`,
        icon: <GraduationCap className="text-purple-600" size={24} />,
        category: "Jobs",
      },
      {
        title: "Study Abroad",
        image: "https://i.ibb.co/8LhJDQTn/study-abroad1.png",
        description:
          "Explore opportunities to study abroad with expert guidance and support.",
        path: "/studyabroad",
        icon: <Globe className="text-purple-600" size={24} />,
        category: "Education",
      },
      {
        title: "Legal Knowledge Hub",
        image: "https://iili.io/FGomRzF.md.png",
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
      // {
      //   title: "Manufacturing Services",
      //   image: "https://iili.io/FGxUkKX.md.png",
      //   description:
      //     "Explore advanced machinery and manufacturing services for industrial growth.",
      //   path: `${accessToken ? "/main" : ""}/services/machines-manufacturing`,
      //   icon: <Factory className="text-purple-600" size={24} />,
      //   category: "Industrial",
      // },
      // Note: “We Are Hiring” static card is moved under the hiring tab via campaigns, so we keep static services clean.
    ],
    [accessToken]
  );

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30);

  const handleCampaignClick = (campaign: CampaignWithId) => {
    if (
      (campaign as any).campainInputType === "SERVICE" ||
      (campaign as any).campainInputType === "PRODUCT"
    ) {
      navigate(
        `/main/services/${campaign.campaignId.slice(-4)}/${slugify(
          (campaign as any).campaignType ?? "service"
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

  /** Split campaigns by addServiceType */
  const serviceCampaigns = useMemo(
    () =>
      campaigns.filter(
        (c) =>
          c.campaignStatus !== false &&
          (c as any).campainInputType !== "BLOG" &&
          (c.addServiceType === null ||
            c.addServiceType === undefined ||
            c.addServiceType === "" ||
            c.addServiceType === "SERVICES")
      ),
    [campaigns]
  );

  const hiringCampaigns = useMemo(
    () =>
      campaigns.filter(
        (c) =>
          c.campaignStatus !== false &&
          (c as any).campainInputType !== "BLOG" &&
          c.addServiceType === "WEAREHIRING"
      ),
    [campaigns]
  );

  /** Search helpers */
  const matchQuery = (text?: string) =>
    (text ?? "").toLowerCase().includes(searchQuery.toLowerCase());

  const filteredServiceCards = useMemo(
    () => services.filter((s) => matchQuery(s.title) || matchQuery(s.description) || matchQuery(s.category)),
    [services, searchQuery]
  );

  const filteredServiceCampaigns = useMemo(
    () =>
      serviceCampaigns.filter(
        (c: any) => matchQuery(c.campaignType) || matchQuery(c.description)
      ),
    [serviceCampaigns, searchQuery]
  );

  const filteredHiringCampaigns = useMemo(
    () =>
      hiringCampaigns.filter(
        (c: any) => matchQuery(c.campaignType) || matchQuery(c.description)
      ),
    [hiringCampaigns, searchQuery]
  );

  const TabButton: React.FC<{
    k: TabKey;
    label: string;
    count?: number;
  }> = ({ k, label, count }) => (
    <button
      onClick={() => setActiveTab(k)}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition
        ${activeTab === k ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
    >
      {label}
      {typeof count === "number" && (
        <span className={`ml-2 inline-flex items-center justify-center text-xs px-2 py-0.5 rounded-full
          ${activeTab === k ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"}`}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen">
      <div className="mb-4 p-2">{!userId ? <Header1 /> : null}</div>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-2 lg:p-2">
          {/* Search + Tabs */}
          <div className="flex flex-col gap-3 mb-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search services & campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <TabButton
                k="SERVICES"
                label="Services"
                count={filteredServiceCards.length + filteredServiceCampaigns.length}
              />
              <TabButton
                k="WE_ARE_HIRING"
                label="We Are Hiring"
                count={filteredHiringCampaigns.length}
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            {activeTab === "SERVICES" && (
              <>
                {/* Static Services */}
                {filteredServiceCards.map((item, index) => (
                  <div
                    key={`svc-${index}`}
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
                        className="w-80 h-48 object-contain transition-all duration-300 group-hover:border-purple-300 rounded-lg"
                      />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                ))}

                {/* Campaigns routed to Services (addServiceType = null/empty/others) */}
                {filteredServiceCampaigns.map((campaign: any) => (
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
                          className="w-80 h-48 object-contain transition-all duration-300  group-hover:border-purple-300 rounded-lg"
                        />
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {campaign.campaignType}
                    </h3>
                  </div>
                ))}
              </>
            )}

            {activeTab === "WE_ARE_HIRING" && (
              <>
                {filteredHiringCampaigns.length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    No hiring posts yet.
                  </div>
                )}
                {filteredHiringCampaigns.map((campaign: any) => (
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
                          className="w-80 h-48 object-contain transition-all duration-300  group-hover:border-purple-300 rounded-lg"
                        />
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {campaign.campaignType}
                    </h3>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* (Optional) Study Abroad Section kept commented in original */}
          {/* ... original section left unchanged ... */}

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;