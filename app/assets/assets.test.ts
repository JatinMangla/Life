// @vitest-environment node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

/**
 * Declared image sizes have to match the files.
 *
 * The browser picks a srcset candidate by its `w` descriptor and reserves
 * layout space from width/height. The Mera Monitor case study declared 856px
 * screenshots as 1280w at 1280x800 and a 371x91 strip as 1280x800, so images
 * were upscaled, distorted and shifted the layout — and the Image unit test
 * passed, because it only checked the attributes existed.
 *
 * This reads the real dimensions and checks every srcset literal in the app
 * against them.
 */

const APP = path.resolve(__dirname, '..');
const ASSETS = path.join(APP, 'assets');

interface Declaration {
  file: string;
  asset: string;
  descriptor: number;
  declared?: { width: number; height: number };
}

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) return sourceFiles(full);
    if (/\.(tsx|ts)$/.test(entry.name) && !/\.(test|stories)\./.test(entry.name)) {
      return [full];
    }

    return [];
  });
}

function collectDeclarations(): Declaration[] {
  const declarations: Declaration[] = [];

  for (const file of sourceFiles(APP)) {
    const source = fs.readFileSync(file, 'utf8');
    const imports = new Map<string, string>();

    for (const [, name, asset] of source.matchAll(
      /import (\w+) from '~\/assets\/([^']+\.(?:webp|jpe?g|png|gif))';/g
    )) {
      imports.set(name!, asset!);
    }

    // `const SCREENSHOT = { width: 856, height: 583 }` style size constants.
    const constants = new Map<string, { width: number; height: number }>();

    for (const [, name, width, height] of source.matchAll(
      /const (\w+) = \{ width: (\d+), height: (\d+) \}/g
    )) {
      constants.set(name!, { width: Number(width), height: Number(height) });
    }

    for (const match of source.matchAll(/srcSet(?:=\{|:\s*)`([^`]+)`/g)) {
      // The JSX element (or object literal) this srcSet belongs to, for its
      // width/height props.
      const start = source.lastIndexOf('<', match.index);
      const end = source.indexOf('/>', match.index);
      const element = source.slice(start, end === -1 ? undefined : end);

      let declared: Declaration['declared'];
      const spread = element.match(/\{\.\.\.(\w+)\}/);
      const width = element.match(/width=\{(\d+)\}/);
      const height = element.match(/height=\{(\d+)\}/);

      if (spread && constants.has(spread[1]!)) {
        declared = constants.get(spread[1]!);
      } else if (width && height) {
        declared = { width: Number(width[1]), height: Number(height[1]) };
      }

      for (const candidate of match[1]!.split(',')) {
        const parts = candidate.trim().match(/^\$\{(\w+)\} (?:(\d+)|\$\{(\w+)\.width\})w$/);

        if (!parts) continue;

        const asset = imports.get(parts[1]!);

        if (!asset) continue;

        const descriptor = parts[2]
          ? Number(parts[2])
          : (constants.get(parts[3]!)?.width ?? Number.NaN);

        declarations.push({
          file: path.relative(APP, file),
          asset,
          descriptor,
          declared,
        });
      }
    }
  }

  return declarations;
}

const declarations = collectDeclarations();

describe('image assets', () => {
  it('finds the srcsets it is meant to check', () => {
    // Guards the parser: if a refactor changes the syntax and nothing
    // matches, every other assertion here would pass vacuously.
    expect(declarations.length).toBeGreaterThan(10);
  });

  it.each(declarations.map(d => [`${d.asset} in ${d.file}`, d] as const))(
    '%s declares its real width and aspect ratio',
    async (_, { asset, descriptor, declared }) => {
      const { width, height } = await sharp(path.join(ASSETS, asset)).metadata();

      expect(descriptor, 'srcset w descriptor').toBe(width);

      if (declared && width && height) {
        // Ratio rather than exact size: a srcset with several candidates
        // declares one set of dimensions for all of them.
        expect(declared.width / declared.height, 'declared aspect ratio').toBeCloseTo(
          width / height,
          1
        );
      }
    }
  );

  it('keeps every raster asset under 400KB', () => {
    const heavy = fs
      .readdirSync(ASSETS)
      .filter(file => /\.(webp|jpe?g|png|gif)$/.test(file))
      .map(file => ({ file, kb: fs.statSync(path.join(ASSETS, file)).size / 1024 }))
      .filter(({ kb }) => kb > 400);

    expect(heavy).toEqual([]);
  });
});
