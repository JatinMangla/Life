import { Text } from '~/components/text';
import { useReducedMotion } from 'framer-motion';
import { classes, cssProps } from '~/utils/style';
import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import styles from './loader.module.css';

export interface LoaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  className?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
  /** Announced text, and the entire output when reduced motion is preferred. */
  text?: string;
  center?: boolean;
  /** Convenience alias that sets both width and height. */
  size?: number;
}

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  (
    { className, style, width = 32, height = 4, size, text = 'Loading...', center, ...rest },
    ref
  ) => {
    const reduceMotion = useReducedMotion();

    if (reduceMotion) {
      return (
        <Text className={classes(styles.text, className)} weight="medium" {...rest}>
          {text}
        </Text>
      );
    }

    return (
      <div
        ref={ref}
        className={classes(styles.loader, className)}
        data-center={center}
        style={cssProps({ width: size ?? width, height }, style)}
        {...rest}
      >
        <div className={styles.span} />
      </div>
    );
  }
);

Loader.displayName = 'Loader';
