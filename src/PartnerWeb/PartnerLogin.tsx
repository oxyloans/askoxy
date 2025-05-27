import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, message, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/img/logo.png";
import BASE_URL from "../Config";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    checkAutoLogin();

    // Add custom CSS to override Ant Design's focus styles
    const style = document.createElement("style");
    style.innerHTML = `
      .login-input .ant-input:focus, 
      .login-input .ant-input-affix-wrapper:focus,
      .login-input .ant-input-affix-wrapper-focused {
        background-color: white !important;
        border-color: #8b5cf6 !important;
        box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2) !important;
      }
      .login-button:hover, .login-button:focus {
        background-color: #8b5cf6 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const checkAutoLogin = async () => {
    try {
      const token = localStorage.getItem("Token");
      if (token) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Auto-login error:", error);
    }
  };

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      const loginUrl = `${BASE_URL}/user-service/userEmailPassword`;

      const response = await axios({
        method: "post",
        url: loginUrl,
        data: {
          email: values.email,
          password: values.password,
        },
      });

      if (response.data) {
        if (response.data.primaryType === "SELLER") {
          localStorage.setItem("Token", JSON.stringify(response.data));
          message.success("Login Successful! Welcome to AskOxy.AI Partner!");
          navigate("/home");
        } else {
          message.info(
            "The credentials are incorrect for partner login. Please verify and try again."
          );
        }
      } else {
        message.error(
          "Login Failed: Please check your credentials and try again."
        );
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 500) {
          message.error(
            "Server Error: The server encountered an internal error. Please try again later."
          );
        } else {
          message.error(
            "Login Failed: " +
              (error.response.data?.message ||
                "Unable to log in. Please check your credentials and try again later")
          );
        }
      } else if (error.request) {
        message.error(
          "Connection Error: Unable to connect to the server. Please check your internet connection."
        );
      } else {
        message.error("Error: An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex justify-center items-center p-4 sm:p-8">
      <Card
        className="w-full max-w-md rounded-2xl shadow-xl border-0 overflow-hidden"
        bodyStyle={{ padding: 0 }}
      >
        <div className="px-6 pt-6 pb-4 bg-white">
          <div className="flex flex-col items-center mb-4">
            <img
              src={Logo}
              alt="AskOxy.AI Logo"
              className="w-58 h-32 object-contain mb-2"
            />
            <h1 className="text-purple-900 text-2xl font-bold text-center pt-3">
              PARTNER LOGIN
            </h1>
          </div>
        </div>

        <div className="bg-purple-900 p-6 rounded-b-xl">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-4 w-full"
            initialValues={{ email: "", password: "" }}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email address" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
              className="login-input"
            >
              <Input
                prefix={<UserOutlined className="text-purple-300 mr-2" />}
                placeholder="Email Address"
                className="rounded-lg py-2 px-3 h-12"
                style={{ backgroundColor: "white" }}
                size="large"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
              className="login-input"
            >
              <Input.Password
                prefix={<LockOutlined className="text-purple-300 mr-2" />}
                placeholder="Password"
                className="rounded-lg py-2 px-3 h-12"
                style={{ backgroundColor: "white" }}
                size="large"
                disabled={loading}
              />
            </Form.Item>

            {/* <div className="flex justify-between items-center text-white mb-4">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <a className="text-purple-200 hover:text-white text-sm">
                  Forgot password?
                </a>
              </Form.Item>
            </div> */}

            <Form.Item className="mb-0">
              <button
                type="submit"
                className={`w-full rounded-lg h-12 font-medium text-lg flex items-center justify-center border-0 focus:ring-0 ${
                  loading
                    ? "bg-gray-400 hover:bg-gray-500 focus:bg-gray-500"
                    : "bg-blue-500 hover:bg-blue-600 focus:bg-blue-600"
                }`}
                disabled={loading}
              >
                <div className="flex items-center justify-center">
                  {loading ? <Spin className="mr-2" /> : null}
                  <span className="text-white">
                    {loading ? "Logging in..." : "Login"}
                  </span>
                </div>
              </button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
