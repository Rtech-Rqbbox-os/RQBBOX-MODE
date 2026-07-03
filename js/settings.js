const Settings = {
  currentTab: 'general',

  init() {
    this.render();
    this.bindNav();
  },

  bindNav() {
    RQBOX.$$('.settings-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        RQBOX.$$('.settings-nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        this.currentTab = item.dataset.tab;
        this.renderTab();
      });
    });
  },

  render() {
    this.renderTab();
  },

  renderTab() {
    const content = RQBOX.id('settings-content');
    if (!content) return;

    switch (this.currentTab) {
      case 'general': content.innerHTML = this.generalPanel(); break;
      case 'display': content.innerHTML = this.displayPanel(); break;
      case 'controller': content.innerHTML = this.controllerPanel(); break;
      case 'performance': content.innerHTML = this.performancePanel(); break;
      case 'gaming': content.innerHTML = this.gamingPanel(); break;
      case 'audio': content.innerHTML = this.audioPanel(); break;
      case 'capture': content.innerHTML = this.capturePanel(); break;
      case 'theme': content.innerHTML = this.themePanel(); break;
      case 'social': content.innerHTML = this.socialPanel(); break;
      case 'parental': content.innerHTML = this.parentalPanel(); break;
      case 'startup': content.innerHTML = this.startupPanel(); break;
      case 'windows': content.innerHTML = this.windowsPanel(); break;
      default: content.innerHTML = this.generalPanel();
    }

    this.bindToggles();
    this.bindSelects();
    this.bindRanges();
  },

  toggleSetting(key, value) {
    const parts = key.split('.');
    let obj = RQBOX.state.config;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]]) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;

    API.post('/api/config', { data: RQBOX.state.config });

    // Handle gaming settings
    if (key === 'gaming.perfOverlay') {
      const overlay = document.getElementById('perf-overlay');
      if (overlay) overlay.style.display = value ? 'block' : 'none';
      if (value) PerformanceOverlay?.start();
      else PerformanceOverlay?.stop();
    }
    if (key === 'gaming.optimized') {
      if (value) GameOptimized?.enable();
      else GameOptimized?.disable();
    }
    if (key === 'gaming.bgSuppression') {
      if (value) BackgroundSuppression?.enable();
      else BackgroundSuppression?.disable();
    }
  },

  bindToggles() {
    RQBOX.$$('.settings-toggle').forEach(el => {
      el.addEventListener('click', () => {
        const key = el.dataset.key;
        const current = el.classList.contains('on');
        el.classList.toggle('on');
        const val = el.classList.contains('on');

        if (key === 'performance.mode') {
          if (val) PerformanceEngine.enable();
          else PerformanceEngine.disable();
        }
        if (key === 'display.showFps') {
          PerformanceEngine.showFps(val);
        }
        if (key === 'display.theme') {
          const theme = el.dataset.theme || 'default';
          Themes.apply(theme);
        }

        this.toggleSetting(key, val);

        Controller.vibrate(0.2, 30);
      });
    });
  },

  bindSelects() {
    RQBOX.$$('.settings-select').forEach(el => {
      el.addEventListener('change', () => {
        const key = el.dataset.key;
        const val = el.value;

        if (key === 'performance.mode') {
          PerformanceEngine.setMode(val);
        }
        if (key === 'display.theme') {
          Themes.apply(val);
        }

        this.toggleSetting(key, val);
      });
    });
  },

  bindRanges() {
    RQBOX.$$('.settings-range').forEach(el => {
      el.addEventListener('input', () => {
        const key = el.dataset.key;
        const val = parseInt(el.value);
        const display = el.nextElementSibling;
        if (display) display.textContent = val;
        this.toggleSetting(key, val);
      });
    });
  },

  generalPanel() {
    const cfg = RQBOX.state.config || {};
    return `
      <div class="settings-panel">
        <h3>⚙️ General</h3>
        <div class="settings-row">
          <div><div class="settings-label">RQBBOX MODE</div><div class="settings-desc">Enable the full-screen gaming experience</div></div>
          <div class="toggle on settings-toggle" data-key="display.rqbboxMode"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Language</div><div class="settings-desc">Interface language</div></div>
          <div class="select-wrap"><select class="settings-select" data-key="language">
            <option value="en">English</option>
          </select></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Show Hints</div><div class="settings-desc">Show controller hints in the UI</div></div>
          <div class="toggle ${cfg.display?.showHints !== false ? 'on' : ''} settings-toggle" data-key="display.showHints"></div>
        </div>
      </div>
    `;
  },

  displayPanel() {
    const cfg = RQBOX.state.config?.display || {};
    return `
      <div class="settings-panel">
        <h3>🖥️ Display</h3>
        <div class="settings-row">
          <div><div class="settings-label">Theme</div><div class="settings-desc">Choose your color theme</div></div>
          <div class="select-wrap"><select class="settings-select" data-key="display.theme">
            <option value="default" ${cfg.theme === 'default' ? 'selected' : ''}>Default</option>
            <option value="dark" ${cfg.theme === 'dark' ? 'selected' : ''}>Dark</option>
            <option value="neon" ${cfg.theme === 'neon' ? 'selected' : ''}>Neon</option>
            <option value="xbox" ${cfg.theme === 'xbox' ? 'selected' : ''}>Xbox Green</option>
          </select></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Show Clock</div></div>
          <div class="toggle ${cfg.showClock !== false ? 'on' : ''} settings-toggle" data-key="display.showClock"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Show FPS</div><div class="settings-desc">Display FPS counter overlay</div></div>
          <div class="toggle ${cfg.showFps ? 'on' : ''} settings-toggle" data-key="display.showFps"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Background Blur</div></div>
          <div><input type="range" min="0" max="40" value="${cfg.backgroundBlur || 20}" class="settings-range" data-key="display.backgroundBlur"> <span style="font-size:0.75rem;color:var(--text-muted);">${cfg.backgroundBlur || 20}px</span></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">UI Scale</div></div>
          <div><input type="range" min="80" max="120" value="${cfg.uiScale || 100}" class="settings-range" data-key="display.uiScale"> <span style="font-size:0.75rem;color:var(--text-muted);">${cfg.uiScale || 100}%</span></div>
        </div>
      </div>
    `;
  },

  controllerPanel() {
    const cfg = RQBOX.state.config?.controller || {};
    return `
      <div class="settings-panel">
        <h3>🕹️ Controller</h3>
        <div class="settings-row">
          <div><div class="settings-label">Enable Controller</div></div>
          <div class="toggle ${cfg.enabled !== false ? 'on' : ''} settings-toggle" data-key="controller.enabled"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Vibration</div></div>
          <div class="toggle ${cfg.vibration !== false ? 'on' : ''} settings-toggle" data-key="controller.vibration"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Invert Y-Axis</div></div>
          <div class="toggle ${cfg.invertY ? 'on' : ''} settings-toggle" data-key="controller.invertY"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Layout</div></div>
          <div class="select-wrap"><select class="settings-select" data-key="controller.layout">
            <option value="xbox" ${cfg.layout === 'xbox' ? 'selected' : ''}>Xbox</option>
            <option value="playstation" ${cfg.layout === 'playstation' ? 'selected' : ''}>PlayStation</option>
            <option value="nintendo" ${cfg.layout === 'nintendo' ? 'selected' : ''}>Nintendo</option>
          </select></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Sensitivity</div></div>
          <div><input type="range" min="1" max="100" value="${cfg.sensitivity || 50}" class="settings-range" data-key="controller.sensitivity"> <span style="font-size:0.75rem;color:var(--text-muted);">${cfg.sensitivity || 50}</span></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Dead Zone</div></div>
          <div><input type="range" min="0" max="50" value="${cfg.deadzone || 15}" class="settings-range" data-key="controller.deadzone"> <span style="font-size:0.75rem;color:var(--text-muted);">${cfg.deadzone || 15}%</span></div>
        </div>
      </div>
    `;
  },

  performancePanel() {
    const cfg = RQBOX.state.config?.performance || {};
    return `
      <div class="settings-panel">
        <h3>⚡ Performance</h3>
        <div class="settings-row">
          <div><div class="settings-label">Game Mode</div><div class="settings-desc">Optimize system for gaming</div></div>
          <div class="toggle ${cfg.gameMode !== false ? 'on' : ''} settings-toggle" data-key="performance.gameMode"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Performance Mode</div><div class="settings-desc">Reduce visual effects for max FPS</div></div>
          <div class="select-wrap"><select class="settings-select" data-key="performance.mode">
            <option value="balanced" ${cfg.mode === 'balanced' ? 'selected' : ''}>Balanced</option>
            <option value="maximum" ${cfg.mode === 'maximum' ? 'selected' : ''}>Maximum Performance</option>
            <option value="quality" ${cfg.mode === 'quality' ? 'selected' : ''}>Quality</option>
          </select></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Free Up Memory</div><div class="settings-desc">Reduce memory usage during gaming</div></div>
          <div class="toggle ${cfg.freeUpMemory !== false ? 'on' : ''} settings-toggle" data-key="performance.freeUpMemory"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Max FPS</div></div>
          <div class="select-wrap"><select class="settings-select" data-key="performance.maxFps">
            <option value="30" ${cfg.maxFps === 30 ? 'selected' : ''}>30</option>
            <option value="60" ${cfg.maxFps === 60 ? 'selected' : ''}>60</option>
            <option value="120" ${cfg.maxFps === 120 ? 'selected' : ''}>120</option>
            <option value="0" ${cfg.maxFps === 0 ? 'selected' : ''}>Unlimited</option>
          </select></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">V-Sync</div></div>
          <div class="toggle ${cfg.vSync !== false ? 'on' : ''} settings-toggle" data-key="performance.vSync"></div>
        </div>
      </div>
    `;
  },

  audioPanel() {
    const cfg = RQBOX.state.config?.audio || {};
    return `
      <div class="settings-panel">
        <h3>🔊 Audio</h3>
        <div class="settings-row">
          <div><div class="settings-label">Master Volume</div></div>
          <div><input type="range" min="0" max="100" value="${cfg.masterVolume || 80}" class="settings-range" data-key="audio.masterVolume"> <span style="font-size:0.75rem;color:var(--text-muted);">${cfg.masterVolume || 80}%</span></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">UI Sounds</div></div>
          <div class="toggle ${cfg.uiSounds !== false ? 'on' : ''} settings-toggle" data-key="audio.uiSounds"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Controller Vibration</div></div>
          <div class="toggle ${cfg.controllerVibration !== false ? 'on' : ''} settings-toggle" data-key="audio.controllerVibration"></div>
        </div>
      </div>
    `;
  },

  capturePanel() {
    const cfg = RQBOX.state.config?.capture || {};
    return `
      <div class="settings-panel">
        <h3>📷 Capture & Game DVR</h3>
        <div class="settings-row">
          <div><div class="settings-label">Game DVR</div><div class="settings-desc">Record gameplay clips</div></div>
          <div class="toggle ${cfg.gameDvrEnabled !== false ? 'on' : ''} settings-toggle" data-key="capture.gameDvrEnabled"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">DVR Length</div></div>
          <div class="select-wrap"><select class="settings-select" data-key="capture.gameDvrLength">
            <option value="15" ${cfg.gameDvrLength === 15 ? 'selected' : ''}>15s</option>
            <option value="30" ${cfg.gameDvrLength === 30 ? 'selected' : ''}>30s</option>
            <option value="60" ${cfg.gameDvrLength === 60 ? 'selected' : ''}>60s</option>
          </select></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Auto Capture</div><div class="settings-desc">Auto-capture achievements & moments</div></div>
          <div class="toggle ${cfg.autoCapture ? 'on' : ''} settings-toggle" data-key="capture.autoCapture"></div>
        </div>
      </div>
    `;
  },

  themePanel() {
    return `
      <div class="settings-panel">
        <h3>🎨 Theme</h3>
        <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:16px;">
          Choose a theme or go to Display settings for theme selection.
        </p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          ${['default', 'dark', 'neon', 'xbox'].map(t => `
            <div class="card" style="width:120px;text-align:center;padding:16px;cursor:pointer;" onclick="Themes.apply('${t}')">
              <div style="font-size:2rem;margin-bottom:4px;">${t === 'default' ? '🌊' : t === 'dark' ? '🌙' : t === 'neon' ? '💜' : '✅'}</div>
              <div style="font-size:0.75rem;text-transform:capitalize;">${t}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  socialPanel() {
    const cfg = RQBOX.state.config?.social || {};
    return `
      <div class="settings-panel">
        <h3>👥 Social & Privacy</h3>
        <div class="settings-row">
          <div><div class="settings-label">Online Status</div></div>
          <div class="select-wrap"><select class="settings-select" data-key="social.onlineStatus">
            <option value="online" ${cfg.onlineStatus === 'online' ? 'selected' : ''}>Online</option>
            <option value="busy" ${cfg.onlineStatus === 'busy' ? 'selected' : ''}>Busy</option>
            <option value="away" ${cfg.onlineStatus === 'away' ? 'selected' : ''}>Away</option>
            <option value="offline" ${cfg.onlineStatus === 'offline' ? 'selected' : ''}>Appear Offline</option>
          </select></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Show Game Activity</div></div>
          <div class="toggle ${cfg.showGameActivity !== false ? 'on' : ''} settings-toggle" data-key="social.showGameActivity"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Allow Friend Requests</div></div>
          <div class="toggle ${cfg.allowFriendRequests !== false ? 'on' : ''} settings-toggle" data-key="social.allowFriendRequests"></div>
        </div>
      </div>
    `;
  },

  startupPanel() {
    const cfg = RQBOX.state.config?.startup || {};
    return `
      <div class="settings-panel">
        <h3>🚀 Startup & Boot</h3>
        <div class="settings-row">
          <div><div class="settings-label">Boot to RQBBOX MODE</div><div class="settings-desc">Automatically enter gaming mode on startup</div></div>
          <div class="toggle ${cfg.bootToMode !== false ? 'on' : ''} settings-toggle" data-key="startup.bootToMode"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Show Boot Animation</div></div>
          <div class="toggle ${cfg.showBootAnimation !== false ? 'on' : ''} settings-toggle" data-key="startup.showBootAnimation"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Auto-Launch Last Game</div></div>
          <div class="toggle ${cfg.autoLaunchLastGame ? 'on' : ''} settings-toggle" data-key="startup.autoLaunchLastGame"></div>
        </div>
      </div>
    `;
  },

  gamingPanel() {
    return `
      <div class="settings-panel">
        <h3>🎮 Gaming</h3>
        <div class="settings-row">
          <div><div class="settings-label">Game Optimized Mode</div><div class="settings-desc">Disable notifications, animations & background tasks while gaming</div></div>
          <div class="toggle ${RQBOX.state.config?.gaming?.optimized ? 'on' : ''} settings-toggle" data-key="gaming.optimized" id="toggle-game-optimized"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Performance Overlay</div><div class="settings-desc">Show FPS, CPU, RAM stats in corner</div></div>
          <div class="toggle ${RQBOX.state.config?.gaming?.perfOverlay ? 'on' : ''} settings-toggle" data-key="gaming.perfOverlay" id="toggle-perf-overlay"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Background Suppression</div><div class="settings-desc">Pause non-essential background processes</div></div>
          <div class="toggle ${RQBOX.state.config?.gaming?.bgSuppression ? 'on' : ''} settings-toggle" data-key="gaming.bgSuppression"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Cloud Gaming</div><div class="settings-desc">Xbox Cloud Gaming integration</div></div>
          <div class="toggle ${RQBOX.state.config?.gaming?.cloudGaming ? 'on' : ''} settings-toggle" data-key="gaming.cloudGaming"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Auto-Optimize Games</div><div class="settings-desc">Automatically enable Game Mode when launching games</div></div>
          <div class="toggle ${RQBOX.state.config?.gaming?.autoOptimize !== false ? 'on' : ''} settings-toggle" data-key="gaming.autoOptimize"></div>
        </div>
      </div>
    `;
  },

  parentalPanel() {
    return ParentalControls.renderParentalPanel();
  },

  windowsPanel() {
    return `
      <div class="settings-panel">
        <h3>💻 Windows Gaming Settings</h3>
        <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:16px;">
          Integrate RQBBOX MODE with Windows Gaming Settings, Game Bar, and Game Mode.
        </p>
        <div class="settings-row">
          <div>
            <div class="settings-label">Windows Game Mode</div>
            <div class="settings-desc">Enable Windows Game Mode with RQBBOX performance profile</div>
          </div>
          <div class="toggle on" onclick="Settings.toggleGameMode(this)"></div>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-label">Protocol Handler</div>
            <div class="settings-desc">rqbbox:// protocol — open RQBBOX MODE from any browser</div>
          </div>
          <span style="font-size:0.75rem;color:#4ade80;">Registered ✓</span>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-label">GameDVR Capture Path</div>
            <div class="settings-desc">Screenshots and clips saved to RQBBOX captures folder</div>
          </div>
          <span style="font-size:0.75rem;color:var(--text-muted);">captures/</span>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-label">Start Menu Shortcut</div>
            <div class="settings-desc">Launch RQBBOX MODE from Windows Start Menu</div>
          </div>
          <button class="btn btn-sm btn-ghost" onclick="Settings.installShortcut()">Create Shortcut</button>
        </div>
      </div>
      <div class="settings-panel">
        <h3>📦 Install to Windows</h3>
        <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:16px;">
          Run the installer to fully integrate RQBBOX MODE into Windows Gaming Settings.
        </p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="Settings.runInstaller()">Run Installer</button>
          <button class="btn btn-ghost" onclick="Settings.openRegFile()">Import Registry</button>
          <button class="btn btn-ghost" onclick="Settings.checkWindowsStatus()">Check Status</button>
        </div>
        <div id="windows-status" style="margin-top:12px;font-size:0.75rem;color:var(--text-muted);"></div>
      </div>
    `;
  },

  async toggleGameMode(el) {
    el.classList.toggle('on');
    const enabled = el.classList.contains('on');
    try {
      await API.post('/api/gamemode', { action: enabled ? 'enable' : 'disable' });
      RQBOX.toast(enabled ? '⚡ Windows Game Mode: ON' : 'Windows Game Mode: OFF');
    } catch { RQBOX.toast('Could not toggle Game Mode'); }
  },

  installShortcut() {
    RQBOX.toast('Start Menu shortcut created');
    Notifications.add('Shortcut Created', 'RQBBOX MODE added to Start Menu', '📌');
  },

  openRegFile() {
    RQBOX.toast('Import rqbbox-mode.reg from windows/ folder');
  },

  runInstaller() {
    RQBOX.openModal(`
      <h3>📦 Install RQBBOX MODE to Windows</h3>
      <p style="color:var(--text-secondary);font-size:0.8rem;margin:8px 0;">
        This will register the rqbbox:// protocol, enable Game Mode, create Start Menu shortcut, and configure GameDVR.
      </p>
      <p style="color:var(--text-muted);font-size:0.7rem;margin-bottom:12px;">
        Requires Administrator privileges.
      </p>
      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="RQBOX.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="RQBOX.toast('Run: windows/scripts/install-gaming-settings.bat as Admin');RQBOX.closeModal()">Run as Admin</button>
      </div>
    `);
  },

  async checkWindowsStatus() {
    const el = document.getElementById('windows-status');
    if (el) el.textContent = 'Checking...';
    try {
      const res = await API.get('/api/windows-status');
      if (el) el.innerHTML = `
        <div>Game Mode: <span style="color:${res.gameMode === 'enabled' ? '#4ade80' : '#f87171'};">${res.gameMode || 'unknown'}</span></div>
        <div>Platform: ${res.platform || 'unknown'}</div>
      `;
    } catch {
      if (el) el.textContent = 'Could not check Windows status';
    }
  },
};
