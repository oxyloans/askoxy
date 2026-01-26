import React, { useEffect } from "react";
import "./Header.css";
import Logo from "../assets/img/askoxylogoblack.png"; // Corrected path
import SignInIcon from "../assets/img/signin.png"; // Ensure path is correct
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
    // ✅ FIXED: Check for existing authentication before navigating to login
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    if (userId && accessToken) {
      // Preserve any existing redirectPath or default to dashboard
      const redirectPath =
        sessionStorage.getItem("redirectPath") || "/main/dashboard/home";
      toast.success("Welcome back! Redirecting to dashboard...");
      navigate(redirectPath);
      return;
    }
    // If not authenticated, proceed to login (login page will handle any stored tokens via its useEffect)
    navigate("/whatsapplogin");
  };

  return (
    <>
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={Logo} alt="ASK OXY AI" />
        </div>
        <div className="header-actions">
          <button
            className="sign-in-btn flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-[#FFD700] hover:text-[#FFA500] hover:bg-[rgba(255,215,0,0.1)] transition-all duration-300"
            aria-label="Sign In"
            onClick={handleSignIn1}
          >
            <img
              src={SignInIcon}
              alt="Sign In"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
              draggable={false}
            />
            <span className="text-sm sm:text-base">Sign In</span>
          </button>
        </div>
      </header>

    

      <div className="main-content">
        {/* Other components will be placed here */}
      </div>
    </>
  );
};

export default Header;
