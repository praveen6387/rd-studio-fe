'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Clean up old token from previous system
    localStorage.removeItem('token');
    
    setLoading(false);
  }, []);

  const login = (response) => {
    // Extract user data and tokens from response
    const { user: userData, access, refresh } = response;
    
    // Map backend role to frontend type
    const roleToType = {
      0: 'customer',
      1: 'admin',
      2: 'operation',
      3: 'admin' // super admin maps to admin
    };
    
    // Add type and name fields to user data
    const enhancedUserData = {
      ...userData,
      type: roleToType[userData.role] || 'customer',
      name: `${userData.first_name} ${userData.last_name}`.trim()
    };
    
    // Store user data
    setUser(enhancedUserData);
    localStorage.setItem('user', JSON.stringify(enhancedUserData));
    
    // Store tokens separately
    if (access) localStorage.setItem('accessToken', access);
    if (refresh) localStorage.setItem('refreshToken', refresh);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token'); // Clean up old token if exists
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 