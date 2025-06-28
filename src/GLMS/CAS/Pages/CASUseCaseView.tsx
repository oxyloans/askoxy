import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "react-feather";
import { useCaseRoutes } from "../Routes/useCaseRoutes";// Your existing routes file

const CASUseCaseView = () => {
  const { useCasePath, viewType } = useParams(); // viewType is 'business' or 'system'
  const navigate = useNavigate();

  const useCase = useCasePath ? useCaseRoutes[useCasePath] : undefined;

  if (!useCase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Use Case Not Found
          </h1>
          <button
            onClick={() => navigate("/cas")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const ComponentToRender =
    viewType === "business" ? useCase.business : useCase.system;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/cas/${useCasePath}/details`)}
                className="flex items-center text-gray-600 hover:text-gray-800 transition"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Details
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => navigate("/cas")}
                className="flex items-center text-gray-600 hover:text-gray-800 transition"
              >
                <Home size={16} className="mr-2" />
                Dashboard
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  viewType === "business"
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {viewType === "business" ? "Business View" : "System View"}
              </span>

              <button
                onClick={() =>
                  navigate(
                    `/cas/${useCasePath}/${
                      viewType === "business" ? "system" : "business"
                    }`
                  )
                }
                className={`px-4 py-2 rounded-lg transition ${
                  viewType === "business"
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                }`}
              >
                Switch to {viewType === "business" ? "System" : "Business"} View
              </button>
            </div>
          </div>

          <div className="mt-3">
            <h1 className="text-xl font-semibold text-gray-900">
              {useCase.title} -{" "}
              {viewType === "business" ? "Business" : "System"} Use Case
            </h1>
          </div>
        </div>
      </div>

      {/* Component Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm min-h-[600px]">
          {ComponentToRender}
        </div>
      </div>
    </div>
  );
};

export default CASUseCaseView;
