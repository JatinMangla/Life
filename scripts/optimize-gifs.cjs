/**
 * Re-encode animated GIFs as animated WebP.
 *
 * GIF is a terrible delivery format for screen recordings — these four files
 * were ~10MB combined. Animated WebP renders in a plain <img>, so no component
 * changes are needed, and is supported everywhere this site targets.
 *
 * Usage: node scripts/optimize-gifs.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const ASSETS = path.join(__dirname, '..', 'app', 'assets');

async function main() {
  const gifs = fs.readdirSync(ASSETS).filter(file => file.endsWith('.gif'));

  for (const file of gifs) {
    const input = path.join(ASSETS, file);
    const output = input.replace(/\.gif$/, '.webp');
    const before = fs.statSync(input).size;

    if (fs.existsSync(output)) {
      console.info(`  ${file}: ${path.basename(output)} already exists, skipping`);
      continue;
    }

    await sharp(fs.readFileSync(input), { animated: true, limitInputPixels: false })
      .webp({ quality: 70, effort: 5 })
      .toFile(output);

    const after = fs.statSync(output).size;

    // Small or already-efficient GIFs can come out larger as WebP. Keeping
    // those would be a regression, so drop the output and leave the GIF.
    if (after >= before) {
      fs.unlinkSync(output);
      console.info(`  ${file}: WebP was larger, keeping the GIF`);
      continue;
    }

    const saved = Math.round((1 - after / before) * 100);
    console.info(
      `  ${file} ${(before / 1024 / 1024).toFixed(2)}MB -> ` +
        `${path.basename(output)} ${(after / 1024 / 1024).toFixed(2)}MB (-${saved}%)`
    );
  }
}

main().catch(error => {
  console.error(`[optimize-gifs] ${error.message}`);
  process.exitCode = 1;
});
