import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Askoxy from "../assets/img/askoxylogonew.png";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const LOGIN_URL = "/whatsappregister";

  useEffect(() => {
    // Check login status on mount
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  const handleAuth = async () => {
    try {
      setIsLoading(true);

      if (isLoggedIn) {
        // Sign out
        localStorage.removeItem("userId");
        sessionStorage.removeItem("redirectPath");
        setIsLoggedIn(false);
        navigate("/FreeAIBook"); // Redirect to home after sign out
      } else {
        // Sign in
        const userId = localStorage.getItem("userId");
        if (userId) {
          navigate("/FreeAIBook/view");
        } else {
          sessionStorage.setItem("redirectPath", "/FreeAIBook/view");
          window.location.href = LOGIN_URL;
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWriteToUs = () => {
    window.location.href = "/main/writetous";
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
          <div className="flex items-center cursor-pointer">
            <img
              src={Askoxy}
              alt="Askoxy.AI Logo"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn && (
              <button
                onClick={handleWriteToUs}
                className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-600 hover:via-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg transition transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                Write to Us
              </button>
            )}
            <button
              onClick={handleAuth}
              disabled={isLoading}
              className={`${
                isLoggedIn
                  ? "bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white"
                  : "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white"
              } px-4 py-2 rounded-lg transition transform hover:scale-105 focus-visible:ring-2 ${
                isLoggedIn
                  ? "focus-visible:ring-red-400"
                  : "focus-visible:ring-indigo-400"
              }`}
            >
              {isLoading
                ? "Loading..."
                : isLoggedIn
                ? "Sign Out"
                : "Free AI Book"}
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

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="mobile-menu-container md:hidden bg-white border-t rounded-b-lg shadow-lg mt-1 animate-slideDown">
            <ul className="flex flex-col divide-y text-sm">
              {isLoggedIn && (
                <li className="px-4 pt-4 pb-2">
                  <button
                    onClick={handleWriteToUs}
                    className="w-full py-3 rounded-md bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white transition"
                  >
                    Write to Us
                  </button>
                </li>
              )}
              <li className="px-4 pt-2 pb-4">
                <button
                  onClick={handleAuth}
                  disabled={isLoading}
                  className={`w-full py-3 rounded-md transition ${
                    isLoggedIn
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } text-white`}
                >
                  {isLoading
                    ? "Loading..."
                    : isLoggedIn
                    ? "Sign Out"
                    : "Free AI Book"}
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
