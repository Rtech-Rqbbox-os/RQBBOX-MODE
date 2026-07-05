@echo off
title RQBBOX MODE - Build EXE
cd /d "%~dp0"
setlocal enabledelayedexpansion

cls
echo.
echo  ============================================
echo    RQBBOX MODE - Build Standalone EXE
echo  ============================================
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [1/4] Installing dependencies...
call npm install --save-dev 2>nul

echo.
echo [2/4] Generating app icon...
echo    Creating Windows icon from assets...
if not exist "build" mkdir build
if exist "build-scripts\generate-icon.ps1" (
    powershell -NoProfile -ExecutionPolicy Bypass -File "build-scripts\generate-icon.ps1" 2>nul
    if exist "build\icon.ico" (
        echo [OK] Icon generated: build\icon.ico
    ) else (
        echo [WARN] Icon generation failed, will use default
    )
) else (
    echo [WARN] Icon script not found, will use default
)

echo.
echo [3/4] Building RQBBOX MODE standalone EXE...
echo    This will create a native Windows app with:
echo    - Fullscreen kiosk mode (no browser chrome)
echo    - System tray icon
echo    - Game Bar integration
echo    - Xbox Mode features
echo.
echo    Building Electron app package...
echo.

call npx electron-builder --win --x64 --config.extraMetadata.main=electron-main.js

if %errorlevel% neq 0 (
    echo.
    echo [INFO] Electron build failed. Trying pkg fallback...
    call npm install pkg --save-dev 2>nul
    call npx pkg rqbbox-launcher.js --targets node18-win-x64 --output RQBBOX.exe
    if !errorlevel! neq 0 (
        echo [INFO] pkg also failed, trying nexe...
        call npm install nexe --save-dev 2>nul
        call npx nexe rqbbox-launcher.js -o RQBBOX.exe
    )
)

echo.
echo [4/4] Verifying build...
if exist "dist\*.exe" (
    echo [OK] Build output found:
    for %%f in ("dist\*.exe") do (
        echo    - %%~nxf
    )
    echo.
    echo    Installer: dist\RQBBOX-MODE-Setup-*.exe
    echo    Or run directly: npm start
    goto :done
)
if exist "RQBBOX.exe" (
    echo [OK] RQBBOX.exe (pkg fallback) created!
    goto :done
)
echo [WARNING] No build output found. Check errors above.
echo.
echo Try building manually: npx electron-builder --win --x64

:done
echo.
echo  ============================================
echo    Build Complete!
echo.
echo    Run: npm start  (development)
echo    Install: dist\RQBBOX-MODE-Setup-*.exe
echo  ============================================
echo.
pause
