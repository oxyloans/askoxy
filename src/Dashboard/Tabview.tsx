import { Dashboard } from "@mui/icons-material";
import axios from "axios";
import { Bot, Check, Coins, Copy, HelpCircle, Info, Settings, ShoppingBag, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardMain from "./Dashboardmain";
import BASE_URL from "../Config";
import BMVICON from "../assets/img/bmvlogo.png"; // Make sure to import the BMVICON

interface DashboardItem {
  title: string;
  image: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  category?: string;
}

const Tabview = () => {
  const [multichainId, setMultichainId] = useState<string>("");
  const [bmvCoin, setBmvCoin] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("services");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showBmvModal, setShowBmvModal] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    // Fetch multichain ID and BMV coin
    fetchUserData();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const pathTab = location.pathname.split("/").pop();
    
    if (pathTab) {
      setActiveTab(pathTab);
    }
  }, [location.pathname]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    navigate(`/main/dashboard/${tab}`);
  };

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${BASE_URL}/user-service/getProfile/${userId}`
      );
      setMultichainId(response.data.multiChainId);
      setBmvCoin(response.data.coinAllocated);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const pathTab = pathSegments[2]; // Extracts "dashboard"
  
    console.log(pathTab);
    
    if (pathTab === "dashboard") {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [location.pathname]);
  
  const handleCopyMultichainId = async () => {
    if (multichainId) {
      try {
        await navigator.clipboard.writeText(multichainId);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const TabButton: React.FC<{
    tab: string;
    icon: React.ReactNode;
    label: string;
    count?: number;
  }> = ({ tab, icon, label, count }) => (
    <button
      onClick={() => handleTabClick(tab)}
      className={`
          flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          transition-all duration-200 relative
          ${
            activeTab === tab
              ? "bg-purple-100 text-purple-700 shadow-sm"
              : "hover:bg-gray-100 text-gray-600"
          }
        `}
    >
      {icon}
      <span>{label}</span>
      {/* {count && (
          <span className="ml-1 px-2 py-0.5 text-xs bg-purple-200 text-purple-700 rounded-full">
            {count}
          </span>
        )} */}
    </button>
  );

  const BMVInfoModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-4 relative">
        <button
          onClick={() => setShowBmvModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-bold text-purple-700">How to use BMVCoins?</h2>
        </div>
        
        <div className="text-gray-700 space-y-3">
          <p>You can collect BMVCoins and use them to get discounts on rice bags and other products and services.</p>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="font-medium">Current value:</p>
            <p>1,000 BMVCoins = ₹10 discount</p>
          </div>
          <p className="font-medium">Important information:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>You need at least 20,000 BMVCoins to redeem</li>
            <li>The value of the discount may change in the future</li>
          </ul>
        </div>
        
        <button
          onClick={() => setShowBmvModal(false)}
          className="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`
       top-0 w-100% z-10 bg-white px-4 py-3 
      transition-shadow duration-300
      ${isScrolled ? "shadow-md" : ""}
    `}
    >
      <div className="flex justify-center">
        <div className="w-full max-w-2xl overflow-x-auto items-center">
          <div className="grid grid-cols-2 pt-4 md:grid-cols-4 gap-2 md:gap-4 justify-center ">
            <TabButton
              tab="products"
              icon={<ShoppingBag size={20} />}
              label="Products"
            />
            <TabButton
              tab="services"
              icon={<Settings size={20} />}
              label="Services"
            />
            <TabButton
              tab="freegpts"
              icon={<Bot size={20} />}
              label="Free GPTs"
            />
            <TabButton
              tab="bmvcoin"
              icon={<Coins size={20} />}
              label="Cryptocurrency"
            />
          </div>
        </div>
      </div>

      {isVisible && (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Blockchain ID Section */}
          <div className="flex items-center overflow-hidden gap-2 bg-white p-3 rounded-lg shadow-lg w-full md:w-auto mt-4">
            <button
              className="text-sm font-medium text-purple-600"
              onClick={() => window.open('http://bmv.money:2750/')}
            >
              Blockchain ID: {multichainId}
            </button>

            <button
              onClick={handleCopyMultichainId}
              className="p-1 bg-white border border-purple-600 text-purple-600 hover:bg-purple-100 rounded transition-colors"
              aria-label="Copy multichain ID"
            >
              {isCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* BMV Coins Section - Updated with clickable image */}
          <div className="bg-white p-3 rounded-lg shadow-lg w-full md:w-auto flex items-center justify-end">
            <div className="flex items-center cursor-pointer" onClick={() => setShowBmvModal(true)}>
              <img 
                src={BMVICON} 
                alt="BMV Coin" 
                className="w-26 h-8 mr-2 hover:opacity-80 transition-opacity"
              />
              <span className="text-m font-bold text-purple-600 mr-1">: {bmvCoin}</span>
              <HelpCircle size={18} className="text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* BMV Info Modal */}
      {showBmvModal && <BMVInfoModal />}
    </div>
  );
};

export default Tabview;