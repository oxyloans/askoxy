import React, { useState } from "react";
import {
  Cpu,
  Mail,
  MapPin,
  ArrowUp,
  Facebook,

  Linkedin,
  Instagram,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import { SiThreads } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";

const solutions = [
  { label: "AI Blockchain & IT services", path: "/aiblockchainanditservices" },
  { label: "CA | CS Services", path: "/caandcsservices" },
  { label: "Gold, Silver & Diamonds", path: "/goldandsilveranddiamonds" },
  { label: "Loans & Investments", path: "/loansinvestments" },
  { label: "Nyaya GPT", path: "/nyayagpt" },
  { label: "Real Estate", path: "/realestate" },
  { label: "Rice 2 Robo Ecommerce", path: "/rice2roboecommers" },
  { label: "Software Training - 100% job placement", path: "/softwaretraining" },
  { label: "Study Abroad", path: "/studyabroad" },
];

const socialLinks = [
  {
    icon: <Facebook className="h-4 w-4" />,
    href: "https://www.facebook.com/profile.php?id=61572388385568",
    label: "Facebook",
  },
  {
    icon: <Instagram className="h-4 w-4" />,
    href: "https://www.instagram.com/askoxy.ai/",
    label: "Instagram",
  },
  {
    icon: <Linkedin className="h-4 w-4" />,
    href: "https://www.linkedin.com/in/askoxy-ai-5a2157349/",
    label: "LinkedIn",
  },
  {
    icon: <FaXTwitter className="h-4 w-4" />,
    href: "https://x.com/RadhakrishnaIND/status/1951525686373421101",
    label: "X (Twitter)",
  },
  {
    icon: <FaYoutube className="h-4 w-4" />,
    href: "https://www.youtube.com/@askoxyDOTai",
    label: "YouTube",
  },
  {
    icon: <SiThreads className="h-4 w-4" />,
    href: "https://www.threads.com/settings/privacy?xmt=AQF02yNlcF0wi_nY3YiPVrIwoiDNSbMz5GuUGncZYLVu87A",
    label: "Threads",
  },
];

const LOGIN_URL = "/whatsapplogin";

const CacsFooter = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleProtectedNavigation = (redirectPath: string) => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");

      if (userId) {
        navigate(redirectPath);
      } else {
        sessionStorage.setItem("redirectPath", redirectPath);
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const services = [
    { name: "AI & GEN AI Training", redirectPath: "/main/services/freeai-genai" },
    { name: "Legal Knowledge", redirectPath: "/main/services/legalservice" },
    { name: "Study Abroad", path: "/studyabroad" }, // direct link
    { name: "My Rotary", redirectPath: "/main/services/myrotary" },
    { name: "We Are Hiring", redirectPath: "/main/services/we-are-hiring" },
  ];

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
            <div className="flex gap-4">
              {socialLinks.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platforms */}

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Our Services</h3>
            <nav className="space-y-2">
              {services.map((service) =>
                service.path ? (
                  <Link
                    key={service.name}
                    to={service.path}
                    className="block text-sm text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    {service.name}
                  </Link>
                ) : (
                  <button
                    key={service.name}
                    onClick={() =>
                      handleProtectedNavigation(service.redirectPath!)
                    }
                    className="block text-left text-sm text-gray-300 hover:text-cyan-400 transition-colors w-full"
                    disabled={isLoading}
                  >
                    {service.name}
                  </button>
                )
              )}
            </nav>
          </div>
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
