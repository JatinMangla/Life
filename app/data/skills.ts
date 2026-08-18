/**
 * Single source for everything skill-shaped on the site: the rotating hero
 * disciplines, the /uses marquee, and the tech-stack table. These used to be
 * three separate hardcoded lists that drifted apart.
 */

export interface StackRow {
  readonly label: string;
  readonly items: string;
}

/** Cycled through the hero heading. Order matters — most defining first. */
export const disciplines = [
  'React.js',
  'TypeScript',
  'Redux',
  'SCSS',
  'Node.js',
  'GraphQL',
  'WebSockets',
] as const;

/** Scrolling badges on /uses. */
export const marqueeTags = [
  'React.js',
  'TypeScript',
  'Node.js',
  'GraphQL',
  'Redux',
  'MongoDB',
  'PostgreSQL',
  'Vite',
  'Express.js',
  'Firebase',
  'Tailwind CSS',
  'React Query',
  'Jest',
] as const;

/** The summary table at the bottom of /uses. */
export const stackSummary: readonly StackRow[] = [
  { label: 'Languages', items: 'JavaScript, TypeScript, HTML5, CSS3, SCSS' },
  { label: 'Frameworks', items: 'React.js, Redux, React Router, Express.js' },
  { label: 'Databases', items: 'MongoDB, PostgreSQL, Firebase' },
  { label: 'Build Tools', items: 'Vite, Webpack, Babel, ESLint, Prettier' },
  { label: 'APIs', items: 'GraphQL, REST, SignalR, WebSockets' },
  { label: 'Auth', items: 'Microsoft MSAL, Google OAuth, JWT' },
  { label: 'Testing', items: 'Jest, Storybook, SonarQube' },
  { label: 'Methodology', items: 'Agile/Scrum, Lean' },
] as const;
