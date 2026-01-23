@echo off
echo Restarting MedAid Backend with new API key...
echo.

cd /d "d:\medaid-full stack\backend\medaid"

echo Killing any existing Django processes...
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *manage.py*" 2>nul

echo.
echo Starting Django server...
python manage.py runserver

pause
