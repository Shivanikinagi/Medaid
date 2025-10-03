# MedAid - Rural Healthcare Assistant

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-14.x-green.svg)
![MongoDB](https://img.shields.io/badge/mongodb-4.4-orange.svg)

MedAid is an AI-powered healthcare assistant designed specifically for rural communities. It provides medical triage, symptom analysis, and connects patients with nearby healthcare facilities.

## Features

- **AI-Powered Medical Analysis**: Advanced symptom analysis using machine learning
- **Multilingual Support**: Available in English, Hindi, and Marathi
- **Medical Report Processing**: Upload and analyze medical reports
- **User Dashboard**: Track health history and past consultations
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Emergency Alert System**: Immediate help for critical situations
- **Comprehensive Assessment**: Combines past history, current symptoms, and report data

## Enhanced Report Processing

MedAid now provides real and proper report processing that combines all available data sources for comprehensive medical assessment:

- **Past Medical History Integration**: Considers patient's chronic conditions, allergies, and previous illnesses
- **Current Symptoms Analysis**: Evaluates reported symptoms in context of medical history
- **Medical Report Data Extraction**: Processes uploaded reports to extract key medical values
- **Holistic Assessment**: All data sources are combined for a comprehensive medical evaluation

## Technology Stack

### Frontend
- React with functional components and hooks
- Styled Components for styling
- Framer Motion for animations
- Chart.js for data visualization
- React Router for navigation

### Backend
- Node.js with Express.js
- MongoDB for data storage
- Python service for AI/ML processing
- Google Gemini API for natural language processing

### AI/ML Components
- Medical symptom analysis engine
- Report processing and data extraction
- Risk assessment algorithms
- Multilingual natural language processing

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/medaid.git
cd medaid
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Set up environment variables:
Create `.env` files in both frontend and backend directories with required configuration.

5. Start the development servers:
```bash
# In backend directory
npm run dev

# In frontend directory
npm run dev
```

## Usage

1. Register or login to the application
2. Complete your medical profile including past history
3. Describe your current symptoms or upload a medical report
4. Receive AI-powered medical assessment and recommendations
5. View nearby healthcare facilities if needed
6. Download and share your health report

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Consultation
- `POST /api/consultations/start` - Start new consultation
- `POST /api/consultations/clarification` - Process clarification questions
- `POST /api/consultations/report` - Generate PDF report

### Reports
- `POST /api/reports/process` - Process medical report
- `POST /api/reports/explanation` - Generate report explanation
- `POST /api/reports/analyze` - Analyze symptoms from report

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors who have helped build this project
- Medical expertise provided by healthcare professionals
- AI models powered by Google Gemini
