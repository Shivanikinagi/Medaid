import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaExclamationTriangle, FaAmbulance, FaPhone } from 'react-icons/fa';

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 15px rgba(244, 67, 54, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
  }
`;

const EmergencyContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const AlertBox = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  animation: ${pulse} 2s infinite;
  border: 5px solid #f44336;
`;

const EmergencyIcon = styled.div`
  font-size: 4rem;
  color: #f44336;
  margin-bottom: 1rem;
`;

const EmergencyTitle = styled.h2`
  color: #f44336;
  margin-bottom: 1rem;
`;

const EmergencyMessage = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const EmergencyActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EmergencyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.call {
    background: linear-gradient(90deg, #f44336, #d32f2f);
    color: white;
  }
  
  &.hospital {
    background: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }
`;

const EmergencyAlert = ({ onClose }) => {
  const handleCallAmbulance = () => {
    window.location.href = 'tel:108';
  };

  const handleFindHospital = () => {
    // In a real implementation, this would open a map or hospital finder
    alert('In a real implementation, this would show nearby hospitals.');
  };

  return (
    <EmergencyContainer>
      <AlertBox>
        <EmergencyIcon>
          <FaExclamationTriangle />
        </EmergencyIcon>
        
        <EmergencyTitle>⚠️ MEDICAL EMERGENCY DETECTED ⚠️</EmergencyTitle>
        
        <EmergencyMessage>
          Based on your symptoms, this appears to be a medical emergency that requires 
          immediate attention. Please take the following actions right away:
        </EmergencyMessage>
        
        <EmergencyActions>
          <EmergencyButton className="call" onClick={handleCallAmbulance}>
            <FaPhone /> Call Ambulance (108)
          </EmergencyButton>
          
          <EmergencyButton className="hospital" onClick={handleFindHospital}>
            <FaAmbulance /> Find Nearest Hospital
          </EmergencyButton>
        </EmergencyActions>
        
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h3>⚠️ While waiting for help:</h3>
          <ul style={{ textAlign: 'left', marginTop: '0.5rem' }}>
            <li>Stay calm and try to remain still</li>
            <li>If possible, have someone stay with you</li>
            <li>Do not eat or drink anything</li>
            <li>Keep your phone charged and nearby</li>
          </ul>
        </div>
        
        <button
          onClick={onClose}
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
            background: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Close Alert
        </button>
      </AlertBox>
    </EmergencyContainer>
  );
};

export default EmergencyAlert;