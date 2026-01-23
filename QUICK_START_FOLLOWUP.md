# Quick Start: Two-Phase Triage with Follow-Up Questions

## 🚀 Quick Setup

### 1. Apply Database Migration
```bash
cd backend/medaid
python manage.py migrate
```

### 2. Verify Environment Variable
```bash
# Make sure this is set in your .env file
GOOGLE_API_KEY=your_gemini_api_key
```

### 3. Start Backend
```bash
python manage.py runserver
```

---

## 📱 API Usage Examples

### Example 1: Simple Symptom
```bash
# Phase 1: Submit symptoms
curl -X POST http://localhost:8000/api/assess-symptoms/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "current_symptoms": "I have a fever and cough",
    "input_mode": "text"
  }'

# Response:
{
  "triage_id": 123,
  "status": "needs_follow_up",
  "follow_up_questions": [
    "How many days have you had the fever?",
    "Is your cough dry or producing mucus?",
    "Do you have any difficulty breathing?"
  ]
}

# Phase 2: Submit answers
curl -X POST http://localhost:8000/api/assess-symptoms/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "triage_id": 123,
    "follow_up_answers": "3 days, dry cough, no breathing issues"
  }'

# Response: Full assessment with disease predictions
```

### Example 2: Emergency (Skips Follow-Up)
```bash
curl -X POST http://localhost:8000/api/assess-symptoms/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "current_symptoms": "severe chest pain cannot breathe",
    "input_mode": "text"
  }'

# Response: Immediate emergency assessment
{
  "risk_level": "emergency",
  "status": "assessment_complete",
  "recommendations": ["🚨 CALL 108/112 IMMEDIATELY"]
}
```

---

## 🧪 Testing the Feature

### Manual Test Flow

1. **Start Backend:**
   ```bash
   cd backend/medaid
   python manage.py runserver
   ```

2. **Test Phase 1 (Postman/cURL):**
   - Endpoint: `POST /api/assess-symptoms/`
   - Body: `{"current_symptoms": "headache and dizziness"}`
   - Verify: Response contains `follow_up_questions` array

3. **Test Phase 2:**
   - Use `triage_id` from Phase 1
   - Body: `{"triage_id": 123, "follow_up_answers": "your answers"}`
   - Verify: Response contains full assessment

### Python Test Script
```python
import requests

BASE_URL = "http://localhost:8000"
TOKEN = "your_auth_token"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# Phase 1
response1 = requests.post(
    f"{BASE_URL}/api/assess-symptoms/",
    headers=headers,
    json={"current_symptoms": "fever and body pain"}
)
data1 = response1.json()
print("Phase 1:", data1)

# Phase 2
triage_id = data1['triage_id']
response2 = requests.post(
    f"{BASE_URL}/api/assess-symptoms/",
    headers=headers,
    json={
        "triage_id": triage_id,
        "follow_up_answers": "3 days, 8/10 severity, yes nausea"
    }
)
data2 = response2.json()
print("Phase 2:", data2)
```

---

## 🎨 Frontend Integration Checklist

- [ ] Add state management for `triage_id`
- [ ] Create UI for displaying follow-up questions
- [ ] Add form/input for collecting answers
- [ ] Handle both phase responses
- [ ] Show loading states between phases
- [ ] Handle emergency cases (no follow-up)
- [ ] Add error handling for invalid triage_id

### React Example
```jsx
const [triageId, setTriageId] = useState(null);
const [followUpQuestions, setFollowUpQuestions] = useState([]);
const [showFollowUp, setShowFollowUp] = useState(false);

// Phase 1: Submit symptoms
const submitSymptoms = async (symptoms) => {
  const response = await fetch('/api/assess-symptoms/', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ current_symptoms: symptoms })
  });
  
  const data = await response.json();
  
  if (data.status === 'needs_follow_up') {
    setTriageId(data.triage_id);
    setFollowUpQuestions(data.follow_up_questions);
    setShowFollowUp(true);
  } else {
    // Emergency case - show results immediately
    showResults(data);
  }
};

// Phase 2: Submit answers
const submitAnswers = async (answers) => {
  const response = await fetch('/api/assess-symptoms/', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      triage_id: triageId,
      follow_up_answers: answers
    })
  });
  
  const data = await response.json();
  showResults(data);
};
```

---

## 🔍 Database Queries

### Check Follow-Up Records
```python
from api.models import TriageRecord

# Get all pending follow-ups
pending = TriageRecord.objects.filter(needs_follow_up=True)

# Get completed follow-ups
completed = TriageRecord.objects.filter(
    needs_follow_up=False,
    assessment_source='ai_v2_with_followup'
)

# View a specific record
record = TriageRecord.objects.get(id=123)
print("Questions:", record.follow_up_questions)
print("Answers:", record.follow_up_answers)
```

### Django Admin
```python
# In admin.py (if needed)
@admin.register(TriageRecord)
class TriageRecordAdmin(admin.ModelAdmin):
    list_display = ['user', 'risk_level', 'needs_follow_up', 'created_at']
    list_filter = ['needs_follow_up', 'risk_level']
```

---

## ⚙️ Configuration

### Required Settings
```python
# settings.py
INSTALLED_APPS = [
    # ... existing apps ...
    'api',
]

# .env
GOOGLE_API_KEY=your_gemini_api_key
```

### Optional: Customize Question Count
```python
# In views.py, modify this line:
follow_up_questions = llm_extractor.generate_follow_up_questions(
    text=symptoms_text,
    age=age,
    sex=gender,
    max_questions=3  # Change this number
)
```

---

## 🐛 Troubleshooting

### Issue: "Invalid triage ID"
**Solution:** Ensure you're using the correct ID from Phase 1 response

### Issue: Generic questions (not smart)
**Solution:** Check `GOOGLE_API_KEY` is set correctly

### Issue: Migration error
**Solution:** Delete migration file and regenerate:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Issue: LLM timeout
**Solution:** Check internet connection and API key validity

---

## 📊 Monitoring

### Key Metrics to Track
- Average time between Phase 1 and Phase 2
- Completion rate (users who answer follow-up)
- Question quality (user feedback)
- Assessment accuracy improvement

### Django Logging
```python
import logging
logger = logging.getLogger(__name__)

# In views.py
logger.info(f"Follow-up questions generated: {len(questions)}")
logger.info(f"Phase 2 completed for triage_id: {triage_id}")
```

---

## 📚 Related Files

- **Implementation Guide:** `FOLLOWUP_QUESTIONS_FEATURE.md`
- **Summary:** `IMPLEMENTATION_SUMMARY.md`
- **Test Examples:** `test_followup_flow.py`
- **Main Code:**
  - `backend/medaid/api/llm_symptom_extractor.py`
  - `backend/medaid/api/views.py`
  - `backend/medaid/api/models.py`

---

## ✅ Checklist

- [x] Database migration applied
- [x] Environment variables set
- [x] Backend running
- [ ] Frontend integration started
- [ ] Testing completed
- [ ] User acceptance testing

---

## 🎯 Next Steps

1. **Frontend Team:** Implement UI for follow-up questions
2. **Testing Team:** Create test cases for both phases
3. **DevOps:** Ensure production environment has API keys
4. **Documentation:** Update user-facing help docs

---

Need help? Check the full documentation in `FOLLOWUP_QUESTIONS_FEATURE.md`
