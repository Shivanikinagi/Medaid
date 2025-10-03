import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bar, Line, Pie, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FaExclamationTriangle, FaInfoCircle, FaDownload, FaShareAlt, FaRedo, FaChartLine, FaChartPie, FaChartBar, FaFilePdf } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { consultationAPI, downloadPDF } from '../services/api';
import EmergencyAlert from '../components/EmergencyAlert';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ResultsWrapper = styled.div`
  min-height: calc(100vh - 120px);
  padding: 2rem 0;
`;

const PageTitle = styled.h1`
  text-align: center;
  color: #2E7D32;
  margin-bottom: 2rem;
`;

const ResultsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-row: 1;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const RiskLevel = styled.div`
  padding: 1.5rem;
  border-radius: 15px;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  
  &.low {
    background: linear-gradient(90deg, #4CAF50, #2E7D32);
  }
  
  &.moderate {
    background: linear-gradient(90deg, #FF9800, #F57C00);
  }
  
  &.high {
    background: linear-gradient(90deg, #f44336, #d32f2f);
  }
  
  &.emergency {
    background: linear-gradient(90deg, #d32f2f, #b71c1c);
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.9;
  }
`;

const SectionTitle = styled.h3`
  color: #2E7D32;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #4CAF50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RecommendationsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const RecommendationItem = styled.li`
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  
  &:last-child {
    border-bottom: none;
  }
  
  &::before {
    content: "•";
    color: #4CAF50;
    font-size: 1.5rem;
    line-height: 1;
  }
`;

const ConditionList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ConditionItem = styled.li`
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ConfidenceBar = styled.div`
  width: 100px;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const ConfidenceFill = styled.div`
  height: 100%;
  background: ${props => {
    if (props.level >= 0.8) return '#4CAF50';
    if (props.level >= 0.5) return '#FF9800';
    return '#f44336';
  }};
  width: ${props => props.level * 100}%;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 20px;
  background: ${props => props.primary ? 'linear-gradient(90deg, #4CAF50, #2E7D32)' : '#f5f5f5'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: ${props => props.primary ? 'none' : '1px solid #ddd'};
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-bottom: 1rem;
  
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

const ChartContainer = styled.div`
  height: 300px;
  margin-top: 1rem;
  position: relative;
`;

const ChartTypeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ChartTypeButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? '#4CAF50' : '#f5f5f5'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? '#45a049' : '#e0e0e0'};
  }
`;

const AlertBox = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  
  &.warning {
    background: #fff3e0;
    border-left: 4px solid #FF9800;
  }
  
  &.danger {
    background: #ffebee;
    border-left: 4px solid #f44336;
  }
  
  &.info {
    background: #e3f2fd;
    border-left: 4px solid #2196F3;
  }
  
  &.emergency {
    background: #ffebee;
    border-left: 4px solid #d32f2f;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
`;

const SuccessMessage = styled.div`
  background: #e8f5e9;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
`;

const Results = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeChart, setActiveChart] = useState('bar');
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);

  useEffect(() => {
    // Load results from localStorage
    const storedResults = localStorage.getItem('assessmentResult');
    
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);
        
        // Show emergency alert if risk level is emergency
        if (parsedResults.risk_level && parsedResults.risk_level.toLowerCase().includes('emergency')) {
          setShowEmergencyAlert(true);
        }
      } catch (err) {
        setError('Failed to load assessment results');
        console.error('Error parsing results:', err);
      }
    } else {
      setError('No assessment results found. Please complete a consultation first.');
    }
    
    setLoading(false);
  }, []);

  // Bar chart data
  const getBarChartData = (possibleConditions) => {
    if (!possibleConditions || possibleConditions.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    return {
      labels: possibleConditions.map(d => d.disease),
      datasets: [
        {
          label: 'Confidence Level',
          data: possibleConditions.map(d => (d.confidence || 0) * 100),
          backgroundColor: [
            '#4CAF50',
            '#2196F3',
            '#FF9800',
            '#9C27B0',
            '#F44336'
          ],
          borderColor: [
            '#388E3C',
            '#1976D2',
            '#F57C00',
            '#7B1FA2',
            '#D32F2F'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Pie chart data
  const getPieChartData = (possibleConditions) => {
    if (!possibleConditions || possibleConditions.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    return {
      labels: possibleConditions.map(d => d.disease),
      datasets: [
        {
          label: 'Confidence Distribution',
          data: possibleConditions.map(d => (d.confidence || 0) * 100),
          backgroundColor: [
            '#4CAF50',
            '#2196F3',
            '#FF9800',
            '#9C27B0',
            '#F44336'
          ],
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };
  };

  // Radar chart data for risk factors
  const getRadarChartData = (possibleConditions) => {
    if (!possibleConditions || possibleConditions.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    // For demonstration, we'll create synthetic risk factors
    const riskFactors = ['Severity', 'Duration', 'Contagiousness', 'Complications', 'Treatment Complexity'];
    const maxConditions = possibleConditions.slice(0, 3); // Take top 3 conditions
    
    return {
      labels: riskFactors,
      datasets: maxConditions.map((condition, index) => {
        const colors = [
          { bg: 'rgba(76, 175, 80, 0.2)', border: 'rgba(76, 175, 80, 1)' },
          { bg: 'rgba(33, 150, 243, 0.2)', border: 'rgba(33, 150, 243, 1)' },
          { bg: 'rgba(255, 152, 0, 0.2)', border: 'rgba(255, 152, 0, 1)' }
        ];
        
        return {
          label: condition.disease,
          data: [
            Math.min(100, (condition.confidence || 0) * 150), // Severity
            Math.random() * 100, // Duration
            Math.random() * 100, // Contagiousness
            Math.random() * 100, // Complications
            Math.random() * 100  // Treatment Complexity
          ],
          backgroundColor: colors[index].bg,
          borderColor: colors[index].border,
          pointBackgroundColor: colors[index].border,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: colors[index].border,
        };
      })
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}%`;
          }
        }
      }
    }
  };

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  const getRiskLevelClass = (riskLevel) => {
    if (!riskLevel) return 'moderate';
    
    const level = riskLevel.toLowerCase();
    if (level.includes('emergency')) return 'emergency';
    if (level.includes('high')) return 'high';
    if (level.includes('moderate')) return 'moderate';
    if (level.includes('low')) return 'low';
    return 'moderate';
  };

  const getRiskLevelTitle = (riskLevel) => {
    if (!riskLevel) return 'Moderate Risk';
    return riskLevel;
  };

  const renderChart = () => {
    if (!results || !results.possible_conditions || results.possible_conditions.length === 0) {
      return <div>No data available for visualization</div>;
    }

    switch (activeChart) {
      case 'bar':
        return <Bar data={getBarChartData(results.possible_conditions)} options={chartOptions} />;
      case 'pie':
        return <Pie data={getPieChartData(results.possible_conditions)} options={chartOptions} />;
      case 'radar':
        return <Radar data={getRadarChartData(results.possible_conditions)} options={radarChartOptions} />;
      default:
        return <Bar data={getBarChartData(results.possible_conditions)} options={chartOptions} />;
    }
  };

  const getRecommendations = (recommendations) => {
    if (!recommendations || !Array.isArray(recommendations)) {
      return [];
    }
    
    // Process each recommendation to ensure proper bullet point formatting
    return recommendations.map(rec => {
      // Remove any existing bullet points and clean up the text
      let cleanRec = rec.replace(/^[\s•\-–—*]+\s*/, '').trim();
      // Add a proper bullet point
      return `• ${cleanRec}`;
    });
  };

  const handleNewConsultation = () => {
    navigate('/consultation');
  };

  const handleDownloadReport = async () => {
    if (!results || !user) {
      setError('Unable to generate report. Missing data.');
      return;
    }
    
    setGeneratingPDF(true);
    setSuccess('');
    setError('');
    
    try {
      // Prepare data for PDF generation
      const reportData = {
        assessmentData: results,
        userData: user
      };
      
      // Call the API to generate the PDF
      const response = await consultationAPI.generateReport(reportData);
      
      if (response.data.pdfData && response.data.fileName) {
        // Download the PDF
        downloadPDF(response.data.pdfData, response.data.fileName);
        setSuccess('Report downloaded successfully!');
      } else {
        throw new Error('Failed to generate report');
      }
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate report. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleShareReport = () => {
    // Simulate report sharing
    alert('Share options opened!');
  };

  const handleCloseEmergencyAlert = () => {
    setShowEmergencyAlert(false);
  };

  if (loading) {
    return (
      <ResultsWrapper>
        <PageTitle>Health Assessment Results</PageTitle>
        <LoadingMessage>Loading your assessment results...</LoadingMessage>
      </ResultsWrapper>
    );
  }

  if (error) {
    return (
      <ResultsWrapper>
        <PageTitle>Health Assessment Results</PageTitle>
        <ErrorMessage>{error}</ErrorMessage>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <ActionButton primary onClick={handleNewConsultation}>
            Start New Consultation
          </ActionButton>
        </div>
      </ResultsWrapper>
    );
  }

  if (!results) {
    return (
      <ResultsWrapper>
        <PageTitle>Health Assessment Results</PageTitle>
        <ErrorMessage>No assessment data available. Please complete a consultation first.</ErrorMessage>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <ActionButton primary onClick={handleNewConsultation}>
            Start New Consultation
          </ActionButton>
        </div>
      </ResultsWrapper>
    );
  }

  const riskLevelClass = getRiskLevelClass(results.risk_level);
  const riskLevelTitle = getRiskLevelTitle(results.risk_level);
  const processedRecommendations = getRecommendations(results.recommendations);

  return (
    <ResultsWrapper>
      <PageTitle>Health Assessment Results</PageTitle>
      
      {showEmergencyAlert && (
        <EmergencyAlert onClose={handleCloseEmergencyAlert} />
      )}
      
      <ResultsContainer>
        <MainContent>
          <RiskLevel className={riskLevelClass}>
            <h2>{riskLevelTitle}</h2>
            <p>Based on your symptoms and medical history</p>
          </RiskLevel>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          {results.risk_level && results.risk_level.toLowerCase().includes('emergency') && !showEmergencyAlert && (
            <AlertBox className="emergency">
              <FaExclamationTriangle style={{ fontSize: '1.5rem', flexShrink: 0 }} />
              <div>
                <h3>Emergency Medical Attention Required</h3>
                <p>Your symptoms suggest urgent medical evaluation is required. Please seek immediate care at the nearest hospital or call emergency services (108).</p>
              </div>
            </AlertBox>
          )}
          
          {results.risk_level && results.risk_level.toLowerCase().includes('high') && (
            <AlertBox className="danger">
              <FaExclamationTriangle style={{ fontSize: '1.5rem', flexShrink: 0 }} />
              <div>
                <h3>Immediate Medical Attention Required</h3>
                <p>Your symptoms suggest urgent medical evaluation is required. Please consult with a healthcare provider today.</p>
              </div>
            </AlertBox>
          )}
          
          {results.risk_level && results.risk_level.toLowerCase().includes('moderate') && (
            <AlertBox className="warning">
              <FaExclamationTriangle style={{ fontSize: '1.5rem', flexShrink: 0 }} />
              <div>
                <h3>Medical Evaluation Recommended</h3>
                <p>Your symptoms suggest a medical condition that requires professional evaluation. Please consult with a healthcare provider within 24-48 hours.</p>
              </div>
            </AlertBox>
          )}
          
          {results.reason && (
            <Card>
              <SectionTitle><FaInfoCircle /> AI Reasoning</SectionTitle>
              <p>{results.reason}</p>
            </Card>
          )}
          
          {results.possible_conditions && results.possible_conditions.length > 0 && (
            <Card>
              <SectionTitle><FaChartBar /> Possible Conditions</SectionTitle>
              <ConditionList>
                {results.possible_conditions.map((condition, index) => (
                  <ConditionItem key={index}>
                    <span>{condition.disease}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{Math.round((condition.confidence || 0) * 100)}%</span>
                      <ConfidenceBar level={condition.confidence || 0}>
                        <ConfidenceFill level={condition.confidence || 0} />
                      </ConfidenceBar>
                    </div>
                  </ConditionItem>
                ))}
              </ConditionList>
            </Card>
          )}
          
          {results.possible_conditions && results.possible_conditions.length > 0 && (
            <Card>
              <SectionTitle>
                <FaChartLine /> Data Visualization
              </SectionTitle>
              <ChartTypeSelector>
                <ChartTypeButton 
                  active={activeChart === 'bar'} 
                  onClick={() => setActiveChart('bar')}
                >
                  Bar Chart
                </ChartTypeButton>
                <ChartTypeButton 
                  active={activeChart === 'pie'} 
                  onClick={() => setActiveChart('pie')}
                >
                  Pie Chart
                </ChartTypeButton>
                <ChartTypeButton 
                  active={activeChart === 'radar'} 
                  onClick={() => setActiveChart('radar')}
                >
                  Radar Chart
                </ChartTypeButton>
              </ChartTypeSelector>
              <ChartContainer>
                {renderChart()}
              </ChartContainer>
            </Card>
          )}
          
          {processedRecommendations && processedRecommendations.length > 0 && (
            <Card>
              <SectionTitle>Recommendations</SectionTitle>
              <RecommendationsList>
                {processedRecommendations.map((rec, index) => (
                  <RecommendationItem key={index} dangerouslySetInnerHTML={{ __html: rec.replace(/\n/g, '<br>') }} />
                ))}
              </RecommendationsList>
            </Card>
          )}
        </MainContent>
        
        <Sidebar>
          <Card>
            <ActionButton primary onClick={handleNewConsultation}>
              <FaRedo /> New Consultation
            </ActionButton>
            <ActionButton 
              onClick={handleDownloadReport} 
              disabled={generatingPDF}
            >
              <FaFilePdf /> {generatingPDF ? 'Generating...' : 'Download Report'}
            </ActionButton>
            <ActionButton onClick={handleShareReport}>
              <FaShareAlt /> Share Report
            </ActionButton>
          </Card>
          
          <Card>
            <SectionTitle>Emergency Contacts</SectionTitle>
            <ul>
              <li><strong>Ambulance:</strong> 108</li>
              <li><strong>National Emergency:</strong> 112</li>
              <li><strong>Poison Control:</strong> 1066</li>
              <li><strong>Medical Helpline:</strong> 104</li>
            </ul>
          </Card>
        </Sidebar>
      </ResultsContainer>
    </ResultsWrapper>
  );
};

export default Results;