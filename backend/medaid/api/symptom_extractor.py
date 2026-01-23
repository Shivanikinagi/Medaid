"""
symptom_extractor.py - Structured Symptom Extraction Module
"""

from enum import Enum
from typing import List, Optional
from dataclasses import dataclass


class Severity(Enum):
    """Symptom severity levels"""
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"
    CRITICAL = "critical"


@dataclass
class StructuredSymptom:
    """Structured representation of a symptom"""
    name: str
    severity: Severity
    duration: Optional[str] = None
    frequency: Optional[str] = None
    location: Optional[str] = None
    onset: Optional[str] = None
    progression: Optional[str] = None
    associated_symptoms: List[str] = None
    medical_term: str = ""
    negated: bool = False
    duration_days: int = 0
    duration_hours: int = 0

    def __post_init__(self):
        if self.associated_symptoms is None:
            self.associated_symptoms = []
        if not self.medical_term:
            self.medical_term = self.name
    
    def to_dict(self):
        return {
            "name": self.name,
            "medical_term": self.medical_term or self.name,
            "severity": self.severity.value if hasattr(self.severity, 'value') else str(self.severity),
            "negated": self.negated,
            "duration": self.duration,
            "duration_days": self.duration_days,
            "duration_hours": self.duration_hours,
            "frequency": self.frequency,
            "location": self.location
        }


class SymptomExtractor:
    """Extracts structured symptoms from text"""
    
    def __init__(self):
        self.common_symptoms = [
            "fever", "cough", "headache", "pain", "nausea", "vomiting",
            "diarrhea", "fatigue", "weakness", "dizziness", "shortness of breath",
            "chest pain", "abdominal pain", "back pain", "rash", "swelling"
        ]

    def extract(self, text: str) -> List[StructuredSymptom]:
        """Extract symptoms from text"""
        symptoms = []
        text_lower = text.lower()
        
        # Simple extraction logic
        for symptom in self.common_symptoms:
            if symptom in text_lower:
                severity = self._determine_severity(text_lower, symptom)
                symptoms.append(StructuredSymptom(
                    name=symptom,
                    severity=severity
                ))
        
        return symptoms if symptoms else [
            StructuredSymptom(name="general discomfort", severity=Severity.MILD)
        ]

    def _determine_severity(self, text: str, symptom: str) -> Severity:
        """Determine severity from context"""
        if any(word in text for word in ["severe", "extreme", "unbearable", "worst"]):
            return Severity.SEVERE
        elif any(word in text for word in ["moderate", "significant"]):
            return Severity.MODERATE
        elif any(word in text for word in ["mild", "slight", "little"]):
            return Severity.MILD
        return Severity.MODERATE


# Singleton instance
_symptom_extractor = None


def get_symptom_extractor() -> SymptomExtractor:
    """Get the symptom extractor singleton"""
    global _symptom_extractor
    if _symptom_extractor is None:
        _symptom_extractor = SymptomExtractor()
    return _symptom_extractor
