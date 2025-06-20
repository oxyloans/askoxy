import React, { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardOverview from "./DashboardOverview";
import { Globe, X, MapPin, ChevronDown } from "lucide-react";
import Applications from "./Applications";
import UniversitySearch from "./UniversitySearch";
import Documents from "./Documents";
import Profile from "./Profile";
import StudentHeader from "./Header";
import Support from "./Support";
import TestScores from "./TestScore";
import { Link } from "react-router-dom";

const StudentMainDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Navigation handler for cross-page navigation
  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview onNavigate={handleNavigation} />;
      case "applications":
        return <Applications onNavigate={handleNavigation} />;
      case "universities":
        return <UniversitySearch onNavigate={handleNavigation} />;
      case "profile":
        return <Profile onNavigate={handleNavigation} />;
      case "TestScores":
        return <TestScores onNavigate={handleNavigation} />;
      case "documents":
        return <Documents onNavigate={handleNavigation} />;
      case "support":
        return <Support onNavigate={handleNavigation} />;
      default:
        return <DashboardOverview onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={handleNavigation}
      />

      <div className="lg:pl-72">
        {/* Header component - create if needed */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {/* Left: Logo with unique design */}
            <Link to="/student-home" className="flex items-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full opacity-50 blur"></div>
                <div className="relative bg-white rounded-full p-2">
                  <Globe className="h-7 w-7 text-purple-700" />
                </div>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold text-purple-900">
                  Study<span className="text-purple-600">Abroad</span>
                </span>
              </div>
            </Link>
            <div className="w-10"></div>
          </div>
        </header>

        <main className="p-4 sm:p-6">{renderActiveComponent()}</main>
      </div>
    </div>
  );
};

export default StudentMainDashboard;
