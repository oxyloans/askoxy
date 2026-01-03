import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Askoxy from "../assets/img/askoxylogonew.png";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import BASE_URL from "../Config";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const LOGIN_URL = "/whatsappregister";

  // ✅ Check login status from localStorage
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setIsLoggedIn(true);
      triggerOfferAPI(); // auto API call on login
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // ✅ API call after successful login
  const triggerOfferAPI = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const mobileNumber =
        localStorage.getItem("mobileNumber") ||
        localStorage.getItem("whatsappNumber");

      if (!userId || !mobileNumber) return;

      const res = await axios.post(
        `${BASE_URL}/marketing-service/campgin/askOxyOfferes`,
        {
          askOxyOfers: "FREEAIBOOK",
          mobileNumber,
          userId,
          projectType: "ASKOXY",
        }
      );

      if (res.status === 200) {
        message.success("Welcome to Free AI Book 🎉");
      }
    } catch (error) {
      console.error("Offer API error:", error);
    }
  };

  // ✅ Sign in / Sign out logic
  const handleSignIn = () => {
    if (isLoggedIn) {
      // Sign Out
      localStorage.clear();
      sessionStorage.clear();
      setIsLoggedIn(false);
      navigate("/freeaibook", { replace: true }); // 🚀 prevent going back
      message.info("You have signed out.");
    } else {
      // Sign In
      setIsLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        const redirectPath = "/freeaibook/view";
        if (userId) {
          navigate(redirectPath);
        } else {
          sessionStorage.setItem("redirectPath", redirectPath);
          window.location.href = LOGIN_URL;
        }
      } catch (error) {
        console.error("Sign in error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ✅ Smooth scroll
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = document.querySelector("header")?.offsetHeight || 0;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: "smooth",
      });
    }
    setIsMenuOpen(false);
  };

  const handleWriteToUs = () => {
    window.location.href = "/main/services/5d27/free-ai-book";
  };

  // ✅ Mobile menu close on outside click
  useEffect(() => {
    if (!isMenuOpen) return;
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
  }, [isMenuOpen]);

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
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={() => navigate("/")}
          >
            <img
              src={Askoxy}
              alt="Askoxy.AI Logo"
              className="h-10 sm:h-12 w-auto object-contain"
              loading="lazy"
            />
          </div>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center flex-grow justify-center gap-6">
            {!isLoggedIn && (
              <>
                <a
                  href="#free-ai-book"
                  onClick={(e) => handleScroll(e, "free-ai-book")}
                  className="text-gray-700 hover:text-indigo-600 transition font-medium"
                >
                   AI Book
                </a>
                <a
                  href="#mission-million-ai-coders"
                  onClick={(e) => handleScroll(e, "mission-million-ai-coders")}
                  className="text-gray-700 hover:text-indigo-600 transition font-medium"
                >
                  Mission Million AI Coders
                </a>
                <a
                  href="#billionaire-hub"
                  onClick={(e) => handleScroll(e, "billionaire-hub")}
                  className="text-gray-700 hover:text-indigo-600 transition font-medium"
                >
                  BillionAIre Hub
                </a>
                <a
                  href="#billionaire-hub"
                  onClick={(e) => handleScroll(e, "glms")}
                  className="text-gray-700 hover:text-indigo-600 transition font-medium"
                >
                  GLMS
                </a>
                <a
                  href="#billionaire-hub"
                  onClick={(e) => handleScroll(e, "job-street")}
                  className="text-gray-700 hover:text-indigo-600 transition font-medium"
                >
                  Job Street
                </a>
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn && (
              <button
                onClick={handleWriteToUs}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition transform hover:scale-105"
              >
                Write to Us
              </button>
            )}
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg transition transform hover:scale-105 text-white ${
                isLoggedIn
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {isLoggedIn ? "Sign Out" : "Sign In"}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition menu-button"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <nav className="md:hidden bg-white border-t rounded-b-lg shadow-lg mt-1 animate-slideDown mobile-menu-container">
            <ul className="flex flex-col divide-y">
              {!isLoggedIn && (
                <>
                  <li className="p-4">
                    <a
                      href="#free-ai-book"
                      onClick={(e) => handleScroll(e, "free-ai-book")}
                      className="block text-gray-700 hover:text-indigo-600 transition"
                    >
                      AI Book
                    </a>
                  </li>
                  <li className="p-4">
                    <a
                      href="#mission-million-ai-coders"
                      onClick={(e) =>
                        handleScroll(e, "mission-million-ai-coders")
                      }
                      className="block text-gray-700 hover:text-indigo-600 transition"
                    >
                      Mission Million AI Coders
                    </a>
                  </li>
                  <li className="p-4">
                    <a
                      href="#billionaire-hub"
                      onClick={(e) => handleScroll(e, "billionaire-hub")}
                      className="block text-gray-700 hover:text-indigo-600 transition"
                    >
                      BillionAIre Hub
                    </a>
                  </li>
                  <li className="p-4">
                    <a
                      href="#glms"
                      onClick={(e) => handleScroll(e, "glms")}
                      className="block text-gray-700 hover:text-indigo-600 transition"
                    >
                     GLMS
                    </a>
                  </li>{" "}
                  <li className="p-4">
                    <a
                      href="#glms"
                      onClick={(e) => handleScroll(e, "glms")}
                      className="block text-gray-700 hover:text-indigo-600 transition"
                    >
                     Job Street
                    </a>
                  </li>
                </>
              )}
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
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className={`w-full py-3 rounded-md transition text-white ${
                    isLoggedIn
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {isLoggedIn ? "Sign Out" : "Sign In"}
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
