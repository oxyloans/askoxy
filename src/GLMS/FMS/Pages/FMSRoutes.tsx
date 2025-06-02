// pages/CASRouteRenderer.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFMSRoutes } from "../Routes/useFMSRoutes";
import { message } from "antd";

const FMSRouteRenderer: React.FC = () => {
  const { useCaseId, type } = useParams<{ useCaseId: string; type: string }>();
  const useCase = useFMSRoutes[useCaseId || ""];
  const navigate = useNavigate();
  
  const handleFMSClick = () => (window.location.href = "/fms");

  if (!useCase || (type !== "business" && type !== "system")) {
    return (
      <div className="text-red-600 text-center mt-8">
        Invalid use case or type
      </div>
    );
  }
    
    const handleInterest = () => {
       const userId = localStorage.getItem("userId");
       if (userId) {
         sessionStorage.setItem("submitclicks", "true");
         navigate("/main/services/campaign/a6b5");
       } else {
         message.warning("Please login to submit your interest.");
         sessionStorage.setItem("submitclicks", "true");
         navigate("/whatsappregister");
         sessionStorage.setItem("redirectPath", "/main/services/campaign/a6b5");
       }
     };
  const SelectedComponent = useCase[type];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm px-4 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 text-center sm:text-left">
            {useCase.title} –{" "}
            <span className="font-normal text-gray-600">
              {type === "business" ? "Business Use Case" : "System Use Case"}
            </span>
          </h2>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleFMSClick}
              className="bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
            >
              Go To FMS
            </button>
            <button
              onClick={handleInterest}
              className="bg-green-100 text-green-700 rounded hover:bg-green-200 px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            >
              I'm Interested
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto  p-4 sm:p-6">{SelectedComponent}</div>
      </main>
    </div>
  );
};

export default FMSRouteRenderer;
