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
  XCircle
} from "lucide-react";

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

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        Customer Acquisition System - Use Cases
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                onClick={() => navigate(`/cas/${useCase.path}/business`)}
              >
                Business Use Case
              </button>
              <button
                className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
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
