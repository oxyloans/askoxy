import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import Askoxylogo from "../../../assets/img/askoxylogonew.png";
import { Menu, X } from "react-feather";

const useCases = [
  {
    path: "allocation-hold",
    title: "Allocation of Delinquent Cases_Allocation Hold",
    description: "Place delinquent cases on hold based on predefined rules.",
  },
  {
    path: "define-allocation-contract",
    title: "Allocation of Delinquent Cases_Define Allocation contract",
    description: "Upload and manage contracts for delinquent case allocation.",
  },
  {
    path: "manual-allocation",
    title: "Allocation of Delinquent Cases_Manual Allocation",
    description: "Manually assign delinquent cases to collection agents.",
  },
  {
    path: "manual-reallocation",
    title: "Allocation of Delinquent Cases_Manual Reallocation",
    description:
      "Reassign cases based on collector availability and performance.",
  },
  {
    path: "bod-process",
    title: "Beginning of Day Process",
    description: "Initialize and prepare daily queue for collections.",
  },
  {
    path: "define-queue",
    title: "Classification of Delinquent Cases - Define Queue",
    description: "Create and manage delinquent case queues.",
  },
  {
    path: "contact-recording",
    title: "Contact Recording",
    description: "Record contact attempts and customer communication logs.",
  },
  {
    path: "legal-collections",
    title: "Legal Collections Workflow",
    description: "Initiate and track legal recovery processes.",
  },
  {
    path: "prioritize-queue",
    title: "Prioritizing a Queue",
    description: "Set priority for follow-up based on risk and aging.",
  },
  {
    path: "communication-mapping",
    title: "Queue Communication Mapping",
    description: "Assign communication templates to specific queues.",
  },
  {
    path: "queue-curing",
    title: "Queue Curing",
    description: "Monitor and track cured accounts from delinquency.",
  },
  {
    path: "work-plan",
    title: "Collector Work Plan",
    description: "Design and track daily plans for collection agents.",
  },
];

const CMSDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleInterest = () => {
    const userId = localStorage.getItem("userId");
    sessionStorage.setItem("submitclicks", "true");

    if (userId) {
      navigate("/main/services/a6b5/glms-open-source-hub-job-stree");
    } else {
      message.warning("Please login to submit your interest.");
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

    // Google Analytics page view event
    if (window.gtag) {
      window.gtag("event", "js_page_view", {
        page_title: "CMS Use Case Page",
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
                className="bg-indigo-100 text-blue-700 rounded hover:bg-indigo-200 text-blue px-5 py-2 rounded-md transition"
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
                className="bg-indigo-100 text-blue-700 rounded hover:bg-indigo-200 px-5 py-2 rounded-md transition"
              >
                Go To GLMS
              </button>
              <button
                onClick={handleInterest}
                className="w-full bg-green-100 text-green-700 rounded hover:bg-green-200 py-2 rounded-md font-medium transition"
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Collection Management System - Use Cases
          </h1>
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
                  onClick={() => navigate(`/cms/${useCase.path}/business`)}
                  className="flex-1 px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                >
                  Business Use Case
                </button>
                <button
                  onClick={() => navigate(`/cms/${useCase.path}/system`)}
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

export default CMSDashboard;
