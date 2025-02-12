import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTachometerAlt,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaDatabase,
  FaPlusCircle,
} from "react-icons/fa";

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  link: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: <FaTachometerAlt className="text-blue-500" />,
    link: "/admin",
  },
  {
    title: "Campaigns Add",
    icon: <FaPlusCircle className="text-green-500" />,
    link: "/campaignsadd",
  },
  {
    title: "AllCampaignDetails",
    icon: <FaUser className="text-purple-500" />,
    link: "/allcampaignsdetails",
  },
  // {
  //   title: "FileUpload",
  //   icon: <FaCog className="text-yellow-500" />,
  //   link: "/fileupload",
  // },
  {
    title: "AllQueries",
    icon: <FaDatabase className="text-yellow-500" />,
    link: "/alluserqueries",
  },
  {
    title: "Logout",
    icon: <FaSignOutAlt className="text-red-500" />,
    link: "/logout",
  },
];

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      {/* Mobile Navbar - Only visible on mobile */}
      <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white z-50 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md "
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64  pt-8 bg-gray-800 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ${
          isOpen ? "mt-[56px]" : "mt-0"
        } md:mt-0`}
      >
        {/* Desktop Header - Only visible on desktop */}

        {/* Navigation Items */}
        <ul className={`${isOpen ? "mt-2" : "mt-0"} md:mt-0`}>
          {sidebarItems.map((item, index) => (
            <li key={index} className="mb-4">
              <Link
                to={item.link}
                className="flex items-center py-2 px-4 hover:bg-gray-700 rounded"
                onClick={() => setIsOpen(false)}
              >
                <div className="mr-3">{item.icon}</div>
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <div className="mt-[56px] md:mt-0">
          {" "}
          {/* Add top margin for mobile navbar */}
          {/* Your main content goes here */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
