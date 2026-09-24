import { employer, metrics, yearsOfExperience } from './experience';

/**
 * The About section copy. Kept out of profile.tsx so the figures come from
 * `experience.ts` rather than being retyped into prose.
 */
export const bio: readonly string[] = [
  `I'm Jatin Mangla, a frontend developer with ${yearsOfExperience()}+ years of professional experience in React, TypeScript and modern web tooling. At ${employer.name} I build the web app for Mera Monitor, a workforce-analytics product used by ${metrics.activeUsers.value} people — dashboards, reports, state management with Redux and React Query, and Microsoft/Google single sign-on.`,

  `Outside work I build complete products end to end: an end-to-end-encrypted document vault with its own backup and monitoring stack, a remote MCP server that lets Claude query a workforce-analytics API over OAuth 2.1, an AI career copilot, and an offline-capable Vedic astrology engine. Each one is written up here with what went wrong as well as what worked.`,

  `I care about interfaces that are fast, accessible and still maintainable after I've moved on — which in practice means typed data, measured performance, and tests that check the thing that actually broke last time.`,
] as const;
