/**
 * Serve the production build locally, the way Vercel runs it.
 *
 * The dev server differs from production in ways that have hidden bugs:
 * StrictMode double effects, unbundled CSS order, no CSP header. This runs the
 * Remix server build behind a plain Node HTTP server so the browser suite can
 * target it:
 *
 *   npm run build
 *   NODE_ENV=production node scripts/serve-build.mjs      # port 7778
 *   BASE_URL=http://localhost:7778 npx playwright test
 */
import { createReadStream, existsSync, readdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequestHandler, installGlobals } from '@remix-run/node';

installGlobals();

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLIENT = path.join(ROOT, 'build', 'client');
const SERVER = path.join(ROOT, 'build', 'server');
const PORT = Number(process.env.PORT ?? 7778);

// The Vercel preset nests the server build in a runtime-named folder.
const serverDir = readdirSync(SERVER)
  .map(name => path.join(SERVER, name))
  .find(dir => existsSync(path.join(dir, 'index.js')));

if (!serverDir) throw new Error('No server build found; run `npm run build` first.');

const build = await import(pathToFileURL(path.join(serverDir, 'index.js')).href);
const handle = createRequestHandler(build, 'production');

const TYPES = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.woff2': 'font/woff2',
  '.glb': 'model/gltf-binary',
  '.wasm': 'application/wasm',
  '.mp4': 'video/mp4',
  '.json': 'application/json',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
};

function staticFile(pathname) {
  const file = path.join(CLIENT, decodeURIComponent(pathname));

  if (!file.startsWith(CLIENT) || !existsSync(file) || !statSync(file).isFile()) {
    return null;
  }

  return file;
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
  const file = url.pathname !== '/' && staticFile(url.pathname);

  if (file) {
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream',
    });
    createReadStream(file).pipe(res);
    return;
  }

  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) value.forEach(item => headers.append(key, item));
    else if (value !== undefined) headers.set(key, value);
  }

  // Buffered rather than streamed: installGlobals() swaps in Remix's own web
  // streams, which Node's Readable.toWeb/fromWeb adapters reject.
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  const chunks = [];

  if (hasBody) for await (const chunk of req) chunks.push(chunk);

  const request = new Request(url.href, {
    method: req.method,
    headers,
    body: hasBody ? Buffer.concat(chunks) : undefined,
  });

  try {
    const response = await handle(request);

    res.statusCode = response.status;

    for (const [key, value] of response.headers) {
      if (key.toLowerCase() === 'set-cookie') continue;
      res.setHeader(key, value);
    }

    const cookies = response.headers.getSetCookie?.() ?? [];
    if (cookies.length) res.setHeader('Set-Cookie', cookies);

    if (response.body) {
      const reader = response.body.getReader();

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }

    res.end();
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}).listen(PORT, () => {
  console.info(`Production build on http://localhost:${PORT}`);
});
