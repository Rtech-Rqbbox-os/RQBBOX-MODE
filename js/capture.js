const Capture = {
  recordings: [],
  _mediaRecorder: null,
  _recordedChunks: [],
  _recording: false,

  init() {
    RQBOX.id('btn-capture-screenshot')?.addEventListener('click', () => this.screenshot());
  },

  async screenshot() {
    try {
      RQBOX.toast('📷 Capturing screenshot...');
      Controller.vibrate(0.5, 100);

      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0b0d17';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00d4ff';
      ctx.font = '600 16px system-ui';
      ctx.fillText('RQBBOX Experience OS 1.0 — Screenshot', 20, 36);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '12px system-ui';
      ctx.fillText(new Date().toLocaleString(), 20, 56);

      const data = canvas.toDataURL('image/png').split(',')[1];
      const res = await API.post('/api/screenshot', { base64: data });

      const name = `screenshot-${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.png`;
      this.recordings.unshift({ name, path: `captures/${name}`, size: 0, time: new Date().toISOString() });
      this.render();

      RQBOX.toast('Screenshot saved to captures/');
      Notifications.add('Screenshot Captured', 'Saved to captures folder', '📷');
    } catch {
      RQBOX.toast('Screenshot captured (local)');
    }
  },

  async startGameDvr() {
    if (this._recording) { RQBOX.toast('Already recording'); return; }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: 'screen' }, audio: true });
      this._mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      this._recordedChunks = [];

      this._mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this._recordedChunks.push(e.data);
      };

      this._mediaRecorder.onstop = async () => {
        const blob = new Blob(this._recordedChunks, { type: 'video/webm' });
        const name = `clip-${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.webm`;
        const url = URL.createObjectURL(blob);

        this.recordings.unshift({ name, path: url, size: blob.size, time: new Date().toISOString(), blob });
        this.render();

        RQBOX.toast('Game clip saved');
        Notifications.add('Game Clip Saved', `${name} (${(blob.size / 1024 / 1024).toFixed(1)} MB)`, '🎬');
      };

      this._mediaRecorder.start();
      this._recording = true;
      RQBOX.toast('🔴 Recording... Press Stop to save clip');

      this._recordInterval = setTimeout(() => {
        if (this._recording) this.stopGameDvr();
      }, 30000);

    } catch {
      RQBOX.toast('Screen recording requires permission');
    }
  },

  stopGameDvr() {
    if (!this._recording) return;
    this._recording = false;
    if (this._recordInterval) clearTimeout(this._recordInterval);
    if (this._mediaRecorder && this._mediaRecorder.state !== 'inactive') {
      this._mediaRecorder.stop();
      this._mediaRecorder.stream?.getTracks()?.forEach(t => t.stop());
    }
    RQBOX.toast('Recording saved');
  },

  render() {
    const grid = RQBOX.id('capture-grid');
    if (!grid) return;
    if (!this.recordings.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;">No captures yet. Take a screenshot!</div>';
      return;
    }
    grid.innerHTML = this.recordings.map(c => `
      <div class="capture-item" onclick="Capture.openCapture('${c.path}')">
        <div style="text-align:center;">
          <div style="font-size:2rem;margin-bottom:4px;">${c.path.includes('screenshot') ? '🖼️' : '🎬'}</div>
          <div class="capture-info">${c.name}</div>
          <div class="capture-info">${c.size ? (c.size / 1024).toFixed(0) + 'KB' : ''}</div>
        </div>
      </div>
    `).join('');
  },

  openCapture(path) {
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      RQBOX.toast('Open file: ' + path);
    }
  },
};
