import BASE_URL from "../Config";
import {
  getPartnerRefreshToken,
  setPartnerAccessToken,
  setPartnerRefreshToken,
  removePartnerAccessToken,
  removePartnerRefreshToken,
} from "../utils/cookieUtils";

let refreshTokenInterval: NodeJS.Timeout | null = null;
let isRefreshing = false;


export const refreshAccessToken = async (): Promise<boolean> => {
  if (isRefreshing) return false;

  const refreshToken = getPartnerRefreshToken();
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

    if (data.mobileOtpSession) setPartnerAccessToken(data.mobileOtpSession);
    if (data.mobileNumber) setPartnerRefreshToken(data.mobileNumber);

    isRefreshing = false;
    return true;
  } catch (error) {
    isRefreshing = false;
    removePartnerAccessToken();
    removePartnerRefreshToken();
    return false;
  }
};

export const startTokenRefresh = () => {
  stopTokenRefresh();

  if (!getPartnerRefreshToken()) return;

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
  return !!(getPartnerRefreshToken());
};

export const initializeTokenRefresh = () => {
  if (isAuthenticated()) {
    startTokenRefresh();
  }
};
