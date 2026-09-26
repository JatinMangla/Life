import { Button } from '~/components/button';
import { DecorativeBoundary } from '~/components/decorative-boundary';
import { Section } from '~/components/section';
import { useTheme } from '~/components/theme-provider';
import { VisuallyHidden } from '~/components/visually-hidden';
import { Link as RouterLink } from '@remix-run/react';
import { useReducedMotion } from 'framer-motion';
import { useInterval, useParallax, useScrollToHash } from '~/hooks';
import { Suspense, lazy, useRef, useState } from 'react';
import type { MouseEvent, Ref } from 'react';
import config from '~/config.json';
import { employer, metrics, yearsOfExperience } from '~/data/experience';
import { projects } from '~/data/projects';
import { disciplines } from '~/data/skills';
import { useHydrated } from '~/hooks/useHydrated';
import { canUseWebGL } from '~/utils/webgl';
import styles from './intro.module.css';

const HeroScene = lazy(() =>
  import('./hero-scene').then(module => ({ default: module.HeroScene }))
);

export interface IntroProps {
  id: string;
  sectionRef: Ref<HTMLElement>;
  /** Hide the scroll cue once the hero is out of view. */
  scrollIndicatorHidden?: boolean;
}

export function Intro({ id, sectionRef, scrollIndicatorHidden, ...rest }: IntroProps) {
  const { theme = 'dark' } = useTheme();
  const [disciplineIndex, setDisciplineIndex] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const introLabel = [disciplines.slice(0, -1).join(', '), disciplines.slice(-1)[0]].join(
    ', and '
  );
  const titleId = `${id}-title`;
  const scrollToHash = useScrollToHash();
  const isHydrated = useHydrated();
  const textRef = useRef<HTMLDivElement>(null);
  const [firstName, ...otherNames] = config.name.split(' ');
  const showScene = isHydrated && canUseWebGL();
  const reduceMotion = useReducedMotion();

  // The copy drifts down a little as the page scrolls, so it separates from
  // the 3D object rising behind it. useParallax is a no-op for reduced motion.
  useParallax(0.18, value => {
    textRef.current?.style.setProperty('--introDrift', `${value * 0.4}px`);
  });

  // Held on the first word for reduced motion: a word swapping every few
  // seconds is movement too.
  useInterval(
    () => {
      setDisciplineIndex(index => (index + 1) % disciplines.length);
    },
    reduceMotion ? null : 2800
  );

  const handleScrollClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    scrollToHash('#project-1');
  };

  const stats = [
    { value: `${yearsOfExperience()}+`, label: 'years building production React' },
    { value: metrics.activeUsers.value, label: metrics.activeUsers.label },
    { value: String(projects.length), label: 'projects written up in depth' },
  ];

  return (
    <Section
      className={styles.intro}
      as="section"
      ref={sectionRef}
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
      {...rest}
    >
      {/* A CSS orb holds the scene's place: it shows while three.js loads,
          and stays for visitors whose browser can't run WebGL. */}
      <div aria-hidden className={styles.orb} data-hidden={sceneReady} />
      {showScene && (
        <DecorativeBoundary>
          <Suspense>
            <HeroScene
              theme={theme}
              className={styles.scene}
              onReady={() => setSceneReady(true)}
            />
          </Suspense>
        </DecorativeBoundary>
      )}
      <header ref={textRef} className={styles.text}>
        <p className={styles.status}>
          <span aria-hidden className={styles.statusDot} />
          {employer.role} at {employer.shortName}
        </p>
        <h1 className={styles.name} id={titleId}>
          <span className={styles.nameLine}>{firstName}</span>
          <span className={styles.nameLine} data-accent>
            {otherNames.join(' ')}
          </span>
        </h1>
        <h2 className={styles.title}>
          <VisuallyHidden>{`${config.role} + ${introLabel}`}</VisuallyHidden>
          <span aria-hidden className={styles.titleRow}>
            {config.role} working in{' '}
            <span key={disciplineIndex} className={styles.word}>
              {disciplines[disciplineIndex]}
            </span>
          </span>
        </h2>
        <p className={styles.lede}>
          Data-heavy dashboards at {employer.shortName}; complete products, end to end, on my
          own time — each one written up with what went wrong as well as what worked.
        </p>
        <div className={styles.actions}>
          <Button href="/#project-1" iconEnd="arrow-right" iconHoverShift onClick={handleScrollClick}>
            See the work
          </Button>
          <Button secondary href="/contact" icon="send">
            Get in touch
          </Button>
        </div>
        <dl className={styles.stats}>
          {stats.map(stat => (
            <div key={stat.label} className={styles.stat}>
              <dt className={styles.statLabel}>{stat.label}</dt>
              <dd className={styles.statValue}>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </header>
      <RouterLink
        to="/#project-1"
        className={styles.scrollIndicator}
        data-hidden={scrollIndicatorHidden}
        onClick={handleScrollClick}
      >
        <VisuallyHidden>Scroll to projects</VisuallyHidden>
        <span aria-hidden className={styles.scrollLabel}>
          Scroll
        </span>
        <span aria-hidden className={styles.scrollTrack} />
      </RouterLink>
    </Section>
  );
}
