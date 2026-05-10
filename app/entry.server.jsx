import { RemixServer } from '@remix-run/react';
import { handleRequest as vercelHandleRequest } from '@vercel/remix';

export default function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  const remixServer = <RemixServer context={remixContext} url={request.url} />;

  return vercelHandleRequest(request, responseStatusCode, responseHeaders, remixServer);
}
