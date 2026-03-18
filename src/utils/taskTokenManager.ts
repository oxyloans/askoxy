import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const TOKEN_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
const CHECK_INTERVAL = 30 * 1000; // Check every 30 seconds

interface TokenData {
  token: string;
  timestamp: number;
}

export const setTaskTokens = (accessToken: string, refreshToken?: string) => {
  const timestamp = Date.now();
  
  sessionStorage.setItem('taskAccessToken', accessToken);
  sessionStorage.setItem('taskTokenTimestamp', timestamp.toString());
  
  if (refreshToken) {
    sessionStorage.setItem('taskRefreshToken', refreshToken);
  }
};

export const getTaskTokens = () => {
  const accessToken = sessionStorage.getItem('taskAccessToken');
  const refreshToken = sessionStorage.getItem('taskRefreshToken');
  const timestamp = sessionStorage.getItem('taskTokenTimestamp');
  
  return {
    accessToken,
    refreshToken,
    timestamp: timestamp ? parseInt(timestamp) : null
  };
};

export const isTokenExpired = (): boolean => {
  const { timestamp } = getTaskTokens();
  
  if (!timestamp) return true;
  
  const now = Date.now();
  return (now - timestamp) > TOKEN_EXPIRY_TIME;
};

export const clearTaskTokens = () => {
  sessionStorage.removeItem('taskAccessToken');
  sessionStorage.removeItem('taskRefreshToken');
  sessionStorage.removeItem('taskTokenTimestamp');
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('Name');
  sessionStorage.removeItem('primaryType');
};

export const setIntendedRoute = (route: string) => {
  localStorage.setItem('intendedRoute', route);
};

export const getIntendedRoute = () => {
  return localStorage.getItem('intendedRoute');
};

export const clearIntendedRoute = () => {
  localStorage.removeItem('intendedRoute');
};

export const handleLogout = (currentPath?: string) => {
  // Store current route as intended route before logout
  if (currentPath && currentPath !== '/userlogin' && currentPath !== '/userregister') {
    setIntendedRoute(currentPath);
  }
  clearTaskTokens();
  // Clear browser history and force redirect to login
  window.history.replaceState(null, '', '/userlogin');
  window.location.replace('/userlogin');
};

export const useTaskTokenExpiry = () => {
  const navigate = useNavigate();

  const checkTokenExpiry = useCallback(() => {
    const { accessToken } = getTaskTokens();
    
    // Only check if user has task tokens
    if (accessToken && isTokenExpired()) {
      // Store current route before clearing tokens
      const currentPath = window.location.pathname;
      if (currentPath !== '/userlogin' && currentPath !== '/userregister') {
        setIntendedRoute(currentPath);
      }
      clearTaskTokens();
      window.history.replaceState(null, '', '/userlogin');
      window.location.replace('/userlogin');
    }
  }, [navigate]);

  useEffect(() => {
    // Check immediately
    checkTokenExpiry();
    
    // Set up interval to check periodically
    const interval = setInterval(checkTokenExpiry, CHECK_INTERVAL);
    
    return () => clearInterval(interval);
  }, [checkTokenExpiry]);

  return { checkTokenExpiry, isTokenExpired };
};