# 🎉 MedAid - Complete Setup & Usage Guide

## ✅ Current Status

### Backend (Django API)
- **Status:** ✅ Running on http://localhost:8000
- **Health Check:** http://localhost:8000/
- **API Endpoints:** All authentication endpoints working

### Frontend (React)
- **Status:** ✅ Running on http://localhost:3001
- **Login Page:** http://localhost:3001/login
- **Signup Page:** http://localhost:3001/signup

---

## 🚀 Quick Start

### 1. Start Backend Server
```bash
# Navigate to backend directory
cd "d:\medaid-full stack\backend"

# Run the server
python run_server.py
```

**OR** manually:
```bash
cd "d:\medaid-full stack\backend\medaid"
python manage.py runserver 0.0.0.0:8000
```

### 2. Start Frontend Server
```bash
# Navigate to frontend directory
cd "d:\medaid-full stack\frontend"

# Start development server
npm start
```

Frontend will open at: **http://localhost:3001** (or 3000 if available)

---

## 🔐 Authentication System

### Features Working:
✅ User Signup (Email/Password)  
✅ User Login (Email/Password)  
✅ JWT Token Authentication  
✅ Protected Routes  
✅ Session Management  
✅ "Remember Me" functionality  

### Test Credentials
You can create your own account or use:
- **Email:** `user2537@medaid.com`
- **Password:** `Welcome123!`

---

## 📱 How to Use the Application

### Step 1: Create Account
1. Open http://localhost:3001/signup
2. Fill in your details:
   - First Name
   - Last Name
   - Email
   - Password (minimum 6 characters)
3. Click "Sign Up"
4. You'll be automatically logged in and redirected to dashboard

### Step 2: Login
1. Open http://localhost:3001/login
2. Enter your email and password
3. Optionally check "Remember me"
4. Click "Log In"

### Step 3: Dashboard
After login, you'll have access to:
- 🏥 Medical Assessment
- 📊 Health Reports
- 💊 Dietary Recommendations
- 🔍 Find Specialists
- 📝 Medical History

---

## 🛠️ Technical Details

### Backend API Endpoints

#### Authentication
- `POST /api/auth/signup/` - Create new account
- `POST /api/auth/login/` - Login with credentials
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/me/` - Get current user
- `POST /api/auth/token/refresh/` - Refresh JWT token

#### Profile
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/update/` - Update profile

#### Triage & Assessment
- `POST /api/triage/assess/` - Assess symptoms
- `GET /api/triage/history/` - Get assessment history

#### Reports
- `GET /api/medical-reports/` - List reports
- `POST /api/reports/analyze/` - Analyze medical report

---

## 🎨 Frontend Features

### Pages
- **Landing Page** (`/`) - Marketing homepage
- **Features** (`/features`) - Feature overview
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - New user registration
- **Dashboard** (`/dashboard`) - Main application hub
- **Consultation** (`/consultation`) - Medical consultation wizard
- **Medical History** (`/medical-history`) - Manage health records
- **Dietary Advice** (`/dietary-advice`) - Personalized nutrition
- **Assessments** (`/assessments`) - View past assessments

### UI Components
- Modern dark theme design
- Responsive layout (mobile-friendly)
- Smooth animations (Framer Motion)
- Form validation
- Error handling
- Loading states

---

## 🔒 Security Features

✅ **Password Hashing** - Passwords stored securely  
✅ **JWT Authentication** - Token-based sessions  
✅ **CORS Protection** - Cross-origin security  
✅ **HTTPS Ready** - Production SSL support  
✅ **Input Validation** - Both frontend and backend  
✅ **Protected Routes** - Authentication required  

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check if port 8000 is in use
netstat -an | findstr "8000"

# Run migrations if needed
cd "d:\medaid-full stack\backend\medaid"
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser
```

### Frontend Won't Start
```bash
# Clear cache and reinstall
cd "d:\medaid-full stack\frontend"
rm -rf node_modules package-lock.json
npm install
npm start
```

### Login Not Working
1. Ensure backend is running on port 8000
2. Check browser console for errors (F12)
3. Verify `.env` file has correct `REACT_APP_API_URL`
4. Clear browser cookies/localStorage
5. Try creating a new account

### CORS Errors
Backend `settings.py` should have:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
]
CORS_ALLOW_CREDENTIALS = True
```

---

## 📊 Database

### Current Setup
- **Type:** PostgreSQL
- **Database:** medaid_db
- **User:** postgres
- **Host:** localhost
- **Port:** 5432

### Django Admin
Access at: http://localhost:8000/admin/

Create admin user:
```bash
cd "d:\medaid-full stack\backend\medaid"
python manage.py createsuperuser
```

---

## 🎯 Next Steps

### For Users
1. ✅ Create account
2. ✅ Complete profile
3. ✅ Add medical history
4. ✅ Start health assessment
5. ✅ Get AI recommendations

### For Developers
- Add forgot password feature
- Implement email verification
- Add Google/GitHub OAuth
- Enhanced AI features
- Mobile app development

---

## 📞 Support

- **Backend Issues:** Check Django logs in terminal
- **Frontend Issues:** Check browser console (F12)
- **API Testing:** Use Postman or curl
- **Database Issues:** Check PostgreSQL service

---

## 🎉 You're All Set!

Everything is now working:
- ✅ Backend API running
- ✅ Frontend app running
- ✅ Authentication working
- ✅ Database connected
- ✅ All endpoints tested

**Start using MedAid at:** http://localhost:3001/login

Enjoy your AI-powered healthcare assistant! 🏥💙
