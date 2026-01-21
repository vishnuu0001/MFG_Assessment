@echo off
REM ===================================
REM M&M Development Server Launcher
REM ===================================
REM Starts both backend and frontend servers with network access
REM Backend: http://localhost:8000 (FastAPI with auto-reload)
REM Frontend: http://localhost:3000 (React dev server)
REM ===================================

echo.
echo =========================================
echo   Starting M^&M Development Servers
echo =========================================
echo.

REM Start Backend (FastAPI with network access)
echo [1/2] Starting Backend Server...
start "M&M Backend (Port 8000)" cmd /k "cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 2 /nobreak >nul

REM Start Frontend (React dev server)
echo [2/2] Starting Frontend Server...
start "M&M Frontend (Port 3000)" cmd /k "cd frontend && npm run dev"

echo.
echo =========================================
echo   Servers Ready!
echo =========================================
echo.
echo Backend:     http://localhost:8000
echo Frontend:    http://localhost:3000
echo API Docs:    http://localhost:8000/docs
echo Diagnostics: http://localhost:3000/?diagnostics
echo.
echo Network Access: Enabled (0.0.0.0 binding)
echo Check your local IP: ipconfig
echo.
echo To stop servers, close their terminal windows
echo.
pause
