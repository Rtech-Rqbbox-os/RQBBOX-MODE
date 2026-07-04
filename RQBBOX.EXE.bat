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

REM Check for launcher and server
if not exist "server.js" (
    echo [ERROR] server.js not found
    echo Please make sure all files are in the same directory
    echo.
    pause
    exit /b 1
)

if not exist "rqbbox-launcher.js" (
    echo [ERROR] rqbbox-launcher.js not found
    echo Please make sure all files are in the same directory
    echo.
    pause
    exit /b 1
)

echo [1/3] Starting RQBBOX MODE launcher...
start /b node rqbbox-launcher.js --fullscreen >nul 2>&1

echo [2/3] Waiting for RQBBOX MODE to initialize...
timeout /t 2 /nobreak >nul

echo [3/3] Launching Xbox-style dashboard in fullscreen...

echo.
echo RQBBOX MODE is now running!
echo Press Ctrl+C in the console to stop.
echo.

timeout /t 999999 /nobreak

