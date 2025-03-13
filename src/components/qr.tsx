import React from "react";
import { Facebook, Instagram, LinkedinIcon } from "lucide-react";
import PlayStore from "../assets/img/play (1).png";
import AppStore from "../assets/img/app (1).png";
import Logo from "../assets/img/logo.png";

const QR = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-2 sm:p-4 md:p-4">
      <div className="bg-white shadow-xl rounded-lg p-2 sm:p-4 md:p-4 text-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        {/* Greeting - Responsive text sizing */}
        <div className="mb-5 sm:mb-6 text-center">
          <a
            href="https://www.linkedin.com/in/oxyradhakrishna/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm   text-[#351650] hover:underline mb-2 sm:mb-3"
          >
            Greetings from Radhakrishna Thatavarti!
          </a>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
            Welcome to ASKOXY.AI
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-2 md:mb-3">
            The AI & Blockchain{" "}
            <span className="font-bold">AI-Z Marketplace!</span>
          </p>

          <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 md:mb-3">
            Discover endless opportunities in #Rice, #StudyAbroad, #RealEstate,
            and more.
          </p>

          <p className="text-base sm:text-lg font-bold text-[#04AA6D]">
            🚀 Start exploring today!
          </p>
        </div>

        {/* Logo & Website Link - Better touch target */}
        <div className="flex items-center justify-between text-white bg-[#351650] font-bold rounded-lg mb-2 sm:mb-4 shadow">
          <a
            href="https://www.askoxy.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center px-4 sm:px-4 py-2 sm:py-2 transition duration-300 w-full"
            aria-label="Visit ASKOXY.AI website"
          >
            <span className="text-base sm:text-lg">ASKOXY.AI Homepage</span>
            <img
              src={Logo}
              alt="Company Logo"
              className="w-16 sm:w-20 h-auto"
            />
          </a>
        </div>

        {/* Download Buttons - Optimized for all devices */}
        <div className="flex flex-col space-y-3 sm:space-y-4 mb-2 sm:mb-4">
          <a
            href="https://play.google.com/store/apps/details?id=com.oxyrice.oxyrice_customer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-[#04AA6D] text-white rounded-lg shadow-md hover:bg-[#039d64] active:bg-[#038d59] transition duration-300 w-full"
            aria-label="Download from Google Play Store"
          >
            <span className="text-base sm:text-lg font-semibold">
              Android App
            </span>
            <img
              src={PlayStore}
              alt="Google Play"
              className="w-20 sm:w-24 h-auto"
            />
          </a>

          <a
            href="https://apps.apple.com/in/app/askoxy-ai-rice-delivery/id6738732000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 active:bg-gray-900 transition duration-300 w-full"
            aria-label="Download from App Store"
          >
            <span className="text-base sm:text-lg font-semibold">iOS App</span>
            <img
              src={AppStore}
              alt="iOS App Store"
              className="w-20 sm:w-24 h-auto"
            />
          </a>
        </div>

        {/* Social Media Links - Improved touch targets and feedback */}
        <div className="flex flex-col space-y-3 sm:space-y-4">
          <a
            href="https://www.facebook.com/profile.php?id=61572388385568"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 active:bg-blue-800 transition duration-300 w-full"
            aria-label="Visit Facebook page"
          >
            <span className="text-base sm:text-lg font-semibold">
              ASKOXY.AI Facebook
            </span>
            <Facebook size={20} className="sm:w-6 sm:h-6" />
          </a>

          <a
            href="https://www.linkedin.com/in/askoxy-ai-5a2157349/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-[#0077B5] text-white rounded-lg shadow-md hover:bg-[#006699] active:bg-[#00557A] transition duration-300 w-full"
            aria-label="Visit LinkedIn page"
          >
            <span className="text-base sm:text-lg font-semibold">
              ASKOXY.AI LinkedIn
            </span>
            <LinkedinIcon size={20} className="sm:w-6 sm:h-6" />
          </a>

          <a
            href="https://www.instagram.com/askoxy.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-lg shadow-md hover:from-purple-600 hover:via-pink-600 hover:to-red-600 active:from-purple-700 active:via-pink-700 active:to-red-700 transition duration-300 w-full"
            aria-label="Visit Instagram page"
          >
            <span className="text-base sm:text-lg font-semibold">
              ASKOXY.AI Instagram
            </span>
            <Instagram size={20} className="sm:w-6 sm:h-6" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default QR;
