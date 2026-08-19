import nodemailer from 'nodemailer';
import { json } from '@remix-run/node';
import type { ActionFunctionArgs } from '@remix-run/node';
import type { Transporter } from 'nodemailer';

// Resource route: handles contact-form submissions on the server only.
// It has no default (component) export, so Remix never builds a client bundle
// for it — nodemailer and the credentials stay entirely server-side.

const MAX_EMAIL_LENGTH = 512;
const MAX_MESSAGE_LENGTH = 4096;
const MAX_NAME_LENGTH = 100;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Without these the route cannot send anything. */
const REQUIRED_ENV = ['GMAIL_USER', 'GMAIL_APP_PASSWORD'] as const;

// Strip CR/LF so user input can never inject extra email headers.
const stripNewlines = (value: string): string => value.replace(/[\r\n]+/g, ' ').trim();

// Reuse a single pooled SMTP transport across (warm) invocations instead of
// opening a fresh connection on every submission.
let transporter: Transporter | undefined;
function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      pool: true,
      maxConnections: 1,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

// Lightweight in-memory rate limiter. On serverless this is per-instance only
// (not a global guarantee), but it still blunts bursts from a single client.
// For a hard global limit, back this with a shared store (e.g. Upstash Redis).
const RATE_LIMIT_MAX = 5; // submissions
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes
const rateLimitHits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (rateLimitHits.get(key) ?? []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (hits.length >= RATE_LIMIT_MAX) {
    rateLimitHits.set(key, hits);
    return true;
  }
  hits.push(now);
  rateLimitHits.set(key, hits);
  // Opportunistic cleanup so the Map can't grow unbounded.
  if (rateLimitHits.size > 5000) {
    for (const [k, ts] of rateLimitHits) {
      if (ts.every(t => now - t >= RATE_LIMIT_WINDOW_MS)) rateLimitHits.delete(k);
    }
  }
  return false;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

// Reject cross-site POSTs: a legitimate submission always carries an Origin
// (or at least a Referer) matching this deployment's host.
function isSameOrigin(request: Request): boolean {
  const host = request.headers.get('host');
  if (!host) return false;
  const source = request.headers.get('origin') ?? request.headers.get('referer');
  if (!source) return false;
  try {
    return new URL(source).host === host;
  } catch {
    return false;
  }
}

/** Field-level validation messages, plus a catch-all for transport failures. */
export interface ContactErrors {
  general?: string;
  name?: string;
  email?: string;
  message?: string;
}

export interface ContactActionData {
  success?: boolean;
  /** Echoed back so the success message can greet the sender by name. */
  name?: string;
  errors?: ContactErrors;
}

export async function action({ request }: ActionFunctionArgs) {
  if (!isSameOrigin(request)) {
    return json({ errors: { general: 'Invalid request origin.' } }, { status: 403 });
  }

  if (isRateLimited(getClientIp(request))) {
    return json(
      { errors: { general: 'Too many messages. Please try again later.' } },
      { status: 429 }
    );
  }

  const formData = await request.formData();
  const isBot = formData.get('website') ?? '';
  const senderName = stripNewlines(String(formData.get('name') ?? ''));
  const email = stripNewlines(String(formData.get('email') ?? ''));
  const message = String(formData.get('message') ?? '').trim();
  const errors: ContactErrors = {};

  // Honeypot — silently succeed for bots
  if (isBot) return json({ success: true });

  if (!senderName) {
    errors.name = 'Please enter your name.';
  }

  if (senderName.length > MAX_NAME_LENGTH) {
    errors.name = `Name must be shorter than ${MAX_NAME_LENGTH} characters.`;
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    errors.email = `Email address must be shorter than ${MAX_EMAIL_LENGTH} characters.`;
  }

  if (!message) {
    errors.message = 'Please enter a message.';
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Message must be shorter than ${MAX_MESSAGE_LENGTH} characters.`;
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  const missingEnv = REQUIRED_ENV.filter(key => !process.env[key]);

  if (missingEnv.length > 0) {
    // Names only, never values, and only to the server log. Without this the
    // failure is indistinguishable from a broken mail server, and the only
    // clue is a generic message in the browser.
    console.error(
      `[contact] missing environment variable(s): ${missingEnv.join(', ')}. ` +
        'Set them for the Production environment in Vercel, then redeploy — ' +
        'environment changes do not apply to existing deployments.'
    );

    return json(
      { errors: { general: 'Server misconfiguration. Please try again later.' } },
      { status: 500 }
    );
  }

  try {
    await getTransporter().sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_TO || process.env.GMAIL_USER,
      subject: `Portfolio message from ${senderName}`,
      text: `Name: ${senderName}\nEmail: ${email}\n\nMessage:\n${message}`,
      replyTo: email,
    });

    return json({ success: true, name: senderName });
  } catch (err) {
    // Gmail rejects app passwords that have been revoked or belong to an
    // account without 2FA; the code distinguishes that from a network fault.
    const { code, responseCode, message } = (err ?? {}) as {
      code?: string;
      responseCode?: number;
      message?: string;
    };

    console.error(
      `[contact] send failed${code ? ` (${code})` : ''}` +
        `${responseCode ? ` smtp ${responseCode}` : ''}: ${message ?? String(err)}`
    );
    return json(
      { errors: { general: 'Failed to send message. Please try again.' } },
      { status: 500 }
    );
  }
}

// A bare GET to /api/contact has nothing to render
export function loader() {
  return json({ message: 'Contact endpoint. POST to send a message.' });
}
