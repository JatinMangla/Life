import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes, ReactNode, Ref } from 'react';
import { classes } from '~/utils/style';
import styles from './visually-hidden.module.css';

export interface VisuallyHiddenProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  className?: string;
  /** Reveal the content when it receives focus — used by the skip link. */
  showOnFocus?: boolean;
  as?: ElementType;
  children?: ReactNode;
  visible?: boolean;
}

export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({ className, showOnFocus, as = 'span', children, visible, ...rest }, ref) => {
    const Component = as as ElementType;

    return (
      <Component
        className={classes(styles.hidden, className)}
        data-hidden={!visible && !showOnFocus}
        data-show-on-focus={showOnFocus}
        ref={ref as Ref<never>}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

VisuallyHidden.displayName = 'VisuallyHidden';
