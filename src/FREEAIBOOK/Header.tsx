import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Askoxy from "../assets/img/askoxylogonew.png";



const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();


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
          <div className="flex items-center cursor-pointer">
            <img
              src={Askoxy}
              alt="Askoxy.AI Logo"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-indigo-400">
              Free AI Book
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

        {isMenuOpen && (
          <div className="mobile-menu-container md:hidden bg-white border-t rounded-b-lg shadow-lg mt-1 animate-slideDown">
            <ul className="flex flex-col divide-y text-sm">
              

              <li className="px-4 pt-4">
                <button
                 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md transition"
                >
                  Free AI Book
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
