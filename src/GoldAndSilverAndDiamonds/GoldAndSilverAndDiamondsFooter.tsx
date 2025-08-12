import React from "react";
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
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const GoldAndSilverAndCacsFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const solutions = [
    {
      label: "AI Blockchain & IT Services",
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
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-3">
              <Cpu className="h-6 w-6 text-cyan-600 mr-2" />
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
                Gold & Silver Diamonds
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Discover timeless elegance with Loki Gold & Silver Diamonds.
              Stunning gold, silver, and diamond collections for your special
              moments.
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
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-1.5 rounded-full border border-gray-200 text-gray-600 hover:scale-105 transition"
                  style={{ color: item.color }}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="text-base font-semibold mb-3">Our Platforms</h3>
            <ul className="space-y-1 text-sm">
              {solutions.map(({ label, path }, index) => (
                <li key={index}>
                  <a
                    href={path}
                    className="hover:text-cyan-400 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base font-semibold mb-3">Our Services</h3>
            <ul className="space-y-1 text-sm">
              {services.map((service, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold mb-3">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                <address className="not-italic">
                  OXYKART TECHNOLOGIES PVT LTD, CC-02, Ground Floor, Indu
                  Fortune Fields, KPHB Colony, Hyderabad, Telangana - 500085
                </address>
              </div>
              <div className="flex items-center gap-2">
                <FaWhatsapp className="w-4 h-4 text-cyan-500" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-cyan-400 transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-500" />
                <a
                  href="mailto:support@askoxy.ai"
                  className="hover:text-cyan-400 transition-colors"
                >
                  support@askoxy.ai
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-5"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} AIBlockchain IT Solutions. All
            rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center mt-3 md:mt-0 hover:text-cyan-400 transition"
          >
            Back to top
            <ArrowUp className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default GoldAndSilverAndCacsFooter;
