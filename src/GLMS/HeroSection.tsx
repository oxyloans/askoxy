import React from "react";
import { ArrowRight, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RadhakrishnaImg from "../assets/img/radha sir.png";
import { FaLinkedin } from "react-icons/fa";

function HeroSection() {
  const navigate = useNavigate();

  const handleClick = () => {
    const domainsSection = document.getElementById("usecases");
    if (domainsSection) {
      domainsSection.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/glmshome");
    }
  };

  return (
    <section className="bg-gradient-to-br from-white via-blue-50 to-purple-50 py-12 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div className="animate-fade-in space-y-6 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Global Loan Management Systems
            </span>
          </h1>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            We are building <strong>Global Loan Management Systems</strong> with
            you—powered by <strong>60+ proven BFSI use cases</strong>,{" "}
            <strong>50+ expert roles</strong>, and{" "}
            <strong>AI-driven delivery models</strong>.
            <br />
            From origination to collections, shaped by{" "}
            <strong>20+ global product companies</strong> like{" "}
            <strong>FinOne</strong>, <strong>Temenos</strong>,{" "}
            <strong>Finastra</strong>, <strong>TCS BaNCS</strong>, and{" "}
            <strong>Avaloq</strong>.
            <br />
            Our mission: <strong>modernize lending globally</strong> with domain
            depth, platform expertise & scalable talent.
            <br />
            We're enabling a <em>1M+ strong talent pool</em> with free training.
            <br />
            ✅ Get job-ready for top product companies
            <br />✅ Become a hot prospect for{" "}
            <strong>100,000+ banks and finance firms</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={handleClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full flex items-center gap-2 shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Get Started
              <span className="flex items-center gap-1">
                <Compass className="w-5 h-5" />
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="relative animate-slide-in flex justify-center items-center px-4">
          <div className="relative p-6 w-full max-w-sm text-center bg-white rounded-3xl shadow-xl space-y-4">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-64 h-64 mx-auto flex items-center justify-center overflow-hidden shadow-md">
              <img
                src={RadhakrishnaImg}
                alt="Radhakrishna"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">
                RadhaKrishna.T
              </h3>
              <p className="text-gray-600 text-lg">CEO & Co-Founder</p>
            </div>
            <div className="flex justify-center">
              <a
                href="https://www.linkedin.com/in/oxyradhakrishna/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-3xl transition duration-300"
                title="Connect on LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 opacity-30 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-200 opacity-30 rounded-full translate-y-8 -translate-x-8"></div>
          </div>

          {/* Extra Background Shapes */}
          <div className="hidden md:block absolute -bottom-6 right-4 w-24 h-24 bg-yellow-100 rounded-xl rotate-12 shadow-lg"></div>
          <div className="hidden md:block absolute top-12 -left-4 w-16 h-16 bg-green-100 rounded-full shadow-md"></div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
