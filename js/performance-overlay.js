// RQBBOX MODE - Performance Overlay
// Shows FPS, CPU, RAM usage in corner like Xbox Mode

const PerformanceOverlay = {
  active: false,
  fps: 0,
  frames: 0,
  lastTime: performance.now(),
  element: null,

  init() {
    this.createElement();
    this.startMonitoring();
  },

  createElement() {
    this.element = document.createElement('div');
    this.element.id = 'performance-overlay';
    this.element.className = 'performance-overlay';
    this.element.style.cssText = `
      position: fixed;
      top: 12px;
      right: 12px;
      z-index: 100;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 12px 16px;
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 12px;
      color: #fff;
      min-width: 180px;
      display: none;
    `;
    document.body.appendChild(this.element);
  },

  startMonitoring() {
    // FPS counter
    const countFrame = () => {
      this.frames++;
      const now = performance.now();
      if (now - this.lastTime >= 1000) {
        this.fps = this.frames;
        this.frames = 0;
        this.lastTime = now;
        this.updateDisplay();
      }
      requestAnimationFrame(countFrame);
    };
    requestAnimationFrame(countFrame);
  },

  async updateDisplay() {
    if (!this.active || !this.element) return;

    // Get system info
    try {
      const info = await API.get('/api/performance');
      if (info) {
        const memUsed = (info.memory.used / 1073741824).toFixed(1);
        const memTotal = (info.memory.total / 1073741824).toFixed(1);
        const memPct = info.memory.pct;
        const cpuLoad = info.cpu.load;

        this.element.innerHTML = `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span style="color:${this.fps >= 50 ? '#4ade80' : this.fps >= 30 ? '#facc15' : '#f87171'};">●</span>
            <span style="font-weight:600;">${this.fps} FPS</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <span style="color:rgba(255,255,255,0.6);">CPU</span>
            <span>${cpuLoad}%</span>
          </div>
          <div style="height:3px;background:rgba(255,255,255,0.1);border-radius:2px;margin-bottom:8px;">
            <div style="height:100%;width:${cpuLoad}%;background:${cpuLoad > 80 ? '#f87171' : '#4ade80'};border-radius:2px;"></div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <span style="color:rgba(255,255,255,0.6);">RAM</span>
            <span>${memUsed} / ${memTotal} GB</span>
          </div>
          <div style="height:3px;background:rgba(255,255,255,0.1);border-radius:2px;">
            <div style="height:100%;width:${memPct}%;background:${memPct > 80 ? '#f87171' : '#4ade80'};border-radius:2px;"></div>
          </div>
        `;
      }
    } catch {}
  },

  show() {
    this.active = true;
    if (this.element) {
      this.element.style.display = 'block';
      this.updateDisplay();
    }
  },

  hide() {
    this.active = false;
    if (this.element) {
      this.element.style.display = 'none';
    }
  },

  toggle() {
    if (this.active) {
      this.hide();
    } else {
      this.show();
    }
  }
};
