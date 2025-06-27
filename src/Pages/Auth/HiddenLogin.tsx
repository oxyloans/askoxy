import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import PhoneInput, {
  isValidPhoneNumber,
  getCountryCallingCode,
  parsePhoneNumber,
  PhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  X,
  KeyRound,
  PhoneCall,
  Loader2,
  MessageCircle,
  CheckCircle2,
  Smartphone,
  Eye,
  ChevronDown,
  UserPlus,
  Users,
} from "lucide-react";
import BASE_URL from "../../Config";

const HiddenLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    otp: ["", "", "", ""],
    mobileOTP: ["", "", "", "", "", ""],
  });
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [otpMethod, setOtpMethod] = useState<"whatsapp" | "mobile">("whatsapp");
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
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>("");
  const [userTypeError, setUserTypeError] = useState<string>("");
  const [showPasswordError, setShowPasswordError] = useState<string>("");
  const [typeLogin, setTypeLogin] = useState<string>("");
  const [typeLoginError, setTypeLoginError] = useState<string>("");

  // New states for tab functionality
  const [activeTab, setActiveTab] = useState<"hidden" | "onboard">("hidden");
  const [onboardMobileNumber, setOnboardMobileNumber] = useState<string>("");
  const [onboardError, setOnboardError] = useState<string>("");

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

  // Extract country code from phone number
  useEffect(() => {
    if (phoneNumber) {
      // Extract country code without the + sign
      const code = phoneNumber.split(" ")[0].replace("+", "");
      const phoneNumberS = parsePhoneNumber(phoneNumber);
      // console.log("phoneNumberS", phoneNumberS);
      console.log("phoneNumberS.country", phoneNumberS?.countryCallingCode);
      const countryCode = `+${phoneNumberS?.countryCallingCode}`;
      setCountryCode(countryCode || "");
      setIsMethodDisabled(true); // Disable method selection when number is entered
      setError(""); // Clear error message when number is entered
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

  // Extract phone number without country code
  const extractPhoneWithoutCode = (phone: string) => {
    if (!phone) return "";
    // Remove the country code part (format is usually +XX XXXXXXXXXX)
    const parts = phone.split(" ");
    return parts.length > 1 ? parts.slice(1).join("") : phone;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setShowPasswordError("");
    setMessage("");
    setIsLoading(true);

    if (userType === "") {
      setUserTypeError("Please select environment");
      setIsLoading(false);
      return;
    }

    if (typeLogin === "") {
      setTypeLoginError("Please select user type");
      setIsLoading(false);
      return;
    }

    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setError("Please enter a valid number with country code");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setShowPasswordError("Please enter password");
      setIsLoading(false);
      return;
    }

    if (typeLogin === "Dev" && password !== "Erice&OxyriceDev") {
      setShowPasswordError("Please enter valid password");
      setIsLoading(false);
      return;
    }
    if (typeLogin === "Caller" && password !== "Erice&Oxyrice") {
      setShowPasswordError("Please enter valid password");
      setIsLoading(false);
      return;
    }

    const BASE_URL =
      userType === "live"
        ? "https://meta.oxyloans.com/api"
        : "https://meta.oxyglobal.tech/api";

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
        requestBody.whatsappNumber = phoneWithoutCode.replace(countryCode, "");
      } else {
        requestBody.mobileNumber = phoneWithoutCode.replace(countryCode, "");
      }

      const response = await axios.post(
        `${BASE_URL}/user-service/hiddenLoginByMobileNumber/${
          otpMethod === "whatsapp"
            ? requestBody.whatsappNumber
            : requestBody.mobileNumber
        }`,
        {}
      );
      if (response.data) {
        setShowSuccessPopup(true);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("accessToken", response.data.accessToken);
        if (otpMethod === "whatsapp") {
          localStorage.setItem("whatsappNumber", phoneNumber);
        } else {
          localStorage.setItem(
            "mobileNumber",
            phoneNumber.replace(countryCode, "")
          );
        }
        setMessage("Login Successful");
        setTimeout(
          () => navigate(location.state?.from || "/main/dashboard/home"),
          500
        );
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      // setTimeout(() => navigate("/whatsappregister"), 1000);
    } finally {
      setIsLoading(false);
    }
  };

  // New function to handle onboard user submission
  const handleOnboardSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOnboardError("");
    setMessage("");
    setIsLoading(true);

    // Validate mobile number (should be 10 digits for Indian numbers)
    if (
      !onboardMobileNumber ||
      onboardMobileNumber.length !== 10 ||
      !/^\d+$/.test(onboardMobileNumber)
    ) {
      setOnboardError("Please enter a valid 10-digit mobile number");
      setIsLoading(false);
      return;
    }

    try {
      const requestBody = {
        countryCode: "+91",
        mobileNumber: onboardMobileNumber,
        registerFrom: "WEB",
      };

      const response = await axios.post(
        `${BASE_URL}/user-service/onlineRegistration`,
        requestBody
      );

      if (response.data) {
        setShowSuccessPopup(true);
        setMessage("User onboarded successfully!");
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("mobileNumber", response.data.mobileNumber);
        setTimeout(() => {
          setShowSuccessPopup(false);
          setOnboardMobileNumber("");
          navigate(location.state?.from || "/main/dashboard/home")
        }, 3000);
      }
      
    } catch (err: any) {
      if (err.response?.data?.message) {
        setOnboardError(err.response.data.message);
      } else {
        setOnboardError(
          "An error occurred during onboarding. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Phone input change handler that extracts country code
  const handlePhoneChange = (value: string | undefined) => {
    setPhoneNumber(value);
    if (value) {
      // Extract only the country code number without the + sign
      const code = value.split(" ")[0].replace("+", "");
      setCountryCode(code);
    }
  };

  // Method for switching OTP method
  const switchOtpMethod = (method: "whatsapp" | "mobile") => {
    if (!isPhoneDisabled && !isMethodDisabled) {
      // Only allow switching when not in OTP verification mode and no phone number entered
      setOtpMethod(method);
    }
  };

  // Tab switching handler
  const handleTabSwitch = (tab: "hidden" | "onboard") => {
    setActiveTab(tab);
    // Clear all errors and form data when switching tabs
    setError("");
    setOnboardError("");
    setMessage("");
    setShowSuccessPopup(false);
    setUserTypeError("");
    setTypeLoginError("");
    setShowPasswordError("");
    setPhoneNumber(undefined);
    setOnboardMobileNumber("");
    setPassword("");
    setUserType("");
    setTypeLogin("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div
        className={`max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
          isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {/* Header */}
        <div className="bg-purple-600 p-6 relative">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-2xl font-bold text-white text-center">
              ASKOXY.AI
            </h2>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleTabSwitch("hidden")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === "hidden"
                ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Hidden Login
          </button>
          <button
            onClick={() => handleTabSwitch("onboard")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === "onboard"
                ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Onboard User
          </button>
        </div>

        {/* Success Message */}
        {showSuccessPopup && (
          <div className="mx-6 mt-6 animate-fadeIn">
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              {message}
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "hidden" ? (
            // Hidden Login Form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Method Selection UI */}
              <div className="flex flex-col items-center gap-4 p-4 border-b border-gray-100 pb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  FOR ADMIN USE
                </h2>
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
                    onClick={() => switchOtpMethod("whatsapp")}
                    disabled={isPhoneDisabled || isMethodDisabled}
                  >
                    <MessageCircle className="w-5 h-5" />
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
                    onClick={() => switchOtpMethod("mobile")}
                    disabled={isPhoneDisabled || isMethodDisabled}
                  >
                    <Smartphone className="w-5 h-5" />
                    SMS
                  </button>
                </div>
              </div>

              <div className="relative w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Environment <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <select
                    value={userType}
                    onChange={(e) => {
                      setUserType(e.target.value);
                      localStorage.setItem(
                        "userType",
                        e.target.value || "live"
                      );
                      setUserTypeError("");
                    }}
                    className="w-full p-3 bg-white shadow-sm rounded-lg border border-gray-200 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 
                               focus:border-purple-500 transition-all text-gray-800 
                               placeholder-gray-400 appearance-none"
                  >
                    <option value="">Select Environment</option>
                    <option value="live">Live</option>
                    <option value="test">Test</option>
                  </select>

                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                {userTypeError && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fadeIn">
                    <X className="w-4 h-4" />
                    {userTypeError}
                  </p>
                )}
              </div>

              <div className="relative w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select User <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={typeLogin}
                    onChange={(e) => {
                      setTypeLogin(e.target.value);
                      localStorage.setItem(
                        "TypeLogin",
                        e.target.value || "Dev"
                      );
                      setTypeLoginError("");
                    }}
                    className="w-full p-3 bg-white shadow-sm rounded-lg border border-gray-200 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 
                               focus:border-purple-500 transition-all text-gray-800 
                               placeholder-gray-400 appearance-none"
                  >
                    <option value="">Select Type</option>
                    <option value="Dev">Dev</option>
                    <option value="Caller">Caller</option>
                  </select>

                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                {typeLoginError && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fadeIn">
                    <X className="w-4 h-4" />
                    {typeLoginError}
                  </p>
                )}
              </div>

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
                    countrySelectProps={{ disabled: otpMethod === "mobile" }}
                    className="w-full p-3 bg-white shadow-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-800 placeholder-gray-400 [&>*]:outline-none [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:border-none PhoneInput"
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

              <div className="relative w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setShowPasswordError("");
                    }}
                    className="w-full p-3 bg-white shadow-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-800 placeholder-gray-400"
                    maxLength={20}
                    placeholder="Enter your password"
                  />
                  <Eye className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                {showPasswordError && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fadeIn">
                    <X className="w-4 h-4" />
                    {showPasswordError}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-5 h-5" />
                      LOGIN
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            // Onboard User Form
            <form onSubmit={handleOnboardSubmit} className="space-y-6">
              <div className="flex flex-col items-center gap-4 p-4 border-b border-gray-100 pb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  ONBOARD NEW USER
                </h2>
              </div>

              <div className="relative w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <div className="flex">
                    <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg">
                      <span className="text-gray-600 font-medium">+91</span>
                    </div>
                    <input
                      type="tel"
                      value={onboardMobileNumber}
                      onChange={(e) => {
                        // Only allow digits and limit to 10 characters
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setOnboardMobileNumber(value);
                        setOnboardError("");
                      }}
                      className="flex-1 p-3 bg-white shadow-sm rounded-r-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-800 placeholder-gray-400"
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                    />
                  </div>
                  <PhoneCall className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                {onboardError && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fadeIn">
                    <X className="w-4 h-4" />
                    {onboardError}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      ONBOARD USER
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default HiddenLogin;
