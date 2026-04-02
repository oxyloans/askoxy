import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Typography,
  Divider,
} from "antd";
import axios from "axios";
import BASE_URL from "../Config";
import { Link, useNavigate } from "react-router-dom";
import { freelanceApi } from "../utils/axiosInstances";
import {
  MailOutlined,
  LockOutlined,
  SafetyOutlined,
  UserAddOutlined,
  UserOutlined,
  ShopOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface RegisterResponse {
  emailOtpSession: string;
  salt: string;
  userId: string | null;
}

const EmployeeRegister: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState<boolean>(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);
  const [emailOtpSession, setEmailOtpSession] = useState<string>("");
  const [salt, setSalt] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (registrationSuccess) {
      message.success({
        content: "Company registered successfully! Please login.",
        icon: <UserAddOutlined />,
        duration: 2,
      });

      const redirectTimer = setTimeout(() => {
        navigate("/employee-login", { replace: true });
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [registrationSuccess, navigate]);

  const handleEmailSubmit = async (values: any): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await freelanceApi.post<RegisterResponse>(
        `${BASE_URL}/user-service/userEmailPassword`,
        { email: values.email }
      );

      if (response.data.emailOtpSession) {
        setEmail(values.email);
        setEmailOtpSession(response.data.emailOtpSession);
        setSalt(response.data.salt);
        setIsEmailSubmitted(true);
        form.resetFields();
        message.success({
          content: "OTP has been sent to your email",
          icon: <MailOutlined />,
          duration: 2,
        });
      } else {
        setError("Failed to generate OTP. Please try again.");
      }
    } catch (err: any) {
      let errorMessage = "Network error. Please try again later.";

      if (axios.isAxiosError(err) && err.response) {
        switch (err.response.status) {
          case 400:
            errorMessage = "Invalid email format. Please check and try again.";
            break;
          case 409:
            errorMessage = "This email is already registered. Please login instead.";
            break;
          case 503:
            errorMessage = "Service temporarily unavailable. Please try again in a few moments.";
            break;
          case 504:
            errorMessage = "Gateway timeout. Please check your connection and try again.";
            break;
          default:
            errorMessage = err.response.data?.message || "Failed to send OTP. Please try again.";
        }
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please check your internet connection.";
      } else if (err.code === "ECONNREFUSED") {
        errorMessage = "Unable to connect to server. Please check your connection.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOtp = async (values: any): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const requestData = {
        email,
        emailOtp: values.emailOtp,
        emailOtpSession,
        password: values.password,
        primaryType: "COMPANY",
        salt,
        name: values.name,
      };

      await freelanceApi.post<RegisterResponse>(
        `${BASE_URL}/user-service/userEmailPassword`,
        requestData
      );

      setRegistrationSuccess(true);
    } catch (err: any) {
      let errorMessage = "Registration failed. Please try again.";

      if (axios.isAxiosError(err) && err.response) {
        switch (err.response.status) {
          case 400:
            errorMessage = "Invalid data provided. Please check all fields.";
            break;
          case 401:
            errorMessage = "OTP verification failed. Please request a new OTP.";
            break;
          case 409:
            errorMessage = "This email is already registered. Please login instead.";
            break;
          case 503:
            errorMessage = "Service temporarily unavailable. Please try again in a few moments.";
            break;
          case 504:
            errorMessage = "Gateway timeout. Please check your connection and try again.";
            break;
          default:
            errorMessage = err.response.data?.message || "Registration failed. Please try again.";
        }
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please check your internet connection.";
      } else if (err.code === "ECONNREFUSED") {
        errorMessage = "Unable to connect to server. Please check your connection.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onFormFinish = (values: any) => {
    if (!isEmailSubmitted) {
      handleEmailSubmit(values);
    } else {
      handleSubmitOtp(values);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 flex flex-col items-center justify-center p-3 sm:p-4 md:p-6">
      <Card
        className="w-full max-w-sm sm:max-w-md shadow-2xl rounded-3xl overflow-hidden border-0"
        bodyStyle={{ padding: "2rem 1.5rem" }}
        style={{ background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)" }}
      >
        <div className="text-center mb-8">
          <Title level={2} className="font-bold text-gray-900 mb-2 text-2xl sm:text-3xl">
            Register Employee
          </Title>
          <Paragraph className="text-gray-600 m-0 text-sm sm:text-base">
            Create your company profile and start hiring global talent today.
          </Paragraph>
        </div>

        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="font-semibold">{error}</p>
              </div>
            </div>
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={onFormFinish}
        >
          {!isEmailSubmitted ? (
            <>
              <Form.Item
                label={<span className="font-semibold text-gray-700 text-sm sm:text-base">Company Email</span>}
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Please enter a valid email address" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-purple-500" />}
                  placeholder="name@company.com"
                  size="large"
                  className="rounded-lg text-sm sm:text-base"
                />
              </Form.Item>

              <Button
                type="primary"
                block
                size="large"
                htmlType="submit"
                loading={loading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg h-12 font-bold shadow-lg border-0 text-base"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </>
          ) : (
            <>
              <Form.Item
                label={<span className="font-semibold text-gray-700 text-sm sm:text-base">Email</span>}
              >
                <Input
                  value={email}
                  disabled
                  size="large"
                  className="bg-gray-50 rounded-lg text-sm sm:text-base"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-semibold text-gray-700 text-sm sm:text-base">Enter OTP</span>}
                name="emailOtp"
                rules={[
                  { required: true, message: "OTP is required" },
                  { len: 6, message: "OTP must be 6 digits" },
                  { pattern: /^\d+$/, message: "OTP must contain only numbers" },
                ]}
              >
                <Input
                  prefix={<SafetyOutlined className="text-purple-500" />}
                  placeholder="000000"
                  size="large"
                  maxLength={6}
                  className="rounded-lg text-sm sm:text-base"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-semibold text-gray-700 text-sm sm:text-base">Company Name / CEO Name</span>}
                name="name"
                rules={[
                  { required: true, message: "Name is required" },
                  { min: 2, message: "Name must be at least 2 characters" },
                  { max: 50, message: "Name must not exceed 50 characters" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-purple-500" />}
                  placeholder="Enter full name"
                  size="large"
                  className="rounded-lg text-sm sm:text-base"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-semibold text-gray-700 text-sm sm:text-base">Set Password</span>}
                name="password"
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 8, message: "Password must be at least 8 characters" },
                  { max: 16, message: "Password must not exceed 16 characters" },
                  {
                    pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
                    message: "Password must include a number and special character (!@#$%^&*)",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-purple-500" />}
                  placeholder="Min 8 chars, number & special char"
                  size="large"
                  className="rounded-lg text-sm sm:text-base"
                />
              </Form.Item>

              <Button
                type="primary"
                block
                size="large"
                htmlType="submit"
                loading={loading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg h-12 font-bold shadow-lg border-0 text-base mt-2"
              >
                {loading ? "Setting Up..." : "Complete Company Setup"}
              </Button>

              <Button
                type="link"
                block
                className="mt-3 text-gray-500 hover:text-purple-600 text-sm sm:text-base"
                onClick={() => {
                  setIsEmailSubmitted(false);
                  form.resetFields();
                  setError(null);
                }}
              >
                Change Email
              </Button>
            </>
          )}

          <Divider className="my-6">
            <Text className="text-gray-400 text-xs sm:text-sm">OR</Text>
          </Divider>

          <div className="text-center">
            <Text className="text-gray-600 text-sm sm:text-base">Already registered?</Text>
            <Link to="/employee-login">
              <Button type="link" className="text-purple-600 font-bold hover:text-purple-700 px-2 text-sm sm:text-base">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </Form>
      </Card>
      <Link to="/freelance-selection" className="mt-6 sm:mt-8 text-gray-500 hover:text-purple-600 flex items-center gap-2 transition-colors text-sm sm:text-base">
        <ArrowRightOutlined className="rotate-180" /> Back to Choice
      </Link>
    </div>
  );
};

export default EmployeeRegister;
