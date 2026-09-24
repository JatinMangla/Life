import { projects, projectPath } from '../app/data/projects';

/**
 * Every page the site serves, derived from the project data so a new case
 * study is covered by the accessibility suite without anyone remembering to
 * add it here. The hand-written list used to stop at the first four.
 */
export const pages = [
  { name: 'home', path: '/' },
  { name: 'contact', path: '/contact' },
  { name: 'tech stack', path: '/uses' },
  ...projects.map(project => ({
    name: `${project.shortTitle} case study`,
    path: projectPath(project.slug),
  })),
  { name: '404', path: '/this-page-does-not-exist' },
];
