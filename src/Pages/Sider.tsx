import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTachometerAlt,
  FaUser,
  FaCog,
  FaSignOutAlt,
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
  {
    title: "FileUpload",
    icon: <FaCog className="text-yellow-500" />,
    link: "/fileupload",
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
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300`}
      >
        <h2 className="text-2xl font-semibold text-center my-6">
          Admin Dashboard
        </h2>
        <ul>
          {sidebarItems.map((item, index) => (
            <li key={index} className="mb-4">
              <Link
                to={item.link}
                className="flex items-center py-2 px-4 hover:bg-gray-700 rounded"
                onClick={() => setIsOpen(false)} // Close sidebar on link click
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

   
    </div>
  );
};

export default Sidebar;
