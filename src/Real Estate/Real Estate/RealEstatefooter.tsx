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
  {
    label: "Software Training - 100% job placement",
    path: "/softwaretraining",
  },
  { label: "Study Abroad", path: "/studyabroad" },
];

const RealEstateFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const LOGIN_URL = "/whatsapplogin";

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

  const services = [
    {
      name: "AI & GEN AI Training",
      redirectPath: "/main/services/freeai-genai",
    },
    { name: "Legal Knowledge", redirectPath: "/main/services/legalservice" },
    { name: "Study Abroad", path: "/studyabroad" }, // direct link
    { name: "My Rotary", redirectPath: "/main/services/myrotary" },
    { name: "We Are Hiring", redirectPath: "/main/services/we-are-hiring" },
  ];

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
              {socialLinks.map(({ icon, href, label }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-cyan-500 transition-colors duration-300"
                  aria-label={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

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
