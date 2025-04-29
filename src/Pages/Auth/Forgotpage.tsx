import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';

// Define types
type FormStep = 'enter-email' | 'verification' | 'reset-password' | 'success';

const ForgotPasswordPage: React.FC = () => {
  // Router hooks
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State management
  const [currentStep, setCurrentStep] = useState<FormStep>('enter-email');
  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenValidated, setTokenValidated] = useState<boolean>(false);

  // Check for token in URL on component mount
  useEffect(() => {
    const token = searchParams.get('token');
    const userEmail = searchParams.get('email');
    
    if (token && userEmail) {
      setResetToken(token);
      setEmail(userEmail);
      validateResetToken(token, userEmail);
    }
  }, [searchParams]);

  // Validate token from email link
  const validateResetToken = async (token: string, email: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('https://www.askoxy.ai/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'email',
          email: email,
          token: token,
          action: 'validate-token'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTokenValidated(true);
        setCurrentStep('reset-password');
      } else {
        setError(data.message || 'Invalid or expired reset link');
        setCurrentStep('enter-email');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setCurrentStep('enter-email');
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to previous step
  const handleGoBack = () => {
    if (currentStep === 'verification') {
      setCurrentStep('enter-email');
    } else if (currentStep === 'reset-password' && !tokenValidated) {
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
        setResetToken(data.token || '');
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
      // API call to reset password with token
      const response = await fetch('https://www.askoxy.ai/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'email',
          email: email,
          token: resetToken,
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

  // Password validation checks
  const validatePasswordStrength = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isStrong: hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const passwordCheck = validatePasswordStrength(newPassword);

  // Loading overlay
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg flex items-center space-x-3">
        <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
        <span>Processing...</span>
      </div>
    </div>
  );

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
              Enter your email address and we'll send you a link to reset your password.
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
                {isLoading ? 'Sending...' : 'Send Reset Link'}
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
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => handleSendVerificationCode({ preventDefault: () => {} } as React.FormEvent)}
                  className="text-purple-600 text-sm hover:text-purple-800"
                >
                  Didn't receive the code? Send again
                </button>
              </div>
            </div>
          </form>
        );

      case 'reset-password':
        return (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="flex items-center mb-4">
              {!tokenValidated && (
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="mr-3 text-purple-600 hover:text-purple-800"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
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
                
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-600 mb-1">Password must contain:</p>
                    <ul className="space-y-1">
                      <li className={`text-xs flex items-center ${passwordCheck.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                        <div className={`mr-1 ${passwordCheck.hasMinLength ? 'text-green-600' : 'text-gray-400'}`}>
                          <CheckCircle size={12} />
                        </div>
                        At least 8 characters
                      </li>
                      <li className={`text-xs flex items-center ${passwordCheck.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                        <div className={`mr-1 ${passwordCheck.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
                          <CheckCircle size={12} />
                        </div>
                        One uppercase letter
                      </li>
                      <li className={`text-xs flex items-center ${passwordCheck.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                        <div className={`mr-1 ${passwordCheck.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`}>
                          <CheckCircle size={12} />
                        </div>
                        One lowercase letter
                      </li>
                      <li className={`text-xs flex items-center ${passwordCheck.hasNumbers ? 'text-green-600' : 'text-gray-500'}`}>
                        <div className={`mr-1 ${passwordCheck.hasNumbers ? 'text-green-600' : 'text-gray-400'}`}>
                          <CheckCircle size={12} />
                        </div>
                        One number
                      </li>
                      <li className={`text-xs flex items-center ${passwordCheck.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                        <div className={`mr-1 ${passwordCheck.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}>
                          <CheckCircle size={12} />
                        </div>
                        One special character
                      </li>
                    </ul>
                  </div>
                )}
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all ${
                      confirmPassword && newPassword !== confirmPassword
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                    required
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <div className="text-red-600 text-xs mt-1 flex items-center">
                      <XCircle size={12} className="mr-1" />
                      Passwords don't match
                    </div>
                  )}
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
                disabled={isLoading || newPassword !== confirmPassword || !passwordCheck.isStrong}
                className={`w-full bg-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-colors ${
                  isLoading || newPassword !== confirmPassword || !passwordCheck.isStrong
                    ? 'opacity-70 cursor-not-allowed bg-purple-400'
                    : 'hover:bg-purple-700'
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
              onClick={() => navigate('/login')}
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
      {isLoading && <LoadingOverlay />}
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