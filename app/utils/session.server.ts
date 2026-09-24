import { createCookieSessionStorage } from '@remix-run/node';

const sessionSecret = process.env.SESSION_SECRET;

// This cookie only remembers light or dark mode. Throwing here took down every
// route — Vercel Preview deployments run with NODE_ENV=production and don't
// get Production-only variables — for the sake of a colour preference. A
// forged cookie can at worst pick the other theme, so warn instead.
if (!sessionSecret && process.env.NODE_ENV === 'production') {
  console.warn(
    '[session] SESSION_SECRET is not set; the theme cookie is signed with a ' +
      'fallback secret. Set it for Production and Preview in Vercel.'
  );
}

/**
 * Shared cookie session storage for theme persistence.
 * Defined at module level to avoid recreating on every request.
 */
export const { getSession, commitSession } = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 31_536_000, // a year: a theme choice shouldn't expire weekly
    path: '/',
    sameSite: 'lax',
    secrets: [sessionSecret || 'development-secret'],
    secure: process.env.NODE_ENV === 'production',
  },
});
