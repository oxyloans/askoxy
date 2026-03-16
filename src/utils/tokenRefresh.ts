import BASE_URL from "../Config";
import { store } from "../store";
import { updateAccessToken, updateRefreshToken, logout } from "../store/authSlice";
import { getRefreshToken } from "./cookieUtils";

let refreshTokenInterval: NodeJS.Timeout | null = null;
let pendingRefresh: Promise<boolean> | null = null;

export const refreshAccessToken = async (): Promise<boolean> => {
  // Return the in-flight promise to prevent concurrent refresh calls
  if (pendingRefresh) return pendingRefresh;

  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  pendingRefresh = (async () => {
    try {
      const response = await fetch(`${BASE_URL}/user-service/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) throw new Error(`Refresh failed: ${response.status}`);

      const data = await response.json();

      if (data.accessToken) {
        store.dispatch(updateAccessToken(data.accessToken));
      }

      if (data.refreshToken) {
        store.dispatch(updateRefreshToken(data.refreshToken));
      }

      return true;
    } catch {
      store.dispatch(logout());
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem("redirectPath", currentPath);
      window.location.href = "/whatsapplogin";
      return false;
    } finally {
      pendingRefresh = null;
    }
  })();

  return pendingRefresh;
};

export const startTokenRefresh = (): void => {
  stopTokenRefresh();
  if (!getRefreshToken()) return;

  refreshTokenInterval = setInterval(() => {
    refreshAccessToken();
  }, 5 * 60 * 1000); // every 5 minutes
};

export const stopTokenRefresh = (): void => {
  if (refreshTokenInterval) {
    clearInterval(refreshTokenInterval);
    refreshTokenInterval = null;
  }
};

export const isAuthenticated = (): boolean =>
  !!(store.getState().auth.accessToken && getRefreshToken());
