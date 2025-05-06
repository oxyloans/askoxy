import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import {
  ShoppingCartOutlined,
  CheckOutlined,
  TruckOutlined,
  UnorderedListOutlined,
  UserOutlined,
  InboxOutlined,
  QuestionCircleOutlined,
  QrcodeOutlined,
  LogoutOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { FaComments } from "react-icons/fa";

interface SidebarProps {
  isCollapsed: boolean;
  onCollapse: () => void;
  onItemClick?: () => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onCollapse,
  onItemClick,
  isMobile,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarItems = [
    {
      key: "/home",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/home/newOrders/1",
      icon: <ShoppingCartOutlined />,
      label: "New Orders",
    },
    {
      key: "/home/acceptedOrders/2",
      icon: <CheckOutlined />,
      label: "Accepted Orders",
    },
    {
      key: "/home/AssignedOrders/3",
      icon: <TruckOutlined />,
      label: "Assigned Orders",
    },
    {
      key: "/home/exchangeorders",
      icon: <RetweetOutlined />,
      label: "Exchange Orders",
    },
    {
      key: "/home/allOrders",
      icon: <UnorderedListOutlined />,
      label: "All Orders",
    },
    {
      key: "/home/dbList",
      icon: <UserOutlined />,
      label: "Delivery Boy List",
    },
    {
      key: "/home/itemsList",
      icon: <InboxOutlined />,
      label: "Items List",
    },
    {
      key: "/home/queryManagement",
      icon: <QuestionCircleOutlined />,
      label: "All Queries",
    },
    {
      key: "/home/feedback",
      icon: <FaComments />,
      label: "User Feedback",
    },
    {
      key: "/home/scan-qr",
      icon: <QrcodeOutlined />,
      label: "Scan QR",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.clear();
    navigate("/partnerLogin");
  };

  return (
    <div className="relative h-full flex flex-col bg-white overflow-x-hidden">
      <div className="flex justify-end items-center p-2 py-2">
        <button
          onClick={onCollapse}
          className={`pt-4 rounded-lg bg-gray-50 hover:bg-purple-50
            transition-all duration-300 hidden md:flex items-center justify-center
            ${isCollapsed ? "mx-auto" : ""}`}
        >
          {isCollapsed ? (
            <MenuUnfoldOutlined className="text-purple-600" />
          ) : (
            <MenuFoldOutlined className="text-purple-600" />
          )}
        </button>
      </div>

      {/* Menu area with proper scrolling */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-1 space-y-0.5">
        {sidebarItems.map((item, index) => {
          const isActive = location.pathname === item.key;
          return (
            <div
              key={index}
              onClick={() => {
                if (onItemClick) onItemClick();
                navigate(item.key);
              }}
              className={`relative flex items-center rounded-xl transition-all duration-200 cursor-pointer
                ${
                  isCollapsed
                    ? "w-10 min-h-10 h-auto sm:h-10 md:h-10 justify-center"
                    : "min-h-10 h-auto sm:h-10 md:h-10 px-4"
                }
                ${
                  isActive
                    ? "bg-purple-50 before:absolute before:w-1 before:h-4 before:bg-purple-600 before:rounded-full before:left-0 before:top-2"
                    : "hover:bg-gray-50"
                }
                group`}
            >
              <div
                className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}
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
                    className={`font-medium whitespace-nowrap text-sm z-10
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
                  className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-5 py-2 
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
            </div>
          );
        })}
      </div>

      {/* Fixed bottom section */}
      <div className="mt-auto px-3 py-3 border-t">
        <div
          onClick={handleLogout}
          className={`relative flex items-center rounded-xl transition-all duration-200
            hover:bg-red-50 min-h-10 h-auto sm:h-10 md:h-10 cursor-pointer
            ${isCollapsed ? "w-10 justify-center" : "px-4"}
            group`}
        >
          <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
            <span className="text-red-500 flex items-center justify-center">
              <LogoutOutlined />
            </span>

            {!isCollapsed && (
              <span className="text-red-500 font-medium text-sm">Sign Out</span>
            )}
          </div>

          {isCollapsed && (
            <div
              className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-5 py-2 
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
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
