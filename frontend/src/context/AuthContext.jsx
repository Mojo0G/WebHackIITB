import React, { createContext, useState, useEffect } from 'react';
import API_BASE_URL, { axiosInstance } from '../api.config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Check local storage for existing token
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      console.log('🔐 Authorization token set');
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      console.log('🔓 Authorization token removed');
    }
  }, [token]);

  // LOGIN FUNCTION
  const login = async (email, password) => {
    const res = await axiosInstance.post('/api/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data);
    return res.data;
  };

  // REGISTER FUNCTION (New!)
  const register = async (name, email, password) => {
    const res = await axiosInstance.post('/api/auth/register', { 
      name, 
      email, 
      password 
    });
    // Automatically log them in after registering
    setToken(res.data.token);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};