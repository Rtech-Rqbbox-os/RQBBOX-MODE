# RQBBOX OS Portable USB

**Version:** 3.1 | **Platform:** Windows, macOS, Linux, Android, iOS | **License:** MIT

## Overview

RQBBOX OS is a portable gaming operating system that runs entirely from a USB drive. Plug it into any PC, start the server, and instantly access your games, apps, settings, and saves no installation required.

**Developer:** RhysTech
**Website:** https://rtech-rqbbox-os.github.io/rqbbox-os/
**Support:** rqbbox.support@groups.outlook.com

## Features

- **RQBBOX Kernel** — Modular microkernel with process, memory, and file system management
- **6 Native Games** — Neon Drift Racing, Pixel Quest, Star Fighter X, Void Craft Sandbox, Retro Zone, Cube Runner 3D
- **12 Web App Integrations** — YouTube, Netflix, Spotify, Twitch, Discord, and more
- **Full Launcher Console** — Sidebar navigation, runtime overlay, notifications, search
- **Fullscreen Mode** — Console-style gaming overlay with controller navigation
- **Plugin and Theme Engine** — Extend with JavaScript plugins, customize with CSS themes
- **Editions System** — Lite / Pro / Creator with feature gating
- **Profile System** — Multi-user support with sign-in, PIN auth
- **QR Code Sharing** — Share app/game links via QR codes

## RQBBOX Kernel Architecture

The RQBBOX Kernel is a modular microkernel that includes:

- **Process Manager** — Start, stop, and manage processes
- **Memory Manager** — Allocate and free memory
- **Virtual File System** — File operations with virtual paths
- **Device Drivers** — Hardware abstraction layer
- **System Call API** — User-space to kernel-space interface
- **GUI + CLI Interfaces** — Both graphical and command-line access

## Quick Start

1. Download RQBBOX OS from the releases page
2. Extract to a USB drive (FAT32 or NTFS)
3. Run Start RQBBOX OS.bat or npm start
4. Server starts at http://127.0.0.1:19778/
5. Dashboard opens automatically in your browser

## Editions

| Edition | Features |
|---------|----------|
| Lite | Basic launcher, 6 games, web apps |
| Pro | Full dashboard, controller support, Quick Resume, achievements |
| Creator | Pro + Plugin SDK, Theme Editor, Developer tools |

## GitHub Packages

RQBBOX OS is available via GitHub Packages (npm). Add the registry and install:

```
npm install @rtech-rqbbox-os/rqbbox-os
```
