import config from '~/config.json';
import type { IconName } from '~/components/icon';

export interface NavLink {
  label: string;
  /** Path, optionally with a hash for an in-page section. */
  pathname: string;
}

export interface SocialLink {
  label: string;
  url: string;
  icon: IconName;
}

export const navLinks: NavLink[] = [
  {
    label: 'Projects',
    pathname: '/#project-1',
  },
  {
    label: 'About',
    pathname: '/#details',
  },
  {
    label: 'Tech Stack',
    pathname: '/uses',
  },
  {
    label: 'Contact',
    pathname: '/contact',
  },
];

export const socialLinks: SocialLink[] = [
  {
    label: 'Linkedin',
    url: `https://www.linkedin.com/in/${config.linkedin}`,
    icon: 'linkedin',
  },
  {
    label: 'Github',
    url: `https://github.com/${config.github}`,
    icon: 'github',
  },
];
