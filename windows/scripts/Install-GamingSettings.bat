@echo off
REM ============================================================
REM RQBBOX MODE - Gaming Settings Installation (Batch Wrapper)
REM ============================================================
REM This batch file runs the PowerShell installation script
REM with Administrator privileges.
REM ============================================================

setlocal enabledelayedexpansion

REM Get the directory where this script is located
set "SCRIPT_DIR=%~dp0"
set "PS_SCRIPT=%SCRIPT_DIR%Install-RQBBOXGamingSettings.ps1"

REM Display header
cls
echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║   RQBBOX MODE - Gaming Settings Integration          ║
echo ║   Windows Gaming Settings Installer                   ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Running as Administrator
    echo.
    
    REM Check if PowerShell script exists
    if exist "%PS_SCRIPT%" (
        echo [INFO] Starting installation...
        echo.
        
        REM Run the PowerShell script
        powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%"
        
        REM Check result
        if %errorlevel% == 0 (
            echo.
            echo ╔═══════════════════════════════════════════════════════╗
            echo ║         Installation Completed Successfully!          ║
            echo ╚═══════════════════════════════════════════════════════╝
            echo.
            echo RQBBOX MODE is now integrated into Windows Gaming Settings!
            echo.
            echo Next steps:
            echo  • Open Windows Settings ^(Settings ^> Gaming^)
            echo  • RQBBOX MODE will appear in the Gaming section
            echo  • Launch RQBBOX MODE from Start Menu
            echo.
        ) else (
            echo.
            echo [ERROR] Installation failed. Please check the output above.
            echo.
        )
    ) else (
        echo [ERROR] PowerShell script not found: %PS_SCRIPT%
        echo.
        echo Please ensure you're running this from the correct directory:
        echo %SCRIPT_DIR%
        echo.
    )
) else (
    echo [ERROR] This script must be run as Administrator!
    echo.
    echo To fix this:
    echo  1. Right-click this batch file
    echo  2. Select "Run as Administrator"
    echo  3. Click "Yes" on the UAC prompt
    echo.
)

pause
