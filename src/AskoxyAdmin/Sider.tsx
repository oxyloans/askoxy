import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaSignOutAlt,
  FaDatabase,
  FaPlusCircle,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaClipboardList,
  FaHeadset,
  FaUsers,
  FaFileAlt,
  FaComments,
  FaConciergeBell,
  FaPhone,
  FaRegAddressCard,
  FaTags,
} from "react-icons/fa";
import { RiAdminLine, RiListUnordered, RiMapPin2Line } from "react-icons/ri";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { message } from "antd";
import { MdPayment } from "react-icons/md";

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  link: string;
  roles: string[];
  onClick?: () => void;
}

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false); // Default to expanded
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const primaryType = localStorage.getItem("primaryType");

  const handleLogout = () => {
    localStorage.removeItem("primaryType");
    localStorage.removeItem("uniquId");
    localStorage.removeItem("userName");
    localStorage.removeItem("acToken");
    navigate("/admin");
  };

  const title =
    primaryType === "HELPDESKSUPERADMIN" ? "Interested Users" : "Dashboard";

  const allSidebarItems: SidebarItem[] = [
    {
      title: "HelpDesk Dashboard",
      icon: <FaHeadset className="text-green-400" />,
      link: "/admn/helpdashboard",
      roles: ["HELPDESKSUPERADMIN"],
    },
    {
      title: "HelpDesk Team",
      icon: <FaConciergeBell className="text-pink-400" />,
      link: "/admn/helpDeskUsers",
      roles: ["HELPDESKSUPERADMIN"],
    },
    {
      title: "Orders Report",
      icon: <FaFileAlt className="text-blue-400" />,
      link: "/admn/orderReport",
      roles: ["HELPDESKSUPERADMIN"],
    },
    {
      title: title,
      icon: <FaTachometerAlt className="text-blue-400" />,
      link: "/admn/dashboard",
      roles: ["HELPDESKSUPERADMIN", "HELPDESKADMIN"],
    },
    {
      title: "Registered Users",
      icon: <FaUser className="text-purple-400" />,
      link: "/admn/registeredUsers",
      roles: ["HELPDESKSUPERADMIN", "HELPDESKADMIN"],
    },
    {
      title: "Assigned Data",
      icon: <FaClipboardList className="text-yellow-400" />,
      link: "/admn/assignedData",
      roles: ["HELPDESKADMIN"],
    },
    {
      title: "All AskOxy Users",
      icon: <FaRegAddressCard className="text-green-400" />,
      link: "/admn/dataAssigned",
      roles: ["HELPDESKSUPERADMIN", "HELPDESKADMIN"],
    },
    {
      title: "Referred Data",
      icon: <FaUsers className="text-blue-500" />,
      link: "/admn/referredData",
      roles: ["HELPDESKADMIN"],
    },

    {
      title: "Add Service / Product",
      icon: <FaPlusCircle className="text-green-400" />,
      link: "/admn/campaignsadd",
      roles: ["HELPDESKSUPERADMIN"],
    },
    {
      title: "All Service Details",
      icon: <RiListUnordered className="text-purple-400" />,
      link: "/admn/allcampaignsdetails",
      roles: ["HELPDESKSUPERADMIN"],
    },
    {
      title: "Super Admin Comments",
      icon: <RiAdminLine className="text-purple-400" />, // New icon
      link: "/admn/superAdminComments",
      roles: ["HELPDESKSUPERADMIN", "HELPDESKADMIN"],
    },
    {
      title: "Orders by Pincode",
      icon: <RiMapPin2Line className="text-purple-400" />,
      link: "/admn/pincodeorders",
      roles: ["HELPDESKSUPERADMIN", "HELPDESKADMIN"],
    },
    {
      title: "User Feedback",
      icon: <FaComments className="text-green-400" />,
      link: "/admn/feedback",
      roles: ["HELPDESKSUPERADMIN"],
    },
    {
      title: "All Queries",
      icon: <FaDatabase className="text-yellow-400" />,
      link: "/admn/allqueries",
      roles: ["HELPDESKSUPERADMIN", "HELPDESKADMIN"],
    },
    {
      title: "My Calls",
      icon: <FaPhone className="text-blue-400" />,
      link: "/admn/todaycalls",
      roles: ["HELPDESKADMIN"],
    },
    {
      title: "Logout",
      icon: <FaSignOutAlt className="text-red-400" />,
      link: "/admin",
      roles: ["HELPDESKSUPERADMIN", "HELPDESKADMIN"],
      onClick: handleLogout,
    },
  ];

  useEffect(() => {
    if (
      !primaryType ||
      primaryType === undefined ||
      (primaryType !== "HELPDESKSUPERADMIN" && primaryType !== "HELPDESKADMIN")
    ) {
      message.info("Your not Supposed to Login to the SuperAdmin");
      navigate("/admin");
      return;
    }

    setUserRole(primaryType);
  }, [navigate]);

  useEffect(() => {
    const checkAccessToken = () => {
      const uniquId = localStorage.getItem("uniquId");

      if (!uniquId) {
        message.info("Your session has expired. Please log in again.");
        navigate("/admin");
        localStorage.clear();
      }
    };

    checkAccessToken();

    window.addEventListener("focus", checkAccessToken);

    return () => {
      window.removeEventListener("focus", checkAccessToken);
    };
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;

      if (isMobile && !mobile) {
        setCollapsed(false);
      }

      setIsMobile(mobile);

      if (mobile !== isMobile) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
    if (isMobile) {
      setCollapsed(false);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (!userRole) {
    return null;
  }

  const visibleItems = allSidebarItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <>
      {isMobileOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 bg-gray-800 transform transition-all duration-300 ease-in-out
          ${
            isMobile
              ? isMobileOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }
          ${collapsed && !isMobileOpen ? "w-20" : "w-64"}
        `}
        style={{
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex flex-col items-center justify-center h-16 border-b border-gray-700 bg-gray-900">
          <div className="text-center font-bold">
            <span className="text-gray-50 text-xl">
              {collapsed && !isMobileOpen ? "OXY" : "ASKOXY.AI"}
            </span>
          </div>
          <div className="text-center font-bold mt-1">
            {userRole === "HELPDESKADMIN" ? (
              <>
                <span className="text-green-400">
                  {collapsed && !isMobileOpen ? "H" : "HELPDESK"}
                </span>{" "}
                <span className="text-yellow-400">
                  {collapsed && !isMobileOpen ? "" : "PANEL"}
                </span>
              </>
            ) : (
              <>
                <span className="text-green-400">
                  {collapsed && !isMobileOpen ? "A" : "ADMIN"}
                </span>{" "}
                <span className="text-yellow-400">
                  {collapsed && !isMobileOpen ? "" : "PANEL"}
                </span>
              </>
            )}
          </div>
        </div>

        <nav className="mt-2 px-2">
          <ul
            className="space-y-0.5 overflow-y-auto pr-1 overflow-x-hidden
               max-h-[calc(100vh-100px)] 
               sm:max-h-[calc(100vh-120px)] 
               md:max-h-[calc(100vh-140px)]"
          >
            {visibleItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.link}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors relative group text-sm
            ${
              isActive(item.link)
                ? "bg-blue-700 text-white"
                : "text-gray-300 hover:bg-gray-50 hover:text-gray-800"
            }`}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    } else if (isMobile && isMobileOpen) {
                      setIsMobileOpen(false);
                    }
                  }}
                >
                  <span className={`text-lg ${collapsed ? "ml-2" : "ml-0"}`}>
                    {item.icon}
                  </span>
                  {collapsed && !isMobileOpen ? (
                    <span className="absolute left-full ml-2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 z-50 pointer-events-none">
                      {item.title}
                    </span>
                  ) : (
                    <span className="ml-2 font-medium truncate">
                      {item.title}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {(!collapsed || isMobileOpen) && (
          <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-white bg-gray-800 z-50">
            <div className="flex items-center px-2 py-2 text-sm text-white">
              <FaUserCircle className="mr-2" />
              {/* <span>{userRole === "SELLER" ? "Admin" : "Helpdesk"} User</span> */}
              <span>{localStorage.getItem("userName")?.toUpperCase()}</span>
            </div>
          </div>
        )}
      </aside>

      {/* Header */}
      <header
        className="bg-white shadow-md h-16 fixed top-0 right-0 z-20 flex items-center justify-between px-4"
        style={{
          width: isMobile
            ? "100%"
            : `calc(100% - ${collapsed && !isMobileOpen ? "80px" : "256px"})`,
          marginLeft: isMobile
            ? "0"
            : collapsed && !isMobileOpen
            ? "80px"
            : "256px",
          transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
        }}
      >
        <div className="flex items-center">
          <button
            onClick={isMobile ? toggleMobileMenu : toggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            aria-label={isMobile ? "Toggle mobile menu" : "Toggle sidebar"}
          >
            {isMobile ? (
              isMobileOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )
            ) : collapsed ? (
              <MenuUnfoldOutlined style={{ fontSize: "18px" }} />
            ) : (
              <MenuFoldOutlined style={{ fontSize: "18px" }} />
            )}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <FaSignOutAlt className="mr-2" />
            <span className="text-sm">Log out</span>
          </div>
        </div>
      </header>

      {/* Content Spacer */}
      <div className="h-16 w-full" />

      {/* Main Content Area with Outlet */}
      <div
        className={`transition-all duration-300 ease-in-out 
          ${isMobile ? "ml-0" : collapsed ? "md:ml-20" : "md:ml-64"}
        `}
        style={{
          minHeight: "calc(100vh - 64px)",
          paddingBottom: "2rem",
        }}
      >
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Sidebar;
