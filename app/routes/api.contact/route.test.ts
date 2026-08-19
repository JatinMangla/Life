// @vitest-environment node
//
// This route only ever runs on the server, and the fetch polyfill Remix
// installs is built for Node, not jsdom. Running it under jsdom made the
// polyfilled Request.formData() fail in ways production never would.
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { installGlobals } from '@remix-run/node';
import type { ActionFunctionArgs } from '@remix-run/node';
import type { ContactActionData } from './route';

const sendMail = vi.fn();

vi.mock('nodemailer', () => ({
  default: { createTransport: () => ({ sendMail }) },
}));

const ORIGIN = 'https://example.test';

function post(fields: Record<string, string>, headers: Record<string, string> = {}) {
  const body = new FormData();

  for (const [key, value] of Object.entries(fields)) {
    body.set(key, value);
  }

  return new Request(`${ORIGIN}/api/contact`, {
    method: 'POST',
    body,
    headers: { host: 'example.test', origin: ORIGIN, ...headers },
  });
}

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Hello there.',
};

async function callAction(request: Request) {
  const { action } = await import('./route');
  const response = await action({ request } as ActionFunctionArgs);

  return {
    status: response.status,
    data: (await response.json()) as ContactActionData,
  };
}

/**
 * Run against the same globals production uses.
 *
 * Remix calls installGlobals() on the server, which swaps the native Response
 * for @remix-run/web-fetch's. That implementation has no static `json`, so
 * `Response.json(...)` — which this route used to call — is undefined and
 * throws before any reply is sent. The endpoint 500'd on every request in
 * production while passing every test here, because the test environment kept
 * Node's native Response.
 */
beforeAll(() => {
  installGlobals();
});

describe('POST /api/contact', () => {
  it('runs under the production Response implementation', () => {
    // If this ever fails, the polyfill has gained a static json() and the
    // note above is out of date.
    expect(typeof (Response as { json?: unknown }).json).toBe('undefined');
  });

  it('answers a GET with a plain message rather than throwing', async () => {
    const { loader } = await import('./route');
    const response = loader();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toHaveProperty('message');
  });

  beforeEach(() => {
    vi.resetModules();
    sendMail.mockReset().mockResolvedValue({ messageId: 'test' });
    process.env.GMAIL_USER = 'me@example.com';
    process.env.GMAIL_APP_PASSWORD = 'app-password';
  });

  afterEach(() => {
    delete process.env.GMAIL_USER;
    delete process.env.GMAIL_APP_PASSWORD;
  });

  it('sends the message for a valid submission', async () => {
    const { status, data } = await callAction(post(valid));

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.name).toBe('Ada Lovelace');
    expect(sendMail).toHaveBeenCalledOnce();
    expect(sendMail.mock.calls[0]?.[0]).toMatchObject({ replyTo: 'ada@example.com' });
  });

  it('rejects a cross-site POST', async () => {
    const request = post(valid, { origin: 'https://evil.test' });
    const { status, data } = await callAction(request);

    expect(status).toBe(403);
    expect(data.errors?.general).toMatch(/origin/i);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('silently succeeds for the honeypot without sending anything', async () => {
    const { data } = await callAction(post({ ...valid, website: 'spam' }));

    expect(data.success).toBe(true);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('strips CRLF from the name so headers cannot be injected', async () => {
    const request = post({
      ...valid,
      name: 'Ada\r\nBcc: victim@example.com',
    });

    await callAction(request);

    const subject = sendMail.mock.calls[0]?.[0].subject as string;

    expect(subject).not.toMatch(/[\r\n]/);
    expect(subject).toContain('Bcc: victim@example.com');
  });

  it('reports field errors and sends nothing when input is invalid', async () => {
    const { data } = await callAction(post({ name: '', email: 'nope', message: '' }));

    expect(data.errors?.name).toBeTruthy();
    expect(data.errors?.email).toBeTruthy();
    expect(data.errors?.message).toBeTruthy();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('rate limits after five submissions from the same client', async () => {
    const { action } = await import('./route');

    const send = () =>
      action({
        request: post(valid, { 'x-forwarded-for': '203.0.113.5' }),
      } as ActionFunctionArgs);

    for (let i = 0; i < 5; i += 1) {
      expect((await send()).status).toBe(200);
    }

    const blocked = await send();

    expect(blocked.status).toBe(429);
    expect(sendMail).toHaveBeenCalledTimes(5);
  });

  it('fails cleanly when the mail credentials are missing', async () => {
    delete process.env.GMAIL_USER;

    const { status, data } = await callAction(post(valid));

    expect(status).toBe(500);
    expect(data.errors?.general).toBeTruthy();
    expect(sendMail).not.toHaveBeenCalled();
  });
});
