import { RemixServer } from '@remix-run/react';
import { handleRequest as vercelHandleRequest } from '@vercel/remix';
import type { EntryContext } from '@remix-run/node';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const remixServer = <RemixServer context={remixContext} url={request.url} />;

  return vercelHandleRequest(request, responseStatusCode, responseHeaders, remixServer);
}
