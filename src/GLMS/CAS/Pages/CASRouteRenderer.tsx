import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCaseRoutes } from "../Routes/useCaseRoutes";
import { message } from "antd";

const CASRouteRenderer: React.FC = () => {
  const { useCaseId, type } = useParams<{ useCaseId: string; type: string }>();
  const useCase = useCaseRoutes[useCaseId || ""];
  const navigate = useNavigate();

  if (!useCase || (type !== "business" && type !== "system")) {
    return (
      <div className="text-red-600 text-center mt-8">
        Invalid use case or type
      </div>
    );
  }
  const handleInterest =()=>{
       message.warning("Please login to submit your interest.");
         sessionStorage.setItem("submitclicks", "true");
        navigate("/whatsappregister");
        sessionStorage.setItem(
          "redirectPath",
          `/main/services/campaign/a6b5`
        );
    }

  const SelectedComponent = useCase[type];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-700">
          {useCase.title} -{" "}
          {type === "business" ? "Business Use Case" : "System Use Case"}
        </h2>
        <button
          onClick={handleInterest}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-5 rounded-lg transition hover:scale-105"
        >
          I'm Interested
        </button>
      </div>  
      {SelectedComponent}
    </div>
  );
};

export default CASRouteRenderer;
