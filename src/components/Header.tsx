import React, { useState } from "react";
import "./Header.css";
import Logo from "../assets/img/logo.png"; // Corrected path
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleCartClick = () => setIsOpen(true);

  const handleClose = () => {
    toast.warning("Cart action cancelled.");
    setIsOpen(false);
  };

  const handleSignIn = () => {
    toast.success("Redirecting to Sign In...");
    setIsOpen(false);
    navigate("/whatsapplogin");
  };

  const handleSignIn1 = () => navigate("/whatsapplogin");

  return (
    <>
      <header className="header">
        <div className="logo">
          <img src={Logo} alt="ASK OXY AI" />
        </div>
        <div className="header-actions">
          <span
            className="cart-icon"
            title="View Cart"
            role="button"
            aria-label="View Cart"
            onClick={handleCartClick}
          >
            🛒
          </span>
          <button
            className="sign-in-btn"
            aria-label="Sign In"
            onClick={handleSignIn1}
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Modal */}
      {isOpen && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="modal-container bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 text-center">
              🛍️ Available Rice Brands
            </h3>
            <p className="text-gray-700 text-center mt-2 text-sm">
              We have various rice bags available: <br />
              <strong>HMT, JSR, Bawarchi, and more!</strong> <br />
              Log in anytime to place your order.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                className="px-4 py-2 bg-[#351664] text-white rounded-md hover:bg-[#2a0d52]"
                onClick={handleSignIn}
              >
                Sign In
              </button>
              <button
                className="px-4 py-2 bg-[#f44336] text-white rounded-md hover:bg-red-600"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="main-content">
        {/* Other components will be placed here */}
      </div>
    </>
  );
};

export default Header;
