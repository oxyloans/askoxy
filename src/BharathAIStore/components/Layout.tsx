// import React, { useState, useEffect, ReactNode } from "react";
// import { Layout, Menu, Row, Grid } from "antd";
// import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
// import { Link, useNavigate } from "react-router-dom";
// import { MdLogout, MdInventory } from "react-icons/md";
// import {
//   FaUserGraduate,
//   FaTachometerAlt,
//   FaSlideshare,
//   FaHandsHelping,
// } from "react-icons/fa";
// import Logo from "../../assets/img/bharatAI.png";

// const { Header, Sider, Content, Footer } = Layout;
// const { useBreakpoint } = Grid;

// interface SidebarItem {
//   key: string;
//   label: string;
//   icon: ReactNode;
//   link?: string;
//   dropdownItems?: {
//     key: string;
//     label: string;
//     link: string;
//     icon?: ReactNode;
//   }[];
// }

// interface AdminPanelLayoutTestProps {
//   children: ReactNode;
// }

// const BharathAIStoreLayout: React.FC<AdminPanelLayoutTestProps> = ({
//   children,
// }) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [openKeys, setOpenKeys] = useState<string[]>([]);
//   const screens = useBreakpoint();
//   const navigate = useNavigate();

//   useEffect(() => {
//     setCollapsed(!!screens.xs); // Collapse on xs, expand otherwise
//   }, [screens]);

//   const sidebarItems: SidebarItem[] = [
//     {
//       key: "Agents Dashboard",
//       label: "Dashboard",
//       icon: <FaTachometerAlt />,
//       link: "/bharat-expert",
//     },
//     {
//       key: "My Agents",
//       label: "My Agents",
//       icon: <FaHandsHelping />,
//       link: "/bharath-aistore/agents",
//     },
//   ];

//   const toggleCollapse = () => setCollapsed((prev) => !prev);
//   const handleOpenChange = (keys: string[]) =>
//     setOpenKeys(keys.length ? [keys.pop()!] : []);
//   const handleSignOut = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     navigate("/bharath-aistore");
//   };

//   const fullYear = new Date().getFullYear();

//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       <Sider
//         collapsed={collapsed}
//         onCollapse={setCollapsed}
//         breakpoint="md"
//         width={screens.xs ? 200 : 240}
//         collapsedWidth={screens.xs ? 0 : 80}
//         style={{
//           backgroundColor: "#1A202C", // Sidebar background color
//           zIndex: 1000,
//           // left: collapsed ? (isMobile ? "-200px" : "-80px") : 0,
//           left: 0,
//           top: 0,
//           transition: "left 0.3s ease-in-out", // Smoother transition
//           position: "fixed",
//           height: "100vh",
//           overflowY: "auto",
//         }}
//       >
//         <div className="demo-logo-vertical" style={{ padding: "10px 0" }}>
//           <Row justify="center" align="middle">
//             <div style={{ fontSize: 24 }}>
//               <Link to="/bharath-aistore" style={{ textDecoration: "none" }}>
//                 <img
//                   src={Logo}
//                   alt="BHARAT AI"
//                   style={{ height: screens.xs ? 32 : 36, display: "block" }}
//                 />
//               </Link>
//             </div>
//           </Row>
//         </div>
        
//         <Menu
//          theme="light"
//           mode="inline"
//           openKeys={openKeys}
//           onOpenChange={handleOpenChange}
//           style={{
//             color: "#A7B1C2",
//           }}
//         >
//           {sidebarItems.map((item) =>
//             item.dropdownItems ? (
//               <Menu.SubMenu
//                 key={item.key}
//                 icon={item.icon}
//                 title={
//                   <span className={` ${collapsed ? "hidden" : "inline"}`}>
//                     {item.label}
//                   </span>
//                 }
//                 className="text-white hover:bg-black hover:text-black"
//               >
//                 {item.dropdownItems.map((dropdownItem) => (
//                   <Menu.Item
//                     key={dropdownItem.key}
//                     className="bg-gray-800 text-white hover:bg-black hover:text-white" // Unified background and hover behavior
//                   >
//                     <Link
//                       to={dropdownItem.link}
//                       className="flex items-center text-white hover:text-black no-underline"
//                     >
//                       {/* Ensure icon is rendered correctly */}
//                       <span className="mr-1 text-white hover:text-black">
//                         {dropdownItem.icon}{" "}
//                         {/* icon should be a valid JSX element */}
//                       </span>
//                       <span className="hover:text-black">
//                         {dropdownItem.label}
//                       </span>
//                     </Link>
//                   </Menu.Item>
//                 ))}
//               </Menu.SubMenu>
//             ) : (
//               <Menu.Item
//                 key={item.key}
//                 className="text-white" // Remove background on hover
//               >
//                 <Link
//                   to={item.link ?? ""}
//                   className="flex items-center text-white hover:text-black no-underline"
//                 >
//                   <span className=" hover:text-black">{item.icon}</span>
//                   <span
//                     className={`ml-2 ${
//                       collapsed ? "hidden" : "inline"
//                     } hover:text-black`}
//                   >
//                     {item.label}
//                   </span>
//                 </Link>
//               </Menu.Item>
//             )
//           )}
//         </Menu>
//       </Sider>

//       <Layout>
//         <Header
//                  style={{
//                    padding: screens.xs ? "0 12px" : "0 18px",
//                    background: "#fff",
//                    display: "flex",
//                    justifyContent: "space-between",
//                    alignItems: "center",
//                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
//                    width: screens.xs
//                      ? "100%"
//                      : `calc(100% - ${collapsed ? "80px" : "240px"})`,
//                    marginLeft: screens.xs ? "0px" : collapsed ? "80px" : "240px",
//                    position: "fixed",
//                    top: 0,
//                    zIndex: 9,
//                    height: 64, // Ensure it's positioned correctly
//                  }}
//                >
//                  <button
//                    onClick={toggleCollapse}
//                    style={{
//                      background: "none",
//                      border: "none",
//                      cursor: "pointer",
//                      fontSize: "18px",
//                      color: "#1AB394",
//                    }}
//                  >
//                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//                  </button>
       
//                  <div
//                    onClick={handleSignOut}
//                    style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
//                  >
//                    <MdLogout
//                      style={{ marginRight: "8px", color: "#999C9E", fontSize: "14px" }}
//                    />
//                    <span style={{ color: "#999C9E", fontSize: "14px" }}>Log out</span>
//                  </div>
//                </Header>
//         <Content
//           style={{
//             margin: screens.xs
//               ? "80px 16px 16px"
//               : `80px 16px 16px ${collapsed ? "80px" : "240px"}`,
//             padding: screens.xs ? 12 : 24,

//             width: screens.xs
//               ? "100%"
//               : `calc(100% - ${collapsed ? "80px" : "240px"})`,
//             marginLeft: screens.xs ? "0px" : collapsed ? "80px" : "240px",
//             position: "relative",
//           }}
//         >
//           {children}
//         </Content>

//         <Footer
//           style={{
//             textAlign: "center",
//             background: "#fff",
//             width: screens.xs
//               ? "100%"
//               : `calc(100% - ${collapsed ? "80px" : "240px"})`,
//             marginLeft: screens.xs ? "0px" : collapsed ? "80px" : "240px",
//             position: "relative",
//             bottom: 0,
//           }}
//         >
//           BHARAT AI STORE ©{fullYear} Created by ASKOXY.AI Company
//         </Footer>
//       </Layout>

//       {/* Color + hover overrides to match gray-50 / gray-700 / hover gray-100 */}
//       <style>{`
//         /* Sidebar & menu base */
//         .ant-layout-sider { background: #F9FAFB !important; }
//         .ant-menu,
//         .ant-menu-sub,
//         .ant-menu-inline,
//         .ant-menu-vertical {
//           background: #F9FAFB !important;
//           color: #374151 !important; /* gray-700 */
//         }

//         /* Items and titles color */
//         .ant-menu-item,
//         .ant-menu-submenu-title {
//           color: #374151 !important; /* gray-700 */
//         }

//         /* Icons color */
//         .ant-menu-item .anticon,
//         .ant-menu-submenu-title .anticon {
//           color: #374151 !important;
//         }

//         /* Links inside items */
//         .ant-menu-item a,
//         .ant-menu-submenu-title a {
//           color: #374151 !important;
//         }

//         /* Hover states: keep text same, change bg */
//         .ant-menu-item:hover,
//         .ant-menu-submenu-title:hover {
//           background: #F3F4F6 !important; /* gray-100 */
//           color: #374151 !important;
//         }

//         /* Selected state: soft bg, same text color */
//         .ant-menu-item-selected,
//         .ant-menu-submenu-selected > .ant-menu-submenu-title {
//           background: #F3F4F6 !important; /* gray-100 */
//           color: #374151 !important;
//         }
//         .ant-menu-item-selected a {
//           color: #374151 !important;
//         }

//         /* Scrollbars tuned to light palette */
//         .ant-menu::-webkit-scrollbar,
//         .ant-layout-sider::-webkit-scrollbar {
//           width: 5px;
//         }
//         .ant-menu::-webkit-scrollbar-track,
//         .ant-layout-sider::-webkit-scrollbar-track {
//           background: #F9FAFB;
//         }
//         .ant-menu::-webkit-scrollbar-thumb,
//         .ant-layout-sider::-webkit-scrollbar-thumb {
//           background-color: #D1D5DB; /* gray-300 */
//           border-radius: 10px;
//         }
//       `}</style>
//     </Layout>
//   );
// };

// export default BharathAIStoreLayout;




// src/.../Layout.tsx
import React, { useState, useEffect, ReactNode } from "react";
import { Layout, Menu, Row, Grid } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import {
  FaHandsHelping,
  FaTachometerAlt,
} from "react-icons/fa";
import Logo from "../../assets/img/bharatAI.png";

const { Header, Sider, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

interface SidebarItem {
  key: string;
  label: string;
  icon: ReactNode;
  link?: string;
  dropdownItems?: {
    key: string;
    label: string;
    link: string;
    icon?: ReactNode;
  }[];
}

interface AdminPanelLayoutTestProps {
  children: ReactNode;
}

const BharathAIStoreLayout: React.FC<AdminPanelLayoutTestProps> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);      // desktop collapse (md+)
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);    // mobile slide-in
  const screens = useBreakpoint();
  const navigate = useNavigate();

  const isMobile = !screens.md; // xs/sm = mobile, md+ = desktop/tablet

  useEffect(() => {
    // On desktop, keep a compact collapsed state if you prefer; on mobile, sidebar is overlay
    setCollapsed(false);
    setMobileOpen(false);
  }, [isMobile]);

  const sidebarItems: SidebarItem[] = [
    {
      key: "agents dashboard",
      label: "Agents Dashboard",
      icon: <FaTachometerAlt />,
      link: "/bharat-expert",
    },
    {
      key: "my-agents",
      label: "My Agents",
      icon: <FaHandsHelping />,
      link: "/bharath-aistore/agents",
    },
  ];

  const handleOpenChange = (keys: string[]) =>
    setOpenKeys(keys.length ? [keys.pop()!] : []);

  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/bharath-aistore");
  };

  const fullYear = new Date().getFullYear();
  const siderWidth = 240;
  const siderCollapsedWidth = 80;

  // Styles shared
  const menuItemTextStyle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: isMobile ? 14 : 15,
  };
  const iconStyle: React.CSSProperties = { fontSize: 18, lineHeight: 0 };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Backdrop for mobile when sidebar is open */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 998,
          }}
        />
      )}

      {/* SIDEBAR */}
      <Sider
        // For desktop: pinned; For mobile: slide from left
        width={siderWidth}
        collapsedWidth={isMobile ? 0 : siderCollapsedWidth}
        collapsed={!isMobile && collapsed}
        onCollapse={(val) => !isMobile && setCollapsed(val)}
        breakpoint="md"
        style={{
          backgroundColor: "#F9FAFB",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 999,
          boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 12px 20px rgba(0,0,0,0.06)",
          transform: isMobile
            ? mobileOpen
              ? "translateX(0)"
              : "translateX(-100%)"
            : "translateX(0)",
          transition: "transform 0.28s ease",
          overflow: "hidden",
        }}
      >
        {/* Top row: Logo + Close (X) on mobile */}
        {/* <div
          style={{
            padding: "15px 12px 11px",
            borderBottom: "1px solid #EEF0F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <Link
            to="/bharath-aistore"
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            onClick={() => isMobile && setMobileOpen(false)}
          >
            <img
              src={Logo}
              alt="BHARAT AI"
              style={{ height: 36, display: "block" }}
            />
          </Link>

          {isMobile && (
            <button
              aria-label="Close sidebar"
              onClick={() => setMobileOpen(false)}
              style={{
                background: "transparent",
                border: 0,
                cursor: "pointer",
                padding: 6,
                borderRadius: 8,
              }}
            >
              <CloseOutlined style={{ fontSize: 18 }} />
            </button>
          )}
        </div> */}

        <div
          style={{
            padding: "15px 12px 11px",
            // borderBottom: "1px solid #EEF0F2",
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "space-between" : "center", // ✅ mobile: space-between, web: centered
            gap: 8,
          }}
        >
          <Link
            to="/bharath-aistore"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              ...(isMobile ? {} : { marginInline: "auto" }), // ✅ extra safety to keep centered on web
            }}
            onClick={() => isMobile && setMobileOpen(false)}
          >
            <img
              src={Logo}
              alt="BHARAT AI"
              style={{ height: 36, display: "block" }}
            />
          </Link>

          {isMobile && (
            <button
              aria-label="Close sidebar"
              onClick={() => setMobileOpen(false)}
              style={{
                background: "transparent",
                border: 0,
                cursor: "pointer",
                padding: 6,
                borderRadius: 8,
              }}
            >
              <CloseOutlined style={{ fontSize: 18 }} />
            </button>
          )}
        </div>

        <Menu
          theme="light"
          mode="inline"
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          style={{
            background: "#F9FAFB",
            padding: "8px 8px 16px",
          }}
          items={sidebarItems.map((item) => ({
            key: item.key,
            label: (
              <Link
                to={item.link ?? ""}
                onClick={() => isMobile && setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  color: "#111827",
                  textDecoration: "none",
                }}
              >
                <span style={iconStyle}>{item.icon}</span>
                {!(!isMobile && collapsed) && (
                  <span style={menuItemTextStyle}>{item.label}</span>
                )}
              </Link>
            ),
          }))}
        />
      </Sider>

      {/* MAIN SIDE (Header + Content + Footer) */}
      <Layout>
        <Header
          style={{
            padding: isMobile ? "0 12px" : "0 16px",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            position: "fixed",
            top: 0,
            zIndex: 9,
            height: 64,
            width: isMobile
              ? "100%"
              : `calc(100% - ${
                  !isMobile ? (collapsed ? siderCollapsedWidth : siderWidth) : 0
                }px)`,
            marginLeft: isMobile
              ? 0
              : collapsed
              ? siderCollapsedWidth
              : siderWidth,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Mobile hamburger (left) — hidden on md+ */}
            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              style={{
                background: "transparent",
                border: 0,
                cursor: "pointer",
                padding: 6,
                borderRadius: 8,
                display: isMobile ? "inline-flex" : "none",
              }}
            >
              <MenuOutlined style={{ fontSize: 20 }} />
            </button>

            {/* Desktop collapse toggle — hidden on mobile */}
            <button
              aria-label="Collapse sidebar"
              onClick={() => !isMobile && setCollapsed((p) => !p)}
              style={{
                background: "transparent",
                border: 0,
                cursor: "pointer",
                padding: 6,
                borderRadius: 8,
                display: isMobile ? "none" : "inline-flex",
                color: "#1AB394",
              }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
          </div>

          <div
            onClick={handleSignOut}
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <MdLogout
              style={{ marginRight: 8, color: "#6B7280", fontSize: 16 }}
            />
            <span style={{ color: "#6B7280", fontSize: 14, fontWeight: 600 }}>
              Log out
            </span>
          </div>
        </Header>

        <Content
          style={{
            marginTop: 80,
            padding: isMobile ? 12 : 24,
            background: "#fff",
            width: isMobile
              ? "100%"
              : `calc(100% - ${
                  collapsed ? siderCollapsedWidth : siderWidth
                }px)`,
            marginLeft: isMobile
              ? 0
              : collapsed
              ? siderCollapsedWidth
              : siderWidth,
            minHeight: "calc(100vh - 80px)",
          }}
        >
          {children}
        </Content>

        <Footer
          style={{
            textAlign: "center",
            background: "#F9FAFB ",
            width: isMobile
              ? "100%"
              : `calc(100% - ${
                  collapsed ? siderCollapsedWidth : siderWidth
                }px)`,
            marginLeft: isMobile
              ? 0
              : collapsed
              ? siderCollapsedWidth
              : siderWidth,
          }}
        >
          BHARAT AI STORE ©{fullYear} Created by ASKOXY.AI Company
        </Footer>
      </Layout>

      {/* Light theme & hover tweaks */}
      <style>{`
        .ant-menu,
        .ant-menu-sub,
        .ant-menu-inline,
        .ant-menu-vertical {
          background: #F9FAFB !important;
          color: #111827 !important;
        }
        .ant-menu-item,
        .ant-menu-submenu-title {
          color: #111827 !important;
          border-radius: 10px;
          height: 44px;
          display: flex;
          align-items: center;
        }
        .ant-menu-item:hover,
        .ant-menu-submenu-title:hover {
          background: #EEF2F7 !important;
          color: #111827 !important;
        }
        .ant-menu-item-selected,
        .ant-menu-submenu-selected > .ant-menu-submenu-title {
          background: #E5E7EB !important;
          color: #111827 !important;
        }
        /* Thin scrollbars */
        .ant-menu::-webkit-scrollbar,
        .ant-layout-sider::-webkit-scrollbar { width: 6px; }
        .ant-menu::-webkit-scrollbar-thumb,
        .ant-layout-sider::-webkit-scrollbar-thumb {
          background-color: #D1D5DB; border-radius: 10px;
        }
      `}</style>
    </Layout>
  );
};

export default BharathAIStoreLayout;
