import { useReducedMotion } from 'framer-motion';
import { classes, cssProps } from '~/utils/style';
import styles from './project-atmosphere.module.css';

export interface ProjectAtmosphereProps {
  /** OKLCH hue for this project, from app/data/projects.ts. */
  hue: string;
  className?: string;
}

/**
 * Accent-tinted backdrop for a case study.
 *
 * Replaces the full-bleed screenshot the pages used to sit on: a busy UI
 * screenshot behind body copy fights the text no matter how much scrim is
 * layered over it, and costs a large image download to do so. This is CSS
 * only, tints per project, and stays out of the way of what it sits behind.
 */
export const ProjectAtmosphere = ({ hue, className }: ProjectAtmosphereProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={classes(styles.atmosphere, className)}
      data-static={reduceMotion || undefined}
      style={cssProps({ hue })}
      aria-hidden
    >
      <div className={styles.glow} />
      <div className={styles.grid} />
    </div>
  );
};
