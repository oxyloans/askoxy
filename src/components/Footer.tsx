import React from "react";
import Logo from "../assets/img/logo3.png";

const Footer: React.FC = () => {
  return (
    <footer className="p-8 bg-gray-50 shadow-lg text-center md:text-left">
      {/* Grid Layout for Footer Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Logo and Disclaimer Section */}
        <div className="text-center md:text-left text-gray-800">
          <img
            src={Logo}
            alt="AskOxy Logo"
            className="mb-4 mx-auto md:mx-0"
            style={{ width: "155px", height: "26px" }}
          />
          <p className="text-sm leading-relaxed">
            <span className="text-yellow-500 font-bold">Disclaimer:</span>{" "}
            AskOxy.AI delivers boundless freedom with unlimited ChatGPT prompts,
            enabling learners, researchers, and businesses to innovate without
            cost constraints.
          </p>
        </div>

        {/* Contact Section */}
        <div className="text-gray-800">
          <h4 className="text-lg font-semibold mb-2 text-purple-700">
            Registered Office Address:
          </h4>
          <p className="text-sm">
            OXYKART TECHNOLOGIES PVT LTD
            <br />
            CIN: U72900TG2020PTC142391
            <br />
            MIG-II, 287, KBHB Colony, Kukatpally, Hyderabad,
            <br />
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

        {/* Quick Links Section */}
        <div>
          <h4 className="text-lg font-semibold mb-2 text-purple-700">
            Quick Links
          </h4>
          <ul className="text-sm space-y-2 text-gray-800">
            <li>
              <a
                href="/about"
                className="hover:text-blue-600 hover:underline"
                aria-label="Learn About Us"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/privacy-policy"
                className="hover:text-blue-600 hover:underline"
                aria-label="View Privacy Policy"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms-of-service"
                className="hover:text-blue-600 hover:underline"
                aria-label="View Terms of Service"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="hover:text-blue-600 hover:underline"
                aria-label="Contact Us"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <p className="text-sm text-gray-600 text-center">
        &copy; 2024 <span className="text-purple-700 font-bold">ASKOXY.AI</span>{" "}
        All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
