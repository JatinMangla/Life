/**
 * Generate a social preview image per project.
 *
 * Without these, every shared project link previews with the same site-wide
 * social-image.png, so a link to a specific case study looks identical to a
 * link to the homepage.
 *
 * Usage: node scripts/og-images.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'app', 'assets');
const OUT = path.join(ROOT, 'public', 'og');

const WIDTH = 1200;
const HEIGHT = 630;
const BACKGROUND = '#111111';
const ACCENT = '#00eeff';

const projects = [
  {
    slug: 'mera-monitor',
    title: 'Mera Monitor',
    subtitle: 'Employee Productivity Platform',
    screenshot: 'mm-analytics-dashboard.webp',
  },
  {
    slug: 'screen-coach',
    title: 'Screen Coach',
    subtitle: 'Screen Time Monitoring',
    screenshot: 'sc-phone-dashboard.jpg',
  },
];

const escapeXml = value =>
  value.replace(/[<>&'"]/g, c => `&#${c.charCodeAt(0)};`);

function overlay({ title, subtitle }) {
  return Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${BACKGROUND}" stop-opacity="1" />
          <stop offset="55%" stop-color="${BACKGROUND}" stop-opacity="0.97" />
          <stop offset="100%" stop-color="${BACKGROUND}" stop-opacity="0.35" />
        </linearGradient>
      </defs>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#scrim)" />
      <rect x="80" y="150" width="64" height="5" fill="${ACCENT}" />
      <text x="80" y="250" font-family="Verdana, DejaVu Sans, sans-serif"
            font-size="66" font-weight="bold" fill="#ffffff">
        ${escapeXml(title)}
      </text>
      <text x="80" y="310" font-family="Verdana, DejaVu Sans, sans-serif"
            font-size="32" fill="#b4b4b4">
        ${escapeXml(subtitle)}
      </text>
      <text x="80" y="540" font-family="Verdana, DejaVu Sans, sans-serif"
            font-size="26" fill="${ACCENT}">
        Jatin Mangla — Frontend Developer
      </text>
    </svg>
  `);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  for (const project of projects) {
    const source = path.join(ASSETS, project.screenshot);

    const background = await sharp(fs.readFileSync(source))
      .resize({ width: WIDTH, height: HEIGHT, fit: 'cover', position: 'right top' })
      .toBuffer();

    const output = path.join(OUT, `${project.slug}.png`);

    await sharp(background)
      .composite([{ input: overlay(project), top: 0, left: 0 }])
      .png({ quality: 90 })
      .toFile(output);

    const { size } = fs.statSync(output);
    console.info(`  ${project.slug}.png  ${(size / 1024).toFixed(0)}KB`);
  }
}

main().catch(error => {
  console.error(`[og-images] ${error.message}`);
  process.exitCode = 1;
});
