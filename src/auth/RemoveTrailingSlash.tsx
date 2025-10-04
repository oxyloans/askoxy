import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RemoveTrailingSlash: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== "/" && location.pathname.endsWith("/")) {
      const newPath = location.pathname.slice(0, -1);
      navigate(newPath + location.search, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default RemoveTrailingSlash;