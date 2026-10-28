import React from 'react';
import { Result, Button, Space } from 'antd';
import { useOxyNavigate } from '../utils/navigation';

const Unauthorized = () => {
  const { navigate } = useOxyNavigate();
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken');
  const primaryType =
    localStorage.getItem('primaryType') ||
    localStorage.getItem('admin_primaryType');

  const handleDashboard = () => {
    const pType = (primaryType || '').toUpperCase().trim();
    if (pType === 'HELPDESKADMIN' || pType === 'HELPDESKSUPERADMIN') {
      navigate('/oxyvisit/dashboard/categories');
    } else if (pType === 'OXYVISIT') {
      navigate('/oxyvisit/dashboard');
    } else {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('refreshToken');
    localStorage.removeItem('primaryType');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
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
