import { useReducedMotion } from 'framer-motion';
import { classes, cssProps } from '~/utils/style';
import styles from './project-poster.module.css';

export interface ProjectPosterProps {
  /** Short project name, set in the display face. */
  title: string;
  /** Technologies rendered as chips beneath the title. */
  stack: readonly string[];
  /** OKLCH hue for this project's accent. */
  hue: string;
  /** Drives the reveal, matching the surrounding section. */
  visible?: boolean;
  /** Small label in the corner, e.g. "Personal project". */
  eyebrow?: string;
  className?: string;
}

/**
 * Stands in for a device screenshot on projects that have none.
 *
 * Both personal projects are auth-gated, so the only honest screenshot is a
 * sign-in screen. Rather than fake a product shot, this presents the project
 * typographically — the name, its stack, and an accent drawn from the app's
 * own palette.
 */
export const ProjectPoster = ({
  title,
  stack,
  hue,
  visible,
  eyebrow,
  className,
}: ProjectPosterProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={classes(styles.poster, className)}
      data-visible={visible}
      data-static={reduceMotion || undefined}
      style={cssProps({ hue })}
    >
      <div className={styles.aurora} aria-hidden />
      <div className={styles.grid} aria-hidden />

      <div className={styles.content}>
        {!!eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <span className={styles.title}>{title}</span>
        <ul className={styles.stack}>
          {stack.map((item, index) => (
            <li
              className={styles.chip}
              key={item}
              style={cssProps({ delay: 120 + index * 60 })}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
