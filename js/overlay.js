const GuideOverlay = {
  init() {
    RQBOX.id('guide-close')?.addEventListener('click', () => { RQBOX.id('guide-overlay').style.display = 'none'; });
    RQBOX.id('guide-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) e.currentTarget.style.display = 'none';
    });
  },

  show(section) {
    const overlay = RQBOX.id('guide-overlay');
    const body = RQBOX.id('guide-body');
    if (!overlay || !body) return;

    const sections = {
      home: '<h4 style="margin-bottom:8px;">🏠 Home</h4><p style="color:var(--text-secondary);font-size:0.8rem;">Your gaming hub. Recent games, Quick Resume, and recommendations.</p>',
      games: '<h4 style="margin-bottom:8px;">🎮 Games</h4><p style="color:var(--text-secondary);font-size:0.8rem;">Your full game library. Filter by installed, recent, or favorites.</p>',
      resume: '<h4 style="margin-bottom:8px;">⏸️ Quick Resume</h4><p style="color:var(--text-secondary);font-size:0.8rem;">Suspend games and resume instantly. Like Xbox Quick Resume.</p>',
      captures: '<h4 style="margin-bottom:8px;">📷 Captures</h4><p style="color:var(--text-secondary);font-size:0.8rem;">Screenshots and game clips.</p>',
      store: '<h4 style="margin-bottom:8px;">🛒 Store</h4><p style="color:var(--text-secondary);font-size:0.8rem;">Browse and discover new games.</p>',
      friends: '<h4 style="margin-bottom:8px;">👥 Friends</h4><p style="color:var(--text-secondary);font-size:0.8rem;">See who\'s online, send friend requests, and view activity.</p>',
      settings: '<h4 style="margin-bottom:8px;">⚙️ Settings</h4><p style="color:var(--text-secondary);font-size:0.8rem;">Configure RQBBOX Experience OS 1.0 to your preferences.</p>',
    };

    body.innerHTML = sections[section] || sections.home;
    overlay.style.display = 'flex';
  },
};

const Notifications = {
  items: [],
  unread: 0,

  init() {
    RQBOX.id('status-notif')?.addEventListener('click', () => this.togglePanel());
  },

  add(title, message, icon = '🔔') {
    const id = Date.now();
    this.items.unshift({ id, title, message, icon, time: 'Just now', read: false });
    this.unread++;
    this.updateBadge();
    RQBOX.toast(`${icon} ${title}`);

    if (this.unread === 1) {
      RQBOX.id('status-notif')?.classList.add('active');
    }
  },

  markRead(id) {
    const item = this.items.find(n => n.id === id);
    if (item && !item.read) { item.read = true; this.unread--; }
    this.updateBadge();
  },

  markAllRead() {
    this.items.forEach(n => n.read = true);
    this.unread = 0;
    this.updateBadge();
  },

  updateBadge() {
    const el = RQBOX.id('status-notif');
    if (!el) return;
    if (this.unread > 0) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  },

  togglePanel() {
    RQBOX.openModal(`<h3>🔔 Notifications</h3>
      ${this.items.length
        ? this.items.slice(0, 10).map(n => `
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-subtle);${n.read ? 'opacity:0.6;' : ''}">
            <span>${n.icon}</span>
            <div style="flex:1;">
              <div style="font-size:0.8rem;">${n.title}</div>
              <div style="font-size:0.65rem;color:var(--text-muted);">${n.message}</div>
            </div>
            <span style="font-size:0.6rem;color:var(--text-muted);">${n.time}</span>
          </div>
        `).join('')
        : '<p style="color:var(--text-muted);font-size:0.8rem;padding:16px 0;">No notifications</p>'}
      ${this.unread ? '<button class="btn btn-sm btn-ghost" onclick="Notifications.markAllRead();RQBOX.toast(\'All marked read\')">Mark all read</button>' : ''}
    `);
  },
};
