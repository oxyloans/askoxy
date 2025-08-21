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

  const userId = localStorage.getItem("userId");
  const mobileNumber = localStorage.getItem("mobileNumber");
  const whatsappNumber = localStorage.getItem("whatsappNumber");

  // ✅ Helper: auto participation
  const participateInFreeAIBook = async () => {
    if (!userId) return;

    try {
      const { data } = await axios.post(
        `${BASE_URL}/marketing-service/campgin/allOfferesDetailsForAUser`,
        { userId }
      );

      const alreadyParticipated = data?.some(
        (offer: any) => offer.askOxyOfers === "FREEAIBOOK"
      );

      if (alreadyParticipated) {
        // message.info("You have already participated ✅");
        navigate("/FreeAIBook/view");
        return;
      }

      await axios.post(`${BASE_URL}/marketing-service/campgin/askOxyOfferes`, {
        askOxyOfers: "FREEAIBOOK",
        mobileNumber: mobileNumber || whatsappNumber,
        userId,
        projectType: "ASKOXY",
      });

      message.success("🎉 Welcome to Free AI Book!");
      navigate("/FreeAIBook/view");
    } catch (error) {
      console.error("Participation error:", error);
      // message.error("Something went wrong, please try again!");
    }
  };

  // Scroll + login check + auto participate
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    if (userId) {
      setIsLoggedIn(true);
      participateInFreeAIBook(); // auto trigger

      if (window.location.pathname === "/FreeAIBook") {
        navigate("/FreeAIBook/view");
      }
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [userId, navigate]);

  // Close mobile menu on outside click
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

  const handleSignIn = async () => {
    if (isLoggedIn) {
      localStorage.clear();
     message.success("You have successfully sign out.");
      window.location.href = "/FreeAIBook";
      return;
    }

    if (!userId) {
      sessionStorage.setItem("redirectPath", "/FreeAIBook/view");
      window.location.href = LOGIN_URL;
    }
  };

  const handleWriteToUs = () => {
    window.location.href = "/main/services/5d27/free-ai-book";
  };

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
          <div
            className="flex items-center cursor-pointer select-none"
            
          >
            <img
              src={Askoxy}
              alt="Askoxy.AI Logo"
              className="h-10 sm:h-12 w-auto object-contain"
              loading="lazy"
            />
          </div>

          <nav className="hidden md:flex items-center gap-4">
            {isLoggedIn && (
              <button
                onClick={handleWriteToUs}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
              } disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-400`}
            >
              {isLoggedIn ? "Sign Out" : "Sign In"}
            </button>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition menu-button"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden bg-white border-t rounded-b-lg shadow-lg mt-1 animate-slideDown mobile-menu-container">
            <ul className="flex flex-col divide-y">
              {isLoggedIn && (
                <li className="p-4">
                  <button
                    onClick={handleWriteToUs}
                    className="w-full py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                  } disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-400`}
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
