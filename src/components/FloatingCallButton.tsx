import React, { useState } from 'react';
import BASE_URL from '../Config';
import { FaPhoneAlt } from "react-icons/fa";

interface CallerInfo {
  callerId: string;
  callerNumber: string;
  callerName: string;
  callerStatus: boolean;
  email: string;
}

const FloatingCallButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [callerInfo, setCallerInfo] = useState<CallerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const fetchCallerInfo = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId') || 'default-user-id';
      const response = await fetch(`${BASE_URL}/user-service/callerNumberToUserMapping/${userId}`);
      const data = await response.json();
      setCallerInfo(data);
    } catch (error) {
      console.error('Error fetching caller info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCallClick = () => {
    setIsModalOpen(true);
    fetchCallerInfo();
  };

  const copyToClipboard = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <>
      <button
        onClick={handleCallClick}
        className="fixed bottom-5 right-5 w-12 h-12 md:w-15 md:h-15 rounded-full bg-purple-600 text-white border-none text-xl md:text-2xl cursor-pointer shadow-lg hover:shadow-xl z-[9999] flex items-center justify-center transition-all duration-300 ease-in-out"
      >
        <FaPhoneAlt className="text-sm" />
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[10000] p-5"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-4 md:p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="m-0 text-gray-800 text-lg font-semibold">📞 Caller Info</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-transparent border-none text-xl cursor-pointer text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-3">
                <div className="text-2xl mb-1">⏳</div>
                <p className="text-gray-600 text-sm">Loading...</p>
              </div>
            ) : callerInfo ? (
              <div className="space-y-3">
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">👤 Name</div>
                  <div className="text-sm font-medium">{callerInfo.callerName}</div>
                </div>
                
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">📱 Phone</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{callerInfo.callerNumber}</span>
                    <button
                      onClick={() => copyToClipboard(callerInfo.callerNumber, 'phone')}
                      className={`${copiedPhone ? 'bg-green-500' : 'bg-blue-500'} text-white border-none px-2 py-1 rounded text-sm cursor-pointer hover:opacity-90 transition-colors`}
                    >
                      {copiedPhone ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
                
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">📧 Email</div>
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span
                      className="text-sm font-medium text-blue-500 cursor-pointer underline break-all flex-1 hover:text-blue-700"
                      onClick={() => handleEmailClick(callerInfo.email)}
                    >
                      {callerInfo.email}
                    </span>
                    <button
                      onClick={() => copyToClipboard(callerInfo.email, 'email')}
                      className={`${copiedEmail ? 'bg-green-500' : 'bg-blue-500'} text-white border-none px-2 py-1 rounded text-sm cursor-pointer hover:opacity-90 transition-colors`}
                    >
                      {copiedEmail ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-3">
                <div className="text-2xl mb-1">❌</div>
                <p className="text-gray-600 text-sm">No caller information available</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default FloatingCallButton;