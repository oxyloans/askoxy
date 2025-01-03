import React from "react";
import Logo from "../assets/img/logo3.png";

const Footer: React.FC = () => {
  return (
    <footer className="p-8 bg-white shadow text-center md:text-left">
      {/* Grid Layout for Footer Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Logo and Disclaimer Section */}
        <div className="text-center md:text-left text-black">
          <img
            src={Logo}
            alt="Logo"
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
        <div className="text-black">
          <h4 className="text-lg font-semibold mb-2 text-purple-600">
            Registered Office Address:
          </h4>
          <p className="text-sm">
            OXYKART TECHNOLOGIES PVT LTD
            <br />
            CIN: U72900TG2020PTC142391
            <br />
            Address: MIG-II, 287, KBHB Colony, Kukatpally, Hyderabad, Telangana
            - 500072
          </p>
          <p className="text-sm mt-2">
            Email:{" "}
            <a href="mailto:support@askoxy.ai" className="text-blue-600">
              support@askoxy.ai
            </a>
          </p>
        </div>

        {/* Optional Links Section */}
        <div>
          <h4 className="text-lg font-semibold mb-2 text-purple-600">
            Quick Links
          </h4>
          <ul className="text-sm space-y-2 text-black">
            <li>
              <a href="/about" className="hover:text-blue-600">
                About Us
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-blue-600">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms-of-service" className="hover:text-blue-600">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-600">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <p className="text-md text-gray-600 text-center">
        &copy; 2024 <span className="text-purple-400 font-bold">ASKOXY.AI</span>{" "}
        All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
