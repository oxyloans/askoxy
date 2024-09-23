import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginScreen.css'; // Ensure you have styles for the popup in this file

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        emailOrPhone: '',
        otp: '',
    });
    const [error, setError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [message, setMessage] = useState('');
    const [otpSession, setOtpSession] = useState<string | null>(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for popup
    const [userId, setUserId] = useState('');



    const histary =useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'emailOrPhone') {
            const phoneNumberPattern = /^[0-9]*$/;
            if (!phoneNumberPattern.test(value)) {
                setError('Please enter a valid phone number');
            } else if (value.length > 10) {
                setError('');
                setCredentials({
                    ...credentials,
                    [name]: value.substring(0, 10),
                });
            } else {
                setError('');
                setCredentials({
                    ...credentials,
                    [name]: value,
                });
            }
        } else if (name === 'otp') {
            const otpPattern = /^[0-9]*$/;
            if (!otpPattern.test(value)) {
                setOtpError('Please enter a valid OTP');
            } else if (value.length > 6) {
                setOtpError('');
                setCredentials({
                    ...credentials,
                    [name]: value.substring(0, 6),
                });
            } else {
                setOtpError('');
                setCredentials({
                    ...credentials,
                    [name]: value,
                });
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (credentials.emailOrPhone.length !== 10) {
            setError('Please enter a valid phone number');
            return;
        }

        try {
            const response = await fetch('https://meta.oxyloans.com/api/auth-service/auth/registerwithMobile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobileNumber: credentials.emailOrPhone }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.mobileOtpSession === null) {
                localStorage.setItem('userId', data.userId);
                setMessage('You are Sucessfully Registered');
                setOtpSession(null);

                // Show success popup and navigate to Landingpage after 3 seconds
                setShowSuccessPopup(true);
                setTimeout(() => {
                    setShowSuccessPopup(false);
                    navigate('/'); // Navigate after 3 seconds
                }, 2000);
            } else {
                setOtpSession(data.mobileOtpSession);
                setMessage('OTP sent. Please verify.');
            }
        } catch (error) {
            setError('Failed to register. Please try again.');
            console.error('Error:', error);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('https://meta.oxyloans.com/api/auth-service/auth/registerwithMobile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobileNumber: credentials.emailOrPhone,
                    mobileOtpSession: otpSession,
                    mobileOtpValue: credentials.otp,
                }),
            });

            const data = await response.json();
            console.log('OTP Verification:', data);

            if (data.mobileVerified) {
                setMessage('OTP Verified Successfully!');
                setOtpError('');
                setOtpSession(null);

                // Show success popup and navigate to Landingpage after 3 seconds
                setShowSuccessPopup(true);
                setTimeout(() => {
                    setShowSuccessPopup(false);
                    navigate('/');
                }, 2000);
            } else {
                setOtpError('Invalid OTP');
            }
        } catch (error) {
            setOtpError('Failed to verify OTP. Please try again.');
            console.error('Error:', error);
        }
    };

    const handleChangeNumber = () => {
        setCredentials({
            emailOrPhone: '',
            otp: '',
        });
        setOtpSession(null);
        setMessage('');
        setError('');
        setOtpError('');
    };

    return (
        <div className="login-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
            {showSuccessPopup && (
                <div className="popup-message">
                    <p>{message}</p>
                </div>
            )}
            <div className="form-container">
                <h2 className="login-header">ASKOXY.AI</h2>
                <form onSubmit={otpSession ? handleOtpSubmit : handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="emailOrPhone" className="phoneNumber">
                            Phone Number
                        </label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="emailOrPhone"
                                name="emailOrPhone"
                                value={credentials.emailOrPhone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                required
                                disabled={otpSession !== null}
                            />
                        </div>
                        {error && <span className="error-message">{error}</span>}
                    </div>
                    {otpSession && (
                        <div className="form-group">
                            <label htmlFor="otp">OTP</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    value={credentials.otp}
                                    onChange={handleChange}
                                    placeholder="Enter the OTP"
                                    required
                                />
                            </div>
                            {otpError && <span className="error-message">{otpError}</span>}
                        </div>
                    )}
                    {message && !showSuccessPopup && <span className="success-message">{message}</span>}
                    <button type="submit">Submit</button>
                    {otpSession && (
                        <button type="button" onClick={handleChangeNumber} className="change-number-button">
                            Change Number
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;
