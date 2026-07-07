const Controller = {
  connected: false,
  pad: null,
  _poll: null,
  _lastButtons: {},
  _focusedIndex: 0,
  _focusGroup: null,
  _vibrationEnabled: true,

  init() {
    window.addEventListener('gamepadconnected', (e) => {
      this.connected = true;
      this.showIndicator(true);
      this.startPoll();
      RQBOX.toast('🎮 Controller connected');
    });
    window.addEventListener('gamepaddisconnected', () => {
      if (!navigator.getGamepads().some(g => g)) {
        this.connected = false;
        this.showIndicator(false);
        this.stopPoll();
      }
    });
    if (navigator.getGamepads().some(g => g)) {
      this.connected = true;
      this.showIndicator(true);
      this.startPoll();
    }
  },

  showIndicator(show) {
    const el = RQBOX.id('controller-indicator');
    if (!el) return;
    if (show) {
      el.style.display = 'flex';
      setTimeout(() => { if (!this.connected) el.style.display = 'none'; }, 5000);
    } else {
      el.style.display = 'none';
    }
  },

  startPoll() {
    if (this._poll) return;
    this._poll = setInterval(() => this.poll(), 50);
  },

  stopPoll() {
    if (this._poll) { clearInterval(this._poll); this._poll = null; }
  },

  vibrate(intensity = 0.5, duration = 100) {
    if (!this._vibrationEnabled || !this.connected) return;
    try {
      const pads = navigator.getGamepads();
      const pad = Array.from(pads).find(g => g);
      if (pad && pad.vibrationActuator) {
        pad.vibrationActuator.playEffect('dual-rumble', {
          startDelay: 0, duration, weakMagnitude: intensity, strongMagnitude: intensity,
        });
      }
    } catch {}
  },

  poll() {
    try {
      const pads = navigator.getGamepads();
      this.pad = Array.from(pads).find(g => g);
      if (!this.pad) return;

      const buttons = this.pad.buttons.map(b => b.pressed);
      const axes = this.pad.axes;

      if (buttons[12] && !this._lastButtons[12]) this.navAction('up');
      if (buttons[13] && !this._lastButtons[13]) this.navAction('down');
      if (buttons[14] && !this._lastButtons[14]) this.navAction('left');
      if (buttons[15] && !this._lastButtons[15]) this.navAction('right');
      if (buttons[0] && !this._lastButtons[0]) this.navAction('activate'); // A
      if (buttons[1] && !this._lastButtons[1]) this.navAction('back'); // B
      if (buttons[2] && !this._lastButtons[2]) this.navAction('menu'); // X
      if (buttons[3] && !this._lastButtons[3]) this.navAction('guide'); // Y
      if (buttons[8] && !this._lastButtons[8]) this.navAction('guide'); // Xbox/Guide
      if (buttons[9] && !this._lastButtons[9]) this.navAction('menu'); // Menu/Start
      if (buttons[16] && !this._lastButtons[16]) this.navAction('guide'); // Guide button

      if (Math.abs(axes[0] || 0) > 0.5 && !this._lastAxis) {
        this._lastAxis = true;
        if (axes[0] < -0.5) this.navAction('left');
        if (axes[0] > 0.5) this.navAction('right');
        setTimeout(() => this._lastAxis = false, 200);
      }
      if (Math.abs(axes[1] || 0) > 0.5 && !this._lastAxis) {
        this._lastAxis = true;
        if (axes[1] < -0.5) this.navAction('up');
        if (axes[1] > 0.5) this.navAction('down');
        setTimeout(() => this._lastAxis = false, 200);
      }

      this._lastButtons = buttons;
    } catch {}
  },

  navAction(action) {
    switch (action) {
      case 'up': case 'down': case 'left': case 'right':
        this.moveFocus(action);
        break;
      case 'activate':
        this.activateFocus();
        break;
      case 'back':
        this.goBack();
        break;
      case 'guide':
        this.toggleGuide();
        break;
      case 'menu':
        this.showMenu();
        break;
    }
  },

  moveFocus(dir) {
    const active = document.querySelector('.page.active');
    if (!active) return;
    let items;
    const horzScroll = active.querySelector('.horz-scroll');
    if (horzScroll && horzScroll.contains(document.activeElement) || horzScroll?.querySelector('.card')) {
      items = horzScroll.querySelectorAll('.card');
    } else {
      items = active.querySelectorAll('.card, .guide-item, .settings-nav-item, .filter-pill, .btn');
    }
    if (!items || !items.length) return;

    items.forEach((c, i) => c.classList.toggle('focused', i === this._focusedIndex));

    const cols = 4;
    const newIdx = (() => {
      switch (dir) {
        case 'right': return Math.min(this._focusedIndex + 1, items.length - 1);
        case 'left': return Math.max(this._focusedIndex - 1, 0);
        case 'down': return Math.min(this._focusedIndex + cols, items.length - 1);
        case 'up': return Math.max(this._focusedIndex - cols, 0);
        default: return this._focusedIndex;
      }
    })();

    this._focusedIndex = newIdx;
    items.forEach((c, i) => c.classList.toggle('focused', i === this._focusedIndex));
    items[this._focusedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    items[this._focusedIndex]?.focus();
    this.vibrate(0.2, 30);
  },

  activateFocus() {
    const focused = document.querySelector('.card.focused, .guide-item.focused, .settings-nav-item.focused, .filter-pill.focused, .btn.focused');
    if (focused) {
      focused.click();
      this.vibrate(0.4, 60);
    }
  },

  goBack() {
    if (RQBOX.id('guide-overlay')?.style.display === 'flex') {
      RQBOX.id('guide-overlay').style.display = 'none';
    } else {
      RQBOX.toast('Press Guide button (🏠) for menu');
    }
    this.vibrate(0.2, 30);
  },

  toggleGuide() {
    const overlay = RQBOX.id('guide-overlay');
    if (overlay.style.display === 'flex') {
      overlay.style.display = 'none';
    } else {
      this.showGuidePanel();
    }
  },

  showMenu() {
    RQBOX.toast('Menu — Settings or options');
  },

  showGuidePanel() {
    const overlay = RQBOX.id('guide-overlay');
    const body = RQBOX.id('guide-body');
    if (!overlay || !body) return;
    overlay.style.display = 'flex';
    body.innerHTML = `
      <div class="guide-section">
        <h4 style="font-size:0.85rem;font-weight:500;margin-bottom:12px;">Quick Actions</h4>
        <button class="btn btn-primary" style="width:100%;margin-bottom:8px;" onclick="RQBOX.navigate('home');Controller.toggleGuide()">🏠 Home</button>
        <button class="btn btn-ghost" style="width:100%;margin-bottom:8px;" onclick="RQBOX.navigate('games');Controller.toggleGuide()">🎮 Games</button>
        <button class="btn btn-ghost" style="width:100%;margin-bottom:8px;" onclick="RQBOX.navigate('resume');Controller.toggleGuide()">⏸️ Quick Resume</button>
        <button class="btn btn-ghost" style="width:100%;margin-bottom:8px;" onclick="RQBOX.navigate('friends');Controller.toggleGuide()">👥 Friends</button>
        <button class="btn btn-ghost" style="width:100%;margin-bottom:8px;" onclick="RQBOX.navigate('settings');Controller.toggleGuide()">⚙️ Settings</button>
      </div>
      <div class="guide-section" style="margin-top:16px;">
        <h4 style="font-size:0.85rem;font-weight:500;margin-bottom:8px;">Controller</h4>
        <p style="font-size:0.75rem;color:var(--text-muted);">
          🎮 D-pad: Navigate &middot; A: Select &middot; B: Back &middot; Guide: This menu
        </p>
      </div>
    `;
  },

  focusSection(sectionEl) {
    const items = sectionEl.querySelectorAll('.card, button, [tabindex]');
    if (items.length) {
      this._focusedIndex = 0;
      items[0]?.focus();
    }
  },
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (RQBOX.id('guide-overlay')?.style.display === 'flex') {
      RQBOX.id('guide-overlay').style.display = 'none';
    } else if (RQBOX.id('modal-container')?.innerHTML) {
      RQBOX.closeModal();
    }
  }
  if (e.key === 'F11' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }
  if (e.key === 'F11' && (e.shiftKey && e.ctrlKey)) {
    e.preventDefault();
    RQBOX.exit();
  }
});
