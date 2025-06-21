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
  const [isPhoneDisabled, setIsPhoneDisabled] = useState(false);
  const [animateOtp, setAnimateOtp] = useState(false);
  const [isMethodDisabled, setIsMethodDisabled] = useState(false);
  const [changeNumberClicked, setChangeNumberClicked] = useState(false);
  const [isGetOtpButtonDisabled, setIsGetOtpButtonDisabled] = useState(true);
  const [showUserMessage, setShowUserMessage] = useState(true);
  const [showEriceAlert, setShowEriceAlert] = useState(false);
  const [primaryType, setPrimaryType] = useState<string>("CUSTOMER");

  // Determine primary type based on URL parameters and routes
  const determinePrimaryType = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const queryPrimaryType = queryParams.get("primaryType");
    const currentPath = window.location.pathname;
    const referrer = document.referrer;
    
    // Priority 1: URL parameter
    if (queryPrimaryType === "STUDENT") {
      return "STUDENT";
    }
    
    // Priority 2: Check various study abroad indicators
    const studyAbroadIndicators = [
      currentPath.includes("/studyabroad"),
      referrer.includes("/studyabroad"),
      location.state?.from?.includes("/studyabroad"),
      location.pathname.includes("/studyabroad"),
      sessionStorage.getItem("fromStudyAbroad") === "true",
      localStorage.getItem("entryPoint")?.includes("/studyabroad")
    ];
    
    if (studyAbroadIndicators.some(indicator => indicator)) {
      return "STUDENT";
    }
    
    // Priority 3: Check stored primaryType
    const storedPrimaryType = localStorage.getItem("primaryType");
    if (storedPrimaryType === "STUDENT") {
      return "STUDENT";
    }
    
    // Default to CUSTOMER
    return "CUSTOMER";
  };

  // Initialize primary type and related settings
  useEffect(() => {
    const determinedType = determinePrimaryType();
    setPrimaryType(determinedType);
    
    if (determinedType === "STUDENT") {
      setShowEriceAlert(false);
      sessionStorage.setItem("fromStudyAbroad", "true");
      localStorage.setItem("primaryType", "STUDENT");
      // Set entry point for students if not already set
      if (!localStorage.getItem("entryPoint")) {
        localStorage.setItem("entryPoint", "/studyabroad");
      }
    } else {
      setShowEriceAlert(true);
      localStorage.setItem("primaryType", "CUSTOMER");
      sessionStorage.removeItem("fromStudyAbroad");
    }
  }, [location]);

  // Check if user is already logged in and redirect accordingly
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    
    if (userId && accessToken) {
      const storedPrimaryType = localStorage.getItem("primaryType");
      
      if (storedPrimaryType === "STUDENT" || primaryType === "STUDENT") {
        navigate("/student-home", { replace: true });
      } else {
        navigate(location.state?.from || "/main/dashboard/home", { replace: true });
      }
    }
  }, [navigate, location, primaryType]);

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

  useEffect(() => {
    if (phoneNumber && isValidPhoneNumber(phoneNumber)) {
      setIsGetOtpButtonDisabled(false);
    } else {
      setIsGetOtpButtonDisabled(true);
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (phoneNumber) {
      const phoneNumberObj = parsePhoneNumber(phoneNumber);
      const countryCode = phoneNumberObj?.countryCallingCode
        ? `+${phoneNumberObj.countryCallingCode}`
        : "";
      setCountryCode(countryCode);
      setIsMethodDisabled(true);
    } else {
      setIsMethodDisabled(false);
    }
  }, [phoneNumber]);

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
    let redirectUrl = "/";
    
    // Determine redirect URL based on user type
    if (primaryType === "STUDENT") {
      redirectUrl = "/studyabroad";
    } else {
      redirectUrl = localStorage.getItem("entryPoint") || "/";
    }
    
    setTimeout(() => {
      navigate(redirectUrl);
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

  const extractPhoneWithoutCode = (phone: string) => {
    if (!phone) return "";
    const phoneNumberObj = parsePhoneNumber(phone);
    if (phoneNumberObj && phoneNumberObj.nationalNumber) {
      return phoneNumberObj.nationalNumber;
    }
    const parts = phone.split(" ");
    return parts.length > 1 ? parts.slice(1).join("") : phone;
  };

  const getNavigationUrls = () => {
    const baseUrl = primaryType === "STUDENT" ? "?primaryType=STUDENT" : "";
    return {
      login: `/whatsapplogin${baseUrl}`,
      register: `/whatsappregister${baseUrl}`
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);
    
    // Hide Erice alert when form is submitted for customers
    if (primaryType === "CUSTOMER") {
      setShowEriceAlert(false);
    }

    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setError("Please enter a valid number with country code");
      setIsLoading(false);
      return;
    }

    try {
      const phoneWithoutCode = extractPhoneWithoutCode(phoneNumber);

      const requestBody: Record<string, any> = {
        registrationType: otpMethod,
        userType: "Login",
        countryCode,
        primaryType: primaryType,
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
      
      setIsButtonEnabled(true);
      
      if (response.data) {
        localStorage.setItem("mobileOtpSession", response.data.mobileOtpSession);
        localStorage.setItem("salt", response.data.salt);
        localStorage.setItem("expiryTime", response.data.otpGeneratedTime);
        localStorage.setItem("primaryType", primaryType); // Ensure primaryType is stored

        if (
          response.data.userId === null &&
          response.data.mobileOtpSession === null
        ) {
          setShowSuccessPopup(true);
          setMessage("This number is not registered. Please register now.");
          setTimeout(() => {
            const urls = getNavigationUrls();
            navigate(urls.register);
          }, 1000);
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
          setChangeNumberClicked(false);
          setTimeout(() => {
            setShowSuccessPopup(false);
            setMessage("");
          }, 4000);
        }
      }
    } catch (err: any) {
      if (err.response?.data?.message === "User already registered with this Mobile Number, please log in.") {
        setError("You are already registered with this number. Please log in.");
        setTimeout(() => {
          const urls = getNavigationUrls();
          navigate(urls.login);
        }, 1500);
      } else {
        setError(err.response?.data?.message || "An error occurred. Please try again later.");
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
      const phoneWithoutCode = extractPhoneWithoutCode(phoneNumber || "");

      const requestBody: Record<string, any> = {
        registrationType: otpMethod,
        userType: "Login",
        countryCode,
        primaryType: primaryType,
      };

      if (otpMethod === "whatsapp") {
        requestBody.whatsappNumber = phoneWithoutCode;
        requestBody.whatsappOtpSession = localStorage.getItem("mobileOtpSession");
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
        localStorage.setItem("primaryType", primaryType); // Ensure primaryType is consistently stored
        
        if (otpMethod === "whatsapp") {
          localStorage.setItem("whatsappNumber", phoneWithoutCode);
        } else {
          localStorage.setItem("mobileNumber", phoneWithoutCode.replace(countryCode, ""));
        }
        
        localStorage.removeItem("mobileOtpSession");
        localStorage.removeItem("salt");
        localStorage.removeItem("expiryTime");
        setMessage("Login Successful");

        setTimeout(() => {
          const redirectPath = sessionStorage.getItem("redirectPath");
          
          if (redirectPath) {
            navigate(redirectPath);
            sessionStorage.removeItem("redirectPath");
          } else {
            if (primaryType === "STUDENT") {
              navigate("/student-home");
            } else {
              navigate(location.state?.from || "/main/dashboard/home");
            }
          }
          // Clear study abroad session flag after successful login
          sessionStorage.removeItem("fromStudyAbroad");
        }, 500);
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err: any) {
      setOtpError(err.response?.data?.message || "An error occurred. Please try again later.");
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
        const phoneWithoutCode = extractPhoneWithoutCode(phoneNumber || "");

        const requestBody: Record<string, any> = {
          registrationType: otpMethod,
          userType: "Login",
          countryCode,
          primaryType: primaryType,
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
          localStorage.setItem("mobileOtpSession", response.data.mobileOtpSession);
          localStorage.setItem("salt", response.data.salt);
          localStorage.setItem("expiryTime", response.data.otpGeneratedTime);
          localStorage.setItem("primaryType", primaryType); // Maintain primaryType consistency

          setShowSuccessPopup(true);
          setMessage(`OTP resent successfully to your ${otpMethod === "whatsapp" ? "WhatsApp" : "mobile"} number`);
          
          setCredentials((prev) => ({
            otp: otpMethod === "whatsapp" ? ["", "", "", ""] : prev.otp,
            mobileOTP: otpMethod === "mobile" ? ["", "", "", "", "", ""] : prev.mobileOTP,
          }));
          
          setTimeout(() => {
            setShowSuccessPopup(false);
            setMessage("");
          }, 3000);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "An error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setPhoneNumber(value);
    if (error) {
      setError("");
    }
  };

  const switchOtpMethod = (method: "whatsapp" | "mobile") => {
    if (!isPhoneDisabled && !isMethodDisabled) {
      setOtpMethod(method);
      setError("");
      setOtpError("");
    }
  };

  const handleChangeNumber = () => {
    setOtpShow(false);
    setIsPhoneDisabled(false);
    setIsButtonEnabled(false);
    setPhoneNumber(undefined);
    setError("");
    setOtpError("");
    setIsMethodDisabled(false);
    setChangeNumberClicked(true);
    setIsGetOtpButtonDisabled(true);
    
    // Show Erice alert again for customers when changing number
    if (primaryType === "CUSTOMER") {
      setShowEriceAlert(true);
    }

    setCredentials({
      otp: ["", "", "", ""],
      mobileOTP: ["", "", "", "", "", ""],
    });
  };

  const urls = getNavigationUrls();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 row">
      <div
        className={`max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
          isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {/* Header */}
        <div className="bg-purple-600 p-4 sm:p-4 lg:p-6 relative">
          <button
            onClick={handleClose}
            className="absolute right-2 sm:right-4 top-2 sm:top-4 p-1.5 sm:p-2 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5 sm:w-5 sm:h-5" />
          </button>
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-2xl font-bold text-white text-center">
              {primaryType === "STUDENT" ? "Welcome to Study Abroad Portal" : "Welcome to Askoxy.AI"}
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => (window.location.href = urls.login)}
                className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-purple-100 hover:shadow-md hover:scale-105 transition-all duration-200 active:bg-white active:text-purple-600 active:font-bold"
              >
                Login
              </button>
              <button
                onClick={() => (window.location.href = urls.register)}
                className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-purple-600 hover:shadow-md hover:scale-105 transition-all duration-200 active:bg-white active:text-purple-600 active:font-bold"
              >
                Register
              </button>
            </div>
          </div>
        </div>

        {/* Erice Customer Alert - Only shown for CUSTOMER type users */}
        {showEriceAlert && primaryType === "CUSTOMER" && !showOtp && (
          <div className="mx-4 mt-2">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-start gap-2 relative">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                {showEnglish ? (
                  <>
                    <p className="font-bold">ERICE కస్టమర్లకు గమనిక</p>
                    <p className="text-xs">
                      మీ డేటా మైగ్రేట్ చేయబడింది. SMS ఎంపికను ఉపయోగించి లాగిన్
                      అవ్వండి. మీ మొబైల్ మరియు WhatsApp నంబర్లు ఒకటే అయితే, మీరు
                      WhatsApp ద్వారా కూడా లాగిన్ అవ్వవచ్చు
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
                <button
                  onClick={() => setShowEnglish(!showEnglish)}
                  className="absolute bottom-2 right-2 px-2 py-1 text-xs bg-amber-50 text-amber-800 rounded"
                >
                  {showEnglish ? "Switch to English" : "Switch to Telugu"}
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
                  className={`flex items-center gap-2 px-4 rounded-lg transition-all ${
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

            {/* OTP Input */}
            {showOtp && (
              <div className={`space-y-4 ${animateOtp ? "animate-fadeIn" : ""}`}>
               <label className="block text-sm font-medium text-gray-700">
                  Enter {otpMethod === "whatsapp" ? "4-digit" : "6-digit"} OTP
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex justify-center gap-2">
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
                    className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg font-semibold bg-white transition-all"
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fadeIn">
                    <X className="w-4 h-4" />
                    {otpError}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendDisabled}
                    className={`text-sm font-medium flex items-center gap-2 ${
                      resendDisabled
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-purple-600 hover:text-purple-700"
                    } transition-colors`}
                  >
                    <RefreshCcw
                      className={`w-4 h-4 ${resendDisabled ? "animate-spin" : ""}`}
                    />
                    {resendDisabled ? `Resend in ${resendTimer}s` : "Resend OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={handleChangeNumber}
                    className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1"
                  >
                    Change Number
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                isLoading ||
                (!showOtp && isGetOtpButtonDisabled) ||
                (showOtp &&
                  (otpMethod === "whatsapp"
                    ? credentials.otp.join("").length !== 4
                    : credentials.mobileOTP.join("").length !== 6))
              }
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                isLoading ||
                (!showOtp && isGetOtpButtonDisabled) ||
                (showOtp &&
                  (otpMethod === "whatsapp"
                    ? credentials.otp.join("").length !== 4
                    : credentials.mobileOTP.join("").length !== 6))
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : showOtp ? (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Verify & Login
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Get OTP
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <span>Don't have an account?</span>
              <Link
                to={urls.register}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors flex items-center gap-1"
              >
                Register here
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsappLogin;