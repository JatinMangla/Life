/**
 * Facts about my experience that appear in more than one place on the site.
 *
 * These live here so a figure can only ever be wrong once. Anything quoted in
 * the bio, a case study or a meta description should come from this module
 * rather than being retyped into JSX — that drift is exactly how the site and
 * my CV ended up disagreeing with each other.
 */

export interface Employer {
  readonly name: string;
  /** For tight spaces like project-card labels. */
  readonly shortName: string;
  readonly role: string;
  readonly startedAt: string;
  readonly location: string;
}

export const employer: Employer = {
  name: 'AAPNA Infotech Pvt. Ltd',
  shortName: 'AAPNA Infotech',
  role: 'Frontend Web Developer',
  startedAt: '2022-01',
  location: 'Delhi, India',
};

/** Whole years since `startedAt`, rounded down. */
export function yearsOfExperience(now: Date = new Date()): number {
  const [year, month] = employer.startedAt.split('-').map(Number) as [number, number];
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);

  return Math.floor(months / 12);
}

/**
 * Headline numbers. Every one of these needs to survive the question
 * "how did you measure that?", so keep the measurement note attached.
 */
export const metrics = {
  activeUsers: {
    value: '10,500+',
    label: 'active users on Mera Monitor',
  },
  loadTimeReduction: {
    value: '40%',
    label: 'reduction in initial load time',
    method: 'Lighthouse, throttled 4G profile, measured before and after',
  },
} as const;

export interface TimelineEntry {
  readonly organisation: string;
  readonly role: string;
  /** `YYYY-MM`. */
  readonly startedAt: string;
  /** `YYYY-MM`, or absent while ongoing. */
  readonly endedAt?: string;
  readonly location?: string;
  readonly highlights: readonly string[];
}

/** The Experience section on the home page, most recent first. */
export const timeline: readonly TimelineEntry[] = [
  {
    organisation: 'Independent projects',
    role: 'Design, build and operate',
    startedAt: '2026-07',
    highlights: [
      'An end-to-end-encrypted document vault with its own backup, restore-drill and health-monitoring stack, run for $0 a year on free tiers.',
      'A remote MCP server that exposes a workforce-analytics API to Claude, with its own OAuth 2.1 authorization server, ported to serverless on Vercel.',
      'An AI career copilot and an offline-capable Vedic astrology engine, both Next.js and TypeScript, both live on Vercel.',
    ],
  },
  {
    organisation: employer.name,
    role: employer.role,
    startedAt: employer.startedAt,
    location: employer.location,
    highlights: [
      `Frontend for Mera Monitor, a workforce-analytics SaaS used by ${metrics.activeUsers.value} people: data-heavy dashboards and reports, Redux and React Query state, Microsoft and Google single sign-on.`,
      `Cut initial load time by ${metrics.loadTimeReduction.value} with route-level code splitting and lazy-loaded chart libraries (${metrics.loadTimeReduction.method}).`,
      'Frontend and Node.js/MongoDB APIs for Screen Coach, a parental screen-time app.',
    ],
  },
];

/** "Jan 2022", or "Present" for an open end date. */
export function formatMonth(value: string | undefined): string {
  if (!value) return 'Present';

  const [year, month] = value.split('-').map(Number) as [number, number];

  return new Date(Date.UTC(year, month - 1)).toLocaleString('en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
