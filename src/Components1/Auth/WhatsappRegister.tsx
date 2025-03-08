import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  X,
  Send,
  KeyRound,
  PhoneCall,
  Loader2,
  MessageCircle,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";
import BASE_URL from "../../Config";

const WhatsappRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    otp: ["", "", "", ""],
    mobileOTP: ["", "", "", "", "", ""],
  });
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const [otpMethod, setOtpMethod] = useState<"whatsapp" | "mobile">("whatsapp");
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [error, setError] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("91");
  const [otpError, setOtpError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [otpSession, setOtpSession] = useState<string | null>(null);
  const [showOtp, setOtpShow] = useState<boolean>(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isClosing, setIsClosing] = useState(false);
  const reffererId = localStorage.getItem("refferrerId");
  const [isPhoneDisabled, setisPhoneDisabled] = useState(false);
  const [isMethodDisabled, setIsMethodDisabled] = useState(false);

  const queryParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(queryParams.entries());
  const userType = params.userType;
// const BASE_URL = userType === "live" 
//   ? "https://meta.oxyloans.com/api" 
//   : "https://meta.oxyglobal.tech/api";

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    if (userId && accessToken) {
      navigate(location.state?.from || "/main/dashboard/products", { replace: true });
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const refParam = queryParams.get("ref");
    if (refParam) {
      localStorage.setItem("refferrerId", refParam);
      console.log("Extracted userId:", refParam);
    }
  }, [navigate, location]);

  useEffect(() => {
    if (resendDisabled) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setResendDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendDisabled]);

  
  // Extract country code from phone number
  useEffect(() => {
    if (phoneNumber) {
      // Extract country code without the + sign
      const phoneNumberS = parsePhoneNumber(phoneNumber)
      console.log("phoneNumberS.country", phoneNumberS?.countryCallingCode);
      const countryCode = phoneNumberS?.countryCallingCode ? `+${phoneNumberS.countryCallingCode}` : "";
      setCountryCode(countryCode || "");
      setIsMethodDisabled(true); // Disable method selection when number is entered
    } else {
      setIsMethodDisabled(false); // Enable method selection when number is empty
    }
  }, [phoneNumber]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  const handleOtpChange = (value: string, index: number) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");

    if (sanitizedValue.length <= 1) {
      if (otpMethod === "whatsapp") {
        const newOtp = [...credentials.otp];
        newOtp[index] = sanitizedValue;
        setCredentials((prev) => ({ ...prev, otp: newOtp }));
      } else {
        const newMobileOtp = [...credentials.mobileOTP];
        newMobileOtp[index] = sanitizedValue;
        setCredentials((prev) => ({ ...prev, mobileOTP: newMobileOtp }));
      }

      if (sanitizedValue && index < otpRefs.current.length - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const otpLength = otpMethod === "whatsapp" ? 4 : 6;
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, otpLength);
    
    if (otpMethod === "whatsapp") {
      const newOtp = [...credentials.otp];
      pastedData.split("").forEach((char, index) => {
        if (index < 4) newOtp[index] = char;
      });
      setCredentials(prev => ({ ...prev, otp: newOtp }));
    } else {
      const newMobileOtp = [...credentials.mobileOTP];
      pastedData.split("").forEach((char, index) => {
        if (index < 6) newMobileOtp[index] = char;
      });
      setCredentials(prev => ({ ...prev, mobileOTP: newMobileOtp }));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const currentOtp = otpMethod === "whatsapp" ? credentials.otp : credentials.mobileOTP;
    
    if (e.key === "Backspace" && !currentOtp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Clear errors when switching between WhatsApp and SMS
  const handleMethodChange = (method: "whatsapp" | "mobile") => {
    setOtpMethod(method);
    setError("");
    setOtpError("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setError("Please enter a valid Phone number with country code");
      setIsLoading(false);
      return;
    }

    try {
      const requestBody: Record<string, any> = {
        registrationType: otpMethod, // Uses "whatsapp" or "mobile"
        userType: "Register",
        countryCode: countryCode,
      };
      // Assign the correct number field based on user selection
      if (otpMethod === "whatsapp") {
        requestBody.whatsappNumber = phoneNumber.replace(countryCode, '');
      } else {
        requestBody.mobileNumber = phoneNumber.replace(countryCode, '');
      }

      if (reffererId) {
        requestBody.referrer_id = reffererId;
      }

      const response = await axios.post(
        BASE_URL+"/user-service/registerwithMobileAndWhatsappNumber",
        requestBody
      );
      
      if (response.data) {
        // Check for the specific error message indicating user already registered
        if (response.data.message === "User already registered with this Mobile Number, please log in.") {
          setShowSuccessPopup(false);
          setError("You are already registered with this number. Please log in.");
          setTimeout(() => navigate("/whatsapplogin"), 1500);
          return;
        }
        
        localStorage.setItem("mobileOtpSession", response.data.mobileOtpSession);
        localStorage.setItem("salt", response.data.salt);
        localStorage.setItem("expiryTime", response.data.otpGeneratedTime);
        localStorage.setItem("userType", userType);

        if (response.data.mobileOtpSession === null) {
          setShowSuccessPopup(false);
          setError("You already registered with this number.");
          setTimeout(() => navigate("/whatsapplogin"), 1500);
        } else {
          setIsButtonEnabled(true);
          setOtpShow(true);
          setShowSuccessPopup(true);
          setMessage(`OTP sent successfully to your ${otpMethod === "whatsapp" ? "WhatsApp" : "mobile"} number`);
          setResendDisabled(true);
          setisPhoneDisabled(true); // Disable the input field after OTP is sent
          setResendTimer(30);
          setTimeout(() => {
            setShowSuccessPopup(false);
            setMessage("");
          }, 2000);
        }
      }
    } catch (err: any) {
      // Handle axios error response
      if (err.response && err.response.data) {
        // Check if the error message indicates user is already registered
        if (err.response.data.message === "User already registered with this Mobile Number, please log in.") {
          setError("You are already registered with this number. Please log in.");
          setTimeout(() => navigate("/whatsapplogin"), 1500);
        } else {
          setError(err.response.data.message || "An error occurred. Please try again later.");
        }
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOtpError("");
    setMessage("");
    setIsLoading(true);
    
    if (!credentials) {
      setOtpError("Please enter the complete OTP");
      setIsLoading(false);
      return;
    }
    
    if (otpMethod === "whatsapp") {
      if (credentials.otp.join("").length !== 4) {
        setOtpError("Please enter the complete WhatsApp OTP");
        setIsLoading(false);
        return;
      }
    } else if (otpMethod === "mobile") {
      if (credentials.mobileOTP.join("").length !== 6) {
        setOtpError("Please enter the complete Mobile OTP");
        setIsLoading(false);
        return;
      }
    }
    
    try {
      const requestBody: Record<string, any> = {
        registrationType: otpMethod, // Uses "whatsapp" or "mobile"
        userType: "Register",
        countryCode: countryCode,
      };

      // Assign the correct OTP fields
      if (otpMethod === "whatsapp") {
        requestBody.whatsappNumber = phoneNumber?.replace(countryCode, '');
        requestBody.whatsappOtpSession = localStorage.getItem("mobileOtpSession");
        requestBody.whatsappOtpValue = credentials.otp.join("");
        requestBody.salt = localStorage.getItem("salt");
        requestBody.expiryTime = localStorage.getItem("expiryTime");
      } else {
        requestBody.mobileNumber = phoneNumber?.replace(countryCode, '');
        requestBody.mobileOtpSession = localStorage.getItem("mobileOtpSession");
        requestBody.mobileOtpValue = credentials.mobileOTP.join(""); //Use correct OTP field for SMS
        requestBody.expiryTime = localStorage.getItem("expiryTime");
        requestBody.salt = localStorage.getItem("salt");
      }

      if (reffererId) {
        requestBody.referrer_id = reffererId;
      }

      const response = await axios.post(
        BASE_URL+"/user-service/registerwithMobileAndWhatsappNumber",
        requestBody
      );

      if (response.data) {
        // Check for error message in the response
        if (response.data.message === "User already registered with this Mobile Number, please log in.") {
          setOtpError("You are already registered with this number. Redirecting to login...");
          setTimeout(() => navigate("/whatsapplogin"), 1500);
          return;
        }
        
        setShowSuccessPopup(true);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("accessToken", response.data.accessToken);
        setMessage("Registration Successful");
        if(otpMethod === "whatsapp") {
          localStorage.setItem("whatsappNumber", phoneNumber || "");
        } else {
          localStorage.setItem("mobileNumber", requestBody.mobileNumber);
        }
        localStorage.removeItem("refferrerId");
        setTimeout(() => navigate(location.state?.from || "/main/dashboard/products"), 500);
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err: any) {
      // Handle axios error response
      if (err.response && err.response.data && err.response.data.message) {
        setOtpError(err.response.data.message);
      } else {
        setOtpError("Invalid OTP");
      }
      setOtpSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!resendDisabled) {
      setResendDisabled(true);
      setResendTimer(30);
      setIsLoading(true);
      setOtpError("");

      try {
        const requestBody: Record<string, any> = {
          registrationType: otpMethod, // Uses "whatsapp" or "mobile"
          userType: "Register",
          countryCode: countryCode,
        };
        if (otpMethod === "whatsapp") {
          requestBody.whatsappNumber = phoneNumber?.replace(countryCode, '');
        } else {
          requestBody.mobileNumber = phoneNumber?.replace(countryCode, '');
        }
        const response = await axios.post(
          BASE_URL+"/user-service/registerwithMobileAndWhatsappNumber",
          requestBody
        );
        if (response.data) {
          // Check for error message in the response
          if (response.data.message === "User already registered with this Mobile Number, please log in.") {
            setError("You are already registered with this number. Redirecting to login...");
            setTimeout(() => navigate("/whatsapplogin"), 1500);
            return;
          }
          
          localStorage.setItem("mobileOtpSession", response.data.mobileOtpSession);
          localStorage.setItem("salt", response.data.salt);
          localStorage.setItem("expiryTime", response.data.otpGeneratedTime);

          setShowSuccessPopup(true);
          setMessage(`OTP resent successfully to your ${otpMethod === "whatsapp" ? "WhatsApp" : "mobile"} number`);
          // Clear existing OTP
          setCredentials((prev) => ({
            otp: otpMethod === "whatsapp" ? ["", "", "", ""] : prev.otp,
            mobileOTP: otpMethod === "mobile" ? ["", "", "", "", "", ""] : prev.mobileOTP,
          }));
          setTimeout(() => {
            setShowSuccessPopup(false);
            setMessage("");
          }, 2000);
        }
      } catch (err: any) {
        // Handle axios error response
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to resend OTP. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Check if OTP button should be enabled
  const isOtpButtonEnabled = phoneNumber && isValidPhoneNumber(phoneNumber);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-4">
      <div
        className={`max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
          isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 relative">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-2xl font-bold text-white text-center">
              Register to ASKOXY.AI
            </h2>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessPopup && (
          <div className="mx-6 mt-6 animate-fadeIn">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <Send className="w-5 h-5" />
              {message}
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="p-6">
          <form
            onSubmit={showOtp ? handleOtpSubmit : handleSubmit}
            className="space-y-6"
          >
            {/* OTP Method Selection UI (Add this at the top of the form) */}
            <div className="flex flex-col items-center gap-4 p-4">
              <h2 className="text-lg font-semibold">
                Registration
              </h2>
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg ${
                    otpMethod === "whatsapp"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleMethodChange("whatsapp")}
                  disabled={isPhoneDisabled || isMethodDisabled}
                >
                  Register via WhatsApp
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg ${
                    otpMethod === "mobile"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleMethodChange("mobile")}
                  disabled={isPhoneDisabled || isMethodDisabled}
                >
                  Register via SMS
                </button>
              </div>
            </div>
            {otpMethod && (
              <div className="relative w-full">
                <label className="relative -top-2 left-4 text-gray-500 text-sm">
                  {otpMethod === "whatsapp"
                    ? "WhatsApp Number"
                    : "Mobile Number"}{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <PhoneInput
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    defaultCountry="IN"
                    disabled={isPhoneDisabled} // Disable input only during OTP verification
                    international={otpMethod === "whatsapp"} // Allow country change for WhatsApp
                    countrySelectProps={{ disabled: otpMethod === "mobile" }} // Disable country selection for SMS
                    className="w-full p-3 bg-white/30 backdrop-blur-md shadow-md rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-800 placeholder-transparent [&>*]:outline-none [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:border-none"
                    maxLength={15}
                    placeholder="Enter your number"
                    style={
                      {
                        "--PhoneInputCountryFlag-borderColor": "transparent",
                      } as any
                    }
                  />
                  <PhoneCall className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                {error && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fadeIn">
                    <X className="w-4 h-4" />
                    {error}
                  </p>
                )}
              </div>
            )}
            {/* OTP Input */}
            {showOtp && (
              <div className="space-y-4 animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <div className="flex justify-center gap-3">
                  {(otpMethod === "whatsapp"
                    ? credentials.otp
                    : credentials.mobileOTP
                  ).map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      ref={(el) => (otpRefs.current[index] = el!)}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      className="w-12 h-12 text-center text-lg font-semibold border-2 rounded-xl"
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-red-500 text-sm flex items-center gap-1 animate-fadeIn">
                    <X className="w-4 h-4" />
                    {otpError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendDisabled || isLoading}
                  className="text-sm text-purple-600 hover:text-purple-800 disabled:text-gray-400 flex items-center gap-1 transition-colors group"
                >
                  {resendDisabled ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  )}
                  Resend OTP {resendDisabled && `(${resendTimer}s)`}
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading || (!showOtp && !isOtpButtonEnabled)}
                className={`w-full py-3 ${
                  !showOtp && !isOtpButtonEnabled 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {showOtp ? ( // Check if OTP is shown
                      <>
                        <KeyRound className="w-5 h-5" />
                        Verify OTP
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-5 h-5" />
                        Get OTP
                      </>
                    )}
                  </>
                )}
              </button>
              {isButtonEnabled && (
                <button
                  type="button"
                  onClick={() => {
                    setOtpShow(false);
                    setisPhoneDisabled(false); // Enable input field when changing the number
                    setOtpError("");
                  }}
                  disabled={isLoading}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Change Number
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <p className="text-sm text-gray-600 text-center flex items-center justify-center gap-2">
            Already registered?{" "}
            <Link
              to="/whatsapplogin"
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 group"
            >
              Login Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsappRegister;