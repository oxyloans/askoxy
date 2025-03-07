import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  User,
  Wallet,
  CreditCard,
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  onCollapse: (collapsed: boolean) => void;
  onItemClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCollapse, onItemClick }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignout = () => {
    if (onItemClick) {
      onItemClick();
    }
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.clear();
    navigate("/");
  };

  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapse(newCollapsed);
  };

  const menuItems = [
    {
      to: "/main",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      to: "/main/myorders",
      icon: <ShoppingCart size={20} />,
      label: "My Orders",
    },
    {
      to: "/main/profile",
      icon: <User size={20} />,
      label: "Profile",
    },
    {
      to: "/main/wallet",
      icon: <Wallet size={20} />,
      label: "My Wallet",
    },
    {
      to: "/main/subscription",
      icon: <CreditCard size={20} />,
      label: "My Subscriptions",
    },
    {
      to: "/main/referral",
      icon: <Users size={20} />,
      label: "Referral",
    },
    {
      to: "/main/writetous",
      icon: <MessageSquare size={20} />,
      label: "Write to Us",
    },
  ];

  return (
    <div className="relative h-full flex flex-col bg-white">
      <div className="flex justify-end items-center p-2 py-2">
        <button
          onClick={toggleCollapse}
          className={`p-2 rounded-lg bg-gray-50 hover:bg-purple-50 
            transition-all duration-300 hidden md:flex items-center justify-center
            ${isCollapsed ? "mx-auto" : ""}`}
        >
          {isCollapsed ? (
            <ChevronRight size={18} className="text-purple-600" />
          ) : (
            <ChevronLeft size={18} className="text-purple-600" />
          )}
        </button>
      </div>

      <div className={`flex-1 px-3 pb-2 space-y-1.5`}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={index}
              to={item.to}
              onClick={() => onItemClick && onItemClick()}
              className={`relative flex items-center rounded-xl transition-all duration-200 
                ${
                  isCollapsed
                    ? "w-12 min-h-10 h-auto sm:h-10 md:h-10 justify-center"
                    : "min-h-10 h-auto sm:h-11 md:h-10 px-4"
                }
                ${
                  isActive
                    ? "bg-purple-50 before:absolute before:w-1 before:h-8 before:bg-purple-600 before:rounded-full before:left-0 before:top-2"
                    : "hover:bg-gray-50"
                }
                group`}
            >
              <div
                className={`flex items-center ${isCollapsed ? "" : "gap-4"}`}
              >
                <span
                  className={`transition-colors duration-200 flex items-center justify-center
                    ${
                      isActive
                        ? "text-purple-600"
                        : "text-gray-500 group-hover:text-purple-600"
                    }`}
                >
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span
                    className={`font-medium whitespace-nowrap text-sm
                      ${
                        isActive
                          ? "text-purple-600"
                          : "text-gray-600 group-hover:text-purple-600"
                      }`}
                  >
                    {item.label}
                  </span>
                )}
              </div>

              {isCollapsed && (
                <div
                  className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 
                  bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 invisible
                  group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                >
                  {item.label}
                  <div
                    className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 
                    border-4 border-transparent border-r-gray-900"
                  />
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto px-3 py-2 border-t">
        <button
          onClick={handleSignout}
          className={`flex items-center rounded-xl transition-all duration-200
            hover:bg-red-50 min-h-10 h-auto sm:h-10 md:h-12
            ${isCollapsed ? "w-12 justify-center" : "px-4"}`}
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
    </div>
  );
};

export default Sidebar;
