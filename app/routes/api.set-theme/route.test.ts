// @vitest-environment node
import { beforeAll, describe, expect, it } from 'vitest';
import { installGlobals } from '@remix-run/node';
import type { ActionFunctionArgs } from '@remix-run/node';
import { action } from './route';

const ORIGIN = 'https://example.test';

function post(theme: string, origin = ORIGIN) {
  const body = new FormData();
  body.set('theme', theme);

  return new Request(`${ORIGIN}/api/set-theme`, {
    method: 'POST',
    body,
    headers: { host: 'example.test', origin },
  });
}

const call = (request: Request) => action({ request } as ActionFunctionArgs);

beforeAll(() => {
  installGlobals();
});

describe('POST /api/set-theme', () => {
  it.each(['light', 'dark'])('stores %s in the session cookie', async theme => {
    const response = await call(post(theme));

    expect(response.status).toBe(200);
    expect(response.headers.get('set-cookie')).toMatch(/^__session=/);
  });

  it('refuses any other value instead of writing it into the cookie', async () => {
    const response = await call(post('x'.repeat(5000)));

    expect(response.status).toBe(400);
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it('refuses a cross-site request', async () => {
    const response = await call(post('light', 'https://evil.test'));

    expect(response.status).toBe(403);
  });
});
