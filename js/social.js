const Social = {
  friends: [],
  requests: [],
  users: [],

  async init() {
    await this.load();
    this.render();
  },

  async load() {
    const data = await API.get('/api/friends?userId=' + (RQBOX.state.user?.id || ''));
    this.friends = data?.friends || [];
    this.requests = data?.requests || [];

    const userData = await API.get('/api/profiles');
    const profiles = userData?.data?.users || [];
    this.users = profiles.map(u => ({ id: u.id, name: u.name, avatar: u.avatar || u.name[0], online: !!u.token }));
  },

  render() {
    const list = RQBOX.id('friends-list');
    const activity = RQBOX.id('activity-feed');
    const statFriends = RQBOX.id('stat-friends');

    if (statFriends) statFriends.textContent = this.friends.length;

    if (list) {
      if (this.friends.length) {
        list.innerHTML = this.friends.map(f => `
          <div class="friend-card">
            <div class="friend-avatar">${f.avatar || '?'}</div>
            <div class="friend-info">
              <div class="friend-name">${f.name}</div>
              <div class="friend-status ${f.online ? 'online' : ''}">${f.online ? '🟢 Online' : '⚫ Offline'}</div>
            </div>
            <button class="friend-action" onclick="Social.message('${f.id}')">💬</button>
            <button class="friend-action" onclick="Social.removeFriend('${f.id}')">✕</button>
          </div>
        `).join('');
      } else {
        list.innerHTML = '<div class="empty-state">No friends yet. Add some!</div>';
      }

      if (this.requests.length) {
        list.innerHTML += '<h4 style="margin:16px 0 8px;font-size:0.85rem;">Friend Requests</h4>';
        list.innerHTML += this.requests.map(r => `
          <div class="friend-card">
            <div class="friend-avatar">${r.avatar || '?'}</div>
            <div class="friend-info">
              <div class="friend-name">${r.name}</div>
              <div class="friend-status">Wants to be friends</div>
            </div>
            <button class="friend-action" onclick="Social.acceptRequest('${r.from}')">✅</button>
            <button class="friend-action" onclick="Social.rejectRequest('${r.from}')">✕</button>
          </div>
        `).join('');
      }
    }

    if (activity) {
      if (this.friends.length) {
        activity.innerHTML = this.friends.filter(f => f.online).map(f => `
          <div style="padding:6px 0;font-size:0.75rem;color:var(--text-secondary);">
            <span style="color:#4ade80;">🟢</span> ${f.name} is online
          </div>
        `).join('') || '<p class="muted">No friends online</p>';
      } else {
        activity.innerHTML = '<p class="muted">No recent activity</p>';
      }
    }
  },

  async searchUsers(query) {
    const results = this.users.filter(u =>
      u.name.toLowerCase().includes(query.toLowerCase()) &&
      u.id !== RQBOX.state.user?.id
    );
    RQBOX.openModal(`
      <h3>➕ Add Friend</h3>
      ${results.length
        ? results.map(u => `
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-subtle);">
            <div class="friend-avatar" style="width:32px;height:32px;font-size:0.7rem;">${u.avatar || '?'}</div>
            <div style="flex:1;font-size:0.8rem;">${u.name}</div>
            <button class="btn btn-sm btn-primary" onclick="Social.sendRequest('${u.id}')">+ Add</button>
          </div>
        `).join('')
        : '<p style="color:var(--text-muted);font-size:0.8rem;">No users found</p>'
      }
    `);
  },

  async sendRequest(userId) {
    await API.post('/api/friends', { action: 'add', friendId: userId, userId: RQBOX.state.user?.id });
    RQBOX.toast('Friend request sent!');
    RQBOX.closeModal();
    Achievements.unlock('friend-request');
  },

  async acceptRequest(fromId) {
    await API.post('/api/friends', { action: 'accept', fromId, userId: RQBOX.state.user?.id });
    await this.load();
    this.render();
    RQBOX.toast('Friend added!');
  },

  async rejectRequest(fromId) {
    await API.post('/api/friends', { action: 'reject', fromId, userId: RQBOX.state.user?.id });
    await this.load();
    this.render();
  },

  async removeFriend(friendId) {
    await API.post('/api/friends', { action: 'remove', friendId, userId: RQBOX.state.user?.id });
    await this.load();
    this.render();
    RQBOX.toast('Friend removed');
  },

  message(friendId) {
    const friend = this.friends.find(f => f.id === friendId);
    RQBOX.toast(`Messaging ${friend?.name || 'friend'} — coming soon`);
  },
};
