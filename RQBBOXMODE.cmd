@echo off
title RQBBOX MODE
color 0B
setlocal enabledelayedexpansion

REM RQBBOX MODE - Console Gaming Experience
REM Native Electron app - no browser needed

set RQBBOX_ROOT=%~dp0
set RQBBOX_PORT=19778

cls
echo.
echo  ╔═══════════════════════════════════════════╗
echo  ║     RQBBOX MODE - v2.0 Xbox Edition    ║
echo  ║  Console Gaming Experience for PC      ║
echo  ║                                         ║
echo  ║  🎮  All Your Games in One Place      ║
echo  ╚═══════════════════════════════════════════╝
echo.

REM Check if server port is already in use (from a previous session)
netstat -an 2>nul | findstr ":%RQBBOX_PORT% " | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Previous session detected - cleaning up...
    REM Kill old server if orphaned
    for /f "tokens=2" %%a in ('tasklist /fi "imagename eq node.exe" /fo csv /nh 2^>nul') do (
        taskkill /f /im node.exe >nul 2>&1
    )
    timeout /t 1 /nobreak >nul
)

echo [1/2] Starting RQBBOX MODE native app...
echo [INFO] Launching fullscreen gaming dashboard
echo [INFO] No browser required - native window

REM Launch as Electron app
start /B cmd /c "cd /d "%RQBBOX_ROOT%" && npm start" >nul 2>&1

echo [2/2] RQBBOX MODE is running!
echo.
echo  RQBBOX MODE - Plug Into Gaming
echo  Press F11 for fullscreen toggle
echo.
