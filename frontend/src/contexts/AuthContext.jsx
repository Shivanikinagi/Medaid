import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

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

  // Login function using the proper auth endpoint
  const login = async (userData) => {
    setLoading(true);
    try {
      console.log("🔧 Calling auth login endpoint with data:", userData);
      
      // For login, we only need email and password
      // But if this is user registration data, we need to handle it differently
      const loginData = {
        email: userData.email,
        password: userData.password || 'default_password' // Provide a default password if not provided
      };
      
      // Call the auth login endpoint directly
      const response = await api.post('/auth/login', loginData);
      
      const data = response.data;
      console.log("🔧 Auth login response:", data);
      
      if (data.token) {
        // Store token and user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Set user in state
        setUser(data.user);
      }
      
      setLoading(false);
      return data;
    } catch (error) {
      console.error('💥 Login error:', error);
      console.error('💥 Error response:', error.response);
      setLoading(false);
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
      
      const response = await api.put(`/users/${user._id}/history`, updateData);
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
      const response = await api.put(`/users/${user._id}/report-data`, reportData);
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