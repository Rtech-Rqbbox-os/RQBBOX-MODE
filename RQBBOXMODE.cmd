@echo off
title RQBBOX MODE - Xbox Dashboard
color 0B
setlocal enabledelayedexpansion

REM RQBBOX MODE - Xbox Console Gaming Experience
REM Starts server and opens dashboard in fullscreen

set RQBBOX_ROOT=%~dp0
set RQBBOX_PORT=19778
set RQBBOX_URL=http://127.0.0.1:%RQBBOX_PORT%

cls
echo.
echo  ╔═══════════════════════════════════════════╗
echo  ║     RQBBOX MODE - v2.0 Xbox Edition    ║
echo  ║  Console Gaming Experience for PC      ║
echo  ║                                         ║
echo  ║  🎮  All Your Games in One Place      ║
echo  ╚═══════════════════════════════════════════╝
echo.

REM Check if server is already running
netstat -an | findstr ":%RQBBOX_PORT% " | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Server already running
    goto :open
)

echo [1/3] Starting RQBBOX MODE server...
start /B node "%RQBBOX_ROOT%server.js" >nul 2>&1

REM Wait for server to be ready
set retries=0
:wait
timeout /t 1 /nobreak >nul
netstat -an | findstr ":%RQBBOX_PORT% " | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 goto :ready
set /a retries+=1
if !retries! lss 30 goto :wait
echo [ERROR] Server failed to start
exit /b 1

:ready
echo [2/3] Server initialized successfully

:open
echo [3/3] Launching Xbox Dashboard...
start "" "%RQBBOX_URL%"

echo.
echo RQBBOX MODE is running!
echo.
pause
