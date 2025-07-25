import React from "react";
import { Facebook, Twitter, Linkedin, Instagram, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Company Info */}
          <div>
            <h4 className="text-xl font-bold mb-4 leading-tight">
              Global Loans Management Systems
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Modernizing loan systems globally with domain expertise and
              AI-powered solutions.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/ASKOXYAI"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white text-blue-500 transition"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="hover:text-white text-sky-400 transition"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/82577404/admin/dashboard/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white text-blue-400 transition"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.instagram.com/askoxy.ai_oxyrice/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white text-pink-500 transition"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {["Home", "Videos", "Use Cases", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(" ", "")}`}
                    className="text-gray-400 hover:text-white transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: "OXYLOANS", url: "https://oxyloans.com/" },
                { name: "OXYBRICKS", url: "https://www.oxybricks.world/" },
                { name: "ASK OXY.AI", url: "https://www.askoxy.ai/" },
                { name: "GLMS", url: "https://www.askoxy.ai/glms" },
              ].map((service) => (
                <li key={service.name}>
                  <a
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-sm space-y-2 text-gray-400 leading-relaxed">
              <p>
                CC-02, Ground Floor, Indu Fortune Fields, <br />
                KPHB Colony, Hyderabad, Telangana - 500085
              </p>
              <p>
                <a
                  href="mailto:support@askoxy.ai"
                  className="hover:text-white transition"
                >
                  support@askoxy.ai
                </a>
              </p>
              <p>
                <a
                  href="tel:+916300873713"
                  className="hover:text-white transition"
                >
                  +91 6300873713
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-6" />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-400 gap-4">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Global Lending Management
            Solutions. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center text-blue-400 hover:text-white transition"
            aria-label="Back to top"
          >
            <span className="mr-2">Back to top</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
