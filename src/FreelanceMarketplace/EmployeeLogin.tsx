import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Card,
  Typography,
  Divider,
} from "antd";
import axios, { AxiosError } from "axios";
import BASE_URL from "../Config";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import { getEmployeePreviousPath, clearEmployeePreviousPath } from "../utils/employeeTokenManager";
import { setEmployeeAccessToken, setEmployeeRefreshToken, getEmployeeAccessToken, removeEmployeeAccessToken, removeEmployeeRefreshToken } from "../utils/cookieUtils";
import { freelanceApi } from "../utils/axiosInstances";
import {
  MailOutlined,
  LockOutlined,
  LoginOutlined,
  ExclamationCircleOutlined,

} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

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
  status?: number;
  requestId?: string;
}

const EmployeeLogin: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getEmployeeAccessToken();
    const type = sessionStorage.getItem("primaryType");

    if (token && type === "COMPANY") {
      const previousPath = getEmployeePreviousPath();
      const redirectPath = previousPath || "/employee-dashboard";
      window.history.replaceState(null, "", redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]); 

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogin = async (values: any): Promise<void> => {
    setLoading(true);
    setError(null);
    setAccessDenied(false);
    setUserType(null);

    const payload = { email: values.email, password: values.password };

    try {
      const response = await freelanceApi.post<LoginResponse>(
        `${BASE_URL}/user-service/userEmailPassword`,
        payload
      );

      if (response.data.status === "Login Successful" && response.data.token) {
        const { token, refreshToke, id, name, primaryType } = response.data;

        if (primaryType !== "COMPANY") {
          setAccessDenied(true);
          setUserType(primaryType || "Unknown");
          removeEmployeeAccessToken();
          removeEmployeeRefreshToken();
          setLoading(false);
          return;
        }

        setEmployeeAccessToken(token);
        if (refreshToke) setEmployeeRefreshToken(refreshToke);
        if (id) sessionStorage.setItem("userId", id);
        if (name) sessionStorage.setItem("Name", name);
        sessionStorage.setItem("primaryType", "COMPANY");

        message.success({
          content: "Login successful! Welcome back, Employer.",
          icon: <LoginOutlined />,
          duration: 2,
        });

        setTimeout(() => {
          const previousPath = getEmployeePreviousPath();
          const redirectPath = previousPath || "/employee-dashboard";
          clearEmployeePreviousPath();
          navigate(redirectPath, { replace: true });
        }, 800);
      } else {
        setError(response.data.errorMessage || "Invalid credentials provided");
      }
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Invalid email or password format";
            break;
          case 401:
            errorMessage = "Incorrect email or password";
            break;
          case 403:
            errorMessage = "Account is locked or disabled";
            break;
          case 503:
            errorMessage = "Service temporarily unavailable. Please try again in a few moments.";
            break;
          case 504:
            errorMessage = "Gateway timeout. Please check your connection and try again.";
            break;
          default:
            errorMessage = error.response.data?.message || error.response.data?.error || "Failed to login. Please try again.";
        }
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please check your internet connection.";
      } else if (error.code === "ECONNREFUSED") {
        errorMessage = "Unable to connect to server. Please check your connection.";
      } else if (!error.response) {
        errorMessage = "Network error. Please check your internet connection.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center p-3 sm:p-4 md:p-6">
      <Card
        className="w-full max-w-sm sm:max-w-md shadow-2xl rounded-3xl overflow-hidden border-0"
        bodyStyle={{ padding: "2rem 1.5rem" }}
        style={{ background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)" }}
      >
        {accessDenied ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExclamationCircleOutlined style={{ fontSize: "32px", color: "#ef4444" }} />
            </div>
            <Title level={3} className="font-bold text-gray-800 mt-4 mb-3">
              Access Denied
            </Title>
            <Paragraph className="mb-6 text-gray-600 text-sm sm:text-base">
              Your account type ({userType}) is not registered as an Employer. This portal is for hiring companies and CEOs.
            </Paragraph>
            <Button
              type="primary"
              size="large"
              block
              onClick={() => {
                setAccessDenied(false);
                setUserType(null);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-xl h-12 font-semibold text-base"
            >
              Try Another Account
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <Title level={2} className="font-bold text-gray-900 m-0 text-2xl sm:text-3xl">
                Employee Login
              </Title>
              <Text className="text-gray-500 mt-2 block text-sm sm:text-base">
                Manage your hiring and projects efficiently
              </Text>
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
              onFinish={handleLogin}
              autoComplete="off"
            >
              <Form.Item
                label={<span className="font-semibold text-gray-700 text-sm sm:text-base">Company Email</span>}
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Please enter a valid email address" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-indigo-500" />}
                  placeholder="name@company.com"
                  size="large"
                  className="rounded-lg text-sm sm:text-base"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-semibold text-gray-700 text-sm sm:text-base">Password</span>}
                name="password"
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-indigo-500" />}
                  placeholder="••••••••"
                  size="large"
                  className="rounded-lg text-sm sm:text-base"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-lg h-12 text-base sm:text-lg font-bold shadow-lg mt-2 border-0"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>

              <Divider className="my-6">
                <Text className="text-gray-400 text-xs sm:text-sm">OR</Text>
              </Divider>

              <div className="text-center">
                <Text className="text-gray-600 text-sm sm:text-base">Don't have an account?</Text>
                <Link to="/employee-register">
                  <Button type="link" className="text-indigo-600 font-bold hover:text-indigo-700 px-2 text-sm sm:text-base">
                    Create Employee Account
                  </Button>
                </Link>
              </div>
            </Form>
          </>
        )}
      </Card>
      <Link to="/freelance-selection" className="mt-6 sm:mt-8 text-gray-500 hover:text-indigo-600 flex items-center gap-2 transition-colors text-sm sm:text-base">
        <ArrowRightOutlined className="rotate-180" /> Back to Choice
      </Link>
    </div>
  );
};

export default EmployeeLogin;
