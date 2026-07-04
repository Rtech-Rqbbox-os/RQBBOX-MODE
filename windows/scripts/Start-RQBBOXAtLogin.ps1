$ErrorActionPreference = 'SilentlyContinue'
$root = 'C:\Users\RhysC\Downloads\RQBBOX MODE'
$launcher = Join-Path $root 'rqbbox-launcher.js'
$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) { exit 0 }
Start-Process -FilePath $node -ArgumentList "`"$launcher`" --fullscreen" -WorkingDirectory $root -WindowStyle Hidden
