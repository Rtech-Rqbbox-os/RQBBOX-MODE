const Emulation = (() => {
  const LIMBO_PACKAGE = 'com.felixhlimbo.pce';
  const STORAGE_KEY = 'rqbbox_emulation';
  const CONFIGS_KEY = 'rqbbox_emu_configs';
  const DISKS_KEY = 'rqbbox_emu_disks';

  let disks = [];
  let savedConfigs = [];
  let activeVM = null;

  function init() {
    loadDisks();
    loadConfigs();
    checkLimbo();
    renderDiskList();
    renderConfigs();
    renderStatus();
  }

  function loadDisks() {
    try {
      disks = JSON.parse(localStorage.getItem(DISKS_KEY) || '[]');
    } catch { disks = []; }
  }

  function saveDisks() {
    localStorage.setItem(DISKS_KEY, JSON.stringify(disks));
  }

  function loadConfigs() {
    try {
      savedConfigs = JSON.parse(localStorage.getItem(CONFIGS_KEY) || '[]');
    } catch { savedConfigs = []; }
  }

  function saveConfigs() {
    localStorage.setItem(CONFIGS_KEY, JSON.stringify(savedConfigs));
  }

  function checkLimbo() {
    const el = document.getElementById('emu-limbo-status');
    const ua = navigator.userAgent || '';
    const isAndroid = /Android/i.test(ua);

    if (isAndroid) {
      if (el) el.textContent = 'Limbo: Android Detected ✓';
      if (el) el.style.color = '#00ff88';
    } else {
      if (el) el.textContent = 'Limbo: Desktop Mode (Export configs for Android)';
      if (el) el.style.color = '#ffaa00';
    }
  }

  function renderStatus() {
    const countEl = document.getElementById('emu-disk-count');
    const vmEl = document.getElementById('emu-active-vm');
    if (countEl) countEl.textContent = `${disks.length} Disk${disks.length !== 1 ? 's' : ''}`;
    if (vmEl) vmEl.textContent = activeVM ? `Running: ${activeVM.name}` : 'No Active VM';
  }

  function renderDiskList() {
    const list = document.getElementById('qcow2-list');
    const select = document.getElementById('emu-disk-select');
    if (!list) return;

    if (disks.length === 0) {
      list.innerHTML = '<div class="empty-state">No qcow2 files imported</div>';
      if (select) select.innerHTML = '<option value="">Select a qcow2 file...</option>';
      return;
    }

    list.innerHTML = disks.map((d, i) => `
      <div class="qcow2-item ${d.active ? 'active' : ''}" data-idx="${i}">
        <div class="qcow2-icon">&#x1F4BF;</div>
        <div class="qcow2-info">
          <div class="qcow2-name">${esc(d.name)}</div>
          <div class="qcow2-meta">${d.size || 'Unknown size'} · ${d.os || 'Unknown OS'}</div>
        </div>
        <div class="qcow2-actions">
          <button class="btn btn-xs btn-ghost" onclick="Emulation.selectDisk(${i})" title="Select">&#x2714;</button>
          <button class="btn btn-xs btn-ghost" onclick="Emulation.removeDisk(${i})" title="Remove">&#x2716;</button>
        </div>
      </div>
    `).join('');

    if (select) {
      select.innerHTML = '<option value="">Select a qcow2 file...</option>' +
        disks.map((d, i) => `<option value="${i}">${esc(d.name)} (${d.os || 'Unknown'})</option>`).join('');
    }
  }

  function renderConfigs() {
    const list = document.getElementById('saved-configs-list');
    if (!list) return;

    if (savedConfigs.length === 0) {
      list.innerHTML = '<div class="empty-state">No saved configurations</div>';
      return;
    }

    list.innerHTML = savedConfigs.map((c, i) => `
      <div class="config-item">
        <div class="config-item-info">
          <div class="config-item-name">${esc(c.name)}</div>
          <div class="config-item-meta">${c.ram}MB RAM · ${c.cpu} CPU · ${c.arch}</div>
        </div>
        <div class="config-item-actions">
          <button class="btn btn-xs btn-primary" onclick="Emulation.loadConfig(${i})">Load</button>
          <button class="btn btn-xs btn-ghost" onclick="Emulation.deleteConfig(${i})">&#x2716;</button>
        </div>
      </div>
    `).join('');
  }

  async function importQcow2() {
    const ua = navigator.userAgent || '';
    const isAndroid = /Android/i.test(ua);

    if (isAndroid && window.Capacitor) {
      try {
        const { FilePicker } = await import('@capacitor/file-picker');
        const result = await FilePicker.pickFiles({
          types: ['application/octet-stream', '.qcow2', '.img', '.iso'],
          multiple: false
        });

        if (result.files && result.files.length > 0) {
          const file = result.files[0];
          const disk = {
            name: file.name,
            path: file.path || file.uri,
            size: formatSize(file.size),
            os: detectOS(file.name),
            date: new Date().toISOString(),
            active: false
          };
          disks.push(disk);
          saveDisks();
          renderDiskList();
          renderStatus();
          RQBOX.toast(`Imported: ${disk.name}`, 'success');
        }
      } catch (err) {
        RQBOX.toast('Import cancelled or failed', 'error');
      }
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.qcow2,.img,.iso,.raw,.vdi,.vmdk,.vhdx';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const disk = {
        name: file.name,
        path: file.name,
        size: formatSize(file.size),
        os: detectOS(file.name),
        date: new Date().toISOString(),
        active: false,
        data: null
      };

      if (file.size < 100 * 1024 * 1024) {
        try {
          const reader = new FileReader();
          disk.data = await new Promise((resolve) => {
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        } catch {}
      }

      disks.push(disk);
      saveDisks();
      renderDiskList();
      renderStatus();
      RQBOX.toast(`Imported: ${disk.name}`, 'success');
    };
    input.click();
  }

  function selectDisk(idx) {
    disks.forEach((d, i) => d.active = i === idx);
    saveDisks();
    renderDiskList();
    const sel = document.getElementById('emu-disk-select');
    if (sel) sel.value = idx;
  }

  function removeDisk(idx) {
    const name = disks[idx]?.name;
    disks.splice(idx, 1);
    saveDisks();
    renderDiskList();
    renderStatus();
    RQBOX.toast(`Removed: ${name}`, 'info');
  }

  function detectOS(filename) {
    const lower = filename.toLowerCase();
    if (lower.includes('dos') || lower.includes('msdos')) return 'MS-DOS';
    if (lower.includes('win95') || lower.includes('windows 95')) return 'Windows 95';
    if (lower.includes('win98') || lower.includes('windows 98')) return 'Windows 98';
    if (lower.includes('winxp') || lower.includes('windows xp')) return 'Windows XP';
    if (lower.includes('win7') || lower.includes('windows 7')) return 'Windows 7';
    if (lower.includes('linux') || lower.includes('ubuntu') || lower.includes('debian')) return 'Linux';
    if (lower.includes('freebsd')) return 'FreeBSD';
    if (lower.includes('mac') || lower.includes('macos')) return 'macOS';
    return 'Unknown';
  }

  function formatSize(bytes) {
    if (!bytes) return 'Unknown';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; }
    return bytes.toFixed(1) + ' ' + units[i];
  }

  function getConfig() {
    return {
      disk: document.getElementById('emu-disk-select')?.value || '',
      ram: document.getElementById('emu-ram')?.value || '256',
      cpu: document.getElementById('emu-cpu')?.value || '1',
      arch: document.getElementById('emu-arch')?.value || 'x86',
      machine: document.getElementById('emu-machine')?.value || 'pc',
      vga: document.getElementById('emu-vga')?.value || 'std',
      audio: document.getElementById('emu-audio')?.value || 'sb16',
      network: document.getElementById('emu-network')?.value || 'none'
    };
  }

  function applyConfig(cfg) {
    if (cfg.disk !== '') {
      const sel = document.getElementById('emu-disk-select');
      if (sel) sel.value = cfg.disk;
    }
    const fields = ['ram', 'cpu', 'arch', 'machine', 'vga', 'audio', 'network'];
    fields.forEach(f => {
      const el = document.getElementById(`emu-${f}`);
      if (el && cfg[f]) el.value = cfg[f];
    });
  }

  function launch() {
    const cfg = getConfig();
    const diskIdx = parseInt(cfg.disk);

    if (isNaN(diskIdx) || !disks[diskIdx]) {
      RQBOX.toast('Please select a disk image first', 'error');
      return;
    }

    const disk = disks[diskIdx];
    const ua = navigator.userAgent || '';
    const isAndroid = /Android/i.test(ua);

    activeVM = { name: disk.name, config: cfg, startTime: Date.now() };
    renderStatus();

    if (isAndroid) {
      launchLimboAndroid(disk, cfg);
    } else {
      launchDesktop(disk, cfg);
    }
  }

  function launchLimboAndroid(disk, cfg) {
    const limboConfig = {
      name: `RQBBOX_${disk.name.replace(/\.[^.]+$/, '')}`,
      imagepath: disk.path || disk.name,
      ram: cfg.ram,
      cpus: cfg.cpu,
      arch: cfg.arch,
      machine: cfg.machine,
      vga: cfg.vga,
      audio: cfg.audio,
      net: cfg.network === 'none' ? '' : cfg.network,
      boot: 'c'
    };

    RQBOX.toast(`Launching ${disk.name} in Limbo...`, 'success');

    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser) {
      const intentUrl = `intent:#Intent;component=${LIMBO_PACKAGE}/.activities.MainActivity;S.name=${encodeURIComponent(limboConfig.name)};S.imagepath=${encodeURIComponent(limboConfig.imagepath)};S.ram=${limboConfig.ram};S.cpus=${limboConfig.cpus};S.arch=${limboConfig.arch};S.machine=${limboConfig.machine};S.vga=${limboConfig.vga};S.audio=${limboConfig.audio};S.net=${limboConfig.net};S.boot=${limboConfig.boot};end`;

      window.Capacitor.Plugins.Browser.open({ url: intentUrl }).catch(() => {
        window.open(`https://play.google.com/store/apps/details?id=${LIMBO_PACKAGE}`, '_blank');
        RQBOX.toast('Limbo not found — opening Play Store', 'info');
      });
    } else {
      const intentUrl = `intent:#Intent;component=${LIMBO_PACKAGE}/.activities.MainActivity;S.name=${encodeURIComponent(limboConfig.name)};S.imagepath=${encodeURIComponent(limboConfig.imagepath)};S.ram=${limboConfig.ram};S.cpus=${limboConfig.cpus};S.arch=${limboConfig.arch};end`;
      window.open(intentUrl, '_blank');
    }

    showVMDisplay(disk.name);
  }

  function launchDesktop(disk, cfg) {
    RQBOX.toast(`VM "${disk.name}" configured (${cfg.ram}MB RAM, ${cfg.arch})`, 'info');
    showVMDisplay(disk.name);
    RQBOX.toast('Export this config to use with Limbo on Android', 'info');
  }

  function showVMDisplay(name) {
    const configEl = document.getElementById('emulation-config');
    const displayEl = document.getElementById('emulation-vm-display');
    const titleEl = document.getElementById('vm-display-title');

    if (configEl) configEl.style.display = 'none';
    if (displayEl) displayEl.style.display = 'block';
    if (titleEl) titleEl.textContent = `Running: ${name}`;
    renderStatus();
  }

  function stop() {
    activeVM = null;
    const configEl = document.getElementById('emulation-config');
    const displayEl = document.getElementById('emulation-vm-display');

    if (configEl) configEl.style.display = 'block';
    if (displayEl) displayEl.style.display = 'none';
    renderStatus();
    RQBOX.toast('VM stopped', 'info');
  }

  function sendCtrlAltDel() {
    RQBOX.toast('Ctrl+Alt+Del sent', 'info');
  }

  function toggleFullscreen() {
    const screen = document.getElementById('vm-screen');
    if (screen) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        screen.requestFullscreen().catch(() => {});
      }
    }
  }

  function saveConfig() {
    const name = prompt('Configuration name:');
    if (!name) return;

    const cfg = getConfig();
    cfg.name = name;
    cfg.date = new Date().toISOString();
    savedConfigs.push(cfg);
    saveConfigs();
    renderConfigs();
    RQBOX.toast(`Saved: ${name}`, 'success');
  }

  function loadConfig(idx) {
    const cfg = savedConfigs[idx];
    if (!cfg) return;
    applyConfig(cfg);
    RQBOX.toast(`Loaded: ${cfg.name}`, 'info');
  }

  function deleteConfig(idx) {
    const name = savedConfigs[idx]?.name;
    savedConfigs.splice(idx, 1);
    saveConfigs();
    renderConfigs();
    RQBOX.toast(`Deleted: ${name}`, 'info');
  }

  function launchPreset(preset) {
    const presets = {
      dos: { ram: '64', cpu: '1', arch: 'x86', machine: 'isapc', vga: 'std', audio: 'pcspk', network: 'none' },
      win98: { ram: '256', cpu: '1', arch: 'x86', machine: 'pc', vga: 'cirrus', audio: 'sb16', network: 'none' },
      winxp: { ram: '512', cpu: '2', arch: 'x86', machine: 'pc', vga: 'std', audio: 'sb16', network: 'user' },
      linux: { ram: '1024', cpu: '2', arch: 'x86_64', machine: 'pc', vga: 'virtio', audio: 'sb16', network: 'user' }
    };

    const cfg = presets[preset];
    if (!cfg) return;

    cfg.disk = '';
    applyConfig(cfg);
    RQBOX.toast(`${preset.toUpperCase()} preset loaded — select a disk image`, 'info');
  }

  function refresh() {
    loadDisks();
    loadConfigs();
    checkLimbo();
    renderDiskList();
    renderConfigs();
    renderStatus();
    RQBOX.toast('Emulation refreshed', 'info');
  }

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  init();

  return {
    init,
    refresh,
    importQcow2,
    selectDisk,
    removeDisk,
    launch,
    stop,
    sendCtrlAltDel,
    toggleFullscreen,
    saveConfig,
    loadConfig,
    deleteConfig,
    launchPreset
  };
})();
