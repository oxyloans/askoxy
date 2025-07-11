import React from "react";
import { ArrowRight, BookOpen, Briefcase, Compass, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RadhakrishnaImg from "../assets/img/radha sir.png";
import { FaLinkedin } from "react-icons/fa";

function HeroSection() {
  const navigate = useNavigate();

  const handleClick = () => {
    const usecases = document.getElementById("usecases");
    if (usecases) {
      usecases.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/glmshome");
    }
  };

  const handleExploreBlogs = () => {
    navigate("/myblogs");
  };

  const handleApplyJobs = () => {
    navigate("/jobdetails");
  };

  return (
    <section className="relative bg-gradient-to-tr from-white via-blue-50 to-purple-100 py-16 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        {/* LEFT CONTENT */}
        <div className="space-y-6 text-center md:text-left animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-snug">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Global Lending Management System
            </span>
          </h1>

          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            Meet <strong>NomoGPT</strong> — your intelligent platform for
            revolutionizing global lending.
            <br />
            Built with <strong>60+ BFSI use cases</strong>,{" "}
            <strong>50+ expert roles</strong>, and{" "}
            <strong>AI-driven accelerators</strong>, NomoGPT draws on insights
            from
            <strong> FinOne</strong>, <strong>Temenos</strong>,{" "}
            <strong>Finastra</strong>, and <strong>TCS BaNCS</strong>.
            <br className="hidden sm:block" />
            <strong>Mission:</strong> Empower BFSI firms with scalable AI-led
            solutions & job-ready talent.
          </p>

          <ul className="list-disc list-inside text-left ml-2 sm:ml-4 text-gray-700 space-y-1">
            <li>✅ Accelerate digital transformation</li>
            <li>
              ✅ Upskill <strong>1 million BFSI professionals</strong>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start justify-center sm:justify-start mt-4">
            {/* Button 1: Get Started */}
            <button
              onClick={handleClick}
              className="bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-full flex items-center gap-2 shadow hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 w-full sm:w-auto"
            >
              <Compass className="w-4 h-4" />
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Button 2: Explore Blogs */}
            <button
              onClick={handleExploreBlogs}
              className="bg-pink-600 text-white text-sm font-medium py-2 px-4 rounded-full flex items-center gap-2 shadow hover:bg-pink-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 w-full sm:w-auto"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Blogs</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Button 3: Apply Jobs */}
            <button
              onClick={handleApplyJobs}
              className="bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-full flex items-center gap-2 shadow hover:bg-green-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 w-full sm:w-auto"
            >
              <Briefcase className="w-4 h-4" />
              <span>Apply Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="relative flex justify-center animate-slide-in">
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-sm p-6 text-center space-y-5 z-10">
            <div className="overflow-hidden w-56 h-56 sm:w-64 sm:h-64 mx-auto rounded-full bg-gradient-to-r from-blue-100 to-purple-100 shadow-md">
              <img
                src={RadhakrishnaImg}
                alt="RadhaKrishna, CEO of GenOxy"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                RadhaKrishna.T
              </h3>
              <p className="text-gray-600 text-md">CEO & Co-Founder, GenOxy</p>
            </div>
            <div className="flex justify-center">
              <a
                href="https://www.linkedin.com/in/oxyradhakrishna/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-2xl transition duration-300"
                aria-label="LinkedIn profile of RadhaKrishna"
              >
                <FaLinkedin />
              </a>
            </div>

            {/* Decorative Blobs */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200 opacity-20 rounded-full z-0 blur-xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-200 opacity-20 rounded-full z-0 blur-xl" />
          </div>

          {/* Background Abstract Shapes */}
          <div className="hidden md:block absolute -bottom-6 right-4 w-24 h-24 bg-yellow-100 rounded-xl rotate-12 shadow-lg z-0 blur-sm"></div>
          <div className="hidden md:block absolute top-12 -left-4 w-16 h-16 bg-green-100 rounded-full shadow-md z-0 blur-sm"></div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
