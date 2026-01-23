"""
safety_checker.py - Safety Checking Module
"""

from dataclasses import dataclass, field
from typing import List, Optional, Tuple, Dict
from .symptom_extractor import StructuredSymptom


@dataclass
class SafetyIssue:
    """Safety issue detected"""
    level: str  # "warning", "critical"
    message: str
    recommendation: str
    severity: str = "warning"  # "warning", "critical"
    issue_type: str = "general"
    description: str = ""
    
    def __post_init__(self):
        if not self.description:
            self.description = self.message
        if not self.severity:
            self.severity = self.level
    
    def to_dict(self):
        return {
            "level": self.level,
            "message": self.message,
            "recommendation": self.recommendation,
            "severity": self.severity,
            "type": self.issue_type
        }


@dataclass
class ContradictionCheck:
    """Contradiction check result"""
    has_contradictions: bool
    issues: List[str]
    confidence_penalty: float = 0.0
    contradictions: List[str] = None
    
    def __post_init__(self):
        if self.contradictions is None:
            self.contradictions = self.issues.copy() if self.issues else []


class SafetyChecker:
    """Checks for safety issues and contradictions"""
    
    def __init__(self):
        self.critical_symptoms = [
            "chest pain", "difficulty breathing", "severe bleeding",
            "loss of consciousness", "severe head injury"
        ]

    def check(self, symptoms: List[StructuredSymptom], 
              user_input: str = "") -> List[SafetyIssue]:
        """Check for safety issues"""
        issues = []
        
        # Check for critical symptoms
        for symptom in symptoms:
            if symptom.name in self.critical_symptoms:
                issues.append(SafetyIssue(
                    level="critical",
                    message=f"Critical symptom detected: {symptom.name}",
                    recommendation="Seek immediate emergency medical attention (call 911)"
                ))
        
        return issues

    def check_contradictions(self, symptoms: List[StructuredSymptom]) -> ContradictionCheck:
        """Check for contradictions in symptoms"""
        # Simple implementation
        return ContradictionCheck(
            has_contradictions=False,
            issues=[],
            confidence_penalty=0.0,
            contradictions=[]
        )
    
    def check_safety(self, symptoms: List[StructuredSymptom], risk_score,
                     disease_predictions: List, age: int = None, sex: str = None,
                     original_text: str = "") -> Tuple[bool, List[SafetyIssue]]:
        """Comprehensive safety check"""
        issues = self.check(symptoms, original_text)
        is_safe = not any(issue.level == "critical" for issue in issues)
        return is_safe, issues
    
    def get_follow_up_questions(self, symptoms: List[StructuredSymptom],
                                contradictions = None, max_questions: int = 3,
                                age: int = None, risk_level: str = None,
                                original_text: str = "", medical_history: str = None,
                                sex: str = None) -> List[str]:
        """Generate intelligent follow-up questions using LLM if available"""
        
        # Try to use LLM-based question generation first
        try:
            from .llm_symptom_extractor import get_llm_symptom_extractor
            llm_extractor = get_llm_symptom_extractor()
            
            if llm_extractor.has_llm and original_text:
                print("🔍 Using LLM to generate doctor-like follow-up questions...")
                questions = llm_extractor.generate_follow_up_questions(
                    text=original_text,
                    age=age,
                    sex=sex,
                    max_questions=max_questions,
                    medical_history=medical_history
                )
                if questions and len(questions) > 0:
                    return questions
        except Exception as e:
            print(f"⚠️ LLM question generation failed, using fallback: {e}")
        
        # Fallback to rule-based questions
        questions = []
        
        # Symptom-specific questions based on what was detected
        symptom_names = [s.name.lower() for s in symptoms]
        
        if any('fever' in name or 'temperature' in name for name in symptom_names):
            questions.append("What is your exact temperature reading, and are you experiencing chills or sweating?")
        
        if any('pain' in name or 'ache' in name for name in symptom_names):
            questions.append("On a scale of 1-10, how severe is the pain, and where exactly is it located?")
        
        if any('vomit' in name or 'nausea' in name for name in symptom_names):
            questions.append("How many times have you vomited, and is there any blood or unusual color?")
        
        if any('cough' in name for name in symptom_names):
            questions.append("Is the cough dry or productive, and are you bringing up any colored phlegm?")
        
        # General medical questions
        if len(symptoms) < 2:
            questions.append("Are you experiencing any other symptoms that you haven't mentioned yet?")
        
        if age and age > 60:
            questions.append("Do you have any chronic medical conditions like diabetes, hypertension, or heart disease?")
        elif age and age < 5:
            questions.append("Has the child been eating and drinking normally, and are they as active as usual?")
        
        if risk_level and risk_level in ["high", "emergency"]:
            questions.append("When exactly did these symptoms start, and have they been getting progressively worse?")
        
        # Duration and progression
        if not any('start' in q.lower() or 'when' in q.lower() for q in questions):
            questions.append("How long have you had these symptoms, and are they getting better or worse?")
        
        # Return up to max_questions
        return questions[:max_questions] if questions else [
            "Can you describe your symptoms in more detail?",
            "How long have you been experiencing this?",
            "Have you noticed anything that makes it better or worse?"
        ][:max_questions]


# Singleton instance
_safety_checker = None


def get_safety_checker() -> SafetyChecker:
    """Get the safety checker singleton"""
    global _safety_checker
    if _safety_checker is None:
        _safety_checker = SafetyChecker()
    return _safety_checker
