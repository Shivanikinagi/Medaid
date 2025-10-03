import axios from 'axios';

// Python service URL - this should match the port in medical_analyzer.py
// In Railway multi-service deployments, services can communicate using service names
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 
                         (process.env.RAILWAY_SERVICE_NAME ? 'http://medaid-python:5001' : 'http://localhost:5001');

/**
 * Analyze symptoms using the Python backend service
 * @param {Object} data - The analysis data
 * @param {Object} data.report_data - Medical report data
 * @param {Object} data.user_inputs - User input symptoms
 * @param {Object} data.user_profile - User profile information
 * @returns {Promise<Object>} The analysis result
 */
export const analyzeSymptoms = async (data) => {
  try {
    console.log('Sending data to Python analysis service:', {
      url: `${PYTHON_SERVICE_URL}/analyze`,
      data: {
        ...data,
        // Don't log sensitive data
        user_inputs: data.user_inputs ? { ...data.user_inputs, current_symptoms: '[REDACTED]' } : undefined
      }
    });
    
    // Add timeout to prevent hanging
    const response = await axios.post(`${PYTHON_SERVICE_URL}/analyze`, data, {
      timeout: 30000 // 30 second timeout
    });
    
    console.log('Received response from Python analysis service:', {
      status: response.status,
      dataKeys: Object.keys(response.data)
    });
    
    return response.data;
  } catch (error) {
    console.error('Error calling Python analysis service:', {
      message: error.message,
      url: `${PYTHON_SERVICE_URL}/analyze`,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : undefined
    });
    
    // Re-throw the error so it can be handled by the calling function
    throw new Error(`Failed to analyze symptoms: ${error.message}`);
  }
};

/**
 * Convert report to feature vector using the Python backend service
 * @param {Object} data - The report data
 * @param {Object} data.report_json - Report data in JSON format
 * @param {string} data.symptoms_text - Symptoms text
 * @param {Object} data.user_profile - User profile information
 * @returns {Promise<Object>} The feature vector
 */
export const reportToFeatures = async (data) => {
  try {
    console.log('Sending data to Python report features service:', {
      url: `${PYTHON_SERVICE_URL}/report_features`
    });
    
    // Add timeout to prevent hanging
    const response = await axios.post(`${PYTHON_SERVICE_URL}/report_features`, data, {
      timeout: 30000 // 30 second timeout
    });
    
    console.log('Received response from Python report features service:', {
      status: response.status
    });
    
    return response.data;
  } catch (error) {
    console.error('Error calling Python report features service:', {
      message: error.message,
      url: `${PYTHON_SERVICE_URL}/report_features`,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : undefined
    });
    
    // Re-throw the error so it can be handled by the calling function
    throw new Error(`Failed to process report features: ${error.message}`);
  }
};

/**
 * Check if the Python service is healthy
 * @returns {Promise<boolean>} Whether the service is healthy
 */
export const healthCheck = async () => {
  try {
    console.log('Checking Python service health:', `${PYTHON_SERVICE_URL}/health`);
    const response = await axios.get(`${PYTHON_SERVICE_URL}/health`, {
      timeout: 5000 // 5 second timeout
    });
    console.log('Python service health check result:', response.data);
    return response.data.status === 'ok';
  } catch (error) {
    console.error('Python service health check failed:', {
      message: error.message,
      url: `${PYTHON_SERVICE_URL}/health`,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : undefined
    });
    return false;
  }
};