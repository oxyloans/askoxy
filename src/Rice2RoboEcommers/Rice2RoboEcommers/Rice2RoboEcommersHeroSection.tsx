import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles, ShoppingCart, Package, Truck, Star, Users, Award, Zap, Shield } from "lucide-react";
import Heroimg from "../../assets/img/heroimg3.9e623f6b9910c2a08a0d.png";
function Rice2RoboEcommersHeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const rotatingWords = [
    "Smart Shopping",
    "Quality Products",
    "Fast Delivery",
  ];
  const fullHeadingText = "Experience";

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
          }, 2000);
        }
      }, 100);

      return typingInterval;
    };

    const typingInterval = startTypingAnimation();
    return () => clearInterval(typingInterval);
  }, [currentWordIndex]);

  const handleShopNow = () => {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-6 sm:py-8 lg:py-16 pb-16 sm:pb-20 overflow-hidden min-h-screen flex items-center">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div
            className={`lg:col-span-7 space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left transform transition-all duration-700 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="space-y-3 sm:space-y-4">
              {/* Brand Badge */}
             

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white">
                {fullHeadingText}
                <span className="block mt-1 sm:mt-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                    {typedText}
                    <span
                      className={`inline-block w-0.5 sm:w-1 h-6 sm:h-8 md:h-10 lg:h-12 bg-blue-400 ml-1 ${
                        isTypingComplete ? "animate-pulse" : ""
                      }`}
                    ></span>
                  </span>
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl mt-4 sm:mt-6 lg:mt-8 mx-auto lg:mx-0">
                Your one-stop destination for premium products and exceptional
                shopping experience. From electronics to lifestyle products, we
                deliver quality and convenience right to your doorstep.
              </p>

              {/* Enhanced Service Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-6 sm:mt-8 lg:mt-10">
                {[
                  {
                    title: "Premium Products",
                    icon: Package,
                    color: "text-blue-400",
                    bgColor: "from-blue-500/10 to-blue-600/5",
                    description:
                      "Curated selection of high-quality products from trusted brands and manufacturers worldwide.",
                  },
                  {
                    title: "Fast Shipping",
                    icon: Truck,
                    color: "text-purple-400",
                    bgColor: "from-purple-500/10 to-purple-600/5",
                    description:
                      "Lightning-fast delivery with real-time tracking and secure packaging for all your orders.",
                  },
                  {
                    title: "24/7 Support",
                    icon: Shield,
                    color: "text-pink-400",
                    bgColor: "from-pink-500/10 to-pink-600/5",
                    description:
                      "Round-the-clock customer support with hassle-free returns and comprehensive warranty coverage.",
                  },
                ].map(
                  (
                    { title, icon: Icon, color, bgColor, description },
                    index
                  ) => (
                    <div
                      key={index}
                      className={`bg-gradient-to-br ${bgColor} backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6 border border-white/10 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:bg-white/5 hover:scale-105 cursor-pointer group`}
                    >
                      <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                        <div
                          className={`p-2 sm:p-3 rounded-full bg-gradient-to-r from-white/10 to-white/5 ${color} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8" />
                        </div>
                        <h3
                          className={`text-sm sm:text-base lg:text-lg xl:text-xl font-semibold ${color}`}
                        >
                          {title}
                        </h3>
                        <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed">
                          {description}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mt-6 sm:mt-8">
              <button
                onClick={handleShopNow}
                className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2.5 sm:py-3 lg:py-4 px-5 sm:px-6 lg:px-8 rounded-full flex items-center justify-center gap-2 sm:gap-3 hover:from-blue-600 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
                Shop Now
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleContact}
                className="group bg-white/10 backdrop-blur-sm text-white font-semibold py-2.5 sm:py-3 lg:py-4 px-5 sm:px-6 lg:px-8 rounded-full hover:bg-white/20 flex items-center justify-center gap-2 sm:gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/20 text-sm sm:text-base"
              >
                <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 group-hover:rotate-12 transition-transform" />
                Get Support
              </button>
            </div>

            
          </div>

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
                src={Heroimg}
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
    </section>
  );
}

export default Rice2RoboEcommersHeroSection;