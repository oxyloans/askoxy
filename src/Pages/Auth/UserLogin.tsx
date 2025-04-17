import React, { useState } from "react";
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
import axios from "axios";
import BASE_URL from "../../Config";
import { useNavigate, Link } from "react-router-dom";
import { MailOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface LoginResponse {
  status: string;
  token: string;
  refreshToken: string;
  id: string;
  errorMessage?: string;
}

const UserLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    // Validation
    if (!email) {
      setError("Please enter your email");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("Please enter your password");
      setLoading(false);
      return;
    }

    // Prepare the payload
    const payload = {
      email,
      password,
    };

    try {
      // Make the API request
      const response = await axios.post<LoginResponse>(
        `${BASE_URL}/user-service/userEmailPassword`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle successful login
      if (response.data.status === "Login Successful") {
        const { token, refreshToken, id } = response.data;

        // Store tokens and user details in local storage
        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", id);

        // Notify the user and navigate to the dashboard
        message.success({
          content: "Login successful! Redirecting to dashboard...",
          icon: <LoginOutlined />,
          className: "custom-message-success",
        });

        navigate("/userPanelLayout");
      } else {
        // Handle server error messages
        setError(response.data.errorMessage || "Invalid email or password");
      }
    } catch (error: any) {
      // Handle network or server errors
      setError(
        error.response?.data?.message ||
          "Failed to login. Please check your connection and try again."
      );
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  // Custom styles for input fields
  const inputStyle = {
    height: "48px", // Increased height for input fields
    width: "100%", // Full width within the container
    fontSize: "16px", // Slightly larger font for better readability
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
                  "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
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
              style={{ height: "48px" }} // Increased button height to match inputs
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
