import React, { useEffect, useState } from "react";
import { Menu, X, ArrowUp } from "lucide-react";
import Askoxylogo from "../../assets/img/askoxylogostatic.png";

// Import use case images
import UseCaseImage1 from "../../assets/img/Usecase2.png";
import UseCaseImage2 from "../../assets/img/Usecase7.png";
import UseCaseImage3 from "../../assets/img/Usecase4.png";
import UseCaseImage4 from "../../assets/img/Usecase10.png";
import UseCaseImage5 from "../../assets/img/Usecase3.png";
import UseCaseImage6 from "../../assets/img/Usecase5.png";
import UseCaseImage7 from "../../assets/img/Usecase6.png";
import UseCaseImage8 from "../../assets/img/Usecase8.png";
import UseCaseImage9 from "../../assets/img/Usecase9.png";
import UseCaseImage10 from "../../assets/img/Usecase1.png";
import UseCaseImage11 from "../../assets/img/Usecase.png";

// Array of images
const images = [
  UseCaseImage11,
  UseCaseImage10,
  UseCaseImage1,
  UseCaseImage2,
  UseCaseImage3,
  UseCaseImage4,
  UseCaseImage5,
  UseCaseImage6,
  UseCaseImage7,
  UseCaseImage8,
  UseCaseImage9,
];

// Corresponding use case names
const useCaseNames = [
  "AI & Banking Software Specialist - Job Street",
  "Job Roles & Use Cases in Banks & Tech Companies",
  "Customer ID Creation Workflow (LOS)",
  "Link Co-Applicant/Guarantor Workflow (LOS)",
  "Link Customer ID to Loan Product (LOS)",
  "Workflow for Loan Appraisal ",
  "Workflow for Loan Assessment",
  "Workflow for Loan Sanction ",
  "Workflow for Terms & Conditions",
  "Customer Eligibility & Loan Limit Check",
  "Workflow for Evaluating the Net Worth ",
];


const JobStreet: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const handleGLMSClick = () => {
    window.location.href = "/glms";
  };

  // GA4 Tracking
  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "js_page_view", {
        page_title: "JobStreet Page",
        page_location: window.location.href,
        page_path: window.location.pathname,
      });
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Construct useCases array pairing each name with corresponding image
  const useCases = useCaseNames.map((name, idx) => ({
    id: idx + 1,
    title: name,
    image: images[idx],
  }));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white shadow fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={Askoxylogo}
              alt="AskOxy Logo"
              className="h-10 cursor-pointer transition-transform hover:scale-105"
              onClick={handleLogoClick}
              tabIndex={0}
              role="link"
              onKeyDown={(e) => e.key === "Enter" && handleLogoClick()}
            />
          </div>

          <div className="hidden md:block">
            <button
              onClick={handleGLMSClick}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition"
            >
              GLMS
            </button>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 ml-4 rounded-md hover:bg-gray-100 transition-colors"
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-gray-600" />
            ) : (
              <Menu size={24} className="text-gray-600" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow px-4 pb-4">
            <button
              onClick={handleGLMSClick}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition"
            >
              GLMS
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 px-4 bg-gray-50">
        <div className="max-w-8xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Our Use Cases
          </h2>
          <div className="grid gap-y-6 gap-x-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {useCases.map((useCase) => (
              <div key={useCase.id} className="text-center w-full">
                {/* Title outside card, just simple text */}
                <h3 className="text-md mb-2 text-indigo-600 font-semibold">
                  {useCase.title}
                </h3>

                {/* Image inside card-like container */}
                <div className="bg-white p-2 rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden">
                  <img
                    src={useCase.image}
                    alt={useCase.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Scroll to Top Button
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-indigo-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )} */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} Global Loans Management Systems. All
          rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default JobStreet;
