


import React, { useState } from "react";
import {
  Cpu,
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ChevronDown,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

type SectionKey = "solutions" | "technologies" | "contact";

const GoldAndSilverAndCacsFooter = () => {
  // State for mobile accordion sections
  const [openSections, setOpenSections] = useState({
    solutions: false,
    technologies: false,
    contact: false,
  });

  const toggleSection = (section: SectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-8 sm:py-10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
        <div className="absolute -top-36 -right-36 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-36 -left-36 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <Cpu className="h-8 w-8 text-cyan-600 mr-2" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
                Gold & Silver Diamonds
              </span>
            </div>
            <p className="text-white text-sm leading-relaxed mb-6">
              Discover timeless elegance with Loki Gold & Silver Diamonds. From
              stunning gold and silver ornaments to luxurious diamond
              collections, we craft jewelry that celebrates your unique style
              and precious moments.
            </p>

            <div className="flex gap-4 mb-6">
              <a
                href="https://www.facebook.com/AIBlockchainIT"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-[#1877F2] hover:border-[#1877F2] transition-all"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com/AIBlockchainIT"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-all"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/aiblockchainit"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-[#0077B5] hover:border-[#0077B5] transition-all"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://www.instagram.com/aiblockchainit"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-[#E4405F] hover:border-[#E4405F] transition-all"
              >
                <Instagram size={18} />
              </a>
            </div>

            {/* Newsletter subscription - desktop only */}
            <div className="hidden md:block">
              <h4 className="font-semibold mb-3 text-sm">
                Subscribe to our newsletter
              </h4>
              <div className="flex">
                <input
                  type="email"
                  name="newsletter-email"
                  aria-label="Email address"
                  placeholder="Your Email"
                  className="flex-grow px-3 py-2 text-sm bg-white text-gray-800 border border-gray-200 rounded-l focus:outline-none focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600"
                />
                <button
                  type="button"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-r text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

           {/* Solutions - with mobile accordion */}
                    <div>
                      <button
                        type="button"
                        aria-expanded={openSections.solutions}
                        aria-controls="solutions-content"
                        className="flex justify-between items-center mb-4 w-full cursor-pointer md:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                        onClick={() => toggleSection("solutions")}
                      >
                        <h3 className="text-lg font-semibold">Our Platforms</h3>
                        <ChevronDown
                          className={`h-5 w-5 md:hidden transition-transform ${
                            openSections.solutions ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <ul
                        id="solutions-content"
                        className={`space-y-2 text-sm text-white overflow-hidden transition-all duration-300 ease-in-out ${
                          openSections.solutions ? "max-h-96" : "max-h-0 md:max-h-96"
                        }`}
                      >
                        {[
                          "AI Blockchain & IT services",
                          "CA | CS Services",
                          "Gold, Silver & Diamonds",
                          "Loans & Investments",
                          "Nyaya GPT",
                          "Real Estate",
                          "Rice 2 Robo Ecommerce",
                          "Software Training - 100% job placement",
                          "Study Abroad",
                        ].map((item, index) => (
                          <li key={index}>
                            <button
                              type="button"
                              className="text-white decoration-none hover:text-cyan-600 transition-colors hover:underline bg-transparent border-none p-0 m-0 cursor-pointer"
                              aria-label={item}
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
          
                    {/* Technologies - with mobile accordion */}
                    <div>
                      <button
                        type="button"
                        aria-expanded={openSections.technologies}
                        aria-controls="technologies-content"
                        className="flex justify-between items-center mb-4 w-full cursor-pointer md:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                        onClick={() => toggleSection("technologies")}
                      >
                        <h3 className="text-lg font-semibold">Our Services</h3>
                        <ChevronDown
                          className={`h-5 w-5 md:hidden transition-transform ${
                            openSections.technologies ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <ul
                        id="technologies-content"
                        className={`space-y-2 text-sm text-white overflow-hidden transition-all duration-300 ease-in-out ${
                          openSections.technologies ? "max-h-96" : "max-h-0 md:max-h-96"
                        }`}
                      >
                        {[
                          "Free Rudraksha",
                          "AI & GEN AI Training",
                          "Legal Knowledge",
                          "Study Abroad",
                          "My Rotary",
                          "We Are Hiring",
                        ].map((tech, index) => (
                          <li key={index}>
                            <a
                              href="#"
                              className="text-white hover:text-cyan-600 transition-colors hover:underline"
                            >
                              {tech}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

          {/* Contact Info - with mobile accordion */}
          <div>
            <button
              type="button"
              aria-expanded={openSections.contact}
              aria-controls="contact-content"
              className="flex justify-between items-center mb-4 w-full cursor-pointer md:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              onClick={() => toggleSection("contact")}
            >
              <h3 className="text-lg text-white font-semibold">Contact Us</h3>
              <ChevronDown
                className={`h-5 w-5 md:hidden transition-transform ${
                  openSections.contact ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              id="contact-content"
              className={`space-y-4 text-sm overflow-hidden transition-all duration-300 ease-in-out ${
                openSections.contact ? "max-h-96" : "max-h-0 md:max-h-96"
              }`}
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                <address className="not-italic text-white">
                  OXYKART TECHNOLOGIES PVT LTD, CC-02, Ground Floor, Indu
                  Fortune Fields, KPHB Colony, Hyderabad, Telangana - 500085
                </address>
              </div>

              <div className="flex items-center gap-3">
                <FaWhatsapp className="w-5 h-5 text-cyan-600" />
                <a
                  href="tel:+1234567890"
                  className="text-white hover:text-cyan-600 transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-cyan-600" />
                <a
                  href="mailto:contact@aiblockchainit.com"
                  className="text-white hover:text-cyan-600 transition-colors"
                >
                  support@askoxy.ai
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter subscription - mobile only */}
        <div className="md:hidden mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3 text-sm">
            Subscribe to our newsletter
          </h4>
          <div className="space-y-2">
            <input
              type="email"
              name="newsletter-email-mobile"
              aria-label="Email address"
              placeholder="Your Email"
              className="w-full px-3 py-2 text-sm bg-white text-gray-800 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600"
            />
            <button
              type="button"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-center text-white md:text-left">
              &copy; {new Date().getFullYear()} AIBlockchain IT Solutions. All
              rights reserved.
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="mt-4 md:mt-0 flex items-center text-gray-600 hover:text-cyan-600 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Scroll to top"
          >
            <span className="mr-2 text-white">Back to top</span>
            <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default GoldAndSilverAndCacsFooter;
