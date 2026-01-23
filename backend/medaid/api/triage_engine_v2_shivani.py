"""
triage_engine_v2.py - Intelligent Multi-Stage Medical Triage Engine

This is a complete rewrite of the triage system with:
1. Structured symptom extraction (not keyword matching)
2. Temporal reasoning (duration, progression, onset)
3. Weighted risk scoring (not binary decisions)
4. Age and sex-aware medical reasoning
5. Probabilistic disease ranking
6. Confidence calibration
7. Contradiction detection and safety checks
8. Intelligent follow-up questions
"""

import os
import json
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from dotenv import load_dotenv

# Import V2 modules (relative imports within api package)
from .symptom_extractor import get_symptom_extractor, StructuredSymptom, Severity
from .risk_scorer import get_risk_scorer, RiskScore
from .disease_predictor import get_disease_predictor, DiseasePrediction
from .safety_checker import get_safety_checker, SafetyIssue, ContradictionCheck
from .regional_intelligence import get_regional_intelligence
from .llm_symptom_extractor import get_llm_symptom_extractor  # REQUIRED: AI-powered extraction

# Import LLM for enhancement (optional)
try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain.prompts import PromptTemplate
    from langchain.chains import LLMChain
    LANGCHAIN_AVAILABLE = True
except ImportError:
    LANGCHAIN_AVAILABLE = False

load_dotenv()


class TriageEngineV2:
    """
    V2 Triage Engine with Multi-Stage Reasoning
    
    Pipeline:
    1. Extract structured symptoms from text
    2. Validate and check contradictions
    3. Calculate weighted risk score
    4. Predict diseases with probabilities
    5. Safety checks and red flag detection
    6. Generate follow-up questions if needed
    7. Optional: LLM enhancement for explanation
    """
    
    def __init__(self):
        # Initialize modules
        self.symptom_extractor = get_symptom_extractor()  # Fallback only
        self.llm_extractor = get_llm_symptom_extractor()  # PRIMARY: AI-powered extractor (REQUIRED)
        
        self.risk_scorer = get_risk_scorer()
        self.disease_predictor = get_disease_predictor()
        self.safety_checker = get_safety_checker()
        self.regional_intelligence = get_regional_intelligence()
        
        # Initialize optional LLM for explanations
        self.llm = None
        self.chain = None
        self._initialize_llm()
    
    def _initialize_llm(self):
        """Initialize LLM for generating explanations"""
        if not LANGCHAIN_AVAILABLE:
            return
        
        google_api_key = os.getenv("GOOGLE_API_KEY")
        if not google_api_key:
            return
        
        try:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                google_api_key=google_api_key,
                temperature=0.5
            )
            
            # Prompt for generating patient-friendly explanations
            prompt_template = PromptTemplate(
                input_variables=["symptoms", "risk_level", "diseases", "reasoning"],
                template="""You are a medical AI assistant. Generate a clear, empathetic explanation for a patient.

PATIENT SYMPTOMS: {symptoms}

RISK ASSESSMENT: {risk_level}

POSSIBLE CONDITIONS: {diseases}

REASONING: {reasoning}

Generate a SHORT (2-3 sentences), patient-friendly explanation that:
1. Acknowledges their symptoms
2. Explains the risk level in simple terms
3. Is reassuring but honest
4. Does NOT diagnose

Response:"""
            )
            
            self.chain = LLMChain(llm=self.llm, prompt=prompt_template)
            
        except Exception as e:
            print(f"Warning: Could not initialize LLM: {e}")
            self.llm = None
    
    def assess(
        self,
        symptoms_text: str,
        user_data: Dict,
        report_summary: str = "",
        location: str = ""
    ) -> Dict:
        """
        Main triage assessment method
        """
        # Try full LLM assessment first for maximum accuracy
        if self.llm:
            try:
                llm_response = self._assess_with_llm_full(symptoms_text, user_data, report_summary, location)
                if llm_response:
                    return llm_response
            except Exception as e:
                print(f"Full LLM assessment failed, falling back to hybrid pipeline: {e}")

        # Extract user data
        age = user_data.get('age')
        sex = user_data.get('gender', user_data.get('sex'))
        medical_history = user_data.get('past_history', [])
        
        # --- STAGE 1: Symptom Extraction (AI-Powered when available) ---
        symptoms = []
        
        print(f"🤖 Using Gemini AI to extract symptoms from: '{symptoms_text}'")
        
        # Use LLM extraction (PRIMARY method)
        llm_result = self.llm_extractor.extract(symptoms_text, age=age, sex=sex)
        
        # LLM result is already a list of StructuredSymptom objects
        symptoms = llm_result if isinstance(llm_result, list) else []
        
        # Only fallback to keyword if LLM returned absolutely nothing
        if not symptoms:
            print("⚠️  LLM returned no symptoms, using keyword fallback as last resort")
            symptoms = self.symptom_extractor.extract(symptoms_text)
        
        # --- STAGE 2: Contradiction Detection ---
        contradiction_check = self.safety_checker.check_contradictions(
            symptoms=symptoms
        )
        
        # --- STAGE 3: Risk Scoring ---
        risk_score = self.risk_scorer.calculate_risk(
            symptoms=symptoms,
            age=age,
            sex=sex,
            medical_history=medical_history
        )
        
        # Apply contradiction penalty to confidence
        if contradiction_check.has_contradictions:
            risk_score.confidence = max(
                0.3,
                risk_score.confidence - contradiction_check.confidence_penalty
            )
        
        # --- STAGE 4: Disease Prediction ---
        disease_predictions = self.disease_predictor.predict(
            symptoms=symptoms,
            age=age,
            sex=sex,
            medical_history=medical_history,
            season=self._get_current_season(),
            location=location
        )
        
        # Get ruled-out conditions for transparency
        ruled_out_conditions = self.disease_predictor.get_ruled_out_conditions(
            symptoms=symptoms,
            age=age,
            medical_history=medical_history,
            max_conditions=5
        )
        
        # --- STAGE 5: Safety Checks ---
        is_safe, safety_issues = self.safety_checker.check_safety(
            symptoms=symptoms,
            risk_score=risk_score,
            disease_predictions=disease_predictions,
            age=age,
            sex=sex,
            original_text=symptoms_text
        )
        
        # Handle critical safety issues (override risk if needed)
        critical_issues = [i for i in safety_issues if i.severity == 'critical']
        if critical_issues:
            # Check for under-triage issues
            for issue in critical_issues:
                if issue.issue_type in ['dangerous_under_triage', 'severity_risk_mismatch']:
                    # Force escalate risk
                    risk_score.risk_level = 'high'
                    risk_score.total_score = max(risk_score.total_score, 12)
                    risk_score.reasoning.append(
                        f"⚠️ Risk escalated: {issue.description}"
                    )
        
        # --- STAGE 6: Generate Follow-up Questions ---
        follow_up_questions = []
        if contradiction_check.has_contradictions or risk_score.confidence < 0.7:
            follow_up_questions = self.safety_checker.get_follow_up_questions(
                symptoms=symptoms,
                contradictions=contradiction_check,
                max_questions=3,
                age=age,
                risk_level=risk_score.risk_level,
                original_text=current_symptoms,  # Pass original user input
                medical_history=medical_history,  # Pass medical history
                sex=sex  # Pass sex
            )
        
        # --- STAGE 7: Generate Recommendations ---
        recommendations = self._generate_recommendations(
            risk_level=risk_score.risk_level,
            symptoms=symptoms,
            diseases=disease_predictions,
            medical_history=medical_history,
            location=location
        )
        
        # --- STAGE 8: Generate Explanation (Optional LLM Enhancement) ---
        explanation = self._generate_explanation(
            symptoms=symptoms,
            risk_score=risk_score,
            diseases=disease_predictions
        )
        
        # --- STAGE 9: Generate Medical Disclaimer ---
        disclaimer = self._generate_disclaimer(risk_score.risk_level)
        
        # --- Construct Response ---
        response = {
            # Main assessment
            'risk_level': risk_score.risk_level.capitalize(),
            'risk_score': risk_score.total_score,
            'confidence': risk_score.confidence,
            'reasoning': explanation or self._format_reasoning(risk_score.reasoning),
            
            # Diseases
            'possible_conditions': [
                {
                    'disease': d.name,
                    'confidence': d.probability,
                    'supporting_evidence': d.supporting_evidence
                }
                for d in disease_predictions
            ],
            
            # Ruled out conditions (improves trust)
            'ruled_out_conditions': ruled_out_conditions,
            
            # Recommendations
            'recommendations': recommendations,
            
            # Structured data
            'structured_symptoms': [s.to_dict() for s in symptoms if not s.negated],
            'risk_breakdown': risk_score.breakdown,
            
            # Safety and quality
            'contradictions': contradiction_check.contradictions if contradiction_check.has_contradictions else [],
            'safety_issues': [i.to_dict() for i in safety_issues],
            'follow_up_questions': follow_up_questions,
            
            # Nearby facilities (if location provided)
            'nearby_facilities': self._get_nearby_facilities(location, risk_score.risk_level) if location else [],
            
            # Medical disclaimer
            'disclaimer': disclaimer,
            
            # Metadata
            'assessment_time': datetime.now().isoformat(),
            'engine_version': 'v2.0',
            'multi_stage': True
        }
        
        return response
    
    def _assess_with_llm_full(self, symptoms_text: str, user_data: Dict, report_summary: str, location: str) -> Optional[Dict]:
        """Perform complete assessment using Gemini for higher accuracy"""
        
        prompt = f"""You are MedAid, an advanced AI medical assistant. 
        Analyze the following case for a user (Age: {user_data.get('age')}, Sex: {user_data.get('gender')}, History: {user_data.get('past_history')}).
        The user is likely from a RURAL area. 
        
        Symptoms: "{symptoms_text}"
        Medical Report Context: "{report_summary}"
        
        Provide a structured JSON response with:
        1. "risk_level": "emergency", "high", "medium", or "low"
        2. "risk_score": 0-100 (integer)
        3. "confidence": 0.0-1.0 (float)
        4. "possible_conditions": Array of top 3 objects {{ "disease": "Name", "confidence": 0.0-1.0, "supporting_evidence": "reason" }}
        5. "reasoning": A clear, empathetic explanation (2-3 sentences) suitable for a rural patient.
        6. "recommendations": Array of practical, actionable steps (home remedies, when to see doctor).

        IMPORTANT:
        - Be accurate. If symptoms like "bleeding from nose" appear, do NOT say "Unknown Condition". Identify it as "Epistaxis (Nosebleed)" and assess cause.
        - If critical (chest pain, severe bleeding), flag as "emergency".
        - Use simple language.
        
        Response JSON:"""
        
        try:
            response = self.llm.invoke(prompt)
            content = response.content.strip()
            # Clean md blocks
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
            
            data = json.loads(content)
            
            # Post-processing to match system structure
            data['assessment_time'] = datetime.now().isoformat()
            data['engine_version'] = 'v2.0-Gemini'
            
            # Enhance with facilities if location is present
            if location:
                 data['nearby_facilities'] = self._get_nearby_facilities(location, data.get('risk_level', 'medium'))
            else:
                 data['nearby_facilities'] = []
                 
            return data
        except Exception as e:
            print(f"Error in _assess_with_llm_full: {e}")
            return None

    def _minimal_symptoms_response(self) -> Dict:
        """Response when no clear symptoms are provided"""
        return {
            'risk_level': 'Low',
            'risk_score': 0,
            'confidence': 0.3,
            'reasoning': 'Unable to assess risk without clear symptom information. Please describe your symptoms in more detail.',
            'possible_conditions': [],
            'recommendations': [
                'Please describe your symptoms more specifically',
                'Include information about: what you\'re feeling, where, how long, severity',
                'Seek medical care if you\'re concerned about your health'
            ],
            'structured_symptoms': [],
            'contradictions': [],
            'follow_up_questions': [
                'What specific symptoms are you experiencing?',
                'How long have you had these symptoms?',
                'How severe are they on a scale of 1-10?'
            ],
            'engine_version': 'v2.0'
        }
    
    def _generate_recommendations(
        self,
        risk_level: str,
        symptoms: List[StructuredSymptom],
        diseases: List[DiseasePrediction],
        medical_history: List[str],
        location: str
    ) -> List[str]:
        """Generate actionable recommendations based on risk level"""
        
        recommendations = []
        
        if risk_level == 'emergency':
            recommendations.extend([
                '🚨 SEEK EMERGENCY MEDICAL CARE IMMEDIATELY',
                'Call emergency services (108 or 112 in India)',
                'Go to the nearest emergency room',
                'Do not drive yourself - have someone drive you or call ambulance',
                'Do not delay - this could be life-threatening'
            ])
        
        elif risk_level == 'high':
            recommendations.extend([
                '⚠️ Seek medical care within 2-4 hours',
                'Visit urgent care or emergency room',
                'Do not wait for symptoms to worsen',
                'Have someone accompany you if possible',
                'Bring list of current medications and medical history'
            ])
        
        elif risk_level == 'medium':
            recommendations.extend([
                'Consult a doctor within 24-48 hours',
                'Monitor your symptoms closely',
                'Seek immediate care if symptoms worsen',
                'Rest and stay hydrated',
                'Avoid strenuous activities'
            ])
            
            # Add disease-specific recommendations
            if diseases:
                top_disease = diseases[0]
                if 'infection' in top_disease.category or 'Fever' in top_disease.name:
                    recommendations.append('Maintain good hygiene to prevent spread')
                if 'respiratory' in top_disease.category:
                    recommendations.append('Use prescribed inhalers if you have them')
        
        else:  # low risk
            recommendations.extend([
                'Monitor your symptoms',
                'Rest and stay well-hydrated',
                'Use over-the-counter remedies as needed',
                'Consult a doctor if symptoms persist beyond 3-5 days',
                'Seek immediate care if symptoms suddenly worsen'
            ])
        
        # Add history-specific recommendations
        if medical_history:
            for condition in medical_history:
                if 'diabetes' in condition.lower():
                    recommendations.append('Monitor blood sugar levels regularly')
                if 'hypertension' in condition.lower():
                    recommendations.append('Monitor blood pressure if possible')
                if 'asthma' in condition.lower() or 'copd' in condition.lower():
                    recommendations.append('Keep rescue inhaler accessible')
        
        return recommendations[:6]  # Limit to 6 recommendations
    
    def _generate_explanation(
        self,
        symptoms: List[StructuredSymptom],
        risk_score: RiskScore,
        diseases: List[DiseasePrediction]
    ) -> Optional[str]:
        """Generate conversational AI doctor response using Gemini"""
        
        # Try using Gemini AI for conversational response
        try:
            import google.generativeai as genai
            import os
            
            api_key = os.getenv('GOOGLE_API_KEY')
            if not api_key:
                return self._generate_basic_explanation(symptoms, risk_score, diseases)
            
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-pro')
            
            # Format symptoms
            symptom_list = [s.name.replace('_', ' ') for s in symptoms if not s.negated]
            
            # Format top 3 diseases with evidence
            disease_info = []
            for idx, d in enumerate(diseases[:3], 1):
                evidence = ', '.join(d.supporting_evidence) if d.supporting_evidence else 'general symptoms'
                disease_info.append(
                    f"{idx}. {d.name} ({int(d.probability * 100)}% probability) - based on {evidence}"
                )
            
            prompt = f"""You are an empathetic AI doctor providing a pre-clinical diagnosis. 

Patient reported symptoms: {', '.join(symptom_list)}
Risk Level: {risk_score.risk_level.upper()}

Based on the analysis, here are the top 3 possible conditions:
{chr(10).join(disease_info)}

Provide a conversational, caring response that:
1. Acknowledges the patient's symptoms
2. Explains the top 3 possible conditions and WHY they were predicted (mention the specific symptoms that led to each diagnosis)
3. Gives clear, actionable recommendations
4. Reassures the patient while being medically accurate
5. Advises when to seek immediate medical care

Keep it concise (3-4 paragraphs), professional yet warm, and easy to understand. Start with a greeting."""
            
            response = model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            print(f"Gemini AI response generation failed: {e}")
            return self._generate_basic_explanation(symptoms, risk_score, diseases)
    
    def _generate_basic_explanation(
        self,
        symptoms: List[StructuredSymptom],
        risk_score: RiskScore,
        diseases: List[DiseasePrediction]
    ) -> str:
        """Generate basic explanation as fallback"""
        symptom_list = ', '.join([s.name.replace('_', ' ') for s in symptoms if not s.negated][:5])
        disease_list = ', '.join([d.name for d in diseases[:3]])
        
        return f"Based on your symptoms ({symptom_list}), the assessment shows a {risk_score.risk_level} risk level. Possible conditions include: {disease_list}. {' '.join(risk_score.reasoning[:2])}"
    
    def _get_nearby_facilities(self, location: str, risk_level: str) -> List[Dict]:
        """Get nearby healthcare facilities based on location and risk level"""
        facilities = []
        
        # Determine facility type based on risk
        if risk_level in ['high', 'critical']:
            facility_types = ['Emergency Room', 'Hospital']
        else:
            facility_types = ['Clinic', 'Diagnostic Center', 'General Physician']
        
        # Mock facilities - in production, integrate with Google Maps API or healthcare directory
        for ftype in facility_types[:2]:
            facilities.append({
                'name': f'{ftype} near {location or "you"}',
                'type': ftype,
                'distance': '1.2 km',
                'rating': 4.5,
                'available': True
            })
        
        return facilities
    
    def _format_reasoning(self, reasoning_list: List[str]) -> str:
        """Format reasoning into readable text"""
        if not reasoning_list:
            return "Assessment based on reported symptoms."
        
        # Combine top reasons
        main_reasons = reasoning_list[:4]
        return ' '.join(main_reasons)
    
    def _get_current_season(self) -> Optional[str]:
        """Determine current season for seasonal disease risk"""
        month = datetime.now().month
        
        # India seasons (approximate)
        if month in [6, 7, 8, 9]:
            return 'monsoon'
        elif month in [3, 4, 5]:
            return 'summer'
        elif month in [12, 1, 2]:
            return 'winter'
        else:
            return 'spring'
    
    def _generate_disclaimer(self, risk_level: str) -> str:
        """
        Generate risk-level specific medical disclaimer
        
        Critical for regulatory compliance and user safety
        """
        base_disclaimer = (
            "⚠️ IMPORTANT: This is an AI-powered preliminary assessment and NOT a medical diagnosis. "
            "It should not replace professional medical advice, diagnosis, or treatment. "
        )
        
        if risk_level == 'emergency':
            return (
                base_disclaimer +
                "🚨 EMERGENCY SITUATION: Seek immediate medical attention. "
                "Call emergency services (108/112) or go to the nearest emergency room NOW. "
                "Do not delay - this could be life-threatening."
            )
        
        elif risk_level == 'high':
            return (
                base_disclaimer +
                "⚠️ HIGH RISK: You should see a healthcare provider within 2-4 hours. "
                "If symptoms worsen or new concerning symptoms develop, seek emergency care immediately."
            )
        
        elif risk_level == 'medium':
            return (
                base_disclaimer +
                "Consult a doctor within 24-48 hours. Monitor your symptoms and seek immediate care "
                "if they worsen significantly."
            )
        
        else:  # low
            return (
                base_disclaimer +
                "While your current symptoms appear mild, if they persist, worsen, or you develop "
                "new concerning symptoms, please consult a healthcare provider."
            )
    
    def get_symptom_summary(self, symptoms_text: str) -> Dict:
        """
        Extract and return structured symptom summary
        (Useful for debugging or detailed analysis)
        """
        symptoms = self.symptom_extractor.extract(symptoms_text)
        summary = self.symptom_extractor.get_symptom_summary(symptoms)
        
        return {
            'structured_symptoms': [s.to_dict() for s in symptoms],
            'summary': summary,
            'symptom_count': len([s for s in symptoms if not s.negated])
        }


# Global instance
_triage_engine_v2 = None

def get_triage_engine_v2() -> TriageEngineV2:
    """Get singleton instance of V2 triage engine"""
    global _triage_engine_v2
    if _triage_engine_v2 is None:
        _triage_engine_v2 = TriageEngineV2()
    return _triage_engine_v2


# Convenience function for backward compatibility
def assess_triage_v2(
    symptoms: str,
    age: int = None,
    gender: str = None,
    past_history: List[str] = None,
    report_summary: str = "",
    location: str = ""
) -> Dict:
    """
    Convenience function for triage assessment
    
    Usage:
        result = assess_triage_v2(
            symptoms="severe chest pain since 2 hours",
            age=55,
            gender="male",
            past_history=["Hypertension", "Diabetes"]
        )
    """
    engine = get_triage_engine_v2()
    
    user_data = {
        'age': age,
        'gender': gender,
        'past_history': past_history or []
    }
    
    return engine.assess(
        symptoms_text=symptoms,
        user_data=user_data,
        report_summary=report_summary,
        location=location
    )
