const fs = require('fs');
const path = require('path');
const htmlPath = path.join(process.env.TEMP, 'myscreencoach.html');
if (!fs.existsSync(htmlPath)) {
  console.log('HTML file not found at:', htmlPath);
  process.exit(1);
}
const html = fs.readFileSync(htmlPath, 'utf8');
const regex = /src=["']([^"']*\.(jpg|png|webp|gif|svg|jpeg))["']/gi;
const urls = new Set();
let match;
while ((match = regex.exec(html)) !== null) {
  urls.add(match[1]);
}
urls.forEach(u => console.log(u));