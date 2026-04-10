import React from 'react';
import { Navigate } from 'react-router-dom';
import { getEmployeeAccessToken, getEmployeeRefreshToken } from '../utils/cookieUtils';

interface TaskProtectedRouteProps {
  children: React.ReactNode;
}

const TaskProtectedRoute: React.FC<TaskProtectedRouteProps> = ({ children }) => {
  const accessToken = getEmployeeAccessToken();
  
  const primaryType = sessionStorage.getItem('primaryType');

  if (!accessToken || primaryType !== 'EMPLOYEE') {
    return <Navigate to="/userlogin" replace />;
  }

  return <>{children}</>;
};

export default TaskProtectedRoute;
