// src/BharathAIStore/components/SideNav.tsx
// UPDATED: minor a11y + smoother drawer

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

interface SideNavProps {
  isOpen?: boolean;
  onClose?: () => void;
  allAgentsHref?: string;
  createAgentHref?: string;
}

const SideNav: React.FC<SideNavProps> = ({
  isOpen = false,
  onClose,
  allAgentsHref = "/bharath-aistore/agents",
  createAgentHref = "/bharat-expert",
}) => {
  const { pathname } = useLocation();

  const navItems = [
    {
      key: "all",
      label: "All Agents",
      href: allAgentsHref,
      icon: <FaUsers className="h-4 w-4" />,
      active: pathname.startsWith(allAgentsHref),
    },
    // {
    //   key: "create",
    //   label: "Create Agent",
    //   href: createAgentHref,
    //   icon: <FaPlus className="h-4 w-4" />,
    //   active: pathname.startsWith(createAgentHref),
    // },
  ];

  const List = (
    <nav className="p-3" role="navigation">

      <div className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.key}
            to={item.href}
            onClick={onClose}
            className={[
              "group flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
              item.active
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100 active:scale-[0.99]",
            ].join(" ")}
            aria-current={item.active ? "page" : undefined}
          >
            <span
              className={[
                "inline-flex items-center justify-center rounded-md p-1.5",
                item.active
                  ? "bg-slate-800 text-white"
                  : "bg-slate-200 text-slate-700 group-hover:bg-slate-300",
              ].join(" ")}
              aria-hidden="true"
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop rail (sticks below 64px header) */}
      <aside
        className="hidden md:flex md:flex-col md:w-64 md:shrink-0 md:border-r md:border-slate-200 md:bg-white md:sticky md:top-16 md:h-[calc(100vh-4rem)]"
        aria-label="Sidebar"
      >
        {List}
      </aside>

      {/* Mobile overlay */}
      <div
        className={[
          "fixed inset-0 z-50 bg-black/50 transition-opacity md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Mobile drawer */}
      <aside
        className={[
          "fixed z-50 top-0 left-0 h-full w-72 bg-white shadow-xl transition-transform md:hidden",
          "will-change-transform",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Sidebar drawer"
      >
        <div className="flex items-center justify-between px-4 h-16 border-b">
          <div className="text-base font-bold">Menu</div>
          <button
            onClick={onClose}
            className="rounded-md p-2 hover:bg-slate-100"
            aria-label="Close sidebar"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {List}
      </aside>
    </>
  );
};

export default SideNav;
