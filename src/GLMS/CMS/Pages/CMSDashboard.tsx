import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  UserCheck,
  TrendingUp,
  Edit,
  FileSignature,
  Upload,
  Truck,
  Calendar,
  AlertTriangle,
  Headphones,
  XCircle,
} from "lucide-react";
import { message } from "antd";

const useCases = [
  {
    path: "allocation-hold",
    title: "Allocation of Delinquent Cases_Allocation Hold",
    description: "Place delinquent cases on hold based on predefined rules.",
    icon: <Users className="text-indigo-600 w-7 h-7" />,
  },
  {
    path: "define-allocation-contract",
    title: "Allocation of Delinquent Cases_Define Allocation contract",
    description: "Upload and manage contracts for delinquent case allocation.",
    icon: <FileText className="text-green-600 w-7 h-7" />,
  },
  {
    path: "manual-allocation",
    title: "Allocation of Delinquent Cases_Manual Allocation",
    description: "Manually assign delinquent cases to collection agents.",
    icon: <UserCheck className="text-blue-500 w-7 h-7" />,
  },
  {
    path: "manual-reallocation",
    title: "Allocation of Delinquent Cases_Manual Reallocation",
    description:
      "Reassign cases based on collector availability and performance.",
    icon: <TrendingUp className="text-purple-500 w-7 h-7" />,
  },
  {
    path: "bod-process",
    title: "Beginning of Day Process",
    description: "Initialize and prepare daily queue for collections.",
    icon: <Edit className="text-red-500 w-7 h-7" />,
  },
  {
    path: "define-queue",
    title: "Classification of Delinquent Cases - Define Queue",
    description: "Create and manage delinquent case queues.",
    icon: <FileSignature className="text-yellow-600 w-7 h-7" />,
  },
  {
    path: "contact-recording",
    title: "Contact Recording",
    description: "Record contact attempts and customer communication logs.",
    icon: <Upload className="text-cyan-600 w-7 h-7" />,
  },
  {
    path: "legal-collections",
    title: "Legal Collections Workflow",
    description: "Initiate and track legal recovery processes.",
    icon: <Truck className="text-orange-500 w-7 h-7" />,
  },
  {
    path: "prioritize-queue",
    title: "Prioritizing a Queue",
    description: "Set priority for follow-up based on risk and aging.",
    icon: <Calendar className="text-teal-500 w-7 h-7" />,
  },
  {
    path: "communication-mapping",
    title: "Queue Communication Mapping",
    description: "Assign communication templates to specific queues.",
    icon: <AlertTriangle className="text-pink-600 w-7 h-7" />,
  },
  {
    path: "queue-curing",
    title: "Queue Curing",
    description: "Monitor and track cured accounts from delinquency.",
    icon: <Headphones className="text-lime-500 w-7 h-7" />,
  },
  {
    path: "work-plan",
    title: "Collector Work Plan",
    description: "Design and track daily plans for collection agents.",
    icon: <XCircle className="text-rose-500 w-7 h-7" />,
  },
];

const CMSDashboard: React.FC = () => {
    const navigate = useNavigate();
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
  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
      <div className="relative mb-10 flex flex-col sm:flex-row items-center justify-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left text-gray-800">
          Collection Management System - Use Cases
        </h1>
        <button
          onClick={handleInterest}
          className="mt-4 sm:mt-0 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-5 rounded-lg transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          I'm Interested
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {useCases.map((useCase) => (
          <div
            key={useCase.path}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out flex flex-col justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-gray-100 flex items-center justify-center">
                {useCase.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {useCase.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {useCase.description}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                className="w-full sm:w-auto px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
                onClick={() => navigate(`/cms/${useCase.path}/business`)}
              >
                Business Use Case
              </button>
              <button
                className="w-full sm:w-auto px-4 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                onClick={() => navigate(`/cms/${useCase.path}/system`)}
              >
                System Use Case
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



export default CMSDashboard;
