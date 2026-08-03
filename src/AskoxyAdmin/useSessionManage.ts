import { useCallback, useState } from "react";
import { refreshAccessToken } from "./RefreshToken";
import {
  removeAdminAccessToken,
  removeAdminRefreshToken,
} from "../utils/cookieUtils";

/**
 * Admin session actions.
 *
 * Token expiry is handled centrally by the adminApi response interceptor. It
 * refreshes the access token after a 401 and retries the original request.
 * This hook deliberately does not run a second timer, watch tab visibility,
 * or automatically log the administrator out.
 */
export const useSessionManager = (onLogout: () => void) => {
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleContinueSession = useCallback(async () => {
    setRefreshing(true);
    const success = await refreshAccessToken();
    setRefreshing(false);

    setShowSessionModal(!success);
  }, []);

  const handleSessionLogout = useCallback(() => {
    setShowSessionModal(false);
    removeAdminAccessToken();
    removeAdminRefreshToken();
    onLogout();
  }, [onLogout]);

  return {
    showSessionModal,
    refreshing,
    handleContinueSession,
    handleSessionLogout,
  };
};
