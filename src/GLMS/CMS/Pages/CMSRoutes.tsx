// pages/CASRouteRenderer.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { useCMSRoutes } from "../Routes/useCmsRoutes";

const CMSRouteRenderer: React.FC = () => {
  const { useCaseId } = useParams<{ useCaseId: string }>();
  const useCase = useCMSRoutes[useCaseId || ""];

  if (!useCase) {
    return (
      <div className="text-red-600 text-center mt-8">Invalid use case</div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">{useCase.title}</h2>
      {useCase.component}
    </div>
  );
};

export default CMSRouteRenderer;
