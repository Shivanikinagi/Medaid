import { generateMedicalReportBuffer } from '../services/pdfGenerator.js';
import { analyzeSymptoms } from '../services/medicalAnalysisService.js';

/**
 * Start a new consultation by analyzing user symptoms
 */
export const startConsultation = async (req, res) => {
  try {
    const { sessionData, userProfile } = req.body;
    
    console.log('Starting consultation for user:', userProfile?.name || 'Unknown');
    
    // Prepare data for the Python backend
    const analysisData = {
      report_data: sessionData.report_data || {},
      user_inputs: {
        current_symptoms: sessionData.current_symptoms || '',
        past_history: userProfile.past_history || {}
      },
      user_profile: {
        name: userProfile.name,
        age: userProfile.age,
        sex: userProfile.sex || 'Not specified',
        language: userProfile.language || 'English'
      }
    };
    
    // Call the actual backend processing function
    const result = await analyzeSymptoms(analysisData);
    
    console.log('Consultation analysis completed successfully');
    
    // Return the actual result from the Python backend
    res.status(200).json(result.assessment || result);
  } catch (error) {
    console.error('Error starting consultation:', error);
    res.status(500).json({ 
      message: 'Server error during consultation', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Process clarification questions and answers
 */
export const processClarification = async (req, res) => {
  try {
    const { sessionData, userProfile, clarificationAnswers } = req.body;
    
    console.log('Processing clarification for user:', userProfile?.name || 'Unknown');
    
    // Prepare data for the Python backend with clarification answers
    const analysisData = {
      report_data: sessionData.report_data || {},
      user_inputs: {
        current_symptoms: sessionData.current_symptoms || '',
        past_history: userProfile.past_history || {},
        clarification_answers: clarificationAnswers || {}
      },
      user_profile: {
        name: userProfile.name,
        age: userProfile.age,
        sex: userProfile.sex || 'Not specified',
        language: userProfile.language || 'English'
      }
    };
    
    // Call the actual backend processing function with clarification answers
    const result = await analyzeSymptoms(analysisData);
    
    console.log('Clarification processing completed successfully');
    
    // Return the actual result from the Python backend
    res.status(200).json(result.assessment || result);
  } catch (error) {
    console.error('Error processing clarification:', error);
    res.status(500).json({ 
      message: 'Server error during clarification processing', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Generate a PDF report for the consultation
 */
export const generateReport = async (req, res) => {
  try {
    const { assessmentData, userData } = req.body;
    
    console.log('Generating PDF report for user:', userData?.name || 'Unknown');
    
    // Generate PDF report as buffer
    const pdfBuffer = await generateMedicalReportBuffer(assessmentData, userData);
    
    // Convert buffer to base64 for transmission
    const pdfBase64 = pdfBuffer.toString('base64');
    
    console.log('PDF report generated successfully');
    
    res.status(200).json({
      pdfData: pdfBase64,
      fileName: `Health_Summary_${userData.name || 'Patient'}_${new Date().toISOString().split('T')[0]}.pdf`
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ 
      message: 'Server error during report generation', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};