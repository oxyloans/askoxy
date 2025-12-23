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
      const redirectPath = "/main/crypto";

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
      title: "AI Solutions",
      color: "text-cyan-400",
      description: "Smart automation and data-driven intelligence.",
    },
    {
      title: "Blockchain",
      color: "text-purple-400",
      description: "Secure, transparent, decentralized systems.",
    },
    {
      title: "IT Services",
      color: "text-pink-400",
      description: "End-to-end scalable technology support.",
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 lg:py-16 pb-20 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

            {/* Heading (15% smaller) */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {fullHeadingText}
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                {typedText}
                <span className="inline-block w-1 h-10 bg-cyan-400 ml-1 animate-pulse"></span>
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0">
              Empowering enterprises with cutting-edge Artificial Intelligence,
              secure Blockchain solutions, and robust IT services.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-2xl p-3"
                >
                  <h3 className={`text-lg font-semibold mb-1 ${f.color}`}>
                    {f.title}
                  </h3>
                  <p className="text-gray-300 text-xs">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>

            {/* BMVCOINS OFFER */}
            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-5 mt-6 max-w-xl mx-auto lg:mx-0">
              <h3 className="text-xl font-bold text-cyan-400 mb-1">
                🎉 LIMITED TIME OFFER
              </h3>

              <p className="text-sm text-white font-semibold">
                Get ₹20 Worth of BMVCOINS Free Today!
              </p>

              <p className="text-xs text-gray-300 mt-1">
                (1 BMVCOIN = ₹0.02 • You get 1000 Coins = ₹20)
              </p>

              <div className="grid grid-cols-2 gap-3 mt-3 text-center">
                <div className="bg-black/30 rounded-lg p-2">
                  <p className="text-gray-400 text-xs">Guaranteed Minimum</p>
                  <p className="text-white text-sm font-bold">₹20</p>
                </div>
                <div className="bg-black/30 rounded-lg p-2">
                  <p className="text-gray-400 text-xs">Potential Maximum</p>
                  <p className="text-white text-sm font-bold">₹2,000</p>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 mt-3">
                Total Distributed: ₹2,000+ (1,00,000 BMVCOINS)
              </p>
            </div>

            {/* CTA BUTTON (UNCHANGED SIZE) */}
            <div className="mt-6 flex justify-center lg:justify-start">
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="group bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-8 rounded-full flex items-center gap-3 hover:scale-105 transition"
              >
                {isLoading ? "Loading..." : "Claim Free Coins"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="lg:col-span-5 flex justify-center">
            <img
              src="https://i.ibb.co/GfBNqQFY/OurApp.png"
              alt="AI and Blockchain Technology"
              className="rounded-3xl shadow-2xl w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AIBlockchainHeroSection;
