import { forwardRef } from 'react';
import type { SVGProps } from 'react';
import { classes } from '~/utils/style';
import type manifest from './manifest.json';
import sprites from './icons.svg';
import styles from './icon.module.css';

/**
 * Derived from manifest.json, so referencing an icon that isn't in the sprite
 * is a type error rather than a silently empty <svg> at runtime.
 */
export type IconName = keyof typeof manifest;

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  icon: IconName;
  size?: number;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ icon, className, size, ...rest }, ref) => (
    <svg
      aria-hidden
      ref={ref}
      className={classes(styles.icon, className)}
      width={size ?? 24}
      height={size ?? 24}
      {...rest}
    >
      <use href={`${sprites}#${icon}`} />
    </svg>
  )
);

Icon.displayName = 'Icon';
