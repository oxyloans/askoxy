import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  User,
  Wallet,
  CreditCard,
  Users,
  MessageSquare,
  Coins,
  ChevronLeft,
  Layers,
  ChevronRight,
  LogOut,
  FileText,
  Briefcase,
  PlusCircle,
  Bot,
} from "lucide-react";
import { RobotOutlined } from "@ant-design/icons";

interface SidebarProps {
  onCollapse: (collapsed: boolean) => void;
  onItemClick?: () => void;
  isCollapsed?: boolean;
  isHovering?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  onCollapse,
  onItemClick,
  isCollapsed = false,
  isHovering = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignout = () => {
    const entryPoint = localStorage.getItem("entryPoint") || "/";
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("mobileNumber");
    localStorage.removeItem("whatsappNumber");
    localStorage.setItem("entryPoint", entryPoint);
    localStorage.clear();
    sessionStorage.clear();
    navigate(entryPoint);
  };

  const toggleCollapse = () => {
    onCollapse(!isCollapsed);
  };

  const menuItems = [
    {
      to: "/main/dashboard/home",
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
    },
    {
      to: "/main/myorders",
      icon: <ShoppingCart size={18} />,
      label: "My Orders",
    },

    {
      to: "/main/profile",
      icon: <User size={18} />,
      label: "Profile",
    },
    {
      to: "/main/wallet",
      icon: <Wallet size={18} />,
      label: "My Wallet",
    },
    {
      to: "/main/subscription",
      icon: <CreditCard size={18} />,
      label: "My Subscriptions",
    },
    {
      to: "/main/referral",
      icon: <Users size={18} />,
      label: "Referral",
    },
    {
      to: "/main/writetous",
      icon: <MessageSquare size={18} />,
      label: "Write to Us",
    },
    {
      to: "/main/crypto",
      icon: <Coins size={18} />,
      label: "My Crypto",
    },
      {
    to: "/bharath-aistore",
    icon: <RobotOutlined style={{ fontSize: "18px", color: "#722ed1" }} />,
    label: "Bharat AI Store",
  },
    {
      to: "/main/bharat-expert",
      icon: <PlusCircle size={18} />,
      label: "Create AI Agent",
    },
    {
      to: "/main/bharath-aistore/agents",
      icon: <Bot size={18} />,
      label: "All Agents",
    },
    {
      to: "/main/dashboard/myservices",
      icon: <Layers size={18} />,
      label: "My Services",
    },
    {
      to: "/main/dashboard/myblogs",
      icon: <FileText size={18} />,
      label: "My Blogs",
    },
    {
      to: "/main/jobDetails",
      icon: <Briefcase size={18} />,
      label: "My Jobs",
    },
  ];

  // Determine if sidebar should show expanded content
  const isExpanded = !isCollapsed || isHovering;

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 min-h-[60px] flex-shrink-0">
        <div
          className={`flex items-center transition-all duration-300 ${
            isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          }`}
        >
          {/* <div className="w-7 h-7 bg-purple-600 rounded-md flex items-center justify-center mr-3">
            <span className="text-white font-semibold text-xs">M</span>
          </div>
          <h2 className="text-gray-800 font-semibold text-sm whitespace-nowrap">
            Dashboard
          </h2> */}
        </div>

        <button
          onClick={toggleCollapse}
          className="p-2 rounded-md hover:bg-purple-50 transition-colors duration-200 flex-shrink-0 hidden md:flex"
        >
          {isCollapsed ? (
            <ChevronRight size={16} className="text-purple-600" />
          ) : (
            <ChevronLeft size={16} className="text-purple-600" />
          )}
        </button>
      </div>

      {/* Navigation Menu - Scrollable */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-purple-400">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => onItemClick && onItemClick()}
              className={`group relative flex items-center rounded-lg transition-all duration-200 min-h-[44px]
                ${isExpanded ? "px-3" : "px-0 justify-center"}
                ${
                  isActive
                    ? "bg-purple-50 text-purple-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-purple-600"
                }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-purple-600 rounded-r-full" />
              )}

              {/* Icon */}
              <div
                className={`flex items-center justify-center flex-shrink-0 transition-all duration-200
                ${isExpanded ? "mr-3" : "mx-auto"}
                ${isActive ? "text-purple-600" : "group-hover:text-purple-600"}
              `}
              >
                {item.icon}
              </div>

              {/* Label */}
              <span
                className={`font-medium text-sm transition-all duration-300 whitespace-nowrap
                ${
                  isExpanded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2 absolute"
                }
                ${isActive ? "text-purple-700" : "group-hover:text-purple-600"}
              `}
              >
                {item.label}
              </span>

              {/* Tooltip for collapsed state */}
              {isCollapsed && !isHovering && (
                <div
                  className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 
                  bg-gray-900 text-white text-xs rounded opacity-0 invisible
                  group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50
                  pointer-events-none whitespace-nowrap"
                >
                  {item.label}
                  <div
                    className="absolute right-full top-1/2 -translate-y-1/2 
                    border-4 border-transparent border-r-gray-900"
                  />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out Section */}
      <div className="p-3 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={handleSignout}
          className={`group w-full flex items-center rounded-lg transition-all duration-200 min-h-[44px]
            text-red-600 hover:bg-red-50 relative
            ${isExpanded ? "px-3" : "px-0 justify-center"}
          `}
        >
          {/* Icon */}
          <div
            className={`flex items-center justify-center flex-shrink-0 transition-all duration-200
            ${isExpanded ? "mr-3" : "mx-auto"}
          `}
          >
            <LogOut size={18} />
          </div>

          {/* Label */}
          <span
            className={`font-medium text-sm transition-all duration-300 whitespace-nowrap
            ${
              isExpanded
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2 absolute"
            }
          `}
          >
            Sign Out
          </span>

          {/* Tooltip for collapsed state */}
          {isCollapsed && !isHovering && (
            <div
              className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 
              bg-gray-900 text-white text-xs rounded opacity-0 invisible
              group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50
              pointer-events-none whitespace-nowrap"
            >
              Sign Out
              <div
                className="absolute right-full top-1/2 -translate-y-1/2 
                border-4 border-transparent border-r-gray-900"
              />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
