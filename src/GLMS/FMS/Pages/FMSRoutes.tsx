// pages/CASRouteRenderer.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { useFMSRoutes } from "../Routes/useFMSRoutes";

const FMSRouteRenderer: React.FC = () => {
  const { useCaseId, type } = useParams<{ useCaseId: string; type: string }>();
  const useCase = useFMSRoutes[useCaseId || ""];

  if (!useCase || (type !== "business" && type !== "system")) {
    return <div className="text-red-600 text-center mt-8">Invalid use case or type</div>;
  }

  const SelectedComponent = useCase[type];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        {useCase.title} - {type === "business" ? "Business Use Case" : "System Use Case"}
      </h2>
      {SelectedComponent}
    </div>
  );
};

export default FMSRouteRenderer;
