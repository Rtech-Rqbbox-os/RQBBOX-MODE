document.addEventListener('DOMContentLoaded', async () => {
  await RQBOX.init();

  // Modules
  Controller.init();
  PerformanceEngine.init();
  Themes.init();
  GuideOverlay.init();
  Notifications.init();
  Achievements.init();
  Social.init();
  Store.init();
  QuickResume.init();
  Runtime.init();
  GameLibrary.init();
  Capture.init();
  AchievementTracker.init();
  Wishlist.init();
  ParentalControls.init();
  TaskSwitcher.init();
  GameOptimized.init();
  PerformanceOverlay.init();
  BackgroundSuppression.init();
  CloudGaming.init();
  SocialPanel.init();

  // Navigation
  RQBOX.$$('.guide-item[data-page]').forEach(item => {
    item.addEventListener('click', () => {
      RQBOX.navigate(item.dataset.page);
    });
  });

  // Power button
  RQBOX.id('guide-btn-power')?.addEventListener('click', () => {
    RQBOX.openModal(`
      <h3>Exit RQBBOX MODE?</h3>
      <p style="color:var(--text-secondary);font-size:0.8rem;margin:8px 0;">
        Return to the desktop / RQBBOX OS launcher.
      </p>
      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="RQBOX.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="RQBOX.exit();RQBOX.closeModal()">Exit</button>
      </div>
    `);
  });

  // Audio button
  RQBOX.id('guide-btn-audio')?.addEventListener('click', () => {
    const cfg = RQBOX.state.config?.audio || {};
    RQBOX.openModal(`
      <h3>Audio Quick Controls</h3>
      <div style="padding:8px 0;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;">
          <span style="font-size:0.8rem;">Master Volume</span>
          <input type="range" min="0" max="100" value="${cfg.masterVolume || 80}" 
            oninput="RQBOX.state.config.audio.masterVolume = this.value"
            style="width:100px;" />
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;">
          <span style="font-size:0.8rem;">Mute</span>
          <div class="toggle ${cfg.muted ? 'on' : ''} settings-toggle" data-key="audio.muted"></div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="RQBOX.closeModal()">Close</button>
      </div>
    `);
    Settings.bindToggles();
    Settings.bindRanges();
  });

  // User badge
  RQBOX.id('user-badge')?.addEventListener('click', () => {
    RQBOX.openModal(`
      <h3>Profile</h3>
      <div style="text-align:center;padding:16px 0;">
        <div style="font-size:3rem;margin-bottom:8px;">${RQBOX.state.user?.avatar || '👤'}</div>
        <h4>${RQBOX.state.user?.name || 'Player'}</h4>
        <p style="font-size:0.75rem;color:var(--text-muted);">${RQBOX.state.user?.username || ''}</p>
        <div style="display:flex;gap:12px;justify-content:center;margin-top:12px;">
          <div><div style="font-weight:600;">${Achievements.getProgress().unlocked}</div><div style="font-size:0.65rem;color:var(--text-muted);">Achievements</div></div>
          <div><div style="font-weight:600;">${GameLibrary.installed.games.length}</div><div style="font-size:0.65rem;color:var(--text-muted);">Installed</div></div>
          <div><div style="font-weight:600;">${Social.friends.length}</div><div style="font-size:0.65rem;color:var(--text-muted);">Friends</div></div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="RQBOX.closeModal()">Close</button>
      </div>
    `);
  });

  // Performance mode quick toggle
  document.addEventListener('keydown', (e) => {
    // Win+F11 to toggle fullscreen (like Xbox Mode)
    if (e.key === 'F11' && (e.altKey || e.metaKey)) {
      e.preventDefault();
      toggleFullScreen();
    }
    // Ctrl+Shift+P to toggle performance mode
    if (e.key === 'p' && e.ctrlKey && e.shiftKey) {
      e.preventDefault();
      PerformanceEngine.toggle();
    }
    // Ctrl+Shift+R to clear quick resume
    if (e.key === 'r' && e.ctrlKey && e.shiftKey) {
      e.preventDefault();
      QuickResume.clearAll();
    }
    // Ctrl+Shift+S to take screenshot
    if (e.key === 's' && e.ctrlKey && e.shiftKey) {
      e.preventDefault();
      Capture.screenshot();
    }
    // Alt+Tab or Ctrl+Tab to open Task Switcher
    if (e.key === 'Tab' && (e.altKey || e.ctrlKey)) {
      e.preventDefault();
      TaskSwitcher.toggle();
    }
    // Ctrl+Shift+F to toggle performance overlay
    if (e.key === 'f' && e.ctrlKey && e.shiftKey) {
      e.preventDefault();
      PerformanceOverlay.toggle();
    }
    // Windows key to exit to desktop (like Xbox Mode)
    if (e.key === 'Meta' || e.key === 'OS') {
      RQBOX.toast('Press Win+F11 to return to RQBBOX MODE');
    }
  });

  // Fullscreen toggle function
  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      RQBOX.toast('Entered Full Screen Mode');
    } else {
      document.exitFullscreen().catch(() => {});
      RQBOX.toast('Exited Full Screen Mode');
    }
  }

  // Clock
  function updateClock() {
    const el = RQBOX.id('current-time');
    if (el) {
      el.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
  updateClock();
  setInterval(updateClock, 30000);

  // Boot sequence
  await bootSequence();

  // Status indicators
  updateStatus();
  setInterval(updateStatus, 5000);

  // Onboarding tip
  setTimeout(() => {
    if (GameLibrary.games.length === 0) {
      RQBOX.toast('👋 Welcome to RQBBOX MODE! Navigate with controller or keyboard.');
    }
    // Auto-enable performance mode
    if (RQBOX.state.config?.performance?.gameMode !== false) {
      PerformanceEngine.enable();
    }
  }, 2000);
});

async function bootSequence() {
  const boot = RQBOX.id('boot-screen');
  const bar = RQBOX.id('boot-bar');
  const status = RQBOX.id('boot-status');

  const steps = [
    { pct: 20, msg: 'Initializing RQBBOX...' },
    { pct: 40, msg: 'Loading game library...' },
    { pct: 60, msg: 'Connecting controller...' },
    { pct: 80, msg: 'Optimizing performance...' },
    { pct: 100, msg: 'Ready!' },
  ];

  for (const step of steps) {
    await new Promise(r => setTimeout(r, 150 + Math.random() * 200));
    if (bar) bar.style.width = step.pct + '%';
    if (status) status.textContent = step.msg;
  }

  await new Promise(r => setTimeout(r, 300));
  if (boot) boot.classList.add('hidden');

  const dashboard = RQBOX.id('dashboard');
  if (dashboard) dashboard.style.display = 'flex';

  // Auto-enter fullscreen
  setTimeout(() => {
    document.documentElement.requestFullscreen().catch(() => {});
  }, 500);

  setTimeout(() => {
    if (boot) boot.style.display = 'none';
  }, 600);
}

async function updateStatus() {
  try {
    const pads = navigator.getGamepads();
    const hasCtrl = Array.from(pads).some(g => g);
    RQBOX.id('status-controller')?.classList.toggle('active', hasCtrl);

    RQBOX.id('status-performance')?.classList.toggle('active', PerformanceEngine.active);

    RQBOX.id('status-notif')?.classList.toggle('active', Notifications.unread > 0);
  } catch {}
}
