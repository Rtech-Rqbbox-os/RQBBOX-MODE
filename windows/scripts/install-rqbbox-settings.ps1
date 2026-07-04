# RQBBOX MODE - Windows Settings Integration
# Adds RQBBOX MODE to Windows Settings > Gaming via desktop context menu
# Run as Administrator for full functionality

$ErrorActionPreference = "Stop"
$RQBBOX_ROOT = "C:\Users\RhysC\Downloads\RQBBOX MODE"
$RQBBOX_URL = "http://127.0.0.1:19778/windows-settings.html"

Write-Host ""
Write-Host "  RQBBOX MODE - Windows Settings Integration" -ForegroundColor Cyan
Write-Host "  ==========================================" -ForegroundColor Cyan
Write-Host ""

function Install-DesktopContextMenu {
    Write-Host "[1/3] Adding RQBBOX to Desktop Context Menu > Settings > Gaming..." -ForegroundColor Yellow

    # Use HKCU for desktop context menu (no admin required)
    $settingsKey = "Registry::HKEY_CURRENT_USER\Software\Classes\DesktopBackground\Shell\Settings"
    $gamingKey = "$settingsKey\shell\09menu"
    $rqbboxKey = "$gamingKey\shell\rqbbox"
    $rqbboxCmd = "$rqbboxKey\command"

    # Ensure Settings key exists with base properties
    if (!(Test-Path $settingsKey)) { New-Item -Path $settingsKey -Force | Out-Null }
    Set-ItemProperty -Path $settingsKey -Name "(Default)" -Value "Settings" -Force
    Set-ItemProperty -Path $settingsKey -Name "Icon" -Value "shell32.dll,-16826" -Force
    Set-ItemProperty -Path $settingsKey -Name "Position" -Value "Bottom" -Force
    Set-ItemProperty -Path $settingsKey -Name "SubCommands" -Value "" -Force

    # Create Gaming submenu item
    if (!(Test-Path $gamingKey)) { New-Item -Path $gamingKey -Force | Out-Null }
    Set-ItemProperty -Path $gamingKey -Name "Icon" -Value "DDORes.dll,-2207" -Force
    Set-ItemProperty -Path $gamingKey -Name "MUIVerb" -Value "&Gaming" -Force

    # Create RQBBOX MODE entry under Gaming
    if (!(Test-Path $rqbboxKey)) { New-Item -Path $rqbboxKey -Force | Out-Null }
    Set-ItemProperty -Path $rqbboxKey -Name "(Default)" -Value "RQBBOX MODE" -Force
    Set-ItemProperty -Path $rqbboxKey -Name "Icon" -Value "shell32.dll,-16769" -Force

    # Set command to open RQBBOX settings
    if (!(Test-Path $rqbboxCmd)) { New-Item -Path $rqbboxCmd -Force | Out-Null }
    Set-ItemProperty -Path $rqbboxCmd -Name "(Default)" -Value "cmd.exe /c start `"$RQBBOX_URL`"" -Force

    Write-Host "  [OK] RQBBOX added to Desktop > Settings > Gaming" -ForegroundColor Green
}

function Install-StartMenuShortcut {
    Write-Host "[2/3] Creating Start Menu shortcuts..." -ForegroundColor Yellow

    $ws = New-Object -ComObject WScript.Shell
    $programsFolder = $ws.SpecialFolders.Item("Programs")

    # Main RQBBOX MODE shortcut
    $shortcutPath = Join-Path $programsFolder "RQBBOX MODE.lnk"
    $shortcut = $ws.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = "cmd.exe"
    $shortcut.Arguments = "/c start `"$RQBBOX_URL`""
    $shortcut.WorkingDirectory = $RQBBOX_ROOT
    $shortcut.Description = "RQBBOX MODE - Console Gaming Dashboard"
    $shortcut.WindowStyle = 7
    $shortcut.Save()

    # Gaming Settings shortcut
    $gamingPath = Join-Path $programsFolder "RQBBOX Gaming Settings.lnk"
    $gamingShortcut = $ws.CreateShortcut($gamingPath)
    $gamingShortcut.TargetPath = "cmd.exe"
    $gamingShortcut.Arguments = "/c start `"$RQBBOX_URL`""
    $gamingShortcut.WorkingDirectory = $RQBBOX_ROOT
    $gamingShortcut.Description = "RQBBOX MODE - Windows Gaming Settings"
    $gamingShortcut.WindowStyle = 7
    $gamingShortcut.Save()

    # Desktop shortcut
    $desktop = [Environment]::GetFolderPath("Desktop")
    $desktopPath = Join-Path $desktop "RQBBOX MODE.lnk"
    $desktopShortcut = $ws.CreateShortcut($desktopPath)
    $desktopShortcut.TargetPath = "cmd.exe"
    $desktopShortcut.Arguments = "/c start `"$RQBBOX_URL`""
    $desktopShortcut.WorkingDirectory = $RQBBOX_ROOT
    $desktopShortcut.Description = "RQBBOX MODE - Console Gaming Dashboard"
    $desktopShortcut.WindowStyle = 7
    $desktopShortcut.Save()

    Write-Host "  [OK] Start Menu shortcuts created" -ForegroundColor Green
    Write-Host "  [OK] Desktop shortcut created" -ForegroundColor Green
}

function Install-ProtocolAndGameMode {
    Write-Host "[3/4] Registering protocol and Game Mode..." -ForegroundColor Yellow

    # Protocol handler
    $protocolPath = "HKCU:\Software\Classes\rqbbox"
    if (!(Test-Path $protocolPath)) { New-Item -Path $protocolPath -Force | Out-Null }
    Set-ItemProperty -Path $protocolPath -Name "(Default)" -Value "URL:rqbbox Protocol" -Force
    Set-ItemProperty -Path $protocolPath -Name "URL Protocol" -Value "" -Force

    $shellPath = "$protocolPath\shell\open\command"
    if (!(Test-Path $shellPath)) { New-Item -Path $shellPath -Force | Out-Null }
    $nodePath = (Get-Command node -ErrorAction SilentlyContinue).Source
    if (!$nodePath) { $nodePath = "node" }
    Set-ItemProperty -Path $shellPath -Name "(Default)" -Value "`"$nodePath`" `"$RQBBOX_ROOT\windows\rqbbox-launcher.js`" `"%1`"" -Force

    # Game Mode
    $gameBarPath = "HKCU:\Software\Microsoft\GameBar"
    Set-ItemProperty -Path $gameBarPath -Name "AutoGameModeEnabled" -Value 1 -Type DWord -Force
    Set-ItemProperty -Path $gameBarPath -Name "AllowAutoGameMode" -Value 1 -Type DWord -Force

    $capturePath = "$env:USERPROFILE\Videos\Captures"
    if (!(Test-Path $capturePath)) { New-Item -ItemType Directory -Path $capturePath -Force | Out-Null }
    Set-ItemProperty -Path $gameBarPath -Name "CapturePath" -Value $capturePath -Force

    Write-Host "  [OK] rqbbox:// protocol registered" -ForegroundColor Green
    Write-Host "  [OK] Game Mode enabled" -ForegroundColor Green
}

function Install-AutoStart {
    Write-Host "[4/4] Creating login startup entry..." -ForegroundColor Yellow

    $runKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
    if (!(Test-Path $runKey)) { New-Item -Path $runKey -Force | Out-Null }

    $scriptPath = Join-Path $PSScriptRoot "Start-RQBBOXAtLogin.ps1"
    $value = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`""
    Set-ItemProperty -Path $runKey -Name "RQBBOX MODE" -Value $value -Force

    Write-Host "  [OK] RQBBOX MODE will launch in fullscreen after login" -ForegroundColor Green
}

function Uninstall-All {
    Write-Host "Removing RQBBOX MODE..." -ForegroundColor Yellow
    Remove-Item -Path "Registry::HKEY_CURRENT_USER\Software\Classes\DesktopBackground\Shell\Settings\shell\09menu\shell\rqbbox" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "HKCU:\Software\Classes\rqbbox" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path ([Environment]::GetFolderPath("Programs") + "\RQBBOX MODE.lnk") -Force -ErrorAction SilentlyContinue
    Remove-Item -Path ([Environment]::GetFolderPath("Programs") + "\RQBBOX Gaming Settings.lnk") -Force -ErrorAction SilentlyContinue
    Remove-Item -Path ([Environment]::GetFolderPath("Desktop") + "\RQBBOX MODE.lnk") -Force -ErrorAction SilentlyContinue
    Write-Host "[OK] Removed" -ForegroundColor Green
}

# Main
if ($args -contains "-Uninstall") {
    Uninstall-All
} else {
    Install-DesktopContextMenu
    Install-StartMenuShortcut
    Install-ProtocolAndGameMode
    Install-AutoStart

    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host " Installation Complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host " Access RQBBOX MODE via:" -ForegroundColor White
    Write-Host "   Desktop > Right-click > Settings > Gaming > RQBBOX MODE" -ForegroundColor Gray
    Write-Host "   Start Menu > RQBBOX MODE" -ForegroundColor Gray
    Write-Host "   Start Menu > RQBBOX Gaming Settings" -ForegroundColor Gray
    Write-Host "   Browser > rqbbox://dashboard" -ForegroundColor Gray
    Write-Host "   Server > $RQBBOX_URL" -ForegroundColor Gray
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
}
