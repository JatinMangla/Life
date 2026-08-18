/**
 * Generate blur-up placeholders for every project asset that doesn't have one.
 *
 * The Image component cross-fades a tiny placeholder into the full-resolution
 * image. Passing the full-size file as its own placeholder (which several
 * project pages used to do) downloads a multi-megabyte asset twice and defeats
 * the whole pattern.
 *
 * Usage: node scripts/placeholders.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const ASSETS = path.join(__dirname, '..', 'app', 'assets');
const PLACEHOLDER_WIDTH = 24;
const SOURCE_PATTERN = /^(mm|sc)-.*\.(png|jpe?g|gif)$/i;

async function main() {
  const files = fs
    .readdirSync(ASSETS)
    .filter(file => SOURCE_PATTERN.test(file) && !file.includes('-placeholder'));

  let written = 0;

  for (const file of files) {
    const base = file.replace(/\.[^.]+$/, '');
    const output = path.join(ASSETS, `${base}-placeholder.jpg`);

    if (fs.existsSync(output)) continue;

    // `animated: false` takes the first frame of a GIF rather than failing.
    await sharp(path.join(ASSETS, file), { animated: false })
      .resize(PLACEHOLDER_WIDTH)
      .jpeg({ quality: 50 })
      .toFile(output);

    written += 1;
    console.info(`  ${path.basename(output)}`);
  }

  console.info(`[placeholders] wrote ${written} file(s)`);
}

main().catch(error => {
  console.error(`[placeholders] ${error.message}`);
  process.exitCode = 1;
});
