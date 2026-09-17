@echo off
title AI Service (FastAPI - Port 8000)
cd /d "%~dp0ai_service"
echo ===================================================
echo     DANG KHOI DONG AI MICROSERVICE (PORT 8000)
echo ===================================================
echo.
echo Server running at: http://localhost:8000
echo Swagger UI Docs:   http://localhost:8000/docs
echo.
python app.py
pause
