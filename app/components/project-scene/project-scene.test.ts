import { describe, expect, it } from 'vitest';
import { hasDeviceModel, projects } from '~/data/projects';
import { projectModels } from '~/data/project-models';
import { sceneSlugs } from './project-scene';

describe('project previews', () => {
  // Before the 3D scenes, four of six home-page cards were flat text posters.
  // A new project should arrive with a device screenshot or a scene of its
  // own, not quietly fall back to the poster.
  it.each(projects.map(project => project.slug))('%s has a 3D preview', slug => {
    const hasDevice = hasDeviceModel(slug) && !!projectModels[slug];

    expect(hasDevice || sceneSlugs.includes(slug)).toBe(true);
  });

  it('never gives a project both a device and a scene', () => {
    for (const slug of sceneSlugs) {
      expect(projectModels[slug]).toBeUndefined();
    }
  });
});
