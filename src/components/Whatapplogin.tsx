// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./LoginScreen.css"; // Ensure you have styles for the popup in this file

// const Whatapplogin: React.FC = () => {
//   const navigate = useNavigate();
//   const [credentials, setCredentials] = useState({
//     whatsappNumber: "",
//     otp: "",
//   });
//   const [error, setError] = useState<string>("");
//   const [otpError, setOtpError] = useState<string>("");
//   const [message, setMessage] = useState<string>("");
//   const [otpSession, setOtpSession] = useState<string | null>(null);
//   const [showOtp, setOtpShow] = useState<boolean | null>(false);
//   const [isbuttonenable, setisbuttonenable] = useState<boolean | null>(false);

//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);

//   // Handle input field changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setCredentials({
//       ...credentials,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Validate WhatsApp number (must be numeric and 10 digits long)
//   const validateWhatsAppNumber = (number: string) => {
//     const isValid = /^\d{10}$/.test(number); // Adjust this regex based on required length
//     if (!isValid) {
//       setError("Please enter a valid 10-digit WhatsApp number.");
//     }
//     return isValid;
//   };

//   // Validate OTP (must be numeric and 4-6 digits long)
//   const validateOtp = (otp: string) => {
//     const isValid = /^\d{4,6}$/.test(otp); // Adjust based on OTP length
//     if (!isValid) {
//       setOtpError("Please enter a valid OTP (4-6 digits).");
//     }
//     return isValid;
//   };

//   // Handle submission of the phone number to receive OTP
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     if (!validateWhatsAppNumber(credentials.whatsappNumber)) {
//       return; // If the number is invalid, stop the submission
//     }

//     try {
//       const response = await axios.post(
//         "https://meta.oxyloans.com/api/auth-service/auth/registerwithMobile",
//         {
//           registrationType: "whatsapp",
//           whatsappNumber: credentials.whatsappNumber,
//         }
//       );
//       setisbuttonenable(true);
//       if (response.data) {
//         console.log(response.data.mobileOtpSession);
//         localStorage.setItem(
//           "mobileOtpSession",
//           response.data.mobileOtpSession
//         );
//         localStorage.setItem("salt", response.data.salt);
//         if (response.data.userId !== null) {
//           localStorage.setItem("userId", response.data.userId);
//           navigate("/");
//         } else {
//           setOtpShow(true);
//         }
//         setMessage("OTP sent successfully to your WhatsApp number.");
//       } else {
//         setError("Failed to send OTP. Please try again.");
//       }
//     } catch (err) {
//       setError("An error occurred. Please try again later.");
//     }
//   };

//   // Handle OTP submission for verification
//   const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setOtpError("");
//     setMessage("");

//     if (!validateOtp(credentials.otp)) {
//       return; // If the OTP is invalid, stop the submission
//     }

//     try {
//       const response = await axios.post(
//         "https://meta.oxyloans.com/api/auth-service/auth/registerwithMobile",
//         {
//           registrationType: "whatsapp",
//           whatsappOtpSession: localStorage.getItem("mobileOtpSession"),
//           whatsappOtpValue: credentials.otp,
//           salt: localStorage.getItem("salt"),
//           whatsappNumber: credentials.whatsappNumber,
//           primaryType: "ASKOXY",
//         }
//       );
//       if (response.data) {
//         setShowSuccessPopup(true);
//         localStorage.setItem("userId", response.data.userId);
//         setMessage("Login successful!");
//         setTimeout(() => navigate("/"), 2000);
//       } else {
//         setOtpError("Invalid OTP. Please try again.");
//         setOtpSession(response.data.mobileOtpSession);
//       }
//     } catch (err: any) {
//       setOtpError("An error occurred while verifying OTP.");
//       setOtpSession(err);
//     }
//   };

//   // Handle changing phone number (reset OTP session)
//   const handleChangeNumber = () => {
//     setOtpSession(null);
//     setCredentials({ whatsappNumber: "", otp: "" });
//     setError("");
//     setOtpError("");
//     setOtpShow(false);
//     setMessage("");
//   };

//   return (
//     <div
//       className="login-container"
//       style={{ justifyContent: "center", alignItems: "center" }}
//     >
//       {/* Popup on successful login */}
//       {showSuccessPopup && (
//         <div className="popup-message">
//           <p>{message}</p>
//         </div>
//       )}

//       <div className="form-container">
//         <h2 className="login-header">ASKOXY.AI</h2>
//         <form onSubmit={showOtp ? handleOtpSubmit : handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="whatsappNumber" className="phoneNumber">
//               WhatsApp Number
//             </label>
//             <div className="input-wrapper">
//               <input
//                 type="text"
//                 id="whatsappNumber"
//                 name="whatsappNumber"
//                 value={credentials.whatsappNumber}
//                 onChange={handleChange}
//                 placeholder="Enter your WhatsApp number"
//                 required
//                 disabled={otpSession !== null}
//               />
//             </div>
//             {error && <span className="error-message">{error}</span>}
//           </div>

//           {/* OTP Field: Show only if OTP session is active */}
//           {showOtp && (
//             <div className="form-group">
//               <label htmlFor="otp">OTP</label>
//               <div className="input-wrapper">
//                 <input
//                   type="text"
//                   id="otp"
//                   name="otp"
//                   value={credentials.otp}
//                   onChange={handleChange}
//                   placeholder="Enter the OTP"
//                   required
//                 />
//               </div>
//               {otpError && <span className="error-message">{otpError}</span>}
//             </div>
//           )}

//           {/* Success message for OTP sent */}
//           {message && !showSuccessPopup && (
//             <span className="success-message">{message}</span>
//           )}

//           {/* Button text dynamically changes */}
//           <button type="submit">{otpSession ? "Submit OTP" : "Submit"}</button>
//           {isbuttonenable && (
//             <button
//               type="button"
//               onClick={handleChangeNumber}
//               className="change-number-button"
//             >
//               Change Number
//             </button>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Whatapplogin;

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

          setMessage("Login Successful!");
          setTimeout(() => navigate("/dashboard"), 2000);
        } else {
          setOtpShow(true);
          setShowSuccessPopup(true);
          setMessage("OTP sent successfully to your WhatsApp number.");
          setTimeout(() => {
            setShowSuccessPopup(false);
            setMessage("");
          }, 2000);
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
        setTimeout(() => navigate("/whatsapplogin"), 500);
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

          {isButtonEnabled && (
            <button
              type="button"
              onClick={() => setOtpShow(false)}
              className="change-number-button"
            >
              Change Number
            </button>
          )}
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
