import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./Whatsapp.css";
import { Link } from "react-router-dom";
const Whatapplogin: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    otp: ["", "", "", ""],
  });
  const otpRefs = useRef<HTMLInputElement[]>([]); // Array of refs for OTP input fields
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [error, setError] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [otpSession, setOtpSession] = useState<string | null>(null);
  const [showOtp, setOtpShow] = useState<boolean | null>(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean | null>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...credentials.otp];
    newOtp[index] = value;
    setCredentials({ otp: newOtp });

    if (value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle submission of the phone number to receive OTP
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setError("Please Enter a valid WhatsApp Number with Country code.");
      return;
    }
    localStorage.setItem("whatsappNumber", phoneNumber);

    try {
      const response = await axios.post(
        "https://meta.oxyloans.com/api/auth-service/auth/registerwithMobile",
        {
          registrationType: "whatsapp",
          whatsappNumber: phoneNumber,
        }
      );
      setIsButtonEnabled(true);
      if (response.data) {
        localStorage.setItem(
          "mobileOtpSession",
          response.data.mobileOtpSession
        );
        localStorage.setItem("salt", response.data.salt);

        if (response.data.userId !== null) {
          setShowSuccessPopup(true);
          localStorage.setItem("userId", response.data.userId);
          localStorage.setItem("accessToken", response.data.accessToken); 

          setMessage("Login Successful!");
          setTimeout(() => navigate("/dashboard"), 2000);
        } else {
          setOtpShow(true);
          setShowSuccessPopup(true);
          setMessage("OTP sent successfully to your WhatsApp number.");
          setTimeout(() => {
            setShowSuccessPopup(false);
            setMessage("");
          }, 3000);
        }
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

    if (credentials.otp.join("").length != 4) {
      setOtpError("Please Enter the OTP");
      return;
    }

    try {
      const response = await axios.post(
        "https://meta.oxyloans.com/api/auth-service/auth/registerwithMobile",
        {
          registrationType: "whatsapp",
          whatsappOtpSession: localStorage.getItem("mobileOtpSession"),
          whatsappOtpValue: credentials.otp.join(""),
          salt: localStorage.getItem("salt"),
          whatsappNumber: phoneNumber,
          primaryType: "ASKOXY",
        }
      );
      if (response.data) {
        setShowSuccessPopup(true);
        localStorage.setItem("userId", response.data.userId);

        setMessage("Registration SuccessFull");
        setTimeout(() => navigate("/whatapplogin"), 2000);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setOtpError("Invalid OTP. Please try again.");
        setOtpSession(response.data.mobileOtpSession);
      }
    } catch (err: any) {
      setOtpError("Invalid OTP");
      setOtpSession(err);
    }
  };

  const otpInputStyle: React.CSSProperties = {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  };

  const otpCircleStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    textAlign: "center",
    borderRadius: "50%",
    border: "1px solid #003300",
    fontSize: "1.5rem",
  };

  return (
    <div className="login-container">
      {showSuccessPopup && (
        <div className="popup-message">
          <p>{message}</p>
        </div>
      )}

      <div className="form-container">
        <h2 className="login-header">ASKOXY.AI</h2>
        <form onSubmit={showOtp ? handleOtpSubmit : handleSubmit}>
          <div className="form-group">
            <label>
              WhatsApp Number <span style={{ color: "red" }}>*</span>
            </label>
            <div className="phoneinputfield">
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                defaultCountry="IN"
                international
                countrySelectProps={{
                  ariaLabel: "Phone number country",
                  className: "PhoneInputCountrySelect",
                }}
                className="PhoneInputInput"
              />
            </div>
            {error && <span className="error-message">{error}</span>}
          </div>

          {showOtp && (
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <div className="otp-inputs">
                {credentials.otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (otpRefs.current[index] = el!)}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onFocus={(e) => e.target.select()}
                    className="otp-circle"
                  />
                ))}
              </div>
              {otpError && <span className="error-message">{otpError}</span>}
            </div>
          )}

          {message && !showSuccessPopup && (
            <span className="success-message">{message}</span>
          )}

          <button type="submit" className="button">
            {otpSession ? "Submit OTP" : "Submit"}
          </button>

          {/* {isButtonEnabled && (
            <button
              type="button"
              onClick={() => setOtpShow(false)}
              className="change-number-button"
            >
              Change Number
            </button>
          )} */}
        </form>
        {/* <p className="or-divider">OR</p>
  
        <div className="alternate-login">
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <h1 style={{color:'#3d5afe', fontSize:'18px'}}>Login with Mobile Number</h1>
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default Whatapplogin;
