import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  Star,
  Award,
  Users,
  ShieldCheck,
} from "lucide-react";
import Heroimg from "../assets/img/heroimg3.9e623f6b9910c2a08a0d.png";
import { useNavigate } from "react-router-dom";
function GoldSilverDiamondHeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const LOGIN_URL = "/whatsapplogin";
  const navigate = useNavigate();
  const rotatingWords = [
    "Gold Jewelry",
    "Silver Ornaments",
    "Diamond Collection",
    "Custom Designs",
    "Elegant Accessories",
  ];
  const fullHeadingText = "Timeless Beauty in";

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
      const redirectPath = "/main/services/71e3/gold-silver-diamonds"; // your desired path

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
    <section className="relative bg-gradient-to-br from-amber-50 via-rose-50 to-yellow-50 py-12 sm:py-20 lg:py-24 overflow-hidden min-h-screen flex items-center">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-yellow-300/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${
              mousePosition.y * 0.02
            }px)`,
          }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-pink-300/15 to-yellow-200/15 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${
              mousePosition.y * -0.01
            }px)`,
          }}
        ></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-amber-200/10 to-rose-200/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-8 h-8 bg-yellow-400/30 rounded-full blur-sm"></div>
      </div>
      <div className="absolute top-32 right-20 animate-float delay-1000">
        <div className="w-6 h-6 bg-pink-400/30 rounded-full blur-sm"></div>
      </div>
      <div className="absolute bottom-32 left-1/4 animate-float delay-2000">
        <div className="w-4 h-4 bg-amber-400/30 rounded-full blur-sm"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div
            className={`lg:col-span-7 space-y-8 text-center lg:text-left transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
              {fullHeadingText}
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-pink-600 to-rose-500">
                {typedText}
                <span
                  className={`inline-block w-1 h-12 bg-gradient-to-b from-yellow-500 to-pink-500 ml-2 rounded-full ${
                    isTypingComplete ? "animate-pulse" : ""
                  }`}
                ></span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover a world of elegance and tradition with our exclusive
              Gold, Silver, and Diamond collections — curated to perfection for
              every special moment.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {[
                {
                  title: "Gold Collection",
                  description:
                    "Elegant 22K & 24K designs that define timeless beauty.",
                  icon: "🏆",
                  gradient: "from-yellow-400 to-amber-500",
                  borderColor: "border-yellow-300",
                  bgColor: "bg-yellow-50/80",
                },
                {
                  title: "Silver Pieces",
                  description:
                    "Chic, modern, and traditional silver crafted with care.",
                  icon: "✨",
                  gradient: "from-gray-400 to-slate-500",
                  borderColor: "border-gray-300",
                  bgColor: "bg-gray-50/80",
                },
                {
                  title: "Diamond Range",
                  description:
                    "Certified brilliance with premium craftsmanship.",
                  icon: "💎",
                  gradient: "from-pink-400 to-rose-500",
                  borderColor: "border-pink-300",
                  bgColor: "bg-pink-50/80",
                },
              ].map(
                (
                  { title, description, icon, gradient, borderColor, bgColor },
                  idx
                ) => (
                  <div
                    key={idx}
                    className={`group border-2 ${borderColor} ${bgColor} backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center cursor-pointer`}
                  >
                    <div
                      className={`text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      {icon}
                    </div>
                    <h3
                      className={`text-lg font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-2`}
                    >
                      {title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {description}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-10">
              <button
                onClick={handleSignIn}
                className="group bg-gradient-to-r from-yellow-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-lg relative overflow-hidden"
              >
                <span className="relative z-10">Explore Collection</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
           
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div
            className={`lg:col-span-5 transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            } flex justify-center`}
          >
            <div className="relative group">
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
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 sm:px-4 py-2 rounded-full shadow-lg animate-bounce">
                    <span className="text-xs sm:text-sm font-bold">
                      Trusted Experts
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float.delay-1000 {
          animation-delay: 1s;
        }
        .animate-float.delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}

export default GoldSilverDiamondHeroSection;
