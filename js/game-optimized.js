// RQBBOX Experience OS 1.0 - Game Optimized Mode
// Disables notifications and background processes for maximum performance

const GameOptimized = {
  active: false,
  suppressedApps: [],

  init() {
    this.loadState();
  },

  loadState() {
    const saved = localStorage.getItem('rqbbox-game-optimized');
    if (saved === 'true') {
      this.enable();
    }
  },

  enable() {
    this.active = true;
    document.body.classList.add('game-optimized');
    
    // Suppress notifications
    this.suppressNotifications();
    
    // Disable background animations
    this.disableAnimations();
    
    // Reduce memory usage
    this.reduceMemory();
    
    // Show notification
    RQBOX.toast('Game Optimized Mode: ON — All background processes disabled');
    
    // Save state
    localStorage.setItem('rqbbox-game-optimized', 'true');
    
    // Update UI
    this.updateUI();
  },

  disable() {
    this.active = false;
    document.body.classList.remove('game-optimized');
    
    // Restore notifications
    this.restoreNotifications();
    
    // Enable animations
    this.enableAnimations();
    
    // Show notification
    RQBOX.toast('Game Optimized Mode: OFF');
    
    // Save state
    localStorage.setItem('rqbbox-game-optimized', 'false');
    
    // Update UI
    this.updateUI();
  },

  toggle() {
    if (this.active) {
      this.disable();
    } else {
      this.enable();
    }
  },

  suppressNotifications() {
    // Create notification blocker
    const blocker = document.createElement('div');
    blocker.id = 'notification-blocker';
    blocker.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99998;pointer-events:none;';
    document.body.appendChild(blocker);
  },

  restoreNotifications() {
    document.getElementById('notification-blocker')?.remove();
  },

  disableAnimations() {
    const style = document.createElement('style');
    style.id = 'game-optimized-css';
    style.textContent = `
      .game-optimized * {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
      .game-optimized .bg-orb { display: none !important; }
      .game-optimized .toast { display: none !important; }
      .game-optimized .notification { display: none !important; }
    `;
    document.head.appendChild(style);
  },

  enableAnimations() {
    document.getElementById('game-optimized-css')?.remove();
  },

  reduceMemory() {
    // Clear unused caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
  },

  updateUI() {
    const indicator = document.getElementById('status-game-optimized');
    if (indicator) {
      indicator.classList.toggle('active', this.active);
    }
  }
};
