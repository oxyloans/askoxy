import React from "react";
import {
  Cpu,
  Mail,
  MapPin,
  ArrowUp,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const AIBlockchainFooter = () => {
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

  const services = [
    "AI & GEN AI Training",
    "Legal Knowledge",
    "Study Abroad",
    "My Rotary",
    "We Are Hiring",
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-8 relative overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-3">
              <Cpu className="h-7 w-7 text-cyan-500 mr-2" />
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                AI Blockchain & IT Services
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed mb-5">
              Delivering cutting-edge AI and Blockchain solutions to transform
              your business. From automation to secure decentralized
              applications, we empower digital innovation.
            </p>
            <div className="flex gap-3">
              {[
                {
                  icon: <Facebook size={16} />,
                  link: "https://www.facebook.com/AIBlockchainIT",
                  color: "#1877F2",
                },
                {
                  icon: <Twitter size={16} />,
                  link: "https://twitter.com/AIBlockchainIT",
                  color: "#1DA1F2",
                },
                {
                  icon: <Linkedin size={16} />,
                  link: "https://www.linkedin.com/company/aiblockchainit",
                  color: "#0077B5",
                },
                {
                  icon: <Instagram size={16} />,
                  link: "https://www.instagram.com/aiblockchainit",
                  color: "#E4405F",
                },
              ].map(({ icon, link, color }, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 transition-colors duration-300"
                  style={{ color: color }}
                  aria-label={`Link to social media`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="text-lg font-semibold tracking-wide text-white mb-4">
              Our Platforms
            </h3>
            <ul className="text-sm space-y-1">
              {solutions.map(({ label, path }, i) => (
                <li key={i}>
                  <a
                    href={path}
                    className="text-white hover:text-cyan-400 hover:underline transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold tracking-wide text-white mb-4">
              Our Services
            </h3>
            <ul className="text-sm space-y-1">
              {services.map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-white hover:text-cyan-400 hover:underline transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold tracking-wide text-white mb-4">
              Contact Us
            </h3>
            <address className="not-italic text-sm space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="text-cyan-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                <p>
                  OXYKART TECHNOLOGIES PVT LTD, CC-02, Indu Fortune Fields,
                  KPHB, Hyderabad, Telangana - 500085
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FaWhatsapp className="text-cyan-500 w-5 h-5 flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-cyan-400 transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-cyan-500 w-5 h-5 flex-shrink-0" />
                <a
                  href="mailto:support@askoxy.ai"
                  className="hover:text-cyan-400 transition-colors"
                >
                  support@askoxy.ai
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 my-5"></div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-white">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} AIBlockchain IT Solutions. All
            rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center hover:text-cyan-400 transition-colors group"
            aria-label="Scroll to top"
          >
            <span className="mr-2 text-sm">Back to top</span>
            <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default AIBlockchainFooter;
