/**
 * Re-encode project screenshots as WebP.
 *
 * PNG is the wrong format for UI screenshots at this size — WebP is typically
 * 60-80% smaller at visually identical quality, and is supported by every
 * browser this site targets.
 *
 * Usage: node scripts/optimize-images.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const ASSETS = path.join(__dirname, '..', 'app', 'assets');
const SOURCE_PATTERN = /^(mm|sc)-.*\.png$/i;

async function main() {
  const files = fs
    .readdirSync(ASSETS)
    .filter(file => SOURCE_PATTERN.test(file) && !file.includes('-placeholder'));

  let saved = 0;

  for (const file of files) {
    const input = path.join(ASSETS, file);
    const output = input.replace(/\.png$/i, '.webp');
    const before = fs.statSync(input).size;

    // Read into memory first: sharp holds a handle on the source file, which
    // interferes with removing it afterwards on Windows.
    const buffer = await sharp(fs.readFileSync(input))
      .webp({ quality: 82, effort: 5 })
      .toBuffer();

    fs.writeFileSync(output, buffer);
    fs.unlinkSync(input);

    saved += before - buffer.length;

    console.info(
      `  ${file} ${(before / 1024).toFixed(0)}KB -> ${path.basename(output)} ${(buffer.length / 1024).toFixed(0)}KB`
    );
  }

  console.info(`[optimize-images] saved ${(saved / 1024 / 1024).toFixed(2)}MB`);
}

main().catch(error => {
  console.error(`[optimize-images] ${error.message}`);
  process.exitCode = 1;
});
