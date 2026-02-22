import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lh_token');
    if (!token) { setLoading(false); return; }
    api('GET', '/api/auth/me')
      .then(r => setUser(r.user))
      .catch(() => localStorage.removeItem('lh_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const r = await api('POST', '/api/auth/login', { username, password });
    localStorage.setItem('lh_token', r.token);
    setUser({ username });
  };

  const logout = () => {
    localStorage.removeItem('lh_token');
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
