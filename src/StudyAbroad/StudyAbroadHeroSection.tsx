import React, { useState, useEffect } from "react";
import { ArrowRight, Globe, BookOpen, GraduationCap, FileText, Star, Gift, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Heroimg from "../assets/img/heroimg3.9e623f6b9910c2a08a0d.png"

function StudyAbroadHeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullHeadingText = "Your Global Education Journey";

  useEffect(() => {
    setIsVisible(true);
    
    // Typing animation effect that repeats every 45 seconds
    const startTypingAnimation = () => {
      let currentIndex = 0;
      setIsTypingComplete(false);
      setTypedText("");
      
      const typingInterval = setInterval(() => {
        if (currentIndex < fullHeadingText.length) {
          setTypedText(fullHeadingText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTypingComplete(true);
        }
      }, 100);
      
      return typingInterval;
    };
    
    // Start initial animation
    let typingInterval = startTypingAnimation();
    
    // Restart animation every 45 seconds
    const repeatInterval = setInterval(() => {
      clearInterval(typingInterval);
      typingInterval = startTypingAnimation();
    }, 45000);
    
    return () => {
      clearInterval(typingInterval);
      clearInterval(repeatInterval);
    };
  }, []);

  const handleExploreUniversities = () => {
    const countriesSection = document.getElementById("universities");
    if (countriesSection) {
      countriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFreeConsultation = () => {
    setClicked(true);
    navigate("/student-home");
    console.log("Navigating to /student-home");
  };

  return (
    <section className="bg-gradient-to-br from-white via-purple-50 to-indigo-100 py-6 sm:py-8 lg:py-12 overflow-hidden min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Left Content */}
          <div
            className={`lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left transform transition-all duration-700 ease-in-out motion-reduce:transition-none ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600">
                  {typedText}
                  <span
                    className={`inline-block w-0.5 sm:w-1 h-6 sm:h-8 lg:h-10 bg-purple-600 ml-1 ${
                      isTypingComplete ? "animate-pulse" : ""
                    }`}
                  ></span>
                </span>
              </h1>
            </div>

            <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Empower <strong className="text-purple-700">1 million students</strong> to study abroad and
              lead life-changing careers. Our vision is to help students fulfill 
              their global dreams by 2030–2050.
              <span className="block text-purple-600 mt-2 font-medium text-sm sm:text-base">
                Operating in <strong>25+ countries</strong> with a{" "}
                <strong className="text-green-600">95% visa success rate</strong>.
              </span>
            </p>

            {/* Highlighted Offers - Direct Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 mt-6">
              
              {/* Cashback Offer */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-white rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-green-800 font-bold text-sm sm:text-base">5% Cashback</h3>
                        <span className="bg-green-100 mb-2 text-green-800 text-xs px-2 py-1 rounded-full font-medium">HOT</span>
                      </div>
                      <p className="text-green-700 text-xs sm:text-sm">Save up to ₹1,50,000 on offer universities</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scholarship Offer */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-white rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-yellow-800 font-bold text-sm sm:text-base">100% Scholarship</h3>
                        {/* <span className="bg-yellow-100 text-yellow-800 mb-2 text-xs px-2 py-1 rounded-full font-medium">NEW</span> */}
                      </div>
                      <p className="text-yellow-700 text-xs sm:text-sm">Merit-based for eligible students</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Offer Letter */}
              {/* <div className="relative group sm:col-span-2 lg:col-span-1 xl:col-span-2">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-white rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-blue-800 font-bold text-sm sm:text-base">Instant Offer Letter</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">FAST</span>
                      </div>
                      <p className="text-blue-700 text-xs sm:text-sm">Get sample offers in just 10 minutes</p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-4 sm:pt-6">
              <button
                onClick={handleExploreUniversities}
                className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full flex items-center justify-center gap-2 hover:from-yellow-500 hover:via-amber-500 hover:to-yellow-600 shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto text-sm sm:text-base transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-amber-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                5% Cashback Offers
              </button>

              <button
                onClick={handleFreeConsultation}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                Get Started
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div
            className={`lg:col-span-6 flex justify-center items-center transition-all duration-700 transform order-first lg:order-last ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >
            <div className="w-full max-w-lg lg:max-w-none">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-3xl blur-3xl transform rotate-6"></div>
                <img
                  src={Heroimg}
                  alt="Study Abroad Hero"
                  className="relative w-full h-auto object-contain drop-shadow-2xl"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudyAbroadHeroSection;