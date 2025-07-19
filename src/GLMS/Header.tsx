import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Askoxy from "../assets/img/askoxylogonew.png";

interface HeaderProps {
  onNavClick: (id: "home" | "videos" | "usecases") => void;
  activeLink: string;
}

const Header = ({ onNavClick, activeLink }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { id: "home", label: "GLMS Home" },
    { id: "videos", label: "Videos" },
    { id: "usecases", label: "Use Cases" },
  ] as const;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      const closeOnOutsideClick = (e: MouseEvent) => {
        if (
          !(e.target instanceof HTMLElement) ||
          (!e.target.closest(".mobile-menu-container") &&
            !e.target.closest(".menu-button"))
        ) {
          setIsMenuOpen(false);
        }
      };
      document.addEventListener("click", closeOnOutsideClick);
      return () => document.removeEventListener("click", closeOnOutsideClick);
    }
  }, [isMenuOpen]);

  const handleNavClick = (id: (typeof navLinks)[number]["id"]) => {
    onNavClick(id);
    setIsMenuOpen(false);
  };

  const handleSignIn = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate("/main/services/a6b5/glms-open-source-hub-job-stree");
    } else {
      window.location.href = "/whatsapplogin";
    }
  };

  const handleJobStreet = () => {
    window.location.href = "/jobstreet";
  };

  const handleNomoGpt = () => {
    navigate("/nomogpt");
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white/80 backdrop-blur"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={handleSignIn}
          >
            <img
              src={Askoxy}
              alt="Askoxy.AI Logo"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center">
            <ul className="flex space-x-6 lg:space-x-10">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className={`relative px-2 py-1 text-base font-medium transition-all duration-150 rounded-md focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      activeLink === link.id
                        ? "text-blue-600 ring-blue-300"
                        : "text-gray-700 hover:text-blue-600 hover:ring-blue-100"
                    }`}
                  >
                    {link.label}
                    {activeLink === link.id && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleJobStreet}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              Job Street
            </button>
            <button
              onClick={handleSignIn}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              Sign In
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="menu-button text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Toggle Menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu-container md:hidden bg-white border-t rounded-b-lg shadow-lg mt-1 animate-slideDown">
            <ul className="flex flex-col divide-y text-sm">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full text-left px-6 py-4 font-medium transition-colors ${
                      activeLink === link.id
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}

              <li className="px-4 pt-4">
                <button
                  onClick={handleJobStreet}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md transition"
                >
                  Job Street
                </button>
              </li>
              <li className="px-4 pt-3 pb-4">
                <button
                  onClick={handleSignIn}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-md transition"
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
};

export default Header;
