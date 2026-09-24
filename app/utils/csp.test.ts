import { describe, expect, it } from 'vitest';
import { contentSecurityPolicy } from './csp';

const directives = (policy: string) =>
  Object.fromEntries(
    policy.split(';').map(part => {
      const [name, ...values] = part.trim().split(/\s+/);
      return [name, values];
    })
  );

describe('contentSecurityPolicy', () => {
  const policy = directives(contentSecurityPolicy('abc123'));

  it('only runs scripts carrying this request’s nonce', () => {
    expect(policy['script-src']).toContain(`'nonce-abc123'`);
    expect(policy['script-src']).not.toContain(`'unsafe-inline'`);
    expect(policy['script-src']).not.toContain(`'unsafe-eval'`);
  });

  it('shuts the classic injection routes', () => {
    expect(policy['object-src']).toEqual([`'none'`]);
    expect(policy['base-uri']).toEqual([`'self'`]);
    expect(policy['form-action']).toEqual([`'self'`]);
    expect(policy['frame-ancestors']).toEqual([`'none'`]);
  });

  it('lets the Draco decoder compile WebAssembly in a blob worker', () => {
    expect(policy['script-src']).toContain(`'wasm-unsafe-eval'`);
    expect(policy['worker-src']).toContain('blob:');
  });
});
