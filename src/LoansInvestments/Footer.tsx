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

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-3">
              <Cpu className="h-7 w-7 text-cyan-600 mr-2" />
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
                Loans & Investments
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Explore tailored financial solutions — from personal loans to
              smart investments — designed to meet your goals.
            </p>
            <div className="flex gap-3">
              <SocialIcon
                href="https://www.facebook.com/AIBlockchainIT"
                Icon={Facebook}
                color="#1877F2"
              />
              <SocialIcon
                href="https://twitter.com/AIBlockchainIT"
                Icon={Twitter}
                color="#1DA1F2"
              />
              <SocialIcon
                href="https://www.linkedin.com/company/aiblockchainit"
                Icon={Linkedin}
                color="#0077B5"
              />
              <SocialIcon
                href="https://www.instagram.com/aiblockchainit"
                Icon={Instagram}
                color="#E4405F"
              />
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
            <h3 className="text-lg font-semibold mb-3">Our Services</h3>
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
            <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
            <div className="flex items-start gap-2 mb-2">
              <MapPin className="w-5 h-5 text-cyan-600 flex-shrink-0" />
              <address className="not-italic text-sm">
                OXYKART TECHNOLOGIES PVT LTD, CC-02, Ground Floor, Indu Fortune
                Fields, KPHB Colony, Hyderabad, Telangana - 500085
              </address>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <FaWhatsapp className="w-5 h-5 text-cyan-600" />
              <a
                href="tel:+919876543210"
                className="text-sm hover:text-cyan-500"
              >
                +91 98765 43210
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-600" />
              <a
                href="mailto:support@askoxy.ai"
                className="text-sm hover:text-cyan-500"
              >
                support@askoxy.ai
              </a>
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
            className="flex items-center gap-1 mt-3 md:mt-0 hover:text-cyan-500"
          >
            Back to top <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};

// Social Icon Component
const SocialIcon = ({
  href,
  Icon,
  color,
}: {
  href: string;
  Icon: any;
  color: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-white p-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-current transition-all"
    style={{ "--tw-text-opacity": "1", color } as React.CSSProperties}
  >
    <Icon size={16} />
  </a>
);

export default Footer;
