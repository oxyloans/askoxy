import React from "react";
import { Facebook, Twitter, Linkedin, Instagram, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-white pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company Info */}
          <div>
            <h4 className="text-2xl font-bold mb-4">
              Global Loans Management Systems
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Modernizing loan management systems globally through domain
              expertise and innovative technology solutions.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.facebook.com/ASKOXYAI"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-white text-blue-600 transition duration-200"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-white text-sky-400 transition duration-200"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/82577404/admin/dashboard/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-white text-blue-500 transition duration-200"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.instagram.com/askoxy.ai_oxyrice/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-white text-pink-500 transition duration-200"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {["Home", "Videos", "Use Cases", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-400 hover:text-white transition duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Our Services</h3>
            <ul className="space-y-3 text-sm">
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
                    className="text-gray-400 hover:text-white transition duration-200"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <address className="not-italic text-gray-400 space-y-3 text-sm leading-relaxed">
              <p>
                CC-02, Ground Floor, Indu Fortune Fields,
                <br />
                KPHB Colony, Hyderabad,
                <br />
                Telangana - 500085
              </p>
              <p>
                <a
                  href="mailto:support@globalloans.com"
                  className="hover:text-white transition duration-200"
                >
                  support@globalloans.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+916300873713"
                  className="hover:text-white transition duration-200"
                >
                  +91 6300873713
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-6"></div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm gap-4">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Global Lending Management
            Solutions. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center hover:text-white transition duration-200"
            aria-label="Scroll to top"
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
