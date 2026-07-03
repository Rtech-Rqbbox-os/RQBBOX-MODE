const QuickResume = {
  sessions: [],
  maxSlots: 3,
  enabled: true,

  async init() {
    const cfg = RQBOX.state.config?.quickResume || {};
    this.maxSlots = cfg.maxSlots || 3;
    this.enabled = cfg.enabled !== false;

    await this.loadSessions();
    this.render();
  },

  async loadSessions() {
    const data = await API.get('/api/quick-resume');
    this.sessions = data?.sessions || [];
  },

  async saveSessions() {
    await API.post('/api/quick-resume', { sessions: this.sessions, action: 'sync' });
  },

  async suspend(id, title, icon, state) {
    if (!this.enabled) { RQBOX.toast('Quick Resume is disabled in settings'); return; }

    if (this.sessions.length >= this.maxSlots) {
      const oldest = this.sessions.reduce((a, b) => a.savedAt < b.savedAt ? a : b);
      this.sessions = this.sessions.filter(s => s.id !== oldest.id);
    }

    const session = {
      id: id + '-' + Date.now(),
      gameId: id,
      title,
      icon: icon || '🎮',
      state: state || {},
      savedAt: new Date().toISOString(),
    };

    this.sessions.push(session);
    await API.post('/api/quick-resume', { ...session, action: 'save' });
    this.render();
    RQBOX.toast(`⏸️ ${title} suspended — Quick Resume slot used`);
    Controller.vibrate(0.4, 80);
  },

  async resume(id) {
    const session = this.sessions.find(s => s.id === id);
    if (!session) { RQBOX.toast('Session not found'); return; }

    RQBOX.toast(`Resuming ${session.title}...`);
    GameLibrary.launch(session.gameId);

    this.sessions = this.sessions.filter(s => s.id !== id);
    await API.post('/api/quick-resume', { id, action: 'remove' });
    this.render();
  },

  async remove(id) {
    this.sessions = this.sessions.filter(s => s.id !== id);
    await API.post('/api/quick-resume', { id, action: 'remove' });
    this.render();
  },

  async clearAll() {
    if (!this.sessions.length) { RQBOX.toast('No suspended sessions'); return; }
    RQBOX.openModal(`
      <h3>Clear All Suspended Games?</h3>
      <p style="color:var(--text-secondary);font-size:0.8rem;margin:8px 0;">
        ${this.sessions.length} game(s) will be removed from Quick Resume.
      </p>
      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="RQBOX.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="QuickResume._doClearAll();RQBOX.closeModal()">Clear All</button>
      </div>
    `);
  },

  _doClearAll() {
    this.sessions = [];
    API.post('/api/quick-resume', { action: 'clear' });
    this.render();
    RQBOX.toast('Quick Resume cleared');
  },

  render() {
    const homeRow = RQBOX.id('quick-resume-row');
    const resumeGrid = RQBOX.id('resume-grid');

    if (homeRow) {
      homeRow.innerHTML = this.sessions.length
        ? this.sessions.map(s => {
            const iconContent = s.iconSvg 
              ? `<img src="${s.iconSvg}" alt="${s.title}" style="width:100%;height:100%;object-fit:cover;">` 
              : (s.icon || '🎮');
            return `
            <div class="card" onclick="QuickResume.resume('${s.id}')" style="width:160px;">
              <div class="card-art">${iconContent}</div>
              <div class="card-info">
                <div class="card-title">${s.title}</div>
                <div class="card-sub">⏸️ ${this._timeAgo(s.savedAt)}</div>
              </div>
            </div>
          `}).join('')
        : '<div class="empty-state">No suspended games. Press Guide button to suspend.</div>';
    }

    if (resumeGrid) {
      resumeGrid.innerHTML = this.sessions.length
        ? this.sessions.map(s => `
            <div class="resume-card">
              <div class="resume-icon">${s.icon}</div>
              <div class="resume-info">
                <div class="resume-title">${s.title}</div>
                <div class="resume-sub">Suspended ${this._timeAgo(s.savedAt)}</div>
              </div>
              <button class="resume-btn" onclick="QuickResume.resume('${s.id}')" title="Resume">▶️</button>
              <button class="resume-btn" onclick="QuickResume.remove('${s.id}')" title="Remove">✕</button>
            </div>
          `).join('')
        : '<div class="empty-state" style="grid-column:1/-1;">No suspended games. Play a game and it will appear here.</div>';
    }
  },

  _timeAgo(iso) {
    try {
      const diff = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'just now';
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      return `${Math.floor(hours / 24)}d ago`;
    } catch { return 'recently'; }
  },
};
