import React from "react";
import {
  GraduationCap,
  Building2,
  FileText,
  Award,
  User,
  MessageCircle,
  X,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const StudentSidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
}) => {
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: GraduationCap },
    { id: "applications", label: "My Applications", icon: FileText },
    { id: "universities", label: "University Search", icon: Building2 },
    { id: "scholarships", label: "Scholarships", icon: Award },
    { id: "profile", label: "My Profile", icon: User },
    { id: "TestScores", label: "Test Scores", icon: FileText },
    { id: "documents", label: "My Documents", icon: FileText },  
    { id: "support", label: "Counselor Support", icon: MessageCircle },
  ];

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
              <div>
                <h2 className="text-lg font-bold">StudyAbroad</h2>
                {/* <p className="text-violet-100 text-xs mt-0.5">
                  Your Study Journey
                </p> */}
              </div>
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
            {/* <p className="text-violet-100 text-sm mt-1">Your Study Journey</p> */}
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
          <div className="p-4 bg-gray-50 m-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  Alex Johnson
                </p>
                <p className="text-xs text-gray-600">Graduate Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentSidebar;