// RQBBOX Experience OS 1.0 - Cloud Gaming Integration
// Stream games from Xbox Cloud Gaming

const CloudGaming = {
  isAvailable: false,
  currentGame: null,

  init() {
    this.checkAvailability();
  },

  async checkAvailability() {
    // Check if cloud gaming is available
    try {
      const response = await fetch('https://xbox.com/cloudgaming', { mode: 'no-cors' });
      this.isAvailable = true;
    } catch {
      this.isAvailable = false;
    }
  },

  launchGame(gameId) {
    if (!this.isAvailable) {
      RQBOX.toast('Cloud Gaming requires internet connection');
      return;
    }

    // Open Xbox Cloud Gaming
    const url = `https://www.xbox.com/en-US/play/games/${gameId}`;
    window.open(url, '_blank');
    
    RQBOX.toast('Launching Cloud Game...');
    Controller.vibrate(0.5, 100);
  },

  getCloudGames() {
    // Popular cloud-enabled games
    return [
      { id: 'forza-horizon-6', title: 'Forza Horizon 6', icon: '🏎️', category: 'Racing' },
      { id: 'starfield', title: 'Starfield', icon: '🚀', category: 'RPG' },
      { id: 'halo-infinite', title: 'Halo Infinite', icon: '🔫', category: 'Shooter' },
      { id: 'sea-of-thieves', title: 'Sea of Thieves', icon: '🏴‍☠️', category: 'Adventure' },
      { id: 'minecraft', title: 'Minecraft', icon: '⛏️', category: 'Sandbox' },
      { id: 'fortnite', title: 'Fortnite', icon: '🪂', category: 'Shooter' },
      { id: 'cyberpunk-2077', title: 'Cyberpunk 2077', icon: '🌆', category: 'RPG' },
      { id: 'elden-ring', title: 'Elden Ring', icon: '⚔️', category: 'RPG' }
    ];
  },

  renderCloudSection() {
    const games = this.getCloudGames();
    return `
      <div class="section">
        <div class="section-header">
          <h3>☁️ Cloud Gaming</h3>
          <span class="section-badge">Game Pass Ultimate</span>
        </div>
        <div class="horz-scroll">
          ${games.map(game => {
            const iconContent = game.iconSvg 
              ? `<img src="${game.iconSvg}" alt="${game.title}" style="width:100%;height:100%;object-fit:cover;">` 
              : (game.icon || '🎮');
            return `
            <div class="card cloud-card" onclick="CloudGaming.launchGame('${game.id}')">
              <div class="card-art">${iconContent}</div>
              <div class="card-info">
                <div class="card-title">${game.title}</div>
                <div class="card-sub">☁️ Cloud • ${game.category}</div>
              </div>
            </div>
          `}).join('')}
        </div>
      </div>
    `;
  }
};
