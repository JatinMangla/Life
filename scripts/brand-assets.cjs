/**
 * Render every brand asset from the one monogram outline.
 *
 * The favicon, PWA icons and the site-wide social card used to be the
 * template author's — a "W" and a card reading "HAMISH WILLIAMS" — because
 * nothing tied them to the monogram the site actually draws. The outline is
 * now read straight out of monogram.tsx, so changing the mark there and
 * re-running this script is the only way to change it anywhere.
 *
 * Usage: node scripts/brand-assets.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const config = require(path.join(ROOT, 'app', 'config.json'));

const MARK_WIDTH = 48;
const MARK_HEIGHT = 29;
const BACKGROUND = '#111111';
// sRGB approximation of the dark theme's oklch(84.42% 0.19 202.24) accent.
const ACCENT = '#00e0ff';
const FONT = 'Verdana, DejaVu Sans, sans-serif';

function readMonogramPath() {
  const source = fs.readFileSync(
    path.join(ROOT, 'app', 'components', 'monogram', 'monogram.tsx'),
    'utf8'
  );
  const match = source.match(/MONOGRAM_PATH\s*=\s*'([^']+)'/);

  if (!match) throw new Error('MONOGRAM_PATH not found in monogram.tsx');

  return match[1];
}

const MARK = readMonogramPath();

const escapeXml = value => value.replace(/[<>&'"]/g, c => `&#${c.charCodeAt(0)};`);

/** The mark centred in a square, scaled to `coverage` of its width. */
function squareIcon(size, coverage) {
  const scale = (size * coverage) / MARK_WIDTH;
  const x = (size - MARK_WIDTH * scale) / 2;
  const y = (size - MARK_HEIGHT * scale) / 2;

  return Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${BACKGROUND}" />
      <path d="${MARK}" fill="#ffffff" transform="translate(${x} ${y}) scale(${scale})" />
    </svg>
  `);
}

function socialCard() {
  const width = 1200;
  const height = 630;
  const markScale = 2.2;
  const chips = ['React', 'TypeScript', 'Next.js', 'Remix', 'Node.js', 'LLM integration'];

  let cursorX = 80;
  const chipMarkup = chips
    .map(item => {
      const chipWidth = 28 + item.length * 11;
      const x = cursorX;
      cursorX += chipWidth + 12;

      return `
        <rect x="${x}" y="400" width="${chipWidth}" height="38" fill="${ACCENT}"
              fill-opacity="0.10" stroke="${ACCENT}" stroke-opacity="0.40" />
        <text x="${x + 14}" y="425" font-family="${FONT}" font-size="20"
              fill="#d8d8d8">${escapeXml(item)}</text>`;
    })
    .join('');

  const host = new URL(config.url).host;

  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="82%" cy="30%" r="60%">
          <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.35" />
          <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0" />
        </radialGradient>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M48 0H0V48" fill="none" stroke="${ACCENT}" stroke-opacity="0.10" />
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="${BACKGROUND}" />
      <rect width="${width}" height="${height}" fill="url(#grid)" />
      <rect width="${width}" height="${height}" fill="url(#glow)" />
      <path d="${MARK}" fill="#ffffff" transform="translate(80 90) scale(${markScale})" />
      <text x="80" y="270" font-family="${FONT}" font-size="76" font-weight="bold"
            fill="#ffffff">${escapeXml(config.name)}</text>
      <rect x="80" y="300" width="64" height="5" fill="${ACCENT}" />
      <text x="80" y="356" font-family="${FONT}" font-size="34"
            fill="#b4b4b4">${escapeXml(config.role)} — React &amp; TypeScript</text>
      ${chipMarkup}
      <text x="80" y="560" font-family="${FONT}" font-size="26"
            fill="${ACCENT}">${escapeXml(host)}</text>
    </svg>
  `);
}

async function writePng(name, svg) {
  const output = path.join(PUBLIC, name);

  await sharp(svg).png({ compressionLevel: 9 }).toFile(output);

  const { size } = fs.statSync(output);
  console.info(`  ${name}  ${(size / 1024).toFixed(0)}KB`);
}

function writeSvgs() {
  // Follows the OS theme in the browser tab, where the site's own theme
  // toggle can't reach.
  fs.writeFileSync(
    path.join(PUBLIC, 'favicon.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="-4 -13.5 56 56">
  <style>
    #favicon {
      fill: #111;
      @media (prefers-color-scheme: dark) {
        fill: #fff;
      }
    }
  </style>
  <path id="favicon" d="${MARK}"/>
</svg>
`
  );

  fs.writeFileSync(
    path.join(PUBLIC, 'icon.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${MARK_WIDTH}" height="${MARK_HEIGHT}" fill="#fff" viewBox="0 0 ${MARK_WIDTH} ${MARK_HEIGHT}">
  <path d="${MARK}"/>
</svg>
`
  );

  console.info('  favicon.svg, icon.svg');
}

async function main() {
  writeSvgs();

  await writePng('shortcut.png', squareIcon(64, 0.72));
  // 0.5 keeps the mark inside the maskable safe zone (a centred circle of
  // 80% diameter), so Android's adaptive icon masks never clip it.
  await writePng('icon-256.png', squareIcon(256, 0.5));
  await writePng('icon-512.png', squareIcon(512, 0.5));
  await writePng('social-image.png', socialCard());
}

main().catch(error => {
  console.error(`[brand-assets] ${error.message}`);
  process.exitCode = 1;
});
