import { Button } from '~/components/button';
import { DecorativeBoundary } from '~/components/decorative-boundary';
import { canUseWebGL } from '~/utils/webgl';
import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { deviceModels } from '~/components/model/device-models';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { useTheme } from '~/components/theme-provider';
import { Transition } from '~/components/transition';
import { Loader } from '~/components/loader';
import { Suspense, lazy, useState } from 'react';
import type { Ref } from 'react';
import type { ProjectModel } from '~/data/projects';
import { ProjectPoster } from '~/components/project-poster';
import { cssProps, media } from '~/utils/style';
import { useHydrated } from '~/hooks/useHydrated';
import katakana from './katakana.svg';
import styles from './project-summary.module.css';

const Model = lazy(() =>
  import('~/components/model').then(module => ({ default: module.Model }))
);

export interface ProjectSummaryProps {
  id: string;
  /** Whether the section has scrolled into view. */
  visible?: boolean;
  sectionRef: Ref<HTMLElement>;
  /** 1-based position, rendered as the large index number. */
  index: number;
  title: string;
  description: string;
  /** Omit for projects with no honest screenshot; a poster is shown instead. */
  model?: ProjectModel;
  /** Rendered in the poster when there is no device model. */
  stack?: readonly string[];
  /** OKLCH hue for the poster's accent. */
  hue?: string;
  /** Small label above the poster title. */
  eyebrow?: string;
  buttonText: string;
  buttonLink: string;
  /** Mirror the layout, putting the preview on the left. */
  alternate?: boolean;
}

export function ProjectSummary({
  id,
  visible: sectionVisible,
  sectionRef,
  index,
  title,
  description,
  model,
  stack,
  hue,
  eyebrow,
  buttonText,
  buttonLink,
  alternate,
  ...rest
}: ProjectSummaryProps) {
  const [focused, setFocused] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  // No WebGL, or the model failed to download: show the poster instead of a
  // spinner that never resolves.
  const [modelFailed, setModelFailed] = useState(false);
  const { theme } = useTheme();
  const isHydrated = useHydrated();
  const titleId = `${id}-title`;
  const svgOpacity = theme === 'light' ? 0.7 : 1;
  const indexText = index < 10 ? `0${index}` : index;
  const phoneSizes = `(max-width: ${media.tablet}px) 30vw, 20vw`;
  const laptopSizes = `(max-width: ${media.tablet}px) 80vw, 40vw`;

  function handleModelLoad() {
    setModelLoaded(true);
  }

  function renderKatakana(device: string, visible: boolean) {
    return (
      <svg
        aria-hidden="true"
        data-visible={visible && modelLoaded}
        data-light={theme === 'light'}
        style={cssProps({ opacity: svgOpacity })}
        className={styles.svg}
        data-device={device}
        viewBox="0 0 751 136"
      >
        <use href={`${katakana}#katakana-project`} />
      </svg>
    );
  }

  function renderDetails(visible: boolean) {
    return (
      <div className={styles.details}>
        <div aria-hidden className={styles.index}>
          <Divider
            notchWidth="64px"
            notchHeight="8px"
            collapsed={!visible}
            collapseDelay={1000}
          />
          <span className={styles.indexNumber} data-visible={visible}>
            {indexText}
          </span>
        </div>
        {/* Shown on every card, not just posters: without it the work and
            personal projects were indistinguishable at a glance. */}
        {!!eyebrow && (
          <Text size="s" as="p" className={styles.kind} data-visible={visible}>
            {eyebrow}
          </Text>
        )}
        <Heading
          level={3}
          as="h2"
          className={styles.title}
          data-visible={visible}
          id={titleId}
        >
          {title}
        </Heading>
        <Text className={styles.description} data-visible={visible} as="p">
          {description}
        </Text>
        <div className={styles.button} data-visible={visible}>
          <Button iconHoverShift href={buttonLink} iconEnd="arrow-right">
            {buttonText}
          </Button>
        </div>
      </div>
    );
  }

  function renderPreview(visible: boolean) {
    // No device model means no honest product screenshot exists — the two
    // personal projects are auth-gated. Present them typographically instead.
    if (!model || modelFailed || (isHydrated && !canUseWebGL())) {
      return (
        <div className={styles.preview}>
          <div className={styles.posterWrapper}>
            <ProjectPoster
              title={title}
              stack={stack ?? []}
              hue={hue ?? '202.24'}
              visible={visible}
            />
          </div>
        </div>
      );
    }

    return (
      <div className={styles.preview}>
        {model.type === 'laptop' && (
          <>
            {renderKatakana('laptop', visible)}
            <div className={styles.model} data-device="laptop">
              {!modelLoaded && (
                <Loader center className={styles.loader} data-visible={visible} />
              )}
              {isHydrated && visible && (
                <DecorativeBoundary onError={() => setModelFailed(true)}>
                  <Suspense>
                    <Model
                      alt={model.alt}
                      cameraPosition={{ x: 0, y: 0, z: 8 }}
                      showDelay={700}
                      onLoad={handleModelLoad}
                      show={visible}
                      models={[
                        {
                          ...deviceModels.laptop,
                          texture: {
                            ...model.textures[0]!,
                            sizes: laptopSizes,
                          },
                        },
                      ]}
                    />
                  </Suspense>
                </DecorativeBoundary>
              )}
            </div>
          </>
        )}
        {model.type === 'phone' && (
          <>
            {renderKatakana('phone', visible)}
            <div className={styles.model} data-device="phone">
              {!modelLoaded && (
                <Loader center className={styles.loader} data-visible={visible} />
              )}
              {isHydrated && visible && (
                <DecorativeBoundary onError={() => setModelFailed(true)}>
                  <Suspense>
                    <Model
                      alt={model.alt}
                      cameraPosition={{ x: 0, y: 0, z: 11.5 }}
                      showDelay={300}
                      onLoad={handleModelLoad}
                      show={visible}
                      models={[
                        {
                          ...deviceModels.phone,
                          position: { x: -0.6, y: 1.1, z: 0 },
                          texture: {
                            ...model.textures[0]!,
                            sizes: phoneSizes,
                          },
                        },
                        {
                          ...deviceModels.phone,
                          position: { x: 0.6, y: -0.5, z: 0.3 },
                          texture: {
                            ...model.textures[1]!,
                            sizes: phoneSizes,
                          },
                        },
                      ]}
                    />
                  </Suspense>
                </DecorativeBoundary>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <Section
      className={styles.summary}
      data-alternate={alternate}
      data-first={index === 1}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      aria-labelledby={titleId}
      ref={sectionRef}
      id={id}
      tabIndex={-1}
      {...rest}
    >
      <div className={styles.content}>
        <Transition in={sectionVisible || focused}>
          {({ visible }) => (
            <>
              {/* DOM order is fixed and the alternate/mobile layouts are
                  expressed as grid placement in CSS. Swapping the order here
                  instead would remount the whole Three.js model every time the
                  breakpoint changed. */}
              {renderDetails(visible)}
              {renderPreview(visible)}
            </>
          )}
        </Transition>
      </div>
    </Section>
  );
}
