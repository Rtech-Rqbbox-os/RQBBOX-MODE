@echo off
title RQBBOX MODE - Xbox Dashboard
cd /d "%~dp0"
setlocal enabledelayedexpansion

cls
echo.
echo  ╔═══════════════════════════════════════════╗
echo  ║     RQBBOX MODE - v2.0 Xbox Edition    ║
echo  ║  Console Gaming Experience for PC      ║
echo  ║                                         ║
echo  ║  🎮  All Your Games in One Place      ║
echo  ╚═══════════════════════════════════════════╝
echo.

REM Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [INFO] Starting RQBBOX MODE server...
echo.

REM Start server
start http://127.0.0.1:19778/
node server.js

pause
