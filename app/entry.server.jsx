import pkg from 'react-dom/server';
const { renderToReadableStream } = pkg;
import { RemixServer } from '@remix-run/react';

export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  const stream = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />
  );
  responseHeaders.set('Content-Type', 'text/html');
  return new Response(stream, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
