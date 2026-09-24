import { projects, projectPath } from '~/data/projects';
import { canonicalUrlFor } from '~/utils/url';

/**
 * Generated rather than hand-maintained. The previous static file listed a
 * project that no longer exists and pointed at a different origin than
 * `config.url`, so canonical tags and the sitemap disagreed.
 */
const staticPaths = ['/', '/contact', '/uses'];

/** Newest case-study change, standing in for pages that list them all. */
const latestUpdate = projects.map(project => project.updatedAt).sort().at(-1);

export function loader() {
  const entries = [
    ...staticPaths.map(path => ({ path, lastmod: path === '/' ? latestUpdate : undefined })),
    ...projects.map(project => ({
      path: projectPath(project.slug),
      lastmod: project.updatedAt,
    })),
  ];

  const urls = entries
    .map(({ path, lastmod }) =>
      [
        '  <url>',
        `    <loc>${canonicalUrlFor(path)}</loc>`,
        lastmod && `    <lastmod>${lastmod}</lastmod>`,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n')
    )
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
