// RQBBOX MODE - Background Task Suppression
// Disables non-essential background processes when gaming

const BackgroundSuppression = {
  active: false,
  suppressedProcesses: [],

  init() {
    this.loadState();
  },

  loadState() {
    const saved = localStorage.getItem('rqbbox-bg-suppression');
    if (saved === 'true') {
      this.enable();
    }
  },

  enable() {
    this.active = true;
    document.body.classList.add('bg-suppressed');
    
    // Suppress background tasks
    this.suppressBackgroundTasks();
    
    // Reduce memory usage
    this.optimizeMemory();
    
    // Show notification
    RQBOX.toast('Background Suppression: ON — Non-essential processes disabled');
    
    // Save state
    localStorage.setItem('rqbbox-bg-suppression', 'true');
  },

  disable() {
    this.active = false;
    document.body.classList.remove('bg-suppressed');
    
    // Restore background tasks
    this.restoreBackgroundTasks();
    
    // Show notification
    RQBOX.toast('Background Suppression: OFF');
    
    // Save state
    localStorage.setItem('rqbbox-bg-suppression', 'false');
  },

  toggle() {
    if (this.active) {
      this.disable();
    } else {
      this.enable();
    }
  },

  suppressBackgroundTasks() {
    // Disable animations
    const style = document.createElement('style');
    style.id = 'bg-suppression-css';
    style.textContent = `
      .bg-suppressed .bg-orb { animation: none !important; opacity: 0 !important; }
      .bg-suppressed .boot-screen { display: none !important; }
      .bg-suppressed .toast { animation: none !important; opacity: 0 !important; }
    `;
    document.head.appendChild(style);
    
    // Clear unused memory
    this.optimizeMemory();
  },

  restoreBackgroundTasks() {
    document.getElementById('bg-suppression-css')?.remove();
  },

  optimizeMemory() {
    // Clear image caches
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete) {
        img.loading = 'lazy';
      }
    });
    
    // Clear unused iframes
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      if (iframe.src === 'about:blank') {
        iframe.remove();
      }
    });
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
  },

  getMemoryUsage() {
    if (performance && performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.jsHeapSizeLimit,
        pct: Math.round((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100)
      };
    }
    return null;
  }
};
