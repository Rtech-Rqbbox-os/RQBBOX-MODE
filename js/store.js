const Store = {
  catalog: { games: [], apps: [] },
  extraGames: [],
  extraApps: [],
  filter: 'all',

  async init() {
    await this.loadCatalog();
    this.renderFeatured();
    this.renderStore();
    this.bindFilters();
  },

  async loadCatalog() {
    const gameData = await API.get('/api/games');
    this.catalog.games = gameData?.data || [];
    const appData = await API.get('/api/apps');
    this.catalog.apps = appData?.data || [];

    // Extra installable games (HTML5 iframe-playable)
    this.extraGames = [
      { id: 'store-tower-defense', title: 'Tower Defense Pro', category: 'Strategy', icon: '🏰', desc: 'Defend your kingdom with strategic tower placement', price: 'Free', type: 'iframe', launchUrl: 'games/neon-drift-racing/', featured: true, controls: 'Click to place towers' },
      { id: 'store-puzzle-pack', title: 'Puzzle Master Pack', category: 'Puzzle', icon: '🧩', desc: 'Collection of brain-teasing puzzles', price: 'Free', type: 'iframe', launchUrl: 'games/2048-puzzle/', featured: false, controls: 'Arrow keys to slide' },
      { id: 'store-racing-extreme', title: 'Racing Extreme', category: 'Racing', icon: '🏁', desc: 'High-octane neon racing through tracks', price: 'Free', type: 'iframe', launchUrl: 'games/neon-drift-racing/', featured: true, controls: 'Left/Right arrows to steer' },
      { id: 'store-space-war', title: 'Space War Commander', category: 'Action', icon: '🚀', desc: 'Command your fleet across the galaxy', price: 'Free', type: 'iframe', launchUrl: 'games/star-fighter-x/', featured: false, controls: 'Arrow keys + Space to shoot' },
      { id: 'store-chess-pro', title: 'Chess Grandmaster', category: 'Strategy', icon: '♟', desc: 'Play chess against advanced AI', price: 'Free', type: 'iframe', launchUrl: 'games/chess-ai/', featured: true, controls: 'Click to move pieces' },
      { id: 'store-zombie-war', title: 'Zombie Survival War', category: 'Action', icon: '🧟', desc: 'Survive endless zombie hordes', price: 'Free', type: 'iframe', launchUrl: 'games/zombie-defense/', featured: false, controls: 'Click to shoot • Arrow keys to move' },
      { id: 'store-block-breaker', title: 'Neon Block Breaker', category: 'Arcade', icon: '🎯', desc: 'Break blocks with power-ups', price: 'Free', type: 'iframe', launchUrl: 'games/breakout-neon/', featured: false, controls: 'Arrow keys to move paddle' },
      { id: 'store-memory-pro', title: 'Memory Challenge Pro', category: 'Puzzle', icon: '🃏', desc: 'Test your memory with card matching', price: 'Free', type: 'iframe', launchUrl: 'games/memory-match/', featured: false, controls: 'Click cards to flip' },
      { id: 'store-maze-escape', title: 'Maze Escape', category: 'Puzzle', icon: '🏰', desc: 'Navigate through procedural mazes', price: 'Free', type: 'iframe', launchUrl: 'games/maze-runner/', featured: false, controls: 'Arrow keys to navigate' },
      { id: 'store-dungeon-quest', title: 'Dungeon Quest RPG', category: 'RPG', icon: '⚔', desc: 'Explore dungeons and defeat monsters', price: 'Free', type: 'iframe', launchUrl: 'games/dungeon-crawler/', featured: true, controls: 'WASD to move • Click to attack' },
      { id: 'store-snake-neon', title: 'Neon Snake', category: 'Arcade', icon: '🐍', desc: 'Classic snake with neon glow', price: 'Free', type: 'iframe', launchUrl: 'games/snake-neon/', featured: false, controls: 'Arrow keys to move' },
      { id: 'store-flappy-neon', title: 'Flappy Neon', category: 'Arcade', icon: '🐦', desc: 'Tap to fly through neon pipes', price: 'Free', type: 'iframe', launchUrl: 'games/flappy-bird/', featured: false, controls: 'Space or Click to flap' },
      { id: 'store-tetris-neon', title: 'Tetris Neon', category: 'Puzzle', icon: '🧱', desc: 'Fast-paced tetris with power-ups', price: 'Free', type: 'iframe', launchUrl: 'games/tetris-blitz/', featured: true, controls: 'Arrow keys to rotate and move' },
      { id: 'store-space-invaders', title: 'Space Invaders Redux', category: 'Arcade', icon: '👾', desc: 'Classic space shooter remastered', price: 'Free', type: 'iframe', launchUrl: 'games/space-invaders/', featured: false, controls: 'Arrow keys + Space to shoot' },
      { id: 'store-basketball', title: 'Basketball Stars', category: 'Sports', icon: '🏀', desc: 'Score hoops with perfect timing', price: 'Free', type: 'iframe', launchUrl: 'games/basketball-shots/', featured: false, controls: 'Click and drag to shoot' },
      { id: 'store-air-hockey', title: 'Air Hockey Pro', category: 'Sports', icon: '🏒', desc: 'Fast-paced 2-player air hockey', price: 'Free', type: 'iframe', launchUrl: 'games/air-hockey/', featured: false, controls: 'Mouse to move paddle' },
      { id: 'store-whack-mole', title: 'Whack-a-Mole', category: 'Arcade', icon: '🔨', desc: 'Hit moles before they hide', price: 'Free', type: 'iframe', launchUrl: 'games/whack-a-mole/', featured: false, controls: 'Click on moles' },
    ];

    // Extra installable apps (iframe-playable web apps)
    this.extraApps = [
      { id: 'store-chatgpt', title: 'ChatGPT', icon: '🤖', category: 'AI', webUrl: 'https://chatgpt.com', desc: 'AI-powered chat assistant', price: 'Free', type: 'iframe' },
      { id: 'store-notion', title: 'Notion', icon: '📝', category: 'Productivity', webUrl: 'https://notion.so', desc: 'All-in-one workspace', price: 'Free', type: 'iframe' },
      { id: 'store-figma', title: 'Figma', icon: '🎨', category: 'Design', webUrl: 'https://figma.com', desc: 'Collaborative design tool', price: 'Free', type: 'iframe' },
      { id: 'store-canva', title: 'Canva', icon: '🖼', category: 'Design', webUrl: 'https://canva.com', desc: 'Graphic design platform', price: 'Free', type: 'iframe' },
      { id: 'store-trello', title: 'Trello', icon: '📋', category: 'Productivity', webUrl: 'https://trello.com', desc: 'Kanban board project management', price: 'Free', type: 'iframe' },
      { id: 'store-slack', title: 'Slack', icon: '💬', category: 'Social', webUrl: 'https://slack.com', desc: 'Team communication platform', price: 'Free', type: 'iframe' },
      { id: 'store-gmail', title: 'Gmail', icon: '📧', category: 'Productivity', webUrl: 'https://mail.google.com', desc: 'Google email service', price: 'Free', type: 'iframe' },
      { id: 'store-reddit', title: 'Reddit Web', icon: '👽', category: 'Social', webUrl: 'https://reddit.com', desc: 'Communities and discussions', price: 'Free', type: 'iframe' },
      { id: 'store-twitter', title: 'X / Twitter', icon: '🐦', category: 'Social', webUrl: 'https://x.com', desc: 'Social network', price: 'Free', type: 'iframe' },
      { id: 'store-youtube', title: 'YouTube', icon: '▶️', category: 'Media', webUrl: 'https://youtube.com', desc: 'Video streaming', price: 'Free', type: 'iframe' },
      { id: 'store-twitch', title: 'Twitch', icon: '📺', category: 'Streaming', webUrl: 'https://twitch.tv', desc: 'Live game streaming', price: 'Free', type: 'iframe' },
      { id: 'store-soundcloud', title: 'SoundCloud', icon: '🎵', category: 'Music', webUrl: 'https://soundcloud.com', desc: 'Music streaming platform', price: 'Free', type: 'iframe' },
      { id: 'store-deviantart', title: 'DeviantArt', icon: '🎨', category: 'Creative', webUrl: 'https://deviantart.com', desc: 'Art community platform', price: 'Free', type: 'iframe' },
      { id: 'store-wikipedia', title: 'Wikipedia', icon: '📚', category: 'Education', webUrl: 'https://wikipedia.org', desc: 'Free online encyclopedia', price: 'Free', type: 'iframe' },
      { id: 'store-coursera', title: 'Coursera', icon: '🎓', category: 'Education', webUrl: 'https://coursera.org', desc: 'Online courses and degrees', price: 'Free', type: 'iframe' },
    ];
  },

  bindFilters() {
    RQBOX.$$('#store-filter-bar .filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        RQBOX.$$('#store-filter-bar .filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.filter = pill.dataset.filter;
        this.renderStore();
      });
    });
  },

  getAllItems() {
    const allGames = [...this.catalog.games, ...this.extraGames];
    const allApps = [...this.catalog.apps, ...this.extraApps];
    const all = [...allGames.map(g => ({ ...g, _type: 'game' })), ...allApps.map(a => ({ ...a, _type: 'app' }))];
    return all;
  },

  getFiltered() {
    let items = this.getAllItems();
    switch (this.filter) {
      case 'games': return items.filter(i => i._type === 'game');
      case 'apps': return items.filter(i => i._type === 'app');
      case 'free': return items.filter(i => i.price === 'Free' || !i.price);
      case 'popular': return items.filter(i => i.featured);
      case 'new': return items.slice(-12);
      default: return items;
    }
  },

  renderFeatured() {
    const row = RQBOX.id('store-featured');
    if (!row) return;
    const featured = this.getAllItems().filter(i => i.featured).slice(0, 8);
    row.innerHTML = featured.length
      ? featured.map(i => this.renderCard(i)).join('')
      : '<div class="empty-state">No featured items</div>';
  },

  renderStore() {
    const grid = RQBOX.id('store-grid');
    if (!grid) return;

    const items = this.getFiltered();
    grid.innerHTML = items.length
      ? items.map(i => this.renderCard(i)).join('')
      : '<div class="empty-state" style="grid-column:1/-1;">No items found</div>';
  },

  renderCard(item) {
    const isGame = item._type === 'game';
    const iconContent = item.icon || (isGame ? '🎮' : '📱');
    const typeTag = isGame ? '🎮 Game' : '📱 App';
    return `
      <div class="card" onclick="Store.showDetail('${item.id}')">
        <div class="card-art" style="font-size:2.5rem">${iconContent}</div>
        <div class="card-info">
          <div class="card-title">${item.title}</div>
          <div class="card-sub">${typeTag} • ${item.category || ''} ${item.price ? '• ' + item.price : ''}</div>
        </div>
      </div>
    `;
  },

  showDetail(id) {
    const all = this.getAllItems();
    const item = all.find(i => i.id === id);
    if (!item) return;

    const isGame = item._type === 'game';
    const installed = isGame ? GameLibrary.isInstalled(item.id) : this.isAppInstalled(item.id);

    RQBOX.openModal(`
      <div style="text-align:center;">
        <div style="font-size:3rem;margin-bottom:8px;">${item.icon || (isGame ? '🎮' : '📱')}</div>
        <h3>${item.title}</h3>
        <p style="color:var(--text-secondary);font-size:0.8rem;margin:4px 0 8px;">${item.desc || item.category || ''}</p>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:6px;">
          ${item.price || 'Free'} • ${item.category || ''} • ${isGame ? '🎮 Game' : '📱 App'}
        </div>
        ${item.controls ? `<div style="font-size:0.65rem;color:var(--accent);margin-bottom:12px;">🎮 Controls: ${item.controls}</div>` : ''}
        <div style="font-size:0.65rem;color:var(--text-muted);margin-bottom:12px;">
          ${isGame ? '▶️ Playable in iframe — click Play to start instantly' : '🌐 Opens in built-in browser — click Open to launch'}
        </div>
        <div class="modal-actions" style="justify-content:center;">
          ${installed
            ? `<button class="btn btn-primary" onclick="${isGame ? `GameLibrary.launch('${item.id}')` : `Store.openApp('${item.id}')`};RQBOX.closeModal()">▶️ Play</button>`
            : `<button class="btn btn-primary" onclick="Store.install('${item.id}')">⬇️ Install</button>`
          }
          <button class="btn btn-ghost" onclick="RQBOX.closeModal()">Close</button>
        </div>
      </div>
    `);
  },

  isAppInstalled(id) {
    try {
      const installed = JSON.parse(localStorage.getItem('rqbox-installed-apps') || '[]');
      return installed.includes(id);
    } catch { return false; }
  },

  openApp(id) {
    const all = this.getAllItems();
    const item = all.find(i => i.id === id);
    if (!item || !item.webUrl) { RQBOX.toast('No URL available'); return; }

    document.getElementById('browser-url').value = item.webUrl;
    navigateBrowser(item.webUrl);
    RQBOX.navigate('browser');
  },

  async install(id) {
    const all = this.getAllItems();
    const item = all.find(i => i.id === id);
    if (!item) return;

    const isGame = item._type === 'game';

    if (isGame) {
      if (GameLibrary.isInstalled(id)) { RQBOX.toast('Already installed'); RQBOX.closeModal(); return; }
      RQBOX.toast(`Installing ${item.title}...`);
      GameLibrary.installed.games.push(id);
      Achievements.unlock('first-game');
      if (GameLibrary.installed.games.length >= 5) Achievements.unlock('library-5');
    } else {
      if (this.isAppInstalled(id)) { RQBOX.toast('Already installed'); RQBOX.closeModal(); return; }
      RQBOX.toast(`Installing ${item.title}...`);
      try {
        const installed = JSON.parse(localStorage.getItem('rqbox-installed-apps') || '[]');
        installed.push(id);
        localStorage.setItem('rqbox-installed-apps', JSON.stringify(installed));
      } catch {}
    }

    Notifications.add('Install Complete', `${item.title} is ready to use`, '✅');
    RQBOX.closeModal();
    if (isGame) GameLibrary.renderGames();
    RQBOX.toast(`✅ ${item.title} installed`);
  },
};
