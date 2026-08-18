import { employer, metrics } from './experience';

/**
 * The About section copy. Kept out of profile.jsx so the figures come from
 * `experience.ts` rather than being retyped into prose.
 */
export const bio: readonly string[] = [
  `I'm Jatin Mangla, a Frontend Developer with 4.5+ years of experience specializing in React.js, JavaScript and modern web tooling. At ${employer.name} I own the front-end architecture for SaaS products — driving component design, performance, and code quality for applications used by thousands of people.`,

  `I've worked on live products with ${metrics.activeUsers.value} active users, implementing Redux (Thunk/Saga) for state management, lazy loading and code splitting for performance, and integrating Microsoft MSAL and Google OAuth for secure SSO. I also contribute to Node.js/MongoDB backends to deliver full-stack features.`,

  `With experience across SCSS, Webpack, React Query, and real-time technologies like SignalR and WebSockets, I build responsive, accessible, SEO-friendly interfaces. I work in Agile/Scrum teams and care most about shipping things that stay maintainable after I've moved on.`,
] as const;
