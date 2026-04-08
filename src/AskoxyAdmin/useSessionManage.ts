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
    console.log('Session Manager - User chose to logout, cleaning up tokens');
    setShowSessionModal(false);
    // Clean up tokens when user explicitly chooses to logout
    removeAdminAccessToken();
    removeAdminRefreshToken();
    onLogout();
  }, [onLogout]);

  useEffect(() => {
    const refreshToken = getAdminRefreshToken();
    const accessToken = getAdminAccessToken();

    console.log('Session Manager - Tokens:', { refreshToken: !!refreshToken, accessToken: !!accessToken });

    // If no tokens at all, don't start anything
    if (!refreshToken || !accessToken) {
      console.log('Session Manager - No tokens found, not starting session management');
      return;
    }

    console.log('Session Manager - Starting session management');
    // Start background auto-refresh while user is active
    startTokenRefresh();

    // Handle silent background refresh failure
    const backgroundRefreshCheck = setInterval(async () => {
      const token = getAdminAccessToken();
      const rToken = getAdminRefreshToken();
      if (!token || !rToken) {
        console.log('Session Manager - Tokens missing, showing session modal instead of logout');
        clearInterval(backgroundRefreshCheck);
        stopTokenRefresh();
        startTransition(() => {
          setShowSessionModal(true);
        });
      }
    }, 10 * 1000); // check every 10s if tokens got wiped

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
            console.log('Session Manager - User away too long, showing session modal');
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
  }, []);

  return {
    showSessionModal,
    refreshing,
    handleContinueSession,
    handleSessionLogout,
  };
};
