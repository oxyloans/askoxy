import {
  getAdminRefreshToken,
} from "../utils/cookieUtils";
import { refreshAdminAccessToken } from "../utils/tokenRefresh";

let refreshTokenInterval: NodeJS.Timeout | null = null;
export const refreshAccessToken = refreshAdminAccessToken;

export const startTokenRefresh = () => {
  stopTokenRefresh();

  if (!getAdminRefreshToken()) return;

  // Refresh once when the authenticated admin shell mounts, then keep the
  // short-lived (15 minute) access token alive while the portal is open.
  void refreshAccessToken();

  refreshTokenInterval = setInterval(() => {
    void refreshAccessToken();
  }, 5 * 60 * 1000);
};

export const stopTokenRefresh = () => {
  if (refreshTokenInterval) {
    clearInterval(refreshTokenInterval);
    refreshTokenInterval = null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!(getAdminRefreshToken());
};

export const initializeTokenRefresh = () => {
  if (isAuthenticated()) {
    startTokenRefresh();
  }
};
