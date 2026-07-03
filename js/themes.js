const Themes = {
  current: 'default',

  init() {
    this.current = RQBOX.state.config?.theme || 'default';
    this.apply(this.current);
  },

  apply(name) {
    const link = document.getElementById('theme-css');
    if (!link) return;
    link.href = `css/themes/${name}.css`;
    this.current = name;

    if (RQBOX.state.config) {
      RQBOX.state.config.theme = name;
    }

    document.documentElement.style.setProperty('--transition-speed', '0.3s');
    Achievements.unlock('theme-changer');
  },

  getList() {
    return ['default', 'dark', 'neon', 'xbox'];
  },

  preview(name) {
    this.apply(name);
    RQBOX.toast(`Theme: ${name}`);
  },
};
