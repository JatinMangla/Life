const fs = require('fs');
const path = require('path');

function getDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.png') {
    // PNG dimensions are at bytes 16-24
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
  } else if (ext === '.gif') {
    // GIF dimensions at bytes 6-10 (little endian)
    const width = buffer.readUInt16LE(6);
    const height = buffer.readUInt16LE(8);
    return { width, height };
  } else if (ext === '.jpg' || ext === '.jpeg') {
    // JPEG is more complex, skip for now
    return { width: '?', height: '?' };
  }
  return { width: '?', height: '?' };
}

const dir = 'd:/git/Portfolio/portfolio/app/assets';
const files = fs.readdirSync(dir).filter(f => f.startsWith('sc-')).sort();

console.log('Screen Coach image dimensions:');
files.forEach(f => {
  const dims = getDimensions(path.join(dir, f));
  const size = (fs.statSync(path.join(dir, f)).size / 1024).toFixed(1);
  console.log(`${f}: ${dims.width}x${dims.height} (${size} KB)`);
});
