// RequireAuth.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface RequireAuthProps {
  children: JSX.Element;
}

const AUTH_PAGES = ["/whatsapplogin", "/whatsappregister"];

const isAuthPage = (path: string) =>
  AUTH_PAGES.some((p) => path === p || path.startsWith(p + "?") || path.startsWith(p + "#"));

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");
  const token = accessToken || userId;

  const location = useLocation();

  if (!token) {
    const fullPath = location.pathname + location.search + location.hash;

    // ✅ Do NOT overwrite a valid redirectPath already stored
    const existing = sessionStorage.getItem("redirectPath");

    const shouldWrite =
      !existing || existing.trim() === "" || isAuthPage(existing) || existing === "/";

    // ✅ Also never store auth pages themselves as redirect target
    if (!isAuthPage(fullPath) && shouldWrite) {
      sessionStorage.setItem("redirectPath", fullPath);
    }

    return <Navigate to="/whatsapplogin" replace />;
  }

  return children;
};

export default RequireAuth;
