import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Building2,
  FileText,
  Award,LogOut,
  User,
  MessageCircle,
  X,
  Loader2,Globe,
} from "lucide-react";
import { Link ,useNavigate} from "react-router-dom";

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: GraduationCap },
    { id: "courses", label: "Courses", icon: Award },
    { id: "applications", label: "My Applications", icon: FileText },
    { id: "universities", label: "University Search", icon: Building2 },
    { id: "profile", label: "My Profile", icon: User },
    { id: "TestScores", label: "Test Scores", icon: FileText },
    { id: "documents", label: "My Documents", icon: FileText },  
    { id: "support", label: "Counselor Support", icon: MessageCircle },
  ];

  const fetchUserProfile = async () => {
    try {
      const customerId = localStorage.getItem("userId") || localStorage.getItem("customerId");
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      
      if (!customerId || !token) {
        setLoadingProfile(false);
        return;
      }

      const response = await fetch(
        `https://meta.oxyloans.com/api/user-service/customerProfileDetails/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
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
    console.log("Signing out - Redirecting to:", entryPoint); // Debug log

    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("mobileNumber");
    localStorage.removeItem("whatsappNumber");
    localStorage.clear();
    localStorage.setItem("entryPoint", entryPoint); // Preserve entry point

    navigate(entryPoint);
  };

  const getDisplayName = () => {
    if (!userProfile) return "Student";
    
    const firstName = userProfile.userFirstName || userProfile.firstName || "";
    const lastName = userProfile.userLastName || userProfile.lastName || "";
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    
    return userProfile.customerEmail || userProfile.email || "Student";
  };

  const getDisplayEmail = () => {
    if (!userProfile) return "";
    return userProfile.customerEmail || userProfile.email || "";
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
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl border-r border-gray-200">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white mb-15">
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
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-violet-100 hover:text-white hover:bg-violet-500/20 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="p-3 space-y-1 overflow-y-auto h-full pb-20">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-sm ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-lg border-r border-gray-200">
          <div className="px-6 py-6 mb-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
            <h2 className="text-xl font-bold">StudyAbroad</h2>
          </div>
          <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-sm ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          
          {/* User Profile Section */}
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
              <div className="flex items-center space-x-3">
    
                
        <button
          onClick={handleSignout}
        >
          <div className={`flex items-center ${isCollapsed ? "" : "gap-4"}`}>
            <span className="text-red-500 flex items-center justify-center">
              <LogOut size={20} />
            </span>

            {!isCollapsed && (
              <span className="text-red-500 font-medium text-sm">Sign Out</span>
            )}
          </div>

          {isCollapsed && (
            <div
              className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 
              bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 invisible
              group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
            >
              Sign Out
              <div
                className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 
                border-4 border-transparent border-r-gray-900"
              />
            </div>
          )}
        </button>
      </div>
             
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentSidebar;