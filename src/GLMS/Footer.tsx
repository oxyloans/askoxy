import React from "react";
import { Facebook, Twitter, Linkedin, Instagram, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company Info */}
          <div>
            <h4 className="text-2xl font-bold mb-4">
              Global Loans Management Systems
            </h4>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Modernizing loan management systems globally through domain
              expertise and innovative technology solutions.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-blue-600 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-sky-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-blue-500 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-pink-500 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {["Home", "Videos", "Use Cases", "Contact"].map((text) => (
                <li key={text}>
                  <a
                    href={`#${text.toLowerCase()}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {text}
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
                "Loan Origination",
                "Collections Management",
                "Financial Systems",
                "Customer Acquisition",
              ].map((service) => (
                <li key={service}>
                  <span className="text-gray-400 hover:text-white cursor-default transition-colors">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <address className="not-italic text-gray-400 space-y-3 text-sm leading-relaxed">
              <p>
                Ground Floor, Indu Fortune Fields,
                <br />
                KPHB Colony, Hyderabad,
                <br />
                Telangana - 500085
              </p>
              <p>
                <a
                  href="mailto:support@globalloans.com"
                  className="hover:text-white transition-colors"
                >
                  support@globalloans.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+917093485208"
                  className="hover:text-white transition-colors"
                >
                  +91 70934 85208
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Global Loans Management Systems.
            All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center hover:text-white transition-colors"
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
