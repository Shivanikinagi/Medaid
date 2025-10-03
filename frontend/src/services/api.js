import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5008/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User API endpoints
export const userAPI = {
  // Get user by email
  getUserByEmail: (email) => api.get(`/users/${email}`),
  
  // Create new user
  createUser: (userData) => api.post('/users', userData),
  
  // Update user history
  updateUserHistory: (userId, historyData) => api.put(`/users/${userId}/history`, historyData),
  
  // Update user report data
  updateUserReportData: (userId, reportData) => api.put(`/users/${userId}/report-data`, reportData),
};

// Consultation API endpoints
export const consultationAPI = {
  // Start consultation
  startConsultation: (consultationData) => api.post('/consultations/start', consultationData),
  
  // Process clarification questions
  processClarification: (clarificationData) => api.post('/consultations/clarification', clarificationData),
  
  // Generate PDF report
  generateReport: (reportData) => api.post('/consultations/report', reportData),
};

// Report API endpoints
export const reportAPI = {
  // Process medical report
  processReport: (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post('/reports/process', formData, config);
  },
  
  // Generate report explanation
  generateExplanation: (explanationData) => api.post('/reports/explanation', explanationData),
  
  // Analyze symptoms
  analyzeSymptoms: (analysisData) => api.post('/reports/analyze', analysisData),
};

// Utility function to download PDF from base64 data
export const downloadPDF = (base64Data, fileName) => {
  try {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download PDF report');
  }
};

export default api;