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
  "AI & GEN AI Training",
  "Legal Knowledge",
  "Study Abroad",
  "My Rotary",
  "We Are Hiring",
];

const Rice2RoboEcommersFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-3">
              <Cpu className="h-7 w-7 text-cyan-600 mr-2" />
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
                Rice2Robo Ecommerce
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Your smart shopping destination powered by AI technology. We bring
              you intelligent recommendations and seamless shopping.
            </p>
            <div className="flex gap-3">
              {[
                {
                  icon: <Facebook size={16} />,
                  href: "https://www.facebook.com/AIBlockchainIT",
                  color: "#1877F2",
                },
                {
                  icon: <Twitter size={16} />,
                  href: "https://twitter.com/AIBlockchainIT",
                  color: "#1DA1F2",
                },
                {
                  icon: <Linkedin size={16} />,
                  href: "https://www.linkedin.com/company/aiblockchainit",
                  color: "#0077B5",
                },
                {
                  icon: <Instagram size={16} />,
                  href: "https://www.instagram.com/aiblockchainit",
                  color: "#E4405F",
                },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full border border-gray-200 text-gray-600 hover:scale-110 transition-transform"
                  style={{ borderColor: social.color }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Our Platforms */}
          <div>
            <h3 className="text-md font-semibold mb-3">Our Platforms</h3>
            <ul className="space-y-1 text-sm">
              {solutions.map(({ label, path }, i) => (
                <li key={i}>
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

          {/* Our Services */}
          <div>
            <h3 className="text-md font-semibold mb-3">Our Services</h3>
            <ul className="space-y-1 text-sm">
              {services.map((service, i) => (
                <li key={i}>
                  <a href="#" className="hover:text-cyan-500 transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-md font-semibold mb-3">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-600 mt-0.5" />
                OXYKART TECHNOLOGIES PVT LTD, CC-02, Ground Floor, Indu Fortune
                Fields, KPHB Colony, Hyderabad, Telangana - 500085
              </li>
              <li className="flex items-center gap-2">
                <FaWhatsapp className="w-4 h-4 text-cyan-600" />
                <a href="tel:+919876543210" className="hover:text-cyan-500">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-600" />
                <a
                  href="mailto:support@askoxy.ai"
                  className="hover:text-cyan-500"
                >
                  support@askoxy.ai
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-4 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-3">
          <p>
            &copy; {new Date().getFullYear()} AIBlockchain IT Solutions. All
            rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center hover:text-cyan-400 transition-colors"
          >
            Back to top <ArrowUp className="ml-1 w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Rice2RoboEcommersFooter;
