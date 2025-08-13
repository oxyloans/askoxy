import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import coinImage from "../assets/img/BMVCOIN1.png";

const BMVCoinPromo: React.FC = () => {
  const navigate = useNavigate();
  const LOGIN_URL = "/whatsapplogin";
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSignIn = () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/crypto";
      if (userId) navigate(redirectPath);
      else {
        sessionStorage.setItem("redirectPath", redirectPath);
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { label: "Guaranteed Minimum", value: "₹20 (1000 BMVCOINS)" },
    { label: "Potential Maximum", value: "₹2,000 (1,00,000 BMVCOINS)" },
    { label: "Total Distributed", value: "₹2,000+ (1,00,000 BMVCOINS)" },
  ];

  return (
    <section
      className={`relative min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 overflow-hidden transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-30 -mt-10 -mr-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-30 -mb-10 -ml-10"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-4 md:px-8 lg:px-16 py-16 space-y-10 lg:space-y-0">
        {/* Left Content */}
        <div className="w-full lg:w-3/5 text-center lg:text-left">
          <div className="bg-white bg-opacity-90 backdrop-blur-md border border-purple-200 rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Badge */}
            <div className="inline-block px-4 py-1 text-white text-xs sm:text-sm font-semibold rounded-full bg-gradient-to-r from-purple-600 to-purple-500 mb-4 animate-pulse">
              🎉 LIMITED TIME OFFER
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-900 mb-4">
              Get <span className="text-purple-600">₹20 Worth of BMVCOINS</span>{" "}
              Free Today!
            </h2>

            {/* Subtext */}
            <p className="text-lg text-purple-800 mb-6 leading-relaxed">
              Join thousands already enjoying{" "}
              <span className="text-purple-600 font-semibold">
                exclusive crypto rewards
              </span>
              . Don’t miss your free ₹20 boost — no strings attached!
            </p>

            {/* Coin Value Note */}
            <p className="text-sm text-purple-700 italic mb-6">
              (1 BMVCOIN = ₹0.02 • You get 1000 coins = ₹20)
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition"
                >
                  <p className="text-purple-600 text-sm font-bold uppercase">
                    {item.label}
                  </p>
                  <p className="text-xl font-bold text-purple-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex justify-center lg:justify-start">
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className={`px-6 py-3 text-white font-bold rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105 hover:shadow-lg transition-all duration-300 text-base flex items-center justify-center gap-2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                🚀 {isLoading ? "Processing..." : "Claim Free Coins"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Coin Image */}
        <div className="w-full lg:w-2/5 flex justify-center">
          <div className="relative animate-bounce-slow">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-purple-300 opacity-20 rounded-full blur-xl"></div>

            {/* Coin Image */}
            <div className="relative p-6 bg-white bg-opacity-90 rounded-full shadow-xl">
              <img
                src={coinImage}
                alt="BMV Coin Promo"
                className="w-40 sm:w-48 md:w-56 lg:w-64 rounded-full shadow-md"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BMVCoinPromo;
