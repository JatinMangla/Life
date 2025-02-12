import pkg from 'react-dom/server';
const { renderToPipeableStream } = pkg;
import { RemixServer } from '@remix-run/react';
import { Writable } from 'stream';

export default function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  return new Promise((resolve, reject) => {
    let body = '';
    const writable = new Writable({
      write(chunk, encoding, callback) {
        body += chunk.toString();
        callback();
      },
    });
    writable.on('finish', () => {
      responseHeaders.set('Content-Type', 'text/html');
      resolve(new Response(body, {
        status: responseStatusCode,
        headers: responseHeaders,
      }));
    });

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onShellReady() {
          // When the shell is ready, pipe the output to our writable stream.
          pipe(writable);
        },
        onShellError(err) {
          reject(err);
        },
        onError(err) {
          console.error(err);
        },
      }
    );
  });
}
