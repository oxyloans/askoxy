import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaSignOutAlt,
  FaDatabase,
  FaPlusCircle,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  link: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: <FaTachometerAlt className="text-blue-400" />,
    link: "/admin",
  },
  {
    title: "Campaigns Add",
    icon: <FaPlusCircle className="text-green-400" />,
    link: "/campaignsadd",
  },
  {
    title: "All Campaign Details",
    icon: <FaUser className="text-purple-400" />,
    link: "/allcampaignsdetails",
  },
  {
    title: "All Queries",
    icon: <FaDatabase className="text-yellow-400" />,
    link: "/allqueries",
  },
  {
    title: "Logout",
    icon: <FaSignOutAlt className="text-red-400" />,
    link: "/admin",
  },
];

const Sidebar: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex ">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-gray-50 border-b border-gray-200 md:hidden z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileOpen ? (
                <FaTimes className="h-6 w-6 text-gray-600" />
              ) : (
                <FaBars className="h-6 w-6 text-gray-600" />
              )}
            </button>
            <span className="font-semibold text-gray-800">Admin Panel</span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 bg-gray-100 border-r  border-gray-100 transform transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-16" : "w-72"}
          md:translate-x-0
          ${isMobileOpen ? "mt-14" : "mt-0"}
          md:mt-0`}
      >
        {/* Desktop Header with Toggle Button */}
        <div className="hidden md:flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <FaChevronRight className="h-5 w-5 text-gray-600" />
            ) : (
              <FaChevronLeft className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-6">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.link}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors relative group
                    ${
                      isActive(item.link)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isCollapsed ? (
                    <span className="absolute left-full ml-2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 ">
                      {item.title}
                    </span>
                  ) : (
                    <span className="ml-3 font-medium">{item.title}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="flex items-center px-4 py-2 text-sm text-gray-600">
              <FaUser className="mr-2" />
              <span>Admin User</span>
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out
          ${isCollapsed ? "md:ml-16" : "md:ml-72"}
          ${isMobileOpen ? "ml-0" : "ml-0"}
        `}
      >
        <div className=" bg-gray-50">
          <div className="md:mt-0 mt-14">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
