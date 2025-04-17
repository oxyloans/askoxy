import React, { useState } from "react";
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
  const navigate = useNavigate();

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

      setIsEmailSubmitted(true);
      setEmailOtpSession(response.data.emailOtpSession);
      setSalt(response.data.salt);
      message.success({
        content: "OTP has been sent to your email",
        icon: <MailOutlined />,
        className: "custom-message-success",
      });
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

      const response = await axios.post<RegisterResponse>(
        `${BASE_URL}/user-service/userEmailPassword`,
        {
          email,
          emailOtp,
          emailOtpSession,
          password,
          primaryType: "EMPLOYEE",
          salt,
          name: name,
        }
      );

      message.success({
        content: "Registration successful!",
        icon: <UserAddOutlined />,
        className: "custom-message-success",
      });

      if (response.data.userId !== null) {
        setTimeout(() => {
          navigate("/userlogin");
        }, 1000);
      }

      setIsEmailSubmitted(false);
      setEmail("");
      setName("");
      setEmailOtp("");
      setPassword("");
      setEmailOtpSession("");
      setSalt("");
    } catch (err) {
      setError(
        "OTP verification failed. Please check your code and try again."
      );
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
                required
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
