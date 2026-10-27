import { useLocation, useNavigate } from "react-router-dom";

/**
 * Hook to provide base-aware navigation for OxyVisit.
 * In this project, all OxyVisit routes are housed under `/oxyvisit`.
 * The landing page for OxyVisit is `/oxyvisit`, which serves as the login page.
 */
export const useOxyNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const base = "/oxyvisit";

  const goTo = (to, options) => {
    if (typeof to === "string") {
      // If navigating to login or root of oxyvisit, always land on /oxyvisit
      if (to === "/login" || to === "" || to === "/" || to === "/oxyvisit/login") {
        navigate("/oxyvisit", options);
        return;
      }
      if (to.startsWith("/oxyvisit")) {
        navigate(to, options);
      } else if (to.startsWith("/")) {
        navigate(`${base}${to}`, options);
      } else {
        navigate(to, options);
      }
    } else {
      navigate(to, options);
    }
  };

  const getPath = (path) => {
    if (typeof path === "string") {
      if (path === "/login" || path === "" || path === "/" || path === "/oxyvisit/login") {
        return "/oxyvisit";
      }
      if (path.startsWith("/oxyvisit")) return path;
      if (path.startsWith("/")) return `${base}${path}`;
    }
    return path;
  };

  return {
    navigate: goTo,
    getPath,
    base,
    pathname: location.pathname,
  };
};
