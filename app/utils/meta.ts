import config from '~/config.json';

const { name, url } = config;
const defaultOgImage = `${url}/social-image.png`;
// Actual pixel size of social-image.png. These were declared as 1280x800,
// which did not match any image the site has ever served.
const defaultOgImageSize = { width: 1200, height: 675 };
/** Size of every image produced by scripts/og-images.cjs. */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

/**
 * Build the meta tag set for a route.
 *
 * `path` matters: without it every page advertises the site root as its
 * canonical social URL, so a shared project link previews as the homepage.
 */
export interface BaseMetaOptions {
  /** Page-specific part of the title. */
  title: string;
  description: string;
  /** Leading segment of the title; defaults to my name. */
  prefix?: string;
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
  prefix = name,
  ogImage = defaultOgImage,
  ogImageAlt,
  ogImageSize = defaultOgImageSize,
  path = '/',
  ogType = 'website',
}: BaseMetaOptions) {
  const titleText = [prefix, title].filter(Boolean).join(' | ');
  const pageUrl = new URL(path, url).href;

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
