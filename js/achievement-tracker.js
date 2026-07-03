// RQBBOX MODE - Achievement Tracking
// Track and display achievements with popups

const AchievementTracker = {
  achievements: [],
  recentUnlocks: [],

  init() {
    this.loadAchievements();
  },

  async loadAchievements() {
    try {
      const data = await API.get('/api/achievements');
      this.achievements = data?.data || [];
    } catch {}
  },

  unlock(achievementId) {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return;

    // Mark as unlocked
    achievement.unlocked = true;
    achievement.unlockedAt = new Date().toISOString();

    // Add to recent unlocks
    this.recentUnlocks.unshift(achievement);
    if (this.recentUnlocks.length > 5) {
      this.recentUnlocks.pop();
    }

    // Show popup
    this.showUnlockPopup(achievement);

    // Save to server
    API.post('/api/achievements/unlock', {
      id: achievementId,
      token: RQBOX.state.user?.token
    });

    // Vibrate controller
    Controller.vibrate(0.8, 200);
  },

  showUnlockPopup(achievement) {
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
      <div class="achievement-icon">${achievement.icon || '🏆'}</div>
      <div class="achievement-info">
        <div class="achievement-label">Achievement Unlocked!</div>
        <div class="achievement-title">${achievement.title}</div>
        <div class="achievement-desc">${achievement.description || ''}</div>
      </div>
    `;

    document.body.appendChild(popup);

    // Animate in
    setTimeout(() => popup.classList.add('show'), 100);

    // Remove after 4 seconds
    setTimeout(() => {
      popup.classList.remove('show');
      setTimeout(() => popup.remove(), 300);
    }, 4000);
  },

  renderAchievementList() {
    return `
      <div class="achievement-list">
        <div class="achievement-header">
          <h3>Achievements</h3>
          <span class="achievement-count">${this.getUnlockedCount()} / ${this.achievements.length}</span>
        </div>
        <div class="achievement-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${this.getProgressPercent()}%"></div>
          </div>
        </div>
        <div class="achievement-grid">
          ${this.achievements.map(a => `
            <div class="achievement-card ${a.unlocked ? 'unlocked' : 'locked'}">
              <div class="achievement-icon">${a.unlocked ? (a.icon || '🏆') : '🔒'}</div>
              <div class="achievement-title">${a.title}</div>
              <div class="achievement-desc">${a.description || ''}</div>
              ${a.unlocked ? `<div class="achievement-date">${this.formatDate(a.unlockedAt)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  getUnlockedCount() {
    return this.achievements.filter(a => a.unlocked).length;
  },

  getProgressPercent() {
    if (this.achievements.length === 0) return 0;
    return Math.round((this.getUnlockedCount() / this.achievements.length) * 100);
  },

  formatDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString();
  }
};
