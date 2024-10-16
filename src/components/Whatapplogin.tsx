import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginScreen.css"; // Ensure you have styles for the popup in this file

const Whatapplogin: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    whatsappNumber: "",
    otp: "",
  });
  const [error, setError] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [otpSession, setOtpSession] = useState<string | null>(null);
  const [showotp, setOtpShow] = useState<boolean | null>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submission of the phone number to receive OTP
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "https://meta.oxyloans.com/api/auth-service/auth/registerwithMobile",
        {
          registrationType: "whatsapp",
          whatsappNumber: credentials.whatsappNumber,
        }
      );
      if (response.data) {
        // Store the necessary session details
        console.log(response.data.mobileOtpSession);
        localStorage.setItem(
          "mobileOtpSession",
          response.data.mobileOtpSession
        );
        localStorage.setItem("salt", response.data.salt);
        setOtpShow(true);

        // Save OTP session and show success message for OTP

        // setOtpSession(response.data.whatsappOtpSession);
        setMessage("OTP sent successfully to your WhatsApp number.");
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };

  // Handle OTP submission for verification
  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOtpError("");
    setMessage("");

    try {
      const response = await axios.post(
        "https://meta.oxyloans.com/api/auth-service/auth/registerwithMobile",
        {
          registrationType: "whatsapp",
          whatsappOtpSession: localStorage.getItem("mobileOtpSession"), // Use the stored whatsappOtpSession
          whatsappOtpValue: credentials.otp,
          salt: localStorage.getItem("salt"), // Ensure salt is passed
          whatsappNumber: credentials.whatsappNumber,
          primaryType: "ASKOXY",
        }
        //         {
        //   "registrationType": "whatsapp",
        //   "whatsappNumber": "9182580511",
        //   "salt": "608cf1b1-b47a-4184-b87f-ea60b6d08b075a23f443-8",
        //   "whatsappOtpSession":"7FA49C96CE9EC198EFB1372DD458894B94A1E6978AB228C80936EC139A0220C1125DF3E995D766E21E04A6E826C60B04A7E819939639E9547D4EA7A5306E1688",
        //   "primaryType": "ASKOXY",
        //   "whatsappOtpValue": "5021"

        // }
      );
      if (response.data) {
        setShowSuccessPopup(true); // Show success popup
        localStorage.setItem("userId", response.data.userId);
        setMessage("Login successful!");

        // Redirect to dashboard or another page after success
        setTimeout(() => navigate("/"), 2000);
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setOtpError("An error occurred while verifying OTP.");
    }
  };

  // Handle changing phone number (reset OTP session)
  const handleChangeNumber = () => {
    setOtpSession(null);
    setCredentials({ whatsappNumber: "", otp: "" });
    setError("");
    setOtpError("");
  };

  return (
    <div
      className="login-container"
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      {/* Popup on successful login */}
      {showSuccessPopup && (
        <div className="popup-message">
          <p>{message}</p>
        </div>
      )}

      <div className="form-container">
        <h2 className="login-header">ASKOXY.AI</h2>
        <form onSubmit={showotp ? handleOtpSubmit : handleSubmit}>
          <div className="form-group">
            <label htmlFor="whatsappNumber" className="phoneNumber">
              WhatsApp Number
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="whatsappNumber"
                name="whatsappNumber"
                value={credentials.whatsappNumber}
                onChange={handleChange}
                placeholder="Enter your WhatsApp number"
                required
                disabled={otpSession !== null} // Disable if OTP session is active
              />
            </div>
            {error && <span className="error-message">{error}</span>}
          </div>

          {/* OTP Field: Show only if OTP session is active */}
          {showotp && (
            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={credentials.otp}
                  onChange={handleChange}
                  placeholder="Enter the OTP"
                  required
                />
              </div>
              {otpError && <span className="error-message">{otpError}</span>}
            </div>
          )}

          {/* Success message for OTP sent */}
          {message && !showSuccessPopup && (
            <span className="success-message">{message}</span>
          )}

          {/* Button text dynamically changes */}
          <button type="submit">{otpSession ? "Submit OTP" : "Submit"}</button>

          {/* Option to change phone number after OTP is sent */}
          {otpSession && (
            <button
              type="button"
              onClick={handleChangeNumber}
              className="change-number-button"
            >
              Change Number
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Whatapplogin;
