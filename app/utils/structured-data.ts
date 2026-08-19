import config from '~/config.json';
import { employer } from '~/data/experience';
import { disciplines } from '~/data/skills';

/**
 * JSON-LD describing who this site is about, so search engines and knowledge
 * panels can associate the domain with a person rather than guessing.
 */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: config.name,
    url: config.url,
    jobTitle: config.role,
    knowsAbout: [...disciplines],
    worksFor: {
      '@type': 'Organization',
      name: employer.name,
    },
    sameAs: [
      `https://github.com/${config.github}`,
      `https://www.linkedin.com/in/${config.linkedin}`,
    ],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${config.name} — ${config.role}`,
    url: config.url,
    author: { '@type': 'Person', name: config.name },
  };
}
