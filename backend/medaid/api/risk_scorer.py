"""
risk_scorer.py - Risk Scoring Module
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional
from .symptom_extractor import StructuredSymptom, Severity


@dataclass
class RiskScore:
    """Risk score result"""
    risk_level: str  # "low", "moderate", "high", "critical"
    total_score: float  # 0-15
    confidence: float  # 0-1
    reasoning: List[str]
    breakdown: Dict = None
    
    def __post_init__(self):
        if self.breakdown is None:
            self.breakdown = {}


class RiskScorer:
    """Calculates risk scores from symptoms"""
    
    def __init__(self):
        self.emergency_symptoms = [
            "chest pain", "shortness of breath", "severe bleeding",
            "loss of consciousness", "severe headache", "stroke symptoms"
        ]

    def calculate_risk(self, symptoms: List[StructuredSymptom], age: int = None, 
              sex: str = None, medical_history: dict = None) -> RiskScore:
        """Calculate risk score"""
        
        # Check for emergency symptoms
        for symptom in symptoms:
            if symptom.name in self.emergency_symptoms:
                return RiskScore(
                    risk_level="critical",
                    total_score=14.0,
                    confidence=0.9,
                    reasoning=[f"Emergency symptom detected: {symptom.name}"],
                    breakdown={"emergency": True}
                )
        
        # Calculate base score from severity
        total_score = 0
        for symptom in symptoms:
            if symptom.severity == Severity.CRITICAL:
                total_score += 4.0
            elif symptom.severity == Severity.SEVERE:
                total_score += 3.0
            elif symptom.severity == Severity.MODERATE:
                total_score += 2.0
            else:
                total_score += 1.0
        
        # Determine risk level
        if total_score >= 10:
            level = "high"
        elif total_score >= 5:
            level = "moderate"
        else:
            level = "low"
        
        return RiskScore(
            risk_level=level,
            total_score=min(total_score, 15.0),
            confidence=0.75,
            reasoning=[f"Based on {len(symptoms)} symptom(s) with total score {total_score}"],
            breakdown={"symptom_count": len(symptoms), "total_score": total_score}
        )


# Singleton instance
_risk_scorer = None


def get_risk_scorer() -> RiskScorer:
    """Get the risk scorer singleton"""
    global _risk_scorer
    if _risk_scorer is None:
        _risk_scorer = RiskScorer()
    return _risk_scorer
