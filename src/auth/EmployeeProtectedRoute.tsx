import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getFreelanceAccessToken } from "../utils/cookieUtils";
import { setEmployeePreviousPath } from "../utils/employeeTokenManager";

interface EmployeeProtectedRoute {
  children: React.ReactNode;
}

const EmployeeProtectedRoutes: React.FC<EmployeeProtectedRoute> = ({
  children,
}) => {
  const location = useLocation();
  const accessToken = getFreelanceAccessToken();
  const primaryType = sessionStorage.getItem("primaryType");

  useEffect(() => {
    if (accessToken && primaryType === "COMPANY") {
      setEmployeePreviousPath(location.pathname + location.search);
    }
  }, [accessToken, primaryType, location.pathname, location.search]);

  if (!accessToken || primaryType !== "COMPANY") {
    return <Navigate to="/employee-login" replace />;
  }

  return <>{children}</>;
};

export default EmployeeProtectedRoutes;
