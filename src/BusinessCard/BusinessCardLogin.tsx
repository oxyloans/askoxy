import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Form, Input, Result } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { ArrowLeft } from "lucide-react";
import BASE_URL from "../Config";
import { getIntendedRoute, clearIntendedRoute } from "../utils/taskTokenManager";
import {
  setBusinessCardAccessToken,
  setBusinessCardRefreshToken,
  getBusinessCardAccessToken,
  removeBusinessCardAccessToken,
  removeBusinessCardRefreshToken,
} from "../utils/cookieUtils";
import { AuthShell, PrimaryButton } from "./businessCardUi";
import {
  showAuthError,
  showAuthSuccess,
  showAuthWarning,
} from "./businessCardAuthUtils";

const DEFAULT_ROUTE = "/business-card/ceo-details";

interface LoginResponse {
  status: string;
  token?: string;
  refreshToke?: string;
  id?: string;
  name?: string;
  email?: string;
  userEmail?: string;
  primaryType?: string;
  errorMessage?: string;
}

interface LoginErrorResponse {
  message?: string;
  error?: string;
}

const BusinessCardLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getBusinessCardAccessToken();
    const type = sessionStorage.getItem("primaryType");
    if (token && type === "BUSINESSCARD") {
      window.history.replaceState(null, "", DEFAULT_ROUTE);
      navigate(DEFAULT_ROUTE, { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setAccessDenied(false);
    setUserType(null);

    try {
      const response = await axios.post<LoginResponse>(
        `${BASE_URL}/user-service/userEmailPassword`,
        values,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      if (response.data.status === "Login Successful" && response.data.token) {
        const { token, refreshToke, id, name, email: responseEmail, userEmail, primaryType } = response.data;

        setBusinessCardAccessToken(token);
        if (refreshToke) setBusinessCardRefreshToken(refreshToke);
        if (id) sessionStorage.setItem("userId", id);
        if (primaryType) sessionStorage.setItem("primaryType", primaryType);

        if (primaryType === "BUSINESSCARD") {
          const email = (responseEmail || userEmail || values.email).trim().toLowerCase();
          const fallbackName = email
            .split("@")[0]
            .replace(/[._-]+/g, " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
          sessionStorage.setItem("Name", name?.trim() || fallbackName || "User");
          sessionStorage.setItem("Email", email);
          showAuthSuccess("Login successful! Redirecting...", 1500);

          setTimeout(() => {
            const intended = getIntendedRoute();
            clearIntendedRoute();
            const destination =
              intended?.startsWith("/business-card") ? intended : DEFAULT_ROUTE;
            window.history.replaceState(null, "", destination);
            navigate(destination, { replace: true });
          }, 1000);
        } else if (
          primaryType === "SELLER" ||
          primaryType === "HELPDESKADMIN"
        ) {
          setAccessDenied(true);
          setUserType(primaryType);
          removeBusinessCardAccessToken();
          removeBusinessCardRefreshToken();
          showAuthWarning(
            `Access denied. ${primaryType} accounts cannot use the Business Card portal.`
          );
        } else {
          showAuthError("Invalid user type. Please contact support.");
        }
      } else {
        showAuthError(response.data.errorMessage || "Invalid credentials provided.");
      }
    } catch (err) {
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

      showAuthError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      mode="login"
      formTitle="Login"
      authPrompt={
        <>
          Need an account?{" "}
          <Link
            to="/business-card/register"
            className="ml-1 inline-flex items-center text-xs font-semibold !text-sky-600 transition-colors hover:!text-sky-800 sm:text-sm"
          >
            Sign Up
          </Link>
        </>
      }
    >
      {accessDenied ? (
        <Result
          status="403"
          title="Access denied"
          subTitle={`Your account type (${userType}) does not have access to Business Card. This portal is only available for BUSINESSCARD accounts.`}
          extra={
            <PrimaryButton
              block
              size="middle"
              icon={<UserOutlined />}
              onClick={() => {
                setAccessDenied(false);
                setUserType(null);
                form.resetFields();
              }}
            >
              Try another account
            </PrimaryButton>
          }
        />
      ) : (
        <Form
          form={form}
          layout="vertical"
          size="middle"
          onFinish={handleLogin}
          requiredMark
          autoComplete="off"
          className="[&_.ant-form-item]:!mb-3 [&_.ant-form-item-label]:!pb-1.5 [&_.ant-form-item-label>label]:!text-sm [&_.ant-form-item-label>label]:!font-semibold [&_.ant-form-item-label>label]:!text-slate-700 sm:[&_.ant-form-item]:!mb-4"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email." },
              { type: "email", message: "Enter a valid email address." },
            ]}
          >
            <Input
              className="!h-10 !rounded-lg !px-3 !text-sm shadow-sm transition-shadow focus-within:!shadow-[0_0_0_3px_rgba(8,145,178,0.12)]"
              prefix={<MailOutlined style={{ color: "rgba(0,0,0,0.35)" }} />}
              placeholder="name@company.com"
              autoComplete="email"
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password." }]}
          >
            <Input.Password
              className="!h-10 !rounded-lg !px-3 !text-sm shadow-sm transition-shadow focus-within:!shadow-[0_0_0_3px_rgba(8,145,178,0.12)]"
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,0.35)" }} />}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </Form.Item>
          <Form.Item className="!mb-0 !mt-2">
            <PrimaryButton htmlType="submit" loading={loading} block size="large" className="!h-10 !rounded-lg !border-sky-600 !bg-sky-600 !text-sm !font-semibold !text-white shadow-sm transition-colors hover:!border-sky-700 hover:!bg-sky-700 focus:!border-sky-700 focus:!bg-sky-700">
              Login
            </PrimaryButton>
          </Form.Item>
        </Form>
      )}
      <div className="mt-4 border-t border-slate-100 pt-3 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium !text-slate-500 transition-colors hover:!text-sky-700 sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Choice
        </Link>
      </div>
    </AuthShell>
  );
};

export default BusinessCardLogin;
