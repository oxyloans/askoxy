
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import Askoxylogo from "../../../assets/img/askoxylogoblack.png";
import { Menu, X } from "react-feather";

const useCases = [
  {
    path: "asset-details",
    title: "Asset Details",
    description: "Manage and monitor asset-related case information.",
    // icon: <Users className="text-indigo-600 w-7 h-7" />,
  },
  {
    path: "allocation-contract",
    title: "PDC Printing",
    description: "Automated post-dated cheque processing.",
    // icon: <FileText className="text-green-600 w-7 h-7" />,
  },
  {
    path: "installment-prepayment",
    title: "WF_ Installment Prepayment",
    description: "Handle early repayments and installment adjustments.",
    // icon: <UserCheck className="text-blue-500 w-7 h-7" />,
  },
  {
    path: "case-reallocation",
    title: "WF_ NPA Grading",
    description: "Non-performing asset classification system.",
    // icon: <TrendingUp className="text-purple-500 w-7 h-7" />,
  },
  {
    path: "npa-provisioning",
    title: "WF_ NPA Provisioning",
    description: "Process provisioning for non-performing assets.",
    // icon: <Edit className="text-red-500 w-7 h-7" />,
  },
  {
    path: "settlement-knockoff",
    title: "WF_ Settlements - Knock Off",
    description: "Record settlements and update outstanding balances.",
    // icon: <FileSignature className="text-yellow-600 w-7 h-7" />,
  },
  {
    path: "cheque-processing",
    title: "WF_ Settlements_Cheque(Receipt_Payment) Processing",
    description: "Manage cheque-based settlements and payments.",
    // icon: <Upload className="text-cyan-600 w-7 h-7" />,
  },
  {
    path: "settlement-advisory",
    title: "WF_ Settlements_Manual Advise",
    description: "Provide manual advisory for payment settlements.",
    // icon: <Truck className="text-orange-500 w-7 h-7" />,
  },
  {
    path: "foreclosure-management",
    title: "WF_ Termination - Foreclosure - Closure",
    description: "Handle early closure and foreclosure of loans.",
    // icon: <Calendar className="text-teal-500 w-7 h-7" />,
  },
  {
    path: "finance-viewer",
    title: "WF_FMS_ Finance Viewer",
    description: "View financial metrics and account overviews.",
    // icon: <AlertTriangle className="text-pink-600 w-7 h-7" />,
  },
  {
    path: "floating-review",
    title: "WF_FMS_ Floating Review Process",
    description: "Manage reviews for floating-rate financial products.",
    // icon: <Headphones className="text-lime-500 w-7 h-7" />,
  },
  {
    path: "daily-workplan",
    title: "WF_FMS_ Settlements - Receipts",
    description: "Automated receipt settlement processing",
    // icon: <XCircle className="text-rose-500 w-7 h-7" />,
  },
  {
    path: "settlements-payment",
    title: "WF_FMS_ Settlements_Payment",
    description: "Track and process all types of settlement payments.",
    // icon: <Users className="text-indigo-600 w-7 h-7" />,
  },
  {
    path: "settlements-waiveoff",
    title: "WF_FMS_ Settlements_Waive Off",
    description: "Manage waived-off cases and financial adjustments.",
    // icon: <FileText className="text-green-600 w-7 h-7" />,
  },
  {
    path: "eod-bod-process",
    title: "WF_FMS_EOD_ BOD",
    description: "Run end-of-day and beginning-of-day operations.",
    // icon: <UserCheck className="text-blue-500 w-7 h-7" />,
  },
  {
    path: "account-closure",
    title: "Work Flow Closure_Account Closure",
    description: "Close accounts after settlement or full repayment.",
    // icon: <TrendingUp className="text-purple-500 w-7 h-7" />,
  },
  {
    path: "account-status",
    title: "Work Flow Closure_View Account Status",
    description: "Check and track account lifecycle and changes.",
    // icon: <Edit className="text-red-500 w-7 h-7" />,
  },
  {
    path: "document-master",
    title: "Work Flow_Document Master",
    description: "Manage and define all finance-related documentation.",
    // icon: <FileSignature className="text-yellow-600 w-7 h-7" />,
  },
  {
    path: "bulk-prepayment",
    title: "Work Flow_Finance Rescheduling_Bulk Prepayment",
    description: "Handle bulk prepayment processing and schedules.",
    // icon: <Upload className="text-cyan-600 w-7 h-7" />,
  },
  {
    path: "due-date-change",
    title: "Work Flow_Finance Rescheduling_Due Date Change",
    description: "Edit due dates for finance repayments.",
    // icon: <Truck className="text-orange-500 w-7 h-7" />,
  },
  {
    path: "profit-rate-change",
    title: "Work Flow_Finance Rescheduling_Profit Rate Change",
    description: "Adjust profit rates for financial products.",
    // icon: <Calendar className="text-teal-500 w-7 h-7" />,
  },
  {
    path: "tenure-change",
    title: "Work Flow_Finance Rescheduling_Tenure Change",
    description: "Modify loan tenures and repayment terms.",
    // icon: <AlertTriangle className="text-pink-600 w-7 h-7" />,
  },
  {
    path: "post-disbursal-edit",
    title: "Work Flow_Post Disbursal Edit",
    description: "Amend disbursed loans for corrections or changes.",
    // icon: <Headphones className="text-lime-500 w-7 h-7" />,
  },
  {
    path: "deferral-constitution",
    title: "Work Flow_Repayment Deferral_Constitution Wise Deferral",
    description: "Manage repayment deferrals by constitution types.",
    // icon: <XCircle className="text-rose-500 w-7 h-7" />,
  },
  {
    path: "deferral-financewise",
    title: "Work Flow_Repayment Deferral_Finance Wise Deferral",
    description: "Apply deferrals based on finance criteria.",
    // icon: <Headphones className="text-lime-500 w-7 h-7" />,
  },
  {
    path: "deferral-portfolio",
    title: "Work Flow_Repayment Deferral_Portfolio Wise Deferral",
    description: "Initiate deferrals across loan portfolios.",
    // icon: <XCircle className="text-rose-500 w-7 h-7" />,
  },
];

 
const FMSDashboard: React.FC = () => {
  const navigate = useNavigate();
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const handleInterest = () => {
       const userId = localStorage.getItem("userId");
       if (userId) {
         sessionStorage.setItem("submitclicks", "true");
         navigate("/main/services/a6b5/glms-open-source-hub-job-stree");
       } else {
         message.warning("Please login to submit your interest.");
         sessionStorage.setItem("submitclicks", "true");
         navigate("/whatsappregister");
         sessionStorage.setItem("redirectPath", "/main/services/a6b5/glms-open-source-hub-job-stree");
       }
  };
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
    const handleLogoClick = () => (window.location.href = "/");
    const handleGLMSClick = () => (window.location.href = "/glms");
    useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleScroll);
  
      // Google Analytics page view event
      if (window.gtag) {
        window.gtag("event", "js_page_view", {
          page_title: "FMS Use Case Page",
          page_location: window.location.href,
          page_path: window.location.pathname,
        });
      }
  
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
   

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-white/90 shadow-md" : "bg-white/80"
        } backdrop-blur-lg`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div onClick={handleInterest} className="cursor-pointer">
              <img src={Askoxylogo} alt="Logo" className="h-12" />
            </div>
            <div className="hidden md:flex gap-3">
              <button
                onClick={handleGLMSClick}
                className="bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 px-5 py-2 rounded-md transition"
              >
                Go To GLMS
              </button>
              <button
                onClick={handleInterest}
                className="bg-green-100 text-green-700 rounded hover:bg-green-200 px-5 py-2 rounded-md font-medium transition hover:scale-105"
              >
                I'm Interested
              </button>
            </div>
            <div className="md:hidden">
              <button onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-4 pt-2 gap-3">
              <button
                onClick={handleGLMSClick}
                className="bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 px-5 py-2 rounded-md transition"
              >
                Go To GLMS
              </button>
              <button
                onClick={handleInterest}
                className="bg-green-100 text-green-700 rounded hover:bg-green-200 py-2 rounded-md font-medium transition"
              >
                I'm Interested
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto py-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
            Financial Management System (FMS)
          </h1>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
            The Financial Management System (FMS) is a comprehensive solution
            that helps organizations seamlessly manage their financial
            operations. From planning and budgeting to accounting and financial
            reporting, FMS delivers real-time insights into financial health and
            performance. It streamlines workflows, ensures regulatory
            compliance, and empowers leadership with accurate data for faster,
            smarter decision-making—ultimately supporting long-term business
            growth and stability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase) => (
            <div
              key={useCase.path}
              className="p-6 bg-white border rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {useCase.title}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                {useCase.description}
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate(`/fms/${useCase.path}/business`)}
                  className="flex-1 px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                >
                  Business Use Case
                </button>
                <button
                  onClick={() => navigate(`/fms/${useCase.path}/system`)}
                  className="flex-1 px-4 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  System Use Case
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Global Lending Management Solutions.
        All rights reserved.
      </footer>
    </div>
  );
};

export default FMSDashboard;
