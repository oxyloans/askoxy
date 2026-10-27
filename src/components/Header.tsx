import React, { useEffect, useState } from "react";
import "./Header.css";
import Logo from "../assets/img/askoxylogonew.png";
import SignInIcon from "../assets/img/signin.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VoiceLoginPage from "./VoiceLoginPage";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const checkAuth = () => {
    const userId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("accessToken") ||
      sessionStorage.getItem("token");
    return Boolean(userId && token);
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => checkAuth());

  useEffect(() => {
    sessionStorage.removeItem("primaryType");
    sessionStorage.removeItem("fromAISTore");

    const updateAuth = () => {
      setIsLoggedIn(checkAuth());
    };

    updateAuth();
    window.addEventListener("storage", updateAuth);
    return () => {
      window.removeEventListener("storage", updateAuth);
    };
  }, []);

  const getPostAuthPath = () => {
    const { pathname, search, hash } = window.location;
    const currentPath = `${pathname}${search}${hash}`;

    if (pathname === "/myblogs") {
      return "/main/dashboard/myblogs";
    }

    if (pathname === "/partner") {
      return `/main/partner/journeys${search}${hash}`;
    }

    if (pathname.startsWith("/services/")) {
      return `/main${currentPath}`;
    }

    return pathname === "/" ? "/main/dashboard/home" : currentPath;
  };

  const handleSignIn1 = () => {
    const isAuthed = checkAuth();

    if (isAuthed) {
      toast.success("Welcome back!");
      navigate("/main/dashboard/home");
      return;
    }

    const redirectPath = getPostAuthPath();
    sessionStorage.setItem("redirectPath", redirectPath);
    navigate("/whatsapplogin");
  };

  return (
    <>
      <header className="header">
        <div className="header-inner max-w-8xl mx-auto">
          <div className="logo" onClick={() => navigate("/")}>
            <img src={Logo} alt="ASKOXY.AI" draggable={false} />
          </div>

          <div className="header-actions">
            {/* <button
              className="voice-assistant-btn"
              type="button"
              onClick={() => setShowVoiceAssistant(true)}
            >
              Voice Assistant
            </button> */}

            {isLoggedIn ? (
              <button
                className="sign-in-btn"
                aria-label="Dashboard"
                onClick={handleSignIn1}
                type="button"
              >
                <span>Dashboard</span>
              </button>
            ) : (
              <button
                className="sign-in-btn"
                aria-label="Sign In"
                onClick={handleSignIn1}
                type="button"
              >
                <img
                  src={SignInIcon}
                  alt="Sign In"
                  className="sign-in-icon"
                  draggable={false}
                />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {showVoiceAssistant && (
        <VoiceLoginPage onClose={() => setShowVoiceAssistant(false)} />
      )}
    </>
  );
};

export default Header;
