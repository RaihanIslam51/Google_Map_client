import axios from 'axios';

// Production server URL (direct)
const PRODUCTION_API_URL = 'https://server-nine-kappa-43.vercel.app/api';

// Same-origin proxy URL (used on deployed Vercel — avoids CORS on mobile)
const PROXY_API_URL = '/api/proxy';

// Helper to determine active API URL
export const getApiUrl = () => {
  // 1. Custom URL override (from Settings page or localStorage)
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('custom_api_url');
    if (saved && saved.trim()) return saved.trim();
  }
  // 2. SSR (Next.js build time) — use production URL directly
  if (typeof window === 'undefined') {
    return PRODUCTION_API_URL;
  }
  // 3. Local development — call local server directly
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  // 4. Deployed (Vercel) — use same-origin proxy, avoids all CORS
  return PROXY_API_URL;
};

const API = axios.create({
  baseURL: PRODUCTION_API_URL, // Initial fallback for SSR
  timeout: 25000,              // 25 second timeout — handles cold starts
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor — dynamically set URL & attach JWT token
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
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 and proxy fallback errors
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If proxy returned an error AND we haven't already retried directly
    if (
      !originalRequest._retried &&
      typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1' &&
      (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response || error.response?.data?.proxyError)
    ) {
      originalRequest._retried = true;
      // Fallback: try direct backend URL
      originalRequest.baseURL = PRODUCTION_API_URL;
      try {
        return await axios(originalRequest);
      } catch (directErr) {
        // Both proxy and direct failed — reject with original error
        return Promise.reject(error);
      }
    }

    // Handle 401 — clear auth tokens
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
