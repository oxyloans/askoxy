// // src/BharathAIStore/components/AppShell.tsx
// // UPDATED: unified mobile drawer + header trigger; removed floating button

// import React, { useState } from "react";
// import { useLocation } from "react-router-dom";
// import DashboardHeader from "../components/DashboardHeader";
// import SideNav from "../components/SideNav"; // <-- use shared SideNav
// import { FaUsers } from "react-icons/fa";
// import { FaPlus } from "react-icons/fa6";

// interface AppShellProps {
//   children?: React.ReactNode;
//   allAgentsHref?: string;
//   createAgentHref?: string;
// }

// const AppShell: React.FC<AppShellProps> = ({
//   children,
//   allAgentsHref = "/bharath-aistore/agents",
//   createAgentHref = "/bharat-expert",
// }) => {
//   const [open, setOpen] = useState(false);
//   const { pathname } = useLocation();


//   return (
//    <div className={`min-h-screen flex flex-col ${pathname === "/bharat-expert" ? "bg-transparent" : "bg-slate-50"}`}>
//       {/* Sticky header with mobile hamburger */}
//       <DashboardHeader onOpenMenu={() => setOpen(true)} />

//       <div className="flex flex-1">
//         {/* Desktop sidebar rail */}
//         <SideNav
//           // desktop rail is automatically shown inside SideNav
//           isOpen={open}
//           onClose={() => setOpen(false)}
//           allAgentsHref={allAgentsHref}
//           createAgentHref={createAgentHref}
//         />

//         {/* Main content */}
//         <main className="flex-1 min-w-0 p-4 md:p-6">{children}</main>
//       </div>
//     </div>
//   );
// };

// export default AppShell;
const AppShell = () =>
{
  return (
    <div>
      <h1>hi</h1>
</div>
  )
}
export default AppShell;