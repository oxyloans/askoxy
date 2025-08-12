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

const solutions = [
  { label: "AI Blockchain & IT services", path: "/aiblockchainanditservices" },
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
  "Free Rudraksha",
  "AI & GEN AI Training",
  "Legal Knowledge",
  "Study Abroad",
  "My Rotary",
  "We Are Hiring",
];

const CacsFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Cpu className="h-8 w-8 text-cyan-600 mr-2" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
                CA | CS Services Centre
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              Professional Chartered Accountancy and Company Secretary services
              to streamline your business operations.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/AIBlockchainIT"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#1877F2]"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com/AIBlockchainIT"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#1DA1F2]"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/aiblockchainit"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0077B5]"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://www.instagram.com/aiblockchainit"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E4405F]"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Our Platforms</h3>
            <ul className="space-y-1 text-sm">
              {solutions.map(({ label, path }, i) => (
                <li key={i}>
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
            <h3 className="text-lg font-semibold mb-3">Our Services</h3>
            <ul className="space-y-1 text-sm">
              {services.map((srv, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    {srv}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-cyan-500 mt-0.5" />
                <address className="not-italic">
                  OXYKART TECHNOLOGIES PVT LTD, CC-02, Ground Floor, Indu
                  Fortune Fields, Hyderabad, Telangana - 500085
                </address>
              </div>
              <div className="flex items-center gap-2">
                <FaWhatsapp className="w-5 h-5 text-cyan-500" />
                <a href="tel:+919876543210" className="hover:text-cyan-400">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-500" />
                <a
                  href="mailto:support@askoxy.ai"
                  className="hover:text-cyan-400"
                >
                  support@askoxy.ai
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} AIBlockchain IT Solutions. All
            rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default CacsFooter;
