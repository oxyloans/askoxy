import React, { useState, useRef, useEffect } from "react";
import {
  PhoneOutlined,
  SendOutlined,
  SafetyOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  UserOutlined,
  StarFilled,
  TrophyOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { Input, Button, message } from "antd";
import BASE_URL from "../../Config";
import { useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";

const MetroLogin: React.FC = () => {
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [userId, setUserId] = useState<string>("");
  const [isExistingUser, setIsExistingUser] = useState<boolean>(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  // Resend timer effect
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

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setMobileNumber(value);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");

    if (sanitizedValue.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = sanitizedValue;
      setOtp(newOtp);

      // Auto-focus next input
      if (sanitizedValue && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all 6 digits are entered
      if (index === 5 && sanitizedValue) {
        const isComplete = newOtp.every(
          (val, i) => i === index || Boolean(val)
        );
        if (isComplete) {
          setTimeout(() => handleVerifyOtp(), 300);
        }
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6);

    const newOtp = [...otp];
    pastedData.split("").forEach((char: string, index: number) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    if (pastedData.length === 6) {
      setTimeout(() => handleVerifyOtp(), 300);
    }
  };

  const sendOtp = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      message.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        registrationType: "mobile",
        userType: "Register",
        primaryType: "CUSTOMER",
        countryCode: "+91",
        mobileNumber: mobileNumber,
      };

      const response = await fetch(
        `${BASE_URL}/user-service/registerwithMobileAndWhatsappNumber`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok && data.mobileOtpSession) {
        setIsOtpSent(true);
        setResendDisabled(true);
        setResendTimer(30);
        message.success("OTP sent successfully to your mobile number!");
      } else if (response.status === 409 || data.mobileOtpSession === null) {
        await handleExistingUser();
      } else {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      message.error(
        (error as Error).message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExistingUser = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/user-service/hiddenLoginByMobileNumber/${mobileNumber}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.userId) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("primaryType", data.primaryType);
        setUserId(data.userId);
        setIsExistingUser(true);
        setIsVerified(true);
        message.success("Welcome back! You are already registered.");
      } else {
        throw new Error("Failed to retrieve user information");
      }
    } catch (error) {
      console.error("Error in hidden login:", error);
      message.error("failed to fetch...! try again after sometime.");
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      message.error("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        registrationType: "mobile",
        userType: "Register",
        primaryType: "CUSTOMER",
        countryCode: "+91",
        mobileNumber: mobileNumber,
        mobileOtpSession: "demo-session",
        mobileOtpValue: otpValue,
        salt: "demo-salt",
        expiryTime: Date.now().toString(),
        registerdFrom: "WEB",
      };

      const response = await fetch(
        `${BASE_URL}/user-service/registerwithMobileAndWhatsappNumber`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok && data.userId) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("primaryType", data.primaryType);
        setUserId(data.userId);
        setIsVerified(true);
        message.success("Verification successful!");
      } else if (response.status === 409) {
        // await handleExistingUser();
        message.error(
          "Invalid OTP! Please make sure you entered the correct code."
        );
      } else {
        throw new Error(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      message.error(
        (error as Error).message || "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendDisabled) return;

    setResendLoading(true);
    setResendDisabled(true);
    setResendTimer(30);

    try {
      const requestBody = {
        registrationType: "mobile",
        userType: "Register",
        primaryType: "CUSTOMER",
        countryCode: "+91",
        mobileNumber: mobileNumber,
      };

      const response = await fetch(
        `${BASE_URL}/user-service/registerwithMobileAndWhatsappNumber`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok && data.mobileOtpSession) {
        setOtp(["", "", "", "", "", ""]);
        message.success("OTP resent successfully!");
      } else {
        throw new Error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      message.error(
        (error as Error).message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  const resetForm = () => {
    setMobileNumber("");
    setOtp(["", "", "", "", "", ""]);
    setIsOtpSent(false);
    setIsVerified(false);
    setUserId("");
    setIsExistingUser(false);
    setResendDisabled(false);
    setResendTimer(30);
  };

  const getLastFourDigits = (id: string): string => {
    if (!id) return "";
    return id.toString().slice(-4);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/10 via-purple-100/10 to-blue-100/10 animate-pulse"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-screen filter blur-3xl animate-bounce shadow-[0_0_40px_rgba(251,191,36,0.3)]"></div>
          <div
            className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-screen filter blur-3xl animate-bounce shadow-[0_0_40px_rgba(168,85,247,0.3)]"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-0 left-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-screen filter blur-3xl animate-bounce shadow-[0_0_40px_rgba(236,72,153,0.3)]"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-screen filter blur-3xl animate-bounce shadow-[0_0_40px_rgba(59,130,246,0.3)]"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-ping shadow-[0_0_10px_rgba(251,191,36,0.5)]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-2 lg:p-4">
        <div className="w-full lg:w-4/12 flex flex-col items-center lg:items-start justify-center text-center lg:text-left mb-6 lg:mb-0">
          <div className="flex justify-center lg:justify-start mb-4">
            <div className="relative">
              <FaRobot className="text-6xl text-purple-500 animate-pulse drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              <div className="absolute -top-2 -right-2">
                <StarFilled className="text-xl text-purple-400 animate-spin drop-shadow-[0_0_5px_rgba(168,85,247,0.3)]" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] mb-2">
            Welcome to
          </h1>
          <div className="relative flex flex-col items-center lg:items-start gap-2">
            <h2 className="text-3xl sm:text-4xl font-black leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-900 animate-pulse drop-shadow-[0_2px_6px_rgba(168,85,247,0.4)]">
                BILLION
              </span>
              <span className="text-7xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 animate-pulse drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)] mx-1">
                AI
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-900 animate-pulse drop-shadow-[0_2px_6px_rgba(168,85,247,0.4)]">
                RE
              </span>
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
              HUB
            </h3>
            <div className="absolute -inset-4 bg-purple-100/20 blur-2xl rounded-full animate-pulse"></div>
          </div>
          <div className="flex justify-center items-center lg:justify-start gap-4 mt-6">
            <div className="w-20 h-1 bg-gradient-to-r from-transparent to-purple-400 rounded-full drop-shadow-[0_1px_3px_rgba(168,85,247,0.2)]"></div>
            <TrophyOutlined className="text-2xl text-purple-500 drop-shadow-[0_1px_3px_rgba(168,85,247,0.3)]" />
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-transparent rounded-full drop-shadow-[0_1px_3px_rgba(168,85,247,0.2)]"></div>
          </div>
        </div>

        <div className="w-full lg:w-4/12 max-w-md px-4 sm:px-6 lg:px-0">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 rounded-3xl blur opacity-20 animate-pulse drop-shadow-[0_0_20px_rgba(168,85,247,0.2)]"></div>
            <div className="relative bg-white/95 rounded-3xl p-8 border border-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm">
              {!isVerified ? (
                <>
                  {!isOtpSent ? (
                    <div className="space-y-8">
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                          <PhoneOutlined className="text-purple-600 text-xl" />
                          Enter Your Mobile Number
                        </label>
                        <div className="relative">
                          <Input
                            size="large"
                            placeholder="Enter 10-digit mobile number"
                            prefix={
                              <div className="flex items-center gap-2.5 text-purple-600">
                                <span className="text-base font-medium">
                                  +91
                                </span>
                                <div className="w-px h-5 bg-purple-300/50"></div>
                              </div>
                            }
                            value={mobileNumber}
                            onChange={handleMobileChange}
                            className="rounded-2xl border border-gray-200 text-gray-900 placeholder-gray-400 shadow-[0_3px_10px_rgba(0,0,0,0.05)]"
                            style={{
                              fontSize: "18px",
                              padding: "18px 24px",
                              background: "white",
                            }}
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-300/10 to-blue-300/10 pointer-events-none"></div>
                        </div>
                      </div>
                      <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        onClick={sendOtp}
                        icon={<SendOutlined />}
                        className="w-full rounded-2xl h-14 text-lg font-bold shadow-[0_5px_14px_rgba(168,85,247,0.2)] hover:shadow-[0_8px_18px_rgba(168,85,247,0.3)] transform hover:scale-[1.03] transition-all duration-300 border-0 relative overflow-hidden"
                        style={{
                          background:
                            "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7e22ce 100%)",
                        }}
                      >
                        <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                          {loading
                            ? "Sending Magic Code..."
                            : "🚀 Get Verification Code"}
                        </span>
                        <div className="absolute inset-0 bg-purple-300/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      </Button>
                    </div>
                  ) : (
                    <div className="px-4 sm:px-6 lg:px-8 max-w-md w-full mx-auto">
                      <div className="space-y-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                            <SafetyOutlined className="text-2xl text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                            Enter Verification Code
                          </h3>
                          <p className="text-sm text-gray-600">
                            We've sent a 6-digit code to <br />
                            <span className="font-semibold text-sm text-purple-600">
                              +91 {mobileNumber}
                            </span>
                          </p>
                        </div>

                        {/* OTP Input Fields */}
                        <div className="flex justify-center flex-nowrap gap-2 sm:gap-3">
                          {otp.map((digit, index) => (
                            <div key={index} className="relative">
                              <input
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                ref={(el) => (otpRefs.current[index] = el)}
                                onChange={(e) =>
                                  handleOtpChange(e.target.value, index)
                                }
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={handlePaste}
                                className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg sm:text-xl font-bold rounded-lg text-gray-900 transition-all duration-300 border-2 focus:border-purple-400 focus:scale-105 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                                style={{
                                  background: "white",
                                  border: digit
                                    ? "2px solid #a855f7"
                                    : "2px solid #e5e7eb",
                                  outline: "none",
                                }}
                              />
                              {digit && (
                                <div className="absolute inset-0 rounded-lg bg-purple-300/20 animate-pulse pointer-events-none"></div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Verify Button */}
                        <Button
                          type="primary"
                          size="large"
                          loading={loading}
                          onClick={handleVerifyOtp}
                          icon={<CheckCircleOutlined />}
                          className="w-full rounded-xl h-12 text-base font-bold shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.3)] transform hover:scale-[1.02] transition-all duration-300 border-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
                          }}
                        >
                          <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                            {loading ? "Verifying..." : "✨ Verify OTP"}
                          </span>
                        </Button>

                        {/* Resend & Change */}
                        <div className="flex flex-col items-center gap-4">
                          <button
                            onClick={handleResendOtp}
                            disabled={resendDisabled || resendLoading}
                            className="text-purple-600 hover:text-purple-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                          >
                            <ReloadOutlined spin={resendLoading} />
                            {resendDisabled
                              ? `Resend OTP (${resendTimer}s)`
                              : "Resend OTP"}
                          </button>

                          <Button
                            onClick={resetForm}
                            className="rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all duration-300 text-gray-700 hover:text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                            size="large"
                            style={{
                              background: "white",
                            }}
                          >
                            Change Mobile Number
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_4px_16px_rgba(16,185,129,0.3)] animate-bounce">
                        <CheckCircleOutlined className="text-3xl text-white" />
                      </div>
                      <div className="absolute inset-0 bg-emerald-300/20 rounded-full blur-2xl animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-[0_2px_6px_rgba(202,138,4,0.3)]">
                        {isExistingUser
                          ? "🎉 Welcome Back, Billionaire!"
                          : "🚀 Welcome to the Elite Club!"}
                      </h3>
                      <p className="text-sm text-gray-700 drop-shadow">
                        {isExistingUser
                          ? "Your journey to financial freedom continues..."
                          : "Your path to becoming an AI Billionaire starts now!"}
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute -inset-2 bg-purple-300/20 rounded-2xl blur drop-shadow-[0_0_15px_rgba(168,85,247,0.2)]"></div>
                      <div className="relative bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <UserOutlined className="text-2xl text-purple-600 drop-shadow-[0_1px_3px_rgba(0,0,0,0.1)]" />
                          <p className="text-sm font-bold text-gray-900 drop-shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                            Your User ID
                          </p>
                        </div>
                        <div className="text-5xl font-black text-purple-600 tracking-widest font-mono mb-2 animate-pulse drop-shadow-[0_2px_6px_rgba(168,85,247,0.3)]">
                          {getLastFourDigits(userId)}
                        </div>
                        <p className="text-sm text-gray-600">
                          Mobile:{" "}
                          <span className="text-purple-600 font-semibold">
                            +91 {mobileNumber}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Button
                        type="primary"
                        className="w-full rounded-xl h-10 text-sm font-bold shadow-[0_4px_12px_rgba(168,85,247,0.2)] hover:shadow-[0_6px_16px_rgba(168,85,247,0.3)] transform hover:scale-[1.02] transition-all duration-300 border-0 relative overflow-hidden"
                        style={{
                          background:
                            "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7e22ce 100%)",
                        }}
                        onClick={() => {
                          navigate("/main/dashboard/home");
                        }}
                      >
                        <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                          🏆 Explore Now
                        </span>
                        <div className="absolute inset-0 bg-purple-300/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      </Button>
                      <Button
                        onClick={resetForm}
                        className="w-full rounded-xl h-10 text-xs font-semibold border border-gray-200 hover:bg-gray-50 transition-all duration-300 text-gray-700 hover:text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                        size="large"
                        style={{
                          background: "white",
                        }}
                      >
                        {isExistingUser
                          ? "Switch Account"
                          : "Register Another Number"}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center mt-4 pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <StarFilled className="text-purple-400 animate-pulse drop-shadow-[0_1px_2px_rgba(0,0,0,0.05)]" />
          <p className="text-gray-600 text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            Powered by{" "}
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              ASKOXY.AI
            </span>
          </p>
          <StarFilled className="text-purple-400 animate-pulse drop-shadow-[0_1px_2px_rgba(0,0,0,0.05)]" />
        </div>
      </div>
    </div>
  );
};

export default MetroLogin;
