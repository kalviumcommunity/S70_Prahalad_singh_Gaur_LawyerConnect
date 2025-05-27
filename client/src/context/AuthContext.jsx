import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null); 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(localStorage.getItem('token')); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error("Failed to parse user from localStorage or token invalid:", error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false); 
  }, []);

  const login = useCallback((userData, authToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    setUser(userData);
    setToken(authToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  }, []);

  const contextValue = {
    user,
    token,
    login,
    logout,
    loading, 
    isAuthenticated: !!token, 
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children} 
    </AuthContext.Provider>
  );
};
