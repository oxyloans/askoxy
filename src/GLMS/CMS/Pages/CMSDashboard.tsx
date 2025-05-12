import React from "react";
import { Link ,useNavigate} from "react-router-dom";
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

const useCases = [
  {
    path: "allocation-hold",
    title: "Hold Allocation",
    description: "Place delinquent cases on hold based on predefined rules.",
    icon: <Users className="text-indigo-600 w-7 h-7" />,
  },
  {
    path: "define-allocation-contract",
    title: "Define Allocation Contract",
    description: "Upload and manage contracts for delinquent case allocation.",
    icon: <FileText className="text-green-600 w-7 h-7" />,
  },
  {
    path: "manual-allocation",
    title: "Manual Case Allocation",
    description: "Manually assign delinquent cases to collection agents.",
    icon: <UserCheck className="text-blue-500 w-7 h-7" />,
  },
  {
    path: "manual-reallocation",
    title: "Reallocate Cases",
    description:
      "Reassign cases based on collector availability and performance.",
    icon: <TrendingUp className="text-purple-500 w-7 h-7" />,
  },
  {
    path: "bod-process",
    title: "Start-of-Day Process",
    description: "Initialize and prepare daily queue for collections.",
    icon: <Edit className="text-red-500 w-7 h-7" />,
  },
  {
    path: "define-queue",
    title: "Queue Classification",
    description: "Create and manage delinquent case queues.",
    icon: <FileSignature className="text-yellow-600 w-7 h-7" />,
  },
  {
    path: "contact-recording",
    title: "Contact Logging",
    description: "Record contact attempts and customer communication logs.",
    icon: <Upload className="text-cyan-600 w-7 h-7" />,
  },
  {
    path: "legal-collections",
    title: "Legal Action Workflow",
    description: "Initiate and track legal recovery processes.",
    icon: <Truck className="text-orange-500 w-7 h-7" />,
  },
  {
    path: "prioritize-queue",
    title: "Queue Prioritization",
    description: "Set priority for follow-up based on risk and aging.",
    icon: <Calendar className="text-teal-500 w-7 h-7" />,
  },
  {
    path: "communication-mapping",
    title: "Queue Communications",
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
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        📊 Collection Management System
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Manage delinquent case workflows, queues, communications, and legal
        proceedings from one central dashboard.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {useCases.map((useCase) => (
          <div
            key={useCase.path}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-lg hover:border-indigo-400 transition duration-200 ease-in-out"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-gray-100">{useCase.icon}</div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {useCase.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {useCase.description}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-between gap-2">
              <button
                className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                onClick={() => navigate(`/cms/${useCase.path}/business`)}
              >
                Business Use Case
              </button>
              <button
                className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
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
