import React from "react";
import { Check, Download } from "lucide-react";
import A from "../assets/img/app (1).png";
import P from "../assets/img/play (1).png";

const ThankYouPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 text-center max-w-lg w-full">
        {/* Check Icon */}
        <div className="mb-6">
          <Check className="mx-auto text-green-500" size={72} strokeWidth={2} />
        </div>

        {/* Thank You Title */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-4">
          Thank You!
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
          We appreciate your interest in our{" "}
          <strong>Free Rice Sample and Steel Container</strong> offer! Download
          our app now and enjoy exclusive benefits.
        </p>

        {/* Download Links */}
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          {/* Google Play Store Link */}
          <a
            href="https://play.google.com/store/apps/details?id=com.oxyrice.oxyrice_customer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-black px-4 py-3 rounded-lg shadow-md hover:bg-gray-800 transition duration-300"
          >
            <Download size={20} className="text-white mr-2" />
            <img src={P} alt="Google Play" className="w-28 h-auto" />
          </a>

          {/* Android APK Link */}
          <a
            href="https://apps.apple.com/in/app/e-rice-rice-grocery-delivery/id1566140961"
            download
            className="flex items-center bg-[#04AA6D] px-4 py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
          >
            <Download size={20} className="text-white mr-2" />
            <img src={A} alt="Ios" className="w-28 h-auto" />
          </a>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-500">
          Available for Android devices. Tap the button to download now!
        </p>
      </div>
    </div>
  );
};

export default ThankYouPage;
