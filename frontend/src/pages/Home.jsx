import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStethoscope, FaFileMedical, FaComments, FaAmbulance, FaHeartbeat, FaUserMd } from 'react-icons/fa';

const HomeWrapper = styled.div`
  min-height: calc(100vh - 120px);
  padding: 2rem 0;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
  border-radius: 0 0 20px 20px;
  margin-bottom: 3rem;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: #FF9800;
  color: white;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: #F57C00;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const FeaturesSection = styled.section`
  padding: 3rem 0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2E7D32;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FeatureCard = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: #4CAF50;
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2E7D32;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const HowItWorksSection = styled.section`
  background: #f8f9fa;
  padding: 3rem 0;
  border-radius: 20px;
  margin: 3rem 0;
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
  flex-wrap: wrap;
`;

const Step = styled.div`
  text-align: center;
  flex: 1;
  min-width: 200px;
  padding: 1rem;
`;

const StepNumber = styled.div`
  width: 50px;
  height: 50px;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1rem;
`;

const StepTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #2E7D32;
`;

const Home = () => {
  const features = [
    {
      icon: <FaStethoscope />,
      title: "AI-Powered Diagnosis",
      description: "Our advanced AI analyzes your symptoms to provide accurate health assessments and recommendations."
    },
    {
      icon: <FaFileMedical />,
      title: "Report Analysis",
      description: "Upload medical reports for detailed analysis and interpretation by our intelligent system."
    },
    {
      icon: <FaComments />,
      title: "Natural Conversation",
      description: "Chat naturally with our AI doctor about your health concerns in English or Hindi."
    },
    {
      icon: <FaAmbulance />,
      title: "Emergency Detection",
      description: "Immediate identification of critical conditions requiring urgent medical attention."
    },
    {
      icon: <FaHeartbeat />,
      title: "Health Monitoring",
      description: "Track your health history and receive personalized health insights over time."
    },
    {
      icon: <FaUserMd />,
      title: "Rural Healthcare",
      description: "Designed specifically for rural communities with practical, accessible healthcare solutions."
    }
  ];

  const steps = [
    { number: 1, title: "Sign Up", description: "Create your free account in seconds" },
    { number: 2, title: "Describe Symptoms", description: "Tell us about your health concerns" },
    { number: 3, title: "Get Assessment", description: "Receive AI-powered health analysis" },
    { number: 4, title: "Follow Recommendations", description: "Get actionable health advice" }
  ];

  return (
    <HomeWrapper>
      <HeroSection>
        <HeroContent>
          <HeroTitle>MedAid - Rural Healthcare Assistant</HeroTitle>
          <HeroSubtitle>
            AI-powered healthcare support designed specifically for rural communities. 
            Get accurate health assessments and recommendations right from your phone.
          </HeroSubtitle>
          <CTAButton to="/login">
            Start Health Consultation
          </CTAButton>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Our Features</SectionTitle>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      <HowItWorksSection>
        <SectionTitle>How It Works</SectionTitle>
        <StepsContainer>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepNumber>{step.number}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <p>{step.description}</p>
            </Step>
          ))}
        </StepsContainer>
      </HowItWorksSection>
    </HomeWrapper>
  );
};

export default Home;