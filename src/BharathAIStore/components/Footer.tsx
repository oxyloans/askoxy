import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/img/bharatAI.png";
import {
  Mail,
  Phone,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";

const year = new Date().getFullYear();

const Footer: React.FC = () => {
  const socialLinks = [
    {
      icon: Instagram,
      url: "https://www.instagram.com/askoxy.ai/",
      label: "Instagram",
      color: "text-pink-500 hover:text-pink-600",
    },
    {
      icon: Youtube,
      url: "https://www.youtube.com/@askoxyDOTai",
      label: "YouTube",
      color: "text-red-600 hover:text-red-700",
    },
    {
      icon: Linkedin,
      url: "https://www.linkedin.com/in/askoxy-ai-5a2157349/",
      label: "LinkedIn",
      color: "text-blue-700 hover:text-blue-800",
    },
    {
      icon: Facebook,
      url: "https://www.facebook.com/profile.php?id=61572388385568",
      label: "Facebook",
      color: "text-blue-600 hover:text-blue-700",
    },
    {
      icon: Twitter,
      url: "https://x.com/RadhakrishnaIND/status/1951525686373421101",
      label: "X (Twitter)",
      color: "text-black hover:text-gray-700",
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + About */}
          <section aria-labelledby="footer-about">
            <div className="flex items-start gap-3">
              <img
                src={Logo}
                alt="Bharat AI Logo"
                className="h-10 w-auto select-none"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Curated AI Agents and resources for everyone.
            </p>

            {/* Social Links */}
            <div className="mt-4 flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, url, label, color }) => (
                <a
                  key={label}
                  aria-label={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className={`${color} transition-colors`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </section>

          {/* Services */}
          <nav aria-labelledby="footer-services">
            <h2
              id="footer-services"
              className="text-base font-semibold text-gray-900"
            >
              Our Services
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  to="/ai-training"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Bharat AI Store
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-resources"
                  className="text-gray-600 hover:text-gray-900"
                >
                  AI Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/free-ai-book"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Free AI Book
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <section aria-labelledby="footer-contact">
            <h2
              id="footer-contact"
              className="text-base font-semibold text-gray-900"
            >
              Contact Us
            </h2>
            <address className="mt-4 space-y-3 not-italic text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <a
                  href="mailto:support@askoxy.ai"
                  className="hover:text-gray-900"
                >
                  support@askoxy.ai
                </a>
              </p>
              {["+91 81432 71103", "+91 91105 64106"].map((phone) => (
                <p key={phone} className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="hover:text-gray-900"
                  >
                    {phone}
                  </a>
                </p>
              ))}
            </address>
          </section>

          {/* Get our app */}
          <section aria-labelledby="footer-apps">
            <h2
              id="footer-apps"
              className="text-base font-semibold text-gray-900"
            >
              Get Our App
            </h2>
            <p className="mt-4 text-sm text-gray-600">
              Download ASKOXY.AI for a seamless experience.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3">
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
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="w-28 sm:w-32"
                />
              </a>
            </div>
          </section>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-200" />

        {/* Bottom Bar */}
        <div className="py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-gray-600">
            © {year} ASKOXY.AI. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link
              to="/bharath-aistore"
              className="text-gray-600 hover:text-gray-900"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              to="/bharath-aistore"
              className="text-gray-600 hover:text-gray-900"
            >
              Privacy Policy
            </Link>
            <Link
              to="/bharath-aistore"
              className="text-gray-600 hover:text-gray-900"
            >
              Contact Us
            </Link>
            <a
              href="#top"
              className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
              aria-label="Back to top"
            >
              Back to top <span aria-hidden>↑</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
