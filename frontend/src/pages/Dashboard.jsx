import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { FaUserMd, FaHistory, FaFileMedical, FaChartLine, FaPlus, FaCalendarAlt, FaStethoscope } from 'react-icons/fa';

const DashboardWrapper = styled.div`
  min-height: calc(100vh - 120px);
  padding: 2rem 0;
`;

const PageTitle = styled.h1`
  text-align: center;
  color: #2E7D32;
  margin-bottom: 2rem;
`;

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
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

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(90deg, #4CAF50, #2E7D32);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
`;

const ProfileInfo = styled.div`
  h2 {
    margin: 0 0 0.5rem 0;
    color: #2E7D32;
  }
  
  p {
    margin: 0.25rem 0;
    color: #666;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const StatIcon = styled.div`
  font-size: 2rem;
  color: #4CAF50;
  margin-bottom: 1rem;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #2E7D32;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
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

const ConsultationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ConsultationItem = styled.div`
  padding: 1.5rem;
  border-radius: 12px;
  background: #f8f9fa;
  border-left: 4px solid #4CAF50;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: #e9f7ef;
    transform: translateX(5px);
  }
`;

const ConsultationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ConsultationTitle = styled.h4`
  margin: 0;
  color: #2E7D32;
`;

const ConsultationDate = styled.div`
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ConsultationSymptoms = styled.p`
  margin: 0.5rem 0;
  color: #555;
`;

const RiskBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  
  &.low {
    background: #e8f5e9;
    color: #2E7D32;
  }
  
  &.moderate {
    background: #fff3e0;
    color: #EF6C00;
  }
  
  &.high {
    background: #ffebee;
    color: #C62828;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 20px;
  background: linear-gradient(90deg, #4CAF50, #2E7D32);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  
  p {
    margin-top: 1rem;
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Mock consultations data
      const mockConsultations = [
        {
          id: 1,
          date: '2025-09-15T10:30:00Z',
          symptoms: 'Fever and body pain for 2 days',
          risk_level: 'Moderate Risk',
          conditions: ['Viral Fever', 'Flu']
        },
        {
          id: 2,
          date: '2025-09-10T14:15:00Z',
          symptoms: 'Headache and dizziness',
          risk_level: 'Low Risk',
          conditions: ['Tension Headache', 'Dehydration']
        },
        {
          id: 3,
          date: '2025-09-05T09:45:00Z',
          symptoms: 'Stomach pain after eating',
          risk_level: 'Low Risk',
          conditions: ['Indigestion', 'Gas']
        }
      ];
      setConsultations(mockConsultations);
    }
  }, [user, navigate]);

  const handleNewConsultation = () => {
    navigate('/consultation');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardWrapper>
      <PageTitle>My Health Dashboard</PageTitle>
      
      <DashboardContainer>
        <MainContent>
          <Card>
            <ProfileHeader>
              <Avatar>
                {user.name.charAt(0)}
              </Avatar>
              <ProfileInfo>
                <h2>{user.name}</h2>
                <p><strong>Age:</strong> {user.age} years</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
              </ProfileInfo>
            </ProfileHeader>
          </Card>
          
          <StatsGrid>
            <StatCard>
              <StatIcon>
                <FaStethoscope />
              </StatIcon>
              <StatNumber>{consultations.length}</StatNumber>
              <StatLabel>Total Consultations</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatIcon>
                <FaHistory />
              </StatIcon>
              <StatNumber>{user.past_history ? Object.keys(user.past_history).length : 0}</StatNumber>
              <StatLabel>Medical Conditions</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatIcon>
                <FaChartLine />
              </StatIcon>
              <StatNumber>85%</StatNumber>
              <StatLabel>Health Score</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatIcon>
                <FaFileMedical />
              </StatIcon>
              <StatNumber>{user.report_data ? 1 : 0}</StatNumber>
              <StatLabel>Reports Uploaded</StatLabel>
            </StatCard>
          </StatsGrid>
          
          <Card>
            <SectionTitle>
              <FaHistory /> Recent Consultations
            </SectionTitle>
            
            {consultations.length > 0 ? (
              <ConsultationList>
                {consultations.map((consultation) => (
                  <ConsultationItem 
                    key={consultation.id}
                    onClick={() => navigate('/results')}
                  >
                    <ConsultationHeader>
                      <ConsultationTitle>
                        Consultation #{consultation.id}
                      </ConsultationTitle>
                      <ConsultationDate>
                        <FaCalendarAlt /> {formatDate(consultation.date)}
                      </ConsultationDate>
                    </ConsultationHeader>
                    <ConsultationSymptoms>
                      {consultation.symptoms}
                    </ConsultationSymptoms>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        {consultation.conditions.map((condition, index) => (
                          <span key={index} style={{ 
                            background: '#e0f7fa', 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '4px', 
                            fontSize: '0.8rem',
                            marginRight: '0.5rem'
                          }}>
                            {condition}
                          </span>
                        ))}
                      </div>
                      <RiskBadge className={
                        consultation.risk_level.includes('High') ? 'high' :
                        consultation.risk_level.includes('Moderate') ? 'moderate' : 'low'
                      }>
                        {consultation.risk_level}
                      </RiskBadge>
                    </div>
                  </ConsultationItem>
                ))}
              </ConsultationList>
            ) : (
              <EmptyState>
                <FaHistory style={{ fontSize: '3rem', color: '#ccc' }} />
                <p>You haven't had any consultations yet.</p>
                <p>Start your first health consultation to see your history here.</p>
              </EmptyState>
            )}
          </Card>
        </MainContent>
        
        <Sidebar>
          <Card>
            <ActionButton onClick={handleNewConsultation}>
              <FaPlus /> New Consultation
            </ActionButton>
          </Card>
          
          <Card>
            <SectionTitle>
              <FaUserMd /> Health Tips
            </SectionTitle>
            <ul>
              <li style={{ marginBottom: '1rem' }}>
                <strong>Stay Hydrated:</strong> Drink at least 8 glasses of water daily.
              </li>
              <li style={{ marginBottom: '1rem' }}>
                <strong>Regular Exercise:</strong> Aim for 30 minutes of activity daily.
              </li>
              <li style={{ marginBottom: '1rem' }}>
                <strong>Balanced Diet:</strong> Include fruits and vegetables in every meal.
              </li>
              <li>
                <strong>Sleep Well:</strong> Get 7-8 hours of quality sleep each night.
              </li>
            </ul>
          </Card>
          
          <Card>
            <SectionTitle>
              <FaFileMedical /> Quick Actions
            </SectionTitle>
            <ul>
              <li style={{ marginBottom: '1rem' }}>
                <a href="#" style={{ color: '#4CAF50', textDecoration: 'none' }}>
                  Upload Medical Report
                </a>
              </li>
              <li style={{ marginBottom: '1rem' }}>
                <a href="#" style={{ color: '#4CAF50', textDecoration: 'none' }}>
                  View Health Timeline
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#4CAF50', textDecoration: 'none' }}>
                  Export Health Data
                </a>
              </li>
            </ul>
          </Card>
        </Sidebar>
      </DashboardContainer>
    </DashboardWrapper>
  );
};

export default Dashboard;