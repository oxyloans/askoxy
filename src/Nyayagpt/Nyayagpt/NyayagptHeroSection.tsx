import React, { useState, useEffect } from "react";
import { ArrowRight, Home, Building, Key } from "lucide-react";

function NyayagptHeroSection() {
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const rotatingWords = [
    "Legal Clarity",
    "Property Insights",
    "Smarter Investments",
  ];
  const fullHeadingText = "Empower Your Journey with ";

  useEffect(() => {
    let index = 0;
    const word = rotatingWords[currentWordIndex];
    setTypedText("");
    setIsTypingComplete(false);

    const interval = setInterval(() => {
      if (index < word.length) {
        setTypedText(word.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
        setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentWordIndex]);

  const handleSignIn = () => {
    // Demo function - would normally handle navigation
    console.log("Navigate to sign in");
  };

  return (
    <section className="relative bg-gradient-to-br from-amber-900 via-yellow-800 to-yellow-900 py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Text Area */}
        <div className="lg:col-span-7 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {fullHeadingText}
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
              {typedText}
              <span
                className={`inline-block w-1 h-8 bg-yellow-300 ml-1 ${
                  isTypingComplete ? "animate-pulse" : ""
                }`}
              ></span>
            </span>
          </h1>
          <p className="text-amber-100 text-lg sm:text-xl mt-6 max-w-2xl mx-auto lg:mx-0">
            NyayaGPT combines AI-driven property insights with legal clarity.
            Get expert guidance for smarter real estate decisions — all in one
            platform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {[
              {
                title: "Legal Consultation",
                icon: Key,
                color: "text-yellow-300",
                desc: "Trusted legal advice for secure transactions.",
              },
              {
                title: "Verified Properties",
                icon: Home,
                color: "text-amber-300",
                desc: "AI-screened listings with complete legal check.",
              },
              {
                title: "Real Estate Guidance",
                icon: Building,
                color: "text-yellow-400",
                desc: "Make informed decisions backed by AI insights.",
              },
            ].map(({ title, icon: Icon, color, desc }, idx) => (
              <div
                key={idx}
                className="bg-white/10 border border-amber-200/20 p-5 rounded-2xl hover:bg-white/15 transition duration-300 hover:scale-105 shadow-md text-center backdrop-blur-sm"
              >
                <div
                  className={`mb-3 p-3 rounded-full ${color} bg-amber-900/30 inline-block`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-semibold ${color}`}>{title}</h3>
                <p className="text-sm text-amber-100 mt-2">{desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleSignIn}
            className="mt-10 inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-bold px-6 py-3 rounded-full hover:from-amber-700 hover:to-yellow-600 shadow-xl hover:shadow-amber-400/40 transition-all transform hover:scale-105"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Image */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/30 to-yellow-400/30 blur-2xl rounded-3xl animate-pulse" />
            <img
              src="https://i.ibb.co/wh3kBpgN/nyaya1.png"
              alt="NyayaGPT App Preview"
              className="relative rounded-3xl shadow-2xl w-full max-w-sm lg:max-w-md border border-amber-200/20"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default NyayagptHeroSection;