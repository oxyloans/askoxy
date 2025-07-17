import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Alert,
  message,
  Card,
  Typography,
  Divider,
  Space,
} from "antd";
import axios, { AxiosError } from "axios";
import BASE_URL from "../Config";
import { useNavigate, Link } from "react-router-dom";
import {
  MailOutlined,
  LockOutlined,
  LoginOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface LoginResponse {
  status: string;
  token?: string;
  refreshToken?: string;
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

  // Redirect if already logged in
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    const type = sessionStorage.getItem("primaryType");
    if (token && type === "EMPLOYEE") {
      navigate("/userPanelLayout");
    }
  }, [navigate]);

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setAccessDenied(false);
    setUserType(null);

    if (!email || !password) {
      setError("Please fill in both email and password fields");
      setLoading(false);
      return;
    }

    const payload = { email, password };

    try {
      const response = await axios.post<LoginResponse>(
        `${BASE_URL}/user-service/userEmailPassword`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 seconds timeout (fixed from 1000)
        }
      );

      if (response.data.status === "Login Successful" && response.data.token) {
        const { token, refreshToken, id, name, primaryType } = response.data;

        // Store user info in localStorage
        sessionStorage.setItem("accessToken", token);
        if (refreshToken) sessionStorage.setItem("refreshToken", refreshToken);
        if (id) sessionStorage.setItem("userId", id);
        if (name) sessionStorage.setItem("Name", name);
        if (primaryType) sessionStorage.setItem("primaryType", primaryType);

        // Handle different user types
        if (primaryType === "EMPLOYEE") {
          message.success({
            content: "Login successful! Redirecting to dashboard...",
            icon: <LoginOutlined />,
            className: "custom-message-success",
            duration: 2,
          });

          // Slight delay for user to see success message
          setTimeout(() => {
            navigate("/userPanelLayout");
          }, 1000);
        } else if (
          primaryType === "SELLER" ||
          primaryType === "HELPDESKADMIN"
        ) {
          setAccessDenied(true);
          setUserType(primaryType);

          // Remove token for non-EMPLOYEE users
          localStorage.removeItem("accessToken");
        } else {
          setError("Invalid user type. Please contact support.");
        }
      } else {
        setError(response.data.errorMessage || "Invalid credentials provided");
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<LoginErrorResponse>;
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

  const inputStyle = {
    height: "48px",
    width: "100%",
    fontSize: "16px",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-4">
      <Card
        className="w-full max-w-md shadow-xl rounded-lg overflow-hidden border-0"
        bodyStyle={{ padding: "2rem" }}
      >
        {accessDenied ? (
          <div className="text-center">
            <ExclamationCircleOutlined
              style={{ fontSize: 64, color: "#f5222d" }}
            />
            <Title level={3} className="font-medium text-gray-700 mt-4">
              Access Denied
            </Title>
            <Paragraph className="mb-6 text-gray-600">
              Your account type ({userType}) does not have access to the Task
              Management system. This portal is only available for EMPLOYEE
              accounts.
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
                className="w-full rounded-md font-medium shadow-md bg-blue-600 hover:bg-blue-500"
                icon={<UserOutlined />}
                style={{ height: "48px" }}
              >
                Try Different Account
              </Button>
              <Button
                type="link"
                className="w-full rounded-md font-medium text-gray-600 hover:text-gray-800"
                href="mailto:support@example.com"
              >
                Contact Support
              </Button>
            </Space>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <Title level={3} className="font-medium text-gray-700 m-0">
                Login to Task Management
              </Title>
              <Text type="secondary">
                Enter your credentials to access the system
              </Text>
            </div>

            <Form layout="vertical" size="large" onFinish={handleLogin}>
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">
                    Email Address
                  </span>
                }
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
                className="mb-4"
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400 mr-2" />}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="rounded-md"
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">Password</span>
                }
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
                  },
                ]}
                className="mb-6"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400 mr-2" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="rounded-md"
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item className="mb-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<LoginOutlined />}
                  className="w-full rounded-md font-medium shadow-md bg-blue-600 hover:bg-blue-500"
                  style={{ height: "48px" }}
                >
                  Login
                </Button>
              </Form.Item>

              {error && (
                <div className="flex justify-center w-full px-4 mt-4">
                  <div className="max-w-md w-full">
                    <p className="text-red-700 bg-red-100 px-4 py-2 rounded-md text-sm text-center break-words">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              <Divider className="my-6">
                <Text className="text-gray-400">OR</Text>
              </Divider>

              <div className="text-center">
                <Text className="text-gray-600">Don't have an account?</Text>
                <Link to="/userregister">
                  <Button
                    type="link"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            </Form>
          </>
        )}
      </Card>
    </div>
  );
};

export default UserLogin;
