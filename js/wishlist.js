// RQBBOX MODE - Wishlist
// Track games you want to buy

const Wishlist = {
  items: [],

  init() {
    this.loadWishlist();
  },

  loadWishlist() {
    const saved = localStorage.getItem('rqbbox-wishlist');
    this.items = saved ? JSON.parse(saved) : [];
  },

  saveWishlist() {
    localStorage.setItem('rqbbox-wishlist', JSON.stringify(this.items));
  },

  addGame(game) {
    if (this.items.find(i => i.id === game.id)) {
      RQBOX.toast('Already in wishlist');
      return;
    }

    this.items.push({
      id: game.id,
      title: game.title,
      icon: game.icon,
      category: game.category,
      price: game.price,
      addedAt: new Date().toISOString()
    });

    this.saveWishlist();
    RQBOX.toast(`${game.title} added to wishlist`);
  },

  removeGame(gameId) {
    this.items = this.items.filter(i => i.id !== gameId);
    this.saveWishlist();
    RQBOX.toast('Removed from wishlist');
  },

  isInWishlist(gameId) {
    return this.items.some(i => i.id === gameId);
  },

  renderWishlist() {
    return `
      <div class="wishlist-container">
        <div class="wishlist-header">
          <h3>Wishlist</h3>
          <span class="wishlist-count">${this.items.length} games</span>
        </div>
        ${this.items.length > 0 ? `
          <div class="wishlist-grid">
            ${this.items.map(item => `
              <div class="wishlist-card">
                <div class="card-art">${item.icon || '🎮'}</div>
                <div class="card-info">
                  <div class="card-title">${item.title}</div>
                  <div class="card-sub">${item.category || ''} • ${item.price || 'Free'}</div>
                </div>
                <button class="btn-icon" onclick="Wishlist.removeGame('${item.id}')">✕</button>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <p>Your wishlist is empty.</p>
            <p>Browse the Store to add games!</p>
          </div>
        `}
      </div>
    `;
  }
};
