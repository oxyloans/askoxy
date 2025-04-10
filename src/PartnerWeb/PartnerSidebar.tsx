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
} from "@ant-design/icons";

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
      key: "/home/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/home/newOrders",
      icon: <ShoppingCartOutlined />,
      label: "New Orders",
    },
    {
      key: "/home/acceptedOrders",
      icon: <CheckOutlined />,
      label: "Accepted Orders",
    },
    {
      key: "/home/AssignedOrders",
      icon: <TruckOutlined />,
      label: "Assigned Orders",
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
      key: "/home/scan-qr",
      icon: <QrcodeOutlined />,
      label: "Scan QR",
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    if (onItemClick) onItemClick();
    navigate(e.key);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.clear();
    navigate("/partnerLogin");
  };

  return (
    <div className="flex flex-col h-full">
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={handleMenuClick}
        inlineCollapsed={isCollapsed}
        className="flex-1 p-1 pt-1 bg"
      >
        {sidebarItems.map((item) => (
          <Menu.Item key={item.key} icon={item.icon} className="mb-2">
            {item.label}
          </Menu.Item>
        ))}
      </Menu>

      {/* Logout Section */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center text-red-500 hover:bg-red-50 p-1 rounded"
        >
          <LogoutOutlined className="mr-2" />
          {!isCollapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
