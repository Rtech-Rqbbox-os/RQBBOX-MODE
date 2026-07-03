@echo off
title RQBBOX MODE
color 0A
echo.
echo  ==============================
echo   RQBBOX MODE - Gaming Console
echo   Version 1.0.0
echo  ==============================
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Get script directory
set "DIR=%~dp0"
cd /d "%DIR%"

:: Check for server.js
if not exist "server.js" (
    echo [ERROR] server.js not found in %DIR%
    echo Please make sure all files are in the same folder.
    echo.
    pause
    exit /b 1
)

:: Start server
echo [1/3] Starting RQBBOX MODE server...
start /b node server.js >nul 2>&1

:: Wait for server to be ready
echo [2/3] Waiting for server to initialize...
set /a attempts=0
:waitloop
timeout /t 1 /nobreak >nul
curl -s http://localhost:19778/api/sysinfo >nul 2>nul
if %errorlevel% neq 0 (
    set /a attempts+=1
    if !attempts! lss 10 goto waitloop
    echo [WARNING] Server may not be ready. Continuing anyway...
) else (
    echo [OK] Server is ready!
)

:: Open dashboard in browser
echo [3/3] Opening RQBBOX MODE dashboard...
start http://localhost:19778/

echo.
echo  RQBBOX MODE is running!
echo  Press Ctrl+C to stop.
echo.
pause
