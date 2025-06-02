import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import Askoxylogo from "../../assets/img/askoxylogostatic.png";



const images = [
  "https://i.ibb.co/ksGJZZtz/Usecase.png",

  "https://i.ibb.co/PvkT9gXY/Usecase1.png",
  "https://i.ibb.co/wZTqnXXC/Usecase2.png",
  "https://i.ibb.co/S4h8zBj6/Usecase7.png",
  "https://i.ibb.co/7xpk9fkG/Usecase4.png",
  "https://i.ibb.co/RknWvhzt/Usecase10.png",
  "https://i.ibb.co/RT3Lxk4n/Usecase3.png",
  "https://i.ibb.co/LdKHx3tT/Usecase12.png",
  "https://i.ibb.co/Q7ZhS8Ft/Usecase13.png",
  "https://i.ibb.co/bRQ3ZDgS/Usecase5.png",

  "https://i.ibb.co/C5ntVDTn/Usecase6.png",
  "https://i.ibb.co/8DpcTcf8/Usecase11.png",
"https://i.ibb.co/1YLXgzcP/Usecase8.png",
  "https://i.ibb.co/sv5D1V4Q/Usecase9.png",

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
  "Work Flow for Sanction Letter Generation & Customer Response",
  "Workflow for Loan Sanction",
  "Workflow for Terms & Conditions",
  "Workflow for Capturing Proposed Asset Details",
  "Customer Eligibility & Loan Limit Check",
  "Workflow for Evaluating the Net Worth",
];

const JobStreet: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const handleLogoClick = () => (window.location.href = "/");
  const handleGLMSClick = () => (window.location.href = "/glms");

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

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const useCases = useCaseNames.map((name, idx) => ({
    id: idx + 1,
    title: name,
    image: images[idx],
  }));

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? useCases.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === useCases.length - 1 ? 0 : prev + 1));
  };

  const currentUseCase = useCases[currentIndex];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Header */}
      <header
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 shadow-md" : "bg-white/80"
        } backdrop-blur-md`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
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
              <button onClick={toggleMobileMenu} className="p-2">
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 bg-white shadow-lg rounded-b-lg px-4">
              <button
                onClick={handleGLMSClick}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
              >
                Go To GLMS
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow bg-gradient-to-br from-white via-blue-50 to-purple-50 pb-4 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 my-6">
            Explore Our Use Cases
          </h2>

          <div className="relative bg-white rounded-xl shadow-lg p-4 sm:p-6">
            {/* Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 z-10">
              <button
                onClick={handlePrev}
                className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-md text-sm transition-all duration-200 ${
                  currentIndex === 0
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
                aria-label="Previous Use Case"
              >
                <ChevronLeft size={20} />
                <span className="hidden sm:inline">Previous</span>
              </button>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 z-10">
              <button
                onClick={handleNext}
                className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-md text-sm transition-all duration-200 ${
                  currentIndex === useCases.length - 1
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
                aria-label="Next Use Case"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Use Case Content */}
            <div className="px-4 sm:px-8">
              <h3 className="text-lg sm:text-xl font-semibold text-indigo-700 mb-4">
                {currentUseCase.title}
              </h3>
              <img
                src={currentUseCase.image}
                alt={`Use Case ${currentIndex + 1}`}
                className="w-full max-h-[550px] sm:max-h-[600px] object-contain rounded-md"
              />
            </div>

            {/* Navigation Dots */}
            <div className="mt-6 flex justify-center flex-wrap gap-2">
              {useCases.map((useCase, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  title={useCase.title}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex === i
                      ? "bg-indigo-600 scale-125 shadow-md"
                      : "bg-gray-300 hover:bg-indigo-400"
                  }`}
                  aria-label={`Jump to ${useCase.title}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Global Loans Management Systems. All
        rights reserved.
      </footer>
    </div>
  );
};

export default JobStreet;
