// RQBBOX MODE - Task Switcher
// Controller-friendly Alt+Tab for switching between games/apps

const TaskSwitcher = {
  isOpen: false,
  apps: [],
  selectedIndex: 0,

  init() {
    this.bindKeys();
  },

  bindKeys() {
    document.addEventListener('keydown', (e) => {
      // Win+Tab to open task switcher (like Xbox Mode)
      if (e.key === 'Tab' && (e.metaKey || e.winKey)) {
        e.preventDefault();
        this.toggle();
      }
      // Escape to close
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
      // Arrow keys to navigate
      if (this.isOpen) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          this.moveSelection(1);
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          this.moveSelection(-1);
        }
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectApp();
        }
      }
    });

    // Controller support
    window.addEventListener('gamepadconnected', () => {
      this.startControllerPoll();
    });
  },

  startControllerPoll() {
    setInterval(() => {
      if (!this.isOpen) return;
      const pads = navigator.getGamepads();
      const pad = Array.from(pads).find(g => g);
      if (!pad) return;

      // D-pad navigation
      if (pad.buttons[12]?.pressed) this.moveSelection(-1); // Up
      if (pad.buttons[13]?.pressed) this.moveSelection(1);  // Down
      if (pad.buttons[14]?.pressed) this.moveSelection(-1); // Left
      if (pad.buttons[15]?.pressed) this.moveSelection(1);  // Right
      if (pad.buttons[0]?.pressed) this.selectApp();        // A button
      if (pad.buttons[1]?.pressed) this.close();             // B button
    }, 100);
  },

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  },

  open() {
    this.isOpen = true;
    this.apps = this.getOpenApps();
    this.selectedIndex = 0;
    this.render();
    document.getElementById('task-switcher')?.classList.add('active');
    Controller.vibrate(0.3, 50);
  },

  close() {
    this.isOpen = false;
    document.getElementById('task-switcher')?.classList.remove('active');
    Controller.vibrate(0.2, 30);
  },

  getOpenApps() {
    // Get currently running games/apps from the runtime overlay
    const apps = [];
    
    // Add current game if running
    const frame = document.getElementById('runtime-frame');
    if (frame && frame.src && frame.src !== 'about:blank') {
      apps.push({
        id: 'current-game',
        title: document.getElementById('runtime-title')?.textContent || 'Game',
        icon: '🎮',
        type: 'game'
      });
    }

    // Add dashboard sections as "apps"
    apps.push(
      { id: 'home', title: 'Home', icon: '🏠', type: 'section' },
      { id: 'games', title: 'Game Library', icon: '🎮', type: 'section' },
      { id: 'store', title: 'Store', icon: '🛒', type: 'section' },
      { id: 'friends', title: 'Social', icon: '👥', type: 'section' },
      { id: 'settings', title: 'Settings', icon: '⚙️', type: 'section' }
    );

    return apps;
  },

  moveSelection(delta) {
    this.selectedIndex = Math.max(0, Math.min(this.apps.length - 1, this.selectedIndex + delta));
    this.updateSelection();
    Controller.vibrate(0.2, 20);
  },

  updateSelection() {
    document.querySelectorAll('.task-item').forEach((item, i) => {
      item.classList.toggle('selected', i === this.selectedIndex);
    });
  },

  selectApp() {
    const app = this.apps[this.selectedIndex];
    if (!app) return;

    if (app.id === 'current-game') {
      // Bring game to front
      document.getElementById('runtime-overlay')?.classList.add('active');
    } else {
      // Navigate to section
      RQBOX.navigate(app.id);
      Runtime.close();
    }

    this.close();
    Controller.vibrate(0.4, 60);
  },

  render() {
    let container = document.getElementById('task-switcher');
    if (!container) {
      container = document.createElement('div');
      container.id = 'task-switcher';
      container.className = 'task-switcher';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div class="task-header">
        <span>Task Switcher</span>
        <span class="task-hint">D-pad to navigate • A to select • B to close</span>
      </div>
      <div class="task-list">
        ${this.apps.map((app, i) => `
          <div class="task-item ${i === this.selectedIndex ? 'selected' : ''}" onclick="TaskSwitcher.selectedIndex=${i};TaskSwitcher.selectApp()">
            <span class="task-icon">${app.icon}</span>
            <span class="task-title">${app.title}</span>
            <span class="task-type">${app.type}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
};
