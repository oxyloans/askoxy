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
import Logo from "../assets/img/logo.png";

// Social Media Links Component
const SocialLinks = () => {
  const socialLinks = [
    {
      icon: <Facebook className="h-5 w-5 text-[#1877F2]" />,
      href: "https://www.facebook.com/profile.php?id=61572388385568",
      label: "Facebook",
      hoverColor: "hover:text-blue-600",
    },
    {
      icon: <Instagram className="h-5 w-5 text-[#E4405F]" />,
      href: "https://www.instagram.com/askoxy.ai/",
      label: "Instagram",
      hoverColor: "hover:text-pink-600",
    },
    {
      icon: <Linkedin className="h-5 w-5 text-[#0A66C2]" />,
      href: "https://www.linkedin.com/in/askoxy-ai-5a2157349/",
      label: "LinkedIn",
      hoverColor: "hover:text-blue-700",
    },
  ];

  return (
    <div className="flex space-x-4 pt-2">
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className={`text-gray-300 hover:text-white transition-colors duration-300 ${social.hoverColor}`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

// Contact Info Component
const ContactInfo = () => {
  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5" />,
      content: (
        <>
          <strong>OXYKART TECHNOLOGIES PVT LTD</strong>
          <br />
          CC-02, Ground Floor, Block-C, Indu Fortune Fields, The Annexe
          Phase-13, KPHB Colony, Kukatpally, Hyderabad, Telangana - 500085
        </>
      ),
      type: "text",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      content: "support@askoxy.ai",
      type: "email",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      content: "+91 98765 43210",
      type: "phone",
    },
  ];

  return (
    <div className="space-y-3">
      {contactInfo.map((info, index) => (
        <div key={index} className="flex items-start space-x-3">
          <div className="text-[#ffa800] mt-1">{info.icon}</div>
          {info.type === "text" ? (
            <p className="text-sm text-gray-300 whitespace-pre-line">
              {info.content}
            </p>
          ) : (
            <a
              href={`${info.type === "email" ? "mailto:" : "tel:"}${
                info.content
              }`}
              className="text-sm text-gray-300 hover:text-[#ffa800] transition-colors duration-200"
            >
              {info.content}
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

// Footer Component
const Footer = React.memo(() => {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: "Free Rudraksha", path: "/dashboard/freerudraksha" },
    { name: "Free AI & GEN AI Training", path: "/dashboard/freeai-genai" },
    { name: "Legal Knowledge Hub", path: "/dashboard/legalservice" },
    { name: "Study Abroad", path: "/dashboard/studyabroad" },
    { name: "My Rotary", path: "/dashboard/myrotary" },
    { name: "We are hiring", path: "/dashboard/we-are-hiring" },
  ];

  return (
    <footer className="bg-[#351664] text-white border-t border-[#ffa800]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-5">
            <img src={Logo} alt="AskOxy.AI Logo" className="h-16 w-auto" />
            <p className="text-gray-300 text-sm leading-relaxed">
              AskOxy.AI delivers boundless freedom with unlimited ChatGPT
              prompts, empowering learners, researchers, and businesses to
              innovate without cost constraints.
            </p>
            <SocialLinks />
          </div>

          {/* Services Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#ffa800]">
              Our Services
            </h3>
            <nav className="space-y-3">
              {services.map((service) => (
                <a
                  key={service.name}
                  href={service.path}
                  className="block text-sm text-gray-300 hover:text-[#ffa800] transition-colors duration-200"
                >
                  {service.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-[#ffa800]">
              Contact Us
            </h3>
            <ContactInfo />
          </div>

          {/* Mobile App */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-[#ffa800]">
              Get Our App
            </h3>
            <p className="text-sm text-gray-300">
              Download AskOxy.AI mobile app for a seamless experience
            </p>
            <div className="space-y-3">
              <a
                href="https://apps.apple.com/in/app/oxyrice-rice-grocery-delivery/id6738732000"
                target="_blank"
                className="block"
              >
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Download on the App Store"
                  className="w-48"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.oxyrice.oxyrice_customer"
                target="_blank"
                className="block"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
                  alt="Get it on Google Play"
                  className="w-48"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-[#ffa800] mt-10 pt-6 text-sm text-gray-300 flex flex-col md:flex-row justify-between items-center">
          <div>
            &copy; {currentYear} <strong>ASKOXY.AI</strong>. All rights
            reserved.
          </div>
          <div>CIN: U72900TG2020PTC142391</div>
          <div className="flex space-x-4">
            <Link to="/privacypolicy" className="hover:text-[#ffa800]">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#ffa800]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
