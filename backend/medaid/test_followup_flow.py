"""
Test script for the two-phase triage with follow-up questions

This demonstrates:
1. Phase 1: User submits symptoms → System asks follow-up questions
2. Phase 2: User answers questions → System provides full diagnosis
"""

# Example Phase 1 Request (Initial Symptoms)
phase1_request = {
    "current_symptoms": "I have a headache and feel dizzy",
    "input_mode": "text",
    "location": "Mumbai",
    "pincode": "400001"
}

# Example Phase 1 Response (Follow-up Questions)
phase1_response = {
    "triage_id": 123,
    "status": "needs_follow_up",
    "message": "Please answer these questions to help us better understand your condition:",
    "follow_up_questions": [
        "How long have you been experiencing these symptoms?",
        "On a scale of 1-10, how severe is the headache?",
        "Have you experienced any nausea, vomiting, or vision changes?"
    ],
    "initial_symptoms": "I have a headache and feel dizzy"
}

# Example Phase 2 Request (Follow-up Answers)
phase2_request = {
    "triage_id": 123,
    "follow_up_answers": "I've had these symptoms for 2 days. The headache is about 7/10 in severity. Yes, I've been feeling nauseous and my vision is a bit blurry.",
    "location": "Mumbai",
    "pincode": "400001"
}

# Example Phase 2 Response (Complete Assessment)
phase2_response = {
    "triage_id": 123,
    "status": "assessment_complete",
    "risk_level": "Medium",
    "risk_probability": 0.65,
    "reasoning": "Based on your symptoms of persistent headache with dizziness, nausea, and vision changes lasting 2 days...",
    "confidence": 0.78,
    "possible_conditions": [
        {
            "disease": "Migraine",
            "confidence": 0.72,
            "supporting_evidence": "Severe headache with visual disturbances and nausea"
        },
        {
            "disease": "Tension Headache",
            "confidence": 0.58,
            "supporting_evidence": "Persistent headache and dizziness"
        },
        {
            "disease": "Sinusitis",
            "confidence": 0.45,
            "supporting_evidence": "Headache and facial pressure"
        }
    ],
    "recommendations": [
        "Rest in a dark, quiet room",
        "Stay hydrated and avoid triggers",
        "Consider over-the-counter pain medication",
        "If symptoms worsen or persist beyond 3 days, consult a doctor",
        "Seek immediate care if you experience sudden severe headache or loss of consciousness"
    ],
    "when_to_seek_care": "Consult a doctor within 24-48 hours if symptoms don't improve",
    "disclaimer": "This is not a medical diagnosis. Please consult a healthcare professional for proper evaluation.",
    "nearby_hospitals": []
}

print("✅ Two-Phase Triage System Implemented")
print("\n📋 How it works:")
print("1. User submits initial symptoms")
print("2. LLM generates 2-3 intelligent follow-up questions")
print("3. User answers the questions")
print("4. System performs full triage assessment with complete information")
print("\n🎯 Benefits:")
print("- More accurate diagnoses with additional context")
print("- Reduces ambiguity and vague symptoms")
print("- Follows clinical best practices")
print("- Improves user engagement and trust")
