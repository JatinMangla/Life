import { describe, expect, it } from 'vitest';
import { baseMeta, OG_IMAGE_SIZE } from './meta';
import config from '~/config.json';

interface MetaTag {
  title?: string;
  name?: string;
  property?: string;
  content?: string;
}

const find = (tags: MetaTag[], value: string) =>
  tags.find(tag => tag.property === value || tag.name === value)?.content;

describe('baseMeta', () => {
  const tags = baseMeta({
    title: 'Mera Monitor',
    description: 'A case study.',
    prefix: 'Projects',
    path: '/projects/mera-monitor',
  }) as MetaTag[];

  it('points og:url at the page, not the site root', () => {
    expect(find(tags, 'og:url')).toBe(
      `${config.url}/projects/mera-monitor`
    );
  });

  it('never emits a name/property tag with missing or "undefined" content', () => {
    // twitter:creator used to read a config key that does not exist, so every
    // page shipped <meta name="twitter:creator" content="undefined">.
    const broken = tags
      .filter(tag => tag.name ?? tag.property)
      .filter(tag => tag.content === undefined || tag.content === 'undefined');

    expect(broken).toEqual([]);
  });

  it('composes the title from the prefix and the page title', () => {
    expect(tags.find(tag => 'title' in tag)?.title).toBe('Projects | Mera Monitor');
  });

  it('declares the real pixel size of the preview image', () => {
    // These were hardcoded to 1280x800, which matched no image the site
    // has ever served; platforms use them to lay out the preview card.
    const projectTags = baseMeta({
      title: 'Mera Monitor',
      description: 'A case study.',
      ogImage: 'https://example.test/og/mera-monitor.png',
      ogImageSize: OG_IMAGE_SIZE,
    }) as MetaTag[];

    expect(find(projectTags, 'og:image:width')).toBe(String(OG_IMAGE_SIZE.width));
    expect(find(projectTags, 'og:image:height')).toBe(String(OG_IMAGE_SIZE.height));
  });

  it('lets a page override the preview image and its alt text', () => {
    const projectTags = baseMeta({
      title: 'Mera Monitor',
      description: 'A case study.',
      ogImage: 'https://example.test/og/mera-monitor.png',
      ogImageAlt: 'Mera Monitor — case study',
    }) as MetaTag[];

    expect(find(projectTags, 'og:image')).toBe('https://example.test/og/mera-monitor.png');
    expect(find(projectTags, 'og:image:alt')).toBe('Mera Monitor — case study');
  });

  it('defaults to the site root when no path is given', () => {
    const rootTags = baseMeta({ title: 'Contact', description: 'Say hello.' }) as MetaTag[];

    expect(find(rootTags, 'og:url')).toBe(`${config.url}/`);
  });
});
