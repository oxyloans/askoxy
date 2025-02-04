import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
import Logo from "../assets/img/logo.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 text-black p-10">
      <div className=" mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo & Social Media Section */}
        <div className="text-center md:text-left">
          <img
            src={Logo}
            alt="AskOxy Logo"
            className="mx-auto md:mx-0 mb-4"
            style={{ width: "160px", height: "auto" }}
          />
          <div className="flex justify-center md:justify-start space-x-4">
            <a
              href="https://www.facebook.com/profile.php?id=61572388385568"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="h-6 w-6 text-blue-600 hover:text-blue-800 transition duration-300" />
            </a>
            <a
              href="https://x.com/i/flow/login?redirect_after_login=%2FBmvMoney"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="h-6 w-6 text-blue-400 hover:text-blue-600 transition duration-300" />
            </a>
            <a
              href="https://www.instagram.com/askoxy.ai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="h-6 w-6 text-pink-600 hover:text-pink-800 transition duration-300" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCUQX01nSvPOkYY1w-x2sQgQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="h-6 w-6 text-red-600 hover:text-red-800 transition duration-300" />
            </a>
            <a
              href="https://www.linkedin.com/in/askoxy-ai-5a2157349/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="h-6 w-6 text-blue-600 hover:text-blue-800 transition duration-300" />
            </a>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="text-center md:text-center">
          <h4 className="text-lg font-semibold text-purple-700 mb-4">
            Disclaimer
          </h4>
          <p className="text-sm leading-relaxed">
            <span className="text-yellow-500 font-bold">AskOxy.AI</span>{" "}
            delivers boundless freedom with unlimited ChatGPT prompts,
            empowering learners, researchers, and businesses to innovate without
            cost constraints.
          </p>
        </div>

        {/* Office Address Section */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold text-purple-700 mb-4">
            Registered Office Address
          </h4>
          <p className="text-sm leading-relaxed">
            OXYKART TECHNOLOGIES PVT LTD <br />
            CIN: U72900TG2020PTC142391 <br />
            MIG-II, 287, KBHB Colony, Kukatpally, Hyderabad, <br />
            Telangana - 500072
          </p>
          <p className="text-sm mt-2">
            Email:{" "}
            <a
              href="mailto:support@askoxy.ai"
              className="text-blue-600 hover:underline"
            >
              support@askoxy.ai
            </a>
          </p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-300 mt-6 pt-4 text-center">
        <p className="text-sm text-black">
          &copy; 2024{" "}
          <span className="text-purple-700 font-bold">ASKOXY.AI</span>. All
          Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
