import config from '~/config.json';

const { name, url } = config;
const defaultOgImage = `${url}/social-image.png`;

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
  /** Route path, so og:url points at this page rather than the site root. */
  path?: string;
}

export function baseMeta({
  title,
  description,
  prefix = name,
  ogImage = defaultOgImage,
  path = '/',
}: BaseMetaOptions) {
  const titleText = [prefix, title].filter(Boolean).join(' | ');
  const pageUrl = new URL(path, url).href;

  return [
    { title: titleText },
    { name: 'description', content: description },
    { name: 'author', content: name },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:alt', content: `${name} — ${config.role}` },
    { property: 'og:image:width', content: '1280' },
    { property: 'og:image:height', content: '800' },
    { property: 'og:title', content: titleText },
    { property: 'og:site_name', content: name },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: pageUrl },
    { property: 'og:description', content: description },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:description', content: description },
    { name: 'twitter:title', content: titleText },
    { name: 'twitter:image', content: ogImage },
  ];
}
