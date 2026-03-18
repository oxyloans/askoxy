import React from 'react';
import { Navigate } from 'react-router-dom';
import { getTaskTokens, isTokenExpired } from '../utils/taskTokenManager';

interface TaskProtectedRouteProps {
  children: React.ReactNode;
}

const TaskProtectedRoute: React.FC<TaskProtectedRouteProps> = ({ children }) => {
  const { accessToken } = getTaskTokens();
  const primaryType = sessionStorage.getItem('primaryType');

  // Check if user has valid tokens and is an EMPLOYEE
  if (!accessToken || isTokenExpired() || primaryType !== 'EMPLOYEE') {
    return <Navigate to="/userlogin" replace />;
  }

  return <>{children}</>;
};

export default TaskProtectedRoute;