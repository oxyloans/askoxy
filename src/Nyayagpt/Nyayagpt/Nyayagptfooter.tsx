import React, { useState } from "react";
import { Cpu, Mail, MapPin, ArrowUp, Facebook, Linkedin, Instagram } from "lucide-react";
import { FaPhoneAlt } from "react-icons/fa";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import { SiThreads } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";

const Nyayagptfooter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const LOGIN_URL = "/whatsapplogin";

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const solutions = [
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
      href: "https://www.threads.net/@askoxy.ai", // replace with your real Threads profile link
      label: "Threads",
    },
  ];

  const services = [
    { name: "AI & GEN AI Training", redirectPath: "/main/services/freeai-genai" },
    { name: "Legal Knowledge", redirectPath: "/main/services/legalservice" },
    { name: "Study Abroad", path: "/studyabroad" },
    { name: "My Rotary", redirectPath: "/main/services/myrotary" },
    { name: "We Are Hiring", redirectPath: "/wearehiring" },
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
      {/* Background gradient highlights */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute -top-36 -right-36 w-60 h-60 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-36 -left-36 w-60 h-60 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              {socialLinks.map(({ icon, href, label }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 p-2 rounded-full border border-white/10 text-gray-200 hover:text-cyan-400 transition-colors duration-300"
                  aria-label={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Our Services */}
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
                ),
              )}
            </nav>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="text-md font-semibold mb-3">Our Platforms</h3>
            <ul className="space-y-1 text-sm">
              {solutions.map(({ label, path }, idx) => (
                <li key={idx}>
                  <Link
                    to={path}
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    {label}
                  </Link>
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

        {/* Divider */}
        <div className="border-t border-white/10 my-4"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} NyayaGPT. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="mt-2 md:mt-0 flex items-center hover:text-cyan-400 transition"
          >
            Back to top <ArrowUp className="ml-1 w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Nyayagptfooter;
