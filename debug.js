const path = require('path');
const fs = require('fs');
const ROOT = __dirname;

let pathname = '/dashboard';
let rel = pathname.replace(/^\//, '');
if (rel === '' || rel === '/') rel = 'index.html';
if (rel === 'dashboard') rel = 'dashboard.html';
console.log('rel:', rel);

let filePath = path.join(ROOT, rel);
console.log('filePath:', filePath, 'exists:', fs.existsSync(filePath));

if (!fs.existsSync(filePath)) {
  const docsPath = path.join(ROOT, 'docs', rel);
  console.log('docsPath:', docsPath, 'exists:', fs.existsSync(docsPath));
  if (fs.existsSync(docsPath)) filePath = docsPath;
}

const resolvedPath = path.resolve(filePath);
console.log('resolvedPath:', resolvedPath);
console.log('startsWith ROOT:', resolvedPath.startsWith(path.resolve(ROOT)));
console.log('exists:', fs.existsSync(resolvedPath));

// Test /
pathname = '/';
rel = pathname.replace(/^\//, '');
console.log('\nrel for /:', JSON.stringify(rel));
if (rel === '' || rel === '/') rel = 'index.html';
console.log('rel after check:', rel);
filePath = path.join(ROOT, rel);
console.log('filePath:', filePath, 'exists:', fs.existsSync(filePath));
if (!fs.existsSync(filePath)) {
  const docsPath = path.join(ROOT, 'docs', rel);
  console.log('docsPath:', docsPath, 'exists:', fs.existsSync(docsPath));
}
