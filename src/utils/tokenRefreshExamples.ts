/**
 * TOKEN REFRESH INTEGRATION EXAMPLES
 * 
 * This file demonstrates how to use the token refresh utility
 * in different scenarios throughout your application.
 */

import {
  refreshAccessToken,
  startTokenRefresh,
  stopTokenRefresh,
  isAuthenticated,
} from "./tokenRefresh";

// ============================================
// EXAMPLE 1: Manual Token Refresh
// ============================================
// Use this when you need to manually refresh the token
// (e.g., after a failed API call with 401 error)

export const handleApiError = async (error: any) => {
  if (error.response?.status === 401) {
    console.log("Token expired, attempting refresh...");
    const success = await refreshAccessToken();
    
    if (success) {
      // Retry the failed request
      console.log("Token refreshed, retry your API call");
      return true;
    } else {
      // Refresh failed, user will be redirected to login
      console.log("Token refresh failed, user redirected to login");
      return false;
    }
  }
  return false;
};

// ============================================
// EXAMPLE 2: Using in Login Flow
// ============================================
// After successful login, store tokens and start auto-refresh

export const handleLoginSuccess = (loginResponse: any) => {
  // Store tokens
  localStorage.setItem("accessToken", loginResponse.accessToken);
  sessionStorage.setItem("refreshToken", loginResponse.refreshToken);
  
  // Store other user data
  localStorage.setItem("userId", loginResponse.userId);
  localStorage.setItem("customerId", loginResponse.customerId);
  
  // Start automatic token refresh
  startTokenRefresh();
  
  console.log("Login successful, token refresh started");
};

// ============================================
// EXAMPLE 3: Using in Logout Flow
// ============================================
// Stop token refresh and clear all tokens

export const handleLogout = () => {
  // Stop automatic token refresh
  stopTokenRefresh();
  
  // Clear all tokens and user data
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("customerId");
  
  // Redirect to login
  window.location.href = "/whatsapplogin";
  
  console.log("Logout successful, token refresh stopped");
};

// ============================================
// EXAMPLE 4: Protected API Call with Auto-Retry
// ============================================
// Wrapper function that automatically retries API calls on 401 errors

export const makeProtectedApiCall = async (
  url: string,
  options: RequestInit = {}
) => {
  const accessToken = localStorage.getItem("accessToken");
  
  if (!accessToken) {
    throw new Error("No access token found");
  }
  
  // Add authorization header
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
  
  try {
    const response = await fetch(url, { ...options, headers });
    
    // If 401, try to refresh token and retry
    if (response.status === 401) {
      console.log("Received 401, attempting token refresh...");
      const refreshSuccess = await refreshAccessToken();
      
      if (refreshSuccess) {
        // Retry with new token
        const newAccessToken = localStorage.getItem("accessToken");
        const retryHeaders = {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
          "Content-Type": "application/json",
        };
        
        return await fetch(url, { ...options, headers: retryHeaders });
      }
    }
    
    return response;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

// ============================================
// EXAMPLE 5: Check Authentication Status
// ============================================
// Use this to check if user is authenticated before rendering protected routes

export const checkAuthBeforeRender = () => {
  if (!isAuthenticated()) {
    console.log("User not authenticated, redirecting to login");
    
    // Save current path for redirect after login
    const currentPath = window.location.pathname + window.location.search;
    sessionStorage.setItem("redirectPath", currentPath);
    
    window.location.href = "/whatsapplogin";
    return false;
  }
  
  return true;
};

// ============================================
// EXAMPLE 6: Using with Axios Interceptor
// ============================================
// If you're using Axios, you can add an interceptor

import axios from "axios";

export const setupAxiosInterceptor = () => {
  // Request interceptor - add token to all requests
  axios.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Response interceptor - handle 401 errors
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If 401 and haven't retried yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        const refreshSuccess = await refreshAccessToken();
        
        if (refreshSuccess) {
          const newAccessToken = localStorage.getItem("accessToken");
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// ============================================
// EXAMPLE 7: React Component Usage
// ============================================
// Example of using token refresh in a React component

import { useEffect } from "react";

export const ProtectedComponent = () => {
  useEffect(() => {
    // Check authentication on mount
    if (!isAuthenticated()) {
      window.location.href = "/whatsapplogin";
    }
  }, []);
  
  const handleApiCall = async () => {
    try {
      const response = await makeProtectedApiCall(
        "https://meta.oxyloans.com/api/user-service/some-endpoint",
        {
          method: "GET",
        }
      );
      
      const data = await response.json();
      console.log("API response:", data);
    } catch (error) {
      console.error("API call failed:", error);
    }
  };
  
  // Component would return JSX like:
  // return (
  //   <div>
  //     <button onClick={handleApiCall}>Make Protected API Call</button>
  //   </div>
  // );
  
  // For this example file, we'll just return null
  return null;
};

// ============================================
// EXAMPLE 8: Token Refresh on Page Load
// ============================================
// Initialize token refresh when app loads

export const initializeApp = () => {
  // Check if user is authenticated
  if (isAuthenticated()) {
    console.log("User authenticated, starting token refresh");
    startTokenRefresh();
  } else {
    console.log("User not authenticated");
  }
};

// Call this in your main App component or index file
// initializeApp();
