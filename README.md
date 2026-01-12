# Medaid - AI-Powered Rural Healthcare Assistant

Medaid is an innovative healthcare solution designed specifically for rural and underserved communities. It combines AI-powered medical triage with multilingual support to bridge the gap between patients and healthcare providers in areas with limited medical infrastructure.

## 🏥 Overview

Medaid consists of two main applications:
1. **Patient Application** - A user-friendly interface for patients to report symptoms and receive preliminary medical assessments
2. **Clinician Dashboard** - A real-time monitoring system for healthcare providers to view patient assessments and prioritize care

## 🚀 Key Features

### Patient Application
- **Natural Language Symptom Reporting** - Patients can describe symptoms in their own words
- **Multilingual Support** - Available in English and Hindi with automatic language detection
- **Voice Input** - Audio recording support for patients who prefer speaking over typing
- **Medical Report Analysis** - Upload and analyze medical reports (PDF, images)
- **AI-Powered Triage** - Google Gemini-based risk assessment with confidence levels
- **Health Passport** - Personalized health records and recommendations
- **Emergency Detection** - Automatic identification of life-threatening conditions
- **Nearby Facility Recommendations** - Location-based hospital and clinic suggestions

### Clinician Dashboard
- **Real-Time Patient Monitoring** - Live feed of patient assessments
- **Risk-Level Prioritization** - Color-coded emergency, high, medium, and low-risk cases
- **Detailed Assessment Views** - Expandable patient information with possible conditions
- **Dashboard Metrics** - Overview of total assessments and case distribution
- **Filtering Options** - View specific risk level cases
- **Assessment Source Tracking** - Clear indication of AI vs safety rule assessments

## 🛠️ Technology Stack

- **Frontend**: Streamlit
- **Backend**: Python with pandas, scikit-learn
- **AI/LLM Integration**: Google Generative AI (Gemini) via langchain
- **Database**: MongoDB with local JSON fallback
- **Document Processing**: PyMuPDF, Pillow, pytesseract for OCR
- **PDF Generation**: reportlab
- **Voice Processing**: speech_recognition
- **Mapping**: Google Maps API

## 📁 Project Structure

```
├── app.py                 # Main patient application
├── clinician_app.py       # Clinician dashboard
├── backend_processing.py  # Core AI processing logic
├── database.py            # Database operations
├── report_processor.py    # Medical report analysis
├── report_generator.py    # PDF report creation
├── recommendations.py     # Facility recommendations
├── voice_processor.py     # Voice input handling
├── language_strings.py    # Multilingual support
├── local_db.json          # Local data storage
├── requirements.txt       # Python dependencies
└── .streamlit/secrets.toml # Password configuration
```

## 📋 Prerequisites

- Python 3.8+
- Google API Key for Generative AI
- Google Maps API Key (optional, for facility recommendations)
- MongoDB instance (optional, local JSON fallback available)
- Tesseract OCR engine (for document processing)

## 🔧 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd medaid
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   Create a `.env` file with:
   ```
   GOOGLE_API_KEY=your_google_api_key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   MONGO_URI=your_mongodb_uri (optional)
   ```

4. **Install Tesseract OCR** (for document processing):
   - Windows: Download from [Tesseract OCR](https://github.com/UB-Mannheim/tesseract/wiki)
   - macOS: `brew install tesseract`
   - Linux: `sudo apt install tesseract-ocr`

## ▶️ Running the Applications

### Patient Application
```bash
streamlit run app.py --server.port 8511
```
Access at: http://localhost:8511

### Clinician Dashboard
```bash
streamlit run clinician_app.py --server.port 8512
```
Access at: http://localhost:8512
Default Password: medaid123

## 🔐 Security

- Clinician dashboard is password-protected
- Password can be changed in `.streamlit/secrets.toml`
- Patient data is stored securely
- No patient PII displayed without authentication

## 🌍 Multilingual Support

Medaid supports multiple languages with automatic detection:
- English
- Hindi
- Local dialect terms are mapped to medical terminology

## 🚨 Emergency Handling

The system automatically detects emergency keywords and overrides normal triage:
- Severe chest pain
- Difficulty breathing
- Unconsciousness
- Heavy bleeding
- Other life-threatening conditions

## 📊 Data Storage

- **Primary**: MongoDB (if configured)
- **Fallback**: Local JSON file (`local_db.json`)
- Patient records include symptoms, assessments, and medical history

## 📞 Support

For issues with the applications:
1. Check that all API keys are correctly configured
2. Verify MongoDB connection (if used)
3. Ensure Tesseract OCR is properly installed (for document processing)
4. Check terminal output for error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Generative AI for powering the medical assessments
- Streamlit for the intuitive web interface
- Open-source community for various libraries and tools