import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Askoxy from "../assets/img/askoxylogostatic.png";

interface HeaderProps {
  // Modified to match the more specific type in LandingPage
  onNavClick: (id: "home" | "videos" | "usecases" | "contact") => void;
  activeLink: string;
}

function Header({ onNavClick, activeLink }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          !(e.target instanceof HTMLElement) ||
          (!e.target.closest(".mobile-menu-container") &&
            !e.target.closest(".menu-button"))
        ) {
          setIsMenuOpen(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMenuOpen]);

  const navLinks: Array<{
    id: "home" | "videos" | "usecases" | "contact";
    label: string;
  }> = [
    { id: "home", label: "Glms Home" },
    { id: "videos", label: "Videos" },
    { id: "usecases", label: "Use Cases" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (
    id: "home" | "videos" | "usecases" | "contact"
  ): void => {
    // Now this only calls the parent function
    onNavClick(id);
    setIsMenuOpen(false);
  };

  const navigate = useNavigate();

  const handleSignin = () => {
    navigate("/whatsappregister");
  };
  const handleJobStreet = () => {
    window.open("/jobstreet", "_blank");
  };
  

  const handleLogo = () => {
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-md"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleLogo}
          >
            <img
              src={Askoxy}
              alt="Askoxy.AI Logo"
              className="h-14 w-18 object-contain"
            />
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex flex-1 justify-center">
            <ul className="flex space-x-6 lg:space-x-8">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className={`relative px-2 py-1 font-medium transition-colors duration-300 ${
                      activeLink === link.id
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {link.label}
                    {activeLink === link.id && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Sign In */}
          <div className="hidden md:flex items-center gap-3">
            {/* Job Street Button */}
            <button
              onClick={handleJobStreet}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg transition transform hover:scale-105"
            >
              Job Street
            </button>

            {/* Sign In Button */}
            <button
              onClick={handleSignin}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-5 rounded-lg transition transform hover:scale-105"
            >
              Sign In
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="menu-button text-gray-700 hover:text-blue-600 focus:outline-none p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-menu-container md:hidden bg-white py-4 shadow-lg rounded-b-lg absolute left-0 right-0 animate-fadeIn w-full">
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className={`block w-full text-left px-6 py-3 transition-colors duration-200 ${
                      activeLink === link.id
                        ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              {/* Job Street Button */}
              <li className="px-4 pt-4">
                <button
                  onClick={handleJobStreet}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 shadow-sm flex items-center justify-center"
                >
                  Job Street
                </button>
              </li>
              {/* Sign In Button */}
              <li className="px-4 pt-2 pb-2">
                <button
                  onClick={handleSignin}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 shadow-sm flex items-center justify-center"
                >
                  Sign In
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
