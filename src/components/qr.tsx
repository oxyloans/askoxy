import React from "react";
import { Check, Facebook, Instagram, LinkedinIcon } from "lucide-react";
import PlayStore from "../assets/img/play (1).png";
import AppStore from "../assets/img/app (1).png";
import Logo from "../assets/img/logo.png";

const QR = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-lg p-4 md:p-8 text-center max-w-md w-full">
        {/* Check Icon */}
        <div className="mb-4">
          <Check className="mx-auto text-green-500" size={96} strokeWidth={3} />
        </div>

        {/* Thank You Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
          Thank You for Scanning!
        </h1>

        {/* Logo & Website Link */}
        <div className="flex items-center justify-between text-white bg-[#351650] font-bold rounded-lg mb-4 shadow">
          <a
            href="https://www.askoxy.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center px-6 py-3 transition duration-300 w-full"
            aria-label="Visit ASKOXY.AI website"
          >
            ASKOXY.AI
            <img src={Logo} alt="Company Logo" className="w-20 h-auto" />
          </a>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-col space-y-4 mb-4">
          <a
            href="https://play.google.com/store/apps/details?id=com.oxyrice.oxyrice_customer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center px-6 py-3 bg-[#04AA6D] text-white rounded-lg shadow-md transition duration-300 w-full"
            aria-label="Download from Google Play Store"
          >
            <span className="text-lg font-semibold">Google Play</span>
            <img src={PlayStore} alt="Google Play" className="w-24 h-auto" />
          </a>

          <a
            href="https://apps.apple.com/in/app/e-rice-rice-grocery-delivery/id1566140961"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center px-6 py-3 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition duration-300 w-full"
            aria-label="Download from App Store"
          >
            <span className="text-lg font-semibold">App Store</span>
            <img src={AppStore} alt="iOS App Store" className="w-24 h-auto" />
          </a>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col space-y-4">
          <a
            href="https://www.facebook.com/profile.php?id=61572388385568"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center px-6 py-3 bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-900 transition duration-300 w-full"
            aria-label="Visit Facebook page"
          >
            <span className="text-lg font-semibold">Facebook</span>
            <Facebook size={24} />
          </a>

          <a
            href="https://www.linkedin.com/in/askoxy-ai-5a2157349/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center px-6 py-3 bg-[#008CBA] text-white rounded-lg shadow-md hover:bg-[#008ABC] transition duration-300 w-full"
            aria-label="Visit LinkedIn page"
          >
            <span className="text-lg font-semibold">Linked In</span>
            <LinkedinIcon size={24} />
          </a>

          <a
            href="https://www.instagram.com/askoxy.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center px-6 py-3 bg-pink-600 text-white rounded-lg shadow-md hover:bg-pink-700 transition duration-300 w-full"
            aria-label="Visit Instagram page"
          >
            <span className="text-lg font-semibold">Instagram</span>
            <Instagram size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default QR;
