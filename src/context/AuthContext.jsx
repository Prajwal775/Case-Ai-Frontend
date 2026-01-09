import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi } from '../api/auth.api';
import { clearAllChats } from '../components/chat/chatStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      // minimal user state (expand later if needed)
      setUser({ isAuthenticated: true });
    }

    setLoading(false);
  }, []);

  /**
   * Login
   */
  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await loginApi(username, password);
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);

      setUser({
        isAuthenticated: true,
        token: data.access_token,
      });
      return data;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    clearAllChats();
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
