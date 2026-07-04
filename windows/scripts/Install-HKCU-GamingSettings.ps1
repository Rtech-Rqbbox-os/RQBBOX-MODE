$rootPath = 'C:\Users\RhysC\Downloads\RQBBOX MODE'

function Set-RegistryValues {
    param(
        [string]$Path,
        [hashtable]$Values
    )
    if (-not (Test-Path $Path)) {
        New-Item -Path $Path -Force | Out-Null
    }
    foreach ($name in $Values.Keys) {
        $value = $Values[$name]
        $type = if ($value -is [int]) { 'DWord' } else { 'String' }
        try {
            Set-ItemProperty -Path $Path -Name $name -Value $value -Type $type -Force
        } catch {
            Write-Warning ("Could not set {0} at {1}: {2}" -f $name, $Path, $_)
        }
    }
}

$gamingPath = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Gaming'
Set-RegistryValues -Path $gamingPath -Values @{
    'RQBBOXModeEnabled' = 1
    'RQBBOXModeVersion' = '1.0.0'
    'RQBBOXModeInstallPath' = $rootPath
}

$gameDVRPath = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR'
Set-RegistryValues -Path $gameDVRPath -Values @{
    'AppCaptureEnabled' = 1
    'HistoricalCaptureEnabled' = 1
    'GameDVREnabled' = 1
}

$advCapturePath = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR\AdvancedCapture'
Set-RegistryValues -Path $advCapturePath -Values @{
    'CapturePath' = Join-Path $rootPath 'captures'
    'RQBBOXMode' = 1
}

$gameBarPath = 'HKCU:\Software\Microsoft\GameBar'
Set-RegistryValues -Path $gameBarPath -Values @{
    'AllowAutoGameMode' = 1
    'AutoGameModeEnabled' = 1
    'ShowStartupPanel' = 1
    'GameBarEnabled' = 1
    'RQBBOXModeIntegration' = 1
}

$sourcePathRQBBOX = 'HKCU:\Software\Microsoft\GameBar\ContentSources\RQBBOX'
Set-RegistryValues -Path $sourcePathRQBBOX -Values @{
    'Enabled' = 1
    'Name' = 'RQBBOX MODE'
    'Type' = 'Gaming'
}

$sourcePathXBOX = 'HKCU:\Software\Microsoft\GameBar\ContentSources\XBOX'
Set-RegistryValues -Path $sourcePathXBOX -Values @{
    'Enabled' = 1
    'Name' = 'XBOX MODE'
    'Type' = 'Gaming'
}

$perfBase = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Gaming\RQBBOX\PerformanceProfiles'
Set-RegistryValues -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Gaming\RQBBOX' -Values @{
    'QuickResumeEnabled' = 1
    'QuickResumeSlots' = 3
    'AutoSaveEnabled' = 1
}

Set-RegistryValues -Path $perfBase -Values @{ 'DefaultProfile' = 'Balanced' }
Set-RegistryValues -Path (Join-Path $perfBase 'Balanced') -Values @{
    'FreeMemory' = 1
    'ReduceBackground' = 1
    'GPUPriority' = 'High'
    'CPUPriority' = 6
}
Set-RegistryValues -Path (Join-Path $perfBase 'Maximum') -Values @{
    'FreeMemory' = 1
    'ReduceBackground' = 1
    'GPUPriority' = 'Maximum'
    'CPUPriority' = 8
    'VSync' = 0
}
Set-RegistryValues -Path (Join-Path $perfBase 'Quality') -Values @{
    'FreeMemory' = 0
    'ReduceBackground' = 0
    'GPUPriority' = 'Quality'
    'CPUPriority' = 4
    'VSync' = 1
}

Set-RegistryValues -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Gaming\RQBBOX\Display' -Values @{
    'Fullscreen' = 1
    'FPS' = 60
    'HardwareAcceleration' = 1
    'PerformanceOverlay' = 1
}

Set-RegistryValues -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Gaming\RQBBOX\Audio' -Values @{
    'GameVolume' = 80
    'UIVolume' = 100
    'SoundFXVolume' = 100
}

Set-RegistryValues -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Gaming\RQBBOX\Controller' -Values @{
    'VibrationEnabled' = 1
    'Sensitivity' = 50
    'DeadZone' = 15
    'InvertYAxis' = 0
}

Set-RegistryValues -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Gaming\RQBBOX\Achievements' -Values @{
    'AchievementsEnabled' = 1
    'ShowNotifications' = 1
    'EnableVibration' = 1
}

$capturesPath = Join-Path $rootPath 'captures'
if (-not (Test-Path $capturesPath)) {
    New-Item -ItemType Directory -Path $capturesPath -Force | Out-Null
}

Write-Host "RQBBOX MODE & XBOX MODE user-level Gaming Settings installed under HKCU." -ForegroundColor Green
Write-Host "Capture folder created at: $capturesPath" -ForegroundColor Green
