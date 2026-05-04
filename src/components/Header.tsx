import React, { useEffect } from "react";
import "./Header.css";
import Logo from "../assets/img/askoxylogonew.png";
import SignInIcon from "../assets/img/signin.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem("primaryType");
    sessionStorage.removeItem("fromAISTore");
    sessionStorage.removeItem("redirectPath");
  }, []);

  const handleSignIn1 = () => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    if (userId && accessToken) {
      // Set current path in sessionStorage first
      const currentPath = window.location.pathname;
      sessionStorage.setItem("currentPath", currentPath);
      
      // Get current path from sessionStorage and check
      const storedCurrentPath = sessionStorage.getItem("currentPath");
      let redirectPath;
      
      if (storedCurrentPath === "/myblogs") {
        redirectPath = "/main/dashboard/myblogs";
      } else {
        redirectPath = sessionStorage.getItem("redirectPath") || "/main/dashboard/home";
      }
      
      toast.success("Welcome back! Redirecting to dashboard...");
      navigate(redirectPath);
      return;
    }

    // User is not logged in - set redirect path based on current location
    const currentPath = window.location.pathname;
    if (currentPath === "/myblogs") {
      sessionStorage.setItem("redirectPath", "/main/dashboard/myblogs");
    } else {
      const existingRedirectPath = sessionStorage.getItem("redirectPath") || "/main/dashboard/home";
      sessionStorage.setItem("redirectPath", existingRedirectPath);
    }

    navigate("/whatsapplogin");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={Logo} alt="ASKOXY.AI" draggable={false} />
        </div>

        <div className="header-actions">
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
  );
};

export default Header;