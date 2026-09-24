import { describe, expect, it } from 'vitest';
import activity from './github-activity.json';
import { projects } from './projects';

describe('github activity snapshot', () => {
  it('never names the repository behind the anonymised case study', () => {
    // The MCP server write-up is deliberately anonymous; listing its repo here
    // would name the product it was built against.
    const names = activity.repos.map(repo => repo.name.toLowerCase());

    expect(names.some(name => name.includes('meramonitor'))).toBe(false);
    expect(JSON.stringify(activity).toLowerCase()).not.toContain('meramonitor');
  });

  it('only links case studies that exist', () => {
    const slugs = new Set<string>(projects.map(project => project.slug));

    for (const repo of activity.repos) {
      if (repo.caseStudy) expect(slugs.has(repo.caseStudy)).toBe(true);
    }
  });

  it('dates every commit', () => {
    for (const repo of activity.repos) {
      expect(repo.commit.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
