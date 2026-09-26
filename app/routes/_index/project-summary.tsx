import { Button } from '~/components/button';
import { DecorativeBoundary } from '~/components/decorative-boundary';
import { canUseWebGL } from '~/utils/webgl';
import { deviceModels } from '~/components/model/device-models';
import { Section } from '~/components/section';
import { Loader } from '~/components/loader';
import { ProjectReveal } from '~/layouts/project/project-reveal';
import { Suspense, lazy, useRef, useState } from 'react';
import type { PointerEvent, Ref } from 'react';
import type { ProjectModel, ProjectSlug } from '~/data/projects';
import { ProjectPoster } from '~/components/project-poster';
import { cssProps, media } from '~/utils/style';
import { useHydrated } from '~/hooks/useHydrated';
import { useInViewport } from '~/hooks';
import styles from './project-summary.module.css';

const Model = lazy(() =>
  import('~/components/model').then(module => ({ default: module.Model }))
);

const ProjectScene = lazy(() =>
  import('~/components/project-scene').then(module => ({ default: module.ProjectScene }))
);

export interface ProjectSummaryProps {
  id: string;
  sectionRef: Ref<HTMLElement>;
  slug: ProjectSlug;
  /** 1-based position, rendered as the index number. */
  index: number;
  /** How many projects there are, for the "01 / 06" counter. */
  total: number;
  title: string;
  description: string;
  /** A device with a real screenshot. Projects without one get a 3D scene. */
  model?: ProjectModel;
  stack: readonly string[];
  /** OKLCH hue for the card's glow and the poster fallback. */
  hue: string;
  /** Small label above the title. */
  eyebrow: string;
  buttonText: string;
  buttonLink: string;
  /** Mirror the layout, putting the preview on the left. */
  alternate?: boolean;
}

export function ProjectSummary({
  id,
  sectionRef,
  slug,
  index,
  total,
  title,
  description,
  model,
  stack,
  hue,
  eyebrow,
  buttonText,
  buttonLink,
  alternate,
}: ProjectSummaryProps) {
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  // No WebGL, or the scene failed: show the poster instead of a spinner that
  // never resolves.
  const [previewFailed, setPreviewFailed] = useState(false);
  const isHydrated = useHydrated();
  // Start loading a little before the card arrives, and keep it once loaded.
  const nearViewport = useInViewport(stage, true, { rootMargin: '300px 0px' });
  const titleId = `${id}-title`;
  const pad = (value: number) => String(value).padStart(2, '0');
  const showPoster = previewFailed || (isHydrated && !canUseWebGL());

  // Written straight to CSS variables: a state update per pointer move would
  // re-render the card, and the WebGL scene inside it, at 60+ Hz.
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();

    event.currentTarget.style.setProperty('--spotX', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--spotY', `${event.clientY - bounds.top}px`);
  };

  function renderPreview() {
    if (showPoster) {
      return (
        <div className={styles.poster}>
          <ProjectPoster title={title} stack={stack} hue={hue} visible />
        </div>
      );
    }

    if (!isHydrated || !nearViewport) return null;

    const onError = () => setPreviewFailed(true);
    const onLoad = () => setPreviewLoaded(true);

    if (!model) {
      return (
        <DecorativeBoundary onError={onError}>
          <Suspense>
            <ProjectScene
              slug={slug}
              active={active}
              className={styles.scene}
              onReady={onLoad}
            />
          </Suspense>
        </DecorativeBoundary>
      );
    }

    const isLaptop = model.type === 'laptop';

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
                        texture: {
                          ...model.textures[0]!,
                          sizes: `(max-width: ${media.tablet}px) 30vw, 20vw`,
                        },
                      },
                      {
                        ...deviceModels.phone,
                        position: { x: 0.65, y: -0.6, z: 0.3 },
                        texture: {
                          ...model.textures[1]!,
                          sizes: `(max-width: ${media.tablet}px) 30vw, 20vw`,
                        },
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
    <Section
      className={styles.summary}
      as="section"
      aria-labelledby={titleId}
      ref={sectionRef}
      id={id}
      tabIndex={-1}
    >
      <ProjectReveal stagger={0}>
        <article
          className={styles.card}
          data-alternate={alternate}
          data-active={active}
          style={cssProps({ hue })}
          onPointerMove={handlePointerMove}
          onPointerEnter={() => setActive(true)}
          onPointerLeave={() => setActive(false)}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
        >
          <div className={styles.details}>
            <p className={styles.meta}>
              <span className={styles.index}>
                {pad(index)}
                <span className={styles.total}> / {pad(total)}</span>
              </span>
              <span className={styles.kind}>{eyebrow}</span>
            </p>
            <h2 className={styles.title} id={titleId}>
              {title}
            </h2>
            <p className={styles.description}>{description}</p>
            <ul className={styles.stack} aria-label="Built with">
              {stack.slice(0, 5).map(item => (
                <li key={item} className={styles.chip}>
                  {item}
                </li>
              ))}
              {stack.length > 5 && (
                <li className={styles.chip} data-more>
                  +{stack.length - 5} more
                </li>
              )}
            </ul>
            <Button iconHoverShift href={buttonLink} iconEnd="arrow-right" className={styles.button}>
              {buttonText}
            </Button>
          </div>
          {/* Not aria-hidden as a whole: the device model labels its canvas
              with a description of the screenshot. The 3D scenes hide
              themselves. */}
          <div ref={stage} className={styles.stage}>
            <div aria-hidden className={styles.glow} />
            <div aria-hidden className={styles.grid} />
            {!showPoster && !previewLoaded && isHydrated && (
              <Loader center className={styles.loader} />
            )}
            {renderPreview()}
          </div>
        </article>
      </ProjectReveal>
    </Section>
  );
}
