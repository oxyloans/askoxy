import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const PanVerificationComponent: React.FC = () => {
    const [name, setName] = useState('');
    const [pan, setPan] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Function to verify PAN
    const verifyPan = async (name: string, pan: string) => {
        const url = 'https://api.cashfree.com/verification/pan';
        const headers = {
            'x-client-id': 'CF191095C9L62VE2HA3KP9U0GK5G',
            'x-client-secret': '52c4f4118b42d6844c90df588fc2b7b3a3ff6325',
            'Content-Type': 'application/json',
        };
        const body = {
            name: name,
            pan: pan,
        };

        try {
            const response = await axios.post(url, body, { headers });
            return response.data; // Return response data for further processing
        } catch (error) {
            console.error('Error verifying PAN:', error);
            throw new Error('PAN verification failed'); // Handle error appropriately
        }
    };

    const handleVerifyPan = async () => {
        setError('');
        setMessage('');

        try {
            const result = await verifyPan(name, pan);
            setMessage(`Verification successful: ${JSON.stringify(result)}`);
        } catch (error:any) {
            setError(error.message);
        }
    };

    return (
        <div>
            <Form>
                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formPan">
                    <Form.Label>PAN Number</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your PAN"
                        value={pan}
                        onChange={(e) => setPan(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleVerifyPan}>
                    Verify PAN
                </Button>
            </Form>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
        </div>
    );
};

export default PanVerificationComponent;
