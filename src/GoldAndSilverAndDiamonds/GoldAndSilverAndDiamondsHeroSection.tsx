import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const rotatingWords = [
  "Gold Jewelry",
  "Silver Ornaments",
  "Diamond Collection",
  "Custom Designs",
  "Elegant Accessories",
];

function GoldSilverDiamondHeroSection() {
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);

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

  const handleExplore = () => {
    const userId = localStorage.getItem("userId");
    const redirectPath = "/main/services/71e3/gold-silver-diamonds";

    if (userId) {
      navigate(redirectPath);
    } else {
      sessionStorage.setItem("redirectPath", redirectPath);
      window.location.href = "/whatsapplogin";
    }
  };

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-amber-50 via-rose-50 to-yellow-50 px-6 py-16">
      {/* Hero Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        {/* Left Content */}
        <div
          className={`space-y-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
          }`}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Timeless Beauty in{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-pink-600 to-rose-500">
              {typedText}
              <span
                className={`inline-block w-1 h-8 bg-gradient-to-b from-yellow-500 to-pink-500 ml-1 rounded-full ${
                  isTypingComplete ? "animate-pulse" : ""
                }`}
              ></span>
            </span>
          </h1>

          <p className="text-gray-600 text-lg max-w-xl">
            Discover a world of elegance and tradition with our exclusive Gold,
            Silver, and Diamond collections — curated to perfection for every
            special moment.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleExplore}
              className="bg-gradient-to-r from-yellow-500 to-pink-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow hover:scale-105 transition-all flex items-center gap-2"
            >
              Explore Collection
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              {
                title: "Gold Collection",
                desc: "22K & 24K timeless designs.",
                icon: "🏆",
              },
              {
                title: "Silver Pieces",
                desc: "Chic & traditional silver.",
                icon: "✨",
              },
              {
                title: "Diamond Range",
                desc: "Certified premium brilliance.",
                icon: "💎",
              },
            ].map(({ title, desc, icon }, idx) => (
              <div
                key={idx}
                className="bg-white/60 border border-white/30 backdrop-blur-md rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-2">{icon}</div>
                <h3 className="font-semibold text-lg text-yellow-600">
                  {title}
                </h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image */}
        <div
          className={`flex justify-center transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
          }`}
        >
          <div className="relative group max-w-md w-full">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 to-pink-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition" />
            <img
              src="https://i.ibb.co/TD2JCyy7/8.png"
              alt="Jewelry"
              className="relative rounded-2xl shadow-xl group-hover:scale-105 transition duration-500"
            />
          
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .animate-pulse {
          animation: pulse 1s infinite;
        }
      `}</style>
    </section>
  );
}

export default GoldSilverDiamondHeroSection;
