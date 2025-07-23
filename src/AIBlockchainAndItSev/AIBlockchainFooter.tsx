import React, { useState } from "react";
import {
  Cpu,
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

const AIBlockchainFooter = () => {
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const solutions = [
    {
      label: "AI Blockchain & IT services",
      path: "/aiblockchainanditservices",
    },
    { label: "CA | CS Services", path: "/caandcsservices" },
    { label: "Gold, Silver & Diamonds", path: "/goldandsilveranddiamonds" },
    { label: "Loans & Investments", path: "/loansinvestments" },
    { label: "Nyaya GPT", path: "/nyayagpt" },
    { label: "Real Estate", path: "/realestate" },
    { label: "Rice 2 Robo Ecommerce", path: "/rice2roboecommers" },
    {
      label: "Software Training - 100% job placement",
      path: "/softwaretraining",
    },
    { label: "Study Abroad", path: "/studyabroad" },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-10 relative overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute -top-36 -right-36 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-36 -left-36 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Cpu className="h-8 w-8 text-cyan-600 mr-2" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
                AI Blockchain & IT Services
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Delivering cutting-edge AI and Blockchain solutions to transform
              your business. From automation to secure decentralized
              applications, we empower digital innovation.
            </p>
            <div className="flex gap-4">
              {[
                {
                  icon: <Facebook size={18} />,
                  link: "https://www.facebook.com/AIBlockchainIT",
                  color: "#1877F2",
                },
                {
                  icon: <Twitter size={18} />,
                  link: "https://twitter.com/AIBlockchainIT",
                  color: "#1DA1F2",
                },
                {
                  icon: <Linkedin size={18} />,
                  link: "https://www.linkedin.com/company/aiblockchainit",
                  color: "#0077B5",
                },
                {
                  icon: <Instagram size={18} />,
                  link: "https://www.instagram.com/aiblockchainit",
                  color: "#E4405F",
                },
              ].map(({ icon, link, color }, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-[${color}] hover:border-[${color}] hover:scale-110 transition-all duration-300`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div>
            <button
              type="button"
              aria-expanded={openSections.solutions}
              onClick={() => toggleSection("solutions")}
              className="flex justify-between items-center w-full mb-4 md:cursor-default"
            >
              <h3 className="text-lg font-semibold tracking-wide text-white">
                Our Platforms
              </h3>
              <ChevronDown
                className={`h-5 w-5 md:hidden transition-transform ${
                  openSections.solutions ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`text-sm space-y-2 overflow-hidden transition-all ease-in-out duration-300 ${
                openSections.solutions ? "max-h-96" : "max-h-0 md:max-h-96"
              }`}
            >
              {solutions.map(({ label, path }, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => (window.location.href = path)}
                    className="text-white hover:text-cyan-400 hover:underline transition-all"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <button
              type="button"
              aria-expanded={openSections.technologies}
              onClick={() => toggleSection("technologies")}
              className="flex justify-between items-center w-full mb-4 md:cursor-default"
            >
              <h3 className="text-lg font-semibold tracking-wide text-white">
                Our Services
              </h3>
              <ChevronDown
                className={`h-5 w-5 md:hidden transition-transform ${
                  openSections.technologies ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`text-sm space-y-2 overflow-hidden transition-all ease-in-out duration-300 ${
                openSections.technologies ? "max-h-96" : "max-h-0 md:max-h-96"
              }`}
            >
              {[
                "AI & GEN AI Training",
                "Legal Knowledge",
                "Study Abroad",
                "My Rotary",
                "We Are Hiring",
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-white hover:text-cyan-400 hover:underline transition-all"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <button
              type="button"
              aria-expanded={openSections.contact}
              onClick={() => toggleSection("contact")}
              className="flex justify-between items-center w-full mb-4 md:cursor-default"
            >
              <h3 className="text-lg font-semibold tracking-wide text-white">
                Contact Us
              </h3>
              <ChevronDown
                className={`h-5 w-5 md:hidden transition-transform ${
                  openSections.contact ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`text-sm space-y-4 overflow-hidden transition-all ease-in-out duration-300 ${
                openSections.contact ? "max-h-96" : "max-h-0 md:max-h-96"
              }`}
            >
              <div className="flex gap-3">
                <MapPin className="text-cyan-500 w-5 h-5 mt-0.5" />
                <address className="not-italic">
                  OXYKART TECHNOLOGIES PVT LTD, CC-02, Indu Fortune Fields,
                  KPHB, Hyderabad, Telangana - 500085
                </address>
              </div>
              <div className="flex gap-3 items-center">
                <FaWhatsapp className="text-cyan-500 w-5 h-5" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-cyan-400 transition"
                >
                  +91 98765 43210
                </a>
              </div>
              <div className="flex gap-3 items-center">
                <Mail className="text-cyan-500 w-5 h-5" />
                <a
                  href="mailto:support@askoxy.ai"
                  className="hover:text-cyan-400 transition"
                >
                  support@askoxy.ai
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        {/* <div className="mb-10 bg-white/10 p-6 rounded-lg backdrop-blur-md shadow-md">
          <h4 className="font-semibold mb-3 text-white text-base md:text-lg">
            Subscribe to our newsletter
          </h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your Email"
              className="flex-grow px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
            <button
              type="button"
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-all"
            >
              Subscribe
            </button>
          </div>
        </div> */}

        {/* Divider */}
        <div className="border-t border-gray-500 my-6"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} AIBlockchain IT Solutions. All
            rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center hover:text-cyan-400 transition-all group"
            aria-label="Scroll to top"
          >
            <span className="mr-2">Back to top</span>
            <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default AIBlockchainFooter;
