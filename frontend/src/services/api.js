// frontend/src/services/api.js
import axios from "axios";

// Hardcoded baseURL for production - this should always work
const baseURL = "https://medaid-b-production.up.railway.app/api";

// Debug (temporary) - shows in browser console when app loads
console.log("🔧 Hardcoded Axios baseURL (final):", baseURL);

// Create the api instance with hardcoded baseURL
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: log each outgoing request so you can verify the exact final URL
api.interceptors.request.use((config) => {
  // prints something like: https://medaid-b-production.up.railway.app/api/users/abc
  console.log("➡️ API Request:", config.baseURL + config.url);
  console.log("➡️ Full config:", config);
  return config;
}, (err) => Promise.reject(err));

/**
 * Export the axios instance and helper grouped APIs.
 * Keep helper functions using relative paths (e.g. '/users') so they resolve to baseURL + '/users'.
 */
export default api;

export const userAPI = {
  getUserByEmail: (email) => {
    console.log("🔧 Calling userAPI.getUserByEmail with email:", email);
    console.log("🔧 Using api instance with baseURL:", api.defaults.baseURL);
    // Test the URL construction
    const testURL = api.getUri({ url: `/users/${email}` });
    console.log("🔧 Constructed URL:", testURL);
    const result = api.get(`/users/${email}`);
    console.log("🔧 Result promise:", result);
    return result;
  },
  createUser: (userData) => {
    console.log("🔧 Calling userAPI.createUser with data:", userData);
    console.log("🔧 Using api instance with baseURL:", api.defaults.baseURL);
    // Test the URL construction
    const testURL = api.getUri({ url: '/users' });
    console.log("🔧 Constructed URL:", testURL);
    const result = api.post('/users', userData);
    console.log("🔧 Result promise:", result);
    return result;
  },
  updateUserHistory: (userId, historyData) => {
    console.log("🔧 Calling userAPI.updateUserHistory with userId:", userId);
    console.log("🔧 Using api instance with baseURL:", api.defaults.baseURL);
    const result = api.put(`/users/${userId}/history`, historyData);
    console.log("🔧 Result promise:", result);
    return result;
  },
  updateUserReportData: (userId, reportData) => {
    console.log("🔧 Calling userAPI.updateUserReportData with userId:", userId);
    console.log("🔧 Using api instance with baseURL:", api.defaults.baseURL);
    const result = api.put(`/users/${userId}/report-data`, reportData);
    console.log("🔧 Result promise:", result);
    return result;
  },
};

export const consultationAPI = {
  startConsultation: (consultationData) => {
    console.log("🔧 Using api instance with baseURL:", api.defaults.baseURL);
    return api.post('/consultations/start', consultationData);
  },
  processClarification: (clarificationData) => {
    console.log("🔧 Using api instance with baseURL:", api.defaults.baseURL);
    return api.post('/consultations/clarification', clarificationData);
  },
  generateReport: (reportData) => {
    console.log("🔧 Using api instance with baseURL:", api.defaults.baseURL);
    return api.post('/consultations/report', reportData);
  },
};

export const reportAPI = {
  processReport: (formData) => {
    console.log("🔧 Using api instance with baseURL:", api.defaults.baseURL);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post('/reports/process', formData, config);
  },
  generateExplanation: (explanationData) => {
    console.log("🔧 Using api instance with baseURL:", api.defaults.baseURL);
    return api.post('/reports/explanation', explanationData);
  },
  analyzeSymptoms: (analysisData) => {
    console.log("🔧 Using api instance with baseURL:", api.defaults.baseURL);
    return api.post('/reports/analyze', analysisData);
  },
};

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