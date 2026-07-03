@echo off
REM ============================================================
REM RQBBOX MODE - Gaming Settings Uninstaller
REM ============================================================
REM This batch file removes RQBBOX MODE from Windows Gaming
REM Settings by removing registry entries and configuration.
REM ============================================================

setlocal enabledelayedexpansion

cls
echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║   RQBBOX MODE - Gaming Settings Uninstaller          ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Running as Administrator
    echo.
    
    echo Are you sure you want to uninstall RQBBOX MODE Gaming Settings?
    echo This will remove all gaming settings from Windows Settings.
    echo.
    echo Type 'YES' to continue or press any other key to cancel:
    set /p CONFIRM=">> "
    
    if /i "%CONFIRM%"=="YES" (
        echo.
        echo [INFO] Starting uninstallation...
        echo.
        
        REM Get the directory where this script is located
        set "SCRIPT_DIR=%~dp0"
        set "PS_SCRIPT=%SCRIPT_DIR%Install-RQBBOXGamingSettings.ps1"
        
        REM Check if PowerShell script exists
        if exist "%PS_SCRIPT%" (
            echo [INFO] Running uninstall script...
            
            REM Run the PowerShell script with -Uninstall flag
            powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%" -Uninstall
            
            if %errorlevel% == 0 (
                echo.
                echo ╔═══════════════════════════════════════════════════════╗
                echo ║         Uninstallation Completed Successfully!        ║
                echo ╚═══════════════════════════════════════════════════════╝
                echo.
                echo RQBBOX MODE Gaming Settings have been removed from Windows!
                echo.
                echo Removed components:
                echo  • Windows Gaming Settings entries
                echo  • Game Mode configuration
                echo  • Game DVR settings
                echo  • Game Bar integration
                echo  • Performance profiles
                echo.
                echo Note: Your RQBBOX MODE application is still installed.
                echo You can reinstall Gaming Settings at any time by running:
                echo   Install-GamingSettings.bat
                echo.
            ) else (
                echo.
                echo [ERROR] Uninstallation failed. Please check the output above.
                echo.
            )
        ) else (
            echo [ERROR] PowerShell script not found: %PS_SCRIPT%
            echo Please ensure you're in the correct directory.
            echo.
        )
    ) else (
        echo.
        echo [CANCELLED] Uninstallation cancelled by user.
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
