const fs = require('fs');
const path = require('path');

const exePath = path.join(__dirname, '..', 'dist', 'RQBBOX-Experience-Setup-1.0.0.exe');
const targetGB = 3.60;
const targetBytes = Math.floor(targetGB * 1024 * 1024 * 1024);

const stat = fs.statSync(exePath);
const currentSize = stat.size;
const padBytes = targetBytes - currentSize;

console.log(`Current: ${(currentSize / 1024 / 1024).toFixed(1)} MB`);
console.log(`Target:  ${targetGB} GB (${targetBytes} bytes)`);
console.log(`Need to add: ${(padBytes / 1024 / 1024).toFixed(1)} MB`);

const fd = fs.openSync(exePath, 'a');
const buf = Buffer.alloc(64 * 1024 * 1024); // 64MB chunks
let remaining = padBytes;
let pct = 0;

while (remaining > 0) {
  const writeSize = Math.min(buf.length, remaining);
  fs.writeSync(fd, buf, 0, writeSize);
  remaining -= writeSize;
  const newPct = Math.floor(((targetBytes - remaining) / targetBytes) * 100);
  if (newPct > pct) {
    pct = newPct;
    process.stdout.write(`\r  ${pct}% complete (${((targetBytes - remaining) / 1024 / 1024 / 1024).toFixed(2)} GB written)`);
  }
}

fs.closeSync(fd);

const finalSize = fs.statSync(exePath).size;
console.log(`\n\nDone! Final size: ${(finalSize / 1024 / 1024 / 1024).toFixed(2)} GB`);
