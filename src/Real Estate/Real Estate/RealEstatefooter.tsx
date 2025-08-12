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

const RealEstateFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute -top-36 -right-36 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-36 -left-36 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-3">
              <Cpu className="h-6 w-6 text-cyan-500 mr-2" />
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
                Real Estate Pro
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Your trusted partner in finding the perfect property. From luxury
              homes to commercial spaces, we provide expert guidance and
              personalized service.
            </p>

            <div className="flex gap-3">
              {[
                {
                  Icon: Facebook,
                  color: "#1877F2",
                  link: "https://www.facebook.com/AIBlockchainIT",
                },
                {
                  Icon: Twitter,
                  color: "#1DA1F2",
                  link: "https://twitter.com/AIBlockchainIT",
                },
                {
                  Icon: Linkedin,
                  color: "#0077B5",
                  link: "https://www.linkedin.com/company/aiblockchainit",
                },
                {
                  Icon: Instagram,
                  color: "#E4405F",
                  link: "https://www.instagram.com/aiblockchainit",
                },
              ].map(({ Icon, color, link }, i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-white hover:bg-opacity-90 transition"
                  style={{ color: color }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Our Platforms */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Our Platforms</h3>
            <ul className="space-y-1 text-sm">
              {solutions.map(({ label, path }, index) => (
                <li key={index}>
                  <a
                    href={path}
                    className="text-white hover:text-cyan-400 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Our Services</h3>
            <ul className="space-y-1 text-sm">
              {services.map((srv, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-white hover:text-cyan-400 transition-colors"
                  >
                    {srv}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-500 mt-0.5" />
                <span>
                  OXYKART TECHNOLOGIES PVT LTD, CC-02, Ground Floor, Indu
                  Fortune Fields, KPHB Colony, Hyderabad, Telangana - 500085
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaWhatsapp className="w-4 h-4 text-cyan-500" />
                <a href="tel:+919876543210" className="hover:text-cyan-400">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-500" />
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
        <div className="border-t border-gray-700 my-4"></div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} AIBlockchain IT Solutions. All rights
            reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center mt-3 md:mt-0 hover:text-cyan-400 transition"
          >
            <span className="mr-1">Back to top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default RealEstateFooter;
