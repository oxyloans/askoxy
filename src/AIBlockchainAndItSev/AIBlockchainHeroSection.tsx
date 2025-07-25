import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AIBlockchainHeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const LOGIN_URL = "/whatsapplogin";

  const rotatingWords = [
    "AI-Powered Solutions",
    "Blockchain Technology",
    "End-to-End IT Services",
  ];

  const fullHeadingText = "Empower with";

  useEffect(() => {
    setIsVisible(true);

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

    return () => clearInterval(typingInterval);
  }, [currentWordIndex]);

  const handleSignIn = () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/services/0f02/ai-blockchain-it-services";

      if (userId) {
        navigate(redirectPath);
      } else {
        sessionStorage.setItem("redirectPath", redirectPath);
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      title: "AI-Powered Solutions",
      color: "text-cyan-400",
      description:
        "Automate workflows, analyze big data, and personalize user experiences using machine learning and AI models.",
    },
    {
      title: "Blockchain Technology",
      color: "text-purple-400",
      description:
        "Build transparent, decentralized, and tamper-proof systems for finance, healthcare, logistics, and more.",
    },
    {
      title: "End-to-End IT Services",
      color: "text-pink-400",
      description:
        "From cloud infrastructure to app development, we provide scalable and secure IT solutions tailored to your business needs.",
    },
  ];

  return (
    <section
      className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 lg:py-16 pb-20 overflow-hidden"
      aria-label="AI Blockchain Hero Section"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content */}
          <div
            className={`lg:col-span-7 space-y-8 text-center lg:text-left transform transition-all duration-700 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                {fullHeadingText}
                <span className="block mt-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                    {typedText}
                    <span
                      aria-hidden="true"
                      className={`inline-block w-1 h-12 bg-cyan-400 ml-1 ${
                        isTypingComplete ? "animate-pulse" : ""
                      }`}
                    ></span>
                  </span>
                </span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mt-8 mx-auto lg:mx-0">
                Empowering enterprises with cutting-edge Artificial
                Intelligence, secure Blockchain solutions, and robust IT
                services to accelerate innovation, enhance security, and drive
                digital transformation.
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                {features.map(({ title, color, description }, index) => (
                  <div
                    key={index}
                    className={`bg-white/5 backdrop-blur-sm rounded-3xl p-4 border border-white/10 shadow-lg transition-all hover:shadow-xl hover:bg-white/10 cursor-pointer hover:text-white hover:${color.replace(
                      "text-",
                      "shadow-"
                    )}`}
                    title={title}
                  >
                    <h3
                      className={`text-2xl font-semibold mb-3 text-center ${color}`}
                    >
                      {title}
                    </h3>
                    <p className="text-gray-300 text-center text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Call To Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="group bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-8 rounded-full flex items-center justify-center gap-3 hover:from-cyan-600 hover:to-blue-700 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? "Loading..." : "Get Started"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div
            className={`lg:col-span-5 transition-all duration-700 transform ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            } flex justify-center`}
          >
            <img
              src="https://i.ibb.co/GfBNqQFY/OurApp.png"
              alt="AI and Blockchain Technology"
              className="rounded-3xl shadow-2xl object-cover w-full max-w-md lg:max-w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AIBlockchainHeroSection;
