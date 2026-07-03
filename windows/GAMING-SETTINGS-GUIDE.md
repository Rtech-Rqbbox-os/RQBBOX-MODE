# RQBBOX MODE - Windows Gaming Settings Integration Guide

## Overview

This guide explains how to integrate RQBBOX MODE into Windows Settings under the Gaming section. Once configured, RQBBOX MODE will appear as a system gaming application with full settings management through Windows Settings.

---

## Quick Installation

### Method 1: Batch File (Easiest - Recommended)

1. **Navigate to the installation folder:**
   ```
   RQBBOX MODE\windows\scripts\
   ```

2. **Run the installer:**
   - Right-click `Install-GamingSettings.bat`
   - Select **"Run as Administrator"**
   - Click **"Yes"** on the UAC prompt
   - Wait for the installation to complete

3. **Verify Installation:**
   - Open **Settings > Gaming > RQBBOX MODE**
   - You should see all the gaming configurations

---

### Method 2: PowerShell (Advanced Users)

1. **Open PowerShell as Administrator**

2. **Navigate to scripts directory:**
   ```powershell
   cd "C:\Users\YourUsername\Downloads\RQBBOX MODE\windows\scripts"
   ```

3. **Run the installation script:**
   ```powershell
   .\Install-RQBBOXGamingSettings.ps1
   ```

4. **To uninstall (if needed):**
   ```powershell
   .\Install-RQBBOXGamingSettings.ps1 -Uninstall
   ```

---

### Method 3: Registry File (Manual)

1. **Navigate to:**
   ```
   RQBBOX MODE\windows\
   ```

2. **Right-click `rqbbox-mode.reg`**

3. **Select "Merge with Registry"**

4. **Click "Yes" on confirmation dialogs**

---

## What Gets Configured

### 1. **Game Mode Settings**
- Automatic Game Mode optimization
- GPU and CPU priority management
- Background process reduction

### 2. **Performance Profiles**
- **Balanced:** Default optimal performance
- **Maximum:** Maximum FPS, reduced quality
- **Quality:** Maximum visual quality, stable FPS

### 3. **Game DVR Integration**
- Automatic capture folder setup
- Screenshot and recording shortcuts:
  - Screenshot: `Windows + Alt + PrtSc`
  - Record: `Windows + Alt + R`

### 4. **Game Bar Settings**
- Full Xbox Game Bar integration
- Shortcut: `Windows + G`
- Microphone and audio support

### 5. **Controller Configuration**
- Vibration feedback control
- Analog stick sensitivity (1-100)
- Dead zone adjustment (0-50)
- Y-axis inversion option

### 6. **Quick Resume**
- Save up to 3 game states
- Automatic resume functionality
- Auto-save on game closure

### 7. **Achievement System**
- Unlockable achievements
- Achievement notifications
- Vibration feedback on achievement unlock

### 8. **Audio Settings**
- Game volume control (0-100)
- UI sound volume control
- SFX volume control

### 9. **Display Settings**
- Fullscreen optimization
- FPS cap (60 FPS default)
- Hardware acceleration
- Performance overlay display

---

## Accessing Your Settings

### Location 1: Windows Settings App
```
Settings > Gaming > RQBBOX MODE
```

You'll find sections for:
- Game Mode
- Game Bar
- Captures
- Game DVR
- Performance
- Controller
- Accounts
- About

### Location 2: Built-in Settings Dashboard
Open in browser:
```
http://127.0.0.1:19778/windows-settings.html
```

### Location 3: Full RQBBOX Dashboard
```
http://127.0.0.1:19778/dashboard
```

---

## Registry Locations

All settings are stored in these registry locations:

```
HKEY_CURRENT_USER\
  Software\
    Microsoft\
      Windows\CurrentVersion\
        Gaming\RQBBOX\          (Main settings)
        GameDVR\                (Game DVR settings)
      GameBar\                  (Game Bar settings)
```

### System-Level Settings
```
HKEY_LOCAL_MACHINE\
  SOFTWARE\
    Microsoft\
      Windows NT\CurrentVersion\
        Multimedia\SystemProfile\
          Tasks\RQBBOXMode\     (Game Mode task profile)
```

---

## Performance Profile Details

### Balanced Profile
```
- Free Memory: Enabled
- Reduce Background: Enabled
- GPU Priority: High
- CPU Priority: 6
- V-Sync: Enabled
```

### Maximum Performance Profile
```
- Free Memory: Enabled
- Reduce Background: Enabled
- GPU Priority: Maximum
- CPU Priority: 8
- V-Sync: Disabled
```

### Quality Profile
```
- Free Memory: Disabled
- Reduce Background: Disabled
- GPU Priority: Quality
- CPU Priority: 4
- V-Sync: Enabled
```

---

## Uninstalling Gaming Settings

If you want to remove RQBBOX MODE from Gaming Settings:

### Using Batch File:
```
Run: Uninstall-GamingSettings.bat
```

### Using PowerShell:
```powershell
.\Install-RQBBOXGamingSettings.ps1 -Uninstall
```

### Manual Registry Removal:
Delete these registry keys:
```
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Gaming\RQBBOX
HKEY_CURRENT_USER\Software\Microsoft\GameBar
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\GameDVR
```

---

## Troubleshooting

### Problem: Settings Don't Appear in Windows Settings

**Solution 1:** Run installation script as Administrator
```
1. Right-click Install-GamingSettings.bat
2. Select "Run as Administrator"
3. Restart your computer
```

**Solution 2:** Manually merge registry file
```
1. Right-click rqbbox-mode.reg
2. Select "Merge with Registry"
3. Click Yes on confirmation
4. Restart your computer
```

**Solution 3:** Check registry permissions
```powershell
# Open PowerShell as Admin and run:
icacls "HKCU:\Software\Microsoft\Windows\CurrentVersion\Gaming" /grant:r "%USERNAME%":(F)
```

### Problem: Game Mode Not Enabling

**Check System Requirements:**
- Windows 10 version 1607 or later
- Windows 11 (recommended)

**Re-register Game Mode:**
```powershell
# As Administrator:
reg add "HKCU\Software\Microsoft\GameBar" /v "AllowAutoGameMode" /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Microsoft\GameBar" /v "AutoGameModeEnabled" /t REG_DWORD /d 1 /f
```

### Problem: Game DVR Not Working

**Reset Game DVR Settings:**
```powershell
# As Administrator:
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\GameDVR" /v "AppCaptureEnabled" /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\GameDVR" /v "GameDVREnabled" /t REG_DWORD /d 1 /f
```

### Problem: Controller Not Detected

**Check Registry Setting:**
```powershell
# As Administrator:
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Gaming\RQBBOX\Controller" /v "VibrationEnabled" /t REG_DWORD /d 1 /f
```

**Restart controller service:**
```powershell
# As Administrator:
Restart-Service -Name "dmwappushservice" -Force
```

---

## Advanced Configuration

### Custom Performance Profile

To create a custom performance profile:

1. **Open Registry Editor** (regedit)
2. **Navigate to:**
   ```
   HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Gaming\RQBBOX\PerformanceProfiles
   ```
3. **Right-click > New > Key**
4. **Name your profile** (e.g., "Custom")
5. **Add DWORD values:**
   - FreeMemory (0 or 1)
   - ReduceBackground (0 or 1)
   - GPUPriority (string: Low, Normal, High, Maximum, Quality)
   - CPUPriority (number: 4-8)
   - VSync (0 or 1)

### Automatic Game Mode at Startup

To enable Game Mode automatically on system startup:

```powershell
# Create a scheduled task as Administrator:
$TaskName = "RQBBOX Game Mode Auto-Enable"
$TaskPath = "\RQBBOX MODE\"

# This will be added in future update
```

---

## Default Settings Reference

| Setting | Default Value |
|---------|---------------|
| Game Mode | Enabled |
| Game Bar | Enabled |
| Game DVR | Enabled |
| Quick Resume Slots | 3 |
| Performance Mode | Balanced |
| Controller Sensitivity | 50 |
| Controller Deadzone | 15 |
| Game Volume | 80% |
| UI Volume | 100% |
| FPS Cap | 60 |
| V-Sync | Enabled |
| Hardware Acceleration | Enabled |
| Controller Vibration | Enabled |
| Achievements | Enabled |

---

## File Locations

### Configuration Files
```
RQBBOX MODE\
├── windows\
│   ├── rqbbox-mode.reg              (Registry settings)
│   └── scripts\
│       ├── Install-GamingSettings.bat
│       └── Install-RQBBOXGamingSettings.ps1
├── windows-settings.html             (Web UI for settings)
├── config.json                       (Main config)
└── captures\                         (Game DVR storage)
```

### Capture Location
```
RQBBOX MODE\captures\
├── screenshots\                      (PNG files)
└── recordings\                       (Video files)
```

---

## Support & Resources

### Getting More Info
- **Settings Dashboard:** http://127.0.0.1:19778/windows-settings.html
- **RQBBOX Dashboard:** http://127.0.0.1:19778/dashboard
- **Windows Gaming Settings:** Settings > Gaming

### Technical Details
- **Game Mode API:** Windows Gaming
- **Protocol:** `rqbbox://` (URL scheme)
- **Server Port:** 19778
- **Node.js Required:** Yes (included with RQBBOX MODE)

---

## Version History

### v1.0.0 (Current)
- Initial Gaming Settings integration
- Full Windows Settings support
- Performance profiles
- Game Mode optimization
- Game DVR integration
- Quick Resume functionality
- Achievement system

---

## License & Terms

RQBBOX MODE® is a proprietary application. 
"Plug Into Gaming." ® is a registered trademark.

For full terms and conditions, see the main README.md file.

---

## Next Steps

1. ✅ Run the installation script
2. ✅ Restart your computer
3. ✅ Open Windows Settings > Gaming
4. ✅ Configure your preferences
5. ✅ Launch RQBBOX MODE from the Start Menu
6. ✅ Enjoy console gaming on PC!

---

**Questions?** Check the main RQBBOX MODE README.md for additional support.
