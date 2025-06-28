



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import Askoxylogo from "../../../assets/img/askoxylogoblack.png";
import { Menu, X } from "react-feather";

const useCases = [
  {
    path: "customer-id-creation",
    title: "Customer ID Creation",
    description:
      "Generate unique customer ID and link it to the Core Banking System (CBS)",
  },
  {
    path: "co-applicant-linking",
    title: "Co-applicant & Guarantor Linking",
    description:
      "Upload and link KYC/supporting documents for co-applicants or guarantors",
  },
  {
    path: "customer-id-loan-link",
    title: "Customer ID to Loan Linking",
    description:
      "Map customer ID to the loan application for tracking and verification",
  },
  {
    path: "loan-appraisal",
    title: "Loan Appraisal System",
    description: "Perform customer credit scoring and financial appraisal",
  },
  {
    path: "loan-assessment",
    title: "Loan Assessment Workflow",
    description: "Capture loan application and perform preliminary checks",
  },
  {
    path: "recommendation-workflow",
    title: "Recommendation & Sanction Letter",
    description: "Review loan details and generate sanction recommendations",
  },
  {
    path: "risk-analysis-upload",
    title: "Risk Analysis Documentation",
    description: "Upload signed agreements and perform risk validation",
  },
  {
    path: "sanction-disbursement",
    title: "Sanction & Customer Response Tracking",
    description: "Track sanction status and customer acknowledgments",
  },
  {
    path: "loan-repayment-schedule",
    title: "Repayment Schedule Generation",
    description: "Generate EMI schedule and repayment tracking data",
  },
  {
    path: "terms-conditions-workflow",
    title: "Terms & Conditions Approval",
    description: "Approve and manage loan terms and condition agreements",
  },
  {
    path: "asset-details-capture",
    title: "Asset Details Capture",
    description: "Record asset details offered as collateral or security",
  },
  {
    path: "limit-check-profile-update",
    title: "Profile Update & Limit Check",
    description: "Update customer info and check applicable credit limits",
  },
  {
    path: "account-closure-process",
    title: "Account Closure & Net Worth Analysis",
    description: "Initiate account closure and analyze party's net worth",
  },
];

const CASDashboard: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const handleInterest = () => {
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
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogoClick = () => (window.location.href = "/");
  const handleGLMSClick = () => (window.location.href = "/glms");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    if (window.gtag) {
      window.gtag("event", "js_page_view", {
        page_title: "CAS Use Case Page",
        page_location: window.location.href,
        page_path: window.location.pathname,
      });
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-white/90 shadow-md" : "bg-white/80"
        } backdrop-blur-lg`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div onClick={handleLogoClick} className="cursor-pointer">
              <img src={Askoxylogo} alt="Logo" className="h-12" />
            </div>
            <div className="hidden md:flex gap-3">
              <button
                onClick={handleGLMSClick}
                className="bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 px-5 py-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Go To GLMS
              </button>
              <button
                onClick={handleInterest}
                className="bg-green-100 text-green-700 rounded-lg hover:bg-green-200 px-5 py-2 font-medium transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
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
            <div className="md:hidden pb-4 pt-2 flex flex-col gap-3">
              <button
                onClick={handleGLMSClick}
                className="bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 px-5 py-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Go To GLMS
              </button>
              <button
                onClick={handleInterest}
                className="bg-green-100 text-green-700 rounded-lg hover:bg-green-200 px-5 py-2 font-medium transition focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                I'm Interested
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto py-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
            Loan Origination System (LOS)
          </h1>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
            The Loan Origination System (LOS) is a modern digital solution
            designed to simplify and accelerate the entire loan process. From
            the moment a customer applies for a loan to the final disbursement,
            LOS automates every critical step—including data capture, credit
            evaluation, approval workflows, document management, and compliance
            checks. With its user-friendly interface and seamless tracking, LOS
            enhances customer satisfaction, reduces manual errors, and ensures
            faster loan approvals while meeting all regulatory standards.
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
                  onClick={() => navigate(`/los/${useCase.path}/business`)}
                  className="flex-1 px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  Business Use Case
                </button>
                <button
                  onClick={() => navigate(`/los/${useCase.path}/system`)}
                  className="flex-1 px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  System Use Case
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-4 text-center text-sm">
        © {new Date().getFullYear()} Global Lending Management Solutions. All
        rights reserved.
      </footer>
    </div>
  );
};

export default CASDashboard;