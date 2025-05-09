import React, { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import Askoxy from "../assets/img/askoxylogostatic.png";

interface HeaderProps {
  onNavClick?: (id: any) => void;
}

function Header({ onNavClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Find which section is currently in view
      const sections = ["home", "videos", "domains", "contact"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section is in the viewport (with some offset for the header)
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveLink(section);
            break;
          }
        }
      }
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

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "videos", label: "Videos" },
    { id: "domains", label: "Domains" },
    { id: "contact", label: "Contact" },
  ];

  interface NavLink {
    id: string;
    label: string;
  }

  const handleNavClick = (id: string): void => {
    setActiveLink(id);
    if (onNavClick) {
      onNavClick(id);
    }
    setIsMenuOpen(false);
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
            onClick={() => handleNavClick("home")}
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
          <div className="hidden md:block">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition transform hover:scale-105">
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
              <li className="px-4 pt-4 pb-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 shadow-sm flex items-center justify-center">
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
