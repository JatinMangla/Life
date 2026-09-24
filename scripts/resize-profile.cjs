/**
 * Build both portrait candidates from one crop of the full-size photo.
 *
 * profile.jpeg (480w) and profileFull.jpeg (960w) used to be two different
 * shots — a tight waist-up crop and a full-length one — so which framing a
 * visitor saw depended on their screen's pixel density, and the declared
 * 960x1100 matched neither. Both are now the same crop at two widths.
 *
 * Usage: node scripts/resize-profile.cjs path/to/original.jpeg
 * Run it on the original photo, not on its own output: JPEG is lossy, so
 * re-encoding an already-processed file only loses quality.
 */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const ASSETS = path.join(__dirname, '..', 'app', 'assets');

/** Width:height of the portrait, and of the width/height declared in profile.tsx. */
const ASPECT = 960 / 1143;
/** Fraction of the source height trimmed from the top (sky and treeline). */
const TOP_TRIM = 0.125;

async function main() {
  const source = process.argv[2];

  if (!source) throw new Error('pass the original photo: node scripts/resize-profile.cjs <file>');

  // Read into memory: sharp holds a handle on the source file, which blocks
  // overwriting it in place on Windows.
  const input = fs.readFileSync(source);
  const { width = 0, height = 0 } = await sharp(input).metadata();
  const cropHeight = Math.round(width / ASPECT);

  if (cropHeight > height) {
    console.info('  source is already at or wider than the target aspect, skipping');
    return;
  }

  const top = Math.min(Math.round(height * TOP_TRIM), height - cropHeight);
  const cropped = await sharp(input)
    .extract({ left: 0, top, width, height: cropHeight })
    .toBuffer();

  for (const [output, outputWidth] of [
    ['profileFull.jpeg', 960],
    ['profile.jpeg', 480],
  ]) {
    const buffer = await sharp(cropped)
      .resize({ width: outputWidth, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    fs.writeFileSync(path.join(ASSETS, output), buffer);
    console.info(`  ${output}: ${(buffer.length / 1024).toFixed(0)}KB at ${outputWidth}px wide`);
  }

  // The blur-up stand-in has to share the crop too, or the portrait visibly
  // reframes as the real image fades in.
  await sharp(cropped)
    .resize({ width: 24 })
    .jpeg({ quality: 50 })
    .toFile(path.join(ASSETS, 'profile-placeholder.jpg'));
  console.info('  profile-placeholder.jpg');
}

main().catch(error => {
  console.error(`[resize-profile] ${error.message}`);
  process.exitCode = 1;
});
