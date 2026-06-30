import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import axios from "axios";
import BASE_URL from "../Config";
import { Link, useNavigate } from "react-router-dom";
import {
  MailOutlined,
  LockOutlined,
  UserAddOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import StatusAlert from "./StatusAlert";
import AuthSplitLayout from "./AuthSplitLayout";
import OtpInput from "./OtpInput";
import {
  extractApiError,
  extractResponseMessage,
  isSuccessStatus,
  UserEmailPasswordResponse,
} from "./apiUtils";
import {
  emailRules,
  registerPasswordRules,
  otpRules,
  nameRules,
  normalizeEmail,
} from "./authValidation";

const submitBtnClass =
  "h-9 rounded-lg border-0 bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:!bg-indigo-700 focus:!bg-indigo-700";

const compactInputClass =
  "!h-9 !rounded-lg !text-sm [&_.ant-input]:!text-sm";

const EmployeeRegister: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState<boolean>(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);
  const [emailOtpSession, setEmailOtpSession] = useState<string>("");
  const [salt, setSalt] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (registrationSuccess && successMessage) {
      const redirectTimer = setTimeout(() => {
        navigate("/employee-login", { replace: true });
      }, 2000);
      return () => clearTimeout(redirectTimer);
    }
  }, [registrationSuccess, successMessage, navigate]);

  const handleEmailSubmit = async (values: { email: string }): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post<UserEmailPasswordResponse>(
        `${BASE_URL}/user-service/userEmailPassword`,
        { email: normalizeEmail(values.email) }
      );

      const { data } = response;

      if (data.emailOtpSession && data.salt) {
        setEmail(normalizeEmail(values.email));
        setEmailOtpSession(data.emailOtpSession);
        setSalt(data.salt);
        setIsEmailSubmitted(true);
        form.resetFields();
        const otpMessage = extractResponseMessage(data);
        if (otpMessage) setSuccessMessage(otpMessage);
      } else {
        setError(
          extractResponseMessage(data) ||
            "Could not initiate registration. Please try again."
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOtp = async (values: {
    emailOtp: string;
    password: string;
    name: string;
  }): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post<UserEmailPasswordResponse>(
        `${BASE_URL}/user-service/userEmailPassword`,
        {
          email,
          emailOtp: values.emailOtp.trim(),
          emailOtpSession,
          password: values.password.trim(),
          primaryType: "COMPANY",
          salt,
          name: values.name.trim(),
        }
      );

      const { data } = response;
      const apiStatus = data.status?.trim() || null;

      if (isSuccessStatus(apiStatus)) {
        setSuccessMessage(apiStatus || extractResponseMessage(data) || null);
        setRegistrationSuccess(true);
      } else {
        setError(
          extractResponseMessage(data) ||
            apiStatus ||
            "Registration could not be completed."
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const onFormFinish = (values: {
    email?: string;
    emailOtp?: string;
    password?: string;
    name?: string;
  }) => {
    if (!isEmailSubmitted && values.email) {
      handleEmailSubmit({ email: values.email });
    } else if (values.emailOtp && values.password && values.name) {
      handleSubmitOtp({
        emailOtp: values.emailOtp,
        password: values.password,
        name: values.name,
      });
    }
  };

  if (registrationSuccess) {
    return (
      <AuthSplitLayout
        formHeading="Registration Complete"
        welcomeTitle="Welcome to AskOxy"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircleOutlined className="text-2xl text-emerald-500" />
          </div>
          {successMessage && (
            <StatusAlert message={successMessage} variant="success" />
          )}
          <p className="text-sm text-slate-500">Redirecting you to sign in...</p>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      formHeading={!isEmailSubmitted ? "Register" : "Verify & Complete"}
      welcomeTitle="Welcome to AskOxy"
      welcomeSubtitle={
        <>
          Already have an account?{" "}
          <Link
            to="/employee-login"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Sign In
          </Link>
        </>
      }
      backLink={{ to: "/employee-login", label: "Back to Login" }}
      compact={isEmailSubmitted}
    >
      <div className="mb-3 flex items-center gap-2">
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${
            !isEmailSubmitted
              ? "bg-indigo-600 text-white"
              : "bg-emerald-500 text-white"
          }`}
        >
          {!isEmailSubmitted ? "1" : "✓"}
        </div>
        <div className="h-px w-5 bg-slate-200" />
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${
            isEmailSubmitted
              ? "bg-indigo-600 text-white"
              : "bg-slate-200 text-slate-400"
          }`}
        >
          2
        </div>
        <span className="text-[11px] text-slate-400">
          {!isEmailSubmitted ? "Email" : "OTP & details"}
        </span>
      </div>

      {successMessage && !registrationSuccess && (
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
        autoComplete="off"
        onFinish={onFormFinish}
        requiredMark={false}
        validateTrigger={["onBlur", "onChange"]}
        className={isEmailSubmitted ? "register-step-compact" : undefined}
      >
        {!isEmailSubmitted ? (
          <>
            <Form.Item
              label={
                <>
                  Company Email <span className="text-red-500">*</span>
                </>
              }
              name="email"
              rules={emailRules}
            >
              <Input
                prefix={<MailOutlined className="text-slate-400" />}
                placeholder="name@company.com"
                size="middle"
                type="email"
                autoComplete="email"
                className={compactInputClass}
              />
            </Form.Item>

            <Button
              type="primary"
              block
              htmlType="submit"
              loading={loading}
              icon={!loading ? <MailOutlined /> : undefined}
              className={submitBtnClass}
            >
              {loading ? "Sending OTP..." : "Send Verification Code"}
            </Button>
          </>
        ) : (
          <div className="space-y-1">
            <div className="mb-2">
              <p className="mb-1 text-xs font-medium text-slate-600">Email</p>
              <div className="truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                {email}
              </div>
            </div>

            <Form.Item
              label={
                <>
                  Enter OTP <span className="text-red-500">*</span>
                </>
              }
              name="emailOtp"
              rules={otpRules}
              className="!mb-2"
            >
              <OtpInput disabled={loading} />
            </Form.Item>
            <p className="-mt-1 mb-2 text-[10px] text-slate-400">
              6-digit code sent to your email
            </p>

            <Form.Item
              label={
                <>
                  Name <span className="text-red-500">*</span>
                </>
              }
              name="name"
              rules={nameRules}
              className="!mb-2"
            >
              <Input
                prefix={<UserOutlined className="text-slate-400 text-xs" />}
                placeholder="Company or CEO name"
                size="middle"
                autoComplete="name"
                className={compactInputClass}
              />
            </Form.Item>

            <Form.Item
              label={
                <>
                  Password <span className="text-red-500">*</span>
                </>
              }
              name="password"
              rules={registerPasswordRules}
              className="!mb-3"
              extra={
                <span className="text-[10px] leading-tight text-slate-400">
                  8–16 chars · number · special char
                </span>
              }
            >
              <Input.Password
                prefix={<LockOutlined className="text-slate-400 text-xs" />}
                placeholder="Create password"
                size="middle"
                autoComplete="new-password"
                className={compactInputClass}
              />
            </Form.Item>

            <Button
              type="primary"
              block
              htmlType="submit"
              loading={loading}
              icon={!loading ? <UserAddOutlined /> : undefined}
              className={submitBtnClass}
            >
              {loading ? "Creating account..." : "Complete Registration"}
            </Button>

            <button
              type="button"
              className="mt-2 w-full text-center text-[11px] text-slate-400 transition hover:text-indigo-600"
              onClick={() => {
                setIsEmailSubmitted(false);
                form.resetFields();
                setError(null);
                setSuccessMessage(null);
              }}
            >
              Use a different email
            </button>
          </div>
        )}
      </Form>
    </AuthSplitLayout>
  );
};

export default EmployeeRegister;
