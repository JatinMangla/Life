import config from '~/config.json';
import { projects, projectPath } from '~/data/projects';

/**
 * Generated rather than hand-maintained. The previous static file listed a
 * project that no longer exists and pointed at a different origin than
 * `config.url`, so canonical tags and the sitemap disagreed.
 */
const staticPaths = ['/', '/contact', '/uses'];

export function loader() {
  const paths = [...staticPaths, ...projects.map(project => projectPath(project.slug))];

  const urls = paths
    .map(path => {
      const loc = new URL(path, config.url).href;

      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>monthly</changefreq>\n  </url>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
