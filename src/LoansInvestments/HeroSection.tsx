import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp } from "lucide-react";
import Heroimg from "../assets/img/heroimg3.9e623f6b9910c2a08a0d.png";
import { useNavigate } from "react-router-dom";
function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const LOGIN_URL = "/whatsapplogin";
  const navigate = useNavigate();
  const rotatingWords = [
    "Loans Made Simple",
    "Secure Your Future",
    "Smart Investments",
    "Financial Freedom",
  ];

  const fullHeadingText = "Unlock Your ";

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
      }, 80);

      return typingInterval;
    };

    const typingInterval = startTypingAnimation();
    return () => clearInterval(typingInterval);
  }, [currentWordIndex]);

  // Handle sign-in logic
  const handleSignIn = () => {
    try {
      setIsLoading(true);

      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/services/campaign/0f02"; // your desired path

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
    <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 sm:py-16 lg:py-20 overflow-hidden min-h-screen flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${
              mousePosition.y * 0.02
            }px)`,
          }}
        />
        <div
          className="absolute bottom-20 -left-20 w-80 h-80 bg-gradient-to-r from-purple-400/25 to-pink-500/25 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${
              mousePosition.y * -0.01
            }px)`,
          }}
        />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-2xl animate-pulse delay-2000" />

        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zm0-30V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      </div>

      {/* Floating Decorations */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-3 h-3 bg-cyan-400/60 rounded-full shadow-lg shadow-cyan-400/50" />
      </div>
      <div className="absolute top-32 right-20 animate-float delay-1000">
        <div className="w-2 h-2 bg-purple-400/60 rounded-full shadow-lg shadow-purple-400/50" />
      </div>
      <div className="absolute bottom-32 left-1/4 animate-float delay-2000">
        <div className="w-4 h-4 bg-emerald-400/60 rounded-full shadow-lg shadow-emerald-400/50" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-20">
          {/* Left Text Section */}
          <div
            className={`w-full lg:w-1/2 space-y-6 sm:space-y-8 text-center lg:text-left transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
              {fullHeadingText}
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {typedText}
                <span
                  className={`inline-block w-1 h-8 sm:h-8 lg:h-10 bg-gradient-to-b from-cyan-400 to-purple-400 ml-2 rounded-full ${
                    isTypingComplete ? "animate-pulse" : ""
                  }`}
                />
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Experience seamless financial solutions with instant approvals,
              competitive rates, and expert guidance tailored to your unique
              needs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {[
                {
                  title: "Gold Loans",
                  description: "Instant approval with secure gold storage",
                  icon: Shield,
                  color: "from-yellow-400 to-orange-500",
                  bg: "bg-yellow-500/10",
                  border: "border-yellow-500/30",
                },
                {
                  title: "Quick Loans",
                  description: "Fast disbursement in 24 hours",
                  icon: Zap,
                  color: "from-cyan-400 to-blue-500",
                  bg: "bg-cyan-500/10",
                  border: "border-cyan-500/30",
                },
                {
                  title: "Investments",
                  description: "Smart portfolio management",
                  icon: TrendingUp,
                  color: "from-purple-400 to-pink-500",
                  bg: "bg-purple-500/10",
                  border: "border-purple-500/30",
                },
              ].map(
                (
                  { title, description, icon: Icon, color, bg, border },
                  idx
                ) => (
                  <div
                    key={idx}
                    className={`group ${bg} ${border} border backdrop-blur-sm p-4 sm:p-5 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-white/10`}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-r ${color} shadow-lg`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm sm:text-base mb-1">
                          {title}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-8">
              <button
                onClick={handleSignIn}
                className="group relative bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base flex items-center justify-center gap-3 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Get Started Now</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <button
                onClick={handleSignIn}
                className="group bg-white/5 backdrop-blur-sm border border-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base flex items-center justify-center gap-3 hover:bg-white/10 hover:border-white/30 hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Free Consultation</span>
              </button>
            </div>
          </div>

          {/* Right Image Section */}
          <div
            className={`w-full lg:w-1/2 transition-all duration-700 transform ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            } flex justify-center mt-8 lg:mt-0`}
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-75 group-hover:opacity-100" />
              <img
                src="https://i.ibb.co/GfBNqQFY/OurApp.png"
                alt="Hero"
                className="relative rounded-2xl sm:rounded-3xl shadow-2xl object-cover w-full max-w-sm sm:max-w-md lg:max-w-full transform group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 sm:px-4 py-2 rounded-full shadow-lg animate-bounce">
                <span className="text-xs sm:text-sm font-bold">
                  Trusted Experts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float.delay-1000 { animation-delay: 1s; }
        .animate-float.delay-2000 { animation-delay: 2s; }

        @media (max-width: 640px) {
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
