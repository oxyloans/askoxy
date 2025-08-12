import React, { useState, useEffect, useCallback } from "react";
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

  // Check login status on mount
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("userId"));
  }, []);

  // Scroll effect for header styling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isLoggedIn) {
        localStorage.removeItem("userId");
        sessionStorage.removeItem("redirectPath");
        setIsLoggedIn(false);
        navigate("/FreeAIBook");
      } else {
        sessionStorage.setItem("redirectPath", "/FreeAIBook/view");
        window.location.href = LOGIN_URL;
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, navigate]);

  const handleWriteToUs = useCallback(() => {
    navigate("/main/writetous");
  }, [navigate]);

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
            // onClick={() => navigate("/")}
            className="flex items-center cursor-pointer select-none"
          >
            <img
              src={Askoxy}
              alt="Askoxy.AI Logo"
              className="h-10 sm:h-12 w-auto object-contain"
              loading="lazy"
            />
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn && (
              <button
                onClick={handleWriteToUs}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition transform hover:scale-105"
              >
                Write to Us
              </button>
            )}
            <button
              onClick={handleAuth}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg transition transform hover:scale-105 text-white ${
                isLoggedIn
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-purple-600 hover:bg-purple-700"
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
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t rounded-b-lg shadow-lg mt-1 animate-slideDown">
            <ul className="flex flex-col divide-y">
              {isLoggedIn && (
                <li className="p-4">
                  <button
                    onClick={handleWriteToUs}
                    className="w-full py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition"
                  >
                    Write to Us
                  </button>
                </li>
              )}
              <li className="p-4">
                <button
                  onClick={handleAuth}
                  disabled={isLoading}
                  className={`w-full py-3 rounded-md transition text-white ${
                    isLoggedIn
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
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
