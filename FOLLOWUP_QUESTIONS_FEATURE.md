# Follow-Up Questions Feature - Implementation Guide

## Overview

The MedAid triage system now implements a **two-phase conversation flow** before disease prediction. This follows clinical best practices by gathering comprehensive information before making medical assessments.

## How It Works

### Phase 1: Initial Symptom Collection + Follow-Up Questions

**User Action:** Submits initial symptoms

**System Response:** Generates 2-3 intelligent, context-aware follow-up questions

### Phase 2: Complete Assessment

**User Action:** Answers the follow-up questions

**System Response:** Performs full triage assessment with disease prediction

---

## API Endpoints

### POST `/api/assess-symptoms/`

This endpoint now handles BOTH phases.

#### Phase 1 Request (Initial Symptoms)

```json
{
  "current_symptoms": "I have fever and body pain",
  "input_mode": "text",
  "location": "Mumbai",
  "pincode": "400001"
}
```

#### Phase 1 Response (Follow-Up Questions)

```json
{
  "triage_id": 123,
  "status": "needs_follow_up",
  "message": "Please answer these questions to help us better understand your condition:",
  "follow_up_questions": [
    "How long have you had the fever?",
    "Do you have any cough, sore throat, or difficulty breathing?",
    "Have you been in contact with anyone who was sick recently?"
  ],
  "initial_symptoms": "I have fever and body pain"
}
```

#### Phase 2 Request (Follow-Up Answers)

```json
{
  "triage_id": 123,
  "follow_up_answers": "The fever started 3 days ago. I have a mild cough but no sore throat. No known sick contacts.",
  "location": "Mumbai",
  "pincode": "400001"
}
```

#### Phase 2 Response (Complete Assessment)

```json
{
  "triage_id": 123,
  "status": "assessment_complete",
  "risk_level": "Medium",
  "risk_probability": 0.65,
  "reasoning": "Based on your symptoms...",
  "confidence": 0.78,
  "possible_conditions": [
    {
      "disease": "Viral Fever",
      "confidence": 0.82,
      "supporting_evidence": "Fever with body pain and mild cough"
    }
  ],
  "recommendations": [
    "Rest and stay hydrated",
    "Monitor temperature regularly",
    "Take paracetamol for fever"
  ],
  "when_to_seek_care": "If fever persists beyond 5 days or worsens",
  "disclaimer": "This is not a medical diagnosis...",
  "nearby_hospitals": []
}
```

---

## Database Changes

### New Fields in `TriageRecord` Model

```python
needs_follow_up = BooleanField(default=False)
follow_up_questions = JSONField(default=list, blank=True)
follow_up_answers = TextField(blank=True, null=True)
```

### Migration

Run: `python manage.py migrate`

Applied: `0006_triagerecord_follow_up_answers_and_more`

---

## Backend Implementation

### Files Modified

1. **`llm_symptom_extractor.py`**
   - Added `generate_follow_up_questions()` method
   - Uses Gemini LLM to generate intelligent, context-aware questions
   - Fallback to generic questions if LLM unavailable

2. **`models.py`**
   - Added follow-up conversation tracking fields to `TriageRecord`

3. **`views.py`**
   - Added `process_follow_up_answers()` helper function
   - Modified `assess_symptoms()` to handle two-phase flow
   - Phase detection based on presence of `triage_id` and `follow_up_answers`

---

## LLM Follow-Up Question Generation

### How It Works

The LLM is prompted to:
1. ✅ Ask about MISSING critical information (duration, severity, location, timing)
2. ✅ Ask about RED FLAGS (fever, weight loss, bleeding, chest pain)
3. ✅ Ask about ASSOCIATED symptoms (helps differentiate conditions)
4. ✅ Use simple, patient-friendly language
5. ✅ Each question focuses on ONE specific thing

### Example Prompts

**Input:** "I have a headache"

**Generated Questions:**
- "How long have you had this headache?"
- "On a scale of 1-10, how severe is the pain?"
- "Do you have any fever, nausea, or vision changes?"

**Input:** "My stomach hurts"

**Generated Questions:**
- "Where exactly in your stomach does it hurt?"
- "Did you eat anything unusual recently?"
- "Are you experiencing vomiting, diarrhea, or fever?"

---

## Frontend Integration Guide

### Step 1: Submit Initial Symptoms

```javascript
const response = await fetch('/api/assess-symptoms/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    current_symptoms: userInput,
    input_mode: 'text',
    location: 'Mumbai',
    pincode: '400001'
  })
});

const data = await response.json();

if (data.status === 'needs_follow_up') {
  // PHASE 1: Display follow-up questions
  displayFollowUpQuestions(data.follow_up_questions, data.triage_id);
} else if (data.status === 'assessment_complete') {
  // Emergency case - skip follow-up
  displayAssessment(data);
}
```

### Step 2: Submit Follow-Up Answers

```javascript
const response = await fetch('/api/assess-symptoms/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    triage_id: triageId,
    follow_up_answers: userAnswers,
    location: 'Mumbai',
    pincode: '400001'
  })
});

const data = await response.json();

if (data.status === 'assessment_complete') {
  // PHASE 2: Display full assessment
  displayAssessment(data);
}
```

### UI Recommendations

1. **Phase 1 UI:**
   - Display follow-up questions one by one or as a list
   - Use a form with text inputs or radio buttons
   - Show progress indicator (e.g., "Question 1 of 3")

2. **Phase 2 UI:**
   - Display complete assessment with risk level
   - Show disease predictions with confidence scores
   - List recommendations clearly
   - Include nearby hospitals if available

---

## Benefits

### Clinical Benefits
- ✅ **More Accurate Diagnoses:** Additional context improves prediction accuracy
- ✅ **Reduces Ambiguity:** Clarifies vague symptoms
- ✅ **Follows Best Practices:** Mimics real doctor consultation flow
- ✅ **Red Flag Detection:** Specifically asks about dangerous symptoms

### Technical Benefits
- ✅ **Better Data Quality:** Structured information for ML models
- ✅ **Audit Trail:** Tracks conversation flow
- ✅ **Confidence Calibration:** System knows when it needs more info

### User Benefits
- ✅ **Improved Trust:** Shows the system is thorough
- ✅ **Better Engagement:** Interactive conversation vs one-shot
- ✅ **Educational:** Helps users understand what's clinically relevant

---

## Emergency Cases

**Important:** Emergency cases skip the follow-up phase and go straight to assessment.

If emergency keywords detected:
- "chest pain"
- "cannot breathe"
- "severe bleeding"
- "unconscious"

System immediately returns:
```json
{
  "risk_level": "emergency",
  "status": "assessment_complete",
  "recommendations": [
    "🚨 CALL EMERGENCY SERVICES IMMEDIATELY (108/112)",
    ...
  ]
}
```

---

## Testing

### Manual Test

1. Start backend: `python manage.py runserver`
2. Submit symptoms: `"I have a headache"`
3. Verify follow-up questions are generated
4. Submit answers
5. Verify full assessment is returned

### API Test

See: `test_followup_flow.py` for example requests/responses

---

## Configuration

### Environment Variables

Ensure you have:
```
GOOGLE_API_KEY=your_gemini_api_key
```

Without this, the system falls back to generic questions.

---

## Future Enhancements

- [ ] Support for multi-turn conversations (more than 2 phases)
- [ ] Voice input for follow-up answers
- [ ] Smart question branching based on previous answers
- [ ] Machine learning model to predict optimal questions
- [ ] A/B testing different question strategies

---

## Troubleshooting

### Issue: "Invalid triage ID or follow-up already completed"
**Cause:** Trying to submit follow-up for non-existent or completed triage  
**Solution:** Ensure you're using the correct `triage_id` from Phase 1 response

### Issue: Generic questions instead of smart ones
**Cause:** LLM not initialized (missing API key or import error)  
**Solution:** Check `GOOGLE_API_KEY` environment variable and Gemini installation

### Issue: Migration errors
**Cause:** Database not migrated  
**Solution:** Run `python manage.py migrate`

---

## Contact

For questions or issues, refer to the main README or contact the development team.
