import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token') || localStorage.getItem('admin_accessToken') || sessionStorage.getItem('accessToken');
  const primaryType = localStorage.getItem('primaryType') || localStorage.getItem('admin_primaryType');

  if (!token) {
    return <Navigate to="/oxyvisit" replace />;
  }

  if (allowedRoles && primaryType && !allowedRoles.includes(primaryType)) {
    return <Navigate to="/oxyvisit/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
