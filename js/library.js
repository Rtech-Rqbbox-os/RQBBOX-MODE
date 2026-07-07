const GameLibrary = {
  games: [],
  apps: [],
  installed: { games: [], apps: [] },
  favorites: [],
  filter: 'all',
  systemGames: [],

  async init() {
    await this.loadCatalog();
    await this.loadInstalled();
    await this.scanSystemGames();
    this.renderHome();
    this.renderGames();
    this.bindFilters();
  },

  async loadCatalog() {
    const data = await API.get('/api/games');
    this.games = data?.data || [];
    const appData = await API.get('/api/apps');
    this.apps = appData?.data || [];
  },

  async loadInstalled() {
    const profiles = await API.get('/api/profiles');
    const user = profiles?.data?.users?.[0];
    if (user?.installed) this.installed = user.installed;
    if (user?.favorites) this.favorites = user.favorites;
  },

  async scanSystemGames() {
    try {
      const data = await API.get('/api/games/scan');
      this.systemGames = data?.games || [];
      // Merge system games with catalog
      this.systemGames.forEach(sg => {
        if (!this.games.find(g => g.id === sg.id)) {
          this.games.push({
            ...sg,
            category: 'Installed',
            price: 'Owned',
            type: 'local'
          });
        }
      });
    } catch {}
  },

  isInstalled(id) {
    return this.installed.games.includes(id) || this.installed.apps.includes(id);
  },

  isFavorite(id) {
    return this.favorites.includes(id);
  },

  getGame(id) {
    return this.games.find(g => g.id === id);
  },

  getRecent() {
    return this.games.slice(0, 8);
  },

  getFiltered(filter) {
    switch (filter) {
      case 'installed': return this.games.filter(g => this.isInstalled(g.id));
      case 'recent': return this.getRecent();
      case 'favorites': return this.games.filter(g => this.isFavorite(g.id));
      default: return this.games;
    }
  },

  renderCard(game) {
    const iconContent = game.iconSvg 
      ? `<img src="${game.iconSvg}" alt="${game.title}" style="width:100%;height:100%;object-fit:cover;">` 
      : (game.icon || '🎮');
    return `
      <div class="card" data-id="${game.id}" onclick="GameLibrary.launch('${game.id}')">
        <div class="card-art">${iconContent}</div>
        <div class="card-info">
          <div class="card-title">${game.title}</div>
          <div class="card-sub">${game.category || 'Game'} ${this.isInstalled(game.id) ? '• Installed' : ''}</div>
        </div>
      </div>
    `;
  },

  renderHome() {
    const recentRow = RQBOX.id('recent-games-row');
    const recRow = RQBOX.id('recommended-row');
    const statGames = RQBOX.id('stat-games');
    const statAch = RQBOX.id('stat-achievements');
    const statFriends = RQBOX.id('stat-friends');
    const statPlaytime = RQBOX.id('stat-playtime');

    if (statGames) statGames.textContent = this.games.length;

    if (recentRow) {
      const games = this.getRecent();
      recentRow.innerHTML = games.length
        ? games.map(g => this.renderCard(g)).join('')
        : '<div class="empty-state">No games yet. Check the Store!</div>';
    }

    if (recRow) {
      const shuffled = [...this.games].sort(() => Math.random() - 0.5).slice(0, 6);
      recRow.innerHTML = shuffled.length
        ? shuffled.map(g => this.renderCard(g)).join('')
        : '<div class="empty-state">Store coming soon!</div>';
    }

    const profiles = RQBOX.state.profiles;
    if (statAch) {
      const achievements = profiles?.users?.[0]?.achievements || [];
      statAch.textContent = achievements.length;
    }
    if (statFriends) {
      const friends = profiles?.users?.[0]?.friends || [];
      statFriends.textContent = friends.length;
    }
  },

  renderGames() {
    const grid = RQBOX.id('games-grid');
    if (!grid) return;
    const games = this.getFiltered(this.filter);
    grid.innerHTML = games.length
      ? games.map(g => this.renderCard(g)).join('')
      : '<div class="empty-state" style="grid-column:1/-1;">No games found</div>';
  },

  async launch(id) {
    const game = this.getGame(id);
    if (!game) { RQBOX.toast('Game not found'); return; }

    RQBOX.toast(`Launching ${game.title}...`);

    // Use local path or play API
    const url = game.localPath ? (game.localPath.startsWith('http') ? game.localPath : window.location.origin + game.localPath) : '';
    if (url) {
      Runtime.launch(url, game.title);
    } else {
      const res = await API.post('/api/launch', { id, token: RQBOX.state.user?.token });
      Runtime.launchWeb(res?.launchUrl || '', game.title);
    }

    // Track launch
    API.post('/api/launch', { id, token: RQBOX.state.user?.token }).catch(() => {});

    Achievements.unlock('first-game');
    if (this.installed.games.length >= 5) Achievements.unlock('library-5');
    Controller.vibrate(0.5, 100);
  },

  setFilter(filter) {
    this.filter = filter;
    RQBOX.$$('#games-filter-bar .filter-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.filter === filter);
    });
    this.renderGames();
  },

  bindFilters() {
    const bar = RQBOX.id('games-filter-bar');
    if (!bar) return;
    RQBOX.$$('#games-filter-bar .filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        RQBOX.$$('#games-filter-bar .filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.filter = pill.dataset.filter;
        this.renderGames();
      });
    });
  },

  async refresh() {
    await this.loadCatalog();
    this.renderGames();
    RQBOX.toast('Library refreshed');
  },

  toggleFavorite(id) {
    const idx = this.favorites.indexOf(id);
    if (idx >= 0) this.favorites.splice(idx, 1);
    else this.favorites.push(id);
    if (this.filter === 'favorites') this.renderGames();
  },
};

const Runtime = {
  _frame: null,
  _overlay: null,

  init() {
    this._frame = document.getElementById('runtime-frame');
    this._overlay = document.getElementById('runtime-overlay');
  },

  launchWeb(url, title) {
    if (!url) { RQBOX.toast('No URL to launch'); return; }
    window.open(url, '_blank');
    RQBOX.toast(`Opened ${title || url} in new tab`);
  },

  launch(url, title) {
    if (!this._overlay || !this._frame) {
      window.open(url, '_blank');
      return;
    }
    this._frame.src = url;
    this._overlay.style.display = 'flex';
    this._overlay.classList.add('active');
    const titleEl = document.getElementById('runtime-title');
    if (titleEl) titleEl.textContent = title || 'Game';
    Controller.vibrate(0.3, 50);

    document.addEventListener('keydown', this._escHandler = (e) => {
      if (e.key === 'Escape') this.close();
    });
  },

  close() {
    if (this._overlay) {
      this._overlay.style.display = 'none';
      this._overlay.classList.remove('active');
    }
    if (this._frame) {
      this._frame.src = 'about:blank';
      setTimeout(() => { this._frame.src = ''; }, 100);
    }
    if (this._escHandler) {
      document.removeEventListener('keydown', this._escHandler);
      this._escHandler = null;
    }
  },

  openFullscreen() {
    if (this._frame) {
      try { this._frame.requestFullscreen(); } catch {}
    }
  },
};
