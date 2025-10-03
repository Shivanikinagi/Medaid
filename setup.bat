@echo off
title MedAid Setup

echo 🚀 Setting up MedAid MERN Application...

echo 📦 Installing root dependencies...
npm install

echo 📦 Installing backend dependencies...
cd backend
npm install

echo 📦 Installing frontend dependencies...
cd ../frontend
npm install

echo 🐍 Setting up Python service...
cd ../backend/python_service

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.7+ to use the medical analysis service.
    echo ⚠️ The application will still work but with mock data.
    cd ../../..
    pause
    exit /b
)

echo 🔧 Creating Python virtual environment...
python -m venv venv

echo 📦 Installing Python requirements...
venv\Scripts\pip install -r requirements.txt

echo ✅ Setup completed!
echo.
echo To start the application, run: npm run dev
echo This will start both the frontend and backend services.
echo.
pause