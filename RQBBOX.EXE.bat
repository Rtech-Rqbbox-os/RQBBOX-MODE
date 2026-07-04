@echo off
title RQBBOX MODE - Xbox Dashboard
color 0A
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
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Check for server.js
if not exist "server.js" (
    echo [ERROR] server.js not found
    echo Please make sure all files are in the same directory
    echo.
    pause
    exit /b 1
)

echo [1/3] Starting RQBBOX MODE server...
start /b node server.js >nul 2>&1

echo [2/3] Waiting for server to initialize...
timeout /t 2 /nobreak >nul

echo [3/3] Launching Xbox Dashboard...
start http://localhost:19778/

echo.
echo RQBBOX MODE is now running!
echo Press Ctrl+C in the console to stop.
echo.

timeout /t 999999 /nobreak

