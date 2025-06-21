import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardOverview from "./DashboardOverview";
import { Globe, X, MapPin, ChevronDown } from "lucide-react";
import Applications from "./Applications";
import UniversitySearch from "./UniversitySearch";
import Documents from "./Documents";
import Profile from "./Profile";
import StudentHeader from "./Header";
import CoursesPage from "./Course";
import Support from "./Support";
import TestScores from "./TestScore";
import { Link } from "react-router-dom";

const StudentMainDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuthentication = () => {
      try {
        // Check for userId in localStorage, sessionStorage, or your auth context
        const userId = localStorage.getItem('userId') || 
                      sessionStorage.getItem('userId') || 
                      localStorage.getItem('user_id') ||
                      sessionStorage.getItem('user_id');
        
        // Alternative: Check for auth token or user object
        const authToken = localStorage.getItem('authToken') || 
                         sessionStorage.getItem('authToken');
        
        const userObject = localStorage.getItem('user');
        let parsedUser = null;
        
        if (userObject) {
          try {
            parsedUser = JSON.parse(userObject);
          } catch (e) {
            console.error('Error parsing user object:', e);
          }
        }

        // Check if user is authenticated
        const isUserAuthenticated = !!(
          userId || 
          authToken || 
          (parsedUser && parsedUser.id)
        );

        if (isUserAuthenticated) {
          setIsAuthenticated(true);
        } else {
          // Redirect to landing page if not authenticated
          navigate('/studyabroad'); // or navigate('/studyabroad') depending on your landing page route
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Redirect to landing page on error
        navigate('/studyabroad');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  // Navigation handler for cross-page navigation
  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview onNavigate={handleNavigation} />;
      case "courses":
        return <CoursesPage onCourseSelect={(course) => {
          // Handle course selection logic here
          console.log('Selected course:', course);
        }} />;
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

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Only render dashboard if authenticated
  if (!isAuthenticated) {
    return null; // This shouldn't render as we redirect in useEffect
  }

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