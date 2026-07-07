const RQBOX = {
  state: {
    mode: false,
    performance: false,
    user: null,
    config: {},
    profiles: { users: [], quickResume: [], achievements: [] },
  },

  $(sel) { return document.querySelector(sel); },
  $$(sel) { return document.querySelectorAll(sel); },
  id(id) { return document.getElementById(id); },

  async init() {
    this.state.config = await this.fetch('/api/config') || {};
    const cfg = this.state.config;
    if (cfg.theme) Themes.apply(cfg.theme);
    document.body.classList.add('rqbbox-mode-active');
  },

  async fetch(url, opts = {}) {
    try {
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...opts.headers },
        method: opts.method || 'GET',
        body: opts.body ? JSON.stringify(opts.body) : undefined,
      });
      const data = await res.json();
      return data;
    } catch { return null; }
  },

  navigate(page) {
    this.$$('.page').forEach(p => p.classList.remove('active'));
    this.$$('.guide-item').forEach(g => g.classList.remove('active'));
    const target = this.id('page-' + page);
    if (target) target.classList.add('active');
    const guide = document.querySelector(`.guide-item[data-page="${page}"]`);
    if (guide) guide.classList.add('active');
    this.id('main-content')?.scrollTo(0, 0);
  },

  toast(msg) {
    const container = this.id('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  },

  exit() {
    this.toast('Exiting RQBBOX Experience OS 1.0...');
    setTimeout(() => {
      document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:rgba(255,255,255,0.3);font-family:sans-serif;font-size:0.85rem;letter-spacing:2px;">RQBBOX Experience OS 1.0 — Return to Desktop</div>';
    }, 500);
  },

  openModal(html) {
    const c = this.id('modal-container');
    if (!c) return;
    c.innerHTML = `<div class="modal-overlay"><div class="modal-content">${html}</div></div>`;
    c.querySelector('.modal-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) c.innerHTML = '';
    });
  },

  closeModal() {
    this.id('modal-container').innerHTML = '';
  },

  gtag(event, data) {
    try {
      if (typeof gtag === 'function') gtag('event', event, data);
    } catch {}
  },
};

const API = {
  base: '',
  async get(path) { return RQBOX.fetch(this.base + path); },
  async post(path, body) { return RQBOX.fetch(this.base + path, { method: 'POST', body }); },
  async put(path, body) { return RQBOX.fetch(this.base + path, { method: 'PUT', body }); },
  async del(path) { return RQBOX.fetch(this.base + path, { method: 'DELETE' }); },
};
