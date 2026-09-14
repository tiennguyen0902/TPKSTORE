@echo off
title TPKSTORE - Database Setup
set "ROOT=%~dp0"

cd /d "%ROOT%backend"
call prisma_setup.bat
