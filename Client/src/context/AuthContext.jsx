import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user info from token on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Optionally verify token by fetching user data
          const res = await api.get('/auth/me'); // backend route to get user info
          setUser(res.data);
        } catch (error) {
          console.error('Invalid token, logging out');
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Login function
  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    localStorage.setItem('token', res.data.token);
    setUser({ _id: res.data._id, name: res.data.name, email: res.data.email });
  };

  // Register function
  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('token', res.data.token);
    setUser({ _id: res.data._id, name: res.data.name, email: res.data.email });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
