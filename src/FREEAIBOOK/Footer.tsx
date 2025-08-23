import React, { useState, useEffect } from "react";
import {
  ArrowUp,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  Phone,
} from "lucide-react";
import Askoxy from "../assets/img/askoxylogonew.png";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Show scroll-to-top button
  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 250);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      content: "support@askoxy.ai",
      type: "email",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      content: "+91 81432 71103",
      type: "phone",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      content: "+91 91105 64106",
      type: "phone",
    },
  ];

  return (
    <footer className="relative bg-gray-50 text-gray-800 border-t border-gray-200 shadow-inner">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center md:text-left">
        {/* Company Info */}
        <div onClick={() => navigate("/")} className="cursor-pointer space-y-4">
          <img
            src={Askoxy}
            alt="ASKOXY.AI Logo"
            className="h-12 w-auto mx-auto md:mx-0"
          />
          <p className="text-sm text-gray-600 leading-relaxed">
            Empowering minds with AI-driven insights, solutions, and innovation.
            Pioneering India’s AI revolution with regulation-aligned LLMs.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href="/freeaibook"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Free AI Book
              </a>
            </li>
            <li>
              <a
                href="/genoxy"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Mission Million AI Coders
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.google.com/maps/place/Metro+Station+Miyapur,+Hyderabad"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                BillionAIre Hub
              </a>
            </li>
            <li>
              <a
                rel="noreferrer"
                href="/glms"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                GLMS
              </a>
            </li>
            <li>
              <a
                rel="noreferrer"
                href="/jobstreet"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Job Street
              </a>
            </li>
            <li>
              <a
                rel="noreferrer"
                href="/freeaivideos"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Our AI Videos
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Contact Us
          </h4>
          <div className="mt-4 space-y-3">
            {contactInfo.map((info, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="text-purple-600">{info.icon}</div>
                {info.type === "text" ? (
                  <p className="text-sm text-gray-600">{info.content}</p>
                ) : (
                  <a
                    href={`${info.type === "email" ? "mailto:" : "tel:"}${
                      info.content
                    }`}
                    className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    {info.content}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Connect With Us
          </h4>
          <div className="flex justify-center md:justify-start gap-6 mt-4">
            {/* Twitter */}
            <a
              href="https://x.com/RadhakrishnaIND/status/1951525686373421101"
              target="_blank"
              rel="noreferrer"
            >
              <Twitter className="w-6 h-6 text-[#1DA1F2] hover:opacity-80 transition-colors" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/askoxy-ai-5a2157349/"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin className="w-6 h-6 text-[#0A66C2] hover:opacity-80 transition-colors" />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61572388385568"
              target="_blank"
              rel="noreferrer"
            >
              <Facebook className="w-6 h-6 text-[#1877F2] hover:opacity-80 transition-colors" />
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@askoxyDOTai"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                className="w-6 h-6 text-[#FF0000] hover:opacity-80 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a2.999 2.999 0 0 0-2.116-2.123C19.636 3.5 12 3.5 12 3.5s-7.636 0-9.382.563a2.999 2.999 0 0 0-2.116 2.123A31.045 31.045 0 0 0 0 12a31.045 31.045 0 0 0 .502 5.814 2.999 2.999 0 0 0 2.116 2.123C4.364 20.5 12 20.5 12 20.5s7.636 0 9.382-.563a2.999 2.999 0 0 0 2.116-2.123A31.045 31.045 0 0 0 24 12a31.045 31.045 0 0 0-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 py-2 text-center">
        <p className="text-xs sm:text-sm text-gray-600">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-gray-900">
            <a href="/">ASKOXY.AI</a>
          </span>{" "}
          — Empowering Minds with AI
        </p>
      </div>
    </footer>
  );
};

export default Footer;
