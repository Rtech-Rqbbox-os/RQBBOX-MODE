@echo off
title RQBBOX MODE
cd /d "%~dp0"
echo.
echo  ╔═══════════════════════════════════╗
echo  ║     RQBBOX MODE v1.0.0          ║
echo  ║   Plug Into Gaming. ®           ║
echo  ╚═══════════════════════════════════╝
echo.
echo  Starting RQBBOX MODE server...
echo.
start http://127.0.0.1:19778/dashboard
node server.js
pause
