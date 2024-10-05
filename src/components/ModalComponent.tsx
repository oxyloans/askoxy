import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const ModalComponent: React.FC = () => {
  const [show, setShow] = useState(true);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [pan, setPan] = useState(''); // State for PAN number
  const [panName, setPanName] = useState(''); // State for PAN name
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'whatsapp' | 'email' | 'pan'>('whatsapp');

  const handleClose = () => setShow(false);
  
  // Automatically show the modal
  useEffect(() => {
    setShow(true);
  }, []);

  const sendWhatsappOtp = async () => {
    setError(''); // Reset error state
    try {
      const response = await axios.post('http://65.0.147.157:9000/api/auth-service/auth/sendWhatsappOtp', {
        chatId: mobileNumber,
        id: "005c9bb8-8a7b-46b4-ad75-eb17539a87d7",
        message: 'Please verify your number',
        whatsappOtp: 'string', // Replace with the actual OTP if needed
      });

      if (response.status === 200) {
        setOtpSent(true);
        alert('WhatsApp OTP sent successfully!'); // You can replace this with a better UI feedback
        localStorage.setItem("whatsappOtpSession", response.data.whatsappOtpSession);
      }
    } catch (error) {
      setError('Failed to send WhatsApp OTP. Please try again.');
      console.error(error);
    }
  };

  const sendEmailOtp = async () => {
    setError(''); // Reset error state
    try {
      const response = await axios.post('http://65.0.147.157:9000/api/auth-service/auth/sendEmailOtp', {
        email: email,
        emailOtp: 'string', // Replace with the actual OTP if needed
        emailOtpSession: 'string',
        timeInMilliSeconds: new Date().getTime().toString(),
        userId: localStorage.getItem("userId"),
        whatsAppNumber: mobileNumber,
      });

      if (response.status === 200) {
        setOtpSent(true);
        alert('Email OTP sent successfully!'); // You can replace this with a better UI feedback
        localStorage.setItem("emailOtpSession", response.data.emailOtpSession);
      }
    } catch (error) {
      setError('Failed to send Email OTP. Please try again.');
      console.error(error);
    }
  };

  const sendPanOtp = async () => {
    setError(''); // Reset error state
    try {
      const response = await axios.post('http://65.0.147.157:9000/api/auth-service/auth/sendPanOtp', {
        pan: pan, // Pass the PAN number for verification
        name: panName, // Pass the name associated with the PAN
      });

      if (response.status === 200) {
        setOtpSent(true);
        alert('PAN OTP sent successfully!'); // You can replace this with a better UI feedback
        localStorage.setItem("panOtpSession", response.data.panOtpSession);
      }
    } catch (error) {
      setError('Failed to send PAN OTP. Please try again.');
      console.error(error);
    }
  };

  const verifyWhatsappOtp = async () => {
    setError(''); // Reset error state
    try {
      const response = await axios.post('http://65.0.147.157:9000/api/auth-service/auth/verifyWhatsappOtp', {
        "id": localStorage.getItem("userId"),
        "whatsappOtp": otp,
      });

      if (response.status === 200) {
        alert('WhatsApp OTP verified successfully!'); // Handle success response
        handleClose(); // Close the modal or redirect to next step
      }
    } catch (error) {
      setError('Failed to verify WhatsApp OTP. Please try again.');
      console.error(error);
    }
  };

  const verifyEmailOtp = async () => {
    setError(''); // Reset error state
    try {
      const response = await axios.post('http://65.0.147.157:9000/api/auth-service/auth/verifyEmailOtp', {
        // email: email,
        // emailOtp: otp,
        // emailOtpSession: localStorage.getItem("emailOtpSession"),
        emailOtp: otp,
        emailOtpSession: localStorage.getItem("emailOtpSession"),
        userId: localStorage.getItem("userId"),
      });

      if (response.status === 200) {
        alert('Email OTP verified successfully!'); // Handle success response
        handleClose(); // Close the modal or redirect to next step
      }
    } catch (error) {
      setError('Failed to verify Email OTP. Please try again.');
      console.error(error);
    }
  };

  const verifyPanOtp = async () => {
    setError(''); // Reset error state
    try {
      const response = await axios.post('http://65.0.147.157:9000/api/auth-service/auth/verifyPanOtp', {
        pan: pan,
        name: panName, // Include the name for verification
        otp: otp,
        panOtpSession: localStorage.getItem("panOtpSession"),
      });

      if (response.status === 200) {
        alert('PAN OTP verified successfully!'); // Handle success response
        handleClose(); // Close the modal or redirect to next step
      }
    } catch (error) {
      setError('Failed to verify PAN OTP. Please try again.');
      console.error(error);
    }
  };

  // Function to verify PAN using Cashfree API
  const verifyPanWithCashfree = async () => {
    setError(''); // Reset error state
    try {
      const response = await axios.post('https://api.cashfree.com/verification/pan', {
        name: panName,
        pan: pan,
      }, {
        headers: {
          'x-client-id': 'CF191095C9L62VE2HA3KP9U0GK5G',
          'x-client-secret': '52c4f4118b42d6844c90df588fc2b7b3a3ff6325',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        alert('PAN verified successfully with Cashfree!'); // Handle success response
        handleClose(); // Close the modal or redirect to next step
      }
    } catch (error) {
      setError('Failed to verify PAN with Cashfree. Please try again.');
      console.error(error);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        aria-labelledby="staticBackdropLabel"
      >
        <Modal.Header closeButton>
          <Modal.Title id="staticBackdropLabel">Verify</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
              <input type="radio" className="btn-check" name="verificationMethod" id="whatsapp" autoComplete="off" checked={verificationMethod === 'whatsapp'} onChange={() => setVerificationMethod('whatsapp')} />
              <label className="btn btn-outline-primary" htmlFor="whatsapp">WhatsApp Verify</label>

              <input type="radio" className="btn-check" name="verificationMethod" id="email" autoComplete="off" checked={verificationMethod === 'email'} onChange={() => setVerificationMethod('email')} />
              <label className="btn btn-outline-primary" htmlFor="email">Email Verify</label>

              <input type="radio" className="btn-check" name="verificationMethod" id="pan" autoComplete="off" checked={verificationMethod === 'pan'} onChange={() => setVerificationMethod('pan')} />
              <label className="btn btn-outline-primary" htmlFor="pan">PAN Verify</label>
            </div>
          </div>

          {verificationMethod === 'whatsapp' ? (
            <>
              {!otpSent ? (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your mobile number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={sendWhatsappOtp}>
                    Send WhatsApp OTP
                  </Button>
                </Form>
              ) : (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Enter WhatsApp OTP</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter the OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={verifyWhatsappOtp}>
                    Verify WhatsApp OTP
                  </Button>
                </Form>
              )}
            </>
          ) : verificationMethod === 'email' ? (
            <>
              {!otpSent ? (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={sendEmailOtp}>
                    Send Email OTP
                  </Button>
                </Form>
              ) : (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Enter Email OTP</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter the OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={verifyEmailOtp}>
                    Verify Email OTP
                  </Button>
                </Form>
              )}
            </>
          ) : (
            <>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>PAN Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name as per PAN"
                    value={panName}
                    onChange={(e) => setPanName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>PAN Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your PAN number"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" onClick={sendPanOtp}>
                  Send PAN OTP
                </Button>
                <Button variant="primary" onClick={verifyPanWithCashfree} style={{ marginLeft: '10px' }}>
                  Verify PAN with Cashfree
                </Button>
              </Form>
            </>
          )}

          {error && <div className="text-danger">{error}</div>}
        </Modal.Body>
      </Modal>
    </>
  );  
};

export default ModalComponent;
