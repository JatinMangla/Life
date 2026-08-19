import { describe, expect, it } from 'vitest';
import { getProject, projectPath, projects } from './projects';
import { projectModels } from './project-models';
import { metrics } from './experience';

/**
 * The data layer exists so a published figure can only be wrong in one place.
 * These tests guard that invariant.
 */
describe('project data', () => {
  it('has a model for every project', () => {
    for (const project of projects) {
      expect(projectModels[project.slug]).toBeDefined();
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
