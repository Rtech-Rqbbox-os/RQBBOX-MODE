# ✅ RQBBOX Experience OS 1.0 - Installation Verification Checklist

Use this checklist to verify that RQBBOX Experience OS 1.0 has been successfully integrated into Windows Gaming Settings.

---

## 📋 Pre-Installation Checklist

Before running the installer, ensure you have:

- [ ] Windows 10 version 1607 or later, OR Windows 11
- [ ] Administrator account access
- [ ] Administrator rights on this computer
- [ ] At least 100MB free disk space
- [ ] Internet connection (for first run)
- [ ] RQBBOX Experience OS 1.0 application installed
- [ ] All other programs closed (recommended)

---

## 🚀 Installation Steps

### Step 1: Run the Installer
- [ ] Navigated to: `RQBBOX Experience OS 1.0\windows\scripts\`
- [ ] Right-clicked: `Install-GamingSettings.bat`
- [ ] Selected: "Run as Administrator"
- [ ] Clicked: "Yes" on UAC prompt
- [ ] Installer started without errors

### Step 2: Installation Progress
During installation, you should see:
- [ ] Registry paths being created
- [ ] Gaming settings entries being configured
- [ ] Performance profiles being set up
- [ ] Game DVR being configured
- [ ] Game Bar integration being enabled
- [ ] Controller settings being applied
- [ ] Success messages appearing

### Step 3: Installation Completion
- [ ] Installation completed without errors
- [ ] Completion message displayed
- [ ] Total time taken: ~2-3 minutes
- [ ] No error messages at end

---

## 🔄 Post-Installation

### Step 4: System Restart (Recommended)
- [ ] Restarted your computer
- [ ] Login successful
- [ ] No startup errors

### Step 5: Verify Registry Entries

**Check Registry Entry 1:**
Open Registry Editor (regedit.exe):
```
Navigate to: HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Gaming\RQBBOX
```
- [ ] Folder exists
- [ ] Contains settings entries
- [ ] No red error icons

**Check Registry Entry 2:**
```
Navigate to: HKEY_CURRENT_USER\Software\Microsoft\GameBar
```
- [ ] Contains RQBBOX integration entries
- [ ] Shows enabled settings

**Check Registry Entry 3:**
```
Navigate to: HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\GameDVR
```
- [ ] Contains capture settings
- [ ] Path is set correctly

---

## 🎮 Windows Settings Verification

### Step 6: Access Windows Settings

Open Windows Settings:
1. Press: **Windows Key + I**
2. Navigate to: **Gaming**
3. Look for: **RQBBOX Experience OS 1.0** section

- [ ] Windows Settings app opens
- [ ] Gaming section accessible
- [ ] RQBBOX Experience OS 1.0 appears in Gaming
- [ ] All subsections visible

### Step 7: Check Gaming Subsections

Verify all gaming subsections are present:

**Gaming Section:**
- [ ] Game Mode subsection exists
- [ ] Game Bar subsection exists
- [ ] Captures subsection exists
- [ ] Game DVR subsection exists
- [ ] Performance subsection exists
- [ ] Controller subsection exists
- [ ] Accounts subsection exists
- [ ] About subsection exists

---

## ⚙️ Configuration Verification

### Step 8: Game Mode Settings
In Windows Settings > Gaming > RQBBOX Experience OS 1.0 > Game Mode:
- [ ] Enable Game Mode toggle is visible
- [ ] Performance Mode selector is visible
- [ ] Settings are readable
- [ ] No error messages

### Step 9: Performance Profiles
In Windows Settings > Gaming > RQBBOX Experience OS 1.0 > Performance Mode:
- [ ] Dropdown shows: Balanced
- [ ] Dropdown shows: Maximum
- [ ] Dropdown shows: Quality
- [ ] Can select each profile

### Step 10: Controller Settings
In Windows Settings > Gaming > RQBBOX Experience OS 1.0 > Controller:
- [ ] Sensitivity slider present
- [ ] Dead Zone slider present
- [ ] Vibration toggle present
- [ ] Invert Y-Axis option present

### Step 11: Game DVR Settings
In Windows Settings > Gaming > RQBBOX Experience OS 1.0 > Game DVR:
- [ ] Enable Game DVR toggle visible
- [ ] Recording length selector visible
- [ ] Auto-Capture option visible

### Step 12: Capture Settings
In Windows Settings > Gaming > RQBBOX Experience OS 1.0 > Captures:
- [ ] Capture folder path displayed
- [ ] Screenshot shortcut shown (Win+Alt+PrtSc)
- [ ] Recording shortcut shown (Win+Alt+R)

---

## 🎮 Launch and Functionality

### Step 13: Launch RQBBOX Experience OS 1.0
Try to launch RQBBOX Experience OS 1.0:
- [ ] Search for "RQBBOX Experience OS 1.0" in Start Menu
- [ ] Application appears in search results
- [ ] Can click to launch
- [ ] Application starts without errors

### Step 14: Web Interface Access
Try accessing the settings web interface:
1. Open browser (Chrome, Edge, Firefox)
2. Navigate to: `http://127.0.0.1:19778/windows-settings.html`

- [ ] Page loads successfully
- [ ] Settings interface displays
- [ ] Navigation menu visible
- [ ] All sections accessible

### Step 15: Gaming Dashboard
Try accessing the main dashboard:
1. Navigate to: `http://127.0.0.1:19778/dashboard`

- [ ] Dashboard loads successfully
- [ ] Console-like interface visible
- [ ] Games appear (if any are installed)
- [ ] No JavaScript errors in console

---

## 🛠️ Advanced Verification

### Step 16: PowerShell Verification
For advanced users, verify via PowerShell (as Administrator):

```powershell
# Check if registry path exists:
Test-Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Gaming\RQBBOX"
# Should return: True

# Check Game Mode is enabled:
(Get-ItemProperty "HKCU:\Software\Microsoft\GameBar" "AllowAutoGameMode").AllowAutoGameMode
# Should return: 1

# Check Game DVR is enabled:
(Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR" "GameDVREnabled").GameDVREnabled
# Should return: 1
```

- [ ] PowerShell commands run successfully
- [ ] Test-Path returns True
- [ ] AllowAutoGameMode returns 1
- [ ] GameDVREnabled returns 1

### Step 17: Capture Folder
Verify capture folder was created:
1. Navigate to: `RQBBOX Experience OS 1.0\captures\`
2. Folder should exist

- [ ] Folder exists at correct location
- [ ] Has read/write permissions
- [ ] Is empty (no previous captures)
- [ ] Accessible from File Explorer

---

## 🎮 Feature Testing

### Step 18: Test Game Mode
In Windows Settings > Gaming > RQBBOX Experience OS 1.0:
1. Toggle Game Mode ON
2. Observe settings update

- [ ] Toggle responds to clicks
- [ ] Setting saves successfully
- [ ] No error messages appear
- [ ] Status updates immediately

### Step 19: Test Performance Profiles
In Windows Settings > Gaming > RQBBOX Experience OS 1.0:
1. Select: Balanced
2. Select: Maximum
3. Select: Quality

- [ ] Each profile selectable
- [ ] Selection saves
- [ ] No errors occur
- [ ] Settings persist on refresh

### Step 20: Test Game Bar Integration
Press: **Windows + G**
- [ ] Game Bar opens
- [ ] RQBBOX integration visible
- [ ] Settings accessible from Game Bar
- [ ] Close Game Bar with ESC

---

## 📊 Summary Verification

### Overall Status Check

**Critical Features (Must Work):**
- [ ] RQBBOX Experience OS 1.0 appears in Windows Settings Gaming
- [ ] Game Mode can be toggled
- [ ] Performance profiles selectable
- [ ] Controller settings accessible
- [ ] Capture folder created
- [ ] Game DVR enabled

**Important Features (Should Work):**
- [ ] Game Bar integration functional
- [ ] Quick Resume settings visible
- [ ] Achievement system configured
- [ ] Web dashboard accessible
- [ ] Performance monitoring working
- [ ] All toggles respond to clicks

**Nice to Have (Optional):**
- [ ] Settings persist after restart
- [ ] All icons displaying correctly
- [ ] Animations smooth
- [ ] Hover effects visible
- [ ] Responsive design works

---

## ✅ Installation Success Criteria

Your installation is **SUCCESSFUL** if:

- ✅ All critical features working
- ✅ RQBBOX Experience OS 1.0 visible in Windows Settings
- ✅ All configuration sections accessible
- ✅ No error messages
- ✅ Settings persist correctly
- ✅ Application launches successfully

---

## ❌ Troubleshooting If Installation Failed

If installation didn't complete successfully:

### Common Issues and Solutions

**Issue: "Run as Administrator" option missing?**
- [ ] Use Windows + R
- [ ] Type: `cmd`
- [ ] Right-click → "Run as Administrator"
- [ ] Navigate to script folder
- [ ] Run: `Install-GamingSettings.bat`

**Issue: Registry entries not appearing?**
- [ ] Manually merge registry file
- [ ] Right-click: `rqbbox-mode.reg`
- [ ] Select: "Merge with Registry"
- [ ] Restart computer

**Issue: Windows Settings not showing RQBBOX Experience OS 1.0?**
- [ ] Verify PowerShell script ran
- [ ] Check registry entries exist
- [ ] Restart Windows (Ctrl+Alt+Delete)
- [ ] Run installer again

**Issue: Game Mode not toggling?**
- [ ] Check Windows 10/11 version
- [ ] Enable via PowerShell:
  ```powershell
  reg add "HKCU\Software\Microsoft\GameBar" /v "AllowAutoGameMode" /t REG_DWORD /d 1 /f
  ```

---

## 📞 Getting Help

If you can't get installation to work:

1. **Read Documentation:**
   - [ ] Read: `QUICK-SETUP.md` (2-min guide)
   - [ ] Read: `GAMING-SETTINGS-GUIDE.md` (full guide)

2. **Check Prerequisites:**
   - [ ] Windows 10 version 1607+ or Windows 11?
   - [ ] Administrator access?
   - [ ] RQBBOX Experience OS 1.0 installed?

3. **Manual Installation:**
   - [ ] Double-click: `rqbbox-mode.reg`
   - [ ] Merge into registry
   - [ ] Restart computer

4. **Verify Installation:**
   - [ ] Open Registry Editor
   - [ ] Navigate to Gaming\RQBBOX
   - [ ] Check entries exist

---

## 🎯 Next Steps After Successful Installation

Congratulations! Your installation is complete. Now:

1. [ ] Restart your computer
2. [ ] Launch RQBBOX Experience OS 1.0 from Start Menu
3. [ ] Open Windows Settings > Gaming
4. [ ] Configure your preferences
5. [ ] Test Game Mode
6. [ ] Test Game Bar (Win+G)
7. [ ] Test screen capture
8. [ ] Start gaming!

---

## 📋 Installation Complete Checklist

- [ ] Installation script ran successfully
- [ ] No errors during installation
- [ ] System restarted (recommended)
- [ ] Registry entries verified
- [ ] Windows Settings show RQBBOX Experience OS 1.0
- [ ] All configuration sections accessible
- [ ] Game Mode functioning
- [ ] Game DVR working
- [ ] Controller settings configured
- [ ] Capture folder created
- [ ] RQBBOX Experience OS 1.0 launches successfully
- [ ] Ready to use!

---

## 🚀 You're All Set!

RQBBOX Experience OS 1.0 is now fully integrated into Windows Gaming Settings!

**Enjoy console gaming on your PC!**

🎮 **Plug Into Gaming.** ®

---

**Last Updated:** 2026-07-03  
**Version:** 1.0.0  
**Status:** Installation Verification Complete
