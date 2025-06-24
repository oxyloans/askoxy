import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  Home,
  Building,
  MapPin,
  Key,
  TrendingUp,
  Shield,
  Gem,
  Award,
  User,
} from "lucide-react";
import Heroimg from "../../assets/img/heroimg3.9e623f6b9910c2a08a0d.png";
import { useNavigate } from "react-router-dom";
function NyayagptHeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const LOGIN_URL = "/whatsapplogin";
  const navigate = useNavigate();

  const rotatingWords = [
    "Dream Properties",
    "Smart Investments",
    "Premium Locations",
  ];
  const fullHeadingText = "Discover Your";

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
          }, 2000);
        }
      }, 100);

      return typingInterval;
    };

    const typingInterval = startTypingAnimation();
    return () => clearInterval(typingInterval);
  }, [currentWordIndex]);

  const handleSignIn = () => {
    try {
      setIsLoading(true);

      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/services/legalservice"; // your desired path

      if (userId) {
        // User is already logged in
        navigate(redirectPath);
      } else {
        // Save redirect path before redirecting to login
        sessionStorage.setItem("redirectPath", redirectPath);
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 py-8 lg:py-16 pb-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div
            className={`lg:col-span-7 space-y-6 lg:space-y-8 text-center lg:text-left transform transition-all duration-700 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                {fullHeadingText}
                <span className="block mt-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-purple-400">
                    {typedText}
                    <span
                      className={`inline-block w-1 h-8 sm:h-10 lg:h-12 bg-yellow-400 ml-1 ${
                        isTypingComplete ? "animate-pulse" : ""
                      }`}
                    ></span>
                  </span>
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mt-6 lg:mt-8 mx-auto lg:mx-0">
                Nyayagpt — Empowering property decisions with AI precision.
                Explore our top-tier listings and expert consultation to find
                your ideal space.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-8 lg:mt-10">
                {[
                  {
                    title: "Residential Sales",
                    icon: Home,
                    color: "text-yellow-400",
                    description: "Find premium homes across prime locations.",
                  },
                  {
                    title: "Commercial Properties",
                    icon: Building,
                    color: "text-purple-400",
                    description: "Strategic spaces for smart business moves.",
                  },
                  {
                    title: "Property Management",
                    icon: Key,
                    color: "text-yellow-300",
                    description:
                      "Effortless management with tech-powered solutions.",
                  },
                ].map(({ title, icon: Icon, color, description }, index) => (
                  <div
                    key={index}
                    className={`bg-white/5 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-white/10 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10 hover:bg-white/10 hover:scale-105 cursor-pointer group`}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div
                        className={`p-3 rounded-full bg-gradient-to-r from-white/10 to-white/5 ${color} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-6 h-6 lg:w-8 lg:h-8" />
                      </div>
                      <h3
                        className={`text-lg lg:text-xl font-semibold ${color}`}
                      >
                        {title}
                      </h3>
                      <p className="text-gray-300 text-sm lg:text-base leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
              <button
                onClick={handleSignIn}
                className="group bg-gradient-to-r from-purple-600 to-yellow-500 text-white font-bold py-3 lg:py-4 px-6 lg:px-8 rounded-full flex items-center justify-center gap-3 hover:from-purple-700 hover:to-yellow-600 shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 text-sm lg:text-base"
              >
                Browse Properties
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleSignIn}
                className="group bg-white/10 backdrop-blur-sm text-white font-semibold py-3 lg:py-4 px-6 lg:px-8 rounded-full hover:bg-white/20 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/20 text-sm lg:text-base"
              >
                Free Consultation
                <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>

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
                src="https://i.ibb.co/GfBNqQFY/OurApp.png"
                alt="CA CS Services Professional"
                className="relative rounded-2xl sm:rounded-3xl shadow-2xl object-cover w-full max-w-sm sm:max-w-md lg:max-w-full transform group-hover:scale-105 transition-all duration-500"
              />

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 sm:px-4 py-2 rounded-full shadow-lg animate-bounce">
                <span className="text-xs sm:text-sm font-bold">
                  Trusted Experts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NyayagptHeroSection;
