const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const outputPath = path.join(__dirname, '..', 'build', 'rqbbox-os-data.bin');
const targetGB = 3.55;
const targetBytes = Math.floor(targetGB * 1024 * 1024 * 1024);
const chunkSize = 1024 * 1024; // 1MB chunks

console.log(`Generating ${targetGB} GB of incompressible data...`);
console.log(`Target: ${targetBytes} bytes`);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
const fd = fs.openSync(outputPath, 'w');
let written = 0;
let pct = 0;

while (written < targetBytes) {
  const size = Math.min(chunkSize, targetBytes - written);
  const buf = crypto.randomBytes(size);
  fs.writeSync(fd, buf, 0, size, written);
  written += size;
  const newPct = Math.floor((written / targetBytes) * 100);
  if (newPct > pct) {
    pct = newPct;
    process.stdout.write(`\r  ${pct}% (${(written / 1024 / 1024 / 1024).toFixed(2)} GB written)`);
  }
}

fs.closeSync(fd);
const stat = fs.statSync(outputPath);
console.log(`\n\nDone! File: ${outputPath}`);
console.log(`Size: ${stat.size} bytes (${(stat.size / 1024 / 1024 / 1024).toFixed(2)} GB)`);
