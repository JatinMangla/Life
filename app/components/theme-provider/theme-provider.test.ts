import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LAYER_ORDER, themeStyles } from './theme-provider';

describe('cascade layer order', () => {
  // Whichever stylesheet names a layer first fixes the order. The inline
  // theme style is the first CSS in every document, so it has to carry the
  // order — otherwise per-page stylesheet order decides, and on /contact the
  // reset outranked the navbar and component styles.
  it('opens the inline theme styles', () => {
    expect(themeStyles.trimStart().startsWith(LAYER_ORDER)).toBe(true);
  });

  it('matches the order declared in reset.css', () => {
    const reset = readFileSync(resolve(process.cwd(), 'app/reset.css'), 'utf8');
    const declared = reset.match(/@layer [a-z, ]+;/)?.[0];

    expect(declared).toBe(LAYER_ORDER);
  });
});
