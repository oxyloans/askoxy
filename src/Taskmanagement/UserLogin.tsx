import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, Space } from "antd";
import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";
import BASE_URL from "../Config";
import { useNavigate, Link } from "react-router-dom";
import { getIntendedRoute, clearIntendedRoute } from "../utils/taskTokenManager";
import {
  setEmployeeAccessToken,
  setEmployeeRefreshToken,
  getEmployeeAccessToken,
  removeEmployeeAccessToken,
  removeEmployeeRefreshToken,
} from "../utils/cookieUtils";
import {
  MailOutlined,
  LockOutlined,
  LoginOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import taskbg from "../assets/img/taskbg.png";

const { Title, Paragraph } = Typography;

interface LoginResponse {
  status: string;
  token?: string;
  refreshToke?: string;
  id?: string;
  name?: string;
  primaryType?: string;
  errorMessage?: string;
}

interface LoginErrorResponse {
  message?: string;
  error?: string;
}

const UserLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Redirect if already logged in as EMPLOYEE
  useEffect(() => {
    const token = getEmployeeAccessToken();
    const type = sessionStorage.getItem("primaryType");
    if (token && type !== "EMPLOYEE") {
      removeEmployeeAccessToken();
      removeEmployeeRefreshToken();
      return;
    }
    if (token && type === "EMPLOYEE") {
      window.history.replaceState(null, "", "/taskmanagement/dashboard");
      navigate("/taskmanagement/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setAccessDenied(false);
    setUserType(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Please fill in both email and password fields");
      setLoading(false);
      return;
    }

    const payload = { email: trimmedEmail, password };

    try {
      const response = await axios.post<LoginResponse>(
        `${BASE_URL}/user-service/userEmailPassword`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      if (response.data.status === "Login Successful" && response.data.token) {
        const { token, refreshToke, id, name, primaryType } = response.data;

        setEmployeeAccessToken(token);
        if (refreshToke) setEmployeeRefreshToken(refreshToke);
        if (id) sessionStorage.setItem("userId", id);
        if (name) sessionStorage.setItem("Name", name);
        if (primaryType) sessionStorage.setItem("primaryType", primaryType);

        // Handle different user types
        if (primaryType === "EMPLOYEE") {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Login Successful! Redirecting...",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });

          setTimeout(() => {
            const intendedRoute = getIntendedRoute();
            clearIntendedRoute();
            window.history.replaceState(
              null,
              "",
              intendedRoute || "/taskmanagement/dashboard"
            );
            navigate(intendedRoute || "/taskmanagement/dashboard", {
              replace: true,
            });
          }, 1000);
        } else if (
          primaryType === "SELLER" ||
          primaryType === "HELPDESKADMIN"
        ) {
          setAccessDenied(true);
          setUserType(primaryType);

          removeEmployeeAccessToken();
          removeEmployeeRefreshToken();
        } else {
          setError("Invalid user type. Please contact support.");
        }
      } else {
        setError(response.data.errorMessage || "Invalid credentials provided");
      }
    } catch (err: any) {
      const axiosError = err as AxiosError<LoginErrorResponse>;
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 400:
            errorMessage = "Invalid email or password format";
            break;
          case 401:
            errorMessage = "Incorrect email or password";
            break;
          case 403:
            errorMessage = "Account is locked or disabled";
            break;
          case 429:
            errorMessage = "Too many login attempts. Please try again later";
            break;
          case 500:
            errorMessage = "Server error. Please try again later";
            break;
          default:
            errorMessage =
              axiosError.response.data?.message ||
              axiosError.response.data?.error ||
              "Failed to login. Please try again.";
        }
      } else if (axiosError.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please check your connection.";
      } else if (!axiosError.response) {
        errorMessage = "Unable to connect to the server. Please try again.";
      }

      setError(errorMessage);
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
            {accessDenied ? (
              <div className="text-center py-2">
                <ExclamationCircleOutlined
                  style={{ fontSize: 56, color: "#f5222d" }}
                />
                <Title level={3} className="font-semibold text-gray-800 mt-4 mb-2">
                  Access Denied
                </Title>
                <Paragraph className="mb-6 text-gray-600 text-sm leading-relaxed">
                  Your account type ({userType}) does not have access to the
                  Task Management system. This portal is only available for
                  EMPLOYEE accounts.
                </Paragraph>
                <Space direction="vertical" size="middle" className="w-full">
                  <Button
                    type="primary"
                    onClick={() => {
                      setAccessDenied(false);
                      setUserType(null);
                      setEmail("");
                      setPassword("");
                    }}
                    className="w-full h-11 rounded-lg font-medium shadow-sm bg-blue-600 hover:bg-blue-500 border-0"
                    icon={<UserOutlined />}
                  >
                    Try Different Account
                  </Button>
                  <Button
                    type="link"
                    className="w-full font-medium text-gray-600 hover:text-gray-800 text-sm"
                    href="mailto:support@example.com"
                  >
                    Contact Support
                  </Button>
                </Space>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
                    Welcome to Oxy Employee
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Enter your credentials to access your dashboard
                  </p>
                </div>

                {error && (
                  <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg text-left">
                    {error}
                  </div>
                )}

                <Form layout="vertical" onFinish={handleLogin}>
                  {/* Email or Username */}
                  <Form.Item
                    label={
                      <span className="text-gray-700 text-xs sm:text-sm font-medium">
                        Email
                      </span>
                    }
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your email or username",
                      },
                    ]}
                    className="mb-3"
                  >
                    <Input
                      prefix={<MailOutlined className="text-gray-400 mr-2" />}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email or username"
                      className="h-10 rounded-lg border-gray-300 text-sm hover:border-blue-400 focus:border-blue-500"
                    />
                  </Form.Item>

                  {/* Password */}
                  <Form.Item
                    label={
                      <span className="text-gray-700 text-xs sm:text-sm font-medium">
                        Password
                      </span>
                    }
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your password",
                      },
                    ]}
                    className="mb-4"
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400 mr-2" />}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-10 rounded-lg border-gray-300 text-sm hover:border-blue-400 focus:border-blue-500"
                    />
                  </Form.Item>

                  {/* Submit Button */}
                  <Form.Item className="mb-3">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<LoginOutlined />}
                      className="w-full h-11 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg border-0 text-sm sm:text-base transition-all"
                    >
                      Login
                    </Button>
                  </Form.Item>

                  {/* Don't have an account link */}
                  <div className="text-center pt-1 text-xs sm:text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      to="/userregister"
                      className="font-semibold text-indigo-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                </Form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
