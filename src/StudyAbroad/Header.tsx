import React from "react";
import { Menu, Bell, User, ChevronDown, Settings, LogOut } from "lucide-react";

interface StudyAbroadHeaderProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  profileDropdownOpen: boolean;
  setProfileDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StudentHeader: React.FC<StudyAbroadHeaderProps> = ({
  setSidebarOpen,
  profileDropdownOpen,
  setProfileDropdownOpen,
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-lg shadow-sm sticky top-0 z-30 border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-6 py-2">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </span>
          </button>
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-all duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-medium text-gray-900 text-xs">
                  Alex Johnson
                </p>
                <p className="text-xs text-gray-600">CS Graduate</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm">
                  <LogOut className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;