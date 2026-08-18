import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes, ReactNode, Ref } from 'react';
import { classes } from '~/utils/style';
import styles from './section.module.css';

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  as?: ElementType;
  children?: ReactNode;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ as = 'div', children, className, ...rest }, ref) => {
    const Component = as as ElementType;

    return (
      <Component
        className={classes(styles.section, className)}
        ref={ref as Ref<never>}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

Section.displayName = 'Section';
