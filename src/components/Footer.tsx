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
    <footer className="p-8 bg-gray-50 shadow-lg text-center md:text-left">
      {/* Grid Layout for Footer Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Logo and Social Media Section */}
        <div className="text-center md:text-left text-gray-800">
          <img
            src={Logo}
            alt="AskOxy Logo"
            className="mb-4 mx-auto md:mx-0"
            style={{ width: "150px", height: "auto" }}
          />
          {/* <p className="text-sm text-gray-600">
            Innovating the way you learn, research, and grow with boundless AI
            freedom.
          </p> */}
          {/* Social Media Links */}
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            <a
              href="https://www.facebook.com/BMV.MONEY"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="h-6 w-6 text-blue-600 hover:text-blue-800 transition-colors duration-300" />
            </a>
            <a
              href="https://x.com/i/flow/login?redirect_after_login=%2FBmvMoney"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="h-6 w-6 text-blue-400 hover:text-blue-600 transition-colors duration-300" />
            </a>
            <a
              href="https://www.instagram.com/bmv.money/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="h-6 w-6 text-pink-600 hover:text-pink-800 transition-colors duration-300" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCUQX01nSvPOkYY1w-x2sQgQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="h-6 w-6 text-red-600 hover:text-red-800 transition-colors duration-300" />
            </a>
            <a
              href="https://www.linkedin.com/company/bmv-money/about/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="h-6 w-6 text-blue-600 hover:text-blue-800 transition-colors duration-300" />
            </a>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="text-center md:text-center text-gray-800">
          <h4 className="text-lg font-semibold mb-4 text-purple-700">
            Disclaimer
          </h4>
          <p className="text-sm leading-relaxed">
            <span className="text-yellow-500 font-bold">AskOxy.AI</span>{" "}
            delivers boundless freedom with unlimited ChatGPT prompts,
            empowering learners, researchers, and businesses to innovate without
            cost constraints.
          </p>
        </div>

        {/* Registered Office Address Section */}
        <div className="text-center md:text-left text-gray-800">
          <h4 className="text-lg font-semibold mb-4 text-purple-700">
            Registered Office Address
          </h4>
          <p className="text-sm">
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
              aria-label="Email AskOxy Support"
            >
              support@askoxy.ai
            </a>
          </p>
        </div>
      </div>

      {/* Quick Links Section */}
      {/* <div className="text-center md:text-left">
        <h4 className="text-lg font-semibold mb-2 text-purple-700">
          Quick Links
        </h4>
        <ul className="text-sm space-y-2 text-gray-800 flex justify-center md:justify-start gap-6 flex-wrap">
          <li>
            <a
              href="#about"
              className="hover:text-blue-600 hover:underline"
              aria-label="Learn About Us"
            >
              About Us
            </a>
          </li>
          <li>
            <a
              href="#privacy"
              className="hover:text-blue-600 hover:underline"
              aria-label="View Privacy Policy"
            >
              Privacy Policy
            </a>
          </li>
          <li>
            <a
              href="#terms"
              className="hover:text-blue-600 hover:underline"
              aria-label="View Terms of Service"
            >
              Terms of Service
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="hover:text-blue-600 hover:underline"
              aria-label="Contact Us"
            >
              Contact
            </a>
          </li>
        </ul>
      </div> */}

      {/* Copyright Section */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          &copy; 2024{" "}
          <span className="text-purple-700 font-bold">ASKOXY.AI</span> All
          Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
