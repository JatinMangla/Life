import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import { classes } from '~/utils/style';
import styles from './heading.module.css';

/** 0 is the display size; 1-5 map to h1-h5. */
export type HeadingLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type HeadingAlign = 'auto' | 'start' | 'center' | 'end';
export type HeadingWeight = 'auto' | 'regular' | 'medium' | 'bold';

export type HeadingProps<T extends ElementType = 'h1'> = {
  /**
   * Override the rendered tag. `level` drives the *visual* size, so use this
   * when the size you want and the document outline disagree.
   */
  as?: T;
  children?: ReactNode;
  level?: HeadingLevel;
  align?: HeadingAlign;
  weight?: HeadingWeight;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export const Heading = <T extends ElementType = 'h1'>({
  children,
  level = 1,
  as,
  align = 'auto',
  weight = 'medium',
  className,
  ...rest
}: HeadingProps<T>) => {
  const clampedLevel = Math.min(Math.max(level, 0), 5);
  const Component = (as ?? `h${Math.max(clampedLevel, 1)}`) as ElementType;

  return (
    <Component
      className={classes(styles.heading, className)}
      data-align={align}
      data-weight={weight}
      data-level={clampedLevel}
      {...rest}
    >
      {children}
    </Component>
  );
};
