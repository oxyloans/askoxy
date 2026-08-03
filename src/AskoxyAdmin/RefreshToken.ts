import {
  getAdminRefreshToken,
} from "../utils/cookieUtils";
import { refreshAdminAccessToken } from "../utils/tokenRefresh";

let refreshTokenInterval: NodeJS.Timeout | null = null;
export const refreshAccessToken = refreshAdminAccessToken;

export const startTokenRefresh = () => {
  stopTokenRefresh();

  if (!getAdminRefreshToken()) return;

  refreshTokenInterval = setInterval(() => {
    refreshAccessToken();
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
