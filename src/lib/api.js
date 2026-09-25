import axios from 'axios';

// Helper to determine active API URL
export const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('custom_api_url');
    if (saved && saved.trim()) return saved.trim();
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

const API = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token & dynamically set target URL
API.interceptors.request.use(
  (config) => {
    config.baseURL = getApiUrl();
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('ws_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized errors cleanly
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ws_token');
        localStorage.removeItem('ws_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
