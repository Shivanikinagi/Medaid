"""
Medical Analyzer Service - Python backend for MedAid
This service exposes the existing Python medical analysis functionality as a REST API
"""

import sys
import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

# Add the project directory to Python path
# Fix the path to correctly point to the project directory
project_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(project_path)
sys.path.append(os.path.join(project_path, 'project'))  # Add project directory as well

# Import the existing backend processing functions
try:
    from backend_processing import integrate_report_and_run_assessment, handle_user_message
    from report_analyzer import report_to_feature_vector
    print("✅ Successfully imported backend processing modules")
except Exception as e:
    print(f"❌ Error importing backend processing modules: {e}")
    # Create mock functions for development
    def integrate_report_and_run_assessment(report_data, user_inputs, user_profile):
        return {
            "status": "ok", 
            "assessment": {
                "possible_conditions": [{"disease": "Mock Condition", "confidence": 0.8}],
                "risk_level": "Medium",
                "risk_proba": 0.7,
                "reason": "This is a mock assessment for development purposes.",
                "recommendations": ["Rest", "Stay hydrated", "Consult a doctor if symptoms worsen"]
            }
        }
    
    def handle_user_message(user_input, input_type="text"):
        return {"transcript": user_input}
    
    def report_to_feature_vector(report_json, symptoms_text, user_profile):
        return {"age": user_profile.get("age", 0), "symptom_text": symptoms_text}

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Medical Analyzer Service is running"})

@app.route('/analyze', methods=['POST'])
def analyze_symptoms():
    """Analyze symptoms and provide medical assessment"""
    try:
        data = request.get_json()
        print(f"Received data: {data}")
        
        report_data = data.get('report_data', {})
        user_inputs = data.get('user_inputs', {})
        user_profile = data.get('user_profile', {})
        
        print(f"report_data: {report_data}")
        print(f"user_inputs: {user_inputs}")
        print(f"user_profile: {user_profile}")
        
        # Call the existing analysis function
        result = integrate_report_and_run_assessment(report_data, user_inputs, user_profile)
        
        return jsonify(result)
    except Exception as e:
        print(f"Error in analyze_symptoms: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/report_features', methods=['POST'])
def report_features():
    """Convert report to feature vector"""
    try:
        data = request.get_json()
        report_json = data.get('report_json', {})
        symptoms_text = data.get('symptoms_text', '')
        user_profile = data.get('user_profile', {})
        
        # Call the existing feature extraction function
        features = report_to_feature_vector(report_json, symptoms_text, user_profile)
        
        return jsonify({"features": features})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='localhost', port=5001, debug=True)