import React from 'react';
import { Result, Button, Space } from 'antd';
import { useOxyNavigate } from '../utils/navigation';

const Unauthorized = () => {
  const { navigate } = useOxyNavigate();
  const token = localStorage.getItem('token');
  const primaryType = localStorage.getItem('primaryType');

  const handleDashboard = () => {
    if (primaryType === 'HELPDESKADMIN' || primaryType === 'HELPDESKSUPERADMIN') {
      navigate('/dashboard/categories');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/oxyvisit');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Space>
            {token ? (
              <>
                <Button type="primary" onClick={handleDashboard} style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}>
                  Go to Dashboard
                </Button>
                <Button onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button type="primary" onClick={() => navigate('/oxyvisit')} style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}>
                Back to Login
              </Button>
            )}
          </Space>
        }
      />
    </div>
  );
};

export default Unauthorized;
