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
  FaChevronDown,
  FaChevronRight,
  FaServer,
  FaChartBar,
  FaQuestionCircle,
  FaStore,
  FaBlog,
  FaBoxes,
} from "react-icons/fa";
import { RiAdminLine, RiListUnordered, RiMapPin2Line } from "react-icons/ri";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { message } from "antd";
import { MdPayment } from "react-icons/md";

interface SidebarSubItem {
  title: string;
  icon: React.ReactNode;
  link: string;
  roles: string[];
  onClick?: () => void;
}

interface SidebarCategory {
  title: string;
  icon: React.ReactNode;
  items: SidebarSubItem[];
  roles: string[];
}

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  link: string;
  roles: string[];
  onClick?: () => void;
}

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
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

  // Categories with subcategories
  const sidebarCategories: SidebarCategory[] = [
    {
      title: "Helpdesk Dashboard",
      icon: <FaHeadset className="text-green-400" />,
      roles: ["HELPDESKSUPERADMIN"],
      items: [
        {
          title: "HelpDesk Dashboard",
          icon: <FaTachometerAlt className="text-blue-400" />,
          link: "/admn/helpdashboard",
          roles: ["HELPDESKSUPERADMIN"],
        },
        {
          title: "HelpDesk Team",
          icon: <FaConciergeBell className="text-pink-400" />,
          link: "/admn/helpDeskUsers",
          roles: ["HELPDESKSUPERADMIN"],
        },
      ],
    },
    {
      title: "AskOxy Users",
      icon: <FaUsers className="text-purple-400" />,
      roles: ["HELPDESKSUPERADMIN", "HELPDESKADMIN"],
      items: [
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
          title: "All AskOxy Users",
          icon: <FaRegAddressCard className="text-green-400" />,
          link: "/admn/dataAssigned",
          roles: ["HELPDESKSUPERADMIN", "HELPDESKADMIN"],
        },
        {
          title: "Assigned Data",
          icon: <FaClipboardList className="text-yellow-400" />,
          link: "/admn/assignedData",
          roles: ["HELPDESKADMIN"],
        },
        {
          title: "Referred Data",
          icon: <FaUsers className="text-blue-500" />,
          link: "/admn/referredData",
          roles: ["HELPDESKADMIN"],
        },
      ],
    },
    {
      title: "Services & Blogs",
      icon: <FaServer className="text-orange-400" />,
      roles: ["HELPDESKSUPERADMIN"],
      items: [
        {
          title: "Add Service / Product",
          icon: <FaStore className="text-green-400" />,
          link: "/admn/campaignsadd",
          roles: ["HELPDESKSUPERADMIN"],
        },
        {
          title: "Add Blog",
          icon: <FaBlog className="text-green-400" />,
          link: "/admn/addblogs",
          roles: ["HELPDESKSUPERADMIN"],
        },
        {
          title: "All Service Details",
          icon: <RiListUnordered className="text-purple-400" />,
          link: "/admn/allcampaignsdetails",
          roles: ["HELPDESKSUPERADMIN"],
        },
      ],
    },
    {
      title: "Stats & Stock",
      icon: <FaChartBar className="text-indigo-400" />,
      roles: ["HELPDESKSUPERADMIN", "HELPDESKADMIN"],
      items: [
        {
          title: "Orders stats",
          icon: <FaChartBar className="text-blue-400" />,
          link: "/admn/orderstats",
          roles: ["HELPDESKSUPERADMIN"],
        },
        {
          title: "Orders Report",
          icon: <FaClipboardList className="text-blue-400" />,
          link: "/admn/orderReport",
          roles: ["HELPDESKSUPERADMIN"],
        },
        {
          title: "Stock update",
          icon: <FaBoxes className="text-blue-400" />,
          link: "/admn/updatestock",
          roles: ["HELPDESKSUPERADMIN"],
        },
        {
          title: "Orders by Pincode",
          icon: <RiMapPin2Line className="text-purple-400" />,
          link: "/admn/pincodeorders",
          roles: ["HELPDESKSUPERADMIN", "HELPDESKADMIN"],
        },
      ],
    },
    {
      title: "Queries & Feedback",
      icon: <FaQuestionCircle className="text-cyan-400" />,
      roles: ["HELPDESKSUPERADMIN", "HELPDESKADMIN"],
      items: [
        {
          title: "All Queries",
          icon: <FaDatabase className="text-yellow-400" />,
          link: "/admn/allqueries",
          roles: ["HELPDESKSUPERADMIN", "HELPDESKADMIN"],
        },
        {
          title: "User Feedback",
          icon: <FaComments className="text-green-400" />,
          link: "/admn/feedback",
          roles: ["HELPDESKSUPERADMIN"],
        },
      ],
    },
    {
      title: "Comments & Calls",
      icon: <FaComments className="text-pink-400" />,
      roles: ["HELPDESKSUPERADMIN", "HELPDESKADMIN"],
      items: [
        {
          title: "Super Admin Comments",
          icon: <RiAdminLine className="text-purple-400" />,
          link: "/admn/superAdminComments",
          roles: ["HELPDESKSUPERADMIN", "HELPDESKADMIN"],
        },
        {
          title: "My Calls",
          icon: <FaPhone className="text-blue-400" />,
          link: "/admn/todaycalls",
          roles: ["HELPDESKADMIN"],
        },
      ],
    },
  ];

  // Standalone items that don't belong to categories
  const standaloneItems: SidebarItem[] = [
    {
      title: "Logout",
      icon: <FaSignOutAlt className="text-white" />,
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

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategories((prev) => {
      if (prev.includes(categoryTitle)) {
        // If clicking on an already expanded category, collapse it
        return prev.filter((cat) => cat !== categoryTitle);
      } else {
        // If clicking on a collapsed category, expand it and close others
        return [categoryTitle];
      }
    });
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isCategoryActive = (category: SidebarCategory) => {
    return category.items.some(
      (item) => item.roles.includes(userRole!) && isActive(item.link)
    );
  };

  const isCategoryExpanded = (categoryTitle: string) => {
    return expandedCategories.includes(categoryTitle);
  };

  if (!userRole) {
    return null;
  }

  // Filter categories and items based on user role
  const visibleCategories = sidebarCategories.filter(
    (category) =>
      category.roles.includes(userRole) &&
      category.items.some((item) => item.roles.includes(userRole))
  );

  const visibleStandaloneItems = standaloneItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <>
      {isMobileOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
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
          boxShadow: "2px 0 15px rgba(0,0,0,0.15)",
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
            className="space-y-1 overflow-y-auto pr-1 overflow-x-hidden
               max-h-[calc(100vh-100px)] 
               sm:max-h-[calc(100vh-120px)] 
               md:max-h-[calc(100vh-140px)]"
          >
            {/* Categories */}
            {visibleCategories.map((category, categoryIndex) => {
              const categoryItems = category.items.filter((item) =>
                item.roles.includes(userRole!)
              );

              if (categoryItems.length === 0) return null;

              const isExpanded = isCategoryExpanded(category.title);
              const isActiveCat = isCategoryActive(category);

              return (
                <li key={categoryIndex} className="mb-1">
                  {/* Category Header */}
                  <div
                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer text-sm group hover:shadow-md relative overflow-hidden
                      ${
                        isActiveCat
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                          : "text-white hover:bg-white hover:text-gray-800 hover:shadow-md"
                      }`}
                    onClick={() => !collapsed && toggleCategory(category.title)}
                  >
                    <span
                      className={`text-lg ${
                        collapsed ? "ml-1" : "ml-0"
                      } transition-all duration-300 z-10`}
                    >
                      {React.cloneElement(category.icon as React.ReactElement, {
                        className: isActiveCat
                          ? "text-white"
                          : "text-white group-hover:text-gray-800 transition-colors duration-300",
                      })}
                    </span>

                    {collapsed && !isMobileOpen ? (
                      <span className="absolute left-full ml-2 bg-gray-900 text-white px-3 py-2 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 z-50 pointer-events-none shadow-lg border border-gray-600 transition-all duration-300">
                        {category.title}
                      </span>
                    ) : (
                      <>
                        <span
                          className={`ml-2 truncate flex-1 z-10 transition-colors duration-300 ${
                            isActiveCat
                              ? "text-white"
                              : "text-white group-hover:text-gray-800"
                          }`}
                        >
                          {category.title}
                        </span>
                        <span className="ml-2 transition-all duration-300 z-10">
                          {isExpanded ? (
                            <FaChevronDown
                              className={`text-sm transition-all duration-300 ${
                                isActiveCat
                                  ? "text-white"
                                  : "text-white group-hover:text-gray-800"
                              }`}
                            />
                          ) : (
                            <FaChevronRight
                              className={`text-sm transition-all duration-300 ${
                                isActiveCat
                                  ? "text-white"
                                  : "text-white group-hover:text-gray-800"
                              }`}
                            />
                          )}
                        </span>
                      </>
                    )}

                    {/* Hover background effect */}
                    {!isActiveCat && (
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    )}
                  </div>

                  {/* Category Items with smooth expand/collapse */}
                  <div
                    className={`overflow-hidden transition-all duration-400 ease-in-out ${
                      isExpanded && !collapsed
                        ? "max-h-80 opacity-100 mt-1"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="ml-4 space-y-1 border-l-2 border-gray-600 pl-3">
                      {categoryItems.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link
                            to={item.link}
                            className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 relative group text-sm hover:shadow-md overflow-hidden
                              ${
                                isActive(item.link)
                                  ? "bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg"
                                  : "text-white hover:bg-white hover:text-gray-800 hover:shadow-md"
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
                            <span className="text-sm mr-3 transition-all duration-300 z-10">
                              {React.cloneElement(
                                item.icon as React.ReactElement,
                                {
                                  className: isActive(item.link)
                                    ? "text-white"
                                    : "text-white group-hover:text-gray-800 transition-colors duration-300",
                                }
                              )}
                            </span>
                            <span
                              className={`font-medium truncate text-sm z-10 transition-colors duration-300 ${
                                isActive(item.link)
                                  ? "text-white"
                                  : "text-white group-hover:text-gray-800"
                              }`}
                            >
                              {item.title}
                            </span>
                            {isActive(item.link) && (
                              <div className="absolute right-2 w-1 h-6 bg-blue-300 rounded-full z-10"></div>
                            )}

                            {/* Hover background effect */}
                            {!isActive(item.link) && (
                              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}

            {/* Standalone Items */}
            {visibleStandaloneItems.map((item, index) => (
              <li key={`standalone-${index}`} className="mt-4">
                <Link
                  to={item.link}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 relative group text-sm hover:shadow-md overflow-hidden
                    ${
                      isActive(item.link)
                        ? "bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg"
                        : "text-white hover:bg-white hover:text-gray-800 hover:shadow-md"
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
                  <span
                    className={`text-lg ${
                      collapsed ? "ml-1" : "ml-0"
                    } transition-all duration-300 z-10`}
                  >
                    {React.cloneElement(item.icon as React.ReactElement, {
                      className: isActive(item.link)
                        ? "text-white"
                        : "text-white group-hover:text-gray-800 transition-colors duration-300",
                    })}
                  </span>
                  {collapsed && !isMobileOpen ? (
                    <span className="absolute left-full ml-2 bg-gray-900 text-white px-3 py-2 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 z-50 pointer-events-none shadow-lg border border-gray-600 transition-all duration-300">
                      {item.title}
                    </span>
                  ) : (
                    <span
                      className={`ml-3 font-medium truncate text-base z-10 transition-colors duration-300 ${
                        isActive(item.link)
                          ? "text-white"
                          : "text-white group-hover:text-gray-800"
                      }`}
                    >
                      {item.title}
                    </span>
                  )}
                  {isActive(item.link) && !collapsed && (
                    <div className="absolute right-3 w-1 h-6 bg-blue-300 rounded-full z-10"></div>
                  )}

                  {/* Hover background effect */}
                  {!isActive(item.link) && (
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {(!collapsed || isMobileOpen) && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-600 bg-gray-800">
            <div className="flex items-center px-3 py-3 text-sm text-white bg-gray-700 rounded-lg">
              <FaUserCircle className="mr-3 text-blue-400 text-lg" />
              <span className="font-semibold">
                {localStorage.getItem("userName")?.toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Header */}
      <header
        className="bg-white shadow-lg h-16 fixed top-0 right-0 z-20 flex items-center justify-between px-6 border-b border-gray-200"
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
            className="p-3 rounded-xl hover:bg-gray-100 transition-all duration-300 text-gray-600 hover:text-gray-900 hover:shadow-md transform hover:scale-105"
            aria-label={isMobile ? "Toggle mobile menu" : "Toggle sidebar"}
          >
            {isMobile ? (
              isMobileOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )
            ) : collapsed ? (
              <MenuUnfoldOutlined style={{ fontSize: "20px" }} />
            ) : (
              <MenuFoldOutlined style={{ fontSize: "20px" }} />
            )}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-md transform hover:scale-105"
          >
            <FaSignOutAlt className="mr-2" />
            <span className="text-sm font-medium">Log out</span>
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
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Sidebar;
