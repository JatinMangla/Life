import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

describe('POST /api/contact', () => {
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
