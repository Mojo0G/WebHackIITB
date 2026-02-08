import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Check local storage for existing token
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // LOGIN FUNCTION
  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data);
    return res.data;
  };

  // REGISTER FUNCTION (New!)
  const register = async (name, email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/register', { 
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