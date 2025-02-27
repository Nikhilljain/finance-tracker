import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  
  // For demonstration - in a real app, this would connect to a backend
  const login = (email, password) => {
    // Simulate login
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser({
          name: 'Demo User',
          email: email
        });
        resolve();
      }, 1000);
    });
  };
  
  const signup = (name, email, password) => {
    // Simulate signup
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser({
          name: name,
          email: email
        });
        resolve();
      }, 1000);
    });
  };
  
  const logout = () => {
    setCurrentUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};