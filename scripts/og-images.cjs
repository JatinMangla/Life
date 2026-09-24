/**
 * Generate a social preview image per project.
 *
 * Without these, every shared project link previews with the same site-wide
 * social-image.png, so a link to a specific case study looks identical to a
 * link to the homepage.
 *
 * Projects with a screenshot get it as a background. The personal projects
 * are auth-gated or private, so the only honest screenshot would be a sign-in
 * screen — those get a typographic card built from their stack instead.
 *
 * Keep this list in step with app/data/projects.ts; projects.test.ts fails if
 * a project has no card in public/og.
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
const FONT = 'Verdana, DejaVu Sans, sans-serif';

const projects = [
  {
    slug: 'personal-vault',
    title: 'Personal Vault',
    subtitle: 'Encrypted archive on a $0 budget',
    accent: '#ff7a45',
    stack: ['Next.js 16', 'Web Crypto', 'Supabase', 'Oracle Cloud', 'restic'],
  },
  {
    slug: 'mera-monitor',
    title: 'Mera Monitor',
    subtitle: 'Workforce analytics platform',
    accent: '#00eeff',
    screenshot: 'mm-analytics-dashboard.webp',
    // The performer lists are demo accounts, but in a link preview a column of
    // names reads as real people.
    blur: [{ left: 664, top: 290, width: 192, height: 293 }],
  },
  {
    slug: 'analytics-mcp-server',
    title: 'Analytics MCP Server',
    subtitle: 'Claude over OAuth 2.1',
    accent: '#7c9cff',
    stack: ['TypeScript', 'MCP SDK', 'OAuth 2.1', 'Upstash Redis', 'Vercel'],
  },
  {
    slug: 'careerpilot-ai',
    title: 'CareerPilot AI',
    subtitle: 'Personal career copilot',
    accent: '#c58cff',
    stack: ['Next.js 14', 'TypeScript', 'Google Gemini', 'Upstash Redis', 'IMAP'],
  },
  {
    slug: 'kundli-predict',
    title: 'Kundli Predict',
    subtitle: 'Vedic astrology engine with AI readings',
    accent: '#e0b34d',
    stack: ['Next.js 15', 'TypeScript', 'astronomy-engine', 'Gemini', 'Vitest'],
  },
  {
    slug: 'screen-coach',
    title: 'Screen Coach',
    subtitle: 'Screen Time Monitoring',
    accent: '#00e0a4',
    screenshot: 'sc-phone-dashboard.jpg',
  },
];

const escapeXml = value => value.replace(/[<>&'"]/g, c => `&#${c.charCodeAt(0)};`);

/** Text and accent furniture drawn over whatever background is behind it. */
function overlay({ title, subtitle, accent, stack }) {
  // Flow the chips left to right and wrap, rather than stacking them down the
  // page where they would collide with the byline.
  const CHIP_LEFT = 80;
  const CHIP_TOP = 392;
  const CHIP_HEIGHT = 38;
  const CHIP_GAP = 12;
  const MAX_RIGHT = 900;

  let cursorX = CHIP_LEFT;
  let cursorY = CHIP_TOP;

  const chips = (stack ?? [])
    .map(item => {
      const width = 28 + item.length * 11;

      if (cursorX + width > MAX_RIGHT) {
        cursorX = CHIP_LEFT;
        cursorY += CHIP_HEIGHT + CHIP_GAP;
      }

      const x = cursorX;
      const y = cursorY;

      cursorX += width + CHIP_GAP;

      return `
        <rect x="${x}" y="${y}" width="${width}" height="${CHIP_HEIGHT}"
              fill="${accent}" fill-opacity="0.12" stroke="${accent}"
              stroke-opacity="0.40" />
        <text x="${x + 14}" y="${y + 25}" font-family="${FONT}" font-size="20"
              fill="#d8d8d8">${escapeXml(item)}</text>`;
    })
    .join('');

  const titleY = 250;
  const subtitleY = 306;

  return Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${BACKGROUND}" stop-opacity="1" />
          <stop offset="55%" stop-color="${BACKGROUND}" stop-opacity="0.92" />
          <stop offset="100%" stop-color="${BACKGROUND}" stop-opacity="0.2" />
        </linearGradient>
      </defs>
      ${
        // Screenshots need a scrim so the text stays readable over them. The
        // generated backgrounds are already dark, and a scrim there would just
        // flatten the accent glow they exist to show.
        stack ? '' : `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#scrim)" />`
      }
      <rect x="80" y="150" width="64" height="5" fill="${accent}" />
      <text x="80" y="${titleY}" font-family="${FONT}" font-size="66"
            font-weight="bold" fill="#ffffff">${escapeXml(title)}</text>
      <text x="80" y="${subtitleY}" font-family="${FONT}" font-size="30"
            fill="#b4b4b4">${escapeXml(subtitle)}</text>
      ${chips}
      <text x="80" y="560" font-family="${FONT}" font-size="26" fill="${accent}">
        Jatin Mangla — Frontend Developer
      </text>
    </svg>
  `);
}

/** A dark panel with a soft accent glow, for projects with no screenshot. */
async function generatedBackground(accent) {
  const svg = Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="78%" cy="32%" r="55%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.55" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
        </radialGradient>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M48 0H0V48" fill="none" stroke="${accent}" stroke-opacity="0.16" />
        </pattern>
      </defs>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="${BACKGROUND}" />
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)" />
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" />
    </svg>
  `);

  return sharp(svg).png().toBuffer();
}

/** The screenshot, with any `blur` regions (in source pixels) obscured. */
async function screenshotSource({ screenshot, blur = [] }) {
  const source = fs.readFileSync(path.join(ASSETS, screenshot));
  const patches = await Promise.all(
    blur.map(async region => ({
      input: await sharp(source).extract(region).blur(8).toBuffer(),
      left: region.left,
      top: region.top,
    }))
  );

  return patches.length ? sharp(source).composite(patches).png().toBuffer() : source;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  for (const project of projects) {
    const background = project.screenshot
      ? await sharp(await screenshotSource(project))
          .resize({ width: WIDTH, height: HEIGHT, fit: 'cover', position: 'right top' })
          .toBuffer()
      : await generatedBackground(project.accent);

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
