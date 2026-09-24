import config from '~/config.json';

/**
 * The one URL form the site advertises for a path: the root keeps its
 * trailing slash, everything else drops it.
 *
 * Canonical tags, og:url and the sitemap each used to pick their own form,
 * so the homepage was `…app` in one place and `…app/` in another — two URLs
 * that search engines treat as distinct pages.
 */
export function canonicalUrlFor(pathname: string): string {
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

  return new URL(trimmed || '/', config.url).href;
}
