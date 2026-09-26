import type { ComponentType } from 'react';
import { SceneCanvas } from '~/components/scene';
import type { ProjectSlug } from '~/data/projects';
import { AstrolabeScene } from './astrolabe-scene';
import { CareerScene } from './career-scene';
import { NetworkScene } from './network-scene';
import type { SceneProps } from './types';
import { VaultScene } from './vault-scene';

/**
 * The procedural 3D scene for each project that has no honest product
 * screenshot to put on a device. Each one is a metaphor for what the project
 * does, not a picture of its UI, so nothing here claims to show the product.
 */
const scenes: Partial<Record<ProjectSlug, ComponentType<SceneProps>>> = {
  'personal-vault': VaultScene,
  'analytics-mcp-server': NetworkScene,
  'careerpilot-ai': CareerScene,
  'kundli-predict': AstrolabeScene,
};

/** Projects with a scene; the test checks every project has a 3D preview. */
export const sceneSlugs = Object.keys(scenes) as ProjectSlug[];

export interface ProjectSceneProps extends SceneProps {
  slug: ProjectSlug;
  className?: string;
  onReady?: () => void;
}

export function ProjectScene({ slug, active, className, onReady }: ProjectSceneProps) {
  const Scene = scenes[slug];

  if (!Scene) return null;

  return (
    <SceneCanvas className={className} camera={{ position: [0, 0, 6.2], fov: 36 }} onReady={onReady}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <directionalLight position={[-4, -2, 2]} intensity={0.4} color="#8fb6ff" />
      <Scene active={active} />
    </SceneCanvas>
  );
}
