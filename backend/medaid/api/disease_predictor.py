"""
disease_predictor.py - Disease Prediction Module
"""

from dataclasses import dataclass
from typing import List, Dict, Optional
from .symptom_extractor import StructuredSymptom


@dataclass
class DiseasePrediction:
    """Disease prediction result"""
    name: str
    probability: float
    confidence: float
    reasoning: str
    supporting_evidence: List[str] = None
    
    def __post_init__(self):
        if self.supporting_evidence is None:
            self.supporting_evidence = []


class DiseasePredictor:
    """Predicts possible diseases from symptoms"""
    
    def __init__(self):
        self.disease_symptom_map = {
            "Common Cold": ["cough", "fever", "fatigue", "headache"],
            "Influenza": ["fever", "cough", "fatigue", "headache", "pain"],
            "Migraine": ["headache", "nausea", "dizziness"],
            "Gastroenteritis": ["nausea", "vomiting", "diarrhea", "abdominal pain"],
            "Food Poisoning": ["nausea", "vomiting", "diarrhea", "abdominal pain"],
        }

    def predict(self, symptoms: List[StructuredSymptom], 
                age: int = None, sex: str = None, medical_history: dict = None,
                season: str = None, location: str = None) -> List[DiseasePrediction]:
        """Predict possible diseases"""
        
        symptom_names = [s.name for s in symptoms]
        predictions = []
        
        for disease, disease_symptoms in self.disease_symptom_map.items():
            matches = sum(1 for s in symptom_names if s in disease_symptoms)
            if matches > 0:
                probability = matches / len(disease_symptoms)
                evidence = [s for s in symptom_names if s in disease_symptoms]
                predictions.append(DiseasePrediction(
                    name=disease,
                    probability=probability,
                    confidence=0.6 + (probability * 0.3),
                    reasoning=f"Matches {matches} of {len(disease_symptoms)} typical symptoms",
                    supporting_evidence=evidence
                ))
        
        # Sort by probability
        predictions.sort(key=lambda x: x.probability, reverse=True)
        
        return predictions[:5] if predictions else [
            DiseasePrediction(
                name="Unknown Condition",
                probability=0.3,
                confidence=0.3,
                reasoning="Insufficient symptom information",
                supporting_evidence=[]
            )
        ]
    
    def get_ruled_out_conditions(self, symptoms: List[StructuredSymptom],
                                  age: int = None, medical_history: dict = None,
                                  max_conditions: int = 5) -> List[Dict]:
        """Get conditions that are ruled out"""
        symptom_names = [s.name for s in symptoms]
        ruled_out = []
        
        for disease, disease_symptoms in self.disease_symptom_map.items():
            matches = sum(1 for s in symptom_names if s in disease_symptoms)
            if matches == 0:
                ruled_out.append({
                    "disease": disease,
                    "reason": "No matching symptoms"
                })
        
        return ruled_out[:max_conditions]


# Singleton instance
_disease_predictor = None


def get_disease_predictor() -> DiseasePredictor:
    """Get the disease predictor singleton"""
    global _disease_predictor
    if _disease_predictor is None:
        _disease_predictor = DiseasePredictor()
    return _disease_predictor
