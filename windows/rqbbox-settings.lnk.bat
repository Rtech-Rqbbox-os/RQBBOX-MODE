@echo off
:: RQBBOX MODE - Windows Settings Launcher
:: Creates a shortcut that appears in Windows Settings under Gaming

setlocal

:: Create the .lnk shortcut for Windows Settings
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ws = New-Object -ComObject WScript.Shell;" ^
    "$desktop = [Environment]::GetFolderPath('Desktop');" ^
    "$lnk = $ws.CreateShortcut(\"$desktop\RQBBOX MODE Settings.lnk\");" ^
    "$lnk.TargetPath = 'cmd.exe';" ^
    "$lnk.Arguments = '/c start http://127.0.0.1:19778/windows-settings.html';" ^
    "$lnk.WorkingDirectory = '%~dp0\..';" ^
    "$lnk.Description = 'RQBBOX MODE - Windows Gaming Settings';" ^
    "$lnk.Save();" ^
    "Write-Host 'Shortcut created on Desktop';"

:: Also create in Programs folder
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ws = New-Object -ComObject WScript.Shell;" ^
    "$folder = $ws.SpecialFolders.Item('Programs');" ^
    "$lnk = $ws.CreateShortcut(\"$folder\RQBBOX MODE Settings.lnk\");" ^
    "$lnk.TargetPath = 'cmd.exe';" ^
    "$lnk.Arguments = '/c start http://127.0.0.1:19778/windows-settings.html';" ^
    "$lnk.WorkingDirectory = '%~dp0\..';" ^
    "$lnk.Description = 'RQBBOX MODE - Windows Gaming Settings';" ^
    "$lnk.Save();" ^
    "Write-Host 'Shortcut created in Start Menu Programs';"

echo.
echo Shortcuts created! You can find RQBBOX MODE Settings:
echo   - Desktop
echo   - Start Menu ^> Programs
echo.
echo To add to Windows Settings ^> Gaming:
echo   Run: install-rqbbox-settings.ps1
echo.
pause
