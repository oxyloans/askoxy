import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Alert,
  Card,
  message,
  Typography,
  Divider,
} from "antd";
import axios from "axios";
import BASE_URL from "../../Config";
import { Link, useNavigate } from "react-router-dom";
import {
  MailOutlined,
  LockOutlined,
  SafetyOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface RegisterResponse {
  emailOtpSession: string;
  salt: string;
  userId: string | null;
}

const UserRegister: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [emailOtp, setEmailOtp] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [emailOtpSession, setEmailOtpSession] = useState<string>("");
  const [salt, setSalt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState<boolean>(false);
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);
  const navigate = useNavigate();

  // Effect to handle navigation after successful registration
  useEffect(() => {
    if (registrationSuccess) {
      // Show success message before redirecting
      message.success({
        content: "Registration successful! Redirecting to login...",
        icon: <UserAddOutlined />,
        className: "custom-message-success",
        duration: 1.5,
      });

      // Set immediate timeout for redirection
      const redirectTimer = setTimeout(() => {
        navigate("/userlogin", { replace: true });
      }, 1000);

      return () => clearTimeout(redirectTimer);
    }
  }, [registrationSuccess, navigate]);

  const handleEmailSubmit = async (): Promise<void> => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<RegisterResponse>(
        `${BASE_URL}/user-service/userEmailPassword`,
        { email }
      );

      if (response.data.emailOtpSession) {
        setIsEmailSubmitted(true);
        setEmailOtpSession(response.data.emailOtpSession);
        setSalt(response.data.salt);
        message.success({
          content: "OTP has been sent to your email",
          icon: <MailOutlined />,
          className: "custom-message-success",
        });
      } else {
        setError("Failed to generate OTP. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!emailOtp) {
      setError("Please enter the OTP");
      return false;
    }
    if (!name) {
      setError("Please enter your name");
      return false;
    }
    if (!password) {
      setError("Please enter the password");
      return false;
    }
    return true;
  };

  const handleSubmitOtp = async (): Promise<void> => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // Store name in local storage before API call
      localStorage.setItem("userName", name);

      // Make sure all required data is prepared
      const requestData = {
        email,
        emailOtp,
        emailOtpSession,
        password,
        primaryType: "EMPLOYEE",
        salt,
        name: name,
      };

      // Check if we have all required fields
      const requiredFields = [
        "email",
        "emailOtp",
        "emailOtpSession",
        "password",
        "salt",
        "name",
      ];
      const missingFields = requiredFields.filter(
        (field) => !requestData[field as keyof typeof requestData]
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      const response = await axios.post<RegisterResponse>(
        `${BASE_URL}/user-service/userEmailPassword`,
        requestData
      );

      // Consider any response with status 2xx as success, even if userId is null
      // This handles cases where the API might return differently than expected
      setRegistrationSuccess(true);

      // Reset form fields
      setIsEmailSubmitted(false);
      setEmail("");
      setName("");
      setEmailOtp("");
      setPassword("");
      setEmailOtpSession("");
      setSalt("");
    } catch (err) {
      // More specific error handling
      if (axios.isAxiosError(err) && err.response) {
        // Handle API error responses
        const statusCode = err.response.status;
        if (statusCode === 400) {
          setError(
            "Invalid OTP or registration data. Please check and try again."
          );
        } else if (statusCode === 409) {
          setError(
            "Email already registered. Please use another email or login."
          );
        } else {
          setError(`Registration failed (${statusCode}). Please try again.`);
        }
      } else if (err instanceof Error) {
        // Handle other errors
        setError(err.message);
      } else {
        setError(
          "OTP verification failed. Please check your code and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-4">
      <Card
        className="w-full max-w-md shadow-xl rounded-lg overflow-hidden border-0"
        bodyStyle={{ padding: "2rem" }}
      >
        <div className="text-center mb-6">
          <Title level={2} className="font-bold text-gray-800 mb-1">
            Task Management
          </Title>
          <Title level={4} className="font-medium text-gray-600 m-0">
            Create Account
          </Title>
        </div>

        <Form layout="vertical" size="large">
          {!isEmailSubmitted ? (
            <>
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">
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
                  className="rounded-md"
                />
              </Form.Item>

              <Button
                type="primary"
                block
                onClick={handleEmailSubmit}
                loading={loading}
                className="h-10 rounded-md font-medium shadow-md bg-blue-600 hover:bg-blue-500"
              >
                Send OTP
              </Button>
            </>
          ) : (
            <>
              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">
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
                  disabled
                  className="rounded-md bg-gray-50"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">
                    One-Time Password
                  </span>
                }
                required
                className="mb-4"
              >
                <Input
                  prefix={<SafetyOutlined className="text-gray-400 mr-2" />}
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  placeholder="Enter OTP sent to email"
                  className="rounded-md"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">Full Name</span>
                }
                required
                className="mb-4"
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400 mr-2" />}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="rounded-md"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">
                    Create Password
                  </span>
                }
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
                />
              </Form.Item>

              <Button
                type="primary"
                block
                onClick={handleSubmitOtp}
                loading={loading}
                className="h-10 rounded-md font-medium shadow-md bg-blue-600 hover:bg-blue-500"
              >
                Complete Registration
              </Button>

              <Button
                type="link"
                className="mt-2 text-gray-500 hover:text-blue-500"
                onClick={() => setIsEmailSubmitted(false)}
              >
                Change Email Address
              </Button>
            </>
          )}

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
            <Text className="text-gray-600">Already registered?</Text>
            <Link to="/userlogin">
              <Button
                type="link"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default UserRegister;
