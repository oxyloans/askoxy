import React from 'react';
import './modal.css'
// Modal component to confirm phone number
const Modal: React.FC<{ phoneNumber: string, onConfirm: () => void, onCancel: () => void }> = ({ phoneNumber, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 style={{color:'black'}}>Please confirm your WhatsAppumber: {phoneNumber}</h3>
        <div className="modal-buttons">
          <button onClick={onConfirm} style={{ backgroundColor: 'green', color: 'white' }}>Yes</button>
          <button onClick={onCancel} style={{ backgroundColor: 'red', color: 'white' }}>No</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
