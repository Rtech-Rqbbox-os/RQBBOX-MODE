const Store = {
  catalog: { games: [] },
  filter: 'all',

  async init() {
    await this.loadCatalog();
    this.renderStore();
    this.bindFilters();
  },

  async loadCatalog() {
    const data = await API.get('/api/games');
    this.catalog = { games: data?.data || [] };
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

  getFiltered() {
    if (this.filter === 'all') return this.catalog.games;
    return this.catalog.games.filter(g => (g.category || '').toLowerCase() === this.filter);
  },

  renderStore() {
    const grid = RQBOX.id('store-grid');
    if (!grid) return;

    const games = this.getFiltered();
    grid.innerHTML = games.length
      ? games.map(g => {
          const iconContent = g.iconSvg 
            ? `<img src="${g.iconSvg}" alt="${g.title}" style="width:100%;height:100%;object-fit:cover;">` 
            : (g.icon || '🎮');
          return `
          <div class="card" onclick="Store.showDetail('${g.id}')">
            <div class="card-art">${iconContent}</div>
            <div class="card-info">
              <div class="card-title">${g.title}</div>
              <div class="card-sub">${g.category || 'Game'} ${g.price ? '• ' + g.price : ''}</div>
            </div>
          </div>
        `}).join('')
      : '<div class="empty-state" style="grid-column:1/-1;">No games in this category</div>';
  },

  showDetail(id) {
    const game = this.catalog.games.find(g => g.id === id);
    if (!game) return;
    const installed = GameLibrary.isInstalled(game.id);

    RQBOX.openModal(`
      <div style="text-align:center;">
        <div style="font-size:3rem;margin-bottom:8px;">${game.icon || '🎮'}</div>
        <h3>${game.title}</h3>
        <p style="color:var(--text-secondary);font-size:0.8rem;margin:4px 0 8px;">${game.desc || game.category || ''}</p>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:16px;">
          ${game.price || 'Free'} • ${game.category || 'Game'}
        </div>
        <div class="modal-actions" style="justify-content:center;">
          ${installed
            ? '<button class="btn btn-primary" onclick="GameLibrary.launch(\'' + game.id + '\');RQBOX.closeModal()">▶️ Play</button>'
            : '<button class="btn btn-primary" onclick="Store.install(\'' + game.id + '\')">⬇️ Install</button>'
          }
          <button class="btn btn-ghost" onclick="RQBOX.closeModal()">Close</button>
        </div>
      </div>
    `);
  },

  async install(id) {
    const game = this.catalog.games.find(g => g.id === id);
    if (!game || GameLibrary.isInstalled(id)) { RQBOX.toast('Already installed'); RQBOX.closeModal(); return; }

    RQBOX.toast(`Installing ${game.title}...`);
    GameLibrary.installed.games.push(id);

    Notifications.add('Install Complete', `${game.title} is ready to play`, '✅');
    Achievements.unlock('first-game');
    if (GameLibrary.installed.games.length >= 5) Achievements.unlock('library-5');

    RQBOX.closeModal();
    GameLibrary.renderGames();
    RQBOX.toast(`✅ ${game.title} installed`);
  },
};
