import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simple validation - in production use backend authentication
    if (email === 'admin@workerapp.com' && password === 'admin123') {
      const userData = {
        id: 1,
        email,
        name: 'Admin User',
        role: 'admin',
        loginTime: new Date().toISOString(),
      };
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      return { success: true, message: 'Login successful!' };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
