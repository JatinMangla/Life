import { createContext, useContext } from 'react';

/**
 * Per-request nonce for inline and module scripts, provided by
 * entry.server.tsx. Undefined on the client, where it's no longer needed:
 * browsers hide nonce values from the DOM once the page has loaded.
 */
export const NonceContext = createContext<string | undefined>(undefined);

export const useNonce = () => useContext(NonceContext);

/**
 * The site's Content Security Policy.
 *
 * Scripts need the request's nonce; `strict-dynamic` then trusts what those
 * scripts load (route chunks, Vercel Analytics), so no host allowlist has to
 * be kept in step with the bundle. `wasm-unsafe-eval` and blob workers are for
 * the Draco decoder that unpacks the 3D models. Inline styles stay allowed:
 * motion and theme tokens are applied through style attributes throughout.
 *
 * Shipped as Report-Only first — see entry.server.tsx.
 */
export function contentSecurityPolicy(nonce: string): string {
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'wasm-unsafe-eval'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self'`,
    `media-src 'self'`,
    `connect-src 'self' blob: data:`,
    `worker-src 'self' blob:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ].join('; ');
}
