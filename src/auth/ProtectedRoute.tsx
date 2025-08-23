import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    // 🚀 if user not logged in, go home
    return <Navigate to="/freeaibook" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
