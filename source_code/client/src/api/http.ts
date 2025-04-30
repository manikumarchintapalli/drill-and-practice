import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { QueryClient } from '@tanstack/react-query';

// Token key
const LOGIN_LS_TOKEN = "user-token";

// Helper function
const getToken = (): string | null => localStorage.getItem(LOGIN_LS_TOKEN);

// Axios instance
const http: AxiosInstance = axios.create({
  baseURL: "http://ec2-3-149-242-97.us-east-2.compute.amazonaws.com:8080",
  withCredentials: false,
});

// ✅ Correctly typed Interceptor
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {}; // Always ensure headers
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// React Query client
export const queryClient = new QueryClient();

// Export axios
export default http;