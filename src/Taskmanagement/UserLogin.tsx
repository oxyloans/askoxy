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
} from "antd";
import axios, { AxiosError } from "axios";
import BASE_URL from "../Config";
import { useNavigate, Link } from "react-router-dom";
import { MailOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface LoginResponse {
  status: string;
  token?: string;
  refreshToken?: string;
  id?: string;
  name?: string;
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
  // useEffect(() => {
  //   const token = localStorage.getItem("accessToken");
  //   if (token) {
  //     navigate("/userPanelLayout");
  //   }
  // }, [navigate]);

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    setError(null);

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
          timeout: 1000, // 10 seconds timeout
        }
      );

      if (response.data.status === "Login Successful" && response.data.token) {
        const { token, refreshToken, id, name } = response.data;

        localStorage.setItem("accessToken", token);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        if (id) localStorage.setItem("userId", id);
        if (name) localStorage.setItem("userName", name);

        message.success({
          content: "Login successful! Redirecting to dashboard...",
          icon: <LoginOutlined />,
          className: "custom-message-success",
        });

        navigate("/userPanelLayout");
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
        <div className="text-center mb-6">
          <Title level={3} className="font-medium text-gray-700 m-0">
            Login to Task Management
          </Title>
        </div>

        <Form layout="vertical" size="large" onFinish={handleLogin}>
          <Form.Item
            label={
              <span className="text-gray-700 font-medium">Email Address</span>
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
            label={<span className="text-gray-700 font-medium">Password</span>}
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
            <Alert
              message={error}
              type="error"
              showIcon
              className="mt-4 rounded-md"
              closable
              onClose={() => setError(null)}
            />
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
      </Card>
    </div>
  );
};

export default UserLogin;
