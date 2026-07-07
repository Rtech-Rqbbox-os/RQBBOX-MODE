# Generate a Windows icon for RQBBOX Experience OS 1.0
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $root "build"
$pngPath = Join-Path $outputDir "icon.png"
$icoPath = Join-Path $outputDir "icon.ico"
if (!(Test-Path $outputDir)) { New-Item -ItemType Directory -Path $outputDir -Force | Out-Null }

$bmp = New-Object System.Drawing.Bitmap(256, 256)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$dark1 = [System.Drawing.Color]::FromArgb(14, 14, 14)
$dark2 = [System.Drawing.Color]::FromArgb(26, 26, 26)
$green1 = [System.Drawing.Color]::FromArgb(16, 124, 16)
$green2 = [System.Drawing.Color]::FromArgb(29, 185, 84)
$white = [System.Drawing.Color]::FromArgb(14, 14, 14)

$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Point(0,0)), (New-Object System.Drawing.Point(256,256)), $dark1, $dark2)
$g.FillEllipse($bgBrush, 8, 8, 240, 240)

$pen = New-Object System.Drawing.Pen($green1, 6)
$g.DrawEllipse($pen, 8, 8, 240, 240)

$gpBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Point(60,80)), (New-Object System.Drawing.Point(196,176)), $green1, $green2)

# Gamepad body
$gpPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$gpPath.AddArc(60, 90, 24, 60, 180, 90)
$gpPath.AddArc(172, 90, 24, 60, 270, 90)
$gpPath.AddLine(184, 150, 72, 150)
$gpPath.CloseFigure()
$g.FillPath($gpBrush, $gpPath)

# D-pad (vertical + horizontal)
$g.FillRectangle($gpBrush, 90, 108, 16, 40)
$g.FillRectangle($gpBrush, 78, 120, 40, 16)

# ABXY button holes
$g.FillEllipse($gpBrush, 148, 100, 14, 14)
$g.FillEllipse($gpBrush, 168, 118, 14, 14)
$g.FillEllipse($gpBrush, 148, 136, 14, 14)
$g.FillEllipse($gpBrush, 128, 118, 14, 14)

# Center guide
$g.FillEllipse($gpBrush, 118, 116, 20, 20)

$g.Dispose()
$bmp.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)

# Create ICO
$icoStream = New-Object System.IO.MemoryStream
$icoWriter = New-Object System.IO.BinaryWriter($icoStream)
$icoWriter.Write([UInt16]0)
$icoWriter.Write([UInt16]1)
$icoWriter.Write([UInt16]1)
$icoWriter.Write([byte]0)
$icoWriter.Write([byte]0)
$icoWriter.Write([byte]0)
$icoWriter.Write([byte]0)
$icoWriter.Write([UInt16]1)
$icoWriter.Write([UInt16]32)
$pngBytes = [System.IO.File]::ReadAllBytes($pngPath)
$icoWriter.Write([UInt32]$pngBytes.Length)
$icoWriter.Write([UInt32]22)
$icoWriter.Write($pngBytes)
$icoWriter.Flush()
[System.IO.File]::WriteAllBytes($icoPath, $icoStream.ToArray())
$icoWriter.Close()
$icoStream.Dispose()
$bmp.Dispose()

Write-Host "[OK] Icon generated: $icoPath"
