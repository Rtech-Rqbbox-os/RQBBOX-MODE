const Achievements = {
  list: [],
  unlocked: [],

  init() {
    this.load();
  },

  async load() {
    const data = await API.get('/api/achievements');
    this.unlocked = data?.data || [];
    this.list = this._defaultList();
  },

  _defaultList() {
    return [
      { id: 'first-game', title: 'First Game', desc: 'Launch your first game', icon: '🎮', rarity: 'common' },
      { id: 'first-achievement', title: 'Achievement Unlocked', desc: 'Earn your first achievement', icon: '🏆', rarity: 'common' },
      { id: 'quick-resume', title: 'Quick Thinker', desc: 'Use Quick Resume for the first time', icon: '⏸️', rarity: 'uncommon' },
      { id: 'screenshot', title: 'Photographer', desc: 'Take your first screenshot', icon: '📷', rarity: 'common' },
      { id: 'gaming-hours', title: 'Dedicated Player', desc: 'Log 10 hours of play time', icon: '⏰', rarity: 'uncommon' },
      { id: 'friend-request', title: 'Social Butterfly', desc: 'Send your first friend request', icon: '👥', rarity: 'uncommon' },
      { id: 'library-5', title: 'Collector', desc: 'Have 5 games in your library', icon: '📚', rarity: 'rare' },
      { id: 'perf-mode', title: 'Optimizer', desc: 'Enable Performance Mode', icon: '⚡', rarity: 'common' },
      { id: 'theme-changer', title: 'Stylist', desc: 'Change your theme', icon: '🎨', rarity: 'common' },
      { id: 'capture-5', title: 'Documentarian', desc: 'Take 5 screenshots', icon: '📸', rarity: 'uncommon' },
      { id: 'resume-3', title: 'Multitasker', desc: 'Use Quick Resume 3 times', icon: '🔄', rarity: 'rare' },
      { id: 'all-games', title: 'Completionist', desc: 'Try every game', icon: '💎', rarity: 'epic' },
    ];
  },

  isUnlocked(id) {
    return this.unlocked.some(a => a.id === id);
  },

  isNew(id) {
    const a = this.unlocked.find(u => u.id === id);
    return a && !a._seen;
  },

  markSeen(id) {
    const a = this.unlocked.find(u => u.id === id);
    if (a) a._seen = true;
  },

  getProgress() {
    const total = this.list.length;
    const unlocked = this.unlocked.length;
    return { total, unlocked, pct: total ? Math.round((unlocked / total) * 100) : 0 };
  },

  async unlock(id) {
    if (this.isUnlocked(id)) return;
    const def = this.list.find(a => a.id === id);
    if (!def) return;

    this.unlocked.push({ ...def, unlockedAt: new Date().toISOString(), _seen: false });
    await API.post('/api/achievements/unlock', { id: def.id, title: def.title, icon: def.icon, token: RQBOX.state.user?.token });

    RQBOX.openModal(`
      <div style="text-align:center;">
        <div style="font-size:3rem;margin-bottom:8px;">${def.icon}</div>
        <h3 style="margin-bottom:4px;">Achievement Unlocked!</h3>
        <h4 style="font-weight:500;color:var(--accent);margin-bottom:4px;">${def.title}</h4>
        <p style="font-size:0.8rem;color:var(--text-secondary);">${def.desc}</p>
      </div>
    `);

    Controller.vibrate(0.8, 200);
    Notifications.add('Achievement Unlocked', def.title, def.icon);

    setTimeout(() => RQBOX.closeModal(), 3000);
  },

  renderList() {
    const progress = this.getProgress();
    return `
      <div style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:6px;">
          <span>Progress</span>
          <span>${progress.unlocked}/${progress.total}</span>
        </div>
        <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;">
          <div style="height:100%;width:${progress.pct}%;background:var(--accent);border-radius:2px;transition:width 0.3s;"></div>
        </div>
      </div>
      ${this.list.map(a => {
        const unlocked = this.isUnlocked(a.id);
        return `
          <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.03);${unlocked ? '' : 'opacity:0.5;'}">
            <span style="font-size:1.5rem;">${unlocked ? a.icon : '🔒'}</span>
            <div style="flex:1;">
              <div style="font-size:0.82rem;font-weight:500;">${a.title}</div>
              <div style="font-size:0.7rem;color:var(--text-muted);">${a.desc}</div>
            </div>
            <span style="font-size:0.6rem;color:var(--text-muted);text-transform:capitalize;">${a.rarity}</span>
          </div>
        `;
      }).join('')}
    `;
  },
};
