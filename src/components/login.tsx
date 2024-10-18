import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
                    navigate('/Normal'); // Navigate after 3 seconds
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
                    primaryType: "ASKOXY",
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
      <div
        className="login-container"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
      
        {showSuccessPopup && (
          <div className="popup-message">
            <p>{message}</p>
          </div>
        )}

        
        <div className="form-container">
          
          <h2 className="login-header">ASKOXY.AI</h2>

          <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
            <h1 style={{textAlign:'center'}}>login with</h1>
            <div>
            <Link to="/Whatapplogin" style={{display:'flex',alignItems:'center',justifyContent:'center',margin:'10px'}}>
              <svg
                style={{
                  // border: "1px solid gray",
                  padding: "5px",
                                color: "green",
               textAlign:'center'
                }}
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                            height="35"
                            
                fill="currentColor"
                className="bi bi-whatsapp"
                viewBox="0 0 16 16"
              >
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
              </svg>
            </Link>
            {message && !showSuccessPopup && (
              <span className="success-message">{message}</span>
            )}
       
            </div>
                          
          </div>
          <p style={{textAlign:'center'}}>Or</p>
          <form onSubmit={otpSession ? handleOtpSubmit : handleSubmit}>
            <div className="form-group">
              <label htmlFor="emailOrPhone" className="phoneNumber" style={{textAlign:'center'}}>
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

       
          <button type="submit">Submit</button>
            {otpSession && (
              <button
                type="button"
                onClick={handleChangeNumber}
                className="change-number-button"
              >
                Change Number
              </button>
            )}
          </form>
        </div>
      </div>
    );
};

export default Login;
