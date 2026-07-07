# GitHub Repository Management Guide

## Renaming the Repository

### Step 1: Rename the Repository on GitHub
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Repository name** section
4. Enter the new name (e.g., `RQBBOX-Experience`)
5. Click **Rename**

### Step 2: Update Local Repository
```bash
cd "c:\Users\RhysC\Downloads\RQBBOX Experience"
git remote set-url origin https://github.com/rtech-rqbbox-os/RQBBOX-Experience.git
```

### Step 3: Update References
Update the following files with the new repository URL:
- `README.md` - Update GitHub links and badges
- `package.json` - Update repository URL
- Any documentation files

## Managing Releases

### Step 1: Delete Old Release
1. Go to your repository on GitHub
2. Click **Releases** tab
3. Find the old release
4. Click **Delete** (you may need to click the three dots menu)

### Step 2: Create New Release
1. Click **Releases** tab
2. Click **Create a new release**
3. Fill in the release details:
   - **Tag version**: `v1.0.0`
   - **Release title**: `RQBBOX Experience OS 1.0.0`
   - **Description**: 
     ```
     ## RQBBOX Experience OS 1.0.0
     
     ### Features
     - 24+ Built-in Games (All Playable)
     - 40+ Apps Available
     - AI Assistant
     - System Monitor
     - Gaming Hub with Quick Resume
     - Social Hub
     - Code Editor
     - Paint Studio
     - And more...
     
     ### Installation
     Download `RQBBOX-Experience-Setup-1.0.0.exe` and run the installer.
     
     ### System Requirements
     - Windows 10/11 (x64)
     - 4GB RAM minimum
     - 500MB disk space
     
     ### What's New
     - Fixed all game launch URLs
     - Added 14 new playable games
     - Created game icons for all games
     - Built Windows installer
     - Added 10 promotional banners
     - Created GitHub logos and icons
     ```
4. Upload the installer:
   - Drag and drop `dist\RQBBOX-Experience-Setup-1.0.0.exe` to the binaries section
5. Click **Publish release**

## Uploading Assets to GitHub

### Banners
1. Go to repository on GitHub
2. Click **Upload files** or use Git:
```bash
cd "c:\Users\RhysC\Downloads\RQBBOX Experience"
git add assets/banners/
git commit -m "Add 10 promotional banners"
git push origin main
```

### Logos and Icons
```bash
git add assets/logo-github.svg assets/icon-github.svg assets/favicon-github.svg assets/logo-github-dark.svg assets/logo-github-light.svg
git commit -m "Add GitHub logos and icons"
git push origin main
```

### Game Assets
```bash
git add games/
git commit -m "Add all 24 playable games with icons"
git push origin main
```

## Updating README.md

Update the README with new repository information:

```markdown
# RQBBOX Experience OS 1.0

**Next-generation desktop gaming console hybrid by RhysTech**

[![GitHub Release](https://img.shields.io/badge/Release-v1.0.0-cyan?style=for-the-badge)](https://github.com/rtech-rqbbox-os/RQBBOX-Experience/releases/latest)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://github.com/rtech-rqbbox-os/RQBBOX-Experience/blob/master/LICENSE)
[![Electron](https://img.shields.io/badge/Electron-33-purple?style=for-the-badge&logo=electron)](https://electronjs.org)

## Download

[**Download Setup.exe**](https://github.com/rtech-rqbbox-os/RQBBOX-Experience/releases/latest) - Windows 10/11

## Features

- **🎮 Gaming Hub** — 24+ built-in web games, all playable
- **✦ AI Assistant** — Built-in AI chat
- **🛒 App Store** — 40+ apps
- **📊 System Monitor** — Real-time performance stats
- And 18+ more features...
```

## Repository Settings

### Recommended Settings
1. **Settings → General**:
   - Set repository visibility (Public/Private)
   - Enable "Issues" for bug tracking
   - Enable "Discussions" for community
   - Enable "Wiki" for documentation

2. **Settings → Branches**:
   - Set main branch protection
   - Require pull request reviews

3. **Settings → Pages**:
   - Enable GitHub Pages for documentation
   - Source: Deploy from branch `main` / `docs` folder

## Social Preview

Update `assets/social-preview.svg` and `assets/og-image.svg` for better social media sharing.

## Checklist

- [ ] Rename repository on GitHub
- [ ] Update local git remote URL
- [ ] Update README.md with new URLs
- [ ] Update package.json repository URL
- [ ] Delete old release
- [ ] Create new release with installer
- [ ] Upload banners to repository
- [ ] Upload logos and icons
- [ ] Push all game changes
- [ ] Test download link
- [ ] Verify all assets load correctly

## Notes

- The Windows installer is located at: `dist\RQBBOX-Experience-Setup-1.0.0.exe`
- All 24 games are now playable with unique launch URLs
- 10 promotional banners are in `assets/banners/`
- GitHub logos and icons are in `assets/`
- The installer is unsigned (users may see security warning)
