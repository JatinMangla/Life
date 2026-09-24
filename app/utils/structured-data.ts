import config from '~/config.json';
import profileImage from '~/assets/profile.jpeg';
import { employer } from '~/data/experience';
import { disciplines } from '~/data/skills';
import { canonicalUrlFor } from '~/utils/url';

/**
 * JSON-LD describing who this site is about, so search engines and knowledge
 * panels can associate the domain with a person rather than guessing.
 */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${canonicalUrlFor('/')}#person`,
    name: config.name,
    url: canonicalUrlFor('/'),
    image: new URL(profileImage, config.url).href,
    email: `mailto:${config.email}`,
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
    url: canonicalUrlFor('/'),
    author: { '@id': `${canonicalUrlFor('/')}#person` },
  };
}

interface CaseStudySource {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly stack: readonly string[];
  readonly updatedAt: string;
  readonly liveUrl?: string;
  readonly repoUrl?: string;
}

/** A case study as a CreativeWork, attributed to the Person above. */
export function caseStudySchema(project: CaseStudySource, pageUrl: string, image: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    headline: project.title,
    description: project.description,
    url: pageUrl,
    image,
    dateModified: project.updatedAt,
    keywords: project.stack.join(', '),
    author: { '@id': `${canonicalUrlFor('/')}#person` },
    ...((project.repoUrl ?? project.liveUrl) && {
      sameAs: [project.liveUrl, project.repoUrl].filter(Boolean),
    }),
  };
}
