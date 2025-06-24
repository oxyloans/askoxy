import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  FileText,
  Award,
  LogOut,
  User,
  MessageCircle,
  X,
  Loader2,
  Globe,
  Percent,
  Home,
  Search,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface UserProfile {
  userFirstName?: string;
  userLastName?: string;
  customerEmail?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

const StudentSidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    {
      id: "cashback-universities",
      label: "5% Cashback Universities",
      icon: Percent,
      badge: "HOT",
    },
    { id: "courses", label: "Browse Courses", icon: Award },
    { id: "applications", label: "My Applications", icon: FileText },
    { id: "universities", label: "University Search", icon: Search },
    { id: "profile", label: "My Profile", icon: User },
    { id: "TestScores", label: "Test Scores", icon: GraduationCap },
    { id: "documents", label: "My Documents", icon: FileText },
    { id: "support", label: "Counselor Support", icon: MessageCircle },
  ];

  const fetchUserProfile = async () => {
    try {
      const customerId =
        localStorage.getItem("userId") || localStorage.getItem("customerId");
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");

      if (!customerId || !token) {
        setLoadingProfile(false);
        return;
      }

      const response = await fetch(
        `https://meta.oxyloans.com/api/user-service/customerProfileDetails/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const profileData = data?.data || data;
        setUserProfile(profileData);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleSignout = () => {
    const entryPoint = localStorage.getItem("entryPoint") || "/";
    localStorage.clear();
    localStorage.setItem("entryPoint", entryPoint);
    navigate(entryPoint);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl border-r border-gray-200 overflow-y-auto">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white mb-4">
              <Link to="/student-home" className="flex items-center">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full opacity-50 blur"></div>
                  <div className="relative bg-white rounded-full p-2">
                    <Globe className="h-7 w-7 text-purple-700" />
                  </div>
                </div>
                <div className="ml-3">
                  <span className="text-xl font-bold text-white">
                    Study<span className="text-purple-200">Abroad</span>
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-violet-100 hover:text-white hover:bg-violet-500/20 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col h-full justify-between">
              <nav className="p-3 space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-sm relative ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-md"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
              <div className="p-4 bg-gray-50 m-3 rounded-lg border border-gray-200">
                {loadingProfile ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleSignout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
                  >
                    <LogOut size={16} />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col h-full">
        <div className="flex flex-col flex-grow bg-white shadow-lg border-r border-gray-200 overflow-y-auto max-h-screen">
          {/* Logo Section */}
          <div className="px-6 py-6 mb-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
            <Link to="/student-home" className="flex items-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full opacity-50 blur"></div>
                <div className="relative bg-white rounded-full p-2">
                  <Globe className="h-6 w-6 text-purple-700" />
                </div>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold text-white">
                  Study<span className="text-purple-200">Abroad</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation + Footer wrapped together for scroll */}
          <div className="flex-1 flex flex-col justify-between">
            <nav className="px-4 py-5 space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 text-sm relative group ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-bold ${
                        activeTab === item.id
                          ? "bg-white/20 text-white"
                          : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Sign Out Section */}
            <div className="p-4 bg-gray-50 m-4 rounded-lg border border-gray-200">
              {loadingProfile ? (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleSignout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
                >
                  <LogOut size={16} />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentSidebar;
