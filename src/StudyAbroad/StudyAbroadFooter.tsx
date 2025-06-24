import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  Facebook,
  Linkedin,
  Instagram,
  ChevronDown,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

type SectionKey = "destinations" | "contact";

const StudyAbroadFooter = () => {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    destinations: false,
    contact: false,
  });

  const toggleSection = (section: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCountryClick = (country: string) => {
    try {
      // Map footer country names to CountriesSection.tsx names
      const countryMap: Record<string, string> = {
        "United Kingdom": "UK",
        "New Zealand": "New Zealand",
        USA: "USA",
        Germany: "Germany",
        Canada: "Canada",
        Australia: "Australia",
      };
      const normalizedCountry = countryMap[country] || country;
      console.log(`Navigating to /countries?selected=${normalizedCountry}`);
      // navigate(`/countries?selected=${encodeURIComponent(normalizedCountry)}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <footer className="bg-white text-gray-800 pt-10 pb-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Globe className="w-7 h-7 text-purple-600 mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                StudyAbroad
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Simplifies global university admissions with AI-matching, 
              alumni connections, and personalized academic recommendations.
            </p>
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.facebook.com/StudyAbroadAskoxy"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-gray-200 hover:border-purple-600 hover:text-purple-600 transition"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/89893468"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-gray-200 hover:border-purple-600 hover:text-purple-600 transition"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://www.instagram.com/studyabroad_askoxy.ai/"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-gray-200 hover:border-purple-600 hover:text-purple-600 transition"
              >
                <Instagram size={18} />
              </a>
            </div>

            {/* Desktop Newsletter */}
            {/* <div className="hidden md:block">
              <h4 className="font-semibold text-sm mb-2">
                Subscribe to our newsletter
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r text-sm font-medium transition">
                  Subscribe
                </button>
              </div>
            </div> */}
          </div>

          {/* Study Destinations */}
          {/* <div>
            <div
              className="flex justify-between items-center mb-3 cursor-pointer md:cursor-default"
              onClick={() => toggleSection("destinations")}
            >
              <h3 className="text-lg font-semibold">Study Destinations</h3>
              <ChevronDown
                className={`w-5 h-5 md:hidden transform transition ${
                  openSections.destinations ? "rotate-180" : ""
                }`}
              />
            </div>
            <ul
              className={`text-sm transition-all ease-in-out duration-300 overflow-hidden ${
                openSections.destinations ? "max-h-96" : "max-h-0 md:max-h-96"
              } space-y-2`}
            >
              {[
                { name: "USA", href: "#usa" },
                { name: "United Kingdom", href: "#uk" },
                { name: "Germany", href: "#germany" },
                { name: "Canada", href: "#canada" },
                { name: "Australia", href: "#australia" },
                { name: "New Zealand", href: "#newzealand" },
              ].map(({ name, href }, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleCountryClick(name)}
                    className="hover:text-purple-600 transition-colors text-left w-full"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Contact Info */}
          <div>
            <div
              className="flex justify-between items-center mb-3 cursor-pointer md:cursor-default"
              onClick={() => toggleSection("contact")}
            >
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <ChevronDown
                className={`w-5 h-5 md:hidden transform transition ${
                  openSections.contact ? "rotate-180" : ""
                }`}
              />
            </div>
            <div
              className={`space-y-4 text-sm transition-all duration-300 overflow-hidden ${
                openSections.contact ? "max-h-96" : "max-h-0 md:max-h-96"
              }`}
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-purple-600 mt-1" />
                <address className="not-italic text-gray-600">
                  CC-03, Block-C, Indu Fortune Fields - The Annexe, KPHB Phase
                  9, Kukatpally, Hyderabad, Telangana 500085
                </address>
              </div>
              <div className="flex items-center gap-2">
                <FaWhatsapp className="text-purple-600" />
                <a href="tel:+918919636330" className="hover:text-purple-600">
                  +91 89196 36330
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-purple-600" />
                <a
                  href="mailto:studyabroad@askoxy.ai"
                  className="hover:text-purple-600"
                >
                  studyabroad@askoxy.ai
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Newsletter */}
        <div className="md:hidden mt-10">
          <h4 className="text-sm font-semibold mb-2">
            Subscribe to our newsletter
          </h4>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-sm transition">
              Subscribe
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-10 mb-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 gap-4">
          <p>
            © {new Date().getFullYear()} StudyAbroad Global. All rights
            reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center hover:text-purple-600 group transition"
          >
            <span className="mr-2">Back to top</span>
            <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default StudyAbroadFooter;