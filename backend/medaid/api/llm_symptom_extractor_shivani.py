"""
llm_symptom_extractor.py - LLM-powered Symptom Extraction with Follow-up Questions
"""

import os
import json
from typing import List, Dict, Optional
from .symptom_extractor import StructuredSymptom, Severity

try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False


class LLMSymptomExtractor:
    """LLM-powered symptom extractor"""
    
    def __init__(self):
        self.has_llm = False
        if HAS_GEMINI:
            api_key = os.getenv('GOOGLE_API_KEY')
            if api_key:
                try:
                    genai.configure(api_key=api_key)
                    # Use the latest available Gemini models
                    model_names = [
                        'gemini-2.5-flash',          # Latest stable Flash model
                        'gemini-2.0-flash',          # Gemini 2.0 Flash
                        'gemini-flash-latest',       # Latest flash alias
                        'gemini-2.5-pro',            # Pro model if needed
                        'gemini-2.0-flash-001',      # Specific version
                    ]
                    
                    for model_name in model_names:
                        try:
                            self.model = genai.GenerativeModel(model_name)
                            # Test the model with a simple query
                            self.model.generate_content("test")
                            print(f"✅ Successfully initialized Gemini model: {model_name}")
                            self.has_llm = True
                            break
                        except Exception as e:
                            print(f"⚠️ Model {model_name} failed: {e}")
                            continue
                    
                    if not self.has_llm:
                        print("❌ All Gemini model names failed, using fallback questions")
                except Exception as e:
                    print(f"Failed to initialize LLM: {e}")

    def extract(self, text: str, age: Optional[int] = None, 
                sex: Optional[str] = None) -> List[StructuredSymptom]:
        """Extract symptoms using LLM"""
        if not self.has_llm:
            # Fallback to basic extraction
            from .symptom_extractor import get_symptom_extractor
            return get_symptom_extractor().extract(text)
        
        try:
            prompt = f"""Extract medical symptoms from this text: "{text}"
            
Return a JSON array of symptoms with: name, severity (mild/moderate/severe/critical), duration, frequency.
Example: [{{"name": "headache", "severity": "moderate", "duration": "2 days"}}]
"""
            
            response = self.model.generate_content(prompt)
            # Parse response (simplified)
            return self._parse_response(response.text)
        except Exception as e:
            print(f"LLM extraction failed: {e}")
            from .symptom_extractor import get_symptom_extractor
            return get_symptom_extractor().extract(text)

    def _parse_response(self, response: str) -> List[StructuredSymptom]:
        """Parse LLM response into structured symptoms"""
        # Simplified parsing
        from .symptom_extractor import get_symptom_extractor
        return get_symptom_extractor().extract(response)
    
    def generate_follow_up_questions(self, text: str, age: Optional[int] = None, 
                                    sex: Optional[str] = None, max_questions: int = 3,
                                    medical_history: Optional[str] = None) -> List[str]:
        """Generate intelligent follow-up questions like a real doctor would ask"""
        if not self.has_llm:
            # Fallback to generic questions
            return self._generate_generic_questions(text) 
        
        try:
            # Build detailed patient context
            age_str = f"{age} years old" if age else "age not specified"
            sex_str = sex.capitalize() if sex else "not specified"
            history_str = f"\n- Medical History: {medical_history}" if medical_history else ""
            
            prompt = f"""You are an experienced emergency room doctor conducting a focused patient interview to make an accurate diagnosis.

PATIENT PRESENTATION:
- Chief Complaint: "{text}"
- Age: {age_str}
- Sex: {sex_str}{history_str}

YOUR ROLE: Ask {max_questions} highly specific, medically relevant follow-up questions that would help you:

1. **CHARACTERIZE THE SYMPTOMS** - Ask about the exact nature, quality, and characteristics
   - For fever: actual temperature readings, pattern (continuous/intermittent), chills/rigors?
   - For pain: exact location, quality (sharp/dull/burning), radiation, intensity (1-10)?
   - For vomiting: frequency, color, blood presence, relationship to food/activity?
   - For diarrhea: consistency, frequency, blood/mucus, associated cramping?

2. **ESTABLISH TIMELINE** - When did it start? How has it evolved?
   - Sudden onset vs gradual? Getting better/worse/same?
   - Any triggering events?

3. **IDENTIFY ASSOCIATED SYMPTOMS** - Based on the chief complaint, ask about:
   - For GI symptoms (vomiting/diarrhea): fever, abdominal pain, recent food, others sick?
   - For fever: source identification - cough, urinary symptoms, rash, neck stiffness?
   - For headache: visual changes, neck stiffness, worst headache of life?
   - For chest pain: radiation to arm/jaw, shortness of breath, sweating?

4. **ASSESS SEVERITY & RED FLAGS** - Life-threatening features
   - Ability to tolerate fluids? Signs of dehydration?
   - Altered consciousness? Severe pain? Breathing difficulty?

5. **RELEVANT CONTEXT** - Risk factors
   - Recent travel, sick contacts, medication changes?
   - Pregnancy possibility (if applicable)? Chronic conditions?

CRITICAL INSTRUCTIONS:
- Be SYMPTOM-SPECIFIC: Tailor questions to the exact symptoms mentioned
- Ask about QUANTIFIABLE details: temperatures, pain scales, frequency counts
- Use PATIENT-FRIENDLY language: avoid jargon, explain terms if needed
- Focus on DIAGNOSTIC VALUE: each question should help narrow differential diagnosis
- Be EMPATHETIC but EFFICIENT: "I understand this must be difficult. To help you best, I need to know..."

EXAMPLES:

For "fever and vomiting":
[
  "What is your actual temperature reading, and when did the fever first start?",
  "How many times have you vomited in the last 24 hours, and is there any blood or bile (yellow/green color) in it?",
  "Are you experiencing any abdominal pain, diarrhea, severe headache, or have others around you been sick with similar symptoms?"
]

For "chest pain and shortness of breath":
[
  "Can you describe exactly where the chest pain is located and does it spread to your jaw, shoulder, or arm?",
  "On a scale of 1-10, how severe is the pain, and is it sharp, pressure-like, or burning?",
  "Are you experiencing any sweating, nausea, palpitations, or has this pain come on suddenly during exertion?"
]

For "severe headache":
[
  "Is this the worst headache you've ever experienced, and did it come on suddenly like a thunderclap?",
  "Do you have any neck stiffness, sensitivity to light, fever, vision changes, or vomiting?",
  "Have you had any recent head injury, and are you experiencing any weakness or numbness anywhere?"
]

RESPONSE FORMAT: Return ONLY a valid JSON array with exactly {max_questions} questions, nothing else:
["Question 1?", "Question 2?", "Question 3?"]

Generate {max_questions} medically precise questions for this patient now:
"""
            
            response = self.model.generate_content(prompt)
            content = response.text.strip()
            
            # Clean markdown code blocks if present
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()
            
            # Parse JSON
            questions = json.loads(content)
            
            # Validate and limit
            if isinstance(questions, list) and len(questions) > 0:
                # Take only the requested number of questions
                final_questions = questions[:max_questions]
                print(f"✅ Generated {len(final_questions)} doctor-like follow-up questions")
                return final_questions
            else:
                print("⚠️ Invalid questions format, using fallback")
                return self._generate_generic_questions(text)
                
        except Exception as e:
            print(f"Error generating follow-up questions: {e}")
            return self._generate_generic_questions(text)
    
    def _generate_generic_questions(self, text: str) -> List[str]:
        """Fallback generic but medically relevant follow-up questions based on symptoms"""
        text_lower = text.lower()
        
        # Symptom-specific fallback questions
        if any(word in text_lower for word in ['fever', 'temperature', 'bukhar']):
            return [
                "What is your current temperature reading, and when did the fever start?",
                "Are you experiencing any chills, sweating, or body aches along with the fever?",
                "Do you have any other symptoms like cough, sore throat, headache, or abdominal pain?"
            ]
        
        if any(word in text_lower for word in ['vomit', 'vomiting', 'nausea', 'ulti', 'throw up']):
            return [
                "How many times have you vomited in the last 24 hours, and is there any blood or bile in it?",
                "Are you able to keep down any fluids, and are you experiencing abdominal pain or diarrhea?",
                "Did this start suddenly after eating something, or has anyone else around you been sick?"
            ]
        
        if any(word in text_lower for word in ['headache', 'head pain', 'sir dard', 'migraine']):
            return [
                "Where exactly is the headache located, and is it throbbing, sharp, or a dull ache?",
                "On a scale of 1-10, how severe is the pain, and is this the worst headache you've ever had?",
                "Are you experiencing any vision changes, neck stiffness, nausea, or sensitivity to light?"
            ]
        
        if any(word in text_lower for word in ['chest pain', 'heart pain', 'seene mein dard']):
            return [
                "Where exactly is the chest pain, and does it spread to your arm, jaw, or shoulder?",
                "Is the pain sharp, pressure-like, or burning, and does it get worse with breathing or movement?",
                "Are you experiencing any shortness of breath, sweating, nausea, or palpitations?"
            ]
        
        if any(word in text_lower for word in ['stomach', 'abdominal', 'pet dard', 'belly']):
            return [
                "Where exactly in your abdomen is the pain, and is it constant or cramping?",
                "When did the pain start, and have you noticed any vomiting, diarrhea, or fever?",
                "Have you had any recent changes in bowel movements, and is the pain getting worse?"
            ]
        
        if any(word in text_lower for word in ['cough', 'khansi']):
            return [
                "Is the cough dry or are you bringing up phlegm, and what color is it?",
                "How long have you had the cough, and do you have any fever, chest pain, or shortness of breath?",
                "Is the cough worse at any particular time, and have you been exposed to anyone sick?"
            ]
        
        if any(word in text_lower for word in ['diarrhea', 'loose motion', 'dast']):
            return [
                "How many loose stools have you had today, and is there any blood or mucus in them?",
                "Are you experiencing abdominal cramping, fever, or vomiting along with the diarrhea?",
                "Did this start after eating something specific, or has anyone else been affected?"
            ]
        
        # Default comprehensive questions
        return [
            "How long have you been experiencing these symptoms, and did they start suddenly or gradually?",
            "On a scale of 1-10, how would you rate the severity of your symptoms?",
            "Have you noticed any other symptoms like fever, pain, weakness, or changes in appetite that you haven't mentioned?"
        ]


# Singleton instance
_llm_symptom_extractor = None


def get_llm_symptom_extractor() -> LLMSymptomExtractor:
    """Get the LLM symptom extractor singleton"""
    global _llm_symptom_extractor
    if _llm_symptom_extractor is None:
        _llm_symptom_extractor = LLMSymptomExtractor()
    return _llm_symptom_extractor
