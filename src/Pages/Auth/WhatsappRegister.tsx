import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaWhatsapp, FaGoogle } from "react-icons/fa6";
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
  ArrowRight,
  RefreshCcw,
  AlertTriangle,
  Smartphone,
  ChevronRight,
} from "lucide-react";
import BASE_URL from "../../Config";

// Handle auth error
const handleAuthError = (err: any, navigate: any) => {
  if (err.response?.status === 401) {
    sessionStorage.setItem("redirectPath", window.location.pathname);
    sessionStorage.setItem("fromStudyAbroad", "true");
    navigate("/whatsappregister?primaryType=STUDENT");
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
  const [isRegistering, setIsRegistering] = useState(false);
  const [showEriceAlert, setShowEriceAlert] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [receiveNotifications, setReceiveNotifications] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [primaryType, setPrimaryType] = useState<"CUSTOMER" | "STUDENT">(
    "CUSTOMER"
  );
  const [showGoogleButton, setShowGoogleButton] = useState<boolean>(true);
  const queryParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(queryParams.entries());
  const userType = params.userType;
  const urlPrimaryType = params.primaryType;

  const savePreferences = () => {
    localStorage.setItem(
      "receiveNotifications",
      receiveNotifications.toString()
    );
    localStorage.setItem("agreeToTerms", agreeToTerms.toString());
  };

  const fetchUserDetails = async (accessToken: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/user-service/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUserDetails(response.data);
      localStorage.setItem("userId", response.data.userId || "");
      return response.data;
    } catch (err: any) {
      console.error("Error fetching user details:", err);
      if (err.response?.status === 401) {
        setError("Unauthorized: Invalid or missing access token.");
        handleAuthError(err, navigate);
      } else {
        setError("Failed to fetch user details. Please try again.");
      }
      return null;
    }
  };

  const handleGmailAuth = async () => {
    if (!receiveNotifications || !agreeToTerms) {
      setError("Please accept the terms and conditions to continue");
      return;
    }

    setIsGoogleLoading(true);
    setError("");

    try {
      sessionStorage.setItem("redirectPath", "/main/dashboard/home");
      sessionStorage.setItem("fromStudyAbroad", "true");
      sessionStorage.setItem("primaryType", primaryType);
      sessionStorage.setItem(
        "receiveNotifications",
        receiveNotifications.toString()
      );
      sessionStorage.setItem("agreeToTerms", agreeToTerms.toString());

      const state = btoa(
        JSON.stringify({ primaryType, from: "/main/dashboard/home" })
      );
      const oauthUrl = `http://ec2-65-0-147-157.ap-south-1.compute.amazonaws.com:9024/oauth2/authorize/google?redirect_uri=${encodeURIComponent(
        "https://www.askoxy.ai/whatsappregister"
      )}&state=${state}`;
      sessionStorage.setItem("pendingGoogleAuth", "true");
      window.location.href = oauthUrl;
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError("Failed to initialize Google authentication. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    const pendingGoogleAuth = sessionStorage.getItem("pendingGoogleAuth");

    if (userId && accessToken) {
      fetchUserDetails(accessToken).then((userData) => {
        if (userData && userData.userId) {
          // localStorage.setItem("userId", userData.userId); // Ensure userId is stored
          const redirectPath =
            sessionStorage.getItem("redirectPath") || "/main/dashboard/home";
          sessionStorage.removeItem("pendingGoogleAuth");
          sessionStorage.removeItem("redirectPath");
          navigate(redirectPath, { replace: true });
        }
      });
      return;
    }

    const queryParamsGoogle = new URLSearchParams(location.search);
    const accessTokenGoogle = queryParamsGoogle.get("token");

    if (
      pendingGoogleAuth &&
      accessTokenGoogle &&
      accessTokenGoogle !== "null"
    ) {
      localStorage.setItem("accessToken", accessTokenGoogle);
      localStorage.setItem(
        "primaryType",
        sessionStorage.getItem("primaryType") || "CUSTOMER"
      );
      localStorage.setItem(
        "receiveNotifications",
        sessionStorage.getItem("receiveNotifications") || "false"
      );
      localStorage.setItem(
        "agreeToTerms",
        sessionStorage.getItem("agreeToTerms") || "false"
      );

      fetchUserDetails(accessTokenGoogle).then((userData) => {
        if (userData && userData.userId) {
          // localStorage.setItem("userId", userData.userId); // Store userId
          const redirectPath =
            sessionStorage.getItem("redirectPath") || "/main/dashboard/home";
          sessionStorage.removeItem("pendingGoogleAuth");
          sessionStorage.removeItem("redirectPath");
          sessionStorage.removeItem("receiveNotifications");
          sessionStorage.removeItem("agreeToTerms");
          navigate(redirectPath, { replace: true });
        } else {
          setError("Failed to fetch user details after authentication.");
          sessionStorage.removeItem("pendingGoogleAuth");
        }
      });
    }

    const queryParams = new URLSearchParams(location.search);
    const refParam = queryParams.get("ref");
    if (refParam) {
      localStorage.setItem("refferrerId", refParam);
      console.log("Extracted userId:", refParam);
    }

    const urlPrimaryType = queryParams.get("primaryType");
    const fromStudyAbroad = sessionStorage.getItem("fromStudyAbroad");

    if (urlPrimaryType === "STUDENT" || fromStudyAbroad === "true") {
      setPrimaryType("STUDENT");
    } else {
      setPrimaryType("CUSTOMER");
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

  useEffect(() => {
    if (phoneNumber) {
      const phoneNumberS = parsePhoneNumber(phoneNumber);
      const countryCode = phoneNumberS?.countryCallingCode
        ? `+${phoneNumberS.countryCallingCode}`
        : "";
      setCountryCode(countryCode || "");
      setIsMethodDisabled(true);
    } else {
      setIsMethodDisabled(false);
    }
  }, [phoneNumber]);

  const handleClose = () => {
    setIsClosing(true);
    const entryPoint = localStorage.getItem("entryPoint") || "/";
    setTimeout(() => navigate(entryPoint), 300);
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

      if (otpMethod === "whatsapp" && index === 3 && sanitizedValue) {
        const isComplete = credentials.otp.every(
          (val, i) => i === index || Boolean(val)
        );
        if (isComplete) {
          const newOtp = [...credentials.otp];
          newOtp[index] = sanitizedValue;
          setCredentials((prev) => ({ ...prev, otp: newOtp }));
          setTimeout(
            () => document.getElementById("otpSubmitButton")?.click(),
            300
          );
        }
      } else if (otpMethod === "mobile" && index === 5 && sanitizedValue) {
        const isComplete = credentials.mobileOTP.every(
          (val, i) => i === index || Boolean(val)
        );
        if (isComplete) {
          const newMobileOtp = [...credentials.mobileOTP];
          newMobileOtp[index] = sanitizedValue;
          setCredentials((prev) => ({ ...prev, mobileOTP: newMobileOtp }));
          setTimeout(
            () => document.getElementById("otpSubmitButton")?.click(),
            300
          );
        }
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
      setCredentials((prev) => ({ ...prev, otp: newOtp }));
      if (pastedData.length === 4) {
        setTimeout(
          () => document.getElementById("otpSubmitButton")?.click(),
          300
        );
      }
    } else {
      const newMobileOtp = [...credentials.mobileOTP];
      pastedData.split("").forEach((char, index) => {
        if (index < 6) newMobileOtp[index] = char;
      });
      setCredentials((prev) => ({ ...prev, mobileOTP: newMobileOtp }));
      if (pastedData.length === 6) {
        setTimeout(
          () => document.getElementById("otpSubmitButton")?.click(),
          300
        );
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const currentOtp =
      otpMethod === "whatsapp" ? credentials.otp : credentials.mobileOTP;
    if (e.key === "Backspace" && !currentOtp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

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
    setShowEriceAlert(false);
    if (primaryType === "CUSTOMER") {
      setShowGoogleButton(false);
    }
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setError("Please enter a valid Phone number with country code");
      setIsLoading(false);
      return;
    }

    try {
      const requestBody: Record<string, any> = {
        registrationType: otpMethod,
        userType: "Register",
        primaryType: primaryType,
        countryCode: countryCode,
      };
      if (otpMethod === "whatsapp") {
        requestBody.whatsappNumber = phoneNumber.replace(countryCode, "");
      } else {
        requestBody.mobileNumber = phoneNumber.replace(countryCode, "");
      }
      if (reffererId) {
        requestBody.referrer_id = reffererId;
      }

      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${BASE_URL}/user-service/registerwithMobileAndWhatsappNumber`,
        requestBody,
        { headers: { Authorization: `Bearer ${accessToken || ""}` } }
      );

      if (response.data) {
        localStorage.setItem(
          "mobileOtpSession",
          response.data.mobileOtpSession
        );
        localStorage.setItem("salt", response.data.salt);
        localStorage.setItem("expiryTime", response.data.otpGeneratedTime);
        localStorage.setItem("userType", userType);
        localStorage.setItem("primaryType", primaryType);

        if (response.data.mobileOtpSession === null) {
          setShowSuccessPopup(false);
          setError("You are already registered with this number.");
          const loginUrl =
            primaryType === "STUDENT"
              ? "/whatsapplogin?primaryType=STUDENT"
              : "/whatsapplogin";
          setTimeout(() => navigate(loginUrl), 1000);
        } else {
          setIsButtonEnabled(true);
          setOtpShow(true);
          setShowSuccessPopup(true);
          setMessage(
            `OTP sent successfully to your ${
              otpMethod === "whatsapp" ? "WhatsApp" : "mobile"
            } number`
          );
          setResendDisabled(true);
          setisPhoneDisabled(true);
          setResendTimer(30);
          setTimeout(() => {
            setShowSuccessPopup(false);
            setMessage("");
          }, 4000);
        }
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError(
          "Unauthorized: Invalid or missing access token. Please log in again."
        );
        handleAuthError(err, navigate);
      } else if (err.response?.status === 409) {
        setShowSuccessPopup(false);
        setError("You are already registered with this number. Please log in.");
        const loginUrl =
          primaryType === "STUDENT"
            ? "/whatsapplogin?primaryType=STUDENT"
            : "/whatsapplogin";
        setTimeout(() => navigate(loginUrl), 1500);
      } else {
        setError(
          err.response?.data?.message ||
            "An error occurred. Please try again later."
        );
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
    setIsRegistering(true);

    if (!credentials) {
      setOtpError("Please enter the complete OTP");
      setIsLoading(false);
      setIsRegistering(false);
      return;
    }

    if (otpMethod === "whatsapp" && credentials.otp.join("").length !== 4) {
      setOtpError("Please enter the complete WhatsApp OTP");
      setIsLoading(false);
      setIsRegistering(false);
      return;
    } else if (
      otpMethod === "mobile" &&
      credentials.mobileOTP.join("").length !== 6
    ) {
      setOtpError("Please enter the complete Mobile OTP");
      setIsLoading(false);
      setIsRegistering(false);
      return;
    }

    try {
      const requestBody: Record<string, any> = {
        registrationType: otpMethod,
        userType: "Register",
        primaryType: primaryType,
        countryCode: countryCode,
      };
      if (otpMethod === "whatsapp") {
        requestBody.whatsappNumber = phoneNumber?.replace(countryCode, "");
        requestBody.whatsappOtpSession =
          localStorage.getItem("mobileOtpSession");
        requestBody.whatsappOtpValue = credentials.otp.join("");
        requestBody.salt = localStorage.getItem("salt");
        requestBody.expiryTime = localStorage.getItem("expiryTime");
        requestBody.registerdFrom = "WEB";
      } else {
        requestBody.mobileNumber = phoneNumber?.replace(countryCode, "");
        requestBody.mobileOtpSession = localStorage.getItem("mobileOtpSession");
        requestBody.mobileOtpValue = credentials.mobileOTP.join("");
        requestBody.expiryTime = localStorage.getItem("expiryTime");
        requestBody.salt = localStorage.getItem("salt");
        requestBody.registerdFrom = "WEB";
      }
      if (reffererId) {
        requestBody.referrer_id = reffererId;
      }

      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${BASE_URL}/user-service/registerwithMobileAndWhatsappNumber`,
        requestBody,
        { headers: { Authorization: `Bearer ${accessToken || ""}` } }
      );

      if (response.data && response.data.accessToken && response.data.userId) {
        setShowSuccessPopup(true);
        localStorage.setItem("userId", response.data.userId); // Store userId
        localStorage.setItem("accessToken", response.data.accessToken); // Fixed from access_widget
        localStorage.setItem("primaryType", primaryType);
        if (otpMethod === "whatsapp") {
          localStorage.setItem("whatsappNumber", phoneNumber || "");
        } else {
          localStorage.setItem("mobileNumber", requestBody.mobileNumber);
        }
        localStorage.removeItem("refferrerId");
        sessionStorage.removeItem("fromStudyAbroad");

        savePreferences();

        const userData = await fetchUserDetails(response.data.accessToken);
        if (userData && userData.userId) {
          localStorage.setItem("userId", userData.userId); // Ensure userId is stored
          setMessage("Registration Successful");
          setTimeout(() => {
            const redirectPath =
              sessionStorage.getItem("redirectPath") ||
              location.state?.from ||
              "/main/dashboard/home";
            sessionStorage.removeItem("redirectPath");
            navigate(redirectPath, { replace: true });
          }, 1000);
        } else {
          setOtpError("Failed to fetch user details after registration.");
          setIsRegistering(false);
        }
      } else {
        setOtpError("No access token or user ID received. Please try again.");
        setIsRegistering(false);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setOtpError(
          "Unauthorized: Invalid or missing access token. Please log in again."
        );
        handleAuthError(err, navigate);
      } else if (err.response?.status === 409) {
        setOtpError(
          "You are already registered with this number. Redirecting to login..."
        );
        const loginUrl =
          primaryType === "STUDENT"
            ? "/whatsapplogin?primaryType=STUDENT"
            : "/whatsapplogin";
        setTimeout(() => navigate(loginUrl), 1500);
      } else {
        setOtpError(err.response?.data?.message || "Invalid OTP");
      }
      setOtpSession(null);
      setIsRegistering(false);
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
          registrationType: otpMethod,
          userType: "Register",
          primaryType: primaryType,
          countryCode: countryCode,
        };
        if (otpMethod === "whatsapp") {
          requestBody.whatsappNumber = phoneNumber?.replace(countryCode, "");
        } else {
          requestBody.mobileNumber = phoneNumber?.replace(countryCode, "");
        }

        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post(
          `${BASE_URL}/user-service/registerwithMobileAndWhatsappNumber`,
          requestBody,
          { headers: { Authorization: `Bearer ${accessToken || ""}` } }
        );

        if (response.data) {
          if (
            response.data.message ===
            "User already registered with this Mobile Number, please log in."
          ) {
            setError(
              "You are already registered with this number. Redirecting to login..."
            );
            const loginUrl =
              primaryType === "STUDENT"
                ? "/whatsapplogin?primaryType=STUDENT"
                : "/whatsapplogin";
            setTimeout(() => navigate(loginUrl), 1000);
            return;
          }

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
        if (err.response?.status === 401) {
          setError(
            "Unauthorized: Invalid or missing access token. Please log in again."
          );
          handleAuthError(err, navigate);
        } else if (
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          setError(err.response.data.message);
        } else {
          setError("Failed to resend OTP. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isOtpButtonEnabled =
    phoneNumber &&
    isValidPhoneNumber(phoneNumber) &&
    receiveNotifications &&
    agreeToTerms;
  const isGmailButtonEnabled = receiveNotifications && agreeToTerms;

  const handleChangeNumber = () => {
    setOtpShow(false);
    setisPhoneDisabled(false);
    setOtpError("");
    setShowEriceAlert(true);
    if (primaryType === "CUSTOMER") {
      setShowGoogleButton(true);
    }
    setCredentials({
      otp: ["", "", "", ""],
      mobileOTP: ["", "", "", "", "", ""],
    });
  };

  const handleLoginRedirectClick = () => {
    const loginUrl =
      primaryType === "STUDENT"
        ? "/whatsapplogin?primaryType=STUDENT"
        : "/whatsapplogin";
    navigate(loginUrl);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-4">
      <div
        className={`max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
          isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="bg-purple-600 p-3 sm:p-4 lg:p-6 relative">
          <h2 className="text-2xl font-bold text-white text-center">
            {primaryType === "STUDENT"
              ? "Register to Study Abroad"
              : "Register to ASKOXY.AI"}
          </h2>
          <button
            onClick={handleClose}
            className="absolute right-2 sm:right-4 top-2 sm:top-4 p-1.5 sm:p-2 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5 sm:w-5 sm:h-5" />
          </button>
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleLoginRedirectClick}
                className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-purple-600 hover:shadow-md hover:scale-105 transition-all duration-200 active:bg-white active:text-purple-600 active:font-bold"
              >
                Login
              </button>
              <button
                onClick={() => {
                  const registerUrl =
                    primaryType === "STUDENT"
                      ? "/whatsappregister?primaryType=STUDENT"
                      : "/whatsappregister";
                  window.location.href = registerUrl;
                }}
                className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-purple-100 hover:shadow-md hover:scale-105 transition-all duration-200 active:bg-white active:text-purple-600 active:font-bold"
              >
                Register
              </button>
            </div>
          </div>
        </div>

        {showSuccessPopup && (
          <div className="mx-6 mt-6 animate-fadeIn">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <Send className="w-5 h-5" />
              {message}
            </div>
          </div>
        )}

        {error && (
          <div className="mx-6 mt-6 animate-fadeIn">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </div>
          </div>
        )}

        <div className="p-6">
          {!isRegistering ? (
            <>
              <form
                onSubmit={showOtp ? handleOtpSubmit : handleSubmit}
                className="space-y-6"
              >
                <div className="flex flex-col items-center gap-4 p-4  pb-6">
                  <div className="flex gap-4">
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
                      onClick={() => handleMethodChange("whatsapp")}
                      disabled={isPhoneDisabled || isMethodDisabled}
                    >
                      <FaWhatsapp className="w-5 h-5" />
                      WhatsApp
                    </button>
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
                      onClick={() => handleMethodChange("mobile")}
                      disabled={isPhoneDisabled || isMethodDisabled}
                    >
                      <Smartphone className="w-5 h-5" />
                      SMS
                    </button>
                  </div>
                </div>
                {otpMethod && (
                  <div className="relative w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        disabled={isPhoneDisabled}
                        international={otpMethod === "whatsapp"}
                        countrySelectProps={{
                          disabled: otpMethod === "mobile",
                        }}
                        className="w-full px-3 py-2 sm:p-2 bg-white shadow-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-800 placeholder-gray-400 text-sm sm:text-base min-h-[44px] sm:min-h-[48px] [&>*]:outline-none [&.PhoneInputInput]:outline-none [&.PhoneInputInput]:border-none [&.PhoneInputInput]:min-h-[40px] [&.PhoneInputInput]:py-0 PhoneInput"
                        maxLength={20}
                        placeholder="Enter your number"
                        style={
                          {
                            "--PhoneInputCountryFlag-borderColor":
                              "transparent",
                          } as any
                        }
                      />
                      {otpMethod === "whatsapp" ? (
                        <FaWhatsapp className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      ) : (
                        <PhoneCall className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                )}
                {showOtp && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">
                        Enter {otpMethod === "whatsapp" ? "4-digit" : "6-digit"}{" "}
                        OTP
                      </label>
                      <span className="text-xs text-gray-500">
                        {otpMethod === "whatsapp"
                          ? "Sent via WhatsApp"
                          : "Sent via SMS"}
                      </span>
                    </div>
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
                          onChange={(e) =>
                            handleOtpChange(e.target.value, index)
                          }
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onPaste={handlePaste}
                          className="w-12 h-12 text-center text-lg font-semibold border rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
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
                <div className="space-y-3">
                  <button
                    id="otpSubmitButton"
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
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="notifications"
                        checked={receiveNotifications}
                        onChange={(e) =>
                          setReceiveNotifications(e.target.checked)
                        }
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
                      />
                      <label
                        htmlFor="notifications"
                        className="ml-2 text-sm text-gray-700"
                      >
                        I want to receive notifications on SMS, RCS & Email from
                        ASKOXY.AI
                      </label>
                    </div>
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
                      />
                      <label
                        htmlFor="terms"
                        className="ml-2 text-sm text-gray-700"
                      >
                        I agree to all the{" "}
                        <Link
                          to="/termsandconditions"
                          className="text-blue-600 hover:underline"
                        >
                          Terms of Services
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacypolicy"
                          className="text-blue-600 hover:underline"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </label>
                    </div>
                  </div>
                  {isButtonEnabled && (
                    <button
                      type="button"
                      onClick={handleChangeNumber}
                      disabled={isLoading}
                      className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      Change Number
                    </button>
                  )}
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-lg font-medium text-gray-700">
                Registering your account...
              </p>
              <p className="text-sm text-gray-500">
                Please wait, this may take a moment
              </p>
            </div>
          )}
          {showGoogleButton && primaryType === "CUSTOMER" && (
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500 bg-white">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
          )}
          {!showOtp && (
            <div className="mb-6">
              {showGoogleButton && primaryType === "CUSTOMER" && (
                <button
                  type="button"
                  onClick={handleGmailAuth}
                  disabled={!isGmailButtonEnabled || isGoogleLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-3
    transition-all duration-200 ${
      !isGmailButtonEnabled || isGoogleLoading
        ? "bg-gray-100 text-gray-400  cursor-not-allowed"
        : "bg-white text-[#3c4043]  hover:bg-gray-50 active:bg-[#f1f3f4]"
    } `}
                  aria-label="Continue with Gmail"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#3c4043]" />
                  ) : (
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#4285F4"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.46 2.38 30.1 0 24 0 14.63 0 6.51 5.38 2.56 13.22l7.98 6.19C12.31 13.64 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#34A853"
                        d="M46.48 24.55c0-1.59-.14-3.11-.39-4.55H24v9.12h12.7c-.55 2.87-2.24 5.3-4.77 6.93l7.73 6c4.52-4.17 7.82-10.28 7.82-17.5z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.54 28.41c-.48-1.42-.76-2.92-.76-4.41s.27-2.99.76-4.41l-7.98-6.19C1.22 16.74 0 20.24 0 24c0 3.76 1.22 7.26 3.56 10.59l7.98-6.18z"
                      />
                      <path
                        fill="#EA4335"
                        d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.26 0-11.69-4.14-13.46-9.91l-7.98 6.18C6.51 42.62 14.63 48 24 48z"
                      />
                    </svg>
                  )}
                  <span>
                    {isGoogleLoading ? "Signing in..." : "Continue with Gmail"}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="border-t p-6 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Already registered?{" "}
            <button
              onClick={handleLoginRedirectClick}
              className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-1 group"
            >
              Login Now
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsappRegister;
