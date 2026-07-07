const PerformanceEngine = {
  mode: 'balanced',
  active: false,
  _origSettings: {},
  _fpsInterval: null,
  _fpsEl: null,
  _enabled: true,

  init() {
    const cfg = RQBOX.state.config?.performance || {};
    this.mode = cfg.mode || 'balanced';
    this._enabled = cfg.gameMode !== false;

    this._fpsEl = document.createElement('div');
    this._fpsEl.className = 'perf-overlay';
    this._fpsEl.id = 'perf-overlay';
    this._fpsEl.style.display = 'none';
    document.body.appendChild(this._fpsEl);

    if (RQBOX.state.config?.display?.showFps) {
      this.showFps(true);
    }
  },

  enable() {
    this.active = true;
    RQBOX.state.performance = true;
    document.body.classList.add('performance-mode');

    this._applyOptimizations();
    RQBOX.id('status-performance')?.classList.add('active');
    RQBOX.toast('⚡ Performance Mode: ON — resources optimized for gaming');
  },

  disable() {
    this.active = false;
    RQBOX.state.performance = false;
    document.body.classList.remove('performance-mode');

    this._removeOptimizations();
    RQBOX.id('status-performance')?.classList.remove('active');
    RQBOX.toast('Performance Mode: OFF');
  },

  toggle() {
    this.active ? this.disable() : this.enable();
  },

  setMode(mode) {
    this.mode = mode;
    if (this.active) {
      this.disable();
      this.enable();
    }
    RQBOX.toast(`Performance mode: ${mode}`);
  },

  _applyOptimizations() {
    this._origSettings = {};

    const style = document.createElement('style');
    style.id = 'perf-css';
    style.textContent = `
      .performance-mode * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
      .performance-mode .bg-animated, .performance-mode .bg-orb { display: none !important; }
      .performance-mode .boot-screen { display: none !important; }
    `;
    document.head.appendChild(style);
    this._origSettings.perfCSS = style;

    if (this.mode === 'maximum') {
      PerformanceEngine._maxOptimizations();
    }
  },

  _maxOptimizations() {
    const lowRes = document.createElement('style');
    lowRes.id = 'perf-max-css';
    lowRes.textContent = `
      .performance-mode .card { border-radius: 8px !important; }
      .performance-mode .top-bar, .performance-mode .guide-bar { backdrop-filter: none !important; }
    `;
    document.head.appendChild(lowRes);
  },

  _removeOptimizations() {
    if (this._origSettings.perfCSS) {
      this._origSettings.perfCSS.remove();
    }
    document.getElementById('perf-max-css')?.remove();
  },

  showFps(show) {
    if (!this._fpsEl) return;
    this._fpsEl.style.display = show ? 'block' : 'none';
    if (show) {
      let frames = 0;
      let lastTime = performance.now();
      const tick = () => {
        frames++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
          this._fpsEl.textContent = `FPS: ${frames} | ${RQBOX.state.config?.performance?.mode || 'balanced'}`;
          frames = 0;
          lastTime = now;
        }
        this._fpsRAF = requestAnimationFrame(tick);
      };
      this._fpsRAF = requestAnimationFrame(tick);
    } else {
      if (this._fpsRAF) cancelAnimationFrame(this._fpsRAF);
    }
  },

  getMemoryInfo() {
    if (performance && performance.memory) {
      return {
        totalJSHeap: performance.memory.totalJSHeapSize,
        usedJSHeap: performance.memory.usedJSHeapSize,
        jsHeapLimit: performance.memory.jsHeapSizeLimit,
        pct: Math.round((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100),
      };
    }
    return null;
  },

  async getSystemInfo() {
    const info = await API.get('/api/performance');
    return info;
  },
};
