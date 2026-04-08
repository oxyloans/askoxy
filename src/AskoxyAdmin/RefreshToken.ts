import BASE_URL from "../Config";
import {
  getAdminRefreshToken,
  setAdminAccessToken,
  setAdminRefreshToken,
  removeAdminAccessToken,
  removeAdminRefreshToken,
} from "../utils/cookieUtils";

let refreshTokenInterval: NodeJS.Timeout | null = null;
let isRefreshing = false;


export const refreshAccessToken = async (): Promise<boolean> => {
  if (isRefreshing) return false;

  const refreshToken = getAdminRefreshToken();
  if (!refreshToken) return false;

  isRefreshing = true;

  try {
    const response = await fetch(`${BASE_URL}/user-service/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) throw new Error(`Token refresh failed: ${response.status}`);

    const data = await response.json();

    if (data.mobileOtpSession) setAdminAccessToken(data.mobileOtpSession);
    if (data.mobileNumber) setAdminRefreshToken(data.mobileNumber);

    isRefreshing = false;
    return true;
  } catch (error) {
    console.log('Token refresh failed, but not removing tokens - let session modal handle it');
    isRefreshing = false;
    // Don't remove tokens here - let the session modal handle the choice
    return false;
  }
};

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
