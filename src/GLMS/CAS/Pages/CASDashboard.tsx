import React from "react";
import { useNavigate } from "react-router-dom";
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
    path: "customer-id-creation",
    title: "Customer ID Creation",
    description:
      "Generate unique customer ID and link it to the Core Banking System (CBS)",
    icon: <Users className="text-indigo-600 w-6 h-6" />,
  },
  {
    path: "co-applicant-linking",
    title: "Co-applicant & Guarantor Linking",
    description:
      "Upload and link KYC/supporting documents for co-applicants or guarantors",
    icon: <FileText className="text-green-600 w-6 h-6" />,
  },
  {
    path: "customer-id-loan-link",
    title: "Customer ID to Loan Linking",
    description:
      "Map customer ID to the loan application for tracking and verification",
    icon: <UserCheck className="text-blue-500 w-6 h-6" />,
  },
  {
    path: "loan-appraisal",
    title: "Loan Appraisal System",
    description: "Perform customer credit scoring and financial appraisal",
    icon: <TrendingUp className="text-purple-500 w-6 h-6" />,
  },
  {
    path: "loan-assessment",
    title: "Loan Assessment Workflow",
    description: "Capture loan application and perform preliminary checks",
    icon: <Edit className="text-red-500 w-6 h-6" />,
  },
  {
    path: "recommendation-workflow",
    title: "Recommendation & Sanction Letter",
    description: "Review loan details and generate sanction recommendations",
    icon: <FileSignature className="text-yellow-600 w-6 h-6" />,
  },
  {
    path: "risk-analysis-upload",
    title: "Risk Analysis Documentation",
    description: "Upload signed agreements and perform risk validation",
    icon: <Upload className="text-cyan-600 w-6 h-6" />,
  },
  {
    path: "sanction-disbursement",
    title: "Sanction & Customer Response Tracking",
    description: "Track sanction status and customer acknowledgments",
    icon: <Truck className="text-orange-500 w-6 h-6" />,
  },
  {
    path: "loan-repayment-schedule",
    title: "Repayment Schedule Generation",
    description: "Generate EMI schedule and repayment tracking data",
    icon: <Calendar className="text-teal-500 w-6 h-6" />,
  },
  {
    path: "terms-conditions-workflow",
    title: "Terms & Conditions Approval",
    description: "Approve and manage loan terms and condition agreements",
    icon: <AlertTriangle className="text-pink-600 w-6 h-6" />,
  },
  {
    path: "asset-details-capture",
    title: "Asset Details Capture",
    description: "Record asset details offered as collateral or security",
    icon: <Headphones className="text-lime-500 w-6 h-6" />,
  },
  {
    path: "limit-check-profile-update",
    title: "Profile Update & Limit Check",
    description: "Update customer info and check applicable credit limits",
    icon: <XCircle className="text-rose-500 w-6 h-6" />,
  },
  {
    path: "account-closure-process",
    title: "Account Closure & Net Worth Analysis",
    description: "Initiate account closure and analyze party's net worth",
    icon: <XCircle className="text-gray-600 w-6 h-6" />,
  },
];

const CASDashboard: React.FC = () => {
  const navigate = useNavigate();
    const handleInterest =()=>{
       message.warning("Please login to submit your interest.");
         sessionStorage.setItem("submitclicks", "true");
        navigate("/whatsappregister");
        sessionStorage.setItem(
          "redirectPath",
          `/main/services/campaign/a6b5`
        );
    }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="relative mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Customer Acquisition System - Use Cases
        </h1>
        <button
          onClick={handleInterest}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-5 rounded-lg transition hover:scale-105"
        >
          I'm Interested
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
        {useCases.map((useCase) => (
          <div
            key={useCase.path}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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

            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <button
                className="text-sm px-3 py-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
                onClick={() => navigate(`/cas/${useCase.path}/business`)}
              >
                Business Use Case
              </button>
              <button
                className="text-sm px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                onClick={() => navigate(`/cas/${useCase.path}/system`)}
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

export default CASDashboard;
