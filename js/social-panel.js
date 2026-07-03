// RQBBOX MODE - Enhanced Social Panel
// Friends list with online status, parties, messages

const SocialPanel = {
  friends: [],
  parties: [],
  messages: [],

  init() {
    this.loadFriends();
  },

  async loadFriends() {
    try {
      const data = await API.get('/api/friends');
      this.friends = data?.friends || [];
    } catch {}
  },

  getOnlineFriends() {
    return this.friends.filter(f => f.online);
  },

  getOfflineFriends() {
    return this.friends.filter(f => !f.online);
  },

  renderFriendsPanel() {
    const online = this.getOnlineFriends();
    const offline = this.getOfflineFriends();

    return `
      <div class="social-panel-container">
        <div class="social-header">
          <h3>Friends</h3>
          <span class="friend-count">${online.length} Online</span>
        </div>
        
        ${online.length > 0 ? `
          <div class="friend-section">
            <div class="section-label">Online — ${online.length}</div>
            ${online.map(f => this.renderFriendCard(f, true)).join('')}
          </div>
        ` : ''}
        
        ${offline.length > 0 ? `
          <div class="friend-section">
            <div class="section-label">Offline — ${offline.length}</div>
            ${offline.map(f => this.renderFriendCard(f, false)).join('')}
          </div>
        ` : ''}
        
        <div class="social-actions">
          <button class="btn btn-primary" onclick="SocialPanel.showAddFriend()">+ Add Friend</button>
          <button class="btn btn-ghost" onclick="SocialPanel.showParty()">Start Party</button>
        </div>
      </div>
    `;
  },

  renderFriendCard(friend, online) {
    return `
      <div class="friend-card ${online ? 'online' : 'offline'}">
        <div class="friend-avatar">${friend.avatar || friend.name[0]}</div>
        <div class="friend-info">
          <div class="friend-name">${friend.name}</div>
          <div class="friend-status">${online ? '🟢 Online' : '⚫ Offline'}</div>
        </div>
        <div class="friend-actions">
          ${online ? `
            <button class="btn-icon" onclick="SocialPanel.sendMessage('${friend.id}')" title="Message">💬</button>
            <button class="btn-icon" onclick="SocialPanel.inviteToParty('${friend.id}')" title="Invite to Party">👥</button>
          ` : ''}
        </div>
      </div>
    `;
  },

  showAddFriend() {
    RQBOX.openModal(`
      <h3>Add Friend</h3>
      <div class="modal-content">
        <input type="text" id="friend-search" placeholder="Search by username..." class="search-input">
        <div id="friend-results"></div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="RQBOX.closeModal()">Cancel</button>
      </div>
    `);
  },

  showParty() {
    RQBOX.openModal(`
      <h3>Start Party</h3>
      <div class="modal-content">
        <p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:16px;">
          Create a party to chat and play with friends.
        </p>
        <div class="party-options">
          <button class="btn btn-primary" onclick="SocialPanel.createParty()">Create Party</button>
          <button class="btn btn-ghost" onclick="SocialPanel.joinParty()">Join Party</button>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="RQBOX.closeModal()">Close</button>
      </div>
    `);
  },

  createParty() {
    RQBOX.toast('Party created! Inviting online friends...');
    RQBOX.closeModal();
  },

  joinParty() {
    RQBOX.toast('Enter party code:');
    RQBOX.closeModal();
  },

  sendMessage(friendId) {
    RQBOX.toast('Messaging feature coming soon');
  },

  inviteToParty(friendId) {
    RQBOX.toast('Party invite sent!');
  }
};
