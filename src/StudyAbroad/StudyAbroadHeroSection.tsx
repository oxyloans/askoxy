import React, { useState, useEffect } from "react";
import { ArrowRight, Globe, BookOpen, GraduationCap,  FileText } from "lucide-react";
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
      }, 100); // Speed of typing
      
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

  const handleExploreCountries = () => {
    const countriesSection = document.getElementById("countries");
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
    <section className="bg-gradient-to-br from-white to-purple-50 py-8 lg:py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div
            className={`lg:col-span-6 space-y-6 text-center lg:text-left transform transition-all duration-700 ease-in-out motion-reduce:transition-none ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-snug tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-500">
                  {typedText}
                  <span
                    className={`inline-block w-1 h-8 bg-purple-600 ml-1 ${
                      isTypingComplete ? "animate-pulse" : ""
                    }`}
                  ></span>
                </span>
              </h1>
            </div>

            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              Empower <strong>1 million students</strong> to study abroad and
              lead a life-changing career with us. Our vision is to help
              students fulfill their global dreams by 2030–2050, seamlessly
              connecting all stakeholders with high trust.
              <span className="block text-purple-600 mt-2">
                Operating in <strong>25+ countries</strong> with a{" "}
                <strong>95% visa success rate</strong>.
              </span>
            </p>

            {/* WE OFFER Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <h3 className="text-white font-bold text-center text-xl">
                  WE OFFER | <span className="text-yellow-300">ASKOXY.AI</span>
                </h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Cashback */}
                  <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-green-100 px-4 py-4 rounded-xl border-2 border-green-200 hover:shadow-lg hover:scale-105 transition-transform duration-300">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-lg font-bold">%</span>
                    </div>
                    <div>
                      <div className="font-bold text-green-700 text-sm">
                        Up to 5% Cashback
                      </div>
                      <div className="text-green-600 text-xs">
                        Save on university fees
                      </div>
                    </div>
                  </div>

                  {/* Scholarship */}
                  <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-yellow-100 px-4 py-4 rounded-xl border-2 border-yellow-200 hover:shadow-lg hover:scale-105 transition-transform duration-300">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-md">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-yellow-700 text-sm">
                        Up to 100% Scholarship
                      </div>
                      <div className="text-yellow-600 text-xs">
                        For selected students
                      </div>
                    </div>
                  </div>

                  {/* Offer Letter */}
                  <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4 rounded-xl border-2 border-blue-200 hover:shadow-lg hover:scale-105 transition-transform duration-300">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-blue-700 text-sm">
                        Offer letter in 10 Min
                      </div>
                      <div className="text-blue-600 text-xs">
                        Quick sample offers
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={handleExploreCountries}
                className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black font-bold py-2.5 px-5 rounded-full flex items-center justify-center gap-2 hover:from-yellow-500 hover:via-amber-500 hover:to-yellow-600 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto text-sm transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Explore Countries
                <Globe className="w-4 h-4" />
              </button>

              <button
                onClick={handleFreeConsultation}
                className="bg-white text-purple-600 font-semibold py-2.5 px-5 rounded-full hover:bg-purple-600 hover:text-white flex items-center justify-center gap-2 w-full sm:w-auto text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div
            className={`lg:col-span-6 space-x-10 flex justify-center items-center transition-all duration-700 transform ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >
            <div className="w-full h-full">
              {/* Hero Image Container with responsive sizing */}
              <div>
                {/* The image with responsive properties */}
                <img
                  src={Heroimg}
                  alt="Study Abroad Hero"
                  className="w-full h-auto object-cover object-center max-h-96 md:max-h-[500px] lg:max-h-[600px] rounded-lg"
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