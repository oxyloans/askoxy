import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa6";
import axios from "axios";
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
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
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import BASE_URL from "../../Config";

const WhatsappLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    otp: ["", "", "", ""],
    mobileOTP: ["", "", "", "", "", ""],
  });
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [otpMethod, setOtpMethod] = useState<"whatsapp" | "mobile">("mobile");
  const [showEnglish, setShowEnglish] = useState(true);
  const [error, setError] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("91"); // Default to India
  const [otpError, setOtpError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [otpSession, setOtpSession] = useState<string | null>(null);
  const [showOtp, setOtpShow] = useState<boolean>(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isClosing, setIsClosing] = useState(false);
  const [isPhoneDisabled, setIsPhoneDisabled] = useState(false);
  const [animateOtp, setAnimateOtp] = useState(false);
  const [isMethodDisabled, setIsMethodDisabled] = useState(false);
  const [changeNumberClicked, setChangeNumberClicked] = useState(false);
  const [isGetOtpButtonDisabled, setIsGetOtpButtonDisabled] = useState(true);
  const [showUserMessage, setShowUserMessage] = useState(true);
  // Add state for showing Erice alert
  const [showEriceAlert, setShowEriceAlert] = useState(true);

  const queryParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(queryParams.entries());
  const userType = params.userType;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    if (userId && accessToken) {
      navigate(location.state?.from || "/main/dashboard/home", {
        replace: true,
      });
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

  // useEffect(() => {
  //   // Set up an interval to toggle between languages every 7 seconds
  //   const intervalId = setInterval(() => {
  //     setShowEnglish(prevState => !prevState);
  //   }, 7000);

  //   // Clean up interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, []);

  // Check if phone number is valid to enable/disable "Get OTP" button
  useEffect(() => {
    if (phoneNumber && isValidPhoneNumber(phoneNumber)) {
      setIsGetOtpButtonDisabled(false);
    } else {
      setIsGetOtpButtonDisabled(true);
    }
  }, [phoneNumber]);

  // Extract country code from phone number
  useEffect(() => {
    if (phoneNumber) {
      const phoneNumberObj = parsePhoneNumber(phoneNumber);
      const countryCode = phoneNumberObj?.countryCallingCode
        ? `+${phoneNumberObj.countryCallingCode}`
        : "";
      setCountryCode(countryCode);
      setIsMethodDisabled(true); // Disable method selection when number is entered
    } else {
      setIsMethodDisabled(false); // Enable method selection when number is empty
    }
  }, [phoneNumber]);

  // Automatically set SMS as the default method if Erice is detected in URL
  useEffect(() => {
    if (
      window.location.search.includes("erice") ||
      window.location.pathname.includes("erice")
    ) {
      setOtpMethod("mobile");
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    const entryPoint = localStorage.getItem("entryPoint") || "/";
    console.log("Closing - Redirecting to:", entryPoint); // Debug log
    setTimeout(() => {
      navigate(entryPoint);
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
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, otpMethod === "whatsapp" ? 4 : 6);

    if (otpMethod === "whatsapp") {
      const newOtp = [...credentials.otp];
      pastedData.split("").forEach((char, index) => {
        if (index < 4) newOtp[index] = char;
      });
      setCredentials((prev) => ({
        ...prev,
        otp: newOtp,
      }));
    } else {
      const newMobileOtp = [...credentials.mobileOTP];
      pastedData.split("").forEach((char, index) => {
        if (index < 6) newMobileOtp[index] = char;
      });
      setCredentials((prev) => ({
        ...prev,
        mobileOTP: newMobileOtp,
      }));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (otpMethod === "whatsapp") {
        if (!credentials.otp[index] && index > 0) {
          otpRefs.current[index - 1]?.focus();
        }
      } else {
        if (!credentials.mobileOTP[index] && index > 0) {
          otpRefs.current[index - 1]?.focus();
        }
      }
    }
  };

  // Extract phone number without country code
  const extractPhoneWithoutCode = (phone: string) => {
    if (!phone) return "";
    const phoneNumberObj = parsePhoneNumber(phone);
    if (phoneNumberObj && phoneNumberObj.nationalNumber) {
      return phoneNumberObj.nationalNumber;
    }
    // Fallback to simple extraction
    const parts = phone.split(" ");
    return parts.length > 1 ? parts.slice(1).join("") : phone;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);
    // Hide Erice alert when Get OTP is clicked
    setShowEriceAlert(false);

    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setError("Please enter a valid number with country code");
      setIsLoading(false);
      return;
    }

    try {
      // Extract phone number without country code
      const phoneWithoutCode = extractPhoneWithoutCode(phoneNumber);

      const requestBody: Record<string, any> = {
        registrationType: otpMethod, // Uses "whatsapp" or "mobile"
        userType: "Login",
        countryCode, // Just pass the country code number (e.g., "91" for India)
      };

      // Assign the correct number field based on user selection
      if (otpMethod === "whatsapp") {
        requestBody.whatsappNumber = phoneWithoutCode;
      } else {
        requestBody.mobileNumber = phoneWithoutCode;
      }

      const response = await axios.post(
        BASE_URL + "/user-service/registerwithMobileAndWhatsappNumber",
        requestBody
      );
      setIsButtonEnabled(true);
      if (response.data) {
        localStorage.setItem(
          "mobileOtpSession",
          response.data.mobileOtpSession
        );
        localStorage.setItem("salt", response.data.salt);
        localStorage.setItem("expiryTime", response.data.otpGeneratedTime);
        localStorage.setItem("userType", userType);

        if (
          response.data.userId === null &&
          response.data.userId === undefined &&
          response.data.mobileOtpSession === null &&
          response.data.mobileOtpSession === undefined
        ) {
          setShowSuccessPopup(true);
          setMessage("This number is not registered. Please register now.");
          setTimeout(() => navigate("/whatsappregister"), 1000);
        } else {
          setOtpShow(true);
          setAnimateOtp(true);
          setTimeout(() => setAnimateOtp(false), 1000);
          setShowSuccessPopup(true);
          setMessage(
            `OTP sent successfully to your ${
              otpMethod === "whatsapp" ? "WhatsApp" : "mobile"
            } number`
          );
          setResendDisabled(true);
          setIsPhoneDisabled(true);
          setResendTimer(30);
          // Reset change number clicked state
          setChangeNumberClicked(false);
          setTimeout(() => {
            setShowSuccessPopup(false);
            setMessage("");
          }, 2000);
        }
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        // Check if the error message indicates user is already registered
        if (
          err.response.data.message ===
          "User already registered with this Mobile Number, please log in."
        ) {
          setError(
            "You are already registered with this number. Please log in."
          );
          setTimeout(() => navigate("/whatsapplogin"), 1500);
        } else {
          setError(
            err.response.data.message ||
              "An error occurred. Please try again later."
          );
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
      // Extract phone number without country code
      const phoneWithoutCode = extractPhoneWithoutCode(phoneNumber || "");

      const requestBody: Record<string, any> = {
        registrationType: otpMethod,
        userType: "Login",
        countryCode, // Just pass the country code number (e.g., "91" for India)
      };

      if (otpMethod === "whatsapp") {
        requestBody.whatsappNumber = phoneWithoutCode;
        requestBody.whatsappOtpSession =
          localStorage.getItem("mobileOtpSession");
        requestBody.whatsappOtpValue = credentials.otp.join("");
        requestBody.salt = localStorage.getItem("salt");
        requestBody.expiryTime = localStorage.getItem("expiryTime");
      } else {
        requestBody.mobileNumber = phoneWithoutCode;
        requestBody.mobileOtpSession = localStorage.getItem("mobileOtpSession");
        requestBody.mobileOtpValue = credentials.mobileOTP.join("");
        requestBody.salt = localStorage.getItem("salt");
        requestBody.expiryTime = localStorage.getItem("expiryTime");
      }

      const response = await axios.post(
        BASE_URL + "/user-service/registerwithMobileAndWhatsappNumber",
        requestBody
      );
      if (response.data) {
        setShowSuccessPopup(true);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("accessToken", response.data.accessToken);
        if (otpMethod === "whatsapp") {
          localStorage.setItem("whatsappNumber", phoneWithoutCode);
        } else {
          localStorage.setItem(
            "mobileNumber",
            phoneWithoutCode.replace(countryCode, "")
          );
        }
        localStorage.removeItem("mobileOtpSession");
        localStorage.removeItem("salt");
        localStorage.removeItem("expiryTime");
        setMessage("Login Successful");
        // setTimeout(
        //   () => navigate(location.state?.from || "/main/dashboard/home"),
        //   500
        // );

        setTimeout(() => {
          const redirectPath = sessionStorage.getItem("redirectPath");

          if (redirectPath) {
            navigate(redirectPath);
            sessionStorage.removeItem("redirectPath");
          } else {
            navigate(location.state?.from || "/main/dashboard/home");
          }
        }, 500);
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        setOtpError(
          err.response.data.message ||
            "An error occurred. Please try again later."
        );
      } else {
        setError("An error occurred. Please try again later.");
      }
      // setOtpSession(null);
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
        // Extract phone number without country code
        const phoneWithoutCode = extractPhoneWithoutCode(phoneNumber || "");

        const requestBody: Record<string, any> = {
          registrationType: otpMethod,
          userType: "Login",
          countryCode, // Just pass the country code number (e.g., "91" for India)
        };

        if (otpMethod === "whatsapp") {
          requestBody.whatsappNumber = phoneWithoutCode;
        } else {
          requestBody.mobileNumber = phoneWithoutCode;
        }

        const response = await axios.post(
          BASE_URL + "/user-service/registerwithMobileAndWhatsappNumber",
          requestBody
        );
        if (response.data) {
          localStorage.setItem(
            "mobileOtpSession",
            response.data.mobileOtpSession
          );
          localStorage.setItem("salt", response.data.salt);
          localStorage.setItem("expiryTime", response.data.otpGeneratedTime);

          setShowSuccessPopup(true);
          setMessage(
            `OTP resent successfully to your ${
              otpMethod === "whatsapp" ? "WhatsApp" : "mobile"
            } number`
          );
          // Clear existing OTP
          setCredentials((prev) => ({
            otp: otpMethod === "whatsapp" ? ["", "", "", ""] : prev.otp,
            mobileOTP:
              otpMethod === "mobile"
                ? ["", "", "", "", "", ""]
                : prev.mobileOTP,
          }));
          setTimeout(() => {
            setShowSuccessPopup(false);
            setMessage("");
          }, 2000);
        }
      } catch (err: any) {
        if (err.response && err.response.data) {
          setError(
            err.response.data.message ||
              "An error occurred. Please try again later."
          );
        } else {
          setError("An error occurred. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Phone input change handler
  const handlePhoneChange = (value: string | undefined) => {
    setPhoneNumber(value);
    // Clear error message when phone number changes
    if (error) {
      setError("");
    }
  };

  // Method for switching OTP method
  const switchOtpMethod = (method: "whatsapp" | "mobile") => {
    if (!isPhoneDisabled && !isMethodDisabled) {
      // Only allow switching when not in OTP verification mode and no phone number entered
      setOtpMethod(method);
      // Clear errors when switching methods
      setError("");
      setOtpError("");
    }
  };

  // Handle change number button click
  const handleChangeNumber = () => {
    setOtpShow(false);
    setIsPhoneDisabled(false);
    setIsButtonEnabled(false);
    setPhoneNumber(undefined); // Clear the phone number
    setError("");
    setOtpError("");
    setIsMethodDisabled(false); // Re-enable method selection
    setChangeNumberClicked(true); // Mark as clicked once
    setIsGetOtpButtonDisabled(true); // Disable "Get OTP" button again
    // Show Erice alert again when changing number
    setShowEriceAlert(true);

    // Reset OTP fields
    setCredentials({
      otp: ["", "", "", ""],
      mobileOTP: ["", "", "", "", "", ""],
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 row">
      <div
        className={`max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
          isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {/* Header */}
        <div className="bg-purple-600 p-4 relative">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-2xl font-bold text-white text-center">
              Welcome to ASKOXY.AI
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => (window.location.href = "/whatsapplogin")}
                className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-purple-100 hover:shadow-md hover:scale-105 transition-all duration-200 active:bg-white active:text-purple-600 active:font-bold"
              >
                Login
              </button>
              <button
                onClick={() => (window.location.href = "/whatsappregister")}
                className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-purple-600 hover:shadow-md hover:scale-105 transition-all duration-200 active:bg-white active:text-purple-600 active:font-bold"
              >
                Register
              </button>
            </div>
          </div>
        </div>
        <h2 className="mx-6 mt-4 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 mb-2">
          Welcome, Study Abroad Aspirants!
        </h2>
        {/* Erice Customer Alert - Now conditionally rendered */}
        {showEriceAlert && (
          <div className="mx-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-start gap-2 relative">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                {showEnglish ? (
                  <>
                    <p className="font-bold">ERICE కస్టమర్లకు గమనిక</p>
                    <p className="text-xs">
                      మీ డేటా మైగ్రేట్ చేయబడింది. SMS ఎంపికను ఉపయోగించి లాగిన్
                      అవ్వండి. మీ మొబైల్ మరియు WhatsApp నంబర్లు ఒకటే అయితే, మీరు
                      WhatsApp ద్వారా కూడా లాగిన్ అవ్వవచ్చు
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold">Attention Erice Customers</p>
                    <p className="text-xs">
                      Your data has been migrated. Log in using the SMS option.
                      If your mobile and WhatsApp numbers are the same, you can
                      also log in via WhatsApp.
                    </p>
                  </>
                )}
                <div className="items-end">
                  <button>
                    <button
                      onClick={() => setShowEnglish(!showEnglish)}
                      className="absolute bottom-2 right-2 px-2 py-1 text-xs bg-amber-50 text-amber-800 rounded"
                    >
                      {showEnglish ? "Switch to English" : "Switch to Telugu"}
                    </button>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {showSuccessPopup && (
          <div className="mx-6 mt-2 animate-fadeIn">
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
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
            {/* OTP Method Selection UI */}
            <div className="flex flex-col items-center gap-4 p-2   border-b border-gray-100 pb-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`flex items-center gap-2 px-4  rounded-lg transition-all ${
                    otpMethod === "mobile"
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${
                    isPhoneDisabled || isMethodDisabled
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => switchOtpMethod("mobile")}
                  disabled={isPhoneDisabled || isMethodDisabled}
                >
                  <Smartphone className="w-5 h-5" />
                  SMS
                </button>
                <button
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    otpMethod === "whatsapp"
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${
                    isPhoneDisabled || isMethodDisabled
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => switchOtpMethod("whatsapp")}
                  disabled={isPhoneDisabled || isMethodDisabled}
                >
                  <FaWhatsapp className="w-5 h-5" />
                  WhatsApp
                </button>
              </div>
            </div>

            <div className="relative w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {otpMethod === "whatsapp" ? "WhatsApp Number" : "Mobile Number"}{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <PhoneInput
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  defaultCountry="IN"
                  disabled={isPhoneDisabled}
                  international={otpMethod === "whatsapp"}
                  countrySelectProps={{ disabled: otpMethod === "mobile" }}
                  className="w-full p-3 bg-white shadow-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-800 placeholder-gray-400 [&>*]:outline-none [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:border-none PhoneInput"
                  maxLength={20}
                  placeholder="Enter your number"
                  style={
                    {
                      "--PhoneInputCountryFlag-borderColor": "transparent",
                    } as any
                  }
                />
                {otpMethod === "whatsapp" ? (
                  <FaWhatsapp className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                ) : (
                  <PhoneCall className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                )}
              </div>

              {error && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fadeIn">
                  <X className="w-4 h-4" />
                  {error}
                </p>
              )}
            </div>

            {/* OTP Input */}
            {showOtp && (
              <div
                className={`space-y-4 ${animateOtp ? "animate-fadeIn" : ""}`}
              >
                <label className="block text-sm font-medium text-gray-700">
                  Enter{" "}
                  {otpMethod === "whatsapp"
                    ? "4-digit WhatsApp"
                    : "6-digit SMS"}{" "}
                  OTP
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
                      className="w-12 h-12 text-center text-lg font-semibold bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800 shadow-sm"
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
                disabled={isLoading || (!showOtp && isGetOtpButtonDisabled)}
                className={`w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                  (!showOtp && isGetOtpButtonDisabled) || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {showOtp ? (
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

              {isButtonEnabled && !changeNumberClicked && (
                <button
                  type="button"
                  onClick={handleChangeNumber}
                  disabled={isLoading}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Change Number
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <p className="text-sm text-gray-600 text-center flex items-center justify-center gap-2">
            Not registered yet?{" "}
            <Link
              to="/whatsappregister"
              className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-1 group"
            >
              Register Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsappLogin;
