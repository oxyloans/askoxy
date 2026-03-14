import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '../store';
import { refreshAccessToken } from './tokenRefresh';

// Create axios instance
const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    let token = state.auth.accessToken;
    
    // Fallback to localStorage if Redux store doesn't have token
    if (!token) {
      token = localStorage.getItem('accessToken') || '';
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Hide request details in production
    if (process.env.NODE_ENV === 'production') {
      Object.defineProperty(config, 'url', {
        get: () => '[HIDDEN]',
        enumerable: true,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor with token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // Hide response data in production
    if (process.env.NODE_ENV === 'production') {
      Object.defineProperty(response, 'data', {
        get: () => '[HIDDEN]',
        enumerable: true,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // If 401 error and haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log('Received 401 error, attempting token refresh...');
      const refreshSuccess = await refreshAccessToken();
      
      if (refreshSuccess) {
        // Get new token and retry request
        const newToken = localStorage.getItem('accessToken');
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        
        return axiosInstance(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
