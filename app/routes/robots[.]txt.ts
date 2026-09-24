import { canonicalUrlFor } from '~/utils/url';

/**
 * Generated so the sitemap line follows `config.url`. The static file
 * hard-coded the deployment URL, one of several places a domain change would
 * otherwise have to be remembered.
 */
export function loader() {
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${canonicalUrlFor('/sitemap.xml')}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
