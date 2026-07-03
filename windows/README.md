# RQBBOX MODE - Windows Integration Files

This folder contains all Windows-related configuration files and scripts for integrating RQBBOX MODE with Windows Gaming Settings.

## 📁 Folder Contents

### 📄 Configuration Files

#### `rqbbox-mode.reg`
Windows Registry configuration file containing all gaming settings.

**What it does:**
- Registers RQBBOX MODE in Windows Gaming Settings
- Configures Game Mode optimization
- Sets up Game DVR integration
- Registers Game Bar settings
- Defines performance profiles
- Configures controller settings
- Sets up achievement system
- Enables Quick Resume

**How to use:**
- Double-click to merge into registry
- Or run during PowerShell installation
- Requires Administrator access

**Registry paths modified:**
```
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Gaming\RQBBOX
HKEY_CURRENT_USER\Software\Microsoft\GameBar
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\GameDVR
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks
```

---

### 🛠️ Installation Scripts

#### `scripts/Install-GamingSettings.bat` ⭐ **START HERE**
Main batch file installer for easy installation.

**What it does:**
- Runs the PowerShell installation script
- Checks for Administrator privileges
- Displays installation progress
- Provides clear user feedback
- Handles errors gracefully

**How to use:**
1. Right-click the file
2. Select "Run as Administrator"
3. Click "Yes" on UAC prompt
4. Wait for completion message
5. Restart your computer (optional but recommended)

**Advantages:**
- No PowerShell knowledge required
- Works on all Windows versions
- Clear visual feedback
- Error messages in English

---

#### `scripts/Install-RQBBOXGamingSettings.ps1` 
Advanced PowerShell installation script.

**What it does:**
- Creates all registry entries
- Configures performance profiles (Balanced, Maximum, Quality)
- Sets up Game DVR capture folder
- Enables Game Mode
- Configures controller settings
- Sets achievement system
- Creates Quick Resume settings
- Verifies installation success

**How to use:**
```powershell
# Run as Administrator:
cd "C:\Path\to\RQBBOX MODE\windows\scripts"
.\Install-RQBBOXGamingSettings.ps1
```

**Advanced options:**
```powershell
# Run silently (no pause at end):
.\Install-RQBBOXGamingSettings.ps1 -Silent

# Uninstall everything:
.\Install-RQBBOXGamingSettings.ps1 -Uninstall

# Custom installation path:
.\Install-RQBBOXGamingSettings.ps1 -InstallPath "C:\Custom\Path"
```

**Features:**
- Detailed step-by-step installation
- Registry verification
- Error handling
- Installation summary
- Support for multiple Windows versions

---

#### `scripts/Uninstall-GamingSettings.bat`
Removes all gaming settings from Windows.

**What it does:**
- Removes registry entries
- Cleans up gaming settings
- Confirms user intention
- Provides uninstall summary

**How to use:**
1. Right-click the file
2. Select "Run as Administrator"
3. Type "YES" to confirm
4. Wait for completion
5. Your RQBBOX MODE app remains installed

**Note:** This only removes gaming integration settings, not the RQBBOX MODE application itself.

---

## 📖 Documentation Files

### `QUICK-SETUP.md`
**Purpose:** Quick reference guide (2-minute setup)

**Contains:**
- Quick start instructions
- Feature summary
- Common configurations
- Troubleshooting tips
- Keyboard shortcuts
- File structure reference

**Best for:** Users who want to get started immediately

---

### `GAMING-SETTINGS-GUIDE.md`
**Purpose:** Comprehensive installation and configuration guide

**Contains:**
- Detailed installation instructions
- Complete feature documentation
- Registry location reference
- Performance profile details
- Troubleshooting section
- Advanced configuration options
- Uninstallation instructions
- Support information

**Best for:** Complete understanding of all features

---

### `README.md` (this file)
**Purpose:** Documentation of all Windows folder files

**Contains:**
- File descriptions
- Usage instructions
- Feature summary
- Installation overview

**Best for:** Understanding what each file does

---

## 🎯 Installation Overview

### Before Installation
- Ensure Windows 10 version 1607+ or Windows 11
- Have Administrator access
- Close other programs
- Have internet connection (first launch only)

### Installation Steps

1. **Run installer:**
   ```
   Right-click Install-GamingSettings.bat → Run as Administrator
   ```

2. **Wait for completion:**
   The script will show progress updates

3. **Restart computer (optional):**
   Restart to ensure full integration

4. **Verify installation:**
   Open Settings → Gaming → RQBBOX MODE

---

## 🔧 What Gets Configured

### Game Mode
- ✅ Enables Windows Game Mode
- ✅ Configures GPU priority
- ✅ Sets CPU priority
- ✅ Reduces background processes
- ✅ Optimizes for gaming

### Game DVR & Captures
- ✅ Enables Game DVR recording
- ✅ Sets capture folder
- ✅ Configures capture settings
- ✅ Sets keyboard shortcuts

### Game Bar
- ✅ Enables Xbox Game Bar
- ✅ Integrates with RQBBOX MODE
- ✅ Configures microphone settings
- ✅ Sets shortcut (Windows + G)

### Performance Profiles
- ✅ **Balanced:** Default settings (recommended)
- ✅ **Maximum:** High FPS, lower quality
- ✅ **Quality:** Best visuals, stable FPS

### Controller
- ✅ Enables controller support
- ✅ Configures vibration
- ✅ Sets sensitivity (1-100)
- ✅ Sets dead zone (0-50)
- ✅ Y-axis inversion option

### Features
- ✅ Quick Resume (up to 3 slots)
- ✅ Achievement System
- ✅ Performance monitoring
- ✅ FPS display overlay

---

## 🖥️ System Integration Points

### Windows Settings
Located at: `Settings → Gaming → RQBBOX MODE`

Shows:
- Game Mode status
- Performance profiles
- Controller settings
- Game DVR status
- Capture folder location

### Registry Locations
```
User Settings:
  HKCU:\Software\Microsoft\Windows\CurrentVersion\Gaming\RQBBOX
  HKCU:\Software\Microsoft\GameBar
  HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR

System Settings:
  HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks
```

### Capture Folder
Default location: `RQBBOX MODE\captures\`
- Screenshots stored here (PNG format)
- Videos stored here (MP4 format)
- Organized by date and type

---

## 🚀 Quick Commands Reference

### Installation
```batch
REM Easy method:
Install-GamingSettings.bat

REM PowerShell method:
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "Install-RQBBOXGamingSettings.ps1"
```

### Uninstallation
```batch
REM Easy method:
Uninstall-GamingSettings.bat

REM PowerShell method:
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "Install-RQBBOXGamingSettings.ps1" -Uninstall
```

### Check Installation Status
```powershell
# Check if registry entries exist:
Test-Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Gaming\RQBBOX"
```

---

## 🎮 Usage After Installation

### Access Settings
1. Open Windows Settings
2. Go to Gaming section
3. Find "RQBBOX MODE"
4. Configure your preferences

### Launch RQBBOX MODE
1. Search for "RQBBOX MODE" in Start Menu
2. Or run: `Launch RQBBOX MODE.bat`
3. Or open: `http://127.0.0.1:19778/dashboard`

### Change Performance Profile
1. Settings → Gaming → RQBBOX MODE
2. Select profile: Balanced, Maximum, or Quality
3. Changes apply immediately

### Configure Controller
1. Settings → Gaming → RQBBOX MODE → Controller
2. Adjust sensitivity and dead zone
3. Enable/disable vibration
4. Invert Y-axis if needed

---

## ⚠️ Troubleshooting

### Installation Fails
**Solution:** Run as Administrator
```
Right-click Install-GamingSettings.bat → Run as Administrator
```

### Settings Not Appearing
**Solution:** Manually merge registry file
```
Right-click rqbbox-mode.reg → Merge
```

### Game Mode Not Working
**Solution:** Re-enable in registry
```powershell
reg add "HKCU\Software\Microsoft\GameBar" /v "AllowAutoGameMode" /t REG_DWORD /d 1 /f
```

### Controller Not Detected
**Solution:** Check device manager and update drivers
```
Device Manager → Input Devices → Update driver
```

---

## 📋 File Permissions

### Required Permissions
- Administrator access (for installation)
- Read/write access to Registry (HKCU)
- Read/write access to HKLM (some settings)
- Folder write access (for capture folder)

### Installation Automatically Handles
- Registry permission checks
- Folder creation
- Permission validation
- Error notification

---

## 🔄 Maintenance

### Regular Updates
Check for updates to RQBBOX MODE via:
- Start Menu → RQBBOX MODE → Check for Updates
- Or visit: www.rqbbox.com/updates

### Registry Backup
Before major changes, backup registry:
```powershell
# In Registry Editor: File → Export
# Or run: regedit.exe /e "backup.reg"
```

### Settings Reset
To reset to default gaming settings:
```powershell
# Uninstall:
.\Uninstall-GamingSettings.bat

# Then reinstall:
.\Install-GamingSettings.bat
```

---

## 📞 Support & Help

### Documentation
- **Quick Start:** Read `QUICK-SETUP.md`
- **Full Guide:** Read `GAMING-SETTINGS-GUIDE.md`
- **Main README:** Go to parent folder `README.md`

### Common Issues
Check `GAMING-SETTINGS-GUIDE.md` section "Troubleshooting"

### Verify Installation
Run PowerShell as Admin:
```powershell
Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Gaming\RQBBOX"
```

---

## 🎯 Next Steps

1. **Install:** Run `Install-GamingSettings.bat`
2. **Restart:** Restart your computer (recommended)
3. **Verify:** Open Settings → Gaming → RQBBOX MODE
4. **Configure:** Adjust settings to your preference
5. **Launch:** Start RQBBOX MODE and enjoy!

---

## 📜 Version Information

- **Current Version:** 1.0.0
- **Release Date:** 2026-07-03
- **Status:** Production Ready
- **Windows Support:** Windows 10 (1607+) and Windows 11
- **Node.js:** v18+ (included with RQBBOX MODE)

---

## 📝 License

RQBBOX MODE® is a proprietary application.
"Plug Into Gaming." ® is a registered trademark.

All files in this folder are part of RQBBOX MODE and are subject to the license agreement.

---

**Need help?** See `QUICK-SETUP.md` for a 2-minute quick start or `GAMING-SETTINGS-GUIDE.md` for complete documentation.

**Ready to install?** Run `Install-GamingSettings.bat` as Administrator!
