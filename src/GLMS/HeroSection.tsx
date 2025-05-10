import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RadhakrishnaImg from "../assets/img/radha sir.png";

function HeroSection() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/glmshome");
  };

  return (
    <section className="py-6 lg:py-8 bg-gradient-to-br from-white via-blue-50 to-purple-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 text-center lg:text-left leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Global Loan Management Systems
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-justify mb-8">
            We are building <strong>Global Loan Management Systems</strong> with
            you—powered by <strong>60+ proven BFSI use cases</strong>,{" "}
            <strong>50+ expert roles</strong>, and{" "}
            <strong>AI-driven delivery models</strong>.
            <br />
            From origination to collections, these use cases are shaped by{" "}
            <strong>20+ global product companies</strong> like{" "}
            <strong>FinOne</strong>, <strong>Temenos</strong>,{" "}
            <strong>Finastra</strong>, <strong>TCS BaNCS</strong>, and{" "}
            <strong>Avaloq</strong>.
            <br />
            Our mission is to <strong>modernize lending globally</strong> —
            through domain depth, platform expertise, and scalable talent
            partnerships.
            <br />
            We’re creating a <em>1 million+ strong talent pool</em> with
            continuous free training.
            <br />
            ✅ Get job-ready for top product companies
            <br />✅ Become a hot prospect for{" "}
            <strong>1,00,000+ banks and finance companies</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={handleClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center shadow-lg transition duration-300"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-1/2 relative flex justify-center animate-slide-in">
          <div className="relative p-6 max-w-sm w-full text-center bg-white rounded-3xl shadow-xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-64 h-54 flex items-center justify-center overflow-hidden shadow-md">
                <img
                  src={RadhakrishnaImg}
                  alt="Radhakrishna"
                  className="w-64 h-54 object-cover rounded-full"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                RadhaKrishna.T
              </h3>
              <p className="text-gray-600 text-lg">CEO & Co-Founder</p>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-200 opacity-30 rounded-full -mt-12 -mr-12"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-200 opacity-30 rounded-full -mb-10 -ml-10"></div>
          </div>

          <div className="hidden md:block absolute -bottom-6 right-4 w-24 h-24 bg-yellow-100 rounded-xl rotate-12 shadow-lg"></div>
          <div className="hidden md:block absolute top-12 -left-4 w-16 h-16 bg-green-100 rounded-full shadow-md"></div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
