import { useState, useEffect, useCallback, useRef, startTransition } from "react";
import { refreshAccessToken, startTokenRefresh, stopTokenRefresh } from "./RefreshToken";
import { getAdminAccessToken, getAdminRefreshToken, removeAdminAccessToken, removeAdminRefreshToken } from "../utils/cookieUtils";

// Time in ms after which we consider the token may be expired (5 min)
const TOKEN_EXPIRY_MS = 5 * 60 * 1000;

export const useSessionManager = (onLogout: () => void) => {
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // Track when the tab was last hidden
  const hiddenAtRef = useRef<number | null>(null);

  const handleContinueSession = useCallback(async () => {
    setRefreshing(true);
    const success = await refreshAccessToken();
    setRefreshing(false);

    if (success) {
      setShowSessionModal(false);
      // Restart the background refresh interval
      startTokenRefresh();
    } else {
      // Refresh token also expired — force logout
      onLogout();
    }
  }, [onLogout]);

  const handleSessionLogout = useCallback(() => {
    setShowSessionModal(false);
    // Clean up tokens when user explicitly chooses to logout from session modal
    removeAdminAccessToken();
    removeAdminRefreshToken();
    onLogout();
  }, [onLogout]);

  useEffect(() => {
    const refreshToken = getAdminRefreshToken();
    const accessToken = getAdminAccessToken();

    // If no tokens at all, don't start anything
    if (!refreshToken || !accessToken) return;

    // Start background auto-refresh while user is active
    startTokenRefresh();

    // Handle silent background refresh failure - this is critical!
    const backgroundRefreshCheck = setInterval(async () => {
      const token = getAdminAccessToken();
      const rToken = getAdminRefreshToken();
      
      // If no refresh token, user was logged out completely
      if (!rToken) {
        clearInterval(backgroundRefreshCheck);
        stopTokenRefresh();
        onLogout();
        return;
      }
      
      // If access token missing but refresh token exists, show modal
      if (!token && rToken && !showSessionModal) {
        stopTokenRefresh();
        startTransition(() => {
          setShowSessionModal(true);
        });
      }
    }, 10 * 1000); // check every 10s

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Record when user left the tab
        hiddenAtRef.current = Date.now();
      } else if (document.visibilityState === "visible") {
        const hiddenAt = hiddenAtRef.current;

        if (hiddenAt !== null) {
          const awayDuration = Date.now() - hiddenAt;

          if (awayDuration >= TOKEN_EXPIRY_MS) {
            // User was away long enough that token may have expired
            stopTokenRefresh();
            startTransition(() => {
              setShowSessionModal(true);
            });
          } else {
            // User came back quickly — just ensure refresh is still running
            startTokenRefresh();
          }
        }

        hiddenAtRef.current = null;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(backgroundRefreshCheck);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopTokenRefresh();
    };
  }, [showSessionModal]);

  return {
    showSessionModal,
    refreshing,
    handleContinueSession,
    handleSessionLogout,
  };
};