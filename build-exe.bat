@echo off
echo.
echo  ==============================
echo   RQBBOX MODE - Build EXE
echo  ==============================
echo.

:: Check for npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed.
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [1/4] Installing build dependencies...
call npm install pkg --save-dev

echo.
echo [2/4] Building RQBBOX.EXE with pkg...
call npx pkg rqbbox-launcher.js --targets node18-win-x64 --output RQBBOX.exe

if %errorlevel% neq 0 (
    echo.
    echo [INFO] pkg build failed. Trying nexe...
    call npm install nexe --save-dev
    call npx nexe rqbbox-launcher.js -o RQBBOX.exe
)

echo.
echo [3/4] Verifying build...
if exist "RQBBOX.exe" (
    echo [OK] RQBBOX.exe created successfully!
) else (
    echo [WARNING] EXE not found. Using batch launcher instead.
    echo Copy RQBBOX.EXE.bat and rename to RQBBOX.EXE
)

echo.
echo [4/4] Build complete!
echo.
echo  You can now distribute RQBBOX.exe
echo  Make sure server.js is in the same folder.
echo.
pause
