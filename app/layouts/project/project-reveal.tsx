import { useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useInViewport, useParallax } from '~/hooks';
import { classes, cssProps, numToMs } from '~/utils/style';
import styles from './project-reveal.module.css';

export interface ProjectRevealProps {
  children: ReactNode;
  /** Stagger children by this many ms each. */
  stagger?: number;
  className?: string;
  /** Parallax depth multiplier for the inner content; 0 disables it. */
  depth?: number;
}

/**
 * Scroll-triggered entrance: content rises and fades in, staggered per child,
 * with optional parallax drift. CSS-only once the observer fires.
 *
 * The hidden starting state only applies once `html[data-js]` is set by the
 * inline script in root.tsx, so the server-rendered page is fully readable
 * without JavaScript, before hydration, and to crawlers.
 */
export function ProjectReveal({
  children,
  stagger = 120,
  className,
  depth = 0,
}: ProjectRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  // Any overlap counts, trimmed by 15% at the bottom so the entrance starts
  // once the section is actually on screen. A proportional threshold never
  // fires for a section several viewports tall, which on a landscape phone
  // is most of them.
  const inView = useInViewport(containerRef, true, {
    threshold: 0,
    rootMargin: '0px 0px -15% 0px',
  });
  const reduceMotion = useReducedMotion();

  useParallax(depth, value => {
    innerRef.current?.style.setProperty('--parallax', `${value * 0.04}px`);
  });

  return (
    <div
      ref={containerRef}
      className={classes(styles.reveal, className)}
      data-inview={inView}
      data-static={reduceMotion || undefined}
      style={cssProps({ revealStagger: numToMs(stagger) })}
    >
      <div ref={innerRef} className={styles.inner} data-parallax={depth !== 0 || undefined}>
        {children}
      </div>
    </div>
  );
}
