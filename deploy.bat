@echo off
title MedAid Deployment

echo 🚀 Starting MedAid deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📄 Creating .env file from .env.example...
    copy .env.example .env
    echo ⚠️  Please update the .env file with your actual credentials before proceeding.
    echo 📝 Edit the .env file and then run this script again.
    pause
    exit /b 1
)

REM Build and start services
echo 🏗️  Building Docker images...
docker-compose build

echo 🚢 Starting services...
docker-compose up -d

REM Wait for services to start
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check if services are running
echo 🔍 Checking service status...
docker-compose ps

echo ✅ Deployment completed!
echo 🌐 Frontend: http://localhost
echo ⚙️  Backend API: http://localhost/api
echo 📊 MongoDB: mongodb://localhost:27017

pause