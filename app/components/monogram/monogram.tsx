import { forwardRef, useId } from 'react';
import type { SVGProps } from 'react';
import { classes } from '~/utils/style';
import styles from './monogram.module.css';

/**
 * "JM", drawn on a 48x29 grid: a hooked J beside an M whose middle V dips to
 * the centre line. Shared with scripts/brand-assets.cjs, which renders the
 * favicon, PWA icons and social card from the same outline.
 */
export const MONOGRAM_PATH =
  'M8 0h6v20a9 9 0 0 1-9 9H0v-6h5a3 3 0 0 0 3-3ZM18 29V0h6l9 13 9-13h6v29h-6V11l-9 13-9-13v18Z';

export interface MonogramProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** Draw the accent overlay, used on navbar hover. */
  highlight?: boolean;
}

export const Monogram = forwardRef<SVGSVGElement, MonogramProps>(
  ({ highlight, className, ...props }, ref) => {
    // useId keeps the clipPath id unique if the mark is rendered more than once.
    const id = useId();
    const clipId = `${id}monogram-clip`;

    return (
      <svg
        aria-hidden
        className={classes(styles.monogram, className)}
        width="48"
        height="29"
        viewBox="0 0 48 29"
        ref={ref}
        {...props}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={MONOGRAM_PATH} />
          </clipPath>
        </defs>
        <rect clipPath={`url(#${clipId})`} width="100%" height="100%" />
        {highlight && (
          <g clipPath={`url(#${clipId})`}>
            <rect className={styles.highlight} width="100%" height="100%" />
          </g>
        )}
      </svg>
    );
  }
);

Monogram.displayName = 'Monogram';
