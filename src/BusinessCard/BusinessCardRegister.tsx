import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Steps } from "antd";
import { ArrowLeft } from "lucide-react";
import {
  MailOutlined,
  LockOutlined,
  SafetyOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";
import { setIntendedRoute } from "../utils/taskTokenManager";
import {
  AuthShell,
  OutlineSuccessButton,
  PrimaryButton,
  SuccessButton,
} from "./businessCardUi";
import {
  showAuthError,
  showAuthSuccess,
} from "./businessCardAuthUtils";

interface RegisterResponse {
  emailOtpSession: string;
  salt: string;
  userId: string | null;
}

const BusinessCardRegister: React.FC = () => {
  const [email, setEmail] = useState("");
  const [emailOtpSession, setEmailOtpSession] = useState("");
  const [salt, setSalt] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (registrationSuccess) {
      showAuthSuccess("Registration successful! Redirecting to login...", 1500);

      const redirectTimer = setTimeout(() => {
        const intendedRoute = localStorage.getItem("intendedRoute");
        if (intendedRoute?.startsWith("/business-card")) {
          setIntendedRoute(intendedRoute);
        }
        navigate("/business-card/login", { replace: true });
      }, 1000);

      return () => clearTimeout(redirectTimer);
    }
  }, [registrationSuccess, navigate]);

  const handleEmailSubmit = async (values: { email: string }) => {
    setLoading(true);

    try {
      const response = await axios.post<RegisterResponse>(
        `${BASE_URL}/user-service/userEmailPassword`,
        { email: values.email }
      );

      if (response.data.emailOtpSession) {
        setEmail(values.email);
        setEmailOtpSession(response.data.emailOtpSession);
        setSalt(response.data.salt);
        setStep(1);
        showAuthSuccess("OTP has been sent to your email", 2000);
      } else {
        showAuthError("Failed to generate OTP. Please try again.");
      }
    } catch {
      showAuthError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOtp = async (values: {
    emailOtp: string;
    name: string;
    password: string;
  }) => {
    setLoading(true);

    try {
      sessionStorage.setItem("Name", values.name);

      const requestData = {
        email,
        emailOtp: values.emailOtp,
        emailOtpSession,
        password: values.password,
        primaryType: "BUSINESSCARD",
        salt,
        name: values.name,
      };

      await axios.post(`${BASE_URL}/user-service/userEmailPassword`, requestData);

      setRegistrationSuccess(true);
      setStep(0);
      setEmail("");
      form.resetFields();
      setEmailOtpSession("");
      setSalt("");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const statusCode = err.response.status;
        if (statusCode === 400) {
          showAuthError("Invalid OTP or registration data. Please check and try again.");
        } else if (statusCode === 409) {
          showAuthError("Email already registered. Please use another email or login.");
        } else {
          showAuthError("Registration failed. Please try again.");
        }
      } else {
        showAuthError("Registration failed. Check your OTP and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      mode="register"
      formTitle={step === 0 ? "Register" : "Verify & complete"}
      authPrompt={
        <>
          Already have an account?{" "}
          <Link
            to="/business-card/login"
            className="ml-1 inline-flex items-center text-xs font-semibold !text-sky-600 transition-colors hover:!text-sky-800 sm:text-sm"
          >
            Sign In
          </Link>
        </>
      }
    >
      <Steps
        current={step}
        size="small"
        responsive
        className="!mb-4 sm:!mb-5 [&_.ant-steps-item-title]:!text-xs [&_.ant-steps-item-title]:!font-medium"
        items={[
          { title: "Email" },
          { title: "Verify" },
        ]}
      />

      {step === 0 ? (
        <Form
          layout="vertical"
          size="middle"
          onFinish={handleEmailSubmit}
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
          <PrimaryButton htmlType="submit" loading={loading} block size="large" className="!h-10 !rounded-lg !border-sky-600 !bg-sky-600 !text-sm !font-semibold !text-white shadow-sm transition-colors hover:!border-sky-700 hover:!bg-sky-700 focus:!border-sky-700 focus:!bg-sky-700">
            Send verification code
          </PrimaryButton>
        </Form>
      ) : (
        <Form
          form={form}
          layout="vertical"
          size="middle"
          onFinish={handleSubmitOtp}
          requiredMark
          autoComplete="off"
          className="[&_.ant-form-item]:!mb-3 [&_.ant-form-item-label]:!pb-1 [&_.ant-form-item-label>label]:!text-xs [&_.ant-form-item-label>label]:!font-semibold [&_.ant-form-item-label>label]:!text-slate-700"
        >
          <Form.Item label="Email">
            <Input className="!h-10 !rounded-lg !px-3 !text-sm" value={email} disabled prefix={<MailOutlined style={{ color: "rgba(0,0,0,0.35)" }} />} />
          </Form.Item>
          <Form.Item
            name="emailOtp"
            label="Verification code"
            rules={[{ required: true, message: "Please enter the OTP from your email." }]}
          >
            <Input
              className="!h-10 !rounded-lg !px-3 !text-sm shadow-sm"
              prefix={<SafetyOutlined style={{ color: "rgba(0,0,0,0.35)" }} />}
              placeholder="Enter OTP from email"
              maxLength={8}
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Full name"
            rules={[{ required: true, message: "Please enter your full name." }]}
          >
            <Input
              className="!h-10 !rounded-lg !px-3 !text-sm shadow-sm"
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,0.35)" }} />}
              placeholder="Your full name"
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please create a password." },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: "Use 8+ chars with upper, lower, number, and symbol.",
              },
            ]}
            extra="Use 8+ characters with upper, lower, number, and symbol."
          >
            <Input.Password
              className="!h-10 !rounded-lg !px-3 !text-sm shadow-sm"
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,0.35)" }} />}
              placeholder="Create a strong password"
              autoComplete="new-password"
            />
          </Form.Item>
          <div className="flex w-full flex-col gap-2 pt-1">
            <OutlineSuccessButton
              block
              size="large"
              className="!h-10 !rounded-lg !border-slate-300 !bg-white !text-sm !font-semibold !text-slate-700 shadow-sm transition-colors hover:!border-slate-400 hover:!bg-slate-50 hover:!text-slate-900"
              icon={<ArrowLeftOutlined />}
              onClick={() => setStep(0)}
            >
              Change email
            </OutlineSuccessButton>
            <SuccessButton htmlType="submit" loading={loading} block size="large" className="!h-10 !rounded-lg !border-sky-600 !bg-sky-600 !text-sm !font-semibold !text-white shadow-sm transition-colors hover:!border-sky-700 hover:!bg-sky-700">
              Complete registration
            </SuccessButton>
          </div>
        </Form>
      )}
      <div className="mt-4 border-t border-slate-100 pt-3 text-center">
        <Link
          to="/business-card/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium !text-slate-500 transition-colors hover:!text-sky-700 sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Login
        </Link>
      </div>
    </AuthShell>
  );
};

export default BusinessCardRegister;
