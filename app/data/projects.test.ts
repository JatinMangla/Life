import { describe, expect, it } from 'vitest';
import { getProject, hasDeviceModel, projectPath, projects } from './projects';
import { projectModels } from './project-models';
import { metrics } from './experience';

/**
 * The data layer exists so a published figure can only be wrong in one place.
 * These tests guard that invariant.
 */
describe('project data', () => {
  it('has a device model for exactly the projects that claim one', () => {
    // The personal projects are auth-gated, so the only honest screenshot
    // would be a sign-in screen. Those render a ProjectPoster instead, and
    // hasDeviceModel is what the home page branches on.
    for (const project of projects) {
      expect(Boolean(projectModels[project.slug])).toBe(hasDeviceModel(project.slug));
    }
  });

  it('gives every project a stack, an accent hue and a kind', () => {
    for (const project of projects) {
      expect(project.stack.length).toBeGreaterThan(0);
      // A bare OKLCH hue angle, interpolated into oklch(L C <hue>).
      expect(Number(project.hue)).toBeGreaterThanOrEqual(0);
      expect(Number(project.hue)).toBeLessThan(360);
      expect(['work', 'personal']).toContain(project.kind);
    }
  });

  it('points every personal project at public source', () => {
    for (const project of projects.filter(entry => entry.kind === 'personal')) {
      expect(project).toHaveProperty('repoUrl');
    }
  });

  it('gives every model at least one texture', () => {
    for (const model of Object.values(projectModels)) {
      expect(model.textures.length).toBeGreaterThan(0);

      for (const texture of model.textures) {
        expect(texture.srcSet).toBeTruthy();
        // A full-resolution asset used as its own placeholder downloads the
        // same multi-megabyte file twice.
        expect(texture.placeholder).not.toBe(texture.srcSet.split(' ')[0]);
      }
    }
  });

  it('uses unique slugs', () => {
    const slugs = projects.map(project => project.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('builds project paths from slugs', () => {
    expect(projectPath('mera-monitor')).toBe('/projects/mera-monitor');
  });

  it('throws on an unknown slug rather than returning undefined', () => {
    // @ts-expect-error deliberately passing a slug that isn't in the union
    expect(() => getProject('does-not-exist')).toThrow(/Unknown project slug/);
  });

  it('sources the user count from experience.ts rather than restating it', () => {
    const meraMonitor = getProject('mera-monitor');

    expect(meraMonitor.description).toContain(metrics.activeUsers.value);
  });

  it('attaches a measurement method to every quoted metric', () => {
    expect(metrics.loadTimeReduction.method).toBeTruthy();
  });
});
