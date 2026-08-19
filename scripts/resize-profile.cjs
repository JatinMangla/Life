/**
 * Resize the portrait to the widths its srcSet actually advertises.
 *
 * The source files were 2235px and 2773px wide but declared as 480w and 960w,
 * so the browser downloaded 1.2MB of pixels to paint a 480px-wide image.
 *
 * Usage: node scripts/resize-profile.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const ASSETS = path.join(__dirname, '..', 'app', 'assets');

const targets = [
  { source: 'profile.jpeg', output: 'profile.jpeg', width: 480 },
  { source: 'profileFull.jpeg', output: 'profileFull.jpeg', width: 960 },
];

async function main() {
  for (const { source, output, width } of targets) {
    const input = path.join(ASSETS, source);
    const before = fs.statSync(input).size;
    const sourceBuffer = fs.readFileSync(input);
    const { width: currentWidth = 0 } = await sharp(sourceBuffer).metadata();

    // Idempotent: JPEG is lossy, so re-encoding an already-resized file just
    // loses quality. Running this script twice must be a no-op.
    if (currentWidth <= width) {
      console.info(`  ${output}: already ${currentWidth}px wide, skipping`);
      continue;
    }

    // sharp keeps a handle on the source file, which blocks overwriting it
    // in place on Windows — hence reading into memory above.
    const buffer = await sharp(sourceBuffer)
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    fs.writeFileSync(path.join(ASSETS, output), buffer);

    console.info(
      `  ${output}: ${(before / 1024).toFixed(0)}KB -> ${(buffer.length / 1024).toFixed(0)}KB at ${width}px wide`
    );
  }
}

main().catch(error => {
  console.error(`[resize-profile] ${error.message}`);
  process.exitCode = 1;
});
