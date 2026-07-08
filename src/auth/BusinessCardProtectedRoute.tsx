import React from "react";
import { Navigate } from "react-router-dom";
import { getBusinessCardAccessToken } from "../utils/cookieUtils";

interface BusinessCardProtectedRouteProps {
  children: React.ReactNode;
}

const BusinessCardProtectedRoute: React.FC<BusinessCardProtectedRouteProps> = ({
  children,
}) => {
  const accessToken = getBusinessCardAccessToken();
  const primaryType = sessionStorage.getItem("primaryType");

  if (!accessToken || primaryType !== "BUSINESSCARD") {
    return <Navigate to="/business-card/login" replace />;
  }

  return <>{children}</>;
};

export default BusinessCardProtectedRoute;
