import React from "react";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";




function HeroSection() {
  const navigate = useNavigate();
const handleClick = () => {
  navigate("/glmshome"); // Navigate to the /glms route when the button is clicked
};
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-white via-blue-50 to-purple-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Global Loan Management Systems
            </span>
          </h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            We are building{" "}
            <strong>powered by 60+ proven BFSI use cases</strong>,{" "}
            <strong>50+ expert roles</strong>, and{" "}
            <strong>AI-driven delivery models</strong>. From origination to
            collections, across <strong>FinOne</strong>,{" "}
            <strong>Temenos</strong>, <strong>Finastra</strong>, and more — we
            modernize lending globally through domain expertise and scalable
            tech.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={handleClick} // Add onClick handler to navigate
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center shadow-lg transition duration-300"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-full flex items-center justify-center shadow transition duration-300">
              <PlayCircle className="mr-2 h-5 w-5 text-blue-600" />
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right Content - Illustration */}
        <div className="w-full lg:w-1/2 relative animate-slide-in">
          <div className="relative bg-white rounded-3xl shadow-xl p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-20 h-20 flex items-center justify-center shadow-md">
                <span className="text-4xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                AI-Powered Lending
              </h3>
              <p className="text-gray-600 text-lg">
                Delivering Global-Scale Impact
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-200 opacity-30 rounded-full -mt-12 -mr-12"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-200 opacity-30 rounded-full -mb-10 -ml-10"></div>
          </div>

          {/* Optional decorative graphic */}
          <div className="hidden md:block absolute -bottom-6 right-4 w-24 h-24 bg-yellow-100 rounded-xl rotate-12 shadow-lg"></div>
          <div className="hidden md:block absolute top-12 -left-4 w-16 h-16 bg-green-100 rounded-full shadow-md"></div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
