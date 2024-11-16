import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Header2: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Function to handle the click event
  const handleSignInClick = () => {
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div
      className="absolute top-0 left-0 flex items-center justify-between header-container"
      style={{
        width: "calc(100%)",
        height: "60px",
        backgroundColor: "rgba(91, 5, 213, 0.85)",
        zIndex: 0,
        padding: "10px 20px",
      }}
    >
      {/* Button "AskOxy.AI" */}
      <Link to="/">
        <button
          className="px-6 py-2 font-bold text-black ask-button"
          style={{
            borderRadius: "50px",
            backgroundColor: "#f9cc15",
            border: "none",
            margin: "10px",
            width: "auto",
            padding: "8px",
          }}
        >
          ASKOXY.AI
        </button>
      </Link>
      <div
        className="row"
        style={{ display: "flex", flexDirection: "row", gap: "10px" }}
      >
        
        <div
          className="sign-in-container"
          style={{
            width: "auto",
            height: "auto",
            backgroundColor: "#726096",
            padding: "7px 20px",
            borderRadius: "50px",
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {/* SignIn button with redirection functionality */}

          <button
            className=""
            onClick={() => {
              localStorage.removeItem("userId");
              navigate("/login");
            }}
          >
            SignOut
          </button>
        </div>
      </div>
      {/* Media Queries for Mobile */}
      <style>
        {`
          @media (max-width: 768px) {
            .header-container {
              flex-direction: row;
              height: auto;
              padding: 10px;
              justify-content: space-between;
              align-items: center;
              width: calc(100%) !important;
            }

            .ask-button {
              width: 50%;
              margin-bottom: 0px;
              text-align: center;
              padding: 10px ;
            }

            .sign-in-container {
              width: 100%;
              text-align: center;
              padding: 10px 0;
            }
          }

          @media (max-width: 480px) {
            .header-container {
              padding: 5px;
              display : flex
            }

            .ask-button {
              font-size: 14px;
              padding: 8px 0;
            }

            .sign-in-container {
              font-size: 14px;
              padding: 8px 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Header2;
