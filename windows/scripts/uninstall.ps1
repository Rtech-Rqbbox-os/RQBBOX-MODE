# RQBBOX MODE - Uninstall from Windows Settings
# Run as Administrator

Write-Host ""
Write-Host "  RQBBOX MODE — Uninstalling Windows integration..." -ForegroundColor Yellow
Write-Host ""

# Remove protocol handler
Remove-Item -Path "HKCU:\Software\Classes\rqbbox" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "HKCU:\Software\Classes\rqbbox" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "  ✓ Protocol handler removed"

# Remove Game Bar registration
Remove-ItemProperty -Path "HKCU:\Software\Microsoft\GameBar\Global" -Name "RQBBOXModePath" -Force -ErrorAction SilentlyContinue
Remove-ItemProperty -Path "HKCU:\Software\Microsoft\GameBar\Global" -Name "RQBBOXModeVersion" -Force -ErrorAction SilentlyContinue

# Remove Start Menu shortcut
$startMenu = [Environment]::GetFolderPath("Programs")
$shortcut = Join-Path $startMenu "RQBBOX MODE.lnk"
if (Test-Path $shortcut) { Remove-Item $shortcut -Force }
Write-Host "  ✓ Start Menu shortcut removed"

Write-Host ""
Write-Host "  ✓ RQBBOX MODE uninstalled from Windows" -ForegroundColor Green
Write-Host ""
