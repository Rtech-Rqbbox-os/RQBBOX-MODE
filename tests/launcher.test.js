const test = require('node:test');
const assert = require('node:assert/strict');
const { buildLaunchCommand } = require('../rqbbox-launcher');

test('buildLaunchCommand adds fullscreen flags for Chromium browsers', () => {
  const result = buildLaunchCommand('http://127.0.0.1:19778/', {
    browser: 'msedge.exe',
    fullscreen: true,
  });

  assert.equal(result.command, 'msedge.exe');
  assert.deepEqual(result.args, ['--app=http://127.0.0.1:19778/', '--start-fullscreen']);
});

test('buildLaunchCommand falls back to a simple browser launch when no browser is found', () => {
  const result = buildLaunchCommand('http://127.0.0.1:19778/', {
    browser: null,
    fullscreen: false,
  });

  assert.equal(result.command, 'cmd.exe');
  assert.ok(result.args.includes('/c'));
});
