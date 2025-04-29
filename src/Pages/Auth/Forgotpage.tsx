import React, { useState } from 'react';
import { ArrowLeft, Mail, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

// Define types
type FormStep = 'enter-email' | 'verification' | 'reset-password' | 'success';

const ForgotPasswordPage: React.FC = () => {
  // State management
  const [currentStep, setCurrentStep] = useState<FormStep>('enter-email');
  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Go back to previous step
  const handleGoBack = () => {
    if (currentStep === 'verification') {
      setCurrentStep('enter-email');
    } else if (currentStep === 'reset-password') {
      setCurrentStep('verification');
    }
    setError('');
  };

  // Handle form submission for email
  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // API call to send verification code
      const response = await fetch('https://www.askoxy.ai/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'email',
          email: email,
          action: 'send-code'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStep('verification');
      } else {
        setError(data.message || 'Failed to send verification code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // API call to verify code
      const response = await fetch('https://www.askoxy.ai/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'email',
          email: email,
          code: verificationCode,
          action: 'verify-code'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStep('reset-password');
      } else {
        setError(data.message || 'Invalid verification code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // API call to reset password
      const response = await fetch('https://www.askoxy.ai/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'email',
          email: email,
          code: verificationCode,
          password: newPassword,
          action: 'reset-password'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStep('success');
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render different form steps
  const renderFormStep = () => {
    switch (currentStep) {
      case 'enter-email':
        return (
          <form onSubmit={handleSendVerificationCode} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
              Forgot Password
            </h2>
            
            <p className="text-gray-600 text-center text-sm md:text-base">
              Enter your email address and we'll send you a verification code to reset your password.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="flex items-center">
                  <div className="mr-3 text-purple-600">
                    <Mail size={20} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center text-sm">
                  <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </div>
          </form>
        );

      case 'verification':
        return (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="flex items-center mb-4">
              <button
                type="button"
                onClick={handleGoBack}
                className="mr-3 text-purple-600 hover:text-purple-800"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Verify Code</h2>
            </div>
            
            <p className="text-gray-600 text-sm md:text-base">
              We've sent a verification code to your email <span className="font-medium">({email})</span>.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  placeholder="Enter verification code"
                  required
                />
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center text-sm">
                  <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
          </form>
        );

      case 'reset-password':
        return (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="flex items-center mb-4">
              <button
                type="button"
                onClick={handleGoBack}
                className="mr-3 text-purple-600 hover:text-purple-800"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Reset Password</h2>
            </div>
            
            <p className="text-gray-600 text-sm md:text-base">
              Create a new password for your account.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                    placeholder="Enter new password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center text-sm">
                  <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Updating...' : 'Reset Password'}
              </button>
            </div>
          </form>
        );

      case 'success':
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Password Reset Successfully
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Your password has been updated successfully. You can now login with your new password.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
      </div>   
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-purple-100">
          {renderFormStep()}
        </div>
        
      </div>
    </div>
  );
};

export default ForgotPasswordPage;