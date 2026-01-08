import { Navigate, useLocation } from "react-router-dom";

interface RequireAuthProps {
  children: JSX.Element;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");
  const token = accessToken || userId;

  const location = useLocation();

  if (!token) {
    // ✅ Save FULL current path only if not already saved
    const fullPath = location.pathname + location.search + location.hash;
    console.log("Saving redirect path:", fullPath);

    if (!sessionStorage.getItem("redirectPath")) {
      sessionStorage.setItem("redirectPath", fullPath);
    }

    // ✅ Redirect to WhatsApp Login
    return <Navigate to="/whatsapplogin" replace />;
  }

  return children;
};

export default RequireAuth;
