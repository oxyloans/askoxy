import React from 'react';
import { Modal } from 'antd';

const PaymentFailedModal = ({ open, onClose, onRetry }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={400}
      centered
      closable={false}
    >
      <div className="text-center p-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-6">Your payment could not be processed. Please try again.</p>
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 py-3 px-6 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Try Again
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentFailedModal;