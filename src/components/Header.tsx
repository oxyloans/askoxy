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
      const redirectPath =
        sessionStorage.getItem("redirectPath") || "/main/dashboard/home";
      toast.success("Welcome back! Redirecting to dashboard...");
      navigate(redirectPath);
      return;
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