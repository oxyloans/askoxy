import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Askoxy from "../assets/img/askoxylogoblack.png";
import { message } from "antd";

interface HeaderProps {
  onNavClick: (id: "home" | "videos" | "usecases" | "contact") => void;
  activeLink: string;
}

const Header = ({ onNavClick, activeLink }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const LOGIN_URL = "/whatsapplogin";

  const navLinks = [
    { id: "home", label: "GLMS Home" },
    { id: "videos", label: "Videos" },
    { id: "usecases", label: "Use Cases" },
    { id: "contact", label: "Contact" },
  ] as const;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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

  const handleNavClick = (id: (typeof navLinks)[number]["id"]) => {
    onNavClick(id);
    setIsMenuOpen(false);
  };

  const handleSignIn = () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      if (userId) {
        navigate("/main/services/a6b5/glms-open-source-hub-job-stree");
      } else {
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobStreet = () => {
    window.location.href = "/jobstreet";
  };

  const handleInterest = () => {
    const userId = localStorage.getItem("userId");
    sessionStorage.setItem("submitclicks", "true");
    if (userId) {
      navigate("/main/services/a6b5/glms-open-source-hub-job-stree");
    } else {
      message.warning("Please login to submit your interest.");
      sessionStorage.setItem(
        "redirectPath",
        "/main/services/a6b5/glms-open-source-hub-job-stree"
      );
      navigate("/whatsappregister");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white/80 backdrop-blur-sm"
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
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center">
            <ul className="flex space-x-6 lg:space-x-8">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className={`relative px-2 py-1 text-base font-medium transition-all ${
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

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleInterest}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition hover:scale-105"
            >
              I'm Interested
            </button>
            <button
              onClick={handleJobStreet}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition hover:scale-105"
            >
              Job Street
            </button>
            <button
              onClick={handleSignIn}
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition hover:scale-105"
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
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-menu-container md:hidden bg-white border-t rounded-b-lg shadow-md mt-1 animate-slideDown">
            <ul className="flex flex-col divide-y">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${
                      activeLink === link.id
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:bg-gray-50"
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
              <li className="px-4 pt-3">
                <button
                  onClick={handleSignIn}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-md transition"
                >
                  Sign In
                </button>
              </li>
              <li className="px-4 pt-3 pb-4">
                <button
                  onClick={handleInterest}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md transition"
                >
                  I'm Interested
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
