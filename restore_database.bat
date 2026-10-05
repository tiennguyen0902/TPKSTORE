@echo off
title TPKSTORE - Restore Database
echo [TPKSTORE] Dang khoi phuc co so du lieu tu database_dump.sql vao container PostgreSQL...
docker exec -i store_ai_postgres psql -U store_ai_user -d store_ai_db < "%~dp0database_dump.sql"
if %ERRORLEVEL% EQU 0 (
    echo [TPKSTORE] Khoi phuc database thanh cong!
) else (
    echo [TPKSTORE] Loi khi khoi phuc database. Vui long kiem tra container store_ai_postgres da chay chua.
)
pause
