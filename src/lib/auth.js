export const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ws_token');
};

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('ws_user');
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const setAuthData = (token, user) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ws_token', token);
  localStorage.setItem('ws_user', JSON.stringify(user));
};

export const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ws_token');
  localStorage.removeItem('ws_user');
};

export const isAuthenticated = () => {
  return !!getStoredToken();
};
