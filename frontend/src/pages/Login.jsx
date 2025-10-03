import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaLanguage } from 'react-icons/fa';

const LoginWrapper = styled.div`
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
`;

const LoginCard = styled(motion.div)`
  background: white;
  border-radius: 15px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 2rem;
    color: #2E7D32;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
  }
`;

const Form = styled.form`
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #777;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 15px 15px 45px;
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

const Select = styled.select`
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(90deg, #4CAF50, #2E7D32);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #ddd;
    z-index: 1;
  }
  
  span {
    background: white;
    position: relative;
    z-index: 2;
    padding: 0 15px;
    color: #777;
  }
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const OptionButton = styled.button`
  padding: 15px;
  border: 2px solid ${props => props.selected ? '#4CAF50' : '#ddd'};
  border-radius: 8px;
  background: ${props => props.selected ? 'rgba(76, 175, 80, 0.1)' : 'white'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    border-color: #4CAF50;
  }
  
  span {
    font-size: 1.5rem;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  background: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
`;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    language: 'English'
  });
  const [inputMode, setInputMode] = useState('text');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // For login, we only need email (password is optional in this implementation)
      // But the auth endpoint expects email and password
      const loginData = {
        email: formData.email,
        password: 'default_password' // Using default password as this is a simplified auth system
      };
      
      await login(loginData);
      navigate('/consultation');
    } catch (err) {
      setError('Failed to login. Please try again.');
      setLoading(false);
    }
  };

  return (
    <LoginWrapper>
      <LoginCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardHeader>
          <h2>Welcome to MedAid</h2>
          <p>Let's get started with your health consultation</p>
        </CardHeader>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <InputIcon>
              <FaUser />
            </InputIcon>
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="120"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <InputIcon>
              <FaEnvelope />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <InputIcon>
              <FaLanguage />
            </InputIcon>
            <Select
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Marathi">Marathi (मराठी)</option>
            </Select>
          </FormGroup>
          
          <Divider>
            <span>How would you like to communicate?</span>
          </Divider>
          
          <OptionsGrid>
            <OptionButton 
              type="button" 
              selected={inputMode === 'text'}
              onClick={() => setInputMode('text')}
            >
              <span>💬</span>
              <p>Type/Text</p>
            </OptionButton>
            
            <OptionButton 
              type="button" 
              selected={inputMode === 'report'}
              onClick={() => setInputMode('report')}
            >
              <span>📄</span>
              <p>Report</p>
            </OptionButton>
          </OptionsGrid>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Starting Session...' : 'Start Health Consultation'}
          </Button>
        </Form>
        
        <p style={{ textAlign: 'center', color: '#666' }}>
          Already have an account? <Link to="/dashboard">Sign in</Link>
        </p>
      </LoginCard>
    </LoginWrapper>
  );
};

export default Login;