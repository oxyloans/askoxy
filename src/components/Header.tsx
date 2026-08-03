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

  useEffect(() => {
    sessionStorage.removeItem("primaryType");
    sessionStorage.removeItem("fromAISTore");
  }, []);

  const getPostAuthPath = () => {
    const { pathname, search, hash } = window.location;
    const currentPath = `${pathname}${search}${hash}`;

    if (pathname === "/myblogs") {
      return "/main/dashboard/myblogs";
    }

    if (pathname.startsWith("/services/")) {
      return `/main${currentPath}`;
    }

    return pathname === "/" ? "/main/dashboard/home" : currentPath;
  };

  const handleSignIn1 = () => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    const redirectPath = getPostAuthPath();

    // Preserve the page that opened the authentication flow. Both the login
    // and registration pages use this value after authentication succeeds.
    sessionStorage.setItem("redirectPath", redirectPath);

    if (userId && accessToken) {
      toast.success("Welcome back!");
      navigate(redirectPath);
      return;
    }

    navigate("/whatsapplogin");
  };

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="logo" onClick={() => navigate("/")}>
            <img src={Logo} alt="ASKOXY.AI" draggable={false} />
          </div>

          <div className="header-actions">
            <button
              className="voice-assistant-btn"
              type="button"
              onClick={() => setShowVoiceAssistant(true)}
            >
              Voice Assistant
            </button>

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
