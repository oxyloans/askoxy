import React, { useState } from "react";
import {
  Cpu,
  Mail,
  MapPin,
  ArrowUp,
  Facebook,
  Linkedin,
  Instagram,
  ChevronDown,
} from "lucide-react";
import { FaPhoneAlt } from "react-icons/fa";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import { SiThreads } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";

type SectionKey = "platforms" | "services" | "contact";

const CacsFooter = () => {
  const [openSections, setOpenSections] = useState({
    platforms: false,
    services: false,
    contact: false,
  });

  const toggleSection = (section: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const navigate = useNavigate();
  const LOGIN_URL = "/whatsapplogin";
  const [isLoading, setIsLoading] = useState(false);

  const handleProtectedNavigation = (redirectPath: string) => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");

      if (userId) navigate(redirectPath);
      else {
        sessionStorage.setItem("redirectPath", redirectPath);
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const platforms = [
    { label: "AI Blockchain & IT services", path: "/aiblockchainanditservices" },
    { label: "CA | CS Services", path: "/caandcsservices" },
    { label: "Gold, Silver & Diamonds", path: "/goldandsilveranddiamonds" },
    { label: "Loans & Investments", path: "/loansinvestments" },
    { label: "Nyaya GPT", path: "/nyayagpt" },
    { label: "Real Estate", path: "/realestate" },
    { label: "Rice 2 Robo Ecommerce", path: "/rice2roboecommers" },
    { label: "90 days plan", path: "/90dayjobplan" },
    { label: "Study Abroad", path: "/studyabroad" },
  ];

  const services = [
    { name: "Free Rudraksha", path: "/freerudraksha" },
    { name: "AI & GEN AI Training", redirectPath: "/main/services/freeai-genai" },
    { name: "Legal Knowledge", redirectPath: "/main/services/legalservice" },
    { name: "Study Abroad", path: "/studyabroad" },
    { name: "My Rotary", redirectPath: "/main/services/myrotary" },
    { name: "We Are Hiring", path: "/wearehiring" },
  ];

  const socialLinks = [
    {
      icon: <Facebook className="h-4 w-4" />,
      href: "https://www.facebook.com/AIBlockchainIT",
      label: "Facebook",
    },
    {
      icon: <Instagram className="h-4 w-4" />,
      href: "https://www.instagram.com/aiblockchainit",
      label: "Instagram",
    },
    {
      icon: <Linkedin className="h-4 w-4" />,
      href: "https://www.linkedin.com/company/aiblockchainit",
      label: "LinkedIn",
    },
    {
      icon: <FaXTwitter className="h-4 w-4" />,
      href: "https://twitter.com/AIBlockchainIT",
      label: "X (Twitter)",
    },
    {
      icon: <FaYoutube className="h-4 w-4" />,
      href: "https://www.youtube.com/@askoxyDOTai",
      label: "YouTube",
    },
    {
      icon: <SiThreads className="h-4 w-4" />,
      href: "https://www.threads.net/@askoxy.ai",
      label: "Threads",
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-8 sm:py-10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
        <div className="absolute -top-36 -right-36 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-36 -left-36 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Company */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <Cpu className="h-8 w-8 text-cyan-500 mr-2" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
               CA & CS Services
              </span>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Professional Chartered Accountancy and Company Secretary services to streamline your business operations.
              From compliance to strategic advisory, we ensure your business stays ahead with expert financial and legal guidance.
            </p>

            <div className="flex gap-3">
              {socialLinks.map(({ icon, href, label }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="bg-white/10 p-2 rounded-full border border-white/10 text-gray-200 hover:text-cyan-400 transition"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div>
            <button
              type="button"
              aria-expanded={openSections.platforms}
              className="flex justify-between items-center mb-4 w-full md:cursor-default"
              onClick={() => toggleSection("platforms")}
            >
              <h3 className="text-lg font-semibold">Our Platforms</h3>
              <ChevronDown
                className={`h-5 w-5 md:hidden transition-transform ${
                  openSections.platforms ? "rotate-180" : ""
                }`}
              />
            </button>

            <ul
              className={`space-y-2 text-sm overflow-hidden transition-all duration-300 ${
                openSections.platforms ? "max-h-96" : "max-h-0 md:max-h-96"
              }`}
            >
              {platforms.map((p, idx) => (
                <li key={idx}>
                  <Link to={p.path} className="text-gray-300 hover:text-cyan-400 hover:underline transition">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <button
              type="button"
              aria-expanded={openSections.services}
              className="flex justify-between items-center mb-4 w-full md:cursor-default"
              onClick={() => toggleSection("services")}
            >
              <h3 className="text-lg font-semibold">Our Services</h3>
              <ChevronDown
                className={`h-5 w-5 md:hidden transition-transform ${
                  openSections.services ? "rotate-180" : ""
                }`}
              />
            </button>

            <ul
              className={`space-y-2 text-sm overflow-hidden transition-all duration-300 ${
                openSections.services ? "max-h-96" : "max-h-0 md:max-h-96"
              }`}
            >
              {services.map((s, idx) => (
                <li key={idx}>
                  {s.path ? (
                    <Link to={s.path} className="text-gray-300 hover:text-cyan-400 hover:underline transition">
                      {s.name}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleProtectedNavigation(s.redirectPath!)}
                      className="text-left w-full text-gray-300 hover:text-cyan-400 hover:underline transition"
                    >
                      {s.name}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
                    <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
                    <address className="not-italic text-sm space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="text-cyan-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p>
                          OXYKART TECHNOLOGIES PVT LTD, CC-02, Indu Fortune Fields,
                          KPHB, Hyderabad, Telangana - 500085
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="text-cyan-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p>
                          AI Research Center, Entrance D, SE02 Concourse, Miyapur Metro
                          Station, Hyderabad, Telangana 500049
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPhoneAlt className="text-cyan-500 w-5 h-5 flex-shrink-0" />
                        <a
                          href="tel:+918143271103"
                          className="hover:text-cyan-400 transition"
                        >
                          +91 81432 71103
                        </a>
                        {","}
                        <a
                          href="tel:+919110564106"
                          className="hover:text-cyan-400 transition"
                        >
                          +91 91105 64106
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="text-cyan-500 w-5 h-5 flex-shrink-0" />
                        <a
                          href="mailto:support@askoxy.ai"
                          className="hover:text-cyan-400 transition-colors"
                        >
                          support@askoxy.ai
                        </a>
                      </div>
                    </address>
                  </div>
        </div>

        <div className="border-t border-white/10 my-6"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p className="text-center md:text-left text-gray-400">
            &copy; {new Date().getFullYear()} CA & CS Services Centre. All rights reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center hover:text-cyan-400 transition group"
            aria-label="Scroll to top"
          >
            <span className="mr-2">Back to top</span>
            <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default CacsFooter;
