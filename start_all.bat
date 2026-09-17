@echo off
title TPKSTORE / SHOPBEE - Fullstack Launcher
set "ROOT=%~dp0"

echo ===================================================
echo    DANG KHOI DONG TOAN BO HE THONG TPKSTORE / AI
echo ===================================================
echo [1/4] PostgreSQL Database (Port 5432)
echo [2/4] AI Microservice     (Port 8000)
echo [3/4] Backend Server      (Port 5000)
echo [4/4] Frontend Web        (Port 5173)
echo ===================================================
echo.

:: 1. Khoi dong PostgreSQL Database
start "PostgreSQL Server (Port 5432)" /D "%ROOT%backend" cmd /k node start_postgres.js

:: Cho 2 giay de PostgreSQL khoi dong xong
ping 127.0.0.1 -n 3 >nul

:: 2. Khoi dong AI Microservice
start "AI Service (Port 8000)" /D "%ROOT%ai_service" cmd /k python app.py

:: 3. Khoi dong Backend Server
start "Backend Server (Port 5000)" /D "%ROOT%backend" cmd /k npm.cmd run dev

:: 4. Khoi dong Frontend Web
start "Frontend Web (Port 5173)" /D "%ROOT%frontend" cmd /k npm.cmd run dev

echo Da khoi dong ca 4 dich vu trong cac cua so terminal rieng!
echo Dang cho cac server khoi dong va tu dong mo trinh duyet...

:: Cho 3 giay bang ping tranh loi redirection tren Windows
ping 127.0.0.1 -n 4 >nul

start http://localhost:5173

echo.
echo ===================================================
echo CAC DICH VU DANG CHAY:
echo - PostgreSQL: http://localhost:5432 (store_ai_db)
echo - Frontend:   http://localhost:5173
echo - Backend:    http://localhost:5000/api
echo - AI Docs:    http://localhost:8000/docs
echo ===================================================
echo.
pause
