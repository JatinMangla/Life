import { randomBytes } from 'node:crypto';
import { RemixServer } from '@remix-run/react';
import { handleRequest as vercelHandleRequest } from '@vercel/remix';
import type { EntryContext } from '@remix-run/node';
import { NonceContext, contentSecurityPolicy } from '~/utils/csp';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const nonce = randomBytes(16).toString('base64');

  // Report-Only: browsers log what the policy would block without blocking
  // it. Once a deployment runs clean, rename the header to enforce it and
  // drop the looser static CSP in vercel.json. Production only, because the
  // Vite dev server injects its own unnonced scripts.
  if (process.env.NODE_ENV === 'production') {
    responseHeaders.set('Content-Security-Policy-Report-Only', contentSecurityPolicy(nonce));
  }

  const remixServer = (
    <NonceContext.Provider value={nonce}>
      <RemixServer context={remixContext} url={request.url} nonce={nonce} />
    </NonceContext.Provider>
  );

  return vercelHandleRequest(request, responseStatusCode, responseHeaders, remixServer);
}
