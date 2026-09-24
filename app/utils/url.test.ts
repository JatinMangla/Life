import { describe, expect, it } from 'vitest';
import config from '~/config.json';
import { canonicalUrlFor } from './url';

describe('canonicalUrlFor', () => {
  it('keeps the trailing slash on the root only', () => {
    expect(canonicalUrlFor('/')).toBe(`${config.url}/`);
    expect(canonicalUrlFor('')).toBe(`${config.url}/`);
  });

  it('drops trailing slashes everywhere else', () => {
    expect(canonicalUrlFor('/projects/mera-monitor/')).toBe(
      `${config.url}/projects/mera-monitor`
    );
    expect(canonicalUrlFor('/uses//')).toBe(`${config.url}/uses`);
  });
});
