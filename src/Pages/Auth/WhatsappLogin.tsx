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

// Handle auth error utility function
const handleAuthError = (err: any, navigate: any) => {
  if (err.response?.status === 401) {
    sessionStorage.setItem("redirectPath", window.location.pathname);
    sessionStorage.setItem("fromStudyAbroad", "true");
    navigate("/whatsapplogin?primaryType=STUDENT");
    return true;
  }
  return false;
};

// Handle login redirect for non-authenticated users
const handleLoginRedirect = (navigate: any, redirectPath?: string) => {
  sessionStorage.setItem(
    "redirectPath",
    redirectPath || window.location.pathname
  );
  sessionStorage.setItem("fromStudyAbroad", "true");
  navigate("/whatsapplogin?primaryType=STUDENT");
};

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
  const [showEriceAlert, setShowEriceAlert] = useState(false);

  // Add state for user type
  const [primaryType, setPrimaryType] = useState<"CUSTOMER" | "STUDENT">(
    "CUSTOMER"
  );

  // Get query parameters
  const queryParams = new URLSearchParams(location.search);
  const userTypeFromQuery = queryParams.get("primaryType");

  // Determine primary type based on URL and set redirect paths
  useEffect(() => {
    console.log("Location:", location);
    console.log("Query params:", Object.fromEntries(queryParams.entries()));

    let detectedPrimaryType: "CUSTOMER" | "STUDENT" = "CUSTOMER";

    // Check query parameter first (highest priority)
    if (userTypeFromQuery === "STUDENT") {
      detectedPrimaryType = "STUDENT";
    }
    // Check if coming from studyabroad routes or session storage
    else if (
      queryParams.get("from") === "studyabroad" ||
      location.state?.from?.includes("/studyabroad") ||
      document.referrer.includes("/studyabroad") ||
      sessionStorage.getItem("primaryType") === "STUDENT" ||
      sessionStorage.getItem("fromStudyAbroad") === "true"
    ) {
      detectedPrimaryType = "STUDENT";
    }

    setPrimaryType(detectedPrimaryType);

    // Show Erice alert only for CUSTOMER users
    setShowEriceAlert(detectedPrimaryType === "CUSTOMER");

    // Store the primary type for future reference
    sessionStorage.setItem("primaryType", detectedPrimaryType);

    console.log("Primary Type set to:", detectedPrimaryType);
    console.log("Show Erice Alert:", detectedPrimaryType === "CUSTOMER");
  }, [location, userTypeFromQuery]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    if (userId && accessToken) {
      // Redirect based on user type
      const defaultPath =
        primaryType === "STUDENT"
          ? "/student-dashboard"
          : "/main/dashboard/home";

      navigate(location.state?.from || defaultPath, {
        replace: true,
      });
    }
  }, [navigate, location, primaryType]);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;

    if (/android/i.test(userAgent)) {
      window.location.href = "https://play.google.com/store/apps/details?id=com.askoxy.customer";
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !('MSStream' in window)) {
      window.location.href = "https://apps.apple.com/app/askoxy-ai/id123456789";
    }
  }, []);

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
    // Determine redirect path based on user type
    const defaultPath = primaryType === "STUDENT" ? "/studyabroad" : "/";
    const entryPoint = localStorage.getItem("entryPoint") || defaultPath;
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

    // Hide Erice alert when Get OTP is clicked (only for customers)
    if (primaryType === "CUSTOMER") {
      setShowEriceAlert(false);
    }

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
        primaryType: primaryType, // Add primary type to request
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
        localStorage.setItem("primaryType", primaryType); // Store primary type

        if (
          response.data.userId === null &&
          response.data.userId === undefined &&
          response.data.mobileOtpSession === null &&
          response.data.mobileOtpSession === undefined
        ) {
          setShowSuccessPopup(true);
          setMessage("This number is not registered. Please register now.");
          // Redirect to appropriate register page based on user type
          const registerPath =
            primaryType === "STUDENT"
              ? "/whatsappregister?primaryType=STUDENT"
              : "/whatsappregister";
          setTimeout(() => navigate(registerPath), 1000);
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
          }, 4000);
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
        primaryType: primaryType, // Add primary type to request
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
        localStorage.setItem("primaryType", primaryType); // Store primary type

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
        // Clear session storage after successful login
        sessionStorage.removeItem("fromStudyAbroad");
        sessionStorage.removeItem("primaryType");
        setMessage("Login Successful");

        setTimeout(() => {
          const redirectPath = sessionStorage.getItem("redirectPath");
          const defaultPath =
            primaryType === "STUDENT"
              ? "/student-dashboard"
              : "/main/dashboard/home";

          if (redirectPath) {
            navigate(redirectPath);
            sessionStorage.removeItem("redirectPath");
          } else {
            navigate(location.state?.from || defaultPath);
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
          primaryType: primaryType, // Add primary type to request
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
          }, 3000);
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

    // Show Erice alert again when changing number (only for customers)
    if (primaryType === "CUSTOMER") {
      setShowEriceAlert(true);
    }

    // Reset OTP fields
    setCredentials({
      otp: ["", "", "", ""],
      mobileOTP: ["", "", "", "", "", ""],
    });
  };
  const handleRegisterRedirectClick = () => {
    const loginUrl =
      primaryType === "STUDENT"
        ? "/whatsappregister?primaryType=STUDENT"
        : "/whatsappregister";
    navigate(loginUrl);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-4 row">
      <div
        className={`max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
          isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
<div className="bg-purple-600 p-4 sm:p-6 lg:p-8 relative rounded-lg shadow-lg mx-4 sm:mx-0 max-w-md sm:max-w-lg w-full">
       {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white touch-manipulation z-10"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      
      {/* Content Section */}
      <div className="flex flex-col items-center gap-4 sm:gap-6 text-center pr-8 sm:pr-0">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
          {primaryType === "STUDENT"
            ? "Welcome to Study Abroad"
            : "Welcome to ASKOXY.AI"}
        </h2>
        
        {/* Button Row - Always horizontal */}
        <div className="flex flex-row gap-2 sm:gap-3 justify-center w-full">
          <button
            onClick={() => {
              const loginPath =
                primaryType === "STUDENT"
                  ? "/whatsapplogin?primaryType=STUDENT"
                  : "/whatsapplogin";
              console.log("Redirect to:", loginPath);
              // window.location.href = loginPath;
            }}
            className="bg-white text-purple-600 px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-medium hover:bg-purple-100 hover:shadow-md hover:scale-105 transition-all duration-200 active:bg-white active:text-purple-600 active:font-bold flex-1 sm:flex-none sm:min-w-[100px] text-sm sm:text-base"
          >
            Login
          </button>
          <button
            onClick={handleRegisterRedirectClick}
            className="bg-transparent border-2 border-white text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-medium hover:bg-white hover:text-purple-600 hover:shadow-md hover:scale-105 transition-all duration-200 active:bg-white active:text-purple-600 active:font-bold flex-1 sm:flex-none sm:min-w-[100px] text-sm sm:text-base"
          >
            Register
          </button>
        </div>
      </div>
    </div>

{showEriceAlert && primaryType === "CUSTOMER" && (
  <div className="mx-2 xs:mx-3 sm:mx-4 mt-2">
    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-2 xs:px-3 sm:px-4 py-2 sm:py-3 rounded-lg relative">
      <div className="flex items-start gap-2 sm:pr-16">
        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          {!showEnglish ? (
            <>
              <p className="font-bold text-xs sm:text-sm">ERICE కస్టమర్లకు గమనిక</p>
              <p className="text-xs mt-1 leading-relaxed break-words">
                మీ డేటా మైగ్రేట్ చేయబడింది. SMS ఎంపికను ఉపయోగించి లాగిన్
                అవ్వండి. మీ మొబైల్ మరియు WhatsApp నంబర్లు ఒకటే అయితే, మీరు
                WhatsApp ద్వారా కూడా లాగిన్ అవ్వవచ్చు
              </p>
            </>
          ) : (
            <>
              <p className="font-bold text-xs sm:text-sm">Attention Erice Customers</p>
              <p className="text-xs mt-1 leading-relaxed break-words">
                Your data has been migrated. Log in using the SMS option.
                If your mobile and WhatsApp numbers are the same, you can
                also log in via WhatsApp.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Language Toggle Button */}
      <div className="mt-2 flex justify-end sm:mt-0 sm:absolute sm:right-3 sm:top-3">
        <button
          onClick={() => setShowEnglish(!showEnglish)}
          className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded transition-colors whitespace-nowrap min-h-[28px] touch-manipulation z-10"
        >
          {showEnglish ? "తెలుగు" : "English"}
        </button>
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
            <div className="flex flex-col items-center gap-4 p-2 border-b border-gray-100 pb-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
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
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                {otpMethod === "whatsapp" ? "WhatsApp Number" : "Mobile Number"}{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <PhoneInput
                  value={phoneNumber || "+91"}
                  onChange={handlePhoneChange}
                  initialValueFormat="national"
                  addInternationalOption={false}
                  defaultCountry="IN"
                  disabled={isPhoneDisabled}
                  international={otpMethod === "whatsapp"}
                  countrySelectProps={{ disabled: otpMethod === "mobile" }}
                  className="w-full px-3 py-2 sm:p-2 bg-white shadow-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-800 placeholder-gray-400 text-sm sm:text-base min-h-[44px] sm:min-h-[48px] [&>*]:outline-none [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:min-h-[40px] [&_.PhoneInputInput]:py-0 PhoneInput"
                  maxLength={20}
                  placeholder="Enter your number"
                  style={
                    {
                      "--PhoneInputCountryFlag-borderColor": "transparent",
                    } as any
                  }
                />
                {otpMethod === "whatsapp" ? (
                  <FaWhatsapp className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                ) : (
                  <PhoneCall className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                )}
              </div>

              {error && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fadeIn">
                  <X className="w-4 h-4" />
                  {error}
                </p>
              )}
            </div>

            {/* Get OTP Button */}
            {!showOtp && (
              <button
                type="submit"
                disabled={isGetOtpButtonDisabled || isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                  isGetOtpButtonDisabled || isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : otpMethod === "whatsapp"
                    ? "bg-green-500 hover:bg-green-600 active:bg-green-700"
                    : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
                } transform hover:scale-105 active:scale-95`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Get OTP via {otpMethod === "whatsapp" ? "WhatsApp" : "SMS"}
                  </>
                )}
              </button>
            )}

            {/* OTP Verification Section */}
            {showOtp && (
              <div
                className={`space-y-4 transition-all duration-500 ${
                  animateOtp ? "animate-slideInUp" : ""
                }`}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {otpMethod === "whatsapp" ? (
                      <MessageCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Smartphone className="w-5 h-5 text-purple-500" />
                    )}
                    <span className="text-sm text-gray-600">
                      OTP sent to your{" "}
                      {otpMethod === "whatsapp" ? "WhatsApp" : "mobile"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter {otpMethod === "whatsapp" ? "4" : "6"}-digit OTP{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="flex gap-2 justify-center">
                    {(otpMethod === "whatsapp"
                      ? credentials.otp
                      : credentials.mobileOTP
                    ).map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          if (el) otpRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                        disabled={isLoading}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <p className="text-red-500 text-sm text-center flex items-center justify-center gap-1 animate-fadeIn">
                      <X className="w-4 h-4" />
                      {otpError}
                    </p>
                  )}
                </div>

                {/* Verify OTP Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
                  } transform hover:scale-105 active:scale-95`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      Verify OTP
                    </>
                  )}
                </button>

                {/* Resend OTP */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendDisabled || isLoading}
                    className={`text-sm font-medium transition-colors ${
                      resendDisabled || isLoading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-purple-600 hover:text-purple-700"
                    }`}
                  >
                    {resendDisabled ? (
                      <>
                        <RefreshCcw className="w-4 h-4 inline mr-1" />
                        Resend OTP in {resendTimer}s
                      </>
                    ) : (
                      <>
                        <RefreshCcw className="w-4 h-4 inline mr-1" />
                        Resend OTP
                      </>
                    )}
                  </button>
                </div>

                {/* Change Number */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleChangeNumber}
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Change Number
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={handleRegisterRedirectClick}
                className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-1 group"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsappLogin;
