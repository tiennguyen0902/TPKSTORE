@echo off
title TPKSTORE - Prisma PostgreSQL Setup
set "ROOT=%~dp0"

cd /d "%ROOT%"
node run_setup.js
if errorlevel 1 (
  echo.
  echo [CANH BAO] Khong the thiet lap Database PostgreSQL.
  echo Vui long kiem tra lai chuoi DATABASE_URL trong file .env!
  echo Goi y: Ban co the tao database mien phi tai https://neon.tech hoac https://supabase.com
  pause
  exit /b 1
)

pause

