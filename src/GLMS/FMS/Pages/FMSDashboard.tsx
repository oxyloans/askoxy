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
    path: "asset-details",
    title: "Asset Details",
    description: "Manage and monitor asset-related case information.",
    icon: <Users className="text-indigo-600 w-7 h-7" />,
  },
  {
    path: "allocation-contract",
    title: "PDC Printing",
    description: "Automated post-dated cheque processing.",
    icon: <FileText className="text-green-600 w-7 h-7" />,
  },
  {
    path: "installment-prepayment",
    title: "WF_ Installment Prepayment",
    description: "Handle early repayments and installment adjustments.",
    icon: <UserCheck className="text-blue-500 w-7 h-7" />,
  },
  {
    path: "case-reallocation",
    title: "WF_ NPA Grading",
    description: "Non-performing asset classification system.",
    icon: <TrendingUp className="text-purple-500 w-7 h-7" />,
  },
  {
    path: "npa-provisioning",
    title: "WF_ NPA Provisioning",
    description: "Process provisioning for non-performing assets.",
    icon: <Edit className="text-red-500 w-7 h-7" />,
  },
  {
    path: "settlement-knockoff",
    title: "WF_ Settlements - Knock Off",
    description: "Record settlements and update outstanding balances.",
    icon: <FileSignature className="text-yellow-600 w-7 h-7" />,
  },
  {
    path: "cheque-processing",
    title: "WF_ Settlements_Cheque(Receipt_Payment) Processing",
    description: "Manage cheque-based settlements and payments.",
    icon: <Upload className="text-cyan-600 w-7 h-7" />,
  },
  {
    path: "settlement-advisory",
    title: "WF_ Settlements_Manual Advise",
    description: "Provide manual advisory for payment settlements.",
    icon: <Truck className="text-orange-500 w-7 h-7" />,
  },
  {
    path: "foreclosure-management",
    title: "WF_ Termination - Foreclosure - Closure",
    description: "Handle early closure and foreclosure of loans.",
    icon: <Calendar className="text-teal-500 w-7 h-7" />,
  },
  {
    path: "finance-viewer",
    title: "WF_FMS_ Finance Viewer",
    description: "View financial metrics and account overviews.",
    icon: <AlertTriangle className="text-pink-600 w-7 h-7" />,
  },
  {
    path: "floating-review",
    title: "WF_FMS_ Floating Review Process",
    description: "Manage reviews for floating-rate financial products.",
    icon: <Headphones className="text-lime-500 w-7 h-7" />,
  },
  {
    path: "daily-workplan",
    title: "WF_FMS_ Settlements - Receipts",
    description: "Automated receipt settlement processing",
    icon: <XCircle className="text-rose-500 w-7 h-7" />,
  },
  {
    path: "settlements-payment",
    title: "WF_FMS_ Settlements_Payment",
    description: "Track and process all types of settlement payments.",
    icon: <Users className="text-indigo-600 w-7 h-7" />,
  },
  {
    path: "settlements-waiveoff",
    title: "WF_FMS_ Settlements_Waive Off",
    description: "Manage waived-off cases and financial adjustments.",
    icon: <FileText className="text-green-600 w-7 h-7" />,
  },
  {
    path: "eod-bod-process",
    title: "WF_FMS_EOD_ BOD",
    description: "Run end-of-day and beginning-of-day operations.",
    icon: <UserCheck className="text-blue-500 w-7 h-7" />,
  },
  {
    path: "account-closure",
    title: "Work Flow Closure_Account Closure",
    description: "Close accounts after settlement or full repayment.",
    icon: <TrendingUp className="text-purple-500 w-7 h-7" />,
  },
  {
    path: "account-status",
    title: "Work Flow Closure_View Account Status",
    description: "Check and track account lifecycle and changes.",
    icon: <Edit className="text-red-500 w-7 h-7" />,
  },
  {
    path: "document-master",
    title: "Work Flow_Document Master",
    description: "Manage and define all finance-related documentation.",
    icon: <FileSignature className="text-yellow-600 w-7 h-7" />,
  },
  {
    path: "bulk-prepayment",
    title: "Work Flow_Finance Rescheduling_Bulk Prepayment",
    description: "Handle bulk prepayment processing and schedules.",
    icon: <Upload className="text-cyan-600 w-7 h-7" />,
  },
  {
    path: "due-date-change",
    title: "Work Flow_Finance Rescheduling_Due Date Change",
    description: "Edit due dates for finance repayments.",
    icon: <Truck className="text-orange-500 w-7 h-7" />,
  },
  {
    path: "profit-rate-change",
    title: "Work Flow_Finance Rescheduling_Profit Rate Change",
    description: "Adjust profit rates for financial products.",
    icon: <Calendar className="text-teal-500 w-7 h-7" />,
  },
  {
    path: "tenure-change",
    title: "Work Flow_Finance Rescheduling_Tenure Change",
    description: "Modify loan tenures and repayment terms.",
    icon: <AlertTriangle className="text-pink-600 w-7 h-7" />,
  },
  {
    path: "post-disbursal-edit",
    title: "Work Flow_Post Disbursal Edit",
    description: "Amend disbursed loans for corrections or changes.",
    icon: <Headphones className="text-lime-500 w-7 h-7" />,
  },
  {
    path: "deferral-constitution",
    title: "Work Flow_Repayment Deferral_Constitution Wise Deferral",
    description: "Manage repayment deferrals by constitution types.",
    icon: <XCircle className="text-rose-500 w-7 h-7" />,
  },
  {
    path: "deferral-financewise",
    title: "Work Flow_Repayment Deferral_Finance Wise Deferral",
    description: "Apply deferrals based on finance criteria.",
    icon: <Headphones className="text-lime-500 w-7 h-7" />,
  },
  {
    path: "deferral-portfolio",
    title: "Work Flow_Repayment Deferral_Portfolio Wise Deferral",
    description: "Initiate deferrals across loan portfolios.",
    icon: <XCircle className="text-rose-500 w-7 h-7" />,
  },
];

 
const FMSDashboard: React.FC = () => {
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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="relative mb-10 flex flex-col sm:flex-row items-center justify-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left text-gray-800">
          Financial Management System - Use Cases
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
                onClick={() => navigate(`/fms/${useCase.path}/business`)}
              >
                Business Use Case
              </button>
              <button
                className="w-full sm:w-auto px-4 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
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
