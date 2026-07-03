@echo off
title RQBBOX MODE
color 0B

:: RQBBOX MODE - Full Screen Gaming Experience
:: Starts server and opens fullscreen dashboard (like Xbox Mode)

set RQBBOX_ROOT=%~dp0
set RQBBOX_PORT=19778
set RQBBOX_URL=http://127.0.0.1:%RQBBOX_PORT%/dashboard

:: Check if server is already running
netstat -an | findstr ":%RQBBOX_PORT% " | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo [RQBBOX] Server already running
    goto :open
)

echo [RQBBOX] Starting server...
start /B node "%RQBBOX_ROOT%server.js" >nul 2>&1

:: Wait for server to be ready
set retries=0
:wait
timeout /t 1 /nobreak >nul
netstat -an | findstr ":%RQBBOX_PORT% " | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 goto :ready
set /a retries+=1
if %retries% lss 30 goto :wait
echo [RQBBOX] Server failed to start
exit /b 1

:ready
echo [RQBBOX] Server ready

:open
echo [RQBBOX] Opening Full Screen Gaming Experience...
start "" "%RQBBOX_URL%"
