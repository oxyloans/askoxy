import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header1 from "../components/Header";
import Footer from "../components/Footer";
import Ricebags from "../kart/Mainrice";
import FreeChatGPTmain from "./FreechatGPTmain";
import BMVCOINmain from "./BMVcoinmain";
import { Coins, Bot, ShoppingBag } from "lucide-react";

interface DashboardItem {
  title: string;
  image: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  category?: string;
}

const DashboardMain: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("products");
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const pathTab = location.pathname.split("/").pop();
    if (pathTab) {
      setActiveTab(pathTab);
    }

    if (pathTab === "services") {
      navigate("/main/dashboard/services");
    } else if (pathTab === "blogs") {
      navigate("/main/dashboard/blogs");
    }
  }, [location.pathname, navigate]);

  const products: DashboardItem[] = [
    {
      title: "Digital Products",
      image: "../assets/img/freerudraksha.png",
      description: "Browse our collection of digital digital products and resources.",
      path: "/buyRice",
      icon: <ShoppingBag className="text-purple-600" size={24} />,
      category: "Digital",
    },
  ];

  const freeGPTs: DashboardItem[] = [
    {
      title: "AI Assistant",
      image: "../assets/img/freerudraksha.png",
      description: "Try our free AI-powered assistant for various tasks.",
      path: "/services/Freechatgpt",
      icon: <Bot className="text-purple-600" size={24} />,
      category: "AI",
    },
  ];

  const bmvCoinItems: DashboardItem[] = [
    {
      title: "BMV Coins",
      image: "../assets/img/freerudraksha.png",
      description: "Manage and track your BMV coin balance and transactions.",
      path: "/coins/dashboard",
      icon: <Coins className="text-purple-600" size={24} />,
      category: "Finance",
    },
  ];

  const renderItems = (items: DashboardItem[]): JSX.Element => (
    <div className="space-y-6">
      {activeTab === "products" ? (
        <Ricebags />
      ) : activeTab === "freegpts" ? (
        <FreeChatGPTmain />
      ) : activeTab === "bmvcoin" ? (
        <BMVCOINmain />
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please select a section to view content.</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/main/myservices")}
              className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
            >
              View Services
            </button>
            <button
              onClick={() => navigate("/main/myblogs")}
              className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
            >
              View Blogs
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="mb-2 p-2">{!userId ? <Header1 /> : null}</div>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-2 lg:p-4">
          {activeTab === "products" && renderItems(products)}
          {activeTab === "freegpts" && renderItems(freeGPTs)}
          {activeTab === "bmvcoin" && renderItems(bmvCoinItems)}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardMain;