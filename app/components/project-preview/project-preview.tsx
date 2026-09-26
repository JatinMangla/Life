import { DecorativeBoundary } from '~/components/decorative-boundary';
import { Loader } from '~/components/loader';
import { deviceModels } from '~/components/model/device-models';
import { ProjectPoster } from '~/components/project-poster';
import type { ProjectModel, ProjectSlug } from '~/data/projects';
import { useInViewport } from '~/hooks';
import { useHydrated } from '~/hooks/useHydrated';
import { Suspense, lazy, useRef, useState } from 'react';
import { classes, cssProps, media } from '~/utils/style';
import { canUseWebGL } from '~/utils/webgl';
import styles from './project-preview.module.css';

const Model = lazy(() =>
  import('~/components/model').then(module => ({ default: module.Model }))
);

const ProjectScene = lazy(() =>
  import('~/components/project-scene').then(module => ({ default: module.ProjectScene }))
);

export interface ProjectPreviewProps {
  slug: ProjectSlug;
  /** Used by the poster fallback. */
  title: string;
  stack: readonly string[];
  /** OKLCH hue for the glow and the poster. */
  hue: string;
  /** A device with a real screenshot. Projects without one get their 3D scene. */
  model?: ProjectModel;
  /** Hovered or focused; the glow brightens and scenes can react. */
  active?: boolean;
  /** Load straight away rather than waiting to come near the viewport. */
  eager?: boolean;
  className?: string;
}

/**
 * A project's 3D preview: the device with its screenshot, or the project's
 * procedural scene, over a pool of its accent colour. Shared by the home-page
 * cards and the case-study headers so a project looks the same in both.
 *
 * Falls back to the typographic poster without WebGL or if the scene throws,
 * rather than leaving a spinner that never resolves.
 */
export function ProjectPreview({
  slug,
  title,
  stack,
  hue,
  model,
  active,
  eager,
  className,
}: ProjectPreviewProps) {
  const root = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const isHydrated = useHydrated();
  // Start loading a little before it arrives, and keep it once loaded.
  const nearViewport = useInViewport(root, true, { rootMargin: '300px 0px' });
  const showPoster = failed || (isHydrated && !canUseWebGL());
  const shouldLoad = isHydrated && (eager || nearViewport);

  const onError = () => setFailed(true);
  const onLoad = () => setLoaded(true);

  function renderContent() {
    if (showPoster) {
      return (
        <div className={styles.poster}>
          <ProjectPoster title={title} stack={stack} hue={hue} visible />
        </div>
      );
    }

    if (!shouldLoad) return null;

    if (!model) {
      return (
        <DecorativeBoundary onError={onError}>
          <Suspense>
            <ProjectScene slug={slug} active={active} className={styles.scene} onReady={onLoad} />
          </Suspense>
        </DecorativeBoundary>
      );
    }

    const isLaptop = model.type === 'laptop';
    const phoneSizes = `(max-width: ${media.tablet}px) 30vw, 20vw`;

    return (
      <div className={styles.model} data-device={model.type}>
        <DecorativeBoundary onError={onError}>
          <Suspense>
            <Model
              alt={model.alt}
              cameraPosition={isLaptop ? { x: 0, y: 0, z: 7.4 } : { x: 0, y: 0, z: 10.5 }}
              showDelay={isLaptop ? 300 : 150}
              onLoad={onLoad}
              show
              models={
                isLaptop
                  ? [
                      {
                        ...deviceModels.laptop,
                        texture: {
                          ...model.textures[0]!,
                          sizes: `(max-width: ${media.tablet}px) 90vw, 50vw`,
                        },
                      },
                    ]
                  : [
                      {
                        ...deviceModels.phone,
                        position: { x: -0.65, y: 0.9, z: 0 },
                        texture: { ...model.textures[0]!, sizes: phoneSizes },
                      },
                      {
                        ...deviceModels.phone,
                        position: { x: 0.65, y: -0.6, z: 0.3 },
                        texture: { ...model.textures[1]!, sizes: phoneSizes },
                      },
                    ]
              }
            />
          </Suspense>
        </DecorativeBoundary>
      </div>
    );
  }

  return (
    // Not aria-hidden as a whole: the device model labels its canvas with a
    // description of the screenshot. The 3D scenes hide themselves.
    <div
      ref={root}
      className={classes(styles.preview, className)}
      data-active={active}
      style={cssProps({ hue })}
    >
      <div aria-hidden className={styles.glow} />
      <div aria-hidden className={styles.grid} />
      {!showPoster && !loaded && isHydrated && <Loader center className={styles.loader} />}
      {renderContent()}
    </div>
  );
}
