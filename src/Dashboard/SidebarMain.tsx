import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHandsHelping,
  FaCoins,
  FaWallet,
  FaGoogle,
  FaPlusCircle,
  FaShoppingCart,
  FaTools,
  FaChevronDown,
  FaStore,
  FaUserFriends,
  FaUsers,
  FaUser,
  FaRegCheckCircle,
  FaCog
} from "react-icons/fa";
import { IoLayers, IoLogOut } from "react-icons/io5";
import { FaCreditCard, FaRobot, FaBriefcase } from "react-icons/fa6";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { ImUsers } from "react-icons/im";
import { AiFillFileText } from "react-icons/ai";
import { HiSparkles } from "react-icons/hi2";
import { TiChevronRight, TiChevronLeft } from "react-icons/ti";
import { BiSolidMessageSquare } from "react-icons/bi";
interface SidebarProps {
  onCollapse: (collapsed: boolean) => void;
  onItemClick?: () => void;
  isCollapsed?: boolean;
  isHovering?: boolean;
  showLabels?: boolean;
  isMobile?: boolean;
}

/* Discriminated union types */
type MenuItem = {
  type: "item";
  to: string;
  icon: React.ReactNode;
  label: string;
};

type MenuDropdown = {
  type: "dropdown";
  key: string;
  icon: React.ReactNode;
  label: string;
  items: {
    to: string;
    label: string;
    icon?: React.ReactNode;
  }[];
};

type MenuGroup = MenuItem | MenuDropdown;

const Sidebar: React.FC<SidebarProps> = ({
  onCollapse,
  onItemClick,
  isCollapsed = false,
  isHovering = false,
  showLabels = false,
  isMobile = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isCollapsed) {
      setOpenDropdowns(new Set());
    }
  }, [isCollapsed]);

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => {
      const next = new Set<string>();

      // if clicking the already open dropdown → close it
      if (prev.has(key)) {
        return next; // empty (close all)
      }

      // otherwise open ONLY the clicked dropdown
      next.add(key);
      return next;
    });
  };

  const handleSignout = () => {
    const entryPoint = localStorage.getItem("entryPoint") || "/";
    // preserve entryPoint across clear
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("entryPoint", entryPoint);
    navigate(entryPoint);
  };

  const isExpanded = showLabels || !isCollapsed || isHovering;

  const menuGroups: MenuGroup[] = [
    // simple items
    {
      type: "item",
      to: "/main/dashboard/home",
      icon: <TbLayoutDashboardFilled size={18} />,
      label: "Dashboard",
    },
    // {
    //   type: "item",
    //   to: "/main/subscription",
    //   icon: <FaCreditCard size={18} />,
    //   label: "My Subscriptions",
    // },

    // {
    //   type: "item",
    //   to: "/main/profile",
    //   icon: <FaUser size={18} />,
    //   label: "Profile",
    // },
    {
      type: "item",
      to: "/main/myorders",
      icon: <FaShoppingCart size={18} />,
      label: "My Orders",
    },

    // {
    //   type: "item",
    //   to: "/main/wallet",
    //   icon: <FaWallet size={18} />,
    //   label: "My Wallet",
    // },

    // {
    //   type: "item",
    //   to: "/main/crypto",
    //   icon: <FaCoins size={18} />,
    //   label: "My Crypto",
    // },
    // {
    //   to: "/main/usercreateaistore",
    //   label: "Agent KYC Verification",
    //   icon: <HiSparkles size={16} />,
    // },

    {
      type: "dropdown",
      key: "account_menu",
      icon: <FaUser size={18} />,
      label: "My Account",
      items: [
        {
          to: "/main/profile",
          label: "Profile",
          icon: <FaUser size={16} />,
        },
        {
          to: "/main/freelanceform",
          label:"Freelancer Skills Profile",
          icon: <FaPlusCircle size={16} />,
        },
        {
          to:"/main/freelanceappliedlist",
          label:"Freelancer Applied List",
          icon:<FaRegCheckCircle size={16} />
        },
        {
          to: "/main/wallet",
          label: "Wallet",
          icon: <FaWallet size={16} />,
        },
        {
          to: "/main/crypto",
          label: "Crypto Wallet",
          icon: <FaCoins size={16} />,
        },
        {
          to: "/main/subscription",
          label: "Subscriptions",
          icon: <FaCreditCard size={16} />,
        },
      ],
    },
    {
      type: "dropdown",
      key: "bharat_ai_store",
      icon: <FaStore size={18} />,
      label: "Bharat AI Store",
      items: [
        {
          to: "/all-ai-stores",
          label: "Explore AI Stores",
          icon: <FaRobot size={16} />,
        },
        {
          to: "/main/usercreateaistore",
          label: "Create AI Store",
          icon: <HiSparkles size={16} />,
        },
        {
          to: "/main/agentcreate",
          label: "Create AI Agent",
          icon: <FaPlusCircle size={16} />,
        },
        {
          to: "/bharath-aistore",
          label: "Explore AI Agents",
          icon: <FaRobot size={16} />,
        },
        {
          to: "/main/bharath-aistore/agents",
          label: "My AI Agents",
          icon: <FaRobot size={16} />,
        },
      ],
    },

    {
      type: "dropdown",
      key: "referrals_invites",
      icon: <ImUsers size={18} />,
      label: "Referrals & Invites",
      items: [
        {
          to: "/main/referral",
          label: "My Referrals",
          icon: <FaUserFriends size={16} />,
        },
        {
          to: "/main/bulkinvite",
          label: "Bulk Invite",
          icon: <FaUsers size={16} />,
        },
        {
          to: "/main/google",
          label: "Google Contacts",
          icon: <FaGoogle size={16} />,
        },
      ],
    },

    // My Content & Jobs
    {
      type: "dropdown",
      key: "my_content_jobs",
      icon: <IoLayers size={18} />,
      label: "My Content & Jobs",
      items: [
        {
          to: "/main/dashboard/myservices",
          label: "My Services",
          icon: <FaTools size={16} />,
        },
        {
          to: "/main/dashboard/myblogs",
          label: "My Blogs",
          icon: <AiFillFileText size={16} />,
        },
        {
          to: "/main/jobDetails",
          label: "All Jobs",
          icon: <FaBriefcase size={16} />,
        },
        {
          to: "/main/appliedjobs",
          label: "My Applications",
          icon: <FaRegCheckCircle size={16} />,
        },
      ],
    },

    // Help & Support
    {
      type: "dropdown",
      key: "help_support",
      icon: <FaHandsHelping size={18} />,
      label: "Help & Support",
      items: [
        {
          to: "/main/writetous",
          label: "Write to Us",
          icon: <BiSolidMessageSquare size={16} />,
        },
        {
          to: "/main/tickethistory",
          label: "Ticket History",
          icon: <AiFillFileText size={16} />,
        },
      ],
    },
  ];

  const isActive = (to: string) => {
    return location.pathname === to || location.pathname.startsWith(to + "/");
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 min-h-[60px] flex-shrink-0">
        <div
          className={`flex items-center transition-all duration-300 ${
            isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          }`}
        />
        <button
          onClick={() => onCollapse(!isCollapsed)}
          className="p-2 rounded-md hover:bg-purple-50 transition-colors duration-200 flex-shrink-0 hidden md:flex"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <TiChevronRight size={16} className="text-purple-600" />
          ) : (
            <TiChevronLeft size={16} className="text-purple-600" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-purple-400">
        {menuGroups.map((group) => {
          if (group.type === "item") {
            const active = isActive(group.to);
            return (
              <Link
                key={group.to}
                to={group.to}
                onClick={() => onItemClick?.()}
                className={`group relative flex items-center rounded-lg transition-all duration-200 min-h-[44px]
                  ${isExpanded || isMobile ? "px-3" : "px-0 justify-center"}
                  ${
                    active
                      ? "bg-purple-50 text-purple-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-purple-600"
                  }`}
              >
                {active && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-purple-600 rounded-r-full" />
                )}
                <div
                  className={`flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    isExpanded || isMobile ? "mr-3" : "mx-auto"
                  } ${
                    active ? "text-purple-600" : "group-hover:text-purple-600"
                  }`}
                >
                  {group.icon}
                </div>
                <span
                  className={`font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                    isExpanded || showLabels
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 absolute"
                  } ${
                    active ? "text-purple-700" : "group-hover:text-purple-600"
                  }`}
                >
                  {group.label}
                </span>

                {/* tooltip when collapsed */}
                {!showLabels && isCollapsed && !isHovering && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none whitespace-nowrap">
                    {group.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                )}
              </Link>
            );
          }

          // Dropdown
          const isOpen = openDropdowns.has(group.key);
          const hasActiveChild = group.items.some((it) => isActive(it.to));

          return (
            <div key={group.key} className="space-y-1">
              <button
                onClick={() => toggleDropdown(group.key)}
                className={`w-full group relative flex items-center rounded-lg transition-all duration-200 min-h-[44px]
                  ${isExpanded || isMobile ? "px-3" : "px-0 justify-center"}
                  ${
                    hasActiveChild
                      ? "bg-purple-50 text-purple-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-purple-600"
                  }`}
              >
                {hasActiveChild && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-purple-600 rounded-r-full" />
                )}
                <div
                  className={`flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    isExpanded || isMobile ? "mr-3" : "mx-auto"
                  } ${
                    hasActiveChild
                      ? "text-purple-600"
                      : "group-hover:text-purple-600"
                  }`}
                >
                  {group.icon}
                </div>

                <span
                  className={`flex-1 text-left font-medium text-sm transition-all ${
                    isExpanded || showLabels
                      ? "opacity-100"
                      : "opacity-0 absolute -translate-x-2"
                  }`}
                >
                  {group.label}
                </span>

                <div
                  className={`${
                    isExpanded || showLabels ? "block" : "hidden"
                  } transition-transform`}
                >
                  {isOpen ? (
                    <FaChevronDown size={14} />
                  ) : (
                    <TiChevronRight size={14} />
                  )}
                </div>

                {/* tooltip when collapsed */}
                {!showLabels && isCollapsed && !isHovering && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none whitespace-nowrap">
                    {group.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                )}
              </button>

              {/* Dropdown content */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isExpanded && openDropdowns.has(group.key)
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="pl-8 pr-3 pb-2 pt-1 space-y-1">
                  {group.items.map((item) => {
                    const active = isActive(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => onItemClick?.()}
                        className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors ${
                          active
                            ? "bg-purple-100 text-purple-700 font-medium"
                            : "text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                        }`}
                      >
                        {item.icon && (
                          <span className="mr-2 flex-shrink-0">
                            {item.icon}
                          </span>
                        )}
                        <span >{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={handleSignout}
          className={`group w-full flex items-center rounded-lg transition-all duration-200 min-h-[44px] text-red-600 hover:bg-red-50 ${
            isExpanded || isMobile ? "px-3" : "px-0 justify-center"
          }`}
        >
          <div
            className={`flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
              isExpanded || isMobile ? "mr-3" : "mx-auto"
            }`}
          >
            <IoLogOut size={18} />
          </div>

          <span
            className={`font-medium text-sm transition-all duration-300 whitespace-nowrap ${
              isExpanded || showLabels
                ? "opacity-100"
                : "opacity-0 -translate-x-2 absolute"
            }`}
          >
            Sign Out
          </span>

          {!showLabels && isCollapsed && !isHovering && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none whitespace-nowrap">
              Sign Out
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
