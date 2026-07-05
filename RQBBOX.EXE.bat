@echo off
title RQBBOX MODE
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

REM Check for required files
if not exist "server.js" (
    echo [ERROR] server.js not found
    echo.
    pause
    exit /b 1
)

if not exist "electron-main.js" (
    echo [ERROR] electron-main.js not found
    echo.
    pause
    exit /b 1
)

echo [1/3] Starting RQBBOX MODE native app...
echo [INFO] Running as standalone Electron application
echo [INFO] Fullscreen kiosk mode - like Xbox Mode
echo.

REM Launch via Electron (native window, no browser)
start /b cmd /c "npm start" >nul 2>&1

echo [2/3] RQBBOX MODE is launching...
echo.

REM Wait for the app to start
timeout /t 3 /nobreak >nul

echo [3/3] RQBBOX MODE is now running!
echo.
echo  RQBBOX MODE - Plug Into Gaming
echo.
echo  Tips:
echo    System Tray: Right-click icon for options
echo    F11: Toggle fullscreen
echo    Win+G: Game Bar overlay
echo.
echo  Close the app window or use system tray to quit.
echo.

timeout /t 999999 /nobreak
