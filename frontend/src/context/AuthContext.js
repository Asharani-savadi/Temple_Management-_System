import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Restore user session
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) setUser(JSON.parse(savedUser));

    // Restore admin session
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (adminLoggedIn) setIsAdminLoggedIn(true);
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('loggedInUser', JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('loggedInUser');
  };

  const loginAdmin = (adminData) => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('adminLoggedIn', 'true');
    localStorage.setItem('adminUser', JSON.stringify(adminData));
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider value={{ user, isAdminLoggedIn, loginUser, logoutUser, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
