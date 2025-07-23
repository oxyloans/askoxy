
import React, { useEffect, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import Askoxylogo from "../../../assets/img/askoxylogonew.png";
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
// Memoized Use Case Card for performance
const UseCaseCard = memo(
  ({
    title,
    description,
    onBusinessClick,
    onSystemClick,
  }: {
    title: string;
    description: string;
    onBusinessClick: () => void;
    onSystemClick: () => void;
  }) => (
    <article
      tabIndex={0}
      className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label={`${title} use case`}
    >
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBusinessClick}
          className="flex-1 w-full sm:w-auto px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label={`View business use case for ${title}`}
        >
          Business Use Case
        </button>
        <button
          onClick={onSystemClick}
          className="flex-1 w-full sm:w-auto px-4 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition focus:outline-none focus:ring-2 focus:ring-green-400"
          aria-label={`View system use case for ${title}`}
        >
          System Use Case
        </button>
      </div>
    </article>
  )
);

const FMSDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleInterest = useCallback(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      sessionStorage.setItem("submitclicks", "true");
      navigate("/main/services/a6b5/glms-open-source-hub-job-stree");
    } else {
      message.warning("Please login to submit your interest.");
      sessionStorage.setItem("submitclicks", "true");
      sessionStorage.setItem(
        "redirectPath",
        "/main/services/a6b5/glms-open-source-hub-job-stree"
      );
      navigate("/whatsappregister");
    }
  }, [navigate]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleLogoClick = useCallback(() => {
    window.location.href = "/";
  }, []);

  const handleGLMSClick = useCallback(() => {
    window.location.href = "/glms";
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);

    if (window.gtag) {
      window.gtag("event", "js_page_view", {
        page_title: "FMS Use Case Page",
        page_location: window.location.href,
        page_path: window.location.pathname,
      });
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
          isScrolled ? "bg-white/90 shadow-md" : "bg-white/80"
        } backdrop-blur-lg`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div
              onClick={handleLogoClick}
              className="cursor-pointer flex items-center"
              tabIndex={0}
              role="button"
              aria-label="Go to homepage"
              onKeyDown={(e) => e.key === "Enter" && handleLogoClick()}
            >
              <img
                src={Askoxylogo}
                alt="Logo"
                className="h-12 w-auto select-none"
                draggable={false}
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-3">
              <button
                onClick={handleGLMSClick}
                className="bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 px-5 py-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Go To GLMS
              </button>
              <button
                onClick={handleInterest}
                className="bg-green-100 text-green-700 rounded-md hover:bg-green-200 px-5 py-2 font-medium transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                I'm Interested
              </button>
            </nav>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 flex flex-col gap-3">
              <button
                onClick={handleGLMSClick}
                className="bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 px-5 py-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Go To GLMS
              </button>
              <button
                onClick={handleInterest}
                className="bg-green-100 text-green-700 rounded-md hover:bg-green-200 px-5 py-2 font-medium transition focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                I'm Interested
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-1 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto py-12">
        <section className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Financial Management System (FMS)
          </h1>
          <p className="mt-6 text-gray-700 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
            The <strong>Financial Management System (FMS)</strong> is a
            comprehensive solution that helps organizations manage financial
            operations with precision. From planning, budgeting, and accounting
            to real-time financial reporting, FMS offers streamlined workflows
            and data-driven insights that support strategic decisions, enhance
            compliance, and foster long-term growth.
          </p>
        </section>

        {/* Use Cases Grid */}
        <section
          aria-label="Financial Management System Use Cases"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {useCases.map(({ path, title, description }) => (
            <UseCaseCard
              key={path}
              title={title}
              description={description}
              onBusinessClick={() => navigate(`/fms/${path}/business`)}
              onSystemClick={() => navigate(`/fms/${path}/system`)}
            />
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 text-center text-sm select-none">
        &copy; {new Date().getFullYear()} Global Lending Management Solutions.
        All rights reserved.
      </footer>
    </div>
  );
};

export default FMSDashboard;
