import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import Heroimg from "../assets/img/heroimg3.9e623f6b9910c2a08a0d.png";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
function CacsHeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const LOGIN_URL = "/whatsapplogin";
  const navigate = useNavigate();
  const rotatingWords = [
    "CA Services",
    "CS Compliance",
    "Financial Advisory",
    "Tax Solutions",
    "Corporate Services",
  ];
  const fullHeadingText = "Excellence in";

  useEffect(() => {
    setIsVisible(true);

    const startTypingAnimation = () => {
      let currentIndex = 0;
      const currentWord = rotatingWords[currentWordIndex];
      setIsTypingComplete(false);
      setTypedText("");

      const typingInterval = setInterval(() => {
        if (currentIndex < currentWord.length) {
          setTypedText(currentWord.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTypingComplete(true);
          setTimeout(() => {
            setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
          }, 2500);
        }
      }, 80);

      return typingInterval;
    };

    const typingInterval = startTypingAnimation();
    return () => clearInterval(typingInterval);
  }, [currentWordIndex]);

  const handleSignIn = (text: string) => {
    try {
      setIsLoading(true);
      let redirectPath = "/main/caserviceitems";
      const userId = localStorage.getItem("userId");
      if (text === "items") {
        if (userId) {
          navigate(redirectPath);
        } else {
          navigate("/caserviceitems");
        }
      } else {
        redirectPath = "/main/services/3385/ca-services";
        if (userId) {
          navigate(redirectPath);
        } else {
          navigate("/services/3385/ca-services");
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 sm:py-12 lg:py-16 xl:py-20 overflow-hidden min-h-screen flex items-center">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 sm:-top-40 sm:-right-40 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 sm:-bottom-40 sm:-left-40 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Content */}
          <div
            className={`lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left transform transition-all duration-700 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="space-y-4 sm:space-y-6">
              {/* Main Heading */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white">
                {fullHeadingText}
                <span className="block mt-2 sm:mt-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                    {typedText}
                    <span
                      className={`inline-block w-0.5 sm:w-1 h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 bg-cyan-400 ml-1 ${
                        isTypingComplete ? "animate-pulse" : ""
                      }`}
                    ></span>
                  </span>
                </span>
              </h1>

              {/* Enhanced Description */}
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl mt-6 sm:mt-8">
                Your trusted partner for comprehensive{" "}
                <span className="text-cyan-400 font-semibold">
                  Chartered Accountancy
                </span>{" "}
                and{" "}
                <span className="text-purple-400 font-semibold">
                  Company Secretary
                </span>{" "}
                services. We deliver expert financial solutions, regulatory
                compliance, and strategic business advisory to fuel your growth.
              </p>

              {/* Enhanced Service Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10">
                {[
                  {
                    title: "CA Services",
                    color: "text-cyan-400",
                    borderColor: "border-cyan-500/30",
                    shadowColor: "hover:shadow-cyan-500/20",
                    description:
                      "Comprehensive accounting, auditing, taxation, and financial planning services for businesses and individuals.",
                  },
                  {
                    title: "CS Compliance",
                    color: "text-purple-400",
                    borderColor: "border-purple-500/30",
                    shadowColor: "hover:shadow-purple-500/20",
                    description:
                      "Company secretarial services, corporate governance, compliance management, and regulatory filings.",
                  },
                  {
                    title: "Advisory Services",
                    color: "text-pink-400",
                    borderColor: "border-pink-500/30",
                    shadowColor: "hover:shadow-pink-500/20",
                    description:
                      "Strategic business advisory, financial consulting, risk management, and growth planning solutions.",
                  },
                ].map(
                  (
                    { title, color, borderColor, shadowColor, description },
                    index
                  ) => (
                    <div
                      key={index}
                      className={`group bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border ${borderColor} shadow-lg transition-all duration-300 hover:shadow-xl ${shadowColor} hover:bg-white/10 hover:scale-105 cursor-pointer transform`}
                    >
                      <h3
                        className={`text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 ${color} text-center group-hover:scale-105 transition-transform duration-300`}
                      >
                        {title}
                      </h3>
                      <p className="text-gray-300 text-center text-xs sm:text-sm lg:text-base leading-relaxed group-hover:text-white transition-colors duration-300">
                        {description}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start mt-8 sm:mt-10">
              <button
                onClick={() => handleSignIn("items")}
                className="group bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full flex items-center justify-center gap-2 sm:gap-3 hover:from-cyan-600 hover:to-blue-700 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-sm sm:text-base"
              >
                Explore Services
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>

             
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div
            className={`lg:col-span-5 transition-all duration-700 transform ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            } flex justify-center mt-8 lg:mt-0`}
          >
            <div className="relative group">
              {/* Image Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-75 group-hover:opacity-100"></div>

              <img
                src="https://i.ibb.co/TD2JCyy7/8.png"
                alt="CA CS Services Professional"
                className="relative rounded-2xl sm:rounded-3xl shadow-2xl object-cover w-full max-w-sm sm:max-w-md lg:max-w-full transform group-hover:scale-105 transition-all duration-500"
              />

              {/* Floating Badge */}
              {/* <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 sm:px-4 py-2 rounded-full shadow-lg animate-bounce">
                <span className="text-xs sm:text-sm font-bold">
                  Trusted Experts
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CacsHeroSection;
