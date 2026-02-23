import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, Mail, MapPin, ArrowUp, Facebook, Linkedin, Instagram } from "lucide-react";
import { FaPhoneAlt } from "react-icons/fa";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import { SiThreads } from "react-icons/si";


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

const Rice2RoboEcommersFooter: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const LOGIN_URL = "/whatsapplogin";

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

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
      href: "https://www.threads.net/@askoxy.ai",
      label: "Threads",
    },
  ];

  const services = [
    { name: "AI & GEN AI Training", redirectPath: "/main/services/freeai-genai" },
    { name: "Legal Knowledge", redirectPath: "/main/services/legalservice" },
    { name: "Study Abroad", path: "/studyabroad" }, // public route
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
    <footer className="bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company */}
          <div>
            <div className="flex items-center mb-3">
              <Cpu className="h-7 w-7 text-cyan-400 mr-2" />
              <span className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">
                Rice2Robo E-commerce
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-5">
              Your smart shopping destination powered by AI technology. We bring you intelligent
              recommendations and seamless shopping.
            </p>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ icon, href, label }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 p-2 rounded-full border border-white/10 text-slate-200 hover:text-cyan-300 hover:border-cyan-400/40 hover:bg-white/15 transition"
                  aria-label={label}
                  title={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <nav className="space-y-2">
              {services.map((service) =>
                service.path ? (
                  <Link
                    key={service.name}
                    to={service.path}
                    className="block text-sm text-slate-300 hover:text-cyan-300 transition"
                  >
                    {service.name}
                  </Link>
                ) : (
                  <button
                    key={service.name}
                    onClick={() => handleProtectedNavigation(service.redirectPath!)}
                    className="block text-left text-sm text-slate-300 hover:text-cyan-300 transition w-full disabled:opacity-60"
                    disabled={isLoading}
                  >
                    {service.name}
                  </button>
                )
              )}
            </nav>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Platforms</h3>
            <ul className="space-y-2 text-sm">
              {solutions.map(({ label, path }, i) => (
                <li key={i}>
                  <Link to={path} className="text-slate-300 hover:text-cyan-300 transition">
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

        {/* Bottom */}
        <div className="border-t border-white/10 mt-10 pt-5 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} Rice2Robo E-commerce. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-cyan-300 transition"
            type="button"
          >
            Back to top <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Rice2RoboEcommersFooter;
