// RQBBOX MODE - Parental Controls
// Family settings and content restrictions

const ParentalControls = {
  enabled: false,
  settings: {
    maxPlayTime: 0, // 0 = unlimited
    allowedCategories: ['all'],
    requirePin: false,
    pin: null,
    screenTime: 0,
    lastCheck: null
  },

  init() {
    this.loadSettings();
    this.checkPlayTime();
  },

  loadSettings() {
    const saved = localStorage.getItem('rqbbox-parental');
    if (saved) {
      this.settings = JSON.parse(saved);
      this.enabled = true;
    }
  },

  saveSettings() {
    localStorage.setItem('rqbbox-parental', JSON.stringify(this.settings));
  },

  enable(pin) {
    this.enabled = true;
    this.settings.pin = pin;
    this.settings.requirePin = true;
    this.saveSettings();
    RQBOX.toast('Parental Controls enabled');
  },

  disable(pin) {
    if (this.settings.pin !== pin) {
      RQBOX.toast('Invalid PIN');
      return false;
    }
    this.enabled = false;
    this.settings.requirePin = false;
    this.saveSettings();
    RQBOX.toast('Parental Controls disabled');
    return true;
  },

  setMaxPlayTime(minutes) {
    this.settings.maxPlayTime = minutes;
    this.saveSettings();
    RQBOX.toast(`Max play time set to ${minutes} minutes`);
  },

  setAllowedCategories(categories) {
    this.settings.allowedCategories = categories;
    this.saveSettings();
  },

  checkPlayTime() {
    if (!this.enabled || this.settings.maxPlayTime === 0) return true;

    const now = Date.now();
    const sessionTime = now - (parseInt(localStorage.getItem('rqbbox-session-start') || now));
    const totalPlayTime = (this.settings.screenTime || 0) + Math.floor(sessionTime / 60000);

    if (totalPlayTime >= this.settings.maxPlayTime) {
      RQBOX.toast('Play time limit reached!');
      return false;
    }

    // Warning at 5 minutes remaining
    const remaining = this.settings.maxPlayTime - totalPlayTime;
    if (remaining <= 5 && remaining > 0) {
      RQBOX.toast(`Warning: ${remaining} minutes remaining`);
    }

    return true;
  },

  canPlayCategory(category) {
    if (!this.enabled) return true;
    if (this.settings.allowedCategories.includes('all')) return true;
    return this.settings.allowedCategories.includes(category);
  },

  verifyPin(pin) {
    return this.settings.pin === pin;
  },

  renderParentalPanel() {
    return `
      <div class="parental-panel">
        <div class="parental-header">
          <h3>🔒 Parental Controls</h3>
          <div class="toggle ${this.enabled ? 'on' : ''}" onclick="ParentalControls.toggleEnabled()"></div>
        </div>
        
        ${this.enabled ? `
          <div class="parental-settings">
            <div class="setting-row">
              <label>Max Play Time (minutes)</label>
              <input type="number" value="${this.settings.maxPlayTime}" 
                onchange="ParentalControls.setMaxPlayTime(parseInt(this.value) || 0)"
                placeholder="0 = unlimited">
            </div>
            
            <div class="setting-row">
              <label>Allowed Categories</label>
              <div class="category-list">
                ${['all', 'action', 'adventure', 'racing', 'rpg', 'shooter', 'sports', 'strategy'].map(cat => `
                  <label class="category-option">
                    <input type="checkbox" 
                      ${this.settings.allowedCategories.includes(cat) ? 'checked' : ''}
                      onchange="ParentalControls.toggleCategory('${cat}')">
                    ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </label>
                `).join('')}
              </div>
            </div>
            
            <div class="setting-row">
              <label>Require PIN for Settings</label>
              <div class="toggle ${this.settings.requirePin ? 'on' : ''}" 
                onclick="ParentalControls.togglePinRequirement()"></div>
            </div>
            
            <div class="setting-row">
              <label>Screen Time Today</label>
              <span>${this.settings.screenTime || 0} minutes</span>
            </div>
          </div>
        ` : `
          <div class="parental-disabled">
            <p>Parental Controls are disabled.</p>
            <p>Enable to set play time limits and content restrictions.</p>
          </div>
        `}
      </div>
    `;
  },

  toggleEnabled() {
    if (this.enabled) {
      RQBOX.openModal(`
        <h3>🔓 Disable Parental Controls</h3>
        <div class="modal-content">
          <input type="password" id="pin-input" placeholder="Enter PIN" class="pin-input">
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" onclick="RQBOX.closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="ParentalControls.verifyAndDisable()">Disable</button>
        </div>
      `);
    } else {
      RQBOX.openModal(`
        <h3>🔒 Enable Parental Controls</h3>
        <div class="modal-content">
          <input type="password" id="pin-input" placeholder="Set PIN" class="pin-input">
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" onclick="RQBOX.closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="ParentalControls.enableWithPin()">Enable</button>
        </div>
      `);
    }
  },

  enableWithPin() {
    const pin = document.getElementById('pin-input')?.value;
    if (pin) {
      this.enable(pin);
      RQBOX.closeModal();
    }
  },

  verifyAndDisable() {
    const pin = document.getElementById('pin-input')?.value;
    if (this.disable(pin)) {
      RQBOX.closeModal();
    }
  },

  toggleCategory(category) {
    if (category === 'all') {
      this.settings.allowedCategories = ['all'];
    } else {
      this.settings.allowedCategories = this.settings.allowedCategories.filter(c => c !== 'all');
      if (this.settings.allowedCategories.includes(category)) {
        this.settings.allowedCategories = this.settings.allowedCategories.filter(c => c !== category);
      } else {
        this.settings.allowedCategories.push(category);
      }
    }
    this.saveSettings();
  },

  togglePinRequirement() {
    this.settings.requirePin = !this.settings.requirePin;
    this.saveSettings();
  }
};
