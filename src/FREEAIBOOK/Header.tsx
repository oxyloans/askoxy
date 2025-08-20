import React, { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import Askoxy from "../assets/img/askoxylogonew.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../Config";
import { message } from "antd";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const LOGIN_URL = "/whatsappregister";

  // Check login status and trigger API on login
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);

    if (userId && !localStorage.getItem("askOxyOfers")) {
      // UPDATED: Fetch whatsappNumber and mobileNumber directly from localStorage
      const whatsappNumber = localStorage.getItem("whatsappNumber") || "";
      const mobileNumber = localStorage.getItem("mobileNumber") || "";
      const contactNumber = whatsappNumber || mobileNumber;
      if (contactNumber) {
        submitInterest(userId, contactNumber);
      }
    }
  }, []);

  // Scroll effect for header styling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const submitInterest = useCallback(
    async (userId: string, contactNumber: string) => {
      try {
        const response = await axios.post(
          `${BASE_URL}/marketing-service/campgin/askOxyOfferes`,
          {
            askOxyOfers: "FREEAIBOOK",
            mobileNumber: contactNumber, // UPDATED: Use contactNumber (whatsappNumber or mobileNumber)
            userId,
            projectType: "ASKOXY",
          }
        );
        if (response.status === 200) {
          localStorage.setItem("askOxyOfers", response.data.askOxyOfers);
          message.success("Welcome to Free AI Book!");
          setTimeout(() => setSuccessMessage(null), 3000);
          return true;
        }
        return false;
      } catch (error) {
        console.error("API Error:", error);
        return false;
      }
    },
    []
  );

  const handleAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isLoggedIn) {
        // UPDATED: Clear all localStorage on sign-out
        localStorage.clear(); // Clears all localStorage keys (userId, askOxyOfers, whatsappNumber, mobileNumber, etc.)
        sessionStorage.removeItem("redirectPath");
        setIsLoggedIn(false);
        navigate("/FreeAIBook");
      } else {
        const userId = localStorage.getItem("userId");
        if (userId) {
          if (localStorage.getItem("askOxyOfers")) {
            message.success(
              "You have already participated, just visit the book."
            );
            setTimeout(() => setSuccessMessage(null), 3000);
            navigate("/FreeAIBook/view");
          } else {
            // UPDATED: Fetch whatsappNumber and mobileNumber directly from localStorage
            const whatsappNumber = localStorage.getItem("whatsappNumber") || "";
            const mobileNumber = localStorage.getItem("mobileNumber") || "";
            const contactNumber = whatsappNumber || mobileNumber;
            if (contactNumber) {
              const success = await submitInterest(userId, contactNumber);
              if (success) {
                navigate("/FreeAIBook/view");
              }
            } else {
              navigate("/FreeAIBook/view"); // Fallback if no contact number
            }
          }
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
  }, [isLoggedIn, navigate, submitInterest]);

  const handleWriteToUs = useCallback(() => {
    navigate("/main/services/5d27/free-ai-book");
  }, [navigate]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white/80 backdrop-blur"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer select-none">
            <img
              src={Askoxy}
              alt="Askoxy.AI Logo"
              className="h-10 sm:h-12 w-auto object-contain"
              loading="lazy"
            />
          </div>

          {/* Desktop Buttons */}
          <nav className="hidden md:flex items-center gap-4">
            {isLoggedIn && (
              <button
                onClick={handleWriteToUs}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="Write to Us"
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
              } disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-400`}
              aria-label={isLoggedIn ? "Sign Out" : "Free AI Book"}
            >
              {isLoading
                ? "Loading..."
                : isLoggedIn
                ? "Sign Out"
                : "Free AI Book"}
            </button>
          </nav>

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
          <nav className="md:hidden bg-white border-t rounded-b-lg shadow-lg mt-1 animate-slideDown">
            <ul className="flex flex-col divide-y">
              {isLoggedIn && (
                <li className="p-4">
                  <button
                    onClick={handleWriteToUs}
                    className="w-full py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    aria-label="Write to Us"
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
                  } disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-400`}
                  aria-label={isLoggedIn ? "Sign Out" : "Free AI Book"}
                >
                  {isLoading
                    ? "Loading..."
                    : isLoggedIn
                    ? "Sign Out"
                    : "Free AI Book"}
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fadeIn">
          {successMessage}
        </div>
      )}
    </header>
  );
};

export default Header;
