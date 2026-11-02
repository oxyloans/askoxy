import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import Swal from "sweetalert2";
import axios from "axios";
import BASE_URL from "../Config";
import { Link, useNavigate } from "react-router-dom";
import { setIntendedRoute } from "../utils/taskTokenManager";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import taskbg from "../assets/img/taskbg.png";
import OtpInput from "./OtpInput";

interface RegisterResponse {
  emailOtpSession: string;
  salt: string;
  userId: string | null;
  errorMessage?: string;
  error?: string;
  message?: string;
  status?: string;
}

const UserRegister: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailOtp, setEmailOtp] = useState<string>("");
  const [emailOtpSession, setEmailOtpSession] = useState<string>("");
  const [salt, setSalt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSending, setOtpSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);
  const navigate = useNavigate();

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Countdown timer for resending OTP
  useEffect(() => {
    let interval: any = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Handle navigation after successful registration
  useEffect(() => {
    if (registrationSuccess) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Registration successful! Redirecting to login...",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      const redirectTimer = setTimeout(() => {
        const intendedRoute = localStorage.getItem("intendedRoute");
        if (intendedRoute) {
          setIntendedRoute(intendedRoute);
        }
        navigate("/userlogin", { replace: true });
      }, 1000);

      return () => clearTimeout(redirectTimer);
    }
  }, [registrationSuccess, navigate]);

  const handleEmailSubmit = async (): Promise<void> => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address to receive an OTP");
      return;
    }

    setOtpSending(true);
    setError(null);

    try {
      const response = await axios.post<RegisterResponse>(
        `${BASE_URL}/user-service/userEmailPassword`,
        { email: trimmedEmail }
      );

      const apiError = response.data.error || response.data.errorMessage;
      if (apiError) {
        setError(apiError);
        return;
      }

      if (response.data.emailOtpSession) {
        setIsEmailSubmitted(true);
        setEmailOtpSession(response.data.emailOtpSession);
        setSalt(response.data.salt);
        setResendTimer(30);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "OTP has been sent to your email",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        setError(
          apiError || "Failed to generate OTP. Please try again."
        );
      }
    } catch (err: any) {
      const serverMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data?.errorMessage ||
        (typeof err.response?.data === "string" ? err.response.data : null);

      setError(serverMessage || "Network error. Please try again later.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleSubmitOtp = async (): Promise<void> => {
    setError(null);
    const trimmedName = name.trim();
    const trimmedOtp = emailOtp.trim();

    if (!trimmedOtp) {
      setError("Please enter the OTP sent to your email");
      return;
    }
    if (!trimmedName) {
      setError("Please enter your full name");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    if (password.length < 8) {
      setError("Password must contain at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      sessionStorage.setItem("Name", trimmedName);

      const requestData = {
        email: email.trim(),
        emailOtp: trimmedOtp,
        emailOtpSession,
        password,
        primaryType: "EMPLOYEE",
        salt,
        name: trimmedName,
      };

      const response = await axios.post<RegisterResponse>(
        `${BASE_URL}/user-service/userEmailPassword`,
        requestData
      );

      // If backend returned an error in a 200 response
      const apiError = response.data.error || response.data.errorMessage;
      if (apiError) {
        setError(apiError);
        return;
      }

      setRegistrationSuccess(true);
      setName("");
      setEmail("");
      setEmailOtp("");
      setPassword("");
      setEmailOtpSession("");
      setSalt("");
      setIsEmailSubmitted(false);
    } catch (err: any) {
      // Directly display the exact backend error message without hardcoded static text
      const serverMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data?.errorMessage ||
        (typeof err.response?.data === "string" ? err.response.data : null);

      if (serverMessage) {
        setError(serverMessage);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f4f9] p-3 sm:p-4 lg:p-6">
      {/* Main card container with balanced width and height */}
      <div className="w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-[800px] md:min-h-[480px] bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-200/70">
        {/* Left Side: Hidden on mobile, visible on desktop/tablet */}
        <div className="hidden md:flex md:w-[52%] relative overflow-hidden items-center justify-center md:min-h-full">
          <img
            src={taskbg}
            alt="Oxy Employee"
            className="w-full h-full object-fill select-none block"
          />
        </div>

        {/* Right Side: Clean form panel with spacious vertical padding */}
        <div className="w-full md:w-[48%] bg-white flex flex-col justify-center p-6 sm:p-8 md:py-10">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
                Welcome to Oxy Employee
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {!isEmailSubmitted
                  ? "Enter your email to receive a verification OTP"
                  : "Enter OTP and your details to complete registration"}
              </p>
            </div>

            {error && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg text-left">
                {error}
              </div>
            )}

            <Form layout="vertical">
              {!isEmailSubmitted ? (
                /* Step 1: Enter email and send OTP */
                <>
                  <Form.Item
                    label={
                      <span className="text-gray-700 text-xs sm:text-sm font-medium">
                        Email Address
                      </span>
                    }
                    required
                    className="mb-4"
                  >
                    <Input
                      prefix={<MailOutlined className="text-gray-400 mr-2" />}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="h-11 rounded-lg border-gray-300 text-sm hover:border-blue-400 focus:border-blue-500"
                      onPressEnter={handleEmailSubmit}
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    block
                    onClick={handleEmailSubmit}
                    loading={loading || otpSending}
                    className="w-full h-11 sm:h-12 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg border-0 text-base transition-all mb-3"
                  >
                    Send OTP
                  </Button>
                </>
              ) : (
                /* Step 2: Show email (disabled), OTP, Full Name, Create Password */
                <>
                  {/* Email Address with Change Email option */}
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-gray-700 text-xs sm:text-sm font-medium">
                      Email Address
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEmailSubmitted(false);
                        setEmailOtp("");
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:text-blue-700 transition-colors"
                    >
                      Change Email
                    </button>
                  </div>
                  <Form.Item className="mb-3">
                    <Input
                      prefix={<MailOutlined className="text-gray-400 mr-2" />}
                      type="email"
                      value={email}
                      disabled
                      className="h-11 rounded-lg bg-gray-50 border-gray-300 text-sm text-gray-600"
                    />
                  </Form.Item>

                  {/* One-Time Password with 6 Rounded Boxes */}
                  <div className="mb-3.5">
                    <div className="flex justify-between items-center w-full mb-1.5">
                      <span className="text-gray-700 text-xs sm:text-sm font-medium">
                        Enter 6-Digit OTP <span className="text-red-500">*</span>
                      </span>
                      {resendTimer > 0 ? (
                        <span className="text-xs text-gray-400 font-medium">
                          Resend in {resendTimer}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleEmailSubmit}
                          disabled={otpSending}
                          className="text-xs font-semibold text-indigo-600 hover:text-blue-700 transition-colors"
                        >
                          {otpSending ? "Sending..." : "Resend OTP"}
                        </button>
                      )}
                    </div>
                    <OtpInput
                      value={emailOtp}
                      onChange={setEmailOtp}
                      disabled={loading}
                    />
                  </div>

                  {/* Full Name */}
                  <Form.Item
                    label={
                      <span className="text-gray-700 text-xs sm:text-sm font-medium">
                        Full Name
                      </span>
                    }
                    required
                    className="mb-3"
                  >
                    <Input
                      prefix={<UserOutlined className="text-gray-400 mr-2" />}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="h-11 rounded-lg border-gray-300 text-sm hover:border-blue-400 focus:border-blue-500"
                    />
                  </Form.Item>

                  {/* Create Password */}
                  <Form.Item
                    label={
                      <span className="text-gray-700 text-xs sm:text-sm font-medium">
                        Create Password
                      </span>
                    }
                    required
                    className="mb-4"
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400 mr-2" />}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password (min 8 chars)"
                      className="h-11 rounded-lg border-gray-300 text-sm hover:border-blue-400 focus:border-blue-500"
                    />
                  </Form.Item>

                  {/* Complete Registration Button */}
                  <Button
                    type="primary"
                    block
                    onClick={handleSubmitOtp}
                    loading={loading}
                    className="w-full h-11 sm:h-12 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg border-0 text-base transition-all mb-3"
                  >
                    Complete Registration
                  </Button>
                </>
              )}

              {/* Already have an account link */}
              <div className="text-center pt-1 text-xs sm:text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/userlogin"
                  className="font-semibold text-indigo-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Login
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
