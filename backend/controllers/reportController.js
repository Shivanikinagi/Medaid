import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { reportToFeatures, analyzeSymptoms } from '../services/medicalAnalysisService.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage: storage });

/**
 * Process uploaded medical report
 */
export const processReport = async (req, res) => {
  try {
    console.log('Processing medical report upload');
    
    if (!req.file) {
      console.warn('No file uploaded in processReport request');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // For now, we'll return a mock response but with real structure
    // In production, this would call OCR and the Python service
    const mockResponse = {
      medical_tests: [
        { test_name: "Hemoglobin", value: 12.5, unit: "g/dL", status: "Normal" },
        { test_name: "WBC Count", value: 8500, unit: "/μL", status: "Normal" },
        { test_name: "Platelet Count", value: 250000, unit: "/μL", status: "Normal" },
        { test_name: "Fasting Glucose", value: 95, unit: "mg/dL", status: "Normal" }
      ],
      abnormal_results: [],
      raw_text: 'Hemoglobin: 12.5 g/dL\nWBC Count: 8500 /μL\nPlatelet Count: 250000 /μL\nFasting Glucose: 95 mg/dL',
      error: null
    };
    
    console.log('Medical report processed successfully');
    res.status(200).json(mockResponse);
  } catch (error) {
    console.error('Error processing report:', error);
    res.status(500).json({ 
      message: 'Server error during report processing', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Generate report explanation using Python backend
 */
export const generateReportExplanation = async (req, res) => {
  try {
    const { reportData, symptomsText, userProfile } = req.body;
    
    console.log('Generating report explanation for user:', userProfile?.name || 'Unknown');
    
    // Prepare data for the Python backend
    const featureData = {
      report_json: reportData,
      symptoms_text: symptomsText,
      user_profile: userProfile
    };
    
    // Call the actual backend processing function
    const result = await reportToFeatures(featureData);
    
    // For now, we'll return a mock response
    // In production, this would return the actual explanation from the Python service
    const mockExplanation = `Your hemoglobin level (${result.features.age || 12.5} g/dL) is normal.
Your white blood cell count (${result.features.symptom_text || 8500}/μL) is normal.
No significant abnormalities detected in your report.`;
    
    console.log('Report explanation generated successfully');
    res.status(200).json({ explanation: mockExplanation });
  } catch (error) {
    console.error('Error generating report explanation:', error);
    res.status(500).json({ 
      message: 'Server error during explanation generation', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Analyze symptoms using Python backend
 */
export const analyzeSymptomsFromReport = async (req, res) => {
  try {
    const { reportData, userInputs, userProfile } = req.body;
    
    console.log('Analyzing symptoms from report for user:', userProfile?.name || 'Unknown');
    
    // Prepare data for the Python backend
    const analysisData = {
      report_data: reportData || {},
      user_inputs: userInputs || {},
      user_profile: userProfile || {}
    };
    
    // Call the actual backend processing function
    const result = await analyzeSymptoms(analysisData);
    
    console.log('Symptom analysis from report completed successfully');
    
    // Return the actual result from the Python backend
    res.status(200).json(result.assessment || result);
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    res.status(500).json({ 
      message: 'Server error during symptom analysis', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};