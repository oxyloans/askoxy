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

const Nyayagptfooter = () => {
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
    "Free Rudraksha",
    "AI & GEN AI Training",
    "Legal Knowledge",
    "Study Abroad",
    "My Rotary",
    "We Are Hiring",
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-6 relative overflow-hidden">
      {/* Background gradient highlights */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute -top-36 -right-36 w-60 h-60 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-36 -left-36 w-60 h-60 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-3">
              <Cpu className="h-7 w-7 text-cyan-500 mr-2" />
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
                NyayaGPT
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Intelligent legal support for everyone. NyayaGPT offers smart
              tools to simplify legal processes and empower users with instant
              assistance.
            </p>
            <div className="flex gap-3">
              {[
                {
                  icon: Facebook,
                  link: "https://www.facebook.com/AIBlockchainIT",
                  color: "#1877F2",
                },
                {
                  icon: Twitter,
                  link: "https://twitter.com/AIBlockchainIT",
                  color: "#1DA1F2",
                },
                {
                  icon: Linkedin,
                  link: "https://www.linkedin.com/company/aiblockchainit",
                  color: "#0077B5",
                },
                {
                  icon: Instagram,
                  link: "https://www.instagram.com/aiblockchainit",
                  color: "#E4405F",
                },
              ].map(({ icon: Icon, link, color }, i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full border border-gray-200 text-gray-600 hover:scale-105 transition"
                  style={{ "--hover-color": color } as React.CSSProperties}
                >
                  <Icon size={16} className="hover:text-[var(--hover-color)]" />
                </a>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="text-md font-semibold mb-3">Our Platforms</h3>
            <ul className="space-y-1 text-sm">
              {solutions.map(({ label, path }, idx) => (
                <li key={idx}>
                  <a
                    href={path}
                    className="hover:text-cyan-500 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-md font-semibold mb-3">Our Services</h3>
            <ul className="space-y-1 text-sm">
              {services.map((srv, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-cyan-500 transition-colors">
                    {srv}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-md font-semibold mb-3">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <address className="not-italic">
                  OXYKART TECHNOLOGIES PVT LTD, CC-02, Ground Floor, Indu
                  Fortune Fields, KPHB Colony, Hyderabad, Telangana - 500085
                </address>
              </div>
              <div className="flex items-center gap-2">
                <FaWhatsapp className="w-4 h-4 text-cyan-500" />
                <a href="tel:+919876543210" className="hover:text-cyan-500">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-500" />
                <a
                  href="mailto:support@askoxy.ai"
                  className="hover:text-cyan-500"
                >
                  support@askoxy.ai
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-4"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} AIBlockchain IT Solutions. All
            rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="mt-2 md:mt-0 flex items-center hover:text-cyan-500 transition"
          >
            Back to top <ArrowUp className="ml-1 w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Nyayagptfooter;
