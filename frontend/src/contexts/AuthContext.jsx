import React, { createContext, useState, useEffect, useContext } from 'react';
import { userAPI } from '../services/api';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (userData) => {
    try {
      // Check if user already exists
      let response;
      try {
        response = await userAPI.getUserByEmail(userData.email);
      } catch (error) {
        // If user doesn't exist, create new user
        if (error.response?.status === 404) {
          response = await userAPI.createUser(userData);
        } else {
          throw error;
        }
      }
      
      const user = response.data;
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set user in state
      setUser(user);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Update user history
  const updateUserHistory = async (historyData, sessionRecord = null) => {
    if (!user) return;
    
    try {
      const updateData = {
        history_dict: historyData,
        ...(sessionRecord && { session_record: sessionRecord })
      };
      
      const response = await userAPI.updateUserHistory(user._id, updateData);
      const updatedUser = response.data;
      
      // Update localStorage and state
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user history:', error);
      throw error;
    }
  };

  // Update user report data
  const updateUserReportData = async (reportData) => {
    if (!user) return;
    
    try {
      const response = await userAPI.updateUserReportData(user._id, reportData);
      const updatedUser = response.data;
      
      // Update localStorage and state
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user report data:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUserHistory,
    updateUserReportData,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;