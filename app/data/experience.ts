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
  readonly role: string;
  readonly startedAt: string;
  readonly location: string;
}

export const employer: Employer = {
  name: 'AAPNA Infotech Pvt. Ltd',
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
