const fs = require('fs');
const path = require('path');

const sz = 256, bpp = 32;
const rowBytes = sz * 4;
const imgSize = rowBytes * sz + 40;
const total = 22 + 16 + imgSize;
const b = Buffer.alloc(total);

// ICO header
b.writeUInt16LE(0, 0);
b.writeUInt16LE(1, 2);
b.writeUInt16LE(1, 4);

// Dir entry
b.writeUInt8(0, 6); // 0 = 256 in ICO format
b.writeUInt8(0, 7);
b.writeUInt16LE(1, 10);
b.writeUInt16LE(bpp, 12);
b.writeUInt32LE(imgSize, 14);
b.writeUInt32LE(22, 18);

// BITMAPINFOHEADER
const h = 22;
b.writeUInt32LE(40, h);
b.writeInt32LE(sz, h + 4);
b.writeInt32LE(sz * 2, h + 8);
b.writeUInt16LE(1, h + 12);
b.writeUInt16LE(bpp, h + 14);
b.writeUInt32LE(0, h + 16);
b.writeUInt32LE(imgSize - 40, h + 20);

// Fill pixel data with solid cyan color (BGRA format: #00B4D8)
const pixelStart = h + 40;
const color = Buffer.from([0xD8, 0xB4, 0x00, 0xFF]); // BGRA for #00B4D8
for (let i = 0; i < sz * sz; i++) {
  color.copy(b, pixelStart + i * 4);
}

fs.mkdirSync(path.join(__dirname, 'build'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'build', 'icon.ico'), b);
console.log('Created 256x256 icon.ico:', b.length, 'bytes');
