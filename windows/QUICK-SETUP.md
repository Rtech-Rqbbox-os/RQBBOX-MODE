# RQBBOX Experience OS 1.0 - Windows Gaming Settings Quick Setup

## ⚡ Quick Start (2 Minutes)

### Step 1: Run the Installer
```
Windows Folder → scripts → Install-GamingSettings.bat
```
**Right-click → "Run as Administrator"**

### Step 2: Wait for Completion
The installer will configure all gaming settings automatically.

### Step 3: Restart (Recommended)
Restart your computer for full integration.

### Step 4: Verify
Open: **Settings → Gaming → RQBBOX Experience OS 1.0**

---

## 📋 What Gets Installed

✅ **Game Mode** - Optimized gaming performance  
✅ **Game Bar** - Xbox Game Bar integration (Win+G)  
✅ **Game DVR** - Screen recording (Win+Alt+R)  
✅ **Captures** - Screenshots (Win+Alt+PrtSc)  
✅ **Performance Profiles** - 3 optimization modes  
✅ **Quick Resume** - Save up to 3 game states  
✅ **Controller Settings** - Full gamepad support  
✅ **Achievements** - Achievement system  

---

## 🎮 After Installation

### Access Your Gaming Settings

**Method 1: Windows Settings**
```
Settings → Gaming → Find "RQBBOX Experience OS 1.0"
```

**Method 2: Web Dashboard**
```
http://127.0.0.1:19778/windows-settings.html
```

**Method 3: RQBBOX Dashboard**
```
http://127.0.0.1:19778/dashboard
```

---

## 🚀 Launch RQBBOX Experience OS 1.0

### Option 1: Start Menu
Search for "RQBBOX Experience OS 1.0" → Click to launch

### Option 2: Batch File
```
Launch RQBBOX Experience OS 1.0.bat
```

### Option 3: Command Line
```
node server.js
```
Then open browser to: `http://127.0.0.1:19778/dashboard`

---

## ⚙️ Configuration Options

### Performance Profiles
- **Balanced** - Recommended (default)
- **Maximum** - Max FPS, lower quality
- **Quality** - Best visuals, stable FPS

### Game Bar Shortcuts
- **Open Game Bar:** Windows + G
- **Take Screenshot:** Windows + Alt + PrtSc
- **Start Recording:** Windows + Alt + R

### Controller Setup
- **Sensitivity:** 1-100 (default: 50)
- **Dead Zone:** 0-50 (default: 15)
- **Vibration:** Toggle on/off
- **Invert Y-Axis:** Toggle on/off

### Capture Folder
Screenshots and recordings saved to:
```
RQBBOX Experience OS 1.0\captures\
```

---

## 🔧 Troubleshooting

### Settings Not Appearing?
1. Run installer as Administrator
2. Restart your computer
3. Merge registry file manually

### Game Mode Not Working?
1. Check Windows version (10 or 11)
2. Run PowerShell as Admin:
   ```powershell
   reg add "HKCU\Software\Microsoft\GameBar" /v "AllowAutoGameMode" /t REG_DWORD /d 1 /f
   ```
3. Restart computer

### Controller Not Detected?
1. Check Windows device manager
2. Update controller drivers
3. Test in: Settings → Gaming → Controller

---

## 📦 File Structure

```
RQBBOX Experience OS 1.0\
├── windows\
│   ├── rqbbox-mode.reg                    (Registry file)
│   ├── GAMING-SETTINGS-GUIDE.md           (Full guide)
│   └── scripts\
│       ├── Install-GamingSettings.bat     ⭐ RUN THIS
│       ├── Uninstall-GamingSettings.bat   (Remove settings)
│       └── Install-RQBBOXGamingSettings.ps1 (PowerShell version)
├── windows-settings.html                  (Web settings UI)
├── Launch RQBBOX Experience OS 1.0.bat                (Launch app)
└── server.js                             (Node.js server)
```

---

## ✨ Features Summary

### 🎯 Game Mode
- Automatic optimization
- Background process reduction
- GPU priority management
- Real-time performance monitoring

### 📹 Game DVR
- Background recording
- Auto-capture on achievements
- Configurable capture length
- Organized capture folder

### 🎮 Controller
- Full Xbox controller support
- Vibration feedback
- Sensitivity calibration
- Dead zone adjustment

### ⚡ Performance
- Real-time FPS monitoring
- Memory optimization
- CPU/GPU management
- Thermal protection

### 🏆 Achievements
- 12 unlockable achievements
- Achievement notifications
- Vibration feedback
- Progress tracking

### ⏸️ Quick Resume
- Save up to 3 game states
- Instant game resume
- Auto-save on exit
- Game history tracking

---

## 🚨 Uninstall

To remove RQBBOX Experience OS 1.0 Gaming Settings:

```
Run: Uninstall-GamingSettings.bat
```

Or using PowerShell:
```powershell
.\Install-RQBBOXGamingSettings.ps1 -Uninstall
```

**Note:** This only removes gaming settings, not the RQBBOX Experience OS 1.0 application.

---

## 📞 Support

### Still Need Help?
1. Read full guide: `GAMING-SETTINGS-GUIDE.md`
2. Check Windows Settings (Settings → Gaming)
3. Review registry entries in RegEdit
4. Check system requirements

### System Requirements
- **Windows 10** version 1607+ or **Windows 11**
- **Node.js** (included with RQBBOX Experience OS 1.0)
- **Administrator** access for installation
- **6GB** disk space minimum

---

## 🎮 Ready to Game?

1. ✅ Installation complete
2. ✅ Settings configured
3. ✅ Computer restarted
4. ✅ Launch RQBBOX Experience OS 1.0
5. ✅ Start gaming!

**Enjoy console gaming on PC with RQBBOX Experience OS 1.0!** 🚀

---

**Version:** 1.0.0  
**Last Updated:** 2026-07-03  
**Status:** Ready for Windows Gaming Settings Integration
