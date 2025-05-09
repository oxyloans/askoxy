import React from "react";
import { ArrowRight, PlayCircle } from "lucide-react";

function HeroSection() {
  return (
    <section className="py-10 md:py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="max-w-xl mx-auto lg:mx-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                We Are Building{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Global Loan Management Systems
                </span>{" "}
                with You
              </h1>

              <p className="text-base sm:text-lg text-gray-600 mb-8 md:mb-10">
                Powered by <strong>60+ proven BFSI use cases</strong>,{" "}
                <strong>50+ expert roles</strong>, and{" "}
                <strong>AI-driven delivery models</strong>. From origination to
                collections, across <strong>FinOne</strong>,{" "}
                <strong>Temenos</strong>, <strong>Finastra</strong> and beyond —
                our mission is to modernize lending globally through domain
                depth, platform expertise, and scalable talent partnerships.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full transition duration-300 flex items-center justify-center">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>

                <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-3 px-6 rounded-full transition duration-300 flex items-center justify-center">
                  <PlayCircle className="mr-2 h-5 w-5 text-blue-600" />
                  Watch Demo
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Image or Illustration */}
          <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl shadow-xl p-6 md:p-8">
                <div className="relative z-10">
                  <div className="flex items-center justify-center bg-white w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg mb-4 mx-auto lg:mx-0">
                    <span className="text-4xl">🌍</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-center lg:text-left mb-2">
                    AI-Powered Lending
                  </h3>
                  <p className="text-lg text-gray-700 text-center lg:text-left">
                    Global-Scale Impact
                  </p>
                </div>

                {/* Background decoration elements */}
                <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-blue-200 rounded-full opacity-30 -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 bg-purple-200 rounded-full opacity-30 -ml-8 -mb-8"></div>
              </div>

              {/* Additional graphics could be added here */}
              <div className="hidden md:block absolute -bottom-4 right-4 w-24 h-24 bg-yellow-100 rounded-lg transform rotate-12 shadow"></div>
              <div className="hidden md:block absolute top-10 left-0 w-16 h-16 bg-green-100 rounded-full transform -translate-x-1/2 shadow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
