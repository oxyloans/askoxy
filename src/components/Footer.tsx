import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import Logo from "../assets/img/askoxylogostatic.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
  ];

  const services = [
    { name: "Free Rudraksha", path: "/main/services/freerudraksha" },
    { name: "AI & GEN AI Training", path: "/main/services/freeai-genai" },
    { name: "Legal Knowledge", path: "/main/services/legalservice" },
    { name: "Study Abroad", path: "/main/services/studyabroad" },
    { name: "My Rotary", path: "/main/services/myrotary" },
    { name: "We Are Hiring", path: "/main/services/we-are-hiring" },
  ];

  const contactInfo = [
    {
      icon: <MapPin className="h-4 w-4" />,
      content:
        "OXYKART TECHNOLOGIES PVT LTD, CC-02, Ground Floor, Indu Fortune Fields, KPHB Colony, Hyderabad, Telangana - 500085",
      type: "text",
    },
    {
      icon: <Mail className="h-4 w-4" />,
      content: "support@askoxy.ai",
      type: "email",
    },
    {
      icon: <Phone className="h-4 w-4" />,
      content: "+91 98765 43210",
      type: "phone",
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="space-y-3">
            <img
              src={Logo}
              alt="AskOxy.AI Logo"
              className="h-12 w-auto object-contain"
            />
            <p className="text-gray-600 text-xs leading-relaxed">
              AskOxy.AI offers unlimited ChatGPT prompts, empowering innovation
              without cost barriers.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-purple-600 transition-colors duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services Navigation */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900">
              Our Services
            </h3>
            <nav className="space-y-1">
              {services.map((service) => (
                <Link
                  key={service.name}
                  to={service.path}
                  className="block text-xs text-gray-600 hover:text-purple-600 transition-colors duration-200"
                >
                  {service.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900">
              Contact Us
            </h3>
            <div className="space-y-2">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="text-purple-600 mt-0.5">{info.icon}</div>
                  {info.type === "text" ? (
                    <p className="text-xs text-gray-600 leading-tight">
                      {info.content}
                    </p>
                  ) : (
                    <a
                      href={`${info.type === "email" ? "mailto:" : "tel:"}${
                        info.content
                      }`}
                      className="text-xs text-gray-600 hover:text-purple-600 transition-colors duration-200"
                    >
                      {info.content}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile App */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900">
              Get Our App
            </h3>
            <p className="text-xs text-gray-600">
              Download AskOxy.AI for a seamless experience.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <a
                href="https://apps.apple.com/in/app/oxyrice-rice-grocery-delivery/id6738732000"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on the App Store"
                  className="w-28 sm:w-32"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.oxyrice.oxyrice_customer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
                  alt="Get it on Google Play"
                  className="w-28 sm:w-32"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-100 mt-6 pt-4 text-center">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-600">
            <span>
              © {currentYear} <span className="font-medium">ASKOXY.AI</span>.
              All rights reserved.
            </span>
            <span>CIN: U72900TG2020PTC142391</span>
            <Link
              to="/privacypolicy"
              className="text-gray-600 hover:text-purple-600 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
