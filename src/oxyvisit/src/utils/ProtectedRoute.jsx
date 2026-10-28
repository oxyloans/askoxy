import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken') ||
    localStorage.getItem('admin_accessToken');
  const primaryType =
    localStorage.getItem('primaryType') ||
    localStorage.getItem('admin_primaryType');

  if (!token) {
    return <Navigate to="/oxyvisit" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const normRole = (primaryType || '').toUpperCase().trim();
    const isAllowed = allowedRoles.some(
      (r) => r.toUpperCase().trim() === normRole
    );
    if (!isAllowed) {
      return <Navigate to="/oxyvisit/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
