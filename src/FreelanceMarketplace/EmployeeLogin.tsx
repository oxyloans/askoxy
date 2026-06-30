import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import axios from "axios";
import BASE_URL from "../Config";
import { useNavigate, Link } from "react-router-dom";
import {
  getEmployeePreviousPath,
  clearEmployeePreviousPath,
} from "../utils/employeeTokenManager";
import {
  setFreelanceAccessToken,
  setFreelanceRefreshToken,
  getFreelanceAccessToken,
  removeFreelanceAccessToken,
  removeFreelanceRefreshToken,
} from "../utils/cookieUtils";
import {
  MailOutlined,
  LockOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import StatusAlert from "./StatusAlert";
import AuthSplitLayout from "./AuthSplitLayout";
import {
  extractApiError,
  extractResponseMessage,
  isSuccessStatus,
  UserEmailPasswordResponse,
} from "./apiUtils";
import {
  emailRules,
  loginPasswordRules,
  normalizeEmail,
} from "./authValidation";

const submitBtnClass =
  "h-10 rounded-lg border-0 bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:!bg-indigo-700 focus:!bg-indigo-700";

const EmployeeLogin: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If redirected here due to token expiry, session is already cleared — don't auto-redirect
    const wasExpired = sessionStorage.getItem("redirectPath");
    if (wasExpired) return;

    const token = getFreelanceAccessToken();
    const type = sessionStorage.getItem("primaryType");

    // If token exists but primaryType is not COMPANY, clear stale f_at and stay on login
    if (token && type !== "COMPANY") {
      removeFreelanceAccessToken();
      removeFreelanceRefreshToken();
      return;
    }

    if (token && type === "COMPANY") {
      const previousPath = getEmployeePreviousPath();
      const redirectPath = previousPath || "/employee-dashboard";
      window.history.replaceState(null, "", redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogin = async (values: {
    email: string;
    password: string;
  }): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setAccessDenied(false);
    setUserType(null);

    try {
      const response = await axios.post<UserEmailPasswordResponse>(
        `${BASE_URL}/user-service/userEmailPassword`,
        {
          email: normalizeEmail(values.email),
          password: values.password.trim(),
        }
      );

      const { data } = response;
      const apiStatus = data.status?.trim() || null;

      if (isSuccessStatus(apiStatus) && data.token) {
        const { token, refreshToke, id, name, primaryType } = data;

        if (primaryType !== "COMPANY") {
          setAccessDenied(true);
          setUserType(primaryType || "Unknown");
          removeFreelanceAccessToken();
          removeFreelanceRefreshToken();
          setLoading(false);
          return;
        }

        setFreelanceAccessToken(token);
        if (refreshToke) setFreelanceRefreshToken(refreshToke);
        if (id) sessionStorage.setItem("userId", id);
        if (name) sessionStorage.setItem("Name", name);
        sessionStorage.setItem("primaryType", "COMPANY");
        setSuccessMessage(apiStatus || extractResponseMessage(data) || null);

        setTimeout(() => {
          const savedRedirect = sessionStorage.getItem("redirectPath");
          sessionStorage.removeItem("redirectPath");
          const previousPath = getEmployeePreviousPath();
          const redirectPath = savedRedirect || previousPath || "/employee-dashboard";
          clearEmployeePreviousPath();
          navigate(redirectPath, { replace: true });
        }, 1200);
      } else {
        setError(
          extractResponseMessage(data) ||
            apiStatus ||
            "Login failed. Please try again."
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (accessDenied) {
    return (
      <AuthSplitLayout
        formHeading="Access Denied"
        welcomeTitle="Welcome to AskOxy"
        backLink={{ to: "/freelance-selection", label: "Back to Choice" }}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <ExclamationCircleOutlined className="text-xl text-red-500" />
          </div>
          <p className="mb-5 text-sm leading-relaxed text-slate-500">
            Your account type ({userType}) is not registered as an Employer.
            This portal is only for hiring companies.
          </p>
          <button
            type="button"
            onClick={() => {
              setAccessDenied(false);
              setUserType(null);
            }}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Try Another Account
          </button>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      formHeading="Login"
      welcomeTitle="Welcome to AskOxy"
      welcomeSubtitle={
        <>
          Need an account?{" "}
          <Link
            to="/employee-register"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Sign Up
          </Link>
        </>
      }
      backLink={{ to: "/", label: "Back to Choice" }}
    >
      {successMessage && (
        <StatusAlert message={successMessage} variant="success" />
      )}
      {error && (
        <StatusAlert
          message={error}
          variant="error"
          onDismiss={() => setError(null)}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleLogin}
        autoComplete="off"
        requiredMark={false}
        validateTrigger={["onBlur", "onChange"]}
      >
        <Form.Item
          label={
            <>
              Email <span className="text-red-500">*</span>
            </>
          }
          name="email"
          rules={emailRules}
        >
          <Input
            prefix={<MailOutlined className="text-slate-400" />}
            placeholder="name@company.com"
            size="large"
            type="email"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          label={
            <>
              Password <span className="text-red-500">*</span>
            </>
          }
          name="password"
          rules={loginPasswordRules}
        >
          <Input.Password
            prefix={<LockOutlined className="text-slate-400" />}
            placeholder="Enter your password"
            size="large"
            autoComplete="current-password"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
          className={submitBtnClass}
        >
          {loading ? "Signing in..." : "Login"}
        </Button>
      </Form>
    </AuthSplitLayout>
  );
};

export default EmployeeLogin;
