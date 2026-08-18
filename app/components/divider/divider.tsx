import type { CSSProperties, HTMLAttributes } from 'react';
import { classes, cssProps, numToMs } from '~/utils/style';
import styles from './divider.module.css';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  lineWidth?: string;
  lineHeight?: string;
  notchWidth?: string;
  notchHeight?: string;
  /** Delay before the collapse animation starts, in ms. */
  collapseDelay?: number;
  collapsed?: boolean;
  style?: CSSProperties;
}

export const Divider = ({
  lineWidth = '100%',
  lineHeight = '2px',
  notchWidth = '90px',
  notchHeight = '10px',
  collapseDelay = 0,
  collapsed = false,
  className,
  style,
  ...rest
}: DividerProps) => (
  <div
    className={classes(styles.divider, className)}
    style={cssProps(
      {
        lineWidth,
        lineHeight,
        notchWidth,
        notchHeight,
        collapseDelay: numToMs(collapseDelay),
      },
      style
    )}
    {...rest}
  >
    <div className={styles.line} data-collapsed={collapsed} />
    {/* The notch trails the line so the two don't collapse in lockstep. */}
    <div
      className={styles.notch}
      data-collapsed={collapsed}
      style={cssProps({ collapseDelay: numToMs(collapseDelay + 160) })}
    />
  </div>
);
