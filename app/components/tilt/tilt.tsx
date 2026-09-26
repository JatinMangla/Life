import { useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import type { PointerEvent, ReactNode } from 'react';
import { classes } from '~/utils/style';
import styles from './tilt.module.css';

export interface TiltProps {
  children: ReactNode;
  /** Largest lean, in degrees, at the edges. */
  max?: number;
  className?: string;
}

/**
 * Leans its content toward the cursor in 3D, with a highlight that slides
 * across it like light on glass.
 *
 * CSS transforms only — no WebGL — so it's cheap enough for every screenshot
 * on a case study. The angles go straight to CSS variables rather than state,
 * so moving the pointer never re-renders the image. Touch and reduced motion
 * get the flat image.
 */
export function Tilt({ children, max = 10, className }: TiltProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = root.current;

    if (!element || reduceMotion || event.pointerType !== 'mouse') return;

    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    element.style.setProperty('--tiltX', `${(0.5 - y) * max}deg`);
    element.style.setProperty('--tiltY', `${(x - 0.5) * max}deg`);
    element.style.setProperty('--glareX', `${x * 100}%`);
    element.style.setProperty('--glareY', `${y * 100}%`);
    element.dataset.tilting = 'true';
  };

  const handleLeave = () => {
    const element = root.current;

    if (!element) return;

    element.style.setProperty('--tiltX', '0deg');
    element.style.setProperty('--tiltY', '0deg');
    delete element.dataset.tilting;
  };

  return (
    <div
      ref={root}
      className={classes(styles.tilt, className)}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <div className={styles.inner}>
        {children}
        <div aria-hidden className={styles.glare} />
      </div>
    </div>
  );
}
