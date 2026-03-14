import BASE_URL from "../Config";

let refreshTokenInterval: NodeJS.Timeout | null = null;
let isRefreshing = false;

/**
 * Refresh the access token using the refresh token from sessionStorage
 */
export const refreshAccessToken = async (): Promise<boolean> => {
  if (isRefreshing) {
    console.log("Token refresh already in progress...");
    return false;
  }

  const refreshToken = sessionStorage.getItem("refreshToken");

  if (!refreshToken) {
    console.warn("No refresh token found in sessionStorage");
    return false;
  }

  isRefreshing = true;

  try {
    const response = await fetch(`${BASE_URL}/user-service/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const data = await response.json();

    // Update tokens in storage
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("token", data.accessToken); // For backward compatibility  
      console.log("Access token refreshed successfully");
    }

    if (data.refreshToken) {
      sessionStorage.setItem("refreshToken", data.refreshToken);
      console.log("Refresh token updated");
    }

    isRefreshing = false;
    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    isRefreshing = false;

    // If refresh fails, clear tokens and redirect to login
    handleTokenRefreshFailure();
    return false;
  }
};

/**
 * Handle token refresh failure - clear tokens and redirect to login
 */
const handleTokenRefreshFailure = () => {
  console.warn("Token refresh failed. Clearing tokens and redirecting to login.");
  
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  
  // Save current path for redirect after login
  const currentPath = window.location.pathname + window.location.search;
  sessionStorage.setItem("redirectPath", currentPath);
  
  // Redirect to login
  window.location.href = "/whatsapplogin";
};

/**
 * Start automatic token refresh every 5 minutes
 */
export const startTokenRefresh = () => {
  // Clear any existing interval
  stopTokenRefresh();

  const refreshToken = sessionStorage.getItem("refreshToken");
  
  if (!refreshToken) {
    console.warn("Cannot start token refresh: No refresh token found");
    return;
  }

  console.log("Starting automatic token refresh (every 5 minutes)");

  // Refresh immediately on start
  refreshAccessToken();

  // Set interval to refresh every 5 minutes (300000 ms)
  refreshTokenInterval = setInterval(() => {
    console.log("Auto-refreshing token...");
    refreshAccessToken();
  }, 5 * 60 * 1000); // 5 minutes
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
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = sessionStorage.getItem("refreshToken");
  
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
