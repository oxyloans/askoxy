import React, { useState, useEffect } from "react";
import coinImage from "../assets/img/BMVCOIN1.png";

const BMVCoinPromo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 23, minutes: 59, seconds: 59 });

  // Animation on component mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
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
  
  return (
    <section className={`relative py-8 px-4 sm:py-12 sm:px-6 md:py-8 lg:py-10 md:px-8 lg:px-16 bg-gradient-to-br from-white via-purple-50 to-purple-100 text-purple-900  shadow-lg overflow-hidden transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Animated particles */}
        <div className="hidden md:block absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 10}s linear infinite`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Content Section */}
        <div className="w-full lg:w-3/5 text-center lg:text-left">
          <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-lg border border-purple-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div className="flex items-center justify-center sm:justify-start mb-4 sm:mb-0">
                <span className="inline-block px-4 py-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-bold rounded-full">
                  EXCLUSIVE OFFER
                </span>
               
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 leading-tight text-purple-900">
              Get <span className="text-purple-600">10,000 BMVCOINS</span> Free Today!
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl mb-6 font-light text-purple-800">
              Claim your <span className="text-purple-600 font-semibold">10,000 BMVCOINS</span> now 
              and join thousands already benefiting from this revolutionary digital currency.
            </p>
            
            <div className="bg-gradient-to-br from-purple-50 to-white p-5 sm:p-7 rounded-lg mb-6 border border-purple-200 shadow-sm">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-center text-purple-800">
                Future Value Projections
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <div className="bg-white p-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-md border border-purple-100">
                  <p className="text-purple-600 font-bold text-sm sm:text-base">Minimum</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-900">₹10,000</p>
                </div>
                <div className="bg-white p-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-md border border-purple-100">
                  <p className="text-purple-600 font-bold text-sm sm:text-base">Maximum</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-900">₹1,00,000</p>
                </div>
                <div className="bg-white p-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-md border border-purple-100">
                  <p className="text-purple-600 font-bold text-sm sm:text-base">Great Value</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-900">₹8,00,000+</p>
                </div>
              </div>
              
             
            </div>
            
            <div className=" w-1/2 flex flex-col sm:flex-row gap-4 mb-2">
              <button className=" flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:translate-y-px text-base sm:text-lg flex items-center justify-center gap-2">
                <span className="text-lg">🚀</span> Claim Your Coins Now
              </button>
            </div>
            
          </div>
        </div>
        
        {/* Coin Image Section */}
        <div className="w-full lg:w-2/5 flex justify-center pt-6 lg:pt-0">
          <div className="relative">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 w-full h-full rounded-full bg-purple-300 opacity-20 filter blur-xl"></div>
            
            {/* Main coin with floating animation */}
            <div className="relative animate-float">
              <div className="p-6 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-full shadow-lg">
                <img
                  src={coinImage}
                  alt="BMV Coin"
                  className="w-40 sm:w-48 md:w-56 lg:w-64 rounded-full shadow-md animate-spin-slow"
                />
              </div>
              
              {/* Animated rings around coin */}
              <div className="absolute inset-0 -m-3 border border-purple-300 border-opacity-30 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 -m-6 border border-purple-200 border-opacity-20 rounded-full animate-ping"></div>
              
              {/* Mini coins */}
              <div className="absolute -top-6 -right-4 w-12 h-12 bg-white p-1 rounded-full shadow-lg transform rotate-12 animate-float-delay z-20">
                <img src={coinImage} alt="Mini coin" className="w-full h-full rounded-full" />
              </div>
              <div className="absolute -bottom-2 -left-8 w-16 h-16 bg-white p-1 rounded-full shadow-lg transform -rotate-12 animate-float-fast z-20">
                <img src={coinImage} alt="Mini coin" className="w-full h-full rounded-full" />
              </div>
            </div>
            
            {/* Subtle reflection */}
            <div className="absolute -bottom-16 left-0 right-0 flex justify-center opacity-20">
              <img
                src={coinImage}
                alt="BMV Coin Reflection"
                className="w-40 sm:w-48 md:w-56 lg:w-64 transform scale-y-50 opacity-40 blur-sm"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Trust indicators */}
      <div className="relative z-10 mt-8 pt-6 border-t border-purple-200">
        <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
          <div className="flex flex-col items-center p-2 opacity-80 hover:opacity-100 transition-opacity">
            <svg className="w-6 h-6 mb-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-purple-800 font-medium">Secure Blockchain</span>
          </div>
          <div className="flex flex-col items-center p-2 opacity-80 hover:opacity-100 transition-opacity">
            <svg className="w-6 h-6 mb-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-purple-800 font-medium">Instant Delivery</span>
          </div>
          <div className="flex flex-col items-center p-2 opacity-80 hover:opacity-100 transition-opacity">
            <svg className="w-6 h-6 mb-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-purple-800 font-medium">Zero Transaction Fees</span>
          </div>
        </div>
        
      
      </div>
    </section>
  );
};

export default BMVCoinPromo;