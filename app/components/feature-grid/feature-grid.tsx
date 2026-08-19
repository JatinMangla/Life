import { classes, cssProps } from '~/utils/style';
import styles from './feature-grid.module.css';

export interface FeatureItem {
  title: string;
  detail: string;
}

export interface FeatureGridProps {
  items: readonly FeatureItem[];
  /** OKLCH hue for the accent rule above each item. */
  hue?: string;
  className?: string;
}

/**
 * A grid of short capability statements.
 *
 * Case studies that list a lot of features turn into a wall of prose. This
 * makes them scannable without inflating each one into its own section.
 */
export const FeatureGrid = ({ items, hue = '202.24', className }: FeatureGridProps) => (
  <ul className={classes(styles.grid, className)} style={cssProps({ hue })}>
    {items.map(item => (
      <li className={styles.item} key={item.title}>
        <span className={styles.rule} aria-hidden />
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.detail}>{item.detail}</p>
      </li>
    ))}
  </ul>
);
