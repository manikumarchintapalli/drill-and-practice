import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { QueryClient } from '@tanstack/react-query';

const LOGIN_LS_TOKEN = "user-token";

const getToken = (): string | null => localStorage.getItem(LOGIN_LS_TOKEN);

const http: AxiosInstance = axios.create({
  baseURL: "http://ec2-3-149-242-97.us-east-2.compute.amazonaws.com:8080",
  withCredentials: false,
});

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {}; 
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const queryClient = new QueryClient();

export default http;