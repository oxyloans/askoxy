import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import Askoxylogo from "../../assets/img/askoxylogostatic.png";
import { motion, AnimatePresence } from "framer-motion"; // optional animation
const images = [
  "https://i.ibb.co/chQ2MPVX/job-street.png",
  "https://i.ibb.co/C5jn6P53/standee-banks-roles.png",
  "https://i.ibb.co/7dXKJFyq/customer-id-creation.png",
  "https://i.ibb.co/Gv11dpRk/linking-of-co-applicant-guranter.png",
  "https://i.ibb.co/PsqpSJyK/Linking-of-customer-id-to-loan.png",
  "https://i.ibb.co/b5rknXQ6/workflow-for-loan-apparisal.png",
  "https://i.ibb.co/SwYCRfLQ/workflow-for-loan-assesment.png",
  "https://i.ibb.co/MxRvdwK2/work-flow-for-recommendations.png",
  "https://i.ibb.co/27bX7GGK/15.png",
  "https://i.ibb.co/Q7ZhS8Ft/Usecase13.png",
  "https://i.ibb.co/v6GkKVNF/loan-sanction-letter.png",
  "https://i.ibb.co/wnVWrMG/terms-conditions.png",
  "https://i.ibb.co/nMntMRSG/caparing-proposed-asset-details.png",
  "https://i.ibb.co/279s0FBy/checking-the-eligibility-of-the-customer.png",
  "https://i.ibb.co/nsdtW1xZ/work-flow-for-evaluating-the-networth.png",

  "https://i.ibb.co/SXBxHxbK/asset-insurance.jpg",
  "https://i.ibb.co/yngtGw2R/pdc-printing.jpg",
  "https://i.ibb.co/nq6ZjnXL/installprepayment.jpg",
  "https://i.ibb.co/rR0mxDKS/NPA-GRADING.jpg",
  "https://i.ibb.co/VYtSg7Nn/NPA-PROVISIONING.jpg",
  "https://i.ibb.co/SXqgtcGN/KNOCKOFF.jpg",
  "https://i.ibb.co/qMBm3PHz/SETTELEMENTS.jpg",
  "https://i.ibb.co/99WM5mx5/manual-advise.jpg",
  "https://i.ibb.co/GjWcDnY/termination-foreclosure.png",
  "https://i.ibb.co/cKxCvbHW/finance-details.jpg",
  "https://i.ibb.co/4RG7VkKk/floating-review-process.jpg",
  "https://i.ibb.co/QSTZzMm/settlement-receipts.jpg",
  "https://i.ibb.co/KzwZKxyR/settlements-payments.jpg",
  "https://i.ibb.co/ds5xptpJ/settlements-waive-off.jpg",
  "https://i.ibb.co/dwhb3S8y/eod-bod.png",
  "https://i.ibb.co/TxX82fBM/workflow-clousre-account-clousre.png",
  "https://i.ibb.co/hFGsRgH6/account-status.jpg",
  "https://i.ibb.co/jk8ywqYL/document-master.png",
  "https://i.ibb.co/ymY8fBs6/29.png",
  "https://i.ibb.co/TqBYG6yQ/Finance-Rescheduling-Due-date-change.png",
  "https://i.ibb.co/zVk0PwQB/Finance-Rescheduling-rate-of-intrest.png",
  "https://i.ibb.co/B2H7yCRk/Work-Flow-Finance-Rescheduling-Tenure-Change.png",
  "https://i.ibb.co/wrhVtZcm/post-disbursal-edit.jpg",
  "https://i.ibb.co/VWZsL214/repayment-deferral.jpg",
  "https://i.ibb.co/SXDC5zTj/32.png",
  "https://i.ibb.co/rRLjxCB0/portfolio-wise-defferral.jpg",
  "https://i.ibb.co/LD6k5ZYn/allocation-hold-for-delinquent-cases.png",
  "https://i.ibb.co/wN7rSyJh/define.jpg",
  "https://i.ibb.co/hxHsM71w/manual-allocation.png",
  "https://i.ibb.co/RTzZPnrm/manual-recollection.png",
  "https://i.ibb.co/TyMnqfw/beggaining-of-day-process.png",
  "https://i.ibb.co/Y4m7jf8K/defining-a-queue.png",
  "https://i.ibb.co/4RBpJrcr/contact-recording.png",
  "https://i.ibb.co/knpXx2S/legal-collection-workflow.png",
  "https://i.ibb.co/mFzB0c2X/prioritizing-a-queue.png",
  "https://i.ibb.co/v6qK9sbF/queue-communication-mapping.png",
  "https://i.ibb.co/k2Jf7N5R/queue.jpg",
  "https://i.ibb.co/Nd8gn6c9/Workplan.png",
];

const useCaseNames = [
  "AI & Banking Software Specialist - Job Street",
  "Job Roles & Use Cases in Banks & Tech Companies",
  "Customer ID Creation Workflow (LOS)",
  "Link Co-Applicant/Guarantor Workflow (LOS)",
  "Link Customer ID to Loan Product (LOS)",
  "Workflow for Loan Appraisal",
  "Workflow for Loan Assessment",
  "Work Flow for Recommendations",
  "Risk Analysis Documentation",
  "Work Flow for Sanction Letter Generation & Customer Response",
  "Workflow for Loan Sanction",
  "Workflow for Terms & Conditions",
  "Workflow for Capturing Proposed Asset Details",
  "Customer Eligibility & Loan Limit Check",
  "Workflow for Evaluating the Net Worth",

  "Asset Details",
  "PDC Printing",
  "WF_ Installment Prepayment",
  "WF_ NPA Grading",
  "WF_ NPA Provisioning",
  "WF_ Settlements - Knock Off",
  "WF_ Settlements_Cheque(Receipt_Payment) Processing",
  "WF_ Settlements_Manual Advise",
  "WF_ Termination - Foreclosure - Closure",
  "WF_FMS_ Finance Viewer",
  "WF_FMS_ Floating Review Process",
  "WF_FMS_ Settlements - Receipts",
  "WF_FMS_ Settlements_Payment",
  "WF_FMS_ Settlements_Waive Off",
  "WF_FMS_EOD_ BOD",
  "Work Flow Closure_Account Closure",
  "Work Flow Closure_View Account Status",
  "Work Flow_Document Master",
  "Work Flow_Finance Rescheduling_Bulk Prepayment",
  "Work Flow_Finance Rescheduling_Due Date Change",
  "Work Flow_Finance Rescheduling_Profit Rate Change",
  "Work Flow_Finance Rescheduling_Tenure Change",
  "Work Flow_Post Disbursal Edit",
  "Work Flow_Repayment Deferral_Constitution Wise Deferral",
  "Work Flow_Repayment Deferral_Finance Wise Deferral",
  "Work Flow_Repayment Deferral_Portfolio Wise Deferral",
  "Allocation of Delinquent Cases_Allocation Hold",
  "Allocation of Delinquent Cases_Define Allocation contract",
  "Allocation of Delinquent Cases_Manual Allocation",
  "Allocation of Delinquent Cases_Manual Reallocation",
  "Beginning of Day Process",
  "Classification of Delinquent Cases - Define Queue",
  "Contact Recording",
  "Legal Collections Workflow",
  "Prioritizing a Queue",
  "Queue Communication Mapping",
  "Queue Curing",
  "Collector Work Plan",
];

const JobStreet: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const useCases = useCaseNames.map((title, idx) => ({
    id: idx + 1,
    title,
    image: images[idx],
  }));

  const currentUseCase = useCases[currentIndex];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const handleLogoClick = () => (window.location.href = "/");
  const handleGLMSClick = () => (window.location.href = "/glms");

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? useCases.length - 1 : prev - 1));
    setImageLoaded(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === useCases.length - 1 ? 0 : prev + 1));
    setImageLoaded(false);
  };

  const handleSwipeStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleSwipeEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    touchStartX.current = null;
  };

  const getRouteByUseCase = (title: string): string => {
    const casKeywords = [
      "Customer ID Creation Workflow (LOS)",
      "Link Co-Applicant/Guarantor Workflow (LOS)",
      "Link Customer ID to Loan Product (LOS)",
      "Workflow for Loan Appraisal",
      "Workflow for Loan Assessment",
      "Work Flow for Recommendations",
      "Risk Analysis Documentation",
      "Work Flow for Sanction Letter Generation & Customer Response",
      "Workflow for Loan Sanction",
      "Workflow for Terms & Conditions",
      "Workflow for Capturing Proposed Asset Details",
      "Customer Eligibility & Loan Limit Check",
      "Workflow for Evaluating the Net Worth",
    ];

    const cmsKeywords = [
      "Allocation of Delinquent Cases_Allocation Hold",
      "Allocation of Delinquent Cases_Define Allocation contract",
      "Allocation of Delinquent Cases_Manual Allocation",
      "Allocation of Delinquent Cases_Manual Reallocation",
      "Beginning of Day Process",
      "Classification of Delinquent Cases - Define Queue",
      "Contact Recording",
      "Legal Collections Workflow",
      "Prioritizing a Queue",
      "Queue Communication Mapping",
      "Queue Curing",
      "Collector Work Plan",
    ];

    const fmsKeywords = [
      "Asset Details",
      "PDC Printing",
      "WF_ Installment Prepayment",
      "WF_ NPA Grading",
      "WF_ NPA Provisioning",
      "WF_ Settlements - Knock Off",
      "WF_ Settlements_Cheque(Receipt_Payment) Processing",
      "WF_ Settlements_Manual Advise",
      "WF_ Termination - Foreclosure - Closure",
      "WF_FMS_ Finance Viewer",
      "WF_FMS_ Floating Review Process",
      "WF_FMS_ Settlements - Receipts",
      "WF_FMS_ Settlements_Payment",
      "WF_FMS_ Settlements_Waive Off",
      "WF_FMS_EOD_ BOD",
      "Work Flow Closure_Account Closure",
      "Work Flow Closure_View Account Status",
      "Work Flow_Document Master",
      "Work Flow_Finance Rescheduling_Bulk Prepayment",
      "Work Flow_Finance Rescheduling_Due Date Change",
      "Work Flow_Finance Rescheduling_Profit Rate Change",
      "Work Flow_Finance Rescheduling_Tenure Change",
      "Work Flow_Post Disbursal Edit",
      "Work Flow_Repayment Deferral_Constitution Wise Deferral",
      "Work Flow_Repayment Deferral_Finance Wise Deferral",
      "Work Flow_Repayment Deferral_Portfolio Wise Deferral",
    ];

    if (casKeywords.includes(title)) return "/los";
    if (cmsKeywords.includes(title)) return "/cms";
    if (fmsKeywords.includes(title)) return "/fms";
    return "";
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    if (window.gtag) {
      window.gtag("event", "js_page_view", {
        page_title: "JobStreet Page",
        page_location: window.location.href,
        page_path: window.location.pathname,
      });
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition ${
          isScrolled ? "bg-white/95 shadow-md" : "bg-white/80"
        } backdrop-blur-md`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div onClick={handleLogoClick} className="cursor-pointer">
              <img src={Askoxylogo} alt="Askoxy.AI" className="h-14 w-auto" />
            </div>
            <div className="hidden md:flex">
              <button
                onClick={handleGLMSClick}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md transition"
              >
                Go To GLMS
              </button>
            </div>
            <div className="md:hidden">
              <button onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden py-4 bg-white shadow-lg rounded-b-lg px-4">
              <button
                onClick={handleGLMSClick}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg mt-2"
              >
                Go To GLMS
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow bg-gradient-to-br from-white via-blue-50 to-purple-50 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="sr-only">JobStreet Use Cases</h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2 mb-4">
            Explore Our Use Cases
          </h2>

          <p className="sm:hidden text-sm text-gray-500 mb-4">
            Swipe left or right to explore use cases
          </p>

          <div
            ref={containerRef}
            onTouchStart={handleSwipeStart}
            onTouchEnd={handleSwipeEnd}
            className="relative p-2 sm:p-2"
          >
            {/* Navigation Arrows */}
            <div className="hidden sm:block absolute top-1/2 left-2 transform -translate-y-1/2 z-10">
              <button
                onClick={handlePrev}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg"
              >
                <ChevronLeft />
              </button>
            </div>
            <div className="hidden sm:block absolute top-1/2 right-2 transform -translate-y-1/2 z-10">
              <button
                onClick={handleNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg"
              >
                <ChevronRight />
              </button>
            </div>

            {/* Use Case Card */}
            <div
              className="cursor-pointer"
              onClick={() => {
                const route = getRouteByUseCase(currentUseCase.title);
                if (route) window.location.href = route;
              }}
            >
              <h3 className="text-lg sm:text-xl font-semibold text-indigo-700">
                {currentUseCase.title}
              </h3>

              {!imageLoaded && (
                <div className="w-full h-[300px] sm:h-[400px] bg-gray-200 rounded-md animate-pulse" />
              )}

              <AnimatePresence mode="wait">
                <motion.img
                  key={currentUseCase.image}
                  src={currentUseCase.image}
                  alt={`Image for use case: ${currentUseCase.title}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full max-h-[500px] sm:max-h-[600px] object-contain rounded-lg ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              </AnimatePresence>
            </div>

                     </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-sm text-center py-4">
        &copy; {new Date().getFullYear()} Global Loans Management Systems. All
        rights reserved.
      </footer>
    </div>
  );
};

export default JobStreet;

