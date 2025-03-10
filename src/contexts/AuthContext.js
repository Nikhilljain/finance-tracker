import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      // Also set a token when user is logged in
      localStorage.setItem('token', 'demo-token');
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      // In a real app, this would make an API call
      // For demo purposes, we'll simulate a successful login
      if (email === 'demo@example.com' && password === 'demo123') {
        const mockUser = {
          id: '1',
          name: 'Demo User',
          email,
          currency: 'USD',
        };
        
        setUser(mockUser);
        localStorage.setItem('token', 'demo-token');
        navigate('/app/dashboard');
        return mockUser;
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      throw new Error('Invalid email or password');
    }
  };

  const register = async (name, email, password) => {
    try {
      // In a real app, this would make an API call
      // For demo purposes, we'll simulate a successful registration
      const mockUser = {
        id: '1',
        name,
        email,
        currency: 'USD',
      };
      
      setUser(mockUser);
      localStorage.setItem('token', 'demo-token');
      navigate('/app/dashboard');
      return mockUser;
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const updateProfile = async (updates) => {
    try {
      // In a real app, this would make an API call
      // For demo purposes, we'll update the local state
      setUser((prev) => ({
        ...prev,
        ...updates,
      }));
      return true;
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user && !!localStorage.getItem('token'),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}