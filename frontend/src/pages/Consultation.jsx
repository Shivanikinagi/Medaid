import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { consultationAPI, reportAPI } from '../services/api';
import { FaFileUpload, FaMicrophone, FaStethoscope, FaHistory, FaFileMedical } from 'react-icons/fa';

const ConsultationWrapper = styled.div`
  min-height: calc(100vh - 120px);
  padding: 2rem 0;
`;

const PageTitle = styled.h1`
  text-align: center;
  color: #2E7D32;
  margin-bottom: 2rem;
`;

const ConsultationCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 14px;
    left: 0;
    right: 0;
    height: 2px;
    background: #ddd;
    z-index: 1;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  position: relative;
`;

const StepCircle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => props.active ? '#4CAF50' : props.completed ? '#4CAF50' : '#ddd'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
`;

const StepLabel = styled.span`
  font-size: 0.9rem;
  color: ${props => props.active ? '#4CAF50' : '#999'};
  font-weight: ${props => props.active ? '600' : 'normal'};
`;

const FormSection = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  min-height: 150px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  }
`;

const FileUpload = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4CAF50;
    background: rgba(76, 175, 80, 0.05);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: ${props => props.secondary ? '#f5f5f5' : 'linear-gradient(90deg, #4CAF50, #2E7D32)'};
  color: ${props => props.secondary ? '#333' : 'white'};
  border: ${props => props.secondary ? '1px solid #ddd' : 'none'};
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const OptionCard = styled.div`
  border: 2px solid ${props => props.selected ? '#4CAF50' : '#ddd'};
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.selected ? 'rgba(76, 175, 80, 0.1)' : 'white'};
  
  &:hover {
    border-color: #4CAF50;
  }
  
  span {
    font-size: 2rem;
    margin-bottom: 1rem;
    display: block;
  }
  
  h3 {
    margin-bottom: 0.5rem;
    color: #2E7D32;
  }
`;

const Consultation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    symptoms: '',
    pastHistory: [],
    reportFile: null,
    inputMode: 'text'
  });
  const [loading, setLoading] = useState(false);
  const [processedReportData, setProcessedReportData] = useState(null);
  
  // Refs for file inputs
  const reportUploadRef = useRef(null);
  const optionalReportUploadRef = useRef(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      reportFile: e.target.files[0]
    });
  };

  const handlePastHistoryChange = (condition) => {
    const updatedHistory = formData.pastHistory.includes(condition)
      ? formData.pastHistory.filter(item => item !== condition)
      : [...formData.pastHistory, condition];
      
    setFormData({
      ...formData,
      pastHistory: updatedHistory
    });
  };

  const processReportFile = async (reportFile) => {
    if (!reportFile) return null;
    
    const formData = new FormData();
    formData.append('report', reportFile);
    
    try {
      const response = await reportAPI.processReport(formData);
      return response.data;
    } catch (error) {
      console.error('Error processing report:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Process the report file if uploaded
      let reportData = null;
      if (formData.reportFile) {
        reportData = await processReportFile(formData.reportFile);
      }
      
      // Prepare data for the API call
      const consultationData = {
        sessionData: {
          current_symptoms: formData.symptoms,
          report_data: reportData || {} // Use processed report data or empty object
        },
        userProfile: {
          name: user.name,
          age: user.age,
          sex: user.sex || 'Not specified',
          language: user.language || 'English',
          past_history: formData.pastHistory
        }
      };
      
      // Call the actual backend API
      const response = await consultationAPI.startConsultation(consultationData);
      const assessmentResult = response.data;
      
      // Store the result in localStorage
      localStorage.setItem('assessmentResult', JSON.stringify(assessmentResult));
      
      // Navigate to results page
      navigate('/results');
    } catch (error) {
      console.error('Error submitting consultation:', error);
      alert('Failed to process consultation. Please try again.');
      setLoading(false);
    }
  };

  const commonConditions = [
    "Diabetes",
    "Hypertension (High BP)",
    "Asthma",
    "Heart Disease",
    "Anemia",
    "Thyroid Issues"
  ];

  return (
    <ConsultationWrapper>
      <PageTitle>Health Consultation</PageTitle>
      
      <ConsultationCard>
        <StepIndicator>
          {[1, 2, 3, 4].map((step) => (
            <Step key={step}>
              <StepCircle 
                active={currentStep === step} 
                completed={currentStep > step}
              >
                {step}
              </StepCircle>
              <StepLabel active={currentStep === step}>
                {step === 1 && 'Symptoms'}
                {step === 2 && 'History'}
                {step === 3 && 'Report'}
                {step === 4 && 'Review'}
              </StepLabel>
            </Step>
          ))}
        </StepIndicator>
        
        <form onSubmit={handleSubmit}>
          {/* Step 1: Current Symptoms */}
          <FormSection active={currentStep === 1}>
            <h2><FaStethoscope /> Describe Your Symptoms</h2>
            <p>Please describe your current symptoms in detail.</p>
            
            <OptionsGrid>
              <OptionCard 
                selected={formData.inputMode === 'text'}
                onClick={() => setFormData({...formData, inputMode: 'text'})}
              >
                <span>💬</span>
                <h3>Type/Text</h3>
                <p>Describe your symptoms in your own words</p>
              </OptionCard>
              
              <OptionCard 
                selected={formData.inputMode === 'report'}
                onClick={() => setFormData({...formData, inputMode: 'report'})}
              >
                <span>📄</span>
                <h3>Report</h3>
                <p>Upload a medical report</p>
              </OptionCard>
            </OptionsGrid>
            
            {formData.inputMode === 'text' && (
              <FormGroup>
                <FormLabel htmlFor="symptoms">Describe your symptoms:</FormLabel>
                <FormTextarea
                  id="symptoms"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  placeholder="e.g., I have had a fever and headache for two days..."
                  required
                />
              </FormGroup>
            )}
            
            {formData.inputMode === 'report' && (
              <FormGroup>
                <FormLabel>Upload Medical Report</FormLabel>
                <FileUpload onClick={() => reportUploadRef.current?.click()}>
                  <FaFileUpload style={{ fontSize: '3rem', color: '#4CAF50', marginBottom: '1rem' }} />
                  <p>Drag & drop your medical report here or click to browse</p>
                  <p style={{ fontSize: '0.9rem', color: '#999' }}>
                    Supports PDF, PNG, JPG files
                  </p>
                  <input 
                    ref={reportUploadRef}
                    type="file" 
                    accept=".pdf,.png,.jpg,.jpeg" 
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <Button type="button" style={{ marginTop: '1rem' }}>
                    Choose File
                  </Button>
                </FileUpload>
                {formData.reportFile && (
                  <p style={{ marginTop: '0.5rem', color: '#4CAF50' }}>
                    Selected: {formData.reportFile.name}
                  </p>
                )}
              </FormGroup>
            )}
          </FormSection>
          
          {/* Step 2: Past Medical History */}
          <FormSection active={currentStep === 2}>
            <h2><FaHistory /> Medical History</h2>
            <p>Do you have any of the following conditions?</p>
            
            <OptionsGrid>
              {commonConditions.map((condition) => (
                <OptionCard 
                  key={condition}
                  selected={formData.pastHistory.includes(condition)}
                  onClick={() => handlePastHistoryChange(condition)}
                >
                  <h3>{condition}</h3>
                  <p>
                    {formData.pastHistory.includes(condition) 
                      ? 'Selected' 
                      : 'Click to select'}
                  </p>
                </OptionCard>
              ))}
            </OptionsGrid>
            
            <FormGroup style={{ marginTop: '2rem' }}>
              <FormLabel>Other Conditions (if any):</FormLabel>
              <FormInput
                type="text"
                placeholder="List any other medical conditions"
              />
            </FormGroup>
          </FormSection>
          
          {/* Step 3: Medical Report (Optional) */}
          <FormSection active={currentStep === 3}>
            <h2><FaFileMedical /> Upload Medical Report (Optional)</h2>
            <p>If you have any recent medical reports, you can upload them for better analysis.</p>
            
            <FileUpload onClick={() => optionalReportUploadRef.current?.click()}>
              <FaFileUpload style={{ fontSize: '3rem', color: '#4CAF50', marginBottom: '1rem' }} />
              <p>Drag & drop your medical report here or click to browse</p>
              <p style={{ fontSize: '0.9rem', color: '#999' }}>
                Supports PDF, PNG, JPG files
              </p>
              <input 
                ref={optionalReportUploadRef}
                type="file" 
                accept=".pdf,.png,.jpg,.jpeg" 
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <Button type="button" style={{ marginTop: '1rem' }}>
                Choose File
              </Button>
            </FileUpload>
            {formData.reportFile && (
              <p style={{ marginTop: '0.5rem', color: '#4CAF50' }}>
                Selected: {formData.reportFile.name}
              </p>
            )}
          </FormSection>
          
          {/* Step 4: Review */}
          <FormSection active={currentStep === 4}>
            <h2>Review Your Information</h2>
            <p>Please review the information you've provided before submitting.</p>
            
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <h3>Symptoms</h3>
              <p>{formData.symptoms || 'Not provided'}</p>
              
              <h3 style={{ marginTop: '1rem' }}>Medical History</h3>
              <p>
                {formData.pastHistory.length > 0 
                  ? formData.pastHistory.join(', ') 
                  : 'No medical history provided'}
              </p>
              
              <h3 style={{ marginTop: '1rem' }}>Uploaded Report</h3>
              <p>
                {formData.reportFile 
                  ? formData.reportFile.name 
                  : 'No report uploaded'}
              </p>
            </div>
          </FormSection>
          
          <ButtonGroup>
            <Button 
              type="button" 
              secondary 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 4 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Submit for Analysis'}
              </Button>
            )}
          </ButtonGroup>
        </form>
      </ConsultationCard>
    </ConsultationWrapper>
  );
};

export default Consultation;