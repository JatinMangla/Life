const fs = require('fs');
const path = require('path');

function findFiles(dir, ext, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findFiles(fullPath, ext, files);
    } else if (entry.name.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = findFiles('app', '.module.css');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Remove @layer name { opening
  content = content.replace(/@layer\s+\w+\s*\{/g, '');
  
  // Remove matching closing braces at end of lines (the } that closes @layer)
  // Since @layer is at the very end, remove the last solitary } on its own line
  // Simple approach: remove any line that is just whitespace + }
  content = content.replace(/^[\t ]+\}[ \t]*\n/gm, '');
  
  // Clean up excessive blank lines
  content = content.replace(/\n{3,}/g, '\n\n');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed: ${file}`);
  }
}
console.log('Done!');