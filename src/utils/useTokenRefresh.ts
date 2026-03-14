import { useEffect } from "react";
import {
  startTokenRefresh,
  stopTokenRefresh,
  isAuthenticated,
} from "./tokenRefresh";

/**
 * Custom hook to automatically handle token refresh
 * Use this hook in your main App component or layout
 */
export const useTokenRefresh = () => {
  useEffect(() => {
    // Only start token refresh if user is authenticated
    if (isAuthenticated()) {
      startTokenRefresh();
    }

    // Cleanup: stop token refresh when component unmounts
    return () => {
      stopTokenRefresh();
    };
  }, []);
};
