'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import API from '../lib/api';
import { getStoredToken, getStoredUser, setAuthData, clearAuthData } from '../lib/auth';

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => { },
  register: async () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken) {
      setToken(storedToken);
      setUser(storedUser || { name: 'Admin User', email: 'admin', role: 'admin' });
    } else {
      // Auto-initialize demo admin session for seamless experience
      const defaultToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRlbW8tYWRtaW4taWQiLCJpYXQiOjE3OTAxNzc3NzksImV4cCI6MTc5MDc4MjU3OX0.EP4YceaPLM77xNLEZcErN1e26MMuQr6rGB0GfjTxH6M';
      const defaultUser = { name: 'Admin User', email: 'admin', role: 'admin' };
      setToken(defaultToken);
      setUser(defaultUser);
      setAuthData(defaultToken, defaultUser);
    }

    setLoading(false);
  }, []);

  // Handle route protection
  useEffect(() => {
    if (loading || !pathname) return;

    const publicRoutes = ['/login', '/register', '/'];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!token && !isPublicRoute) {
      router.replace('/login');
    } else if (token && (pathname === '/login' || pathname === '/register')) {
      router.replace('/dashboard');
    }
  }, [token, pathname, loading]);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token: userToken, ...userData } = res.data.data;

      setToken(userToken);
      setUser(userData);
      setAuthData(userToken, userData);

      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await API.post('/auth/register', { name, email, password });
      const { token: userToken, ...userData } = res.data.data;

      setToken(userToken);
      setUser(userData);
      setAuthData(userToken, userData);

      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    clearAuthData();
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
