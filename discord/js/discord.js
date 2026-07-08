// Discord Integration - RQBBOX Experience OS 1.0

class DiscordIntegration {
  constructor() {
    this.currentUser = null;
    this.isLoggedIn = false;
    this.currentSection = 'home';
    this.voiceConnected = false;
    this.isStreaming = false;
    this.overlayVisible = false;
    this.settings = this.loadSettings();
    this.friends = [];
    this.messages = [];
    this.notifications = [];
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.checkAuth();
    this.loadFriends();
    this.startPresenceUpdate();
    this.setupKeyboardShortcuts();
    this.setupControllerShortcuts();
  }

  bindEvents() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const section = e.currentTarget.dataset.section;
        this.navigateTo(section);
      });
    });

    // Login
    document.getElementById('discord-login-btn').addEventListener('click', () => {
      this.initiateOAuthLogin();
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
      this.logout();
    });

    // Friends tabs
    document.querySelectorAll('.friends-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchFriendsTab(tab);
      });
    });

    // Voice controls
    document.getElementById('voice-mute-btn').addEventListener('click', () => {
      this.toggleMute();
    });

    document.getElementById('voice-deafen-btn').addEventListener('click', () => {
      this.toggleDeafen();
    });

    document.getElementById('voice-disconnect-btn').addEventListener('click', () => {
      this.disconnectVoice();
    });

    // Chat
    document.getElementById('send-btn').addEventListener('click', () => {
      this.sendMessage();
    });

    document.getElementById('message-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });

    // Streaming
    document.getElementById('go-live-btn').addEventListener('click', () => {
      this.toggleStreaming();
    });

    // Settings tabs
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchSettingsTab(tab);
      });
    });

    // Overlay
    document.getElementById('overlay-close-btn').addEventListener('click', () => {
      this.toggleOverlay(false);
    });

    // Notification toast
    document.getElementById('toast-close').addEventListener('click', () => {
      this.hideNotification();
    });

    // Settings changes
    this.bindSettingsEvents();
  }

  bindSettingsEvents() {
    // Auto-login
    document.getElementById('auto-login').addEventListener('change', (e) => {
      this.settings.autoLogin = e.target.checked;
      this.saveSettings();
    });

    // Overlay settings
    document.getElementById('enable-overlay').addEventListener('change', (e) => {
      this.settings.enableOverlay = e.target.checked;
      this.saveSettings();
    });

    document.getElementById('overlay-opacity').addEventListener('input', (e) => {
      this.settings.overlayOpacity = e.target.value;
      this.saveSettings();
      this.updateOverlayOpacity();
    });

    // Notification settings
    document.getElementById('notify-friend-online').addEventListener('change', (e) => {
      this.settings.notifyFriendOnline = e.target.checked;
      this.saveSettings();
    });

    document.getElementById('notify-messages').addEventListener('change', (e) => {
      this.settings.notifyMessages = e.target.checked;
      this.saveSettings();
    });
  }

  checkAuth() {
    const savedToken = localStorage.getItem('discord_token');
    const savedUser = localStorage.getItem('discord_user');
    
    if (savedToken && savedUser && this.settings.autoLogin) {
      this.currentUser = JSON.parse(savedUser);
      this.isLoggedIn = true;
      this.showMainInterface();
      this.updateUserProfile();
    }
  }

  initiateOAuthLogin() {
    // Discord OAuth2 configuration
    const clientId = 'YOUR_CLIENT_ID'; // Replace with actual Discord client ID
    const redirectUri = encodeURIComponent(window.location.href);
    const scope = encodeURIComponent('identify email connections guilds');
    const state = this.generateState();
    
    localStorage.setItem('discord_state', state);
    
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
    
    window.location.href = authUrl;
  }

  generateState() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  handleOAuthCallback(code, state) {
    const savedState = localStorage.getItem('discord_state');
    
    if (state !== savedState) {
      console.error('Invalid state parameter');
      return;
    }
    
    // Exchange code for token (this would be done via your backend)
    this.exchangeCodeForToken(code);
  }

  async exchangeCodeForToken(code) {
    // This would typically be done via your backend server
    // For demo purposes, we'll simulate a successful login
    const mockUser = {
      id: '123456789',
      username: 'RQBBOXUser',
      discriminator: '0000',
      avatar: 'default-avatar.svg',
      status: 'online'
    };
    
    this.currentUser = mockUser;
    this.isLoggedIn = true;
    
    localStorage.setItem('discord_token', 'mock_token');
    localStorage.setItem('discord_user', JSON.stringify(mockUser));
    
    this.showMainInterface();
    this.updateUserProfile();
  }

  logout() {
    this.currentUser = null;
    this.isLoggedIn = false;
    
    localStorage.removeItem('discord_token');
    localStorage.removeItem('discord_user');
    
    this.showLoginScreen();
  }

  showLoginScreen() {
    document.getElementById('login-screen').classList.add('active');
    document.getElementById('discord-main').classList.remove('active');
  }

  showMainInterface() {
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('discord-main').classList.add('active');
  }

  navigateTo(section) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.content-section').forEach(sec => {
      sec.classList.remove('active');
    });
    document.getElementById(`section-${section}`).classList.add('active');
    
    this.currentSection = section;
  }

  updateUserProfile() {
    if (!this.currentUser) return;
    
    document.getElementById('profile-avatar').src = this.currentUser.avatar;
    document.getElementById('profile-username').textContent = this.currentUser.username;
    document.getElementById('profile-discriminator').textContent = `#${this.currentUser.discriminator}`;
    
    document.getElementById('mini-avatar').src = this.currentUser.avatar;
    document.getElementById('mini-username').textContent = this.currentUser.username;
    
    document.getElementById('overlay-avatar').src = this.currentUser.avatar;
    document.getElementById('overlay-username').textContent = this.currentUser.username;
    
    this.updateStatus(this.currentUser.status);
  }

  updateStatus(status) {
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    
    statusDot.className = 'status-dot';
    
    switch (status) {
      case 'online':
        statusText.textContent = 'Online';
        break;
      case 'idle':
        statusDot.classList.add('idle');
        statusText.textContent = 'Idle';
        break;
      case 'dnd':
        statusDot.classList.add('dnd');
        statusText.textContent = 'Do Not Disturb';
        break;
      case 'invisible':
      case 'offline':
        statusDot.classList.add('offline');
        statusText.textContent = 'Offline';
        break;
    }
    
    document.getElementById('mini-status').textContent = statusText.textContent;
  }

  loadFriends() {
    // Load friends from local storage or API
    const savedFriends = localStorage.getItem('discord_friends');
    
    if (savedFriends) {
      this.friends = JSON.parse(savedFriends);
    } else {
      // Mock friends data
      this.friends = [
        { id: '1', username: 'GamerPro', discriminator: '1234', status: 'online', avatar: 'assets/default-avatar.svg' },
        { id: '2', username: 'NeonRider', discriminator: '5678', status: 'idle', avatar: 'assets/default-avatar.svg' },
        { id: '3', username: 'TechWizard', discriminator: '9012', status: 'dnd', avatar: 'assets/default-avatar.svg' }
      ];
    }
    
    this.updateFriendsList();
    this.updateFriendStats();
  }

  updateFriendsList(tab = 'online') {
    const friendsList = document.getElementById('friends-list');
    let filteredFriends = this.friends;
    
    switch (tab) {
      case 'online':
        filteredFriends = this.friends.filter(f => f.status === 'online');
        break;
      case 'all':
        filteredFriends = this.friends;
        break;
      case 'pending':
        filteredFriends = this.friends.filter(f => f.status === 'pending');
        break;
      case 'blocked':
        filteredFriends = this.friends.filter(f => f.status === 'blocked');
        break;
    }
    
    if (filteredFriends.length === 0) {
      friendsList.innerHTML = '<p class="empty-state">No friends found</p>';
      return;
    }
    
    friendsList.innerHTML = filteredFriends.map(friend => `
      <div class="friend-card" data-id="${friend.id}">
        <div class="friend-avatar-wrapper">
          <img src="${friend.avatar}" alt="${friend.username}" class="friend-avatar">
          <span class="status-dot ${friend.status}"></span>
        </div>
        <div class="friend-info">
          <span class="friend-name">${friend.username}#${friend.discriminator}</span>
          <span class="friend-status">${this.getStatusText(friend.status)}</span>
        </div>
        <div class="friend-actions">
          <button class="icon-btn" title="Message">💬</button>
          <button class="icon-btn" title="Voice Call">📞</button>
        </div>
      </div>
    `).join('');
    
    document.getElementById('stat-friends').textContent = this.friends.length;
  }

  getStatusText(status) {
    const statusMap = {
      'online': 'Online',
      'idle': 'Idle',
      'dnd': 'Do Not Disturb',
      'offline': 'Offline',
      'pending': 'Pending',
      'blocked': 'Blocked'
    };
    return statusMap[status] || 'Unknown';
  }

  updateFriendStats() {
    document.getElementById('stat-friends').textContent = this.friends.length;
    document.getElementById('stat-servers').textContent = '5';
    document.getElementById('stat-dms').textContent = '3';
  }

  switchFriendsTab(tab) {
    document.querySelectorAll('.friends-tabs .tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    this.updateFriendsList(tab);
  }

  toggleMute() {
    const btn = document.getElementById('voice-mute-btn');
    btn.classList.toggle('active');
    
    if (btn.classList.contains('active')) {
      this.showNotification('Microphone Muted', 'Your microphone is now muted');
    }
  }

  toggleDeafen() {
    const btn = document.getElementById('voice-deafen-btn');
    btn.classList.toggle('active');
    
    if (btn.classList.contains('active')) {
      this.showNotification('Audio Deafened', 'You can no longer hear audio');
    }
  }

  disconnectVoice() {
    this.voiceConnected = false;
    document.getElementById('voice-status-text').textContent = 'Not Connected';
    
    document.getElementById('voice-mute-btn').classList.remove('active');
    document.getElementById('voice-deafen-btn').classList.remove('active');
    
    this.showNotification('Disconnected', 'You have left the voice channel');
  }

  sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    const newMessage = {
      id: Date.now(),
      content: message,
      author: this.currentUser,
      timestamp: new Date().toISOString()
    };
    
    this.messages.push(newMessage);
    input.value = '';
    
    this.updateMessagesList();
  }

  updateMessagesList() {
    const container = document.getElementById('messages-container');
    
    if (this.messages.length === 0) {
      container.innerHTML = '<p class="empty-state">No messages yet</p>';
      return;
    }
    
    container.innerHTML = this.messages.map(msg => `
      <div class="message">
        <img src="${msg.author.avatar}" alt="${msg.author.username}" class="message-avatar">
        <div class="message-content">
          <span class="message-author">${msg.author.username}#${msg.author.discriminator}</span>
          <span class="message-text">${msg.content}</span>
          <span class="message-time">${this.formatTime(msg.timestamp)}</span>
        </div>
      </div>
    `).join('');
    
    container.scrollTop = container.scrollHeight;
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  toggleStreaming() {
    this.isStreaming = !this.isStreaming;
    
    const indicator = document.getElementById('stream-indicator');
    const statusText = document.getElementById('stream-status-text');
    const btn = document.getElementById('go-live-btn');
    
    if (this.isStreaming) {
      indicator.classList.add('live');
      indicator.classList.remove('offline');
      statusText.textContent = 'Live';
      btn.textContent = 'Stop Streaming';
      btn.classList.add('danger');
      
      this.showNotification('Stream Started', 'You are now live!');
    } else {
      indicator.classList.remove('live');
      indicator.classList.add('offline');
      statusText.textContent = 'Offline';
      btn.textContent = 'Go Live';
      btn.classList.remove('danger');
      
      this.showNotification('Stream Ended', 'Your stream has ended');
    }
  }

  startPresenceUpdate() {
    // Update rich presence every 5 seconds
    setInterval(() => {
      this.updateRichPresence();
    }, 5000);
  }

  updateRichPresence() {
    // Detect current game/activity
    const currentGame = this.detectCurrentGame();
    
    if (currentGame) {
      document.getElementById('presence-game').textContent = currentGame.name;
      document.getElementById('presence-details').textContent = currentGame.details;
      
      // Update play time
      const playTime = this.calculatePlayTime(currentGame.startTime);
      document.getElementById('presence-time').textContent = playTime;
    } else {
      document.getElementById('presence-game').textContent = 'No game detected';
      document.getElementById('presence-details').textContent = 'Start a game to show your activity';
      document.getElementById('presence-time').textContent = '00:00:00';
    }
  }

  detectCurrentGame() {
    // This would integrate with the RQBBOX game system
    // For demo, return mock data
    return {
      name: 'Neon Drift Racing',
      details: 'Racing through cyberpunk streets',
      startTime: new Date(Date.now() - 3600000) // 1 hour ago
    };
  }

  calculatePlayTime(startTime) {
    const now = Date.now();
    const diff = now - startTime;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  showNotification(title, body, avatar = null) {
    if (!this.settings.notifyMessages) return;
    
    const toast = document.getElementById('notification-toast');
    const toastTitle = document.getElementById('toast-title');
    const toastBody = document.getElementById('toast-body');
    const toastAvatar = document.getElementById('toast-avatar');
    
    toastTitle.textContent = title;
    toastBody.textContent = body;
    
    if (avatar) {
      toastAvatar.src = avatar;
    } else if (this.currentUser) {
      toastAvatar.src = this.currentUser.avatar;
    }
    
    toast.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
    
    // Add to notification history
    this.notifications.push({ title, body, timestamp: new Date().toISOString() });
    this.updateNotificationHistory();
  }

  hideNotification() {
    document.getElementById('notification-toast').classList.add('hidden');
  }

  updateNotificationHistory() {
    const list = document.getElementById('notification-list');
    
    if (this.notifications.length === 0) {
      list.innerHTML = '<p class="empty-state">No notifications</p>';
      return;
    }
    
    list.innerHTML = this.notifications.slice(-10).reverse().map(notif => `
      <div class="notification-item">
        <span class="notification-title">${notif.title}</span>
        <span class="notification-body">${notif.body}</span>
        <span class="notification-time">${this.formatTime(notif.timestamp)}</span>
      </div>
    `).join('');
  }

  switchSettingsTab(tab) {
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    document.querySelectorAll('.settings-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(`settings-${tab}`).classList.add('active');
  }

  toggleOverlay(show) {
    this.overlayVisible = show;
    
    const overlay = document.getElementById('game-overlay');
    
    if (show) {
      overlay.classList.remove('hidden');
      this.updateOverlayFriends();
      this.startPerformanceMonitor();
    } else {
      overlay.classList.add('hidden');
      this.stopPerformanceMonitor();
    }
  }

  updateOverlayFriends() {
    const list = document.getElementById('overlay-friends-list');
    const onlineFriends = this.friends.filter(f => f.status === 'online');
    
    if (onlineFriends.length === 0) {
      list.innerHTML = '<p class="empty-state">No friends online</p>';
      return;
    }
    
    list.innerHTML = onlineFriends.map(friend => `
      <div class="overlay-friend">
        <img src="${friend.avatar}" alt="${friend.username}" class="overlay-friend-avatar">
        <span class="overlay-friend-name">${friend.username}</span>
      </div>
    `).join('');
  }

  updateOverlayOpacity() {
    const overlay = document.getElementById('game-overlay');
    overlay.style.background = `rgba(6, 8, 15, ${this.settings.overlayOpacity / 100})`;
  }

  startPerformanceMonitor() {
    this.performanceInterval = setInterval(() => {
      this.updatePerformanceStats();
    }, 1000);
  }

  stopPerformanceMonitor() {
    if (this.performanceInterval) {
      clearInterval(this.performanceInterval);
    }
  }

  updatePerformanceStats() {
    // Mock performance data
    const fps = Math.floor(55 + Math.random() * 10);
    const cpu = Math.floor(20 + Math.random() * 30);
    const memory = Math.floor(500 + Math.random() * 200);
    
    document.getElementById('overlay-fps').textContent = fps;
    document.getElementById('overlay-cpu').textContent = `${cpu}%`;
    document.getElementById('overlay-memory').textContent = `${memory} MB`;
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Toggle overlay: Shift + `
      if (e.shiftKey && e.key === '`') {
        e.preventDefault();
        this.toggleOverlay(!this.overlayVisible);
      }
      
      // Mute: Ctrl + M
      if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        this.toggleMute();
      }
      
      // Deafen: Ctrl + D
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        this.toggleDeafen();
      }
      
      // Go Live: Ctrl + G
      if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        this.toggleStreaming();
      }
    });
  }

  setupControllerShortcuts() {
    // This would integrate with the RQBBOX controller system
    // For demo, we'll add placeholder functionality
    console.log('Controller shortcuts initialized');
  }

  loadSettings() {
    const savedSettings = localStorage.getItem('discord_settings');
    
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    
    return {
      autoLogin: true,
      enableOverlay: true,
      overlayOpacity: 80,
      notifyFriendOnline: true,
      notifyMessages: true,
      notifyVoice: true,
      notifyServer: true,
      notifyOverlay: true,
      showPresence: true,
      showDetails: true,
      showTime: true,
      showAchievements: true
    };
  }

  saveSettings() {
    localStorage.setItem('discord_settings', JSON.stringify(this.settings));
  }

  applySettings() {
    document.getElementById('auto-login').checked = this.settings.autoLogin;
    document.getElementById('enable-overlay').checked = this.settings.enableOverlay;
    document.getElementById('overlay-opacity').value = this.settings.overlayOpacity;
    document.getElementById('notify-friend-online').checked = this.settings.notifyFriendOnline;
    document.getElementById('notify-messages').checked = this.settings.notifyMessages;
    
    this.updateOverlayOpacity();
  }
}

// Initialize Discord Integration when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.discordIntegration = new DiscordIntegration();
});

// Handle OAuth callback if present
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const state = urlParams.get('state');

if (code && state && window.discordIntegration) {
  window.discordIntegration.handleOAuthCallback(code, state);
  // Clean up URL
  window.history.replaceState({}, document.title, window.location.pathname);
}
