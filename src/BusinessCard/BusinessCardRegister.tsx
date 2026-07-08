import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Space, Steps } from "antd";
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
          Already have an account? <Link to="/business-card/login">Sign In</Link>
        </>
      }
    >
      <Steps
        current={step}
        size="small"
        responsive
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
              prefix={<MailOutlined style={{ color: "rgba(0,0,0,0.35)" }} />}
              placeholder="name@company.com"
              autoComplete="email"
              allowClear
            />
          </Form.Item>
          <PrimaryButton htmlType="submit" loading={loading} block size="middle">
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
        >
          <Form.Item label="Email">
            <Input value={email} disabled prefix={<MailOutlined style={{ color: "rgba(0,0,0,0.35)" }} />} />
          </Form.Item>
          <Form.Item
            name="emailOtp"
            label="Verification code"
            rules={[{ required: true, message: "Please enter the OTP from your email." }]}
          >
            <Input
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
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,0.35)" }} />}
              placeholder="Create a strong password"
              autoComplete="new-password"
            />
          </Form.Item>
          <Space direction="vertical" style={{ width: "100%" }} size="small">
            <OutlineSuccessButton
              block
              size="middle"
              icon={<ArrowLeftOutlined />}
              onClick={() => setStep(0)}
            >
              Change email
            </OutlineSuccessButton>
            <SuccessButton htmlType="submit" loading={loading} block size="middle">
              Complete registration
            </SuccessButton>
          </Space>
        </Form>
      )}
    </AuthShell>
  );
};

export default BusinessCardRegister;
