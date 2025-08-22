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
            <a
              href="https://x.com/RadhakrishnaIND/status/1951525686373421101"
              target="_blank"
              rel="noreferrer"
            >
              <Twitter className="w-6 h-6 text-gray-500 hover:text-indigo-600 transition-colors" />
            </a>
            <a
              href="https://www.linkedin.com/in/askoxy-ai-5a2157349/"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin className="w-6 h-6 text-gray-500 hover:text-indigo-600 transition-colors" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61572388385568"
              target="_blank"
              rel="noreferrer"
            >
              <Facebook className="w-6 h-6 text-gray-500 hover:text-indigo-600 transition-colors" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-4 text-center bg-gray-100">
        <p className="text-xs sm:text-sm text-gray-600">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-gray-900">ASKOXY.AI</span> —
          Empowering Minds with AI
        </p>
      </div>

    
      {/* {isVisible && (
        <div className="flex justify-end">
          <button
            onClick={scrollToTop}
            className="flex items-center hover:text-purple-600 transition-colors mt-0 sm:mt-0 group"
            aria-label="Scroll to top"
          >
            <span className="mr-2">Back to top</span>
            <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      )} */}
    </footer>
  );
};

export default Footer;
