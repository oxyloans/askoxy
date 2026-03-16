import BASE_URL from "../Config";

let refreshTokenInterval: NodeJS.Timeout | null = null;
let isRefreshing = false;


export const refreshAccessToken = async (): Promise<boolean> => {
  if (isRefreshing) return false;

  const refreshToken = sessionStorage.getItem("partner_refreshtoken");
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

    if (data.mobileOtpSession) {
      localStorage.setItem("partner_accesstoken", data.mobileOtpSession);
      localStorage.setItem("token", data.mobileOtpSession);
    }
    if (data.mobileNumber) {
      sessionStorage.setItem("partner_refreshtoken", data.mobileNumber);
    }

    isRefreshing = false;
    return true;
  } catch (error) {
    isRefreshing = false;
    // Clear tokens — caller (useSessionManager) is responsible for redirecting
    localStorage.removeItem("partner_accesstoken");
    sessionStorage.removeItem("partner_refreshtoken");
    return false;
  }
};

/**
 * Start automatic token refresh every 5 minutes
 */
export const startTokenRefresh = () => {
  stopTokenRefresh();

  const refreshToken = sessionStorage.getItem("partner_refreshtoken");
  if (!refreshToken) return;

  // Interval only — no immediate call on start to avoid triggering during render
  refreshTokenInterval = setInterval(() => {
    refreshAccessToken();
  }, 5 * 60 * 1000);
};

/**
 * Stop automatic token refresh
 */
export const stopTokenRefresh = () => {
  if (refreshTokenInterval) {
    clearInterval(refreshTokenInterval);
    refreshTokenInterval = null;
    console.log("Token refresh stopped");
  }
};

/**
 * Check if user is authenticated (has valid tokens)
 */
export const isAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem("partner_accesstoken");
  const refreshToken = sessionStorage.getItem("partner_refreshtoken");

  return !!(accessToken && refreshToken);
};

/**
 * Initialize token refresh on app load
 */
export const initializeTokenRefresh = () => {
  if (isAuthenticated()) {
    startTokenRefresh();
  }
};
