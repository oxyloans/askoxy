import React, { useState, useEffect } from "react";
import coinImage from "../assets/img/BMVCOIN1.png";
import { useNavigate } from "react-router-dom";
const BMVCoinPromo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
    const LOGIN_URL = "/whatsapplogin";
    const navigate = useNavigate();

  // Animation on component mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSignIn = () => {
    try {
      setIsLoading(true);

      const userId = localStorage.getItem("userId");
      const redirectPath = "/main/crypto"; // your desired path

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
    <section
      className={`relative min-h-screen py-8 px-4 sm:py-12 sm:px-6 md:py-8 lg:py-10 md:px-8 lg:px-16 bg-gradient-to-br from-white via-purple-50 to-purple-100 text-purple-900 shadow-lg overflow-hidden transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Simplified Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 min-h-screen py-8">
        {/* Content Section */}
        <div className="w-full lg:w-3/5 text-center lg:text-left">
          <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-lg border border-purple-200">
            <div className="mb-6">
              <span className="inline-block px-4 py-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-bold rounded-full">
                EXCLUSIVE OFFER
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 leading-tight text-purple-900">
              Get <span className="text-purple-600">1000 BMVCOINS</span> Free
              Today!
            </h2>

            <p className="text-base sm:text-lg md:text-xl mb-6 font-light text-purple-800">
              Claim your{" "}
              <span className="text-purple-600 font-semibold">
                1000 BMVCOINS
              </span>{" "}
              now and join thousands already benefiting from this revolutionary
              digital currency.
            </p>

            <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-lg mb-6 border border-purple-200 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center text-purple-800">
                Future Value Projections
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-purple-100">
                  <p className="text-purple-600 font-bold text-sm">Minimum</p>
                  <p className="text-xl font-bold text-purple-900">1000 BMVCOINS</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-purple-100">
                  <p className="text-purple-600 font-bold text-sm">Maximum</p>
                  <p className="text-xl font-bold text-purple-900">Up to 1,00,000 BMVCOINS</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-purple-100">
                  <p className="text-purple-600 font-bold text-sm">
                    Great Value
                  </p>
                  <p className="text-xl font-bold text-purple-900">
                    8,00,000+
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-start mb-4">
              <button onClick={handleSignIn} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 text-base flex items-center justify-center gap-2">
                <span>🚀</span> Claim Your Coins Now
              </button>
            </div>
          </div>
        </div>

        {/* Simplified Coin Image Section */}
        <div className="w-full lg:w-2/5 flex justify-center">
          <div className="relative">
            {/* Simplified glow effect */}
            <div className="absolute inset-0 w-full h-full rounded-full bg-purple-300 opacity-20 filter blur-xl"></div>

            {/* Main coin with simplified animation */}
            <div className="relative">
              <div className="p-6 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-full shadow-lg">
                <img
                  src={coinImage}
                  alt="BMV Coin"
                  className="w-40 sm:w-48 md:w-56 lg:w-64 rounded-full shadow-md"
                />
              </div>

              {/* Simplified ring */}
              <div className="absolute inset-0 -m-3 border border-purple-300 border-opacity-30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Trust indicators */}
      <div className="relative z-10 mt-4 pt-4 border-t border-purple-200">
        <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
          <div className="flex flex-col items-center p-2">
            <svg
              className="w-6 h-6 mb-1 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-purple-800 font-medium">
              Secure Blockchain
            </span>
          </div>
          <div className="flex flex-col items-center p-2">
            <svg
              className="w-6 h-6 mb-1 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-purple-800 font-medium">
              Instant Delivery
            </span>
          </div>
          <div className="flex flex-col items-center p-2">
            <svg
              className="w-6 h-6 mb-1 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-purple-800 font-medium">
              Zero Transaction Fees
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BMVCoinPromo;
