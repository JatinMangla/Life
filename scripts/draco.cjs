const fs = require('node:fs');
const path = require('node:path');

// Copy the Draco decoder out of three.js so GLB models can be decompressed at
// runtime. Uses node:fs directly so postinstall doesn't depend on a package
// that isn't declared in this project's own dependencies.
const src = path.join('node_modules', 'three', 'examples', 'jsm', 'libs', 'draco', 'gltf');
const output = path.join('public', 'draco');
const files = ['draco_decoder.wasm', 'draco_wasm_wrapper.js'];

try {
  fs.mkdirSync(output, { recursive: true });

  for (const file of files) {
    fs.copyFileSync(path.join(src, file), path.join(output, file));
  }
} catch (error) {
  console.error(`[draco] failed to copy decoder: ${error.message}`);
  process.exitCode = 1;
}
