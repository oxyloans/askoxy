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
    path: "asset-details",
    title: "Asset Details",
    description: "Manage and monitor asset-related case information.",
    icon: <Users className="text-indigo-600 w-7 h-7" />,
  },
  {
    path: "allocation-contract",
    title: "Allocation Contract",
    description: "Define and upload contracts for allocation processes.",
    icon: <FileText className="text-green-600 w-7 h-7" />,
  },
  {
    path: "installment-prepayment",
    title: "Installment Prepayment",
    description: "Handle early repayments and installment adjustments.",
    icon: <UserCheck className="text-blue-500 w-7 h-7" />,
  },
  {
    path: "case-reallocation",
    title: "Case Reallocation",
    description: "Reassign collection tasks based on team availability.",
    icon: <TrendingUp className="text-purple-500 w-7 h-7" />,
  },
  {
    path: "npa-provisioning",
    title: "NPA Provisioning",
    description: "Process provisioning for non-performing assets.",
    icon: <Edit className="text-red-500 w-7 h-7" />,
  },
  {
    path: "settlement-knockoff",
    title: "Settlements - Knock Off",
    description: "Record settlements and update outstanding balances.",
    icon: <FileSignature className="text-yellow-600 w-7 h-7" />,
  },
  {
    path: "cheque-processing",
    title: "Cheque Processing",
    description: "Manage cheque-based settlements and payments.",
    icon: <Upload className="text-cyan-600 w-7 h-7" />,
  },
  {
    path: "settlement-advisory",
    title: "Settlement Advisory",
    description: "Provide manual advisory for payment settlements.",
    icon: <Truck className="text-orange-500 w-7 h-7" />,
  },
  {
    path: "foreclosure-management",
    title: "Foreclosure Management",
    description: "Handle early closure and foreclosure of loans.",
    icon: <Calendar className="text-teal-500 w-7 h-7" />,
  },
  {
    path: "finance-viewer",
    title: "Finance Viewer",
    description: "View financial metrics and account overviews.",
    icon: <AlertTriangle className="text-pink-600 w-7 h-7" />,
  },
  {
    path: "floating-review",
    title: "Floating Review Process",
    description: "Manage reviews for floating-rate financial products.",
    icon: <Headphones className="text-lime-500 w-7 h-7" />,
  },
  {
    path: "daily-workplan",
    title: "Agent Work Plan",
    description: "Plan and assign daily tasks for collection agents.",
    icon: <XCircle className="text-rose-500 w-7 h-7" />,
  },
  {
    path: "settlements-payment",
    title: "Settlements - Payment",
    description: "Track and process all types of settlement payments.",
    icon: <Users className="text-indigo-600 w-7 h-7" />,
  },
  {
    path: "settlements-waiveoff",
    title: "Settlements - Waive Off",
    description: "Manage waived-off cases and financial adjustments.",
    icon: <FileText className="text-green-600 w-7 h-7" />,
  },
  {
    path: "eod-bod-process",
    title: "EOD / BOD Process",
    description: "Run end-of-day and beginning-of-day operations.",
    icon: <UserCheck className="text-blue-500 w-7 h-7" />,
  },
  {
    path: "account-closure",
    title: "Account Closure",
    description: "Close accounts after settlement or full repayment.",
    icon: <TrendingUp className="text-purple-500 w-7 h-7" />,
  },
  {
    path: "account-status",
    title: "Account Status",
    description: "Check and track account lifecycle and changes.",
    icon: <Edit className="text-red-500 w-7 h-7" />,
  },
  {
    path: "document-master",
    title: "Document Master",
    description: "Manage and define all finance-related documentation.",
    icon: <FileSignature className="text-yellow-600 w-7 h-7" />,
  },
  {
    path: "bulk-prepayment",
    title: "Bulk Prepayment",
    description: "Handle bulk prepayment processing and schedules.",
    icon: <Upload className="text-cyan-600 w-7 h-7" />,
  },
  {
    path: "due-date-change",
    title: "Due Date Change",
    description: "Edit due dates for finance repayments.",
    icon: <Truck className="text-orange-500 w-7 h-7" />,
  },
  {
    path: "profit-rate-change",
    title: "Profit Rate Change",
    description: "Adjust profit rates for financial products.",
    icon: <Calendar className="text-teal-500 w-7 h-7" />,
  },
  {
    path: "tenure-change",
    title: "Tenure Change",
    description: "Modify loan tenures and repayment terms.",
    icon: <AlertTriangle className="text-pink-600 w-7 h-7" />,
  },
  {
    path: "post-disbursal-edit",
    title: "Post Disbursal Edit",
    description: "Amend disbursed loans for corrections or changes.",
    icon: <Headphones className="text-lime-500 w-7 h-7" />,
  },
  {
    path: "deferral-constitution",
    title: "Deferral - Constitution Wise",
    description: "Manage repayment deferrals by constitution types.",
    icon: <XCircle className="text-rose-500 w-7 h-7" />,
  },
  {
    path: "deferral-financewise",
    title: "Deferral - Finance Wise",
    description: "Apply deferrals based on finance criteria.",
    icon: <Headphones className="text-lime-500 w-7 h-7" />,
  },
  {
    path: "deferral-portfolio",
    title: "Deferral - Portfolio Wise",
    description: "Initiate deferrals across loan portfolios.",
    icon: <XCircle className="text-rose-500 w-7 h-7" />,
  },
];

const FMSDashboard: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        📊 Financial Management System
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
                onClick={() => navigate(`/fms/${useCase.path}/business`)}
              >
                Business Use Case
              </button>
              <button
                className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                onClick={() => navigate(`/fms/${useCase.path}/system`)}
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

export default FMSDashboard;
