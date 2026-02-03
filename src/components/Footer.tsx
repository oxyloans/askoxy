import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Mail,
  Phone,
  ArrowUp,
  Youtube,
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6"; // Updated Twitter (X) logo
import { SiThreads } from "react-icons/si"; // Threads icon
import Logo from "../assets/img/askoxylogonew.png";

const Footer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const LOGIN_URL = "/whatsapplogin";

  // ✅ Login-check navigation
  const handleProtectedNavigation = (redirectPath: string) => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");

      if (userId) {
        // already logged in → go directly
        navigate(redirectPath);
      } else {
        // not logged in → save redirect path then go to login
        sessionStorage.setItem("redirectPath", redirectPath);
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const socialLinks = [
    {
      icon: <Facebook className="h-4 w-4" />,
      href: "https://www.facebook.com/profile.php?id=61572388385568",
      label: "Facebook",
      iconColor: "#1877F2",
    },
    {
      icon: <Instagram className="h-4 w-4" />,
      href: "https://www.instagram.com/askoxy.ai/",
      label: "Instagram",
      iconColor: "#E4405F",
    },
    {
      icon: <Linkedin className="h-4 w-4" />,
      href: "https://www.linkedin.com/in/askoxy-ai-5a2157349/",
      label: "LinkedIn",
      iconColor: "#0A66C2",
    },
    {
      icon: <FaXTwitter className="h-4 w-4" />,
      href: "https://x.com/RadhakrishnaIND/status/1951525686373421101",
      label: "FaXTwitter",
      iconColor: "#000000",
    },
    {
      icon: <Youtube className="h-4 w-4" />,
      href: "https://www.youtube.com/@askoxyDOTai",
      label: "YouTube",
      iconColor: "#FF0000",
    },
    {
      icon: <SiThreads className="h-4 w-4" />,
      href: "https://www.threads.com/settings/privacy?xmt=AQF02yNlcF0wi_nY3YiPVrIwoiDNSbMz5GuUGncZYLVu87A",
      label: "SiThreads",
      iconColor: "#000000",
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

  const contactInfo = [
    {
      icon: <MapPin className="h-4 w-4" />,
      content:
        "OXYKART TECHNOLOGIES PVT LTD, Miyapur Metro ASKOXY.AI, Hyderabad, Telangana - 500049",
      link: "https://www.google.com/maps/search/ASKOXY.AI/@17.4964402,78.3733327,17z",
      type: "map",
    },
    {
      icon: <Mail className="h-4 w-4" />,
      content: "support@askoxy.ai",
      type: "email",
    },
    {
      icon: <Phone className="h-4 w-4 mb-1" />,
      content: "+91 81432 71103",
      type: "phone",
    },
    {
      icon: <Phone className="h-4 w-4 mb-1" />,
      content: "+91 91105 64106",
      type: "phone",
    },
  ];

  // const scrollToTop = () => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-3">
            <img
              src={Logo}
              alt="ASKOXY.AI Logo"
              className="h-12 w-auto object-contain"
            />
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              ASKOXY.AI offers unlimited ChatGPT prompts, empowering innovation
              without cost barriers.
            </p>
            <div className="flex space-x-3 mt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex items-center justify-center rounded-full w-8 h-8 transition-transform hover:scale-110 bg-gray-100"
                  style={{
                    color: social.iconColor,
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900">
              Our Services
            </h3>
            <nav className="space-y-1">
              {services.map((service) =>
                service.path ? (
                  // ✅ Study Abroad → direct
                  <Link
                    key={service.name}
                    to={service.path}
                    className="block text-xs sm:text-sm text-gray-900 hover:text-purple-600 transition-colors duration-200"
                  >
                    {service.name}
                  </Link>
                ) : (
                  // ✅ Protected services
                  <button
                    key={service.name}
                    onClick={() =>
                      handleProtectedNavigation(service.redirectPath!)
                    }
                    className="block text-left text-xs sm:text-sm text-gray-900 hover:text-purple-600 transition-colors duration-200 w-full"
                    disabled={isLoading}
                  >
                    {service.name}
                  </button>
                ),
              )}
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
                  <div className="inline-flex items-center justify-center rounded-full w-8 h-8 bg-gray-100 flex-shrink-0 mt-0.5" style={{
                    color: info.type === "map" ? "#10B981" : info.type === "email" ? "#F59E0B" : info.type === "phone" ? "#3B82F6" : "#6B7280"
                  }}>
                    {info.icon}
                  </div>
                  {info.type === "map" ? (
                    <a
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200"
                    >
                      {info.content}
                    </a>
                  ) : info.type === "email" ? (
                    <a
                      href={`mailto:${info.content}`}
                      className="text-xs sm:text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200"
                    >
                      {info.content}
                    </a>
                  ) : info.type === "phone" ? (
                    <a
                      href={`tel:${info.content}`}
                      className="text-xs sm:text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-600 leading-tight">
                      {info.content}
                    </p>
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
            <p className="text-xs sm:text-sm text-gray-600">
              Download ASKOXY.AI for a seamless experience.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1">
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
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs sm:text-sm text-gray-600">
          <span>
            © {currentYear} <span className="font-medium">ASKOXY.AI</span>. All
            rights reserved.
          </span>
          <span>CIN: U72900TG2020PTC142391</span>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <Link
              to="/termsandconditions"
              className="hover:text-purple-600 transition-colors duration-200"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/privacypolicy"
              className="hover:text-purple-600 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/contactus"
              className="hover:text-purple-600 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
          {/* <button
            onClick={scrollToTop}
            className="flex items-center hover:text-purple-600 transition-colors mt-2 sm:mt-0 group"
            aria-label="Scroll to top"
          >
            <span className="mr-2">Back to top</span>
            <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" />
          </button> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
