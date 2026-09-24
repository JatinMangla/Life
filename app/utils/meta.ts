import config from '~/config.json';
import { projectOgImage, projectPath } from '~/data/projects';
import { canonicalUrlFor } from '~/utils/url';
import { caseStudySchema } from '~/utils/structured-data';

const { name, url } = config;
const defaultOgImage = `${url}/social-image.png`;
/**
 * Size of every image produced by scripts/og-images.cjs and
 * scripts/brand-assets.cjs, including the default social-image.png.
 */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

/**
 * Build the meta tag set for a route.
 *
 * `path` matters: without it every page advertises the site root as its
 * canonical social URL, so a shared project link previews as the homepage.
 */
export interface BaseMetaOptions {
  /**
   * Page-specific part of the title. My name is appended, so it survives
   * search-result truncation on the one part that identifies the page.
   */
  title: string;
  description: string;
  ogImage?: string;
  /** Describes the preview image; falls back to a generic site description. */
  ogImageAlt?: string;
  /** Pixel size of `ogImage`. Wrong values here make previews crop badly. */
  ogImageSize?: { width: number; height: number };
  /** Route path, so og:url points at this page rather than the site root. */
  path?: string;
  /** 'article' for case studies and posts; 'website' for everything else. */
  ogType?: 'website' | 'article';
}

export function baseMeta({
  title,
  description,
  ogImage = defaultOgImage,
  ogImageAlt,
  ogImageSize = OG_IMAGE_SIZE,
  path = '/',
  ogType = 'website',
}: BaseMetaOptions) {
  // "Projects | Mera Monitor — Employee Productivity Platform" put the
  // generic word first and pushed my name out of the result entirely.
  const titleText = title === name ? name : `${title} | ${name}`;
  const pageUrl = canonicalUrlFor(path);

  return [
    { title: titleText },
    { name: 'description', content: description },
    { name: 'author', content: name },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:alt', content: ogImageAlt ?? `${name} — ${config.role}` },
    { property: 'og:image:width', content: String(ogImageSize.width) },
    { property: 'og:image:height', content: String(ogImageSize.height) },
    { property: 'og:title', content: titleText },
    { property: 'og:site_name', content: name },
    { property: 'og:type', content: ogType },
    { property: 'og:url', content: pageUrl },
    { property: 'og:description', content: description },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:description', content: description },
    { name: 'twitter:title', content: titleText },
    { name: 'twitter:image', content: ogImage },
  ];
}

/** Title for a case-study page: short enough to survive in search results. */
export const projectMetaTitle = (shortTitle: string) => `${shortTitle} case study`;

interface ProjectMetaSource {
  readonly slug: string;
  readonly title: string;
  readonly shortTitle: string;
  readonly description: string;
  readonly stack: readonly string[];
  readonly updatedAt: string;
  readonly liveUrl?: string;
  readonly repoUrl?: string;
}

/**
 * The full meta set for a case study: its own URL and preview card, plus
 * CreativeWork structured data attributed to me.
 */
export function projectMeta(project: ProjectMetaSource) {
  const { slug, title, shortTitle, description } = project;
  const path = projectPath(slug);
  const ogImage = new URL(projectOgImage(slug), url).href;

  return [
    ...baseMeta({
      title: projectMetaTitle(shortTitle),
      description,
      path,
      ogImage,
      ogImageAlt: `${title} — case study`,
      ogType: 'article',
    }),
    { 'script:ld+json': caseStudySchema(project, canonicalUrlFor(path), ogImage) },
  ];
}
