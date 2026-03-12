import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '../store';

// Create axios instance
const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.accessToken;

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

// Response interceptor
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
    return Promise.reject(error);
  }
);

export default axiosInstance;
