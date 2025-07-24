import React, { useState, useEffect } from "react";
import { ArrowRight, Home, Building, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RealEstateHeroSection() {
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const navigate = useNavigate();
  const LOGIN_URL = "/whatsapplogin";

  const rotatingWords = [
    "Dream Properties",
    "Smart Investments",
    "Premium Locations",
  ];
  const heading = "Discover Your";

  useEffect(() => {
    let charIndex = 0;
    const currentWord = rotatingWords[currentWordIndex];
    setTypedText("");
    setIsTypingComplete(false);

    const interval = setInterval(() => {
      if (charIndex < currentWord.length) {
        setTypedText(currentWord.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
        setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        }, 2000);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [currentWordIndex]);

  const handleSignIn = () => {
    const userId = localStorage.getItem("userId");
    const redirectPath = "/main/services/37b3/urban-springs-300-sqyards-vill";
    if (userId) {
      navigate(redirectPath);
    } else {
      sessionStorage.setItem("redirectPath", redirectPath);
      window.location.href = LOGIN_URL;
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 py-12 lg:py-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 items-center gap-10">
          {/* Left Section */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {heading}
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                {typedText}
                <span
                  className={`inline-block w-1 h-8 bg-emerald-400 ml-1 ${
                    isTypingComplete ? "animate-pulse" : ""
                  }`}
                ></span>
              </span>
            </h1>

            <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0">
              Your trusted partner for home, investment, or commercial real
              estate. Powered by expert guidance and modern technology.
            </p>

            {/* Services */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  title: "Residential Sales",
                  icon: Home,
                  color: "text-emerald-400",
                  desc: "Dream homes in desirable locations.",
                },
                {
                  title: "Commercial Spaces",
                  icon: Building,
                  color: "text-teal-400",
                  desc: "High-growth real estate for your business.",
                },
                {
                  title: "Property Management",
                  icon: Key,
                  color: "text-green-400",
                  desc: "Smart maintenance & rental optimization.",
                },
              ].map(({ title, icon: Icon, color, desc }, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center transition-all duration-300 hover:bg-white/10 hover:scale-105 shadow-lg"
                >
                  <div
                    className={`mb-3 p-3 rounded-full bg-white/10 inline-block ${color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className={`text-lg font-semibold ${color}`}>{title}</h3>
                  <p className="text-sm text-gray-300 mt-2">{desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-6">
              <button
                onClick={handleSignIn}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Browse Properties
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-3 bg-cyan-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition duration-300"></div>
              <img
                src="https://i.ibb.co/G3bFgTFY/2.png"
                alt="Real estate services"
                className="relative rounded-3xl w-full max-w-sm sm:max-w-md lg:max-w-full shadow-xl transition-transform duration-500 group-hover:scale-105"
              />
             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RealEstateHeroSection;
