"""
Test script to demonstrate doctor-like follow-up questions
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medaid.settings')
django.setup()

from api.llm_symptom_extractor import get_llm_symptom_extractor


def test_follow_up_questions():
    """Test the enhanced follow-up question generation"""
    
    llm_extractor = get_llm_symptom_extractor()
    
    # Test cases with different symptoms
    test_cases = [
        {
            "symptoms": "fever and vomiting",
            "age": 35,
            "sex": "male",
            "history": None
        },
        {
            "symptoms": "severe headache and neck pain",
            "age": 45,
            "sex": "female",
            "history": "hypertension"
        },
        {
            "symptoms": "chest pain and shortness of breath",
            "age": 60,
            "sex": "male",
            "history": "diabetes, heart disease"
        },
        {
            "symptoms": "stomach pain and loose motion",
            "age": 28,
            "sex": "female",
            "history": None
        },
        {
            "symptoms": "cough and difficulty breathing",
            "age": 8,
            "sex": "male",
            "history": "asthma"
        }
    ]
    
    print("=" * 80)
    print("TESTING DOCTOR-LIKE FOLLOW-UP QUESTIONS")
    print("=" * 80)
    print()
    
    for i, test in enumerate(test_cases, 1):
        print(f"\n{'─' * 80}")
        print(f"TEST CASE {i}:")
        print(f"{'─' * 80}")
        print(f"👤 Patient: {test['age']} year old {test['sex']}")
        print(f"💬 Symptoms: \"{test['symptoms']}\"")
        if test['history']:
            print(f"📋 Medical History: {test['history']}")
        print()
        
        # Generate follow-up questions
        questions = llm_extractor.generate_follow_up_questions(
            text=test['symptoms'],
            age=test['age'],
            sex=test['sex'],
            max_questions=3,
            medical_history=test['history']
        )
        
        print("🩺 DOCTOR'S FOLLOW-UP QUESTIONS:")
        for j, question in enumerate(questions, 1):
            print(f"   {j}. {question}")
        print()
    
    print("=" * 80)
    print("✅ Test completed!")
    print("=" * 80)


if __name__ == "__main__":
    test_follow_up_questions()
