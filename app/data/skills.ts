/**
 * Single source for everything skill-shaped on the site: the rotating hero
 * disciplines, the /uses marquee, and the tech-stack table. These used to be
 * three separate hardcoded lists that drifted apart.
 *
 * Every entry should be backed by something on the site — a project's stack
 * or a case study. GraphQL and WebSockets used to rotate through the hero
 * with nothing behind them, while Next.js, which two projects are built on,
 * appeared nowhere.
 */

export interface StackRow {
  readonly label: string;
  readonly items: string;
}

/** Cycled through the hero heading. Order matters — most defining first. */
export const disciplines = [
  'React.js',
  'TypeScript',
  'Next.js',
  'Redux',
  'Node.js',
  'LLM integration',
] as const;

/** Scrolling badges on /uses. */
export const marqueeTags = [
  'React.js',
  'TypeScript',
  'Next.js',
  'Remix',
  'Redux',
  'React Query',
  'Node.js',
  'Tailwind CSS',
  'Supabase',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'Gemini API',
  'MCP',
  'Vitest',
  'Playwright',
  'Vite',
] as const;

/** The summary table at the bottom of /uses. */
export const stackSummary: readonly StackRow[] = [
  { label: 'Languages', items: 'TypeScript, JavaScript, HTML5, CSS3, SCSS, SQL' },
  { label: 'Frameworks', items: 'React, Next.js, Remix, Redux, React Router, Express.js' },
  { label: 'Data', items: 'Supabase / PostgreSQL, MongoDB, Upstash Redis, IndexedDB (Dexie)' },
  { label: 'AI', items: 'Gemini API (schema-enforced JSON, streaming), Model Context Protocol' },
  { label: 'APIs', items: 'REST, SignalR, IMAP' },
  { label: 'Auth & Security', items: 'OAuth 2.1 / PKCE, Microsoft MSAL, Google OAuth, Auth.js, Web Crypto' },
  { label: 'Testing', items: 'Vitest, Playwright, Testing Library, axe-core, Jest' },
  { label: 'Infra & Tooling', items: 'Vercel, Oracle Cloud, Ansible, Docker Compose, Vite, Webpack, GitHub Actions' },
  { label: 'Methodology', items: 'Agile/Scrum' },
] as const;
