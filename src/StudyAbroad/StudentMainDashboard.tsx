import React, { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardOverview from "./DashboardOverview";
import Applications from "./Applications";
import UniversitySearch from "./UniversitySearch";
import Scholarships from "./Scholarships";
import Documents from "./Documents";
import Profile from "./Profile";
import StudentHeader from "./Header";
import Support from "./Support";
import TestScores from "./TestScore";

const StudentMainDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "applications":
        return <Applications />;
      case "universities":
        return <UniversitySearch />;
      case "scholarships":
        return <Scholarships />;
         case "profile":
        return <Profile />;
      case "TestScores":
        return <TestScores />;
         case "documents":
        return <Documents />;
      case "support":
        return <Support />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <div className="lg:pl-72">
        <StudentHeader 
          setSidebarOpen={setSidebarOpen}
          profileDropdownOpen={profileDropdownOpen}
          setProfileDropdownOpen={setProfileDropdownOpen}
        />
        
        <main className="p-4 sm:p-6">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
};

export default StudentMainDashboard;