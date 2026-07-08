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
    const loginBtn = document.getElementById('discord-login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        this.initiateOAuthLogin();
      });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.logout();
      });
    }

    // Friends tabs
    document.querySelectorAll('.friends-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchFriendsTab(tab);
      });
    });

    // Voice controls
    const voiceMuteBtn = document.getElementById('voice-mute-btn');
    if (voiceMuteBtn) {
      voiceMuteBtn.addEventListener('click', () => {
        this.toggleMute();
      });
    }

    const voiceDeafenBtn = document.getElementById('voice-deafen-btn');
    if (voiceDeafenBtn) {
      voiceDeafenBtn.addEventListener('click', () => {
        this.toggleDeafen();
      });
    }

    const voiceDisconnectBtn = document.getElementById('voice-disconnect-btn');
    if (voiceDisconnectBtn) {
      voiceDisconnectBtn.addEventListener('click', () => {
        this.disconnectVoice();
      });
    }

    // Chat
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        this.sendMessage();
      });
    }

    const messageInput = document.getElementById('message-input');
    if (messageInput) {
      messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
    }

    // Streaming
    const goLiveBtn = document.getElementById('go-live-btn');
    if (goLiveBtn) {
      goLiveBtn.addEventListener('click', () => {
        this.toggleStreaming();
      });
    }

    // Settings tabs
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchSettingsTab(tab);
      });
    });

    // Overlay
    const overlayCloseBtn = document.getElementById('overlay-close-btn');
    if (overlayCloseBtn) {
      overlayCloseBtn.addEventListener('click', () => {
        this.toggleOverlay(false);
      });
    }

    // Notification toast
    const toastClose = document.getElementById('toast-close');
    if (toastClose) {
      toastClose.addEventListener('click', () => {
        this.hideNotification();
      });
    }

    // Settings changes
    this.bindSettingsEvents();
  }

  bindSettingsEvents() {
    // Auto-login
    const autoLogin = document.getElementById('auto-login');
    if (autoLogin) {
      autoLogin.addEventListener('change', (e) => {
        this.settings.autoLogin = e.target.checked;
        this.saveSettings();
      });
    }

    // Overlay settings
    const enableOverlay = document.getElementById('enable-overlay');
    if (enableOverlay) {
      enableOverlay.addEventListener('change', (e) => {
        this.settings.enableOverlay = e.target.checked;
        this.saveSettings();
      });
    }

    const overlayOpacity = document.getElementById('overlay-opacity');
    if (overlayOpacity) {
      overlayOpacity.addEventListener('input', (e) => {
        this.settings.overlayOpacity = e.target.value;
        this.saveSettings();
        this.updateOverlayOpacity();
      });
    }

    // Notification settings
    const notifyFriendOnline = document.getElementById('notify-friend-online');
    if (notifyFriendOnline) {
      notifyFriendOnline.addEventListener('change', (e) => {
        this.settings.notifyFriendOnline = e.target.checked;
        this.saveSettings();
      });
    }

    const notifyMessages = document.getElementById('notify-messages');
    if (notifyMessages) {
      notifyMessages.addEventListener('change', (e) => {
        this.settings.notifyMessages = e.target.checked;
        this.saveSettings();
      });
    }
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
    // Gamepad API support
    this.controllerIndex = null;
    this.controllerPolling = null;
    
    window.addEventListener('gamepadconnected', (e) => {
      this.controllerIndex = e.gamepad.index;
      console.log('Gamepad connected:', e.gamepad.id);
      this.startControllerPolling();
    });
    
    window.addEventListener('gamepaddisconnected', (e) => {
      if (this.controllerIndex === e.gamepad.index) {
        this.controllerIndex = null;
        this.stopControllerPolling();
        console.log('Gamepad disconnected');
      }
    });
    
    // Check for already connected gamepads
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        this.controllerIndex = i;
        this.startControllerPolling();
        break;
      }
    }
  }

  startControllerPolling() {
    if (this.controllerPolling) return;
    
    this.controllerPolling = setInterval(() => {
      this.pollController();
    }, 16); // ~60fps
  }

  stopControllerPolling() {
    if (this.controllerPolling) {
      clearInterval(this.controllerPolling);
      this.controllerPolling = null;
    }
  }

  pollController() {
    const gamepad = navigator.getGamepads()[this.controllerIndex];
    if (!gamepad) return;
    
    // Track button states to detect presses
    if (!this.buttonStates) {
      this.buttonStates = new Array(gamepad.buttons.length).fill(false);
    }
    
    // Check each button
    for (let i = 0; i < gamepad.buttons.length; i++) {
      const pressed = gamepad.buttons[i].pressed;
      
      // Button just pressed
      if (pressed && !this.buttonStates[i]) {
        this.handleControllerButton(i, gamepad);
      }
      
      this.buttonStates[i] = pressed;
    }
    
    // Handle D-pad and sticks for navigation
    this.handleControllerAxes(gamepad);
  }

  handleControllerButton(buttonIndex, gamepad) {
    // Common button mappings
    const BUTTONS = {
      0: 'A',      // Cross
      1: 'B',      // Circle
      2: 'X',      // Square
      3: 'Y',      // Triangle
      4: 'LB',     // Left Bumper
      5: 'RB',     // Right Bumper
      6: 'LT',     // Left Trigger
      7: 'RT',     // Right Trigger
      8: 'SELECT', // Select/Back
      9: 'START',  // Start/Menu
      10: 'L3',    // Left Stick Click
      11: 'R3',    // Right Stick Click
      12: 'UP',    // D-Pad Up
      13: 'DOWN',  // D-Pad Down
      14: 'LEFT',  // D-Pad Left
      15: 'RIGHT'  // D-Pad Right
    };
    
    const button = BUTTONS[buttonIndex];
    
    switch (button) {
      case 'A':
        // Confirm/Select
        this.handleControllerConfirm();
        break;
      case 'B':
        // Back/Cancel
        this.handleControllerBack();
        break;
      case 'Y':
        // Toggle overlay
        this.toggleOverlay(!this.overlayVisible);
        break;
      case 'START':
        // Open settings
        this.navigateTo('settings');
        break;
      case 'SELECT':
        // Navigate to home
        this.navigateTo('home');
        break;
      case 'LB':
        // Navigate left in sections
        this.navigateSection(-1);
        break;
      case 'RB':
        // Navigate right in sections
        this.navigateSection(1);
        break;
      case 'UP':
        // Navigate up in lists
        this.navigateList(-1);
        break;
      case 'DOWN':
        // Navigate down in lists
        this.navigateList(1);
        break;
    }
  }

  handleControllerAxes(gamepad) {
    const deadzone = 0.3;
    const leftStickX = gamepad.axes[0];
    const leftStickY = gamepad.axes[1];
    const rightStickX = gamepad.axes[2];
    const rightStickY = gamepad.axes[3];
    
    // Left stick horizontal - section navigation
    if (Math.abs(leftStickX) > deadzone) {
      if (leftStickX > deadzone && !this.stickLeftX) {
        this.navigateSection(1);
        this.stickLeftX = true;
      } else if (leftStickX < -deadzone && !this.stickLeftX) {
        this.navigateSection(-1);
        this.stickLeftX = true;
      }
    } else {
      this.stickLeftX = false;
    }
    
    // Left stick vertical - list navigation
    if (Math.abs(leftStickY) > deadzone) {
      if (leftStickY > deadzone && !this.stickLeftY) {
        this.navigateList(1);
        this.stickLeftY = true;
      } else if (leftStickY < -deadzone && !this.stickLeftY) {
        this.navigateList(-1);
        this.stickLeftY = true;
      }
    } else {
      this.stickLeftY = false;
    }
    
    // Right stick vertical - scroll content
    if (Math.abs(rightStickY) > deadzone) {
      this.scrollContent(-rightStickY * 20);
    }
  }

  handleControllerConfirm() {
    // Based on current section, perform appropriate action
    const activeSection = document.querySelector('.content-section.active');
    if (!activeSection) return;
    
    // If in navigation, select current item
    const focusedItem = document.querySelector('[data-focused="true"]');
    if (focusedItem) {
      focusedItem.click();
    }
  }

  handleControllerBack() {
    // Go back to previous section or close overlay
    if (this.overlayVisible) {
      this.toggleOverlay(false);
    } else {
      this.navigateTo('home');
    }
  }

  navigateSection(direction) {
    const sections = ['home', 'friends', 'voice', 'chat', 'streaming', 'rich-presence', 'notifications', 'settings'];
    const currentIndex = sections.indexOf(this.currentSection);
    const newIndex = (currentIndex + direction + sections.length) % sections.length;
    this.navigateTo(sections[newIndex]);
  }

  navigateList(direction) {
    const activeSection = document.querySelector('.content-section.active');
    if (!activeSection) return;
    
    // Find focusable items in current section
    const focusableItems = activeSection.querySelectorAll('button, .friend-card, .message');
    if (focusableItems.length === 0) return;
    
    // Find currently focused item
    let currentIndex = -1;
    focusableItems.forEach((item, index) => {
      if (item.dataset.focused === 'true') {
        currentIndex = index;
      }
    });
    
    // Calculate new index
    const newIndex = (currentIndex + direction + focusableItems.length) % focusableItems.length;
    
    // Update focus
    focusableItems.forEach((item, index) => {
      item.dataset.focused = index === newIndex ? 'true' : 'false';
      if (index === newIndex) {
        item.style.outline = '2px solid var(--accent)';
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        item.style.outline = 'none';
      }
    });
  }

  scrollContent(amount) {
    const activeSection = document.querySelector('.content-section.active');
    if (!activeSection) return;
    
    activeSection.scrollTop += amount;
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
