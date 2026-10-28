import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useOxyNavigate } from '../utils/navigation';
import { setCurrentUser } from '../utils/user';
import BASE_URL from '../core/config/Config';

function Register() {
  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailOtpSession, setEmailOtpSession] = useState('');
  const [salt, setSalt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const { navigate, getPath } = useOxyNavigate();



  const handleEmailSubmit = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Required',
        text: 'Please enter your email address to continue.',
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address (e.g. name@example.com).',
      });
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/user-service/userEmailPassword`, { email: cleanEmail });

      // Check if backend returned an error in a 200 response
      if (response.data?.errorMessage) {
        const msg = response.data.errorMessage;
        const isExists = msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exist');
        Swal.fire({
          icon: isExists ? 'info' : 'error',
          title: isExists ? 'Account Already Exists' : 'Registration Failed',
          text: msg,
          confirmButtonText: isExists ? 'Go to Login' : 'OK',
          showCancelButton: isExists,
          cancelButtonText: 'Try Another Email',
        }).then((result) => {
          if (isExists && result.isConfirmed) {
            localStorage.setItem('savedEmail', cleanEmail);
            navigate('/oxyvisit');
          }
        });
        return;
      }

      if (response.data?.emailOtpSession) {
        setIsEmailSubmitted(true);
        setEmailOtpSession(response.data.emailOtpSession);
        setSalt(response.data.salt || '');
        Swal.fire({
          icon: 'success',
          title: 'OTP Sent Successfully!',
          text: `A 6-digit OTP has been sent to ${cleanEmail}. Please enter it below.`,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        const errorText = response.data?.status || response.data?.message || 'Unable to generate verification OTP. Please try again.';
        Swal.fire({
          icon: 'error',
          title: 'Could Not Send OTP',
          text: errorText,
        });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.errorMessage ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.status ||
        (err.message?.includes('Network Error') ? 'Network error. Please check your internet connection.' : 'Unable to reach server. Please try again later.');

      const isExists = errorMsg.toLowerCase().includes('already') || errorMsg.toLowerCase().includes('exist');
      Swal.fire({
        icon: isExists ? 'info' : 'error',
        title: isExists ? 'Account Already Exists' : 'Error Sending OTP',
        text: errorMsg,
        confirmButtonText: isExists ? 'Go to Login' : 'OK',
        showCancelButton: isExists,
        cancelButtonText: 'Try Another Email',
      }).then((result) => {
        if (isExists && result.isConfirmed) {
          localStorage.setItem('savedEmail', cleanEmail);
          navigate('/oxyvisit');
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOtp = async () => {
    const cleanOtp = emailOtp.trim();
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanOtp) {
      Swal.fire({ icon: 'warning', title: 'OTP Required', text: 'Please enter the 6-digit OTP sent to your email.' });
      return;
    }
    if (!cleanName) {
      Swal.fire({ icon: 'warning', title: 'Name Required', text: 'Please enter your full name.' });
      return;
    }
    if (!password) {
      Swal.fire({ icon: 'warning', title: 'Password Required', text: 'Please create a password for your account.' });
      return;
    }
    if (password.length < 8) {
      Swal.fire({ icon: 'warning', title: 'Password Too Short', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/user-service/userEmailPassword`, {
        email: cleanEmail,
        emailOtp: cleanOtp,
        emailOtpSession,
        password,
        primaryType: 'OXYVISIT',
        salt,
        name: cleanName,
      });

      if (response.data?.errorMessage) {
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: response.data.errorMessage,
        });
        return;
      }

      const isSuccess =
        (response.data?.userId !== null && response.data?.userId !== undefined) ||
        response.data?.status === 'Registration Successful' ||
        response.data?.status === 'Success';

      if (isSuccess) {
        localStorage.setItem("savedEmail", cleanEmail);
        localStorage.setItem("userName", cleanName);
        sessionStorage.setItem("userName", cleanName);
        sessionStorage.setItem("Name", cleanName);
        setCurrentUser({
          id: response.data?.userId || '',
          userId: response.data?.userId || '',
          name: cleanName,
          userName: cleanName,
          primaryType: 'OXYVISIT',
          email: cleanEmail,
        });
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Welcome to OxyVisits! Your account has been created. Redirecting to login...',
          timer: 2000,
          showConfirmButton: false,
        });
        setTimeout(() => navigate('/oxyvisit'), 2000);
      } else {
        const errorText = response.data?.status || response.data?.message || 'OTP verification failed. Please check your OTP and try again.';
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: errorText,
        });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.errorMessage ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.status ||
        'OTP verification failed. Please verify your OTP and try again.';
      Swal.fire({
        icon: 'error',
        title: 'Verification Error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-emerald-600">OXY</span>
            <span className="text-orange-500">VISITS</span>
          </h1>
          <p className="text-gray-500 text-sm">Create your account to get started</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 text-center">Register</h2>

          <Form layout="vertical">
            {!isEmailSubmitted ? (
              <>
                <Form.Item label={<span className="text-gray-700 font-medium text-sm">Email Address</span>} required>
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={handleEmailSubmit}
                  loading={loading}
                  className="h-12 text-base font-medium rounded-lg"
                  style={{ background: 'linear-gradient(to right, #10b981, #059669)', border: 'none' }}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </>
            ) : (
              <>
                <Form.Item
                  label={
                    <div className="flex justify-between items-center w-full">
                      <span className="text-gray-700 font-medium text-sm">Email Address</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEmailSubmitted(false);
                          setEmailOtp('');
                        }}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer underline ml-4"
                      >
                        Change Email
                      </button>
                    </div>
                  }
                  required
                >
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    type="email"
                    value={email}
                    disabled
                    size="large"
                    className="rounded-lg bg-gray-50"
                  />
                </Form.Item>

                <Form.Item label={<span className="text-gray-700 font-medium text-sm">OTP</span>} required>
                  <Input
                    prefix={<SafetyOutlined className="text-gray-400" />}
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item label={<span className="text-gray-700 font-medium text-sm">Full Name</span>} required>
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item label={<span className="text-gray-700 font-medium text-sm">Password</span>} required>
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={handleSubmitOtp}
                  loading={loading}
                  className="h-12 text-base font-medium rounded-lg"
                  style={{ background: 'linear-gradient(to right, #10b981, #059669)', border: 'none' }}
                >
                  {loading ? 'Verifying...' : 'Verify & Register'}
                </Button>
              </>
            )}

            <div className="text-center mt-6">
              <span className="text-gray-600 text-sm">Already have an account? </span>
              <Link to="/oxyvisit" className="text-emerald-600 font-semibold hover:text-emerald-700 text-sm">
                Login
              </Link>
            </div>
          </Form>
        </div>

        <div className="text-center mt-6 text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} OXYVISITS. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Register;
