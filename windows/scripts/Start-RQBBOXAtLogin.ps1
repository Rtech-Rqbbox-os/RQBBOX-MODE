$ErrorActionPreference = 'SilentlyContinue'
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) { exit 0 }

# Launch RQBBOX MODE as native Electron app (fullscreen, no browser)
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d `"$root`" && npm start" -WorkingDirectory $root -WindowStyle Hidden
