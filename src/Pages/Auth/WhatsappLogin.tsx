import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaGoogle } from "react-icons/fa6";
import axios, { AxiosError } from "axios";
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  X,
  Send,
  PhoneCall,
  Loader2,
  MessageCircle,
  RefreshCcw,
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import BASE_URL from "../../Config";

// Interfaces for TypeScript
interface Credentials {
  otp: string[];
  mobileOTP: string[];
}

interface UserResponse {
  userId: string | null;
  accessToken?: string;
  mobileOtpSession?: string;
  salt?: string;
  otpGeneratedTime?: string;
  message?: string;
}

interface ErrorResponse {
  message?: string;
}

const handleAuthError = (
  err: AxiosError<ErrorResponse>,
  navigate: (path: string) => void
): boolean => {
  if (err.response?.status === 401) {
    const existing = sessionStorage.getItem("redirectPath");

    // ✅ Never store auth pages as redirect target
    const current = window.location.pathname + window.location.search;
    const isAuthPage =
      current.includes("whatsapplogin") || current.includes("whatsappregister");

    // ✅ Only write redirectPath if missing AND current is not an auth page
    if ((!existing || existing.trim() === "") && !isAuthPage) {
      sessionStorage.setItem("redirectPath", current);
    }

    const primaryType = localStorage.getItem("primaryType") || "CUSTOMER";
    const targetPath = "/whatsappregister";
    navigate(`${targetPath}?primaryType=${primaryType}`);
    return true;
  }
  return false;
};

// ✅ FIXED: Updated handleLoginRedirect to preserve flags
const handleLoginRedirect = (
  navigate: (path: string) => void,
  redirectPath?: string
) => {
  if (!sessionStorage.getItem("redirectPath")) {
    sessionStorage.setItem(
      "redirectPath",
      redirectPath || window.location.pathname
    );
  }
  if (!sessionStorage.getItem("fromAISTore")) {
    sessionStorage.setItem("fromAISTore", "true");
  }
  // UPDATED: Handle primaryType for AGENT similar to STUDENT
  const primaryType = localStorage.getItem("primaryType") || "CUSTOMER";
  sessionStorage.setItem("fromStudyAbroad", "true");
  navigate(`/whatsapplogin?primaryType=${primaryType}`);
};
const WhatsappLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isGmailButtonEnabled, setIsGmailButtonEnabled] =
    useState<boolean>(true);
  const [credentials, setCredentials] = useState<Credentials>({
    otp: ["", "", "", ""],
    mobileOTP: ["", "", "", "", "", ""],
  });
  const [userDetails, setUserDetails] = useState<any>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const autoSubmitRef = useRef(false);

  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [otpMethod, setOtpMethod] = useState<"mobile" | "whatsapp">("whatsapp");
  const [showEnglish, setShowEnglish] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("91"); // Default to India
  const [otpError, setOtpError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showOtp, setOtpShow] = useState<boolean>(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [isPhoneDisabled, setIsPhoneDisabled] = useState<boolean>(false);
  const [animateOtp, setAnimateOtp] = useState<boolean>(false);
  const [isMethodDisabled, setIsMethodDisabled] = useState<boolean>(false);
  const [changeNumberClicked, setChangeNumberClicked] =
    useState<boolean>(false);
  const [isGetOtpButtonDisabled, setIsGetOtpButtonDisabled] =
    useState<boolean>(true);
  const [showEriceAlert, setShowEriceAlert] = useState<boolean>(false);
  const [primaryType, setPrimaryType] = useState<
    "CUSTOMER" | "STUDENT" | "AGENT"
  >("CUSTOMER");
  const [showGoogleButton, setShowGoogleButton] = useState<boolean>(true);

  // Check if OTP is complete
  const isOtpComplete =
    otpMethod === "whatsapp"
      ? credentials.otp.every((digit) => digit !== "")
      : credentials.mobileOTP.every((digit) => digit !== "");
  useEffect(() => {
    if (!showOtp) return;
    if (!isOtpComplete) return;
    if (isLoading) return;
    if (autoSubmitRef.current) return;

    autoSubmitRef.current = true;

    // small delay for better UX
    setTimeout(() => {
      handleOtpSubmit({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>);
    }, 300);
  }, [isOtpComplete, showOtp]);

  // Retrieve variables from localStorage and sessionStorage
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const pendingGoogleAuth = sessionStorage.getItem("pendingGoogleAuth");

  // OAuth URL for Gmail authentication
  const state = encodeURIComponent(JSON.stringify({ primaryType }));
  const oauthUrl = `http://ec2-65-0-147-157.ap-south-1.compute.amazonaws.com:9024/oauth2/authorize/google?redirect_uri="https://www.askoxy.ai/whatsapplogin"`;

  // Fetch user details
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

  // Handle Google OAuth callback
  useEffect(() => {
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
          // localStorage.setItem("userId", userData.userId); // Store userId (commented as per snippet)
          console.log("redirectPath", sessionStorage.getItem("redirectPath"));
          const redirectPath =
            sessionStorage.getItem("redirectPath") || "/main/dashboard/home";
          sessionStorage.removeItem("pendingGoogleAuth");
          // sessionStorage.removeItem("redirectPath");
          sessionStorage.removeItem("receiveNotifications");
          sessionStorage.removeItem("agreeToTerms");
          setShowSuccessPopup(true);
          setMessage("Login Successful");
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 1000);
        } else {
          setError("Failed to fetch user details after authentication.");
          sessionStorage.removeItem("pendingGoogleAuth");
        }
      });
    }
  }, [location, navigate]);

  // Check for existing authentication
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    // UPDATED: Include AGENT in detectedPrimaryType type
    let detectedPrimaryType: "CUSTOMER" | "STUDENT" | "AGENT" = "CUSTOMER";

    // UPDATED: Handle primaryType for AGENT similar to STUDENT
    const urlPrimaryType = queryParams.get("primaryType");
    if (urlPrimaryType === "STUDENT" || urlPrimaryType === "AGENT") {
      detectedPrimaryType = urlPrimaryType as "STUDENT" | "AGENT";
    } else if (
      queryParams.get("from") === "studyabroad" ||
      location.state?.from?.includes("/studyabroad") ||
      document.referrer.includes("/studyabroad") ||
      sessionStorage.getItem("primaryType") === "STUDENT" ||
      sessionStorage.getItem("fromStudyAbroad") === "true"
    ) {
      detectedPrimaryType = "STUDENT";
    } else if (
      queryParams.get("from") === "bharath-aistore" ||
      location.state?.from?.includes("/bharath-aistore") ||
      document.referrer.includes("/bharath-aistore") ||
      sessionStorage.getItem("primaryType") === "AGENT" ||
      // ✅ FIXED: Detect fromAISTore flag for AGENT primaryType
      sessionStorage.getItem("fromAISTore") === "true"
    ) {
      detectedPrimaryType = "AGENT";
    }

    setPrimaryType(detectedPrimaryType);
    // UPDATED: Handle showEriceAlert for AGENT similar to STUDENT
    setShowEriceAlert(detectedPrimaryType === "CUSTOMER");
    // UPDATED: Handle showGoogleButton for AGENT similar to STUDENT
    setShowGoogleButton(detectedPrimaryType === "CUSTOMER");
    sessionStorage.setItem("primaryType", detectedPrimaryType);
  }, [location]);

  // Redirect to mobile app stores
  //  useEffect(() => {
  //    const userAgent = navigator.userAgent || navigator.vendor;

  //    if (/android/i.test(userAgent)) {
  //      window.location.href =
  //        "https://play.google.com/store/apps/details?id=com.oxyrice.oxyrice_customer";
  //    } else if (/iPad|iPhone|iPod/.test(userAgent) && !("MSStream" in window)) {
  //      window.location.href =
  //        "https://apps.apple.com/in/app/askoxy-ai-ai-z-marketplace/id6738732000";
  //    }
  //  }, []);

  // Resend OTP timer
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

  // Validate phone number
  useEffect(() => {
    if (phoneNumber && isValidPhoneNumber(phoneNumber)) {
      setIsGetOtpButtonDisabled(false);
    } else {
      setIsGetOtpButtonDisabled(true);
    }
  }, [phoneNumber]);

  // Extract country code
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

  // Set SMS as default for Erice users
  // Set SMS as default for Erice users
  useEffect(() => {
    if (
      window.location.search.includes("erice") ||
      window.location.pathname.includes("erice")
    ) {
      setOtpMethod("mobile");
    }
  }, []);

  const handleGmailAuth = () => {
    setIsGoogleLoading(true);
    setError("");
    try {
      sessionStorage.setItem("pendingGoogleAuth", "true");
      window.location.href = oauthUrl;
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError("Failed to initialize Google authentication. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    // UPDATED: Handle defaultPath for AGENT similar to STUDENT
    const defaultPath =
      primaryType === "AGENT"
        ? "/bharath-aistore"
        : primaryType === "STUDENT"
        ? "/studyabroad"
        : "/";
    // ✅ FIXED: Prefer stored redirectPath if available
    const entryPoint =
      sessionStorage.getItem("redirectPath") ||
      localStorage.getItem("entryPoint") ||
      defaultPath;
    console.log("Navigating to:", entryPoint, "PrimaryType:", primaryType); // Debug log
    setTimeout(() => navigate(entryPoint), 300);
  };

  const handleOtpChange = (value: string, index: number) => {
    autoSubmitRef.current = false;

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

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    autoSubmitRef.current = false;

    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, otpMethod === "whatsapp" ? 4 : 6);

    if (otpMethod === "whatsapp") {
      const newOtp = Array(4).fill("");
      pastedData.split("").forEach((char, index) => {
        if (index < 4) newOtp[index] = char;
      });
      setCredentials((prev) => ({ ...prev, otp: newOtp }));
    } else {
      const newMobileOtp = Array(6).fill("");
      pastedData.split("").forEach((char, index) => {
        if (index < 6) newMobileOtp[index] = char;
      });
      setCredentials((prev) => ({ ...prev, mobileOTP: newMobileOtp }));
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

  const extractPhoneWithoutCode = (phone: string | undefined): string => {
    if (!phone) return "";
    const phoneNumberObj = parsePhoneNumber(phone);
    if (phoneNumberObj && phoneNumberObj.nationalNumber) {
      return phoneNumberObj.nationalNumber;
    }
    const parts = phone.split(" ");
    return parts.length > 1 ? parts.slice(1).join("") : phone;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (primaryType === "CUSTOMER") {
      setShowEriceAlert(false);
      setShowGoogleButton(false);
    }

    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setError("Please enter a valid number with country code");
      setIsLoading(false);
      return;
    }

    try {
      const phoneWithoutCode = extractPhoneWithoutCode(phoneNumber);
      const requestBody = {
        registrationType: otpMethod,
        userType: "Login",
        countryCode,
        primaryType,
        ...(otpMethod === "whatsapp"
          ? { whatsappNumber: phoneWithoutCode }
          : { mobileNumber: phoneWithoutCode }),
      };

      const response = await axios.post<UserResponse>(
        `${BASE_URL}/user-service/registerwithMobileAndWhatsappNumber`,
        requestBody
      );
      setIsButtonEnabled(true);
      if (response.data) {
        localStorage.setItem(
          "mobileOtpSession",
          response.data.mobileOtpSession || ""
        );
        localStorage.setItem("salt", response.data.salt || "");
        localStorage.setItem(
          "expiryTime",
          response.data.otpGeneratedTime || ""
        );
        localStorage.setItem("primaryType", primaryType);

        if (
          response.data.userId === null &&
          response.data.userId === undefined &&
          response.data.mobileOtpSession === null &&
          response.data.mobileOtpSession === undefined
        ) {
          setShowSuccessPopup(true);
          setMessage("This number is not registered. Please register now.");
          const registerPath =
            primaryType === "STUDENT" || primaryType === "AGENT"
              ? `/whatsappregister?primaryType=${primaryType}`
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
          setChangeNumberClicked(false);
          setTimeout(() => {
            setShowSuccessPopup(false);
            setMessage("");
          }, 4000);
        }
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      if (
        error.response?.data?.message ===
        "User already registered with this Mobile Number, please log in."
      ) {
        setError("You are already registered with this number. Please log in.");
        setTimeout(() => navigate("/whatsapplogin"), 1500);
      } else {
        setError(
          error.response?.data?.message ||
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

    if (!credentials) {
      setOtpError("Please enter the complete OTP");
      setIsLoading(false);
      return;
    }

    if (otpMethod === "whatsapp" && credentials.otp.join("").length !== 4) {
      setOtpError("Please enter the complete WhatsApp OTP");
      setIsLoading(false);
      return;
    } else if (
      otpMethod === "mobile" &&
      credentials.mobileOTP.join("").length !== 6
    ) {
      setOtpError("Please enter the complete Mobile OTP");
      setIsLoading(false);
      return;
    }

    try {
      const phoneWithoutCode = extractPhoneWithoutCode(phoneNumber);
      const requestBody = {
        registrationType: otpMethod,
        userType: "Login",
        countryCode,
        primaryType,
        ...(otpMethod === "whatsapp"
          ? {
              whatsappNumber: phoneWithoutCode,
              whatsappOtpSession: localStorage.getItem("mobileOtpSession"),
              whatsappOtpValue: credentials.otp.join(""),
              salt: localStorage.getItem("salt"),
              expiryTime: localStorage.getItem("expiryTime"),
            }
          : {
              mobileNumber: phoneWithoutCode,
              mobileOtpSession: localStorage.getItem("mobileOtpSession"),
              mobileOtpValue: credentials.mobileOTP.join(""),
              salt: localStorage.getItem("salt"),
              expiryTime: localStorage.getItem("expiryTime"),
            }),
      };

      const response = await axios.post<UserResponse>(
        `${BASE_URL}/user-service/registerwithMobileAndWhatsappNumber`,
        requestBody
      );
      if (response.data && response.data.accessToken && response.data.userId) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("primaryType", primaryType);

        // Fetch user details
        const userData = await fetchUserDetails(response.data.accessToken);
        if (userData && userData.userId) {
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
          sessionStorage.removeItem("fromStudyAbroad");
          sessionStorage.removeItem("primaryType");
          sessionStorage.removeItem("pendingGoogleAuth");

          setShowSuccessPopup(true);
          setMessage("Login Successful");

          setTimeout(() => {
            const redirectPath =
              sessionStorage.getItem("redirectPath") || "/main/dashboard/home";

            // ✅ navigate first
            navigate(redirectPath, { replace: true });

            // ✅ remove after a tiny delay (prevents losing it if login page rerenders)
            setTimeout(() => {
              sessionStorage.removeItem("redirectPath");
            }, 300);
          }, 1000);
        } else {
          setOtpError("Failed to fetch user details after login.");
          // Stay on the same page
        }
      } else {
        setOtpError("No access token or user ID received. Please try again.");
        // Stay on the same page
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      if (error.response?.status === 401) {
        setOtpError(
          "Unauthorized: Invalid or missing access token. Please try again."
        );
        handleAuthError(error, navigate);
      } else {
        setOtpError(error.response?.data?.message || "Invalid OTP");
      }
    } finally {
      setIsLoading(false);
      autoSubmitRef.current = false;
    }
  };

  const handleResendOtp = async () => {
    if (!resendDisabled) {
      setResendDisabled(true);
      setResendTimer(30);
      setIsLoading(true);
      setOtpError("");

      try {
        const phoneWithoutCode = extractPhoneWithoutCode(phoneNumber);
        const requestBody = {
          registrationType: otpMethod,
          userType: "Login",
          countryCode,
          primaryType,
          ...(otpMethod === "whatsapp"
            ? { whatsappNumber: phoneWithoutCode }
            : { mobileNumber: phoneWithoutCode }),
        };

        const response = await axios.post<UserResponse>(
          `${BASE_URL}/user-service/registerwithMobileAndWhatsappNumber`,
          requestBody
        );
        if (response.data) {
          localStorage.setItem(
            "mobileOtpSession",
            response.data.mobileOtpSession || ""
          );
          localStorage.setItem("salt", response.data.salt || "");
          localStorage.setItem(
            "expiryTime",
            response.data.otpGeneratedTime || ""
          );

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
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        setError(
          error.response?.data?.message ||
            "An error occurred. Please try again later."
        );
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

  const switchOtpMethod = (method: "mobile" | "whatsapp") => {
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
    if (primaryType === "CUSTOMER") {
      setShowEriceAlert(true);
      setShowGoogleButton(true);
    }
    setCredentials({
      otp: ["", "", "", ""],
      mobileOTP: ["", "", "", "", "", ""],
    });
  };

  const handleRegisterRedirectClick = () => {
    const registerUrl =
      primaryType === "STUDENT" || primaryType === "AGENT"
        ? `/whatsappregister?primaryType=${primaryType}`
        : "/whatsappregister";
    navigate(registerUrl);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4">
      <div
        className={`w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 ${
          isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* ===== Header (title + close + CTA buttons) ===== */}
        <div className="relative bg-purple-600 px-3 py-3 sm:px-5 sm:py-4 rounded-t-xl">
          {/* Title (dynamic; unchanged) */}
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
              {primaryType === "STUDENT"
                ? "Login to Study Abroad"
                : primaryType === "AGENT"
                ? "Login to Bharat AI Store"
                : "Login to ASKOXY.AI"}
            </h2>
          </div>

          {/* Close button — improved focus/hover; same handler */}
          <button
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-2 sm:right-4 top-2 sm:top-4 p-1.5 rounded-full text-white/90 hover:text-white hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top CTAs — keep single row on mobile; wrap only if ultra-narrow */}
          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                const loginPath =
                  primaryType === "STUDENT" || primaryType === "AGENT"
                    ? `/whatsapplogin?primaryType=${primaryType}`
                    : "/whatsapplogin";
                navigate(loginPath);
              }}
              className="inline-flex flex-1 sm:flex-none sm:min-w-[100px] items-center justify-center rounded-lg bg-white px-5 py-2 text-sm sm:text-base font-semibold text-purple-700 hover:bg-purple-100 hover:shadow-md active:bg-white transition"
            >
              Login
            </button>

            <button
              onClick={handleRegisterRedirectClick}
              className="inline-flex flex-1 sm:flex-none sm:min-w-[100px] items-center justify-center rounded-lg border-2 border-white px-5 py-2 text-sm sm:text-base font-semibold text-white hover:bg-white hover:text-purple-700 hover:shadow-md active:bg-white active:text-purple-700 transition"
            >
              Register
            </button>
          </div>
        </div>
        {/* {showEriceAlert && primaryType === "CUSTOMER" && (
          <div className="mx-2 xs:mx-3 sm:mx-4 mt-2">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-2 xs:px-3 sm:px-4 py-2 sm:py-3 rounded-lg relative">
              <div className="flex items-start gap-2 sm:pr-16">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  {!showEnglish ? (
                    <>
                      <p className="font-bold text-xs sm:text-sm">
                        ERICE కస్టమర్లకు గమనిక
                      </p>
                      <p className="text-xs mt-1 leading-relaxed break-words">
                        మీ డేటా మైగ్రేట్ చేయబడింది. SMS ఎంపికను ఉపయోగించి లాగిన్
                        అవ్వండి. మీ మొబైల్ మరియు WhatsApp నంబర్లు ఒకటే అయితే,
                        మీరు WhatsApp ద్వారా కూడా లాగిన్ అవ్వవచ్చు
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-xs sm:text-sm">
                        Attention Erice Customers
                      </p>
                      <p className="text-xs mt-1 leading-relaxed break-words">
                        Your data has been migrated. Log in using the SMS
                        option. If your mobile and WhatsApp numbers are the
                        same, you can also log in via WhatsApp.
                      </p>
                    </>
                  )}
                </div>
              </div>
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
        )} */}

        {showSuccessPopup && (
          <div className="mx-4 sm:mx-6 mt-3 animate-fadeIn">
            <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-100 px-3 py-2 text-green-800">
              <CheckCircle2 className="w-5 h-5" />
              {message}
            </div>
          </div>
        )}

        {/* ===== Body ===== */}
        <div className="p-4 sm:p-6">
          <form
            onSubmit={showOtp ? handleOtpSubmit : handleSubmit}
            className="space-y-6"
          >
            {/* Method toggle (WhatsApp / SMS) */}
            <div className="flex flex-col items-center">
              <div className="flex gap-3 sm:gap-4">
                {/* WhatsApp */}
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    otpMethod === "whatsapp"
                      ? "bg-green-500 text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${
                    isPhoneDisabled || isMethodDisabled
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => switchOtpMethod("whatsapp")}
                  disabled={isPhoneDisabled || isMethodDisabled}
                >
                  <FaWhatsapp className="w-5 h-5" />
                  WhatsApp
                </button>

                {/* SMS */}
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    otpMethod === "mobile"
                      ? "bg-purple-600 text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${
                    isPhoneDisabled || isMethodDisabled
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => switchOtpMethod("mobile")}
                  disabled={isPhoneDisabled || isMethodDisabled}
                >
                  <Smartphone className="w-5 h-5" />
                  SMS
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
                  <FaWhatsapp className="pointer-events-none absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                ) : (
                  <PhoneCall className="pointer-events-none absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                )}
              </div>

              {/* Inline error (kept) */}
              {error && (
                <p className="mt-2 animate-fadeIn flex items-center gap-1 text-sm text-red-600">
                  <X className="w-4 h-4" />
                  {error}
                </p>
              )}
            </div>

            {/* Pre-OTP note + Get OTP button */}
            {!showOtp && (
              <>
                {/* Informational note (method-specific) */}
                <div className="text-center text-sm">
                  {otpMethod === "whatsapp" ? (
                    <p className="text-green-600">
                      <strong>Note:</strong> 🌍 WhatsApp OTP works globally —
                      India and beyond!
                    </p>
                  ) : (
                    <p className="text-purple-600">
                      <strong>Note:</strong> 📩 SMS OTP is for Indian numbers
                      (+91) only.
                    </p>
                  )}
                </div>

                {/* Primary action: Get OTP (method color) */}
                <button
                  type="submit"
                  disabled={isGetOtpButtonDisabled || isLoading}
                  className={`mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed ${
                    isGetOtpButtonDisabled || isLoading
                      ? "bg-gray-400 opacity-60"
                      : otpMethod === "whatsapp"
                      ? "bg-green-500 hover:bg-green-600 active:bg-green-700"
                      : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Get OTP via{" "}
                      {otpMethod === "whatsapp" ? "WhatsApp" : "SMS"}
                    </>
                  )}
                </button>
              </>
            )}

            {/* OTP entry section */}
            {showOtp && (
              <div
                className={`space-y-4 transition-all duration-500 ${
                  animateOtp ? "animate-slideInUp" : ""
                }`}
              >
                {/* Sent info line */}
                <div className="text-center">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    {otpMethod === "whatsapp" ? (
                      <MessageCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Smartphone className="h-5 w-5 text-purple-500" />
                    )}
                    <span className="text-sm text-gray-600">
                      OTP sent to your{" "}
                      {otpMethod === "whatsapp" ? "WhatsApp" : "mobile"}
                    </span>
                  </div>
                </div>

                {/* OTP inputs (same logic; consistent sizes/focus) */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter {otpMethod === "whatsapp" ? "4" : "6"}-digit OTP{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {(otpMethod === "whatsapp"
                      ? credentials.otp
                      : credentials.mobileOTP
                    ).map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        disabled={isLoading}
                        className="h-11 w-11 sm:h-12 sm:w-12 rounded-lg border text-center text-lg font-semibold outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                        aria-label={`OTP digit ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* OTP error (unchanged) */}
                  {otpError && (
                    <p className="animate-fadeIn text-center text-sm text-red-600 flex items-center justify-center gap-1">
                      <X className="w-4 h-4" />
                      {otpError}
                    </p>
                  )}
                </div>

                {/* Verify button */}
                <button
                  type="submit"
                  disabled={isLoading || !isOtpComplete}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed ${
                    isLoading || !isOtpComplete
                      ? "bg-gray-400 opacity-60"
                      : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-5 w-5" />
                      Verify OTP
                    </>
                  )}
                </button>

                {/* Resend + Change number */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendDisabled || isLoading}
                    className={`text-sm font-medium transition-colors ${
                      resendDisabled || isLoading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-purple-600 hover:text-purple-800"
                    }`}
                  >
                    <RefreshCcw className="mr-1 inline h-4 w-4" />
                    {resendDisabled
                      ? `Resend OTP in ${resendTimer}s`
                      : "Resend OTP"}
                  </button>
                </div>

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

          {/* {showGoogleButton && primaryType === "CUSTOMER" && (
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
           
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
          )} */}
          {/* {!showOtp && (
            <div className="mb-4">
              {showGoogleButton && primaryType === "CUSTOMER" && (
                <button
                  type="button"
                  onClick={handleGmailAuth}
                  disabled={!isGmailButtonEnabled || isGoogleLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-3
    transition-all duration-200${
      !isGmailButtonEnabled || isGoogleLoading
        ? "bg-gray-100 text-gray-400  cursor-not-allowed"
        : "bg-white text-[#3c4043]  hover:bg-gray-50 active:bg-[#f1f3f4] "
    } `}
                  aria-label="Continue with Gmail"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#3c4043]" />
                  ) : (
                    // <FaGoogle className="w-5 h-5 text-[#4285F4]" />
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
          )} */}

          <div className="mt-6 flex items-center justify-center px-2 sm:px-4 text-center">
            <p className="max-w-full text-sm leading-relaxed text-gray-600 sm:max-w-xs">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleRegisterRedirectClick();
                }}
                className="group inline-flex items-center gap-1 font-medium text-purple-700 hover:text-purple-900"
              >
                Register here
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsappLogin;
