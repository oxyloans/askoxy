import { Navigate, useLocation } from "react-router-dom";

interface RequireAuthProps {
  children: JSX.Element;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const token = localStorage.getItem("accessToken"); // Check for authentication token
  const location = useLocation(); // Get current location

  if (!token) {
    // Redirect to login page, and store current location for redirection after login
    return <Navigate to="/whatapplogin" state={{ from: location }} replace />;
  }

  return children; // Allow access if authenticated
};

export default RequireAuth;
