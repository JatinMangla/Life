import { createCookieSessionStorage } from '@remix-run/node';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret && process.env.NODE_ENV === 'production') {
  throw new Error('SESSION_SECRET environment variable must be set in production');
}

/**
 * Shared cookie session storage for theme persistence.
 * Defined at module level to avoid recreating on every request.
 */
export const { getSession, commitSession } = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 604_800, // 7 days in seconds
    path: '/',
    sameSite: 'lax',
    secrets: [sessionSecret || 'development-secret'],
    secure: process.env.NODE_ENV === 'production',
  },
});